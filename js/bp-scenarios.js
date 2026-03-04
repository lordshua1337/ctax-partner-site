// ══════════════════════════════════════════
//  M5P2C2: MULTI-SCENARIO REVENUE MODELER
//  Conservative/moderate/aggressive, sensitivity
// ══════════════════════════════════════════

var BPS_STORAGE_KEY = 'bp_scenarios_v1';

// ── SCENARIO DEFINITIONS ──────────────────────────────

function bpsGetScenarios(inputs) {
  var goal = parseInt(inputs.goal) || 10;
  var bench = (typeof BP_BENCHMARKS !== 'undefined')
    ? BP_BENCHMARKS[inputs.practiceType] || BP_BENCHMARKS['other']
    : { avgRefs: 5, convRate: 0.55 };

  return [
    {
      id: 'conservative',
      name: 'Conservative',
      color: '#3B82F6',
      icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
      desc: 'Cautious growth. Lower referral volume, standard close rate, minimal marketing spend.',
      refsPerMonth: [
        Math.round(goal * 0.3),
        Math.round(goal * 0.4),
        Math.round(goal * 0.5)
      ],
      closeRate: Math.max(bench.convRate - 0.1, 0.35),
      avgCommission: 350,
      churnRate: 0.15,
      rampWeeks: 6
    },
    {
      id: 'moderate',
      name: 'Moderate',
      color: '#F59E0B',
      icon: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
      desc: 'Steady, realistic growth. Aligns with industry benchmarks and your stated goal.',
      refsPerMonth: [
        Math.round(goal * 0.5),
        Math.round(goal * 0.7),
        Math.round(goal * 0.9)
      ],
      closeRate: bench.convRate,
      avgCommission: 420,
      churnRate: 0.10,
      rampWeeks: 4
    },
    {
      id: 'aggressive',
      name: 'Aggressive',
      color: '#059669',
      icon: '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>',
      desc: 'Ambitious targets. Higher spend, max effort, fast ramp-up. Top-performer trajectory.',
      refsPerMonth: [
        Math.round(goal * 0.7),
        Math.round(goal * 1.0),
        Math.round(goal * 1.3)
      ],
      closeRate: Math.min(bench.convRate + 0.1, 0.85),
      avgCommission: 480,
      churnRate: 0.05,
      rampWeeks: 2
    }
  ];
}

// ── SHOW MODAL ──────────────────────────────

function bpsShowScenarios() {
  var inputs = bpsGetInputs();
  if (!inputs) {
    if (typeof showToast === 'function') showToast('Generate your roadmap first', 'error');
    return;
  }

  var overlay = document.createElement('div');
  overlay.className = 'aid-modal-overlay';
  overlay.id = 'bps-modal';
  overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };

  var modal = document.createElement('div');
  modal.className = 'aid-modal';
  modal.style.maxWidth = '780px';

  modal.innerHTML = '<div class="aid-modal-header">'
    + '<div><div class="aid-modal-title">Revenue Scenario Modeler</div>'
    + '<div class="aid-modal-meta">Compare conservative, moderate, and aggressive projections</div></div>'
    + '<button class="aid-modal-close" onclick="document.getElementById(\'bps-modal\').remove()">&times;</button>'
    + '</div>'
    + '<div class="bps-tabs" id="bps-tabs"></div>'
    + '<div class="aid-modal-body" id="bps-body" style="padding-top:0"></div>';

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  bpsRenderTabs('comparison');
  bpsRenderComparison(inputs);
}

function bpsGetInputs() {
  try {
    var saved = localStorage.getItem('bp_saved_inputs');
    return saved ? JSON.parse(saved) : null;
  } catch (e) { return null; }
}

function bpsRenderTabs(active) {
  var tabs = [
    { key: 'comparison', label: 'Side-by-Side' },
    { key: 'timeline', label: '12-Month Timeline' },
    { key: 'sensitivity', label: 'Sensitivity Analysis' },
    { key: 'breakeven', label: 'Break-Even' }
  ];
  var el = document.getElementById('bps-tabs');
  if (!el) return;
  el.innerHTML = tabs.map(function(t) {
    return '<button class="bps-tab' + (t.key === active ? ' bps-tab-active' : '') + '" onclick="bpsSwitch(\'' + t.key + '\')">' + t.label + '</button>';
  }).join('');
}

function bpsSwitch(key) {
  var inputs = bpsGetInputs();
  if (!inputs) return;
  bpsRenderTabs(key);
  var r = { comparison: bpsRenderComparison, timeline: bpsRenderTimeline, sensitivity: bpsRenderSensitivity, breakeven: bpsRenderBreakeven };
  if (r[key]) r[key](inputs);
}

// ── COMPARISON TAB ──────────────────────────────

