// ── COMMAND BAR (Cmd+K) ──────────────────────────────────────
var CMDK_COMMANDS = [
  { group: 'Navigation', label: 'Dashboard', hint: 'Overview & stats', section: 'portal-sec-dashboard', icon: 'grid', color: '' },
  { group: 'Navigation', label: 'Referrals', hint: 'Track all referrals', section: 'portal-sec-referrals', icon: 'users', color: 'orange' },
  { group: 'Navigation', label: 'Earnings', hint: 'Revenue & commissions', section: 'portal-sec-earnings', icon: 'dollar', color: 'green' },
  { group: 'Navigation', label: 'Payouts', hint: 'Payment history', section: 'portal-sec-payouts', icon: 'credit', color: '' },
  { group: 'Navigation', label: 'Submit Referral', hint: 'Send a new referral', section: 'portal-sec-submit', icon: 'plus', color: 'cyan' },
  { group: 'Navigation', label: 'Documents', hint: 'Files & uploads', section: 'portal-sec-documents', icon: 'file', color: '' },
  { group: 'Navigation', label: 'Revenue Calculator', hint: 'Project your earnings', section: 'portal-sec-calculator', icon: 'calc', color: 'green' },
  { group: 'Navigation', label: 'CE Webinars', hint: 'Training & credits', section: 'portal-sec-ce', icon: 'play', color: 'purple' },
  { group: 'Navigation', label: 'Marketing Kit', hint: 'Ads, emails, assets', section: 'portal-sec-marketing', icon: 'star', color: 'orange' },
  { group: 'Navigation', label: 'Referral Playbook', hint: 'Scripts & strategies', section: 'portal-sec-playbook', icon: 'book', color: '' },
  { group: 'Navigation', label: 'Business Planner', hint: '90-day roadmap', section: 'portal-sec-planner', icon: 'map', color: 'cyan' },
  { group: 'Navigation', label: 'Settings', hint: 'Profile & preferences', section: 'portal-sec-settings', icon: 'settings', color: '' },
  { group: 'Navigation', label: 'Support', hint: 'Help & tickets', section: 'portal-sec-support', icon: 'help', color: '' },
  { group: 'Navigation', label: 'Tunes', hint: 'Community Soul radio', section: 'portal-sec-tunes', icon: 'music', color: 'purple' },
  { group: 'Actions', label: 'Submit a New Referral', hint: 'Open referral form', section: 'portal-sec-submit', icon: 'plus', color: 'cyan' },
  { group: 'Actions', label: 'Generate Business Plan', hint: 'Build your 90-day roadmap', section: 'portal-sec-planner', icon: 'map', color: 'green' },
  { group: 'Actions', label: 'Open Ad Builder', hint: 'Create marketing assets', action: 'admaker', icon: 'star', color: 'orange' },
  { group: 'Actions', label: 'Talk to Your Rep', hint: 'Open Resolution Pro', action: 'rp', icon: 'chat', color: 'cyan' },
  { group: 'Quick Links', label: 'Back to Website', hint: 'Leave the portal', action: 'home', icon: 'exit', color: '' },
  { group: 'Quick Links', label: 'Toggle Dark Mode', hint: 'Switch theme', action: 'darkmode', icon: 'moon', color: 'purple' }
];

var CMDK_ICONS = {
  grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
  users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>',
  dollar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 100 7h5a3.5 3.5 0 110 7H6"/></svg>',
  credit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  file: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
  calc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="10" y2="10"/><line x1="14" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="10" y2="14"/><line x1="14" y1="14" x2="16" y2="14"/><line x1="8" y1="18" x2="16" y2="18"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>',
  map: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>',
  settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4"/></svg>',
  help: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  music: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
  chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>',
  exit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
  moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>'
};

var _cmdkActiveIdx = 0;
var _cmdkFiltered = [];

function cmdkOpen() {
  var overlay = document.getElementById('cmdk-overlay');
  if (!overlay) return;
  overlay.classList.add('cmdk-open');
  var input = document.getElementById('cmdk-input');
  if (input) { input.value = ''; input.focus(); }
  _cmdkActiveIdx = 0;
  cmdkFilter('');
}

function cmdkClose() {
  var overlay = document.getElementById('cmdk-overlay');
  if (overlay) overlay.classList.remove('cmdk-open');
}

function cmdkFilter(query) {
  var list = document.getElementById('cmdk-list');
  if (!list) return;
  var q = query.toLowerCase().trim();
  var filtered = q ? CMDK_COMMANDS.filter(function(c) {
    return c.label.toLowerCase().indexOf(q) !== -1 || c.hint.toLowerCase().indexOf(q) !== -1 || c.group.toLowerCase().indexOf(q) !== -1;
  }) : CMDK_COMMANDS;

  _cmdkFiltered = filtered;
  _cmdkActiveIdx = 0;

  if (filtered.length === 0) {
    list.innerHTML = '<div class="cmdk-empty">No results found</div>';
    return;
  }

  var html = '';
  var lastGroup = '';
  filtered.forEach(function(cmd, i) {
    if (cmd.group !== lastGroup) {
      html += '<div class="cmdk-group-label">' + cmd.group + '</div>';
      lastGroup = cmd.group;
    }
    var colorClass = cmd.color ? ' cmdk-item-icon-' + cmd.color : '';
    var activeClass = i === 0 ? ' cmdk-item-active' : '';
    html += '<div class="cmdk-item' + activeClass + '" data-idx="' + i + '" onclick="cmdkExecute(' + i + ')" onmouseenter="cmdkHover(' + i + ')">';
    html += '<div class="cmdk-item-icon' + colorClass + '">' + (CMDK_ICONS[cmd.icon] || '') + '</div>';
    html += '<div class="cmdk-item-label">' + cmd.label + '</div>';
    html += '<div class="cmdk-item-hint">' + cmd.hint + '</div>';
    html += '</div>';
  });
  list.innerHTML = html;
}

function cmdkHover(idx) {
  _cmdkActiveIdx = idx;
  var items = document.querySelectorAll('.cmdk-item');
  items.forEach(function(item, i) {
    item.classList.toggle('cmdk-item-active', i === idx);
  });
}

function cmdkExecute(idx) {
  var cmd = _cmdkFiltered[idx];
  if (!cmd) return;
  cmdkClose();

  if (cmd.section) {
    var nav = document.querySelector('[onclick*="' + cmd.section + '"]');
    if (nav) portalNav(nav, cmd.section);
  } else if (cmd.action === 'home') {
    showPage('home');
  } else if (cmd.action === 'darkmode') {
    var html = document.documentElement;
    var current = html.getAttribute('data-theme');
    html.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark');
    try { localStorage.setItem('ctax_theme', html.getAttribute('data-theme')); } catch (e) { /* ignore */ }
  } else if (cmd.action === 'rp') {
    if (typeof toggleRpCard === 'function') toggleRpCard();
  } else if (cmd.action === 'admaker') {
    portalNav(document.querySelector('[onclick*="portal-sec-ai-admaker"]'),'portal-sec-ai-admaker');
  }
}
