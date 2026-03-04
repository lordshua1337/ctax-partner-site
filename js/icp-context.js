// ── ICP CONTEXT MODULE ─────────────────────────────────────
// Shared ICP context that all portal AI tools consume.
// The ICP Builder saves data here; each tool reads from here.
//
// Schema:
// {
//   icp_title: string,
//   icp_tagline: string,
//   fit_score: 'HIGH' | 'MEDIUM' | 'LOW',
//   commission_range: string,
//   referral_frequency: string,
//   profession_type: string,
//   answers: { q1: string, q2: string, q3: string, q4: string, q5: string, q6: string },
//   sections: { who_they_are: string, red_flags: string, how_to_bring_it_up: string,
//               why_they_convert: string, disqualifiers: string, twelve_week_playbook: string },
//   saved_at: string (ISO date)
// }

var ICP_STORAGE_KEY = 'ctax_icp_profile';

var ICPContext = {
  // Save ICP data to localStorage
  save: function(data) {
    if (!data || !data.icp_title) return false;
    var profile = {
      icp_title: data.icp_title || '',
      icp_tagline: data.icp_tagline || '',
      fit_score: data.fit_score || 'MEDIUM',
      commission_range: data.commission_range || '',
      referral_frequency: data.referral_frequency || '',
      profession_type: data.profession_type || '',
      answers: data.answers || {},
      sections: data.sections || {},
      saved_at: new Date().toISOString()
    };
    try {
      localStorage.setItem(ICP_STORAGE_KEY, JSON.stringify(profile));
      return true;
    } catch (e) {
      console.error('Failed to save ICP profile:', e);
      return false;
    }
  },

  // Load ICP data from localStorage
  load: function() {
    try {
      var raw = localStorage.getItem(ICP_STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      console.error('Failed to load ICP profile:', e);
      return null;
    }
  },

  // Check if an ICP profile exists
  hasProfile: function() {
    return !!localStorage.getItem(ICP_STORAGE_KEY);
  },

  // Clear stored ICP data
  clear: function() {
    localStorage.removeItem(ICP_STORAGE_KEY);
  },

  // Get a summary string for use in AI prompts
  getPromptContext: function() {
    var profile = this.load();
    if (!profile) return '';

    var parts = [
      'PARTNER ICP PROFILE:',
      'Title: ' + profile.icp_title,
      'Tagline: ' + profile.icp_tagline,
      'Fit Score: ' + profile.fit_score,
      'Commission Range: ' + profile.commission_range,
      'Referral Frequency: ' + profile.referral_frequency
    ];

    if (profile.profession_type) {
      parts.push('Profession Type: ' + profile.profession_type);
    }

    if (profile.sections) {
      if (profile.sections.who_they_are) {
        parts.push('\nWHO THEY ARE:\n' + profile.sections.who_they_are);
      }
      if (profile.sections.red_flags) {
        parts.push('\nRED FLAGS:\n' + profile.sections.red_flags);
      }
      if (profile.sections.how_to_bring_it_up) {
        parts.push('\nHOW TO BRING IT UP:\n' + profile.sections.how_to_bring_it_up);
      }
      if (profile.sections.why_they_convert) {
        parts.push('\nWHY THEY CONVERT:\n' + profile.sections.why_they_convert);
      }
      if (profile.sections.disqualifiers) {
        parts.push('\nDISQUALIFIERS:\n' + profile.sections.disqualifiers);
      }
    }

    return parts.join('\n');
  },

  // Render a compact ICP status badge for tool UIs
  renderBadge: function(containerId) {
    var el = document.getElementById(containerId);
    if (!el) return;

    var profile = this.load();
    if (!profile) {
      el.innerHTML =
        '<div style="padding:12px 16px;background:#1a1612;border:1px solid #2a2520;border-radius:8px;margin-bottom:16px;">' +
          '<p style="color:#c8a96e;font-size:13px;margin:0;">No ICP profile loaded.</p>' +
          '<p style="color:#8a8580;font-size:12px;margin:4px 0 0;">Build your ICP profile first, then return here for personalized results.</p>' +
        '</div>';
      return;
    }

    var badgeColor = profile.fit_score === 'HIGH' ? '#4ade80' : (profile.fit_score === 'MEDIUM' ? '#fbbf24' : '#f87171');
    el.innerHTML =
      '<div style="padding:12px 16px;background:#0f1a0f;border:1px solid #166534;border-radius:8px;margin-bottom:16px;display:flex;align-items:center;justify-content:space-between;">' +
        '<div>' +
          '<p style="color:#4ade80;font-size:13px;font-weight:600;margin:0;">ICP Profile Active</p>' +
          '<p style="color:#86efac;font-size:12px;margin:2px 0 0;">' + esc(profile.icp_title) + '</p>' +
        '</div>' +
        '<span style="font-size:11px;padding:3px 8px;border-radius:4px;background:rgba(0,0,0,0.3);color:' + badgeColor + ';font-weight:600;">' +
          esc(profile.fit_score) + ' FIT' +
        '</span>' +
      '</div>';
  }
};

// Helper: escape HTML (reuse if esc() exists globally, otherwise define)
if (typeof esc !== 'function') {
  function esc(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }
}

// ══════════════════════════════════════════
//  M3P1C2: ICP HISTORY + COMPARISON + EXPORT
// ══════════════════════════════════════════

var ICP_HISTORY_KEY = 'ctax_icp_history';

// ── ICP History ──────────────────────────────────────

function icpGetHistory() {
  try { return JSON.parse(localStorage.getItem(ICP_HISTORY_KEY) || '[]'); } catch (e) { return []; }
}

function icpSetHistory(items) {
  try { localStorage.setItem(ICP_HISTORY_KEY, JSON.stringify(items)); } catch (e) {}
}

function icpSaveToHistory(profile) {
  if (!profile || !profile.icp_title) return;
  var history = icpGetHistory();
  var entry = {
    id: 'icp_' + Date.now(),
    profile: JSON.parse(JSON.stringify(profile)),
    saved_at: new Date().toISOString()
  };
  history.unshift(entry);
  if (history.length > 10) history = history.slice(0, 10);
  icpSetHistory(history);
  return entry.id;
}

// Auto-save when ICP builder completes (hook into ICPContext.save)
var _origIcpSave = ICPContext.save;
ICPContext.save = function(data) {
  var result = _origIcpSave.call(ICPContext, data);
  if (result) icpSaveToHistory(data);
  return result;
};

function icpShowHistory() {
  var history = icpGetHistory();
  var overlay = document.createElement('div');
  overlay.className = 'aid-modal-overlay';
  overlay.id = 'icp-hist-modal';
  overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };

  var modal = document.createElement('div');
  modal.className = 'aid-modal';

  var bodyHtml = '';
  if (!history.length) {
    bodyHtml = '<div class="aid-empty-sm">No saved ICP profiles yet. Generate an ICP profile to start building your history.</div>';
  } else {
    history.forEach(function(h, idx) {
      var p = h.profile;
      var date = new Date(h.saved_at).toLocaleDateString();
      var fitColor = p.fit_score === 'HIGH' ? '#059669' : p.fit_score === 'MEDIUM' ? '#F59E0B' : '#EF4444';
      var isActive = ICPContext.hasProfile() && ICPContext.load().saved_at === h.saved_at;

      bodyHtml += '<div class="icp-hist-item' + (isActive ? ' icp-hist-active' : '') + '">'
        + '<div class="icp-hist-header">'
        + '<div>'
        + '<div class="icp-hist-title">' + esc(p.icp_title || 'Untitled Profile') + '</div>'
        + '<div class="icp-hist-meta">' + date + (p.profession_type ? ' &middot; ' + esc(p.profession_type) : '') + '</div>'
        + '</div>'
        + '<div style="display:flex;align-items:center;gap:8px">'
        + '<span class="icp-hist-fit" style="color:' + fitColor + '">' + (p.fit_score || 'N/A') + '</span>'
        + (isActive ? '<span class="icp-hist-badge">Active</span>' : '')
        + '</div>'
        + '</div>'
        + '<div class="icp-hist-tagline">' + esc(p.icp_tagline || '') + '</div>'
        + '<div class="icp-hist-actions">'
        + (isActive ? '' : '<button class="btn btn-s" onclick="icpActivateProfile(' + idx + ')">Set Active</button>')
        + '<button class="btn btn-s" onclick="icpCompareSelect(' + idx + ')">Compare</button>'
        + '<button class="aid-icon-btn" onclick="icpDeleteProfile(' + idx + ')" title="Delete"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg></button>'
        + '</div>'
        + '</div>';
    });
  }

  modal.innerHTML = '<div class="aid-modal-header">'
    + '<div class="aid-modal-title">ICP Profile History</div>'
    + '<button class="aid-modal-close" onclick="document.getElementById(\'icp-hist-modal\').remove()">&times;</button>'
    + '</div>'
    + '<div class="aid-modal-body">' + bodyHtml + '</div>'
    + '<div class="aid-modal-footer">'
    + '<button class="btn btn-g" onclick="document.getElementById(\'icp-hist-modal\').remove()">Close</button>'
    + '</div>';

  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}

