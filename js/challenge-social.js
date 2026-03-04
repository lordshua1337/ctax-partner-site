// ══════════════════════════════════════════
//  M4P1C3: CHALLENGE SOCIAL FEED & COMMUNITY HUB
//  Activity feed, reactions, daily tips, personal timeline, community stats
// ══════════════════════════════════════════

var CHS_STORAGE_KEY = 'ch_social_v1';
var CHS_REACTIONS_KEY = 'ch_social_reactions';

// ── SAMPLE PARTNER NETWORK ────────────────────────

var CHS_PARTNERS = [
  { id: 'p1', name: 'Sarah M.', role: 'CPA', avatar: '#3B82F6', tier: 'Rainmaker', day: 28, streak: 22 },
  { id: 'p2', name: 'James K.', role: 'Attorney', avatar: '#10B981', tier: 'Builder', day: 19, streak: 14 },
  { id: 'p3', name: 'Lisa R.', role: 'Financial Advisor', avatar: '#F59E0B', tier: 'Connector', day: 12, streak: 9 },
  { id: 'p4', name: 'Michael T.', role: 'CPA', avatar: '#EF4444', tier: 'Rainmaker', day: 30, streak: 30 },
  { id: 'p5', name: 'Amanda W.', role: 'Insurance Agent', avatar: '#8B5CF6', tier: 'Builder', day: 21, streak: 16 },
  { id: 'p6', name: 'David P.', role: 'Attorney', avatar: '#EC4899', tier: 'Starter', day: 5, streak: 5 },
  { id: 'p7', name: 'Rachel N.', role: 'Financial Advisor', avatar: '#14B8A6', tier: 'Connector', day: 14, streak: 11 },
  { id: 'p8', name: 'Chris L.', role: 'CPA', avatar: '#F97316', tier: 'Builder', day: 17, streak: 13 },
  { id: 'p9', name: 'Jennifer H.', role: 'Attorney', avatar: '#6366F1', tier: 'Rainmaker', day: 25, streak: 20 },
  { id: 'p10', name: 'Kevin B.', role: 'Insurance Agent', avatar: '#84CC16', tier: 'Connector', day: 10, streak: 7 }
];

// ── ACTIVITY EVENT TYPES ────────────────────────

var CHS_EVENT_TYPES = {
  day_complete: { icon: '&#10003;', label: 'Completed Day', color: '#10B981' },
  streak: { icon: '&#9889;', label: 'Streak Milestone', color: '#F59E0B' },
  badge: { icon: '&#9733;', label: 'Badge Earned', color: '#8B5CF6' },
  tier_up: { icon: '&#9650;', label: 'Tier Promotion', color: '#3B82F6' },
  referral: { icon: '&#128176;', label: 'First Referral', color: '#EF4444' },
  perfect_week: { icon: '&#127942;', label: 'Perfect Week', color: '#EC4899' },
  challenge_complete: { icon: '&#127881;', label: 'Challenge Complete', color: '#14B8A6' },
  tip: { icon: '&#128161;', label: 'Daily Tip', color: '#6366F1' },
  milestone: { icon: '&#127941;', label: 'Milestone', color: '#F97316' }
};

// ── DAILY MOTIVATIONAL TIPS ────────────────────────

