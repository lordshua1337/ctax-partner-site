// --- Pro Subscription Gating System ---
// Controls which portal tools are locked behind the $4.95/month Pro plan.
// In demo mode (default), all tools are unlocked.
// When gating is active, locked sections show a paywall overlay.

var PRO_STORAGE_KEY = 'ctax_pro_sub';
var PRO_PRICE = '$4.95';

// Sections that are FREE (always unlocked)
var PRO_FREE_SECTIONS = [
  'portal-sec-dashboard',
  'portal-sec-referrals',
  'portal-sec-submit',
  'portal-sec-earnings',
  'portal-sec-payouts',
  'portal-sec-ce',
  'portal-sec-training',
  'portal-sec-settings',
  'portal-sec-support'
];

// Sections that require Pro (locked in free mode)
var PRO_GATED_SECTIONS = [
  'portal-sec-marketing',
  'portal-sec-playbook',
  'portal-sec-planner',
  'portal-sec-challenge',
  'portal-sec-calculator',
  'portal-sec-documents',
  'portal-sec-tunes',
  'portal-sec-ai-scripts',
  'portal-sec-ai-admaker',
  'portal-sec-ai-qualifier',
  'portal-sec-ai-kb',
  'portal-sec-page-builder'
];

// Offer stack items shown in the paywall modal
var PRO_FEATURES = [
  { icon: 'zap', title: 'AI Script Builder', desc: 'Generate referral conversation scripts, emails, and objection handlers' },
  { icon: 'image', title: 'AI Ad Maker', desc: 'Create co-branded social media ads and marketing assets' },
  { icon: 'search', title: 'AI Client Qualifier', desc: 'Instantly assess referral strength and estimated case value' },
  { icon: 'book', title: 'Knowledge Base', desc: 'AI-powered search across all program documentation' },
  { icon: 'star', title: 'Marketing Kit', desc: 'Email templates, social assets, landing pages, and print materials' },
  { icon: 'map', title: 'Referral Playbook', desc: 'Scripts, objection handling, follow-up strategies, and quiz drills' },
  { icon: 'trending-up', title: 'Business Planner', desc: 'Personalized 90-day growth roadmap with task tracking' },
  { icon: 'layers', title: '30-Day Challenge', desc: 'Gamified daily actions with points, streaks, and leaderboards' },
  { icon: 'bar-chart', title: 'Revenue Calculator', desc: 'Model your earnings at any tier and referral volume' },
  { icon: 'folder', title: 'Document Manager', desc: 'Upload, organize, and track client documents securely' }
];

function proGetState() {
  try {
    var raw = localStorage.getItem(PRO_STORAGE_KEY);
    if (!raw) return { mode: 'demo', subscribed: false };
    return JSON.parse(raw);
  } catch (e) {
    return { mode: 'demo', subscribed: false };
  }
}

function proSaveState(state) {
  try {
    localStorage.setItem(PRO_STORAGE_KEY, JSON.stringify(state));
  } catch (e) { /* quota */ }
}

function proIsUnlocked(sectionId) {
  var state = proGetState();
  // Demo mode = everything unlocked
  if (state.mode === 'demo') return true;
  // Subscribed = everything unlocked
  if (state.subscribed) return true;
  // Free sections always unlocked
  if (PRO_FREE_SECTIONS.indexOf(sectionId) !== -1) return true;
  // Otherwise locked
  return false;
}

function proIsDemoMode() {
  return proGetState().mode === 'demo';
}

// Toggle between demo mode and gated mode (for testing)
function proToggleDemo() {
  var state = proGetState();
  state.mode = state.mode === 'demo' ? 'gated' : 'demo';
  proSaveState(state);
  proRefreshGates();
  if (typeof portalToast === 'function') {
    portalToast(state.mode === 'demo' ? 'Demo mode: all tools unlocked' : 'Gated mode: Pro tools locked', 'info');
  }
}

// Simulate subscribing (for demo purposes)
function proSubscribe() {
  var state = proGetState();
  state.subscribed = true;
  proSaveState(state);
  proClosePaywall();
  proRefreshGates();
  if (typeof portalToast === 'function') {
    portalToast('Pro subscription activated! All tools are now unlocked.', 'success');
  }
}

// Check and render lock overlay when navigating to a gated section
function proCheckGate(sectionId) {
  if (proIsUnlocked(sectionId)) {
    proRemoveOverlay(sectionId);
    return true;
  }
  proShowOverlay(sectionId);
  return false;
}

