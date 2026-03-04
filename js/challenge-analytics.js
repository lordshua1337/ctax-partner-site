// ══════════════════════════════════════════
//  M4P1C2: CHALLENGE ANALYTICS DASHBOARD
//  Deep stats, heatmap, patterns, projections
// ══════════════════════════════════════════

var CHA_LOG_KEY = 'ch_analytics_log';

// ── DATA ACCESS ──────────────────────────────

function chaGetLog() {
  try { return JSON.parse(localStorage.getItem(CHA_LOG_KEY) || '[]'); } catch (e) { return []; }
}

function chaSetLog(data) {
  try { localStorage.setItem(CHA_LOG_KEY, JSON.stringify(data)); } catch (e) {}
}

function chaLogCompletion(dayNum) {
  var log = chaGetLog();
  log.push({
    day: dayNum,
    timestamp: new Date().toISOString(),
    hour: new Date().getHours(),
    weekday: new Date().getDay()
  });
  chaSetLog(log);
}

function chaGetState() {
  try { return JSON.parse(localStorage.getItem('ch_30day_v1') || '{}'); } catch (e) { return {}; }
}

// ── ANALYTICS MODAL ──────────────────────────────

function chaShowAnalytics() {
  var overlay = document.createElement('div');
  overlay.className = 'aid-modal-overlay';
  overlay.id = 'cha-modal';
  overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };

  var modal = document.createElement('div');
  modal.className = 'aid-modal';
  modal.style.maxWidth = '720px';

  modal.innerHTML = '<div class="aid-modal-header">'
    + '<div><div class="aid-modal-title">Challenge Analytics</div>'
    + '<div class="aid-modal-meta">Deep dive into your progress patterns</div></div>'
    + '<button class="aid-modal-close" onclick="document.getElementById(\'cha-modal\').remove()">&times;</button>'
    + '</div>'
    + '<div class="cha-tabs" id="cha-tabs"></div>'
    + '<div class="aid-modal-body" id="cha-body" style="padding-top:0"></div>';

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  chaRenderTabs('overview');
  chaRenderOverview();
}

function chaRenderTabs(active) {
  var tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'heatmap', label: 'Activity Heatmap' },
    { key: 'patterns', label: 'Time Patterns' },
    { key: 'categories', label: 'Category Analysis' },
    { key: 'projections', label: 'Projections' }
  ];

  var el = document.getElementById('cha-tabs');
  if (!el) return;

  el.innerHTML = tabs.map(function(t) {
    return '<button class="cha-tab' + (t.key === active ? ' cha-tab-active' : '') + '" onclick="chaSwitchTab(\'' + t.key + '\')">' + t.label + '</button>';
  }).join('');
}

function chaSwitchTab(key) {
  chaRenderTabs(key);
  var renderers = {
    overview: chaRenderOverview,
    heatmap: chaRenderHeatmap,
    patterns: chaRenderPatterns,
    categories: chaRenderCategories,
    projections: chaRenderProjections
  };
  if (renderers[key]) renderers[key]();
}

// ── TAB 1: OVERVIEW ──────────────────────────────

