// ══════════════════════════════════════════
//  M5P1C2: COMPETITOR INTELLIGENCE DASHBOARD
//  Market analysis, competitive positioning
// ══════════════════════════════════════════

// ── COMPETITOR DATA (simulated market intelligence) ──────────────

var BPC_COMPETITORS = {
  'tax-prep': [
    { name: 'Jackson Hewitt Partners', share: 22, refs: 18, close: 0.65, strength: 'Brand recognition', weakness: 'High turnover, slow follow-up' },
    { name: 'Liberty Tax Network', share: 15, refs: 12, close: 0.58, strength: 'National advertising', weakness: 'Seasonal-only focus' },
    { name: 'Independent Tax Pro Alliance', share: 18, refs: 8, close: 0.72, strength: 'Local relationships', weakness: 'No tech platform' },
    { name: 'H&R Block Referral', share: 28, refs: 25, close: 0.55, strength: 'Massive client base', weakness: 'Impersonal experience' },
    { name: 'Community Tax (You)', share: 0, refs: 0, close: 0.68, strength: 'Full-service + tech platform', weakness: 'Building awareness' }
  ],
  'accounting': [
    { name: 'BDO Alliance', share: 20, refs: 14, close: 0.60, strength: 'Enterprise relationships', weakness: 'Minimum size requirements' },
    { name: 'RSM Alliance', share: 18, refs: 12, close: 0.55, strength: 'Global network', weakness: 'Complex onboarding' },
    { name: 'Local CPA Networks', share: 25, refs: 10, close: 0.65, strength: 'Trust + longevity', weakness: 'Limited technology' },
    { name: 'Intuit ProConnect', share: 15, refs: 8, close: 0.50, strength: 'Software integration', weakness: 'Software-focused, not service' },
    { name: 'Community Tax (You)', share: 0, refs: 0, close: 0.62, strength: 'Hands-on support + tools', weakness: 'Market awareness' }
  ],
  'financial-advisory': [
    { name: 'LPL Financial Referral', share: 22, refs: 10, close: 0.50, strength: 'Established advisor network', weakness: 'Slow processes' },
    { name: 'Ameriprise Partners', share: 18, refs: 8, close: 0.52, strength: 'Brand trust', weakness: 'Limited tax focus' },
    { name: 'Independent Advisor Network', share: 20, refs: 6, close: 0.58, strength: 'Flexibility', weakness: 'No dedicated support' },
    { name: 'Raymond James Referral', share: 15, refs: 7, close: 0.48, strength: 'High-net-worth focus', weakness: 'Narrow audience' },
    { name: 'Community Tax (You)', share: 0, refs: 0, close: 0.55, strength: 'Tax-specific expertise', weakness: 'FA channel new' }
  ],
  'legal': [
    { name: 'Tax Attorney Networks', share: 30, refs: 8, close: 0.75, strength: 'Legal authority', weakness: 'Expensive for clients' },
    { name: 'State Bar Referral', share: 20, refs: 5, close: 0.60, strength: 'Official channels', weakness: 'Slow, bureaucratic' },
    { name: 'Solo Practice Groups', share: 25, refs: 6, close: 0.70, strength: 'Personal attention', weakness: 'Limited scale' },
    { name: 'Community Tax (You)', share: 0, refs: 0, close: 0.72, strength: 'Resolution expertise', weakness: 'Building legal trust' }
  ],
  'insurance': [
    { name: 'State Farm Referral', share: 25, refs: 8, close: 0.45, strength: 'Massive client base', weakness: 'Agent fragmentation' },
    { name: 'Allstate Partners', share: 18, refs: 6, close: 0.42, strength: 'Brand trust', weakness: 'Insurance-first mindset' },
    { name: 'Independent Agent Assoc.', share: 22, refs: 5, close: 0.50, strength: 'Advisor relationships', weakness: 'No centralized tools' },
    { name: 'Community Tax (You)', share: 0, refs: 0, close: 0.48, strength: 'Cross-sell opportunity', weakness: 'New to insurance channel' }
  ],
  'mortgage': [
    { name: 'Mortgage Broker Networks', share: 28, refs: 10, close: 0.48, strength: 'Volume pipeline', weakness: 'Transactional relationships' },
    { name: 'Real Estate Referral Groups', share: 22, refs: 8, close: 0.52, strength: 'Deal flow', weakness: 'Real estate focus, not tax' },
    { name: 'Title Company Partnerships', share: 15, refs: 5, close: 0.55, strength: 'Document access', weakness: 'Limited client contact' },
    { name: 'Community Tax (You)', share: 0, refs: 0, close: 0.51, strength: 'Tax lien resolution', weakness: 'Mortgage channel new' }
  ],
  'other': [
    { name: 'General Referral Networks', share: 30, refs: 6, close: 0.45, strength: 'Broad reach', weakness: 'Low quality leads' },
    { name: 'BNI / Chamber Groups', share: 25, refs: 4, close: 0.55, strength: 'Personal connections', weakness: 'Time intensive' },
    { name: 'Online Lead Services', share: 20, refs: 8, close: 0.35, strength: 'High volume', weakness: 'Low conversion' },
    { name: 'Community Tax (You)', share: 0, refs: 0, close: 0.45, strength: 'Dedicated tools', weakness: 'Building presence' }
  ]
};

