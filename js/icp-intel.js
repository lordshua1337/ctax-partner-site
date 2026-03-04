// ══════════════════════════════════════════
//  M3P3C3: ICP COMPETITIVE INTELLIGENCE
//  Market positioning, territory analysis,
//  competitor landscape, pricing benchmarks,
//  and AI-powered growth opportunities
// ══════════════════════════════════════════

var ICI_CACHE_KEY = 'ctax_icp_intel';

// ── MAIN MODAL ──────────────────────────────────────

function iciShowIntel() {
  var existing = document.getElementById('ici-overlay');
  if (existing) existing.remove();

  var overlay = document.createElement('div');
  overlay.id = 'ici-overlay';
  overlay.className = 'ici-overlay';
  overlay.innerHTML = '<div class="ici-modal">' +
    '<div class="ici-header">' +
      '<h2 class="ici-title">Competitive Intelligence</h2>' +
      '<p class="ici-subtitle">Market positioning, territory analysis, and growth opportunities based on your ICP</p>' +
      '<button class="ici-close" onclick="iciClose()">&times;</button>' +
    '</div>' +
    '<div class="ici-tabs">' +
      '<button class="ici-tab ici-tab-active" onclick="iciSwitchTab(this,\'market\')">Market Position</button>' +
      '<button class="ici-tab" onclick="iciSwitchTab(this,\'territory\')">Territory Map</button>' +
      '<button class="ici-tab" onclick="iciSwitchTab(this,\'competitors\')">Competitors</button>' +
      '<button class="ici-tab" onclick="iciSwitchTab(this,\'pricing\')">Pricing</button>' +
      '<button class="ici-tab" onclick="iciSwitchTab(this,\'opportunities\')">Opportunities</button>' +
    '</div>' +
    '<div class="ici-body" id="ici-body"></div>' +
  '</div>';

  document.body.appendChild(overlay);
  requestAnimationFrame(function() { overlay.classList.add('ici-visible'); });
  iciRenderMarket();
}

function iciClose() {
  var overlay = document.getElementById('ici-overlay');
  if (overlay) {
    overlay.classList.remove('ici-visible');
    setTimeout(function() { overlay.remove(); }, 250);
  }
}

function iciSwitchTab(btn, tab) {
  document.querySelectorAll('.ici-tab').forEach(function(t) { t.classList.remove('ici-tab-active'); });
  btn.classList.add('ici-tab-active');
  if (tab === 'market') iciRenderMarket();
  else if (tab === 'territory') iciRenderTerritory();
  else if (tab === 'competitors') iciRenderCompetitors();
  else if (tab === 'pricing') iciRenderPricing();
  else if (tab === 'opportunities') iciRenderOpportunities();
}

// ── DATA HELPERS ──────────────────────────────────

