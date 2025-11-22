import asyncio
import logging
from typing import Annotated
from livekit import agents, rtc
from livekit.agents import JobContext, WorkerOptions, cli, tokenize, tts
from livekit.agents.llm import ChatContext, ChatMessage
from livekit.agents.voice_assistant import VoiceAssistant
from livekit.plugins import deepgram, openai, silero
import os
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger("nora-ev-agent")
logger.setLevel(logging.INFO)


def prewarm(proc: agents.JobProcess):
    """Prewarm function to load models before job starts"""
    proc.userdata["vad"] = silero.VAD.load()


async def entrypoint(ctx: JobContext):
    """Main entry point for the voice assistant agent"""

    initial_ctx = ChatContext(
        messages=[
            ChatMessage(
                role="system",
                content="""You are a friendly and helpful customer support agent for NoRa EV, Pakistan's first battery-swappable electric car company.

Your goal is to collect the following information from the customer in a natural, conversational way:
1. Customer's name
2. Phone number (Pakistani format: +92 XXX XXXXXXX)
3. Their question or query about NoRa EV

Guidelines:
- Speak in Urdu by default, but switch to English if the customer prefers
- Be warm and friendly
- After getting the name, greet them personally: "Hi [name], what's your phone number?"
- After getting phone number, say something like: "Great! How can I help you with NoRa EV today?"
- Keep responses concise and natural
- When you have all three pieces of information, confirm with the customer before ending

Example flow in Urdu:
- "Assalam o alaikum! Main NoRa EV ki customer support hoon. Aap ka naam kya hai?"
- (After name) "Shukriya [name]! Aap ka phone number kya hai?"
- (After phone) "Bahut acha! Aap NoRa EV ke bare mein kya puchna chahte hain?"

Example flow in English:
- "Hello! I'm NoRa EV's customer support. What's your name?"
- (After name) "Thanks [name]! What's your phone number?"
- (After phone) "Perfect! How can I help you with NoRa EV today?"

Be conversational and natural, not robotic."""
            )
        ]
    )

    # Connect to the room
    await ctx.connect(auto_subscribe=agents.AutoSubscribe.AUDIO_ONLY)

    # Wait for participant
    participant = await ctx.wait_for_participant()
    logger.info(f"Starting voice assistant for participant {participant.identity}")

    # Create the voice assistant
    assistant = VoiceAssistant(
        vad=ctx.proc.userdata["vad"],
        stt=deepgram.STT(),  # Deepgram has good Urdu support
        llm=openai.LLM(model="gpt-4o-mini"),  # Fast and cheap
        tts=openai.TTS(voice="alloy"),  # Can be configured for different voices
        chat_ctx=initial_ctx,
    )

    # Start the assistant
    assistant.start(ctx.room, participant)

    # Send initial greeting
    await assistant.say("Assalam o alaikum! Main NoRa EV ki support assistant hoon. Aap ka naam kya hai?", allow_interruptions=True)

    # Listen for updates
    @assistant.on("function_calls_finished")
    def on_function_calls_finished(called_functions: list):
        """Handle when LLM calls functions"""
        logger.info(f"Functions called: {called_functions}")

    @assistant.on("user_speech_committed")
    def on_user_speech_committed(msg: ChatMessage):
        """Log user speech"""
        logger.info(f"User said: {msg.content}")

    @assistant.on("agent_speech_committed")
    def on_agent_speech_committed(msg: ChatMessage):
        """Log agent speech"""
        logger.info(f"Agent said: {msg.content}")


if __name__ == "__main__":
    cli.run_app(
        WorkerOptions(
            entrypoint_fnc=entrypoint,
            prewarm_fnc=prewarm,
        ),
    )
