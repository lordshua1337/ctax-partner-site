// ══════════════════════════════════════════
//  M4P2C2: TEAM CHALLENGES & ACCOUNTABILITY
//  Partner pairing, team boards, check-ins
// ══════════════════════════════════════════

var CHT_TEAMS_KEY = 'ch_teams_v1';
var CHT_CHECKINS_KEY = 'ch_checkins_v1';

// ── SAMPLE PARTNERS (simulated network) ──────────────────

var CHT_PARTNERS = [
  { id: 'sp1', name: 'Sarah Patel', firm: 'Patel Tax & Advisory', avatar: 'SP', day: 25, points: 3800, streak: 12 },
  { id: 'jl2', name: 'James Lopez', firm: 'Lopez Financial Group', avatar: 'JL', day: 22, points: 3200, streak: 8 },
  { id: 'aw3', name: 'Amanda Wright', firm: 'Wright & Associates CPA', avatar: 'AW', day: 18, points: 2600, streak: 5 },
  { id: 'mc4', name: 'Michael Chen', firm: 'Chen Accounting LLC', avatar: 'MC', day: 15, points: 2100, streak: 3 },
  { id: 'rk5', name: 'Rachel Kumar', firm: 'Kumar Tax Solutions', avatar: 'RK', day: 20, points: 2900, streak: 7 },
  { id: 'kd6', name: 'Kevin Davis', firm: 'Davis & Partners', avatar: 'KD', day: 12, points: 1700, streak: 2 },
  { id: 'tn7', name: 'Tanya Nguyen', firm: 'Nguyen Financial', avatar: 'TN', day: 28, points: 4200, streak: 15 },
  { id: 'bm8', name: 'Brian Martinez', firm: 'Martinez CPA Group', avatar: 'BM', day: 10, points: 1400, streak: 4 }
];

// ── TEAM CHALLENGES (weekly rotating) ──────────────────

var CHT_CHALLENGES = [
  { id: 'wk1', title: '5-Day Streak Sprint', desc: 'Every team member must hit a 5-day streak this week', goal: 'All members 5+ day streak', reward: 500, type: 'streak', target: 5 },
  { id: 'wk2', title: 'Referral Race', desc: 'Collectively submit 3 referrals as a team', goal: '3 total team referrals', reward: 750, type: 'referrals', target: 3 },
  { id: 'wk3', title: 'Content Blitz', desc: 'Generate 10 pieces of content across all team tools', goal: '10 content pieces', reward: 600, type: 'content', target: 10 },
  { id: 'wk4', title: 'Perfect Week', desc: 'Entire team completes all 7 days with zero skips', goal: 'Zero skips this week', reward: 1000, type: 'perfect', target: 7 },
  { id: 'wk5', title: 'Knowledge Masters', desc: 'All team members pass the certification quiz', goal: 'All members certified', reward: 800, type: 'cert', target: 1 },
  { id: 'wk6', title: 'Pipeline Builder', desc: 'Team generates 5 qualified client profiles', goal: '5 qualified clients', reward: 700, type: 'pipeline', target: 5 }
];

// ── STATE MANAGEMENT ──────────────────────────────

function chtGetTeams() {
  try { return JSON.parse(localStorage.getItem(CHT_TEAMS_KEY) || 'null'); } catch (e) { return null; }
}

function chtSetTeams(data) {
  try { localStorage.setItem(CHT_TEAMS_KEY, JSON.stringify(data)); } catch (e) {}
}

function chtGetCheckins() {
  try { return JSON.parse(localStorage.getItem(CHT_CHECKINS_KEY) || '[]'); } catch (e) { return []; }
}

function chtSetCheckins(data) {
  try { localStorage.setItem(CHT_CHECKINS_KEY, JSON.stringify(data)); } catch (e) {}
}

// ── MAIN MODAL ──────────────────────────────