function iciGetProfile() {
  try {
    var raw = localStorage.getItem('ctax_icp_profile');
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}

function iciGetReferrals() {
  try { return JSON.parse(localStorage.getItem('ctax_icp_referrals')) || []; }
  catch (e) { return []; }
}

function iciGetBusinessInputs() {
  try {
    var raw = localStorage.getItem('bp_saved_inputs');
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}

// ── MARKET POSITION TAB ──────────────────────────

function iciRenderMarket() {
  var body = document.getElementById('ici-body');
  if (!body) return;

  var profile = iciGetProfile();
  var refs = iciGetReferrals();
  var inputs = iciGetBusinessInputs();

  var profType = (profile && profile.profession_type) || (inputs && inputs.practiceType) || 'Financial Professional';
  var geo = (profile && profile.answers && profile.answers.q5) || (inputs && inputs.geography) || 'United States';

  var html = '';

  // Market Overview Card
  html += '<div class="ici-card ici-card-featured">';
  html += '<div class="ici-card-title">Your Market Position</div>';
  html += '<div class="ici-market-grid">';

  // Position quadrant
  html += '<div class="ici-quadrant">';
  html += '<div class="ici-quad-title">Positioning Matrix</div>';
  html += '<div class="ici-quad-chart">';
  html += '<div class="ici-quad-y">Specialization</div>';
  html += '<div class="ici-quad-x">Market Reach</div>';
  html += '<div class="ici-quad-cell ici-q-tl"><span>Niche Expert</span><span class="ici-q-desc">High specialization, limited reach</span></div>';
  html += '<div class="ici-quad-cell ici-q-tr"><span>Market Leader</span><span class="ici-q-desc">High specialization, wide reach</span></div>';
  html += '<div class="ici-quad-cell ici-q-bl"><span>Generalist</span><span class="ici-q-desc">Low specialization, limited reach</span></div>';
  html += '<div class="ici-quad-cell ici-q-br"><span>Volume Player</span><span class="ici-q-desc">Low specialization, wide reach</span></div>';

  // Position dot based on referral data
  var specialization = refs.length > 0 ? Math.min((refs.filter(function(r) { return r.fit_score === 'HIGH'; }).length / refs.length) * 100, 90) : 40;
  var reach = Math.min(refs.length * 8, 85);
  html += '<div class="ici-quad-dot" style="left:' + reach + '%;bottom:' + specialization + '%" title="Your Position"></div>';
  html += '</div></div>';

  // Market stats
  html += '<div class="ici-market-stats">';
  html += iciMarketStat('Your Profession', iciEsc(profType), '#0B5FD8');
  html += iciMarketStat('Territory', iciEsc(geo), '#7C3AED');
  html += iciMarketStat('Market Size (Est.)', iciEstimateMarketSize(profType, geo), '#059669');
  html += iciMarketStat('Avg. Case Value', '$8,400', '#F59E0B');
  html += iciMarketStat('Partner Saturation', iciEstimateSaturation(profType), '#EF4444');
  html += iciMarketStat('Growth Potential', iciEstimateGrowth(refs), '#0B5FD8');
  html += '</div>';

  html += '</div></div>';

  // Industry benchmarks
  html += '<div class="ici-card">';
  html += '<div class="ici-card-title">Industry Benchmarks</div>';
  html += '<div class="ici-bench-grid">';

  var benchmarks = [
    { label: 'Avg. Referrals/Month (Your Type)', value: iciGetBenchmark(profType, 'refs_month'), yours: refs.length > 0 ? Math.round(refs.length / 3) : 0 },
    { label: 'Avg. Conversion Rate', value: iciGetBenchmark(profType, 'conv_rate'), yours: refs.length > 0 ? Math.round((refs.filter(function(r) { return r.status === 'converted'; }).length / refs.length) * 100) : 0, suffix: '%' },
    { label: 'Avg. Monthly Commission', value: iciGetBenchmark(profType, 'monthly_comm'), yours: refs.filter(function(r) { return r.status === 'converted'; }).length * 167, prefix: '$' },
    { label: 'Time to First Referral', value: iciGetBenchmark(profType, 'time_first'), yours: refs.length > 0 ? 'Done' : 'Pending' }
  ];

  for (var b = 0; b < benchmarks.length; b++) {
    var bm = benchmarks[b];
    var yourVal = (bm.prefix || '') + bm.yours + (bm.suffix || '');
    html += '<div class="ici-bench-item">' +
      '<div class="ici-bench-label">' + bm.label + '</div>' +
      '<div class="ici-bench-vals">' +
        '<div class="ici-bench-avg"><span class="ici-bench-tag">Avg</span> ' + (bm.prefix || '') + bm.value + (bm.suffix || '') + '</div>' +
        '<div class="ici-bench-you"><span class="ici-bench-tag ici-bench-tag-you">You</span> ' + yourVal + '</div>' +
      '</div>' +
    '</div>';
  }
  html += '</div></div>';

  // AI Analysis button
  html += '<div class="ici-ai-section">';
  html += '<button class="ici-btn ici-btn-primary" onclick="iciAiMarketAnalysis()">Generate AI Market Analysis</button>';
  html += '<div id="ici-ai-result"></div>';
  html += '</div>';

  body.innerHTML = html;
}

function iciMarketStat(label, value, color) {
  return '<div class="ici-mstat">' +
    '<div class="ici-mstat-value" style="color:' + color + '">' + value + '</div>' +
    '<div class="ici-mstat-label">' + label + '</div>' +
  '</div>';
}

function iciEstimateMarketSize(profType, geo) {
  var sizes = { 'CPA': '~2,800', 'Attorney': '~1,200', 'Financial Advisor': '~3,500', 'Mortgage': '~800', 'Insurance': '~1,500' };
  var key = Object.keys(sizes).find(function(k) { return profType.toLowerCase().indexOf(k.toLowerCase()) !== -1; });
  return (key ? sizes[key] : '~2,000') + ' firms';
}

function iciEstimateSaturation(profType) {
  var sat = { 'CPA': 'Low (8%)', 'Attorney': 'Very Low (3%)', 'Financial Advisor': 'Low (5%)', 'Mortgage': 'Medium (12%)', 'Insurance': 'Very Low (2%)' };
  var key = Object.keys(sat).find(function(k) { return profType.toLowerCase().indexOf(k.toLowerCase()) !== -1; });
  return key ? sat[key] : 'Low (6%)';
}

function iciEstimateGrowth(refs) {
  if (refs.length >= 10) return 'High';
  if (refs.length >= 5) return 'Medium-High';
  if (refs.length >= 1) return 'Medium';
  return 'Untapped';
}

function iciGetBenchmark(profType, metric) {
  var benchmarks = {
    'CPA': { refs_month: 4, conv_rate: 42, monthly_comm: 2000, time_first: '2 weeks' },
    'Attorney': { refs_month: 2, conv_rate: 55, monthly_comm: 1100, time_first: '3 weeks' },
    'Financial Advisor': { refs_month: 3, conv_rate: 38, monthly_comm: 1500, time_first: '2 weeks' },
    'Mortgage': { refs_month: 3, conv_rate: 45, monthly_comm: 1350, time_first: '1 week' },
    'Insurance': { refs_month: 2, conv_rate: 30, monthly_comm: 600, time_first: '4 weeks' }
  };
  var key = Object.keys(benchmarks).find(function(k) { return profType.toLowerCase().indexOf(k.toLowerCase()) !== -1; });
  var data = key ? benchmarks[key] : benchmarks['CPA'];
  return data[metric] || 'N/A';
}

// ── TERRITORY MAP TAB ──────────────────────────────

function iciRenderTerritory() {
  var body = document.getElementById('ici-body');
  if (!body) return;

  var profile = iciGetProfile();
  var inputs = iciGetBusinessInputs();
  var geo = (profile && profile.answers && profile.answers.q5) || (inputs && inputs.geography) || '';

  var html = '';

  html += '<div class="ici-card">';
  html += '<div class="ici-card-title">Territory Analysis</div>';

  if (!geo) {
    html += '<div class="ici-empty"><p>Build your ICP profile first to see territory-specific data.</p></div>';
  } else {
    html += '<div class="ici-territory-info">';
    html += '<div class="ici-terr-primary">';
    html += '<div class="ici-terr-label">Primary Territory</div>';
    html += '<div class="ici-terr-value">' + iciEsc(geo) + '</div>';
    html += '</div>';

    // Territory metrics
    var metrics = iciGetTerritoryMetrics(geo);
    html += '<div class="ici-terr-metrics">';
    for (var i = 0; i < metrics.length; i++) {
      var m = metrics[i];
      html += '<div class="ici-terr-metric">' +
        '<div class="ici-terr-mval">' + m.value + '</div>' +
        '<div class="ici-terr-mlabel">' + m.label + '</div>' +
      '</div>';
    }
    html += '</div>';
    html += '</div>';

    // Tax debt heat indicators by state/region
    html += '<div class="ici-terr-heat">';
    html += '<div class="ici-card-title" style="margin-top:16px">Tax Debt Density by Region</div>';
    var regions = [
      { name: 'Northeast', density: 'High', avg_debt: '$32,000', pct: 85 },
      { name: 'Southeast', density: 'High', avg_debt: '$28,500', pct: 78 },
      { name: 'Midwest', density: 'Medium', avg_debt: '$24,000', pct: 60 },
      { name: 'Southwest', density: 'Medium-High', avg_debt: '$27,000', pct: 70 },
      { name: 'West Coast', density: 'Very High', avg_debt: '$38,000', pct: 92 },
      { name: 'Mountain', density: 'Low-Medium', avg_debt: '$21,000', pct: 45 }
    ];

    for (var r = 0; r < regions.length; r++) {
      var region = regions[r];
      html += '<div class="ici-heat-row">' +
        '<span class="ici-heat-name">' + region.name + '</span>' +
        '<div class="ici-heat-bar"><div class="ici-heat-fill" style="width:' + region.pct + '%;background:' + (region.pct >= 80 ? '#EF4444' : region.pct >= 60 ? '#F59E0B' : '#059669') + '"></div></div>' +
        '<span class="ici-heat-density">' + region.density + '</span>' +
        '<span class="ici-heat-avg">' + region.avg_debt + '</span>' +
      '</div>';
    }
    html += '</div>';
  }
  html += '</div>';

  // Seasonal timing
  html += '<div class="ici-card">';
  html += '<div class="ici-card-title">Seasonal Opportunity Calendar</div>';
  html += '<div class="ici-season-grid">';
  var months = [
    { name: 'Jan', level: 'high', note: 'New Year resolutions, W-2 season starts' },
    { name: 'Feb', level: 'high', note: 'Tax prep reveals past-due situations' },
    { name: 'Mar', level: 'very-high', note: 'Filing deadline pressure mounts' },
    { name: 'Apr', level: 'very-high', note: 'Extension deadlines, panic referrals' },
    { name: 'May', level: 'medium', note: 'Post-filing review, OIC applications' },
    { name: 'Jun', level: 'medium', note: 'Q2 estimated payments reveal issues' },
    { name: 'Jul', level: 'low', note: 'Summer slowdown, plan for fall' },
    { name: 'Aug', level: 'low', note: 'Back-to-school budgeting reveals debts' },
    { name: 'Sep', level: 'medium', note: 'Q3 estimated payments, extension filers' },
    { name: 'Oct', level: 'high', note: 'Extension deadline (Oct 15), year-end planning' },
    { name: 'Nov', level: 'medium', note: 'Year-end tax planning appointments' },
    { name: 'Dec', level: 'medium', note: 'Holiday financial stress, new year prep' }
  ];

  for (var mo = 0; mo < months.length; mo++) {
    var month = months[mo];
    html += '<div class="ici-month-card ici-month-' + month.level + '">' +
      '<div class="ici-month-name">' + month.name + '</div>' +
      '<div class="ici-month-level">' + month.level.replace('-', ' ') + '</div>' +
      '<div class="ici-month-note">' + month.note + '</div>' +
    '</div>';
  }
  html += '</div></div>';

  body.innerHTML = html;
}

function iciGetTerritoryMetrics(geo) {
  return [
    { label: 'Est. Tax Debtors', value: '~18,000' },
    { label: 'Avg. IRS Debt', value: '$29,400' },
    { label: 'Active Partners', value: '~12' },
    { label: 'Coverage Gap', value: '88%' },
    { label: 'Avg. Case Value', value: '$8,400' },
    { label: 'Annual Opportunity', value: '$2.1M' }
  ];
}

// ── COMPETITORS TAB ───────────────────────────────

function iciRenderCompetitors() {
  var body = document.getElementById('ici-body');
  if (!body) return;

  var profile = iciGetProfile();
  var profType = (profile && profile.profession_type) || 'Financial Professional';

  var html = '';

  html += '<div class="ici-card">';
  html += '<div class="ici-card-title">Competitive Landscape</div>';
  html += '<p class="ici-card-desc">How tax resolution referral programs compare. Data is industry-wide averages.</p>';

  var competitors = [
    { name: 'Community Tax (You)', investigation: '$295', avg_savings: '$8,400', partner_fee: '$500+', cases: '10,000+', rating: '4.8', highlight: true },
    { name: 'Industry Average', investigation: '$500-1,000', avg_savings: '$5,200', partner_fee: '$200-400', cases: 'Varies', rating: '3.2' },
    { name: 'National Tax Firms', investigation: '$750+', avg_savings: '$6,100', partner_fee: '$300-500', cases: '5,000+', rating: '3.5' },
    { name: 'Local Tax Attorneys', investigation: '$1,500+', avg_savings: '$7,800', partner_fee: 'Case by case', cases: '<500', rating: '4.0' },
    { name: 'DIY Tax Software', investigation: '$0-50', avg_savings: '$1,200', partner_fee: 'None', cases: 'N/A', rating: '2.8' }
  ];

  html += '<div class="ici-comp-table">';
  html += '<div class="ici-comp-header">' +
    '<span>Provider</span>' +
    '<span>Investigation</span>' +
    '<span>Avg. Savings</span>' +
    '<span>Partner Fee</span>' +
    '<span>Rating</span>' +
  '</div>';

  for (var c = 0; c < competitors.length; c++) {
    var comp = competitors[c];
    html += '<div class="ici-comp-row' + (comp.highlight ? ' ici-comp-highlight' : '') + '">' +
      '<span class="ici-comp-name">' + comp.name + '</span>' +
      '<span>' + comp.investigation + '</span>' +
      '<span>' + comp.avg_savings + '</span>' +
      '<span>' + comp.partner_fee + '</span>' +
      '<span>' + comp.rating + '</span>' +
    '</div>';
  }
  html += '</div></div>';

  // Differentiation points
  html += '<div class="ici-card">';
  html += '<div class="ici-card-title">Your Competitive Advantages</div>';
  var advantages = [
    { title: 'Lowest Investigation Fee', desc: 'At $295, Community Tax has the lowest barrier to entry. Most competitors charge $500-1,500.', strength: 95 },
    { title: 'Highest Partner Compensation', desc: '$500+ per referral puts you at the top of the industry. Competitors average $200-400.', strength: 90 },
    { title: 'Proven Track Record', desc: '10,000+ cases resolved with 4.8-star reviews. Most competitors have fewer than 5,000 cases.', strength: 88 },
    { title: 'Full-Service Resolution', desc: 'OIC, IA, CNC, penalty abatement, lien/levy release -- all under one roof.', strength: 85 },
    { title: 'Partner Support Infrastructure', desc: 'Portal, AI tools, marketing materials, training -- most programs offer none of this.', strength: 92 }
  ];

  for (var a = 0; a < advantages.length; a++) {
    var adv = advantages[a];
    html += '<div class="ici-adv-item">' +
      '<div class="ici-adv-header">' +
        '<span class="ici-adv-title">' + adv.title + '</span>' +
        '<span class="ici-adv-strength">' + adv.strength + '%</span>' +
      '</div>' +
      '<div class="ici-adv-bar"><div class="ici-adv-fill" style="width:' + adv.strength + '%"></div></div>' +
      '<div class="ici-adv-desc">' + adv.desc + '</div>' +
    '</div>';
  }
  html += '</div>';

  // Objection counterpoints
  html += '<div class="ici-card">';
  html += '<div class="ici-card-title">Competitor Objection Counters</div>';
  var objections = [
    { obj: '"I already know a tax attorney"', counter: 'Tax attorneys charge $1,500+ just to review a case. Our $295 investigation gives your client the same analysis at 80% less cost, plus we handle the full resolution.' },
    { obj: '"My client tried tax relief before and it did not work"', counter: 'Most tax relief companies are marketing firms, not resolution experts. Community Tax has enrolled agents and tax attorneys with 10,000+ resolved cases and a BBB A+ rating.' },
    { obj: '"Is this one of those tax scam companies?"', counter: 'Community Tax is BBB A+ accredited with 4.8-star reviews. We have been in business for over 10 years and are a licensed tax resolution firm, not a marketing company.' },
    { obj: '"The IRS offers free payment plans, why pay?"', counter: 'The IRS does offer installment agreements, but most taxpayers do not know they may qualify for Offer in Compromise (settling for less), penalty abatement, or Currently Not Collectible status. Our team identifies the best option.' }
  ];

  for (var o = 0; o < objections.length; o++) {
    var obj = objections[o];
    html += '<div class="ici-obj-item">' +
      '<div class="ici-obj-q">' + obj.obj + '</div>' +
      '<div class="ici-obj-a">' + obj.counter + '</div>' +
    '</div>';
  }
  html += '</div>';

  body.innerHTML = html;
}

// ── PRICING TAB ──────────────────────────────────

function iciRenderPricing() {
  var body = document.getElementById('ici-body');
  if (!body) return;

  var refs = iciGetReferrals();
  var converted = refs.filter(function(r) { return r.status === 'converted'; }).length;

  var html = '';

  // Revenue calculator
  html += '<div class="ici-card ici-card-featured">';
  html += '<div class="ici-card-title">Revenue Projection Calculator</div>';
  html += '<div class="ici-calc-grid">';

  html += '<div class="ici-calc-input">';
  html += '<label class="ici-calc-label">Monthly Referrals</label>';
  html += '<input type="range" id="ici-calc-refs" class="ici-slider" min="1" max="20" value="5" oninput="iciUpdateCalc()">';
  html += '<span id="ici-calc-refs-val" class="ici-calc-val">5</span>';
  html += '</div>';

  html += '<div class="ici-calc-input">';
  html += '<label class="ici-calc-label">Conversion Rate</label>';
  html += '<input type="range" id="ici-calc-conv" class="ici-slider" min="10" max="80" value="40" oninput="iciUpdateCalc()">';
  html += '<span id="ici-calc-conv-val" class="ici-calc-val">40%</span>';
  html += '</div>';

  html += '<div class="ici-calc-input">';
  html += '<label class="ici-calc-label">Commission per Referral</label>';
  html += '<input type="range" id="ici-calc-comm" class="ici-slider" min="300" max="1000" value="500" step="50" oninput="iciUpdateCalc()">';
  html += '<span id="ici-calc-comm-val" class="ici-calc-val">$500</span>';
  html += '</div>';

  html += '</div>';

  html += '<div class="ici-calc-results" id="ici-calc-results">';
  html += iciCalcResults(5, 40, 500);
  html += '</div>';
  html += '</div>';

  // Commission tiers
  html += '<div class="ici-card">';
  html += '<div class="ici-card-title">Commission Structure</div>';

  var tiers = [
    { tier: 'Bronze', refs: '1-3/month', comm: '$500/referral', annual: '$6,000-$18,000', color: '#CD7F32' },
    { tier: 'Silver', refs: '4-7/month', comm: '$600/referral', annual: '$28,800-$50,400', color: '#C0C0C0' },
    { tier: 'Gold', refs: '8-12/month', comm: '$750/referral', annual: '$72,000-$108,000', color: '#FFD700' },
    { tier: 'Platinum', refs: '13+/month', comm: '$1,000/referral', annual: '$156,000+', color: '#E5E4E2' }
  ];

  html += '<div class="ici-tier-grid">';
  for (var t = 0; t < tiers.length; t++) {
    var tier = tiers[t];
    html += '<div class="ici-tier-card" style="border-top:3px solid ' + tier.color + '">' +
      '<div class="ici-tier-name" style="color:' + tier.color + '">' + tier.tier + '</div>' +
      '<div class="ici-tier-refs">' + tier.refs + '</div>' +
      '<div class="ici-tier-comm">' + tier.comm + '</div>' +
      '<div class="ici-tier-annual">' + tier.annual + '/yr</div>' +
    '</div>';
  }
  html += '</div></div>';

  // Current performance
  html += '<div class="ici-card">';
  html += '<div class="ici-card-title">Your Performance</div>';
  var monthlyRefs = refs.length > 0 ? Math.ceil(refs.length / 3) : 0;
  var monthlyComm = converted * 500;
  var projectedAnnual = monthlyComm * 12;

  html += '<div class="ici-perf-grid">';
  html += '<div class="ici-perf-stat"><div class="ici-perf-val">' + refs.length + '</div><div class="ici-perf-label">Total Referrals</div></div>';
  html += '<div class="ici-perf-stat"><div class="ici-perf-val">' + converted + '</div><div class="ici-perf-label">Converted</div></div>';
  html += '<div class="ici-perf-stat"><div class="ici-perf-val">$' + monthlyComm.toLocaleString() + '</div><div class="ici-perf-label">Est. Earned</div></div>';
  html += '<div class="ici-perf-stat"><div class="ici-perf-val">$' + projectedAnnual.toLocaleString() + '</div><div class="ici-perf-label">Projected Annual</div></div>';
  html += '</div></div>';

  body.innerHTML = html;
}

function iciUpdateCalc() {
  var refs = parseInt(document.getElementById('ici-calc-refs').value);
  var conv = parseInt(document.getElementById('ici-calc-conv').value);
  var comm = parseInt(document.getElementById('ici-calc-comm').value);

  document.getElementById('ici-calc-refs-val').textContent = refs;
  document.getElementById('ici-calc-conv-val').textContent = conv + '%';
  document.getElementById('ici-calc-comm-val').textContent = '$' + comm;

  var results = document.getElementById('ici-calc-results');
  if (results) results.innerHTML = iciCalcResults(refs, conv, comm);
}

function iciCalcResults(refs, conv, comm) {
  var monthly = Math.round(refs * (conv / 100));
  var monthlyRev = monthly * comm;
  var annual = monthlyRev * 12;

  return '<div class="ici-calc-row">' +
    '<div class="ici-calc-stat"><div class="ici-calc-stat-val">' + monthly + '</div><div class="ici-calc-stat-label">Conversions/Month</div></div>' +
    '<div class="ici-calc-stat"><div class="ici-calc-stat-val">$' + monthlyRev.toLocaleString() + '</div><div class="ici-calc-stat-label">Monthly Revenue</div></div>' +
    '<div class="ici-calc-stat"><div class="ici-calc-stat-val" style="color:#059669;font-size:28px">$' + annual.toLocaleString() + '</div><div class="ici-calc-stat-label">Annual Revenue</div></div>' +
  '</div>';
}

// ── OPPORTUNITIES TAB ─────────────────────────────

function iciRenderOpportunities() {
  var body = document.getElementById('ici-body');
  if (!body) return;

  var profile = iciGetProfile();
  var refs = iciGetReferrals();
  var inputs = iciGetBusinessInputs();

  var html = '';

  // Growth opportunities
  var opportunities = iciGenerateOpportunities(profile, refs, inputs);

  html += '<div class="ici-card">';
  html += '<div class="ici-card-title">Growth Opportunities (' + opportunities.length + ')</div>';

  for (var i = 0; i < opportunities.length; i++) {
    var opp = opportunities[i];
    html += '<div class="ici-opp-card">' +
      '<div class="ici-opp-header">' +
        '<div class="ici-opp-priority ici-opp-' + opp.priority + '">' + opp.priority + '</div>' +
        '<div class="ici-opp-title">' + opp.title + '</div>' +
        '<div class="ici-opp-impact">+$' + opp.impact.toLocaleString() + '/yr</div>' +
      '</div>' +
      '<div class="ici-opp-desc">' + opp.desc + '</div>' +
      '<div class="ici-opp-steps">';

    for (var s = 0; s < opp.steps.length; s++) {
      html += '<div class="ici-opp-step">' + (s + 1) + '. ' + opp.steps[s] + '</div>';
    }
    html += '</div></div>';
  }
  html += '</div>';

  // AI deep dive
  html += '<div class="ici-ai-section">';
  html += '<button class="ici-btn ici-btn-primary" onclick="iciAiOpportunityAnalysis()">Generate AI Growth Strategy</button>';
  html += '<div id="ici-ai-opp-result"></div>';
  html += '</div>';

  body.innerHTML = html;
}

function iciGenerateOpportunities(profile, refs, inputs) {
  var opps = [];
  var profType = (profile && profile.profession_type) || '';
  var converted = refs.filter(function(r) { return r.status === 'converted'; }).length;

  // Always-applicable opportunities
  opps.push({
    title: 'Expand to Adjacent Professionals',
    desc: 'Partner with complementary professionals who see the same clients. Cross-referrals multiply your pipeline without additional marketing spend.',
    priority: 'high',
    impact: 12000,
    steps: ['Identify 3-5 professionals in complementary fields', 'Offer a co-referral arrangement (mutual introductions)', 'Create shared marketing materials', 'Set monthly check-in to review shared pipeline']
  });

  if (refs.length < 5) {
    opps.push({
      title: 'Client Base Audit',
      desc: 'Review your existing client list systematically. Statistically, 15-20% of financial service clients have some form of IRS issue.',
      priority: 'high',
      impact: 18000,
      steps: ['Export your client list (last 2 years)', 'Flag clients with known income changes, divorces, or business transitions', 'Schedule "financial wellness check" calls with flagged clients', 'Track conversion rate from this audit']
    });
  }

  if (converted < 3) {
    opps.push({
      title: 'Improve Qualification Process',
      desc: 'Better screening leads to higher conversion rates. Focus on debt amount, urgency, and willingness to engage.',
      priority: 'high',
      impact: 8000,
      steps: ['Use the Client Qualifier tool before every referral', 'Only refer clients with debt above $10,000', 'Confirm the client is aware of and interested in resolution', 'Warm-transfer clients instead of cold referrals']
    });
  }

  opps.push({
    title: 'Content Marketing Pipeline',
    desc: 'Create educational content that attracts potential referral sources. Position yourself as the go-to expert for tax resolution partnerships.',
    priority: 'medium',
    impact: 15000,
    steps: ['Write 1 LinkedIn article per month about tax resolution', 'Host a quarterly webinar for local professionals', 'Create a simple landing page explaining your referral program', 'Follow up with webinar attendees within 48 hours']
  });

  opps.push({
    title: 'Seasonal Campaign Blitz',
    desc: 'January through April is peak tax season. A focused campaign during this window can generate 40-60% of annual referrals.',
    priority: 'medium',
    impact: 10000,
    steps: ['Prepare marketing materials by December', 'Launch email drip to client base in January', 'Schedule outreach calls during peak weeks (Feb-Mar)', 'Follow up with all prospects before April 15']
  });

  opps.push({
    title: 'Referral Fee Upgrade Path',
    desc: 'Increasing referral volume unlocks higher commission tiers. Moving from Bronze ($500) to Silver ($600) on 5 monthly referrals adds $6,000/year.',
    priority: 'medium',
    impact: 6000,
    steps: ['Track current monthly referral volume', 'Identify bottlenecks in your pipeline', 'Set a 90-day goal to increase by 2 referrals/month', 'Review progress weekly using the ICP Performance Tracker']
  });

  // Sort by impact descending
  opps.sort(function(a, b) { return b.impact - a.impact; });
  return opps;
}

// ── AI ANALYSIS ──────────────────────────────────

async function iciAiMarketAnalysis() {
  var resultEl = document.getElementById('ici-ai-result');
  if (!resultEl) return;

  resultEl.innerHTML = '<div class="ici-ai-loading"><div class="ici-spinner"></div><p>Analyzing your market position...</p></div>';

  var profile = iciGetProfile();
  var refs = iciGetReferrals();
  var apiAvailable = typeof CTAX_API_URL !== 'undefined' && typeof getApiHeaders === 'function';

  if (!apiAvailable) {
    resultEl.innerHTML = '<div class="ici-ai-text">AI analysis requires API access. Please check your connection.</div>';
    return;
  }

  var profType = (profile && profile.profession_type) || 'Financial Professional';
  var geo = (profile && profile.answers && profile.answers.q5) || 'United States';

  try {
    var resp = await fetch(CTAX_API_URL, {
      method: 'POST',
      headers: getApiHeaders(),
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [{ role: 'user', content: 'You are a market analyst for Community Tax referral partners. Provide a concise market analysis for a ' + profType + ' in ' + geo + ' who has logged ' + refs.length + ' referrals. Include: 1) Market opportunity size, 2) Key competitive advantages, 3) Top 3 growth strategies, 4) Seasonal timing recommendations, 5) Revenue projection for next 12 months. Be specific with numbers and actionable advice.' }]
      })
    });
    var data = await resp.json();
    if (data.content && data.content[0]) {
      resultEl.innerHTML = '<div class="ici-ai-text" style="margin-top:16px">' + iciFormatText(data.content[0].text) + '</div>';
    }
  } catch (e) {
    resultEl.innerHTML = '<div class="ici-ai-text">Analysis failed. Try again later.</div>';
  }
}

