// ══════════════════════════════════════════
//  M2P3C2: AI DASHBOARD
//  Unified analytics, results archive,
//  content calendar, and saved prompts
// ══════════════════════════════════════════

// ── TAB SWITCHING ────────────────────────────────────
function aidSwitchTab(btn, panelId) {
  document.querySelectorAll('.aid-tab').forEach(function(t) { t.classList.remove('aid-tab-active'); });
  document.querySelectorAll('.aid-panel').forEach(function(p) { p.style.display = 'none'; p.classList.remove('aid-panel-active'); });
  btn.classList.add('aid-tab-active');
  var panel = document.getElementById(panelId);
  if (panel) { panel.style.display = 'block'; panel.classList.add('aid-panel-active'); }

  // Lazy-render tab content
  if (panelId === 'aid-overview') aidRenderOverview();
  else if (panelId === 'aid-archive') aidRenderArchive();
  else if (panelId === 'aid-calendar') aidRenderCalendar();
  else if (panelId === 'aid-prompts') aidRenderPrompts();
}

// ── DATA ACCESS ──────────────────────────────────────
var AID_HISTORY_KEY = 'ctax_tool_history';
var AID_STATS_KEY = 'ctax_tool_stats';
var AID_CALENDAR_KEY = 'ctax_content_calendar';
var AID_PROMPTS_KEY = 'ctax_saved_prompts';

function aidGetHistory() {
  try { return JSON.parse(localStorage.getItem(AID_HISTORY_KEY) || '[]'); } catch (e) { return []; }
}

function aidGetStats() {
  try { return JSON.parse(localStorage.getItem(AID_STATS_KEY) || '{}'); } catch (e) { return {}; }
}

function aidGetCalendar() {
  try { return JSON.parse(localStorage.getItem(AID_CALENDAR_KEY) || '[]'); } catch (e) { return []; }
}

function aidSetCalendar(items) {
  try { localStorage.setItem(AID_CALENDAR_KEY, JSON.stringify(items)); } catch (e) {}
}

function aidGetPrompts() {
  try { return JSON.parse(localStorage.getItem(AID_PROMPTS_KEY) || '[]'); } catch (e) { return []; }
}

function aidSetPrompts(items) {
  try { localStorage.setItem(AID_PROMPTS_KEY, JSON.stringify(items)); } catch (e) {}
}

// ── TOOL METADATA ────────────────────────────────────
var AID_TOOLS = {
  'script-builder': { label: 'Script Builder', color: '#0B5FD8', icon: 'zap' },
  'ad-maker': { label: 'Ad Maker', color: '#059669', icon: 'image' },
  'client-qualifier': { label: 'Client Qualifier', color: '#7C3AED', icon: 'search' },
  'knowledge-base': { label: 'Knowledge Base', color: '#F59E0B', icon: 'book' }
};

function aidToolLabel(key) { return AID_TOOLS[key] ? AID_TOOLS[key].label : key; }
function aidToolColor(key) { return AID_TOOLS[key] ? AID_TOOLS[key].color : '#6B7280'; }

// ── HELPERS ──────────────────────────────────────────
function aidTimeAgo(ts) {
  var diff = Date.now() - ts;
  var mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return mins + 'm ago';
  var hrs = Math.floor(mins / 60);
  if (hrs < 24) return hrs + 'h ago';
  var days = Math.floor(hrs / 24);
  if (days < 7) return days + 'd ago';
  return new Date(ts).toLocaleDateString();
}

function aidEsc(s) {
  var d = document.createElement('div');
  d.textContent = s || '';
  return d.innerHTML;
}

