// ══════════════════════════════════════════
//  PORTAL NOTIFICATIONS
//  Notification system with achievements,
//  badge updates, and panel rendering
//  Extracted from portal.js for modularity
// ══════════════════════════════════════════

var NOTIF_KEY = 'ctax_notifications';
var NOTIF_MAX = 20;
var NOTIF_DISPLAY_MAX = 12;

// ── DATA ACCESS ─────────────────────────

function getNotifications() {
  try {
    return JSON.parse(localStorage.getItem(NOTIF_KEY) || '[]');
  } catch (e) {
    console.warn('Failed to read notifications:', e.message);
    return [];
  }
}

function addNotification(text, type) {
  type = type || 'info';
  try {
    var notifs = getNotifications();
    notifs.unshift({
      text: text,
      type: type,
      read: false,
      ts: Date.now()
    });
    if (notifs.length > NOTIF_MAX) notifs = notifs.slice(0, NOTIF_MAX);
    localStorage.setItem(NOTIF_KEY, JSON.stringify(notifs));
    updateNotifBadge();
  } catch (e) {
    console.warn('Failed to add notification:', e.message);
  }
}

// ── BADGE ───────────────────────────────

function updateNotifBadge() {
  var notifs = getNotifications();
  var unread = notifs.filter(function(n) { return !n.read; }).length;
  var badge = document.getElementById('portal-notif-badge');
  if (badge) {
    badge.textContent = unread;
    badge.style.display = unread > 0 ? '' : 'none';
  }
}

// ── PANEL RENDERING ─────────────────────

var NOTIF_TYPE_ICONS = {
  'earnings': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>',
  'referral': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>',
  'payout': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>',
  'tool': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
  'challenge': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/></svg>',
  'info': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
};

function renderNotifPanel() {
  var panel = document.getElementById('portal-notif-panel');
  if (!panel) return;
  var notifs = getNotifications();

  // Merge localStorage notifs with static demo notifications
  var staticNotifs = [
    { text: 'Williams case moved to Resolution -- your $2,736 commission is on track.', type: 'earnings', ts: Date.now() - 7200000, read: false },
    { text: 'New payout scheduled: $2,736 on March 1, 2026.', type: 'payout', ts: Date.now() - 18000000, read: false },
    { text: 'Garcia referral assigned to S. Patel for investigation.', type: 'referral', ts: Date.now() - 86400000, read: false },
    { text: 'Thompson case resolved -- $4,224 commission paid.', type: 'earnings', ts: Date.now() - 432000000, read: true },
    { text: 'New CE webinar available: State Tax Compliance.', type: 'info', ts: Date.now() - 604800000, read: true }
  ];

  // Combine, dedup by text, sort by ts
  var allNotifs = notifs.concat(staticNotifs);
  var seen = {};
  allNotifs = allNotifs.filter(function(n) {
    if (seen[n.text]) return false;
    seen[n.text] = true;
    return true;
  });
  allNotifs.sort(function(a, b) { return b.ts - a.ts; });
  allNotifs = allNotifs.slice(0, NOTIF_DISPLAY_MAX);

  var html = '<div class="portal-notif-header">'
    + '<span>Notifications</span>'
    + '<button class="portal-notif-mark" onclick="markAllNotifRead()">Mark all read</button>'
    + '</div>';

  allNotifs.forEach(function(n) {
    var ago = typeof timeAgo === 'function' ? timeAgo(n.ts) : '';
    var icon = NOTIF_TYPE_ICONS[n.type] || NOTIF_TYPE_ICONS.info;
    html += '<div class="portal-notif-item' + (!n.read ? ' portal-notif-item-unread' : '') + '">'
      + '<span class="portal-notif-icon">' + icon + '</span>'
      + n.text
      + '<div class="portal-notif-time">' + ago + '</div>'
      + '</div>';
  });

  panel.innerHTML = html;
  updateNotifBadge();
}

// ── ACTIONS ─────────────────────────────

function markAllNotifRead() {
  try {
    var notifs = getNotifications();
    notifs.forEach(function(n) { n.read = true; });
    localStorage.setItem(NOTIF_KEY, JSON.stringify(notifs));
  } catch (e) {
    console.warn('Failed to mark notifications read:', e.message);
  }
  updateNotifBadge();
  if (typeof showToast === 'function') showToast('All notifications marked as read', 'info');
  renderNotifPanel();
}

// ── ACHIEVEMENTS ────────────────────────

function checkToolAchievements() {
  try {
    var stats = JSON.parse(localStorage.getItem('ctax_tool_stats') || '{}');
    var achieveKey = 'ctax_tool_achievements';
    var achieved = JSON.parse(localStorage.getItem(achieveKey) || '{}');

    var milestones = [
      { tool: 'script-builder', count: 5, msg: 'Achievement: Generated 5 referral scripts!' },
      { tool: 'ad-maker', count: 3, msg: 'Achievement: Created 3 marketing ads!' },
      { tool: 'client-qualifier', count: 5, msg: 'Achievement: Qualified 5 clients!' },
      { tool: 'knowledge-base', count: 10, msg: 'Achievement: Asked 10 knowledge base questions!' }
    ];

    milestones.forEach(function(m) {
      var key = m.tool + '_' + m.count;
      if (stats[m.tool] && stats[m.tool].count >= m.count && !achieved[key]) {
        addNotification(m.msg, 'tool');
        achieved[key] = Date.now();
      }
    });

    localStorage.setItem(achieveKey, JSON.stringify(achieved));
  } catch (e) {
    console.warn('Failed to check tool achievements:', e.message);
  }
}
