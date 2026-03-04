// ══════════════════════════════════════════
//  M3P2C3: ONBOARDING SMART GUIDE
//  Adaptive onboarding with personalized
//  paths, progress milestones, contextual
//  tips, time estimates, and gamification
// ══════════════════════════════════════════

var OBG_STORAGE_KEY = 'ctax_onboard_guide';
var OBG_MILESTONES_KEY = 'ctax_onboard_milestones';

// ── PARTNER TYPE PATHS ─────────────────────────────

var OBG_PATHS = {
  cpa: {
    label: 'CPA / Tax Preparer',
    icon: 'M9 7h6m-6 4h6m-7 4h8M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z',
    color: '#0B5FD8',
    intro: 'You already speak the language of taxes. Your clients trust you with their financial lives. The partner program adds tax resolution as a natural extension of your services.',
    steps: [
      { id: 'profile', title: 'Complete Your Partner Profile', desc: 'Set up your firm name, credentials, and practice details', time: '3 min', section: 'portal-sec-settings', priority: 'required' },
      { id: 'logo', title: 'Upload Your Firm Logo', desc: 'Brand your portal, marketing materials, and client pages', time: '2 min', section: 'portal-sec-settings', priority: 'required' },
      { id: 'video', title: 'Watch: CPA Partner Overview', desc: 'How CPAs generate referral income from existing clients', time: '5 min', priority: 'required' },
      { id: 'icp', title: 'Build Your Ideal Client Profile', desc: 'Define which tax clients are best candidates for resolution', time: '8 min', section: 'portal-sec-icp', priority: 'required' },
      { id: 'scripts', title: 'Generate Your First Script', desc: 'Create a conversation script tailored to CPA-client relationships', time: '5 min', section: 'portal-sec-scripts', priority: 'required' },
      { id: 'referral', title: 'Submit Your First Referral', desc: 'Send a qualified client through the referral form', time: '5 min', section: 'portal-sec-submit', priority: 'required' },
      { id: 'payment', title: 'Set Up Payment Method', desc: 'Add bank details for commission direct deposit', time: '3 min', section: 'portal-sec-settings', priority: 'required' },
      { id: 'training', title: 'Complete Tax Resolution Basics', desc: 'Learn OIC, IA, CNC, and Penalty Abatement fundamentals', time: '20 min', section: 'portal-sec-ce', priority: 'recommended' },
      { id: 'playbook', title: 'Read the Referral Playbook', desc: 'Objection handling, follow-up sequences, and timing strategies', time: '15 min', section: 'portal-sec-playbook', priority: 'recommended' },
      { id: 'planner', title: 'Create Your 90-Day Growth Plan', desc: 'Set referral goals and build a week-by-week execution plan', time: '10 min', section: 'portal-sec-planner', priority: 'optional' },
      { id: 'ads', title: 'Generate Marketing Materials', desc: 'Create branded ads and social content for your practice', time: '8 min', section: 'portal-sec-ad-maker', priority: 'optional' },
      { id: 'page', title: 'Build a Client-Facing Landing Page', desc: 'Create a landing page that captures tax debt leads', time: '15 min', section: 'portal-sec-builder', priority: 'optional' }
    ]
  },
  attorney: {
    label: 'Attorney / Law Firm',
    icon: 'M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3',
    color: '#7C3AED',
    intro: 'Your legal clients often face tax issues they have not disclosed. The partner program lets you connect them with resolution specialists while earning referral fees.',
    steps: [
      { id: 'profile', title: 'Complete Your Partner Profile', desc: 'Set up your firm name, bar number, and practice areas', time: '3 min', section: 'portal-sec-settings', priority: 'required' },
      { id: 'logo', title: 'Upload Your Firm Logo', desc: 'Brand your portal and co-branded materials', time: '2 min', section: 'portal-sec-settings', priority: 'required' },
      { id: 'video', title: 'Watch: Attorney Partner Overview', desc: 'How law firms integrate tax resolution referrals', time: '5 min', priority: 'required' },
      { id: 'training', title: 'Tax Resolution Legal Framework', desc: 'Understand IRS programs and compliance requirements', time: '25 min', section: 'portal-sec-ce', priority: 'required' },
      { id: 'icp', title: 'Build Your Ideal Client Profile', desc: 'Identify which legal clients are candidates for tax resolution', time: '8 min', section: 'portal-sec-icp', priority: 'required' },
      { id: 'scripts', title: 'Generate Legal-Tone Scripts', desc: 'Create professional scripts for attorney-client conversations', time: '5 min', section: 'portal-sec-scripts', priority: 'required' },
      { id: 'payment', title: 'Set Up Payment Method', desc: 'Configure commission payment details', time: '3 min', section: 'portal-sec-settings', priority: 'required' },
      { id: 'referral', title: 'Submit Your First Referral', desc: 'Send a qualified client through the referral form', time: '5 min', section: 'portal-sec-submit', priority: 'required' },
      { id: 'playbook', title: 'Read the Referral Playbook', desc: 'Ethical referral practices, conflict checks, and follow-up', time: '15 min', section: 'portal-sec-playbook', priority: 'recommended' },
      { id: 'planner', title: 'Create Your Growth Plan', desc: 'Set realistic referral targets for your practice', time: '10 min', section: 'portal-sec-planner', priority: 'recommended' }
    ]
  },
  advisor: {
    label: 'Financial Advisor',
    icon: 'M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6',
    color: '#059669',
    intro: 'Your wealth management clients may be hiding tax problems that erode their financial plans. Addressing IRS issues strengthens your advisory relationship.',
    steps: [
      { id: 'profile', title: 'Complete Your Partner Profile', desc: 'Set up your advisory firm details and credentials', time: '3 min', section: 'portal-sec-settings', priority: 'required' },
      { id: 'logo', title: 'Upload Your Firm Logo', desc: 'Brand your portal and client-facing materials', time: '2 min', section: 'portal-sec-settings', priority: 'required' },
      { id: 'video', title: 'Watch: Advisor Partner Overview', desc: 'How advisors discover tax issues during financial planning', time: '5 min', priority: 'required' },
      { id: 'icp', title: 'Build Your Ideal Client Profile', desc: 'Identify wealth management clients with tax resolution needs', time: '8 min', section: 'portal-sec-icp', priority: 'required' },
      { id: 'referral', title: 'Submit Your First Referral', desc: 'Send a client who mentioned IRS issues', time: '5 min', section: 'portal-sec-submit', priority: 'required' },
      { id: 'scripts', title: 'Generate Advisor Scripts', desc: 'Tactful scripts for bringing up tax issues during reviews', time: '5 min', section: 'portal-sec-scripts', priority: 'required' },
      { id: 'payment', title: 'Set Up Payment Method', desc: 'Add bank details for commission payments', time: '3 min', section: 'portal-sec-settings', priority: 'required' },
      { id: 'training', title: 'Tax Resolution for Advisors', desc: 'How tax debt impacts financial plans and estate strategies', time: '20 min', section: 'portal-sec-ce', priority: 'recommended' },
      { id: 'playbook', title: 'Read the Referral Playbook', desc: 'Conversation frameworks and follow-up sequences', time: '15 min', section: 'portal-sec-playbook', priority: 'recommended' },
      { id: 'planner', title: 'Create Your Growth Plan', desc: 'Integrate tax resolution into your advisory practice', time: '10 min', section: 'portal-sec-planner', priority: 'optional' },
      { id: 'page', title: 'Build a Client Resource Page', desc: 'Create a branded page about tax resolution services', time: '15 min', section: 'portal-sec-builder', priority: 'optional' }
    ]
  },
  other: {
    label: 'Other Financial Professional',
    icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75',
    color: '#F59E0B',
    intro: 'Whether you are a mortgage broker, insurance agent, bookkeeper, or real estate professional, your clients trust you with their finances. Tax resolution referrals are a natural fit.',
    steps: [
      { id: 'profile', title: 'Complete Your Partner Profile', desc: 'Set up your business details and contact information', time: '3 min', section: 'portal-sec-settings', priority: 'required' },
      { id: 'logo', title: 'Upload Your Logo', desc: 'Brand your portal and marketing materials', time: '2 min', section: 'portal-sec-settings', priority: 'required' },
      { id: 'video', title: 'Watch: Partner Program Overview', desc: 'How the referral program works and what to expect', time: '5 min', priority: 'required' },
      { id: 'training', title: 'Tax Resolution Basics', desc: 'Learn the fundamentals of IRS resolution programs', time: '20 min', section: 'portal-sec-ce', priority: 'required' },
      { id: 'icp', title: 'Build Your Ideal Client Profile', desc: 'Define your target client for tax resolution referrals', time: '8 min', section: 'portal-sec-icp', priority: 'required' },
      { id: 'scripts', title: 'Generate Your First Script', desc: 'Create conversation scripts for your specific profession', time: '5 min', section: 'portal-sec-scripts', priority: 'required' },
      { id: 'referral', title: 'Submit Your First Referral', desc: 'Send your first client through the referral form', time: '5 min', section: 'portal-sec-submit', priority: 'required' },
      { id: 'payment', title: 'Set Up Payment Method', desc: 'Add bank details for commissions', time: '3 min', section: 'portal-sec-settings', priority: 'required' },
      { id: 'playbook', title: 'Read the Referral Playbook', desc: 'Scripts, objections, and follow-up strategies', time: '15 min', section: 'portal-sec-playbook', priority: 'recommended' },
      { id: 'planner', title: 'Create Your Growth Plan', desc: 'Set goals and build your referral strategy', time: '10 min', section: 'portal-sec-planner', priority: 'optional' }
    ]
  }
};

