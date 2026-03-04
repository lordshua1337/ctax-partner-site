// ══════════════════════════════════════════
//  M4P3C3: STREAK REWARDS MARKETPLACE
//  Earn coins from streaks, spend on power-ups, perks, unlockables
// ══════════════════════════════════════════

var CHR_STORAGE_KEY = 'ch_rewards_v1';
var CHR_PURCHASES_KEY = 'ch_reward_purchases';

// ── COIN ECONOMY ────────────────────────

var CHR_EARNING_RULES = [
  { trigger: 'daily_complete', coins: 10, label: 'Daily task completed' },
  { trigger: 'streak_3', coins: 25, label: '3-day streak' },
  { trigger: 'streak_7', coins: 75, label: '7-day streak' },
  { trigger: 'streak_14', coins: 200, label: '14-day streak' },
  { trigger: 'streak_21', coins: 400, label: '21-day streak' },
  { trigger: 'streak_30', coins: 1000, label: '30-day streak (Perfect)' },
  { trigger: 'badge_earned', coins: 50, label: 'Badge unlocked' },
  { trigger: 'tier_up', coins: 100, label: 'Tier promotion' },
  { trigger: 'duel_won', coins: 75, label: 'Duel victory' },
  { trigger: 'referral', coins: 150, label: 'First client referral' },
  { trigger: 'perfect_week', coins: 100, label: 'Perfect week (7/7)' }
];

// ── REWARD CATEGORIES ────────────────────────

var CHR_CATEGORIES = [
  { id: 'powerups', name: 'Power-Ups', icon: '&#9889;', desc: 'Boosts and abilities for your challenge' },
  { id: 'perks', name: 'Partner Perks', icon: '&#127873;', desc: 'Real benefits for your business' },
  { id: 'cosmetics', name: 'Profile Flair', icon: '&#127912;', desc: 'Stand out in the community' },
  { id: 'unlocks', name: 'Unlockables', icon: '&#128274;', desc: 'Exclusive features and content' }
];

// ── REWARD ITEMS ────────────────────────

