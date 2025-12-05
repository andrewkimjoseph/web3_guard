# 🛡️ Web3 Guard

AI-powered Web3 transaction security checker using Google Cloud Gemini API.

## Problem
Users lose millions in crypto scams because they don't understand what transactions do before signing them.

## Solution
Chrome extension that analyzes any Web3 transaction and provides instant security assessment:
- ✅ **SAFE**: Verified contracts, standard functions
- ⚠️ **RISKY**: Unusual permissions, unverified contracts  
- ❌ **SCAM**: Known scam patterns, suspicious behavior

## Features
- 🤖 AI-powered analysis using Gemini Pro
- ⚡ Instant results in seconds
- 🎯 Clear verdicts with explanations
- 🔍 Detailed security warnings

## Tech Stack
- Google Cloud Gemini API
- Chrome Extension Manifest V3
- Vanilla JavaScript

## Demo
<img width="1067" height="575" alt="Screenshot 2025-12-05 at 13 37 54" src="https://github.com/user-attachments/assets/c9aa08c2-6d27-45c6-b600-ece2e5f892cb" />

## Installation

1. Clone this repo
2. Load in Chrome: `chrome://extensions` → Enable "Developer mode" → "Load unpacked"
3. Configure your API key (see [SETUP.md](./SETUP.md) for detailed instructions)
   - Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Set it using Chrome storage (see SETUP.md)
4. Click extension icon to analyze transactions

**⚠️ Important:** Never commit your API key to Git. The extension uses Chrome storage to securely store your API key locally.

## Usage
1. Paste transaction data into the text area
2. Click "Analyze Transaction"
3. Get instant security verdict

Or use quick test buttons to see examples.

## Post-Hackathon Plans
- Google Cloud Functions to avoid API key hassle
- Auto-detect transactions on Web3 sites
- Database of known scam contracts
- Real-time alerts

## Team
Team Duolingo
- Andrew Kim
- Immaculate Munde

Built for ALX x Google Cloud Hackathon 2025