function chtShowTeams() {
  var overlay = document.createElement('div');
  overlay.className = 'aid-modal-overlay';
  overlay.id = 'cht-modal';
  overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };

  var modal = document.createElement('div');
  modal.className = 'aid-modal';
  modal.style.maxWidth = '720px';

  modal.innerHTML = '<div class="aid-modal-header">'
    + '<div><div class="aid-modal-title">Team Challenge Hub</div>'
    + '<div class="aid-modal-meta">Partner up and grow together</div></div>'
    + '<button class="aid-modal-close" onclick="document.getElementById(\'cht-modal\').remove()">&times;</button>'
    + '</div>'
    + '<div class="cht-tabs" id="cht-tabs"></div>'
    + '<div class="aid-modal-body" id="cht-body" style="padding-top:0"></div>';

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  var teams = chtGetTeams();
  if (!teams) {
    chtRenderTabs('find');
    chtRenderFindTeam();
  } else {
    chtRenderTabs('dashboard');
    chtRenderDashboard();
  }
}

function chtRenderTabs(active) {
  var teams = chtGetTeams();
  var tabs = teams
    ? [
        { key: 'dashboard', label: 'Team Dashboard' },
        { key: 'challenge', label: 'Weekly Challenge' },
        { key: 'checkins', label: 'Check-ins' },
        { key: 'leaderboard', label: 'Team Leaderboard' }
      ]
    : [
        { key: 'find', label: 'Find a Team' },
        { key: 'leaderboard', label: 'Global Leaderboard' }
      ];

  var el = document.getElementById('cht-tabs');
  if (!el) return;

  el.innerHTML = tabs.map(function(t) {
    return '<button class="cht-tab' + (t.key === active ? ' cht-tab-active' : '') + '" onclick="chtSwitchTab(\'' + t.key + '\')">' + t.label + '</button>';
  }).join('');
}

function chtSwitchTab(key) {
  chtRenderTabs(key);
  var renderers = {
    find: chtRenderFindTeam,
    dashboard: chtRenderDashboard,
    challenge: chtRenderWeeklyChallenge,
    checkins: chtRenderCheckins,
    leaderboard: chtRenderLeaderboard
  };
  if (renderers[key]) renderers[key]();
}

// ── FIND & JOIN TEAM ──────────────────────────────

function chtRenderFindTeam() {
  var body = document.getElementById('cht-body');
  if (!body) return;

  var html = '<div class="cht-find-header">'
    + '<div class="cht-find-title">Join an Accountability Team</div>'
    + '<div class="cht-find-desc">Teams of 3-4 partners keep each other accountable and compete in weekly challenges for bonus points.</div>'
    + '</div>';

  // Quick match
  html += '<div class="cht-quickmatch">'
    + '<div class="cht-qm-title">Quick Match</div>'
    + '<div class="cht-qm-desc">We will pair you with partners at a similar challenge stage</div>'
    + '<button class="btn btn-p" onclick="chtQuickMatch()" style="margin-top:12px">Find My Team</button>'
    + '</div>';

  // Available partners preview
  html += '<div class="cht-section-title" style="margin-top:24px">Available Partners</div>';
  html += '<div class="cht-partner-list">';

  CHT_PARTNERS.slice(0, 6).forEach(function(p) {
    html += '<div class="cht-partner-card">'
      + '<div class="cht-partner-avatar">' + p.avatar + '</div>'
      + '<div class="cht-partner-info">'
      + '<div class="cht-partner-name">' + p.name + '</div>'
      + '<div class="cht-partner-firm">' + p.firm + '</div>'
      + '<div class="cht-partner-stats">Day ' + p.day + ' &middot; ' + p.points + ' pts &middot; ' + p.streak + '-day streak</div>'
      + '</div>'
      + '</div>';
  });

  html += '</div>';

  body.innerHTML = html;
}

