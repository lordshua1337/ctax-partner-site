// ══════════════════════════════════════════
//  M5P1C3: FINANCIAL FORECASTING DASHBOARD
//  12-month revenue projections, growth curves, AI analysis, scenario comparison
// ══════════════════════════════════════════

var BPF_STORAGE_KEY = 'bp_forecast_v1';

// ── FORECASTING ENGINE ────────────────────────

function bpfGetInputs() {
  try {
    var bp = JSON.parse(localStorage.getItem('ctax_bp_data') || '{}');
    return {
      practiceType: bp.practiceType || 'CPA',
      currentRefs: parseInt(bp.currentRefs, 10) || 2,
      targetRefs: parseInt(bp.targetRefs, 10) || 10,
      avgCommission: parseInt(bp.avgCommission, 10) || 750,
      monthlyBudget: parseInt(bp.monthlyBudget, 10) || 500,
      conversionRate: parseFloat(bp.conversionRate) || 0.15,
      geography: bp.geography || 'Suburban',
      yearsInPractice: parseInt(bp.yearsInPractice, 10) || 5
    };
  } catch (e) {
    return { practiceType: 'CPA', currentRefs: 2, targetRefs: 10, avgCommission: 750, monthlyBudget: 500, conversionRate: 0.15, geography: 'Suburban', yearsInPractice: 5 };
  }
}

function bpfGenerateForecast(inputs) {
  var months = [];
  var seasonality = [0.85, 0.90, 1.30, 1.45, 0.75, 0.80, 0.85, 0.90, 1.00, 1.10, 1.15, 1.20];
  var growthCurve = [0.4, 0.5, 0.6, 0.7, 0.8, 0.85, 0.9, 0.95, 1.0, 1.05, 1.1, 1.15];
  var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var startMonth = new Date().getMonth();

  var cumulativeRevenue = 0;
  var cumulativeRefs = 0;
  var cumulativeCost = 0;

  for (var i = 0; i < 12; i++) {
    var monthIdx = (startMonth + i) % 12;
    var season = seasonality[monthIdx];
    var growth = growthCurve[i];

    var baseRefs = inputs.currentRefs + (inputs.targetRefs - inputs.currentRefs) * (i / 12);
    var adjustedRefs = Math.round(baseRefs * season * growth * 10) / 10;
    var convertedRefs = Math.round(adjustedRefs * inputs.conversionRate * 10) / 10;
    var revenue = Math.round(convertedRefs * inputs.avgCommission);
    var cost = inputs.monthlyBudget + Math.round(revenue * 0.05);
    var profit = revenue - cost;
    var roi = cost > 0 ? Math.round(((revenue - cost) / cost) * 100) : 0;

    cumulativeRevenue += revenue;
    cumulativeRefs += adjustedRefs;
    cumulativeCost += cost;

    months.push({
      month: monthNames[monthIdx],
      monthNum: i + 1,
      referrals: adjustedRefs,
      conversions: convertedRefs,
      revenue: revenue,
      cost: cost,
      profit: profit,
      roi: roi,
      seasonFactor: season,
      cumulativeRevenue: cumulativeRevenue,
      cumulativeRefs: Math.round(cumulativeRefs * 10) / 10,
      cumulativeCost: cumulativeCost
    });
  }

  var totalRevenue = cumulativeRevenue;
  var totalCost = cumulativeCost;
  var totalProfit = totalRevenue - totalCost;
  var avgMonthlyRevenue = Math.round(totalRevenue / 12);
  var peakMonth = months.reduce(function(a, b) { return a.revenue > b.revenue ? a : b; });
  var lowMonth = months.reduce(function(a, b) { return a.revenue < b.revenue ? a : b; });
  var breakEvenMonth = months.findIndex(function(m) { return m.cumulativeRevenue > m.cumulativeCost; }) + 1;

  return {
    months: months,
    summary: {
      totalRevenue: totalRevenue,
      totalCost: totalCost,
      totalProfit: totalProfit,
      avgMonthly: avgMonthlyRevenue,
      peakMonth: peakMonth,
      lowMonth: lowMonth,
      breakEvenMonth: breakEvenMonth || 'N/A',
      totalRefs: Math.round(cumulativeRefs),
      avgROI: Math.round(((totalRevenue - totalCost) / totalCost) * 100)
    }
  };
}

