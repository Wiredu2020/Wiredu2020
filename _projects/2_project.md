---
layout: page
title: AI Voice Agent
description: Real-time AI voice agent for document review built with LiveKit and LLMs
img: assets/img/aiagent.jpeg
importance: 4
category: ai
related_publications: false
---

## Overview

An AI-powered voice agent that lets users interact with documents through natural spoken conversation. Built on **LiveKit** for real-time audio streaming, the agent listens, understands, and responds — turning document review into a hands-free, conversational experience.

---

<div class="row justify-content-center">
    <div class="col-sm-10 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/aiagent.jpeg" title="AI Voice Agent" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Real-time AI voice agent for document review — <a href="https://docrevfrontend.vercel.app/" target="_blank">docrevfrontend.vercel.app</a>
</div>

---

## 🎙️ How It Works

1. **User speaks** — audio is captured and streamed in real time via LiveKit
2. **Speech-to-text** — the agent transcribes the audio using a live STT pipeline
3. **LLM reasoning** — the transcript is passed to an LLM with document context for intelligent responses
4. **Text-to-speech** — the response is synthesized and streamed back to the user
5. **Document grounding** — the agent keeps track of the document being reviewed and answers questions about its content

---

## 🛠️ Tech Stack

| Component | Technology |
|---|---|
| Real-time audio | LiveKit (WebRTC) |
| Agent framework | LiveKit Agents SDK |
| LLM | Claude / OpenAI |
| Speech-to-text | Deepgram / Whisper |
| Text-to-speech | ElevenLabs / Cartesia |
| Frontend | Next.js, deployed on Vercel |
| Backend | Python (FastAPI) |

---

## ✨ Key Features

- **Low-latency audio** — sub-second voice response powered by LiveKit's WebRTC infrastructure
- **Document-aware Q&A** — upload a document and ask questions about it verbally
- **Interruption handling** — agent detects when the user starts speaking and stops gracefully
- **Session state** — conversation history maintained across the session for coherent follow-ups

🔗 Live demo: [docrevfrontend.vercel.app](https://docrevfrontend.vercel.app/)