async function iciAiOpportunityAnalysis() {
  var resultEl = document.getElementById('ici-ai-opp-result');
  if (!resultEl) return;

  resultEl.innerHTML = '<div class="ici-ai-loading"><div class="ici-spinner"></div><p>Generating growth strategy...</p></div>';

  var profile = iciGetProfile();
  var refs = iciGetReferrals();
  var apiAvailable = typeof CTAX_API_URL !== 'undefined' && typeof getApiHeaders === 'function';

  if (!apiAvailable) {
    resultEl.innerHTML = '<div class="ici-ai-text">AI analysis requires API access.</div>';
    return;
  }

  try {
    var profType = (profile && profile.profession_type) || 'Financial Professional';
    var converted = refs.filter(function(r) { return r.status === 'converted'; }).length;
    var sources = {};
    refs.forEach(function(r) { sources[r.source_type || 'unknown'] = (sources[r.source_type || 'unknown'] || 0) + 1; });

    var resp = await fetch(CTAX_API_URL, {
      method: 'POST',
      headers: getApiHeaders(),
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [{ role: 'user', content: 'You are a growth strategist for tax resolution referral partners. Create a 90-day growth plan for a ' + profType + ' with ' + refs.length + ' referrals (' + converted + ' converted). Source breakdown: ' + JSON.stringify(sources) + '. Include: 1) Month 1 quick wins, 2) Month 2 scaling actions, 3) Month 3 optimization, 4) Revenue targets for each month, 5) Key metrics to track. Be specific and actionable.' }]
      })
    });
    var data = await resp.json();
    if (data.content && data.content[0]) {
      resultEl.innerHTML = '<div class="ici-ai-text" style="margin-top:16px">' + iciFormatText(data.content[0].text) + '</div>';
    }
  } catch (e) {
    resultEl.innerHTML = '<div class="ici-ai-text">Strategy generation failed. Try again later.</div>';
  }
}

// ── UTILITIES ──────────────────────────────────────

function iciFormatText(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/^### (.*$)/gm, '<h4 style="margin:14px 0 6px;color:#0B5FD8">$1</h4>')
    .replace(/^## (.*$)/gm, '<h3 style="margin:18px 0 8px;color:#0B5FD8">$1</h3>')
    .replace(/^- (.*$)/gm, '<div style="padding-left:14px;margin:2px 0">&#8226; $1</div>')
    .replace(/^\d+\.\s/gm, function(m) { return '<br><strong>' + m + '</strong>'; })
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>');
}

function iciEsc(str) {
  if (!str) return '';
  var div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