var CHS_DAILY_TIPS = [
  { title: 'The 5-Minute Rule', body: 'When you don\'t feel like reaching out to a prospect, commit to just 5 minutes. Most of the time, you\'ll keep going once you start. Momentum beats motivation every time.' },
  { title: 'Follow Up > First Touch', body: '80% of sales require at least 5 follow-ups. Most partners give up after 1-2 attempts. The fortune is literally in the follow-up.' },
  { title: 'Warm Introductions Win', body: 'A warm introduction converts 50x better than a cold email. Ask your existing clients: "Who else do you know that might need help with their taxes?"' },
  { title: 'Track Everything', body: 'You can\'t improve what you don\'t measure. Log every conversation, every referral, every outcome. Patterns emerge from data, not feelings.' },
  { title: 'The Objection Flip', body: 'When a prospect says "I already have a tax person," respond with "That\'s great -- are they also helping you with [specific service]?" Position as complementary, not competitive.' },
  { title: 'Calendar Blocking', body: 'Block 30 minutes every morning for outreach. Treat it like a meeting you can\'t cancel. Partners who time-block their outreach close 3x more referrals.' },
  { title: 'The Stacking Effect', body: 'Each referral teaches you something. By referral #10, your pitch is natural. By #25, you\'re coaching others. By #50, you\'re building a system. Keep stacking.' },
  { title: 'Content Creates Trust', body: 'Share one helpful tax tip per week on LinkedIn or via email. You don\'t need to be a content creator -- just share what you know. Expertise attracts referrals.' },
  { title: 'The Power of Specificity', body: 'Don\'t say "I work with people who have tax problems." Say "I help small business owners who owe $50K+ to the IRS negotiate settlements that save them 60-80%."' },
  { title: 'Celebrate Small Wins', body: 'Every completed task in this challenge is a step forward. Your first referral might take 2 weeks. Your second might take 2 days. Progress is not linear.' },
  { title: 'Build Referral Reciprocity', body: 'Refer business TO your network partners first. When you send them a client, they remember. Reciprocity is the most powerful force in business relationships.' },
  { title: 'Weekend Prep = Weekday Speed', body: 'Spend 15 minutes on Sunday reviewing your week ahead. Which prospects need follow-up? Which tools should you explore? Preparation eliminates decision fatigue.' },
  { title: 'The LinkedIn Play', body: 'Comment thoughtfully on 5 posts from CPAs, attorneys, and advisors in your area. Don\'t pitch -- add value. Within 30 days, they\'ll know your name.' },
  { title: 'Imperfect Action > Perfect Planning', body: 'Your first referral pitch won\'t be perfect. Send it anyway. Your first email template won\'t be flawless. Use it anyway. Iteration beats ideation.' },
  { title: 'The Partner Mindset Shift', body: 'Stop thinking "I\'m selling tax services." Start thinking "I\'m connecting people with solutions to their biggest financial stress." The frame changes everything.' }
];

// ── GENERATE SIMULATED FEED ────────────────────────

function chsGenerateFeed() {
  var events = [];
  var now = Date.now();
  var day = 86400000;

  CHS_PARTNERS.forEach(function(p) {
    // Day completions (scattered over past days)
    var completedDays = Math.min(p.day, 30);
    for (var d = Math.max(1, completedDays - 4); d <= completedDays; d++) {
      var daysAgo = completedDays - d;
      events.push({
        id: p.id + '_day_' + d,
        partnerId: p.id,
        partner: p,
        type: 'day_complete',
        day: d,
        message: 'completed Day ' + d + ' of the 30-Day Challenge',
        timestamp: now - (daysAgo * day) - Math.floor(Math.random() * day * 0.5)
      });
    }

    // Streak milestones
    if (p.streak >= 7) {
      events.push({
        id: p.id + '_streak7',
        partnerId: p.id,
        partner: p,
        type: 'streak',
        message: 'hit a 7-day streak! Consistency pays off.',
        timestamp: now - ((completedDays - 7) * day)
      });
    }
    if (p.streak >= 14) {
      events.push({
        id: p.id + '_streak14',
        partnerId: p.id,
        partner: p,
        type: 'streak',
        message: 'reached a 14-day streak! Unstoppable momentum.',
        timestamp: now - ((completedDays - 14) * day)
      });
    }
    if (p.streak >= 21) {
      events.push({
        id: p.id + '_streak21',
        partnerId: p.id,
        partner: p,
        type: 'streak',
        message: 'hit a 21-day streak! Habits are locked in.',
        timestamp: now - ((completedDays - 21) * day)
      });
    }

    // Tier promotions
    if (p.day >= 8) {
      events.push({
        id: p.id + '_tier_connector',
        partnerId: p.id,
        partner: p,
        type: 'tier_up',
        message: 'leveled up to The Connector tier!',
        timestamp: now - ((completedDays - 8) * day)
      });
    }
    if (p.day >= 15) {
      events.push({
        id: p.id + '_tier_builder',
        partnerId: p.id,
        partner: p,
        type: 'tier_up',
        message: 'leveled up to The Builder tier!',
        timestamp: now - ((completedDays - 15) * day)
      });
    }
    if (p.day >= 22) {
      events.push({
        id: p.id + '_tier_rain',
        partnerId: p.id,
        partner: p,
        type: 'tier_up',
        message: 'leveled up to The Rainmaker tier!',
        timestamp: now - ((completedDays - 22) * day)
      });
    }

    // Challenge complete
    if (p.day >= 30) {
      events.push({
        id: p.id + '_complete',
        partnerId: p.id,
        partner: p,
        type: 'challenge_complete',
        message: 'completed the entire 30-Day Challenge! Legendary.',
        timestamp: now - day * 0.5
      });
    }

    // Badge earned (random assignment for variety)
    if (p.day >= 7) {
      events.push({
        id: p.id + '_badge_week',
        partnerId: p.id,
        partner: p,
        type: 'badge',
        message: 'earned the "Week Warrior" badge',
        timestamp: now - ((completedDays - 7) * day) + day * 0.3
      });
    }

    // Referral milestone (random for some partners)
    if (p.day >= 10 && (p.id === 'p1' || p.id === 'p4' || p.id === 'p5' || p.id === 'p9')) {
      events.push({
        id: p.id + '_referral',
        partnerId: p.id,
        partner: p,
        type: 'referral',
        message: 'submitted their first client referral!',
        timestamp: now - ((completedDays - 10) * day)
      });
    }
  });

  // Add daily tips (most recent 5)
  for (var t = 0; t < 5; t++) {
    var tipIdx = (new Date().getDate() + t) % CHS_DAILY_TIPS.length;
    events.push({
      id: 'tip_' + t,
      partnerId: null,
      partner: null,
      type: 'tip',
      tipData: CHS_DAILY_TIPS[tipIdx],
      message: CHS_DAILY_TIPS[tipIdx].title,
      timestamp: now - (t * day) + day * 0.1
    });
  }

  // Sort by timestamp descending
  events.sort(function(a, b) { return b.timestamp - a.timestamp; });
  return events;
}

