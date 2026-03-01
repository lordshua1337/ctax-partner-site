// --- API Configuration ---
// All AI requests route through /api/chat serverless proxy.
// The Anthropic API key is stored server-side in Vercel env vars.
// No key is ever exposed to the browser.

var CTAX_API_URL = 'https://ctax-api-proxy.vercel.app/api/chat';

// Legacy compat -- these are still referenced by AI tool modules.
// promptForApiKey now always returns true (no prompt needed).
var CTAX_API_KEY = 'proxy';

function promptForApiKey() {
  return true;
}

function getApiHeaders() {
  return {
    'Content-Type': 'application/json'
  };
}

function getApiUrl() {
  return CTAX_API_URL;
}

function clearApiKey() {
  // No-op -- key is server-side
}
// --- End API Configuration ---
