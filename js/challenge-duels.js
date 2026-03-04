// ══════════════════════════════════════════
//  M4P2C3: CHALLENGE PARTNER DUELS
//  1v1 competitions, wagers, duel history, matchmaking, live tracker
// ══════════════════════════════════════════

var CHD_STORAGE_KEY = 'ch_duels_v1';
var CHD_HISTORY_KEY = 'ch_duel_history';

// ── DUEL TYPES ────────────────────────

var CHD_DUEL_TYPES = [
  { id: 'streak_war', name: 'Streak War', desc: 'Longest streak wins. Both partners must maintain their streak -- first to break loses.', icon: '&#9889;', duration: 7, metric: 'streak', color: '#F59E0B' },
  { id: 'speed_run', name: 'Speed Run', desc: 'Complete 5 challenge days in the fastest time. Clock starts when both accept.', icon: '&#9201;', duration: 5, metric: 'speed', color: '#EF4444' },
  { id: 'point_blitz', name: 'Point Blitz', desc: 'Earn the most challenge points in 7 days. Bonus tasks and streaks count.', icon: '&#11088;', duration: 7, metric: 'points', color: '#3B82F6' },
  { id: 'referral_race', name: 'Referral Race', desc: 'First to submit a qualified referral wins. Quality over quantity.', icon: '&#128176;', duration: 14, metric: 'referrals', color: '#10B981' },
  { id: 'consistency_check', name: 'Consistency Check', desc: 'Highest completion percentage over 10 days. No skips allowed.', icon: '&#128170;', duration: 10, metric: 'consistency', color: '#8B5CF6' },
  { id: 'content_sprint', name: 'Content Sprint', desc: 'Create the most marketing content pieces in 5 days using AI tools.', icon: '&#128221;', duration: 5, metric: 'content', color: '#EC4899' }
];

// ── SIMULATED OPPONENTS ────────────────────────

var CHD_OPPONENTS = [
  { id: 'opp1', name: 'Sarah M.', role: 'CPA', avatar: '#3B82F6', skill: 'high', style: 'Aggressive -- pushes hard early', wins: 12, losses: 3 },
  { id: 'opp2', name: 'James K.', role: 'Attorney', avatar: '#10B981', skill: 'medium', style: 'Steady -- consistent daily grind', wins: 8, losses: 6 },
  { id: 'opp3', name: 'Lisa R.', role: 'Financial Advisor', avatar: '#F59E0B', skill: 'medium', style: 'Tactical -- saves energy for bursts', wins: 6, losses: 5 },
  { id: 'opp4', name: 'Michael T.', role: 'CPA', avatar: '#EF4444', skill: 'elite', style: 'Machine -- never misses a day', wins: 18, losses: 1 },
  { id: 'opp5', name: 'Amanda W.', role: 'Insurance Agent', avatar: '#8B5CF6', skill: 'medium', style: 'Social -- motivates through engagement', wins: 9, losses: 7 },
  { id: 'opp6', name: 'David P.', role: 'Attorney', avatar: '#EC4899', skill: 'low', style: 'Newcomer -- eager but inconsistent', wins: 2, losses: 8 },
  { id: 'opp7', name: 'Rachel N.', role: 'Financial Advisor', avatar: '#14B8A6', skill: 'high', style: 'Strategic -- peaks at the right moment', wins: 11, losses: 4 },
  { id: 'opp8', name: 'Chris L.', role: 'CPA', avatar: '#F97316', skill: 'medium', style: 'Methodical -- follows the system perfectly', wins: 7, losses: 5 }
];

// ── WAGER STAKES ────────────────────────

