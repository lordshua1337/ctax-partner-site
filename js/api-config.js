// --- API Configuration ---
// WARNING: Client-side API key usage is for DEMO/DEVELOPMENT only.
// For production, route all AI requests through a backend proxy.
var CTAX_API_KEY = localStorage.getItem('ctax_api_key') || '';

function promptForApiKey() {
  var key = prompt(
    'Enter your Anthropic API key to use AI tools.\n\n' +
    'IMPORTANT: This key is stored in your browser (localStorage) ' +
    'and is visible in network requests. Only use a development key ' +
    'with spending limits enabled.\n\n' +
    'Get a key at: console.anthropic.com'
  );
  if (key && key.trim()) {
    CTAX_API_KEY = key.trim();
    localStorage.setItem('ctax_api_key', CTAX_API_KEY);
    return true;
  }
  return false;
}

function getApiHeaders() {
  return {
    'Content-Type': 'application/json',
    'anthropic-version': '2023-06-01',
    'anthropic-dangerous-direct-browser-access': 'true',
    'x-api-key': CTAX_API_KEY
  };
}

function clearApiKey() {
  CTAX_API_KEY = '';
  localStorage.removeItem('ctax_api_key');
}
// --- End API Configuration ---