// ── SHOW MODAL ──────────────────────────────

function bpcShowCompetitors() {
  var inputs = bpcGetInputs();
  if (!inputs) {
    if (typeof showToast === 'function') showToast('Generate your roadmap first to see competitive analysis', 'error');
    return;
  }

  var overlay = document.createElement('div');
  overlay.className = 'aid-modal-overlay';
  overlay.id = 'bpc-modal';
  overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };

  var modal = document.createElement('div');
  modal.className = 'aid-modal';
  modal.style.maxWidth = '740px';

  modal.innerHTML = '<div class="aid-modal-header">'
    + '<div><div class="aid-modal-title">Competitive Intelligence</div>'
    + '<div class="aid-modal-meta">Market positioning for ' + (BP_PRACTICE_TYPES[inputs.practiceType] || 'your practice') + '</div></div>'
    + '<button class="aid-modal-close" onclick="document.getElementById(\'bpc-modal\').remove()">&times;</button>'
    + '</div>'
    + '<div class="bpc-tabs" id="bpc-tabs"></div>'
    + '<div class="aid-modal-body" id="bpc-body" style="padding-top:0"></div>';

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  bpcRenderTabs('overview');
  bpcRenderOverview(inputs);
}

function bpcGetInputs() {
  try {
    var saved = localStorage.getItem('bp_saved_inputs');
    return saved ? JSON.parse(saved) : null;
  } catch (e) { return null; }
}

function bpcRenderTabs(active) {
  var tabs = [
    { key: 'overview', label: 'Market Overview' },
    { key: 'positioning', label: 'Your Position' },
    { key: 'opportunities', label: 'Opportunities' },
    { key: 'strategies', label: 'Win Strategies' }
  ];
  var el = document.getElementById('bpc-tabs');
  if (!el) return;
  el.innerHTML = tabs.map(function(t) {
    return '<button class="bpc-tab' + (t.key === active ? ' bpc-tab-active' : '') + '" onclick="bpcSwitch(\'' + t.key + '\')">' + t.label + '</button>';
  }).join('');
}

function bpcSwitch(key) {
  var inputs = bpcGetInputs();
  if (!inputs) return;
  bpcRenderTabs(key);
  var r = { overview: bpcRenderOverview, positioning: bpcRenderPositioning, opportunities: bpcRenderOpportunities, strategies: bpcRenderStrategies };
  if (r[key]) r[key](inputs);
}

// ── OVERVIEW TAB ──────────────────────────────

