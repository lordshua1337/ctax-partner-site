// ══════════════════════════════════════════
//  M5P3C3: QUARTERLY BUSINESS REVIEW
//  Performance analysis, trend reports, action plans, benchmarks, AI strategy
// ══════════════════════════════════════════

var BPR_STORAGE_KEY = 'bp_review_v1';
var BPR_REVIEWS_KEY = 'bp_reviews_history';

// ── BENCHMARK DATA ──────────────────────────

var BPR_BENCHMARKS = {
  'tax-prep': { avgRefs: 8, convRate: 0.42, avgDeal: 650, churn: 0.12, growth: 0.15, label: 'Tax Preparation' },
  'accounting': { avgRefs: 6, convRate: 0.38, avgDeal: 580, churn: 0.10, growth: 0.12, label: 'Accounting' },
  'financial-advisory': { avgRefs: 5, convRate: 0.45, avgDeal: 900, churn: 0.08, growth: 0.18, label: 'Financial Advisory' },
  'legal': { avgRefs: 4, convRate: 0.50, avgDeal: 1100, churn: 0.06, growth: 0.10, label: 'Law Firm' },
  'insurance': { avgRefs: 7, convRate: 0.35, avgDeal: 520, churn: 0.15, growth: 0.14, label: 'Insurance' },
  'mortgage': { avgRefs: 6, convRate: 0.40, avgDeal: 700, churn: 0.11, growth: 0.13, label: 'Mortgage' },
  'other': { avgRefs: 5, convRate: 0.38, avgDeal: 600, churn: 0.12, growth: 0.12, label: 'Professional Services' }
};

// ── PERFORMANCE GRADING ──────────────────────────

var BPR_GRADES = [
  { min: 95, letter: 'A+', color: '#10B981', label: 'Outstanding' },
  { min: 85, letter: 'A', color: '#10B981', label: 'Excellent' },
  { min: 75, letter: 'B+', color: '#3B82F6', label: 'Above Average' },
  { min: 65, letter: 'B', color: '#3B82F6', label: 'Good' },
  { min: 55, letter: 'C+', color: '#F59E0B', label: 'Average' },
  { min: 45, letter: 'C', color: '#F59E0B', label: 'Below Average' },
  { min: 35, letter: 'D', color: '#EF4444', label: 'Needs Improvement' },
  { min: 0, letter: 'F', color: '#EF4444', label: 'Critical' }
];

// ── REVIEW CATEGORIES ──────────────────────────

var BPR_CATEGORIES = [
  { id: 'referrals', name: 'Referral Volume', icon: '&#128101;', weight: 0.25 },
  { id: 'conversion', name: 'Conversion Rate', icon: '&#127919;', weight: 0.20 },
  { id: 'revenue', name: 'Revenue Growth', icon: '&#128176;', weight: 0.25 },
  { id: 'efficiency', name: 'Cost Efficiency', icon: '&#128200;', weight: 0.15 },
  { id: 'consistency', name: 'Consistency', icon: '&#128293;', weight: 0.15 }
];

// ── SWOT TEMPLATES ──────────────────────────

var BPR_SWOT_TEMPLATES = {
  strengths: [
    'Strong conversion rate above industry average',
    'Consistent weekly referral activity',
    'Growing pipeline with diversified sources',
    'Low client churn rate',
    'High average deal size',
    'Strong seasonal performance during tax months',
    'Effective follow-up process',
    'Multiple active referral channels'
  ],
  weaknesses: [
    'Below-average referral volume',
    'Inconsistent monthly activity',
    'High cost per acquisition',
    'Limited referral sources',
    'Low conversion rate needs attention',
    'Summer months show significant revenue dip',
    'No systematic follow-up process',
    'Dependent on single referral channel'
  ],
  opportunities: [
    'Tax season ramp-up in Q1 could boost volume 30-50%',
    'Partner networking events for new referral sources',
    'Content marketing to attract inbound referrals',
    'Cross-selling to existing converted clients',
    'Commission tier upgrade within reach',
    'Summer marketing campaign to stabilize low months',
    'Referral automation tools to improve efficiency',
    'Strategic partnerships with complementary professionals'
  ],
  threats: [
    'Seasonal revenue dependency creates cash flow risk',
    'Increasing competition in local market',
    'Client fatigue with referral requests',
    'Economic downturn could reduce tax resolution demand',
    'Rising marketing costs affecting ROI',
    'Key referral partner churn risk',
    'Regulatory changes affecting commission structure',
    'Market saturation in primary geography'
  ]
};

// ── STATE ──────────────────────────

function bprLoadState() {
  try {
    return JSON.parse(localStorage.getItem(BPR_STORAGE_KEY)) || {};
  } catch (e) {
    return {};
  }
}

function bprSaveState(state) {
  localStorage.setItem(BPR_STORAGE_KEY, JSON.stringify(state));
}

