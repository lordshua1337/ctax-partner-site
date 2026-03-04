// --- 30-Day Momentum Challenge ---
// Gamified daily challenge system tied to the 90-day growth roadmap.
// Partners earn points for completing daily actions, maintain streaks,
// and compete on a leaderboard.

var CH_STORAGE_KEY = 'ch_30day_v1';

// Identity tiers -- shifts who you "are" as you progress
var CH_IDENTITIES = [
  {
    minDay: 1, maxDay: 7,
    title: 'The Starter',
    sub: 'You showed up. Most people never do. Every tool you set up today is a tool that earns for you tomorrow.',
    quote: '"The secret of getting ahead is getting started." -- Mark Twain'
  },
  {
    minDay: 8, maxDay: 14,
    title: 'The Connector',
    sub: "You're building real relationships that turn into real revenue.",
    quote: '"The people who succeed in referral partnerships don\'t sell -- they solve problems their network already has."'
  },
  {
    minDay: 15, maxDay: 21,
    title: 'The Builder',
    sub: "You're not just referring -- you're building a pipeline. This is where effort becomes income.",
    quote: '"Motivation gets you started. Systems keep you going."'
  },
  {
    minDay: 22, maxDay: 30,
    title: 'The Rainmaker',
    sub: "You've built the habits that separate top earners from everyone else. This is your business now.",
    quote: '"The best time to plant a tree was twenty years ago. The second best time is today."'
  }
];

// Motivational "why it matters" lines for each day's task
var CH_WHY = [
  'This goal becomes your North Star for every action ahead.',
  'Branded materials make you look established -- clients trust that.',
  'Knowledge is the difference between confidence and guessing.',
  'The right words turn awkward conversations into easy referrals.',
  'Naming them makes it real. Real names turn into real commissions.',
  'One email today could be worth $500+ in commission next month.',
  'Objection handling is the #1 skill that separates top earners.',
  'Seeing the numbers makes the effort feel worth it.',
  'Templates save you hours and make you sound polished every time.',
  'Your first referral is the hardest. Everything after gets easier.',
  'Rehearsal builds muscle memory for real conversations.',
  'Social proof attracts clients who already need help.',
  'Get paid on time, every time. No delays on your first check.',
  'Reflection is how you optimize. The data tells the story.',
  'AI does the analysis so you can focus on the relationship.',
  'CE credits + knowledge = a partner who never stops growing.',
  'Follow-ups close more deals than first touches ever do.',
  'Drip sequences work while you sleep. Leverage at its finest.',
  'Tracking progress keeps you accountable and honest.',
  'Momentum compounds. Your second referral builds on the first.',
  'Visibility builds trust. Trust builds a referral pipeline.',
  'Data-driven decisions beat gut feelings every time.',
  'The warm pivot is the single most valuable skill you can learn.',
  'Different messages resonate with different people. Test and learn.',
  'Organization separates professionals from hobbyists.',
  'Pipeline management is the difference between hoping and knowing.',
  'Advanced knowledge makes you the expert clients trust.',
  'Volume is the game now. Confidence lets you move fast.',
  'Goals without deadlines are just wishes.',
  'You did it. 30 days of building something most people never start.'
];

var CH_DAYS = [
  { day: 1, title: 'Set your 90-day referral goal', desc: 'Open the Business Planner and generate your personalized 90-Day Growth Roadmap. Write down your monthly referral target.', pts: 100, tool: 'portal-sec-planner' },
  { day: 2, title: 'Upload your brand assets', desc: 'Go to Settings and upload your logo and brand colors. This enables co-branded materials across all marketing tools.', pts: 100, tool: 'portal-sec-settings' },
  { day: 3, title: 'Complete your first training module', desc: 'Head to Onboarding and finish the Tax Resolution Basics module. Takes about 15 minutes.', pts: 120, tool: 'portal-sec-training' },
  { day: 4, title: 'Build your referral intro script', desc: 'Use the Script Builder to create a natural conversation starter for bringing up IRS resolution with clients.', pts: 150, tool: 'portal-sec-ai-scripts' },
  { day: 5, title: 'Identify 3 potential referral clients', desc: 'Review your client list and identify 3 people who may have unresolved tax debt. Write their names down.', pts: 130, tool: null },
  { day: 6, title: 'Send your first outreach email', desc: 'Use the Marketing Kit to customize a client outreach email template. Send it to at least one of your identified clients.', pts: 150, tool: 'portal-sec-marketing' },
  { day: 7, title: 'Review the Referral Playbook', desc: 'Read through the Scripts tab in the Referral Playbook. Bookmark the objection handlers you think you will use most.', pts: 120, tool: 'portal-sec-playbook' },
  { day: 8, title: 'Run a revenue projection', desc: 'Use the Revenue Calculator to model your expected earnings at 5, 10, and 20 referrals per month.', pts: 100, tool: 'portal-sec-calculator' },
  { day: 9, title: 'Write your first referral intro email', desc: 'Use the Script Builder to generate a warm introduction email for a client you think could benefit from IRS resolution help.', pts: 150, tool: 'portal-sec-ai-scripts' },
  { day: 10, title: 'Submit your first referral', desc: 'Take the plunge and submit your first referral through the portal. It only takes 2 minutes.', pts: 200, tool: 'portal-sec-submit' },
  { day: 11, title: 'Practice an objection response', desc: 'Pick one objection from the Playbook and rehearse your response out loud. Confidence comes from preparation.', pts: 120, tool: 'portal-sec-playbook' },
  { day: 12, title: 'Create a social media ad', desc: 'Use the Ad Maker to build a co-branded social post you can share on LinkedIn or Facebook.', pts: 150, tool: 'portal-sec-ai-admaker' },
  { day: 13, title: 'Set up your payment method', desc: 'Make sure your bank details are on file in Settings so you get paid on time when your first commission hits.', pts: 100, tool: 'portal-sec-settings' },
  { day: 14, title: 'Review your first week progress', desc: 'Check your dashboard metrics. How many clients have you contacted? Any referrals in the pipeline?', pts: 130, tool: 'portal-sec-dashboard' },
  { day: 15, title: 'Qualify a client with the AI tool', desc: 'Use the Client Qualifier to analyze a potential client situation and see their referral strength score.', pts: 150, tool: 'portal-sec-ai-qualifier' },
  { day: 16, title: 'Watch a CE webinar', desc: 'Pick a webinar from CE Webinars that interests you and watch at least 30 minutes. Earn CE credits while you learn.', pts: 130, tool: 'portal-sec-ce' },
  { day: 17, title: 'Follow up with a pending client', desc: 'Check your referrals list and follow up with any client who has not yet responded to your outreach.', pts: 150, tool: 'portal-sec-referrals' },
  { day: 18, title: 'Build an email drip sequence', desc: 'Create 3 follow-up email templates using the Script Builder. Space them out for weekly sends.', pts: 170, tool: 'portal-sec-ai-scripts' },
  { day: 19, title: 'Update your growth roadmap progress', desc: 'Go to Business Planner and check off the tasks you have completed on your 90-Day Roadmap.', pts: 100, tool: 'portal-sec-planner' },
  { day: 20, title: 'Submit another referral', desc: 'By now you should have more warm leads. Submit your second referral through the portal.', pts: 200, tool: 'portal-sec-submit' },
  { day: 21, title: 'Share a marketing asset on social', desc: 'Download an asset from Marketing Kit and post it on your LinkedIn or social media profile.', pts: 150, tool: 'portal-sec-marketing' },
  { day: 22, title: 'Review your earnings projection', desc: 'Check the Revenue Calculator and compare your actual progress against your Day 1 projections.', pts: 120, tool: 'portal-sec-calculator' },
  { day: 23, title: 'Master the cold-to-warm pivot', desc: 'Practice the cold-to-warm conversation pivot from the Playbook with a colleague or friend.', pts: 130, tool: 'portal-sec-playbook' },
  { day: 24, title: 'Generate a new ad creative', desc: 'Create a second ad in Ad Maker with a different template and message. A/B test your outreach.', pts: 150, tool: 'portal-sec-ai-admaker' },
  { day: 25, title: 'Upload a client document', desc: 'If you have any client documents ready, upload them to the Documents section to keep everything organized.', pts: 100, tool: 'portal-sec-documents' },
  { day: 26, title: 'Review your pipeline', desc: 'Check your referral pipeline on the dashboard. How many are in progress? Follow up on any stalled cases.', pts: 130, tool: 'portal-sec-dashboard' },
  { day: 27, title: 'Complete an advanced training module', desc: 'Tackle a more advanced training module like IRS Offer in Compromise or Advanced Objection Handling.', pts: 150, tool: 'portal-sec-training' },
  { day: 28, title: 'Reach out to 3 new prospects', desc: 'Use your refined scripts and templates to contact 3 new potential referral clients today.', pts: 170, tool: null },
  { day: 29, title: 'Set your next 30-day goal', desc: 'Based on what you learned this month, set a specific and measurable goal for your next 30 days.', pts: 130, tool: null },
  { day: 30, title: 'Celebrate and submit a referral', desc: 'You made it to Day 30! Submit a referral to close out strong and carry your momentum into next month.', pts: 250, tool: 'portal-sec-submit' }
];