function chtQuickMatch() {
  var state = chaGetState ? chaGetState() : {};
  var myDay = state.currentDay || 1;

  // Pick 2-3 partners near user's level
  var sorted = CHT_PARTNERS.slice().sort(function(a, b) {
    return Math.abs(a.day - myDay) - Math.abs(b.day - myDay);
  });
  var teammates = sorted.slice(0, 3);

  var team = {
    id: 'team_' + Date.now(),
    name: 'Team ' + (Math.floor(Math.random() * 900) + 100),
    created: new Date().toISOString(),
    members: teammates.map(function(p) { return p.id; }),
    weeklyChallenge: CHT_CHALLENGES[Math.floor(Math.random() * CHT_CHALLENGES.length)].id,
    challengeProgress: 0,
    teamPoints: 0,
    wins: 0
  };

  chtSetTeams(team);

  // Show success then switch to dashboard
  var body = document.getElementById('cht-body');
  if (body) {
    body.innerHTML = '<div class="cht-match-success">'
      + '<div class="cht-match-icon"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>'
      + '<div class="cht-match-title">Team Formed!</div>'
      + '<div class="cht-match-team">' + team.name + '</div>'
      + '<div class="cht-match-members">'
      + teammates.map(function(p) { return '<div class="cht-match-member"><span class="cht-partner-avatar-sm">' + p.avatar + '</span> ' + p.name + '</div>'; }).join('')
      + '</div>'
      + '<button class="btn btn-p" onclick="chtRenderTabs(\'dashboard\');chtRenderDashboard()" style="margin-top:16px">View Team Dashboard</button>'
      + '</div>';
  }
}

// ── TEAM DASHBOARD ──────────────────────────────

function chtRenderDashboard() {
  var body = document.getElementById('cht-body');
  if (!body) return;

  var team = chtGetTeams();
  if (!team) { chtRenderFindTeam(); return; }

  var members = CHT_PARTNERS.filter(function(p) { return team.members.indexOf(p.id) !== -1; });
  var state = chaGetState ? chaGetState() : {};
  var myPoints = state.points || 0;
  var myDay = state.currentDay || 1;
  var myStreak = state.streak || 0;

  // Calculate team totals
  var totalPts = myPoints;
  var totalDays = chaCntDone ? chaCntDone(state) : 0;
  members.forEach(function(m) { totalPts += m.points; totalDays += m.day; });
  var avgDay = Math.round(totalDays / (members.length + 1));

  var html = '<div class="cht-dash-header">'
    + '<div class="cht-team-name">' + team.name + '</div>'
    + '<div class="cht-team-meta">Formed ' + new Date(team.created).toLocaleDateString() + ' &middot; ' + (members.length + 1) + ' members</div>'
    + '</div>';

  // Team stats
  html += '<div class="cht-team-stats">'
    + '<div class="cht-ts"><div class="cht-ts-val">' + totalPts.toLocaleString() + '</div><div class="cht-ts-label">Team Points</div></div>'
    + '<div class="cht-ts"><div class="cht-ts-val">' + avgDay + '</div><div class="cht-ts-label">Avg Day</div></div>'
    + '<div class="cht-ts"><div class="cht-ts-val">' + team.wins + '</div><div class="cht-ts-label">Challenges Won</div></div>'
    + '</div>';

  // Members
  html += '<div class="cht-section-title">Team Members</div>';
  html += '<div class="cht-members-list">';

  // Add user
  html += chtMemberRow('You', 'Partner Portal', 'ME', myDay, myPoints, myStreak, true);

  members.forEach(function(m) {
    html += chtMemberRow(m.name, m.firm, m.avatar, m.day, m.points, m.streak, false);
  });

  html += '</div>';

  // Weekly challenge preview
  var challenge = CHT_CHALLENGES.find(function(c) { return c.id === team.weeklyChallenge; });
  if (challenge) {
    var prog = Math.min(team.challengeProgress || 0, challenge.target);
    var progPct = Math.round((prog / challenge.target) * 100);

    html += '<div class="cht-section-title" style="margin-top:20px">Active Challenge</div>';
    html += '<div class="cht-challenge-card">'
      + '<div class="cht-ch-title">' + challenge.title + '</div>'
      + '<div class="cht-ch-desc">' + challenge.desc + '</div>'
      + '<div class="cht-ch-prog-wrap">'
      + '<div class="cht-ch-prog-bar"><div class="cht-ch-prog-fill" style="width:' + progPct + '%"></div></div>'
      + '<div class="cht-ch-prog-label">' + prog + ' / ' + challenge.target + ' &middot; ' + challenge.reward + ' bonus pts</div>'
      + '</div>'
      + '</div>';
  }

  // Actions
  html += '<div class="cht-dash-actions">'
    + '<button class="btn btn-g" onclick="chtLeaveTeam()">Leave Team</button>'
    + '<button class="btn btn-p" onclick="chtSwitchTab(\'checkins\')">Daily Check-in</button>'
    + '</div>';

  body.innerHTML = html;
}