function aidDateKey(ts) {
  var d = new Date(ts);
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

// ══════════════════════════════════════════
//  OVERVIEW TAB
// ══════════════════════════════════════════

function aidRenderOverview() {
  aidRenderStats();
  aidRenderChart();
  aidRenderBreakdown();
  aidRenderRecentActivity();
}

function aidRenderStats() {
  var el = document.getElementById('aid-stats-row');
  if (!el) return;
  var stats = aidGetStats();
  var history = aidGetHistory();
  var totalUses = 0;
  Object.keys(stats).forEach(function(k) { totalUses += (stats[k].count || 0); });

  var today = aidDateKey(Date.now());
  var todayCount = history.filter(function(h) { return aidDateKey(h.timestamp) === today; }).length;

  // Streak calculation
  var streak = 0;
  var checkDate = new Date();
  while (true) {
    var key = aidDateKey(checkDate.getTime());
    var hasActivity = history.some(function(h) { return aidDateKey(h.timestamp) === key; });
    if (!hasActivity && streak > 0) break;
    if (hasActivity) streak++;
    checkDate.setDate(checkDate.getDate() - 1);
    if (streak > 365) break;
  }

  var favTool = '';
  var favCount = 0;
  Object.keys(stats).forEach(function(k) {
    if (stats[k].count > favCount) { favCount = stats[k].count; favTool = k; }
  });

  el.innerHTML = ''
    + '<div class="aid-stat-card">'
    + '<div class="aid-stat-val">' + totalUses + '</div>'
    + '<div class="aid-stat-lbl">Total Uses</div>'
    + '</div>'
    + '<div class="aid-stat-card">'
    + '<div class="aid-stat-val">' + todayCount + '</div>'
    + '<div class="aid-stat-lbl">Today</div>'
    + '</div>'
    + '<div class="aid-stat-card">'
    + '<div class="aid-stat-val">' + streak + '</div>'
    + '<div class="aid-stat-lbl">Day Streak</div>'
    + '</div>'
    + '<div class="aid-stat-card">'
    + '<div class="aid-stat-val" style="font-size:18px;color:' + aidToolColor(favTool) + '">' + aidToolLabel(favTool || 'None') + '</div>'
    + '<div class="aid-stat-lbl">Most Used Tool</div>'
    + '</div>';
}

function aidRenderChart() {
  var el = document.getElementById('aid-chart');
  if (!el) return;
  var rangeSelect = document.getElementById('aid-chart-range');
  var days = rangeSelect ? parseInt(rangeSelect.value) : 30;
  var history = aidGetHistory();

  // Build day buckets
  var buckets = {};
  var labels = [];
  var now = new Date();
  for (var i = days - 1; i >= 0; i--) {
    var d = new Date(now);
    d.setDate(d.getDate() - i);
    var key = aidDateKey(d.getTime());
    buckets[key] = { total: 0 };
    Object.keys(AID_TOOLS).forEach(function(t) { buckets[key][t] = 0; });
    labels.push(key);
  }

  history.forEach(function(h) {
    var key = aidDateKey(h.timestamp);
    if (buckets[key]) {
      buckets[key].total++;
      if (buckets[key][h.tool] !== undefined) buckets[key][h.tool]++;
    }
  });

  // Find max for scaling
  var maxVal = 1;
  labels.forEach(function(k) { if (buckets[k].total > maxVal) maxVal = buckets[k].total; });

  // Render bar chart
  var barW = Math.max(4, Math.floor((el.offsetWidth || 700) / labels.length) - 2);
  var chartH = 120;
  var html = '<div class="aid-chart-bars" style="height:' + chartH + 'px">';

  labels.forEach(function(key, idx) {
    var bucket = buckets[key];
    var h = Math.round((bucket.total / maxVal) * (chartH - 20));
    var dayLabel = key.split('-')[2];
    var showLabel = (days <= 7) || (idx % Math.ceil(days / 10) === 0);

    // Stacked bar segments
    var segments = '';
    var yOffset = 0;
    Object.keys(AID_TOOLS).forEach(function(t) {
      if (bucket[t] > 0) {
        var segH = Math.max(2, Math.round((bucket[t] / maxVal) * (chartH - 20)));
        segments += '<div style="height:' + segH + 'px;background:' + aidToolColor(t) + ';width:100%;border-radius:2px;margin-bottom:1px" title="' + aidToolLabel(t) + ': ' + bucket[t] + '"></div>';
        yOffset += segH;
      }
    });

    html += '<div class="aid-chart-bar-wrap" style="width:' + barW + 'px">'
      + '<div class="aid-chart-bar" style="height:' + Math.max(2, h) + 'px">' + (segments || '<div style="height:2px;background:var(--off2);width:100%;border-radius:2px"></div>') + '</div>'
      + (showLabel ? '<div class="aid-chart-label">' + dayLabel + '</div>' : '')
      + '</div>';
  });

  html += '</div>';
  el.innerHTML = html;
}

function aidRenderBreakdown() {
  var el = document.getElementById('aid-breakdown');
  if (!el) return;
  var stats = aidGetStats();
  var total = 0;
  Object.keys(stats).forEach(function(k) { total += (stats[k].count || 0); });
  if (total === 0) { el.innerHTML = '<div class="aid-empty-sm">No usage data yet. Start using AI tools to see breakdowns.</div>'; return; }

  var html = '';
  Object.keys(AID_TOOLS).forEach(function(k) {
    var count = stats[k] ? stats[k].count : 0;
    var pct = Math.round((count / total) * 100);
    html += '<div class="aid-bd-row">'
      + '<div class="aid-bd-label"><span class="aid-bd-dot" style="background:' + aidToolColor(k) + '"></span>' + aidToolLabel(k) + '</div>'
      + '<div class="aid-bd-bar-wrap"><div class="aid-bd-bar" style="width:' + pct + '%;background:' + aidToolColor(k) + '"></div></div>'
      + '<div class="aid-bd-val">' + count + ' <span class="aid-bd-pct">(' + pct + '%)</span></div>'
      + '</div>';
  });
  el.innerHTML = html;
}

function aidRenderRecentActivity() {
  var el = document.getElementById('aid-recent-activity');
  if (!el) return;
  var history = aidGetHistory().slice(0, 8);
  if (!history.length) { el.innerHTML = '<div class="aid-empty-sm">No activity yet.</div>'; return; }

  var html = '';
  history.forEach(function(h) {
    html += '<div class="aid-activity-row">'
      + '<div class="aid-activity-dot" style="background:' + aidToolColor(h.tool) + '"></div>'
      + '<div class="aid-activity-info">'
      + '<div class="aid-activity-label">' + aidEsc(h.label) + '</div>'
      + '<div class="aid-activity-meta">' + aidToolLabel(h.tool) + ' &middot; ' + aidTimeAgo(h.timestamp) + '</div>'
      + '</div>'
      + '</div>';
  });
  el.innerHTML = html;
}

// ══════════════════════════════════════════
//  RESULTS ARCHIVE TAB
// ══════════════════════════════════════════

function aidRenderArchive() {
  aidFilterArchive();
}

function aidFilterArchive() {
  var search = (document.getElementById('aid-search') || {}).value || '';
  var toolFilter = (document.getElementById('aid-filter-tool') || {}).value || '';
  var timeFilter = (document.getElementById('aid-filter-time') || {}).value || '';
  var history = aidGetHistory();

  // Apply filters
  var filtered = history.filter(function(h) {
    if (toolFilter && h.tool !== toolFilter) return false;
    if (search) {
      var q = search.toLowerCase();
      var labelMatch = (h.label || '').toLowerCase().indexOf(q) !== -1;
      var dataMatch = JSON.stringify(h.data || {}).toLowerCase().indexOf(q) !== -1;
      if (!labelMatch && !dataMatch) return false;
    }
    if (timeFilter) {
      var now = Date.now();
      var ts = h.timestamp;
      if (timeFilter === 'today' && (now - ts) > 86400000) return false;
      if (timeFilter === 'week' && (now - ts) > 604800000) return false;
      if (timeFilter === 'month' && (now - ts) > 2592000000) return false;
    }
    return true;
  });

  var listEl = document.getElementById('aid-archive-list');
  var emptyEl = document.getElementById('aid-archive-empty');
  if (!listEl) return;

  if (!filtered.length) {
    listEl.innerHTML = '';
    if (emptyEl) emptyEl.style.display = 'block';
    return;
  }
  if (emptyEl) emptyEl.style.display = 'none';

  var html = '';
  filtered.forEach(function(h, idx) {
    var preview = '';
    if (h.data) {
      if (h.data.text) preview = h.data.text.substring(0, 120) + '...';
      else if (h.data.answer) preview = (h.data.answer || '').replace(/<[^>]+>/g, '').substring(0, 120) + '...';
      else if (h.data.question) preview = h.data.question;
      else if (h.data.verdict) preview = 'Verdict: ' + h.data.verdict + ' | Debt: ' + (h.data.debt || 'N/A');
      else if (h.data.firm) preview = h.data.firm + ' | ' + (h.data.platform || '') + ' | Template ' + (h.data.template || '');
    }

    html += '<div class="aid-archive-item" onclick="aidExpandResult(' + idx + ')">'
      + '<div class="aid-archive-dot" style="background:' + aidToolColor(h.tool) + '"></div>'
      + '<div class="aid-archive-content">'
      + '<div class="aid-archive-label">' + aidEsc(h.label) + '</div>'
      + '<div class="aid-archive-preview">' + aidEsc(preview) + '</div>'
      + '<div class="aid-archive-meta">' + aidToolLabel(h.tool) + ' &middot; ' + aidTimeAgo(h.timestamp) + '</div>'
      + '</div>'
      + '<div class="aid-archive-actions">'
      + '<button class="aid-icon-btn" onclick="event.stopPropagation();aidCopyResult(' + idx + ')" title="Copy"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg></button>'
      + '<button class="aid-icon-btn" onclick="event.stopPropagation();aidDeleteResult(' + idx + ')" title="Delete"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg></button>'
      + '</div>'
      + '</div>';
  });
  listEl.innerHTML = html;
}

function aidExpandResult(idx) {
  var history = aidGetHistory();
  var item = history[idx];
  if (!item) return;

  var overlay = document.createElement('div');
  overlay.className = 'aid-modal-overlay';
  overlay.id = 'aid-result-modal';
  overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };

  var modal = document.createElement('div');
  modal.className = 'aid-modal';

  var content = '';
  if (item.data) {
    if (item.data.text) content = '<pre class="aid-result-pre">' + aidEsc(item.data.text) + '</pre>';
    else if (item.data.answer) content = '<div class="aid-result-html">' + item.data.answer + '</div>';
    else if (item.data.question && item.data.answer) content = '<div class="aid-result-qa"><div class="aid-result-q">Q: ' + aidEsc(item.data.question) + '</div><div class="aid-result-a">' + item.data.answer + '</div></div>';
    else content = '<pre class="aid-result-pre">' + aidEsc(JSON.stringify(item.data, null, 2)) + '</pre>';
  }

  modal.innerHTML = '<div class="aid-modal-header">'
    + '<div>'
    + '<div class="aid-modal-title">' + aidEsc(item.label) + '</div>'
    + '<div class="aid-modal-meta">' + aidToolLabel(item.tool) + ' &middot; ' + new Date(item.timestamp).toLocaleString() + '</div>'
    + '</div>'
    + '<button class="aid-modal-close" onclick="document.getElementById(\'aid-result-modal\').remove()">&times;</button>'
    + '</div>'
    + '<div class="aid-modal-body">' + content + '</div>'
    + '<div class="aid-modal-footer">'
    + '<button class="btn btn-g" onclick="aidCopyResult(' + idx + ')">Copy Content</button>'
    + '<button class="btn btn-g" onclick="aidScheduleFromResult(' + idx + ')">Schedule</button>'
    + '<button class="btn btn-p" onclick="document.getElementById(\'aid-result-modal\').remove()">Close</button>'
    + '</div>';

  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}