// ═══ M4P1C1: BADGE SYSTEM ═══
var CH_BADGES = [
  { id: 'first-day', name: 'First Day', desc: 'Completed your first challenge task', icon: '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>', check: function(s) { return chCountDone(s) >= 1; } },
  { id: '3-streak', name: '3-Day Streak', desc: 'Maintained a 3-day streak', icon: '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/><line x1="6" y1="18" x2="6" y2="22"/>', check: function(s) { return s.bestStreak >= 3; } },
  { id: '7-streak', name: '7-Day Streak', desc: 'Maintained a 7-day streak', icon: '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/><circle cx="17" cy="5" r="3"/>', check: function(s) { return s.bestStreak >= 7; } },
  { id: 'week-complete', name: 'Week Complete', desc: 'Completed all 7 days in Week 1', icon: '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><polyline points="9 16 11 18 15 14"/>', check: function(s) { for(var i=1;i<=7;i++) if(!s.completedDays[i]) return false; return true; } },
  { id: '14-day', name: '14-Day Hero', desc: 'Completed 14 challenge tasks', icon: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>', check: function(s) { return chCountDone(s) >= 14; } },
  { id: '21-day', name: '21-Day Warrior', desc: 'Completed 21 challenge tasks', icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>', check: function(s) { return chCountDone(s) >= 21; } },
  { id: 'perfect-month', name: 'Perfect Month', desc: 'Completed all 30 days with zero skips', icon: '<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>', check: function(s) { var skips=0; for(var k in s.skippedDays) if(s.skippedDays[k]) skips++; return chCountDone(s) >= 30 && skips === 0; } }
];

function chCountDone(state) {
  var n = 0;
  for (var k in state.completedDays) {
    if (state.completedDays[k]) n++;
  }
  return n;
}

function chGetState() {
  try {
    var raw = localStorage.getItem(CH_STORAGE_KEY);
    if (!raw) return chDefaultState();
    var parsed = JSON.parse(raw);
    // Ensure new fields exist for backwards compat
    if (!parsed.badges) parsed.badges = {};
    if (typeof parsed.streakFreezes === 'undefined') parsed.streakFreezes = 1;
    if (!parsed.weekFreezeUsed) parsed.weekFreezeUsed = {};
    return parsed;
  } catch (e) {
    return chDefaultState();
  }
}

function chDefaultState() {
  return {
    startDate: new Date().toISOString().slice(0, 10),
    currentDay: 9,
    completedDays: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true, 9: false },
    skippedDays: {},
    points: 1280,
    streak: 9,
    bestStreak: 9,
    badges: {},
    streakFreezes: 1,
    weekFreezeUsed: {}
  };
}

function chSaveState(state) {
  try {
    localStorage.setItem(CH_STORAGE_KEY, JSON.stringify(state));
  } catch (e) { /* quota */ }
}

function chGetIdentity(day) {
  for (var i = 0; i < CH_IDENTITIES.length; i++) {
    if (day >= CH_IDENTITIES[i].minDay && day <= CH_IDENTITIES[i].maxDay) {
      return CH_IDENTITIES[i];
    }
  }
  return CH_IDENTITIES[CH_IDENTITIES.length - 1];
}

function chUpdateIdentity(state) {
  var identity = chGetIdentity(state.currentDay);
  var titleEl = document.getElementById('ch-identity-title');
  var subEl = document.getElementById('ch-identity-sub');
  var quoteEl = document.getElementById('ch-identity-quote');
  var bannerEl = document.getElementById('ch-identity');

  if (titleEl) titleEl.textContent = identity.title;
  if (subEl) subEl.textContent = identity.sub;
  if (quoteEl) quoteEl.textContent = identity.quote;

  // Pulse animation on milestone transitions (day 8, 15, 22)
  if (bannerEl && (state.currentDay === 8 || state.currentDay === 15 || state.currentDay === 22)) {
    bannerEl.classList.add('ch-milestone-pulse');
    setTimeout(function() { bannerEl.classList.remove('ch-milestone-pulse'); }, 700);
  }
}

function chInit() {
  var grid = document.getElementById('ch-grid');
  if (!grid) return;

  var state = chGetState();
  chCheckBadges(state);
  chRenderGrid(state);
  chRenderToday(state);
  chRenderUpcoming(state);
  chUpdateStats(state);
  chUpdateIdentity(state);
  chRenderBadges(state);
  chRenderLeaderboard(state);
  chRenderCatchUp(state);
  chRenderStreakFreeze(state);
  chRenderPostChallenge(state);
  chRenderWhatsNext(state);
  chRenderDigestToggle();
  chStartAutoDetect();
}

function chRenderGrid(state) {
  var grid = document.getElementById('ch-grid');
  if (!grid) return;
  var html = '';
  for (var i = 1; i <= 30; i++) {
    var cls = 'ch-cell';
    var inner = i;
    if (state.completedDays[i]) {
      cls += ' ch-cell-done';
      inner = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
    } else if (state.skippedDays[i]) {
      cls += ' ch-cell-skipped';
    } else if (i === state.currentDay) {
      cls += ' ch-cell-today';
    } else if (i > state.currentDay) {
      cls += ' ch-cell-locked';
    }
    var dayData = CH_DAYS[i - 1];
    html += '<div class="' + cls + '" title="Day ' + i + ': ' + dayData.title + '">' + inner + '</div>';
  }
  grid.innerHTML = html;
}

// Helper: get correct day list based on track
function chGetDays(state) {
  return (state && state.advancedTrack && typeof CH_ADVANCED_DAYS !== 'undefined') ? CH_ADVANCED_DAYS : CH_DAYS;
}

// ═══ M4P2C1: TOOL CONTEXT PRE-FILL MAP ═══
var CH_TOOL_PREFILL = {
  4: { tool: 'portal-sec-ai-scripts', tpl: 0, label: 'Open Script Builder' },
  6: { tool: 'portal-sec-marketing', label: 'Open Marketing Kit' },
  9: { tool: 'portal-sec-ai-scripts', tpl: 1, label: 'Open Script Builder' },
  10: { tool: 'portal-sec-submit', label: 'Submit a Referral' },
  12: { tool: 'portal-sec-ai-admaker', label: 'Open Ad Maker' },
  15: { tool: 'portal-sec-ai-qualifier', label: 'Open Client Qualifier' },
  18: { tool: 'portal-sec-ai-scripts', tpl: 2, label: 'Open Script Builder' },
  20: { tool: 'portal-sec-submit', label: 'Submit a Referral' },
  24: { tool: 'portal-sec-ai-admaker', label: 'Open Ad Maker' },
  30: { tool: 'portal-sec-submit', label: 'Submit a Referral' }
};

function chRenderToday(state) {
  var titleEl = document.getElementById('ch-today-title');
  var descEl = document.getElementById('ch-today-desc');
  var ptsEl = document.querySelector('.ch-today-pts');
  var btnComplete = document.getElementById('ch-btn-complete');
  var todayWrap = document.getElementById('ch-today');

  if (!titleEl || state.currentDay > 30) return;

  var day = CH_DAYS[state.currentDay - 1];
  titleEl.textContent = day.title;
  descEl.textContent = day.desc;
  if (ptsEl) ptsEl.textContent = '+' + day.pts + ' pts';

  // Add "why it matters" motivational line
  var whyEl = document.getElementById('ch-today-why');
  if (!whyEl) {
    whyEl = document.createElement('div');
    whyEl.className = 'ch-today-why';
    whyEl.id = 'ch-today-why';
    descEl.parentNode.insertBefore(whyEl, descEl.nextSibling);
  }
  var whyText = CH_WHY[state.currentDay - 1] || '';
  whyEl.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg> ' + whyText;

  // M4P2: "Start Task" button that auto-navigates to linked tool
  var startBtn = document.getElementById('ch-start-task');
  if (!startBtn) {
    startBtn = document.createElement('button');
    startBtn.id = 'ch-start-task';
    startBtn.className = 'ch-start-task-btn';
    var actionsEl = document.querySelector('.ch-today-actions');
    if (actionsEl) actionsEl.insertBefore(startBtn, actionsEl.firstChild);
  }
  var prefill = CH_TOOL_PREFILL[state.currentDay];
  if (day.tool && !state.completedDays[state.currentDay]) {
    startBtn.style.display = 'inline-flex';
    startBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg> '
      + (prefill ? prefill.label : 'Start Task');
    startBtn.onclick = function() { chStartTask(state.currentDay); };
  } else {
    startBtn.style.display = 'none';
  }

  // M4P2: Tool output preview for completed days
  chRenderTaskOutput(state);

  if (state.completedDays[state.currentDay]) {
    if (todayWrap) todayWrap.classList.add('ch-today-completed');
    if (btnComplete) {
      btnComplete.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Completed';
      btnComplete.disabled = true;
    }
  }
}

function chRenderUpcoming(state) {
  var list = document.getElementById('ch-upcoming-list');
  if (!list) return;
  var html = '';
  var start = state.currentDay + 1;
  for (var i = start; i < start + 3 && i <= 30; i++) {
    var day = CH_DAYS[i - 1];
    html += '<div class="ch-up-card">';
    html += '<div class="ch-up-day">Day ' + i + '</div>';
    html += '<div class="ch-up-info">';
    html += '<div class="ch-up-title">' + day.title + '</div>';
    html += '<div class="ch-up-pts">+' + day.pts + ' pts</div>';
    html += '</div>';
    html += '</div>';
  }
  list.innerHTML = html;
}

function chUpdateStats(state) {
  var dayEl = document.getElementById('ch-hero-day');
  var streakEl = document.getElementById('ch-streak-val');
  var pointsEl = document.getElementById('ch-points');
  var completedEl = document.getElementById('ch-completed');
  var ringFill = document.getElementById('ch-ring-fill');

  var doneDays = 0;
  for (var k in state.completedDays) {
    if (state.completedDays[k]) doneDays++;
  }

  if (dayEl) dayEl.textContent = 'Day ' + state.currentDay;
  if (streakEl) streakEl.textContent = state.streak + '-day streak';
  if (pointsEl) pointsEl.textContent = state.points.toLocaleString();
  if (completedEl) completedEl.textContent = doneDays;

  // Update ring progress (circumference = 2 * PI * 52 = 326.7)
  if (ringFill) {
    var pct = doneDays / 30;
    var circumference = 326.7;
    var offset = circumference - (pct * circumference);
    setTimeout(function() { ringFill.style.strokeDashoffset = offset; }, 100);
  }
}

function chCompleteDay() {
  var state = chGetState();
  if (state.completedDays[state.currentDay]) return;

  var day = CH_DAYS[state.currentDay - 1];
  state.completedDays[state.currentDay] = true;
  state.points = state.points + day.pts;
  state.streak = state.streak + 1;
  if (state.streak > state.bestStreak) state.bestStreak = state.streak;

  // Check for new badges
  var newBadges = chCheckBadges(state);

  chSaveState(state);

  // Animate completion
  var todayWrap = document.getElementById('ch-today');
  if (todayWrap) todayWrap.classList.add('ch-today-completed');

  var btn = document.getElementById('ch-btn-complete');
  if (btn) {
    btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Completed!';
    btn.disabled = true;
  }

  chRenderGrid(state);
  chUpdateStats(state);
  chUpdateIdentity(state);
  chRenderBadges(state);
  chRenderLeaderboard(state);
  chRenderCatchUp(state);

  // Show toast
  if (typeof showToast === 'function') {
    showToast('+' + day.pts + ' points earned! Day ' + state.currentDay + ' complete.', 'success');
  }

  // Milestone celebrations with confetti at Days 7, 14, 21, 30
  var doneDays = chCountDone(state);
  var milestones = {
    7: { title: 'Week 1 Complete!', sub: 'You are now "The Connector." Keep this momentum going!' },
    14: { title: 'Two Weeks Strong!', sub: 'You leveled up to "The Builder." You\'re in the top 30% of partners.' },
    21: { title: 'Three Weeks Crushed!', sub: 'You are now "The Rainmaker." The finish line is in sight.' },
    30: { title: 'Challenge Complete!', sub: 'You finished all 30 days. You are a top-tier partner. Incredible.' }
  };
  if (milestones[doneDays]) {
    setTimeout(function() {
      chShowCelebration(milestones[doneDays].title, milestones[doneDays].sub, doneDays === 30);
    }, 800);
  }

  // Show badge unlock toasts
  if (newBadges && newBadges.length) {
    newBadges.forEach(function(badge, i) {
      setTimeout(function() {
        if (typeof showToast === 'function') {
          showToast('Badge Unlocked: ' + badge.name + '!', 'success');
        }
      }, 1600 + (i * 800));
    });
  }

  // If tool is linked, prompt to navigate
  if (day.tool) {
    setTimeout(function() {
      if (typeof showToast === 'function') {
        showToast('Tip: Open ' + day.title.split(' ').slice(0, 3).join(' ') + '... to follow through.', 'info');
      }
    }, 3000);
  }
}

function chSkipDay() {
  var state = chGetState();
  if (state.completedDays[state.currentDay]) return;

  state.skippedDays[state.currentDay] = true;
  state.currentDay = Math.min(state.currentDay + 1, 31);

  // Streak freeze: if user has a freeze available this week, preserve streak
  var week = Math.ceil(state.currentDay / 7);
  if (state.streakFreezes > 0 && !state.weekFreezeUsed[week]) {
    state.weekFreezeUsed[week] = true;
    state.streakFreezes = Math.max(0, state.streakFreezes - 1);
    // streak preserved
    if (typeof showToast === 'function') {
      showToast('Streak Freeze used! Your ' + state.streak + '-day streak is safe. Skip used for this week.', 'info');
    }
  } else {
    state.streak = 0;
    if (typeof showToast === 'function') {
      showToast('Day skipped. Your streak was reset -- get back on track tomorrow!', 'warning');
    }
  }

  chSaveState(state);
  chRenderGrid(state);
  chRenderToday(state);
  chRenderUpcoming(state);
  chUpdateStats(state);
  chUpdateIdentity(state);
  chRenderBadges(state);
  chRenderLeaderboard(state);
  chRenderCatchUp(state);
  chRenderStreakFreeze(state);
}

function chResetChallenge() {
  try { localStorage.removeItem(CH_STORAGE_KEY); } catch (e) { /* ignore */ }
  chInit();
}

// ═══ M4P1C1: BADGE CHECK + RENDER ═══

function chCheckBadges(state) {
  if (!state.badges) state.badges = {};
  var newlyEarned = [];
  CH_BADGES.forEach(function(badge) {
    if (!state.badges[badge.id] && badge.check(state)) {
      state.badges[badge.id] = Date.now();
      newlyEarned.push(badge);
    }
  });
  return newlyEarned;
}

function chRenderBadges(state) {
  var el = document.getElementById('ch-hero-badges');
  if (!el) return;
  var html = '';
  CH_BADGES.forEach(function(badge) {
    var earned = state.badges && state.badges[badge.id];
    var cls = 'ch-badge-v2' + (earned ? ' ch-badge-v2-earned' : '');
    html += '<div class="' + cls + '" title="' + badge.name + (earned ? '' : ' (Locked)') + '">'
      + '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + badge.icon + '</svg>'
      + '<div class="ch-badge-v2-label">' + badge.name + '</div>'
      + '</div>';
  });
  el.innerHTML = html;
}

// ═══ M4P1C1: MILESTONE CELEBRATION WITH CONFETTI ═══

function chShowCelebration(title, sub, isFinal) {
  // Create overlay
  var overlay = document.createElement('div');
  overlay.className = 'ch-celebrate-overlay';
  overlay.id = 'ch-celebrate-overlay';
  overlay.onclick = function(e) { if (e.target === overlay) chCloseCelebration(); };

  overlay.innerHTML = '<div class="ch-celebrate-modal">'
    + '<div class="ch-celebrate-confetti" id="ch-celebrate-confetti"></div>'
    + '<div class="ch-celebrate-content">'
    + '<div class="ch-celebrate-icon">' + (isFinal
      ? '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#FFD700" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>'
      : '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>')
    + '</div>'
    + '<div class="ch-celebrate-title">' + title + '</div>'
    + '<div class="ch-celebrate-sub">' + sub + '</div>'
    + '<button class="ch-celebrate-btn" onclick="chCloseCelebration()">Keep Going</button>'
    + '</div>'
    + '</div>';

  document.body.appendChild(overlay);
  requestAnimationFrame(function() { overlay.classList.add('ch-celebrate-open'); });

  // Launch confetti particles
  chLaunchConfetti();
}

function chCloseCelebration() {
  var overlay = document.getElementById('ch-celebrate-overlay');
  if (overlay) {
    overlay.classList.remove('ch-celebrate-open');
    setTimeout(function() { if (overlay.parentNode) overlay.parentNode.removeChild(overlay); }, 300);
  }
}

function chLaunchConfetti() {
  var container = document.getElementById('ch-celebrate-confetti');
  if (!container) return;

  var colors = ['#0B5FD8', '#00C8E0', '#FFD700', '#FF6B6B', '#8B5CF6', '#10B981', '#F59E0B'];
  var shapes = ['circle', 'square', 'rect'];

  for (var i = 0; i < 60; i++) {
    var particle = document.createElement('div');
    particle.className = 'ch-confetti-particle';
    var color = colors[Math.floor(Math.random() * colors.length)];
    var shape = shapes[Math.floor(Math.random() * shapes.length)];
    var size = 6 + Math.random() * 6;
    var left = 10 + Math.random() * 80;
    var delay = Math.random() * 0.6;
    var dur = 2 + Math.random() * 1.5;
    var rotation = Math.random() * 360;

    particle.style.cssText = 'position:absolute;left:' + left + '%;top:-10px;'
      + 'width:' + (shape === 'rect' ? size * 2 : size) + 'px;'
      + 'height:' + size + 'px;'
      + 'background:' + color + ';'
      + (shape === 'circle' ? 'border-radius:50%;' : 'border-radius:1px;')
      + 'animation:chConfettiFall ' + dur + 's ease-in ' + delay + 's forwards;'
      + 'transform:rotate(' + rotation + 'deg);'
      + 'opacity:0.9;';

    container.appendChild(particle);
  }
}

// ═══ M4P1C1: DYNAMIC LEADERBOARD ═══

function chRenderLeaderboard(state) {
  var el = document.querySelector('.ch-lb-list');
  if (!el) return;

  var doneDays = chCountDone(state);
  var userPts = state.points || 0;

  // Static competitors + user data
  var entries = [
    { name: 'S. Patel', init: 'SP', day: 30, pts: 4500, color: '#FFD700' },
    { name: 'J. Lopez', init: 'JL', day: 28, pts: 4200, color: '#C0C0C0' },
    { name: 'A. Wright', init: 'AW', day: 24, pts: 3600, color: '#CD7F32' },
    { name: 'M. Chen', init: 'MC', day: 20, pts: 2900, color: '#8B5CF6' },
    { name: 'R. Kumar', init: 'RK', day: 18, pts: 2600, color: '#10B981' },
    { name: 'K. Davis', init: 'KD', day: 15, pts: 2100, color: '#F59E0B' },
    { name: 'T. Nguyen', init: 'TN', day: 12, pts: 1700, color: '#EC4899' },
    { name: 'You', init: 'JH', day: state.currentDay, pts: userPts, color: 'var(--blue)', isUser: true }
  ];

  // Sort by points descending
  entries.sort(function(a, b) { return b.pts - a.pts; });

  var html = '';
  entries.forEach(function(e, i) {
    var rank = i + 1;
    var cls = 'ch-lb-row' + (e.isUser ? ' ch-lb-row-you' : '');
    if (rank <= 3) cls += ' ch-lb-row-top3';
    html += '<div class="' + cls + '">'
      + '<div class="ch-lb-rank">' + rank + '</div>'
      + '<div class="ch-lb-avatar" style="background:' + e.color + '">' + e.init + '</div>'
      + '<div class="ch-lb-info"><div class="ch-lb-name">' + e.name + '</div><div class="ch-lb-day">Day ' + e.day + '</div></div>'
      + '<div class="ch-lb-pts">' + e.pts.toLocaleString() + ' pts</div>'
      + '</div>';
  });

  el.innerHTML = html;

  // Update rank stat
  var rankEl = document.getElementById('ch-rank');
  var userRank = entries.findIndex(function(e) { return e.isUser; }) + 1;
  if (rankEl) {
    var pct = Math.round(((entries.length - userRank) / entries.length) * 100);
    rankEl.textContent = 'Top ' + Math.max(5, pct) + '%';
  }
}

// ═══ M4P1C1: CATCH-UP MODE ═══

function chRenderCatchUp(state) {
  var container = document.getElementById('ch-catchup');
  if (!container) return;

  // Find skipped days that haven't been caught up
  var skippedList = [];
  for (var k in state.skippedDays) {
    if (state.skippedDays[k] && !state.completedDays[k]) {
      skippedList.push(parseInt(k, 10));
    }
  }
  skippedList.sort(function(a, b) { return a - b; });

  if (!skippedList.length) {
    container.style.display = 'none';
    return;
  }

  container.style.display = 'block';
  var html = '<div class="ch-catchup-header">'
    + '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 105.64-8.36"/></svg>'
    + '<span>Catch-Up Mode</span>'
    + '<span class="ch-catchup-count">' + skippedList.length + ' skipped</span>'
    + '</div>'
    + '<div class="ch-catchup-desc">Complete skipped tasks to earn bonus points and fill gaps in your journey.</div>'
    + '<div class="ch-catchup-list">';

  skippedList.forEach(function(d) {
    var task = CH_DAYS[d - 1];
    var bonus = Math.round(task.pts * 0.5);
    html += '<div class="ch-catchup-card">'
      + '<div class="ch-catchup-day">Day ' + d + '</div>'
      + '<div class="ch-catchup-info">'
      + '<div class="ch-catchup-title">' + task.title + '</div>'
      + '<div class="ch-catchup-bonus">+' + bonus + ' bonus pts</div>'
      + '</div>'
      + '<button class="ch-catchup-btn" onclick="chCatchUpDay(' + d + ')">Catch Up</button>'
      + '</div>';
  });

  html += '</div>';
  container.innerHTML = html;
}

function chCatchUpDay(dayNum) {
  var state = chGetState();
  if (state.completedDays[dayNum]) return;

  var task = CH_DAYS[dayNum - 1];
  var bonus = Math.round(task.pts * 0.5);

  state.completedDays[dayNum] = true;
  delete state.skippedDays[dayNum];
  state.points = state.points + bonus;

  var newBadges = chCheckBadges(state);
  chSaveState(state);

  chRenderGrid(state);
  chUpdateStats(state);
  chRenderBadges(state);
  chRenderLeaderboard(state);
  chRenderCatchUp(state);

  if (typeof showToast === 'function') {
    showToast('Day ' + dayNum + ' caught up! +' + bonus + ' bonus points.', 'success');
  }

  // Check milestones
  var doneDays = chCountDone(state);
  var milestones = {
    7: { title: 'Week 1 Complete!', sub: 'You caught up and earned it!' },
    14: { title: 'Two Weeks Strong!', sub: 'Catch-up mode paid off!' },
    21: { title: 'Three Weeks Crushed!', sub: 'The persistence is paying off!' },
    30: { title: 'Challenge Complete!', sub: 'Every single day accounted for!' }
  };
  if (milestones[doneDays]) {
    setTimeout(function() {
      chShowCelebration(milestones[doneDays].title, milestones[doneDays].sub, doneDays === 30);
    }, 600);
  }

  if (newBadges && newBadges.length) {
    newBadges.forEach(function(badge, i) {
      setTimeout(function() {
        if (typeof showToast === 'function') showToast('Badge Unlocked: ' + badge.name + '!', 'success');
      }, 1200 + (i * 800));
    });
  }
}

// ═══ M4P1C1: STREAK FREEZE ═══

function chRenderStreakFreeze(state) {
  var el = document.getElementById('ch-streak-freeze');
  if (!el) return;

  var freezes = state.streakFreezes || 0;
  var week = Math.ceil(state.currentDay / 7);
  var usedThisWeek = state.weekFreezeUsed && state.weekFreezeUsed[week];

  el.innerHTML = '<div class="ch-freeze-inner">'
    + '<div class="ch-freeze-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07"/></svg></div>'
    + '<div class="ch-freeze-info">'
    + '<div class="ch-freeze-label">Streak Freeze</div>'
    + '<div class="ch-freeze-desc">' + (freezes > 0
      ? (usedThisWeek ? 'Used this week. Resets next week.' : freezes + ' available -- skip a day without losing your streak')
      : 'No freezes available. Complete 7+ days to earn one.') + '</div>'
    + '</div>'
    + '<div class="ch-freeze-count">' + freezes + '</div>'
    + '</div>';

  // Award a new freeze at every 7 completed days
  var done = chCountDone(state);
  var freezesEarned = Math.floor(done / 7);
  var freezesUsed = 0;
  for (var k in state.weekFreezeUsed) {
    if (state.weekFreezeUsed[k]) freezesUsed++;
  }
  var shouldHave = Math.max(0, freezesEarned - freezesUsed);
  if (shouldHave > state.streakFreezes) {
    state.streakFreezes = shouldHave;
    chSaveState(state);
  }
}

// ═══ M4P2C1: SMART TASK LINKING ═══

// Navigate to linked tool and pre-fill context
function chStartTask(dayNum) {
  var day = CH_DAYS[dayNum - 1];
  if (!day || !day.tool) return;

  var prefill = CH_TOOL_PREFILL[dayNum];

  // Navigate to the tool section
  if (typeof portalNav === 'function') {
    var navItem = document.querySelector('[onclick*="' + day.tool + '"]');
    if (navItem) {
      portalNav(navItem, day.tool);
    }
  }

  // Pre-fill tool context where possible
  if (prefill && prefill.tpl !== undefined) {
    // Script Builder: select template
    setTimeout(function() {
      if (typeof sbUseTemplate === 'function') {
        sbUseTemplate(prefill.tpl);
      }
    }, 500);
  }

  // Track that user started this task
  try {
    var starts = JSON.parse(localStorage.getItem('ctax_ch_task_starts') || '{}');
    starts[dayNum] = Date.now();
    localStorage.setItem('ctax_ch_task_starts', JSON.stringify(starts));
  } catch (e) {}

  if (typeof showToast === 'function') {
    showToast('Day ' + dayNum + ' task opened. Complete it and come back to mark it done!', 'info');
  }
}

// Auto-detect task completion based on tool usage
function chAutoDetect() {
  var state = chGetState();
  if (state.completedDays[state.currentDay]) return;

  var day = CH_DAYS[state.currentDay - 1];
  if (!day || !day.tool) return;

  var detected = false;
  var toolKey = day.tool;

  // Check tool history for recent activity matching today's task
  if (typeof getToolHistory === 'function') {
    var history = getToolHistory();
    var now = Date.now();
    var fiveMinAgo = now - (5 * 60 * 1000);

    // Map challenge tool targets to tool history types
    var toolTypeMap = {
      'portal-sec-ai-scripts': 'script-builder',
      'portal-sec-ai-admaker': 'ad-maker',
      'portal-sec-ai-qualifier': 'client-qualifier'
    };

    var historyType = toolTypeMap[toolKey];
    if (historyType) {
      for (var i = history.length - 1; i >= 0; i--) {
        if (history[i].tool === historyType && history[i].timestamp > fiveMinAgo) {
          detected = true;
          break;
        }
      }
    }
  }

  // Check for referral submission (submit section usage)
  if (toolKey === 'portal-sec-submit') {
    try {
      var subCount = parseInt(localStorage.getItem('ctax_referral_count') || '0', 10);
      var lastSub = parseInt(localStorage.getItem('ctax_last_referral_ts') || '0', 10);
      if (lastSub > Date.now() - (10 * 60 * 1000)) {
        detected = true;
      }
    } catch (e) {}
  }

  if (detected) {
    // Show auto-completion prompt
    chShowAutoDetectPrompt(state.currentDay, day);
  }
}

function chShowAutoDetectPrompt(dayNum, day) {
  var el = document.getElementById('ch-auto-detect');
  if (!el) {
    el = document.createElement('div');
    el.id = 'ch-auto-detect';
    el.className = 'ch-auto-detect';
    var todayCard = document.getElementById('ch-today');
    if (todayCard) todayCard.parentNode.insertBefore(el, todayCard.nextSibling);
  }

  el.innerHTML = '<div class="ch-ad-inner">'
    + '<div class="ch-ad-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>'
    + '<div class="ch-ad-content">'
    + '<div class="ch-ad-title">Task Detected!</div>'
    + '<div class="ch-ad-text">It looks like you just completed "' + day.title + '." Mark it done?</div>'
    + '</div>'
    + '<button class="ch-ad-btn" onclick="chCompleteDay();this.closest(\'.ch-auto-detect\').style.display=\'none\'">Complete +' + day.pts + ' pts</button>'
    + '</div>';
  el.style.display = 'block';
}

// Render tool output preview for completed tasks
function chRenderTaskOutput(state) {
  var el = document.getElementById('ch-task-output');
  if (!el) {
    el = document.createElement('div');
    el.id = 'ch-task-output';
    el.className = 'ch-task-output';
    var todayCard = document.getElementById('ch-today');
    if (todayCard) todayCard.parentNode.insertBefore(el, todayCard.nextSibling);
  }

  if (!state.completedDays[state.currentDay]) {
    el.style.display = 'none';
    return;
  }

  // Find the most recent tool output related to today's task
  var day = CH_DAYS[state.currentDay - 1];
  var toolTypeMap = {
    'portal-sec-ai-scripts': 'script-builder',
    'portal-sec-ai-admaker': 'ad-maker',
    'portal-sec-ai-qualifier': 'client-qualifier'
  };

  var historyType = toolTypeMap[day.tool];
  var output = null;

  if (historyType && typeof getToolHistory === 'function') {
    var history = getToolHistory();
    for (var i = history.length - 1; i >= 0; i--) {
      if (history[i].tool === historyType) {
        output = history[i];
        break;
      }
    }
  }

  if (output) {
    var preview = (output.title || output.summary || '').substring(0, 120);
    el.style.display = 'block';
    el.innerHTML = '<div class="ch-to-inner">'
      + '<div class="ch-to-badge">Created Today</div>'
      + '<div class="ch-to-preview">"' + preview + (preview.length >= 120 ? '...' : '') + '"</div>'
      + '<div class="ch-to-tool">' + (historyType || 'Tool').replace(/-/g, ' ') + '</div>'
      + '</div>';
  } else {
    el.style.display = 'none';
  }
}

// Share progress as image card
function chShareProgress() {
  var state = chGetState();
  var doneDays = chCountDone(state);
  var pct = Math.round((doneDays / 30) * 100);
  var identity = chGetIdentity(state.currentDay);

  // Build a shareable canvas
  var canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 340;
  var ctx = canvas.getContext('2d');

  // Background
  var grad = ctx.createLinearGradient(0, 0, 600, 340);
  grad.addColorStop(0, '#0a1628');
  grad.addColorStop(1, '#0e2040');
  ctx.fillStyle = grad;
  ctx.roundRect(0, 0, 600, 340, 16);
  ctx.fill();

  // Accent line
  var accentGrad = ctx.createLinearGradient(40, 0, 300, 0);
  accentGrad.addColorStop(0, '#0B5FD8');
  accentGrad.addColorStop(1, '#00C8E0');
  ctx.fillStyle = accentGrad;
  ctx.fillRect(40, 40, 80, 3);

  // Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 28px DM Sans, sans-serif';
  ctx.fillText('30-Day Momentum Challenge', 40, 82);

  // Identity
  ctx.fillStyle = '#00C8E0';
  ctx.font = 'bold 18px DM Sans, sans-serif';
  ctx.fillText(identity.title, 40, 115);

  // Stats
  ctx.fillStyle = '#8899b0';
  ctx.font = '14px DM Sans, sans-serif';
  ctx.fillText('Day ' + state.currentDay + ' of 30', 40, 160);

  // Big percentage
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 64px DM Serif Display, serif';
  ctx.fillText(pct + '%', 40, 240);
  ctx.fillStyle = '#8899b0';
  ctx.font = '16px DM Sans, sans-serif';
  ctx.fillText('Complete', 40, 262);

  // Stats right side
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 32px DM Sans, sans-serif';
  ctx.fillText(state.points.toLocaleString(), 300, 200);
  ctx.fillStyle = '#8899b0';
  ctx.font = '14px DM Sans, sans-serif';
  ctx.fillText('Points Earned', 300, 222);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 32px DM Sans, sans-serif';
  ctx.fillText(state.bestStreak + '', 300, 260);
  ctx.fillStyle = '#8899b0';
  ctx.font = '14px DM Sans, sans-serif';
  ctx.fillText('Best Streak', 300, 282);

  // Badges earned count
  var badgeCount = 0;
  if (state.badges) { for (var b in state.badges) { if (state.badges[b]) badgeCount++; } }
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 32px DM Sans, sans-serif';
  ctx.fillText(badgeCount + '', 460, 200);
  ctx.fillStyle = '#8899b0';
  ctx.font = '14px DM Sans, sans-serif';
  ctx.fillText('Badges Earned', 460, 222);

  // Branding
  ctx.fillStyle = '#4a5a70';
  ctx.font = '12px DM Sans, sans-serif';
  ctx.fillText('Community Tax Partner Program', 40, 320);

  // Download
  try {
    var link = document.createElement('a');
    link.download = 'challenge-progress-day-' + state.currentDay + '.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    if (typeof showToast === 'function') {
      showToast('Progress card downloaded! Share it on social media.', 'success');
    }
  } catch (e) {
    if (typeof showToast === 'function') {
      showToast('Could not generate share card.', 'error');
    }
  }
}