function chaRenderOverview() {
  var body = document.getElementById('cha-body');
  if (!body) return;

  var state = chaGetState();
  var log = chaGetLog();
  var completed = chaCntDone(state);
  var total = 30;
  var skipped = chaCntSkipped(state);
  var pct = Math.round((completed / total) * 100);
  var badges = state.badges ? Object.keys(state.badges).length : 0;
  var streak = state.streak || 0;
  var bestStreak = state.bestStreak || 0;
  var points = state.points || 0;

  // Pace calculation
  var daysElapsed = state.currentDay || 1;
  var pace = daysElapsed > 0 ? (completed / daysElapsed * 100).toFixed(0) : 0;
  var paceLabel = pace >= 90 ? 'Excellent' : pace >= 70 ? 'Good' : pace >= 50 ? 'Needs Work' : 'Behind';
  var paceColor = pace >= 90 ? '#059669' : pace >= 70 ? '#3B82F6' : pace >= 50 ? '#F59E0B' : '#EF4444';

  // Avg points per completed day
  var avgPts = completed > 0 ? Math.round(points / completed) : 0;
  var maxPossiblePts = 4450;
  var ptsPct = Math.round((points / maxPossiblePts) * 100);

  var html = '<div class="cha-stats-grid">'
    + chaStatCard('Completion', pct + '%', completed + ' of ' + total + ' tasks', pct >= 80 ? '#059669' : pct >= 50 ? '#3B82F6' : '#F59E0B')
    + chaStatCard('Pace', pace + '%', paceLabel, paceColor)
    + chaStatCard('Current Streak', streak + ' days', 'Best: ' + bestStreak + ' days', streak >= 7 ? '#059669' : streak >= 3 ? '#3B82F6' : '#9CA3AF')
    + chaStatCard('Points', points.toLocaleString(), avgPts + ' avg/task', '#7C3AED')
    + chaStatCard('Badges', badges + ' / 7', Math.round((badges / 7) * 100) + '% unlocked', '#F59E0B')
    + chaStatCard('Skip Rate', skipped + ' days', (daysElapsed > 0 ? Math.round((skipped / daysElapsed) * 100) : 0) + '% of elapsed', skipped === 0 ? '#059669' : skipped <= 3 ? '#F59E0B' : '#EF4444')
    + '</div>';

  // Progress donut
  html += '<div class="cha-donut-section">'
    + '<div class="cha-donut-wrap">'
    + '<svg viewBox="0 0 120 120" class="cha-donut">'
    + '<circle cx="60" cy="60" r="50" fill="none" stroke="var(--off2)" stroke-width="10"/>'
    + '<circle cx="60" cy="60" r="50" fill="none" stroke="' + (pct >= 80 ? '#059669' : pct >= 50 ? '#3B82F6' : '#F59E0B') + '" stroke-width="10" stroke-dasharray="' + (pct * 3.14) + ' 314" stroke-linecap="round" transform="rotate(-90 60 60)"/>'
    + '<text x="60" y="55" text-anchor="middle" font-size="22" font-weight="700" fill="var(--navy)">' + pct + '%</text>'
    + '<text x="60" y="72" text-anchor="middle" font-size="10" fill="var(--slate)">Complete</text>'
    + '</svg>'
    + '</div>'
    + '<div class="cha-donut-legend">'
    + '<div class="cha-legend-row"><span class="cha-legend-dot" style="background:#059669"></span> Completed: ' + completed + '</div>'
    + '<div class="cha-legend-row"><span class="cha-legend-dot" style="background:#EF4444"></span> Skipped: ' + skipped + '</div>'
    + '<div class="cha-legend-row"><span class="cha-legend-dot" style="background:var(--off2)"></span> Remaining: ' + (total - completed - skipped) + '</div>'
    + '</div>'
    + '</div>';

  // Points breakdown bar
  html += '<div class="cha-section-title">Points Progress</div>'
    + '<div class="cha-points-bar-wrap">'
    + '<div class="cha-points-bar" style="width:' + ptsPct + '%"></div>'
    + '</div>'
    + '<div class="cha-points-labels">'
    + '<span>' + points.toLocaleString() + ' earned</span>'
    + '<span>' + maxPossiblePts.toLocaleString() + ' possible</span>'
    + '</div>';

  body.innerHTML = html;
}

function chaStatCard(title, value, sub, color) {
  return '<div class="cha-stat-card">'
    + '<div class="cha-stat-title">' + title + '</div>'
    + '<div class="cha-stat-value" style="color:' + color + '">' + value + '</div>'
    + '<div class="cha-stat-sub">' + sub + '</div>'
    + '</div>';
}

function chaCntDone(state) {
  var n = 0;
  if (state.completedDays) {
    for (var k in state.completedDays) { if (state.completedDays[k]) n++; }
  }
  return n;
}

function chaCntSkipped(state) {
  var n = 0;
  if (state.skippedDays) {
    for (var k in state.skippedDays) { if (state.skippedDays[k]) n++; }
  }
  return n;
}

// ── TAB 2: ACTIVITY HEATMAP ──────────────────────────────

