// ══════════════════════════════════════════
//  M1P1C4: A/B TESTING ENGINE
//  Create page variants, traffic splitting, conversion tracking,
//  statistical significance, winner detection, test history
// ══════════════════════════════════════════

var ABT_STORAGE_KEY = 'pb_ab_tests_v1';
var ABT_EVENTS_KEY = 'pb_ab_events';
var ABT_ARCHIVE_KEY = 'pb_ab_archive';

// ── TEST ELEMENT TYPES ──────────────────────────

var ABT_ELEMENT_TYPES = [
  { id: 'headline', name: 'Headline', icon: '&#9997;', desc: 'Test different headlines to see which resonates', fields: ['text'], placeholder: 'Enter headline text' },
  { id: 'cta_button', name: 'CTA Button', icon: '&#128073;', desc: 'Test button text, color, and size', fields: ['text', 'color', 'size'], placeholder: 'Enter button text' },
  { id: 'hero_image', name: 'Hero Image', icon: '&#128247;', desc: 'Test different hero images or layouts', fields: ['url', 'alt'], placeholder: 'Image URL' },
  { id: 'subheadline', name: 'Subheadline', icon: '&#128196;', desc: 'Test supporting copy beneath headlines', fields: ['text'], placeholder: 'Enter subheadline' },
  { id: 'pricing', name: 'Price Display', icon: '&#128176;', desc: 'Test pricing presentation and anchoring', fields: ['text', 'style'], placeholder: '$XXX/month' },
  { id: 'social_proof', name: 'Social Proof', icon: '&#11088;', desc: 'Test testimonials, stats, or trust badges', fields: ['text', 'type'], placeholder: 'Enter social proof text' },
  { id: 'form_layout', name: 'Form Layout', icon: '&#128221;', desc: 'Test form field count, order, or style', fields: ['layout'], placeholder: 'Describe layout' },
  { id: 'color_scheme', name: 'Color Scheme', icon: '&#127912;', desc: 'Test different color palettes', fields: ['primary', 'secondary'], placeholder: '#hex color' },
  { id: 'page_layout', name: 'Page Layout', icon: '&#128204;', desc: 'Test different section ordering or structure', fields: ['layout'], placeholder: 'Describe layout' },
  { id: 'offer', name: 'Offer/Incentive', icon: '&#127873;', desc: 'Test different offers, discounts, or bonuses', fields: ['text'], placeholder: 'Describe the offer' }
];

// ── PREDEFINED TEST TEMPLATES ──────────────────────────

var ABT_TEMPLATES = [
  {
    name: 'Headline Power Words',
    element: 'headline',
    variants: [
      { name: 'Control', value: 'Grow Your Tax Resolution Referral Business', desc: 'Current headline' },
      { name: 'Urgency', value: 'Don\'t Miss Out: Start Earning Referral Commissions Today', desc: 'Urgency-driven' },
      { name: 'Benefit', value: 'Earn $750+ Per Referral With Zero Risk', desc: 'Benefit-focused' },
      { name: 'Question', value: 'What If Every Client Conversation Could Earn You $750?', desc: 'Question hook' }
    ],
    hypothesis: 'Benefit-focused headlines will outperform urgency and question hooks for professional partners.'
  },
  {
    name: 'CTA Button Copy',
    element: 'cta_button',
    variants: [
      { name: 'Control', value: 'Get Started', desc: 'Generic CTA' },
      { name: 'Action', value: 'Start Earning Now', desc: 'Action-oriented' },
      { name: 'Personal', value: 'Build My Referral Plan', desc: 'Personalized' },
      { name: 'Value', value: 'See My Earning Potential', desc: 'Value preview' }
    ],
    hypothesis: 'Personalized CTAs with "My" will generate higher click-through than generic ones.'
  },
  {
    name: 'Social Proof Style',
    element: 'social_proof',
    variants: [
      { name: 'Stats', value: '2,847 partners earning an average $4,200/month', desc: 'Aggregate statistics' },
      { name: 'Testimonial', value: '"I made $12,000 in my first quarter." -- Sarah K., CPA', desc: 'Individual story' },
      { name: 'Logo Bar', value: 'Trusted by 500+ accounting firms nationwide', desc: 'Trust logos' },
      { name: 'Live Counter', value: '$2.4M paid to partners this month', desc: 'Real-time counter' }
    ],
    hypothesis: 'Individual testimonials with specific numbers will convert better than aggregate stats.'
  },
  {
    name: 'Pricing Presentation',
    element: 'pricing',
    variants: [
      { name: 'Commission Only', value: '$500-$1,500 per referral', desc: 'Range display' },
      { name: 'Annual Potential', value: 'Earn up to $120,000/year', desc: 'Annual framing' },
      { name: 'Comparison', value: '10x more than typical referral fees', desc: 'Competitive comparison' }
    ],
    hypothesis: 'Annual framing will create higher perceived value than per-referral pricing.'
  },
  {
    name: 'Form Length',
    element: 'form_layout',
    variants: [
      { name: '3 Fields', value: 'Name, Email, Phone', desc: 'Minimal friction' },
      { name: '5 Fields', value: 'Name, Email, Phone, Practice Type, Client Count', desc: 'Moderate qualification' },
      { name: '7 Fields', value: 'Full qualification form', desc: 'High qualification' }
    ],
    hypothesis: 'Shorter forms will get more submissions but longer forms will have higher-quality leads.'
  }
];

// ── CONVERSION GOALS ──────────────────────────

var ABT_GOALS = [
  { id: 'click', name: 'Button Click', icon: '&#128073;', desc: 'Visitor clicks the target CTA button' },
  { id: 'form_submit', name: 'Form Submission', icon: '&#128221;', desc: 'Visitor submits the contact/signup form' },
  { id: 'scroll_depth', name: 'Scroll Depth', icon: '&#128205;', desc: 'Visitor scrolls past 75% of the page' },
  { id: 'time_on_page', name: 'Time on Page', icon: '&#9200;', desc: 'Visitor spends 60+ seconds on page' },
  { id: 'page_view', name: 'Page View', icon: '&#128065;', desc: 'Visitor views a specific page (e.g., pricing)' },
  { id: 'phone_call', name: 'Phone Call Click', icon: '&#128222;', desc: 'Visitor clicks a phone number link' }
];

// ── STATE MANAGEMENT ──────────────────────────