function aidCopyResult(idx) {
  var history = aidGetHistory();
  var item = history[idx];
  if (!item || !item.data) return;
  var text = item.data.text || item.data.answer || item.data.question || JSON.stringify(item.data, null, 2);
  text = text.replace(/<[^>]+>/g, '');
  navigator.clipboard.writeText(text).then(function() {
    if (typeof showToast === 'function') showToast('Copied to clipboard', 'copied');
  });
}

function aidDeleteResult(idx) {
  var history = aidGetHistory();
  history.splice(idx, 1);
  try { localStorage.setItem(AID_HISTORY_KEY, JSON.stringify(history)); } catch (e) {}
  aidFilterArchive();
}

// ══════════════════════════════════════════
//  CONTENT CALENDAR TAB
// ══════════════════════════════════════════

var _aidCalYear, _aidCalMonth;

function aidRenderCalendar() {
  var now = new Date();
  if (!_aidCalYear) { _aidCalYear = now.getFullYear(); _aidCalMonth = now.getMonth(); }
  aidBuildCalGrid();
}

function aidCalPrev() {
  _aidCalMonth--;
  if (_aidCalMonth < 0) { _aidCalMonth = 11; _aidCalYear--; }
  aidBuildCalGrid();
}

function aidCalNext() {
  _aidCalMonth++;
  if (_aidCalMonth > 11) { _aidCalMonth = 0; _aidCalYear++; }
  aidBuildCalGrid();
}