function chaRenderHeatmap() {
  var body = document.getElementById('cha-body');
  if (!body) return;

  var state = chaGetState();
  var log = chaGetLog();

  // Build 6-week grid (covering 30+ days)
  var weeks = 6;
  var dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Map completions to calendar dates
  var dateMap = {};
  log.forEach(function(entry) {
    var date = entry.timestamp.split('T')[0];
    if (!dateMap[date]) dateMap[date] = 0;
    dateMap[date]++;
  });

  // Also build from state completedDays if log is sparse
  if (state.startDate && state.completedDays) {
    var start = new Date(state.startDate);
    for (var d in state.completedDays) {
      if (state.completedDays[d]) {
        var dateObj = new Date(start);
        dateObj.setDate(dateObj.getDate() + parseInt(d) - 1);
        var key = dateObj.toISOString().split('T')[0];
        if (!dateMap[key]) dateMap[key] = 1;
      }
    }
  }

  // Find date range
  var today = new Date();
  var startDate = new Date(today);
  startDate.setDate(startDate.getDate() - (weeks * 7) + 1);
  // Align to Sunday
  startDate.setDate(startDate.getDate() - startDate.getDay());

  var html = '<div class="cha-section-title">Activity Heatmap</div>'
    + '<div class="cha-heatmap-legend">'
    + '<span class="cha-hm-legend-label">Less</span>'
    + '<span class="cha-hm-cell cha-hm-0"></span>'
    + '<span class="cha-hm-cell cha-hm-1"></span>'
    + '<span class="cha-hm-cell cha-hm-2"></span>'
    + '<span class="cha-hm-cell cha-hm-3"></span>'
    + '<span class="cha-hm-legend-label">More</span>'
    + '</div>';

  html += '<div class="cha-heatmap">';

  // Day labels
  html += '<div class="cha-hm-labels">';
  dayLabels.forEach(function(label, i) {
    html += '<div class="cha-hm-label">' + (i % 2 === 1 ? label : '') + '</div>';
  });
  html += '</div>';

  // Weeks
  html += '<div class="cha-hm-grid">';
  for (var w = 0; w < weeks; w++) {
    html += '<div class="cha-hm-week">';
    for (var dow = 0; dow < 7; dow++) {
      var cellDate = new Date(startDate);
      cellDate.setDate(cellDate.getDate() + w * 7 + dow);
      var key = cellDate.toISOString().split('T')[0];
      var count = dateMap[key] || 0;
      var level = count === 0 ? 0 : count === 1 ? 1 : count === 2 ? 2 : 3;
      var isFuture = cellDate > today;
      var dateStr = cellDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      html += '<div class="cha-hm-cell cha-hm-' + (isFuture ? 'future' : level) + '" title="' + dateStr + ': ' + count + ' action' + (count !== 1 ? 's' : '') + '"></div>';
    }
    html += '</div>';
  }
  html += '</div></div>';

  // Activity streak visualization
  html += '<div class="cha-section-title" style="margin-top:24px">30-Day Calendar</div>';
  html += '<div class="cha-cal-grid">';
  for (var i = 1; i <= 30; i++) {
    var done = state.completedDays && state.completedDays[i];
    var skipped = state.skippedDays && state.skippedDays[i];
    var isCurrent = i === (state.currentDay || 1);
    var cls = done ? 'cha-cal-done' : skipped ? 'cha-cal-skip' : isCurrent ? 'cha-cal-today' : i < (state.currentDay || 1) ? 'cha-cal-miss' : 'cha-cal-future';
    html += '<div class="cha-cal-cell ' + cls + '">'
      + '<div class="cha-cal-num">' + i + '</div>'
      + '</div>';
  }
  html += '</div>';

  // Calendar legend
  html += '<div class="cha-cal-legend">'
    + '<span><span class="cha-cal-dot cha-cal-done"></span> Completed</span>'
    + '<span><span class="cha-cal-dot cha-cal-skip"></span> Skipped</span>'
    + '<span><span class="cha-cal-dot cha-cal-today"></span> Today</span>'
    + '<span><span class="cha-cal-dot cha-cal-future"></span> Upcoming</span>'
    + '</div>';

  body.innerHTML = html;
}

// ── TAB 3: TIME PATTERNS ──────────────────────────────