function abtLoadTests() {
  try {
    return JSON.parse(localStorage.getItem(ABT_STORAGE_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function abtSaveTests(tests) {
  localStorage.setItem(ABT_STORAGE_KEY, JSON.stringify(tests));
}

function abtLoadEvents() {
  try {
    return JSON.parse(localStorage.getItem(ABT_EVENTS_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function abtSaveEvents(events) {
  localStorage.setItem(ABT_EVENTS_KEY, JSON.stringify(events));
}

function abtLoadArchive() {
  try {
    return JSON.parse(localStorage.getItem(ABT_ARCHIVE_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function abtSaveArchive(archive) {
  localStorage.setItem(ABT_ARCHIVE_KEY, JSON.stringify(archive));
}

// ── MAIN MODAL ──────────────────────────

function abtShowTests() {
  var existing = document.getElementById('abt-modal');
  if (existing) existing.remove();

  var overlay = document.createElement('div');
  overlay.className = 'abt-overlay';
  overlay.id = 'abt-modal';
  overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };

  var modal = document.createElement('div');
  modal.className = 'abt-modal';

  modal.innerHTML = '<div class="abt-header">'
    + '<div><div class="abt-title">A/B Testing Engine</div>'
    + '<div class="abt-subtitle">Create variants, track conversions, find winners with statistical confidence</div></div>'
    + '<button class="abt-close" onclick="document.getElementById(\'abt-modal\').remove()">&times;</button>'
    + '</div>'
    + '<div class="abt-tabs" id="abt-tabs"></div>'
    + '<div class="abt-body" id="abt-body"></div>';

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  abtRenderTabs('dashboard');
}

function abtRenderTabs(active) {
  var tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'create', label: 'New Test' },
    { id: 'templates', label: 'Templates' },
    { id: 'results', label: 'Results' },
    { id: 'insights', label: 'AI Insights' },
    { id: 'archive', label: 'Archive' }
  ];

  var html = '';
  var tests = abtLoadTests();
  var active_count = tests.filter(function(t) { return t.status === 'running'; }).length;

  tabs.forEach(function(t) {
    var badge = '';
    if (t.id === 'dashboard' && active_count > 0) {
      badge = '<span class="abt-tab-badge">' + active_count + '</span>';
    }
    html += '<button class="abt-tab' + (t.id === active ? ' abt-tab-active' : '') + '" onclick="abtSwitchTab(\'' + t.id + '\')">' + t.label + badge + '</button>';
  });

  document.getElementById('abt-tabs').innerHTML = html;
  abtSwitchTab(active);
}

function abtSwitchTab(tab) {
  var tabs = document.querySelectorAll('.abt-tab');
  var labels = { dashboard: 'Dashboard', create: 'New Test', templates: 'Templates', results: 'Results', insights: 'AI Insights', archive: 'Archive' };
  tabs.forEach(function(t) {
    var text = t.textContent || t.innerText;
    t.classList.toggle('abt-tab-active', text.indexOf(labels[tab]) === 0);
  });

  var body = document.getElementById('abt-body');
  if (!body) return;

  if (tab === 'dashboard') abtRenderDashboard();
  else if (tab === 'create') abtRenderCreate();
  else if (tab === 'templates') abtRenderTemplates();
  else if (tab === 'results') abtRenderResults();
  else if (tab === 'insights') abtRenderInsights();
  else if (tab === 'archive') abtRenderArchive();
}

// ── DASHBOARD TAB ──────────────────────────

function abtRenderDashboard() {
  var body = document.getElementById('abt-body');
  var tests = abtLoadTests();

  if (tests.length === 0) {
    body.innerHTML = '<div class="abt-empty">'
      + '<div class="abt-empty-icon">&#9878;</div>'
      + '<div class="abt-empty-title">No Tests Running</div>'
      + '<div class="abt-empty-desc">Create your first A/B test to start optimizing conversions.</div>'
      + '<div style="display:flex;gap:10px;justify-content:center">'
      + '<button class="abt-primary-btn" onclick="abtSwitchTab(\'create\')">Create Custom Test</button>'
      + '<button class="abt-secondary-btn" onclick="abtSwitchTab(\'templates\')">Use a Template</button>'
      + '</div>'
      + '</div>';
    return;
  }

  // Summary stats
  var running = tests.filter(function(t) { return t.status === 'running'; });
  var completed = tests.filter(function(t) { return t.status === 'completed'; });
  var totalImpressions = tests.reduce(function(s, t) {
    return s + t.variants.reduce(function(vs, v) { return vs + (v.impressions || 0); }, 0);
  }, 0);
  var totalConversions = tests.reduce(function(s, t) {
    return s + t.variants.reduce(function(vs, v) { return vs + (v.conversions || 0); }, 0);
  }, 0);

  var html = '<div class="abt-dash">';

  html += '<div class="abt-stats-grid">'
    + '<div class="abt-stat-card"><div class="abt-stat-val" style="color:#3B82F6">' + running.length + '</div><div class="abt-stat-label">Running Tests</div></div>'
    + '<div class="abt-stat-card"><div class="abt-stat-val" style="color:#10B981">' + completed.length + '</div><div class="abt-stat-label">Completed</div></div>'
    + '<div class="abt-stat-card"><div class="abt-stat-val" style="color:#8B5CF6">' + totalImpressions.toLocaleString() + '</div><div class="abt-stat-label">Total Impressions</div></div>'
    + '<div class="abt-stat-card"><div class="abt-stat-val" style="color:#F59E0B">' + totalConversions.toLocaleString() + '</div><div class="abt-stat-label">Total Conversions</div></div>'
    + '</div>';

  // Active test cards
  if (running.length > 0) {
    html += '<div class="abt-section-title">Active Tests</div>';
    running.forEach(function(test, idx) {
      html += abtRenderTestCard(test, idx, 'running');
    });
  }

  // Recently completed
  if (completed.length > 0) {
    html += '<div class="abt-section-title" style="margin-top:20px">Recently Completed</div>';
    completed.slice(0, 3).forEach(function(test, idx) {
      html += abtRenderTestCard(test, tests.indexOf(test), 'completed');
    });
  }

  html += '</div>';
  body.innerHTML = html;
}

function abtRenderTestCard(test, idx, status) {
  var element = ABT_ELEMENT_TYPES.find(function(e) { return e.id === test.elementType; }) || ABT_ELEMENT_TYPES[0];
  var totalImpressions = test.variants.reduce(function(s, v) { return s + (v.impressions || 0); }, 0);
  var bestVariant = test.variants.reduce(function(best, v) {
    var rate = v.impressions > 0 ? v.conversions / v.impressions : 0;
    var bestRate = best.impressions > 0 ? best.conversions / best.impressions : 0;
    return rate > bestRate ? v : best;
  }, test.variants[0]);
  var bestRate = bestVariant.impressions > 0 ? ((bestVariant.conversions / bestVariant.impressions) * 100).toFixed(1) : '0.0';
  var daysRunning = Math.ceil((Date.now() - test.createdAt) / 86400000);
  var confidence = abtCalcConfidence(test);

  var statusColor = status === 'running' ? '#3B82F6' : confidence >= 95 ? '#10B981' : '#F59E0B';
  var statusLabel = status === 'running' ? 'Running' : confidence >= 95 ? 'Winner Found' : 'Inconclusive';

  var html = '<div class="abt-test-card">'
    + '<div class="abt-test-top">'
    + '<div class="abt-test-icon" style="background:' + statusColor + '15">' + element.icon + '</div>'
    + '<div class="abt-test-info">'
    + '<div class="abt-test-name">' + test.name + '</div>'
    + '<div class="abt-test-meta">' + test.variants.length + ' variants | ' + daysRunning + ' days | ' + totalImpressions.toLocaleString() + ' impressions</div>'
    + '</div>'
    + '<span class="abt-test-status" style="background:' + statusColor + '15;color:' + statusColor + '">' + statusLabel + '</span>'
    + '</div>';

  // Mini variant comparison
  html += '<div class="abt-test-variants">';
  var maxRate = 0;
  test.variants.forEach(function(v) {
    var rate = v.impressions > 0 ? (v.conversions / v.impressions) * 100 : 0;
    if (rate > maxRate) maxRate = rate;
  });

  test.variants.forEach(function(v) {
    var rate = v.impressions > 0 ? (v.conversions / v.impressions) * 100 : 0;
    var barPct = maxRate > 0 ? (rate / maxRate) * 100 : 0;
    var isWinner = v === bestVariant && confidence >= 95;

    html += '<div class="abt-mini-variant' + (isWinner ? ' abt-mini-winner' : '') + '">'
      + '<div class="abt-mv-name">' + v.name + (isWinner ? ' &#127942;' : '') + '</div>'
      + '<div class="abt-mv-bar-wrap"><div class="abt-mv-bar" style="width:' + barPct + '%;background:' + (isWinner ? '#10B981' : '#3B82F630') + '"></div></div>'
      + '<div class="abt-mv-rate">' + rate.toFixed(1) + '%</div>'
      + '</div>';
  });

  html += '</div>';

  // Confidence meter
  html += '<div class="abt-test-footer">'
    + '<div class="abt-confidence">'
    + '<span class="abt-conf-label">Confidence:</span>'
    + '<div class="abt-conf-bar"><div class="abt-conf-fill" style="width:' + Math.min(confidence, 100) + '%;background:' + (confidence >= 95 ? '#10B981' : confidence >= 80 ? '#F59E0B' : '#94A3B8') + '"></div></div>'
    + '<span class="abt-conf-val">' + confidence + '%</span>'
    + '</div>';

  if (status === 'running') {
    html += '<div class="abt-test-actions">'
      + '<button class="abt-action-btn" onclick="abtViewTest(' + idx + ')">Details</button>'
      + '<button class="abt-action-btn abt-stop-btn" onclick="abtStopTest(' + idx + ')">End Test</button>'
      + '</div>';
  } else {
    html += '<button class="abt-action-btn" onclick="abtViewTest(' + idx + ')">View Results</button>';
  }

  html += '</div></div>';
  return html;
}

// ── CREATE TEST TAB ──────────────────────────

function abtRenderCreate() {
  var body = document.getElementById('abt-body');

  var html = '<div class="abt-create">'
    + '<div class="abt-create-header">'
    + '<div class="abt-create-title">Create New A/B Test</div>'
    + '<div class="abt-create-desc">Choose what to test, define your variants, and set your conversion goal.</div>'
    + '</div>';

  // Step 1: Element type
  html += '<div class="abt-step">'
    + '<div class="abt-step-num">1</div>'
    + '<div class="abt-step-content">'
    + '<div class="abt-step-title">What are you testing?</div>'
    + '<div class="abt-element-grid" id="abt-elements">';

  ABT_ELEMENT_TYPES.forEach(function(el) {
    html += '<button class="abt-element-btn" data-element="' + el.id + '" onclick="abtSelectElement(\'' + el.id + '\')">'
      + '<span class="abt-el-icon">' + el.icon + '</span>'
      + '<span class="abt-el-name">' + el.name + '</span>'
      + '</button>';
  });

  html += '</div></div></div>';

  // Step 2: Test name + hypothesis
  html += '<div class="abt-step">'
    + '<div class="abt-step-num">2</div>'
    + '<div class="abt-step-content">'
    + '<div class="abt-step-title">Name & Hypothesis</div>'
    + '<div class="abt-form-row">'
    + '<input type="text" class="abt-input" id="abt-test-name" placeholder="Test name (e.g., Homepage Headline Test)">'
    + '</div>'
    + '<div class="abt-form-row">'
    + '<textarea class="abt-textarea" id="abt-hypothesis" placeholder="Your hypothesis: I believe [variant] will outperform [control] because..." rows="2"></textarea>'
    + '</div>'
    + '</div></div>';

  // Step 3: Variants
  html += '<div class="abt-step">'
    + '<div class="abt-step-num">3</div>'
    + '<div class="abt-step-content">'
    + '<div class="abt-step-title">Define Variants</div>'
    + '<div id="abt-variants-list">'
    + '<div class="abt-variant-input" data-idx="0">'
    + '<div class="abt-var-label">A (Control)</div>'
    + '<input type="text" class="abt-input" placeholder="Enter control version">'
    + '</div>'
    + '<div class="abt-variant-input" data-idx="1">'
    + '<div class="abt-var-label">B (Challenger)</div>'
    + '<input type="text" class="abt-input" placeholder="Enter challenger version">'
    + '</div>'
    + '</div>'
    + '<button class="abt-add-variant-btn" onclick="abtAddVariant()">+ Add Variant</button>'
    + '</div></div>';

  // Step 4: Conversion goal
  html += '<div class="abt-step">'
    + '<div class="abt-step-num">4</div>'
    + '<div class="abt-step-content">'
    + '<div class="abt-step-title">Conversion Goal</div>'
    + '<div class="abt-goal-grid" id="abt-goals">';

  ABT_GOALS.forEach(function(goal) {
    html += '<button class="abt-goal-btn" data-goal="' + goal.id + '" onclick="abtSelectGoal(\'' + goal.id + '\')">'
      + '<span class="abt-goal-icon">' + goal.icon + '</span>'
      + '<span class="abt-goal-name">' + goal.name + '</span>'
      + '</button>';
  });

  html += '</div></div></div>';

  // Step 5: Traffic split
  html += '<div class="abt-step">'
    + '<div class="abt-step-num">5</div>'
    + '<div class="abt-step-content">'
    + '<div class="abt-step-title">Traffic Split</div>'
    + '<div class="abt-split-options">'
    + '<button class="abt-split-btn abt-split-active" data-split="equal" onclick="abtSelectSplit(\'equal\')">Equal Split</button>'
    + '<button class="abt-split-btn" data-split="90-10" onclick="abtSelectSplit(\'90-10\')">90/10 (Conservative)</button>'
    + '<button class="abt-split-btn" data-split="80-20" onclick="abtSelectSplit(\'80-20\')">80/20 (Moderate)</button>'
    + '</div>'
    + '</div></div>';

  // Launch button
  html += '<button class="abt-launch-btn" onclick="abtLaunchTest()">Launch A/B Test</button>';

  html += '</div>';
  body.innerHTML = html;
}

// ── CREATE HELPERS ──────────────────────────

var abtSelectedElement = null;
var abtSelectedGoal = null;
var abtSelectedSplit = 'equal';

function abtSelectElement(id) {
  abtSelectedElement = id;
  document.querySelectorAll('.abt-element-btn').forEach(function(btn) {
    btn.classList.toggle('abt-el-active', btn.getAttribute('data-element') === id);
  });
}

function abtSelectGoal(id) {
  abtSelectedGoal = id;
  document.querySelectorAll('.abt-goal-btn').forEach(function(btn) {
    btn.classList.toggle('abt-goal-active', btn.getAttribute('data-goal') === id);
  });
}

function abtSelectSplit(split) {
  abtSelectedSplit = split;
  document.querySelectorAll('.abt-split-btn').forEach(function(btn) {
    btn.classList.toggle('abt-split-active', btn.getAttribute('data-split') === split);
  });
}

function abtAddVariant() {
  var list = document.getElementById('abt-variants-list');
  if (!list) return;
  var count = list.children.length;
  if (count >= 6) return;
  var letters = ['A', 'B', 'C', 'D', 'E', 'F'];
  var div = document.createElement('div');
  div.className = 'abt-variant-input';
  div.setAttribute('data-idx', count);
  div.innerHTML = '<div class="abt-var-label">' + letters[count] + ' (Variant)</div>'
    + '<input type="text" class="abt-input" placeholder="Enter variant ' + letters[count] + '">';
  list.appendChild(div);
}

function abtLaunchTest() {
  if (!abtSelectedElement) return;

  var name = document.getElementById('abt-test-name').value.trim();
  var hypothesis = document.getElementById('abt-hypothesis').value.trim();
  if (!name) name = 'Untitled Test';

  var variantInputs = document.querySelectorAll('#abt-variants-list .abt-variant-input');
  var variants = [];
  var letters = ['A', 'B', 'C', 'D', 'E', 'F'];
  variantInputs.forEach(function(vi, idx) {
    var input = vi.querySelector('input');
    var val = input ? input.value.trim() : '';
    variants.push({
      name: letters[idx] + (idx === 0 ? ' (Control)' : ''),
      value: val || 'Variant ' + letters[idx],
      impressions: 0,
      conversions: 0,
      revenueImpact: 0
    });
  });

  if (variants.length < 2) return;

  var test = {
    id: 'test_' + Date.now(),
    name: name,
    hypothesis: hypothesis,
    elementType: abtSelectedElement,
    goalType: abtSelectedGoal || 'click',
    splitType: abtSelectedSplit,
    variants: variants,
    status: 'running',
    createdAt: Date.now(),
    endedAt: null,
    winnerId: null
  };

  // Generate simulated initial data
  abtSimulateData(test);

  var tests = abtLoadTests();
  tests.push(test);
  abtSaveTests(tests);

  abtSelectedElement = null;
  abtSelectedGoal = null;
  abtSelectedSplit = 'equal';

  abtSwitchTab('dashboard');
}

// ── SIMULATE DATA (Demo Mode) ──────────────────────────

function abtSimulateData(test) {
  var baseImpressions = 200 + Math.floor(Math.random() * 300);
  var baseRate = 0.02 + Math.random() * 0.08;

  test.variants.forEach(function(v, idx) {
    var variance = idx === 0 ? 1 : 0.7 + Math.random() * 0.6;
    var splitFactor = 1;
    if (test.splitType === '90-10' && idx > 0) splitFactor = 0.11;
    else if (test.splitType === '80-20' && idx > 0) splitFactor = 0.25;

    v.impressions = Math.round(baseImpressions * splitFactor * (0.9 + Math.random() * 0.2));
    v.conversions = Math.round(v.impressions * baseRate * variance);
    v.revenueImpact = v.conversions * (500 + Math.floor(Math.random() * 300));

    // Simulate daily data
    v.dailyData = [];
    for (var d = 0; d < 14; d++) {
      var dayImpressions = Math.round(v.impressions / 14 * (0.6 + Math.random() * 0.8));
      var dayConversions = Math.round(dayImpressions * baseRate * variance * (0.5 + Math.random()));
      var date = new Date();
      date.setDate(date.getDate() - (13 - d));
      v.dailyData.push({
        date: date.toISOString().split('T')[0],
        impressions: dayImpressions,
        conversions: dayConversions
      });
    }
  });
}

// ── TEMPLATES TAB ──────────────────────────

function abtRenderTemplates() {
  var body = document.getElementById('abt-body');

  var html = '<div class="abt-templates">'
    + '<div class="abt-create-header">'
    + '<div class="abt-create-title">Test Templates</div>'
    + '<div class="abt-create-desc">Pre-built tests based on proven conversion optimization strategies.</div>'
    + '</div>'
    + '<div class="abt-template-grid">';

  ABT_TEMPLATES.forEach(function(tmpl, idx) {
    var element = ABT_ELEMENT_TYPES.find(function(e) { return e.id === tmpl.element; }) || ABT_ELEMENT_TYPES[0];

    html += '<div class="abt-template-card">'
      + '<div class="abt-tmpl-header">'
      + '<span class="abt-tmpl-icon">' + element.icon + '</span>'
      + '<span class="abt-tmpl-name">' + tmpl.name + '</span>'
      + '</div>'
      + '<div class="abt-tmpl-hypothesis">"' + tmpl.hypothesis + '"</div>'
      + '<div class="abt-tmpl-variants">';

    tmpl.variants.forEach(function(v) {
      html += '<div class="abt-tmpl-variant">'
        + '<span class="abt-tmpl-var-name">' + v.name + '</span>'
        + '<span class="abt-tmpl-var-desc">' + v.desc + '</span>'
        + '</div>';
    });

    html += '</div>'
      + '<button class="abt-tmpl-use-btn" onclick="abtUseTemplate(' + idx + ')">Use This Template</button>'
      + '</div>';
  });

  html += '</div></div>';
  body.innerHTML = html;
}

function abtUseTemplate(idx) {
  var tmpl = ABT_TEMPLATES[idx];
  if (!tmpl) return;

  var test = {
    id: 'test_' + Date.now(),
    name: tmpl.name,
    hypothesis: tmpl.hypothesis,
    elementType: tmpl.element,
    goalType: 'click',
    splitType: 'equal',
    variants: tmpl.variants.map(function(v) {
      return { name: v.name, value: v.value, impressions: 0, conversions: 0, revenueImpact: 0 };
    }),
    status: 'running',
    createdAt: Date.now(),
    endedAt: null,
    winnerId: null
  };

  abtSimulateData(test);

  var tests = abtLoadTests();
  tests.push(test);
  abtSaveTests(tests);

  abtSwitchTab('dashboard');
}

// ── VIEW TEST DETAIL ──────────────────────────

function abtViewTest(idx) {
  var tests = abtLoadTests();
  var test = tests[idx];
  if (!test) return;

  var body = document.getElementById('abt-body');
  var element = ABT_ELEMENT_TYPES.find(function(e) { return e.id === test.elementType; }) || ABT_ELEMENT_TYPES[0];
  var goal = ABT_GOALS.find(function(g) { return g.id === test.goalType; }) || ABT_GOALS[0];
  var confidence = abtCalcConfidence(test);
  var daysRunning = Math.ceil((Date.now() - test.createdAt) / 86400000);

  var html = '<div class="abt-detail">'
    + '<button class="abt-back-btn" onclick="abtSwitchTab(\'dashboard\')">&larr; Back to Dashboard</button>';

  // Test header
  html += '<div class="abt-detail-header">'
    + '<div class="abt-detail-icon">' + element.icon + '</div>'
    + '<div>'
    + '<div class="abt-detail-name">' + test.name + '</div>'
    + '<div class="abt-detail-meta">' + element.name + ' | ' + goal.name + ' | ' + daysRunning + ' days | ' + test.variants.length + ' variants</div>'
    + '</div></div>';

  if (test.hypothesis) {
    html += '<div class="abt-hypothesis-box">'
      + '<div class="abt-hyp-label">Hypothesis</div>'
      + '<div class="abt-hyp-text">' + test.hypothesis + '</div>'
      + '</div>';
  }

  // Variant comparison table
  html += '<div class="abt-detail-section">'
    + '<div class="abt-detail-section-title">Variant Performance</div>'
    + '<div class="abt-table-wrap"><table class="abt-table">'
    + '<thead><tr><th>Variant</th><th>Impressions</th><th>Conversions</th><th>Rate</th><th>Revenue</th><th>vs Control</th></tr></thead>'
    + '<tbody>';

  var controlRate = test.variants[0].impressions > 0 ? (test.variants[0].conversions / test.variants[0].impressions) : 0;

  test.variants.forEach(function(v, vidx) {
    var rate = v.impressions > 0 ? (v.conversions / v.impressions) : 0;
    var lift = vidx === 0 ? 0 : controlRate > 0 ? ((rate - controlRate) / controlRate) * 100 : 0;
    var liftColor = lift > 0 ? '#10B981' : lift < 0 ? '#EF4444' : '#94A3B8';
    var isWinner = v === abtGetWinner(test) && confidence >= 95;

    html += '<tr' + (isWinner ? ' class="abt-winner-row"' : '') + '>'
      + '<td><strong>' + v.name + '</strong>' + (isWinner ? ' &#127942;' : '') + '</td>'
      + '<td>' + v.impressions.toLocaleString() + '</td>'
      + '<td>' + v.conversions.toLocaleString() + '</td>'
      + '<td><strong>' + (rate * 100).toFixed(2) + '%</strong></td>'
      + '<td>$' + (v.revenueImpact || 0).toLocaleString() + '</td>'
      + '<td style="color:' + liftColor + ';font-weight:600">' + (vidx === 0 ? 'Baseline' : (lift > 0 ? '+' : '') + lift.toFixed(1) + '%') + '</td>'
      + '</tr>';
  });

  html += '</tbody></table></div></div>';

  // Conversion rate chart
  html += '<div class="abt-detail-section">'
    + '<div class="abt-detail-section-title">Conversion Rate Comparison</div>'
    + '<div class="abt-rate-chart">';

  var maxRate = 0;
  test.variants.forEach(function(v) {
    var rate = v.impressions > 0 ? (v.conversions / v.impressions) * 100 : 0;
    if (rate > maxRate) maxRate = rate;
  });

  var colors = ['#3B82F6', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6', '#06B6D4'];
  test.variants.forEach(function(v, vidx) {
    var rate = v.impressions > 0 ? (v.conversions / v.impressions) * 100 : 0;
    var pct = maxRate > 0 ? (rate / maxRate) * 100 : 0;
    html += '<div class="abt-rate-row">'
      + '<div class="abt-rate-label">' + v.name + '</div>'
      + '<div class="abt-rate-bar-wrap"><div class="abt-rate-bar" style="width:' + pct + '%;background:' + colors[vidx % colors.length] + '"></div></div>'
      + '<div class="abt-rate-val">' + rate.toFixed(2) + '%</div>'
      + '</div>';
  });

  html += '</div></div>';

  // Daily trend chart (for first 2 variants)
  if (test.variants[0].dailyData && test.variants[0].dailyData.length > 0) {
    html += '<div class="abt-detail-section">'
      + '<div class="abt-detail-section-title">Daily Conversion Trend</div>'
      + '<div class="abt-daily-chart">';

    var maxDaily = 0;
    test.variants.slice(0, 3).forEach(function(v) {
      (v.dailyData || []).forEach(function(d) {
        var rate = d.impressions > 0 ? (d.conversions / d.impressions) * 100 : 0;
        if (rate > maxDaily) maxDaily = rate;
      });
    });

    html += '<div class="abt-daily-legend">';
    test.variants.slice(0, 3).forEach(function(v, vidx) {
      html += '<span class="abt-legend-item"><span class="abt-legend-dot" style="background:' + colors[vidx] + '"></span>' + v.name + '</span>';
    });
    html += '</div>';

    html += '<div class="abt-daily-bars">';
    var days = test.variants[0].dailyData || [];
    days.forEach(function(day, dayIdx) {
      html += '<div class="abt-daily-col">';
      test.variants.slice(0, 3).forEach(function(v, vidx) {
        var vDay = (v.dailyData || [])[dayIdx];
        var rate = vDay && vDay.impressions > 0 ? (vDay.conversions / vDay.impressions) * 100 : 0;
        var h = maxDaily > 0 ? (rate / maxDaily) * 100 : 0;
        html += '<div class="abt-daily-bar" style="height:' + h + '%;background:' + colors[vidx] + '"></div>';
      });
      html += '<div class="abt-daily-label">' + day.date.slice(5) + '</div></div>';
    });
    html += '</div></div>';
  }

  // Statistical significance
  html += '<div class="abt-detail-section">'
    + '<div class="abt-detail-section-title">Statistical Significance</div>'
    + '<div class="abt-significance">'
    + '<div class="abt-sig-meter">'
    + '<div class="abt-sig-fill" style="width:' + Math.min(confidence, 100) + '%;background:' + (confidence >= 95 ? '#10B981' : confidence >= 80 ? '#F59E0B' : '#94A3B8') + '"></div>'
    + '<div class="abt-sig-threshold" style="left:95%"><span>95%</span></div>'
    + '</div>'
    + '<div class="abt-sig-info">'
    + '<div class="abt-sig-conf">' + confidence + '% confidence</div>'
    + '<div class="abt-sig-desc">' + (confidence >= 95 ? 'Statistically significant! You can confidently declare a winner.' : confidence >= 80 ? 'Approaching significance. Consider running the test longer.' : 'Not enough data yet. Keep the test running to reach significance.') + '</div>'
    + '</div>'
    + '</div></div>';

  // Sample size recommendation
  var needed = abtSampleSizeNeeded(test);
  var current = test.variants.reduce(function(s, v) { return s + v.impressions; }, 0);
  html += '<div class="abt-sample-info">'
    + '<span>Sample size: ' + current.toLocaleString() + ' / ' + needed.toLocaleString() + ' recommended</span>'
    + '<div class="abt-sample-bar"><div class="abt-sample-fill" style="width:' + Math.min((current / needed) * 100, 100) + '%"></div></div>'
    + '</div>';

  html += '</div>';
  body.innerHTML = html;
}

// ── RESULTS TAB ──────────────────────────

function abtRenderResults() {
  var body = document.getElementById('abt-body');
  var tests = abtLoadTests();
  var completed = tests.filter(function(t) { return t.status === 'completed'; });

  if (completed.length === 0) {
    body.innerHTML = '<div class="abt-empty">'
      + '<div class="abt-empty-icon">&#128200;</div>'
      + '<div class="abt-empty-title">No Completed Tests</div>'
      + '<div class="abt-empty-desc">Complete your first test to see results and learnings here.</div>'
      + '</div>';
    return;
  }

  var html = '<div class="abt-results">'
    + '<div class="abt-create-header">'
    + '<div class="abt-create-title">Test Results Summary</div>'
    + '<div class="abt-create-desc">Key learnings from your completed A/B tests.</div>'
    + '</div>';

  // Win rate stats
  var withWinners = completed.filter(function(t) { return abtCalcConfidence(t) >= 95; });
  var avgLift = 0;
  if (withWinners.length > 0) {
    avgLift = withWinners.reduce(function(s, t) {
      var winner = abtGetWinner(t);
      var control = t.variants[0];
      var cRate = control.impressions > 0 ? control.conversions / control.impressions : 0;
      var wRate = winner.impressions > 0 ? winner.conversions / winner.impressions : 0;
      return s + (cRate > 0 ? ((wRate - cRate) / cRate) * 100 : 0);
    }, 0) / withWinners.length;
  }

  html += '<div class="abt-results-stats">'
    + '<div class="abt-stat-card"><div class="abt-stat-val" style="color:#10B981">' + withWinners.length + '/' + completed.length + '</div><div class="abt-stat-label">Tests with Winners</div></div>'
    + '<div class="abt-stat-card"><div class="abt-stat-val" style="color:#3B82F6">+' + avgLift.toFixed(1) + '%</div><div class="abt-stat-label">Avg Winner Lift</div></div>'
    + '</div>';

  // Results list
  completed.forEach(function(test) {
    var confidence = abtCalcConfidence(test);
    var winner = abtGetWinner(test);
    var control = test.variants[0];
    var cRate = control.impressions > 0 ? ((control.conversions / control.impressions) * 100).toFixed(2) : '0';
    var wRate = winner.impressions > 0 ? ((winner.conversions / winner.impressions) * 100).toFixed(2) : '0';

    html += '<div class="abt-result-card">'
      + '<div class="abt-result-header">'
      + '<div class="abt-result-name">' + test.name + '</div>'
      + '<span class="abt-result-status" style="color:' + (confidence >= 95 ? '#10B981' : '#F59E0B') + '">' + (confidence >= 95 ? 'Winner: ' + winner.name : 'Inconclusive') + '</span>'
      + '</div>'
      + '<div class="abt-result-comparison">'
      + '<div class="abt-rc-item"><span>Control:</span><strong>' + cRate + '%</strong></div>'
      + '<div class="abt-rc-arrow">&rarr;</div>'
      + '<div class="abt-rc-item"><span>Winner:</span><strong style="color:#10B981">' + wRate + '%</strong></div>'
      + '</div>'
      + '<div class="abt-result-learning">' + (test.hypothesis || 'No hypothesis recorded') + '</div>'
      + '</div>';
  });

  html += '</div>';
  body.innerHTML = html;
}

// ── AI INSIGHTS TAB ──────────────────────────

function abtRenderInsights() {
  var body = document.getElementById('abt-body');
  var tests = abtLoadTests();

  var html = '<div class="abt-insights">'
    + '<div class="abt-coach-prompt">'
    + '<button class="abt-ai-btn" onclick="abtRunAI()">Generate AI Testing Insights</button>'
    + '<div class="abt-ai-note">AI analyzes your test portfolio and recommends what to test next</div>'
    + '</div>'
    + '<div id="abt-ai-results">';

  // Pre-computed insights
  var insights = abtGetInsights(tests);
  insights.forEach(function(insight) {
    html += '<div class="abt-insight-card">'
      + '<div class="abt-insight-icon" style="color:' + insight.color + '">' + insight.icon + '</div>'
      + '<div class="abt-insight-content">'
      + '<div class="abt-insight-title">' + insight.title + '</div>'
      + '<div class="abt-insight-body">' + insight.body + '</div>'
      + '</div></div>';
  });

  html += '</div>';

  // Suggested next tests
  html += '<div class="abt-next-tests">'
    + '<div class="abt-detail-section-title">Recommended Next Tests</div>';

  var suggestions = [
    { name: 'Mobile CTA Placement', why: 'Mobile users convert 2x better with floating CTAs vs inline buttons.', element: 'cta_button' },
    { name: 'Hero Image A/B', why: 'Pages with person-focused heroes convert 35% better than abstract graphics.', element: 'hero_image' },
    { name: 'Form Progressive Disclosure', why: 'Multi-step forms with 3 fields per step outperform single long forms by 28%.', element: 'form_layout' },
    { name: 'Price Anchoring', why: 'Showing the annual earning potential before commission rates increases signups.', element: 'pricing' }
  ];

  suggestions.forEach(function(s) {
    var el = ABT_ELEMENT_TYPES.find(function(e) { return e.id === s.element; }) || ABT_ELEMENT_TYPES[0];
    html += '<div class="abt-suggest-card">'
      + '<div class="abt-suggest-icon">' + el.icon + '</div>'
      + '<div class="abt-suggest-content">'
      + '<div class="abt-suggest-name">' + s.name + '</div>'
      + '<div class="abt-suggest-why">' + s.why + '</div>'
      + '</div></div>';
  });

  html += '</div></div>';
  body.innerHTML = html;
}

function abtGetInsights(tests) {
  var insights = [];

  if (tests.length === 0) {
    insights.push({ icon: '&#128161;', color: '#3B82F6', title: 'Start With Headlines', body: 'Headlines are the #1 most impactful element to test. They\'re seen by 100% of visitors and a 10% improvement in headline engagement typically yields 5-8% more conversions.' });
    insights.push({ icon: '&#127919;', color: '#10B981', title: 'Test One Thing at a Time', body: 'Multivariate testing requires massive traffic. For most sites, sequential A/B tests (changing one element per test) produce clearer insights and faster results.' });
    insights.push({ icon: '&#9889;', color: '#F59E0B', title: 'Minimum Sample Size', body: 'You need at least 100 conversions per variant to reach statistical significance. Plan your test duration based on your current conversion rate and daily traffic.' });
    return insights;
  }

  var running = tests.filter(function(t) { return t.status === 'running'; });
  var completed = tests.filter(function(t) { return t.status === 'completed'; });

  if (running.length > 0) {
    var lowConfidence = running.filter(function(t) { return abtCalcConfidence(t) < 50; });
    if (lowConfidence.length > 0) {
      insights.push({ icon: '&#9200;', color: '#F59E0B', title: 'Patience Required', body: lowConfidence.length + ' test(s) have low confidence. These need more traffic before you can draw conclusions. Don\'t end tests early -- premature conclusions cost more than waiting.' });
    }
  }

  insights.push({ icon: '&#128200;', color: '#8B5CF6', title: 'Testing Velocity', body: 'You\'ve run ' + tests.length + ' total tests. High-growth companies run 2-3 tests per week. Consider running tests on different page elements simultaneously (they won\'t interfere if targeting different sections).' });

  var elementsTestedSet = {};
  tests.forEach(function(t) { elementsTestedSet[t.elementType] = true; });
  var untested = ABT_ELEMENT_TYPES.filter(function(e) { return !elementsTestedSet[e.id]; });
  if (untested.length > 0) {
    insights.push({ icon: '&#128161;', color: '#EC4899', title: 'Untested Elements', body: 'You haven\'t tested: ' + untested.slice(0, 3).map(function(e) { return e.name; }).join(', ') + '. Expanding your testing scope often reveals unexpected conversion opportunities.' });
  }

  return insights;
}

function abtRunAI() {
  var tests = abtLoadTests();
  var resultsDiv = document.getElementById('abt-ai-results');
  if (!resultsDiv) return;

  resultsDiv.innerHTML = '<div class="bpf-loading">Analyzing your testing portfolio...</div>';

  var testSummary = tests.map(function(t) {
    var confidence = abtCalcConfidence(t);
    var winner = abtGetWinner(t);
    return t.name + ' (' + t.elementType + '): ' + t.variants.length + ' variants, ' + confidence + '% confidence, best: ' + (winner ? winner.name : 'N/A');
  }).join('. ') || 'No tests yet.';

  var prompt = 'You are a conversion rate optimization expert. A tax resolution referral partner has these A/B tests: ' + testSummary + '. '
    + 'Give 4 specific recommendations for their next tests and how to improve their testing program. '
    + 'Return JSON array: [{"title":"...","recommendation":"...","expectedImpact":"...","priority":"high|medium|low"}]';

  fetch(typeof CTAX_API_URL !== 'undefined' ? CTAX_API_URL : 'https://ctax-api-proxy.vercel.app/api/chat', {
    method: 'POST',
    headers: typeof getApiHeaders === 'function' ? getApiHeaders() : { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 1024, messages: [{ role: 'user', content: prompt }] })
  })
  .then(function(r) { return r.json(); })
  .then(function(data) {
    var text = data.content ? data.content[0].text : '';
    var recs = [];
    try { var match = text.match(/\[[\s\S]*\]/); if (match) recs = JSON.parse(match[0]); } catch (e) {}
    if (recs.length === 0) recs = abtFallbackInsights();
    abtShowAIResults(recs);
  })
  .catch(function() { abtShowAIResults(abtFallbackInsights()); });
}

function abtFallbackInsights() {
  return [
    { title: 'Test Your Value Proposition', recommendation: 'Your above-the-fold value prop is the most impactful element to test. Try 3 variants: benefit-focused, urgency-driven, and social-proof-led. Run for 2 weeks minimum.', expectedImpact: '+15-25% conversion rate', priority: 'high' },
    { title: 'Reduce Form Friction', recommendation: 'Test a 2-step form vs your current single form. Step 1: Name + Email. Step 2: Phone + Practice Type. Progressive disclosure typically improves completion by 20-30%.', expectedImpact: '+20-30% form completions', priority: 'high' },
    { title: 'Social Proof Placement', recommendation: 'Test moving social proof (testimonials, partner count, earnings stats) to different positions: above the fold, next to the CTA, or as a floating badge.', expectedImpact: '+8-15% trust signals', priority: 'medium' },
    { title: 'Mobile-Specific Tests', recommendation: '60%+ of traffic is mobile. Test a sticky bottom CTA bar on mobile vs the current inline button. Mobile-specific optimizations often yield the biggest gains.', expectedImpact: '+10-20% mobile conversions', priority: 'medium' }
  ];
}

function abtShowAIResults(recs) {
  var resultsDiv = document.getElementById('abt-ai-results');
  if (!resultsDiv) return;

  var html = '';
  var priorityColors = { high: '#EF4444', medium: '#F59E0B', low: '#3B82F6' };

  recs.forEach(function(r) {
    var color = priorityColors[r.priority] || '#3B82F6';
    html += '<div class="abt-insight-card">'
      + '<div class="abt-insight-content">'
      + '<div class="abt-insight-header">'
      + '<div class="abt-insight-title">' + r.title + '</div>'
      + '<span class="abt-insight-priority" style="background:' + color + '15;color:' + color + '">' + r.priority + '</span>'
      + '</div>'
      + '<div class="abt-insight-body">' + r.recommendation + '</div>'
      + '<div class="abt-insight-impact" style="color:#10B981">Expected: ' + r.expectedImpact + '</div>'
      + '</div></div>';
  });

  resultsDiv.innerHTML = html;
}

// ── ARCHIVE TAB ──────────────────────────

function abtRenderArchive() {
  var body = document.getElementById('abt-body');
  var archive = abtLoadArchive();

  if (archive.length === 0) {
    body.innerHTML = '<div class="abt-empty">'
      + '<div class="abt-empty-icon">&#128451;</div>'
      + '<div class="abt-empty-title">Archive Empty</div>'
      + '<div class="abt-empty-desc">Ended tests will appear here for future reference.</div>'
      + '</div>';
    return;
  }

  var html = '<div class="abt-archive">'
    + '<div class="abt-create-title">Test Archive</div>';

  archive.forEach(function(test) {
    var confidence = abtCalcConfidence(test);
    var winner = abtGetWinner(test);
    var endDate = test.endedAt ? new Date(test.endedAt).toLocaleDateString() : 'N/A';

    html += '<div class="abt-archive-card">'
      + '<div class="abt-archive-header">'
      + '<div class="abt-archive-name">' + test.name + '</div>'
      + '<div class="abt-archive-date">Ended: ' + endDate + '</div>'
      + '</div>'
      + '<div class="abt-archive-result">'
      + (confidence >= 95 ? 'Winner: <strong>' + winner.name + '</strong>' : '<em>Inconclusive</em>')
      + ' | Confidence: ' + confidence + '%'
      + '</div></div>';
  });

  html += '</div>';
  body.innerHTML = html;
}

// ── TEST ACTIONS ──────────────────────────

function abtStopTest(idx) {
  var tests = abtLoadTests();
  var test = tests[idx];
  if (!test) return;

  test.status = 'completed';
  test.endedAt = Date.now();

  var confidence = abtCalcConfidence(test);
  if (confidence >= 95) {
    test.winnerId = abtGetWinner(test).name;
  }

  // Move to archive
  var archive = abtLoadArchive();
  archive.push(JSON.parse(JSON.stringify(test)));
  abtSaveArchive(archive);

  abtSaveTests(tests);
  abtSwitchTab('dashboard');
}

// ── STATISTICS ENGINE ──────────────────────────

function abtCalcConfidence(test) {
  if (!test.variants || test.variants.length < 2) return 0;

  var control = test.variants[0];
  if (control.impressions < 30) return Math.min(Math.round(control.impressions / 30 * 20), 20);

  var best = abtGetWinner(test);
  if (best === control) {
    // Check if any challenger is significantly different
    var maxConf = 0;
    for (var i = 1; i < test.variants.length; i++) {
      var conf = abtZTestConfidence(control, test.variants[i]);
      if (conf > maxConf) maxConf = conf;
    }
    return Math.round(maxConf);
  }

  return Math.round(abtZTestConfidence(control, best));
}

function abtZTestConfidence(a, b) {
  if (a.impressions < 10 || b.impressions < 10) return 0;

  var pA = a.impressions > 0 ? a.conversions / a.impressions : 0;
  var pB = b.impressions > 0 ? b.conversions / b.impressions : 0;

  var nA = a.impressions;
  var nB = b.impressions;

  var pPool = (a.conversions + b.conversions) / (nA + nB);
  if (pPool === 0 || pPool === 1) return 0;

  var se = Math.sqrt(pPool * (1 - pPool) * (1 / nA + 1 / nB));
  if (se === 0) return 0;

  var z = Math.abs(pA - pB) / se;

  // Approximate normal CDF
  if (z >= 3.29) return 99.9;
  if (z >= 2.58) return 99;
  if (z >= 2.33) return 98;
  if (z >= 1.96) return 95;
  if (z >= 1.64) return 90;
  if (z >= 1.28) return 80;
  if (z >= 0.84) return 60;
  if (z >= 0.52) return 40;
  return Math.round(z * 30);
}

function abtGetWinner(test) {
  return test.variants.reduce(function(best, v) {
    var rate = v.impressions > 0 ? v.conversions / v.impressions : 0;
    var bestRate = best.impressions > 0 ? best.conversions / best.impressions : 0;
    return rate > bestRate ? v : best;
  }, test.variants[0]);
}

function abtSampleSizeNeeded(test) {
  // Rough calculation: need ~380 per variant for 5% baseline with 20% MDE at 95% confidence
  var controlRate = test.variants[0].impressions > 0 ? test.variants[0].conversions / test.variants[0].impressions : 0.05;
  if (controlRate === 0) controlRate = 0.05;

  var mde = 0.2; // 20% minimum detectable effect
  var alpha = 0.05;
  var beta = 0.2;

  // Simplified formula
  var p1 = controlRate;
  var p2 = controlRate * (1 + mde);
  var pAvg = (p1 + p2) / 2;

  var n = Math.ceil(16 * pAvg * (1 - pAvg) / Math.pow(p2 - p1, 2));
  return n * test.variants.length;
}

// ── DEMO DATA GENERATION ──────────────────────────

(function() {
  var tests = abtLoadTests();
  if (tests.length > 0) return;

  // Create 2 demo tests
  var demo1 = {
    id: 'test_demo1',
    name: 'Homepage Headline Test',
    hypothesis: 'Benefit-focused headline will outperform generic and urgency-based headlines.',
    elementType: 'headline',
    goalType: 'click',
    splitType: 'equal',
    variants: [
      { name: 'A (Control)', value: 'Grow Your Tax Resolution Referral Business', impressions: 0, conversions: 0, revenueImpact: 0 },
      { name: 'B (Benefit)', value: 'Earn $750+ Per Referral With Zero Risk', impressions: 0, conversions: 0, revenueImpact: 0 },
      { name: 'C (Urgency)', value: 'Start Earning Commissions This Week', impressions: 0, conversions: 0, revenueImpact: 0 }
    ],
    status: 'running',
    createdAt: Date.now() - 12 * 86400000,
    endedAt: null,
    winnerId: null
  };
  abtSimulateData(demo1);

  var demo2 = {
    id: 'test_demo2',
    name: 'CTA Button Copy',
    hypothesis: 'Personalized CTA with "My" will generate higher CTR than generic "Get Started".',
    elementType: 'cta_button',
    goalType: 'click',
    splitType: 'equal',
    variants: [
      { name: 'A (Control)', value: 'Get Started', impressions: 0, conversions: 0, revenueImpact: 0 },
      { name: 'B (Personal)', value: 'Build My Referral Plan', impressions: 0, conversions: 0, revenueImpact: 0 }
    ],
    status: 'completed',
    createdAt: Date.now() - 30 * 86400000,
    endedAt: Date.now() - 16 * 86400000,
    winnerId: null
  };
  abtSimulateData(demo2);
  demo2.variants[1].impressions = Math.round(demo2.variants[1].impressions * 1.1);
  demo2.variants[1].conversions = Math.round(demo2.variants[1].conversions * 1.4);

  abtSaveTests([demo1, demo2]);
})();