// ── MAIN MODAL ────────────────────────

function bpfShowForecast() {
  var existing = document.getElementById('bpf-modal');
  if (existing) existing.remove();

  var overlay = document.createElement('div');
  overlay.className = 'bpf-overlay';
  overlay.id = 'bpf-modal';
  overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };

  var modal = document.createElement('div');
  modal.className = 'bpf-modal';

  modal.innerHTML = '<div class="bpf-header">'
    + '<div><div class="bpf-title">Financial Forecast</div>'
    + '<div class="bpf-subtitle">12-month revenue projections based on your business plan</div></div>'
    + '<button class="bpf-close" onclick="document.getElementById(\'bpf-modal\').remove()">&times;</button>'
    + '</div>'
    + '<div class="bpf-tabs" id="bpf-tabs"></div>'
    + '<div class="bpf-body" id="bpf-body"></div>';

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  bpfRenderTabs('overview');
}

function bpfRenderTabs(active) {
  var tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'monthly', label: 'Monthly Detail' },
    { id: 'charts', label: 'Growth Curves' },
    { id: 'scenarios', label: 'What-If' },
    { id: 'ai', label: 'AI Analysis' }
  ];

  var html = '';
  tabs.forEach(function(t) {
    html += '<button class="bpf-tab' + (t.id === active ? ' bpf-tab-active' : '') + '" onclick="bpfSwitchTab(\'' + t.id + '\')">' + t.label + '</button>';
  });

  document.getElementById('bpf-tabs').innerHTML = html;
  bpfSwitchTab(active);
}

function bpfSwitchTab(tab) {
  var tabs = document.querySelectorAll('.bpf-tab');
  var labels = { overview: 'Overview', monthly: 'Monthly Detail', charts: 'Growth Curves', scenarios: 'What-If', ai: 'AI Analysis' };
  tabs.forEach(function(t) { t.classList.toggle('bpf-tab-active', t.textContent === labels[tab]); });

  var body = document.getElementById('bpf-body');
  if (!body) return;

  var inputs = bpfGetInputs();
  var forecast = bpfGenerateForecast(inputs);

  if (tab === 'overview') bpfRenderOverview(forecast, inputs);
  else if (tab === 'monthly') bpfRenderMonthly(forecast);
  else if (tab === 'charts') bpfRenderCharts(forecast);
  else if (tab === 'scenarios') bpfRenderScenarios(inputs);
  else if (tab === 'ai') bpfRenderAI(forecast, inputs);
}

// ── OVERVIEW TAB ────────────────────────

