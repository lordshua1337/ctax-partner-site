// --- Referrals interactions ---
function toggleRefDetail(row) {
  if (event && event.target.closest('.ref-act')) return;
  if (event && event.target.closest('.ref-cb')) return;
  row.classList.toggle('ref-row-open');
  // On mobile, scroll tapped row to top of viewport
  if (window.matchMedia('(max-width:768px)').matches && row.classList.contains('ref-row-open')) {
    setTimeout(function() {
      row.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 120);
  }
}

function setRefFilter(btn, status) {
  document.querySelectorAll('.ref-filter-pill').forEach(function(p) { p.classList.remove('ref-fp-active'); });
  btn.classList.add('ref-fp-active');
  var visibleCount = 0;
  document.querySelectorAll('.ref-row').forEach(function(row) {
    if (status === 'all' || row.getAttribute('data-status') === status) {
      row.style.display = '';
      visibleCount++;
    } else {
      row.style.display = 'none';
      row.classList.remove('ref-row-open');
    }
  });
  refShowEmpty(visibleCount === 0);
}

function filterReferrals() {
  var q = (document.getElementById('ref-search').value || '').toLowerCase();
  var visibleCount = 0;
  document.querySelectorAll('.ref-row').forEach(function(row) {
    var visible = row.textContent.toLowerCase().indexOf(q) !== -1;
    row.style.display = visible ? '' : 'none';
    if (visible) visibleCount++;
  });
  if (q) {
    document.querySelectorAll('.ref-filter-pill').forEach(function(p) { p.classList.remove('ref-fp-active'); });
  }
  refShowEmpty(visibleCount === 0);
}

function refShowEmpty(show) {
  var el = document.getElementById('ref-empty-state');
  if (el) el.style.display = show ? 'flex' : 'none';
}

function clearRefFilters() {
  var search = document.getElementById('ref-search');
  if (search) search.value = '';
  var allPill = document.querySelector('.ref-filter-pill');
  if (allPill) setRefFilter(allPill, 'all');
}

// --- KPI card detail expand ---
function toggleKpiDetail(card, panelId) {
  var panel = document.getElementById(panelId);
  if (!panel) return;
  var allCards = document.querySelectorAll('.ref-kpi');
  var allPanels = document.querySelectorAll('.ref-kpi-detail');
  var isOpen = card.classList.contains('ref-kpi-active');

  // Close all
  allCards.forEach(function(c) { c.classList.remove('ref-kpi-active'); });
  allPanels.forEach(function(p) {
    p.style.maxHeight = '0';
    p.classList.remove('ref-kpi-detail-open');
  });

  // Toggle open if wasn't already
  if (!isOpen) {
    card.classList.add('ref-kpi-active');
    panel.classList.add('ref-kpi-detail-open');
    panel.style.maxHeight = panel.scrollHeight + 'px';
  }
}

// --- Referral pipeline click filter ---
function pipelineFilter(status) {
  var pills = document.querySelectorAll('.ref-filter-pill');
  pills.forEach(function(p) {
    if (p.textContent.toLowerCase().indexOf(status) !== -1) {
      setRefFilter(p, status);
    }
  });
}

// --- Referral sort ---
var refSortState = {};
function refSort(field) {
  var rows = Array.from(document.querySelectorAll('.ref-row'));
  var asc = refSortState[field] !== 'asc';
  refSortState[field] = asc ? 'asc' : 'desc';

  rows.sort(function(a, b) {
    var av, bv;
    if (field === 'date') {
      av = new Date(a.querySelectorAll('.ref-td')[1].textContent);
      bv = new Date(b.querySelectorAll('.ref-td')[1].textContent);
    } else if (field === 'debt') {
      av = parseFloat(a.querySelector('.ref-td-money').textContent.replace(/[$,]/g, '')) || 0;
      bv = parseFloat(b.querySelector('.ref-td-money').textContent.replace(/[$,]/g, '')) || 0;
    }
    return asc ? av - bv : bv - av;
  });

  var parent = rows[0].parentElement;
  rows.forEach(function(r) { parent.appendChild(r); });
}

// --- Referral bulk actions ---
function refToggleAll(master) {
  document.querySelectorAll('.ref-row-cb').forEach(function(cb) {
    cb.checked = master.checked;
  });
  refUpdateBulk();
}

function refUpdateBulk() {
  var checked = document.querySelectorAll('.ref-row-cb:checked').length;
  var bar = document.getElementById('ref-bulk-bar');
  var count = document.getElementById('ref-bulk-count');
  if (bar) bar.classList.toggle('ref-bulk-visible', checked > 0);
  if (count) count.textContent = checked + ' selected';
}

function refBulkExport() {
  var rows = document.querySelectorAll('.ref-row-cb:checked');
  if (rows.length === 0) return;
  showToast(rows.length + ' referral(s) exported', 'success');
}

// --- Portal navigation ---
function portalNav(el, secId) {
  document.querySelectorAll('.portal-nav-item').forEach(function(a) { a.classList.remove('pni-active'); });
  el.classList.add('pni-active');

  // Fade transition between sections
  var currentSec = document.querySelector('.portal-sec-active');
  var nextSec = document.getElementById(secId);
  if (currentSec && nextSec && currentSec !== nextSec) {
    currentSec.classList.add('portal-sec-exit');
    setTimeout(function() {
      document.querySelectorAll('.portal-section').forEach(function(s) {
        s.classList.remove('portal-sec-active');
        s.classList.remove('portal-sec-exit');
      });
      nextSec.classList.add('portal-sec-active');
      nextSec.classList.add('portal-sec-enter');
      setTimeout(function() { nextSec.classList.remove('portal-sec-enter'); }, 250);
    }, 120);
  } else {
    document.querySelectorAll('.portal-section').forEach(function(s) { s.classList.remove('portal-sec-active'); });
    if (nextSec) nextSec.classList.add('portal-sec-active');
  }
  var sec = nextSec;

  document.querySelector('.portal-sidebar').classList.remove('portal-sb-open');
  document.querySelector('.portal-main').scrollTo(0, 0);

  // Lazy-init animations on section reveal
  if (secId === 'portal-sec-earnings') initEarningsAnimation();
  if (secId === 'portal-sec-ce') initCeRingAnimation();
  if (secId === 'portal-sec-tunes') {
    if (typeof buildTunesGrid === 'function') buildTunesGrid();
    // Auto-enable tunes bar when visiting the section
    var tunesToggle = document.getElementById('tunes-toggle');
    var tunesBar = document.getElementById('jazz-bar');
    if (tunesToggle && !tunesToggle.classList.contains('tunes-on')) {
      tunesToggle.classList.add('tunes-on');
      if (tunesBar) tunesBar.classList.add('jazz-visible');
      if (typeof adjustFabForTunes === 'function') adjustFabForTunes(true);
      if (typeof playStation === 'function' && !_jazzPlaying) playStation(_jazzStation);
      localStorage.setItem('ctax_tunes', '1');
    }
  }

  if (secId === 'portal-sec-challenge') {
    if (typeof chInit === 'function') chInit();
  }
  // Destroy page builder editor when navigating away, init when entering
  // Toggle immersive mode for page builder
  if (secId === 'portal-sec-page-builder') {
    document.body.classList.add('pb-immersive');
    if (typeof pbInit === 'function') pbInit();
  } else {
    document.body.classList.remove('pb-immersive');
    if (typeof pbDestroy === 'function') pbDestroy();
  }
  // Render My Pages gallery when entering that section
  if (secId === 'portal-sec-my-pages') {
    if (typeof pgRender === 'function') {
      pgRender();
    } else if (typeof pbRenderMyPages === 'function') {
      pbRenderMyPages();
    }
  }
  // Render Page Metrics dashboard
  if (secId === 'portal-sec-page-metrics') {
    if (typeof pmRenderDashboard === 'function') pmRenderDashboard();
  }

  // Pro gate check (shows overlay on locked sections)
  if (typeof proCheckGate === 'function') proCheckGate(secId);

  // Entrance animation for section content
  if (sec) portalAnimateEntrance(sec);

  // Sync mobile bottom nav highlight
  mobNavSync(secId);

  // Update breadcrumb
  if (typeof updateBreadcrumb === 'function') updateBreadcrumb(secId);

  // Update topbar quick tips
  if (typeof updateQuickTips === 'function') updateQuickTips(secId);
}

function portalAnimateEntrance(sec) {
  var targets = sec.querySelectorAll('.portal-sec-header, .pb-stats, .pb-streak, .pb-tabs, .pb-quiz, .bp-form-grid, .bp-callout, .dash-kpi-row, .dash-table, .dash-activity-feed, .dash-quick-links, .bp-insights-row, .bp-whatif, .bp-month, .wb-card, .qa-bar, .dash-score-modules-row, .dash-leaderboard, .dash-pipeline, .dash-goal-tracker, .dash-insights-banner');
  var delay = 0;
  targets.forEach(function(el) {
    if (el.dataset.entered) return;
    el.dataset.entered = '1';
    el.style.opacity = '0';
    el.style.transform = 'translateY(12px)';
    el.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
    (function(target, d) {
      setTimeout(function() {
        target.style.opacity = '1';
        target.style.transform = 'translateY(0)';
      }, d);
    })(el, delay);
    delay += 50;
  });
}


// ═══ DASHBOARD COMMAND CENTER (M3P1C1) ═══

// --- Partner Score System ---
// Composite 0-100 score: Challenge (30) + Tools (20) + Referrals (30) + Pages (10) + Profile (10)
function calcPartnerScore() {
  var score = { challenge: 0, tools: 0, referrals: 0, pages: 0, profile: 0, total: 0 };

  // Challenge progress (max 30 pts)
  try {
    var chState = JSON.parse(localStorage.getItem('ch_30day_v1') || '{}');
    var completed = chState.completedDays ? Object.keys(chState.completedDays).filter(function(k) { return chState.completedDays[k]; }).length : 0;
    score.challenge = Math.min(30, Math.round((completed / 30) * 30));
  } catch (e) {}

  // Tool usage (max 20 pts) -- 5 per tool, cap at 20
  try {
    var stats = JSON.parse(localStorage.getItem('ctax_tool_stats') || '{}');
    var toolCount = 0;
    ['script-builder', 'ad-maker', 'client-qualifier', 'knowledge-base'].forEach(function(t) {
      if (stats[t] && stats[t].count > 0) toolCount++;
    });
    score.tools = toolCount * 5;
  } catch (e) {}

  // Referrals (max 30 pts) -- demo: 12 referrals = 30 pts at 10+
  score.referrals = Math.min(30, Math.round((12 / 10) * 30));

  // Pages published (max 10 pts)
  try {
    var pages = JSON.parse(localStorage.getItem('ctax_pb_pages') || '[]');
    var published = pages.filter(function(p) { return p.published; }).length;
    score.pages = Math.min(10, published * 5);
  } catch (e) {}

  // Profile completion (max 10 pts) -- check if brand uploaded + ICP
  var hasBrand = document.querySelector('.portal-brand-loaded') ? 5 : 0;
  var hasICP = (typeof ICPContext !== 'undefined' && ICPContext.hasProfile()) ? 5 : 0;
  score.profile = hasBrand + hasICP;

  score.total = score.challenge + score.tools + score.referrals + score.pages + score.profile;
  return score;
}

function renderPartnerScore(containerId) {
  var el = document.getElementById(containerId);
  if (!el) return;
  var score = calcPartnerScore();
  var pct = score.total;
  var circumference = 2 * Math.PI * 54;
  var offset = circumference - (pct / 100) * circumference;
  var color = pct >= 80 ? '#22c55e' : pct >= 60 ? '#0B5FD8' : pct >= 40 ? '#eab308' : '#f97316';

  var breakdown = [
    { label: 'Challenge', val: score.challenge, max: 30 },
    { label: 'AI Tools', val: score.tools, max: 20 },
    { label: 'Referrals', val: score.referrals, max: 30 },
    { label: 'Pages', val: score.pages, max: 10 },
    { label: 'Profile', val: score.profile, max: 10 }
  ];

  var barsHtml = '';
  breakdown.forEach(function(b) {
    var w = Math.round((b.val / b.max) * 100);
    barsHtml += '<div class="ps-breakdown-row">'
      + '<span class="ps-breakdown-label">' + b.label + '</span>'
      + '<div class="ps-breakdown-track"><div class="ps-breakdown-fill" style="width:' + w + '%;background:' + color + '"></div></div>'
      + '<span class="ps-breakdown-val">' + b.val + '/' + b.max + '</span>'
      + '</div>';
  });

  el.innerHTML = '<div class="ps-card">'
    + '<div class="ps-ring-wrap">'
    + '<svg class="ps-ring" width="130" height="130" viewBox="0 0 130 130">'
    + '<circle cx="65" cy="65" r="54" fill="none" stroke="var(--off2)" stroke-width="7"/>'
    + '<circle cx="65" cy="65" r="54" fill="none" stroke="' + color + '" stroke-width="7" stroke-linecap="round" stroke-dasharray="' + circumference.toFixed(2) + '" stroke-dashoffset="' + offset.toFixed(2) + '" transform="rotate(-90 65 65)" style="transition:stroke-dashoffset 1s ease"/>'
    + '</svg>'
    + '<div class="ps-ring-center">'
    + '<div class="ps-ring-val" style="color:' + color + '">' + pct + '</div>'
    + '<div class="ps-ring-label">Partner Score</div>'
    + '</div>'
    + '</div>'
    + '<div class="ps-breakdown">' + barsHtml + '</div>'
    + '</div>';
}

// --- Module Progress Dashboard ---
function renderModuleProgress(containerId) {
  var el = document.getElementById(containerId);
  if (!el) return;

  // Challenge data
  var chCompleted = 0, chStreak = 0, chDay = 1;
  try {
    var chState = JSON.parse(localStorage.getItem('ch_30day_v1') || '{}');
    if (chState.completedDays) {
      chCompleted = Object.keys(chState.completedDays).filter(function(k) { return chState.completedDays[k]; }).length;
    }
    chStreak = chState.streak || 0;
    chDay = chState.currentDay || 1;
  } catch (e) {}

  // Tool stats
  var toolTotal = 0;
  try {
    var stats = JSON.parse(localStorage.getItem('ctax_tool_stats') || '{}');
    ['script-builder', 'ad-maker', 'client-qualifier', 'knowledge-base'].forEach(function(t) {
      if (stats[t]) toolTotal += stats[t].count;
    });
  } catch (e) {}

  // Pages
  var pageCount = 0, publishedCount = 0;
  try {
    var pages = JSON.parse(localStorage.getItem('ctax_pb_pages') || '[]');
    pageCount = pages.length;
    publishedCount = pages.filter(function(p) { return p.published; }).length;
  } catch (e) {}

  // Business planner
  var hasPlan = false;
  try {
    hasPlan = !!localStorage.getItem('ctax_bp_roadmap');
  } catch (e) {}

  var modules = [
    {
      icon: '<path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>',
      label: '30-Day Challenge',
      stat: 'Day ' + chDay + ' / 30',
      detail: chCompleted + ' tasks done, ' + chStreak + ' day streak',
      pct: Math.round((chCompleted / 30) * 100),
      color: '#8b5cf6',
      action: "portalNav(document.querySelector('[onclick*=portal-sec-challenge]'),'portal-sec-challenge')"
    },
    {
      icon: '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>',
      label: 'AI Tools',
      stat: toolTotal + ' generations',
      detail: 'Scripts, ads, qualifications & searches',
      pct: Math.min(100, toolTotal * 10),
      color: '#0B5FD8',
      action: "portalNav(document.querySelector('[onclick*=portal-sec-ai-scripts]'),'portal-sec-ai-scripts')"
    },
    {
      icon: '<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/>',
      label: 'Page Builder',
      stat: pageCount + ' page' + (pageCount !== 1 ? 's' : '') + ' created',
      detail: publishedCount + ' published',
      pct: Math.min(100, pageCount * 25),
      color: '#06b6d4',
      action: "portalNav(document.querySelector('[onclick*=portal-sec-page-builder]'),'portal-sec-page-builder')"
    },
    {
      icon: '<path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/>',
      label: 'Business Plan',
      stat: hasPlan ? 'Roadmap active' : 'Not started',
      detail: hasPlan ? 'Track your 90-day growth' : 'Generate your growth roadmap',
      pct: hasPlan ? 50 : 0,
      color: '#f59e0b',
      action: "portalNav(document.querySelector('[onclick*=portal-sec-planner]'),'portal-sec-planner')"
    }
  ];

  var html = '<div class="mp-header">'
    + '<div class="mp-title">Module Progress</div>'
    + '<div class="mp-subtitle">Your activity across portal modules</div>'
    + '</div>'
    + '<div class="mp-grid">';

  modules.forEach(function(m) {
    html += '<button class="mp-card" onclick="' + m.action + '">'
      + '<div class="mp-card-top">'
      + '<div class="mp-card-icon" style="background:' + m.color + '10;color:' + m.color + '">'
      + '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + m.icon + '</svg>'
      + '</div>'
      + '<div class="mp-card-pct" style="color:' + m.color + '">' + m.pct + '%</div>'
      + '</div>'
      + '<div class="mp-card-label">' + m.label + '</div>'
      + '<div class="mp-card-stat">' + m.stat + '</div>'
      + '<div class="mp-card-detail">' + m.detail + '</div>'
      + '<div class="mp-card-bar"><div class="mp-card-bar-fill" style="width:' + m.pct + '%;background:' + m.color + '"></div></div>'
      + '</button>';
  });

  html += '</div>';
  el.innerHTML = html;
}

// --- Live Activity Feed ---
function renderLiveActivity(containerId) {
  var el = document.getElementById(containerId);
  if (!el) return;

  var events = [];

  // Pull from tool history (localStorage)
  try {
    var history = JSON.parse(localStorage.getItem('ctax_tool_history') || '[]');
    var toolLabels = {
      'script-builder': { verb: 'Generated a script', dot: 'blue', icon: 'edit' },
      'ad-maker': { verb: 'Created an ad', dot: 'cyan', icon: 'image' },
      'client-qualifier': { verb: 'Qualified a client', dot: 'green', icon: 'search' },
      'knowledge-base': { verb: 'Searched knowledge base', dot: 'purple', icon: 'book' }
    };
    history.slice(0, 8).forEach(function(h) {
      var meta = toolLabels[h.tool] || { verb: 'Used a tool', dot: 'blue', icon: 'zap' };
      events.push({
        text: '<strong>' + meta.verb + '</strong>: ' + (h.label || '').replace(/</g, '&lt;'),
        dot: meta.dot,
        ts: h.timestamp
      });
    });
  } catch (e) {}

  // Pull from challenge state
  try {
    var chState = JSON.parse(localStorage.getItem('ch_30day_v1') || '{}');
    if (chState.completedDays) {
      var completedKeys = Object.keys(chState.completedDays).filter(function(k) { return chState.completedDays[k]; });
      if (completedKeys.length > 0) {
        events.push({
          text: 'Completed <strong>' + completedKeys.length + ' challenge tasks</strong> so far',
          dot: 'purple',
          ts: Date.now() - 3600000 // approximate
        });
      }
    }
  } catch (e) {}

  // Static referral events (always present in demo)
  var staticEvents = [
    { text: 'You earned <strong>$2,736</strong> from the Williams case commission.', dot: 'green', ts: Date.now() - 7200000 },
    { text: 'Garcia referral moved to <strong>Investigation</strong> status.', dot: 'blue', ts: Date.now() - 86400000 },
    { text: 'New payout scheduled: <strong>$2,736</strong> on March 1, 2026.', dot: 'amber', ts: Date.now() - 172800000 },
    { text: 'Thompson case resolved -- $4,224 commission <strong>paid</strong>.', dot: 'green', ts: Date.now() - 432000000 }
  ];
  events = events.concat(staticEvents);

  // Sort by timestamp descending, take first 8
  events.sort(function(a, b) { return b.ts - a.ts; });
  events = events.slice(0, 8);

  if (!events.length) return;

  var html = '<div class="dash-activity-title">Live Activity</div>';
  events.forEach(function(ev) {
    var ago = typeof timeAgo === 'function' ? timeAgo(ev.ts) : '';
    html += '<div class="dash-activity-item">'
      + '<div class="dash-activity-dot dash-activity-dot-' + ev.dot + '"></div>'
      + '<span>' + ev.text + '</span>'
      + '<span class="dash-activity-time">' + ago + '</span>'
      + '</div>';
  });
  el.innerHTML = html;
}

// --- Quick Action Command Bar ---
function renderQuickActions(containerId) {
  var el = document.getElementById(containerId);
  if (!el) return;

  var actions = [
    {
      label: 'Submit Referral',
      desc: 'Send a new client to CTAX',
      icon: '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/>',
      color: '#DC2626',
      section: 'portal-sec-submit'
    },
    {
      label: 'Create Script',
      desc: 'AI referral scripts',
      icon: '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>',
      color: '#0B5FD8',
      section: 'portal-sec-ai-scripts'
    },
    {
      label: 'Build Page',
      desc: 'Landing page builder',
      icon: '<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/>',
      color: '#06b6d4',
      section: 'portal-sec-page-builder'
    },
    {
      label: 'Qualify Client',
      desc: 'AI qualification check',
      icon: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
      color: '#22c55e',
      section: 'portal-sec-ai-qualifier'
    },
    {
      label: 'Growth Plan',
      desc: '90-day business roadmap',
      icon: '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>',
      color: '#f59e0b',
      section: 'portal-sec-planner'
    },
    {
      label: 'AI Pipeline',
      desc: 'Chain all tools together',
      icon: '<circle cx="12" cy="12" r="10"/><path d="M8 12l2 2 4-4"/>',
      color: '#8b5cf6',
      onclick: 'if(typeof showPipelineModal==="function")showPipelineModal()'
    }
  ];

  var html = '<div class="qa-bar">';
  actions.forEach(function(a) {
    var clickHandler = a.onclick
      ? a.onclick
      : "portalNav(document.querySelector('[onclick*=" + a.section + "]'),'" + a.section + "')";
    html += '<button class="qa-btn" onclick="' + clickHandler + '">'
      + '<div class="qa-icon" style="background:' + a.color + '12;color:' + a.color + '">'
      + '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + a.icon + '</svg>'
      + '</div>'
      + '<div class="qa-text">'
      + '<div class="qa-label">' + a.label + '</div>'
      + '<div class="qa-desc">' + a.desc + '</div>'
      + '</div>'
      + '</button>';
  });
  html += '</div>';
  el.innerHTML = html;
}

// --- Welcome Banner with Status Summary ---
function renderWelcomeBanner(containerId) {
  var el = document.getElementById(containerId);
  if (!el) return;

  var h = new Date().getHours();
  var greeting = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';

  // Get practice type from ICP if available
  var practiceType = '';
  try {
    if (typeof ICPContext !== 'undefined' && ICPContext.hasProfile()) {
      var profile = ICPContext.load();
      practiceType = profile.profession_type || '';
    }
  } catch (e) {}

  // Status nuggets
  var nuggets = [];

  // Challenge status
  try {
    var chState = JSON.parse(localStorage.getItem('ch_30day_v1') || '{}');
    var chDay = chState.currentDay || 0;
    if (chDay > 0 && chDay <= 30) {
      nuggets.push({ icon: '<path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/>', text: 'Day ' + chDay + ' of your 30-Day Challenge', color: '#8b5cf6' });
    }
  } catch (e) {}

  // Pending referrals
  nuggets.push({ icon: '<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>', text: '3 referrals awaiting review', color: '#f59e0b' });

  // Recent tool usage
  try {
    var stats = JSON.parse(localStorage.getItem('ctax_tool_stats') || '{}');
    var totalUses = 0;
    Object.keys(stats).forEach(function(k) { totalUses += stats[k].count || 0; });
    if (totalUses > 0) {
      nuggets.push({ icon: '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>', text: totalUses + ' AI tool generations this month', color: '#0B5FD8' });
    }
  } catch (e) {}

  var nuggetsHtml = '';
  nuggets.forEach(function(n) {
    nuggetsHtml += '<div class="wb-nugget">'
      + '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="' + n.color + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + n.icon + '</svg>'
      + '<span>' + n.text + '</span>'
      + '</div>';
  });

  el.innerHTML = '<div class="wb-card">'
    + '<div class="wb-left">'
    + '<div class="wb-greeting">' + greeting + ', Josh</div>'
    + (practiceType ? '<div class="wb-practice">' + practiceType + '</div>' : '')
    + '<div class="wb-summary">Here\'s what\'s happening in your partner portal today.</div>'
    + '</div>'
    + '<div class="wb-right">'
    + nuggetsHtml
    + '</div>'
    + '</div>';
}

// --- Initialize all dashboard upgrades ---
function initDashboardCommandCenter() {
  renderWelcomeBanner('dash-welcome-banner');
  renderQuickActions('dash-quick-actions');
  renderPartnerScore('dash-partner-score');
  renderModuleProgress('dash-module-progress');
  renderLiveActivity('dash-live-activity');
}

// --- Partner brand ---
function initPortalBrand() {
  var input = document.getElementById('portal-logo-input');
  var preview = document.getElementById('portal-brand-preview');
  var label = document.getElementById('portal-brand-text');
  var drop = document.getElementById('portal-brand-drop');
  if (!input || input._wired) return;
  input._wired = true;

  input.addEventListener('change', function() {
    var file = input.files && input.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(e) {
      var dataUrl = e.target.result;
      showLogo(dataUrl);
      updateCobrandStatus(true);
      extractColors(dataUrl, function(colors) {
        if (colors.length > 1) {
          showColorPicker(colors, dataUrl);
        } else {
          applyAccent(colors[0]);
        }
      });
    };
    reader.readAsDataURL(file);
  });

  function showLogo(url) {
    preview.innerHTML = '<img src="' + url + '" alt="Logo" style="max-width:100%;max-height:100%;object-fit:contain;border-radius:4px">';
    label.textContent = 'Change logo';
    drop.classList.add('portal-brand-loaded');
  }

  function showColorPicker(colors, logoUrl) {
    var old = document.getElementById('portal-color-picker');
    if (old) old.remove();
    var picker = document.createElement('div');
    picker.id = 'portal-color-picker';
    picker.className = 'portal-cpicker';
    picker.innerHTML = '<div class="portal-cpicker-title">Pick your brand color</div><div class="portal-cpicker-swatches" id="portal-cpicker-swatches"></div>';
    var swatches = picker.querySelector('#portal-cpicker-swatches');
    colors.forEach(function(color) {
      var btn = document.createElement('button');
      btn.className = 'portal-cpicker-swatch';
      btn.style.background = color;
      btn.onclick = function() {
        applyAccent(color);
        picker.remove();
      };
      swatches.appendChild(btn);
    });
    drop.parentElement.appendChild(picker);
  }

  function applyAccent(color) {
    var layout = document.querySelector('.portal-layout');
    if (!layout) return;
    var rgb = hexToRgb(color);
    layout.style.setProperty('--pa', color);
    layout.style.setProperty('--pa-rgb', rgb.r + ',' + rgb.g + ',' + rgb.b);
    layout.classList.add('portal-branded');
    var picker = document.getElementById('portal-color-picker');
    if (picker) picker.remove();
  }

  function extractColors(dataUrl, cb) {
    var img = new Image();
    img.onload = function() {
      var c = document.createElement('canvas');
      c.width = 64; c.height = 64;
      var ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0, 64, 64);
      var px = ctx.getImageData(0, 0, 64, 64).data;
      var buckets = {};
      for (var i = 0; i < px.length; i += 8) {
        var r = px[i], g = px[i+1], b = px[i+2], a = px[i+3];
        if (a < 128) continue;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var l = (max + min) / 2;
        if (l < 25 || l > 235) continue;
        var d = max - min;
        var s = d === 0 ? 0 : d / (1 - Math.abs(2 * l / 255 - 1));
        if (s < 50) continue;
        var h = 0;
        if (d > 0) {
          if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
          else if (max === g) h = ((b - r) / d + 2) * 60;
          else h = ((r - g) / d + 4) * 60;
        }
        var bucket = Math.floor(h / 30) * 30;
        if (!buckets[bucket]) buckets[bucket] = { count: 0, totalS: 0, bestS: 0, bestColor: '' };
        buckets[bucket].count++;
        buckets[bucket].totalS += s;
        if (s > buckets[bucket].bestS) {
          buckets[bucket].bestS = s;
          buckets[bucket].bestColor = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        }
      }
      var sorted = Object.keys(buckets).map(function(k) {
        return { hue: k, count: buckets[k].count, color: buckets[k].bestColor, s: buckets[k].bestS };
      }).sort(function(a, b) { return b.count - a.count; });
      if (sorted.length === 0) { cb(['#888888']); return; }
      var results = [sorted[0].color];
      if (sorted.length > 1 && sorted[1].count > sorted[0].count * 0.25) {
        var hueDiff = Math.abs(parseInt(sorted[0].hue) - parseInt(sorted[1].hue));
        if (hueDiff > 30 || hueDiff === 0) {
          if (hueDiff >= 60 || (360 - hueDiff) >= 60) {
            results.push(sorted[1].color);
          }
        }
      }
      cb(results);
    };
    img.src = dataUrl;
  }

  function hexToRgb(hex) {
    var m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return m ? { r: parseInt(m[1],16), g: parseInt(m[2],16), b: parseInt(m[3],16) } : { r: 136, g: 136, b: 136 };
  }
}