function bpsRenderComparison(inputs) {
  var body = document.getElementById('bps-body');
  if (!body) return;

  var scenarios = bpsGetScenarios(inputs);
  var budget = parseInt(inputs.budget) || 0;

  var html = '<div class="bps-compare-grid">';

  scenarios.forEach(function(s) {
    var totalRefs = s.refsPerMonth.reduce(function(a, b) { return a + b; }, 0);
    var closedDeals = Math.round(totalRefs * s.closeRate);
    var revenue = closedDeals * s.avgCommission;
    var investment = budget * 3;
    var roi = investment > 0 ? Math.round(((revenue - investment) / investment) * 100) : 0;
    var annualRev = revenue * 4; // extrapolate 3 months to 12

    html += '<div class="bps-scenario-card" style="border-top:3px solid ' + s.color + '">'
      + '<div class="bps-sc-header">'
      + '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="' + s.color + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + s.icon + '</svg>'
      + '<div class="bps-sc-name" style="color:' + s.color + '">' + s.name + '</div>'
      + '</div>'
      + '<div class="bps-sc-desc">' + s.desc + '</div>'

      + '<div class="bps-sc-metrics">'
      + '<div class="bps-metric"><div class="bps-metric-val">' + totalRefs + '</div><div class="bps-metric-label">Total Referrals</div></div>'
      + '<div class="bps-metric"><div class="bps-metric-val">' + closedDeals + '</div><div class="bps-metric-label">Closed Deals</div></div>'
      + '<div class="bps-metric"><div class="bps-metric-val" style="color:' + s.color + '">$' + revenue.toLocaleString() + '</div><div class="bps-metric-label">90-Day Revenue</div></div>'
      + '<div class="bps-metric"><div class="bps-metric-val">$' + annualRev.toLocaleString() + '</div><div class="bps-metric-label">Annual Projection</div></div>'
      + '</div>'

      + '<div class="bps-sc-details">'
      + '<div class="bps-detail-row"><span>Close Rate</span><span>' + Math.round(s.closeRate * 100) + '%</span></div>'
      + '<div class="bps-detail-row"><span>Avg Commission</span><span>$' + s.avgCommission + '</span></div>'
      + '<div class="bps-detail-row"><span>Ramp-Up</span><span>' + s.rampWeeks + ' weeks</span></div>'
      + '<div class="bps-detail-row"><span>Churn Risk</span><span>' + Math.round(s.churnRate * 100) + '%</span></div>';

    if (investment > 0) {
      html += '<div class="bps-detail-row"><span>Investment</span><span>$' + investment.toLocaleString() + '</span></div>'
        + '<div class="bps-detail-row"><span>ROI</span><span style="color:' + (roi > 0 ? '#059669' : '#EF4444') + '">' + roi + '%</span></div>';
    }

    html += '</div></div>';
  });

  html += '</div>';

  body.innerHTML = html;
}

// ── TIMELINE TAB ──────────────────────────────

