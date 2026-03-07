// ── GAMIFICATION SYSTEM ──────────────────────────────────
// Extracted from portal.js — streak tracking, achievements, confetti

var GAMIFICATION_KEY = 'ctax_gamification';

function getGamificationData() {
  try {
    var stored = localStorage.getItem(GAMIFICATION_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) { /* ignore */ }
  return { streak: 0, lastRefDate: null, totalRefs: 6, totalEarned: 24850, achievements: [] };
}

function saveGamificationData(data) {
  try { localStorage.setItem(GAMIFICATION_KEY, JSON.stringify(data)); } catch (e) { /* ignore */ }
}

function calcPartnerLevel(totalRefs) {
  if (totalRefs >= 50) return 'platinum';
  if (totalRefs >= 25) return 'pro';
  if (totalRefs >= 10) return 'premium';
  return 'bronze';
}

function getLevelThreshold(level) {
  if (level === 'bronze') return { next: 'Premium', need: 10 };
  if (level === 'premium') return { next: 'Pro', need: 25 };
  if (level === 'pro') return { next: 'Platinum', need: 50 };
  return { next: 'Max', need: 50 };
}

function initGamification() {
  var data = getGamificationData();

  // Demo: simulate some activity
  if (!data.lastRefDate) {
    data.streak = 5;
    data.totalRefs = 6;
    data.totalEarned = 24850;
    data.lastRefDate = new Date().toISOString().slice(0, 10);
    saveGamificationData(data);
  }

  // Streak
  var streakEl = document.getElementById('mob-streak-count');
  if (streakEl) streakEl.textContent = data.streak;

  // Progress ring (referrals this month vs goal of 10)
  var monthlyGoal = 10;
  var monthlyRefs = Math.min(data.totalRefs, monthlyGoal);
  var ringFill = document.getElementById('mob-ring-fill');
  var ringLabel = document.getElementById('mob-ring-label');
  if (ringFill) {
    var circumference = 125.66;
    var offset = circumference - (monthlyRefs / monthlyGoal) * circumference;
    setTimeout(function() { ringFill.style.strokeDashoffset = offset; }, 200);
  }
  if (ringLabel) ringLabel.textContent = monthlyRefs + '/' + monthlyGoal;

  // Level badge
  var level = calcPartnerLevel(data.totalRefs);
  var badgeEl = document.getElementById('mob-level-badge');
  if (badgeEl) {
    badgeEl.textContent = level.charAt(0).toUpperCase() + level.slice(1);
    badgeEl.className = 'mob-level-badge mob-level-' + level;
  }

  // Milestone bar
  var threshold = getLevelThreshold(level);
  var milestoneText = document.getElementById('mob-milestone-text');
  var milestoneFill = document.getElementById('mob-milestone-fill');
  if (threshold.next === 'Max') {
    if (milestoneText) milestoneText.textContent = 'Max level reached!';
    if (milestoneFill) milestoneFill.style.width = '100%';
  } else {
    var remaining = threshold.need - data.totalRefs;
    var prevThreshold = level === 'bronze' ? 0 : level === 'premium' ? 10 : 25;
    var progress = ((data.totalRefs - prevThreshold) / (threshold.need - prevThreshold)) * 100;
    if (milestoneText) milestoneText.textContent = remaining + ' more referrals to ' + threshold.next;
    if (milestoneFill) setTimeout(function() { milestoneFill.style.width = Math.min(progress, 100) + '%'; }, 400);
  }
}

function updateStreak() {
  var data = getGamificationData();
  var today = new Date().toISOString().slice(0, 10);
  if (data.lastRefDate !== today) {
    data.streak = data.streak + 1;
    data.lastRefDate = today;
  }
  data.totalRefs = data.totalRefs + 1;
  saveGamificationData(data);
  checkAchievements(data);
  initGamification();
}

function checkAchievements(data) {
  var thresholds = [
    { key: 'first_ref', count: 1, label: 'First Referral!' },
    { key: 'ref_5', count: 5, label: '5 Referrals - On Fire!' },
    { key: 'ref_10', count: 10, label: '10 Referrals - Premium Partner!' },
    { key: 'ref_25', count: 25, label: '25 Referrals - Pro Partner!' },
    { key: 'ref_50', count: 50, label: '50 Referrals - Platinum!' }
  ];
  var earned = [
    { key: 'earn_1k', amount: 1000, label: '$1K Earned!' },
    { key: 'earn_5k', amount: 5000, label: '$5K Earned!' },
    { key: 'earn_10k', amount: 10000, label: '$10K Club!' },
    { key: 'earn_25k', amount: 25000, label: '$25K Milestone!' }
  ];
  thresholds.forEach(function(t) {
    if (data.totalRefs >= t.count && data.achievements.indexOf(t.key) === -1) {
      data.achievements.push(t.key);
      showAchievementToast(t.label);
    }
  });
  earned.forEach(function(e) {
    if (data.totalEarned >= e.amount && data.achievements.indexOf(e.key) === -1) {
      data.achievements.push(e.key);
      showAchievementToast(e.label);
    }
  });
  saveGamificationData(data);
}

function showAchievementToast(msg) {
  var toast = document.getElementById('mob-achieve-toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('mob-achieve-show');
  fireConfetti();
  setTimeout(function() { toast.classList.remove('mob-achieve-show'); }, 3000);
}

// ── CONFETTI ──────────────────────────────────────────────
function fireConfetti() {
  var count = 80;
  var colors = ['#0B5FD8', '#00C8E0', '#4BA3FF', '#FFD700', '#FF6B35', '#059669', '#8B5CF6'];
  var container = document.createElement('div');
  container.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:999999;overflow:hidden';
  document.body.appendChild(container);

  for (var i = 0; i < count; i++) {
    var piece = document.createElement('div');
    var size = Math.random() * 8 + 4;
    var color = colors[Math.floor(Math.random() * colors.length)];
    var left = Math.random() * 100;
    var delay = Math.random() * 400;
    var duration = Math.random() * 1500 + 1500;
    var drift = (Math.random() - 0.5) * 200;
    var rotation = Math.random() * 720 - 360;
    var shape = Math.random() > 0.5 ? '50%' : '0';

    piece.style.cssText = 'position:absolute;top:-12px;left:' + left + '%;width:' + size + 'px;height:' + (size * 0.6) + 'px;background:' + color + ';border-radius:' + shape + ';opacity:1;animation:confettiFall ' + duration + 'ms ease-out ' + delay + 'ms forwards';
    piece.style.setProperty('--cf-drift', drift + 'px');
    piece.style.setProperty('--cf-rot', rotation + 'deg');
    container.appendChild(piece);
  }

  setTimeout(function() {
    if (container.parentNode) container.parentNode.removeChild(container);
  }, 3000);
}