function aidBuildCalGrid() {
  var monthEl = document.getElementById('aid-cal-month');
  var gridEl = document.getElementById('aid-cal-grid');
  if (!monthEl || !gridEl) return;

  var monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  monthEl.textContent = monthNames[_aidCalMonth] + ' ' + _aidCalYear;

  var history = aidGetHistory();
  var calendar = aidGetCalendar();

  // Build lookup: date -> items
  var dateLookup = {};
  history.forEach(function(h) {
    var key = aidDateKey(h.timestamp);
    if (!dateLookup[key]) dateLookup[key] = [];
    dateLookup[key].push({ type: 'result', tool: h.tool, label: h.label });
  });
  calendar.forEach(function(c) {
    if (!dateLookup[c.date]) dateLookup[c.date] = [];
    dateLookup[c.date].push({ type: 'scheduled', tool: c.tool, label: c.label, id: c.id });
  });

  var firstDay = new Date(_aidCalYear, _aidCalMonth, 1).getDay();
  var daysInMonth = new Date(_aidCalYear, _aidCalMonth + 1, 0).getDate();
  var todayKey = aidDateKey(Date.now());

  var html = '<div class="aid-cal-header-row">';
  ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach(function(d) {
    html += '<div class="aid-cal-header">' + d + '</div>';
  });
  html += '</div><div class="aid-cal-body">';

  // Empty cells before first day
  for (var e = 0; e < firstDay; e++) {
    html += '<div class="aid-cal-cell aid-cal-empty"></div>';
  }

  for (var d = 1; d <= daysInMonth; d++) {
    var dateKey = _aidCalYear + '-' + String(_aidCalMonth + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
    var items = dateLookup[dateKey] || [];
    var isToday = dateKey === todayKey;

    html += '<div class="aid-cal-cell' + (isToday ? ' aid-cal-today' : '') + '" onclick="aidCalDayClick(\'' + dateKey + '\')">';
    html += '<div class="aid-cal-day">' + d + '</div>';

    if (items.length > 0) {
      html += '<div class="aid-cal-dots">';
      var shown = items.slice(0, 3);
      shown.forEach(function(item) {
        var cls = item.type === 'scheduled' ? 'aid-cal-dot-sched' : 'aid-cal-dot-' + item.tool.replace('script-builder', 'script').replace('ad-maker', 'ad').replace('client-qualifier', 'qual').replace('knowledge-base', 'kb');
        html += '<span class="aid-cal-dot ' + cls + '" title="' + aidEsc(item.label) + '"></span>';
      });
      if (items.length > 3) html += '<span class="aid-cal-more">+' + (items.length - 3) + '</span>';
      html += '</div>';
    }

    html += '</div>';
  }

  html += '</div>';
  gridEl.innerHTML = html;
}

function aidCalDayClick(dateKey) {
  var history = aidGetHistory();
  var calendar = aidGetCalendar();

  var items = [];
  history.forEach(function(h) {
    if (aidDateKey(h.timestamp) === dateKey) items.push({ type: 'result', tool: h.tool, label: h.label, time: h.timestamp });
  });
  calendar.forEach(function(c) {
    if (c.date === dateKey) items.push({ type: 'scheduled', tool: c.tool, label: c.label, id: c.id, note: c.note });
  });

  if (!items.length) {
    if (typeof showToast === 'function') showToast('No content on this date', 'info');
    return;
  }

  var overlay = document.createElement('div');
  overlay.className = 'aid-modal-overlay';
  overlay.id = 'aid-cal-modal';
  overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };

  var dateParts = dateKey.split('-');
  var dateLabel = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2])).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  var html = '<div class="aid-modal-header"><div class="aid-modal-title">' + dateLabel + '</div>'
    + '<button class="aid-modal-close" onclick="document.getElementById(\'aid-cal-modal\').remove()">&times;</button></div>'
    + '<div class="aid-modal-body">';

  items.forEach(function(item) {
    var badge = item.type === 'scheduled'
      ? '<span class="aid-cal-badge-sched">Scheduled</span>'
      : '<span class="aid-cal-badge-done" style="background:' + aidToolColor(item.tool) + '">' + aidToolLabel(item.tool) + '</span>';
    html += '<div class="aid-cal-detail-row">'
      + badge + ' ' + aidEsc(item.label)
      + (item.note ? '<div class="aid-cal-detail-note">' + aidEsc(item.note) + '</div>' : '')
      + (item.type === 'scheduled' ? ' <button class="aid-icon-btn" onclick="aidDeleteCalItem(\'' + item.id + '\')" title="Remove"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>' : '')
      + '</div>';
  });

  html += '</div>';

  var modal = document.createElement('div');
  modal.className = 'aid-modal';
  modal.innerHTML = html;
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}