function bpsRenderTimeline(inputs) {
  var body = document.getElementById('bps-body');
  if (!body) return;

  var scenarios = bpsGetScenarios(inputs);

  // Extrapolate to 12 months
  var months = [];
  for (var m = 1; m <= 12; m++) months.push(m);

  var maxRev = 0;
  var scenarioData = scenarios.map(function(s) {
    var data = [];
    var cumulative = 0;
    months.forEach(function(m) {
      var monthlyRefs;
      if (m <= 3) {
        monthlyRefs = s.refsPerMonth[m - 1] || s.refsPerMonth[2];
      } else {
        // Growth curve after initial 3 months
        monthlyRefs = Math.round(s.refsPerMonth[2] * (1 + 0.05 * (m - 3)));
      }
      var closed = Math.round(monthlyRefs * s.closeRate);
      var rev = closed * s.avgCommission;
      cumulative += rev;
      data.push({ month: m, refs: monthlyRefs, revenue: rev, cumulative: cumulative });
      if (cumulative > maxRev) maxRev = cumulative;
    });
    return { scenario: s, data: data };
  });

  if (maxRev === 0) maxRev = 10000;

  var html = '<div class="bps-section-title">Cumulative Revenue (12 Months)</div>';
  html += '<div class="bps-timeline-chart">';

  // Chart columns
  months.forEach(function(m) {
    html += '<div class="bps-tl-col">';
    html += '<div class="bps-tl-bars">';

    scenarioData.forEach(function(sd) {
      var d = sd.data[m - 1];
      var h = (d.cumulative / maxRev) * 100;
      html += '<div class="bps-tl-bar" style="height:' + h + '%;background:' + sd.scenario.color + ';opacity:0.7" title="' + sd.scenario.name + ': $' + d.cumulative.toLocaleString() + '"></div>';
    });

    html += '</div>';
    html += '<div class="bps-tl-label">M' + m + '</div>';
    html += '</div>';
  });

  html += '</div>';

  // Legend
  html += '<div class="bps-tl-legend">';
  scenarios.forEach(function(s) {
    html += '<span class="bps-tl-leg"><span class="bps-tl-dot" style="background:' + s.color + '"></span>' + s.name + '</span>';
  });
  html += '</div>';

  // 12-month summary table
  html += '<div class="bps-section-title" style="margin-top:20px">12-Month Summary</div>';
  html += '<div class="bps-summary-table">';
  html += '<div class="bps-sum-row bps-sum-header"><div class="bps-sum-cell">Scenario</div><div class="bps-sum-cell">Total Referrals</div><div class="bps-sum-cell">Closed Deals</div><div class="bps-sum-cell">Total Revenue</div><div class="bps-sum-cell">Monthly Avg</div></div>';

  scenarioData.forEach(function(sd) {
    var totalRefs = 0;
    sd.data.forEach(function(d) { totalRefs += d.refs; });
    var totalClosed = Math.round(totalRefs * sd.scenario.closeRate);
    var totalRev = sd.data[11].cumulative;
    var monthlyAvg = Math.round(totalRev / 12);

    html += '<div class="bps-sum-row"><div class="bps-sum-cell" style="font-weight:700;color:' + sd.scenario.color + '">' + sd.scenario.name + '</div>'
      + '<div class="bps-sum-cell">' + totalRefs + '</div>'
      + '<div class="bps-sum-cell">' + totalClosed + '</div>'
      + '<div class="bps-sum-cell" style="font-weight:700">$' + totalRev.toLocaleString() + '</div>'
      + '<div class="bps-sum-cell">$' + monthlyAvg.toLocaleString() + '</div>'
      + '</div>';
  });
  html += '</div>';

  body.innerHTML = html;
}

// ── SENSITIVITY TAB ──────────────────────────────

function bpsRenderSensitivity(inputs) {
  var body = document.getElementById('bps-body');
  if (!body) return;

  var scenarios = bpsGetScenarios(inputs);
  var moderate = scenarios[1]; // use moderate as baseline
  var baseRefs = moderate.refsPerMonth.reduce(function(a, b) { return a + b; }, 0);
  var baseClosed = Math.round(baseRefs * moderate.closeRate);
  var baseRev = baseClosed * moderate.avgCommission;

  var html = '<div class="bps-section-title">Sensitivity Analysis (Moderate Scenario)</div>'
    + '<div class="bps-sens-desc">How much does each variable impact your 90-day revenue?</div>';

  // Variables to test
  var variables = [
    { name: 'Referral Volume', key: 'refs', base: baseRefs, range: [-0.3, -0.15, 0, 0.15, 0.3] },
    { name: 'Close Rate', key: 'close', base: moderate.closeRate, range: [-0.15, -0.08, 0, 0.08, 0.15] },
    { name: 'Avg Commission', key: 'commission', base: moderate.avgCommission, range: [-100, -50, 0, 50, 100] }
  ];

  html += '<div class="bps-sens-grid">';

  variables.forEach(function(v) {
    html += '<div class="bps-sens-card">'
      + '<div class="bps-sens-name">' + v.name + '</div>'
      + '<div class="bps-sens-base">Baseline: ' + (v.key === 'close' ? Math.round(v.base * 100) + '%' : v.key === 'commission' ? '$' + v.base : v.base) + '</div>'
      + '<div class="bps-sens-bars">';

    v.range.forEach(function(delta) {
      var adjusted, rev, label;
      if (v.key === 'refs') {
        adjusted = Math.round(baseRefs * (1 + delta));
        rev = Math.round(adjusted * moderate.closeRate) * moderate.avgCommission;
        label = (delta >= 0 ? '+' : '') + Math.round(delta * 100) + '%';
      } else if (v.key === 'close') {
        adjusted = Math.max(0.2, Math.min(0.95, moderate.closeRate + delta));
        rev = Math.round(baseRefs * adjusted) * moderate.avgCommission;
        label = Math.round(adjusted * 100) + '%';
      } else {
        adjusted = moderate.avgCommission + delta;
        rev = baseClosed * adjusted;
        label = '$' + adjusted;
      }

      var pctOfBase = baseRev > 0 ? (rev / baseRev) * 100 : 100;
      var barColor = pctOfBase >= 100 ? '#059669' : pctOfBase >= 80 ? '#F59E0B' : '#EF4444';
      var isBase = delta === 0;

      html += '<div class="bps-sens-row">'
        + '<div class="bps-sens-label">' + label + '</div>'
        + '<div class="bps-sens-bar-wrap"><div class="bps-sens-bar" style="width:' + Math.min(pctOfBase, 150) + '%;background:' + barColor + (isBase ? ';outline:2px solid var(--navy)' : '') + '"></div></div>'
        + '<div class="bps-sens-val">$' + rev.toLocaleString() + '</div>'
        + '</div>';
    });

    html += '</div></div>';
  });

  html += '</div>';

  // Key insight
  html += '<div class="bps-insight">'
    + '<div class="bps-insight-title">Key Insight</div>'
    + '<div class="bps-insight-text">Close rate has the highest impact on revenue. A 15% improvement in close rate generates more revenue than a 30% increase in referral volume. Focus on qualification quality over quantity.</div>'
    + '</div>';

  body.innerHTML = html;
}