function bpcRenderOverview(inputs) {
  var body = document.getElementById('bpc-body');
  if (!body) return;

  var competitors = BPC_COMPETITORS[inputs.practiceType] || BPC_COMPETITORS['other'];
  var bench = (typeof BP_BENCHMARKS !== 'undefined') ? BP_BENCHMARKS[inputs.practiceType] || BP_BENCHMARKS['other'] : { avgRefs: 5, topRefs: 15, convRate: 0.55 };

  // Market size estimate
  var totalRefs = 0;
  competitors.forEach(function(c) { totalRefs += c.refs; });
  var marketSize = Math.round(totalRefs * 12 * 420);

  var html = '<div class="bpc-market-header">'
    + '<div class="bpc-mh-stat"><div class="bpc-mh-val">' + competitors.length + '</div><div class="bpc-mh-label">Competitors</div></div>'
    + '<div class="bpc-mh-stat"><div class="bpc-mh-val">$' + (marketSize / 1000).toFixed(0) + 'K</div><div class="bpc-mh-label">Est. Annual Market</div></div>'
    + '<div class="bpc-mh-stat"><div class="bpc-mh-val">' + bench.avgRefs + '/mo</div><div class="bpc-mh-label">Avg. Referrals</div></div>'
    + '<div class="bpc-mh-stat"><div class="bpc-mh-val">' + Math.round(bench.convRate * 100) + '%</div><div class="bpc-mh-label">Avg. Close Rate</div></div>'
    + '</div>';

  // Market share chart
  html += '<div class="bpc-section-title">Market Share Distribution</div>';
  html += '<div class="bpc-share-chart">';

  var shareColors = ['#3B82F6', '#F59E0B', '#059669', '#EF4444', '#8B5CF6', '#EC4899'];
  competitors.forEach(function(c, i) {
    var isYou = c.name.indexOf('Community Tax') !== -1;
    var color = isYou ? '#059669' : shareColors[i % shareColors.length];
    var share = isYou ? (inputs.goal ? Math.min(Math.round((inputs.goal / totalRefs) * 100), 15) : 5) : c.share;

    html += '<div class="bpc-share-row">'
      + '<div class="bpc-share-name' + (isYou ? ' bpc-share-you' : '') + '">' + c.name + '</div>'
      + '<div class="bpc-share-bar-wrap"><div class="bpc-share-bar" style="width:' + share + '%;background:' + color + '"></div></div>'
      + '<div class="bpc-share-pct">' + share + '%</div>'
      + '</div>';
  });
  html += '</div>';

  // Competitor table
  html += '<div class="bpc-section-title" style="margin-top:20px">Competitor Comparison</div>';
  html += '<div class="bpc-table">'
    + '<div class="bpc-tr bpc-thead"><div class="bpc-th" style="flex:2">Competitor</div><div class="bpc-th">Refs/Mo</div><div class="bpc-th">Close Rate</div><div class="bpc-th" style="flex:2">Strength</div></div>';

  competitors.forEach(function(c) {
    var isYou = c.name.indexOf('Community Tax') !== -1;
    html += '<div class="bpc-tr' + (isYou ? ' bpc-tr-you' : '') + '">'
      + '<div class="bpc-td" style="flex:2;font-weight:600">' + c.name + '</div>'
      + '<div class="bpc-td">' + (isYou ? (inputs.goal || '?') : c.refs) + '</div>'
      + '<div class="bpc-td">' + Math.round(c.close * 100) + '%</div>'
      + '<div class="bpc-td" style="flex:2;font-size:12px">' + c.strength + '</div>'
      + '</div>';
  });
  html += '</div>';

  body.innerHTML = html;
}

// ── POSITIONING TAB ──────────────────────────────