// Auto-detect polling -- check every 30s when challenge section is visible
var _chAutoDetectInterval = null;

function chStartAutoDetect() {
  if (_chAutoDetectInterval) return;
  _chAutoDetectInterval = setInterval(function() {
    var sec = document.getElementById('portal-sec-challenge');
    if (sec && sec.style.display !== 'none') {
      chAutoDetect();
    }
  }, 30000);
}

// ═══ M4P3C1: COMPLETION EXPERIENCE ═══

// Rainmaker Certificate (Day 30 completion)
function chGenerateCertificate() {
  var state = chGetState();
  var doneDays = chCountDone(state);
  if (doneDays < 30) {
    if (typeof showToast === 'function') showToast('Complete all 30 days to earn your certificate!', 'warning');
    return;
  }

  var canvas = document.createElement('canvas');
  canvas.width = 1056;
  canvas.height = 816;
  var ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, 1056, 816);

  // Border
  ctx.strokeStyle = '#0B5FD8';
  ctx.lineWidth = 4;
  ctx.strokeRect(32, 32, 992, 752);
  ctx.strokeStyle = 'rgba(11,95,216,0.15)';
  ctx.lineWidth = 1;
  ctx.strokeRect(44, 44, 968, 728);

  // Corner accents
  var corners = [[52, 52], [996, 52], [52, 764], [996, 764]];
  corners.forEach(function(c) {
    ctx.fillStyle = '#00C8E0';
    ctx.beginPath();
    ctx.arc(c[0], c[1], 6, 0, Math.PI * 2);
    ctx.fill();
  });

  // Top accent line
  var topGrad = ctx.createLinearGradient(328, 0, 728, 0);
  topGrad.addColorStop(0, '#0B5FD8');
  topGrad.addColorStop(1, '#00C8E0');
  ctx.fillStyle = topGrad;
  ctx.fillRect(428, 80, 200, 3);

  // Certificate title
  ctx.fillStyle = '#0a1628';
  ctx.font = '16px DM Sans, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('COMMUNITY TAX ENTERPRISE PARTNER PROGRAM', 528, 130);

  ctx.font = 'bold 42px DM Serif Display, serif';
  ctx.fillStyle = '#0B5FD8';
  ctx.fillText('Certificate of Achievement', 528, 190);

  // Divider
  ctx.fillStyle = '#0B5FD8';
  ctx.fillRect(378, 210, 300, 2);

  // Body
  ctx.fillStyle = '#555';
  ctx.font = '16px DM Sans, sans-serif';
  ctx.fillText('This certifies that', 528, 270);

  ctx.fillStyle = '#0a1628';
  ctx.font = 'bold 36px DM Serif Display, serif';
  ctx.fillText('Partner', 528, 320);

  ctx.fillStyle = '#555';
  ctx.font = '16px DM Sans, sans-serif';
  ctx.fillText('has successfully completed the', 528, 370);

  ctx.fillStyle = '#0a1628';
  ctx.font = 'bold 28px DM Serif Display, serif';
  ctx.fillText('30-Day Momentum Challenge', 528, 410);

  // Stats
  ctx.fillStyle = '#888';
  ctx.font = '14px DM Sans, sans-serif';
  ctx.fillText('Achieving the rank of RAINMAKER', 528, 460);

  ctx.fillStyle = '#0a1628';
  ctx.font = 'bold 20px DM Sans, sans-serif';
  ctx.fillText(state.points.toLocaleString() + ' Points', 370, 510);
  ctx.fillText(state.bestStreak + '-Day Best Streak', 528, 510);
  var badgeCount = 0;
  if (state.badges) { for (var b in state.badges) { if (state.badges[b]) badgeCount++; } }
  ctx.fillText(badgeCount + '/7 Badges', 686, 510);

  ctx.fillStyle = '#aaa';
  ctx.font = '13px DM Sans, sans-serif';
  ctx.fillText('Total Points', 370, 530);
  ctx.fillText('Consistency', 528, 530);
  ctx.fillText('Achievements', 686, 530);

  // Date
  var today = new Date();
  var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var dateStr = months[today.getMonth()] + ' ' + today.getDate() + ', ' + today.getFullYear();
  ctx.fillStyle = '#888';
  ctx.font = '14px DM Sans, sans-serif';
  ctx.fillText('Completed on ' + dateStr, 528, 600);

  // Signature line
  ctx.strokeStyle = '#ccc';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(378, 680);
  ctx.lineTo(678, 680);
  ctx.stroke();
  ctx.fillStyle = '#888';
  ctx.font = '12px DM Sans, sans-serif';
  ctx.fillText('Community Tax Partner Success Team', 528, 700);

  // Bottom accent
  var botGrad = ctx.createLinearGradient(328, 0, 728, 0);
  botGrad.addColorStop(0, '#0B5FD8');
  botGrad.addColorStop(1, '#00C8E0');
  ctx.fillStyle = botGrad;
  ctx.fillRect(428, 740, 200, 3);

  // Download
  try {
    var link = document.createElement('a');
    link.download = 'Rainmaker-Certificate.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    if (typeof showToast === 'function') showToast('Rainmaker Certificate downloaded!', 'success');
  } catch (e) {
    if (typeof showToast === 'function') showToast('Could not generate certificate.', 'error');
  }
}