// ── BREAK-EVEN TAB ──────────────────────────────

function bpsRenderBreakeven(inputs) {
  var body = document.getElementById('bps-body');
  if (!body) return;

  var budget = parseInt(inputs.budget) || 0;
  var scenarios = bpsGetScenarios(inputs);

  var html = '<div class="bps-section-title">Break-Even Analysis</div>';

  if (budget === 0) {
    html += '<div class="bps-be-free">'
      + '<div class="bps-be-title" style="color:#059669">Zero Investment</div>'
      + '<div class="bps-be-desc">With no marketing spend, every referral is pure profit. Your only investment is time.</div>'
      + '<div class="bps-be-calc">'
      + '<div class="bps-be-row"><span>Monthly investment</span><span>$0</span></div>'
      + '<div class="bps-be-row"><span>First deal revenue</span><span>~$420</span></div>'
      + '<div class="bps-be-row" style="font-weight:700;color:#059669"><span>Break-even</span><span>First closed deal</span></div>'
      + '</div>'
      + '</div>';
  } else {
    var monthlyInvest = budget;

    scenarios.forEach(function(s) {
      var monthlyRevByMonth = [];
      var cumInvest = 0;
      var cumRev = 0;
      var beMonth = null;

      for (var m = 0; m < 12; m++) {
        cumInvest += monthlyInvest;
        var monthRefs = m < 3 ? (s.refsPerMonth[m] || s.refsPerMonth[2]) : Math.round(s.refsPerMonth[2] * (1 + 0.05 * (m - 2)));
        var closed = Math.round(monthRefs * s.closeRate);
        var rev = closed * s.avgCommission;
        cumRev += rev;
        monthlyRevByMonth.push({ invest: cumInvest, rev: cumRev });
        if (beMonth === null && cumRev >= cumInvest) beMonth = m + 1;
      }

      html += '<div class="bps-be-card" style="border-left:3px solid ' + s.color + '">'
        + '<div class="bps-be-scenario" style="color:' + s.color + '">' + s.name + '</div>'
        + '<div class="bps-be-month">' + (beMonth ? 'Month ' + beMonth : 'Not within 12 months') + '</div>'
        + '<div class="bps-be-details">'
        + '<div class="bps-be-row"><span>Monthly investment</span><span>$' + monthlyInvest.toLocaleString() + '</span></div>'
        + '<div class="bps-be-row"><span>Break-even month</span><span style="color:' + s.color + '">' + (beMonth || 'N/A') + '</span></div>'
        + '<div class="bps-be-row"><span>12-month revenue</span><span>$' + monthlyRevByMonth[11].rev.toLocaleString() + '</span></div>'
        + '<div class="bps-be-row"><span>12-month investment</span><span>$' + monthlyRevByMonth[11].invest.toLocaleString() + '</span></div>'
        + '<div class="bps-be-row" style="font-weight:700"><span>Net profit (12 mo)</span><span style="color:' + (monthlyRevByMonth[11].rev > monthlyRevByMonth[11].invest ? '#059669' : '#EF4444') + '">$' + (monthlyRevByMonth[11].rev - monthlyRevByMonth[11].invest).toLocaleString() + '</span></div>'
        + '</div>'
        + '</div>';
    });
  }

  // Deals to break even
  html += '<div class="bps-section-title" style="margin-top:24px">Deals Needed to Break Even</div>';
  html += '<div class="bps-deals-grid">';

  scenarios.forEach(function(s) {
    var monthlyDeals = budget > 0 ? Math.ceil(budget / s.avgCommission) : 0;
    html += '<div class="bps-deals-card">'
      + '<div class="bps-deals-val" style="color:' + s.color + '">' + monthlyDeals + '</div>'
      + '<div class="bps-deals-label">deals/month (' + s.name + ')</div>'
      + '<div class="bps-deals-comm">at $' + s.avgCommission + ' avg commission</div>'
      + '</div>';
  });

  html += '</div>';

  body.innerHTML = html;
}