var CHR_ITEMS = [
  // Power-Ups
  { id: 'streak_shield', name: 'Streak Shield', desc: 'Protect your streak for 1 day. Miss a day without breaking it.', category: 'powerups', price: 100, icon: '&#128737;', maxOwned: 3, effect: 'Adds 1 streak freeze charge' },
  { id: 'double_xp', name: 'Double XP Day', desc: 'Earn 2x points on all tasks for the next 24 hours.', category: 'powerups', price: 150, icon: '&#10024;', maxOwned: 5, effect: '2x point multiplier for 24h' },
  { id: 'skip_pass', name: 'Task Swap', desc: 'Swap today\'s task for an easier alternative. Still counts for your streak.', category: 'powerups', price: 75, icon: '&#128260;', maxOwned: 5, effect: 'Replace current day task' },
  { id: 'insight_boost', name: 'AI Insight Boost', desc: 'Get a personalized AI coaching session based on your challenge data.', category: 'powerups', price: 200, icon: '&#129504;', maxOwned: 10, effect: 'Unlocks AI analysis' },
  { id: 'catch_up_pack', name: 'Catch-Up Pack', desc: 'Instantly complete up to 3 missed days. One-time retroactive credit.', category: 'powerups', price: 300, icon: '&#9200;', maxOwned: 2, effect: 'Retroactively complete 3 days' },
  { id: 'bonus_task', name: 'Bonus Task Unlock', desc: 'Access a secret bonus challenge task worth 3x normal points.', category: 'powerups', price: 125, icon: '&#127775;', maxOwned: 10, effect: 'Adds bonus task to today' },

  // Partner Perks
  { id: 'priority_support', name: 'Priority Support Badge', desc: 'Get flagged for faster response times from the Community Tax support team.', category: 'perks', price: 500, icon: '&#128640;', maxOwned: 1, effect: 'Priority support queue' },
  { id: 'marketing_kit', name: 'Premium Marketing Kit', desc: 'Download a pack of 20 co-branded marketing templates (emails, flyers, social).', category: 'perks', price: 400, icon: '&#128188;', maxOwned: 1, effect: 'Unlocks template pack' },
  { id: 'webinar_seat', name: 'VIP Webinar Seat', desc: 'Reserved seat at the next partner success webinar with Q&A priority.', category: 'perks', price: 300, icon: '&#127891;', maxOwned: 3, effect: 'Webinar registration' },
  { id: 'commission_boost', name: 'Commission Boost Preview', desc: 'Preview of upcoming commission tier changes and how to qualify faster.', category: 'perks', price: 350, icon: '&#128176;', maxOwned: 1, effect: 'Insider commission intel' },
  { id: 'mentor_match', name: 'Mentor Match', desc: 'Get matched with a top-performing partner for a 30-minute strategy session.', category: 'perks', price: 600, icon: '&#129309;', maxOwned: 2, effect: '1-on-1 mentor session' },

  // Profile Flair
  { id: 'gold_frame', name: 'Gold Profile Frame', desc: 'A gold border around your avatar in the community and leaderboards.', category: 'cosmetics', price: 200, icon: '&#128171;', maxOwned: 1, effect: 'Gold avatar border' },
  { id: 'custom_title', name: 'Custom Title', desc: 'Choose a custom title that displays next to your name (e.g., "Tax Whisperer").', category: 'cosmetics', price: 250, icon: '&#127991;', maxOwned: 1, effect: 'Custom display title' },
  { id: 'streak_flame', name: 'Streak Flame Effect', desc: 'Your streak counter displays with animated flame effect on the leaderboard.', category: 'cosmetics', price: 175, icon: '&#128293;', maxOwned: 1, effect: 'Animated streak display' },
  { id: 'champion_badge', name: 'Champion Badge', desc: 'An exclusive badge that shows you\'re a marketplace regular. Rare and respected.', category: 'cosmetics', price: 500, icon: '&#127942;', maxOwned: 1, effect: 'Exclusive badge' },
  { id: 'color_theme', name: 'Profile Color Theme', desc: 'Choose a unique accent color for your profile cards and stats displays.', category: 'cosmetics', price: 150, icon: '&#127912;', maxOwned: 1, effect: 'Custom accent color' },

  // Unlockables
  { id: 'advanced_analytics', name: 'Advanced Analytics Pro', desc: 'Unlock deep-dive analytics: predicted completion date, behavioral patterns, peer benchmarks.', category: 'unlocks', price: 400, icon: '&#128202;', maxOwned: 1, effect: 'Pro analytics features' },
  { id: 'secret_tasks', name: 'Secret Task Library', desc: 'Access 15 hidden bonus tasks not in the standard 30-day challenge.', category: 'unlocks', price: 350, icon: '&#128218;', maxOwned: 1, effect: '15 bonus tasks' },
  { id: 'ai_coach', name: 'AI Success Coach', desc: 'Unlock the AI coaching assistant that provides weekly personalized action plans.', category: 'unlocks', price: 750, icon: '&#129302;', maxOwned: 1, effect: 'AI coaching unlocked' },
  { id: 'leaderboard_history', name: 'Leaderboard Time Machine', desc: 'View historical leaderboard snapshots. See how rankings have changed over time.', category: 'unlocks', price: 300, icon: '&#128336;', maxOwned: 1, effect: 'Historical rankings' },
  { id: 'certificate_premium', name: 'Premium Certificate', desc: 'Upgraded completion certificate with detailed stats, gold foil design, and QR verification.', category: 'unlocks', price: 500, icon: '&#128220;', maxOwned: 1, effect: 'Premium certificate design' }
];

// ── STATE MANAGEMENT ────────────────────────

function chrGetState() {
  var defaults = { coins: 0, totalEarned: 0, totalSpent: 0, inventory: {}, earningLog: [] };
  try {
    var saved = JSON.parse(localStorage.getItem(CHR_STORAGE_KEY));
    if (saved) return Object.assign(defaults, saved);
  } catch (e) {}
  return defaults;
}