function chaRenderPatterns() {
  var body = document.getElementById('cha-body');
  if (!body) return;

  var log = chaGetLog();

  // Hour distribution
  var hourCounts = new Array(24).fill(0);
  var dayCounts = new Array(7).fill(0);
  log.forEach(function(entry) {
    if (typeof entry.hour === 'number') hourCounts[entry.hour]++;
    if (typeof entry.weekday === 'number') dayCounts[entry.weekday]++;
  });

  var maxHour = Math.max.apply(null, hourCounts) || 1;
  var maxDay = Math.max.apply(null, dayCounts) || 1;

  // Peak hour
  var peakHour = 0;
  hourCounts.forEach(function(c, i) { if (c > hourCounts[peakHour]) peakHour = i; });
  var peakHourStr = peakHour === 0 ? '12 AM' : peakHour < 12 ? peakHour + ' AM' : peakHour === 12 ? '12 PM' : (peakHour - 12) + ' PM';

  // Peak day
  var dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var peakDay = 0;
  dayCounts.forEach(function(c, i) { if (c > dayCounts[peakDay]) peakDay = i; });

  var html = '';

  if (log.length === 0) {
    html = '<div class="cha-empty">Complete some challenge tasks to see your activity patterns here.</div>';
    body.innerHTML = html;
    return;
  }

  // Insights
  html += '<div class="cha-insights-row">'
    + '<div class="cha-insight-card">'
    + '<div class="cha-insight-label">Peak Hour</div>'
    + '<div class="cha-insight-value">' + peakHourStr + '</div>'
    + '</div>'
    + '<div class="cha-insight-card">'
    + '<div class="cha-insight-label">Peak Day</div>'
    + '<div class="cha-insight-value">' + dayNames[peakDay] + '</div>'
    + '</div>'
    + '<div class="cha-insight-card">'
    + '<div class="cha-insight-label">Total Actions</div>'
    + '<div class="cha-insight-value">' + log.length + '</div>'
    + '</div>'
    + '</div>';

  // Hour chart
  html += '<div class="cha-section-title">Activity by Hour</div>';
  html += '<div class="cha-hour-chart">';
  for (var h = 0; h < 24; h++) {
    var pctH = (hourCounts[h] / maxHour) * 100;
    var label = h === 0 ? '12a' : h < 12 ? h + 'a' : h === 12 ? '12p' : (h - 12) + 'p';
    html += '<div class="cha-hour-col">'
      + '<div class="cha-hour-bar-wrap"><div class="cha-hour-bar" style="height:' + pctH + '%"></div></div>'
      + (h % 3 === 0 ? '<div class="cha-hour-label">' + label + '</div>' : '<div class="cha-hour-label"></div>')
      + '</div>';
  }
  html += '</div>';

  // Day of week chart
  html += '<div class="cha-section-title" style="margin-top:24px">Activity by Day of Week</div>';
  var shortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  html += '<div class="cha-dow-chart">';
  for (var dw = 0; dw < 7; dw++) {
    var pctD = (dayCounts[dw] / maxDay) * 100;
    html += '<div class="cha-dow-row">'
      + '<div class="cha-dow-label">' + shortDays[dw] + '</div>'
      + '<div class="cha-dow-bar-wrap"><div class="cha-dow-bar" style="width:' + pctD + '%"></div></div>'
      + '<div class="cha-dow-count">' + dayCounts[dw] + '</div>'
      + '</div>';
  }
  html += '</div>';

  body.innerHTML = html;
}

// ── TAB 4: CATEGORY ANALYSIS ──────────────────────────────

