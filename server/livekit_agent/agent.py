import logging
import warnings
import json
import re
from typing import Any
from dotenv import load_dotenv
from livekit import agents, rtc
from livekit.agents import Agent, AgentServer, AgentSession, room_io, function_tool, RunContext
from livekit.agents.llm import ChatContext, ChatMessage
from livekit.plugins import deepgram, groq, silero

# Suppress Pydantic warnings from LiveKit library
warnings.filterwarnings("ignore", message=".*has conflict with protected namespace.*")

load_dotenv()

logger = logging.getLogger("nora-ev-agent")
logger.setLevel(logging.INFO)


class NoRaAssistant(Agent):
    """NoRa EV Voice AI Customer Support Assistant"""

    def __init__(self, initial_language: str = "urdu") -> None:
        self.user_language = initial_language if initial_language in ("urdu", "english") else "urdu"
        self.greeting_sent = False
        self._base_instructions = """You are a friendly and helpful customer support agent for NoRa EV, Pakistan's first battery-swappable electric car company.

You must always speak in {language} only. Never mix languages mid-conversation.

Workflow (follow exactly in order and never repeat a finished step):
1. Ask for the customer's NAME. Once provided, acknowledge it and move on.
2. Ask for their PHONE NUMBER. Accept common Pakistani variations (03XXXXXXXXX, 92XXXXXXXXXX, etc.) but convert it to +92 XXX XXXXXXX format in your response. If the number is invalid, explain the format and politely ask again.
3. Ask for their QUESTION about NoRa EV and paraphrase the question back to confirm understanding.

CRITICAL: After collecting all three pieces of information (name, phone, query):
- YOU MUST call the submit_customer_info function with the three values
- DO NOT just acknowledge - you MUST call the function tool
- The function will handle disconnecting and sending the data
- Do NOT say goodbye yourself - the function will do that

Rules:
- Keep replies concise, warm, and conversational.
- After each answer, confirm what you heard and then guide them to the next step.
- Never re-ask for information that was already confirmed unless the user corrects it.

Example Urdu prompts:
- "Assalam o alaikum! Aap ka naam kya hai?"
- "Shukriya {{name}}! Aap ka phone number +92 format mein batayein."
- "Bahut acha! Aap NoRa EV ke bare mein kya jan-na chahte hain?"

Example English prompts:
- "Hello! What's your name?"
- "Thanks {{name}}! Please share your phone number in +92 format."
- "Great! How can I help you with NoRa EV today?"
"""

        super().__init__(instructions=self._build_instructions())

    def _build_instructions(self) -> str:
        language_label = "Urdu" if self.user_language == "urdu" else "English"
        return self._base_instructions.format(language=language_label)

    def update_language(self, language: str | None):
        if not language:
            return
        normalized = language.lower()
        if normalized not in ("urdu", "english"):
            return
        if normalized == self.user_language:
            return
        self.user_language = normalized
        # Refresh instructions so the LLM sticks to the selected language
        self.instructions = self._build_instructions()

    def _format_phone_number(self, raw: str) -> str:
        """Normalize Pakistani phone numbers to +92 XXX XXXXXXX."""
        if not raw:
            return raw
        digits = re.sub(r"\D", "", raw)
        if not digits:
            return raw

        if digits.startswith("00"):
            digits = digits[2:]
        local = None
        if digits.startswith("0") and len(digits) == 11:
            local = digits[1:]
        elif digits.startswith("92") and len(digits) == 12:
            local = digits[2:]
        elif digits.startswith("3") and len(digits) == 10:
            local = digits
        elif digits.startswith("92") and len(digits) == 13:
            local = digits[2:]

        if local and len(local) == 10:
            return f"+92 {local[:3]} {local[3:6]}{local[6:]}"

        # fallback to original digits with leading +
        normalized = digits if digits.startswith("92") else f"92{digits}"
        return "+" + normalized

    async def on_enter(self):
        """Called when the agent enters the session - wait briefly for language preference then greet"""
        import asyncio

        logger.info("Agent entered session...")

        # Listen for readiness + language preference from frontend
        room = getattr(self.session, "room", None)
        if room is None:
            room_io = getattr(self.session, "room_io", None)
            room = getattr(room_io, "room", None) if room_io else None

        if room:
            language_received = asyncio.Event()
            client_ready = asyncio.Event()

            loop = asyncio.get_running_loop()

            async def handle_data_packet(data: rtc.DataPacket):
                try:
                    message = json.loads(data.data.decode("utf-8"))
                    msg_type = message.get("type")

                    if msg_type == "language_preference":
                        lang = message.get("language", "urdu")
                        self.update_language(lang)
                        logger.info(f"Language preference received: {lang}")
                        language_received.set()
                        client_ready.set()
                    elif msg_type == "client_ready":
                        lang = message.get("language")
                        if lang:
                            self.update_language(lang)
                            logger.info(f"Language preference received via client_ready: {lang}")
                            language_received.set()
                        client_ready.set()
                        logger.info("Client ready signal received")
                except Exception as e:
                    logger.error(f"Error handling data message: {e}")

            @room.on("data_received")
            def on_data_received(data: rtc.DataPacket):
                loop.create_task(handle_data_packet(data))

            # Wait for readiness signal (fallback to timeout so agent still greets)
            try:
                await asyncio.wait_for(client_ready.wait(), timeout=5.0)
            except asyncio.TimeoutError:
                logger.info("No client ready signal received, proceeding with greeting")

            if not language_received.is_set():
                logger.info("No language preference received, using default Urdu")

            # Send greeting in the selected language
            if self.user_language == "urdu":
                logger.info("Sending Urdu greeting")
                await self.session.say("Assalam o alaikum! Main NoRa EV ki support assistant hoon. Aap ka naam kya hai?")
            else:
                logger.info("Sending English greeting")
                await self.session.say("Hello! I'm NoRa EV's customer support. What's your name?")

            self.greeting_sent = True
        else:
            logger.warning("No room instance available to send greeting")

    @function_tool()
    async def submit_customer_info(
        self,
        context: RunContext,
        name: str,
        phone: str,
        query: str
    ) -> dict[str, Any]:
        """Submit the collected customer information when all three pieces have been gathered.

        Args:
            name: Customer's full name
            phone: Customer's phone number in +92 format
            query: Customer's question or query about NoRa EV
        """
        phone_formatted = self._format_phone_number(phone)
        logger.info(f"FUNCTION CALLED! Submitting customer info: {name}, {phone_formatted}, {query}")

        # Send data to frontend via data channel
        room = self.session.room
        if room:
            data = {
                "type": "conversation_complete",
                "data": {
                    "name": name,
                    "phone": phone_formatted,
                    "query": query
                }
            }

            # Send to all participants
            await room.local_participant.publish_data(
                json.dumps(data).encode("utf-8"),
                reliable=True
            )

            logger.info("Data sent to frontend successfully")

            # Say goodbye before disconnecting
            if self.user_language == "urdu":
                await self.session.say("Shukriya! Humari team jald hi aap se rabta karegi. Allah Hafiz!")
            else:
                await self.session.say("Thank you! Our team will contact you shortly. Goodbye!")

            logger.info("Goodbye message sent, disconnecting session...")

            # Disconnect the session after sending goodbye
            import asyncio
            await asyncio.sleep(2)  # Give time for goodbye message to play
            await room.disconnect()
            logger.info("Session disconnected successfully")

        return {"status": "success", "message": "Data submitted successfully"}