// ── MILESTONES ──────────────────────────────────────

var OBG_MILESTONES = [
  { id: 'profile_done', title: 'Profile Pro', desc: 'Completed your partner profile', threshold: 2, icon: 'user-check', xp: 10 },
  { id: 'first_tool', title: 'Tool Explorer', desc: 'Used your first AI tool', threshold: 4, icon: 'zap', xp: 15 },
  { id: 'first_referral', title: 'First Referral', desc: 'Submitted your first referral', threshold: 6, icon: 'send', xp: 25 },
  { id: 'halfway', title: 'Halfway There', desc: 'Completed 50% of onboarding', threshold: 'half', icon: 'trending-up', xp: 20 },
  { id: 'fully_onboarded', title: 'Fully Onboarded', desc: 'Completed all required steps', threshold: 'required', icon: 'award', xp: 50 },
  { id: 'overachiever', title: 'Overachiever', desc: 'Completed every step including optional', threshold: 'all', icon: 'star', xp: 75 }
];

// ── MAIN MODAL ──────────────────────────────────────

function obgShowGuide() {
  var existing = document.getElementById('obg-overlay');
  if (existing) existing.remove();

  var overlay = document.createElement('div');
  overlay.id = 'obg-overlay';
  overlay.className = 'obg-overlay';
  overlay.innerHTML = '<div class="obg-modal">' +
    '<div class="obg-header">' +
      '<h2 class="obg-title">Smart Onboarding Guide</h2>' +
      '<p class="obg-subtitle">Your personalized path to partner success</p>' +
      '<button class="obg-close" onclick="obgClose()">&times;</button>' +
    '</div>' +
    '<div class="obg-body" id="obg-body"></div>' +
  '</div>';

  document.body.appendChild(overlay);
  requestAnimationFrame(function() { overlay.classList.add('obg-visible'); });

  var state = obgGetState();
  if (state.path) {
    obgRenderProgress();
  } else {
    obgRenderPathPicker();
  }
}