// ── COMMUNITY STATS ────────────────────────

function chsCalcCommunityStats() {
  var totalDays = 0;
  var totalStreaks = 0;
  var completedPartners = 0;
  var activePartners = CHS_PARTNERS.length;

  CHS_PARTNERS.forEach(function(p) {
    totalDays += p.day;
    totalStreaks += p.streak;
    if (p.day >= 30) completedPartners++;
  });

  var userState = {};
  try { userState = JSON.parse(localStorage.getItem('ch_30day_v1') || '{}'); } catch (e) {}
  var userDay = userState.currentDay || 0;
  var userStreak = userState.streak || 0;

  return {
    totalPartners: activePartners + 1,
    totalDaysCompleted: totalDays + userDay,
    avgStreak: Math.round((totalStreaks + userStreak) / (activePartners + 1)),
    completionRate: Math.round((completedPartners / (activePartners + 1)) * 100),
    topStreak: Math.max.apply(null, CHS_PARTNERS.map(function(p) { return p.streak; }).concat([userStreak])),
    totalBadgesEarned: CHS_PARTNERS.filter(function(p) { return p.day >= 7; }).length * 2 + (userDay >= 7 ? 2 : 0),
    totalReferrals: 4 + (userDay >= 10 ? 1 : 0)
  };
}

// ── REACTIONS SYSTEM ────────────────────────

function chsGetReactions() {
  try { return JSON.parse(localStorage.getItem(CHS_REACTIONS_KEY) || '{}'); } catch (e) { return {}; }
}

function chsSaveReactions(data) {
  try { localStorage.setItem(CHS_REACTIONS_KEY, JSON.stringify(data)); } catch (e) {}
}

function chsToggleReaction(eventId, emoji) {
  var reactions = chsGetReactions();
  if (!reactions[eventId]) reactions[eventId] = {};
  if (reactions[eventId][emoji]) {
    delete reactions[eventId][emoji];
    if (Object.keys(reactions[eventId]).length === 0) delete reactions[eventId];
  } else {
    reactions[eventId][emoji] = true;
  }
  chsSaveReactions(reactions);
  chsRenderFeed(document.getElementById('chs-feed-filter-active'));
}

// ── TIME FORMATTING ────────────────────────

function chsTimeAgo(ts) {
  var diff = Date.now() - ts;
  var mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return mins + 'm ago';
  var hrs = Math.floor(mins / 60);
  if (hrs < 24) return hrs + 'h ago';
  var days = Math.floor(hrs / 24);
  if (days === 1) return 'yesterday';
  if (days < 7) return days + 'd ago';
  return Math.floor(days / 7) + 'w ago';
}

// ── PERSONAL TIMELINE ────────────────────────