function bpcRenderPositioning(inputs) {
  var body = document.getElementById('bpc-body');
  if (!body) return;

  var competitors = BPC_COMPETITORS[inputs.practiceType] || BPC_COMPETITORS['other'];
  var you = competitors.find(function(c) { return c.name.indexOf('Community Tax') !== -1; }) || {};

  // Positioning axes: close rate (Y) vs referral volume (X)
  var html = '<div class="bpc-section-title">Competitive Positioning Map</div>'
    + '<div class="bpc-pos-desc">Close Rate (quality) vs. Referral Volume (quantity)</div>';

  html += '<div class="bpc-pos-map">';
  html += '<div class="bpc-pos-y-label">Close Rate</div>';
  html += '<div class="bpc-pos-x-label">Referral Volume</div>';
  html += '<div class="bpc-pos-grid">';

  // Quadrant labels
  html += '<div class="bpc-quad bpc-quad-tl">High Quality<br>Low Volume</div>';
  html += '<div class="bpc-quad bpc-quad-tr">High Quality<br>High Volume</div>';
  html += '<div class="bpc-quad bpc-quad-bl">Low Quality<br>Low Volume</div>';
  html += '<div class="bpc-quad bpc-quad-br">Low Quality<br>High Volume</div>';

  // Plot competitors
  var maxRefs = 0;
  competitors.forEach(function(c) { if (c.refs > maxRefs) maxRefs = c.refs; });
  if (maxRefs === 0) maxRefs = 25;

  var dotColors = ['#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#059669'];
  competitors.forEach(function(c, i) {
    var isYou = c.name.indexOf('Community Tax') !== -1;
    var x = isYou ? Math.min(((inputs.goal || 5) / (maxRefs * 1.2)) * 100, 95) : (c.refs / (maxRefs * 1.2)) * 100;
    var y = (1 - c.close) * 100;
    var color = isYou ? '#059669' : dotColors[i % dotColors.length];
    var size = isYou ? 14 : 10;

    html += '<div class="bpc-pos-dot' + (isYou ? ' bpc-pos-you' : '') + '" style="left:' + x + '%;top:' + y + '%;background:' + color + ';width:' + size + 'px;height:' + size + 'px" title="' + c.name + '"></div>';
  });

  html += '</div></div>';

  // Legend
  html += '<div class="bpc-pos-legend">';
  competitors.forEach(function(c, i) {
    var isYou = c.name.indexOf('Community Tax') !== -1;
    var color = isYou ? '#059669' : dotColors[i % dotColors.length];
    html += '<span class="bpc-leg-item"><span class="bpc-leg-dot" style="background:' + color + '"></span>' + c.name + '</span>';
  });
  html += '</div>';

  // SWOT Analysis
  html += '<div class="bpc-section-title" style="margin-top:24px">Your SWOT Analysis</div>';
  html += '<div class="bpc-swot">'
    + '<div class="bpc-swot-card bpc-swot-s"><div class="bpc-swot-label">Strengths</div><ul>'
    + '<li>Full-service resolution platform</li>'
    + '<li>AI-powered marketing tools</li>'
    + '<li>Same-day client contact</li>'
    + '<li>Licensed in all 50 states</li>'
    + '</ul></div>'
    + '<div class="bpc-swot-card bpc-swot-w"><div class="bpc-swot-label">Weaknesses</div><ul>'
    + '<li>Building market awareness</li>'
    + '<li>New partner network</li>'
    + '<li>No national ad campaigns (yet)</li>'
    + '</ul></div>'
    + '<div class="bpc-swot-card bpc-swot-o"><div class="bpc-swot-label">Opportunities</div><ul>'
    + '<li>Underserved ' + (BP_PRACTICE_TYPES[inputs.practiceType] || '') + ' channel</li>'
    + '<li>Growing tax debt market ($181B+ owed)</li>'
    + '<li>Digital-first advantage over legacy networks</li>'
    + '<li>' + (inputs.geo === 'rural' ? 'Low competition in rural markets' : 'Dense client pool in metro area') + '</li>'
    + '</ul></div>'
    + '<div class="bpc-swot-card bpc-swot-t"><div class="bpc-swot-label">Threats</div><ul>'
    + '<li>Established brand loyalty to incumbents</li>'
    + '<li>DIY tax resolution services growing</li>'
    + '<li>Seasonal volatility in referral flow</li>'
    + '</ul></div>'
    + '</div>';

  body.innerHTML = html;
}

// ── OPPORTUNITIES TAB ──────────────────────────────