function obgClose() {
  var overlay = document.getElementById('obg-overlay');
  if (overlay) {
    overlay.classList.remove('obg-visible');
    setTimeout(function() { overlay.remove(); }, 250);
  }
}

// ── STATE MANAGEMENT ──────────────────────────────

function obgGetState() {
  try { return JSON.parse(localStorage.getItem(OBG_STORAGE_KEY)) || {}; }
  catch (e) { return {}; }
}

function obgSaveState(state) {
  try { localStorage.setItem(OBG_STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
}

function obgGetMilestones() {
  try { return JSON.parse(localStorage.getItem(OBG_MILESTONES_KEY)) || []; }
  catch (e) { return []; }
}

function obgSaveMilestones(milestones) {
  try { localStorage.setItem(OBG_MILESTONES_KEY, JSON.stringify(milestones)); } catch (e) {}
}

// ── PATH PICKER ────────────────────────────────────

function obgRenderPathPicker() {
  var body = document.getElementById('obg-body');
  if (!body) return;

  var html = '<div class="obg-picker">';
  html += '<div class="obg-picker-title">What type of professional are you?</div>';
  html += '<p class="obg-picker-desc">We will customize your onboarding path based on your profession for the most relevant experience.</p>';

  html += '<div class="obg-path-grid">';
  var pathKeys = Object.keys(OBG_PATHS);
  for (var i = 0; i < pathKeys.length; i++) {
    var key = pathKeys[i];
    var path = OBG_PATHS[key];
    html += '<button class="obg-path-card" onclick="obgSelectPath(\'' + key + '\')">' +
      '<div class="obg-path-icon" style="color:' + path.color + '"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="' + path.icon + '"/></svg></div>' +
      '<div class="obg-path-label">' + path.label + '</div>' +
      '<div class="obg-path-steps">' + path.steps.length + ' steps</div>' +
    '</button>';
  }
  html += '</div>';
  html += '</div>';

  body.innerHTML = html;
}

function obgSelectPath(pathKey) {
  var path = OBG_PATHS[pathKey];
  if (!path) return;

  var state = {
    path: pathKey,
    completed: [],
    started_at: Date.now(),
    last_activity: Date.now()
  };

  obgSaveState(state);
  if (typeof showToast === 'function') showToast('Path set: ' + path.label, 'copied');
  obgRenderProgress();
}

// ── PROGRESS VIEW ──────────────────────────────────

function obgRenderProgress() {
  var body = document.getElementById('obg-body');
  if (!body) return;

  var state = obgGetState();
  var path = OBG_PATHS[state.path];
  if (!path) { obgRenderPathPicker(); return; }

  var steps = path.steps;
  var completed = state.completed || [];
  var completedCount = completed.length;
  var totalSteps = steps.length;
  var requiredSteps = steps.filter(function(s) { return s.priority === 'required'; });
  var requiredDone = requiredSteps.filter(function(s) { return completed.indexOf(s.id) !== -1; }).length;
  var pct = Math.round((completedCount / totalSteps) * 100);

  // Estimated time remaining
  var remainingMins = 0;
  steps.forEach(function(s) {
    if (completed.indexOf(s.id) === -1) {
      remainingMins += parseInt(s.time) || 5;
    }
  });

  var html = '';

  // Header card with path info
  html += '<div class="obg-progress-header" style="border-left:4px solid ' + path.color + '">';
  html += '<div class="obg-ph-top">';
  html += '<div><div class="obg-ph-path" style="color:' + path.color + '">' + path.label + '</div>';
  html += '<div class="obg-ph-intro">' + path.intro + '</div></div>';
  html += '<button class="obg-btn obg-btn-sm" onclick="obgResetPath()">Change Path</button>';
  html += '</div>';
  html += '<div class="obg-ph-stats">';
  html += '<div class="obg-ph-stat"><span class="obg-ph-num">' + completedCount + '/' + totalSteps + '</span><span class="obg-ph-label">Steps</span></div>';
  html += '<div class="obg-ph-stat"><span class="obg-ph-num">' + requiredDone + '/' + requiredSteps.length + '</span><span class="obg-ph-label">Required</span></div>';
  html += '<div class="obg-ph-stat"><span class="obg-ph-num">' + remainingMins + '</span><span class="obg-ph-label">Min Left</span></div>';
  html += '<div class="obg-ph-stat"><span class="obg-ph-num">' + pct + '%</span><span class="obg-ph-label">Complete</span></div>';
  html += '</div>';
  html += '<div class="obg-progress-bar"><div class="obg-progress-fill" style="width:' + pct + '%;background:' + path.color + '"></div></div>';
  html += '</div>';

  // Milestones row
  var milestones = obgGetMilestones();
  html += '<div class="obg-milestones">';
  html += '<div class="obg-mile-title">Milestones</div>';
  html += '<div class="obg-mile-row">';
  for (var m = 0; m < OBG_MILESTONES.length; m++) {
    var ms = OBG_MILESTONES[m];
    var earned = milestones.indexOf(ms.id) !== -1;
    html += '<div class="obg-mile-badge' + (earned ? ' obg-mile-earned' : '') + '" title="' + ms.desc + '">';
    html += '<div class="obg-mile-icon">' + (earned ? '&#10003;' : '&#9675;') + '</div>';
    html += '<div class="obg-mile-label">' + ms.title + '</div>';
    html += '</div>';
  }
  html += '</div></div>';

  // Steps list -- grouped by priority
  var groups = [
    { key: 'required', label: 'Required Steps', steps: steps.filter(function(s) { return s.priority === 'required'; }) },
    { key: 'recommended', label: 'Recommended', steps: steps.filter(function(s) { return s.priority === 'recommended'; }) },
    { key: 'optional', label: 'Optional / Advanced', steps: steps.filter(function(s) { return s.priority === 'optional'; }) }
  ];

  for (var g = 0; g < groups.length; g++) {
    var group = groups[g];
    if (group.steps.length === 0) continue;

    html += '<div class="obg-step-group">';
    html += '<div class="obg-group-label">' + group.label + '</div>';

    for (var s = 0; s < group.steps.length; s++) {
      var step = group.steps[s];
      var isDone = completed.indexOf(step.id) !== -1;
      var isNext = !isDone && !completed.length ? true : false;
      if (!isNext && !isDone) {
        // Find first incomplete step
        for (var x = 0; x < steps.length; x++) {
          if (completed.indexOf(steps[x].id) === -1) {
            isNext = steps[x].id === step.id;
            break;
          }
        }
      }

      html += '<div class="obg-step' + (isDone ? ' obg-step-done' : '') + (isNext ? ' obg-step-next' : '') + '">';
      html += '<div class="obg-step-check" onclick="obgToggleStep(\'' + step.id + '\')">';
      if (isDone) {
        html += '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
      }
      html += '</div>';
      html += '<div class="obg-step-content">';
      html += '<div class="obg-step-title">' + step.title + (isNext ? ' <span class="obg-next-badge">Up Next</span>' : '') + '</div>';
      html += '<div class="obg-step-desc">' + step.desc + '</div>';
      html += '</div>';
      html += '<div class="obg-step-meta">';
      html += '<span class="obg-step-time">' + step.time + '</span>';
      if (step.section && !isDone) {
        html += '<button class="obg-btn obg-btn-sm obg-btn-go" onclick="obgGoToStep(\'' + step.section + '\')">Go</button>';
      }
      html += '</div>';
      html += '</div>';
    }
    html += '</div>';
  }

  // Contextual tips
  html += obgRenderTips(state, path, completedCount);

  body.innerHTML = html;
}

function obgRenderTips(state, path, completedCount) {
  var tips = [];
  var completed = state.completed || [];

  if (completedCount === 0) {
    tips.push('Start with the first required step -- it only takes ' + (path.steps[0].time || '3 min') + '.');
  } else if (completedCount < 3) {
    tips.push('Great start! Complete the required steps first for the fastest path to your first referral.');
  }

  if (completed.indexOf('icp') === -1 && completedCount >= 2) {
    tips.push('Building your ICP unlocks personalized scripts and qualified leads. It is one of the highest-value steps.');
  }

  if (completed.indexOf('scripts') !== -1 && completed.indexOf('referral') === -1) {
    tips.push('You have scripts ready -- now submit your first referral to start earning commissions.');
  }

  if (completed.indexOf('referral') !== -1 && completed.indexOf('planner') === -1) {
    tips.push('Now that you have submitted a referral, create your 90-Day Growth Plan to set sustainable goals.');
  }

  var requiredSteps = path.steps.filter(function(s) { return s.priority === 'required'; });
  var requiredDone = requiredSteps.filter(function(s) { return completed.indexOf(s.id) !== -1; }).length;
  if (requiredDone === requiredSteps.length && completedCount < path.steps.length) {
    tips.push('All required steps done! The recommended and optional steps will help you maximize your earnings.');
  }

  if (tips.length === 0) return '';

  var html = '<div class="obg-tips">';
  html += '<div class="obg-tips-title">Tips for You</div>';
  for (var i = 0; i < tips.length; i++) {
    html += '<div class="obg-tip-item">' + tips[i] + '</div>';
  }
  html += '</div>';
  return html;
}

// ── STEP ACTIONS ──────────────────────────────────

function obgToggleStep(stepId) {
  var state = obgGetState();
  if (!state.completed) state.completed = [];

  var idx = state.completed.indexOf(stepId);
  if (idx !== -1) {
    state.completed.splice(idx, 1);
  } else {
    state.completed.push(stepId);
    state.last_activity = Date.now();
  }

  obgSaveState(state);
  obgCheckMilestones(state);
  obgRenderProgress();
}

function obgGoToStep(sectionId) {
  obgClose();
  if (typeof portalNav === 'function') {
    var navEl = document.querySelector('[onclick*="' + sectionId + '"]');
    portalNav(navEl, sectionId);
  }
}

function obgResetPath() {
  var state = obgGetState();
  state.path = null;
  obgSaveState(state);
  obgRenderPathPicker();
}

// ── MILESTONE CHECKING ────────────────────────────

function obgCheckMilestones(state) {
  var path = OBG_PATHS[state.path];
  if (!path) return;

  var completed = state.completed || [];
  var milestones = obgGetMilestones();
  var newMilestones = [];

  var requiredSteps = path.steps.filter(function(s) { return s.priority === 'required'; });
  var requiredDone = requiredSteps.filter(function(s) { return completed.indexOf(s.id) !== -1; }).length;

  for (var i = 0; i < OBG_MILESTONES.length; i++) {
    var ms = OBG_MILESTONES[i];
    if (milestones.indexOf(ms.id) !== -1) continue;

    var earned = false;
    if (typeof ms.threshold === 'number') {
      earned = completed.length >= ms.threshold;
    } else if (ms.threshold === 'half') {
      earned = completed.length >= Math.ceil(path.steps.length / 2);
    } else if (ms.threshold === 'required') {
      earned = requiredDone >= requiredSteps.length;
    } else if (ms.threshold === 'all') {
      earned = completed.length >= path.steps.length;
    }

    if (earned) {
      milestones.push(ms.id);
      newMilestones.push(ms);
    }
  }

  if (newMilestones.length > 0) {
    obgSaveMilestones(milestones);
    for (var j = 0; j < newMilestones.length; j++) {
      if (typeof showToast === 'function') {
        showToast('Milestone unlocked: ' + newMilestones[j].title + ' (+' + newMilestones[j].xp + ' XP)', 'copied');
      }
    }
  }
}

// ── UTILITIES ──────────────────────────────────────

function obgEsc(str) {
  if (!str) return '';
  var div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