function chtMemberRow(name, firm, avatar, day, points, streak, isYou) {
  var streakColor = streak >= 7 ? '#059669' : streak >= 3 ? '#3B82F6' : '#9CA3AF';
  return '<div class="cht-member-row' + (isYou ? ' cht-member-you' : '') + '">'
    + '<div class="cht-partner-avatar' + (isYou ? ' cht-avatar-you' : '') + '">' + avatar + '</div>'
    + '<div class="cht-member-info">'
    + '<div class="cht-member-name">' + name + (isYou ? ' <span class="cht-you-tag">You</span>' : '') + '</div>'
    + '<div class="cht-member-firm">' + firm + '</div>'
    + '</div>'
    + '<div class="cht-member-stats">'
    + '<div class="cht-ms">Day ' + day + '</div>'
    + '<div class="cht-ms">' + points.toLocaleString() + ' pts</div>'
    + '<div class="cht-ms" style="color:' + streakColor + '">' + streak + '-day streak</div>'
    + '</div>'
    + '</div>';
}

function chtLeaveTeam() {
  if (!confirm('Leave your team? You can always join a new one.')) return;
  localStorage.removeItem(CHT_TEAMS_KEY);
  chtRenderTabs('find');
  chtRenderFindTeam();
}

// ── WEEKLY CHALLENGE ──────────────────────────────

function chtRenderWeeklyChallenge() {
  var body = document.getElementById('cht-body');
  if (!body) return;

  var team = chtGetTeams();
  if (!team) return;

  var currentChallenge = CHT_CHALLENGES.find(function(c) { return c.id === team.weeklyChallenge; });

  var html = '<div class="cht-section-title">This Week\'s Challenge</div>';

  if (currentChallenge) {
    var prog = Math.min(team.challengeProgress || 0, currentChallenge.target);
    var progPct = Math.round((prog / currentChallenge.target) * 100);
    var isComplete = prog >= currentChallenge.target;

    html += '<div class="cht-wc-card' + (isComplete ? ' cht-wc-complete' : '') + '">'
      + '<div class="cht-wc-header">'
      + '<div class="cht-wc-title">' + currentChallenge.title + '</div>'
      + '<div class="cht-wc-reward">+' + currentChallenge.reward + ' pts</div>'
      + '</div>'
      + '<div class="cht-wc-desc">' + currentChallenge.desc + '</div>'
      + '<div class="cht-wc-goal">Goal: ' + currentChallenge.goal + '</div>'
      + '<div class="cht-ch-prog-wrap">'
      + '<div class="cht-ch-prog-bar"><div class="cht-ch-prog-fill" style="width:' + progPct + '%"></div></div>'
      + '<div class="cht-ch-prog-label">' + prog + ' / ' + currentChallenge.target + '</div>'
      + '</div>';

    if (isComplete) {
      html += '<div class="cht-wc-won">Challenge Complete! +' + currentChallenge.reward + ' bonus points awarded.</div>';
    }

    html += '</div>';
  }

  // Contribute button
  html += '<div style="margin-top:16px">'
    + '<button class="btn btn-p" onclick="chtContribute()">Log Contribution</button>'
    + '</div>';

  // Past challenges
  html += '<div class="cht-section-title" style="margin-top:24px">All Challenges</div>';
  html += '<div class="cht-all-challenges">';
  CHT_CHALLENGES.forEach(function(ch) {
    var isCurrent = team.weeklyChallenge === ch.id;
    html += '<div class="cht-ch-mini' + (isCurrent ? ' cht-ch-mini-active' : '') + '">'
      + '<div class="cht-ch-mini-title">' + ch.title + (isCurrent ? ' <span class="cht-active-tag">Active</span>' : '') + '</div>'
      + '<div class="cht-ch-mini-desc">' + ch.desc + '</div>'
      + '<div class="cht-ch-mini-reward">Reward: ' + ch.reward + ' pts</div>'
      + '</div>';
  });
  html += '</div>';

  body.innerHTML = html;
}

