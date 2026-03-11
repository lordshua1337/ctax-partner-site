// ══════════════════════════════════════════
//  PAGE ANALYTICS TAB
//  Per-page stats for published pages:
//  visits, bounce rate, conversion rate,
//  avg time on page, form submissions
// ══════════════════════════════════════════

(function () {
  'use strict';

  var PA_KEY = 'ctax_page_analytics';

  // ── DATA LAYER ────────────────────────────────────────

  function paGetData() {
    try { return JSON.parse(localStorage.getItem(PA_KEY) || '{}'); } catch (e) { return {}; }
  }

  function paSaveData(data) {
    try { localStorage.setItem(PA_KEY, JSON.stringify(data)); } catch (e) { /* silent */ }
  }

  // Generate realistic mock analytics for a page
  function paGeneratePageStats(slug) {
    var base = paHashSlug(slug);
    var visits = 120 + Math.floor(base * 380);
    var bounceRate = 25 + Math.floor((base * 37) % 40);
    var convRate = 2 + Math.floor((base * 13) % 12);
    var avgTime = 45 + Math.floor((base * 29) % 180);
    var submissions = Math.floor(visits * (convRate / 100));

    // Daily data for the last 30 days
    var daily = [];
    var now = new Date();
    for (var i = 29; i >= 0; i--) {
      var d = new Date(now);
      d.setDate(d.getDate() - i);
      var dayLabel = (d.getMonth() + 1) + '/' + d.getDate();
      var dayVisits = Math.max(1, Math.floor((visits / 30) * (0.6 + Math.random() * 0.8)));
      var dayBounce = Math.max(10, Math.min(85, bounceRate + Math.floor((Math.random() - 0.5) * 20)));
      var dayConv = Math.max(0, Math.min(25, convRate + Math.floor((Math.random() - 0.5) * 6)));
      daily.push({
        date: dayLabel,
        visits: dayVisits,
        bounceRate: dayBounce,
        convRate: dayConv,
        submissions: Math.max(0, Math.floor(dayVisits * (dayConv / 100)))
      });
    }

    // Top referrers
    var referrers = [
      { source: 'Direct', pct: 35 + Math.floor(base * 15) },
      { source: 'Google Search', pct: 20 + Math.floor((base * 7) % 20) },
      { source: 'Facebook', pct: 10 + Math.floor((base * 11) % 15) },
      { source: 'Email Link', pct: 5 + Math.floor((base * 3) % 15) },
      { source: 'LinkedIn', pct: 3 + Math.floor((base * 5) % 10) }
    ];
    // Normalize percentages
    var totalPct = referrers.reduce(function (s, r) { return s + r.pct; }, 0);
    referrers = referrers.map(function (r) {
      return { source: r.source, pct: Math.round((r.pct / totalPct) * 100) };
    });

    return {
      slug: slug,
      visits: visits,
      uniqueVisitors: Math.floor(visits * 0.72),
      bounceRate: bounceRate,
      convRate: convRate,
      avgTime: avgTime,
      submissions: submissions,
      daily: daily,
      referrers: referrers,
      lastUpdated: Date.now()
    };
  }

  // Simple hash to get deterministic-ish numbers per slug
  function paHashSlug(slug) {
    var h = 0;
    for (var i = 0; i < slug.length; i++) {
      h = ((h << 5) - h + slug.charCodeAt(i)) | 0;
    }
    return Math.abs(h % 1000) / 1000;
  }

  function paFormatTime(seconds) {
    var m = Math.floor(seconds / 60);
    var s = seconds % 60;
    return m + ':' + String(s).padStart(2, '0');
  }

  function paEsc(str) {
    var d = document.createElement('div');
    d.textContent = str || '';
    return d.innerHTML;
  }

  // ── RENDERING ────────────────────────────────────────

  function paRender() {
    var container = document.getElementById('pa-container');
    if (!container) return;

    // Get published pages
    var pages = [];
    try { pages = JSON.parse(localStorage.getItem('ctax_pb_pages') || '[]'); } catch (e) {}

    if (!pages.length) {
      container.innerHTML = '<div class="pa-empty">' +
        '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>' +
        '<h3>No published pages yet</h3>' +
        '<p>Publish pages from the Page Builder or Authority Builder to see analytics here.</p>' +
        '</div>';
      return;
    }

    // Load or generate analytics for each page
    var stored = paGetData();
    var allStats = pages.map(function (page) {
      var slug = page.slug || page.title || 'page';
      if (!stored[slug] || (Date.now() - (stored[slug].lastUpdated || 0)) > 3600000) {
        stored[slug] = paGeneratePageStats(slug);
      }
      stored[slug].title = page.title || slug;
      return stored[slug];
    });
    paSaveData(stored);

    // ── Site-wide aggregate stats ──
    var totalVisits = allStats.reduce(function (s, p) { return s + p.visits; }, 0);
    var totalUnique = allStats.reduce(function (s, p) { return s + p.uniqueVisitors; }, 0);
    var avgBounce = Math.round(allStats.reduce(function (s, p) { return s + p.bounceRate; }, 0) / allStats.length);
    var avgConv = (allStats.reduce(function (s, p) { return s + p.convRate; }, 0) / allStats.length).toFixed(1);
    var totalSubs = allStats.reduce(function (s, p) { return s + p.submissions; }, 0);
    var avgTime = Math.round(allStats.reduce(function (s, p) { return s + p.avgTime; }, 0) / allStats.length);

    var html = '';

    // Site summary cards
    html += '<div class="pa-summary-cards">';
    html += paSummaryCard('Total Visits', totalVisits.toLocaleString(), 'var(--blue)', '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>');
    html += paSummaryCard('Unique Visitors', totalUnique.toLocaleString(), '#7C3AED', '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>');
    html += paSummaryCard('Avg Bounce Rate', avgBounce + '%', avgBounce > 50 ? '#ef4444' : '#059669', '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg>');
    html += paSummaryCard('Avg Conversion', avgConv + '%', '#059669', '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>');
    html += paSummaryCard('Form Submissions', totalSubs.toLocaleString(), '#F59E0B', '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>');
    html += paSummaryCard('Avg Time on Page', paFormatTime(avgTime), 'var(--blue)', '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>');
    html += '</div>';

    // Per-page cards
    html += '<div class="pa-section-title">Individual Page Analytics</div>';
    html += '<div class="pa-page-grid">';

    allStats.forEach(function (stats) {
      html += paPageCard(stats);
    });

    html += '</div>';

    container.innerHTML = html;
  }

  function paSummaryCard(label, value, color, icon) {
    return '<div class="pa-scard">' +
      '<div class="pa-scard-icon" style="color:' + color + ';background:' + color + '10">' + icon + '</div>' +
      '<div class="pa-scard-value">' + value + '</div>' +
      '<div class="pa-scard-label">' + label + '</div>' +
      '</div>';
  }

  function paPageCard(stats) {
    var bounceColor = stats.bounceRate > 60 ? '#ef4444' : stats.bounceRate > 40 ? '#F59E0B' : '#059669';
    var convColor = stats.convRate >= 5 ? '#059669' : stats.convRate >= 2 ? '#F59E0B' : '#ef4444';

    var html = '<div class="pa-page-card">';
    html += '<div class="pa-page-header">';
    html += '<div class="pa-page-title">' + paEsc(stats.title) + '</div>';
    html += '<div class="pa-page-slug">/' + paEsc(stats.slug) + '</div>';
    html += '</div>';

    // Mini stat row
    html += '<div class="pa-mini-stats">';
    html += paMiniStat('Visits', stats.visits.toLocaleString(), 'var(--blue)');
    html += paMiniStat('Bounce', stats.bounceRate + '%', bounceColor);
    html += paMiniStat('Conv. Rate', stats.convRate + '%', convColor);
    html += paMiniStat('Avg Time', paFormatTime(stats.avgTime), 'var(--navy)');
    html += paMiniStat('Submissions', String(stats.submissions), '#F59E0B');
    html += '</div>';

    // Sparkline chart (visits over 30 days)
    html += '<div class="pa-sparkline">';
    html += paSparklineSVG(stats.daily);
    html += '</div>';

    // Top referrers
    html += '<div class="pa-referrers">';
    html += '<div class="pa-ref-title">Top Traffic Sources</div>';
    stats.referrers.forEach(function (ref) {
      html += '<div class="pa-ref-row">';
      html += '<span class="pa-ref-source">' + paEsc(ref.source) + '</span>';
      html += '<div class="pa-ref-bar-wrap"><div class="pa-ref-bar" style="width:' + ref.pct + '%"></div></div>';
      html += '<span class="pa-ref-pct">' + ref.pct + '%</span>';
      html += '</div>';
    });
    html += '</div>';

    // Detail button
    html += '<button class="pa-detail-btn" onclick="paShowDetail(\'' + paEsc(stats.slug).replace(/'/g, "\\'") + '\')">View Full Report</button>';

    html += '</div>';
    return html;
  }

  function paMiniStat(label, value, color) {
    return '<div class="pa-mini">' +
      '<div class="pa-mini-val" style="color:' + color + '">' + value + '</div>' +
      '<div class="pa-mini-lbl">' + label + '</div>' +
      '</div>';
  }

  function paSparklineSVG(daily) {
    var W = 280;
    var H = 50;
    var padL = 0;
    var padR = 0;
    var padT = 5;
    var padB = 5;
    var chartW = W - padL - padR;
    var chartH = H - padT - padB;

    var maxVal = Math.max.apply(null, daily.map(function (d) { return d.visits; }));
    if (maxVal === 0) maxVal = 1;

    var len = daily.length;
    function x(i) { return padL + (i / (len - 1)) * chartW; }
    function y(val) { return padT + chartH - (val / maxVal) * chartH; }

    var linePath = daily.map(function (d, i) {
      return (i === 0 ? 'M' : 'L') + x(i).toFixed(1) + ',' + y(d.visits).toFixed(1);
    }).join(' ');

    var areaPath = linePath +
      ' L' + x(len - 1).toFixed(1) + ',' + (H - padB) +
      ' L' + padL + ',' + (H - padB) + ' Z';

    return '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMid meet" class="pa-spark-svg">' +
      '<defs><linearGradient id="pa-grad" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0%" stop-color="var(--blue)" stop-opacity="0.15"/>' +
      '<stop offset="100%" stop-color="var(--blue)" stop-opacity="0.02"/>' +
      '</linearGradient></defs>' +
      '<path d="' + areaPath + '" fill="url(#pa-grad)"/>' +
      '<path d="' + linePath + '" fill="none" stroke="var(--blue)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>';
  }

  // ── DETAIL MODAL ────────────────────────────────────

  window.paShowDetail = function (slug) {
    var stored = paGetData();
    var stats = stored[slug];
    if (!stats) return;

    var overlay = document.createElement('div');
    overlay.className = 'pa-modal-overlay';
    overlay.id = 'pa-detail-modal';
    overlay.onclick = function (e) { if (e.target === overlay) overlay.remove(); };

    var modal = document.createElement('div');
    modal.className = 'pa-modal';

    var bounceColor = stats.bounceRate > 60 ? '#ef4444' : stats.bounceRate > 40 ? '#F59E0B' : '#059669';
    var convColor = stats.convRate >= 5 ? '#059669' : stats.convRate >= 2 ? '#F59E0B' : '#ef4444';

    var html = '<div class="pa-modal-header">';
    html += '<div><div class="pa-modal-title">' + paEsc(stats.title) + '</div>';
    html += '<div class="pa-modal-slug">/' + paEsc(stats.slug) + '</div></div>';
    html += '<button class="pa-modal-close" onclick="document.getElementById(\'pa-detail-modal\').remove()">&times;</button>';
    html += '</div>';
    html += '<div class="pa-modal-body">';

    // Stats row
    html += '<div class="pa-detail-stats">';
    html += paDetailStat('Total Visits', stats.visits.toLocaleString(), 'var(--blue)');
    html += paDetailStat('Unique Visitors', stats.uniqueVisitors.toLocaleString(), '#7C3AED');
    html += paDetailStat('Bounce Rate', stats.bounceRate + '%', bounceColor);
    html += paDetailStat('Conversion Rate', stats.convRate + '%', convColor);
    html += paDetailStat('Avg Time', paFormatTime(stats.avgTime), 'var(--blue)');
    html += paDetailStat('Submissions', String(stats.submissions), '#F59E0B');
    html += '</div>';

    // Daily visits chart
    html += '<div class="pa-detail-chart-section">';
    html += '<div class="pa-detail-chart-title">Daily Visits (Last 30 Days)</div>';
    html += '<div class="pa-detail-chart">' + paBarChart(stats.daily) + '</div>';
    html += '</div>';

    // Bounce rate trend
    html += '<div class="pa-detail-chart-section">';
    html += '<div class="pa-detail-chart-title">Bounce Rate Trend</div>';
    html += '<div class="pa-detail-chart">' + paTrendLine(stats.daily, 'bounceRate', bounceColor) + '</div>';
    html += '</div>';

    // Traffic sources
    html += '<div class="pa-detail-chart-section">';
    html += '<div class="pa-detail-chart-title">Traffic Sources</div>';
    html += '<div class="pa-detail-sources">';
    stats.referrers.forEach(function (ref) {
      html += '<div class="pa-source-row">';
      html += '<span class="pa-source-name">' + paEsc(ref.source) + '</span>';
      html += '<div class="pa-source-bar-wrap"><div class="pa-source-bar" style="width:' + ref.pct + '%"></div></div>';
      html += '<span class="pa-source-pct">' + ref.pct + '%</span>';
      html += '</div>';
    });
    html += '</div>';
    html += '</div>';

    html += '</div>';

    modal.innerHTML = html;
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  };

  function paDetailStat(label, value, color) {
    return '<div class="pa-dstat">' +
      '<div class="pa-dstat-val" style="color:' + color + '">' + value + '</div>' +
      '<div class="pa-dstat-lbl">' + label + '</div>' +
      '</div>';
  }

  function paBarChart(daily) {
    var W = 600;
    var H = 140;
    var padL = 30;
    var padR = 10;
    var padT = 10;
    var padB = 24;
    var chartW = W - padL - padR;
    var chartH = H - padT - padB;

    var maxVal = Math.max.apply(null, daily.map(function (d) { return d.visits; }));
    if (maxVal === 0) maxVal = 1;

    var len = daily.length;
    var barW = Math.max(4, Math.floor(chartW / len) - 2);

    var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMid meet" class="pa-bar-svg">';

    // Grid lines
    for (var s = 0; s <= 4; s++) {
      var val = (maxVal / 4) * s;
      var gy = padT + chartH - (val / maxVal) * chartH;
      svg += '<line x1="' + padL + '" y1="' + gy.toFixed(1) + '" x2="' + (W - padR) + '" y2="' + gy.toFixed(1) + '" stroke="var(--off2)" stroke-width="0.5"/>';
      svg += '<text x="' + (padL - 4) + '" y="' + (gy + 3).toFixed(1) + '" fill="var(--slate)" font-size="9" text-anchor="end" font-family="DM Sans,sans-serif">' + Math.round(val) + '</text>';
    }

    // Bars
    daily.forEach(function (d, i) {
      var bx = padL + (i / len) * chartW + 1;
      var bh = Math.max(1, (d.visits / maxVal) * chartH);
      var by = padT + chartH - bh;
      svg += '<rect x="' + bx.toFixed(1) + '" y="' + by.toFixed(1) + '" width="' + barW + '" height="' + bh.toFixed(1) + '" fill="var(--blue)" rx="2" opacity="0.7">';
      svg += '<title>' + d.date + ': ' + d.visits + ' visits</title>';
      svg += '</rect>';

      if (i % 5 === 0 || i === len - 1) {
        svg += '<text x="' + (bx + barW / 2).toFixed(1) + '" y="' + (H - 4) + '" fill="var(--slate)" font-size="8" text-anchor="middle" font-family="DM Sans,sans-serif">' + d.date + '</text>';
      }
    });

    svg += '</svg>';
    return svg;
  }

  function paTrendLine(daily, key, color) {
    var W = 600;
    var H = 100;
    var padL = 30;
    var padR = 10;
    var padT = 10;
    var padB = 24;
    var chartW = W - padL - padR;
    var chartH = H - padT - padB;

    var vals = daily.map(function (d) { return d[key]; });
    var maxVal = Math.max.apply(null, vals);
    var minVal = Math.min.apply(null, vals);
    var range = maxVal - minVal || 1;

    var len = daily.length;
    function x(i) { return padL + (i / (len - 1)) * chartW; }
    function y(val) { return padT + chartH - ((val - minVal) / range) * chartH; }

    var linePath = daily.map(function (d, i) {
      return (i === 0 ? 'M' : 'L') + x(i).toFixed(1) + ',' + y(d[key]).toFixed(1);
    }).join(' ');

    var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMid meet" class="pa-trend-svg">';

    // Grid
    for (var s = 0; s <= 3; s++) {
      var val = minVal + (range / 3) * s;
      var gy = y(val);
      svg += '<line x1="' + padL + '" y1="' + gy.toFixed(1) + '" x2="' + (W - padR) + '" y2="' + gy.toFixed(1) + '" stroke="var(--off2)" stroke-width="0.5"/>';
      svg += '<text x="' + (padL - 4) + '" y="' + (gy + 3).toFixed(1) + '" fill="var(--slate)" font-size="9" text-anchor="end" font-family="DM Sans,sans-serif">' + Math.round(val) + '%</text>';
    }

    // X labels
    daily.forEach(function (d, i) {
      if (i % 7 === 0 || i === len - 1) {
        svg += '<text x="' + x(i).toFixed(1) + '" y="' + (H - 4) + '" fill="var(--slate)" font-size="8" text-anchor="middle" font-family="DM Sans,sans-serif">' + d.date + '</text>';
      }
    });

    svg += '<path d="' + linePath + '" fill="none" stroke="' + color + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
    svg += '</svg>';
    return svg;
  }

  // ── PUBLIC API ────────────────────────────────────────

  window.paRender = paRender;

})();