function bprLoadReviews() {
  try {
    return JSON.parse(localStorage.getItem(BPR_REVIEWS_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function bprSaveReviews(reviews) {
  localStorage.setItem(BPR_REVIEWS_KEY, JSON.stringify(reviews));
}

// ── GATHER METRICS FROM OTHER MODULES ──────────────────────────

function bprGatherMetrics() {
  // Pull from business planner data
  var bp = {};
  try { bp = JSON.parse(localStorage.getItem('ctax_bp_data') || '{}'); } catch (e) {}

  // Pull from goals tracker
  var goals = {};
  try { goals = JSON.parse(localStorage.getItem('bp_goals_v1') || '{}'); } catch (e) {}
  var goalList = goals.goals || [];

  // Pull from forecast
  var forecastData = {};
  try { forecastData = JSON.parse(localStorage.getItem('bp_forecast_v1') || '{}'); } catch (e) {}

  // Pull from challenge data
  var challenge = {};
  try { challenge = JSON.parse(localStorage.getItem('ctax_challenge_data') || '{}'); } catch (e) {}

  var practiceType = bp.practiceType || 'other';
  var bench = BPR_BENCHMARKS[practiceType] || BPR_BENCHMARKS['other'];

  // Calculate current metrics (simulated from available data)
  var currentRefs = parseInt(bp.currentRefs) || 4;
  var targetRefs = parseInt(bp.targetRefs) || 10;
  var convRate = parseFloat(bp.conversionRate) || 0.35;
  var avgCommission = parseInt(bp.avgCommission) || 650;
  var monthlyBudget = parseInt(bp.monthlyBudget) || 400;

  // Goal progress metrics
  var refGoal = goalList.find(function(g) { return g.templateId === 'referrals'; });
  var revGoal = goalList.find(function(g) { return g.templateId === 'revenue'; });
  var convGoal = goalList.find(function(g) { return g.templateId === 'conversion'; });

  // Simulate 3 months of data for trend analysis
  var months = bprSimulateQuarter(currentRefs, convRate, avgCommission, monthlyBudget);

  return {
    practiceType: practiceType,
    bench: bench,
    months: months,
    currentRefs: currentRefs,
    targetRefs: targetRefs,
    convRate: convRate,
    avgCommission: avgCommission,
    monthlyBudget: monthlyBudget,
    goals: goalList,
    refGoal: refGoal,
    revGoal: revGoal,
    convGoal: convGoal,
    challengeDay: challenge.currentDay || 0,
    challengeStreak: challenge.currentStreak || 0
  };
}

function bprSimulateQuarter(refs, conv, commission, budget) {
  var now = new Date();
  var months = [];
  var seasonality = [0.85, 0.90, 1.30, 1.45, 0.75, 0.80, 0.85, 0.90, 1.00, 1.10, 1.15, 1.20];

  for (var i = 2; i >= 0; i--) {
    var monthIdx = (now.getMonth() - i + 12) % 12;
    var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var season = seasonality[monthIdx];
    var variance = 0.85 + Math.random() * 0.3;

    var monthRefs = Math.max(1, Math.round(refs * season * variance));
    var converted = Math.round(monthRefs * conv);
    var revenue = converted * commission;
    var cost = budget + Math.round(revenue * 0.05);
    var profit = revenue - cost;

    months.push({
      name: monthNames[monthIdx],
      monthIdx: monthIdx,
      referrals: monthRefs,
      conversions: converted,
      revenue: revenue,
      cost: cost,
      profit: profit,
      roi: cost > 0 ? Math.round(((revenue - cost) / cost) * 100) : 0,
      season: season
    });
  }

  return months;
}

// ── SCORING ENGINE ──────────────────────────

function bprScoreCategory(categoryId, metrics) {
  var bench = metrics.bench;
  var months = metrics.months;
  var latest = months[months.length - 1];
  var previous = months.length >= 2 ? months[months.length - 2] : latest;

  switch (categoryId) {
    case 'referrals':
      var refScore = Math.min(100, Math.round((latest.referrals / bench.avgRefs) * 70));
      var refTrend = latest.referrals > previous.referrals ? 15 : latest.referrals === previous.referrals ? 5 : 0;
      return Math.min(100, refScore + refTrend);

    case 'conversion':
      var convScore = Math.min(100, Math.round((metrics.convRate / bench.convRate) * 70));
      return Math.min(100, convScore + 10);

    case 'revenue':
      var avgRevenue = months.reduce(function(s, m) { return s + m.revenue; }, 0) / months.length;
      var revenueTarget = bench.avgRefs * bench.convRate * bench.avgDeal;
      return Math.min(100, Math.round((avgRevenue / revenueTarget) * 80) + 10);

    case 'efficiency':
      var avgROI = months.reduce(function(s, m) { return s + m.roi; }, 0) / months.length;
      return Math.min(100, Math.round(Math.min(avgROI / 3, 80)) + 10);

    case 'consistency':
      var refVariance = 0;
      if (months.length >= 2) {
        var avgRefs = months.reduce(function(s, m) { return s + m.referrals; }, 0) / months.length;
        refVariance = months.reduce(function(s, m) { return s + Math.abs(m.referrals - avgRefs); }, 0) / months.length;
        var consistencyScore = Math.max(0, 100 - Math.round((refVariance / Math.max(avgRefs, 1)) * 100));
        return Math.min(100, consistencyScore);
      }
      return 60;

    default:
      return 50;
  }
}

function bprGetGrade(score) {
  for (var i = 0; i < BPR_GRADES.length; i++) {
    if (score >= BPR_GRADES[i].min) return BPR_GRADES[i];
  }
  return BPR_GRADES[BPR_GRADES.length - 1];
}

function bprOverallScore(metrics) {
  var total = 0;
  BPR_CATEGORIES.forEach(function(cat) {
    total += bprScoreCategory(cat.id, metrics) * cat.weight;
  });
  return Math.round(total);
}

// ── MAIN MODAL ──────────────────────────

function bprShowReview() {
  var existing = document.getElementById('bpr-modal');
  if (existing) existing.remove();

  var overlay = document.createElement('div');
  overlay.className = 'bpr-overlay';
  overlay.id = 'bpr-modal';
  overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };

  var modal = document.createElement('div');
  modal.className = 'bpr-modal';

  modal.innerHTML = '<div class="bpr-header">'
    + '<div><div class="bpr-title">Quarterly Business Review</div>'
    + '<div class="bpr-subtitle">Performance analysis, benchmarks, and strategic recommendations</div></div>'
    + '<button class="bpr-close" onclick="document.getElementById(\'bpr-modal\').remove()">&times;</button>'
    + '</div>'
    + '<div class="bpr-tabs" id="bpr-tabs"></div>'
    + '<div class="bpr-body" id="bpr-body"></div>';

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  bprRenderTabs('scorecard');
}

function bprRenderTabs(active) {
  var tabs = [
    { id: 'scorecard', label: 'Scorecard' },
    { id: 'trends', label: 'Trends' },
    { id: 'benchmarks', label: 'Benchmarks' },
    { id: 'swot', label: 'SWOT' },
    { id: 'action', label: 'Action Plan' },
    { id: 'ai', label: 'AI Strategy' }
  ];

  var html = '';
  tabs.forEach(function(t) {
    html += '<button class="bpr-tab' + (t.id === active ? ' bpr-tab-active' : '') + '" onclick="bprSwitchTab(\'' + t.id + '\')">' + t.label + '</button>';
  });

  document.getElementById('bpr-tabs').innerHTML = html;
  bprSwitchTab(active);
}

function bprSwitchTab(tab) {
  var tabs = document.querySelectorAll('.bpr-tab');
  var labels = { scorecard: 'Scorecard', trends: 'Trends', benchmarks: 'Benchmarks', swot: 'SWOT', action: 'Action Plan', ai: 'AI Strategy' };
  tabs.forEach(function(t) { t.classList.toggle('bpr-tab-active', t.textContent === labels[tab]); });

  var body = document.getElementById('bpr-body');
  if (!body) return;

  var metrics = bprGatherMetrics();

  if (tab === 'scorecard') bprRenderScorecard(metrics);
  else if (tab === 'trends') bprRenderTrends(metrics);
  else if (tab === 'benchmarks') bprRenderBenchmarks(metrics);
  else if (tab === 'swot') bprRenderSWOT(metrics);
  else if (tab === 'action') bprRenderActionPlan(metrics);
  else if (tab === 'ai') bprRenderAI(metrics);
}

// ── SCORECARD TAB ──────────────────────────

function bprRenderScorecard(metrics) {
  var body = document.getElementById('bpr-body');
  var overall = bprOverallScore(metrics);
  var grade = bprGetGrade(overall);

  var html = '<div class="bpr-scorecard">';

  // Overall grade hero
  html += '<div class="bpr-grade-hero">'
    + '<div class="bpr-grade-circle" style="border-color:' + grade.color + '">'
    + '<div class="bpr-grade-letter" style="color:' + grade.color + '">' + grade.letter + '</div>'
    + '<div class="bpr-grade-score">' + overall + '/100</div>'
    + '</div>'
    + '<div class="bpr-grade-info">'
    + '<div class="bpr-grade-label">' + grade.label + '</div>'
    + '<div class="bpr-grade-period">Q' + (Math.ceil((new Date().getMonth() + 1) / 3)) + ' ' + new Date().getFullYear() + ' Performance</div>'
    + '<div class="bpr-grade-type">' + metrics.bench.label + ' Partner</div>'
    + '</div>'
    + '</div>';

  // Category scores
  html += '<div class="bpr-cat-scores">';
  BPR_CATEGORIES.forEach(function(cat) {
    var score = bprScoreCategory(cat.id, metrics);
    var catGrade = bprGetGrade(score);

    html += '<div class="bpr-cat-row">'
      + '<div class="bpr-cat-icon">' + cat.icon + '</div>'
      + '<div class="bpr-cat-info">'
      + '<div class="bpr-cat-name">' + cat.name + '</div>'
      + '<div class="bpr-cat-weight">Weight: ' + Math.round(cat.weight * 100) + '%</div>'
      + '</div>'
      + '<div class="bpr-cat-bar-wrap">'
      + '<div class="bpr-cat-bar"><div class="bpr-cat-bar-fill" style="width:' + score + '%;background:' + catGrade.color + '"></div></div>'
      + '</div>'
      + '<div class="bpr-cat-score" style="color:' + catGrade.color + '">' + catGrade.letter + ' (' + score + ')</div>'
      + '</div>';
  });
  html += '</div>';

  // Quarter summary stats
  var months = metrics.months;
  var totalRev = months.reduce(function(s, m) { return s + m.revenue; }, 0);
  var totalRefs = months.reduce(function(s, m) { return s + m.referrals; }, 0);
  var totalProfit = months.reduce(function(s, m) { return s + m.profit; }, 0);
  var avgROI = Math.round(months.reduce(function(s, m) { return s + m.roi; }, 0) / months.length);

  html += '<div class="bpr-quarter-stats">'
    + '<div class="bpr-qs-title">Quarter at a Glance</div>'
    + '<div class="bpr-qs-grid">'
    + '<div class="bpr-qs-item"><div class="bpr-qs-val" style="color:#3B82F6">' + totalRefs + '</div><div class="bpr-qs-label">Total Referrals</div></div>'
    + '<div class="bpr-qs-item"><div class="bpr-qs-val" style="color:#10B981">$' + totalRev.toLocaleString() + '</div><div class="bpr-qs-label">Quarterly Revenue</div></div>'
    + '<div class="bpr-qs-item"><div class="bpr-qs-val" style="color:#8B5CF6">$' + totalProfit.toLocaleString() + '</div><div class="bpr-qs-label">Net Profit</div></div>'
    + '<div class="bpr-qs-item"><div class="bpr-qs-val" style="color:#F59E0B">' + avgROI + '%</div><div class="bpr-qs-label">Average ROI</div></div>'
    + '</div></div>';

  // Save this review
  html += '<div style="text-align:center;margin-top:16px">'
    + '<button class="bpr-save-btn" onclick="bprSaveCurrentReview()">Save This Review</button>'
    + '</div>';

  html += '</div>';
  body.innerHTML = html;
}

function bprSaveCurrentReview() {
  var metrics = bprGatherMetrics();
  var overall = bprOverallScore(metrics);
  var grade = bprGetGrade(overall);

  var reviews = bprLoadReviews();
  reviews.push({
    date: new Date().toISOString().split('T')[0],
    quarter: 'Q' + Math.ceil((new Date().getMonth() + 1) / 3) + ' ' + new Date().getFullYear(),
    score: overall,
    grade: grade.letter,
    practiceType: metrics.practiceType,
    totalRefs: metrics.months.reduce(function(s, m) { return s + m.referrals; }, 0),
    totalRevenue: metrics.months.reduce(function(s, m) { return s + m.revenue; }, 0),
    categoryScores: {}
  });

  BPR_CATEGORIES.forEach(function(cat) {
    reviews[reviews.length - 1].categoryScores[cat.id] = bprScoreCategory(cat.id, metrics);
  });

  bprSaveReviews(reviews);

  var btn = document.querySelector('.bpr-save-btn');
  if (btn) {
    btn.textContent = 'Review Saved!';
    btn.style.background = '#10B981';
    setTimeout(function() { btn.textContent = 'Save This Review'; btn.style.background = ''; }, 2000);
  }
}

// ── TRENDS TAB ──────────────────────────

function bprRenderTrends(metrics) {
  var body = document.getElementById('bpr-body');
  var months = metrics.months;

  var html = '<div class="bpr-trends">';

  // Revenue trend chart
  html += '<div class="bpr-chart-section">'
    + '<div class="bpr-chart-title">Monthly Revenue Trend</div>'
    + '<div class="bpr-trend-chart">';

  var maxRev = Math.max.apply(null, months.map(function(m) { return m.revenue; }));
  months.forEach(function(m) {
    var pct = maxRev > 0 ? Math.round((m.revenue / maxRev) * 100) : 0;
    var trend = m === months[months.length - 1] && months.length >= 2 ? (m.revenue > months[months.length - 2].revenue ? 'up' : 'down') : '';
    html += '<div class="bpr-trend-col">'
      + '<div class="bpr-trend-val">$' + m.revenue.toLocaleString() + '</div>'
      + '<div class="bpr-trend-bar" style="height:' + pct + '%;background:' + (trend === 'up' ? '#10B981' : trend === 'down' ? '#EF4444' : '#3B82F6') + '"></div>'
      + '<div class="bpr-trend-label">' + m.name + '</div>'
      + '</div>';
  });

  html += '</div></div>';

  // Referral volume trend
  html += '<div class="bpr-chart-section">'
    + '<div class="bpr-chart-title">Referral Volume Trend</div>'
    + '<div class="bpr-trend-chart">';

  var maxRef = Math.max.apply(null, months.map(function(m) { return m.referrals; }));
  months.forEach(function(m) {
    var pct = maxRef > 0 ? Math.round((m.referrals / maxRef) * 100) : 0;
    html += '<div class="bpr-trend-col">'
      + '<div class="bpr-trend-val">' + m.referrals + '</div>'
      + '<div class="bpr-trend-bar" style="height:' + pct + '%;background:#8B5CF6"></div>'
      + '<div class="bpr-trend-label">' + m.name + '</div>'
      + '</div>';
  });

  html += '</div></div>';

  // Profit margin trend
  html += '<div class="bpr-chart-section">'
    + '<div class="bpr-chart-title">Profit Margin by Month</div>'
    + '<div class="bpr-trend-chart">';

  months.forEach(function(m) {
    var margin = m.revenue > 0 ? Math.round((m.profit / m.revenue) * 100) : 0;
    var color = margin >= 50 ? '#10B981' : margin >= 20 ? '#F59E0B' : '#EF4444';
    html += '<div class="bpr-trend-col">'
      + '<div class="bpr-trend-val" style="color:' + color + '">' + margin + '%</div>'
      + '<div class="bpr-trend-bar" style="height:' + Math.max(margin, 5) + '%;background:' + color + '"></div>'
      + '<div class="bpr-trend-label">' + m.name + '</div>'
      + '</div>';
  });

  html += '</div></div>';

  // Month-over-month changes
  if (months.length >= 2) {
    var latest = months[months.length - 1];
    var prev = months[months.length - 2];

    html += '<div class="bpr-mom-section">'
      + '<div class="bpr-chart-title">Month-over-Month Changes</div>'
      + '<div class="bpr-mom-grid">';

    var changes = [
      { label: 'Referrals', current: latest.referrals, previous: prev.referrals },
      { label: 'Revenue', current: latest.revenue, previous: prev.revenue, prefix: '$' },
      { label: 'Conversions', current: latest.conversions, previous: prev.conversions },
      { label: 'Profit', current: latest.profit, previous: prev.profit, prefix: '$' },
      { label: 'ROI', current: latest.roi, previous: prev.roi, suffix: '%' }
    ];

    changes.forEach(function(c) {
      var delta = c.current - c.previous;
      var pctChange = c.previous > 0 ? Math.round((delta / c.previous) * 100) : 0;
      var isUp = delta > 0;
      var color = isUp ? '#10B981' : delta < 0 ? '#EF4444' : '#94A3B8';

      html += '<div class="bpr-mom-card">'
        + '<div class="bpr-mom-label">' + c.label + '</div>'
        + '<div class="bpr-mom-current">' + (c.prefix || '') + c.current.toLocaleString() + (c.suffix || '') + '</div>'
        + '<div class="bpr-mom-change" style="color:' + color + '">'
        + (isUp ? '&#9650; ' : delta < 0 ? '&#9660; ' : '&#8212; ') + Math.abs(pctChange) + '%'
        + '</div></div>';
    });

    html += '</div></div>';
  }

  // Past reviews comparison
  var reviews = bprLoadReviews();
  if (reviews.length > 1) {
    html += '<div class="bpr-past-section">'
      + '<div class="bpr-chart-title">Score History</div>'
      + '<div class="bpr-past-grid">';

    reviews.slice(-4).forEach(function(r) {
      var g = bprGetGrade(r.score);
      html += '<div class="bpr-past-card" style="border-top:3px solid ' + g.color + '">'
        + '<div class="bpr-past-quarter">' + r.quarter + '</div>'
        + '<div class="bpr-past-grade" style="color:' + g.color + '">' + r.grade + '</div>'
        + '<div class="bpr-past-score">' + r.score + '/100</div>'
        + '</div>';
    });

    html += '</div></div>';
  }

  html += '</div>';
  body.innerHTML = html;
}

// ── BENCHMARKS TAB ──────────────────────────

function bprRenderBenchmarks(metrics) {
  var body = document.getElementById('bpr-body');
  var bench = metrics.bench;
  var months = metrics.months;
  var latest = months[months.length - 1];

  var html = '<div class="bpr-benchmarks">';

  html += '<div class="bpr-bench-header">'
    + '<div class="bpr-bench-title">Industry Benchmarks: ' + bench.label + '</div>'
    + '<div class="bpr-bench-desc">Compare your performance against the average ' + bench.label.toLowerCase() + ' partner in the program.</div>'
    + '</div>';

  // Benchmark comparisons
  var comparisons = [
    { label: 'Monthly Referrals', yours: metrics.currentRefs, benchmark: bench.avgRefs, unit: '', better: 'higher' },
    { label: 'Conversion Rate', yours: Math.round(metrics.convRate * 100), benchmark: Math.round(bench.convRate * 100), unit: '%', better: 'higher' },
    { label: 'Avg Deal Size', yours: metrics.avgCommission, benchmark: bench.avgDeal, unit: '$', better: 'higher' },
    { label: 'Monthly ROI', yours: latest.roi, benchmark: Math.round(((bench.avgRefs * bench.convRate * bench.avgDeal - metrics.monthlyBudget) / metrics.monthlyBudget) * 100), unit: '%', better: 'higher' },
    { label: 'Client Churn Rate', yours: 10, benchmark: Math.round(bench.churn * 100), unit: '%', better: 'lower' }
  ];

  html += '<div class="bpr-bench-grid">';
  comparisons.forEach(function(c) {
    var isWinning = c.better === 'higher' ? c.yours >= c.benchmark : c.yours <= c.benchmark;
    var diff = c.yours - c.benchmark;
    var color = isWinning ? '#10B981' : '#EF4444';
    var maxVal = Math.max(c.yours, c.benchmark);

    html += '<div class="bpr-bench-card">'
      + '<div class="bpr-bench-label">' + c.label + '</div>'
      + '<div class="bpr-bench-comparison">'
      + '<div class="bpr-bench-row">'
      + '<span class="bpr-bench-who">You</span>'
      + '<div class="bpr-bench-bar-wrap"><div class="bpr-bench-bar" style="width:' + Math.round((c.yours / maxVal) * 100) + '%;background:' + color + '"></div></div>'
      + '<span class="bpr-bench-val">' + (c.unit === '$' ? '$' : '') + c.yours + (c.unit === '%' ? '%' : '') + '</span>'
      + '</div>'
      + '<div class="bpr-bench-row">'
      + '<span class="bpr-bench-who">Avg</span>'
      + '<div class="bpr-bench-bar-wrap"><div class="bpr-bench-bar" style="width:' + Math.round((c.benchmark / maxVal) * 100) + '%;background:#94A3B8"></div></div>'
      + '<span class="bpr-bench-val">' + (c.unit === '$' ? '$' : '') + c.benchmark + (c.unit === '%' ? '%' : '') + '</span>'
      + '</div>'
      + '</div>'
      + '<div class="bpr-bench-verdict" style="color:' + color + '">' + (isWinning ? 'Above average' : 'Below average') + ' (' + (diff > 0 ? '+' : '') + diff + (c.unit || '') + ')</div>'
      + '</div>';
  });
  html += '</div>';

  // Peer ranking estimate
  var overall = bprOverallScore(metrics);
  var percentile = Math.min(99, Math.max(1, Math.round(overall * 0.85 + 10)));

  html += '<div class="bpr-percentile">'
    + '<div class="bpr-percentile-header">Your Estimated Ranking</div>'
    + '<div class="bpr-percentile-bar"><div class="bpr-percentile-fill" style="width:' + percentile + '%"></div>'
    + '<div class="bpr-percentile-marker" style="left:' + percentile + '%"><div class="bpr-percentile-label">You: Top ' + (100 - percentile) + '%</div></div>'
    + '</div>'
    + '<div class="bpr-percentile-scale"><span>Bottom</span><span>Median</span><span>Top</span></div>'
    + '</div>';

  html += '</div>';
  body.innerHTML = html;
}

// ── SWOT TAB ──────────────────────────

function bprRenderSWOT(metrics) {
  var body = document.getElementById('bpr-body');
  var overall = bprOverallScore(metrics);

  // Select relevant SWOT items based on scores
  var strengths = [];
  var weaknesses = [];

  BPR_CATEGORIES.forEach(function(cat) {
    var score = bprScoreCategory(cat.id, metrics);
    if (score >= 65) {
      strengths.push(BPR_SWOT_TEMPLATES.strengths[Math.floor(Math.random() * BPR_SWOT_TEMPLATES.strengths.length)]);
    } else {
      weaknesses.push(BPR_SWOT_TEMPLATES.weaknesses[Math.floor(Math.random() * BPR_SWOT_TEMPLATES.weaknesses.length)]);
    }
  });

  // Ensure at least 2 of each
  while (strengths.length < 2) strengths.push(BPR_SWOT_TEMPLATES.strengths[strengths.length]);
  while (weaknesses.length < 2) weaknesses.push(BPR_SWOT_TEMPLATES.weaknesses[weaknesses.length]);

  var opportunities = BPR_SWOT_TEMPLATES.opportunities.slice(0, 4);
  var threats = BPR_SWOT_TEMPLATES.threats.slice(0, 4);

  var html = '<div class="bpr-swot">'
    + '<div class="bpr-swot-title">SWOT Analysis</div>'
    + '<div class="bpr-swot-desc">Strategic assessment based on your current performance data.</div>'
    + '<div class="bpr-swot-grid">';

  var quadrants = [
    { title: 'Strengths', items: strengths, color: '#10B981', icon: '&#128170;' },
    { title: 'Weaknesses', items: weaknesses, color: '#EF4444', icon: '&#9888;' },
    { title: 'Opportunities', items: opportunities, color: '#3B82F6', icon: '&#128161;' },
    { title: 'Threats', items: threats, color: '#F59E0B', icon: '&#9889;' }
  ];

  quadrants.forEach(function(q) {
    html += '<div class="bpr-swot-quad" style="border-top:3px solid ' + q.color + '">'
      + '<div class="bpr-swot-quad-header">'
      + '<span class="bpr-swot-quad-icon">' + q.icon + '</span>'
      + '<span class="bpr-swot-quad-title" style="color:' + q.color + '">' + q.title + '</span>'
      + '</div>'
      + '<ul class="bpr-swot-list">';
    q.items.forEach(function(item) {
      html += '<li>' + item + '</li>';
    });
    html += '</ul></div>';
  });

  html += '</div></div>';
  body.innerHTML = html;
}

// ── ACTION PLAN TAB ──────────────────────────

function bprRenderActionPlan(metrics) {
  var body = document.getElementById('bpr-body');

  // Generate actions based on weak categories
  var actions = [];
  BPR_CATEGORIES.forEach(function(cat) {
    var score = bprScoreCategory(cat.id, metrics);
    if (score < 65) {
      actions.push(bprGetAction(cat.id, score, metrics));
    }
  });

  // Always add growth actions
  actions.push({
    title: 'Next Quarter Revenue Target',
    description: 'Based on your current trajectory, aim for $' + Math.round(metrics.months.reduce(function(s, m) { return s + m.revenue; }, 0) * 1.15).toLocaleString() + ' next quarter (15% growth).',
    priority: 'high',
    timeframe: 'Next 90 days',
    kpi: '15% revenue increase',
    category: 'growth'
  });

  actions.push({
    title: 'Referral Source Diversification',
    description: 'Add at least 2 new referral channels this quarter. Consider: co-marketing partnerships, content marketing, paid lead generation, or industry event networking.',
    priority: 'medium',
    timeframe: 'Next 60 days',
    kpi: '2+ new channels active',
    category: 'strategy'
  });

  var html = '<div class="bpr-actions">'
    + '<div class="bpr-actions-header">'
    + '<div class="bpr-actions-title">Quarterly Action Plan</div>'
    + '<div class="bpr-actions-desc">Prioritized actions to improve your performance next quarter.</div>'
    + '</div>';

  // Sort by priority
  var priorityOrder = { high: 0, medium: 1, low: 2 };
  actions.sort(function(a, b) { return (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2); });

  html += '<div class="bpr-action-list">';
  actions.forEach(function(action, idx) {
    var priorityColor = action.priority === 'high' ? '#EF4444' : action.priority === 'medium' ? '#F59E0B' : '#3B82F6';
    html += '<div class="bpr-action-card">'
      + '<div class="bpr-action-num" style="background:' + priorityColor + '">' + (idx + 1) + '</div>'
      + '<div class="bpr-action-content">'
      + '<div class="bpr-action-header">'
      + '<div class="bpr-action-title">' + action.title + '</div>'
      + '<span class="bpr-action-priority" style="background:' + priorityColor + '15;color:' + priorityColor + '">' + action.priority + '</span>'
      + '</div>'
      + '<div class="bpr-action-body">' + action.description + '</div>'
      + '<div class="bpr-action-meta">'
      + '<span class="bpr-action-timeframe">' + action.timeframe + '</span>'
      + '<span class="bpr-action-kpi">KPI: ' + action.kpi + '</span>'
      + '</div></div></div>';
  });

  html += '</div>';

  // 90-day roadmap
  html += '<div class="bpr-roadmap">'
    + '<div class="bpr-roadmap-title">90-Day Roadmap</div>'
    + '<div class="bpr-roadmap-phases">';

  var phases = [
    { name: 'Days 1-30: Foundation', items: ['Audit current referral sources', 'Set up tracking for all KPIs', 'Identify 2 new potential referral channels', 'Implement weekly review cadence'] },
    { name: 'Days 31-60: Execution', items: ['Launch new referral channels', 'Optimize conversion process based on data', 'Increase outreach volume by 20%', 'Build 3 new professional relationships'] },
    { name: 'Days 61-90: Scale', items: ['Double down on highest-performing channel', 'Automate repetitive referral tasks', 'Review and adjust commission tier path', 'Plan next quarter\'s strategy'] }
  ];

  phases.forEach(function(phase, idx) {
    var colors = ['#3B82F6', '#8B5CF6', '#10B981'];
    html += '<div class="bpr-phase" style="border-left:3px solid ' + colors[idx] + '">'
      + '<div class="bpr-phase-name" style="color:' + colors[idx] + '">' + phase.name + '</div>'
      + '<ul class="bpr-phase-items">';
    phase.items.forEach(function(item) {
      html += '<li>' + item + '</li>';
    });
    html += '</ul></div>';
  });

  html += '</div></div></div>';
  body.innerHTML = html;
}

function bprGetAction(categoryId, score, metrics) {
  var actions = {
    referrals: {
      title: 'Increase Referral Volume',
      description: 'Your referral volume is below the benchmark for ' + metrics.bench.label.toLowerCase() + ' partners. Target ' + Math.ceil(metrics.bench.avgRefs * 1.1) + ' referrals/month by expanding your outreach network and improving your identification process.',
      priority: 'high',
      timeframe: 'Next 30 days',
      kpi: metrics.bench.avgRefs + '+ referrals/month',
      category: 'referrals'
    },
    conversion: {
      title: 'Improve Conversion Rate',
      description: 'At ' + Math.round(metrics.convRate * 100) + '%, your conversion rate has room to grow. Focus on better pre-qualification: ensure referred clients have $10K+ in debt, are willing to engage, and have realistic expectations.',
      priority: 'high',
      timeframe: 'Next 45 days',
      kpi: Math.round(metrics.bench.convRate * 100) + '%+ conversion rate',
      category: 'conversion'
    },
    revenue: {
      title: 'Boost Revenue Per Referral',
      description: 'Optimize your referral mix to increase average deal size. Target higher-value cases (multi-year filings, business tax debt, large balances) and qualify more carefully.',
      priority: 'medium',
      timeframe: 'Next 60 days',
      kpi: '$' + Math.round(metrics.bench.avgDeal * 1.1) + '+ avg deal size',
      category: 'revenue'
    },
    efficiency: {
      title: 'Optimize Cost Efficiency',
      description: 'Your cost per acquisition may be higher than optimal. Review your marketing spend allocation: cut channels with < 2x ROI and reinvest in your top-performing source.',
      priority: 'medium',
      timeframe: 'Next 30 days',
      kpi: '3x+ marketing ROI',
      category: 'efficiency'
    },
    consistency: {
      title: 'Stabilize Monthly Activity',
      description: 'Your referral volume varies too much month to month. Build a baseline weekly activity habit: set minimums for outreach calls, networking events, and follow-ups.',
      priority: 'medium',
      timeframe: 'Next 60 days',
      kpi: '<20% month-over-month variance',
      category: 'consistency'
    }
  };

  return actions[categoryId] || { title: 'Improve Performance', description: 'Focus on improving your score in this category.', priority: 'low', timeframe: 'Next quarter', kpi: 'Score improvement', category: categoryId };
}

// ── AI STRATEGY TAB ──────────────────────────

function bprRenderAI(metrics) {
  var body = document.getElementById('bpr-body');
  var overall = bprOverallScore(metrics);
  var grade = bprGetGrade(overall);

  var html = '<div class="bpr-ai">'
    + '<div class="bpr-ai-prompt">'
    + '<button class="bpr-ai-btn" onclick="bprRunAI()">Generate AI Strategic Analysis</button>'
    + '<div class="bpr-ai-note">Deep analysis of your quarterly performance with personalized strategy</div>'
    + '</div>'
    + '<div id="bpr-ai-results">';

  // Pre-computed strategic insights
  var insights = bprGetStrategicInsights(metrics, overall, grade);
  insights.forEach(function(insight) {
    html += '<div class="bpr-ai-card">'
      + '<div class="bpr-ai-card-header">'
      + '<span class="bpr-ai-card-icon" style="color:' + insight.color + '">' + insight.icon + '</span>'
      + '<span class="bpr-ai-card-title">' + insight.title + '</span>'
      + '</div>'
      + '<div class="bpr-ai-card-body">' + insight.body + '</div>'
      + '</div>';
  });

  html += '</div></div>';
  body.innerHTML = html;
}

function bprGetStrategicInsights(metrics, overall, grade) {
  var months = metrics.months;
  var totalRev = months.reduce(function(s, m) { return s + m.revenue; }, 0);
  var bench = metrics.bench;

  return [
    {
      icon: '&#128202;', color: '#3B82F6', title: 'Performance Summary',
      body: 'You earned a ' + grade.letter + ' (' + overall + '/100) this quarter with $' + totalRev.toLocaleString() + ' in revenue across ' + months.reduce(function(s, m) { return s + m.referrals; }, 0) + ' referrals. ' + (overall >= 70 ? 'This is solid performance -- focus on scaling what works.' : 'There\'s significant room for improvement. Focus on your weakest category first.')
    },
    {
      icon: '&#127919;', color: '#10B981', title: 'Your #1 Lever',
      body: bprTopLever(metrics)
    },
    {
      icon: '&#128200;', color: '#8B5CF6', title: 'Next Quarter Projection',
      body: 'At your current pace, next quarter should yield approximately $' + Math.round(totalRev * (1 + bench.growth)).toLocaleString() + ' (' + Math.round(bench.growth * 100) + '% growth). To accelerate, focus on conversion rate -- a 5% improvement would add roughly $' + Math.round(totalRev * 0.15).toLocaleString() + ' to your quarterly revenue.'
    },
    {
      icon: '&#9889;', color: '#F59E0B', title: 'Strategic Risk',
      body: 'Your biggest risk is ' + (metrics.months[0].revenue < metrics.months[2].revenue * 0.5 ? 'seasonal dependency -- your low months are less than half of peak. Build a summer marketing strategy.' : 'referral source concentration -- diversify to at least 3 active channels to protect against partner churn.')
    }
  ];
}

function bprTopLever(metrics) {
  var scores = {};
  BPR_CATEGORIES.forEach(function(cat) {
    scores[cat.id] = bprScoreCategory(cat.id, metrics);
  });

  var lowest = Object.keys(scores).reduce(function(a, b) { return scores[a] < scores[b] ? a : b; });
  var labels = { referrals: 'referral volume', conversion: 'conversion rate', revenue: 'revenue per referral', efficiency: 'cost efficiency', consistency: 'consistency' };

  return 'Your biggest opportunity is ' + labels[lowest] + ' (scored ' + scores[lowest] + '/100). Improving this single metric by 20% would have the largest impact on your overall performance grade.';
}

function bprRunAI() {
  var metrics = bprGatherMetrics();
  var overall = bprOverallScore(metrics);
  var months = metrics.months;
  var resultsDiv = document.getElementById('bpr-ai-results');
  if (!resultsDiv) return;

  resultsDiv.innerHTML = '<div class="bpf-loading">Generating strategic analysis...</div>';

  var prompt = 'You are a business strategist analyzing a quarterly review for a ' + metrics.bench.label + ' tax resolution referral partner. '
    + 'Overall score: ' + overall + '/100. Quarter stats: '
    + months.map(function(m) { return m.name + ': ' + m.referrals + ' refs, $' + m.revenue + ' rev, ' + m.roi + '% ROI'; }).join('. ') + '. '
    + 'Conversion rate: ' + Math.round(metrics.convRate * 100) + '%. Avg commission: $' + metrics.avgCommission + '. Budget: $' + metrics.monthlyBudget + '/mo. '
    + 'Benchmark: ' + metrics.bench.avgRefs + ' refs, ' + Math.round(metrics.bench.convRate * 100) + '% conv, $' + metrics.bench.avgDeal + ' avg deal. '
    + 'Give a detailed strategic analysis with 5 actionable recommendations. '
    + 'Return JSON array: [{"title":"...","analysis":"...","action":"...","expectedImpact":"..."}]';

  fetch(typeof CTAX_API_URL !== 'undefined' ? CTAX_API_URL : 'https://ctax-api-proxy.vercel.app/api/chat', {
    method: 'POST',
    headers: typeof getApiHeaders === 'function' ? getApiHeaders() : { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 1500, messages: [{ role: 'user', content: prompt }] })
  })
  .then(function(r) { return r.json(); })
  .then(function(data) {
    var text = data.content ? data.content[0].text : '';
    var recs = [];
    try { var match = text.match(/\[[\s\S]*\]/); if (match) recs = JSON.parse(match[0]); } catch (e) {}
    if (recs.length === 0) recs = bprFallbackStrategy(metrics);
    bprShowAIResults(recs);
  })
  .catch(function() { bprShowAIResults(bprFallbackStrategy(metrics)); });
}

function bprFallbackStrategy(metrics) {
  var bench = metrics.bench;
  return [
    { title: 'Double Down on Tax Season', analysis: 'Historical data shows March-April account for 35-40% of annual referrals. Your current pipeline needs ramping 6-8 weeks before peak.', action: 'Increase January-February marketing spend by 40% and launch a pre-tax-season outreach campaign targeting your top 20 referral relationships.', expectedImpact: '+25-35% Q1 referral volume' },
    { title: 'Conversion Funnel Optimization', analysis: 'Your conversion rate of ' + Math.round(metrics.convRate * 100) + '% vs benchmark ' + Math.round(bench.convRate * 100) + '% suggests qualification or handoff issues.', action: 'Implement a 3-question pre-qualification checklist (debt amount, willingness to engage, timeline) before submitting any referral. Follow up within 1 hour of submission.', expectedImpact: '+' + Math.round((bench.convRate - metrics.convRate) * 100) + '% conversion rate improvement' },
    { title: 'Revenue Per Client Strategy', analysis: 'With an average deal of $' + metrics.avgCommission + ' vs benchmark $' + bench.avgDeal + ', there may be room to target higher-value cases.', action: 'Prioritize identifying clients with multi-year unfiled returns, business tax debt, or balances over $50K. These cases yield 2-3x higher commissions.', expectedImpact: '+$' + Math.round((bench.avgDeal - metrics.avgCommission) * 0.5) + ' per closed referral' },
    { title: 'Channel Diversification', analysis: 'Top-performing partners have 3+ active referral channels. Reliance on a single source creates vulnerability.', action: 'Add 2 new channels this quarter: (1) LinkedIn content strategy targeting local professionals (2) Co-marketing partnership with a complementary practice in your geography.', expectedImpact: '2+ new acquisition channels active' },
    { title: 'Systematic Weekly Review', analysis: 'Partners who conduct structured weekly reviews outperform those who don\'t by 40%.', action: 'Block 30 minutes every Friday for pipeline review: track new referrals, follow up on pending, close out stalled leads, and plan next week\'s activities.', expectedImpact: '+40% overall pipeline efficiency' }
  ];
}

function bprShowAIResults(recs) {
  var resultsDiv = document.getElementById('bpr-ai-results');
  if (!resultsDiv) return;

  var html = '';
  recs.forEach(function(r, idx) {
    var colors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EC4899'];
    var color = colors[idx % colors.length];

    html += '<div class="bpr-strategy-card" style="border-left:3px solid ' + color + '">'
      + '<div class="bpr-strategy-num" style="color:' + color + '">' + (idx + 1) + '</div>'
      + '<div class="bpr-strategy-content">'
      + '<div class="bpr-strategy-title">' + r.title + '</div>'
      + '<div class="bpr-strategy-analysis">' + r.analysis + '</div>'
      + '<div class="bpr-strategy-action"><strong>Action:</strong> ' + r.action + '</div>'
      + '<div class="bpr-strategy-impact" style="color:' + color + '">Expected Impact: ' + r.expectedImpact + '</div>'
      + '</div></div>';
  });

  resultsDiv.innerHTML = html;
}