// Post-Challenge Dashboard
function chRenderPostChallenge(state) {
  var el = document.getElementById('ch-post-challenge');
  if (!el) return;

  var doneDays = chCountDone(state);
  if (doneDays < 30) {
    el.style.display = 'none';
    return;
  }

  el.style.display = 'block';

  // Calculate stats
  var skipped = 0;
  for (var k in state.skippedDays) { if (state.skippedDays[k]) skipped++; }
  var badgeCount = 0;
  if (state.badges) { for (var b in state.badges) { if (state.badges[b]) badgeCount++; } }

  // Tool usage from history
  var toolUse = { scripts: 0, ads: 0, quals: 0, pages: 0 };
  if (typeof getToolHistory === 'function') {
    var hist = getToolHistory();
    hist.forEach(function(h) {
      if (h.tool === 'script-builder') toolUse.scripts++;
      else if (h.tool === 'ad-maker') toolUse.ads++;
      else if (h.tool === 'client-qualifier') toolUse.quals++;
    });
  }
  try {
    var pages = JSON.parse(localStorage.getItem('ctax_pb_pages') || '[]');
    toolUse.pages = pages.length;
  } catch (e) {}

  var html = '<div class="ch-pc-header">'
    + '<div class="ch-pc-crown"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FFD700" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg></div>'
    + '<div class="ch-pc-title">Challenge Complete: The Rainmaker</div>'
    + '<div class="ch-pc-sub">30 days of building, learning, and earning. Here is your journey in numbers.</div>'
    + '</div>';

  // Stats grid
  html += '<div class="ch-pc-stats">'
    + '<div class="ch-pc-stat"><div class="ch-pc-stat-val">' + state.points.toLocaleString() + '</div><div class="ch-pc-stat-label">Total Points</div></div>'
    + '<div class="ch-pc-stat"><div class="ch-pc-stat-val">' + state.bestStreak + '</div><div class="ch-pc-stat-label">Best Streak</div></div>'
    + '<div class="ch-pc-stat"><div class="ch-pc-stat-val">' + badgeCount + '/7</div><div class="ch-pc-stat-label">Badges Earned</div></div>'
    + '<div class="ch-pc-stat"><div class="ch-pc-stat-val">' + skipped + '</div><div class="ch-pc-stat-label">Days Skipped</div></div>'
    + '</div>';

  // Tools mastered
  html += '<div class="ch-pc-tools-header">Tools You Used</div>'
    + '<div class="ch-pc-tools">'
    + '<div class="ch-pc-tool"><span class="ch-pc-tool-val">' + toolUse.scripts + '</span> Scripts Created</div>'
    + '<div class="ch-pc-tool"><span class="ch-pc-tool-val">' + toolUse.ads + '</span> Ads Made</div>'
    + '<div class="ch-pc-tool"><span class="ch-pc-tool-val">' + toolUse.quals + '</span> Clients Qualified</div>'
    + '<div class="ch-pc-tool"><span class="ch-pc-tool-val">' + toolUse.pages + '</span> Pages Built</div>'
    + '</div>';

  // Certificate button
  html += '<div class="ch-pc-actions">'
    + '<button class="ch-pc-cert-btn" onclick="chGenerateCertificate()"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg> Download Rainmaker Certificate</button>'
    + '</div>';

  el.innerHTML = html;
}