function chsBuildTimeline() {
  var userState = {};
  try { userState = JSON.parse(localStorage.getItem('ch_30day_v1') || '{}'); } catch (e) {}
  var currentDay = userState.currentDay || 0;
  var completed = userState.completed || [];
  var skipped = userState.skipped || [];
  var streak = userState.streak || 0;
  var timeline = [];

  // Milestones achieved
  if (currentDay >= 1) timeline.push({ day: 1, label: 'Started the Challenge', type: 'milestone' });
  if (currentDay >= 7) timeline.push({ day: 7, label: 'First Week Complete', type: 'streak' });
  if (streak >= 7) timeline.push({ day: 7, label: '7-Day Streak Achieved', type: 'streak' });
  if (currentDay >= 14) timeline.push({ day: 14, label: 'Two Weeks In', type: 'milestone' });
  if (streak >= 14) timeline.push({ day: 14, label: '14-Day Streak!', type: 'streak' });
  if (currentDay >= 21) timeline.push({ day: 21, label: 'Three Weeks Down', type: 'milestone' });
  if (streak >= 21) timeline.push({ day: 21, label: '21-Day Streak -- Habit Formed', type: 'streak' });
  if (currentDay >= 30) timeline.push({ day: 30, label: 'Challenge Complete!', type: 'challenge_complete' });

  // Tier progressions
  if (currentDay >= 8) timeline.push({ day: 8, label: 'Promoted to The Connector', type: 'tier_up' });
  if (currentDay >= 15) timeline.push({ day: 15, label: 'Promoted to The Builder', type: 'tier_up' });
  if (currentDay >= 22) timeline.push({ day: 22, label: 'Promoted to The Rainmaker', type: 'tier_up' });

  // Stats summary
  var completedCount = completed.length;
  var skippedCount = skipped.length;
  var completionPct = currentDay > 0 ? Math.round((completedCount / currentDay) * 100) : 0;

  return { timeline: timeline.sort(function(a, b) { return b.day - a.day; }), completedCount: completedCount, skippedCount: skippedCount, completionPct: completionPct, currentDay: currentDay, streak: streak };
}

// ── MAIN MODAL ────────────────────────

function chsShowSocial() {
  var existing = document.getElementById('chs-modal');
  if (existing) existing.remove();

  var overlay = document.createElement('div');
  overlay.className = 'chs-overlay';
  overlay.id = 'chs-modal';
  overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };

  var modal = document.createElement('div');
  modal.className = 'chs-modal';

  modal.innerHTML = '<div class="chs-header">'
    + '<div><div class="chs-title">Community Hub</div>'
    + '<div class="chs-subtitle">See what the partner community is achieving</div></div>'
    + '<button class="chs-close" onclick="document.getElementById(\'chs-modal\').remove()">&times;</button>'
    + '</div>'
    + '<div class="chs-tabs" id="chs-tabs"></div>'
    + '<div class="chs-body" id="chs-body"></div>';

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  chsRenderTabs('feed');
}

// ── TABS ────────────────────────

function chsRenderTabs(active) {
  var tabs = [
    { id: 'feed', label: 'Activity Feed' },
    { id: 'community', label: 'Community Stats' },
    { id: 'timeline', label: 'Your Story' },
    { id: 'tips', label: 'Daily Tips' }
  ];

  var html = '';
  tabs.forEach(function(t) {
    html += '<button class="chs-tab' + (t.id === active ? ' chs-tab-active' : '') + '" onclick="chsSwitchTab(\'' + t.id + '\')">' + t.label + '</button>';
  });

  var tabsEl = document.getElementById('chs-tabs');
  if (tabsEl) tabsEl.innerHTML = html;

  chsSwitchTab(active);
}

function chsSwitchTab(tab) {
  var tabBtns = document.querySelectorAll('.chs-tab');
  tabBtns.forEach(function(btn) {
    btn.classList.toggle('chs-tab-active', btn.textContent === { feed: 'Activity Feed', community: 'Community Stats', timeline: 'Your Story', tips: 'Daily Tips' }[tab]);
  });

  var body = document.getElementById('chs-body');
  if (!body) return;

  if (tab === 'feed') chsRenderFeed();
  else if (tab === 'community') chsRenderCommunity();
  else if (tab === 'timeline') chsRenderTimeline();
  else if (tab === 'tips') chsRenderTips();
}

// ── ACTIVITY FEED TAB ────────────────────────