function icpActivateProfile(idx) {
  var history = icpGetHistory();
  var entry = history[idx];
  if (!entry) return;
  ICPContext.save(entry.profile);
  var m = document.getElementById('icp-hist-modal');
  if (m) m.remove();
  if (typeof showToast === 'function') showToast('ICP profile activated: ' + entry.profile.icp_title, 'success');
  _icpRenderAllBadges();
}

function icpDeleteProfile(idx) {
  var history = icpGetHistory();
  history.splice(idx, 1);
  icpSetHistory(history);
  var m = document.getElementById('icp-hist-modal');
  if (m) m.remove();
  icpShowHistory();
}

// ── ICP Comparison ──────────────────────────────────────

var _icpCompareA = null;

function icpCompareSelect(idx) {
  if (_icpCompareA === null) {
    _icpCompareA = idx;
    if (typeof showToast === 'function') showToast('Profile selected. Now click "Compare" on a second profile.', 'info');
    return;
  }
  var history = icpGetHistory();
  var a = history[_icpCompareA];
  var b = history[idx];
  _icpCompareA = null;
  if (!a || !b) return;

  var m = document.getElementById('icp-hist-modal');
  if (m) m.remove();
  icpShowComparison(a.profile, b.profile);
}

function icpShowComparison(profA, profB) {
  var overlay = document.createElement('div');
  overlay.className = 'aid-modal-overlay';
  overlay.id = 'icp-compare-modal';
  overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };

  var modal = document.createElement('div');
  modal.className = 'aid-modal';
  modal.style.maxWidth = '800px';

  function fitBadge(score) {
    var c = score === 'HIGH' ? '#059669' : score === 'MEDIUM' ? '#F59E0B' : '#EF4444';
    return '<span style="color:' + c + ';font-weight:700">' + (score || 'N/A') + '</span>';
  }

  function row(label, valA, valB) {
    var match = valA === valB;
    return '<tr class="icp-cmp-row' + (match ? '' : ' icp-cmp-diff') + '">'
      + '<td class="icp-cmp-label">' + label + '</td>'
      + '<td class="icp-cmp-val">' + valA + '</td>'
      + '<td class="icp-cmp-val">' + valB + '</td>'
      + '</tr>';
  }

  var table = '<table class="icp-cmp-table"><thead><tr>'
    + '<th></th>'
    + '<th class="icp-cmp-th">' + esc(profA.icp_title || 'Profile A') + '</th>'
    + '<th class="icp-cmp-th">' + esc(profB.icp_title || 'Profile B') + '</th>'
    + '</tr></thead><tbody>'
    + row('Fit Score', fitBadge(profA.fit_score), fitBadge(profB.fit_score))
    + row('Commission Range', esc(profA.commission_range || 'N/A'), esc(profB.commission_range || 'N/A'))
    + row('Referral Frequency', esc(profA.referral_frequency || 'N/A'), esc(profB.referral_frequency || 'N/A'))
    + row('Profession Type', esc(profA.profession_type || 'N/A'), esc(profB.profession_type || 'N/A'))
    + '</tbody></table>';

  // Section comparison
  var sections = ['who_they_are', 'red_flags', 'how_to_bring_it_up', 'why_they_convert', 'disqualifiers'];
  var sectionLabels = { who_they_are: 'Who They Are', red_flags: 'Red Flags', how_to_bring_it_up: 'Conversation Starters', why_they_convert: 'Why They Convert', disqualifiers: 'Disqualifiers' };
  var secHtml = '';
  sections.forEach(function(s) {
    var aText = (profA.sections && profA.sections[s]) ? profA.sections[s].substring(0, 200) + '...' : 'Not available';
    var bText = (profB.sections && profB.sections[s]) ? profB.sections[s].substring(0, 200) + '...' : 'Not available';
    secHtml += '<div class="icp-cmp-sec">'
      + '<div class="icp-cmp-sec-label">' + sectionLabels[s] + '</div>'
      + '<div class="icp-cmp-sec-row">'
      + '<div class="icp-cmp-sec-col">' + aText + '</div>'
      + '<div class="icp-cmp-sec-col">' + bText + '</div>'
      + '</div></div>';
  });

  modal.innerHTML = '<div class="aid-modal-header">'
    + '<div class="aid-modal-title">Profile Comparison</div>'
    + '<button class="aid-modal-close" onclick="document.getElementById(\'icp-compare-modal\').remove()">&times;</button>'
    + '</div>'
    + '<div class="aid-modal-body">' + table + secHtml + '</div>'
    + '<div class="aid-modal-footer">'
    + '<button class="btn btn-g" onclick="document.getElementById(\'icp-compare-modal\').remove()">Close</button>'
    + '</div>';

  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}