// "What's Next" Recommendations
function chRenderWhatsNext(state) {
  var el = document.getElementById('ch-whats-next');
  if (!el) return;

  var doneDays = chCountDone(state);

  // Build recommendations based on what was skipped/completed
  var recs = [];

  // Check for skipped tool-linked tasks
  var skippedTools = {};
  for (var k in state.skippedDays) {
    if (state.skippedDays[k]) {
      var d = parseInt(k, 10);
      var task = CH_DAYS[d - 1];
      if (task && task.tool) {
        skippedTools[task.tool] = (skippedTools[task.tool] || 0) + 1;
      }
    }
  }

  if (skippedTools['portal-sec-ai-scripts']) {
    recs.push({ icon: '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>', title: 'Master the Script Builder', desc: 'You skipped some scripting tasks. Generate 3 scripts this week to build your library.', action: 'portal-sec-ai-scripts' });
  }
  if (skippedTools['portal-sec-ai-admaker']) {
    recs.push({ icon: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>', title: 'Create Ad Campaigns', desc: 'Try the Ad Maker with different templates to find what resonates.', action: 'portal-sec-ai-admaker' });
  }
  if (skippedTools['portal-sec-submit']) {
    recs.push({ icon: '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>', title: 'Submit More Referrals', desc: 'The more referrals you submit, the faster your commissions grow.', action: 'portal-sec-submit' });
  }

  // Always recommend these
  recs.push({ icon: '<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>', title: 'Generate Your 90-Day Roadmap', desc: 'Use the Business Planner to build a strategic growth plan for the next quarter.', action: 'portal-sec-planner' });

  if (doneDays >= 30) {
    recs.push({ icon: '<polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 105.64-8.36"/>', title: 'Take the Advanced Challenge', desc: '30 more days of harder tasks. Restart with the Advanced Track.', action: 'restart-advanced' });
  }

  if (!recs.length) {
    el.style.display = 'none';
    return;
  }

  el.style.display = 'block';
  var html = '<div class="ch-wn-header">'
    + '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'
    + '<span>What\'s Next</span>'
    + '</div>'
    + '<div class="ch-wn-list">';

  recs.forEach(function(rec) {
    var onclick = rec.action === 'restart-advanced'
      ? 'chRestartAdvanced()'
      : 'portalNav(document.querySelector(\'[onclick*=\"' + rec.action + '\"]\'),\'' + rec.action + '\')';
    html += '<div class="ch-wn-card" onclick="' + onclick + '">'
      + '<div class="ch-wn-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + rec.icon + '</svg></div>'
      + '<div class="ch-wn-info">'
      + '<div class="ch-wn-title">' + rec.title + '</div>'
      + '<div class="ch-wn-desc">' + rec.desc + '</div>'
      + '</div>'
      + '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--mist)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>'
      + '</div>';
  });

  html += '</div>';
  el.innerHTML = html;
}

// Challenge Restart with Advanced Track
var CH_ADVANCED_DAYS = [
  { day: 1, title: 'Audit your referral pipeline', desc: 'Review all submitted referrals. Categorize by status and follow up on any stalled cases.', pts: 200, tool: 'portal-sec-referrals' },
  { day: 2, title: 'Create 3 niche-specific scripts', desc: 'Generate scripts for 3 different client archetypes using the Script Builder.', pts: 250, tool: 'portal-sec-ai-scripts' },
  { day: 3, title: 'Build a landing page for referrals', desc: 'Use the Page Builder to create a dedicated referral capture page.', pts: 300, tool: 'portal-sec-page-builder' },
  { day: 4, title: 'Run an A/B ad test', desc: 'Create 2 ad variants in Ad Maker and prepare to test them.', pts: 250, tool: 'portal-sec-ai-admaker' },
  { day: 5, title: 'Qualify 5 potential clients', desc: 'Use the Client Qualifier on 5 different client scenarios.', pts: 300, tool: 'portal-sec-ai-qualifier' },
  { day: 6, title: 'Design a drip email sequence', desc: 'Create a 5-email follow-up series for cold prospects.', pts: 350, tool: 'portal-sec-ai-scripts' },
  { day: 7, title: 'Analyze your first month metrics', desc: 'Review dashboard analytics and document your biggest wins and lessons.', pts: 200, tool: 'portal-sec-dashboard' },
  { day: 8, title: 'Build a competitor comparison sheet', desc: 'Use AI tools to create a comparison of your services vs doing nothing.', pts: 300, tool: 'portal-sec-ai-scripts' },
  { day: 9, title: 'Submit 2 referrals today', desc: 'Double your daily output. Submit 2 qualified referrals.', pts: 400, tool: 'portal-sec-submit' },
  { day: 10, title: 'Create your personal partner brand guide', desc: 'Document your brand colors, messaging, and value proposition.', pts: 250, tool: 'portal-sec-settings' },
  { day: 11, title: 'Master objection handling', desc: 'Practice all 5 objection scenarios from the Playbook.', pts: 200, tool: 'portal-sec-playbook' },
  { day: 12, title: 'Build a social proof portfolio', desc: 'Create 3 social media posts showcasing partner program benefits.', pts: 300, tool: 'portal-sec-ai-admaker' },
  { day: 13, title: 'Revenue optimization review', desc: 'Revisit your projections and adjust based on actual data.', pts: 200, tool: 'portal-sec-calculator' },
  { day: 14, title: 'Teach someone about the program', desc: 'Explain the partner referral process to a colleague.', pts: 250, tool: null },
  { day: 15, title: 'Advanced client qualification', desc: 'Qualify a complex multi-year tax situation using the AI tool.', pts: 350, tool: 'portal-sec-ai-qualifier' },
  { day: 16, title: 'Create a video script', desc: 'Generate a 60-second video script explaining IRS resolution.', pts: 300, tool: 'portal-sec-ai-scripts' },
  { day: 17, title: 'Pipeline velocity check', desc: 'Follow up on ALL pending referrals. Document status of each.', pts: 250, tool: 'portal-sec-referrals' },
  { day: 18, title: 'Build a workshop presentation', desc: 'Create a 10-slide presentation for a client workshop on tax debt.', pts: 400, tool: 'portal-sec-ai-scripts' },
  { day: 19, title: 'Expand your referral network', desc: 'Identify 5 new professionals who could become referral partners.', pts: 300, tool: null },
  { day: 20, title: 'Submit 3 referrals today', desc: 'Triple your output. This is where volume meets quality.', pts: 500, tool: 'portal-sec-submit' },
  { day: 21, title: 'Create a case study template', desc: 'Build a success story template for future client results.', pts: 300, tool: 'portal-sec-ai-scripts' },
  { day: 22, title: 'Optimize your landing page', desc: 'Improve your published page with better copy and CTAs.', pts: 350, tool: 'portal-sec-page-builder' },
  { day: 23, title: 'Design a seasonal campaign', desc: 'Create time-sensitive marketing for tax season.', pts: 350, tool: 'portal-sec-ai-admaker' },
  { day: 24, title: 'Advanced revenue planning', desc: 'Model 3 growth scenarios in the Business Planner.', pts: 300, tool: 'portal-sec-planner' },
  { day: 25, title: 'Create a referral partner one-pager', desc: 'Build a PDF one-pager explaining the program to potential partners.', pts: 400, tool: 'portal-sec-ai-scripts' },
  { day: 26, title: 'Master batch workflows', desc: 'Generate 5 scripts, 3 ads, and 2 qualification reports in one session.', pts: 500, tool: null },
  { day: 27, title: 'Review and update your growth roadmap', desc: 'Revise your 90-Day plan based on 60 days of data.', pts: 250, tool: 'portal-sec-planner' },
  { day: 28, title: 'Mentor a newer partner', desc: 'Share your best practices with someone who is just starting.', pts: 300, tool: null },
  { day: 29, title: 'Set quarterly revenue targets', desc: 'Based on your actual run rate, set specific Q2 targets.', pts: 250, tool: 'portal-sec-calculator' },
  { day: 30, title: 'Celebrate and plan your next quarter', desc: 'You completed the Advanced Track. Document your system and prepare to scale.', pts: 600, tool: null }
];

function chRestartAdvanced() {
  var state = chGetState();
  state.advancedTrack = true;
  state.currentDay = 1;
  state.completedDays = {};
  state.skippedDays = {};
  state.streak = 0;
  // Keep points, badges, and bestStreak from original challenge
  state.advancedStartDate = new Date().toISOString().slice(0, 10);
  chSaveState(state);

  if (typeof showToast === 'function') {
    showToast('Advanced Track started! 30 harder tasks await. Good luck, Rainmaker.', 'success');
  }

  chInit();
}

// Weekly Digest Flag
function chToggleWeeklyDigest() {
  try {
    var flag = localStorage.getItem('ctax_ch_weekly_digest') === 'true';
    localStorage.setItem('ctax_ch_weekly_digest', flag ? 'false' : 'true');
    chRenderDigestToggle();
    if (typeof showToast === 'function') {
      showToast(flag ? 'Weekly digest disabled.' : 'Weekly digest enabled. You\'ll receive weekly progress summaries.', 'info');
    }
  } catch (e) {}
}

function chRenderDigestToggle() {
  var el = document.getElementById('ch-digest-toggle');
  if (!el) return;
  var enabled = localStorage.getItem('ctax_ch_weekly_digest') === 'true';
  el.innerHTML = '<div class="ch-digest-inner">'
    + '<div class="ch-digest-info">'
    + '<div class="ch-digest-label">Weekly Progress Digest</div>'
    + '<div class="ch-digest-desc">Receive a weekly summary of your challenge progress and upcoming tasks.</div>'
    + '</div>'
    + '<button class="ch-digest-btn' + (enabled ? ' ch-digest-on' : '') + '" onclick="chToggleWeeklyDigest()">'
    + (enabled ? 'On' : 'Off')
    + '</button>'
    + '</div>';
}

// ── PDF EXPORT: 30-Day Momentum Challenge Progress Report ──

function chBuildPdfDoc() {
  var state = chGetState();

  // Count completed and skipped days
  var doneDays = 0;
  var skippedDays = 0;
  var totalPoints = state.points || 0;
  var earnedPoints = 0;
  var possiblePoints = 0;

  for (var i = 1; i <= 30; i++) {
    possiblePoints += CH_DAYS[i - 1].pts;
    if (state.completedDays[i]) {
      doneDays++;
      earnedPoints += CH_DAYS[i - 1].pts;
    }
    if (state.skippedDays[i]) skippedDays++;
  }

  var pctComplete = Math.round((doneDays / 30) * 100);
  var currentDay = state.currentDay || 1;
  var streak = state.streak || 0;
  var bestStreak = state.bestStreak || 0;

  var today = new Date();
  var monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var dateStr = monthNames[today.getMonth()] + ' ' + today.getDate() + ', ' + today.getFullYear();

  // Determine challenge phase via identity system
  var identity = chGetIdentity(currentDay);
  var phase = identity.title;
  var phaseDesc = identity.sub;

  var doc = document.createElement('div');
  doc.className = 'ch-pdf-doc';

  var html = '';

  // ── PAGE 1: COVER ──
  html += '<div class="ch-pdf-cover">';
  html += '<div class="ch-cover-inner">';
  html += '<div class="ch-cover-logo"><img src="images/logo-white.svg" alt="Community Tax" class="ch-cover-logo-img"></div>';
  html += '<div class="ch-cover-title">30-Day Momentum<br>Challenge</div>';
  html += '<div class="ch-cover-subtitle">Progress Report</div>';
  html += '<div class="ch-cover-divider"></div>';
  html += '<div class="ch-cover-meta">';
  html += '<div class="ch-cover-meta-row"><span class="ch-cover-label">Current Day</span><span class="ch-cover-val">Day ' + currentDay + ' of 30</span></div>';
  html += '<div class="ch-cover-meta-row"><span class="ch-cover-label">Days Completed</span><span class="ch-cover-val">' + doneDays + ' / 30</span></div>';
  html += '<div class="ch-cover-meta-row"><span class="ch-cover-label">Total Points</span><span class="ch-cover-val">' + totalPoints.toLocaleString() + '</span></div>';
  html += '<div class="ch-cover-meta-row"><span class="ch-cover-label">Current Streak</span><span class="ch-cover-val">' + streak + ' days</span></div>';
  html += '<div class="ch-cover-meta-row"><span class="ch-cover-label">Report Date</span><span class="ch-cover-val">' + dateStr + '</span></div>';
  html += '</div>';
  html += '<div class="ch-cover-footer">Your personal progress report from the 30-Day Momentum Challenge.<br>Community Tax Enterprise Partner Program</div>';
  html += '</div></div>';

  // ── PAGE 2: PROGRESS OVERVIEW ──
  html += '<div class="chd-page chd-overview">';
  html += '<div class="chd-page-header"><span>30-Day Momentum Challenge</span><span>Progress Overview</span></div>';

  html += '<h1 class="chd-h1">Progress Overview</h1>';
  html += '<p class="chd-lead">Here is where you stand in the 30-Day Momentum Challenge. This report breaks down your progress, highlights what you have accomplished, and outlines what comes next.</p>';

  // Stats grid
  html += '<div class="chd-stats-grid">';
  html += '<div class="chd-stat-card">';
  html += '<div class="chd-stat-val">' + pctComplete + '%</div>';
  html += '<div class="chd-stat-label">Challenge Complete</div>';
  html += '</div>';
  html += '<div class="chd-stat-card">';
  html += '<div class="chd-stat-val">' + doneDays + '</div>';
  html += '<div class="chd-stat-label">Days Completed</div>';
  html += '</div>';
  html += '<div class="chd-stat-card">';
  html += '<div class="chd-stat-val">' + totalPoints.toLocaleString() + '</div>';
  html += '<div class="chd-stat-label">Points Earned</div>';
  html += '</div>';
  html += '<div class="chd-stat-card">';
  html += '<div class="chd-stat-val">' + bestStreak + '</div>';
  html += '<div class="chd-stat-label">Best Streak</div>';
  html += '</div>';
  html += '</div>';

  // Current phase
  html += '<div class="chd-phase-box">';
  html += '<div class="chd-phase-label">Current Phase</div>';
  html += '<div class="chd-phase-name">' + phase + '</div>';
  html += '<div class="chd-phase-desc">' + phaseDesc + '</div>';
  html += '</div>';

  // Why streaks matter
  html += '<h2 class="chd-h2">Why Consistency Matters</h2>';
  html += '<p class="chd-body">The 30-Day Momentum Challenge is designed around a simple truth: small daily actions compound into big results. Partners who complete the full 30 days generate 2.5x more referrals in their first quarter compared to those who skip it.</p>';
  html += '<ul class="chd-list">';
  html += '<li><strong>Days 1-7 (Learn):</strong> Set up your tools and understand the program. Every hour invested here saves five hours later. You are building the foundation that everything else sits on.</li>';
  html += '<li><strong>Days 8-14 (Practice):</strong> Start using the tools with real scenarios. Write scripts, qualify clients, and build confidence before the real conversations happen.</li>';
  html += '<li><strong>Days 15-21 (Execute):</strong> Put it into practice. Submit referrals, launch outreach, and build your pipeline. This is where effort turns into results.</li>';
  html += '<li><strong>Days 22-30 (Optimize):</strong> Review what worked, refine your approach, and set goals for the next phase. The partners who succeed long-term are the ones who build systems, not rely on motivation.</li>';
  html += '</ul>';

  if (skippedDays > 0) {
    html += '<div class="chd-insight-box chd-insight-warning">';
    html += '<div class="chd-insight-title">About Skipped Days</div>';
    html += '<p class="chd-insight-body">You have skipped ' + skippedDays + ' day' + (skippedDays > 1 ? 's' : '') + ' so far. That is okay -- life happens. But each skipped day resets your streak and breaks the habit loop. If you find yourself skipping frequently, try doing the task first thing in the morning before other work takes over. Most tasks take under 10 minutes.</p>';
    html += '</div>';
  }

  html += '</div>'; // end overview page

  // ── PAGE 3: COMPLETED TASKS ──
  html += '<div class="chd-page chd-completed">';
  html += '<div class="chd-page-header"><span>30-Day Momentum Challenge</span><span>Completed Tasks</span></div>';

  html += '<h1 class="chd-h1">What You Have Accomplished</h1>';
  html += '<p class="chd-lead">Every checkmark below represents a real action you took toward building your referral practice. This is not busywork -- each task was chosen because it moves the needle.</p>';

  var hasCompleted = false;
  for (var c = 1; c <= 30; c++) {
    if (state.completedDays[c]) {
      hasCompleted = true;
      var task = CH_DAYS[c - 1];
      html += '<div class="chd-done-task">';
      html += '<div class="chd-done-check"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>';
      html += '<div class="chd-done-content">';
      html += '<div class="chd-done-header">';
      html += '<span class="chd-done-day">Day ' + c + '</span>';
      html += '<span class="chd-done-title">' + task.title + '</span>';
      html += '<span class="chd-done-pts">+' + task.pts + ' pts</span>';
      html += '</div>';
      html += '<p class="chd-done-desc">' + task.desc + '</p>';
      html += '</div>';
      html += '</div>';
    }
  }

  if (!hasCompleted) {
    html += '<div class="chd-empty-state">';
    html += '<p>No tasks completed yet. Start with Day 1 -- it only takes a few minutes and sets the tone for the entire challenge.</p>';
    html += '</div>';
  }

  html += '</div>'; // end completed page

  // ── REMAINING TASKS (split by week, each week gets its own page) ──
  var weeks = [
    { label: 'Week 1: Learn', days: [1,2,3,4,5,6,7], desc: 'Set up your tools and build awareness of the referral opportunity in your practice.' },
    { label: 'Week 2: Practice', days: [8,9,10,11,12,13,14], desc: 'Start using the tools with real scenarios and build confidence before high-stakes conversations.' },
    { label: 'Week 3: Execute', days: [15,16,17,18,19,20,21], desc: 'Put it into practice with real outreach, referrals, and pipeline building.' },
    { label: 'Week 4: Optimize', days: [22,23,24,25,26,27,28,29,30], desc: 'Refine your approach, review results, and set goals for sustained growth.' }
  ];

  var totalRemaining = 0;
  for (var tr = 1; tr <= 30; tr++) {
    if (!state.completedDays[tr]) totalRemaining++;
  }

  var isFirstRemainingPage = true;
  weeks.forEach(function(week) {
    // Collect remaining tasks for this week
    var weekTasks = [];
    week.days.forEach(function(d) {
      if (!state.completedDays[d]) {
        weekTasks.push(d);
      }
    });

    // Skip weeks with no remaining tasks
    if (weekTasks.length === 0) return;

    var pageClass = isFirstRemainingPage ? 'chd-page chd-remaining' : 'chd-page chd-remaining';
    html += '<div class="' + pageClass + '">';
    html += '<div class="chd-page-header"><span>30-Day Momentum Challenge</span><span>' + week.label + '</span></div>';

    if (isFirstRemainingPage) {
      html += '<h1 class="chd-h1">What Is Ahead</h1>';
      html += '<p class="chd-lead">These are the tasks still waiting for you. Each one builds on the last -- they are ordered intentionally to move you from learning to earning.</p>';
      isFirstRemainingPage = false;
    } else {
      html += '<h1 class="chd-h1">' + week.label + '</h1>';
    }

    html += '<div class="chd-week-intro">';
    html += '<div class="chd-week-label">' + week.label + '</div>';
    html += '<div class="chd-week-desc">' + week.desc + '</div>';
    html += '</div>';

    weekTasks.forEach(function(d) {
      var rTask = CH_DAYS[d - 1];
      var statusLabel = state.skippedDays[d] ? 'SKIPPED' : (d === currentDay ? 'TODAY' : 'UPCOMING');
      var statusClass = state.skippedDays[d] ? 'chd-status-skipped' : (d === currentDay ? 'chd-status-today' : 'chd-status-upcoming');

      html += '<div class="chd-remaining-task">';
      html += '<div class="chd-remaining-num">' + d + '</div>';
      html += '<div class="chd-remaining-content">';
      html += '<div class="chd-remaining-header">';
      html += '<span class="chd-remaining-title">' + rTask.title + '</span>';
      html += '<span class="chd-remaining-status ' + statusClass + '">' + statusLabel + '</span>';
      html += '</div>';
      html += '<p class="chd-remaining-desc">' + rTask.desc + '</p>';
      html += '</div>';
      html += '</div>';
    });

    html += '</div>'; // end week page
  });

  if (totalRemaining === 0) {
    html += '<div class="chd-page chd-remaining">';
    html += '<div class="chd-page-header"><span>30-Day Momentum Challenge</span><span>Complete</span></div>';
    html += '<div class="chd-celebration">';
    html += '<h2 class="chd-h2">Challenge Complete!</h2>';
    html += '<p class="chd-body">You have finished all 30 days. You are now in the top tier of partners when it comes to onboarding commitment. The habits you built this month will continue to pay dividends.</p>';
    html += '</div>';
    html += '</div>';
  }

  // ── PAGE 5: INSIGHTS AND NEXT STEPS ──
  html += '<div class="chd-page chd-nextsteps">';
  html += '<div class="chd-page-header"><span>30-Day Momentum Challenge</span><span>Next Steps</span></div>';

  html += '<h1 class="chd-h1">Your Next Steps</h1>';

  // Personalized insights based on progress
  html += '<div class="chd-insight-box">';
  html += '<div class="chd-insight-title">Where You Stand</div>';
  if (pctComplete >= 90) {
    html += '<p class="chd-insight-body">You are crushing it. ' + pctComplete + '% complete with ' + totalPoints.toLocaleString() + ' points puts you among the most committed partners in the program. The habits you have built this month are the same ones that top-earning partners maintain year-round. Keep going -- the finish line is right there.</p>';
  } else if (pctComplete >= 60) {
    html += '<p class="chd-insight-body">Strong progress. ' + pctComplete + '% complete shows real commitment. You have made it past the point where most people drop off (around day 14). Focus on maintaining your streak through the final stretch -- the tasks in the last week are designed to set you up for long-term success, not just short-term activity.</p>';
  } else if (pctComplete >= 30) {
    html += '<p class="chd-insight-body">You are building momentum. At ' + pctComplete + '%, you have laid the groundwork. The most impactful tasks are still ahead -- submitting referrals, launching outreach, and building your pipeline. Try to pick up the pace in the coming days. Even doing two tasks per day for a few days can get you back on track.</p>';
  } else {
    html += '<p class="chd-insight-body">You are just getting started at ' + pctComplete + '%. That is perfectly fine -- what matters is consistency from here forward. The challenge is designed to be done one day at a time. Start with today\'s task and do not worry about catching up all at once. Each task takes under 15 minutes and directly contributes to your first referral.</p>';
  }
  html += '</div>';

  // Action items
  html += '<h2 class="chd-h2">Recommended Actions</h2>';
  html += '<div class="chd-steps-list">';

  if (currentDay <= 30) {
    html += '<div class="chd-step-item"><div class="chd-step-num">1</div><div class="chd-step-body"><strong>Complete today\'s task:</strong> Day ' + currentDay + ' -- ' + CH_DAYS[currentDay - 1].title + '. It takes under 15 minutes and keeps your streak alive.</div></div>';
  }

  html += '<div class="chd-step-item"><div class="chd-step-num">2</div><div class="chd-step-body"><strong>Open your Partner Portal daily.</strong> Set a recurring calendar reminder for the same time each day. Partners who designate a specific "challenge time" are 3x more likely to finish all 30 days.</div></div>';

  if (skippedDays > 0) {
    html += '<div class="chd-step-item"><div class="chd-step-num">3</div><div class="chd-step-body"><strong>Go back and complete skipped tasks.</strong> While the challenge moves forward, the skipped tasks are still valuable. Set aside 30 minutes to knock out the ones you missed -- they will fill gaps in your knowledge and tools.</div></div>';
  }

  html += '<div class="chd-step-item"><div class="chd-step-num">' + (skippedDays > 0 ? '4' : '3') + '</div><div class="chd-step-body"><strong>Generate your 90-Day Growth Roadmap.</strong> The Business Planner builds on the habits from this challenge. Once you finish the 30 days, the roadmap gives you a structured plan for the next 60.</div></div>';

  html += '</div>';

  // Point breakdown
  html += '<h2 class="chd-h2">Points Breakdown</h2>';
  html += '<table class="chd-table">';
  html += '<thead><tr><th>Category</th><th>Points</th></tr></thead>';
  html += '<tbody>';
  html += '<tr><td>Points Earned</td><td>' + earnedPoints.toLocaleString() + '</td></tr>';
  html += '<tr><td>Points Remaining</td><td>' + (possiblePoints - earnedPoints).toLocaleString() + '</td></tr>';
  html += '<tr class="chd-table-highlight"><td>Total Possible</td><td>' + possiblePoints.toLocaleString() + '</td></tr>';
  html += '</tbody></table>';

  // Closing
  html += '<div class="chd-closing">';
  html += '<p>This report was generated on ' + dateStr + ' based on your current challenge progress. Come back and download an updated report anytime to track how far you have come.</p>';
  html += '<p><strong>Need help?</strong> Use the Knowledge Base in your portal or reach out to your partner success manager.</p>';
  html += '<div class="chd-closing-brand">Community Tax Enterprise Partner Program</div>';
  html += '</div>';

  html += '</div>'; // end next steps page

  doc.innerHTML = html;
  return doc;
}

function chPrintProgress() {
  if (typeof html2pdf === 'undefined') {
    if (typeof showToast === 'function') {
      showToast('PDF library still loading -- try again in a moment.', 'warning');
    }
    return;
  }

  var pdfDoc = chBuildPdfDoc();
  if (!pdfDoc) {
    if (typeof showToast === 'function') {
      showToast('Could not build progress report.', 'error');
    }
    return;
  }

  var origBodyMargin = document.body.style.margin;
  var origBodyPadding = document.body.style.padding;
  document.body.style.margin = '0';
  document.body.style.padding = '0';
  document.body.appendChild(pdfDoc);
  window.scrollTo(0, 0);

  var opt = {
    margin: 0,
    filename: '30-Day-Challenge-Progress.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
      scrollY: -window.scrollY
    },
    jsPDF: { unit: 'mm', format: 'letter', orientation: 'portrait' },
    pagebreak: { mode: ['css'] }
  };

  if (typeof showToast === 'function') {
    showToast('Generating progress report...', 'info');
  }

  html2pdf().set(opt).from(pdfDoc).save().then(function() {
    if (pdfDoc.parentNode) document.body.removeChild(pdfDoc);
    document.body.style.margin = origBodyMargin;
    document.body.style.padding = origBodyPadding;
    if (typeof showToast === 'function') {
      showToast('Progress report downloaded!', 'success');
    }
  }).catch(function(err) {
    console.error('Challenge PDF error:', err);
    if (pdfDoc.parentNode) document.body.removeChild(pdfDoc);
    document.body.style.margin = origBodyMargin;
    document.body.style.padding = origBodyPadding;
    if (typeof showToast === 'function') {
      showToast('PDF export failed -- try again.', 'error');
    }
  });
}