function aidShowScheduleContent() {
  var overlay = document.createElement('div');
  overlay.className = 'aid-modal-overlay';
  overlay.id = 'aid-sched-modal';
  overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };

  var today = new Date().toISOString().split('T')[0];

  var modal = document.createElement('div');
  modal.className = 'aid-modal';
  modal.innerHTML = '<div class="aid-modal-header"><div class="aid-modal-title">Schedule Content</div>'
    + '<button class="aid-modal-close" onclick="document.getElementById(\'aid-sched-modal\').remove()">&times;</button></div>'
    + '<div class="aid-modal-body">'
    + '<div class="ff" style="margin-bottom:16px"><label class="fl" style="position:relative;top:auto;left:auto;transform:none;display:block;margin-bottom:6px">Date</label>'
    + '<input type="date" id="aid-sched-date" value="' + today + '" style="width:100%;padding:10px 14px;border:1.5px solid var(--mist);border-radius:7px;font-size:15px"></div>'
    + '<div class="ff" style="margin-bottom:16px"><label class="fl" style="position:relative;top:auto;left:auto;transform:none;display:block;margin-bottom:6px">Tool</label>'
    + '<select id="aid-sched-tool" style="width:100%;padding:10px 14px;border:1.5px solid var(--mist);border-radius:7px;font-size:15px">'
    + '<option value="script-builder">Script Builder</option><option value="ad-maker">Ad Maker</option>'
    + '<option value="client-qualifier">Client Qualifier</option><option value="knowledge-base">Knowledge Base</option>'
    + '</select></div>'
    + '<div class="ff" style="margin-bottom:16px"><label class="fl" style="position:relative;top:auto;left:auto;transform:none;display:block;margin-bottom:6px">Label</label>'
    + '<input type="text" id="aid-sched-label" placeholder="e.g. LinkedIn post for Q2 campaign" style="width:100%;padding:10px 14px;border:1.5px solid var(--mist);border-radius:7px;font-size:15px"></div>'
    + '<div class="ff" style="margin-bottom:16px"><label class="fl" style="position:relative;top:auto;left:auto;transform:none;display:block;margin-bottom:6px">Notes (optional)</label>'
    + '<textarea id="aid-sched-note" rows="2" placeholder="Context or reminders..." style="width:100%;padding:10px 14px;border:1.5px solid var(--mist);border-radius:7px;font-size:15px;resize:vertical"></textarea></div>'
    + '</div>'
    + '<div class="aid-modal-footer">'
    + '<button class="btn btn-g" onclick="document.getElementById(\'aid-sched-modal\').remove()">Cancel</button>'
    + '<button class="btn btn-p" onclick="aidSaveSchedule()">Schedule</button>'
    + '</div>';

  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}