// ── ICP Export ──────────────────────────────────────

function icpExportJSON() {
  var profile = ICPContext.load();
  if (!profile) { if (typeof showToast === 'function') showToast('No ICP profile to export', 'error'); return; }
  var blob = new Blob([JSON.stringify(profile, null, 2)], { type: 'application/json' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'icp-profile-' + (profile.icp_title || 'export').replace(/\s+/g, '-').toLowerCase() + '.json';
  a.click();
  URL.revokeObjectURL(a.href);
  if (typeof showToast === 'function') showToast('ICP profile exported as JSON', 'success');
}

function icpCopyToClipboard() {
  var profile = ICPContext.load();
  if (!profile) { if (typeof showToast === 'function') showToast('No ICP profile to copy', 'error'); return; }
  var text = ICPContext.getPromptContext();
  navigator.clipboard.writeText(text).then(function() {
    if (typeof showToast === 'function') showToast('ICP profile copied to clipboard', 'copied');
  });
}

function icpExportEmailTemplate() {
  var profile = ICPContext.load();
  if (!profile) { if (typeof showToast === 'function') showToast('No ICP profile to export', 'error'); return; }

  var subject = 'My Ideal Client Profile - ' + (profile.icp_title || 'Partner Profile');
  var body = 'ICP PROFILE: ' + (profile.icp_title || '') + '\n\n'
    + 'Tagline: ' + (profile.icp_tagline || '') + '\n'
    + 'Fit Score: ' + (profile.fit_score || '') + '\n'
    + 'Commission Range: ' + (profile.commission_range || '') + '\n'
    + 'Referral Frequency: ' + (profile.referral_frequency || '') + '\n\n'
    + '---\n\nGenerated with Community Tax Partner AI Tools\n'
    + 'partners@communitytax.com | 1-855-332-2873';

  window.open('mailto:?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body));
}

function icpShowExportMenu() {
  var profile = ICPContext.load();
  if (!profile) { if (typeof showToast === 'function') showToast('No ICP profile to export', 'error'); return; }

  var overlay = document.createElement('div');
  overlay.className = 'aid-modal-overlay';
  overlay.id = 'icp-export-modal';
  overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };

  var modal = document.createElement('div');
  modal.className = 'aid-modal';
  modal.style.maxWidth = '440px';

  modal.innerHTML = '<div class="aid-modal-header">'
    + '<div class="aid-modal-title">Export ICP Profile</div>'
    + '<button class="aid-modal-close" onclick="document.getElementById(\'icp-export-modal\').remove()">&times;</button>'
    + '</div>'
    + '<div class="aid-modal-body">'
    + '<div class="icp-export-options">'
    + '<button class="icp-export-btn" onclick="icpCopyToClipboard();document.getElementById(\'icp-export-modal\').remove()">'
    + '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>'
    + '<div><div class="icp-export-btn-title">Copy to Clipboard</div><div class="icp-export-btn-desc">Plain text format for pasting anywhere</div></div>'
    + '</button>'
    + '<button class="icp-export-btn" onclick="icpExportJSON();document.getElementById(\'icp-export-modal\').remove()">'
    + '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>'
    + '<div><div class="icp-export-btn-title">Download JSON</div><div class="icp-export-btn-desc">Machine-readable format for importing later</div></div>'
    + '</button>'
    + '<button class="icp-export-btn" onclick="icpExportEmailTemplate();document.getElementById(\'icp-export-modal\').remove()">'
    + '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22 6 12 13 2 6"/></svg>'
    + '<div><div class="icp-export-btn-title">Email Template</div><div class="icp-export-btn-desc">Opens your email client with profile summary</div></div>'
    + '</button>'
    + '</div>'
    + '</div>';

  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}

// ══════════════════════════════════════════
//  M3P1C2: DYNAMIC ONBOARDING PROGRESS
// ══════════════════════════════════════════

var ONBOARD_KEY = 'ctax_onboard_progress';

var ONBOARD_STEPS = [
  { key: 'profile', label: 'Complete your profile', desc: 'Add your firm name, contact info, and payment details', section: 'portal-sec-settings' },
  { key: 'logo', label: 'Upload your logo', desc: 'Brand your portal and marketing materials', section: 'portal-sec-settings' },
  { key: 'video', label: 'Watch the intro video', desc: '5-minute overview of how the partner program works' },
  { key: 'first_referral', label: 'Submit your first referral', desc: 'Send a client through the referral form', section: 'portal-sec-submit' },
  { key: 'tax_basics', label: 'Complete Tax Resolution Basics', desc: '30-minute training module on OIC, IA, and CNC', section: 'portal-sec-ce' },
  { key: 'payment', label: 'Set up payment method', desc: 'Add your bank details for commission payouts', section: 'portal-sec-settings' },
  { key: 'playbook', label: 'Read the Referral Playbook', desc: 'Learn conversation scripts, objection handling, and follow-up strategies', section: 'portal-sec-playbook' },
  { key: 'growth_plan', label: 'Build your 90-Day Growth Plan', desc: 'Generate a personalized roadmap in the Business Planner', section: 'portal-sec-planner' }
];

function onboardGetProgress() {
  try { return JSON.parse(localStorage.getItem(ONBOARD_KEY) || '{}'); } catch (e) { return {}; }
}

function onboardSetProgress(data) {
  try { localStorage.setItem(ONBOARD_KEY, JSON.stringify(data)); } catch (e) {}
}

function onboardMarkComplete(stepKey) {
  var progress = onboardGetProgress();
  if (progress[stepKey]) return;
  progress[stepKey] = new Date().toISOString();
  onboardSetProgress(progress);
  onboardRender();
  if (typeof showToast === 'function') showToast('Onboarding step completed!', 'success');
}

function onboardRender() {
  var container = document.querySelector('.trn-onboard');
  if (!container) return;

  var progress = onboardGetProgress();
  var completed = 0;
  ONBOARD_STEPS.forEach(function(s) { if (progress[s.key]) completed++; });
  var pct = Math.round((completed / ONBOARD_STEPS.length) * 100);

  var statEl = container.querySelector('.trn-onboard-stat');
  var pctEl = container.querySelector('.trn-onboard-pct');
  var fillEl = container.querySelector('.trn-onboard-fill');

  if (statEl) statEl.textContent = completed + ' of ' + ONBOARD_STEPS.length + ' steps completed';
  if (pctEl) pctEl.textContent = pct + '%';
  if (fillEl) fillEl.style.width = pct + '%';

  var checklistEl = container.querySelector('.trn-checklist');
  if (!checklistEl) return;

  var html = '';
  ONBOARD_STEPS.forEach(function(step) {
    var isDone = !!progress[step.key];
    var clickable = step.section && !isDone;

    html += '<div class="trn-check-item' + (isDone ? ' trn-check-done' : '') + (clickable ? ' trn-check-item-clickable' : '') + '"'
      + (clickable ? ' onclick="portalNav(document.querySelector(\'[onclick*=' + step.section + ']\'),\'' + step.section + '\')"' : '')
      + (!isDone && !clickable ? ' onclick="onboardMarkComplete(\'' + step.key + '\')"' : '')
      + '>'
      + '<div class="trn-check-box">'
      + (isDone ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' : '')
      + '</div>'
      + '<div>'
      + '<div class="trn-check-title">' + step.label + '</div>'
      + '<div class="trn-check-desc">' + step.desc + '</div>'
      + '</div>'
      + '</div>';
  });

  checklistEl.innerHTML = html;

  // Celebration if 100%
  if (pct === 100) {
    var titleEl = container.querySelector('.trn-onboard-title');
    if (titleEl && titleEl.textContent !== 'Onboarding Complete!') {
      titleEl.textContent = 'Onboarding Complete!';
      titleEl.style.color = '#059669';
    }
  }
}

// Init onboarding on DOM ready
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(onboardRender, 500);
});

// Auto-render badges on known containers whenever they appear
var _icpBadgeIds = ['sb-icp-badge', 'res-icp-badge'];
function _icpRenderAllBadges() {
  _icpBadgeIds.forEach(function(id) {
    ICPContext.renderBadge(id);
  });
}
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(_icpRenderAllBadges, 300);
});
// Re-render on SPA navigation
var _origShowPage = window.showPage;
if (typeof _origShowPage === 'function') {
  window.showPage = function(id, skip) {
    _origShowPage(id, skip);
    setTimeout(_icpRenderAllBadges, 200);
  };
}
