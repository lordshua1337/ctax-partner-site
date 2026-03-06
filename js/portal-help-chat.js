// --- AI Help Chat Widget ---
var HELP_CHAT_KEY = 'ctax_help_chat';
var _helpChatOpen = false;

function helpChatToggle() {
  _helpChatOpen = !_helpChatOpen;
  var panel = document.getElementById('help-chat-panel');
  var fab = document.getElementById('help-chat-fab');
  if (panel) panel.classList.toggle('hc-open', _helpChatOpen);
  if (fab) fab.classList.toggle('hc-fab-active', _helpChatOpen);
  if (_helpChatOpen) {
    var input = document.getElementById('hc-input');
    if (input) setTimeout(function() { input.focus(); }, 200);
    renderHelpChatHistory();
  }
}

function getHelpChatHistory() {
  return safeStorageGet(HELP_CHAT_KEY, []);
}

function renderHelpChatHistory() {
  var el = document.getElementById('hc-messages');
  if (!el) return;
  var history = getHelpChatHistory();
  if (!history.length) {
    el.innerHTML = '<div class="hc-welcome">'
      + '<div class="hc-welcome-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>'
      + '<div class="hc-welcome-title">Partner Help</div>'
      + '<div class="hc-welcome-text">Ask anything about the partner program, referral process, commissions, or portal features.</div>'
      + '<div class="hc-quick-btns">'
      + '<button class="hc-quick" onclick="helpChatQuick(\'How do commissions work?\')">How do commissions work?</button>'
      + '<button class="hc-quick" onclick="helpChatQuick(\'What is the referral process?\')">What is the referral process?</button>'
      + '<button class="hc-quick" onclick="helpChatQuick(\'How do I use the page builder?\')">How do I use the page builder?</button>'
      + '</div>'
      + '</div>';
    return;
  }
  var html = '';
  history.forEach(function(msg) {
    html += '<div class="hc-msg hc-msg-' + msg.role + '">'
      + '<div class="hc-msg-bubble">' + msg.text + '</div>'
      + '</div>';
  });
  el.innerHTML = html;
  el.scrollTop = el.scrollHeight;
}

function helpChatQuick(q) {
  var input = document.getElementById('hc-input');
  if (input) input.value = q;
  helpChatSend();
}

async function helpChatSend() {
  var input = document.getElementById('hc-input');
  var question = (input ? input.value : '').trim();
  if (!question) return;
  if (input) input.value = '';

  var history = getHelpChatHistory();
  history.push({ role: 'user', text: question.replace(/</g, '&lt;') });

  // Show typing indicator
  var msgEl = document.getElementById('hc-messages');
  renderHelpChatHistory();
  if (msgEl) {
    msgEl.innerHTML += '<div class="hc-msg hc-msg-assistant" id="hc-typing"><div class="hc-msg-bubble hc-typing-bubble"><span class="hc-dot"></span><span class="hc-dot"></span><span class="hc-dot"></span></div></div>';
    msgEl.scrollTop = msgEl.scrollHeight;
  }

  try {
    if (typeof CTAX_API_KEY === 'undefined' || !CTAX_API_KEY) {
      throw new Error('No API key');
    }

    // Build conversation for Claude
    var messages = history.filter(function(m) { return m.role === 'user' || m.role === 'assistant'; }).map(function(m) {
      return { role: m.role, content: m.text.replace(/<[^>]+>/g, '') };
    });
    // Keep last 10 messages for context
    if (messages.length > 10) messages = messages.slice(-10);

    var resp = await fetch(CTAX_API_URL, {
      method: 'POST',
      headers: getApiHeaders(),
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 600,
        system: typeof KB_SYSTEM !== 'undefined' ? KB_SYSTEM + '\n\nYou are answering in a help chat widget. Keep responses concise (2-3 short paragraphs max). Use <b>bold</b> for key terms. Be friendly and direct.' : 'You are a helpful partner support assistant. Keep responses concise.',
        messages: messages
      })
    });

    if (!resp.ok) throw new Error('API ' + resp.status);
    var data = await resp.json();
    var answer = data.content && data.content[0] ? data.content[0].text : 'Sorry, I could not generate an answer right now.';

    history.push({ role: 'assistant', text: answer });
    safeStorageSet(HELP_CHAT_KEY, history.slice(-20));

  } catch (err) {
    history.push({ role: 'assistant', text: 'I am unable to connect right now. Please try again or contact <b>partners@communitytax.com</b> for help.' });
    safeStorageSet(HELP_CHAT_KEY, history.slice(-20));
  }

  var typing = document.getElementById('hc-typing');
  if (typing) typing.remove();
  renderHelpChatHistory();
}

function helpChatClear() {
  safeStorageRemove(HELP_CHAT_KEY);
  renderHelpChatHistory();
}