function aidScheduleFromResult(idx) {
  var m = document.getElementById('aid-result-modal');
  if (m) m.remove();
  aidShowScheduleContent();

  var history = aidGetHistory();
  var item = history[idx];
  if (item) {
    var toolSelect = document.getElementById('aid-sched-tool');
    var labelInput = document.getElementById('aid-sched-label');
    if (toolSelect) toolSelect.value = item.tool;
    if (labelInput) labelInput.value = item.label;
  }
}

function aidSaveSchedule() {
  var date = (document.getElementById('aid-sched-date') || {}).value;
  var tool = (document.getElementById('aid-sched-tool') || {}).value;
  var label = (document.getElementById('aid-sched-label') || {}).value.trim();
  var note = (document.getElementById('aid-sched-note') || {}).value.trim();

  if (!date || !label) {
    if (typeof showToast === 'function') showToast('Date and label are required', 'error');
    return;
  }

  var calendar = aidGetCalendar();
  calendar.push({ id: 'cal_' + Date.now(), date: date, tool: tool, label: label, note: note });
  aidSetCalendar(calendar);

  var m = document.getElementById('aid-sched-modal');
  if (m) m.remove();
  if (typeof showToast === 'function') showToast('Content scheduled for ' + date, 'success');
  aidBuildCalGrid();
}

function aidDeleteCalItem(id) {
  var calendar = aidGetCalendar().filter(function(c) { return c.id !== id; });
  aidSetCalendar(calendar);
  var m = document.getElementById('aid-cal-modal');
  if (m) m.remove();
  aidBuildCalGrid();
  if (typeof showToast === 'function') showToast('Scheduled item removed', 'success');
}

// ══════════════════════════════════════════
//  SAVED PROMPTS TAB
// ══════════════════════════════════════════

function aidRenderPrompts() {
  var list = document.getElementById('aid-prompts-list');
  var empty = document.getElementById('aid-prompts-empty');
  if (!list) return;

  var prompts = aidGetPrompts();
  if (!prompts.length) {
    list.innerHTML = '';
    if (empty) empty.style.display = 'block';
    return;
  }
  if (empty) empty.style.display = 'none';

  var html = '';
  prompts.forEach(function(p, idx) {
    html += '<div class="aid-prompt-card">'
      + '<div class="aid-prompt-header">'
      + '<div class="aid-prompt-name">' + aidEsc(p.name) + '</div>'
      + '<div class="aid-prompt-tool" style="color:' + aidToolColor(p.tool) + '">' + aidToolLabel(p.tool) + '</div>'
      + '</div>'
      + '<div class="aid-prompt-desc">' + aidEsc(p.description || '') + '</div>'
      + '<div class="aid-prompt-config">';

    if (p.config) {
      Object.keys(p.config).forEach(function(k) {
        if (p.config[k]) {
          html += '<span class="aid-prompt-tag">' + aidEsc(k) + ': ' + aidEsc(String(p.config[k]).substring(0, 40)) + '</span>';
        }
      });
    }

    html += '</div>'
      + '<div class="aid-prompt-actions">'
      + '<button class="btn btn-s" onclick="aidUsePrompt(' + idx + ')">Use Prompt</button>'
      + '<button class="aid-icon-btn" onclick="aidDeletePrompt(' + idx + ')" title="Delete"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg></button>'
      + '</div>'
      + '</div>';
  });
  list.innerHTML = html;
}