function bpfRenderOverview(forecast, inputs) {
  var body = document.getElementById('bpf-body');
  var s = forecast.summary;

  var html = '<div class="bpf-overview">'
    + '<div class="bpf-hero-stat">'
    + '<div class="bpf-hero-label">Projected 12-Month Revenue</div>'
    + '<div class="bpf-hero-num">$' + s.totalRevenue.toLocaleString() + '</div>'
    + '<div class="bpf-hero-sub">Average $' + s.avgMonthly.toLocaleString() + '/month | ' + s.avgROI + '% ROI</div>'
    + '</div>'
    + '<div class="bpf-kpi-grid">'
    + bpfKPI('Total Referrals', s.totalRefs, '#3B82F6')
    + bpfKPI('Net Profit', '$' + s.totalProfit.toLocaleString(), '#10B981')
    + bpfKPI('Total Investment', '$' + s.totalCost.toLocaleString(), '#F59E0B')
    + bpfKPI('Break-Even', 'Month ' + s.breakEvenMonth, '#8B5CF6')
    + bpfKPI('Peak Month', s.peakMonth.month + ' ($' + s.peakMonth.revenue.toLocaleString() + ')', '#EC4899')
    + bpfKPI('Low Month', s.lowMonth.month + ' ($' + s.lowMonth.revenue.toLocaleString() + ')', '#94A3B8')
    + '</div>';

  // Revenue bar chart
  html += '<div class="bpf-chart-section">'
    + '<div class="bpf-chart-title">Monthly Revenue Projection</div>'
    + '<div class="bpf-bar-chart">';

  var maxRevenue = Math.max.apply(null, forecast.months.map(function(m) { return m.revenue; }));
  forecast.months.forEach(function(m) {
    var pct = maxRevenue > 0 ? Math.round((m.revenue / maxRevenue) * 100) : 0;
    var isPeak = m.revenue === maxRevenue;
    html += '<div class="bpf-bar-col">'
      + '<div class="bpf-bar-val">$' + (m.revenue >= 1000 ? Math.round(m.revenue / 1000) + 'k' : m.revenue) + '</div>'
      + '<div class="bpf-bar" style="height:' + pct + '%;background:' + (isPeak ? '#3B82F6' : '#3B82F630') + '"></div>'
      + '<div class="bpf-bar-label">' + m.month + '</div>'
      + '</div>';
  });

  html += '</div></div>';

  // Seasonality insight
  html += '<div class="bpf-insight">'
    + '<div class="bpf-insight-title">Seasonality Impact</div>'
    + '<div class="bpf-insight-body">Tax season (March-April) drives ' + Math.round(((forecast.months[2].revenue + forecast.months[3].revenue) / s.totalRevenue) * 100) + '% of your annual revenue. '
    + 'Plan your marketing spend to ramp up in January-February to capture maximum referrals during peak season.</div>'
    + '</div>';

  html += '</div>';
  body.innerHTML = html;
}

function bpfKPI(label, value, color) {
  return '<div class="bpf-kpi"><div class="bpf-kpi-val" style="color:' + color + '">' + value + '</div><div class="bpf-kpi-label">' + label + '</div></div>';
}

// ── MONTHLY DETAIL TAB ────────────────────────

function bpfRenderMonthly(forecast) {
  var body = document.getElementById('bpf-body');

  var html = '<div class="bpf-monthly">'
    + '<div class="bpf-table-wrap"><table class="bpf-table">'
    + '<thead><tr>'
    + '<th>Month</th><th>Referrals</th><th>Conversions</th><th>Revenue</th><th>Cost</th><th>Profit</th><th>ROI</th><th>Season</th>'
    + '</tr></thead><tbody>';

  forecast.months.forEach(function(m) {
    var profitColor = m.profit >= 0 ? '#10B981' : '#EF4444';
    var seasonLabel = m.seasonFactor >= 1.1 ? 'High' : m.seasonFactor <= 0.85 ? 'Low' : 'Normal';
    var seasonColor = m.seasonFactor >= 1.1 ? '#10B981' : m.seasonFactor <= 0.85 ? '#EF4444' : '#F59E0B';

    html += '<tr>'
      + '<td><strong>' + m.month + '</strong></td>'
      + '<td>' + m.referrals + '</td>'
      + '<td>' + m.conversions + '</td>'
      + '<td>$' + m.revenue.toLocaleString() + '</td>'
      + '<td>$' + m.cost.toLocaleString() + '</td>'
      + '<td style="color:' + profitColor + ';font-weight:600">$' + m.profit.toLocaleString() + '</td>'
      + '<td>' + m.roi + '%</td>'
      + '<td><span class="bpf-season-badge" style="background:' + seasonColor + '15;color:' + seasonColor + '">' + seasonLabel + '</span></td>'
      + '</tr>';
  });

  html += '</tbody></table></div>';

  // Cumulative totals
  var s = forecast.summary;
  html += '<div class="bpf-totals">'
    + '<div class="bpf-total-row"><span>Total Revenue</span><span class="bpf-total-val">$' + s.totalRevenue.toLocaleString() + '</span></div>'
    + '<div class="bpf-total-row"><span>Total Costs</span><span class="bpf-total-val">$' + s.totalCost.toLocaleString() + '</span></div>'
    + '<div class="bpf-total-row bpf-total-profit"><span>Net Profit</span><span class="bpf-total-val">$' + s.totalProfit.toLocaleString() + '</span></div>'
    + '</div></div>';

  body.innerHTML = html;
}

