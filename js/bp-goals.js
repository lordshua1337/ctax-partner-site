// ══════════════════════════════════════════
//  M5P2C3: GOAL TRACKER WITH ALERTS
//  Set goals, track milestones, progress alerts, AI coaching, achievement system
// ══════════════════════════════════════════

var BPG_STORAGE_KEY = 'bp_goals_v1';
var BPG_ALERTS_KEY = 'bp_goal_alerts';
var BPG_HISTORY_KEY = 'bp_goal_history';

// ── DEFAULT GOAL TEMPLATES ──────────────────────────

var BPG_TEMPLATES = [
  {
    id: 'referrals',
    name: 'Monthly Referrals',
    icon: '&#128101;',
    color: '#3B82F6',
    unit: 'referrals',
    suggestions: [5, 10, 15, 25],
    category: 'growth',
    description: 'Number of qualified referrals submitted per month'
  },
  {
    id: 'revenue',
    name: 'Monthly Revenue',
    icon: '&#128176;',
    color: '#10B981',
    unit: '$',
    suggestions: [2500, 5000, 10000, 25000],
    category: 'financial',
    description: 'Total commission revenue earned per month'
  },
  {
    id: 'conversion',
    name: 'Conversion Rate',
    icon: '&#127919;',
    color: '#8B5CF6',
    unit: '%',
    suggestions: [20, 35, 50, 70],
    category: 'efficiency',
    description: 'Percentage of referrals that convert to paying clients'
  },
  {
    id: 'clients',
    name: 'Active Clients',
    icon: '&#128188;',
    color: '#F59E0B',
    unit: 'clients',
    suggestions: [10, 25, 50, 100],
    category: 'growth',
    description: 'Total number of clients in your active pipeline'
  },
  {
    id: 'roi',
    name: 'Marketing ROI',
    icon: '&#128200;',
    color: '#EC4899',
    unit: '%',
    suggestions: [100, 200, 400, 800],
    category: 'financial',
    description: 'Return on marketing investment percentage'
  },
  {
    id: 'streak',
    name: 'Weekly Activity Streak',
    icon: '&#128293;',
    color: '#EF4444',
    unit: 'weeks',
    suggestions: [4, 8, 12, 26],
    category: 'consistency',
    description: 'Consecutive weeks with at least one referral activity'
  },
  {
    id: 'avg_deal',
    name: 'Average Deal Size',
    icon: '&#128142;',
    color: '#06B6D4',
    unit: '$',
    suggestions: [500, 750, 1000, 2000],
    category: 'financial',
    description: 'Average commission per closed referral'
  },
  {
    id: 'pipeline',
    name: 'Pipeline Value',
    icon: '&#128640;',
    color: '#6366F1',
    unit: '$',
    suggestions: [10000, 25000, 50000, 100000],
    category: 'growth',
    description: 'Total potential revenue in your active pipeline'
  }
];

// ── MILESTONE DEFINITIONS ──────────────────────────

var BPG_MILESTONES = [
  { pct: 10, label: 'Quick Start', badge: 'Momentum Builder', color: '#94A3B8' },
  { pct: 25, label: 'Quarter Way', badge: 'Steady Climber', color: '#3B82F6' },
  { pct: 50, label: 'Halfway There', badge: 'Dedicated Partner', color: '#8B5CF6' },
  { pct: 75, label: 'Home Stretch', badge: 'High Performer', color: '#F59E0B' },
  { pct: 90, label: 'Almost There', badge: 'Elite Closer', color: '#EC4899' },
  { pct: 100, label: 'Goal Achieved', badge: 'Champion', color: '#10B981' },
  { pct: 125, label: 'Overachiever', badge: 'Legendary', color: '#EF4444' }
];

// ── ALERT TYPES ──────────────────────────

var BPG_ALERT_TYPES = [
  { id: 'milestone_hit', label: 'Milestone Reached', icon: '&#127942;', color: '#10B981', priority: 'high' },
  { id: 'pace_warning', label: 'Behind Pace', icon: '&#9888;', color: '#F59E0B', priority: 'medium' },
  { id: 'pace_good', label: 'On Track', icon: '&#9989;', color: '#3B82F6', priority: 'low' },
  { id: 'streak_at_risk', label: 'Streak at Risk', icon: '&#128293;', color: '#EF4444', priority: 'high' },
  { id: 'new_record', label: 'New Personal Best', icon: '&#11088;', color: '#8B5CF6', priority: 'high' },
  { id: 'weekly_summary', label: 'Weekly Summary', icon: '&#128202;', color: '#6366F1', priority: 'medium' },
  { id: 'coaching_tip', label: 'AI Coaching Tip', icon: '&#128161;', color: '#EC4899', priority: 'low' }
];

// ── COACHING TIPS BY CATEGORY ──────────────────────────

var BPG_COACHING_TIPS = {
  growth: [
    { title: 'Expand Your Referral Network', body: 'Partner with 2 new professionals this month who serve similar clients. Estate attorneys, mortgage brokers, and insurance agents all encounter tax debt situations.' },
    { title: 'Leverage Seasonal Trends', body: 'Tax season peaks in March-April. Start your outreach in January to build pipeline before the rush. Partners who prepare early capture 3x more referrals.' },
    { title: 'Client Appreciation Events', body: 'Host a quarterly "Tax Tips" webinar or lunch-and-learn. Existing clients who feel valued refer 40% more than those who don\'t.' },
    { title: 'Follow-Up Cadence', body: 'The optimal follow-up sequence is: same day (thank you), day 3 (value add), day 7 (check-in), day 14 (status update), day 30 (monthly touch). Consistency wins.' },
    { title: 'Ask for Referrals Directly', body: 'The #1 reason partners don\'t get referrals: they don\'t ask. Add "Do you know anyone struggling with tax debt?" to every client conversation.' }
  ],
  financial: [
    { title: 'Track Cost Per Acquisition', body: 'Divide your total marketing spend by closed referrals. If CPA exceeds 30% of average commission, your marketing mix needs adjustment.' },
    { title: 'Reinvest at the Right Time', body: 'Once you hit 3 consistent months of positive ROI, reinvest 20% of profits into scaling your referral engine. This compounds dramatically.' },
    { title: 'Commission Tier Planning', body: 'Review the commission tier structure and map your path to the next tier. Often just 2-3 more referrals per month triggers a significant rate increase.' },
    { title: 'Diversify Revenue Sources', body: 'Don\'t rely on a single referral channel. Partners with 3+ active channels (networking, content, paid, partnerships) have 60% more stable income.' }
  ],
  efficiency: [
    { title: 'Pre-Qualify Before Referring', body: 'Ask 3 screening questions before submitting: (1) Do they owe $10K+? (2) Is it to the IRS, state, or both? (3) Are they willing to work with a professional? This alone can double your conversion rate.' },
    { title: 'Speed to Lead', body: 'Referrals contacted within 1 hour have a 7x higher conversion rate than those contacted after 24 hours. Set up instant notification alerts.' },
    { title: 'Quality Over Quantity', body: '5 well-qualified referrals convert better than 20 cold leads. Focus your energy on identifying genuinely motivated prospects.' }
  ],
  consistency: [
    { title: 'Block Referral Time', body: 'Schedule 30 minutes every morning for referral activities: follow-ups, networking outreach, or content sharing. Habit beats motivation.' },
    { title: 'Weekly Activity Minimum', body: 'Set a non-negotiable weekly minimum: 3 outreach calls, 1 networking event, and 2 follow-ups. Consistency creates compound results.' },
    { title: 'Accountability Partner', body: 'Find another partner in the program and check in weekly. Partners with accountability buddies maintain streaks 3x longer.' }
  ]
};