function chsRenderFeed(activeFilter) {
  var body = document.getElementById('chs-body');
  if (!body) return;

  var filter = activeFilter || 'all';
  var events = chsGenerateFeed();
  var reactions = chsGetReactions();

  if (filter !== 'all') {
    events = events.filter(function(e) { return e.type === filter; });
  }

  var filterBtns = '<div class="chs-filters" id="chs-feed-filters">'
    + '<button class="chs-filter-btn' + (filter === 'all' ? ' chs-filter-active' : '') + '" onclick="chsRenderFeed(\'all\')">All</button>'
    + '<button class="chs-filter-btn' + (filter === 'day_complete' ? ' chs-filter-active' : '') + '" onclick="chsRenderFeed(\'day_complete\')">Completions</button>'
    + '<button class="chs-filter-btn' + (filter === 'streak' ? ' chs-filter-active' : '') + '" onclick="chsRenderFeed(\'streak\')">Streaks</button>'
    + '<button class="chs-filter-btn' + (filter === 'badge' ? ' chs-filter-active' : '') + '" onclick="chsRenderFeed(\'badge\')">Badges</button>'
    + '<button class="chs-filter-btn' + (filter === 'tier_up' ? ' chs-filter-active' : '') + '" onclick="chsRenderFeed(\'tier_up\')">Promotions</button>'
    + '<button class="chs-filter-btn' + (filter === 'tip' ? ' chs-filter-active' : '') + '" onclick="chsRenderFeed(\'tip\')">Tips</button>'
    + '</div>';

  // Store active filter for reaction re-render
  var html = filterBtns + '<div class="chs-feed-list">';

  var shown = events.slice(0, 30);

  shown.forEach(function(evt) {
    var evtType = CHS_EVENT_TYPES[evt.type] || { icon: '&#8226;', label: '', color: '#666' };
    var evtReactions = reactions[evt.id] || {};
    var reactionEmojis = ['fire', 'clap', 'heart', 'rocket'];
    var reactionLabels = { fire: '&#128293;', clap: '&#128079;', heart: '&#10084;', rocket: '&#128640;' };

    if (evt.type === 'tip' && evt.tipData) {
      html += '<div class="chs-feed-item chs-feed-tip">'
        + '<div class="chs-feed-tip-icon" style="color:' + evtType.color + '">' + evtType.icon + '</div>'
        + '<div class="chs-feed-tip-content">'
        + '<div class="chs-feed-tip-title">' + evt.tipData.title + '</div>'
        + '<div class="chs-feed-tip-body">' + evt.tipData.body + '</div>'
        + '<div class="chs-feed-time">' + chsTimeAgo(evt.timestamp) + '</div>'
        + '</div></div>';
      return;
    }

    html += '<div class="chs-feed-item">'
      + '<div class="chs-feed-avatar" style="background:' + (evt.partner ? evt.partner.avatar : '#666') + '">'
      + (evt.partner ? evt.partner.name.charAt(0) : '?') + '</div>'
      + '<div class="chs-feed-content">'
      + '<div class="chs-feed-main">'
      + '<span class="chs-feed-name">' + (evt.partner ? evt.partner.name : 'Unknown') + '</span> '
      + '<span class="chs-feed-msg">' + evt.message + '</span>'
      + '</div>'
      + '<div class="chs-feed-meta">'
      + '<span class="chs-feed-badge" style="background:' + evtType.color + '15;color:' + evtType.color + '">' + evtType.icon + ' ' + evtType.label + '</span>'
      + '<span class="chs-feed-time">' + chsTimeAgo(evt.timestamp) + '</span>'
      + '</div>'
      + '<div class="chs-feed-reactions">';

    reactionEmojis.forEach(function(emoji) {
      var active = evtReactions[emoji] ? ' chs-reaction-active' : '';
      var simCount = Math.floor(Math.random() * 5) + (evtReactions[emoji] ? 1 : 0);
      html += '<button class="chs-reaction-btn' + active + '" onclick="chsToggleReaction(\'' + evt.id + '\',\'' + emoji + '\')">'
        + reactionLabels[emoji] + (simCount > 0 ? ' <span class="chs-reaction-count">' + simCount + '</span>' : '')
        + '</button>';
    });

    html += '</div></div></div>';
  });

  if (shown.length === 0) {
    html += '<div class="chs-empty">No activity matching this filter yet.</div>';
  }

  html += '</div>';
  body.innerHTML = html;

  // Store active filter reference
  var activeBtn = body.querySelector('.chs-filter-active');
  if (activeBtn) activeBtn.id = 'chs-feed-filter-active';
}

// ── COMMUNITY STATS TAB ────────────────────────