function chtContribute() {
  var team = chtGetTeams();
  if (!team) return;

  var challenge = CHT_CHALLENGES.find(function(c) { return c.id === team.weeklyChallenge; });
  if (!challenge) return;

  team.challengeProgress = (team.challengeProgress || 0) + 1;

  if (team.challengeProgress >= challenge.target) {
    team.teamPoints = (team.teamPoints || 0) + challenge.reward;
    team.wins = (team.wins || 0) + 1;
    // Rotate to next challenge
    var idx = CHT_CHALLENGES.findIndex(function(c) { return c.id === team.weeklyChallenge; });
    team.weeklyChallenge = CHT_CHALLENGES[(idx + 1) % CHT_CHALLENGES.length].id;
    team.challengeProgress = 0;

    if (typeof showToast === 'function') showToast('Challenge complete! +' + challenge.reward + ' team points!', 'success');
  } else {
    if (typeof showToast === 'function') showToast('Contribution logged!', 'info');
  }

  chtSetTeams(team);
  chtRenderWeeklyChallenge();
}

// ── CHECK-INS ──────────────────────────────

function chtRenderCheckins() {
  var body = document.getElementById('cht-body');
  if (!body) return;

  var checkins = chtGetCheckins();
  var today = new Date().toISOString().split('T')[0];
  var todayCheckin = checkins.find(function(c) { return c.date === today; });

  var html = '';

  if (!todayCheckin) {
    html += '<div class="cht-checkin-form">'
      + '<div class="cht-ci-title">Daily Check-in</div>'
      + '<div class="cht-ci-desc">Share a quick update with your team. Accountability drives results.</div>'
      + '<div class="cht-ci-field">'
      + '<label class="cht-ci-label">How are you feeling about today?</label>'
      + '<div class="cht-mood-row" id="cht-mood-row">'
      + '<button class="cht-mood-btn" onclick="chtSelectMood(this,\'great\')" data-mood="great">Great</button>'
      + '<button class="cht-mood-btn" onclick="chtSelectMood(this,\'good\')" data-mood="good">Good</button>'
      + '<button class="cht-mood-btn" onclick="chtSelectMood(this,\'okay\')" data-mood="okay">Okay</button>'
      + '<button class="cht-mood-btn" onclick="chtSelectMood(this,\'struggling\')" data-mood="struggling">Struggling</button>'
      + '</div>'
      + '</div>'
      + '<div class="cht-ci-field">'
      + '<label class="cht-ci-label">What are you working on today?</label>'
      + '<textarea class="cht-ci-input" id="cht-ci-text" rows="3" placeholder="e.g., Sending follow-up emails to 3 prospects..."></textarea>'
      + '</div>'
      + '<div class="cht-ci-field">'
      + '<label class="cht-ci-label">Any blockers or wins to share?</label>'
      + '<textarea class="cht-ci-input" id="cht-ci-extra" rows="2" placeholder="Optional"></textarea>'
      + '</div>'
      + '<button class="btn btn-p" onclick="chtSubmitCheckin()" style="margin-top:12px">Submit Check-in</button>'
      + '</div>';
  } else {
    html += '<div class="cht-checkin-done">'
      + '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>'
      + '<div class="cht-ci-done-title">Checked in today!</div>'
      + '<div class="cht-ci-done-mood">Mood: ' + todayCheckin.mood + '</div>'
      + '<div class="cht-ci-done-text">' + todayCheckin.text + '</div>'
      + '</div>';
  }

  // Team feed
  html += '<div class="cht-section-title" style="margin-top:24px">Team Activity Feed</div>';
  html += '<div class="cht-feed">';

  // Simulated team check-ins
  var team = chtGetTeams();
  var members = team ? CHT_PARTNERS.filter(function(p) { return team.members.indexOf(p.id) !== -1; }) : [];

  var simFeed = [
    { name: members[0] ? members[0].name : 'Partner', avatar: members[0] ? members[0].avatar : 'P1', mood: 'great', text: 'Submitted my 3rd referral this week! Pipeline is growing.', time: '2h ago' },
    { name: members[1] ? members[1].name : 'Partner', avatar: members[1] ? members[1].avatar : 'P2', mood: 'good', text: 'Working on email drip sequences today. Using the Script Builder templates.', time: '5h ago' },
    { name: members[2] ? members[2].name : 'Partner', avatar: members[2] ? members[2].avatar : 'P3', mood: 'okay', text: 'Had a tough call with a prospect but learned a lot. Tomorrow will be better.', time: '8h ago' }
  ];

  // Add user's real check-ins
  checkins.slice(0, 3).forEach(function(ci) {
    simFeed.push({
      name: 'You',
      avatar: 'ME',
      mood: ci.mood,
      text: ci.text,
      time: new Date(ci.date).toLocaleDateString()
    });
  });

  simFeed.forEach(function(item) {
    var moodColor = item.mood === 'great' ? '#059669' : item.mood === 'good' ? '#3B82F6' : item.mood === 'okay' ? '#F59E0B' : '#EF4444';
    html += '<div class="cht-feed-item">'
      + '<div class="cht-partner-avatar-sm">' + item.avatar + '</div>'
      + '<div class="cht-feed-content">'
      + '<div class="cht-feed-header"><span class="cht-feed-name">' + item.name + '</span> <span class="cht-feed-mood" style="color:' + moodColor + '">' + item.mood + '</span> <span class="cht-feed-time">' + item.time + '</span></div>'
      + '<div class="cht-feed-text">' + item.text + '</div>'
      + '</div>'
      + '</div>';
  });

  html += '</div>';

  body.innerHTML = html;
}