// ── STATE MANAGEMENT ──────────────────────────

function bpgLoadState() {
  try {
    return JSON.parse(localStorage.getItem(BPG_STORAGE_KEY)) || { goals: [], activeView: 'dashboard' };
  } catch (e) {
    return { goals: [], activeView: 'dashboard' };
  }
}

function bpgSaveState(state) {
  localStorage.setItem(BPG_STORAGE_KEY, JSON.stringify(state));
}

function bpgLoadAlerts() {
  try {
    return JSON.parse(localStorage.getItem(BPG_ALERTS_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function bpgSaveAlerts(alerts) {
  localStorage.setItem(BPG_ALERTS_KEY, JSON.stringify(alerts));
}

function bpgLoadHistory() {
  try {
    return JSON.parse(localStorage.getItem(BPG_HISTORY_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function bpgSaveHistory(history) {
  localStorage.setItem(BPG_HISTORY_KEY, JSON.stringify(history));
}

// ── MAIN MODAL ──────────────────────────

function bpgShowGoals() {
  var existing = document.getElementById('bpg-modal');
  if (existing) existing.remove();

  var overlay = document.createElement('div');
  overlay.className = 'bpg-overlay';
  overlay.id = 'bpg-modal';
  overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };

  var modal = document.createElement('div');
  modal.className = 'bpg-modal';

  modal.innerHTML = '<div class="bpg-header">'
    + '<div><div class="bpg-title">Goal Tracker</div>'
    + '<div class="bpg-subtitle">Set targets, track milestones, and get AI coaching to hit your goals</div></div>'
    + '<button class="bpg-close" onclick="document.getElementById(\'bpg-modal\').remove()">&times;</button>'
    + '</div>'
    + '<div class="bpg-tabs" id="bpg-tabs"></div>'
    + '<div class="bpg-body" id="bpg-body"></div>';

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  bpgRenderTabs('dashboard');
}

function bpgRenderTabs(active) {
  var tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'set', label: 'Set Goals' },
    { id: 'milestones', label: 'Milestones' },
    { id: 'alerts', label: 'Alerts' },
    { id: 'coaching', label: 'AI Coach' },
    { id: 'history', label: 'History' }
  ];

  var html = '';
  var state = bpgLoadState();
  var alerts = bpgLoadAlerts();
  var unread = alerts.filter(function(a) { return !a.read; }).length;

  tabs.forEach(function(t) {
    var badge = '';
    if (t.id === 'alerts' && unread > 0) {
      badge = '<span class="bpg-tab-badge">' + unread + '</span>';
    }
    html += '<button class="bpg-tab' + (t.id === active ? ' bpg-tab-active' : '') + '" onclick="bpgSwitchTab(\'' + t.id + '\')">' + t.label + badge + '</button>';
  });

  document.getElementById('bpg-tabs').innerHTML = html;
  bpgSwitchTab(active);
}

function bpgSwitchTab(tab) {
  var tabs = document.querySelectorAll('.bpg-tab');
  var labels = { dashboard: 'Dashboard', set: 'Set Goals', milestones: 'Milestones', alerts: 'Alerts', coaching: 'AI Coach', history: 'History' };
  tabs.forEach(function(t) {
    var text = t.textContent || t.innerText;
    t.classList.toggle('bpg-tab-active', text.indexOf(labels[tab]) === 0);
  });

  var body = document.getElementById('bpg-body');
  if (!body) return;

  if (tab === 'dashboard') bpgRenderDashboard();
  else if (tab === 'set') bpgRenderSetGoals();
  else if (tab === 'milestones') bpgRenderMilestones();
  else if (tab === 'alerts') bpgRenderAlerts();
  else if (tab === 'coaching') bpgRenderCoaching();
  else if (tab === 'history') bpgRenderHistory();
}

// ── DASHBOARD TAB ──────────────────────────

function bpgRenderDashboard() {
  var body = document.getElementById('bpg-body');
  var state = bpgLoadState();
  var goals = state.goals || [];

  if (goals.length === 0) {
    body.innerHTML = '<div class="bpg-empty">'
      + '<div class="bpg-empty-icon">&#127919;</div>'
      + '<div class="bpg-empty-title">No Goals Set Yet</div>'
      + '<div class="bpg-empty-desc">Set your first goal to start tracking progress and unlocking milestones.</div>'
      + '<button class="bpg-empty-btn" onclick="bpgSwitchTab(\'set\')">Set Your First Goal</button>'
      + '</div>';
    return;
  }

  // Summary stats
  var totalGoals = goals.length;
  var completedGoals = goals.filter(function(g) { return g.current >= g.target; }).length;
  var avgProgress = Math.round(goals.reduce(function(sum, g) { return sum + Math.min((g.current / g.target) * 100, 100); }, 0) / totalGoals);
  var totalMilestones = goals.reduce(function(sum, g) { return sum + (g.milestones || []).length; }, 0);

  var html = '<div class="bpg-dash">';

  // Summary cards
  html += '<div class="bpg-summary-grid">'
    + '<div class="bpg-summary-card"><div class="bpg-summary-val" style="color:#3B82F6">' + totalGoals + '</div><div class="bpg-summary-label">Active Goals</div></div>'
    + '<div class="bpg-summary-card"><div class="bpg-summary-val" style="color:#10B981">' + completedGoals + '</div><div class="bpg-summary-label">Completed</div></div>'
    + '<div class="bpg-summary-card"><div class="bpg-summary-val" style="color:#8B5CF6">' + avgProgress + '%</div><div class="bpg-summary-label">Avg Progress</div></div>'
    + '<div class="bpg-summary-card"><div class="bpg-summary-val" style="color:#F59E0B">' + totalMilestones + '</div><div class="bpg-summary-label">Milestones Hit</div></div>'
    + '</div>';

  // Goal cards
  html += '<div class="bpg-goal-list">';
  goals.forEach(function(goal, idx) {
    var template = BPG_TEMPLATES.find(function(t) { return t.id === goal.templateId; }) || BPG_TEMPLATES[0];
    var pct = Math.min(Math.round((goal.current / goal.target) * 100), 150);
    var isComplete = pct >= 100;
    var daysLeft = bpgDaysLeft(goal.deadline);
    var pace = bpgCalcPace(goal);

    html += '<div class="bpg-goal-card' + (isComplete ? ' bpg-goal-complete' : '') + '">'
      + '<div class="bpg-goal-top">'
      + '<div class="bpg-goal-icon" style="background:' + template.color + '15;color:' + template.color + '">' + template.icon + '</div>'
      + '<div class="bpg-goal-info">'
      + '<div class="bpg-goal-name">' + goal.name + '</div>'
      + '<div class="bpg-goal-target">' + bpgFormatValue(goal.current, template.unit) + ' / ' + bpgFormatValue(goal.target, template.unit) + '</div>'
      + '</div>'
      + '<div class="bpg-goal-pct" style="color:' + (pct >= 100 ? '#10B981' : pct >= 50 ? '#3B82F6' : '#F59E0B') + '">' + pct + '%</div>'
      + '</div>';

    // Progress bar
    html += '<div class="bpg-progress-track">'
      + '<div class="bpg-progress-fill" style="width:' + Math.min(pct, 100) + '%;background:' + template.color + '"></div>';

    // Milestone markers
    BPG_MILESTONES.forEach(function(m) {
      if (m.pct <= 100) {
        html += '<div class="bpg-milestone-marker' + (pct >= m.pct ? ' bpg-mm-hit' : '') + '" style="left:' + m.pct + '%" title="' + m.label + '"></div>';
      }
    });

    html += '</div>';

    // Meta row
    html += '<div class="bpg-goal-meta">';
    if (daysLeft !== null) {
      html += '<span class="bpg-meta-item' + (daysLeft <= 7 ? ' bpg-meta-urgent' : '') + '">'
        + (daysLeft > 0 ? daysLeft + ' days left' : daysLeft === 0 ? 'Due today' : Math.abs(daysLeft) + ' days overdue')
        + '</span>';
    }
    html += '<span class="bpg-meta-item bpg-pace-' + pace.status + '">' + pace.label + '</span>';
    html += '<div class="bpg-goal-actions">'
      + '<button class="bpg-log-btn" onclick="bpgShowLogEntry(' + idx + ')">+ Log Progress</button>'
      + '<button class="bpg-edit-btn" onclick="bpgEditGoal(' + idx + ')">Edit</button>'
      + '</div>';
    html += '</div></div>';
  });

  html += '</div></div>';
  body.innerHTML = html;
}

// ── SET GOALS TAB ──────────────────────────

function bpgRenderSetGoals() {
  var body = document.getElementById('bpg-body');
  var state = bpgLoadState();

  var html = '<div class="bpg-set">'
    + '<div class="bpg-set-header">'
    + '<div class="bpg-set-title">Choose a Goal Template</div>'
    + '<div class="bpg-set-desc">Select a category and customize your target. You can track multiple goals simultaneously.</div>'
    + '</div>';

  // Category filters
  var categories = ['all', 'growth', 'financial', 'efficiency', 'consistency'];
  html += '<div class="bpg-cat-filters">';
  categories.forEach(function(cat) {
    html += '<button class="bpg-cat-btn' + (cat === 'all' ? ' bpg-cat-active' : '') + '" onclick="bpgFilterTemplates(\'' + cat + '\')" data-cat="' + cat + '">'
      + cat.charAt(0).toUpperCase() + cat.slice(1) + '</button>';
  });
  html += '</div>';

  // Template grid
  html += '<div class="bpg-template-grid" id="bpg-template-grid">';
  BPG_TEMPLATES.forEach(function(tmpl) {
    var existing = (state.goals || []).find(function(g) { return g.templateId === tmpl.id; });
    html += '<div class="bpg-template-card" data-category="' + tmpl.category + '"' + (existing ? ' style="opacity:0.5"' : '') + '>'
      + '<div class="bpg-tmpl-icon" style="background:' + tmpl.color + '15;color:' + tmpl.color + '">' + tmpl.icon + '</div>'
      + '<div class="bpg-tmpl-name">' + tmpl.name + '</div>'
      + '<div class="bpg-tmpl-desc">' + tmpl.description + '</div>'
      + '<div class="bpg-tmpl-suggestions">';

    tmpl.suggestions.forEach(function(s) {
      html += '<button class="bpg-suggest-btn" onclick="bpgQuickSetGoal(\'' + tmpl.id + '\',' + s + ')">'
        + bpgFormatValue(s, tmpl.unit) + '</button>';
    });

    html += '</div>';
    if (existing) {
      html += '<div class="bpg-tmpl-existing">Already tracking</div>';
    } else {
      html += '<button class="bpg-tmpl-custom" onclick="bpgCustomGoal(\'' + tmpl.id + '\')">Custom Target</button>';
    }
    html += '</div>';
  });

  html += '</div></div>';
  body.innerHTML = html;
}

function bpgFilterTemplates(cat) {
  document.querySelectorAll('.bpg-cat-btn').forEach(function(btn) {
    btn.classList.toggle('bpg-cat-active', btn.getAttribute('data-cat') === cat);
  });
  document.querySelectorAll('.bpg-template-card').forEach(function(card) {
    card.style.display = (cat === 'all' || card.getAttribute('data-category') === cat) ? '' : 'none';
  });
}

function bpgQuickSetGoal(templateId, target) {
  var tmpl = BPG_TEMPLATES.find(function(t) { return t.id === templateId; });
  if (!tmpl) return;

  var state = bpgLoadState();
  var existing = (state.goals || []).find(function(g) { return g.templateId === templateId; });
  if (existing) return;

  var deadline = new Date();
  deadline.setDate(deadline.getDate() + 90);

  var goal = {
    templateId: templateId,
    name: tmpl.name,
    target: target,
    current: 0,
    startDate: new Date().toISOString().split('T')[0],
    deadline: deadline.toISOString().split('T')[0],
    logs: [],
    milestones: [],
    createdAt: Date.now()
  };

  if (!state.goals) state.goals = [];
  state.goals.push(goal);
  bpgSaveState(state);

  // Generate welcome alert
  bpgAddAlert('milestone_hit', 'Goal Set: ' + tmpl.name, 'You\'ve set a target of ' + bpgFormatValue(target, tmpl.unit) + '. Let\'s crush it!');

  bpgSwitchTab('dashboard');
}

function bpgCustomGoal(templateId) {
  var tmpl = BPG_TEMPLATES.find(function(t) { return t.id === templateId; });
  if (!tmpl) return;

  var body = document.getElementById('bpg-body');
  var html = '<div class="bpg-custom-form">'
    + '<button class="bpg-back-btn" onclick="bpgSwitchTab(\'set\')">&larr; Back to Templates</button>'
    + '<div class="bpg-form-header">'
    + '<div class="bpg-form-icon" style="background:' + tmpl.color + '15;color:' + tmpl.color + '">' + tmpl.icon + '</div>'
    + '<div class="bpg-form-title">' + tmpl.name + '</div>'
    + '</div>'
    + '<div class="bpg-form-fields">'
    + '<div class="bpg-field">'
    + '<label class="bpg-field-label">Goal Name</label>'
    + '<input type="text" class="bpg-input" id="bpg-custom-name" value="' + tmpl.name + '" placeholder="e.g., Monthly Referrals">'
    + '</div>'
    + '<div class="bpg-field">'
    + '<label class="bpg-field-label">Target (' + tmpl.unit + ')</label>'
    + '<input type="number" class="bpg-input" id="bpg-custom-target" placeholder="Enter your target" min="1">'
    + '</div>'
    + '<div class="bpg-field">'
    + '<label class="bpg-field-label">Current Progress (' + tmpl.unit + ')</label>'
    + '<input type="number" class="bpg-input" id="bpg-custom-current" value="0" placeholder="Starting value" min="0">'
    + '</div>'
    + '<div class="bpg-field">'
    + '<label class="bpg-field-label">Deadline</label>'
    + '<input type="date" class="bpg-input" id="bpg-custom-deadline">'
    + '</div>'
    + '</div>'
    + '<button class="bpg-submit-btn" onclick="bpgSaveCustomGoal(\'' + templateId + '\')">Create Goal</button>'
    + '</div>';

  body.innerHTML = html;

  // Set default deadline to 90 days
  var deadline = new Date();
  deadline.setDate(deadline.getDate() + 90);
  document.getElementById('bpg-custom-deadline').value = deadline.toISOString().split('T')[0];
}

function bpgSaveCustomGoal(templateId) {
  var name = document.getElementById('bpg-custom-name').value.trim();
  var target = parseInt(document.getElementById('bpg-custom-target').value);
  var current = parseInt(document.getElementById('bpg-custom-current').value) || 0;
  var deadline = document.getElementById('bpg-custom-deadline').value;

  if (!name || !target || target <= 0) return;

  var state = bpgLoadState();
  var goal = {
    templateId: templateId,
    name: name,
    target: target,
    current: current,
    startDate: new Date().toISOString().split('T')[0],
    deadline: deadline || null,
    logs: [],
    milestones: [],
    createdAt: Date.now()
  };

  if (current > 0) {
    goal.logs.push({ date: new Date().toISOString().split('T')[0], value: current, note: 'Starting value' });
  }

  if (!state.goals) state.goals = [];
  state.goals.push(goal);
  bpgSaveState(state);

  var tmpl = BPG_TEMPLATES.find(function(t) { return t.id === templateId; });
  bpgAddAlert('milestone_hit', 'Goal Created: ' + name, 'Target: ' + bpgFormatValue(target, tmpl ? tmpl.unit : '') + '. You\'re on your way!');

  bpgSwitchTab('dashboard');
}

// ── LOG PROGRESS ──────────────────────────

function bpgShowLogEntry(goalIdx) {
  var state = bpgLoadState();
  var goal = state.goals[goalIdx];
  if (!goal) return;

  var tmpl = BPG_TEMPLATES.find(function(t) { return t.id === goal.templateId; }) || BPG_TEMPLATES[0];

  var body = document.getElementById('bpg-body');
  var html = '<div class="bpg-log-form">'
    + '<button class="bpg-back-btn" onclick="bpgSwitchTab(\'dashboard\')">&larr; Back to Dashboard</button>'
    + '<div class="bpg-log-header">'
    + '<div class="bpg-form-icon" style="background:' + tmpl.color + '15;color:' + tmpl.color + '">' + tmpl.icon + '</div>'
    + '<div><div class="bpg-log-goal-name">' + goal.name + '</div>'
    + '<div class="bpg-log-goal-progress">' + bpgFormatValue(goal.current, tmpl.unit) + ' / ' + bpgFormatValue(goal.target, tmpl.unit) + '</div></div>'
    + '</div>'
    + '<div class="bpg-form-fields">'
    + '<div class="bpg-field">'
    + '<label class="bpg-field-label">New Value (' + tmpl.unit + ')</label>'
    + '<input type="number" class="bpg-input" id="bpg-log-value" placeholder="Enter current progress" value="' + goal.current + '">'
    + '</div>'
    + '<div class="bpg-field">'
    + '<label class="bpg-field-label">Note (optional)</label>'
    + '<input type="text" class="bpg-input" id="bpg-log-note" placeholder="What drove this progress?">'
    + '</div>'
    + '</div>'
    + '<button class="bpg-submit-btn" onclick="bpgSaveLog(' + goalIdx + ')">Log Progress</button>';

  // Recent logs
  if (goal.logs && goal.logs.length > 0) {
    html += '<div class="bpg-recent-logs">'
      + '<div class="bpg-recent-title">Recent Entries</div>';
    goal.logs.slice(-5).reverse().forEach(function(log) {
      html += '<div class="bpg-log-entry">'
        + '<span class="bpg-log-date">' + log.date + '</span>'
        + '<span class="bpg-log-val">' + bpgFormatValue(log.value, tmpl.unit) + '</span>'
        + (log.note ? '<span class="bpg-log-note">' + log.note + '</span>' : '')
        + '</div>';
    });
    html += '</div>';
  }

  html += '</div>';
  body.innerHTML = html;
}

function bpgSaveLog(goalIdx) {
  var newVal = parseInt(document.getElementById('bpg-log-value').value);
  var note = document.getElementById('bpg-log-note').value.trim();
  if (isNaN(newVal)) return;

  var state = bpgLoadState();
  var goal = state.goals[goalIdx];
  if (!goal) return;

  var tmpl = BPG_TEMPLATES.find(function(t) { return t.id === goal.templateId; }) || BPG_TEMPLATES[0];
  var oldVal = goal.current;
  var oldPct = Math.round((oldVal / goal.target) * 100);
  var newPct = Math.round((newVal / goal.target) * 100);

  goal.current = newVal;
  goal.logs.push({
    date: new Date().toISOString().split('T')[0],
    value: newVal,
    note: note || null,
    delta: newVal - oldVal
  });

  // Check milestones
  BPG_MILESTONES.forEach(function(m) {
    if (newPct >= m.pct && oldPct < m.pct) {
      if (!goal.milestones) goal.milestones = [];
      goal.milestones.push({
        pct: m.pct,
        label: m.label,
        badge: m.badge,
        date: new Date().toISOString().split('T')[0]
      });
      bpgAddAlert('milestone_hit', m.badge + ' Unlocked!', goal.name + ' reached ' + m.pct + '% -- ' + m.label + '!');
    }
  });

  // New personal best check
  var maxLog = Math.max.apply(null, goal.logs.map(function(l) { return l.value; }));
  if (newVal === maxLog && newVal > oldVal && goal.logs.length > 1) {
    bpgAddAlert('new_record', 'New Personal Best!', goal.name + ': ' + bpgFormatValue(newVal, tmpl.unit) + '!');
  }

  // Pace check
  var pace = bpgCalcPace(goal);
  if (pace.status === 'behind' && goal.logs.length > 2) {
    bpgAddAlert('pace_warning', 'Pace Warning: ' + goal.name, 'You\'re ' + pace.label + '. Consider increasing your weekly activity to get back on track.');
  }

  // Save to history
  var history = bpgLoadHistory();
  history.push({
    goalId: goal.templateId,
    goalName: goal.name,
    date: new Date().toISOString().split('T')[0],
    oldVal: oldVal,
    newVal: newVal,
    delta: newVal - oldVal,
    pct: newPct
  });
  bpgSaveHistory(history);

  bpgSaveState(state);
  bpgSwitchTab('dashboard');
}

// ── EDIT GOAL ──────────────────────────

function bpgEditGoal(goalIdx) {
  var state = bpgLoadState();
  var goal = state.goals[goalIdx];
  if (!goal) return;

  var tmpl = BPG_TEMPLATES.find(function(t) { return t.id === goal.templateId; }) || BPG_TEMPLATES[0];
  var body = document.getElementById('bpg-body');

  var html = '<div class="bpg-custom-form">'
    + '<button class="bpg-back-btn" onclick="bpgSwitchTab(\'dashboard\')">&larr; Back</button>'
    + '<div class="bpg-form-header">'
    + '<div class="bpg-form-icon" style="background:' + tmpl.color + '15;color:' + tmpl.color + '">' + tmpl.icon + '</div>'
    + '<div class="bpg-form-title">Edit: ' + goal.name + '</div>'
    + '</div>'
    + '<div class="bpg-form-fields">'
    + '<div class="bpg-field"><label class="bpg-field-label">Goal Name</label><input type="text" class="bpg-input" id="bpg-edit-name" value="' + goal.name + '"></div>'
    + '<div class="bpg-field"><label class="bpg-field-label">Target</label><input type="number" class="bpg-input" id="bpg-edit-target" value="' + goal.target + '"></div>'
    + '<div class="bpg-field"><label class="bpg-field-label">Deadline</label><input type="date" class="bpg-input" id="bpg-edit-deadline" value="' + (goal.deadline || '') + '"></div>'
    + '</div>'
    + '<div style="display:flex;gap:10px;margin-top:16px">'
    + '<button class="bpg-submit-btn" onclick="bpgSaveEdit(' + goalIdx + ')">Save Changes</button>'
    + '<button class="bpg-delete-btn" onclick="bpgDeleteGoal(' + goalIdx + ')">Delete Goal</button>'
    + '</div></div>';

  body.innerHTML = html;
}

function bpgSaveEdit(goalIdx) {
  var state = bpgLoadState();
  var goal = state.goals[goalIdx];
  if (!goal) return;

  goal.name = document.getElementById('bpg-edit-name').value.trim() || goal.name;
  goal.target = parseInt(document.getElementById('bpg-edit-target').value) || goal.target;
  goal.deadline = document.getElementById('bpg-edit-deadline').value || goal.deadline;

  bpgSaveState(state);
  bpgSwitchTab('dashboard');
}

function bpgDeleteGoal(goalIdx) {
  var state = bpgLoadState();
  state.goals.splice(goalIdx, 1);
  bpgSaveState(state);
  bpgSwitchTab('dashboard');
}

// ── MILESTONES TAB ──────────────────────────

function bpgRenderMilestones() {
  var body = document.getElementById('bpg-body');
  var state = bpgLoadState();
  var goals = state.goals || [];

  var allMilestones = [];
  goals.forEach(function(goal) {
    var tmpl = BPG_TEMPLATES.find(function(t) { return t.id === goal.templateId; }) || BPG_TEMPLATES[0];
    (goal.milestones || []).forEach(function(m) {
      allMilestones.push(Object.assign({}, m, { goalName: goal.name, goalColor: tmpl.color, goalIcon: tmpl.icon }));
    });
  });

  var html = '<div class="bpg-milestones">';

  // Achievement wall
  html += '<div class="bpg-achieve-header">'
    + '<div class="bpg-achieve-title">Achievement Wall</div>'
    + '<div class="bpg-achieve-count">' + allMilestones.length + ' milestones unlocked</div>'
    + '</div>';

  if (allMilestones.length === 0) {
    html += '<div class="bpg-empty">'
      + '<div class="bpg-empty-icon">&#127942;</div>'
      + '<div class="bpg-empty-title">No Milestones Yet</div>'
      + '<div class="bpg-empty-desc">Hit goal milestones to earn badges and track your achievements here.</div>'
      + '</div>';
  } else {
    // Badge grid
    html += '<div class="bpg-badge-grid">';
    allMilestones.sort(function(a, b) { return new Date(b.date) - new Date(a.date); }).forEach(function(m) {
      html += '<div class="bpg-badge-card">'
        + '<div class="bpg-badge-circle" style="background:' + m.goalColor + '15;border:2px solid ' + m.goalColor + '">'
        + '<span style="color:' + m.goalColor + '">' + m.goalIcon + '</span>'
        + '</div>'
        + '<div class="bpg-badge-name">' + m.badge + '</div>'
        + '<div class="bpg-badge-goal">' + m.goalName + '</div>'
        + '<div class="bpg-badge-date">' + m.date + '</div>'
        + '</div>';
    });
    html += '</div>';
  }

  // Upcoming milestones
  html += '<div class="bpg-upcoming">'
    + '<div class="bpg-achieve-title" style="margin-top:24px">Upcoming Milestones</div>';

  var upcoming = [];
  goals.forEach(function(goal) {
    var tmpl = BPG_TEMPLATES.find(function(t) { return t.id === goal.templateId; }) || BPG_TEMPLATES[0];
    var currentPct = Math.round((goal.current / goal.target) * 100);
    var hitMilestones = (goal.milestones || []).map(function(m) { return m.pct; });

    BPG_MILESTONES.forEach(function(m) {
      if (m.pct > currentPct && hitMilestones.indexOf(m.pct) === -1) {
        var needed = Math.ceil((m.pct / 100) * goal.target) - goal.current;
        upcoming.push({
          goalName: goal.name,
          goalColor: tmpl.color,
          goalUnit: tmpl.unit,
          milestonePct: m.pct,
          milestoneLabel: m.label,
          badge: m.badge,
          needed: needed
        });
      }
    });
  });

  if (upcoming.length === 0) {
    html += '<div class="bpg-empty-desc">All current milestones achieved! Set a bigger goal to unlock more.</div>';
  } else {
    upcoming.sort(function(a, b) { return a.needed - b.needed; });
    upcoming.slice(0, 8).forEach(function(u) {
      html += '<div class="bpg-upcoming-row">'
        + '<div class="bpg-upcoming-badge" style="color:' + u.goalColor + '">' + u.badge + '</div>'
        + '<div class="bpg-upcoming-goal">' + u.goalName + ' (' + u.milestonePct + '%)</div>'
        + '<div class="bpg-upcoming-need">Need ' + bpgFormatValue(u.needed, u.goalUnit) + ' more</div>'
        + '</div>';
    });
  }

  html += '</div></div>';
  body.innerHTML = html;
}

// ── ALERTS TAB ──────────────────────────

function bpgRenderAlerts() {
  var body = document.getElementById('bpg-body');
  var alerts = bpgLoadAlerts();

  var html = '<div class="bpg-alerts">';

  if (alerts.length === 0) {
    html += '<div class="bpg-empty">'
      + '<div class="bpg-empty-icon">&#128276;</div>'
      + '<div class="bpg-empty-title">No Alerts</div>'
      + '<div class="bpg-empty-desc">Alerts appear when you hit milestones, fall behind pace, or achieve personal bests.</div>'
      + '</div>';
  } else {
    html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">'
      + '<div class="bpg-achieve-title">Recent Alerts</div>'
      + '<button class="bpg-clear-btn" onclick="bpgClearAlerts()">Mark All Read</button>'
      + '</div>';

    alerts.sort(function(a, b) { return b.timestamp - a.timestamp; }).forEach(function(alert, idx) {
      var type = BPG_ALERT_TYPES.find(function(t) { return t.id === alert.type; }) || BPG_ALERT_TYPES[0];
      html += '<div class="bpg-alert-card' + (!alert.read ? ' bpg-alert-unread' : '') + '">'
        + '<div class="bpg-alert-icon" style="color:' + type.color + '">' + type.icon + '</div>'
        + '<div class="bpg-alert-content">'
        + '<div class="bpg-alert-title">' + alert.title + '</div>'
        + '<div class="bpg-alert-body">' + alert.body + '</div>'
        + '<div class="bpg-alert-time">' + bpgTimeAgo(alert.timestamp) + '</div>'
        + '</div>'
        + '<span class="bpg-alert-priority bpg-priority-' + type.priority + '">' + type.priority + '</span>'
        + '</div>';
    });
  }

  html += '</div>';
  body.innerHTML = html;

  // Mark all as read
  alerts.forEach(function(a) { a.read = true; });
  bpgSaveAlerts(alerts);
}

function bpgClearAlerts() {
  var alerts = bpgLoadAlerts();
  alerts.forEach(function(a) { a.read = true; });
  bpgSaveAlerts(alerts);
  bpgRenderAlerts();
}

function bpgAddAlert(type, title, body) {
  var alerts = bpgLoadAlerts();
  alerts.push({
    type: type,
    title: title,
    body: body,
    read: false,
    timestamp: Date.now()
  });
  if (alerts.length > 50) alerts = alerts.slice(-50);
  bpgSaveAlerts(alerts);
}

// ── AI COACHING TAB ──────────────────────────

function bpgRenderCoaching() {
  var body = document.getElementById('bpg-body');
  var state = bpgLoadState();
  var goals = state.goals || [];

  var html = '<div class="bpg-coaching">';

  // AI Analysis button
  html += '<div class="bpg-coach-prompt">'
    + '<button class="bpg-coach-btn" onclick="bpgRunCoachAI()">Get Personalized AI Coaching</button>'
    + '<div class="bpg-coach-note">AI analyzes your goals and progress to give specific recommendations</div>'
    + '</div>'
    + '<div id="bpg-coach-results"></div>';

  // Manual coaching tips by category
  var activeCategories = {};
  goals.forEach(function(g) {
    var tmpl = BPG_TEMPLATES.find(function(t) { return t.id === g.templateId; });
    if (tmpl) activeCategories[tmpl.category] = true;
  });

  var relevantCategories = Object.keys(activeCategories);
  if (relevantCategories.length === 0) relevantCategories = ['growth', 'financial'];

  html += '<div class="bpg-tips-section">'
    + '<div class="bpg-tips-title">Coaching Library</div>';

  relevantCategories.forEach(function(cat) {
    var tips = BPG_COACHING_TIPS[cat] || [];
    if (tips.length === 0) return;

    html += '<div class="bpg-tip-category">'
      + '<div class="bpg-tip-cat-name">' + cat.charAt(0).toUpperCase() + cat.slice(1) + ' Tips</div>';

    tips.forEach(function(tip) {
      html += '<div class="bpg-tip-card">'
        + '<div class="bpg-tip-title">' + tip.title + '</div>'
        + '<div class="bpg-tip-body">' + tip.body + '</div>'
        + '</div>';
    });

    html += '</div>';
  });

  html += '</div></div>';
  body.innerHTML = html;
}

function bpgRunCoachAI() {
  var state = bpgLoadState();
  var goals = state.goals || [];
  var resultsDiv = document.getElementById('bpg-coach-results');
  if (!resultsDiv) return;

  resultsDiv.innerHTML = '<div class="bpf-loading">Analyzing your goals and generating coaching recommendations...</div>';

  var goalSummary = goals.map(function(g) {
    var pct = Math.round((g.current / g.target) * 100);
    var pace = bpgCalcPace(g);
    return g.name + ': ' + pct + '% (' + g.current + '/' + g.target + '), pace: ' + pace.label;
  }).join('. ');

  var prompt = 'You are an AI business coach for a tax resolution referral partner. '
    + 'Their current goals: ' + (goalSummary || 'No goals set yet') + '. '
    + 'Give 5 specific, actionable coaching recommendations. Focus on practical tactics they can implement this week. '
    + 'Return JSON array: [{"title":"...","advice":"...","priority":"high|medium|low","timeframe":"..."}]';

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
    if (recs.length === 0) recs = bpgFallbackCoaching(state);
    bpgShowCoachResults(recs);
  })
  .catch(function() { bpgShowCoachResults(bpgFallbackCoaching(state)); });
}

function bpgFallbackCoaching(state) {
  var goals = state.goals || [];
  var hasGrowth = goals.some(function(g) { return g.templateId === 'referrals' || g.templateId === 'clients'; });
  var hasFinancial = goals.some(function(g) { return g.templateId === 'revenue' || g.templateId === 'roi'; });

  return [
    { title: 'Set a Weekly Referral Target', advice: 'Break your monthly goal into weekly targets. If you need 10 referrals/month, aim for 3/week. Weekly targets create urgency and let you course-correct faster.', priority: 'high', timeframe: 'This week' },
    { title: 'Build a Referral Script', advice: 'Create a 30-second elevator pitch for identifying tax debt situations. Practice it until it feels natural. Partners who use scripts consistently refer 2x more than those who wing it.', priority: 'high', timeframe: 'Today' },
    { title: 'Schedule Networking Time', advice: 'Block 2 hours per week for relationship-building activities: coffee meetings, industry events, or LinkedIn outreach. Relationships are the #1 driver of referral volume.', priority: 'medium', timeframe: 'This week' },
    { title: 'Review Your Pipeline Weekly', advice: 'Every Friday, review all pending referrals. Follow up on stalled ones, close out dead ones, and plan next week\'s activities. A clean pipeline converts 40% better.', priority: 'medium', timeframe: 'Every Friday' },
    { title: 'Celebrate Small Wins', advice: 'Acknowledge every milestone -- even small ones. Partners who celebrate progress stay motivated 3x longer than those who only focus on the end goal.', priority: 'low', timeframe: 'Ongoing' }
  ];
}

function bpgShowCoachResults(recs) {
  var resultsDiv = document.getElementById('bpg-coach-results');
  if (!resultsDiv) return;

  var html = '';
  var priorityColors = { high: '#EF4444', medium: '#F59E0B', low: '#3B82F6' };

  recs.forEach(function(r) {
    var color = priorityColors[r.priority] || '#3B82F6';
    html += '<div class="bpg-coach-card">'
      + '<div class="bpg-coach-card-header">'
      + '<div class="bpg-coach-card-title">' + r.title + '</div>'
      + '<span class="bpg-coach-priority" style="background:' + color + '15;color:' + color + '">' + r.priority + '</span>'
      + '</div>'
      + '<div class="bpg-coach-card-body">' + r.advice + '</div>'
      + '<div class="bpg-coach-timeframe">' + r.timeframe + '</div>'
      + '</div>';
  });

  resultsDiv.innerHTML = html;
}

// ── HISTORY TAB ──────────────────────────

function bpgRenderHistory() {
  var body = document.getElementById('bpg-body');
  var history = bpgLoadHistory();
  var state = bpgLoadState();

  var html = '<div class="bpg-history">';

  if (history.length === 0) {
    html += '<div class="bpg-empty">'
      + '<div class="bpg-empty-icon">&#128203;</div>'
      + '<div class="bpg-empty-title">No Progress Logged Yet</div>'
      + '<div class="bpg-empty-desc">Your progress entries will appear here as a timeline.</div>'
      + '</div>';
  } else {
    // Stats overview
    var totalEntries = history.length;
    var totalDelta = history.reduce(function(sum, h) { return sum + Math.max(h.delta, 0); }, 0);
    var uniqueDays = [];
    history.forEach(function(h) { if (uniqueDays.indexOf(h.date) === -1) uniqueDays.push(h.date); });

    html += '<div class="bpg-hist-stats">'
      + '<div class="bpg-hist-stat"><div class="bpg-hist-stat-val">' + totalEntries + '</div><div class="bpg-hist-stat-label">Progress Entries</div></div>'
      + '<div class="bpg-hist-stat"><div class="bpg-hist-stat-val">' + uniqueDays.length + '</div><div class="bpg-hist-stat-label">Active Days</div></div>'
      + '<div class="bpg-hist-stat"><div class="bpg-hist-stat-val">+' + totalDelta + '</div><div class="bpg-hist-stat-label">Total Gains</div></div>'
      + '</div>';

    // Activity heatmap (last 30 days)
    html += '<div class="bpg-heatmap-section">'
      + '<div class="bpg-heatmap-title">30-Day Activity</div>'
      + '<div class="bpg-heatmap">';

    var today = new Date();
    for (var d = 29; d >= 0; d--) {
      var date = new Date(today);
      date.setDate(date.getDate() - d);
      var dateStr = date.toISOString().split('T')[0];
      var dayEntries = history.filter(function(h) { return h.date === dateStr; }).length;
      var intensity = dayEntries === 0 ? 0 : dayEntries === 1 ? 1 : dayEntries <= 3 ? 2 : 3;
      html += '<div class="bpg-heat-cell bpg-heat-' + intensity + '" title="' + dateStr + ': ' + dayEntries + ' entries"></div>';
    }

    html += '</div>'
      + '<div class="bpg-heat-legend"><span>Less</span><div class="bpg-heat-cell bpg-heat-0"></div><div class="bpg-heat-cell bpg-heat-1"></div><div class="bpg-heat-cell bpg-heat-2"></div><div class="bpg-heat-cell bpg-heat-3"></div><span>More</span></div>'
      + '</div>';

    // Timeline
    html += '<div class="bpg-timeline-section">'
      + '<div class="bpg-heatmap-title">Progress Timeline</div>';

    history.slice().reverse().slice(0, 20).forEach(function(h) {
      var deltaColor = h.delta > 0 ? '#10B981' : h.delta < 0 ? '#EF4444' : '#94A3B8';
      var deltaSign = h.delta > 0 ? '+' : '';
      html += '<div class="bpg-timeline-entry">'
        + '<div class="bpg-tl-dot" style="background:' + deltaColor + '"></div>'
        + '<div class="bpg-tl-content">'
        + '<div class="bpg-tl-header">'
        + '<span class="bpg-tl-goal">' + h.goalName + '</span>'
        + '<span class="bpg-tl-delta" style="color:' + deltaColor + '">' + deltaSign + h.delta + '</span>'
        + '</div>'
        + '<div class="bpg-tl-details">' + h.date + ' | Now at ' + h.newVal + ' (' + h.pct + '%)</div>'
        + '</div></div>';
    });

    html += '</div>';
  }

  html += '</div>';
  body.innerHTML = html;
}

// ── UTILITY FUNCTIONS ──────────────────────────

function bpgFormatValue(val, unit) {
  if (unit === '$') return '$' + val.toLocaleString();
  if (unit === '%') return val + '%';
  return val.toLocaleString() + (unit ? ' ' + unit : '');
}

function bpgDaysLeft(deadline) {
  if (!deadline) return null;
  var now = new Date();
  var end = new Date(deadline);
  return Math.ceil((end - now) / (1000 * 60 * 60 * 24));
}

function bpgCalcPace(goal) {
  if (!goal.deadline || !goal.startDate) return { status: 'neutral', label: 'No deadline set' };

  var now = new Date();
  var start = new Date(goal.startDate);
  var end = new Date(goal.deadline);

  var totalDays = Math.max((end - start) / (1000 * 60 * 60 * 24), 1);
  var elapsedDays = Math.max((now - start) / (1000 * 60 * 60 * 24), 0);
  var expectedPct = Math.min((elapsedDays / totalDays) * 100, 100);
  var actualPct = Math.min((goal.current / goal.target) * 100, 100);

  var diff = actualPct - expectedPct;

  if (diff >= 10) return { status: 'ahead', label: 'Ahead of pace' };
  if (diff >= -5) return { status: 'ontrack', label: 'On track' };
  if (diff >= -20) return { status: 'behind', label: 'Behind pace' };
  return { status: 'atrisk', label: 'At risk' };
}

function bpgTimeAgo(timestamp) {
  var diff = Date.now() - timestamp;
  var mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return mins + 'm ago';
  var hours = Math.floor(mins / 60);
  if (hours < 24) return hours + 'h ago';
  var days = Math.floor(hours / 24);
  return days + 'd ago';
}

// ── DEMO DATA GENERATION ──────────────────────────

function bpgGenerateDemo() {
  var state = bpgLoadState();
  if (state.goals && state.goals.length > 0) return;

  // Create 3 starter goals with simulated progress
  var demoGoals = [
    {
      templateId: 'referrals',
      name: 'Monthly Referrals',
      target: 10,
      current: 6,
      startDate: bpgDateOffset(-45),
      deadline: bpgDateOffset(45),
      logs: [
        { date: bpgDateOffset(-45), value: 0, note: 'Starting fresh', delta: 0 },
        { date: bpgDateOffset(-38), value: 1, note: 'First referral!', delta: 1 },
        { date: bpgDateOffset(-30), value: 2, note: 'Getting consistent', delta: 1 },
        { date: bpgDateOffset(-22), value: 3, note: 'Networking event leads', delta: 1 },
        { date: bpgDateOffset(-15), value: 4, note: 'Added insurance partner', delta: 1 },
        { date: bpgDateOffset(-8), value: 5, note: 'Quarterly milestone', delta: 1 },
        { date: bpgDateOffset(-2), value: 6, note: 'Steady growth', delta: 1 }
      ],
      milestones: [
        { pct: 10, label: 'Quick Start', badge: 'Momentum Builder', date: bpgDateOffset(-38) },
        { pct: 25, label: 'Quarter Way', badge: 'Steady Climber', date: bpgDateOffset(-22) },
        { pct: 50, label: 'Halfway There', badge: 'Dedicated Partner', date: bpgDateOffset(-8) }
      ],
      createdAt: Date.now() - 45 * 86400000
    },
    {
      templateId: 'revenue',
      name: 'Monthly Revenue',
      target: 5000,
      current: 3200,
      startDate: bpgDateOffset(-30),
      deadline: bpgDateOffset(60),
      logs: [
        { date: bpgDateOffset(-30), value: 0, note: 'Starting revenue tracking', delta: 0 },
        { date: bpgDateOffset(-21), value: 750, note: 'First commission', delta: 750 },
        { date: bpgDateOffset(-14), value: 1800, note: 'Two closed this week', delta: 1050 },
        { date: bpgDateOffset(-7), value: 2600, note: 'Tax season boost', delta: 800 },
        { date: bpgDateOffset(-1), value: 3200, note: 'Strong momentum', delta: 600 }
      ],
      milestones: [
        { pct: 10, label: 'Quick Start', badge: 'Momentum Builder', date: bpgDateOffset(-21) },
        { pct: 25, label: 'Quarter Way', badge: 'Steady Climber', date: bpgDateOffset(-14) },
        { pct: 50, label: 'Halfway There', badge: 'Dedicated Partner', date: bpgDateOffset(-7) }
      ],
      createdAt: Date.now() - 30 * 86400000
    },
    {
      templateId: 'conversion',
      name: 'Conversion Rate',
      target: 50,
      current: 38,
      startDate: bpgDateOffset(-20),
      deadline: bpgDateOffset(70),
      logs: [
        { date: bpgDateOffset(-20), value: 25, note: 'Baseline measurement', delta: 25 },
        { date: bpgDateOffset(-13), value: 30, note: 'Better pre-qualification', delta: 5 },
        { date: bpgDateOffset(-6), value: 35, note: 'Script improvement', delta: 5 },
        { date: bpgDateOffset(-1), value: 38, note: 'Follow-up cadence working', delta: 3 }
      ],
      milestones: [
        { pct: 50, label: 'Halfway There', badge: 'Dedicated Partner', date: bpgDateOffset(-13) },
        { pct: 75, label: 'Home Stretch', badge: 'High Performer', date: bpgDateOffset(-1) }
      ],
      createdAt: Date.now() - 20 * 86400000
    }
  ];

  state.goals = demoGoals;
  bpgSaveState(state);

  // Generate demo alerts
  var demoAlerts = [
    { type: 'milestone_hit', title: 'Dedicated Partner Unlocked!', body: 'Monthly Referrals reached 50% -- Halfway There!', read: false, timestamp: Date.now() - 172800000 },
    { type: 'pace_good', title: 'On Track: Monthly Revenue', body: 'You\'re slightly ahead of pace for your $5,000 revenue goal.', read: false, timestamp: Date.now() - 86400000 },
    { type: 'new_record', title: 'New Personal Best!', body: 'Conversion Rate: 38%!', read: false, timestamp: Date.now() - 43200000 },
    { type: 'coaching_tip', title: 'Weekly Tip', body: 'Partners who follow up within 1 hour convert 7x more referrals.', read: true, timestamp: Date.now() - 259200000 },
    { type: 'weekly_summary', title: 'Week in Review', body: '+2 referrals, +$800 revenue, conversion rate improved 3%. Keep it up!', read: true, timestamp: Date.now() - 345600000 }
  ];
  bpgSaveAlerts(demoAlerts);

  // Generate demo history
  var demoHistory = [];
  demoGoals.forEach(function(g) {
    g.logs.forEach(function(log) {
      if (log.delta > 0) {
        demoHistory.push({
          goalId: g.templateId,
          goalName: g.name,
          date: log.date,
          oldVal: log.value - log.delta,
          newVal: log.value,
          delta: log.delta,
          pct: Math.round((log.value / g.target) * 100)
        });
      }
    });
  });
  bpgSaveHistory(demoHistory);
}

function bpgDateOffset(days) {
  var d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

// Auto-generate demo on first load
(function() {
  var state = bpgLoadState();
  if (!state.goals || state.goals.length === 0) {
    bpgGenerateDemo();
  }
})();