// ── GROWTH CURVES TAB ────────────────────────

function bpfRenderCharts(forecast) {
  var body = document.getElementById('bpf-body');

  var html = '<div class="bpf-charts">';

  // Cumulative revenue curve
  html += '<div class="bpf-chart-section">'
    + '<div class="bpf-chart-title">Cumulative Revenue vs Cost</div>'
    + '<div class="bpf-area-chart">';

  var maxCum = forecast.months[11].cumulativeRevenue;
  forecast.months.forEach(function(m) {
    var revPct = Math.round((m.cumulativeRevenue / maxCum) * 100);
    var costPct = Math.round((m.cumulativeCost / maxCum) * 100);
    html += '<div class="bpf-area-col">'
      + '<div class="bpf-area-bars">'
      + '<div class="bpf-area-rev" style="height:' + revPct + '%"></div>'
      + '<div class="bpf-area-cost" style="height:' + costPct + '%"></div>'
      + '</div>'
      + '<div class="bpf-area-label">' + m.month + '</div>'
      + '</div>';
  });

  html += '</div>'
    + '<div class="bpf-chart-legend">'
    + '<span class="bpf-legend-item"><span class="bpf-legend-dot" style="background:#3B82F6"></span> Revenue</span>'
    + '<span class="bpf-legend-item"><span class="bpf-legend-dot" style="background:#EF4444"></span> Cost</span>'
    + '</div></div>';

  // Referral growth curve
  html += '<div class="bpf-chart-section">'
    + '<div class="bpf-chart-title">Monthly Referral Volume</div>'
    + '<div class="bpf-ref-chart">';

  var maxRefs = Math.max.apply(null, forecast.months.map(function(m) { return m.referrals; }));
  forecast.months.forEach(function(m) {
    var pct = maxRefs > 0 ? Math.round((m.referrals / maxRefs) * 100) : 0;
    html += '<div class="bpf-ref-col">'
      + '<div class="bpf-ref-val">' + m.referrals + '</div>'
      + '<div class="bpf-ref-bar" style="height:' + pct + '%"></div>'
      + '<div class="bpf-ref-label">' + m.month + '</div>'
      + '</div>';
  });

  html += '</div></div>';

  // Profit margin trend
  html += '<div class="bpf-chart-section">'
    + '<div class="bpf-chart-title">Monthly Profit Margin</div>'
    + '<div class="bpf-margin-chart">';

  forecast.months.forEach(function(m) {
    var margin = m.revenue > 0 ? Math.round(((m.revenue - m.cost) / m.revenue) * 100) : 0;
    var color = margin >= 50 ? '#10B981' : margin >= 20 ? '#F59E0B' : '#EF4444';
    html += '<div class="bpf-margin-col">'
      + '<div class="bpf-margin-val" style="color:' + color + '">' + margin + '%</div>'
      + '<div class="bpf-margin-bar" style="height:' + Math.max(margin, 5) + '%;background:' + color + '"></div>'
      + '<div class="bpf-margin-label">' + m.month + '</div>'
      + '</div>';
  });

  html += '</div></div></div>';
  body.innerHTML = html;
}

// ── WHAT-IF SCENARIOS TAB ────────────────────────