var _chtSelectedMood = '';

function chtSelectMood(btn, mood) {
  _chtSelectedMood = mood;
  var btns = document.querySelectorAll('.cht-mood-btn');
  btns.forEach(function(b) { b.classList.remove('cht-mood-active'); });
  btn.classList.add('cht-mood-active');
}

function chtSubmitCheckin() {
  var text = document.getElementById('cht-ci-text');
  var extra = document.getElementById('cht-ci-extra');
  if (!_chtSelectedMood) {
    if (typeof showToast === 'function') showToast('Please select your mood', 'error');
    return;
  }
  if (!text || !text.value.trim()) {
    if (typeof showToast === 'function') showToast('Please share what you are working on', 'error');
    return;
  }

  var checkins = chtGetCheckins();
  checkins.unshift({
    date: new Date().toISOString().split('T')[0],
    mood: _chtSelectedMood,
    text: text.value.trim(),
    extra: extra ? extra.value.trim() : '',
    timestamp: new Date().toISOString()
  });
  if (checkins.length > 30) checkins = checkins.slice(0, 30);
  chtSetCheckins(checkins);
  _chtSelectedMood = '';

  if (typeof showToast === 'function') showToast('Check-in submitted!', 'success');
  chtRenderCheckins();
}

// ── TEAM LEADERBOARD ──────────────────────────────

