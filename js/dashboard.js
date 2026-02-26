// ── DASHBOARD PERFORMANCE HUB ──────────────────────────────────────
// All render functions accept API data payloads.
// Currently called with mock data for the preview.

(function () {
  'use strict';

  // ── THEME DETECTION ─────────────────────────────────────────────
  // Returns color sets based on current theme so SVG text/lines adapt.

  function isDarkMode() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }

  function getChartColors() {
    var dark = isDarkMode();
    return {
      gridStroke: dark ? 'rgba(255,255,255,0.06)' : 'rgba(10,22,40,0.06)',
      labelFill: dark ? 'rgba(255,255,255,0.5)' : 'rgba(10,22,40,0.45)',
      networkStroke: dark ? 'rgba(255,255,255,0.12)' : 'rgba(10,22,40,0.12)',
      groupStroke: dark ? 'rgba(255,255,255,0.25)' : 'rgba(10,22,40,0.25)',
      dotFill: dark ? '#FFFFFF' : '#FFFFFF',
      emptySegment: dark ? 'rgba(255,255,255,0.08)' : 'rgba(10,22,40,0.06)',
      bonusCount: dark ? '#FFFFFF' : '#0A1628',
      bonusSub: dark ? 'rgba(255,255,255,0.45)' : 'rgba(10,22,40,0.4)',
      bonusFull: '#4BA3FF',
      bonusUnlocked: dark ? 'rgba(255,255,255,0.5)' : 'rgba(10,22,40,0.4)',
      innerRingStroke: dark ? 'rgba(255,255,255,0.04)' : 'rgba(10,22,40,0.04)'
    };
  }


  // ── MOCK DATA ──────────────────────────────────────────────────

  function generateMockVelocity() {
    var days = 30;
    var user = [];
    var group = [];
    var network = [];
    var now = new Date();

    for (var i = days - 1; i >= 0; i--) {
      var d = new Date(now);
      d.setDate(d.getDate() - i);
      var label = (d.getMonth() + 1) + '/' + d.getDate();

      // User: strong upward trend with some variance
      var uBase = 2 + ((days - i) / days) * 6;
      var uVal = Math.max(0, uBase + (Math.random() - 0.4) * 2);
      user.push({ date: label, count: Math.round(uVal * 10) / 10 });

      // Group avg: moderate growth
      var gBase = 1.5 + ((days - i) / days) * 3.5;
      var gVal = Math.max(0, gBase + (Math.random() - 0.5) * 1.2);
      group.push({ date: label, count: Math.round(gVal * 10) / 10 });

      // Network avg: slow growth
      var nBase = 1 + ((days - i) / days) * 2;
      var nVal = Math.max(0, nBase + (Math.random() - 0.5) * 0.8);
      network.push({ date: label, count: Math.round(nVal * 10) / 10 });
    }

    return { user: user, group: group, network: network };
  }

  var MOCK_INSIGHTS = [
    { text: 'You\'re in the <strong>top 12%</strong> of Enterprise partners this month', sentiment: 'positive' },
    { text: '<strong>6 partners</strong> in your tier already earned their bonus this month', sentiment: 'warning' },
    { text: 'Your avg referral value is <strong>$33K</strong> — $8K above your group', sentiment: 'positive' },
    { text: 'You\'re <strong>1 referral</strong> away from your monthly bonus', sentiment: 'urgent' }
  ];


  // ── VELOCITY CHART (SVG) ─────────────────────────────────────

  function renderVelocityChart(data) {
    var container = document.getElementById('dash-velocity-chart');
    if (!container) return;

    var colors = getChartColors();
    var user = data.user;
    var group = data.group;
    var network = data.network;
    var len = user.length;

    // Chart dimensions
    var W = 760;
    var H = 240;
    var padL = 40;
    var padR = 20;
    var padT = 20;
    var padB = 32;
    var chartW = W - padL - padR;
    var chartH = H - padT - padB;

    // Find max value across all series
    var allVals = user.concat(group, network).map(function (d) { return d.count; });
    var maxVal = Math.max.apply(null, allVals) * 1.15;
    if (maxVal === 0) maxVal = 1;

    // Scale helpers
    function x(i) { return padL + (i / (len - 1)) * chartW; }
    function y(val) { return padT + chartH - (val / maxVal) * chartH; }

    // Build path strings
    function buildLine(series) {
      return series.map(function (d, i) {
        return (i === 0 ? 'M' : 'L') + x(i).toFixed(1) + ',' + y(d.count).toFixed(1);
      }).join(' ');
    }

    function buildArea(series) {
      var line = series.map(function (d, i) {
        return (i === 0 ? 'M' : 'L') + x(i).toFixed(1) + ',' + y(d.count).toFixed(1);
      }).join(' ');
      line += ' L' + x(len - 1).toFixed(1) + ',' + (padT + chartH);
      line += ' L' + padL + ',' + (padT + chartH) + ' Z';
      return line;
    }

    // Grid lines
    var gridLines = '';
    var yLabels = '';
    var steps = 4;
    for (var s = 0; s <= steps; s++) {
      var val = (maxVal / steps) * s;
      var gy = y(val);
      gridLines += '<line x1="' + padL + '" y1="' + gy.toFixed(1) + '" x2="' + (W - padR) + '" y2="' + gy.toFixed(1) + '" stroke="' + colors.gridStroke + '" stroke-width="1"/>';
      yLabels += '<text x="' + (padL - 8) + '" y="' + (gy + 4).toFixed(1) + '" fill="' + colors.labelFill + '" font-size="10" text-anchor="end" font-family="DM Sans, sans-serif">' + Math.round(val) + '</text>';
    }

    // X-axis labels (every 5 days)
    var xLabels = '';
    for (var xi = 0; xi < len; xi += 5) {
      xLabels += '<text x="' + x(xi).toFixed(1) + '" y="' + (H - 4) + '" fill="' + colors.labelFill + '" font-size="10" text-anchor="middle" font-family="DM Sans, sans-serif">' + user[xi].date + '</text>';
    }
    // Always show last label
    xLabels += '<text x="' + x(len - 1).toFixed(1) + '" y="' + (H - 4) + '" fill="' + colors.labelFill + '" font-size="10" text-anchor="middle" font-family="DM Sans, sans-serif">' + user[len - 1].date + '</text>';

    // Live dot position
    var dotX = x(len - 1).toFixed(1);
    var dotY = y(user[len - 1].count).toFixed(1);

    var svg = [
      '<svg viewBox="0 0 ' + W + ' ' + H + '" class="dash-vel-svg" preserveAspectRatio="xMidYMid meet">',
      '<defs>',
      '  <linearGradient id="vel-user-grad" x1="0" y1="0" x2="0" y2="1">',
      '    <stop offset="0%" stop-color="#0B5FD8" stop-opacity="0.35"/>',
      '    <stop offset="100%" stop-color="#0B5FD8" stop-opacity="0.02"/>',
      '  </linearGradient>',
      '  <linearGradient id="vel-line-grad" x1="0" y1="0" x2="1" y2="0">',
      '    <stop offset="0%" stop-color="#0B5FD8"/>',
      '    <stop offset="50%" stop-color="#4BA3FF"/>',
      '    <stop offset="100%" stop-color="#00C8E0"/>',
      '  </linearGradient>',
      '</defs>',
      gridLines,
      yLabels,
      xLabels,
      // Network line
      '<path d="' + buildLine(network) + '" fill="none" stroke="' + colors.networkStroke + '" stroke-width="1.5" stroke-dasharray="4,4"/>',
      // Group line
      '<path d="' + buildLine(group) + '" fill="none" stroke="' + colors.groupStroke + '" stroke-width="1.5" stroke-dasharray="6,3"/>',
      // User area fill
      '<path d="' + buildArea(user) + '" fill="url(#vel-user-grad)"/>',
      // User line
      '<path d="' + buildLine(user) + '" fill="none" stroke="url(#vel-line-grad)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>',
      // Live dot with pulse
      '<circle cx="' + dotX + '" cy="' + dotY + '" r="8" fill="#4BA3FF" opacity="0.2" class="dash-pulse-ring"/>',
      '<circle cx="' + dotX + '" cy="' + dotY + '" r="4" fill="' + colors.dotFill + '" stroke="url(#vel-line-grad)" stroke-width="2" class="dash-live-dot"/>',
      '</svg>'
    ].join('\n');

    container.innerHTML = svg;

    // Animate chart lines drawing in
    if (!prefersReducedMotion) {
      var paths = container.querySelectorAll('path[stroke][fill="none"]');
      var areaPath = container.querySelector('path[fill="url(#vel-user-grad)"]');
      paths.forEach(function(path, i) {
        var length = path.getTotalLength();
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length;
        path.classList.add('vel-draw');
        path.style.animationDelay = (i * 0.3) + 's';
      });
      if (areaPath) {
        areaPath.classList.add('vel-area-fade');
      }
    }
  }


  // ── BONUS TRACKER (progress ring) ───────────────────────────────

  function renderBonusTracker(count) {
    var container = document.getElementById('dash-bonus-tracker');
    if (!container) return;

    var colors = getChartColors();
    count = Math.max(0, Math.min(4, count));
    var isFull = count === 4;

    var size = 180;
    var cx = size / 2;
    var cy = size / 2;
    var r = 68;
    var strokeW = 18;
    var circumference = 2 * Math.PI * r;

    // Arc length proportional to count (0-4)
    var fillLen = (count / 4) * circumference;
    var gapLen = circumference - fillLen;

    // Offset so arc starts at 12 o'clock (top)
    // stroke-dashoffset shifts the start; rotate(-90) puts 0 at top
    var strokeColor = isFull ? 'url(#bonus-blue-grad)' : '#22C55E';

    var parts = '';

    // Background track
    parts += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" ' +
      'fill="none" stroke="' + colors.emptySegment + '" stroke-width="' + strokeW + '"/>';

    // Filled arc
    if (count > 0) {
      parts += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" ' +
        'fill="none" stroke="' + strokeColor + '" stroke-width="' + strokeW + '" ' +
        'stroke-dasharray="' + fillLen.toFixed(1) + ' ' + gapLen.toFixed(1) + '" ' +
        'stroke-linecap="round" ' +
        'transform="rotate(-90 ' + cx + ' ' + cy + ')"' +
        (isFull ? ' class="dash-bonus-glow"' : '') + '/>';
    }

    // Center text
    var centerText;
    if (isFull) {
      centerText =
        '<text x="' + cx + '" y="' + (cy - 6) + '" text-anchor="middle" fill="' + colors.bonusFull + '" font-size="26" font-weight="700" font-family="DM Serif Display, serif">BONUS</text>' +
        '<text x="' + cx + '" y="' + (cy + 14) + '" text-anchor="middle" fill="' + colors.bonusUnlocked + '" font-size="11" font-weight="600" letter-spacing="0.1em" font-family="DM Sans, sans-serif">UNLOCKED</text>';
    } else {
      centerText =
        '<text x="' + cx + '" y="' + (cy + 2) + '" text-anchor="middle" fill="' + colors.bonusCount + '" font-size="38" font-weight="700" font-family="DM Serif Display, serif">' + count + '<tspan font-size="20" fill="' + colors.bonusSub + '">/4</tspan></text>' +
        '<text x="' + cx + '" y="' + (cy + 22) + '" text-anchor="middle" fill="' + colors.bonusSub + '" font-size="11" font-weight="500" font-family="DM Sans, sans-serif">' + (4 - count) + ' more to unlock</text>';
    }

    var svg = [
      '<svg viewBox="0 0 ' + size + ' ' + size + '" class="dash-bonus-svg">',
      '<defs>',
      '  <linearGradient id="bonus-blue-grad" x1="0" y1="0" x2="1" y2="1">',
      '    <stop offset="0%" stop-color="#0B5FD8"/>',
      '    <stop offset="100%" stop-color="#1470f0"/>',
      '  </linearGradient>',
      '</defs>',
      parts,
      centerText,
      '</svg>'
    ].join('\n');

    container.innerHTML = svg;

    // Animate bonus ring from 0
    if (!prefersReducedMotion && count > 0) {
      var ring = container.querySelector('circle[stroke-dasharray]');
      if (ring) {
        var finalDash = ring.getAttribute('stroke-dasharray');
        var circ = 2 * Math.PI * r;
        ring.setAttribute('stroke-dasharray', '0 ' + circ.toFixed(1));
        ring.classList.add('bonus-ring-anim');
        // Use rAF to set final value after browser paints initial state
        requestAnimationFrame(function() {
          requestAnimationFrame(function() {
            ring.setAttribute('stroke-dasharray', finalDash);
          });
        });
      }
      // Animate center count from 0
      var countText = container.querySelector('text[font-size="38"]');
      if (countText && !isFull) {
        var targetCount = count;
        var duration = 1000;
        var start = performance.now();
        function tickCount(now) {
          var elapsed = now - start;
          var progress = Math.min(elapsed / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          var current = Math.round(eased * targetCount);
          // Update just the main number, preserving the /4 tspan
          countText.innerHTML = current + '<tspan font-size="20" fill="' + colors.bonusSub + '">/4</tspan>';
          if (progress < 1) requestAnimationFrame(tickCount);
        }
        requestAnimationFrame(tickCount);
      }
    }
  }


  // ── PEER INSIGHTS ────────────────────────────────────────────

  function renderPeerInsights(insights) {
    var container = document.getElementById('dash-peer-insights');
    if (!container) return;

    var html = insights.map(function (item) {
      var borderColor;
      var iconColor;
      var iconSvg;

      switch (item.sentiment) {
        case 'positive':
          borderColor = '#22C55E';
          iconColor = '#22C55E';
          iconSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="' + iconColor + '" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>';
          break;
        case 'warning':
          borderColor = '#F59E0B';
          iconColor = '#F59E0B';
          iconSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="' + iconColor + '" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
          break;
        case 'urgent':
          borderColor = '#4BA3FF';
          iconColor = '#4BA3FF';
          iconSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="' + iconColor + '" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>';
          break;
        default:
          borderColor = 'rgba(255,255,255,0.15)';
          iconColor = '#8A95AA';
          iconSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="' + iconColor + '" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>';
      }

      return '<div class="dash-insight-row" style="border-left-color:' + borderColor + '">' +
        '<div class="dash-insight-icon">' + iconSvg + '</div>' +
        '<div class="dash-insight-text">' + item.text + '</div>' +
        '</div>';
    }).join('');

    container.innerHTML = html;
  }


  // ── INIT ON PAGE LOAD ────────────────────────────────────────

  function initDashboardHub() {
    var el = document.getElementById('dash-performance-hub');
    if (!el) return;

    var velocityData = generateMockVelocity();
    renderVelocityChart(velocityData);
    renderBonusTracker(3); // 3 of 4 -- creates urgency
    renderPeerInsights(MOCK_INSIGHTS);
  }

  // Run on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDashboardHub);
  } else {
    initDashboardHub();
  }

  // Re-init when navigating to dashboard via SPA
  var _origShow = window.showPage;
  if (_origShow) {
    window.showPage = function (id) {
      _origShow(id);
      if (id === 'dashboard') {
        setTimeout(initDashboardHub, 60);
      }
    };
  }

  // Re-render on theme toggle so colors adapt
  var _observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (m) {
      if (m.attributeName === 'data-theme') {
        var hub = document.getElementById('dash-performance-hub');
        if (hub) initDashboardHub();
      }
    });
  });
  _observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  // Export for API use and page-loader integration
  window.initDashboardHub = initDashboardHub;
  window.renderVelocityChart = renderVelocityChart;
  window.renderBonusTracker = renderBonusTracker;
  window.renderPeerInsights = renderPeerInsights;
})();