function bpfRenderScenarios(inputs) {
  var body = document.getElementById('bpf-body');

  var scenarios = [
    { name: 'Current Plan', refs: inputs.currentRefs, target: inputs.targetRefs, commission: inputs.avgCommission, conv: inputs.conversionRate, budget: inputs.monthlyBudget, color: '#3B82F6' },
    { name: 'Aggressive Growth', refs: inputs.currentRefs, target: Math.round(inputs.targetRefs * 1.5), commission: inputs.avgCommission, conv: inputs.conversionRate * 1.2, budget: Math.round(inputs.monthlyBudget * 1.5), color: '#10B981' },
    { name: 'Conservative', refs: inputs.currentRefs, target: Math.round(inputs.targetRefs * 0.7), commission: inputs.avgCommission, conv: inputs.conversionRate * 0.8, budget: Math.round(inputs.monthlyBudget * 0.7), color: '#F59E0B' },
    { name: 'Premium Focus', refs: inputs.currentRefs, target: Math.round(inputs.targetRefs * 0.8), commission: Math.round(inputs.avgCommission * 1.5), conv: inputs.conversionRate * 0.9, budget: inputs.monthlyBudget, color: '#8B5CF6' }
  ];

  var results = scenarios.map(function(s) {
    var modInputs = Object.assign({}, inputs, { targetRefs: s.target, avgCommission: s.commission, conversionRate: s.conv, monthlyBudget: s.budget });
    var forecast = bpfGenerateForecast(modInputs);
    return Object.assign({}, s, { forecast: forecast });
  });

  var html = '<div class="bpf-scenarios">'
    + '<div class="bpf-scenario-grid">';

  results.forEach(function(r) {
    var s = r.forecast.summary;
    html += '<div class="bpf-scenario-card" style="border-top:3px solid ' + r.color + '">'
      + '<div class="bpf-scenario-name" style="color:' + r.color + '">' + r.name + '</div>'
      + '<div class="bpf-scenario-revenue">$' + s.totalRevenue.toLocaleString() + '</div>'
      + '<div class="bpf-scenario-details">'
      + '<div class="bpf-sc-row"><span>Target Refs</span><span>' + r.target + '/mo</span></div>'
      + '<div class="bpf-sc-row"><span>Avg Commission</span><span>$' + r.commission + '</span></div>'
      + '<div class="bpf-sc-row"><span>Conv Rate</span><span>' + Math.round(r.conv * 100) + '%</span></div>'
      + '<div class="bpf-sc-row"><span>Monthly Budget</span><span>$' + r.budget + '</span></div>'
      + '<div class="bpf-sc-row"><span>Net Profit</span><span style="color:#10B981;font-weight:600">$' + s.totalProfit.toLocaleString() + '</span></div>'
      + '<div class="bpf-sc-row"><span>ROI</span><span>' + s.avgROI + '%</span></div>'
      + '</div></div>';
  });

  html += '</div>';

  // Comparison bar
  html += '<div class="bpf-chart-section">'
    + '<div class="bpf-chart-title">Revenue Comparison</div>'
    + '<div class="bpf-compare-bars">';

  var maxScenario = Math.max.apply(null, results.map(function(r) { return r.forecast.summary.totalRevenue; }));
  results.forEach(function(r) {
    var pct = Math.round((r.forecast.summary.totalRevenue / maxScenario) * 100);
    html += '<div class="bpf-compare-row">'
      + '<div class="bpf-compare-label" style="color:' + r.color + '">' + r.name + '</div>'
      + '<div class="bpf-compare-track"><div class="bpf-compare-fill" style="width:' + pct + '%;background:' + r.color + '"></div></div>'
      + '<div class="bpf-compare-val">$' + r.forecast.summary.totalRevenue.toLocaleString() + '</div>'
      + '</div>';
  });

  html += '</div></div></div>';
  body.innerHTML = html;
}

// ── AI ANALYSIS TAB ────────────────────────