function bpcRenderOpportunities(inputs) {
  var body = document.getElementById('bpc-body');
  if (!body) return;

  var competitors = BPC_COMPETITORS[inputs.practiceType] || BPC_COMPETITORS['other'];

  // Identify competitor weaknesses
  html = '<div class="bpc-section-title">Competitor Gaps You Can Exploit</div>';
  var html = '<div class="bpc-section-title">Competitor Gaps You Can Exploit</div>';
  html += '<div class="bpc-gaps">';

  competitors.filter(function(c) { return c.name.indexOf('Community Tax') === -1; }).forEach(function(c) {
    html += '<div class="bpc-gap-card">'
      + '<div class="bpc-gap-name">' + c.name + '</div>'
      + '<div class="bpc-gap-weakness"><strong>Their weakness:</strong> ' + c.weakness + '</div>'
      + '<div class="bpc-gap-action"><strong>Your play:</strong> ' + bpcGetCounterPlay(c.weakness) + '</div>'
      + '</div>';
  });
  html += '</div>';

  // Underserved segments
  html += '<div class="bpc-section-title" style="margin-top:24px">Underserved Market Segments</div>';
  var segments = bpcGetSegments(inputs.practiceType);
  html += '<div class="bpc-segments">';
  segments.forEach(function(seg) {
    html += '<div class="bpc-seg-card">'
      + '<div class="bpc-seg-name">' + seg.name + '</div>'
      + '<div class="bpc-seg-size">Est. size: ' + seg.size + '</div>'
      + '<div class="bpc-seg-desc">' + seg.desc + '</div>'
      + '<div class="bpc-seg-action">' + seg.action + '</div>'
      + '</div>';
  });
  html += '</div>';

  body.innerHTML = html;
}

function bpcGetCounterPlay(weakness) {
  var plays = {
    'High turnover, slow follow-up': 'Emphasize your dedicated partner manager and same-day client contact guarantee.',
    'Seasonal-only focus': 'Position year-round support as your advantage. Tax problems do not stop in April.',
    'No tech platform': 'Demo your AI tools and partner portal. Technology is a clear differentiator.',
    'Impersonal experience': 'Lead with personal relationships. Your clients are not numbers.',
    'Minimum size requirements': 'Target smaller firms they cannot serve. Be the partner for solo practitioners.',
    'Complex onboarding': 'Highlight your 30-day onboarding challenge. Simple, guided, effective.',
    'Limited technology': 'Show the full portal: page builder, AI scripts, client qualifier, analytics.',
    'Software-focused, not service': 'Position human expertise + technology. Software alone does not resolve tax debt.',
    'Slow processes': 'Fast turnaround is your edge. Same-day contact, rapid resolution.',
    'Limited tax focus': 'You specialize in tax resolution. That focus means better outcomes.',
    'No dedicated support': 'Your partner success team is dedicated and responsive.',
    'Narrow audience': 'Serve all client types. No minimum debt threshold drama.',
    'Expensive for clients': 'Highlight affordable investigation fees ($295) and flexible resolution plans.',
    'Slow, bureaucratic': 'Move fast. Your streamlined process is the opposite of bureaucracy.',
    'Limited scale': 'Scale through technology. One partner with your tools outperforms three without.',
    'Agent fragmentation': 'Centralized platform means consistent experience across all partners.',
    'Insurance-first mindset': 'Cross-sell tax resolution as a natural complement to financial protection.',
    'No centralized tools': 'Your portal unifies everything. One login, all tools, full visibility.',
    'Transactional relationships': 'Build lasting partnerships, not one-off transactions.',
    'Real estate focus, not tax': 'Educate on the tax resolution opportunity hidden in their client base.',
    'Limited client contact': 'Direct relationships mean you hear about tax problems first.',
    'Low quality leads': 'Quality over quantity. Your referrals convert because they are pre-qualified.',
    'Time intensive': 'Scale without meetings. Your digital tools replace hours of face-to-face networking.'
  };
  return plays[weakness] || 'Differentiate through superior service, technology, and partner support.';
}

function bpcGetSegments(practiceType) {
  var base = [
    { name: 'Gig Economy Workers', size: '~59M in US', desc: 'Freelancers and contractors often underreport or owe back taxes.', action: 'Target with "Are you behind on estimated taxes?" messaging.' },
    { name: 'Small Business Owners w/ Payroll Issues', size: '~6M potential', desc: 'Trust fund recovery penalties are among the IRS\'s most aggressive actions.', action: 'Partner with payroll providers and HR consultants.' },
    { name: 'Recently Divorced Individuals', size: 'Growing segment', desc: 'Tax liabilities from joint returns often surface during divorce.', action: 'Build referral relationships with family law attorneys.' },
    { name: 'Crypto Traders', size: '~50M US holders', desc: 'Complex reporting requirements leading to IRS notices increasing 300% yearly.', action: 'Create crypto-specific qualifying scripts and landing pages.' }
  ];

  if (practiceType === 'tax-prep') {
    base.unshift({ name: 'Your Existing Clients w/ IRS Notices', size: 'Check your client list', desc: '8-12% of clients typically have unresolved tax issues they have not mentioned.', action: 'Run a proactive "tax health check" campaign to your client base.' });
  }
  if (practiceType === 'financial-advisory') {
    base.unshift({ name: 'High-Net-Worth with Audit Risk', size: 'Top 10% of your clients', desc: 'Complex portfolios and multiple income streams increase audit probability.', action: 'Position tax resolution as a safety net within wealth management.' });
  }

  return base;
}