server = AgentServer()


@server.rtc_session(agent_name="nora-ev-agent")
async def nora_agent(ctx: agents.JobContext):
    """Main agent session handler"""

    logger.info(f"🎤 NEW SESSION STARTED! Room: {ctx.room.name}, Job ID: {ctx.job.id}")
    logger.info("Starting NoRa EV voice agent...")

    preferred_language = "urdu"
    if ctx.room:
        # check metadata hint
        if ctx.room.metadata:
            try:
                metadata = json.loads(ctx.room.metadata)
                lang = metadata.get("language")
                if lang and lang.lower() in ("urdu", "english"):
                    preferred_language = lang.lower()
            except Exception:
                logger.warning("Failed to parse room metadata for language")

        # fallback: infer from room name suffix (nora-ev-support-<code>-uuid)
        if preferred_language == "urdu" and ctx.room.name:
            parts = ctx.room.name.split("-")
            if len(parts) >= 4:
                lang_code = parts[3]
                if lang_code == "en":
                    preferred_language = "english"
                elif lang_code == "ur":
                    preferred_language = "urdu"

    # Create session with 100% FREE setup
    session = AgentSession(
        stt=deepgram.STT(),  # Deepgram STT (FREE $200 credit)
        llm=groq.LLM(model="llama-3.3-70b-versatile"),  # Groq LLM (FREE, super fast)
        tts=deepgram.TTS(
            model="aura-asteria-en",  # Original Aura model (better streaming than Aura-2)
            encoding="linear16",
            sample_rate=24000
        ),  # Deepgram Aura TTS (FREE with credit)
        vad=silero.VAD.load(),  # Voice activity detection
    )

    # Start the session
    logger.info(f"Preferred language for this session: {preferred_language}")

    await session.start(
        room=ctx.room,
        agent=NoRaAssistant(initial_language=preferred_language),
    )

    logger.info("Agent session started successfully")


if __name__ == "__main__":
    agents.cli.run_app(server)
