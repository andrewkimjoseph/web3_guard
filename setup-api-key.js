// Setup script for API key configuration
// Run this in Chrome DevTools console after loading the extension
// 
// Usage:
// 1. Load the extension in Chrome
// 2. Open Chrome DevTools (F12)
// 3. Go to Console tab
// 4. Copy and paste this entire file
// 5. Replace 'YOUR_GEMINI_API_KEY_HERE' with your actual API key
// 6. Press Enter

const API_KEY = 'YOUR_GEMINI_API_KEY_HERE';

if (API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
  console.error('❌ Please replace YOUR_GEMINI_API_KEY_HERE with your actual API key');
  console.log('Get your API key from: https://makersuite.google.com/app/apikey');
} else {
  chrome.storage.local.set({ apiKey: API_KEY }, () => {
    if (chrome.runtime.lastError) {
      console.error('❌ Error saving API key:', chrome.runtime.lastError);
    } else {
      console.log('✅ API key saved successfully!');
      console.log('You can now use the Web3 Guard extension.');
    }
  });
}