// ── STRATEGIES TAB ──────────────────────────────

function bpcRenderStrategies(inputs) {
  var body = document.getElementById('bpc-body');
  if (!body) return;

  var practiceType = inputs.practiceType;
  var budget = parseInt(inputs.budget) || 0;

  var strategies = [
    {
      title: 'Speed Advantage',
      desc: 'Same-day client contact is your biggest weapon. Most competitors take 48-72 hours. When a taxpayer is panicking about an IRS notice, the first responder wins.',
      actions: ['Mention same-day contact in every referral conversation', 'Share response time stats with prospects', 'Build urgency scripts around timing'],
      impact: 'High',
      difficulty: 'Easy'
    },
    {
      title: 'Technology Differentiation',
      desc: 'Your partner portal with AI tools, page builder, and analytics dashboard is unlike anything competitors offer. Most work with spreadsheets and email.',
      actions: ['Demo the portal in every pitch meeting', 'Build a landing page showcasing partner tools', 'Share tool output samples as proof of value'],
      impact: 'High',
      difficulty: 'Medium'
    },
    {
      title: 'Niche Domination',
      desc: 'Instead of competing broadly, own the ' + (BP_PRACTICE_TYPES[practiceType] || 'professional services') + ' niche in your area. Be THE tax resolution partner for your practice type.',
      actions: ['Create niche-specific scripts and ads', 'Attend industry conferences and events', 'Write thought leadership content for trade publications'],
      impact: 'Very High',
      difficulty: 'Medium'
    },
    {
      title: 'Referral Network Effect',
      desc: 'Every resolved client can refer 2-3 more. Build a flywheel where satisfied clients become your best lead source.',
      actions: ['Ask for referrals at case resolution', 'Create a client success story library', 'Offer referral incentives to resolved clients'],
      impact: 'Very High',
      difficulty: 'Hard'
    }
  ];

  if (budget >= 500) {
    strategies.push({
      title: 'Paid Acquisition Channel',
      desc: 'With $' + budget + '/month, you can run targeted ads to people actively searching for tax help. This is volume that organic cannot match.',
      actions: ['Run Google Ads for "IRS tax help" + your city', 'Create Facebook retargeting for site visitors', 'Test LinkedIn ads targeting financial professionals'],
      impact: 'High',
      difficulty: 'Medium'
    });
  }

  var html = '<div class="bpc-section-title">Winning Strategies</div>';
  html += '<div class="bpc-strategies">';

  strategies.forEach(function(s) {
    var impactColor = s.impact === 'Very High' ? '#059669' : s.impact === 'High' ? '#3B82F6' : '#F59E0B';
    var diffColor = s.difficulty === 'Easy' ? '#059669' : s.difficulty === 'Medium' ? '#F59E0B' : '#EF4444';

    html += '<div class="bpc-strat-card">'
      + '<div class="bpc-strat-header">'
      + '<div class="bpc-strat-title">' + s.title + '</div>'
      + '<div class="bpc-strat-tags">'
      + '<span class="bpc-strat-tag" style="color:' + impactColor + ';border-color:' + impactColor + '">' + s.impact + ' Impact</span>'
      + '<span class="bpc-strat-tag" style="color:' + diffColor + ';border-color:' + diffColor + '">' + s.difficulty + '</span>'
      + '</div>'
      + '</div>'
      + '<div class="bpc-strat-desc">' + s.desc + '</div>'
      + '<div class="bpc-strat-actions-title">Action Items:</div>'
      + '<ul class="bpc-strat-actions">';
    s.actions.forEach(function(a) { html += '<li>' + a + '</li>'; });
    html += '</ul></div>';
  });

  html += '</div>';

  body.innerHTML = html;
}