function aidShowSavePrompt() {
  var overlay = document.createElement('div');
  overlay.className = 'aid-modal-overlay';
  overlay.id = 'aid-prompt-modal';
  overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };

  var modal = document.createElement('div');
  modal.className = 'aid-modal';
  modal.innerHTML = '<div class="aid-modal-header"><div class="aid-modal-title">Save Prompt Configuration</div>'
    + '<button class="aid-modal-close" onclick="document.getElementById(\'aid-prompt-modal\').remove()">&times;</button></div>'
    + '<div class="aid-modal-body">'
    + '<div class="ff" style="margin-bottom:16px"><label class="fl" style="position:relative;top:auto;left:auto;transform:none;display:block;margin-bottom:6px">Prompt Name</label>'
    + '<input type="text" id="aid-prompt-name" placeholder="e.g. CPA Client Outreach Script" style="width:100%;padding:10px 14px;border:1.5px solid var(--mist);border-radius:7px;font-size:15px"></div>'
    + '<div class="ff" style="margin-bottom:16px"><label class="fl" style="position:relative;top:auto;left:auto;transform:none;display:block;margin-bottom:6px">Tool</label>'
    + '<select id="aid-prompt-tool" onchange="aidPromptToolChange()" style="width:100%;padding:10px 14px;border:1.5px solid var(--mist);border-radius:7px;font-size:15px">'
    + '<option value="script-builder">Script Builder</option><option value="ad-maker">Ad Maker</option>'
    + '<option value="client-qualifier">Client Qualifier</option><option value="knowledge-base">Knowledge Base</option>'
    + '</select></div>'
    + '<div class="ff" style="margin-bottom:16px"><label class="fl" style="position:relative;top:auto;left:auto;transform:none;display:block;margin-bottom:6px">Description</label>'
    + '<textarea id="aid-prompt-desc" rows="2" placeholder="When to use this prompt..." style="width:100%;padding:10px 14px;border:1.5px solid var(--mist);border-radius:7px;font-size:15px;resize:vertical"></textarea></div>'
    + '<div id="aid-prompt-fields"></div>'
    + '</div>'
    + '<div class="aid-modal-footer">'
    + '<button class="btn btn-g" onclick="document.getElementById(\'aid-prompt-modal\').remove()">Cancel</button>'
    + '<button class="btn btn-p" onclick="aidSavePromptConfig()">Save Prompt</button>'
    + '</div>';

  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  aidPromptToolChange();
}

function aidPromptToolChange() {
  var tool = (document.getElementById('aid-prompt-tool') || {}).value;
  var fields = document.getElementById('aid-prompt-fields');
  if (!fields) return;

  var configs = {
    'script-builder': [
      { key: 'type', label: 'Professional Type', type: 'text', placeholder: 'e.g. CPA / Tax Preparer' },
      { key: 'style', label: 'Communication Style', type: 'text', placeholder: 'e.g. warm and conversational' },
      { key: 'channel', label: 'Channel', type: 'text', placeholder: 'e.g. phone call' },
      { key: 'situation', label: 'Default Situation', type: 'textarea', placeholder: 'e.g. Client owes $30k+ from 2020-2022...' }
    ],
    'ad-maker': [
      { key: 'firm', label: 'Firm Name', type: 'text', placeholder: 'Your firm name' },
      { key: 'platform', label: 'Platform', type: 'text', placeholder: 'Facebook, Instagram, or LinkedIn' },
      { key: 'tagline', label: 'Tagline', type: 'text', placeholder: 'Your tagline' }
    ],
    'client-qualifier': [
      { key: 'debt', label: 'Default Debt Range', type: 'text', placeholder: '$15,000 - $30,000' },
      { key: 'issue', label: 'Common Issue Type', type: 'text', placeholder: 'Unpaid taxes / back taxes' }
    ],
    'knowledge-base': [
      { key: 'question', label: 'Default Question', type: 'text', placeholder: 'How does revenue share work?' }
    ]
  };

  var fieldDefs = configs[tool] || [];
  var html = '';
  fieldDefs.forEach(function(f) {
    html += '<div class="ff" style="margin-bottom:12px"><label class="fl" style="position:relative;top:auto;left:auto;transform:none;display:block;margin-bottom:6px">' + f.label + '</label>';
    if (f.type === 'textarea') {
      html += '<textarea id="aid-pc-' + f.key + '" rows="2" placeholder="' + f.placeholder + '" style="width:100%;padding:10px 14px;border:1.5px solid var(--mist);border-radius:7px;font-size:14px;resize:vertical"></textarea>';
    } else {
      html += '<input type="text" id="aid-pc-' + f.key + '" placeholder="' + f.placeholder + '" style="width:100%;padding:10px 14px;border:1.5px solid var(--mist);border-radius:7px;font-size:14px">';
    }
    html += '</div>';
  });
  fields.innerHTML = html;
}

function aidSavePromptConfig() {
  var name = (document.getElementById('aid-prompt-name') || {}).value.trim();
  var tool = (document.getElementById('aid-prompt-tool') || {}).value;
  var desc = (document.getElementById('aid-prompt-desc') || {}).value.trim();

  if (!name) {
    if (typeof showToast === 'function') showToast('Please enter a prompt name', 'error');
    return;
  }

  var config = {};
  document.querySelectorAll('[id^="aid-pc-"]').forEach(function(el) {
    var key = el.id.replace('aid-pc-', '');
    if (el.value.trim()) config[key] = el.value.trim();
  });

  var prompts = aidGetPrompts();
  prompts.unshift({ name: name, tool: tool, description: desc, config: config, created: Date.now() });
  aidSetPrompts(prompts);

  var m = document.getElementById('aid-prompt-modal');
  if (m) m.remove();
  if (typeof showToast === 'function') showToast('Prompt saved: ' + name, 'success');
  aidRenderPrompts();
}

