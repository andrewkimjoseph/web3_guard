// Test transaction data
const testTransactions = {
  safe: `{
  "to": "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
  "contractName": "Uniswap V2 Router",
  "function": "swapExactTokensForTokens",
  "value": "0.1 ETH",
  "data": "0x38ed1739..."
}`,
  
  risky: `{
  "to": "0x1234567890123456789012345678901234567890",
  "contractName": "Unknown Contract",
  "function": "approve",
  "spender": "0xUnknownAddress",
  "amount": "unlimited",
  "note": "Requesting unlimited token approval"
}`,
  
  scam: `{
  "to": "0xabc123...",
  "contractName": "New Contract (Created 2 hours ago)",
  "function": "transferFrom",
  "value": "5 ETH",
  "data": "0x...",
  "warnings": "Contract has no verified code, suspicious patterns detected"
}`
};

// DOM Elements
const txInput = document.getElementById('txInput');
const analyzeBtn = document.getElementById('analyzeBtn');
const loading = document.getElementById('loading');
const result = document.getElementById('result');
const error = document.getElementById('error');
const testButtons = document.querySelectorAll('.test-btn');

// Event Listeners
analyzeBtn.addEventListener('click', handleAnalyze);

testButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const type = btn.dataset.type;
    txInput.value = testTransactions[type];
    handleAnalyze();
  });
});

// Settings link
document.getElementById('settingsLink').addEventListener('click', (e) => {
  e.preventDefault();
  chrome.runtime.openOptionsPage();
});

// Main analyze function
async function handleAnalyze() {
  const txData = txInput.value.trim();
  
  if (!txData) {
    showError('Please paste transaction data');
    return;
  }
  
  // Show loading
  hideAll();
  loading.classList.remove('hidden');
  
  try {
    const analysis = await analyzeTransaction(txData);
    displayResult(analysis);
  } catch (err) {
    showError(err.message || 'Failed to analyze transaction');
  }
}

// Get API key from Chrome storage
async function getApiKey() {
  const result = await chrome.storage.local.get(['apiKey']);
  return result.apiKey;
}

// Call Gemini API
async function analyzeTransaction(txData) {
  // Get API key from storage
  const API_KEY = await getApiKey();
  
  if (!API_KEY) {
    throw new Error('API key not configured. Right-click extension icon → Options to set your API key.');
  }
  
  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-goog-api-key': API_KEY
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `You are a Web3 security expert. Analyze this blockchain transaction and respond with ONLY a valid JSON object (no markdown, no extra text).

Transaction data:
${txData}

Analyze for:
1. Contract reputation (is it verified/known?)
2. Function being called (common vs suspicious)
3. Value/amount being transferred
4. Token approvals (limited vs unlimited)
5. Known scam patterns
6. Unusual permissions

Respond with this EXACT JSON structure:
{
  "verdict": "SAFE" or "RISKY" or "SCAM",
  "confidence": <number 0-100>,
  "reason": "<brief 1-2 sentence explanation>",
  "warnings": ["<warning1>", "<warning2>"],
  "recommendation": "<what should user do>"
}

Remember: Output ONLY the JSON object, nothing else.`
        }]
      }]
    })
  });
  
  if (!response.ok) {
    const errorData = await response.text();
    console.error('API Error:', errorData);
    throw new Error('API request failed: ' + response.status);
  }
  
  const data = await response.json();
  console.log('API Response:', data); // For debugging
  
  const text = data.candidates[0].content.parts[0].text;
  
  // Extract JSON from response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.error('Response text:', text);
    throw new Error('Invalid API response format');
  }
  
  return JSON.parse(jsonMatch[0]);
}

// Display results
function displayResult(analysis) {
  hideAll();
  
  const verdict = document.getElementById('verdict');
  const explanation = document.getElementById('explanation');
  
  // Verdict emoji mapping
  const verdictEmoji = {
    'SAFE': '✅',
    'RISKY': '⚠️',
    'SCAM': '❌'
  };
  
  // Build verdict HTML
  let confidenceDisplay = '';
  if (analysis.confidence < 80) {
    confidenceDisplay = `<span class="confidence-low">AI Confidence: ${analysis.confidence}% (Verify manually)</span>`;
  }

  verdict.innerHTML = `
    <div class="verdict ${analysis.verdict.toLowerCase()}">
      <div>${verdictEmoji[analysis.verdict]} ${analysis.verdict}</div>
      ${confidenceDisplay}
    </div>
  `;
  
  // Build explanation HTML
  let explanationHTML = `
    <div class="reason">${analysis.reason}</div>
  `;
  
  // Add warnings if present
  if (analysis.warnings && analysis.warnings.length > 0) {
    explanationHTML += `
      <div class="warnings">
        <strong>⚠️ Security Warnings:</strong>
        <ul>
          ${analysis.warnings.map(w => `<li>${w}</li>`).join('')}
        </ul>
      </div>
    `;
  }
  
  // Add recommendation
  explanationHTML += `
    <div class="recommendation">
      <strong>💡 Recommendation:</strong>
      ${analysis.recommendation}
    </div>
  `;
  
  explanation.innerHTML = explanationHTML;
  result.classList.remove('hidden');
}

// Show error
function showError(message) {
  hideAll();
  error.querySelector('.error-message').textContent = message;
  error.classList.remove('hidden');
}

// Hide all result sections
function hideAll() {
  loading.classList.add('hidden');
  result.classList.add('hidden');
  error.classList.add('hidden');
}