function chaRenderCategories() {
  var body = document.getElementById('cha-body');
  if (!body) return;

  var state = chaGetState();
  var days = (typeof CH_DAYS !== 'undefined') ? CH_DAYS : [];

  // Categorize tasks
  var categories = {
    'Setup & Config': { days: [1, 2, 13, 25], color: '#6366F1', icon: 'gear' },
    'Learning & Training': { days: [3, 16, 27], color: '#8B5CF6', icon: 'book' },
    'Script & Content': { days: [4, 7, 9, 18, 23], color: '#3B82F6', icon: 'pen' },
    'Outreach & Marketing': { days: [6, 12, 21, 24, 28], color: '#059669', icon: 'megaphone' },
    'Referral Submission': { days: [10, 20, 30], color: '#F59E0B', icon: 'star' },
    'Planning & Review': { days: [5, 8, 14, 15, 19, 22, 26, 29], color: '#EC4899', icon: 'chart' },
    'Follow-Up': { days: [11, 17], color: '#EF4444', icon: 'arrow' }
  };

  var html = '<div class="cha-section-title">Task Categories</div>';
  html += '<div class="cha-cat-grid">';

  Object.keys(categories).forEach(function(catName) {
    var cat = categories[catName];
    var done = 0;
    var total = cat.days.length;
    cat.days.forEach(function(d) {
      if (state.completedDays && state.completedDays[d]) done++;
    });
    var catPct = total > 0 ? Math.round((done / total) * 100) : 0;

    html += '<div class="cha-cat-card">'
      + '<div class="cha-cat-header">'
      + '<div class="cha-cat-name" style="color:' + cat.color + '">' + catName + '</div>'
      + '<div class="cha-cat-pct" style="color:' + cat.color + '">' + catPct + '%</div>'
      + '</div>'
      + '<div class="cha-cat-bar-outer"><div class="cha-cat-bar-inner" style="width:' + catPct + '%;background:' + cat.color + '"></div></div>'
      + '<div class="cha-cat-detail">' + done + ' of ' + total + ' tasks completed</div>'
      + '<div class="cha-cat-tasks">';

    cat.days.forEach(function(d) {
      var day = days.find(function(dd) { return dd.day === d; });
      var isDone = state.completedDays && state.completedDays[d];
      html += '<div class="cha-cat-task ' + (isDone ? 'cha-cat-task-done' : '') + '">'
        + '<span class="cha-cat-task-check">' + (isDone ? '&#10003;' : '&#9675;') + '</span>'
        + '<span>Day ' + d + ': ' + (day ? day.title : 'Task') + '</span>'
        + '</div>';
    });

    html += '</div></div>';
  });

  html += '</div>';

  // Strongest / weakest category
  var catResults = Object.keys(categories).map(function(catName) {
    var cat = categories[catName];
    var done = 0;
    cat.days.forEach(function(d) { if (state.completedDays && state.completedDays[d]) done++; });
    return { name: catName, pct: cat.days.length > 0 ? done / cat.days.length : 0, color: cat.color };
  }).sort(function(a, b) { return b.pct - a.pct; });

  if (catResults.length > 0 && catResults[0].pct > 0) {
    html += '<div class="cha-insights-row" style="margin-top:20px">'
      + '<div class="cha-insight-card">'
      + '<div class="cha-insight-label">Strongest Area</div>'
      + '<div class="cha-insight-value" style="color:' + catResults[0].color + ';font-size:15px">' + catResults[0].name + '</div>'
      + '</div>'
      + '<div class="cha-insight-card">'
      + '<div class="cha-insight-label">Needs Attention</div>'
      + '<div class="cha-insight-value" style="color:' + catResults[catResults.length - 1].color + ';font-size:15px">' + catResults[catResults.length - 1].name + '</div>'
      + '</div>'
      + '</div>';
  }

  body.innerHTML = html;
}

// ── TAB 5: PROJECTIONS ──────────────────────────────

