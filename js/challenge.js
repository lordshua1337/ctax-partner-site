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

function chGetState() {
  try {
    var raw = localStorage.getItem(CH_STORAGE_KEY);
    if (!raw) return chDefaultState();
    return JSON.parse(raw);
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
    bestStreak: 9
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
  chRenderGrid(state);
  chRenderToday(state);
  chRenderUpcoming(state);
  chUpdateStats(state);
  chUpdateIdentity(state);
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

  // Show toast
  if (typeof portalToast === 'function') {
    portalToast('+' + day.pts + ' points earned! Day ' + state.currentDay + ' complete.', 'success');
  }

  // Milestone celebrations at tier boundaries
  var doneDays = 0;
  for (var k in state.completedDays) {
    if (state.completedDays[k]) doneDays++;
  }
  if (doneDays === 7 && typeof portalToast === 'function') {
    setTimeout(function() { portalToast('Week 1 complete! You are now "The Connector."', 'success'); }, 1500);
  } else if (doneDays === 14 && typeof portalToast === 'function') {
    setTimeout(function() { portalToast('Week 2 done! You leveled up to "The Builder."', 'success'); }, 1500);
  } else if (doneDays === 21 && typeof portalToast === 'function') {
    setTimeout(function() { portalToast('Week 3 crushed! You are now "The Rainmaker."', 'success'); }, 1500);
  } else if (doneDays === 30 && typeof portalToast === 'function') {
    setTimeout(function() { portalToast('Challenge complete! You finished all 30 days. Top tier.', 'success'); }, 1500);
  }

  // If tool is linked, prompt to navigate
  if (day.tool) {
    setTimeout(function() {
      if (typeof portalToast === 'function') {
        portalToast('Tip: Open ' + day.title.split(' ').slice(0, 3).join(' ') + '... to follow through.', 'info');
      }
    }, 3000);
  }
}

function chSkipDay() {
  var state = chGetState();
  if (state.completedDays[state.currentDay]) return;

  state.skippedDays[state.currentDay] = true;
  state.streak = 0;
  state.currentDay = Math.min(state.currentDay + 1, 31);

  chSaveState(state);
  chRenderGrid(state);
  chRenderToday(state);
  chRenderUpcoming(state);
  chUpdateStats(state);
  chUpdateIdentity(state);

  if (typeof portalToast === 'function') {
    portalToast('Day skipped. Your streak was reset -- get back on track tomorrow!', 'warning');
  }
}

function chResetChallenge() {
  try { localStorage.removeItem(CH_STORAGE_KEY); } catch (e) { /* ignore */ }
  chInit();
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