function bpfRenderAI(forecast, inputs) {
  var body = document.getElementById('bpf-body');
  var s = forecast.summary;

  var html = '<div class="bpf-ai">'
    + '<div class="bpf-ai-prompt">'
    + '<button class="bpf-ai-btn" onclick="bpfRunAI()">Generate AI Financial Analysis</button>'
    + '<div class="bpf-ai-note">AI will analyze your forecast data and provide personalized recommendations</div>'
    + '</div>'
    + '<div id="bpf-ai-results">';

  // Show pre-computed insights while waiting for AI
  var insights = bpfGetInsights(forecast, inputs);
  insights.forEach(function(item) {
    html += '<div class="bpf-ai-card">'
      + '<div class="bpf-ai-card-icon" style="color:' + item.color + '">' + item.icon + '</div>'
      + '<div class="bpf-ai-card-content">'
      + '<div class="bpf-ai-card-title">' + item.title + '</div>'
      + '<div class="bpf-ai-card-body">' + item.body + '</div>'
      + '</div></div>';
  });

  html += '</div></div>';
  body.innerHTML = html;
}

function bpfGetInsights(forecast, inputs) {
  var s = forecast.summary;
  var insights = [];

  // Revenue assessment
  if (s.totalRevenue > 50000) {
    insights.push({ icon: '&#128200;', color: '#10B981', title: 'Strong Revenue Potential', body: 'Your projected $' + s.totalRevenue.toLocaleString() + ' annual revenue puts you in the top 20% of partner projections. Tax season months alone could drive $' + (forecast.months[2].revenue + forecast.months[3].revenue).toLocaleString() + ' in peak earnings.' });
  } else {
    insights.push({ icon: '&#128200;', color: '#F59E0B', title: 'Growth Opportunity', body: 'Your projected $' + s.totalRevenue.toLocaleString() + ' has room to grow. Increasing your conversion rate by just 5% would add approximately $' + Math.round(s.totalRevenue * 0.33).toLocaleString() + ' to your annual revenue.' });
  }

  // ROI assessment
  insights.push({ icon: '&#128176;', color: '#3B82F6', title: 'Investment Return', body: 'Your ' + s.avgROI + '% ROI means every $1 invested returns $' + (1 + s.avgROI / 100).toFixed(2) + '. Break-even at month ' + s.breakEvenMonth + ' is ' + (s.breakEvenMonth <= 3 ? 'excellent' : s.breakEvenMonth <= 6 ? 'solid' : 'worth monitoring') + '. After break-even, each month becomes pure profit growth.' });

  // Seasonality warning
  insights.push({ icon: '&#128197;', color: '#EC4899', title: 'Seasonal Strategy', body: 'Your low month (' + s.lowMonth.month + ') is ' + Math.round((s.lowMonth.revenue / s.peakMonth.revenue) * 100) + '% of your peak. Build a 2-month marketing runway before tax season (Jan-Feb) and use summer months for relationship building and content creation.' });

  // Scaling advice
  var refsNeeded = Math.ceil(s.totalRevenue / (inputs.avgCommission * inputs.conversionRate));
  insights.push({ icon: '&#9889;', color: '#8B5CF6', title: 'Scaling Levers', body: 'To hit your target, you need approximately ' + refsNeeded + ' raw referrals converting at ' + Math.round(inputs.conversionRate * 100) + '%. The fastest lever to pull is conversion rate -- improving your qualification process by even 3% has more impact than doubling your referral volume.' });

  return insights;
}