function chsRenderCommunity() {
  var body = document.getElementById('chs-body');
  if (!body) return;

  var stats = chsCalcCommunityStats();

  var html = '<div class="chs-community">'
    + '<div class="chs-comm-hero">'
    + '<div class="chs-comm-hero-num">' + stats.totalPartners + '</div>'
    + '<div class="chs-comm-hero-label">Partners in the Challenge</div>'
    + '</div>'
    + '<div class="chs-comm-grid">'
    + chsStatCard('Total Days Completed', stats.totalDaysCompleted, '#10B981')
    + chsStatCard('Average Streak', stats.avgStreak + ' days', '#F59E0B')
    + chsStatCard('Longest Streak', stats.topStreak + ' days', '#EF4444')
    + chsStatCard('Completion Rate', stats.completionRate + '%', '#3B82F6')
    + chsStatCard('Badges Earned', stats.totalBadgesEarned, '#8B5CF6')
    + chsStatCard('Total Referrals', stats.totalReferrals, '#EC4899')
    + '</div>';

  // Tier distribution
  var tiers = { Starter: 0, Connector: 0, Builder: 0, Rainmaker: 0 };
  CHS_PARTNERS.forEach(function(p) { tiers[p.tier]++; });
  var userState = {};
  try { userState = JSON.parse(localStorage.getItem('ch_30day_v1') || '{}'); } catch (e) {}
  var userDay = userState.currentDay || 0;
  if (userDay >= 22) tiers.Rainmaker++;
  else if (userDay >= 15) tiers.Builder++;
  else if (userDay >= 8) tiers.Connector++;
  else tiers.Starter++;

  var total = stats.totalPartners;
  html += '<div class="chs-comm-section">'
    + '<div class="chs-comm-section-title">Tier Distribution</div>'
    + '<div class="chs-tier-bars">';

  var tierColors = { Starter: '#94A3B8', Connector: '#F59E0B', Builder: '#3B82F6', Rainmaker: '#10B981' };
  ['Starter', 'Connector', 'Builder', 'Rainmaker'].forEach(function(tier) {
    var pct = Math.round((tiers[tier] / total) * 100);
    html += '<div class="chs-tier-row">'
      + '<div class="chs-tier-label">' + tier + '</div>'
      + '<div class="chs-tier-bar-track"><div class="chs-tier-bar-fill" style="width:' + pct + '%;background:' + tierColors[tier] + '"></div></div>'
      + '<div class="chs-tier-pct">' + tiers[tier] + ' (' + pct + '%)</div>'
      + '</div>';
  });

  html += '</div></div>';

  // Top performers
  var topPerformers = CHS_PARTNERS.slice().sort(function(a, b) { return b.day - a.day; }).slice(0, 5);
  html += '<div class="chs-comm-section">'
    + '<div class="chs-comm-section-title">Top Performers</div>'
    + '<div class="chs-leaderboard">';

  topPerformers.forEach(function(p, i) {
    var medals = ['#FFD700', '#C0C0C0', '#CD7F32', '#94A3B8', '#94A3B8'];
    html += '<div class="chs-lb-row">'
      + '<div class="chs-lb-rank" style="color:' + medals[i] + '">#' + (i + 1) + '</div>'
      + '<div class="chs-lb-avatar" style="background:' + p.avatar + '">' + p.name.charAt(0) + '</div>'
      + '<div class="chs-lb-info">'
      + '<div class="chs-lb-name">' + p.name + '</div>'
      + '<div class="chs-lb-meta">' + p.role + ' -- Day ' + p.day + ' -- ' + p.streak + '-day streak</div>'
      + '</div>'
      + '<div class="chs-lb-tier" style="background:' + tierColors[p.tier] + '15;color:' + tierColors[p.tier] + '">' + p.tier + '</div>'
      + '</div>';
  });

  html += '</div></div>';

  // Activity by day of week (simulated)
  html += '<div class="chs-comm-section">'
    + '<div class="chs-comm-section-title">Activity by Day of Week</div>'
    + '<div class="chs-dow-chart">';

  var dows = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  var dowValues = [85, 92, 78, 88, 95, 45, 38];
  var maxDow = Math.max.apply(null, dowValues);

  dows.forEach(function(d, i) {
    var pct = Math.round((dowValues[i] / maxDow) * 100);
    var isHigh = dowValues[i] === maxDow;
    html += '<div class="chs-dow-col">'
      + '<div class="chs-dow-bar" style="height:' + pct + '%;background:' + (isHigh ? '#3B82F6' : '#3B82F630') + '"></div>'
      + '<div class="chs-dow-label">' + d + '</div>'
      + '</div>';
  });

  html += '</div>'
    + '<div class="chs-dow-insight">Partners are most active on Fridays and least active on weekends. Schedule your outreach mid-week for maximum momentum.</div>'
    + '</div>';

  html += '</div>';
  body.innerHTML = html;
}

function chsStatCard(label, value, color) {
  return '<div class="chs-stat-card">'
    + '<div class="chs-stat-value" style="color:' + color + '">' + value + '</div>'
    + '<div class="chs-stat-label">' + label + '</div>'
    + '</div>';
}

// ── YOUR STORY TAB ────────────────────────

