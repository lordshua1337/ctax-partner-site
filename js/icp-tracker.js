// ══════════════════════════════════════════
//  M3P1C3: ICP PERFORMANCE TRACKER
//  Analytics dashboard linking ICP profiles
//  to referral quality, conversion rates,
//  seasonal patterns, and proactive coaching
// ══════════════════════════════════════════

var ICPT_STORAGE_KEY = 'ctax_icp_tracker';
var ICPT_REFERRALS_KEY = 'ctax_icp_referrals';

// ── MAIN MODAL ──────────────────────────────────────

function icptShowTracker() {
  var existing = document.getElementById('icpt-overlay');
  if (existing) existing.remove();

  var overlay = document.createElement('div');
  overlay.id = 'icpt-overlay';
  overlay.className = 'icpt-overlay';
  overlay.innerHTML = '<div class="icpt-modal">' +
    '<div class="icpt-header">' +
      '<h2 class="icpt-title">ICP Performance Tracker</h2>' +
      '<p class="icpt-subtitle">Track how your ideal client profile drives real referral results</p>' +
      '<button class="icpt-close" onclick="icptClose()">&times;</button>' +
    '</div>' +
    '<div class="icpt-tabs" id="icpt-tabs">' +
      '<button class="icpt-tab icpt-tab-active" onclick="icptSwitchTab(this,\'icpt-overview\')">Overview</button>' +
      '<button class="icpt-tab" onclick="icptSwitchTab(this,\'icpt-referrals\')">Referral Log</button>' +
      '<button class="icpt-tab" onclick="icptSwitchTab(this,\'icpt-patterns\')">Patterns</button>' +
      '<button class="icpt-tab" onclick="icptSwitchTab(this,\'icpt-coaching\')">AI Coaching</button>' +
    '</div>' +
    '<div class="icpt-body" id="icpt-body"></div>' +
  '</div>';

  document.body.appendChild(overlay);
  requestAnimationFrame(function() { overlay.classList.add('icpt-visible'); });
  icptRenderOverview();
}

function icptClose() {
  var overlay = document.getElementById('icpt-overlay');
  if (overlay) {
    overlay.classList.remove('icpt-visible');
    setTimeout(function() { overlay.remove(); }, 250);
  }
}

function icptSwitchTab(btn, panelId) {
  document.querySelectorAll('.icpt-tab').forEach(function(t) { t.classList.remove('icpt-tab-active'); });
  btn.classList.add('icpt-tab-active');

  if (panelId === 'icpt-overview') icptRenderOverview();
  else if (panelId === 'icpt-referrals') icptRenderReferrals();
  else if (panelId === 'icpt-patterns') icptRenderPatterns();
  else if (panelId === 'icpt-coaching') icptRenderCoaching();
}

// ── DATA LAYER ─────────────────────────────────────

function icptGetReferrals() {
  try { return JSON.parse(localStorage.getItem(ICPT_REFERRALS_KEY)) || []; }
  catch (e) { return []; }
}

function icptSaveReferrals(refs) {
  try { localStorage.setItem(ICPT_REFERRALS_KEY, JSON.stringify(refs)); } catch (e) {}
}