function chtRenderLeaderboard() {
  var body = document.getElementById('cht-body');
  if (!body) return;

  var team = chtGetTeams();
  var state = chaGetState ? chaGetState() : {};

  // Build leaderboard entries
  var entries = [];

  // Add user
  entries.push({
    name: 'You',
    avatar: 'ME',
    points: state.points || 0,
    day: chaCntDone ? chaCntDone(state) : 0,
    streak: state.streak || 0,
    isYou: true
  });

  // Add all partners (not just team)
  CHT_PARTNERS.forEach(function(p) {
    entries.push({
      name: p.name,
      avatar: p.avatar,
      points: p.points,
      day: p.day,
      streak: p.streak,
      isYou: false,
      isTeammate: team && team.members.indexOf(p.id) !== -1
    });
  });

  // Sort by points
  entries.sort(function(a, b) { return b.points - a.points; });

  var html = '<div class="cht-section-title">' + (team ? 'Global' : 'Partner') + ' Leaderboard</div>';
  html += '<div class="cht-lb">';

  entries.forEach(function(entry, i) {
    var rank = i + 1;
    var rankClass = rank <= 3 ? ' cht-lb-top' + rank : '';
    var youClass = entry.isYou ? ' cht-lb-you' : '';
    var teamClass = entry.isTeammate ? ' cht-lb-teammate' : '';

    html += '<div class="cht-lb-row' + rankClass + youClass + teamClass + '">'
      + '<div class="cht-lb-rank">' + rank + '</div>'
      + '<div class="cht-partner-avatar-sm' + (entry.isYou ? ' cht-avatar-you' : '') + '">' + entry.avatar + '</div>'
      + '<div class="cht-lb-info">'
      + '<div class="cht-lb-name">' + entry.name + (entry.isYou ? ' <span class="cht-you-tag">You</span>' : '') + (entry.isTeammate ? ' <span class="cht-team-tag">Team</span>' : '') + '</div>'
      + '<div class="cht-lb-meta">Day ' + entry.day + ' &middot; ' + entry.streak + '-day streak</div>'
      + '</div>'
      + '<div class="cht-lb-pts">' + entry.points.toLocaleString() + ' pts</div>'
      + '</div>';
  });

  html += '</div>';

  // Team ranking if has team
  if (team) {
    var teamTotal = (state.points || 0);
    var teamMembers = CHT_PARTNERS.filter(function(p) { return team.members.indexOf(p.id) !== -1; });
    teamMembers.forEach(function(m) { teamTotal += m.points; });

    // Simulated other teams
    var teams = [
      { name: team.name, points: teamTotal, isYours: true },
      { name: 'Team Alpha', points: Math.round(teamTotal * 1.15) },
      { name: 'Revenue Raptors', points: Math.round(teamTotal * 0.92) },
      { name: 'Pipeline Pros', points: Math.round(teamTotal * 0.78) },
      { name: 'Tax Tigers', points: Math.round(teamTotal * 0.65) }
    ].sort(function(a, b) { return b.points - a.points; });

    html += '<div class="cht-section-title" style="margin-top:24px">Team Rankings</div>';
    html += '<div class="cht-team-lb">';

    teams.forEach(function(t, i) {
      html += '<div class="cht-team-lb-row' + (t.isYours ? ' cht-team-lb-you' : '') + '">'
        + '<div class="cht-lb-rank">' + (i + 1) + '</div>'
        + '<div class="cht-team-lb-name">' + t.name + (t.isYours ? ' <span class="cht-you-tag">Your Team</span>' : '') + '</div>'
        + '<div class="cht-lb-pts">' + t.points.toLocaleString() + ' pts</div>'
        + '</div>';
    });

    html += '</div>';
  }

  body.innerHTML = html;
}