function chrSaveState(state) {
  try { localStorage.setItem(CHR_STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
}

function chrGetPurchases() {
  try { return JSON.parse(localStorage.getItem(CHR_PURCHASES_KEY) || '[]'); } catch (e) { return []; }
}

function chrSavePurchases(purchases) {
  try { localStorage.setItem(CHR_PURCHASES_KEY, JSON.stringify(purchases)); } catch (e) {}
}

// ── COIN CALCULATION ────────────────────────

function chrCalcCoins() {
  var state = chrGetState();
  if (state.totalEarned > 0) return state;

  // Calculate coins from challenge progress
  var challengeState = {};
  try { challengeState = JSON.parse(localStorage.getItem('ch_30day_v1') || '{}'); } catch (e) {}

  var currentDay = challengeState.currentDay || 0;
  var streak = challengeState.streak || 0;
  var completed = (challengeState.completed || []).length;
  var badges = (challengeState.badges || []).length;

  var earned = 0;
  var log = [];

  // Daily completions
  earned += completed * 10;
  if (completed > 0) log.push({ type: 'daily_complete', coins: completed * 10, label: completed + ' daily tasks completed' });

  // Streak milestones
  if (streak >= 3) { earned += 25; log.push({ type: 'streak_3', coins: 25, label: '3-day streak achieved' }); }
  if (streak >= 7) { earned += 75; log.push({ type: 'streak_7', coins: 75, label: '7-day streak achieved' }); }
  if (streak >= 14) { earned += 200; log.push({ type: 'streak_14', coins: 200, label: '14-day streak achieved' }); }
  if (streak >= 21) { earned += 400; log.push({ type: 'streak_21', coins: 400, label: '21-day streak achieved' }); }
  if (streak >= 30) { earned += 1000; log.push({ type: 'streak_30', coins: 1000, label: '30-day perfect streak!' }); }

  // Badges
  earned += badges * 50;
  if (badges > 0) log.push({ type: 'badge_earned', coins: badges * 50, label: badges + ' badges earned' });

  // Tier promotions
  if (currentDay >= 8) { earned += 100; log.push({ type: 'tier_up', coins: 100, label: 'Connector tier promotion' }); }
  if (currentDay >= 15) { earned += 100; log.push({ type: 'tier_up', coins: 100, label: 'Builder tier promotion' }); }
  if (currentDay >= 22) { earned += 100; log.push({ type: 'tier_up', coins: 100, label: 'Rainmaker tier promotion' }); }

  // Perfect weeks
  var perfectWeeks = Math.floor(streak / 7);
  if (perfectWeeks > 0) {
    earned += perfectWeeks * 100;
    log.push({ type: 'perfect_week', coins: perfectWeeks * 100, label: perfectWeeks + ' perfect week' + (perfectWeeks > 1 ? 's' : '') });
  }

  // Duel wins
  var duelHistory = [];
  try { duelHistory = JSON.parse(localStorage.getItem('ch_duel_history') || '[]'); } catch (e) {}
  var duelWins = duelHistory.filter(function(d) { return d.status === 'won'; }).length;
  if (duelWins > 0) {
    earned += duelWins * 75;
    log.push({ type: 'duel_won', coins: duelWins * 75, label: duelWins + ' duel victories' });
  }

  // Minimum starter coins for demo
  if (earned < 200) earned = 500;

  state.coins = earned - state.totalSpent;
  state.totalEarned = earned;
  state.earningLog = log;
  chrSaveState(state);
  return state;
}

// ── PURCHASE ────────────────────────

function chrPurchaseItem(itemId) {
  var item = CHR_ITEMS.find(function(i) { return i.id === itemId; });
  if (!item) return;

  var state = chrCalcCoins();
  if (state.coins < item.price) return;

  var owned = state.inventory[itemId] || 0;
  if (owned >= item.maxOwned) return;

  state.coins -= item.price;
  state.totalSpent += item.price;
  state.inventory[itemId] = owned + 1;
  chrSaveState(state);

  var purchases = chrGetPurchases();
  purchases.unshift({
    itemId: itemId,
    itemName: item.name,
    price: item.price,
    date: new Date().toISOString()
  });
  chrSavePurchases(purchases);

  chrSwitchTab('shop');
}

// ── MAIN MODAL ────────────────────────

function chrShowMarketplace() {
  var existing = document.getElementById('chr-modal');
  if (existing) existing.remove();

  var overlay = document.createElement('div');
  overlay.className = 'chr-overlay';
  overlay.id = 'chr-modal';
  overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };

  var modal = document.createElement('div');
  modal.className = 'chr-modal';

  var state = chrCalcCoins();

  modal.innerHTML = '<div class="chr-header">'
    + '<div><div class="chr-title">Rewards Marketplace</div>'
    + '<div class="chr-subtitle">Spend your streak coins on power-ups, perks, and more</div></div>'
    + '<div class="chr-coins-display">'
    + '<span class="chr-coin-icon">&#9733;</span>'
    + '<span class="chr-coin-amount">' + state.coins + '</span>'
    + '</div>'
    + '<button class="chr-close" onclick="document.getElementById(\'chr-modal\').remove()">&times;</button>'
    + '</div>'
    + '<div class="chr-tabs" id="chr-tabs"></div>'
    + '<div class="chr-body" id="chr-body"></div>';

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  chrRenderTabs('shop');
}

// ── TABS ────────────────────────

function chrRenderTabs(active) {
  var tabs = [
    { id: 'shop', label: 'Shop' },
    { id: 'inventory', label: 'My Items' },
    { id: 'earnings', label: 'Coin Log' },
    { id: 'how', label: 'How to Earn' }
  ];

  var html = '';
  tabs.forEach(function(t) {
    html += '<button class="chr-tab' + (t.id === active ? ' chr-tab-active' : '') + '" onclick="chrSwitchTab(\'' + t.id + '\')">' + t.label + '</button>';
  });

  var tabsEl = document.getElementById('chr-tabs');
  if (tabsEl) tabsEl.innerHTML = html;

  chrSwitchTab(active);
}

function chrSwitchTab(tab) {
  var tabs = document.querySelectorAll('.chr-tab');
  var labels = { shop: 'Shop', inventory: 'My Items', earnings: 'Coin Log', how: 'How to Earn' };
  tabs.forEach(function(t) { t.classList.toggle('chr-tab-active', t.textContent === labels[tab]); });

  // Update coin display
  var state = chrCalcCoins();
  var coinAmountEl = document.querySelector('.chr-coin-amount');
  if (coinAmountEl) coinAmountEl.textContent = state.coins;

  var body = document.getElementById('chr-body');
  if (!body) return;

  if (tab === 'shop') chrRenderShop();
  else if (tab === 'inventory') chrRenderInventory();
  else if (tab === 'earnings') chrRenderEarnings();
  else if (tab === 'how') chrRenderHowToEarn();
}

// ── SHOP TAB ────────────────────────

function chrRenderShop() {
  var body = document.getElementById('chr-body');
  if (!body) return;

  var state = chrCalcCoins();
  var activeCategory = document.getElementById('chr-active-cat');
  var activeCat = activeCategory ? activeCategory.value : 'powerups';

  var html = '<div class="chr-shop">';

  // Category filters
  html += '<div class="chr-cat-filters">';
  CHR_CATEGORIES.forEach(function(cat) {
    var active = cat.id === activeCat ? ' chr-cat-active' : '';
    var count = CHR_ITEMS.filter(function(i) { return i.category === cat.id; }).length;
    html += '<button class="chr-cat-btn' + active + '" onclick="chrFilterCategory(\'' + cat.id + '\')">'
      + cat.icon + ' ' + cat.name + ' <span class="chr-cat-count">' + count + '</span></button>';
  });
  html += '<input type="hidden" id="chr-active-cat" value="' + activeCat + '">';
  html += '</div>';

  // Category description
  var currentCat = CHR_CATEGORIES.find(function(c) { return c.id === activeCat; });
  if (currentCat) {
    html += '<div class="chr-cat-desc">' + currentCat.desc + '</div>';
  }

  // Items grid
  html += '<div class="chr-items-grid">';
  var items = CHR_ITEMS.filter(function(i) { return i.category === activeCat; });

  items.forEach(function(item) {
    var owned = state.inventory[item.id] || 0;
    var canBuy = state.coins >= item.price && owned < item.maxOwned;
    var maxed = owned >= item.maxOwned;

    html += '<div class="chr-item-card' + (maxed ? ' chr-item-maxed' : '') + '">'
      + '<div class="chr-item-icon">' + item.icon + '</div>'
      + '<div class="chr-item-name">' + item.name + '</div>'
      + '<div class="chr-item-desc">' + item.desc + '</div>'
      + '<div class="chr-item-effect">' + item.effect + '</div>'
      + '<div class="chr-item-footer">'
      + '<div class="chr-item-price"><span class="chr-coin-sm">&#9733;</span> ' + item.price + '</div>';

    if (maxed) {
      html += '<div class="chr-item-owned">Owned' + (item.maxOwned > 1 ? ' (' + owned + '/' + item.maxOwned + ')' : '') + '</div>';
    } else if (owned > 0) {
      html += '<button class="chr-buy-btn' + (canBuy ? '' : ' chr-buy-disabled') + '" onclick="chrPurchaseItem(\'' + item.id + '\')">'
        + 'Buy (' + owned + '/' + item.maxOwned + ')</button>';
    } else {
      html += '<button class="chr-buy-btn' + (canBuy ? '' : ' chr-buy-disabled') + '" onclick="chrPurchaseItem(\'' + item.id + '\')">'
        + (canBuy ? 'Buy Now' : 'Not enough') + '</button>';
    }

    html += '</div></div>';
  });

  html += '</div></div>';
  body.innerHTML = html;
}

function chrFilterCategory(catId) {
  var catInput = document.getElementById('chr-active-cat');
  if (catInput) catInput.value = catId;
  chrRenderShop();
}

// ── INVENTORY TAB ────────────────────────

function chrRenderInventory() {
  var body = document.getElementById('chr-body');
  if (!body) return;

  var state = chrCalcCoins();
  var ownedItems = Object.keys(state.inventory).filter(function(k) { return state.inventory[k] > 0; });

  if (ownedItems.length === 0) {
    body.innerHTML = '<div class="chr-empty">'
      + '<div class="chr-empty-icon">&#128722;</div>'
      + '<div class="chr-empty-title">No Items Yet</div>'
      + '<div class="chr-empty-msg">Visit the shop to spend your coins on power-ups, perks, and profile flair!</div>'
      + '<button class="chr-empty-btn" onclick="chrSwitchTab(\'shop\')">Go to Shop</button>'
      + '</div>';
    return;
  }

  var html = '<div class="chr-inventory">'
    + '<div class="chr-inv-count">' + ownedItems.length + ' item' + (ownedItems.length !== 1 ? 's' : '') + ' in your inventory</div>'
    + '<div class="chr-inv-grid">';

  ownedItems.forEach(function(itemId) {
    var item = CHR_ITEMS.find(function(i) { return i.id === itemId; });
    if (!item) return;
    var qty = state.inventory[itemId];

    html += '<div class="chr-inv-card">'
      + '<div class="chr-inv-icon">' + item.icon + '</div>'
      + '<div class="chr-inv-info">'
      + '<div class="chr-inv-name">' + item.name + (qty > 1 ? ' x' + qty : '') + '</div>'
      + '<div class="chr-inv-effect">' + item.effect + '</div>'
      + '</div>';

    // Use button for power-ups
    if (item.category === 'powerups') {
      html += '<button class="chr-use-btn" onclick="chrUseItem(\'' + item.id + '\')">Use</button>';
    } else {
      html += '<div class="chr-inv-status">Active</div>';
    }

    html += '</div>';
  });

  html += '</div></div>';
  body.innerHTML = html;
}

function chrUseItem(itemId) {
  var state = chrCalcCoins();
  var owned = state.inventory[itemId] || 0;
  if (owned <= 0) return;

  state.inventory[itemId] = owned - 1;
  if (state.inventory[itemId] === 0) delete state.inventory[itemId];
  chrSaveState(state);

  var item = CHR_ITEMS.find(function(i) { return i.id === itemId; });
  if (item) {
    // Show use confirmation
    var notification = document.createElement('div');
    notification.className = 'chr-use-notification';
    notification.innerHTML = '<div class="chr-use-icon">' + item.icon + '</div>'
      + '<div class="chr-use-text">Used <strong>' + item.name + '</strong>! ' + item.effect + '</div>';
    var body = document.getElementById('chr-body');
    if (body) body.insertBefore(notification, body.firstChild);
    setTimeout(function() { notification.remove(); }, 3000);
  }

  chrRenderInventory();
}

// ── EARNINGS TAB ────────────────────────

function chrRenderEarnings() {
  var body = document.getElementById('chr-body');
  if (!body) return;

  var state = chrCalcCoins();
  var purchases = chrGetPurchases();

  var html = '<div class="chr-earnings">'
    + '<div class="chr-earn-summary">'
    + '<div class="chr-earn-stat"><div class="chr-earn-num" style="color:#10B981">' + state.totalEarned + '</div><div class="chr-earn-lbl">Total Earned</div></div>'
    + '<div class="chr-earn-stat"><div class="chr-earn-num" style="color:#EF4444">' + state.totalSpent + '</div><div class="chr-earn-lbl">Total Spent</div></div>'
    + '<div class="chr-earn-stat"><div class="chr-earn-num" style="color:#3B82F6">' + state.coins + '</div><div class="chr-earn-lbl">Balance</div></div>'
    + '</div>';

  // Earning breakdown
  html += '<div class="chr-earn-section-title">Earnings Breakdown</div>'
    + '<div class="chr-earn-list">';

  if (state.earningLog && state.earningLog.length > 0) {
    state.earningLog.forEach(function(entry) {
      html += '<div class="chr-earn-row">'
        + '<div class="chr-earn-row-label">' + entry.label + '</div>'
        + '<div class="chr-earn-row-coins">+' + entry.coins + ' <span class="chr-coin-sm">&#9733;</span></div>'
        + '</div>';
    });
  } else {
    html += '<div class="chr-earn-empty">Start the challenge to earn coins!</div>';
  }
  html += '</div>';

  // Purchase history
  if (purchases.length > 0) {
    html += '<div class="chr-earn-section-title" style="margin-top:20px">Purchase History</div>'
      + '<div class="chr-earn-list">';

    purchases.slice(0, 10).forEach(function(p) {
      var date = new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      html += '<div class="chr-earn-row">'
        + '<div class="chr-earn-row-label">' + p.itemName + '</div>'
        + '<div class="chr-earn-row-coins chr-earn-spent">-' + p.price + ' <span class="chr-coin-sm">&#9733;</span></div>'
        + '<div class="chr-earn-row-date">' + date + '</div>'
        + '</div>';
    });
    html += '</div>';
  }

  html += '</div>';
  body.innerHTML = html;
}

// ── HOW TO EARN TAB ────────────────────────

function chrRenderHowToEarn() {
  var body = document.getElementById('chr-body');
  if (!body) return;

  var html = '<div class="chr-how">'
    + '<div class="chr-how-intro">Earn coins through your challenge progress. The more consistent and successful you are, the more you earn.</div>'
    + '<div class="chr-how-grid">';

  CHR_EARNING_RULES.forEach(function(rule) {
    var triggerIcons = {
      daily_complete: '&#10003;',
      streak_3: '&#9889;',
      streak_7: '&#9889;',
      streak_14: '&#9889;',
      streak_21: '&#9889;',
      streak_30: '&#128293;',
      badge_earned: '&#9733;',
      tier_up: '&#9650;',
      duel_won: '&#9876;',
      referral: '&#128176;',
      perfect_week: '&#127942;'
    };

    var rarity = rule.coins >= 400 ? 'legendary' : rule.coins >= 150 ? 'rare' : rule.coins >= 50 ? 'uncommon' : 'common';
    var rarityColors = { common: '#94A3B8', uncommon: '#10B981', rare: '#3B82F6', legendary: '#F59E0B' };

    html += '<div class="chr-how-card">'
      + '<div class="chr-how-icon">' + (triggerIcons[rule.trigger] || '&#8226;') + '</div>'
      + '<div class="chr-how-info">'
      + '<div class="chr-how-label">' + rule.label + '</div>'
      + '<div class="chr-how-rarity" style="color:' + rarityColors[rarity] + '">' + rarity + '</div>'
      + '</div>'
      + '<div class="chr-how-coins"><span class="chr-coin-sm">&#9733;</span> ' + rule.coins + '</div>'
      + '</div>';
  });

  html += '</div>';

  // Tips
  html += '<div class="chr-how-tips">'
    + '<div class="chr-how-tips-title">Pro Tips for Maximum Coins</div>'
    + '<div class="chr-how-tip">Maintain your streak -- streak milestones are the biggest coin earners (up to 1000 for a perfect 30-day streak)</div>'
    + '<div class="chr-how-tip">Complete every day of the week for the Perfect Week bonus (100 coins per week)</div>'
    + '<div class="chr-how-tip">Win duels against other partners for 75 coins per victory</div>'
    + '<div class="chr-how-tip">Submit client referrals -- each first referral earns 150 coins</div>'
    + '<div class="chr-how-tip">Buy Streak Shields early to protect against accidental streak breaks</div>'
    + '</div>';

  // Coin projection
  var challengeState = {};
  try { challengeState = JSON.parse(localStorage.getItem('ch_30day_v1') || '{}'); } catch (e) {}
  var currentDay = challengeState.currentDay || 0;
  var daysLeft = Math.max(0, 30 - currentDay);
  var projectedCoins = daysLeft * 10 + (daysLeft >= 7 ? 75 : 0) + (daysLeft >= 14 ? 200 : 0);

  html += '<div class="chr-projection">'
    + '<div class="chr-proj-title">Projected Earnings</div>'
    + '<div class="chr-proj-num"><span class="chr-coin-sm">&#9733;</span> ~' + projectedCoins + '</div>'
    + '<div class="chr-proj-note">Based on completing all remaining ' + daysLeft + ' days with no streak breaks</div>'
    + '</div>';

  html += '</div>';
  body.innerHTML = html;
}
