// --- 30-Day Momentum Challenge ---
// Gamified daily challenge system tied to the 90-day growth roadmap.
// Partners earn points for completing daily actions, maintain streaks,
// and compete on a leaderboard.

var CH_STORAGE_KEY = 'ch_30day_v1';

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

function chInit() {
  var grid = document.getElementById('ch-grid');
  if (!grid) return;

  var state = chGetState();
  chRenderGrid(state);
  chRenderToday(state);
  chRenderUpcoming(state);
  chUpdateStats(state);
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

  // Show toast
  if (typeof portalToast === 'function') {
    portalToast('+' + day.pts + ' points earned! Day ' + state.currentDay + ' complete.', 'success');
  }

  // If tool is linked, prompt to navigate
  if (day.tool) {
    setTimeout(function() {
      if (typeof portalToast === 'function') {
        portalToast('Tip: Open ' + day.title.split(' ').slice(0, 3).join(' ') + '... to follow through.', 'info');
      }
    }, 2000);
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

  if (typeof portalToast === 'function') {
    portalToast('Day skipped. Your streak was reset -- get back on track tomorrow!', 'warning');
  }
}

function chResetChallenge() {
  try { localStorage.removeItem(CH_STORAGE_KEY); } catch (e) { /* ignore */ }
  chInit();
}