function aidUsePrompt(idx) {
  var prompts = aidGetPrompts();
  var p = prompts[idx];
  if (!p) return;

  // Navigate to the tool's page and fill in fields
  var pageMap = {
    'script-builder': 'scripts',
    'ad-maker': 'admaker',
    'client-qualifier': 'qualifier',
    'knowledge-base': 'kb'
  };
  var page = pageMap[p.tool];
  if (page && typeof showPage === 'function') {
    showPage(page);
    // Delay to let page load, then fill fields
    setTimeout(function() {
      if (p.tool === 'script-builder' && p.config) {
        if (p.config.type) { var el = document.getElementById('sb-type'); if (el) el.value = p.config.type; }
        if (p.config.style) { var el = document.getElementById('sb-style'); if (el) el.value = p.config.style; }
        if (p.config.channel) { var el = document.getElementById('sb-channel'); if (el) el.value = p.config.channel; }
        if (p.config.situation) { var el = document.getElementById('sb-situation'); if (el) el.value = p.config.situation; }
      } else if (p.tool === 'ad-maker' && p.config) {
        if (p.config.firm) { var el = document.getElementById('am-firm'); if (el) el.value = p.config.firm; }
        if (p.config.platform) { var el = document.getElementById('am-platform'); if (el) el.value = p.config.platform; }
        if (p.config.tagline) { var el = document.getElementById('am-tagline'); if (el) el.value = p.config.tagline; }
      } else if (p.tool === 'client-qualifier' && p.config) {
        if (p.config.debt) { var el = document.getElementById('cq-debt'); if (el) el.value = p.config.debt; }
        if (p.config.issue) { var el = document.getElementById('cq-issue'); if (el) el.value = p.config.issue; }
      } else if (p.tool === 'knowledge-base' && p.config) {
        if (p.config.question) { var el = document.getElementById('kb-input'); if (el) el.value = p.config.question; }
      }
      if (typeof showToast === 'function') showToast('Prompt loaded: ' + p.name, 'copied');
    }, 300);
  }
}

function aidDeletePrompt(idx) {
  var prompts = aidGetPrompts();
  prompts.splice(idx, 1);
  aidSetPrompts(prompts);
  aidRenderPrompts();
  if (typeof showToast === 'function') showToast('Prompt deleted', 'success');
}

// ══════════════════════════════════════════
//  EXPORT FUNCTIONS
// ══════════════════════════════════════════

function aidExportJSON() {
  var data = {
    history: aidGetHistory(),
    stats: aidGetStats(),
    calendar: aidGetCalendar(),
    prompts: aidGetPrompts(),
    exported: new Date().toISOString()
  };
  var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'ctax-ai-dashboard-export-' + aidDateKey(Date.now()) + '.json';
  a.click();
  URL.revokeObjectURL(a.href);
  if (typeof showToast === 'function') showToast('Exported all data as JSON', 'success');
}

function aidExportCSV() {
  var history = aidGetHistory();
  var rows = [['Date', 'Tool', 'Label', 'Timestamp']];
  history.forEach(function(h) {
    rows.push([new Date(h.timestamp).toLocaleDateString(), aidToolLabel(h.tool), '"' + (h.label || '').replace(/"/g, '""') + '"', h.timestamp]);
  });
  var csv = rows.map(function(r) { return r.join(','); }).join('\n');
  var blob = new Blob([csv], { type: 'text/csv' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'ctax-ai-usage-' + aidDateKey(Date.now()) + '.csv';
  a.click();
  URL.revokeObjectURL(a.href);
  if (typeof showToast === 'function') showToast('Exported usage data as CSV', 'success');
}

function aidClearData() {
  if (!confirm('Clear all AI tool history, stats, calendar items, and saved prompts? This cannot be undone.')) return;
  localStorage.removeItem(AID_HISTORY_KEY);
  localStorage.removeItem(AID_STATS_KEY);
  localStorage.removeItem(AID_CALENDAR_KEY);
  localStorage.removeItem(AID_PROMPTS_KEY);
  aidRenderOverview();
  if (typeof showToast === 'function') showToast('All AI data cleared', 'success');
}

// ── INIT on portal nav ──────────────────────────────────
// Auto-render overview when dashboard section becomes visible
(function() {
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(m) {
      if (m.target.id === 'portal-sec-ai-dashboard' && m.target.classList.contains('portal-sec-active')) {
        aidRenderOverview();
      }
    });
  });
  var sec = document.getElementById('portal-sec-ai-dashboard');
  if (sec) observer.observe(sec, { attributes: true, attributeFilter: ['class'] });
})();