// --- Submit Referral multi-step form ---
var subCurrentStep = 1;
var subTotalSteps = 4;

function subFormNav(dir) {
  // If moving forward, validate current step
  if (dir === 1 && subCurrentStep < subTotalSteps) {
    if (!validateSubStep(subCurrentStep)) return;
  }

  // If on last step and clicking submit
  if (dir === 1 && subCurrentStep === subTotalSteps) {
    submitReferral();
    return;
  }

  var next = subCurrentStep + dir;
  if (next < 1 || next > subTotalSteps) return;

  // Populate review on step 4
  if (next === 4) populateReview();

  var curPanel = document.getElementById('sub-panel-' + subCurrentStep);
  var nextPanel = document.getElementById('sub-panel-' + next);
  if (curPanel) curPanel.classList.remove('sub-panel-active');
  if (nextPanel) nextPanel.classList.add('sub-panel-active');

  var steps = document.querySelectorAll('.sub-step');
  var fills = [
    document.getElementById('sub-fill-1'),
    document.getElementById('sub-fill-2'),
    document.getElementById('sub-fill-3')
  ];

  steps.forEach(function(step) {
    var stepNum = parseInt(step.getAttribute('data-step'));
    step.classList.remove('sub-step-active', 'sub-step-done');
    if (stepNum < next) step.classList.add('sub-step-done');
    else if (stepNum === next) step.classList.add('sub-step-active');
  });

  fills.forEach(function(fill, i) {
    if (!fill) return;
    fill.style.width = next > (i + 1) ? '100%' : '0';
  });

  subCurrentStep = next;

  var backBtn = document.getElementById('sub-btn-back');
  var nextBtn = document.getElementById('sub-btn-next');
  if (backBtn) backBtn.style.visibility = subCurrentStep === 1 ? 'hidden' : 'visible';
  if (nextBtn) {
    if (subCurrentStep === subTotalSteps) {
      nextBtn.textContent = 'Submit Referral';
      nextBtn.classList.add('sub-btn-submit');
    } else {
      nextBtn.textContent = 'Continue';
      nextBtn.classList.remove('sub-btn-submit');
    }
  }

  var formWrap = document.querySelector('.sub-form-wrap');
  if (formWrap) formWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function validateSubStep(step) {
  var panel = document.getElementById('sub-panel-' + step);
  if (!panel) return true;
  var valid = true;
  panel.querySelectorAll('[data-required]').forEach(function(field) {
    var input = field.querySelector('input, select');
    if (!input) return;
    var val = input.value.trim();
    if (!val) {
      field.classList.add('sub-field-invalid');
      valid = false;
    } else {
      field.classList.remove('sub-field-invalid');
    }
  });
  return valid;
}

function populateReview() {
  var first = (document.getElementById('sub-first-name') || {}).value || '';
  var last = (document.getElementById('sub-last-name') || {}).value || '';
  var phone = (document.getElementById('sub-phone') || {}).value || '';
  var email = (document.getElementById('sub-email') || {}).value || '';
  var debt = (document.getElementById('sub-debt') || {}).value || '';
  var debtType = (document.getElementById('sub-debt-type') || {}).value || '';

  var years = [];
  var checkGroups = document.querySelectorAll('#sub-panel-2 .sub-checkboxes');
  if (checkGroups[0]) {
    checkGroups[0].querySelectorAll('input:checked').forEach(function(cb) {
      years.push(cb.parentElement.textContent.trim());
    });
  }

  var notices = [];
  if (checkGroups[1]) {
    checkGroups[1].querySelectorAll('input:checked').forEach(function(cb) {
      notices.push(cb.parentElement.textContent.trim());
    });
  }

  var setEl = function(id, val) {
    var el = document.getElementById(id);
    if (el) el.textContent = val || '--';
  };

  setEl('sub-rev-name', first && last ? first + ' ' + last : '--');
  setEl('sub-rev-phone', phone || '--');
  setEl('sub-rev-email', email || '--');
  setEl('sub-rev-location', 'See form');
  setEl('sub-rev-debt', debt ? '$' + debt : '--');
  setEl('sub-rev-type', debtType || '--');
  setEl('sub-rev-years', years.length ? years.join(', ') : '--');
  setEl('sub-rev-notices', notices.length ? notices.join(', ') : '--');
}

function submitReferral() {
  // Show success state
  document.querySelector('.sub-form-wrap').style.display = 'none';
  document.querySelector('.sub-steps').style.display = 'none';
  document.getElementById('sub-nav').style.display = 'none';
  document.getElementById('sub-success').classList.add('sub-success-active');
  var refNum = 'REF-2026-' + String(Math.floor(Math.random() * 9000) + 1000).padStart(4, '0');
  document.getElementById('sub-success-id').textContent = 'Referral #' + refNum + ' submitted successfully.';
  showToast('Referral submitted successfully!', 'success');
  // Fire celebration confetti
  if (typeof fireConfetti === 'function') fireConfetti();
  // Update gamification streak
  if (typeof updateStreak === 'function') updateStreak();
}

function resetSubForm() {
  document.querySelector('.sub-form-wrap').style.display = '';
  document.querySelector('.sub-steps').style.display = '';
  document.getElementById('sub-nav').style.display = '';
  document.getElementById('sub-success').classList.remove('sub-success-active');
  // Reset to step 1
  subCurrentStep = 1;
  document.querySelectorAll('.sub-panel').forEach(function(p) { p.classList.remove('sub-panel-active'); });
  document.getElementById('sub-panel-1').classList.add('sub-panel-active');
  document.querySelectorAll('.sub-step').forEach(function(s) {
    s.classList.remove('sub-step-active', 'sub-step-done');
    if (s.getAttribute('data-step') === '1') s.classList.add('sub-step-active');
  });
  document.querySelectorAll('.sub-step-fill').forEach(function(f) { f.style.width = '0'; });
  document.getElementById('sub-btn-back').style.visibility = 'hidden';
  var nextBtn = document.getElementById('sub-btn-next');
  nextBtn.textContent = 'Continue';
  nextBtn.classList.remove('sub-btn-submit');
  // Clear inputs
  document.querySelectorAll('#portal-sec-submit .sub-input, #portal-sec-submit .sub-textarea, #portal-sec-submit .sub-select').forEach(function(el) {
    if (el.tagName === 'SELECT') el.selectedIndex = 0;
    else el.value = '';
  });
  document.querySelectorAll('#portal-sec-submit input[type=checkbox]').forEach(function(cb) { cb.checked = false; });
  document.querySelectorAll('.sub-field-invalid').forEach(function(f) { f.classList.remove('sub-field-invalid'); });
}

// --- Phone auto-format ---
function formatPhone(input) {
  var digits = input.value.replace(/\D/g, '');
  if (digits.length === 0) { input.value = ''; return; }
  if (digits.length <= 3) { input.value = '(' + digits; return; }
  if (digits.length <= 6) { input.value = '(' + digits.slice(0, 3) + ') ' + digits.slice(3); return; }
  input.value = '(' + digits.slice(0, 3) + ') ' + digits.slice(3, 6) + '-' + digits.slice(6, 10);
}

// --- Revenue Calculator ---
var _portalTier = 'direct';
var _portalTierConfig = {
  direct:     { rate: 8,  refMax: 20,  refDefault: 5,  name: 'Direct',     next: 'Enterprise', nextRate: 13 },
  enterprise: { rate: 13, refMax: 50,  refDefault: 15, name: 'Enterprise', next: 'Strategic',  nextRate: 18 },
  strategic:  { rate: 18, refMax: 100, refDefault: 30, name: 'Strategic',  next: null,         nextRate: null }
};

function setCalcTier(btn, tier) {
  document.querySelectorAll('.calc-tier-pill').forEach(function(p) { p.classList.remove('calc-tier-pill-active'); });
  btn.classList.add('calc-tier-pill-active');
  _portalTier = tier;

  var cfg = _portalTierConfig[tier];
  var sl = document.getElementById('calc-ref');
  if (sl) {
    sl.min = 1;
    sl.max = cfg.refMax;
    sl.value = cfg.refDefault;
  }
  var lblMin = document.getElementById('calc-ref-min');
  var lblMid = document.getElementById('calc-ref-mid');
  var lblMax = document.getElementById('calc-ref-max');
  if (lblMin) lblMin.textContent = '1';
  if (lblMid) lblMid.textContent = Math.round(cfg.refMax / 2);
  if (lblMax) lblMax.textContent = cfg.refMax;

  // Lock commission rate slider to tier rate
  var rateSl = document.getElementById('calc-rate');
  if (rateSl) rateSl.value = cfg.rate;

  calcProjection();
}

function calcProjection() {
  var cfg = _portalTierConfig[_portalTier];
  var refs = parseInt(document.getElementById('calc-ref').value) || 5;
  var debt = parseInt(document.getElementById('calc-debt').value) || 25000;
  var rate = cfg.rate;

  document.getElementById('calc-ref-val').textContent = refs;
  document.getElementById('calc-debt-val').textContent = '$' + debt.toLocaleString();
  document.getElementById('calc-rate-val').textContent = rate + '%';

  // Sync rate slider to tier
  var rateSl = document.getElementById('calc-rate');
  if (rateSl && parseInt(rateSl.value) !== rate) rateSl.value = rate;

  var monthly = refs * debt * (rate / 100);
  var annual = monthly * 12;
  var threeYr = annual * 3;

  animateCalcValue('calc-monthly', monthly);
  animateCalcValue('calc-annual', annual);
  animateCalcValue('calc-3yr', threeYr);

  // Tier comparison
  var currentAnnual = annual;
  var curName = document.getElementById('calc-tier-current-name');
  var curPct = document.getElementById('calc-tier-current-pct');
  if (curName) curName.textContent = cfg.name;
  if (curPct) curPct.textContent = rate + '% commission';
  document.getElementById('calc-tier-current').textContent = '$' + Math.round(currentAnnual).toLocaleString() + '/yr';

  var nextName = document.getElementById('calc-tier-next-name');
  var nextPct = document.getElementById('calc-tier-next-pct');
  var diffEl = document.getElementById('calc-tier-diff');

  if (cfg.next) {
    var nextAnnual = refs * debt * (cfg.nextRate / 100) * 12;
    if (nextName) nextName.textContent = cfg.next;
    if (nextPct) nextPct.textContent = cfg.nextRate + '% commission';
    document.getElementById('calc-tier-next').textContent = '$' + Math.round(nextAnnual).toLocaleString() + '/yr';
    document.getElementById('calc-tier-bonus').textContent = '$' + Math.round(nextAnnual - currentAnnual).toLocaleString();
    if (diffEl) diffEl.innerHTML = 'Upgrading to ' + cfg.next + ' means <strong id="calc-tier-bonus">$' + Math.round(nextAnnual - currentAnnual).toLocaleString() + '</strong> more per year';
  } else {
    if (nextName) nextName.textContent = '--';
    if (nextPct) nextPct.textContent = 'Max tier';
    document.getElementById('calc-tier-next').textContent = '--';
    if (diffEl) diffEl.innerHTML = 'You are at the <strong>highest tier</strong> -- maximum revenue share';
  }

  // Growth bars
  var maxRef = cfg.refMax;
  var volumes = [Math.round(maxRef * 0.15), Math.round(maxRef * 0.35), Math.round(maxRef * 0.6), maxRef];
  var maxVal = maxRef * debt * (rate / 100) * 12;
  volumes.forEach(function(vol, i) {
    var val = vol * debt * (rate / 100) * 12;
    var pct = Math.max(4, (val / maxVal) * 100);
    var ids = ['calc-grow-3', 'calc-grow-5', 'calc-grow-10', 'calc-grow-20'];
    var bar = document.getElementById(ids[i]);
    var label = document.getElementById(ids[i] + '-val');
    var rowLabel = bar ? bar.closest('.calc-grow-row') : null;
    if (rowLabel) {
      var lbl = rowLabel.querySelector('.calc-grow-label');
      if (lbl) lbl.textContent = vol + '/mo';
    }
    if (bar) bar.style.width = pct + '%';
    if (label) {
      if (val >= 1000000) label.textContent = '$' + (val / 1000000).toFixed(1) + 'M';
      else if (val >= 1000) label.textContent = '$' + Math.round(val / 1000) + 'k';
      else label.textContent = '$' + Math.round(val);
    }
  });

  // Breakeven indicator
  var perRef = debt * (rate / 100);
  var breakeven = perRef > 0 ? Math.ceil(75000 / 12 / perRef) : 0;
  var beVal = document.getElementById('calc-breakeven-val');
  if (beVal) beVal.textContent = breakeven;
}

// Animate calculator projection numbers
function animateCalcValue(id, target) {
  var el = document.getElementById(id);
  if (!el) return;
  var current = parseFloat(el.textContent.replace(/[$,]/g, '')) || 0;
  if (Math.round(current) === Math.round(target)) {
    el.textContent = '$' + Math.round(target).toLocaleString();
    return;
  }
  var start = performance.now();
  var duration = 400;
  function tick(now) {
    var progress = Math.min((now - start) / duration, 1);
    var eased = 1 - Math.pow(1 - progress, 3);
    var val = current + (target - current) * eased;
    el.textContent = '$' + Math.round(val).toLocaleString();
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// --- Earnings: Period pill toggle ---
// --- Earnings: Period Data Sets ---
var EARN_DATA = {
  month: {
    kpis: { total: '$2,490', avg: '$498', best: '$1,280', bestLabel: 'Feb 12', pending: '$2,736', pendingSub: '1 referral' },
    trend: { total: '+8.2%', totalDir: 'up', avg: '+2.4%', avgDir: 'up' },
    chart: { title: 'Weekly Earnings (Feb 2026)', yLabels: ['$1.5k','$1.2k','$900','$600','$300','$0'], bars: [
      { h: '52%', val: '$780', label: 'Wk 1' },
      { h: '85%', val: '$1,280', label: 'Wk 2', best: true },
      { h: '29%', val: '$430', label: 'Wk 3', current: true },
      { h: '0%', val: '--', label: 'Wk 4' }
    ]},
    rows: [
      { initials: 'DL', color: 'var(--cyan-text)', name: 'David Lee', type: 'Penalty Abatement', debt: '$27,100', comm: '$2,168', commColor: 'var(--cyan-text)', date: 'Feb 14, 2026', badge: 'Paid', badgeClass: 'earn-b-paid' },
      { initials: 'JW', color: '#0B5FD8', name: 'James Williams', type: 'Offer in Compromise', debt: '$34,200', comm: '$2,736', commColor: 'var(--blue)', date: 'Pending', badge: 'Pending', badgeClass: 'earn-b-pending' }
    ]
  },
  quarter: {
    kpis: { total: '$9,402', avg: '$470', best: '$4,224', bestLabel: 'Jan 2026', pending: '$5,472', pendingSub: '3 referrals' },
    trend: { total: '+18.6%', totalDir: 'up', avg: '+5.3%', avgDir: 'up' },
    chart: { title: 'Monthly Earnings (Q1 2026)', yLabels: ['$5k','$4k','$3k','$2k','$1k','$0'], bars: [
      { h: '84%', val: '$4,224', label: 'Jan', best: true },
      { h: '50%', val: '$2,490', label: 'Feb', current: true },
      { h: '54%', val: '$2,688', label: 'Mar' }
    ]},
    rows: [
      { initials: 'RT', color: 'var(--cyan-text)', name: 'Robert Thompson', type: 'Installment Agreement', debt: '$52,800', comm: '$4,224', commColor: 'var(--cyan-text)', date: 'Feb 21, 2026', badge: 'Paid', badgeClass: 'earn-b-paid' },
      { initials: 'DL', color: 'var(--cyan-text)', name: 'David Lee', type: 'Penalty Abatement', debt: '$27,100', comm: '$2,168', commColor: 'var(--cyan-text)', date: 'Feb 14, 2026', badge: 'Paid', badgeClass: 'earn-b-paid' },
      { initials: 'JW', color: '#0B5FD8', name: 'James Williams', type: 'Offer in Compromise', debt: '$34,200', comm: '$2,736', commColor: 'var(--blue)', date: 'Pending', badge: 'Pending', badgeClass: 'earn-b-pending' },
      { initials: 'MG', color: 'var(--cyan-text)', name: 'Maria Garcia', type: 'Under Investigation', debt: '$18,500', comm: 'TBD', commColor: 'var(--slate)', date: '--', badge: 'In Progress', badgeClass: 'earn-b-investigation' }
    ]
  },
  year: {
    kpis: { total: '$24,850', avg: '$438', best: '$4,224', bestLabel: 'Jan 2026', pending: '$5,472', pendingSub: '3 referrals' },
    trend: { total: '+34.2%', totalDir: 'up', avg: '+12.1%', avgDir: 'up' },
    chart: { title: 'Monthly Earnings (2026)', yLabels: ['$5k','$4k','$3k','$2k','$1k','$0'], bars: [
      { h: '84%', val: '$4,224', label: 'Jan', best: true },
      { h: '50%', val: '$2,490', label: 'Feb', current: true }
    ]},
    rows: [
      { initials: 'RT', color: 'var(--cyan-text)', name: 'Robert Thompson', type: 'Installment Agreement', debt: '$52,800', comm: '$4,224', commColor: 'var(--cyan-text)', date: 'Feb 21, 2026', badge: 'Paid', badgeClass: 'earn-b-paid' },
      { initials: 'DL', color: 'var(--cyan-text)', name: 'David Lee', type: 'Penalty Abatement', debt: '$27,100', comm: '$2,168', commColor: 'var(--cyan-text)', date: 'Feb 14, 2026', badge: 'Paid', badgeClass: 'earn-b-paid' },
      { initials: 'JW', color: '#0B5FD8', name: 'James Williams', type: 'Offer in Compromise', debt: '$34,200', comm: '$2,736', commColor: 'var(--blue)', date: 'Pending', badge: 'Pending', badgeClass: 'earn-b-pending' },
      { initials: 'MG', color: 'var(--cyan-text)', name: 'Maria Garcia', type: 'Under Investigation', debt: '$18,500', comm: 'TBD', commColor: 'var(--slate)', date: '--', badge: 'In Progress', badgeClass: 'earn-b-investigation' },
      { initials: 'KP', color: 'var(--sky)', name: 'Karen Patel', type: 'TBD', debt: '$12,400', comm: 'TBD', commColor: 'var(--slate)', date: '--', badge: 'New', badgeClass: 'earn-b-new' }
    ]
  },
  all: {
    kpis: { total: '$67,310', avg: '$415', best: '$4,224', bestLabel: 'Jan 2026', pending: '$5,472', pendingSub: '3 referrals' },
    trend: { total: '+142%', totalDir: 'up', avg: '+28.5%', avgDir: 'up' },
    chart: { title: 'Quarterly Earnings (All Time)', yLabels: ['$20k','$16k','$12k','$8k','$4k','$0'], bars: [
      { h: '18%', val: '$3,600', label: 'Q2 \'25' },
      { h: '34%', val: '$6,840', label: 'Q3 \'25' },
      { h: '47%', val: '$9,408', label: 'Q4 \'25' },
      { h: '47%', val: '$9,402', label: 'Q1 \'26', current: true }
    ]},
    rows: [
      { initials: 'RT', color: 'var(--cyan-text)', name: 'Robert Thompson', type: 'Installment Agreement', debt: '$52,800', comm: '$4,224', commColor: 'var(--cyan-text)', date: 'Feb 21, 2026', badge: 'Paid', badgeClass: 'earn-b-paid' },
      { initials: 'DL', color: 'var(--cyan-text)', name: 'David Lee', type: 'Penalty Abatement', debt: '$27,100', comm: '$2,168', commColor: 'var(--cyan-text)', date: 'Feb 14, 2026', badge: 'Paid', badgeClass: 'earn-b-paid' },
      { initials: 'JW', color: '#0B5FD8', name: 'James Williams', type: 'Offer in Compromise', debt: '$34,200', comm: '$2,736', commColor: 'var(--blue)', date: 'Pending', badge: 'Pending', badgeClass: 'earn-b-pending' },
      { initials: 'MG', color: 'var(--cyan-text)', name: 'Maria Garcia', type: 'Under Investigation', debt: '$18,500', comm: 'TBD', commColor: 'var(--slate)', date: '--', badge: 'In Progress', badgeClass: 'earn-b-investigation' },
      { initials: 'KP', color: 'var(--sky)', name: 'Karen Patel', type: 'TBD', debt: '$12,400', comm: 'TBD', commColor: 'var(--slate)', date: '--', badge: 'New', badgeClass: 'earn-b-new' },
      { initials: 'SB', color: '#6366f1', name: 'Sarah Brooks', type: 'Installment Agreement', debt: '$41,200', comm: '$3,296', commColor: 'var(--cyan-text)', date: 'Dec 8, 2025', badge: 'Paid', badgeClass: 'earn-b-paid' },
      { initials: 'TN', color: 'var(--cyan-text)', name: 'Tom Nguyen', type: 'Offer in Compromise', debt: '$29,800', comm: '$2,384', commColor: 'var(--cyan-text)', date: 'Nov 15, 2025', badge: 'Paid', badgeClass: 'earn-b-paid' },
      { initials: 'LM', color: 'var(--sky)', name: 'Lisa Martinez', type: 'Penalty Abatement', debt: '$15,600', comm: '$1,248', commColor: 'var(--cyan-text)', date: 'Oct 22, 2025', badge: 'Paid', badgeClass: 'earn-b-paid' }
    ]
  }
};

function setEarnPeriod(btn, period) {
  document.querySelectorAll('.earn-period').forEach(function(p) { p.classList.remove('earn-period-active'); });
  btn.classList.add('earn-period-active');

  var data = EARN_DATA[period];
  if (!data) return;

  // Update KPIs
  var kpis = document.querySelectorAll('#portal-sec-earnings .earn-kpi');
  if (kpis[0]) {
    kpis[0].querySelector('.earn-kpi-val').textContent = data.kpis.total;
    var t0 = kpis[0].querySelector('.earn-kpi-trend');
    if (t0) { t0.textContent = data.trend.total; t0.className = 'earn-kpi-trend earn-kpi-' + data.trend.totalDir; }
  }
  if (kpis[1]) {
    kpis[1].querySelector('.earn-kpi-val').textContent = data.kpis.avg;
    var t1 = kpis[1].querySelector('.earn-kpi-trend');
    if (t1) { t1.textContent = data.trend.avg; t1.className = 'earn-kpi-trend earn-kpi-' + data.trend.avgDir; }
  }
  if (kpis[2]) {
    kpis[2].querySelector('.earn-kpi-val').textContent = data.kpis.best;
    var sub2 = kpis[2].querySelector('.earn-kpi-subtext');
    if (sub2) sub2.textContent = data.kpis.bestLabel;
  }
  if (kpis[3]) {
    kpis[3].querySelector('.earn-kpi-val').textContent = data.kpis.pending;
    var sub3 = kpis[3].querySelector('.earn-kpi-subtext');
    if (sub3) sub3.textContent = data.kpis.pendingSub;
  }

  // Update chart
  var chartTitle = document.querySelector('#portal-sec-earnings .earn-chart-title');
  if (chartTitle) chartTitle.textContent = data.chart.title;

  var yAxis = document.querySelector('#portal-sec-earnings .earn-chart-y');
  if (yAxis) {
    yAxis.innerHTML = data.chart.yLabels.map(function(l) { return '<span>' + l + '</span>'; }).join('');
  }

  var barsWrap = document.querySelector('#portal-sec-earnings .earn-chart-bars');
  if (barsWrap) {
    barsWrap.innerHTML = data.chart.bars.map(function(b) {
      var barClass = 'earn-bar';
      if (b.best) barClass += ' earn-bar-best';
      if (b.current) barClass += ' earn-bar-current';
      return '<div class="earn-bar-col">' +
        '<div class="' + barClass + '" style="height:' + b.h + '"><span class="earn-bar-val">' + b.val + '</span></div>' +
        '<div class="earn-bar-label">' + b.label + '</div></div>';
    }).join('');
  }

  // Update table
  var tableWrap = document.querySelector('#portal-sec-earnings .earn-table-wrap');
  if (tableWrap) {
    var headHtml = '<div class="earn-table-title">Earnings by Referral</div>' +
      '<div class="earn-table-head"><div>Client</div><div>Resolution Type</div><div>Tax Debt</div><div>Commission</div><div>Date</div><div>Status</div></div>';

    var rowsHtml = data.rows.map(function(r) {
      var commStyle = r.commColor ? 'font-weight:700;color:' + r.commColor : 'font-weight:700';
      return '<div class="earn-table-row">' +
        '<div class="earn-td-client"><div class="earn-avatar" style="background:' + r.color + '">' + r.initials + '</div><span>' + r.name + '</span></div>' +
        '<div>' + r.type + '</div>' +
        '<div style="font-weight:600">' + r.debt + '</div>' +
        '<div style="' + commStyle + '">' + r.comm + '</div>' +
        '<div>' + r.date + '</div>' +
        '<div><span class="earn-badge ' + r.badgeClass + '">' + r.badge + '</span></div></div>';
    }).join('');

    tableWrap.innerHTML = headHtml + rowsHtml;
  }
}

// --- Earnings: Export CSV ---
function exportEarningsCSV() {
  var rows = [['Client', 'Resolution Type', 'Tax Debt', 'Commission', 'Date', 'Status']];
  document.querySelectorAll('.earn-table-row').forEach(function(row) {
    var cells = [];
    row.querySelectorAll(':scope > div').forEach(function(cell) {
      cells.push(cell.textContent.trim());
    });
    rows.push(cells);
  });
  var csv = rows.map(function(r) { return r.join(','); }).join('\n');
  var blob = new Blob([csv], { type: 'text/csv' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'earnings_export.csv';
  a.click();
  URL.revokeObjectURL(url);
  showToast('Earnings exported to CSV', 'success');
}

// --- Earnings: Bar chart animation on reveal ---
var earningsAnimated = false;
function initEarningsAnimation() {
  if (earningsAnimated) return;
  earningsAnimated = true;
  var bars = document.querySelectorAll('.earn-bar');
  bars.forEach(function(bar) {
    var targetH = bar.style.height;
    bar.classList.add('earn-bar-init');
    setTimeout(function() {
      bar.classList.remove('earn-bar-init');
      bar.style.height = targetH;
    }, 50);
  });
}

// --- Payouts: Live countdown ---
function initPayCountdown() {
  var el = document.getElementById('pay-countdown');
  if (!el) return;
  // Count down to March 1, 2026
  var target = new Date('2026-03-01T00:00:00');
  function update() {
    var now = new Date();
    var diff = target - now;
    if (diff <= 0) { el.textContent = 'Today!'; return; }
    var d = Math.floor(diff / 86400000);
    var h = Math.floor((diff % 86400000) / 3600000);
    var m = Math.floor((diff % 3600000) / 60000);
    el.textContent = d + 'd ' + h + 'h ' + m + 'm remaining';
  }
  update();
  setInterval(update, 60000);
}

// --- Payouts: Year filter ---
function payYearFilter(btn, year) {
  document.querySelectorAll('.pay-year-pill').forEach(function(p) { p.classList.remove('pay-year-active'); });
  btn.classList.add('pay-year-active');
  var total = 0;
  document.querySelectorAll('.pay-ledger-row').forEach(function(row) {
    if (!row.getAttribute('data-year')) return;
    if (year === 'all' || row.getAttribute('data-year') === year) {
      row.style.display = '';
      total += parseFloat(row.getAttribute('data-amount') || 0);
    } else {
      row.style.display = 'none';
    }
  });
  var totalEl = document.getElementById('pay-running-total');
  if (totalEl) totalEl.textContent = 'Total Paid to Date: $' + total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// --- Documents: Search ---
function docSearch(q) {
  q = q.toLowerCase();
  document.querySelectorAll('.doc-row').forEach(function(row) {
    var name = (row.querySelector('.doc-td-name span') || {}).textContent || '';
    row.style.display = name.toLowerCase().indexOf(q) !== -1 ? '' : 'none';
  });
}

// --- Documents: Select All ---
function docToggleAll(master) {
  document.querySelectorAll('.doc-row input[type=checkbox]').forEach(function(cb) {
    cb.checked = master.checked;
  });
  docUpdateBulk();
}

function docUpdateBulk() {
  var checked = document.querySelectorAll('.doc-row input[type=checkbox]:checked').length;
  var bar = document.getElementById('doc-bulk-bar');
  var count = document.getElementById('doc-bulk-count');
  if (bar) bar.classList.toggle('doc-bulk-visible', checked > 0);
  if (count) count.textContent = checked + ' selected';
}

// Wire doc row checkboxes
document.addEventListener('change', function(e) {
  if (e.target.closest('.doc-row') && e.target.type === 'checkbox') {
    docUpdateBulk();
  }
});

// --- Documents: Sort ---
var docSortState = {};
function docSort(field) {
  var rows = Array.from(document.querySelectorAll('.doc-row'));
  if (rows.length === 0) return;
  var asc = docSortState[field] !== 'asc';
  docSortState[field] = asc ? 'asc' : 'desc';

  rows.sort(function(a, b) {
    var av, bv;
    if (field === 'name') {
      av = (a.querySelector('.doc-td-name span') || {}).textContent || '';
      bv = (b.querySelector('.doc-td-name span') || {}).textContent || '';
      return asc ? av.localeCompare(bv) : bv.localeCompare(av);
    }
    if (field === 'date') {
      // Direct children: check, name, client, date, size, actions
      var cells_a = a.querySelectorAll(':scope > div');
      var cells_b = b.querySelectorAll(':scope > div');
      av = new Date(cells_a[3] ? cells_a[3].textContent : 0);
      bv = new Date(cells_b[3] ? cells_b[3].textContent : 0);
    }
    if (field === 'size') {
      var cells_a2 = a.querySelectorAll(':scope > div');
      var cells_b2 = b.querySelectorAll(':scope > div');
      av = parseFloat(cells_a2[4] ? cells_a2[4].textContent : '0') || 0;
      bv = parseFloat(cells_b2[4] ? cells_b2[4].textContent : '0') || 0;
    }
    return asc ? av - bv : bv - av;
  });

  var parent = rows[0].parentElement;
  rows.forEach(function(r) { parent.appendChild(r); });
}

// --- Documents: Drag-drop highlight ---
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(function() {
    var dz = document.getElementById('doc-dropzone');
    if (!dz) return;
    dz.addEventListener('dragover', function(e) { e.preventDefault(); dz.classList.add('doc-dropzone-active'); });
    dz.addEventListener('dragleave', function() { dz.classList.remove('doc-dropzone-active'); });
    dz.addEventListener('drop', function(e) { e.preventDefault(); dz.classList.remove('doc-dropzone-active'); showToast('File uploaded', 'success'); });
  }, 200);
});

// --- Settings: API key toggle/copy ---
function toggleApiKey() {
  var input = document.getElementById('set-api-key');
  var btn = input.nextElementSibling;
  if (input.type === 'password') {
    input.type = 'text';
    btn.textContent = 'Hide';
  } else {
    input.type = 'password';
    btn.textContent = 'Show';
  }
}

function copyApiKey() {
  var input = document.getElementById('set-api-key');
  var origType = input.type;
  input.type = 'text';
  input.select();
  document.execCommand('copy');
  input.type = origType;
  var btn = input.nextElementSibling.nextElementSibling;
  btn.textContent = 'Copied!';
  setTimeout(function() { btn.textContent = 'Copy'; }, 2000);
}

function showApiRegenConfirm() {
  var overlay = document.getElementById('set-regen-confirm');
  if (overlay) overlay.classList.add('set-confirm-visible');
}

// --- Settings: Unsaved changes detection ---
function setDetectChanges() {
  var bar = document.getElementById('set-unsaved-bar');
  if (bar) bar.classList.add('set-unsaved-visible');
}

// --- Settings: Avatar upload ---
function setAvatarPreview(input) {
  var file = input.files && input.files[0];
  if (!file) return;
  var allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowed.indexOf(file.type) === -1) {
    showToast('Only JPEG, PNG, GIF, or WebP images allowed', 'error');
    return;
  }
  var reader = new FileReader();
  reader.onload = function(e) {
    var container = document.getElementById('set-avatar-upload');
    var img = document.createElement('img');
    img.src = e.target.result;
    img.alt = 'Avatar';
    var fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/jpeg,image/png,image/gif,image/webp';
    fileInput.style.display = 'none';
    fileInput.onchange = function() { setAvatarPreview(this); };
    container.innerHTML = '';
    container.appendChild(img);
    container.appendChild(fileInput);
    showToast('Profile photo updated', 'success');
  };
  reader.readAsDataURL(file);
}

// --- Marketing Kit filter ---
function mkFilter(btn, cat) {
  document.querySelectorAll('.mk-tab').forEach(function(t) { t.classList.remove('mk-tab-active'); });
  btn.classList.add('mk-tab-active');
  var visibleCount = 0;
  document.querySelectorAll('.mk-card').forEach(function(card) {
    if (cat === 'all' || card.getAttribute('data-mk-cat') === cat) {
      card.style.display = '';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });
}

// --- Marketing: Co-brand status update ---
function updateCobrandStatus(hasLogo) {
  var notice = document.getElementById('mk-cobrand');
  var title = document.getElementById('mk-cobrand-title');
  var desc = document.getElementById('mk-cobrand-desc');
  if (!notice || !title || !desc) return;
  if (hasLogo) {
    notice.classList.add('mk-cobrand-active');
    title.textContent = 'Your logo is applied to all assets';
    desc.textContent = 'All downloadable collateral now includes your branding.';
  }
}

// --- Documents tab filter ---
function docFilter(btn, cat) {
  document.querySelectorAll('.doc-tab').forEach(function(t) { t.classList.remove('doc-tab-active'); });
  btn.classList.add('doc-tab-active');
  document.querySelectorAll('.doc-row').forEach(function(row) {
    if (cat === 'all' || row.getAttribute('data-cat') === cat) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
}

// --- CE Webinars: Category filter ---
function ceFilter(btn, cat) {
  document.querySelectorAll('.ce-filter').forEach(function(f) { f.classList.remove('ce-filter-active'); });
  btn.classList.add('ce-filter-active');
  document.querySelectorAll('.ce-card').forEach(function(card) {
    if (cat === 'all' || card.getAttribute('data-ce-cat') === cat) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
}

// --- CE Webinars: Search ---
function ceSearch(q) {
  q = q.toLowerCase();
  document.querySelectorAll('.ce-card').forEach(function(card) {
    var title = (card.querySelector('.ce-title') || {}).textContent || '';
    card.style.display = title.toLowerCase().indexOf(q) !== -1 ? '' : 'none';
  });
}

// --- CE: Ring chart animation on reveal ---
var ceRingAnimated = false;
function initCeRingAnimation() {
  if (ceRingAnimated) return;
  ceRingAnimated = true;
  var ring = document.querySelector('.ce-ring circle:nth-child(2)');
  if (!ring) return;
  var target = ring.getAttribute('stroke-dashoffset');
  ring.setAttribute('stroke-dashoffset', '326.73');
  ring.parentElement.classList.add('ce-ring-animate');
  setTimeout(function() {
    ring.setAttribute('stroke-dashoffset', target);
  }, 50);
}

// --- Support: Ticket submission ---
function submitSupportTicket() {
  var subjectEl = document.querySelector('.sup-ticket-form .sup-input');
  var subject = subjectEl ? subjectEl.value.trim() : '';
  if (!subject) {
    showToast('Please enter a subject for your ticket', 'error');
    return;
  }
  // Add new row to table
  var table = document.querySelector('.sup-tickets-table');
  if (table) {
    var ticketNum = '#TK-0' + (97 + Math.floor(Math.random() * 100));
    var today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    var row = document.createElement('div');
    row.className = 'sup-ticket-row';
    row.innerHTML = '<div class="sup-ticket-id">' + ticketNum + '</div>' +
      '<div class="sup-ticket-subject">' + subject + '</div>' +
      '<div><span class="sup-badge sup-b-open">Open</span></div>' +
      '<div>' + today + '</div><div>--</div>';
    var head = table.querySelector('.sup-tickets-head');
    if (head && head.nextSibling) {
      table.insertBefore(row, head.nextSibling);
    } else {
      table.appendChild(row);
    }
  }
  // Clear form
  document.querySelectorAll('.sup-ticket-form input, .sup-ticket-form textarea').forEach(function(el) { el.value = ''; });
  showToast('Support ticket submitted - ' + subject, 'success');
}

// --- Support: KB search ---
function kbSearch(q) {
  q = q.toLowerCase();
  document.querySelectorAll('.sup-kb-item').forEach(function(item) {
    var text = item.textContent.toLowerCase();
    item.style.display = text.indexOf(q) !== -1 ? '' : 'none';
  });
}

// --- Toast notification system ---
function showToast(message, type) {
  type = type || 'info';
  var wrap = document.getElementById('portal-toast-wrap');
  if (!wrap) return;
  var toast = document.createElement('div');
  toast.className = 'portal-toast portal-toast-' + type;

  var icons = {
    success: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>',
    error: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    info: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
    warning: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>'
  };
  toast.innerHTML = (icons[type] || icons.info) + '<span>' + message + '</span>';
  wrap.appendChild(toast);
  setTimeout(function() {
    toast.classList.add('portal-toast-dismiss');
    setTimeout(function() { toast.remove(); }, 300);
  }, 3500);
}

// --- Notification bell ---
function portalToggleNotif() {
  var panel = document.getElementById('portal-notif-panel');
  if (panel) panel.classList.toggle('portal-notif-open');
}

function markAllRead() {
  document.querySelectorAll('.portal-notif-item-unread').forEach(function(item) {
    item.classList.remove('portal-notif-item-unread');
  });
  var badge = document.getElementById('portal-notif-badge');
  if (badge) badge.style.display = 'none';
  showToast('All notifications marked as read', 'info');
}

// Close notification panel on outside click
document.addEventListener('click', function(e) {
  var wrap = document.querySelector('.portal-notif-wrap');
  var panel = document.getElementById('portal-notif-panel');
  if (wrap && panel && !wrap.contains(e.target)) {
    panel.classList.remove('portal-notif-open');
  }
});

// --- Settings dropdown ---
function ptToggleSettings() {
  var panel = document.getElementById('pt-settings-panel');
  if (panel) panel.classList.toggle('active');
}

// Close settings panel on outside click
document.addEventListener('click', function(e) {
  var wrap = document.querySelector('.pt-settings-wrap');
  var panel = document.getElementById('pt-settings-panel');
  if (wrap && panel && !wrap.contains(e.target)) {
    panel.classList.remove('active');
  }
});

// --- Profile dropdown ---
function ptToggleProfile() {
  var panel = document.getElementById('pt-profile-panel');
  if (panel) panel.classList.toggle('active');
  // Close settings if open
  var settings = document.getElementById('pt-settings-panel');
  if (settings) settings.classList.remove('active');
}

function ptCloseProfile() {
  var panel = document.getElementById('pt-profile-panel');
  if (panel) panel.classList.remove('active');
}

// Close profile panel on outside click
document.addEventListener('click', function(e) {
  var wrap = document.querySelector('.pt-profile-wrap');
  var panel = document.getElementById('pt-profile-panel');
  if (wrap && panel && !wrap.contains(e.target)) {
    panel.classList.remove('active');
  }
});

// --- Portal-wide search ---
function portalGlobalSearch(q) {
  var results = document.getElementById('portal-search-results');
  if (!results) return;
  q = q.toLowerCase().trim();
  if (q.length < 2) { results.classList.remove('portal-sr-open'); return; }

  var html = '';
  var found = false;

  // Search referrals
  var refMatches = [];
  document.querySelectorAll('.ref-row .ref-name').forEach(function(el) {
    if (el.textContent.toLowerCase().indexOf(q) !== -1) {
      refMatches.push(el.textContent);
    }
  });
  if (refMatches.length) {
    found = true;
    html += '<div class="portal-sr-group">Referrals</div>';
    refMatches.forEach(function(name) {
      html += '<div class="portal-sr-item" onclick="portalNav(document.querySelector(\'[onclick*=portal-sec-referrals]\'),\'portal-sec-referrals\');document.getElementById(\'portal-search-results\').classList.remove(\'portal-sr-open\')">' + name + '</div>';
    });
  }

  // Search documents
  var docMatches = [];
  document.querySelectorAll('.doc-td-name span').forEach(function(el) {
    if (el.textContent.toLowerCase().indexOf(q) !== -1) {
      docMatches.push(el.textContent);
    }
  });
  if (docMatches.length) {
    found = true;
    html += '<div class="portal-sr-group">Documents</div>';
    docMatches.forEach(function(name) {
      html += '<div class="portal-sr-item" onclick="portalNav(document.querySelector(\'[onclick*=portal-sec-documents]\'),\'portal-sec-documents\');document.getElementById(\'portal-search-results\').classList.remove(\'portal-sr-open\')">' + name + '</div>';
    });
  }

  // Search tickets
  var ticketMatches = [];
  document.querySelectorAll('.sup-ticket-subject').forEach(function(el) {
    if (el.textContent.toLowerCase().indexOf(q) !== -1) {
      ticketMatches.push(el.textContent);
    }
  });
  if (ticketMatches.length) {
    found = true;
    html += '<div class="portal-sr-group">Support Tickets</div>';
    ticketMatches.forEach(function(name) {
      html += '<div class="portal-sr-item" onclick="portalNav(document.querySelector(\'[onclick*=portal-sec-support]\'),\'portal-sec-support\');document.getElementById(\'portal-search-results\').classList.remove(\'portal-sr-open\')">' + name + '</div>';
    });
  }

  // Search webinars
  var ceMatches = [];
  document.querySelectorAll('.ce-title').forEach(function(el) {
    if (el.textContent.toLowerCase().indexOf(q) !== -1) {
      ceMatches.push(el.textContent);
    }
  });
  if (ceMatches.length) {
    found = true;
    html += '<div class="portal-sr-group">CE Webinars</div>';
    ceMatches.forEach(function(name) {
      html += '<div class="portal-sr-item" onclick="portalNav(document.querySelector(\'[onclick*=portal-sec-ce]\'),\'portal-sec-ce\');document.getElementById(\'portal-search-results\').classList.remove(\'portal-sr-open\')">' + name + '</div>';
    });
  }

  if (!found) {
    html = '<div class="portal-sr-empty">No results found for "' + q + '"</div>';
  }

  results.innerHTML = html;
  results.classList.add('portal-sr-open');
}

// Close search results on outside click
document.addEventListener('click', function(e) {
  var wrap = document.querySelector('.portal-search-wrap');
  var results = document.getElementById('portal-search-results');
  if (wrap && results && !wrap.contains(e.target)) {
    results.classList.remove('portal-sr-open');
  }
});

// --- Mobile bottom nav ---
var mobNavMap = {
  'portal-sec-dashboard': 'portal-sec-dashboard',
  'portal-sec-referrals': 'portal-sec-referrals',
  'portal-sec-submit': 'portal-sec-submit',
  'portal-sec-earnings': 'portal-sec-earnings',
  'portal-sec-payouts': 'portal-sec-earnings'
};

function mobNavSync(secId) {
  var mapped = mobNavMap[secId] || '';
  document.querySelectorAll('.mob-bnav-tab').forEach(function(tab) {
    var isActive = tab.getAttribute('data-mob-sec') === mapped;
    tab.classList.toggle('mob-bnav-tab-active', isActive);
  });
}

function mobNavTap(tab, secId) {
  var sidebarLink = document.querySelector('.portal-nav-item[onclick*="' + secId + '"]');
  if (sidebarLink) {
    portalNav(sidebarLink, secId);
  }
}

// --- Mobile tools sheet ---
function mobToolsOpen() {
  var overlay = document.getElementById('mob-tools-overlay');
  var sheet = document.getElementById('mob-tools-sheet');
  if (overlay) overlay.classList.add('mob-tools-open');
  if (sheet) {
    sheet.classList.add('mob-tools-open');
    // Highlight tools tab
    document.querySelectorAll('.mob-bnav-tab').forEach(function(t) { t.classList.remove('mob-bnav-tab-active'); });
    var toolsTab = document.querySelector('[data-mob-sec="mob-tools"]');
    if (toolsTab) toolsTab.classList.add('mob-bnav-tab-active');
  }
}

function mobToolsClose() {
  var overlay = document.getElementById('mob-tools-overlay');
  var sheet = document.getElementById('mob-tools-sheet');
  if (overlay) overlay.classList.remove('mob-tools-open');
  if (sheet) sheet.classList.remove('mob-tools-open');
}

// --- Mobile money hero ---
function initMobMoneyHero() {
  var hero = document.getElementById('mob-money-hero');
  if (!hero) return;
  hero.querySelectorAll('[data-count-to]').forEach(function(el) {
    var target = parseInt(el.getAttribute('data-count-to'), 10);
    var duration = 1200;
    var start = 0;
    var startTime = null;
    function animate(ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(animate);
      else el.textContent = target.toLocaleString();
    }
    requestAnimationFrame(animate);
  });
}
if (window.matchMedia('(max-width:768px)').matches) {
  document.addEventListener('DOMContentLoaded', initMobMoneyHero);
  document.addEventListener('DOMContentLoaded', initGamification);
}

// --- Gamification ---
var GAMIFICATION_KEY = 'ctax_gamification';

function getGamificationData() {
  try {
    var stored = localStorage.getItem(GAMIFICATION_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) { /* ignore */ }
  return { streak: 0, lastRefDate: null, totalRefs: 6, totalEarned: 24850, achievements: [] };
}

function saveGamificationData(data) {
  try { localStorage.setItem(GAMIFICATION_KEY, JSON.stringify(data)); } catch (e) { /* ignore */ }
}

function calcPartnerLevel(totalRefs) {
  if (totalRefs >= 50) return 'platinum';
  if (totalRefs >= 25) return 'pro';
  if (totalRefs >= 10) return 'premium';
  return 'bronze';
}

function getLevelThreshold(level) {
  if (level === 'bronze') return { next: 'Premium', need: 10 };
  if (level === 'premium') return { next: 'Pro', need: 25 };
  if (level === 'pro') return { next: 'Platinum', need: 50 };
  return { next: 'Max', need: 50 };
}

function initGamification() {
  var data = getGamificationData();

  // Demo: simulate some activity
  if (!data.lastRefDate) {
    data.streak = 5;
    data.totalRefs = 6;
    data.totalEarned = 24850;
    data.lastRefDate = new Date().toISOString().slice(0, 10);
    saveGamificationData(data);
  }

  // Streak
  var streakEl = document.getElementById('mob-streak-count');
  if (streakEl) streakEl.textContent = data.streak;

  // Progress ring (referrals this month vs goal of 10)
  var monthlyGoal = 10;
  var monthlyRefs = Math.min(data.totalRefs, monthlyGoal);
  var ringFill = document.getElementById('mob-ring-fill');
  var ringLabel = document.getElementById('mob-ring-label');
  if (ringFill) {
    var circumference = 125.66;
    var offset = circumference - (monthlyRefs / monthlyGoal) * circumference;
    setTimeout(function() { ringFill.style.strokeDashoffset = offset; }, 200);
  }
  if (ringLabel) ringLabel.textContent = monthlyRefs + '/' + monthlyGoal;

  // Level badge
  var level = calcPartnerLevel(data.totalRefs);
  var badgeEl = document.getElementById('mob-level-badge');
  if (badgeEl) {
    badgeEl.textContent = level.charAt(0).toUpperCase() + level.slice(1);
    badgeEl.className = 'mob-level-badge mob-level-' + level;
  }

  // Milestone bar
  var threshold = getLevelThreshold(level);
  var milestoneText = document.getElementById('mob-milestone-text');
  var milestoneFill = document.getElementById('mob-milestone-fill');
  if (threshold.next === 'Max') {
    if (milestoneText) milestoneText.textContent = 'Max level reached!';
    if (milestoneFill) milestoneFill.style.width = '100%';
  } else {
    var remaining = threshold.need - data.totalRefs;
    var prevThreshold = level === 'bronze' ? 0 : level === 'premium' ? 10 : 25;
    var progress = ((data.totalRefs - prevThreshold) / (threshold.need - prevThreshold)) * 100;
    if (milestoneText) milestoneText.textContent = remaining + ' more referrals to ' + threshold.next;
    if (milestoneFill) setTimeout(function() { milestoneFill.style.width = Math.min(progress, 100) + '%'; }, 400);
  }
}

function updateStreak() {
  var data = getGamificationData();
  var today = new Date().toISOString().slice(0, 10);
  if (data.lastRefDate !== today) {
    data.streak = data.streak + 1;
    data.lastRefDate = today;
  }
  data.totalRefs = data.totalRefs + 1;
  saveGamificationData(data);
  checkAchievements(data);
  initGamification();
}

function checkAchievements(data) {
  var thresholds = [
    { key: 'first_ref', count: 1, label: 'First Referral!' },
    { key: 'ref_5', count: 5, label: '5 Referrals - On Fire!' },
    { key: 'ref_10', count: 10, label: '10 Referrals - Premium Partner!' },
    { key: 'ref_25', count: 25, label: '25 Referrals - Pro Partner!' },
    { key: 'ref_50', count: 50, label: '50 Referrals - Platinum!' }
  ];
  var earned = [
    { key: 'earn_1k', amount: 1000, label: '$1K Earned!' },
    { key: 'earn_5k', amount: 5000, label: '$5K Earned!' },
    { key: 'earn_10k', amount: 10000, label: '$10K Club!' },
    { key: 'earn_25k', amount: 25000, label: '$25K Milestone!' }
  ];
  thresholds.forEach(function(t) {
    if (data.totalRefs >= t.count && data.achievements.indexOf(t.key) === -1) {
      data.achievements.push(t.key);
      showAchievementToast(t.label);
    }
  });
  earned.forEach(function(e) {
    if (data.totalEarned >= e.amount && data.achievements.indexOf(e.key) === -1) {
      data.achievements.push(e.key);
      showAchievementToast(e.label);
    }
  });
  saveGamificationData(data);
}

function showAchievementToast(msg) {
  var toast = document.getElementById('mob-achieve-toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('mob-achieve-show');
  fireConfetti();
  setTimeout(function() { toast.classList.remove('mob-achieve-show'); }, 3000);
}

// ── CONFETTI ──────────────────────────────────────────────
function fireConfetti() {
  var count = 80;
  var colors = ['#0B5FD8', '#00C8E0', '#4BA3FF', '#FFD700', '#FF6B35', '#059669', '#8B5CF6'];
  var container = document.createElement('div');
  container.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:999999;overflow:hidden';
  document.body.appendChild(container);

  for (var i = 0; i < count; i++) {
    var piece = document.createElement('div');
    var size = Math.random() * 8 + 4;
    var color = colors[Math.floor(Math.random() * colors.length)];
    var left = Math.random() * 100;
    var delay = Math.random() * 400;
    var duration = Math.random() * 1500 + 1500;
    var drift = (Math.random() - 0.5) * 200;
    var rotation = Math.random() * 720 - 360;
    var shape = Math.random() > 0.5 ? '50%' : '0';

    piece.style.cssText = 'position:absolute;top:-12px;left:' + left + '%;width:' + size + 'px;height:' + (size * 0.6) + 'px;background:' + color + ';border-radius:' + shape + ';opacity:1;animation:confettiFall ' + duration + 'ms ease-out ' + delay + 'ms forwards';
    piece.style.setProperty('--cf-drift', drift + 'px');
    piece.style.setProperty('--cf-rot', rotation + 'deg');
    container.appendChild(piece);
  }

  setTimeout(function() {
    if (container.parentNode) container.parentNode.removeChild(container);
  }, 3000);
}

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

// ── MONTHLY GOAL TRACKER ────────────────────────────────────
function dgtEditGoal() {
  var current = 10;
  var input = prompt('Set your monthly referral goal:', current);
  if (input === null) return;
  var goal = parseInt(input, 10);
  if (isNaN(goal) || goal < 1) return;
  var valEl = document.querySelector('.dgt-ring-of');
  if (valEl) valEl.textContent = 'of ' + goal;
  // Update ring progress (6 of new goal)
  var progress = 6;
  var pct = Math.min(progress / goal, 1);
  var circumference = 364.42;
  var offset = circumference * (1 - pct);
  var fill = document.querySelector('.dgt-ring-fill');
  if (fill) fill.style.strokeDashoffset = offset;
  var paceBar = document.querySelector('.dgt-pace-fill');
  if (paceBar) paceBar.style.width = (pct * 100) + '%';
  if (typeof showToast === 'function') showToast('Goal updated to ' + goal + ' referrals', 'success');
}

// ── CASE DETAIL DRAWER ──────────────────────────────────────
function cddOpen(clientName) {
  var overlay = document.getElementById('cdd-overlay');
  var drawer = document.getElementById('cdd-drawer');
  if (overlay) overlay.classList.add('cdd-open');
  if (drawer) drawer.classList.add('cdd-open');
}

function cddClose() {
  var overlay = document.getElementById('cdd-overlay');
  var drawer = document.getElementById('cdd-drawer');
  if (overlay) overlay.classList.remove('cdd-open');
  if (drawer) drawer.classList.remove('cdd-open');
}

// ── SCROLL TO TOP ───────────────────────────────────────────
function sttScrollTop() {
  var main = document.querySelector('.portal-main');
  if (main) main.scrollTo({ top: 0, behavior: 'smooth' });
}

(function() {
  var main = document.querySelector('.portal-main');
  var btn = document.getElementById('stt-btn');
  if (!main || !btn) return;
  main.addEventListener('scroll', function() {
    if (main.scrollTop > 400) {
      btn.classList.add('stt-visible');
    } else {
      btn.classList.remove('stt-visible');
    }
  });
})();

// ── PARTNER LEADERBOARD ─────────────────────────────────────
var DLB_DATA = {
  referrals: [
    { rank: 1, initials: 'SP', name: 'S. Patel', tier: 'Pro Partner', metric: '24 referrals', color: '#FFD700', crown: true },
    { rank: 2, initials: 'JL', name: 'J. Lopez', tier: 'Pro Partner', metric: '21 referrals', color: '#C0C0C0' },
    { rank: 3, initials: 'AW', name: 'A. Wright', tier: 'Premium Partner', metric: '19 referrals', color: '#CD7F32' },
    { rank: 4, initials: 'RK', name: 'R. Kim', tier: 'Premium Partner', metric: '16 referrals', color: 'var(--blue)' },
    { rank: 7, initials: 'JH', name: 'You', tier: 'Premium Partner', metric: '12 referrals', color: 'var(--blue)', you: true }
  ],
  earnings: [
    { rank: 1, initials: 'JL', name: 'J. Lopez', tier: 'Pro Partner', metric: '$38,400', color: '#FFD700', crown: true },
    { rank: 2, initials: 'SP', name: 'S. Patel', tier: 'Pro Partner', metric: '$32,100', color: '#C0C0C0' },
    { rank: 3, initials: 'MM', name: 'M. Martinez', tier: 'Pro Partner', metric: '$28,750', color: '#CD7F32' },
    { rank: 4, initials: 'AW', name: 'A. Wright', tier: 'Premium Partner', metric: '$26,200', color: 'var(--blue)' },
    { rank: 9, initials: 'JH', name: 'You', tier: 'Premium Partner', metric: '$24,850', color: 'var(--blue)', you: true }
  ],
  streak: [
    { rank: 1, initials: 'TN', name: 'T. Nguyen', tier: 'Pro Partner', metric: '45 days', color: '#FFD700', crown: true },
    { rank: 2, initials: 'RK', name: 'R. Kim', tier: 'Premium Partner', metric: '38 days', color: '#C0C0C0' },
    { rank: 3, initials: 'SP', name: 'S. Patel', tier: 'Pro Partner', metric: '31 days', color: '#CD7F32' },
    { rank: 4, initials: 'JL', name: 'J. Lopez', tier: 'Pro Partner', metric: '28 days', color: 'var(--blue)' },
    { rank: 12, initials: 'JH', name: 'You', tier: 'Premium Partner', metric: '14 days', color: 'var(--blue)', you: true }
  ]
};

function dlbSwitch(tab, category) {
  var tabs = tab.parentElement.querySelectorAll('.dlb-tab');
  tabs.forEach(function(t) { t.classList.remove('dlb-tab-active'); });
  tab.classList.add('dlb-tab-active');

  var data = DLB_DATA[category] || DLB_DATA.referrals;
  var list = document.getElementById('dlb-list');
  if (!list) return;

  var html = '';
  var rankClasses = ['', 'dlb-row-pro', 'dlb-row-premium', 'dlb-row-bronze'];
  data.forEach(function(p, i) {
    var rowClass = p.you ? 'dlb-row-you' : (i < 3 ? rankClasses[i + 1] : '');
    var badge = '';
    if (p.crown) badge = '<div class="dlb-badge dlb-badge-crown"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5z"/></svg></div>';
    else if (p.you) badge = '<div class="dlb-badge dlb-badge-you">You</div>';
    else badge = '<div class="dlb-badge"></div>';

    html += '<div class="dlb-row ' + rowClass + '">';
    html += '<div class="dlb-rank">' + p.rank + '</div>';
    html += '<div class="dlb-avatar" style="background:' + p.color + '">' + p.initials + '</div>';
    html += '<div class="dlb-info"><div class="dlb-name">' + p.name + '</div><div class="dlb-tier">' + p.tier + '</div></div>';
    html += '<div class="dlb-metric">' + p.metric + '</div>';
    html += badge;
    html += '</div>';
  });
  list.innerHTML = html;
}

// ── REFERRAL LINK GENERATOR ──────────────────────────────────
var _rlgBaseUrl = 'https://communitytax.com/refer?p=JH-2847';

function rlgBuildLink() {
  var src = document.getElementById('rlg-utm-source');
  var med = document.getElementById('rlg-utm-medium');
  var camp = document.getElementById('rlg-utm-campaign');
  var parts = [_rlgBaseUrl];
  if (src && src.value) parts.push('utm_source=' + encodeURIComponent(src.value));
  if (med && med.value) parts.push('utm_medium=' + encodeURIComponent(med.value));
  if (camp && camp.value) parts.push('utm_campaign=' + encodeURIComponent(camp.value));
  return parts.join('&');
}

function rlgUpdateLink() {
  var input = document.getElementById('rlg-link');
  if (input) input.value = rlgBuildLink();
}

function rlgCopy() {
  var input = document.getElementById('rlg-link');
  var btn = document.getElementById('rlg-copy-btn');
  var label = document.getElementById('rlg-copy-label');
  if (!input) return;
  try {
    navigator.clipboard.writeText(input.value);
  } catch (e) {
    input.select();
    document.execCommand('copy');
  }
  if (btn) btn.classList.add('rlg-copied');
  if (label) label.textContent = 'Copied!';
  setTimeout(function() {
    if (btn) btn.classList.remove('rlg-copied');
    if (label) label.textContent = 'Copy';
  }, 2000);
}

function rlgShare(channel) {
  var link = rlgBuildLink();
  var text = 'Owe the IRS? I work with Community Tax — they resolve tax debt fast. Check them out:';
  if (channel === 'email') {
    window.open('mailto:?subject=' + encodeURIComponent('Resolve Your Tax Debt') + '&body=' + encodeURIComponent(text + '\n\n' + link));
  } else if (channel === 'linkedin') {
    window.open('https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(link), '_blank', 'width=600,height=500');
  } else if (channel === 'x') {
    window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(text) + '&url=' + encodeURIComponent(link), '_blank', 'width=600,height=400');
  } else if (channel === 'sms') {
    window.open('sms:?body=' + encodeURIComponent(text + ' ' + link));
  }
}

// ── SMART INSIGHTS BANNER ──────────────────────────────────
var _dibInsights = [
  { title: 'Conversion tip', body: 'Partners at your tier who maintain 80%+ conversion for 3 consecutive months unlock Pro-tier pricing. You\'re on track -- keep it up.' },
  { title: 'Referral momentum', body: 'You\'ve submitted 4 referrals this month. The average partner submits 6. One more strong week puts you above average.' },
  { title: 'Revenue milestone', body: 'You\'re $1,200 away from your next earnings tier. Submitting 2 more qualified referrals this month should get you there.' },
  { title: 'Engagement insight', body: 'Partners who complete the Business Planner earn 32% more in their first 90 days. Yours is ready to go in the sidebar.' },
  { title: 'Payout reminder', body: 'Your next scheduled payout is in 5 business days. Make sure your bank details are up to date in Settings.' },
  { title: 'Training opportunity', body: 'A new CE Webinar drops next Tuesday: "Overcoming IRS Objections." Partners who attend close 18% more referrals.' }
];
var _dibIdx = 0;

function dibNextInsight() {
  _dibIdx = (_dibIdx + 1) % _dibInsights.length;
  var titleEl = document.getElementById('dib-title');
  var bodyEl = document.getElementById('dib-body');
  if (!titleEl || !bodyEl) return;
  var banner = document.getElementById('dash-insights-banner');
  if (banner) banner.style.opacity = '0';
  setTimeout(function() {
    titleEl.textContent = _dibInsights[_dibIdx].title;
    bodyEl.textContent = _dibInsights[_dibIdx].body;
    if (banner) banner.style.opacity = '1';
  }, 200);
}

function dibDismiss() {
  var banner = document.getElementById('dash-insights-banner');
  if (!banner) return;
  banner.style.opacity = '0';
  banner.style.maxHeight = '0';
  banner.style.padding = '0 20px';
  banner.style.marginBottom = '0';
  banner.style.border = 'none';
  setTimeout(function() { banner.style.display = 'none'; }, 300);
}

// Keyboard listener for Cmd+K and navigation
document.addEventListener('keydown', function(e) {
  var overlay = document.getElementById('cmdk-overlay');
  var isOpen = overlay && overlay.classList.contains('cmdk-open');

  // Cmd+K or Ctrl+K to open
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    if (isOpen) { cmdkClose(); } else { cmdkOpen(); }
    return;
  }

  if (!isOpen) return;

  if (e.key === 'Escape') {
    e.preventDefault();
    cmdkClose();
    return;
  }

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    _cmdkActiveIdx = Math.min(_cmdkActiveIdx + 1, _cmdkFiltered.length - 1);
    cmdkHover(_cmdkActiveIdx);
    var active = document.querySelector('.cmdk-item-active');
    if (active) active.scrollIntoView({ block: 'nearest' });
    return;
  }

  if (e.key === 'ArrowUp') {
    e.preventDefault();
    _cmdkActiveIdx = Math.max(_cmdkActiveIdx - 1, 0);
    cmdkHover(_cmdkActiveIdx);
    var active2 = document.querySelector('.cmdk-item-active');
    if (active2) active2.scrollIntoView({ block: 'nearest' });
    return;
  }

  if (e.key === 'Enter') {
    e.preventDefault();
    cmdkExecute(_cmdkActiveIdx);
    return;
  }
});

// ── KEYBOARD SHORTCUTS HELP ──────────────────────────────────
var SHORTCUT_DATA = [
  { keys: ['Cmd', 'K'], desc: 'Open command bar' },
  { keys: ['?'], desc: 'Show keyboard shortcuts' },
  { keys: ['Esc'], desc: 'Close any overlay' },
  { keys: ['D'], desc: 'Go to Dashboard' },
  { keys: ['R'], desc: 'Go to Referrals' },
  { keys: ['E'], desc: 'Go to Earnings' },
  { keys: ['S'], desc: 'Submit a Referral' },
  { keys: ['T'], desc: 'Toggle Tunes' },
  { keys: ['P'], desc: 'Open Page Builder' },
  { keys: ['C'], desc: 'Open 30-Day Challenge' },
  { keys: ['B'], desc: 'Open Business Planner' }
];

function kbdHelpOpen() {
  var existing = document.getElementById('kbd-help-overlay');
  if (existing) { existing.classList.add('kbd-help-open'); return; }

  var overlay = document.createElement('div');
  overlay.id = 'kbd-help-overlay';
  overlay.className = 'kbd-help-overlay kbd-help-open';
  overlay.onclick = function(e) { if (e.target === overlay) kbdHelpClose(); };

  var html = '<div class="kbd-help-modal">';
  html += '<div class="kbd-help-header"><div class="kbd-help-title">Keyboard Shortcuts</div><button class="kbd-help-close" onclick="kbdHelpClose()">&times;</button></div>';
  html += '<div class="kbd-help-list">';
  SHORTCUT_DATA.forEach(function(s) {
    html += '<div class="kbd-help-row">';
    html += '<div class="kbd-help-keys">';
    s.keys.forEach(function(k) { html += '<kbd class="kbd-help-key">' + k + '</kbd>'; });
    html += '</div>';
    html += '<div class="kbd-help-desc">' + s.desc + '</div>';
    html += '</div>';
  });
  html += '</div></div>';
  overlay.innerHTML = html;
  document.body.appendChild(overlay);
}

function kbdHelpClose() {
  var overlay = document.getElementById('kbd-help-overlay');
  if (overlay) overlay.classList.remove('kbd-help-open');
}

// ═══ M3P2C1: NAVIGATION + SETTINGS UPGRADE ═══

// --- Collapsible Sidebar Sections ---
var NAV_COLLAPSE_KEY = 'ctax_nav_collapsed';
function initCollapsibleNav() {
  var saved = {};
  try { saved = JSON.parse(localStorage.getItem(NAV_COLLAPSE_KEY) || '{}'); } catch (e) {}

  document.querySelectorAll('.portal-nav-group').forEach(function(group, i) {
    var heading = group.querySelector('.portal-nav-heading');
    if (!heading) return;
    var key = 'nav_' + i;

    // Add collapse toggle
    heading.style.cursor = 'pointer';
    heading.style.userSelect = 'none';
    heading.classList.add('pnh-collapsible');

    var chevron = document.createElement('span');
    chevron.className = 'pnh-chevron';
    chevron.innerHTML = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>';
    heading.appendChild(chevron);

    // Restore saved state
    if (saved[key]) {
      group.classList.add('png-collapsed');
    }

    heading.addEventListener('click', function() {
      group.classList.toggle('png-collapsed');
      try {
        var state = JSON.parse(localStorage.getItem(NAV_COLLAPSE_KEY) || '{}');
        state[key] = group.classList.contains('png-collapsed');
        localStorage.setItem(NAV_COLLAPSE_KEY, JSON.stringify(state));
      } catch (e) {}
    });
  });
}

// --- Breadcrumb Navigation ---
var BREADCRUMB_MAP = {
  'portal-sec-dashboard': ['Dashboard'],
  'portal-sec-referrals': ['Referrals'],
  'portal-sec-earnings': ['Financials', 'Earnings'],
  'portal-sec-payouts': ['Financials', 'Payouts'],
  'portal-sec-submit': ['Tools', 'Submit Referral'],
  'portal-sec-documents': ['Tools', 'Documents'],
  'portal-sec-calculator': ['Tools', 'Revenue Calculator'],
  'portal-sec-page-builder': ['Tools', 'Page Builder'],
  'portal-sec-my-pages': ['Tools', 'My Pages'],
  'portal-sec-page-metrics': ['Tools', 'Page Metrics'],
  'portal-sec-tunes': ['Tools', 'Tunes'],
  'portal-sec-ce': ['Resources', 'CE Webinars'],
  'portal-sec-marketing': ['Resources', 'Marketing Kit'],
  'portal-sec-playbook': ['Resources', 'Referral Playbook'],
  'portal-sec-planner': ['Resources', 'Business Planner'],
  'portal-sec-challenge': ['Resources', '30-Day Challenge'],
  'portal-sec-ai-scripts': ['AI Tools', 'Script Builder'],
  'portal-sec-ai-admaker': ['AI Tools', 'Ad Maker'],
  'portal-sec-ai-qualifier': ['AI Tools', 'Client Qualifier'],
  'portal-sec-ai-kb': ['AI Tools', 'Knowledge Base'],
  'portal-sec-settings': ['Account', 'Settings'],
  'portal-sec-support': ['Account', 'Support'],
  'portal-sec-training': ['Onboarding']
};

function updateBreadcrumb(secId) {
  var el = document.getElementById('portal-breadcrumb');
  if (!el) return;
  var crumbs = BREADCRUMB_MAP[secId] || ['Dashboard'];
  var html = '<a class="bc-link" onclick="portalNav(document.getElementById(\'nav-dashboard\'),\'portal-sec-dashboard\')">Portal</a>';
  crumbs.forEach(function(c, i) {
    html += '<span class="bc-sep"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="9 6 15 12 9 18"/></svg></span>';
    if (i === crumbs.length - 1) {
      html += '<span class="bc-current">' + c + '</span>';
    } else {
      html += '<span class="bc-link">' + c + '</span>';
    }
  });
  el.innerHTML = html;
}

// --- Settings: Referral Link Manager ---
function initReferralLink() {
  var el = document.getElementById('set-referral-link');
  if (!el) return;
  var partnerId = 'CTX-JH-2847';
  var link = 'https://communitytax.com/partner/' + partnerId;

  el.innerHTML = '<div class="set-section-title">Your Referral Link</div>'
    + '<div class="srl-card">'
    + '<div class="srl-link-row">'
    + '<input type="text" class="set-input srl-input" value="' + link + '" readonly id="srl-link-input">'
    + '<button class="srl-copy" onclick="srlCopyLink()">Copy</button>'
    + '</div>'
    + '<div class="srl-stats">'
    + '<div class="srl-stat"><div class="srl-stat-val">156</div><div class="srl-stat-label">Total Clicks</div></div>'
    + '<div class="srl-stat"><div class="srl-stat-val">24</div><div class="srl-stat-label">Conversions</div></div>'
    + '<div class="srl-stat"><div class="srl-stat-val">15.4%</div><div class="srl-stat-label">Conversion Rate</div></div>'
    + '</div>'
    + '<div class="srl-share-row">'
    + '<button class="srl-share-btn" onclick="srlShareEmail()"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> Email</button>'
    + '<button class="srl-share-btn" onclick="srlShareLinkedIn()"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg> LinkedIn</button>'
    + '<button class="srl-share-btn" onclick="srlGenerateQR()"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="3" height="3"/></svg> QR Code</button>'
    + '</div>'
    + '<div id="srl-qr-container" style="display:none;text-align:center;padding:16px 0"></div>'
    + '</div>';
}

function srlCopyLink() {
  var input = document.getElementById('srl-link-input');
  if (input) {
    navigator.clipboard.writeText(input.value).then(function() {
      showToast('Referral link copied', 'success');
    });
  }
}

function srlShareEmail() {
  var link = document.getElementById('srl-link-input');
  if (link) {
    window.open('mailto:?subject=Tax Resolution for Your Clients&body=I partner with Community Tax to help clients resolve IRS debt. Learn more: ' + encodeURIComponent(link.value));
  }
}

function srlShareLinkedIn() {
  var link = document.getElementById('srl-link-input');
  if (link) {
    window.open('https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(link.value), '_blank');
  }
}

function srlGenerateQR() {
  var container = document.getElementById('srl-qr-container');
  if (!container) return;
  if (container.style.display === 'block') {
    container.style.display = 'none';
    return;
  }
  // Simple QR code via SVG placeholder (a real implementation would use a QR library)
  var link = 'https://communitytax.com/partner/CTX-JH-2847';
  container.innerHTML = '<div style="background:#fff;display:inline-block;padding:16px;border-radius:12px;border:1px solid var(--off2)">'
    + '<svg width="160" height="160" viewBox="0 0 160 160"><rect width="160" height="160" fill="#fff"/>'
    + '<rect x="10" y="10" width="40" height="40" rx="4" fill="#0B5FD8"/><rect x="16" y="16" width="28" height="28" rx="2" fill="#fff"/><rect x="22" y="22" width="16" height="16" rx="1" fill="#0B5FD8"/>'
    + '<rect x="110" y="10" width="40" height="40" rx="4" fill="#0B5FD8"/><rect x="116" y="16" width="28" height="28" rx="2" fill="#fff"/><rect x="122" y="22" width="16" height="16" rx="1" fill="#0B5FD8"/>'
    + '<rect x="10" y="110" width="40" height="40" rx="4" fill="#0B5FD8"/><rect x="16" y="116" width="28" height="28" rx="2" fill="#fff"/><rect x="22" y="122" width="16" height="16" rx="1" fill="#0B5FD8"/>'
    + '<rect x="60" y="10" width="8" height="8" fill="#0B5FD8"/><rect x="76" y="10" width="8" height="8" fill="#0B5FD8"/><rect x="92" y="10" width="8" height="8" fill="#0B5FD8"/>'
    + '<rect x="60" y="26" width="8" height="8" fill="#0B5FD8"/><rect x="76" y="26" width="8" height="8" fill="#0B5FD8"/>'
    + '<rect x="60" y="42" width="8" height="8" fill="#0B5FD8"/><rect x="92" y="42" width="8" height="8" fill="#0B5FD8"/>'
    + '<rect x="60" y="60" width="8" height="8" fill="#0B5FD8"/><rect x="76" y="60" width="8" height="8" fill="#0B5FD8"/><rect x="92" y="60" width="8" height="8" fill="#0B5FD8"/><rect x="110" y="60" width="8" height="8" fill="#0B5FD8"/><rect x="140" y="60" width="8" height="8" fill="#0B5FD8"/>'
    + '<rect x="10" y="60" width="8" height="8" fill="#0B5FD8"/><rect x="26" y="60" width="8" height="8" fill="#0B5FD8"/><rect x="42" y="60" width="8" height="8" fill="#0B5FD8"/>'
    + '<rect x="60" y="76" width="8" height="8" fill="#0B5FD8"/><rect x="92" y="76" width="8" height="8" fill="#0B5FD8"/><rect x="110" y="76" width="8" height="8" fill="#0B5FD8"/><rect x="126" y="76" width="8" height="8" fill="#0B5FD8"/>'
    + '<rect x="76" y="92" width="8" height="8" fill="#0B5FD8"/><rect x="60" y="92" width="8" height="8" fill="#0B5FD8"/><rect x="110" y="92" width="8" height="8" fill="#0B5FD8"/><rect x="140" y="92" width="8" height="8" fill="#0B5FD8"/>'
    + '<rect x="60" y="110" width="8" height="8" fill="#0B5FD8"/><rect x="76" y="110" width="8" height="8" fill="#0B5FD8"/><rect x="110" y="110" width="8" height="8" fill="#0B5FD8"/><rect x="126" y="110" width="8" height="8" fill="#0B5FD8"/><rect x="140" y="110" width="8" height="8" fill="#0B5FD8"/>'
    + '<rect x="60" y="126" width="8" height="8" fill="#0B5FD8"/><rect x="92" y="126" width="8" height="8" fill="#0B5FD8"/><rect x="110" y="126" width="8" height="8" fill="#0B5FD8"/><rect x="140" y="126" width="8" height="8" fill="#0B5FD8"/>'
    + '<rect x="76" y="140" width="8" height="8" fill="#0B5FD8"/><rect x="92" y="140" width="8" height="8" fill="#0B5FD8"/><rect x="126" y="140" width="8" height="8" fill="#0B5FD8"/>'
    + '</svg>'
    + '<div style="font-size:12px;color:var(--slate);margin-top:8px">Scan to visit your referral page</div>'
    + '</div>';
  container.style.display = 'block';
}

// --- Settings: Brand Color Picker ---
var BRAND_COLOR_KEY = 'ctax_brand_color';
function initBrandColorPicker() {
  var el = document.getElementById('set-brand-color');
  if (!el) return;

  var saved = localStorage.getItem(BRAND_COLOR_KEY) || '#0B5FD8';

  el.innerHTML = '<div class="set-section-title">Brand Color</div>'
    + '<p class="set-section-desc">Choose your primary brand color. This will be applied to co-branded materials and your partner page.</p>'
    + '<div class="sbc-picker">'
    + '<div class="sbc-presets" id="sbc-presets"></div>'
    + '<div class="sbc-custom">'
    + '<label class="set-label">Custom Color</label>'
    + '<div class="sbc-custom-row">'
    + '<input type="color" id="sbc-color-input" value="' + saved + '" class="sbc-color-input">'
    + '<input type="text" id="sbc-hex-input" value="' + saved + '" class="set-input sbc-hex-input" maxlength="7">'
    + '<div class="sbc-preview" id="sbc-preview" style="background:' + saved + '"></div>'
    + '</div>'
    + '</div>'
    + '</div>';

  var presets = ['#0B5FD8', '#DC2626', '#059669', '#7C3AED', '#EA580C', '#0891B2', '#BE185D', '#4F46E5'];
  var presetsEl = document.getElementById('sbc-presets');
  presets.forEach(function(color) {
    var btn = document.createElement('button');
    btn.className = 'sbc-preset' + (color === saved ? ' sbc-preset-active' : '');
    btn.style.background = color;
    btn.onclick = function() {
      sbcApplyColor(color);
      document.querySelectorAll('.sbc-preset').forEach(function(p) { p.classList.remove('sbc-preset-active'); });
      btn.classList.add('sbc-preset-active');
    };
    presetsEl.appendChild(btn);
  });

  document.getElementById('sbc-color-input').addEventListener('input', function() {
    sbcApplyColor(this.value);
  });
  document.getElementById('sbc-hex-input').addEventListener('change', function() {
    if (/^#[0-9a-fA-F]{6}$/.test(this.value)) {
      sbcApplyColor(this.value);
    }
  });
}

function sbcApplyColor(color) {
  localStorage.setItem(BRAND_COLOR_KEY, color);
  var colorInput = document.getElementById('sbc-color-input');
  var hexInput = document.getElementById('sbc-hex-input');
  var preview = document.getElementById('sbc-preview');
  if (colorInput) colorInput.value = color;
  if (hexInput) hexInput.value = color;
  if (preview) preview.style.background = color;

  // Apply to portal layout
  var layout = document.querySelector('.portal-layout');
  if (layout) {
    var rgb = hexToRgb(color);
    layout.style.setProperty('--pa', color);
    layout.style.setProperty('--pa-rgb', rgb.r + ',' + rgb.g + ',' + rgb.b);
    layout.classList.add('portal-branded');
  }
  showToast('Brand color updated', 'success');
}

// --- Settings: Data Export ---
function exportPartnerData() {
  var data = {
    exportDate: new Date().toISOString(),
    partner: {
      name: 'Josh Hohenstein',
      company: 'Partner Tax Associates LLC',
      partnerId: 'CTX-JH-2847',
      tier: 'Premium'
    },
    toolUsage: {},
    toolHistory: [],
    challengeState: {},
    pageBuilderPages: [],
    brandColor: null,
    settings: {}
  };

  try { data.toolUsage = JSON.parse(localStorage.getItem('ctax_tool_stats') || '{}'); } catch (e) {}
  try { data.toolHistory = JSON.parse(localStorage.getItem('ctax_tool_history') || '[]'); } catch (e) {}
  try { data.challengeState = JSON.parse(localStorage.getItem('ch_30day_v1') || '{}'); } catch (e) {}
  try { data.pageBuilderPages = JSON.parse(localStorage.getItem('ctax_pb_pages') || '[]'); } catch (e) {}
  try { data.brandColor = localStorage.getItem('ctax_brand_color'); } catch (e) {}

  var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'ctax-partner-data-' + new Date().toISOString().slice(0, 10) + '.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('Data exported successfully', 'success');
}

// --- Notification System (extracted to js/portal-notifications.js) ---
// Functions: getNotifications, addNotification, updateNotifBadge,
// renderNotifPanel, markAllNotifRead, checkToolAchievements

// --- Init all M3P2 features ---
function initNavSettingsUpgrade() {
  initCollapsibleNav();
  initReferralLink();
  initBrandColorPicker();
  renderNotifPanel();
  checkToolAchievements();

  // Restore saved brand color
  var savedColor = localStorage.getItem(BRAND_COLOR_KEY);
  if (savedColor && typeof hexToRgb === 'function') {
    var layout = document.querySelector('.portal-layout');
    if (layout) {
      var rgb = hexToRgb(savedColor);
      layout.style.setProperty('--pa', savedColor);
      layout.style.setProperty('--pa-rgb', rgb.r + ',' + rgb.g + ',' + rgb.b);
      layout.classList.add('portal-branded');
    }
  }
}

// ═══ M3P3C1: PROFESSIONAL TOUCHES ═══

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
  try { return JSON.parse(localStorage.getItem(HELP_CHAT_KEY) || '[]'); } catch (e) { return []; }
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
    try { localStorage.setItem(HELP_CHAT_KEY, JSON.stringify(history.slice(-20))); } catch (e) {}

  } catch (err) {
    history.push({ role: 'assistant', text: 'I am unable to connect right now. Please try again or contact <b>partners@communitytax.com</b> for help.' });
    try { localStorage.setItem(HELP_CHAT_KEY, JSON.stringify(history.slice(-20))); } catch (e) {}
  }

  var typing = document.getElementById('hc-typing');
  if (typing) typing.remove();
  renderHelpChatHistory();
}

function helpChatClear() {
  try { localStorage.removeItem(HELP_CHAT_KEY); } catch (e) {}
  renderHelpChatHistory();
}

// --- Onboarding Wizard Modal ---
var OB_WIZARD_KEY = 'ctax_ob_wizard';

function obWizardShouldShow() {
  try {
    var state = JSON.parse(localStorage.getItem(OB_WIZARD_KEY) || '{}');
    return !state.completed && !state.dismissed;
  } catch (e) { return true; }
}

function obWizardStart() {
  var overlay = document.getElementById('ob-wizard-overlay');
  if (!overlay) createObWizard();
  overlay = document.getElementById('ob-wizard-overlay');
  if (overlay) overlay.classList.add('ob-open');
  obWizardGoTo(0);
}

function obWizardClose() {
  var overlay = document.getElementById('ob-wizard-overlay');
  if (overlay) overlay.classList.remove('ob-open');
}

function obWizardDismiss() {
  try {
    var state = JSON.parse(localStorage.getItem(OB_WIZARD_KEY) || '{}');
    state.dismissed = true;
    localStorage.setItem(OB_WIZARD_KEY, JSON.stringify(state));
  } catch (e) {}
  obWizardClose();
}

function obWizardComplete() {
  try {
    var state = JSON.parse(localStorage.getItem(OB_WIZARD_KEY) || '{}');
    state.completed = true;
    state.completedAt = Date.now();
    localStorage.setItem(OB_WIZARD_KEY, JSON.stringify(state));
  } catch (e) {}
  obWizardClose();
  showToast('Welcome aboard! Your portal is ready.', 'success');
  if (typeof addNotification === 'function') {
    addNotification('Onboarding complete! Welcome to the partner program.', 'info');
  }
}

var _obStep = 0;
var OB_STEPS = [
  {
    title: 'Welcome to Community Tax Partners',
    desc: 'You are about to set up your partner portal. This quick wizard will help you get the most out of the platform from day one.',
    icon: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
    action: null
  },
  {
    title: 'Upload Your Brand',
    desc: 'Add your firm logo in the sidebar to co-brand all marketing materials. Your logo will appear on referral pages, email templates, and ad creatives.',
    icon: '<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>',
    action: 'sidebar'
  },
  {
    title: 'Build Your ICP Profile',
    desc: 'Tell us about your ideal client. This powers personalized AI scripts, smarter client qualifications, and targeted ad copy.',
    icon: '<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>',
    action: 'icp'
  },
  {
    title: 'Create Your First Page',
    desc: 'Use the Page Builder to create a professional landing page in minutes. Choose a template, customize it, and publish it instantly.',
    icon: '<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/>',
    action: 'page-builder'
  },
  {
    title: 'Submit Your First Referral',
    desc: 'When you have a client with $7,000+ in IRS tax debt, submit their info through the portal. Community Tax handles everything -- you earn commission.',
    icon: '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/>',
    action: 'submit'
  },
  {
    title: 'You Are All Set!',
    desc: 'Your portal is configured and ready to generate revenue. Start with the 30-Day Challenge for a guided path, or explore the AI tools to create scripts, ads, and qualification reports.',
    icon: '<polyline points="20 6 9 17 4 12"/>',
    action: 'complete'
  }
];

function createObWizard() {
  var overlay = document.createElement('div');
  overlay.id = 'ob-wizard-overlay';
  overlay.className = 'ob-wizard-overlay';
  overlay.onclick = function(e) { if (e.target === overlay) obWizardClose(); };

  overlay.innerHTML = '<div class="ob-wizard-modal" id="ob-wizard-modal">'
    + '<button class="ob-wizard-close" onclick="obWizardDismiss()">&times;</button>'
    + '<div class="ob-wizard-progress" id="ob-wizard-progress"></div>'
    + '<div class="ob-wizard-body" id="ob-wizard-body"></div>'
    + '<div class="ob-wizard-footer" id="ob-wizard-footer"></div>'
    + '</div>';

  document.body.appendChild(overlay);
}

function obWizardGoTo(step) {
  _obStep = step;
  var s = OB_STEPS[step];
  if (!s) return;

  // Progress dots
  var progEl = document.getElementById('ob-wizard-progress');
  if (progEl) {
    var progHtml = '';
    OB_STEPS.forEach(function(_, i) {
      progHtml += '<div class="ob-dot' + (i === step ? ' ob-dot-active' : i < step ? ' ob-dot-done' : '') + '"></div>';
    });
    progEl.innerHTML = progHtml;
  }

  // Body
  var bodyEl = document.getElementById('ob-wizard-body');
  if (bodyEl) {
    bodyEl.innerHTML = '<div class="ob-step-icon"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' + s.icon + '</svg></div>'
      + '<div class="ob-step-title">' + s.title + '</div>'
      + '<div class="ob-step-desc">' + s.desc + '</div>';
  }

  // Footer
  var footerEl = document.getElementById('ob-wizard-footer');
  if (footerEl) {
    var html = '';
    if (step > 0) {
      html += '<button class="ob-btn ob-btn-secondary" onclick="obWizardGoTo(' + (step - 1) + ')">Back</button>';
    } else {
      html += '<button class="ob-btn ob-btn-secondary" onclick="obWizardDismiss()">Skip for now</button>';
    }
    if (step < OB_STEPS.length - 1) {
      html += '<button class="ob-btn ob-btn-primary" onclick="obWizardGoTo(' + (step + 1) + ')">Next</button>';
    } else {
      html += '<button class="ob-btn ob-btn-primary" onclick="obWizardComplete()">Get Started</button>';
    }
    footerEl.innerHTML = html;
  }
}

// --- Init all M3P3 features ---
function initProfessionalTouches() {
  // Help chat widget
  var chatWidget = document.getElementById('help-chat-fab');
  if (!chatWidget) {
    var chatHtml = '<button class="hc-fab" id="help-chat-fab" onclick="helpChatToggle()" aria-label="Help chat">'
      + '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>'
      + '</button>'
      + '<div class="hc-panel" id="help-chat-panel">'
      + '<div class="hc-header">'
      + '<div class="hc-header-left"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> Partner Help</div>'
      + '<div class="hc-header-right">'
      + '<button class="hc-clear" onclick="helpChatClear()" title="Clear history"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg></button>'
      + '<button class="hc-close" onclick="helpChatToggle()">&times;</button>'
      + '</div>'
      + '</div>'
      + '<div class="hc-messages" id="hc-messages"></div>'
      + '<div class="hc-input-row">'
      + '<input type="text" class="hc-input" id="hc-input" placeholder="Ask a question..." onkeydown="if(event.key===\'Enter\')helpChatSend()">'
      + '<button class="hc-send" onclick="helpChatSend()"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></button>'
      + '</div>'
      + '</div>';
    var container = document.createElement('div');
    container.className = 'hc-container';
    container.innerHTML = chatHtml;
    document.body.appendChild(container);
  }

  // Onboarding wizard disabled -- guided-tour spotlight handles onboarding
  // The spotlight walkthrough (guided-tour.js) is preferred over the modal wizard
}

// Global shortcut keys (single-key, no modifier, not inside input)
document.addEventListener('keydown', function(e) {
  // Skip if user is typing in an input/textarea/select
  var tag = (e.target.tagName || '').toLowerCase();
  if (tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable) return;
  // Skip if any overlay is open
  var cmdkOpen = document.querySelector('.cmdk-open');
  if (cmdkOpen) return;
  var kbdOpen = document.querySelector('.kbd-help-open');

  if (e.key === '?' && !e.metaKey && !e.ctrlKey) {
    e.preventDefault();
    if (kbdOpen) kbdHelpClose(); else kbdHelpOpen();
    return;
  }

  if (kbdOpen) {
    if (e.key === 'Escape') { kbdHelpClose(); return; }
    return;
  }

  // Single-key nav shortcuts
  var shortcuts = {
    'd': 'portal-sec-dashboard',
    'r': 'portal-sec-referrals',
    'e': 'portal-sec-earnings',
    's': 'portal-sec-submit',
    'p': 'portal-sec-page-builder',
    'c': 'portal-sec-challenge',
    'b': 'portal-sec-planner'
  };
  if (shortcuts[e.key]) {
    e.preventDefault();
    var nav = document.querySelector('[onclick*="' + shortcuts[e.key] + '"]');
    if (nav) portalNav(nav, shortcuts[e.key]);
    return;
  }
  if (e.key === 't' && typeof toggleTunes === 'function') {
    e.preventDefault();
    toggleTunes();
    return;
  }
});

// ── TOPBAR QUICK TIPS ──────────────────────────────────
var PI_TIPS = {
  'portal-sec-dashboard': [
    '<strong>Check KPIs each morning</strong> to spot trends before they become problems.',
    '<strong>Click any metric card</strong> to drill into the details behind the number.',
    '<strong>Use the pipeline tracker</strong> to follow every referral from submission to payout.'
  ],
  'portal-sec-referrals': [
    '<strong>Sort by status</strong> to surface referrals that need your attention right now.',
    '<strong>Click any row</strong> to see the full timeline and history for that referral.',
    '<strong>Use filters</strong> to quickly find referrals at a specific stage.'
  ],
  'portal-sec-earnings': [
    '<strong>Review monthly trends</strong> to identify your highest-performing periods.',
    '<strong>Use the breakdown view</strong> to see which referral types earn the most.',
    '<strong>Export reports</strong> for your own bookkeeping or tax filing.'
  ],
  'portal-sec-payouts': [
    '<strong>Keep your payment method current</strong> to avoid delays on your next payout.',
    '<strong>Download your 1099</strong> well before the filing deadline.',
    '<strong>Check payout history</strong> to reconcile with your own records.'
  ],
  'portal-sec-submit': [
    '<strong>Add as much detail as possible</strong> -- it speeds up processing significantly.',
    '<strong>Double-check contact info</strong> before hitting submit to avoid delays.',
    '<strong>Include the debt amount</strong> for faster qualification routing.'
  ],
  'portal-sec-documents': [
    '<strong>Upload signed authorizations</strong> immediately to keep cases moving fast.',
    '<strong>Organize by client name</strong> so you can find any file in seconds.',
    '<strong>Check document status</strong> to see what the resolution team still needs.'
  ],
  'portal-sec-calculator': [
    '<strong>Adjust referral volume</strong> to see exactly how earnings scale at each tier.',
    '<strong>Try different tier levels</strong> to set realistic monthly growth goals.',
    '<strong>Use the projections</strong> to plan your referral pipeline for the quarter.'
  ],
  'portal-sec-ce': [
    '<strong>CE credits boost your credibility</strong> with clients and prospects.',
    '<strong>Join live sessions</strong> to ask questions and get real-time answers.',
    '<strong>Complete all modules</strong> to earn your certificate of completion.'
  ],
  'portal-sec-marketing': [
    '<strong>Co-branded materials</strong> build trust faster than generic outreach.',
    '<strong>Personalize email templates</strong> -- even small tweaks boost open rates.',
    '<strong>Download assets</strong> in multiple formats for social, print, and email.'
  ],
  'portal-sec-training': [
    '<strong>Complete all modules</strong> to unlock your full partner toolkit.',
    '<strong>Each module takes ~5 minutes</strong> -- quick wins to get you started.',
    '<strong>Review key concepts</strong> before your next client conversation.'
  ],
  'portal-sec-playbook': [
    '<strong>Practice scripts out loud</strong> before your next client meeting.',
    '<strong>Use the objection handlers</strong> for the most common pushbacks you\'ll hear.',
    '<strong>Bookmark your favorites</strong> for quick reference during calls.'
  ],
  'portal-sec-planner': [
    '<strong>Answer honestly</strong> for the most useful, personalized roadmap.',
    '<strong>Revisit your plan monthly</strong> to measure real progress against goals.',
    '<strong>Share insights</strong> with your team to align on strategy.'
  ],
  'portal-sec-challenge': [
    '<strong>Complete tasks daily</strong> to build momentum -- streaks compound fast.',
    '<strong>Each action is designed</strong> to generate a real referral opportunity.',
    '<strong>Check the leaderboard</strong> to see how you stack up against peers.'
  ],
  'portal-sec-ai-scripts': [
    '<strong>Pick a scenario</strong> that matches your next real conversation.',
    '<strong>Customize the tone</strong> so it sounds like you, not a robot.',
    '<strong>Download as PDF</strong> to have scripts ready offline.'
  ],
  'portal-sec-ai-admaker': [
    '<strong>Choose your platform first</strong> -- sizing adjusts automatically.',
    '<strong>Upload your logo</strong> for professional co-branded ads.',
    '<strong>Try all 6 templates</strong> to find the look that fits your brand.'
  ],
  'portal-sec-ai-qualifier': [
    '<strong>Enter real client details</strong> for the most accurate qualification score.',
    '<strong>High-score leads convert faster</strong> -- prioritize them in your pipeline.',
    '<strong>Download the report</strong> to share with your team.'
  ],
  'portal-sec-ai-kb': [
    '<strong>Ask in plain English</strong> -- the AI understands full questions and context.',
    '<strong>Try asking about</strong> commission tiers, timelines, or program policies.',
    '<strong>Copy answers</strong> to paste into client emails or conversations.'
  ],
  'portal-sec-settings': [
    '<strong>Complete your profile</strong> -- it builds trust with the internal team.',
    '<strong>Set notification preferences</strong> so you only get alerts that matter.',
    '<strong>Update your branding</strong> to customize co-branded materials.'
  ],
  'portal-sec-support': [
    '<strong>Search existing tickets</strong> first before creating a new one.',
    '<strong>Include screenshots</strong> when reporting issues for faster resolution.',
    '<strong>Check the knowledge base</strong> for instant answers to common questions.'
  ],
  'portal-sec-my-pages': [
    '<strong>Check analytics</strong> to see which landing pages actually convert.',
    '<strong>Duplicate a top performer</strong> and tweak the copy for a new audience.',
    '<strong>Share your page link</strong> directly with prospects.'
  ],
  'portal-sec-page-metrics': [
    '<strong>Check each category score</strong> to identify your weakest areas.',
    '<strong>Click "Full Report"</strong> for detailed per-check analysis with fix suggestions.',
    '<strong>Re-run audits</strong> after making changes to track improvement.'
  ],
  'portal-sec-tunes': [
    '<strong>Pick a station</strong> that matches your work vibe -- focus or energy.',
    '<strong>Music keeps playing</strong> while you navigate to other portal pages.',
    '<strong>Adjust volume</strong> with the slider in the bottom bar.'
  ]
};

function updateQuickTips(secId) {
  var list = document.getElementById('pi-tooltip-list');
  if (!list) return;
  var tips = PI_TIPS[secId] || PI_TIPS['portal-sec-dashboard'];
  list.innerHTML = tips.map(function(t) { return '<li>' + t + '</li>'; }).join('');
}

// Init tips for dashboard on load
document.addEventListener('DOMContentLoaded', function() {
  updateQuickTips('portal-sec-dashboard');
});