function chsRenderTimeline() {
  var body = document.getElementById('chs-body');
  if (!body) return;

  var data = chsBuildTimeline();

  var html = '<div class="chs-timeline">';

  // Summary row
  html += '<div class="chs-tl-summary">'
    + '<div class="chs-tl-stat"><div class="chs-tl-stat-num">' + data.currentDay + '</div><div class="chs-tl-stat-label">Days</div></div>'
    + '<div class="chs-tl-stat"><div class="chs-tl-stat-num">' + data.streak + '</div><div class="chs-tl-stat-label">Streak</div></div>'
    + '<div class="chs-tl-stat"><div class="chs-tl-stat-num">' + data.completedCount + '</div><div class="chs-tl-stat-label">Completed</div></div>'
    + '<div class="chs-tl-stat"><div class="chs-tl-stat-num">' + data.completionPct + '%</div><div class="chs-tl-stat-label">Rate</div></div>'
    + '</div>';

  // Progress ring
  var ringPct = Math.round((data.currentDay / 30) * 100);
  html += '<div class="chs-tl-ring-wrap">'
    + '<div class="chs-tl-ring" style="background:conic-gradient(#3B82F6 ' + (ringPct * 3.6) + 'deg, #1E293B20 ' + (ringPct * 3.6) + 'deg)">'
    + '<div class="chs-tl-ring-inner">'
    + '<div class="chs-tl-ring-num">' + ringPct + '%</div>'
    + '<div class="chs-tl-ring-label">Complete</div>'
    + '</div></div></div>';

  // Timeline events
  if (data.timeline.length > 0) {
    html += '<div class="chs-tl-events">'
      + '<div class="chs-tl-events-title">Your Journey</div>';

    data.timeline.forEach(function(evt) {
      var evtType = CHS_EVENT_TYPES[evt.type] || { icon: '&#8226;', color: '#666' };
      html += '<div class="chs-tl-event">'
        + '<div class="chs-tl-event-dot" style="background:' + evtType.color + '"></div>'
        + '<div class="chs-tl-event-content">'
        + '<div class="chs-tl-event-label">' + evt.label + '</div>'
        + '<div class="chs-tl-event-day">Day ' + evt.day + '</div>'
        + '</div></div>';
    });

    html += '</div>';
  } else {
    html += '<div class="chs-empty">Start the 30-Day Challenge to begin your story! Every completed day adds to your timeline.</div>';
  }

  // Next milestone
  var nextMilestones = [];
  if (data.currentDay < 7) nextMilestones.push({ day: 7, label: 'First Week Complete' });
  if (data.currentDay < 14) nextMilestones.push({ day: 14, label: 'Two Weeks In' });
  if (data.currentDay < 21) nextMilestones.push({ day: 21, label: 'Three Weeks Down' });
  if (data.currentDay < 30) nextMilestones.push({ day: 30, label: 'Challenge Complete!' });

  if (nextMilestones.length > 0) {
    var next = nextMilestones[0];
    var daysToGo = next.day - data.currentDay;
    html += '<div class="chs-tl-next">'
      + '<div class="chs-tl-next-title">Next Milestone</div>'
      + '<div class="chs-tl-next-name">' + next.label + '</div>'
      + '<div class="chs-tl-next-days">' + daysToGo + ' day' + (daysToGo !== 1 ? 's' : '') + ' to go</div>'
      + '</div>';
  }

  html += '</div>';
  body.innerHTML = html;
}

// ── DAILY TIPS TAB ────────────────────────

function chsRenderTips() {
  var body = document.getElementById('chs-body');
  if (!body) return;

  var todayIdx = new Date().getDate() % CHS_DAILY_TIPS.length;
  var todayTip = CHS_DAILY_TIPS[todayIdx];

  var html = '<div class="chs-tips">'
    + '<div class="chs-tips-featured">'
    + '<div class="chs-tips-featured-badge">Tip of the Day</div>'
    + '<div class="chs-tips-featured-title">' + todayTip.title + '</div>'
    + '<div class="chs-tips-featured-body">' + todayTip.body + '</div>'
    + '</div>'
    + '<div class="chs-tips-grid">';

  CHS_DAILY_TIPS.forEach(function(tip, i) {
    if (i === todayIdx) return;
    var isRead = false;
    try {
      var readTips = JSON.parse(localStorage.getItem('ch_read_tips') || '[]');
      isRead = readTips.indexOf(i) !== -1;
    } catch (e) {}

    html += '<div class="chs-tip-card' + (isRead ? ' chs-tip-read' : '') + '" onclick="chsMarkTipRead(' + i + ',this)">'
      + '<div class="chs-tip-num">#' + (i + 1) + '</div>'
      + '<div class="chs-tip-title">' + tip.title + '</div>'
      + '<div class="chs-tip-preview">' + tip.body.substring(0, 80) + '...</div>'
      + '</div>';
  });

  html += '</div></div>';
  body.innerHTML = html;
}

function chsMarkTipRead(idx, el) {
  try {
    var readTips = JSON.parse(localStorage.getItem('ch_read_tips') || '[]');
    if (readTips.indexOf(idx) === -1) {
      readTips.push(idx);
      localStorage.setItem('ch_read_tips', JSON.stringify(readTips));
    }
  } catch (e) {}

  // Expand the tip
  var tip = CHS_DAILY_TIPS[idx];
  if (el.classList.contains('chs-tip-expanded')) {
    el.classList.remove('chs-tip-expanded');
    el.querySelector('.chs-tip-preview').textContent = tip.body.substring(0, 80) + '...';
    return;
  }
  el.classList.add('chs-tip-expanded', 'chs-tip-read');
  el.querySelector('.chs-tip-preview').textContent = tip.body;
}

