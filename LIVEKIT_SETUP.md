# LiveKit Voice AI Setup Guide

## What We Built

A professional voice AI customer support system using LiveKit that:
- Speaks in Urdu/English naturally
- Conversationally extracts: name, phone number, and customer query
- Uses AI for natural language understanding
- Automatically adapts to user's language preference

## Architecture

```
Frontend (Next.js) ←→ LiveKit Cloud ←→ LiveKit Agent (Python)
                                           ├── Deepgram STT (FREE)
                                           ├── Groq LLM (FREE)
                                           └── Deepgram Aura TTS (FREE)
```

**🎉 100% FREE SETUP!** Using only free services with generous credits.

## Setup Steps

### 1. Get Required API Keys

You need 2 API keys (both 100% FREE!):

#### A. Deepgram (STT + TTS) - FREE $200 Credit
1. Go to https://deepgram.com
2. Sign up for free account
3. Get API key from dashboard
4. Paste in `/server/livekit_agent/.env` as `DEEPGRAM_API_KEY`

#### B. Groq (LLM - Conversation Brain) - 100% FREE
1. Go to https://console.groq.com
2. Sign up for free account (no credit card required!)
3. Get API key from dashboard
4. Paste in `/server/livekit_agent/.env` as `GROQ_API_KEY`

### 2. Install Python Dependencies

```bash
cd /Users/a1234/code/noraev/server/livekit_agent
pip install -r requirements.txt
```

### 3. Run the Agent Locally (Testing)

```bash
cd /Users/a1234/code/noraev/server/livekit_agent
python agent.py dev
```

You should see:
```
INFO:nora-ev-agent:Agent connected to LiveKit
INFO:nora-ev-agent:Waiting for participants...
```

### 4. Start the Next.js Frontend

```bash
cd /Users/a1234/code/noraev/web
npm run dev
```

### 5. Test It!

1. Open http://localhost:3000
2. Click "Customer Support" button
3. Click "Start Voice Call"
4. Speak to the AI!

## How It Works

1. **User clicks "Customer Support"** → Frontend requests token from `/api/livekit-token`
2. **Frontend connects to LiveKit** → LiveKit spawns a Python agent
3. **Agent greets user** → "Assalam o alaikum! Main NoRa EV ki support assistant hoon. Aap ka naam kya hai?"
4. **Natural conversation** → Agent extracts name, phone, query naturally
5. **Agent confirms** → Reviews collected info
6. **Data saved** → Send to your backend/database

## Deploying to Production

### Option 1: Railway (Easiest, FREE tier)

1. Go to https://railway.app
2. Create new project
3. Connect your GitHub repo
4. Select `/server/livekit_agent` folder
5. Add environment variables:
   ```
   LIVEKIT_URL=wss://noraev-68hm4qni.livekit.cloud
   LIVEKIT_API_KEY=APIc9QdiYXUMea4
   LIVEKIT_API_SECRET=m9DUPRhAGZXJPjEt5fHVXnWHmHKtxAXdgBc4MOy5ueT
   DEEPGRAM_API_KEY=your_deepgram_key
   GROQ_API_KEY=your_groq_key
   ```
6. Set start command: `python agent.py start`
7. Deploy!

### Option 2: Render (FREE tier)

1. Go to https://render.com
2. New Web Service
3. Connect repo
4. Root directory: `server/livekit_agent`
5. Start command: `python agent.py start`
6. Add environment variables (same as above)
7. Deploy!

## Costs

- **LiveKit Cloud:** FREE (10K minutes/month)
- **Deepgram STT + TTS:** FREE ($200 credit = ~46,000 minutes!)
- **Groq LLM:** 100% FREE (no credit card required)
- **Hosting:** FREE (Railway/Render free tier)

**Total: $0.00 - Completely FREE! 🎉**

Your Deepgram $200 credit gives you approximately 46,000 minutes of conversation time before you need to pay anything.

## Troubleshooting

### "Agent not connecting"
- Make sure agent is running: `python agent.py dev`
- Check environment variables are set correctly

### "No audio"
- Check browser permissions (allow microphone)
- Check console for errors

### "API key errors"
- Verify Deepgram and Groq keys are correct in `.env`
- Make sure both API keys are active (both services are free!)

## Next Steps

1. **Customize the agent** - Edit `/server/livekit_agent/agent.py` to change conversation flow
2. **Add data extraction** - Extract name/phone/query and save to database
3. **Deploy** - Deploy agent to Railway/Render for 24/7 availability

## Support

Check logs:
- Agent: Terminal where `python agent.py dev` is running
- Frontend: Browser console
- LiveKit: https://cloud.livekit.io (check dashboard)