function bpfRunAI() {
  var inputs = bpfGetInputs();
  var forecast = bpfGenerateForecast(inputs);
  var s = forecast.summary;

  var resultsDiv = document.getElementById('bpf-ai-results');
  if (resultsDiv) {
    resultsDiv.innerHTML = '<div class="bpf-loading">Analyzing your financial data with AI...</div>';
  }

  var prompt = 'You are a financial advisor for a ' + inputs.practiceType + ' running a tax resolution referral partnership. '
    + 'Their 12-month forecast: $' + s.totalRevenue + ' revenue, $' + s.totalCost + ' cost, ' + s.avgROI + '% ROI, '
    + s.totalRefs + ' referrals, break-even month ' + s.breakEvenMonth + '. '
    + 'Peak: ' + s.peakMonth.month + ' ($' + s.peakMonth.revenue + '), Low: ' + s.lowMonth.month + ' ($' + s.lowMonth.revenue + '). '
    + 'Give 4 specific, actionable financial recommendations. '
    + 'Return JSON array: [{"title":"...","recommendation":"...","impact":"..."}]';

  fetch(typeof CTAX_API_URL !== 'undefined' ? CTAX_API_URL : 'https://ctax-api-proxy.vercel.app/api/chat', {
    method: 'POST',
    headers: typeof getApiHeaders === 'function' ? getApiHeaders() : { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 1024, messages: [{ role: 'user', content: prompt }] })
  })
  .then(function(r) {
    if (!r.ok) throw new Error('API returned ' + r.status);
    return r.json();
  })
  .then(function(data) {
    var text = data.content ? data.content[0].text : '';
    var recs = [];
    try {
      var match = text.match(/\[[\s\S]*\]/);
      if (match) recs = JSON.parse(match[0]);
    } catch (parseErr) {
      console.warn('Failed to parse AI forecast response:', parseErr.message);
    }
    if (recs.length === 0) recs = bpfFallbackRecs(s, inputs);
    bpfShowAIResults(recs);
  })
  .catch(function(err) {
    console.warn('Forecast AI request failed:', err.message);
    if (typeof showToast === 'function') showToast('Using smart recommendations (AI unavailable)', 'info');
    bpfShowAIResults(bpfFallbackRecs(s, inputs));
  });
}

function bpfFallbackRecs(s, inputs) {
  return [
    { title: 'Tax Season Ramp-Up', recommendation: 'Increase marketing spend by 40% in January-February to capture the surge in tax-related searches. Your current budget of $' + inputs.monthlyBudget + '/mo should jump to $' + Math.round(inputs.monthlyBudget * 1.4) + '/mo during Q1.', impact: 'Estimated +$' + Math.round(s.totalRevenue * 0.15).toLocaleString() + ' additional revenue' },
    { title: 'Conversion Rate Optimization', recommendation: 'Focus on qualifying referrals better upfront. Add a pre-qualification checklist to ensure each referral has at least $25K in tax debt. This alone should lift your conversion rate from ' + Math.round(inputs.conversionRate * 100) + '% to ' + Math.round(inputs.conversionRate * 130) + '%.', impact: 'Estimated +30% conversion improvement' },
    { title: 'Summer Revenue Floor', recommendation: 'Your low months (June-August) are dragging down your average. Create a "Summer Special" referral incentive or partner co-marketing campaign to maintain minimum monthly volume.', impact: 'Could add $' + Math.round(s.lowMonth.revenue * 0.5).toLocaleString() + '/month in low-season months' },
    { title: 'Commission Tier Strategy', recommendation: 'Based on your volume trajectory, you should hit the next commission tier by month ' + Math.min(8, Math.max(4, Math.round(12 / (inputs.targetRefs / 5)))) + '. Plan your referral cadence to front-load volume and lock in higher rates sooner.', impact: 'Higher tier could add 15-25% to per-referral earnings' }
  ];
}

function bpfShowAIResults(recs) {
  var resultsDiv = document.getElementById('bpf-ai-results');
  if (!resultsDiv) return;
  var html = '';
  recs.forEach(function(r) {
    html += '<div class="bpf-ai-card">'
      + '<div class="bpf-ai-card-content">'
      + '<div class="bpf-ai-card-title">' + r.title + '</div>'
      + '<div class="bpf-ai-card-body">' + r.recommendation + '</div>'
      + '<div class="bpf-ai-card-impact">' + r.impact + '</div>'
      + '</div></div>';
  });
  resultsDiv.innerHTML = html;
}