function proShowOverlay(sectionId) {
  var section = document.getElementById(sectionId);
  if (!section) return;
  if (section.querySelector('.pro-lock-overlay')) return;

  var overlay = document.createElement('div');
  overlay.className = 'pro-lock-overlay';

  var h = '';
  h += '<div class="pro-lock-card">';
  h += '<div class="pro-lock-icon"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg></div>';
  h += '<div class="pro-lock-title">Unlock with Pro</div>';
  h += '<div class="pro-lock-desc">This tool is part of the AI-Powered Marketing Lab. Upgrade to Pro for ' + PRO_PRICE + '/month to access all premium tools.</div>';
  h += '<button class="pro-lock-btn" onclick="proShowPaywall()">Unlock for ' + PRO_PRICE + '/mo</button>';
  h += '<button class="pro-lock-preview" onclick="proToggleDemo()">Continue in Demo Mode</button>';
  h += '</div>';
  overlay.innerHTML = h;

  section.style.position = 'relative';
  section.appendChild(overlay);
}

function proRemoveOverlay(sectionId) {
  var section = document.getElementById(sectionId);
  if (!section) return;
  var overlay = section.querySelector('.pro-lock-overlay');
  if (overlay) overlay.remove();
}

function proRefreshGates() {
  PRO_GATED_SECTIONS.forEach(function(secId) {
    if (proIsUnlocked(secId)) {
      proRemoveOverlay(secId);
    }
  });
  // Update nav lock icons
  proUpdateNavLocks();
}

function proUpdateNavLocks() {
  var state = proGetState();
  var navItems = document.querySelectorAll('.portal-nav-item');
  navItems.forEach(function(item) {
    var onclick = item.getAttribute('onclick') || '';
    var lockIcon = item.querySelector('.pro-nav-lock');
    var isGated = false;
    PRO_GATED_SECTIONS.forEach(function(secId) {
      if (onclick.indexOf(secId) !== -1) isGated = true;
    });
    if (isGated && state.mode !== 'demo' && !state.subscribed) {
      if (!lockIcon) {
        var lock = document.createElement('span');
        lock.className = 'pro-nav-lock';
        lock.innerHTML = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>';
        item.appendChild(lock);
      }
    } else if (lockIcon) {
      lockIcon.remove();
    }
  });
}

// Paywall modal
function proShowPaywall() {
  if (document.getElementById('pro-paywall')) return;

  var overlay = document.createElement('div');
  overlay.id = 'pro-paywall';
  overlay.className = 'pro-paywall-overlay';
  overlay.onclick = function(e) { if (e.target === overlay) proClosePaywall(); };

  var iconMap = {
    'zap': '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>',
    'image': '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>',
    'search': '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
    'book': '<path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/>',
    'star': '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
    'map': '<path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>',
    'trending-up': '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>',
    'layers': '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
    'bar-chart': '<line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/>',
    'folder': '<path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>'
  };

  var h = '<div class="pro-pw-modal">';
  h += '<button class="pro-pw-close" onclick="proClosePaywall()">';
  h += '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
  h += '</button>';

  // Header
  h += '<div class="pro-pw-header">';
  h += '<div class="pro-pw-badge">PRO</div>';
  h += '<div class="pro-pw-title">AI-Powered Marketing Lab</div>';
  h += '<div class="pro-pw-subtitle">Unlock every premium tool for your practice</div>';
  h += '</div>';

  // Price
  h += '<div class="pro-pw-price-card">';
  h += '<div class="pro-pw-price"><span class="pro-pw-dollar">$</span><span class="pro-pw-amount">4</span><span class="pro-pw-cents">.95</span><span class="pro-pw-period">/month</span></div>';
  h += '<div class="pro-pw-price-note">Cancel anytime. No long-term commitment.</div>';
  h += '</div>';

  // Feature list
  h += '<div class="pro-pw-features">';
  h += '<div class="pro-pw-feat-title">Everything included:</div>';
  PRO_FEATURES.forEach(function(f) {
    var svg = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + (iconMap[f.icon] || '') + '</svg>';
    h += '<div class="pro-pw-feat">';
    h += '<div class="pro-pw-feat-icon">' + svg + '</div>';
    h += '<div class="pro-pw-feat-info"><div class="pro-pw-feat-name">' + f.title + '</div><div class="pro-pw-feat-desc">' + f.desc + '</div></div>';
    h += '</div>';
  });
  h += '</div>';

  // CTA
  h += '<button class="pro-pw-cta" onclick="proSubscribe()">Start Pro for ' + PRO_PRICE + '/month</button>';
  h += '<div class="pro-pw-guarantee">30-day money-back guarantee. Your enterprise may cover this.</div>';

  h += '</div>';
  overlay.innerHTML = h;
  document.body.appendChild(overlay);
}

function proClosePaywall() {
  var el = document.getElementById('pro-paywall');
  if (el) el.remove();
}

// Initialize: set demo mode by default, update nav
function proInit() {
  var state = proGetState();
  if (!localStorage.getItem(PRO_STORAGE_KEY)) {
    proSaveState({ mode: 'demo', subscribed: false });
  }
  proUpdateNavLocks();
}
