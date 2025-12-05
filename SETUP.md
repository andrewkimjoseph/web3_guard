# Web3 Guard Setup Guide

## API Key Configuration

This extension uses Google's Gemini API for transaction analysis. You need to configure your API key before using the extension.

### Step 1: Get Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### Step 2: Set the API Key in the Extension

**Option A: Using Settings Page (Easiest - Recommended)**

1. Right-click the extension icon → **"Options"** (or go to `chrome://extensions` → find Web3 Guard → click "Options")
2. Paste your API key in the input field
3. Click "Save API Key"
4. You're done! ✅

**Option B: Using Extension Popup**

1. Click the extension icon to open the popup
2. Click the **"⚙️ Settings"** link at the bottom
3. Paste your API key and save

**Option C: Using Chrome Console (Advanced)**

If you need to set it programmatically:

1. Right-click the extension icon → "Inspect popup"
2. In the console, run:
   ```javascript
   chrome.storage.local.set({ apiKey: 'YOUR_API_KEY_HERE' })
   ```
3. Reload the extension

### Step 3: Verify Setup

1. Open the extension popup
2. Try analyzing a test transaction
3. If you see an error about API key, repeat Step 2

## Security Notes

- ⚠️ **Never commit your API key to Git**
- ✅ The `.gitignore` file excludes `config.js` and `.env` files
- ✅ API keys are stored locally in Chrome storage (not synced)
- ✅ Each user needs to set their own API key

## Troubleshooting

**Error: "API key not configured"**
- Make sure you've set the API key using one of the methods above
- Check Chrome storage: `chrome.storage.local.get(['apiKey'])`

**Error: "API request failed: 403"**
- Your API key may be invalid or expired
- Check your API key at Google AI Studio
- Make sure billing is enabled if required

**Error: "API request failed: 429"**
- You've hit the rate limit
- Wait a few minutes and try again
- Consider upgrading your API quota