var CHD_STAKES = [
  { id: 'bragging', name: 'Bragging Rights', desc: 'Winner gets a "Duelist" badge on their profile', icon: '&#127942;', xp: 10 },
  { id: 'spotlight', name: 'Community Spotlight', desc: 'Winner featured in the Community Hub for 7 days', icon: '&#128161;', xp: 25 },
  { id: 'mentor', name: 'Mentor Session', desc: 'Loser provides a 15-min coaching call to winner', icon: '&#127891;', xp: 40 },
  { id: 'champion', name: 'Champion Title', desc: 'Winner earns the "Duel Champion" title for the month', icon: '&#128081;', xp: 50 }
];

// ── STATE MANAGEMENT ────────────────────────

function chdGetState() {
  try { return JSON.parse(localStorage.getItem(CHD_STORAGE_KEY) || '{}'); } catch (e) { return {}; }
}

function chdSaveState(state) {
  try { localStorage.setItem(CHD_STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
}

function chdGetHistory() {
  try { return JSON.parse(localStorage.getItem(CHD_HISTORY_KEY) || '[]'); } catch (e) { return []; }
}

function chdSaveHistory(history) {
  try { localStorage.setItem(CHD_HISTORY_KEY, JSON.stringify(history)); } catch (e) {}
}

// ── MAIN MODAL ────────────────────────

function chdShowDuels() {
  var existing = document.getElementById('chd-modal');
  if (existing) existing.remove();

  var overlay = document.createElement('div');
  overlay.className = 'chd-overlay';
  overlay.id = 'chd-modal';
  overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };

  var modal = document.createElement('div');
  modal.className = 'chd-modal';

  modal.innerHTML = '<div class="chd-header">'
    + '<div><div class="chd-title">Partner Duels</div>'
    + '<div class="chd-subtitle">Challenge other partners to head-to-head competitions</div></div>'
    + '<button class="chd-close" onclick="document.getElementById(\'chd-modal\').remove()">&times;</button>'
    + '</div>'
    + '<div class="chd-tabs" id="chd-tabs"></div>'
    + '<div class="chd-body" id="chd-body"></div>';

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  chdRenderTabs('matchup');
}

// ── TABS ────────────────────────

function chdRenderTabs(active) {
  var tabs = [
    { id: 'matchup', label: 'New Duel' },
    { id: 'active', label: 'Active Duels' },
    { id: 'history', label: 'Duel History' },
    { id: 'rankings', label: 'Rankings' },
    { id: 'stats', label: 'Your Record' }
  ];

  var html = '';
  tabs.forEach(function(t) {
    html += '<button class="chd-tab' + (t.id === active ? ' chd-tab-active' : '') + '" onclick="chdSwitchTab(\'' + t.id + '\')">' + t.label + '</button>';
  });

  var tabsEl = document.getElementById('chd-tabs');
  if (tabsEl) tabsEl.innerHTML = html;

  chdSwitchTab(active);
}

function chdSwitchTab(tab) {
  var tabs = document.querySelectorAll('.chd-tab');
  var labels = { matchup: 'New Duel', active: 'Active Duels', history: 'Duel History', rankings: 'Rankings', stats: 'Your Record' };
  tabs.forEach(function(t) { t.classList.toggle('chd-tab-active', t.textContent === labels[tab]); });

  var body = document.getElementById('chd-body');
  if (!body) return;

  if (tab === 'matchup') chdRenderMatchup();
  else if (tab === 'active') chdRenderActive();
  else if (tab === 'history') chdRenderHistory();
  else if (tab === 'rankings') chdRenderRankings();
  else if (tab === 'stats') chdRenderStats();
}

// ── NEW DUEL TAB ────────────────────────

function chdRenderMatchup() {
  var body = document.getElementById('chd-body');
  if (!body) return;

  var state = chdGetState();

  // Step 1: Choose duel type
  var html = '<div class="chd-matchup">'
    + '<div class="chd-step-title">Step 1: Choose Your Duel</div>'
    + '<div class="chd-duel-grid">';

  CHD_DUEL_TYPES.forEach(function(dt) {
    var selected = state.selectedType === dt.id ? ' chd-duel-selected' : '';
    html += '<div class="chd-duel-card' + selected + '" onclick="chdSelectType(\'' + dt.id + '\')">'
      + '<div class="chd-duel-icon" style="color:' + dt.color + '">' + dt.icon + '</div>'
      + '<div class="chd-duel-name">' + dt.name + '</div>'
      + '<div class="chd-duel-desc">' + dt.desc + '</div>'
      + '<div class="chd-duel-duration">' + dt.duration + ' days</div>'
      + '</div>';
  });

  html += '</div>';

  // Step 2: Choose opponent
  html += '<div class="chd-step-title" style="margin-top:24px">Step 2: Choose Your Opponent</div>';

  if (state.selectedType) {
    html += '<div class="chd-opp-grid">';
    CHD_OPPONENTS.forEach(function(opp) {
      var selected = state.selectedOpponent === opp.id ? ' chd-opp-selected' : '';
      var wr = opp.wins + opp.losses > 0 ? Math.round((opp.wins / (opp.wins + opp.losses)) * 100) : 0;
      var skillColor = { low: '#94A3B8', medium: '#F59E0B', high: '#3B82F6', elite: '#EF4444' }[opp.skill];

      html += '<div class="chd-opp-card' + selected + '" onclick="chdSelectOpponent(\'' + opp.id + '\')">'
        + '<div class="chd-opp-avatar" style="background:' + opp.avatar + '">' + opp.name.charAt(0) + '</div>'
        + '<div class="chd-opp-info">'
        + '<div class="chd-opp-name">' + opp.name + '</div>'
        + '<div class="chd-opp-role">' + opp.role + '</div>'
        + '<div class="chd-opp-record">' + opp.wins + 'W - ' + opp.losses + 'L (' + wr + '%)</div>'
        + '</div>'
        + '<div class="chd-opp-skill" style="background:' + skillColor + '15;color:' + skillColor + '">' + opp.skill + '</div>'
        + '</div>';
    });
    html += '</div>';
  } else {
    html += '<div class="chd-hint">Select a duel type first to see available opponents.</div>';
  }

  // Step 3: Set stakes
  html += '<div class="chd-step-title" style="margin-top:24px">Step 3: Set the Stakes</div>';

  if (state.selectedType && state.selectedOpponent) {
    html += '<div class="chd-stakes-grid">';
    CHD_STAKES.forEach(function(s) {
      var selected = state.selectedStake === s.id ? ' chd-stake-selected' : '';
      html += '<div class="chd-stake-card' + selected + '" onclick="chdSelectStake(\'' + s.id + '\')">'
        + '<div class="chd-stake-icon">' + s.icon + '</div>'
        + '<div class="chd-stake-name">' + s.name + '</div>'
        + '<div class="chd-stake-desc">' + s.desc + '</div>'
        + '<div class="chd-stake-xp">+' + s.xp + ' XP</div>'
        + '</div>';
    });
    html += '</div>';
  } else {
    html += '<div class="chd-hint">Choose a duel type and opponent first.</div>';
  }

  // Launch button
  if (state.selectedType && state.selectedOpponent && state.selectedStake) {
    var duelType = CHD_DUEL_TYPES.find(function(d) { return d.id === state.selectedType; });
    var opponent = CHD_OPPONENTS.find(function(o) { return o.id === state.selectedOpponent; });
    var stake = CHD_STAKES.find(function(s) { return s.id === state.selectedStake; });

    html += '<div class="chd-launch">'
      + '<div class="chd-launch-summary">'
      + '<span class="chd-launch-type" style="color:' + duelType.color + '">' + duelType.icon + ' ' + duelType.name + '</span>'
      + ' vs <span class="chd-launch-opp">' + opponent.name + '</span>'
      + ' for <span class="chd-launch-stake">' + stake.name + '</span>'
      + '</div>'
      + '<button class="chd-launch-btn" onclick="chdLaunchDuel()">Challenge ' + opponent.name.split(' ')[0] + '!</button>'
      + '</div>';
  }

  html += '</div>';
  body.innerHTML = html;
}

function chdSelectType(typeId) {
  var state = chdGetState();
  state.selectedType = typeId;
  chdSaveState(state);
  chdRenderMatchup();
}

function chdSelectOpponent(oppId) {
  var state = chdGetState();
  state.selectedOpponent = oppId;
  chdSaveState(state);
  chdRenderMatchup();
}

function chdSelectStake(stakeId) {
  var state = chdGetState();
  state.selectedStake = stakeId;
  chdSaveState(state);
  chdRenderMatchup();
}

function chdLaunchDuel() {
  var state = chdGetState();
  if (!state.selectedType || !state.selectedOpponent || !state.selectedStake) return;

  var duelType = CHD_DUEL_TYPES.find(function(d) { return d.id === state.selectedType; });
  var opponent = CHD_OPPONENTS.find(function(o) { return o.id === state.selectedOpponent; });

  var now = Date.now();
  var duel = {
    id: 'duel_' + now,
    type: state.selectedType,
    typeName: duelType.name,
    opponent: state.selectedOpponent,
    opponentName: opponent.name,
    stake: state.selectedStake,
    startDate: new Date().toISOString(),
    endDate: new Date(now + duelType.duration * 86400000).toISOString(),
    duration: duelType.duration,
    status: 'active',
    userScore: 0,
    oppScore: 0,
    dayLog: []
  };

  // Store active duel
  if (!state.activeDuels) state.activeDuels = [];
  state.activeDuels.push(duel);

  // Clear selections
  delete state.selectedType;
  delete state.selectedOpponent;
  delete state.selectedStake;

  chdSaveState(state);
  chdSwitchTab('active');
}

// ── ACTIVE DUELS TAB ────────────────────────

function chdRenderActive() {
  var body = document.getElementById('chd-body');
  if (!body) return;

  var state = chdGetState();
  var activeDuels = state.activeDuels || [];

  // Simulate progress on existing duels
  activeDuels = activeDuels.map(function(d) {
    if (d.status !== 'active') return d;
    var daysSinceStart = Math.floor((Date.now() - new Date(d.startDate).getTime()) / 86400000);
    var duelType = CHD_DUEL_TYPES.find(function(dt) { return dt.id === d.type; });

    // Simulate opponent progress
    var oppDays = Math.min(daysSinceStart, d.duration);
    var oppCompleted = Math.floor(oppDays * (0.6 + Math.random() * 0.3));
    d.oppScore = oppCompleted;

    // User score from challenge state
    var challengeState = {};
    try { challengeState = JSON.parse(localStorage.getItem('ch_30day_v1') || '{}'); } catch (e) {}
    d.userScore = Math.min(challengeState.currentDay || 0, daysSinceStart);

    // Check if duel is over
    if (daysSinceStart >= d.duration) {
      d.status = d.userScore > d.oppScore ? 'won' : (d.userScore < d.oppScore ? 'lost' : 'draw');
      var history = chdGetHistory();
      history.unshift(Object.assign({}, d, { resolvedDate: new Date().toISOString() }));
      chdSaveHistory(history);
    }

    return d;
  });

  // Filter to only active
  var activeOnly = activeDuels.filter(function(d) { return d.status === 'active'; });
  state.activeDuels = activeDuels;
  chdSaveState(state);

  if (activeOnly.length === 0) {
    body.innerHTML = '<div class="chd-empty">'
      + '<div class="chd-empty-icon">&#9876;</div>'
      + '<div class="chd-empty-title">No Active Duels</div>'
      + '<div class="chd-empty-msg">Start a new duel to challenge another partner!</div>'
      + '<button class="chd-empty-btn" onclick="chdSwitchTab(\'matchup\')">Start a Duel</button>'
      + '</div>';
    return;
  }

  var html = '<div class="chd-active-list">';

  activeOnly.forEach(function(duel) {
    var duelType = CHD_DUEL_TYPES.find(function(dt) { return dt.id === duel.type; }) || {};
    var opponent = CHD_OPPONENTS.find(function(o) { return o.id === duel.opponent; }) || {};
    var stake = CHD_STAKES.find(function(s) { return s.id === duel.stake; }) || {};
    var daysSinceStart = Math.floor((Date.now() - new Date(duel.startDate).getTime()) / 86400000);
    var daysLeft = Math.max(0, duel.duration - daysSinceStart);
    var progressPct = Math.round((daysSinceStart / duel.duration) * 100);
    var userLeading = duel.userScore > duel.oppScore;
    var tied = duel.userScore === duel.oppScore;

    html += '<div class="chd-duel-active">'
      + '<div class="chd-duel-active-header">'
      + '<span class="chd-duel-type-badge" style="background:' + duelType.color + '15;color:' + duelType.color + '">' + duelType.icon + ' ' + duelType.name + '</span>'
      + '<span class="chd-duel-days-left">' + daysLeft + ' day' + (daysLeft !== 1 ? 's' : '') + ' left</span>'
      + '</div>';

    // VS display
    html += '<div class="chd-vs-display">'
      + '<div class="chd-vs-player' + (userLeading ? ' chd-vs-leading' : '') + '">'
      + '<div class="chd-vs-avatar" style="background:#3B82F6">You</div>'
      + '<div class="chd-vs-score">' + duel.userScore + '</div>'
      + '<div class="chd-vs-label">Your Score</div>'
      + '</div>'
      + '<div class="chd-vs-divider">'
      + '<div class="chd-vs-text">' + (tied ? 'TIED' : 'VS') + '</div>'
      + '</div>'
      + '<div class="chd-vs-player' + (!userLeading && !tied ? ' chd-vs-leading' : '') + '">'
      + '<div class="chd-vs-avatar" style="background:' + opponent.avatar + '">' + opponent.name.charAt(0) + '</div>'
      + '<div class="chd-vs-score">' + duel.oppScore + '</div>'
      + '<div class="chd-vs-label">' + opponent.name + '</div>'
      + '</div>'
      + '</div>';

    // Progress bar
    html += '<div class="chd-progress-track">'
      + '<div class="chd-progress-fill" style="width:' + progressPct + '%;background:' + duelType.color + '"></div>'
      + '</div>'
      + '<div class="chd-duel-meta">'
      + '<span>Stakes: ' + stake.name + ' (+' + stake.xp + ' XP)</span>'
      + '<span>' + (userLeading ? 'You\'re winning!' : tied ? 'Dead heat' : 'Time to step up!') + '</span>'
      + '</div>'
      + '</div>';
  });

  html += '</div>';
  body.innerHTML = html;
}

// ── DUEL HISTORY TAB ────────────────────────

function chdRenderHistory() {
  var body = document.getElementById('chd-body');
  if (!body) return;

  var history = chdGetHistory();

  // Add demo history if empty
  if (history.length === 0) {
    history = chdGenerateDemoHistory();
    chdSaveHistory(history);
  }

  var wins = history.filter(function(d) { return d.status === 'won'; }).length;
  var losses = history.filter(function(d) { return d.status === 'lost'; }).length;
  var draws = history.filter(function(d) { return d.status === 'draw'; }).length;

  var html = '<div class="chd-history">'
    + '<div class="chd-history-summary">'
    + '<div class="chd-hs" style="color:#10B981"><div class="chd-hs-num">' + wins + '</div><div class="chd-hs-label">Wins</div></div>'
    + '<div class="chd-hs" style="color:#EF4444"><div class="chd-hs-num">' + losses + '</div><div class="chd-hs-label">Losses</div></div>'
    + '<div class="chd-hs" style="color:#F59E0B"><div class="chd-hs-num">' + draws + '</div><div class="chd-hs-label">Draws</div></div>'
    + '<div class="chd-hs" style="color:#3B82F6"><div class="chd-hs-num">' + (wins + losses + draws > 0 ? Math.round((wins / (wins + losses + draws)) * 100) : 0) + '%</div><div class="chd-hs-label">Win Rate</div></div>'
    + '</div>'
    + '<div class="chd-history-list">';

  history.forEach(function(duel) {
    var duelType = CHD_DUEL_TYPES.find(function(dt) { return dt.id === duel.type; }) || {};
    var statusColors = { won: '#10B981', lost: '#EF4444', draw: '#F59E0B' };
    var statusLabels = { won: 'Victory', lost: 'Defeat', draw: 'Draw' };
    var date = new Date(duel.resolvedDate || duel.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    html += '<div class="chd-history-row">'
      + '<div class="chd-history-status" style="color:' + statusColors[duel.status] + '">' + statusLabels[duel.status] + '</div>'
      + '<div class="chd-history-info">'
      + '<div class="chd-history-type">' + duelType.icon + ' ' + duel.typeName + ' vs ' + duel.opponentName + '</div>'
      + '<div class="chd-history-score">' + duel.userScore + ' - ' + duel.oppScore + '</div>'
      + '</div>'
      + '<div class="chd-history-date">' + date + '</div>'
      + '</div>';
  });

  html += '</div></div>';
  body.innerHTML = html;
}

function chdGenerateDemoHistory() {
  var history = [];
  var now = Date.now();
  var day = 86400000;

  var demos = [
    { type: 'streak_war', opp: 'opp1', status: 'won', uScore: 7, oScore: 5, daysAgo: 3 },
    { type: 'point_blitz', opp: 'opp4', status: 'lost', uScore: 4, oScore: 7, daysAgo: 8 },
    { type: 'speed_run', opp: 'opp3', status: 'won', uScore: 5, oScore: 3, daysAgo: 12 },
    { type: 'consistency_check', opp: 'opp5', status: 'draw', uScore: 8, oScore: 8, daysAgo: 16 },
    { type: 'referral_race', opp: 'opp2', status: 'won', uScore: 2, oScore: 1, daysAgo: 22 },
    { type: 'content_sprint', opp: 'opp7', status: 'lost', uScore: 3, oScore: 4, daysAgo: 28 },
    { type: 'streak_war', opp: 'opp8', status: 'won', uScore: 7, oScore: 4, daysAgo: 35 }
  ];

  demos.forEach(function(d) {
    var duelType = CHD_DUEL_TYPES.find(function(dt) { return dt.id === d.type; });
    var opponent = CHD_OPPONENTS.find(function(o) { return o.id === d.opp; });
    history.push({
      id: 'demo_' + d.daysAgo,
      type: d.type,
      typeName: duelType ? duelType.name : d.type,
      opponent: d.opp,
      opponentName: opponent ? opponent.name : 'Unknown',
      stake: 'bragging',
      startDate: new Date(now - (d.daysAgo + 7) * day).toISOString(),
      endDate: new Date(now - d.daysAgo * day).toISOString(),
      resolvedDate: new Date(now - d.daysAgo * day).toISOString(),
      duration: duelType ? duelType.duration : 7,
      status: d.status,
      userScore: d.uScore,
      oppScore: d.oScore
    });
  });

  return history;
}

// ── RANKINGS TAB ────────────────────────

function chdRenderRankings() {
  var body = document.getElementById('chd-body');
  if (!body) return;

  // Generate rankings from opponent data + user
  var history = chdGetHistory();
  var userWins = history.filter(function(d) { return d.status === 'won'; }).length;
  var userLosses = history.filter(function(d) { return d.status === 'lost'; }).length;
  var userElo = 1200 + (userWins * 25) - (userLosses * 20);

  var rankings = CHD_OPPONENTS.map(function(opp) {
    return {
      name: opp.name,
      role: opp.role,
      avatar: opp.avatar,
      wins: opp.wins,
      losses: opp.losses,
      winRate: Math.round((opp.wins / (opp.wins + opp.losses)) * 100),
      elo: 1200 + (opp.wins * 25) - (opp.losses * 20),
      skill: opp.skill
    };
  });

  // Add user
  rankings.push({
    name: 'You',
    role: 'Partner',
    avatar: '#3B82F6',
    wins: userWins,
    losses: userLosses,
    winRate: (userWins + userLosses) > 0 ? Math.round((userWins / (userWins + userLosses)) * 100) : 0,
    elo: userElo,
    skill: 'you',
    isUser: true
  });

  // Sort by ELO
  rankings.sort(function(a, b) { return b.elo - a.elo; });

  var html = '<div class="chd-rankings">'
    + '<div class="chd-rank-header">'
    + '<span class="chd-rank-h-pos">#</span>'
    + '<span class="chd-rank-h-name">Partner</span>'
    + '<span class="chd-rank-h-elo">Rating</span>'
    + '<span class="chd-rank-h-record">Record</span>'
    + '<span class="chd-rank-h-wr">Win %</span>'
    + '</div>';

  rankings.forEach(function(r, i) {
    var highlight = r.isUser ? ' chd-rank-user' : '';
    var medalColors = ['#FFD700', '#C0C0C0', '#CD7F32'];
    var medal = i < 3 ? '<span style="color:' + medalColors[i] + '">&#9733;</span> ' : '';

    html += '<div class="chd-rank-row' + highlight + '">'
      + '<span class="chd-rank-pos">' + medal + (i + 1) + '</span>'
      + '<span class="chd-rank-name">'
      + '<span class="chd-rank-avatar" style="background:' + r.avatar + '">' + r.name.charAt(0) + '</span>'
      + r.name + (r.isUser ? ' (You)' : '') + '</span>'
      + '<span class="chd-rank-elo">' + r.elo + '</span>'
      + '<span class="chd-rank-record">' + r.wins + 'W / ' + r.losses + 'L</span>'
      + '<span class="chd-rank-wr">' + r.winRate + '%</span>'
      + '</div>';
  });

  html += '</div>';

  // ELO explanation
  html += '<div class="chd-elo-explain">'
    + '<div class="chd-elo-title">How Ratings Work</div>'
    + '<div class="chd-elo-body">Ratings are calculated using an ELO system similar to chess. Win against a higher-rated partner and your rating increases more. Lose to a lower-rated partner and it drops more. Starting rating is 1200.</div>'
    + '</div>';

  body.innerHTML = html;
}

// ── YOUR RECORD TAB ────────────────────────

function chdRenderStats() {
  var body = document.getElementById('chd-body');
  if (!body) return;

  var history = chdGetHistory();
  var wins = history.filter(function(d) { return d.status === 'won'; }).length;
  var losses = history.filter(function(d) { return d.status === 'lost'; }).length;
  var draws = history.filter(function(d) { return d.status === 'draw'; }).length;
  var total = wins + losses + draws;
  var winRate = total > 0 ? Math.round((wins / total) * 100) : 0;
  var elo = 1200 + (wins * 25) - (losses * 20);

  // Win rate ring
  var html = '<div class="chd-stats">'
    + '<div class="chd-stats-ring-wrap">'
    + '<div class="chd-stats-ring" style="background:conic-gradient(#10B981 ' + (winRate * 3.6) + 'deg, #EF4444 ' + (winRate * 3.6) + 'deg ' + ((winRate + (total > 0 ? Math.round((losses / total) * 100) : 0)) * 3.6) + 'deg, #F59E0B ' + ((winRate + (total > 0 ? Math.round((losses / total) * 100) : 0)) * 3.6) + 'deg)">'
    + '<div class="chd-stats-ring-inner">'
    + '<div class="chd-stats-ring-num">' + winRate + '%</div>'
    + '<div class="chd-stats-ring-label">Win Rate</div>'
    + '</div></div></div>';

  // Stats grid
  html += '<div class="chd-stats-grid">'
    + '<div class="chd-stats-card"><div class="chd-stats-val" style="color:#3B82F6">' + total + '</div><div class="chd-stats-lbl">Total Duels</div></div>'
    + '<div class="chd-stats-card"><div class="chd-stats-val" style="color:#10B981">' + wins + '</div><div class="chd-stats-lbl">Wins</div></div>'
    + '<div class="chd-stats-card"><div class="chd-stats-val" style="color:#EF4444">' + losses + '</div><div class="chd-stats-lbl">Losses</div></div>'
    + '<div class="chd-stats-card"><div class="chd-stats-val" style="color:#F59E0B">' + draws + '</div><div class="chd-stats-lbl">Draws</div></div>'
    + '<div class="chd-stats-card"><div class="chd-stats-val" style="color:#8B5CF6">' + elo + '</div><div class="chd-stats-lbl">ELO Rating</div></div>'
    + '<div class="chd-stats-card"><div class="chd-stats-val" style="color:#EC4899">' + chdCalcTotalXP(history) + '</div><div class="chd-stats-lbl">XP Earned</div></div>'
    + '</div>';

  // Performance by duel type
  html += '<div class="chd-stats-section-title">Performance by Duel Type</div>'
    + '<div class="chd-type-perf">';

  CHD_DUEL_TYPES.forEach(function(dt) {
    var typeMatches = history.filter(function(d) { return d.type === dt.id; });
    var typeWins = typeMatches.filter(function(d) { return d.status === 'won'; }).length;
    var typeTotal = typeMatches.length;
    var typeWR = typeTotal > 0 ? Math.round((typeWins / typeTotal) * 100) : 0;

    html += '<div class="chd-type-row">'
      + '<div class="chd-type-name" style="color:' + dt.color + '">' + dt.icon + ' ' + dt.name + '</div>'
      + '<div class="chd-type-bar-track"><div class="chd-type-bar-fill" style="width:' + typeWR + '%;background:' + dt.color + '"></div></div>'
      + '<div class="chd-type-stat">' + typeWins + '/' + typeTotal + ' (' + typeWR + '%)</div>'
      + '</div>';
  });

  html += '</div>';

  // Most faced opponents
  html += '<div class="chd-stats-section-title">Most Faced Opponents</div>'
    + '<div class="chd-faced-list">';

  var oppCounts = {};
  history.forEach(function(d) {
    if (!oppCounts[d.opponent]) oppCounts[d.opponent] = { wins: 0, losses: 0, draws: 0, name: d.opponentName };
    if (d.status === 'won') oppCounts[d.opponent].wins++;
    else if (d.status === 'lost') oppCounts[d.opponent].losses++;
    else oppCounts[d.opponent].draws++;
  });

  var oppList = Object.keys(oppCounts).map(function(k) { return Object.assign({ id: k }, oppCounts[k]); });
  oppList.sort(function(a, b) { return (b.wins + b.losses + b.draws) - (a.wins + a.losses + a.draws); });

  oppList.slice(0, 5).forEach(function(o) {
    var opp = CHD_OPPONENTS.find(function(op) { return op.id === o.id; });
    html += '<div class="chd-faced-row">'
      + '<div class="chd-faced-avatar" style="background:' + (opp ? opp.avatar : '#666') + '">' + o.name.charAt(0) + '</div>'
      + '<div class="chd-faced-info">'
      + '<div class="chd-faced-name">' + o.name + '</div>'
      + '<div class="chd-faced-record">' + o.wins + 'W - ' + o.losses + 'L - ' + o.draws + 'D</div>'
      + '</div></div>';
  });

  html += '</div></div>';
  body.innerHTML = html;
}

function chdCalcTotalXP(history) {
  var total = 0;
  history.forEach(function(d) {
    if (d.status === 'won') {
      var stake = CHD_STAKES.find(function(s) { return s.id === d.stake; });
      total += stake ? stake.xp : 10;
    }
  });
  return total;
}