// ── AI COMMUNITY INSIGHTS ────────────────────────

function chsAiInsights() {
  var body = document.getElementById('chs-body');
  if (!body) return;

  var stats = chsCalcCommunityStats();
  var userData = chsBuildTimeline();

  var insightsDiv = document.getElementById('chs-ai-insights');
  if (insightsDiv) {
    insightsDiv.innerHTML = '<div class="chs-loading">Generating community insights...</div>';
  }

  var prompt = 'You are a partner success coach. Based on these community challenge stats, give 3-4 specific, actionable insights.'
    + ' Community: ' + stats.totalPartners + ' partners, ' + stats.totalDaysCompleted + ' total days completed, avg streak ' + stats.avgStreak + ' days.'
    + ' User is on Day ' + userData.currentDay + ' with a ' + userData.streak + '-day streak and ' + userData.completionPct + '% completion rate.'
    + ' Format: Return a JSON array of objects with "title" and "insight" keys.';

  fetch(typeof CTAX_API_URL !== 'undefined' ? CTAX_API_URL : 'https://ctax-api-proxy.vercel.app/api/chat', {
    method: 'POST',
    headers: typeof getApiHeaders === 'function' ? getApiHeaders() : { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }]
    })
  })
  .then(function(r) { return r.json(); })
  .then(function(data) {
    var text = data.content ? data.content[0].text : '';
    var insights = [];
    try {
      var match = text.match(/\[[\s\S]*\]/);
      if (match) insights = JSON.parse(match[0]);
    } catch (e) {}

    if (insights.length === 0) {
      insights = chsGetFallbackInsights(stats, userData);
    }

    if (insightsDiv) {
      var ihtml = '';
      insights.forEach(function(item) {
        ihtml += '<div class="chs-insight-card">'
          + '<div class="chs-insight-title">' + item.title + '</div>'
          + '<div class="chs-insight-body">' + item.insight + '</div>'
          + '</div>';
      });
      insightsDiv.innerHTML = ihtml;
    }
  })
  .catch(function() {
    var insights = chsGetFallbackInsights(stats, userData);
    if (insightsDiv) {
      var ihtml = '';
      insights.forEach(function(item) {
        ihtml += '<div class="chs-insight-card">'
          + '<div class="chs-insight-title">' + item.title + '</div>'
          + '<div class="chs-insight-body">' + item.insight + '</div>'
          + '</div>';
      });
      insightsDiv.innerHTML = ihtml;
    }
  });
}

function chsGetFallbackInsights(stats, userData) {
  var insights = [];

  if (userData.currentDay < 7) {
    insights.push({ title: 'First Week Focus', insight: 'You\'re in the critical first week. Partners who complete all 7 days in Week 1 are 4x more likely to finish the full challenge. Keep your streak alive!' });
  } else if (userData.currentDay < 14) {
    insights.push({ title: 'Momentum Phase', insight: 'You\'re past the hardest part. Week 2 is where habits start forming. The community average streak is ' + stats.avgStreak + ' days -- you\'re building something real.' });
  } else if (userData.currentDay < 21) {
    insights.push({ title: 'Builder Territory', insight: 'Three weeks of consistent action puts you in the top tier of partners. At this point, your skills compound -- each conversation gets easier, each referral comes faster.' });
  } else {
    insights.push({ title: 'Rainmaker Status', insight: 'You\'re in elite territory. Only ' + stats.completionRate + '% of partners reach this stage. The habits you\'ve built over ' + userData.currentDay + ' days are now your competitive advantage.' });
  }

  if (userData.streak > stats.avgStreak) {
    insights.push({ title: 'Above Average', insight: 'Your ' + userData.streak + '-day streak beats the community average of ' + stats.avgStreak + ' days. You\'re outperforming most partners -- keep this momentum going.' });
  } else {
    insights.push({ title: 'Room to Grow', insight: 'The community averages a ' + stats.avgStreak + '-day streak. Focus on not breaking yours -- even completing partial tasks keeps the chain alive.' });
  }

  insights.push({ title: 'Weekend Strategy', insight: 'Community activity drops 50% on weekends. Partners who stay active on Saturdays and Sundays pull ahead of 60% of the field without extra effort.' });
  insights.push({ title: 'Follow-Up Gold', insight: 'Top-performing partners in this challenge attribute 80% of their referrals to follow-up conversations, not first touches. Build follow-up time into your daily routine.' });

  return insights;
}