function chaRenderProjections() {
  var body = document.getElementById('cha-body');
  if (!body) return;

  var state = chaGetState();
  var log = chaGetLog();
  var completed = chaCntDone(state);
  var skipped = chaCntSkipped(state);
  var currentDay = state.currentDay || 1;
  var remaining = 30 - completed;
  var points = state.points || 0;

  // Completion rate
  var completionRate = currentDay > 0 ? completed / currentDay : 0;
  var skipRate = currentDay > 0 ? skipped / currentDay : 0;

  // Projected completion
  var projectedComplete = completionRate > 0 ? Math.round(completionRate * 30) : completed;
  var projectedSkips = Math.round(skipRate * 30);
  var daysToFinish = completionRate > 0 ? Math.ceil(remaining / completionRate) : 999;
  var projectedDate = new Date();
  projectedDate.setDate(projectedDate.getDate() + daysToFinish);

  // Projected points
  var avgPtsPerTask = completed > 0 ? points / completed : 140;
  var projectedTotalPts = Math.round(projectedComplete * avgPtsPerTask);

  // Projected tier
  var projTier = projectedComplete >= 28 && projectedSkips === 0 ? 'Perfect Month'
    : projectedComplete >= 25 ? 'Strong Finish'
    : projectedComplete >= 20 ? 'Solid Effort'
    : projectedComplete >= 15 ? 'Getting There'
    : 'Needs Boost';

  var tierColor = projectedComplete >= 28 ? '#F59E0B' : projectedComplete >= 25 ? '#059669' : projectedComplete >= 20 ? '#3B82F6' : projectedComplete >= 15 ? '#F59E0B' : '#EF4444';

  var html = '<div class="cha-proj-header">'
    + '<div class="cha-proj-tier" style="color:' + tierColor + '">' + projTier + '</div>'
    + '<div class="cha-proj-sub">Based on your current pace of ' + Math.round(completionRate * 100) + '% completion rate</div>'
    + '</div>';

  // Projection cards
  html += '<div class="cha-stats-grid">'
    + chaStatCard('Projected Tasks', projectedComplete + ' / 30', 'At current pace', '#3B82F6')
    + chaStatCard('Est. Completion', daysToFinish <= 30 ? projectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A', daysToFinish <= 30 ? daysToFinish + ' days remaining' : 'Pace too slow', daysToFinish <= 30 ? '#059669' : '#EF4444')
    + chaStatCard('Projected Points', projectedTotalPts.toLocaleString(), 'of 4,450 possible', '#7C3AED')
    + chaStatCard('Projected Skips', projectedSkips + '', projectedSkips === 0 ? 'Perfect Month possible!' : projectedSkips + ' expected misses', projectedSkips === 0 ? '#059669' : '#F59E0B')
    + '</div>';

  // Progress trajectory chart
  html += '<div class="cha-section-title" style="margin-top:20px">Progress Trajectory</div>';
  html += '<div class="cha-traj-chart">';

  // Build trajectory line
  var idealPerDay = 30 / 30; // 1 task/day ideal
  for (var d = 1; d <= 30; d++) {
    var actual = 0;
    if (state.completedDays) {
      for (var k = 1; k <= d; k++) { if (state.completedDays[k]) actual++; }
    }
    var ideal = d;
    var projected = Math.round(completionRate * d);
    var isPast = d <= currentDay;

    var maxVal = 30;
    var actualH = (actual / maxVal) * 100;
    var idealH = (ideal / maxVal) * 100;
    var projH = (projected / maxVal) * 100;

    html += '<div class="cha-traj-col">'
      + '<div class="cha-traj-bars">'
      + '<div class="cha-traj-ideal" style="height:' + idealH + '%"></div>';
    if (isPast) {
      html += '<div class="cha-traj-actual" style="height:' + actualH + '%"></div>';
    } else {
      html += '<div class="cha-traj-proj" style="height:' + projH + '%"></div>';
    }
    html += '</div>';
    if (d % 5 === 0 || d === 1) {
      html += '<div class="cha-traj-label">' + d + '</div>';
    } else {
      html += '<div class="cha-traj-label"></div>';
    }
    html += '</div>';
  }

  html += '</div>';

  // Legend
  html += '<div class="cha-traj-legend">'
    + '<span><span class="cha-legend-dot" style="background:var(--off2)"></span> Ideal (1/day)</span>'
    + '<span><span class="cha-legend-dot" style="background:#3B82F6"></span> Actual</span>'
    + '<span><span class="cha-legend-dot" style="background:rgba(59,130,246,0.3)"></span> Projected</span>'
    + '</div>';

  // Recommendations
  html += '<div class="cha-section-title" style="margin-top:24px">Recommendations</div>';
  html += '<div class="cha-recs">';

  if (completionRate < 0.7) {
    html += chaRecCard('Boost Your Pace', 'Try completing catch-up tasks on weekends to get back on track. Use the streak freeze wisely.', '#EF4444');
  }
  if (skipped > 3) {
    html += chaRecCard('Reduce Skips', 'You have ' + skipped + ' skipped days. Use catch-up mode to recover those missed tasks for bonus points.', '#F59E0B');
  }
  if (state.streak >= 5) {
    html += chaRecCard('Keep the Streak!', 'You have a ' + state.streak + '-day streak going. Consistency is the key to top performance.', '#059669');
  }
  if (completed >= 20) {
    html += chaRecCard('Almost There', 'Only ' + remaining + ' tasks left! Push through for a strong finish and potentially a Perfect Month badge.', '#7C3AED');
  }
  if (completed < 5) {
    html += chaRecCard('Build Momentum', 'The first week is the hardest. Focus on completing one task per day to build the habit.', '#3B82F6');
  }

  html += '</div>';

  body.innerHTML = html;
}

function chaRecCard(title, desc, color) {
  return '<div class="cha-rec-card" style="border-left-color:' + color + '">'
    + '<div class="cha-rec-title" style="color:' + color + '">' + title + '</div>'
    + '<div class="cha-rec-desc">' + desc + '</div>'
    + '</div>';
}
