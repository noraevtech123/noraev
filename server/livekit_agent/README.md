# NoRa EV LiveKit Voice Agent

This is the conversational voice AI agent for NoRa EV customer support.

## Setup

### 1. Get API Keys (FREE tiers available)

**Deepgram (Speech-to-Text) - FREE tier:**
1. Go to https://deepgram.com
2. Sign up for free account
3. Get API key from dashboard
4. Free tier: $200 credit

**OpenAI (LLM + TTS) - CHEAP:**
1. Go to https://platform.openai.com
2. Create account and add payment method
3. Get API key
4. Cost: ~$0.01-0.02 per conversation (gpt-4o-mini is very cheap)

### 2. Update .env file

Add your API keys to `/server/livekit_agent/.env`:
```
DEEPGRAM_API_KEY=your_actual_key_here
OPENAI_API_KEY=your_actual_key_here
```

### 3. Install Dependencies

```bash
cd /Users/a1234/code/noraev/server/livekit_agent
pip install -r requirements.txt
```

### 4. Run the Agent Locally

```bash
python agent.py dev
```

This will start the agent in development mode and connect to your LiveKit server.

## How It Works

1. User connects from the web frontend
2. Agent greets them in Urdu/English
3. Agent conversationally extracts:
   - Name
   - Phone number
   - Query
4. Agent confirms information
5. Data is sent to your backend

## Deployment

### Option 1: Railway (FREE tier)

1. Create a Railway account
2. Create new project
3. Connect this repository
4. Add environment variables
5. Deploy!

### Option 2: Render (FREE tier)

1. Create Render account
2. New Web Service
3. Connect repository
4. Add environment variables
5. Start command: `python agent.py start`

## Testing Locally

Run the agent, then open the web app and click "Customer Support" to test the voice conversation.

## Language Support

The agent speaks:
- Urdu (default)
- English (switches based on user preference)

It automatically detects and responds in the user's preferred language.
