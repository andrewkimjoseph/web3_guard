// Options page script for Web3 Guard

document.addEventListener('DOMContentLoaded', async () => {
  const apiKeyInput = document.getElementById('apiKey');
  const saveBtn = document.getElementById('saveBtn');
  const status = document.getElementById('status');
  
  // Load existing API key
  try {
    const result = await chrome.storage.local.get(['apiKey']);
    if (result.apiKey) {
      apiKeyInput.value = result.apiKey;
      // Mask the key for display (show first 10 and last 4 chars)
      const masked = maskApiKey(result.apiKey);
      apiKeyInput.type = 'password';
      apiKeyInput.placeholder = masked;
    }
  } catch (error) {
    console.error('Error loading API key:', error);
  }
  
  // Save button handler
  saveBtn.addEventListener('click', async () => {
    const apiKey = apiKeyInput.value.trim();
    
    if (!apiKey) {
      showStatus('Please enter an API key', 'error');
      return;
    }
    
    if (apiKey.length < 20) {
      showStatus('API key seems too short. Please check and try again.', 'error');
      return;
    }
    
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';
    
    try {
      await chrome.storage.local.set({ apiKey: apiKey });
      showStatus('✅ API key saved successfully!', 'success');
      apiKeyInput.type = 'password';
      apiKeyInput.placeholder = maskApiKey(apiKey);
      apiKeyInput.value = '';
    } catch (error) {
      showStatus('❌ Error saving API key: ' + error.message, 'error');
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = 'Save API Key';
    }
  });
  
  // Allow Enter key to save
  apiKeyInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      saveBtn.click();
    }
  });
});

function maskApiKey(key) {
  if (key.length <= 14) return '••••••••';
  return key.substring(0, 10) + '••••' + key.substring(key.length - 4);
}

function showStatus(message, type) {
  const status = document.getElementById('status');
  status.textContent = message;
  status.className = `status ${type} show`;
  
  setTimeout(() => {
    status.classList.remove('show');
  }, 5000);
}