function icptGetProfile() {
  try {
    var raw = localStorage.getItem('ctax_icp_profile');
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}

function icptAddReferral(ref) {
  var refs = icptGetReferrals();
  ref.id = Date.now();
  ref.timestamp = Date.now();
  ref.fit_score = ref.fit_score || icptCalcFitScore(ref);
  refs.unshift(ref);
  if (refs.length > 100) refs = refs.slice(0, 100);
  icptSaveReferrals(refs);
  return ref;
}

function icptCalcFitScore(ref) {
  // Score based on how many ICP criteria the referral matches
  var score = 0;
  var profile = icptGetProfile();
  if (!profile) return 'MEDIUM';

  // Debt amount scoring
  if (ref.debt_amount) {
    var debt = parseInt(ref.debt_amount.replace(/[^0-9]/g, ''));
    if (debt >= 15000) score += 3;
    else if (debt >= 7000) score += 2;
    else score += 1;
  }

  // Urgency scoring
  if (ref.urgency === 'high' || ref.urgency === 'crisis') score += 3;
  else if (ref.urgency === 'medium') score += 2;
  else score += 1;

  // Engagement scoring
  if (ref.engagement === 'ready' || ref.engagement === 'requesting') score += 3;
  else if (ref.engagement === 'interested') score += 2;
  else score += 1;

  // Source match scoring
  if (profile.profession_type && ref.source_type) {
    if (ref.source_type.toLowerCase().indexOf(profile.profession_type.toLowerCase()) !== -1) score += 2;
  }

  if (score >= 9) return 'HIGH';
  if (score >= 5) return 'MEDIUM';
  return 'LOW';
}

// ── OVERVIEW TAB ──────────────────────────────────

function icptRenderOverview() {
  var body = document.getElementById('icpt-body');
  if (!body) return;

  var refs = icptGetReferrals();
  var profile = icptGetProfile();

  // Calculate stats
  var total = refs.length;
  var high = refs.filter(function(r) { return r.fit_score === 'HIGH'; }).length;
  var medium = refs.filter(function(r) { return r.fit_score === 'MEDIUM'; }).length;
  var low = refs.filter(function(r) { return r.fit_score === 'LOW'; }).length;
  var converted = refs.filter(function(r) { return r.status === 'converted'; }).length;
  var pending = refs.filter(function(r) { return r.status === 'pending' || !r.status; }).length;
  var lost = refs.filter(function(r) { return r.status === 'lost'; }).length;
  var convRate = total > 0 ? Math.round((converted / total) * 100) : 0;

  // Conversion by fit score
  var highConv = high > 0 ? Math.round((refs.filter(function(r) { return r.fit_score === 'HIGH' && r.status === 'converted'; }).length / high) * 100) : 0;
  var medConv = medium > 0 ? Math.round((refs.filter(function(r) { return r.fit_score === 'MEDIUM' && r.status === 'converted'; }).length / medium) * 100) : 0;
  var lowConv = low > 0 ? Math.round((refs.filter(function(r) { return r.fit_score === 'LOW' && r.status === 'converted'; }).length / low) * 100) : 0;

  // Estimated earnings
  var avgEarning = 500;
  var totalEarnings = converted * avgEarning;

  var html = '';

  // ICP Profile status
  if (profile) {
    html += '<div class="icpt-profile-card">' +
      '<div class="icpt-profile-badge icpt-badge-' + (profile.fit_score || 'medium').toLowerCase() + '">' + (profile.fit_score || 'MEDIUM') + ' FIT</div>' +
      '<div class="icpt-profile-title">' + icptEsc(profile.icp_title || 'Your ICP') + '</div>' +
      '<div class="icpt-profile-type">' + icptEsc(profile.profession_type || 'Financial Professional') + '</div>' +
    '</div>';
  } else {
    html += '<div class="icpt-no-profile">' +
      '<p>No ICP profile found. Build your ICP first to enable personalized tracking.</p>' +
      '<button class="icpt-btn icpt-btn-primary" onclick="icptClose();portalNav(document.querySelector(\'[onclick*=portal-sec-icp]\'),\'portal-sec-icp\')">Build Your ICP</button>' +
    '</div>';
  }

  // Stats row
  html += '<div class="icpt-stats-row">';
  html += icptStatCard('Total Referrals', total, '', '#0B5FD8');
  html += icptStatCard('Conversion Rate', convRate + '%', total > 0 ? converted + ' of ' + total : 'No data', '#059669');
  html += icptStatCard('High-Fit Referrals', high, total > 0 ? Math.round((high / total) * 100) + '% of total' : '', '#7C3AED');
  html += icptStatCard('Est. Earnings', '$' + totalEarnings.toLocaleString(), converted + ' conversions', '#F59E0B');
  html += '</div>';

  // Conversion by fit score
  html += '<div class="icpt-card">';
  html += '<div class="icpt-card-title">Conversion Rate by ICP Fit Score</div>';
  html += '<div class="icpt-fit-bars">';
  html += icptFitBar('HIGH', highConv, high, '#059669');
  html += icptFitBar('MEDIUM', medConv, medium, '#F59E0B');
  html += icptFitBar('LOW', lowConv, low, '#EF4444');
  html += '</div>';
  html += '</div>';

  // Status distribution
  html += '<div class="icpt-card">';
  html += '<div class="icpt-card-title">Referral Pipeline</div>';
  html += '<div class="icpt-pipeline">';
  html += '<div class="icpt-pipe-stage"><div class="icpt-pipe-count" style="color:#F59E0B">' + pending + '</div><div class="icpt-pipe-label">Pending</div></div>';
  html += '<div class="icpt-pipe-arrow">&#8594;</div>';
  html += '<div class="icpt-pipe-stage"><div class="icpt-pipe-count" style="color:#059669">' + converted + '</div><div class="icpt-pipe-label">Converted</div></div>';
  html += '<div class="icpt-pipe-arrow">&#8594;</div>';
  html += '<div class="icpt-pipe-stage"><div class="icpt-pipe-count" style="color:#EF4444">' + lost + '</div><div class="icpt-pipe-label">Lost</div></div>';
  html += '</div>';
  html += '</div>';

  // Recent referrals preview
  if (refs.length > 0) {
    html += '<div class="icpt-card">';
    html += '<div class="icpt-card-title">Recent Referrals</div>';
    for (var i = 0; i < Math.min(refs.length, 5); i++) {
      var r = refs[i];
      html += '<div class="icpt-ref-row">' +
        '<span class="icpt-ref-badge icpt-badge-' + (r.fit_score || 'medium').toLowerCase() + '">' + (r.fit_score || '?') + '</span>' +
        '<span class="icpt-ref-name">' + icptEsc(r.name || 'Referral #' + (i + 1)) + '</span>' +
        '<span class="icpt-ref-debt">' + icptEsc(r.debt_amount || 'Unknown') + '</span>' +
        '<span class="icpt-ref-status icpt-status-' + (r.status || 'pending') + '">' + (r.status || 'pending') + '</span>' +
        '<span class="icpt-ref-date">' + icptTimeAgo(r.timestamp) + '</span>' +
      '</div>';
    }
    html += '</div>';
  }

  // Add referral button + demo data
  html += '<div class="icpt-actions">';
  html += '<button class="icpt-btn icpt-btn-primary" onclick="icptShowAddForm()">Log New Referral</button>';
  if (refs.length === 0) {
    html += '<button class="icpt-btn" onclick="icptLoadDemoData()">Load Demo Data</button>';
  }
  html += '</div>';

  body.innerHTML = html;
}

function icptStatCard(label, value, sub, color) {
  return '<div class="icpt-stat-card">' +
    '<div class="icpt-stat-value" style="color:' + color + '">' + value + '</div>' +
    '<div class="icpt-stat-label">' + label + '</div>' +
    (sub ? '<div class="icpt-stat-sub">' + sub + '</div>' : '') +
  '</div>';
}

function icptFitBar(label, pct, count, color) {
  return '<div class="icpt-fit-row">' +
    '<span class="icpt-fit-label">' + label + ' (' + count + ')</span>' +
    '<div class="icpt-fit-track"><div class="icpt-fit-fill" style="width:' + Math.max(pct, 2) + '%;background:' + color + '"></div></div>' +
    '<span class="icpt-fit-pct">' + pct + '%</span>' +
  '</div>';
}

// ── ADD REFERRAL FORM ─────────────────────────────

function icptShowAddForm() {
  var body = document.getElementById('icpt-body');
  if (!body) return;

  var html = '<div class="icpt-form">';
  html += '<div class="icpt-card-title">Log New Referral</div>';

  html += '<div class="icpt-form-row">';
  html += '<div class="icpt-form-group"><label class="icpt-label">Client Name</label><input type="text" id="icpt-ref-name" class="icpt-input" placeholder="John Smith"></div>';
  html += '<div class="icpt-form-group"><label class="icpt-label">Estimated Debt</label><input type="text" id="icpt-ref-debt" class="icpt-input" placeholder="$25,000"></div>';
  html += '</div>';

  html += '<div class="icpt-form-row">';
  html += '<div class="icpt-form-group"><label class="icpt-label">Source Type</label><select id="icpt-ref-source" class="icpt-input"><option value="cpa">CPA/Tax Preparer</option><option value="attorney">Attorney</option><option value="advisor">Financial Advisor</option><option value="mortgage">Mortgage Broker</option><option value="insurance">Insurance Agent</option><option value="self">Self-Referral</option><option value="other">Other</option></select></div>';
  html += '<div class="icpt-form-group"><label class="icpt-label">Urgency Level</label><select id="icpt-ref-urgency" class="icpt-input"><option value="low">Low -- no IRS notices</option><option value="medium">Medium -- received notices</option><option value="high">High -- levy/garnishment imminent</option><option value="crisis">Crisis -- active levy/lien</option></select></div>';
  html += '</div>';

  html += '<div class="icpt-form-row">';
  html += '<div class="icpt-form-group"><label class="icpt-label">Client Engagement</label><select id="icpt-ref-engagement" class="icpt-input"><option value="hesitant">Hesitant</option><option value="interested">Interested</option><option value="ready">Ready to Act</option><option value="requesting">Requesting Help</option></select></div>';
  html += '<div class="icpt-form-group"><label class="icpt-label">IRS Issues</label><select id="icpt-ref-issues" class="icpt-input"><option value="back-taxes">Back Taxes</option><option value="unfiled">Unfiled Returns</option><option value="garnishment">Wage Garnishment</option><option value="levy">Bank Levy</option><option value="lien">Tax Lien</option><option value="audit">IRS Audit</option><option value="multiple">Multiple Issues</option></select></div>';
  html += '</div>';

  html += '<div class="icpt-form-group"><label class="icpt-label">Notes</label><textarea id="icpt-ref-notes" class="icpt-input" rows="3" placeholder="Additional context about this referral..."></textarea></div>';

  html += '<div class="icpt-actions">';
  html += '<button class="icpt-btn" onclick="icptRenderOverview()">Cancel</button>';
  html += '<button class="icpt-btn icpt-btn-primary" onclick="icptSaveNewReferral()">Log Referral</button>';
  html += '</div>';
  html += '</div>';

  body.innerHTML = html;
}

function icptSaveNewReferral() {
  var name = document.getElementById('icpt-ref-name');
  var debt = document.getElementById('icpt-ref-debt');
  var source = document.getElementById('icpt-ref-source');
  var urgency = document.getElementById('icpt-ref-urgency');
  var engagement = document.getElementById('icpt-ref-engagement');
  var issues = document.getElementById('icpt-ref-issues');
  var notes = document.getElementById('icpt-ref-notes');

  if (!name || !name.value.trim()) {
    if (typeof showToast === 'function') showToast('Enter the client name', 'error');
    return;
  }

  var ref = {
    name: name.value.trim(),
    debt_amount: debt ? debt.value.trim() : '',
    source_type: source ? source.value : '',
    urgency: urgency ? urgency.value : 'medium',
    engagement: engagement ? engagement.value : 'interested',
    issues: issues ? issues.value : '',
    notes: notes ? notes.value.trim() : '',
    status: 'pending'
  };

  icptAddReferral(ref);
  if (typeof showToast === 'function') showToast('Referral logged -- ' + ref.fit_score + ' fit score', 'copied');
  icptRenderOverview();
}

// ── REFERRAL LOG TAB ──────────────────────────────

function icptRenderReferrals() {
  var body = document.getElementById('icpt-body');
  if (!body) return;

  var refs = icptGetReferrals();

  var html = '<div class="icpt-card">';
  html += '<div class="icpt-card-header-row">';
  html += '<div class="icpt-card-title">All Referrals (' + refs.length + ')</div>';
  html += '<div class="icpt-filter-row">';
  html += '<select id="icpt-filter-score" class="icpt-input icpt-input-sm" onchange="icptFilterReferrals()"><option value="all">All Scores</option><option value="HIGH">HIGH</option><option value="MEDIUM">MEDIUM</option><option value="LOW">LOW</option></select>';
  html += '<select id="icpt-filter-status" class="icpt-input icpt-input-sm" onchange="icptFilterReferrals()"><option value="all">All Status</option><option value="pending">Pending</option><option value="converted">Converted</option><option value="lost">Lost</option></select>';
  html += '</div>';
  html += '</div>';

  html += '<div id="icpt-ref-list">';
  html += icptBuildRefList(refs);
  html += '</div>';
  html += '</div>';

  html += '<div class="icpt-actions">';
  html += '<button class="icpt-btn icpt-btn-primary" onclick="icptShowAddForm()">Log New Referral</button>';
  html += '<button class="icpt-btn" onclick="icptExportCSV()">Export CSV</button>';
  html += '</div>';

  body.innerHTML = html;
}

function icptBuildRefList(refs) {
  if (refs.length === 0) return '<div class="icpt-empty">No referrals logged yet. Log your first referral to start tracking.</div>';

  var html = '';
  for (var i = 0; i < refs.length; i++) {
    var r = refs[i];
    html += '<div class="icpt-ref-card">' +
      '<div class="icpt-ref-top">' +
        '<span class="icpt-ref-badge icpt-badge-' + (r.fit_score || 'medium').toLowerCase() + '">' + (r.fit_score || '?') + '</span>' +
        '<span class="icpt-ref-name">' + icptEsc(r.name || 'Unknown') + '</span>' +
        '<span class="icpt-ref-debt">' + icptEsc(r.debt_amount || '?') + '</span>' +
        '<span class="icpt-ref-date">' + icptTimeAgo(r.timestamp) + '</span>' +
      '</div>' +
      '<div class="icpt-ref-bottom">' +
        '<span class="icpt-ref-detail">' + icptEsc(r.source_type || '') + '</span>' +
        '<span class="icpt-ref-detail">' + icptEsc(r.issues || '') + '</span>' +
        '<span class="icpt-ref-detail">Urgency: ' + icptEsc(r.urgency || '?') + '</span>' +
        '<div class="icpt-ref-status-btns">' +
          '<button class="icpt-status-btn icpt-status-btn-pending' + (r.status === 'pending' || !r.status ? ' active' : '') + '" onclick="icptUpdateStatus(' + i + ',\'pending\')">Pending</button>' +
          '<button class="icpt-status-btn icpt-status-btn-converted' + (r.status === 'converted' ? ' active' : '') + '" onclick="icptUpdateStatus(' + i + ',\'converted\')">Converted</button>' +
          '<button class="icpt-status-btn icpt-status-btn-lost' + (r.status === 'lost' ? ' active' : '') + '" onclick="icptUpdateStatus(' + i + ',\'lost\')">Lost</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }
  return html;
}

function icptFilterReferrals() {
  var scoreFilter = document.getElementById('icpt-filter-score');
  var statusFilter = document.getElementById('icpt-filter-status');
  var score = scoreFilter ? scoreFilter.value : 'all';
  var status = statusFilter ? statusFilter.value : 'all';

  var refs = icptGetReferrals();
  if (score !== 'all') refs = refs.filter(function(r) { return r.fit_score === score; });
  if (status !== 'all') refs = refs.filter(function(r) { return (r.status || 'pending') === status; });

  var list = document.getElementById('icpt-ref-list');
  if (list) list.innerHTML = icptBuildRefList(refs);
}

function icptUpdateStatus(idx, status) {
  var refs = icptGetReferrals();
  if (refs[idx]) {
    refs[idx].status = status;
    icptSaveReferrals(refs);
    icptRenderReferrals();
    if (typeof showToast === 'function') showToast('Status updated to ' + status, 'copied');
  }
}

function icptExportCSV() {
  var refs = icptGetReferrals();
  if (refs.length === 0) {
    if (typeof showToast === 'function') showToast('No referrals to export', 'error');
    return;
  }

  var csv = 'Name,Debt Amount,Source,Urgency,Engagement,Issues,Fit Score,Status,Date,Notes\n';
  for (var i = 0; i < refs.length; i++) {
    var r = refs[i];
    csv += '"' + (r.name || '') + '","' + (r.debt_amount || '') + '","' + (r.source_type || '') + '","' + (r.urgency || '') + '","' + (r.engagement || '') + '","' + (r.issues || '') + '","' + (r.fit_score || '') + '","' + (r.status || 'pending') + '","' + new Date(r.timestamp || Date.now()).toLocaleDateString() + '","' + (r.notes || '').replace(/"/g, '""') + '"\n';
  }

  var blob = new Blob([csv], { type: 'text/csv' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'icp-referrals-' + new Date().toISOString().slice(0, 10) + '.csv';
  a.click();
  URL.revokeObjectURL(url);
}

// ── PATTERNS TAB ──────────────────────────────────

function icptRenderPatterns() {
  var body = document.getElementById('icpt-body');
  if (!body) return;

  var refs = icptGetReferrals();
  if (refs.length < 3) {
    body.innerHTML = '<div class="icpt-empty" style="padding:40px;text-align:center"><p>Log at least 3 referrals to see conversion patterns.</p><button class="icpt-btn icpt-btn-primary" onclick="icptLoadDemoData();icptRenderPatterns()">Load Demo Data</button></div>';
    return;
  }

  var html = '';

  // Source breakdown
  var sourceMap = {};
  refs.forEach(function(r) {
    var key = r.source_type || 'unknown';
    if (!sourceMap[key]) sourceMap[key] = { total: 0, converted: 0, high: 0 };
    sourceMap[key].total++;
    if (r.status === 'converted') sourceMap[key].converted++;
    if (r.fit_score === 'HIGH') sourceMap[key].high++;
  });

  html += '<div class="icpt-card">';
  html += '<div class="icpt-card-title">Referral Sources</div>';
  html += '<div class="icpt-pattern-table">';
  html += '<div class="icpt-pt-header"><span>Source</span><span>Total</span><span>Converted</span><span>Conv %</span><span>High Fit %</span></div>';
  Object.keys(sourceMap).sort(function(a, b) { return sourceMap[b].total - sourceMap[a].total; }).forEach(function(key) {
    var s = sourceMap[key];
    var convPct = Math.round((s.converted / s.total) * 100);
    var highPct = Math.round((s.high / s.total) * 100);
    html += '<div class="icpt-pt-row">' +
      '<span class="icpt-pt-source">' + icptEsc(key) + '</span>' +
      '<span>' + s.total + '</span>' +
      '<span>' + s.converted + '</span>' +
      '<span style="color:' + (convPct >= 50 ? '#059669' : convPct >= 25 ? '#F59E0B' : '#EF4444') + '">' + convPct + '%</span>' +
      '<span style="color:' + (highPct >= 50 ? '#059669' : '#F59E0B') + '">' + highPct + '%</span>' +
    '</div>';
  });
  html += '</div></div>';

  // Monthly volume
  var monthMap = {};
  refs.forEach(function(r) {
    var d = new Date(r.timestamp || Date.now());
    var key = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
    if (!monthMap[key]) monthMap[key] = { total: 0, converted: 0 };
    monthMap[key].total++;
    if (r.status === 'converted') monthMap[key].converted++;
  });

  var months = Object.keys(monthMap).sort();
  html += '<div class="icpt-card">';
  html += '<div class="icpt-card-title">Monthly Volume</div>';
  html += '<div class="icpt-chart-bars">';
  var maxVol = Math.max.apply(null, months.map(function(m) { return monthMap[m].total; }));
  months.forEach(function(m) {
    var vol = monthMap[m];
    var height = maxVol > 0 ? Math.round((vol.total / maxVol) * 100) : 0;
    var convHeight = maxVol > 0 ? Math.round((vol.converted / maxVol) * 100) : 0;
    var label = m.split('-')[1] + '/' + m.split('-')[0].slice(2);
    html += '<div class="icpt-chart-col">' +
      '<div class="icpt-chart-bar-wrap">' +
        '<div class="icpt-chart-bar icpt-bar-total" style="height:' + height + '%"></div>' +
        '<div class="icpt-chart-bar icpt-bar-conv" style="height:' + convHeight + '%"></div>' +
      '</div>' +
      '<div class="icpt-chart-label">' + label + '</div>' +
      '<div class="icpt-chart-val">' + vol.total + '</div>' +
    '</div>';
  });
  html += '</div>';
  html += '<div class="icpt-chart-legend"><span class="icpt-legend-item"><span class="icpt-legend-dot" style="background:#0B5FD8"></span> Total</span><span class="icpt-legend-item"><span class="icpt-legend-dot" style="background:#059669"></span> Converted</span></div>';
  html += '</div>';

  // Issue type breakdown
  var issueMap = {};
  refs.forEach(function(r) {
    var key = r.issues || 'unknown';
    if (!issueMap[key]) issueMap[key] = { total: 0, converted: 0 };
    issueMap[key].total++;
    if (r.status === 'converted') issueMap[key].converted++;
  });

  html += '<div class="icpt-card">';
  html += '<div class="icpt-card-title">Issue Type Performance</div>';
  Object.keys(issueMap).sort(function(a, b) { return issueMap[b].total - issueMap[a].total; }).forEach(function(key) {
    var s = issueMap[key];
    var pct = Math.round((s.converted / s.total) * 100);
    html += '<div class="icpt-fit-row">' +
      '<span class="icpt-fit-label" style="min-width:120px">' + icptEsc(key) + ' (' + s.total + ')</span>' +
      '<div class="icpt-fit-track"><div class="icpt-fit-fill" style="width:' + Math.max(pct, 2) + '%;background:' + (pct >= 50 ? '#059669' : pct >= 25 ? '#F59E0B' : '#EF4444') + '"></div></div>' +
      '<span class="icpt-fit-pct">' + pct + '%</span>' +
    '</div>';
  });
  html += '</div>';

  body.innerHTML = html;
}

// ── COACHING TAB ──────────────────────────────────

function icptRenderCoaching() {
  var body = document.getElementById('icpt-body');
  if (!body) return;

  var refs = icptGetReferrals();
  var profile = icptGetProfile();
  var insights = icptAnalyzePerformance(refs, profile);

  var html = '<div class="icpt-card">';
  html += '<div class="icpt-card-title">AI Performance Coaching</div>';
  html += '<p class="icpt-card-desc">Based on your referral data and ICP profile, here are actionable recommendations.</p>';
  html += '</div>';

  // Score card
  var overallScore = icptCalcOverallScore(refs);
  html += '<div class="icpt-score-card">';
  html += '<div class="icpt-score-circle" style="--score:' + overallScore + '">';
  html += '<span class="icpt-score-num">' + overallScore + '</span>';
  html += '</div>';
  html += '<div class="icpt-score-text">';
  html += '<div class="icpt-score-label">ICP Performance Score</div>';
  html += '<div class="icpt-score-desc">' + (overallScore >= 80 ? 'Excellent -- your ICP is driving strong results' : overallScore >= 60 ? 'Good -- room for improvement in targeting' : overallScore >= 40 ? 'Developing -- consider refining your ICP' : 'Needs work -- your ICP may need a major update') + '</div>';
  html += '</div>';
  html += '</div>';

  // Insights
  for (var i = 0; i < insights.length; i++) {
    var insight = insights[i];
    html += '<div class="icpt-insight icpt-insight-' + insight.type + '">' +
      '<div class="icpt-insight-icon">' + (insight.type === 'success' ? '&#10003;' : insight.type === 'warning' ? '!' : '&#9733;') + '</div>' +
      '<div class="icpt-insight-body">' +
        '<div class="icpt-insight-title">' + icptEsc(insight.title) + '</div>' +
        '<div class="icpt-insight-text">' + icptEsc(insight.text) + '</div>' +
      '</div>' +
    '</div>';
  }

  // AI deep analysis button
  html += '<div class="icpt-actions" style="margin-top:20px">';
  html += '<button class="icpt-btn icpt-btn-primary" onclick="icptAiAnalysis()">Generate AI Deep Analysis</button>';
  html += '</div>';

  html += '<div id="icpt-ai-result"></div>';

  body.innerHTML = html;
}

function icptCalcOverallScore(refs) {
  if (refs.length === 0) return 0;

  var score = 0;
  var total = refs.length;
  var high = refs.filter(function(r) { return r.fit_score === 'HIGH'; }).length;
  var converted = refs.filter(function(r) { return r.status === 'converted'; }).length;

  // High fit ratio (40 points max)
  score += Math.round((high / total) * 40);
  // Conversion rate (40 points max)
  score += Math.round((converted / total) * 40);
  // Volume bonus (20 points max, scales to 20 referrals)
  score += Math.min(Math.round((total / 20) * 20), 20);

  return Math.min(score, 100);
}

function icptAnalyzePerformance(refs, profile) {
  var insights = [];

  if (refs.length === 0) {
    insights.push({ type: 'tip', title: 'Get Started', text: 'Log your first referral to begin tracking ICP performance. Even a few data points help identify patterns.' });
    return insights;
  }

  var total = refs.length;
  var high = refs.filter(function(r) { return r.fit_score === 'HIGH'; }).length;
  var converted = refs.filter(function(r) { return r.status === 'converted'; }).length;
  var highConv = refs.filter(function(r) { return r.fit_score === 'HIGH' && r.status === 'converted'; }).length;

  var highPct = Math.round((high / total) * 100);
  var convPct = Math.round((converted / total) * 100);

  // High fit ratio insight
  if (highPct >= 60) {
    insights.push({ type: 'success', title: 'Strong ICP Alignment', text: highPct + '% of your referrals are HIGH fit. Your ICP is well-defined and you are targeting the right clients.' });
  } else if (highPct < 30) {
    insights.push({ type: 'warning', title: 'Low ICP Match Rate', text: 'Only ' + highPct + '% of referrals match your ICP. Consider refining your ICP or adjusting how you identify potential clients.' });
  }

  // Conversion insight
  if (convPct >= 50) {
    insights.push({ type: 'success', title: 'Strong Conversion', text: convPct + '% conversion rate is excellent. Your screening process is effective.' });
  } else if (convPct < 20 && total >= 5) {
    insights.push({ type: 'warning', title: 'Low Conversion Rate', text: 'Only ' + convPct + '% of referrals are converting. Focus on better qualifying clients before referral.' });
  }

  // High fit vs low fit conversion comparison
  if (high > 0 && highConv > 0) {
    var highConvRate = Math.round((highConv / high) * 100);
    if (highConvRate > convPct + 10) {
      insights.push({ type: 'tip', title: 'ICP Fit Predicts Conversion', text: 'HIGH fit referrals convert at ' + highConvRate + '% vs. ' + convPct + '% overall. Focus on finding more clients who match your ICP criteria.' });
    }
  }

  // Source diversity
  var sources = {};
  refs.forEach(function(r) { sources[r.source_type || 'unknown'] = true; });
  if (Object.keys(sources).length < 3 && total >= 5) {
    insights.push({ type: 'tip', title: 'Diversify Your Sources', text: 'You are only using ' + Object.keys(sources).length + ' referral source type(s). Expanding to more professional types can increase volume.' });
  }

  // Volume insight
  if (total < 5) {
    insights.push({ type: 'tip', title: 'Build Your Pipeline', text: 'With only ' + total + ' referral(s), patterns are not yet reliable. Aim for 10+ referrals for meaningful insights.' });
  } else if (total >= 20) {
    insights.push({ type: 'success', title: 'Strong Volume', text: total + ' referrals logged. You have enough data for reliable pattern analysis.' });
  }

  return insights;
}

async function icptAiAnalysis() {
  var resultEl = document.getElementById('icpt-ai-result');
  if (!resultEl) return;

  var refs = icptGetReferrals();
  var profile = icptGetProfile();
  var apiAvailable = typeof CTAX_API_URL !== 'undefined' && typeof getApiHeaders === 'function';

  if (!apiAvailable || refs.length === 0) {
    resultEl.innerHTML = '<div class="icpt-card" style="margin-top:16px"><p>AI analysis requires at least one logged referral and API access.</p></div>';
    return;
  }

  resultEl.innerHTML = '<div class="icpt-card" style="margin-top:16px"><div class="icpt-spinner"></div><p style="text-align:center">Analyzing your referral performance...</p></div>';

  // Prepare data summary
  var total = refs.length;
  var high = refs.filter(function(r) { return r.fit_score === 'HIGH'; }).length;
  var converted = refs.filter(function(r) { return r.status === 'converted'; }).length;
  var sources = {};
  refs.forEach(function(r) {
    var key = r.source_type || 'unknown';
    if (!sources[key]) sources[key] = 0;
    sources[key]++;
  });

  var prompt = 'Analyze this referral partner performance data and provide 5 specific, actionable recommendations:\n\n' +
    'Total referrals: ' + total + '\n' +
    'HIGH fit: ' + high + ' (' + Math.round((high / total) * 100) + '%)\n' +
    'Converted: ' + converted + ' (' + Math.round((converted / total) * 100) + '%)\n' +
    'Sources: ' + JSON.stringify(sources) + '\n' +
    (profile ? 'ICP: ' + profile.icp_title + ' (' + profile.profession_type + ')\n' : '') +
    '\nProvide 5 numbered recommendations. Each should be specific and actionable. Focus on improving conversion rate, finding better-fit clients, and maximizing earnings.';

  try {
    var resp = await fetch(CTAX_API_URL, {
      method: 'POST',
      headers: getApiHeaders(),
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }]
      })
    });
    var data = await resp.json();
    if (data.content && data.content[0] && data.content[0].text) {
      resultEl.innerHTML = '<div class="icpt-card" style="margin-top:16px"><div class="icpt-card-title">AI Deep Analysis</div><div class="icpt-ai-text">' + icptFormatText(data.content[0].text) + '</div></div>';
    } else {
      resultEl.innerHTML = '<div class="icpt-card" style="margin-top:16px"><p>Analysis could not be generated. Try again later.</p></div>';
    }
  } catch (e) {
    resultEl.innerHTML = '<div class="icpt-card" style="margin-top:16px"><p>Failed to connect to AI. Check your connection and try again.</p></div>';
  }
}

// ── DEMO DATA ──────────────────────────────────────

function icptLoadDemoData() {
  var demos = [
    { name: 'Robert Chen', debt_amount: '$45,000', source_type: 'cpa', urgency: 'high', engagement: 'ready', issues: 'back-taxes', status: 'converted', fit_score: 'HIGH', timestamp: Date.now() - 86400000 * 2 },
    { name: 'Maria Gonzalez', debt_amount: '$22,000', source_type: 'attorney', urgency: 'medium', engagement: 'interested', issues: 'unfiled', status: 'converted', fit_score: 'HIGH', timestamp: Date.now() - 86400000 * 5 },
    { name: 'James Wilson', debt_amount: '$8,000', source_type: 'advisor', urgency: 'low', engagement: 'hesitant', issues: 'back-taxes', status: 'lost', fit_score: 'LOW', timestamp: Date.now() - 86400000 * 8 },
    { name: 'Sarah Thompson', debt_amount: '$67,000', source_type: 'cpa', urgency: 'crisis', engagement: 'requesting', issues: 'levy', status: 'converted', fit_score: 'HIGH', timestamp: Date.now() - 86400000 * 12 },
    { name: 'David Park', debt_amount: '$15,000', source_type: 'mortgage', urgency: 'medium', engagement: 'interested', issues: 'lien', status: 'pending', fit_score: 'MEDIUM', timestamp: Date.now() - 86400000 * 15 },
    { name: 'Lisa Anderson', debt_amount: '$31,000', source_type: 'cpa', urgency: 'high', engagement: 'ready', issues: 'garnishment', status: 'converted', fit_score: 'HIGH', timestamp: Date.now() - 86400000 * 20 },
    { name: 'Michael Brown', debt_amount: '$4,500', source_type: 'self', urgency: 'low', engagement: 'hesitant', issues: 'back-taxes', status: 'lost', fit_score: 'LOW', timestamp: Date.now() - 86400000 * 25 },
    { name: 'Jennifer Lee', debt_amount: '$28,000', source_type: 'attorney', urgency: 'high', engagement: 'ready', issues: 'multiple', status: 'converted', fit_score: 'HIGH', timestamp: Date.now() - 86400000 * 30 },
    { name: 'Chris Martinez', debt_amount: '$12,000', source_type: 'insurance', urgency: 'medium', engagement: 'interested', issues: 'unfiled', status: 'pending', fit_score: 'MEDIUM', timestamp: Date.now() - 86400000 * 35 },
    { name: 'Amanda White', debt_amount: '$55,000', source_type: 'cpa', urgency: 'crisis', engagement: 'requesting', issues: 'levy', status: 'converted', fit_score: 'HIGH', timestamp: Date.now() - 86400000 * 40 },
    { name: 'Kevin Davis', debt_amount: '$19,000', source_type: 'advisor', urgency: 'medium', engagement: 'interested', issues: 'back-taxes', status: 'pending', fit_score: 'MEDIUM', timestamp: Date.now() - 86400000 * 45 },
    { name: 'Rachel Kim', debt_amount: '$38,000', source_type: 'cpa', urgency: 'high', engagement: 'ready', issues: 'garnishment', status: 'converted', fit_score: 'HIGH', timestamp: Date.now() - 86400000 * 50 }
  ];

  for (var i = 0; i < demos.length; i++) {
    demos[i].id = Date.now() - (i * 86400000);
    demos[i].notes = '';
  }

  icptSaveReferrals(demos);
  if (typeof showToast === 'function') showToast('12 demo referrals loaded', 'copied');
  icptRenderOverview();
}

// ── UTILITIES ──────────────────────────────────────

function icptFormatText(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/^\d+\.\s/gm, '<br><strong>$&</strong>')
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>');
}

function icptEsc(str) {
  if (!str) return '';
  var div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function icptTimeAgo(ts) {
  if (!ts) return '';
  var diff = Date.now() - ts;
  var mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return mins + 'm ago';
  var hrs = Math.floor(mins / 60);
  if (hrs < 24) return hrs + 'h ago';
  var days = Math.floor(hrs / 24);
  return days + 'd ago';
}
