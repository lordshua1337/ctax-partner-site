// --- Guided Tour (Spotlight Walkthrough) ---
// Shows a product tour on the first 5 portal page loads.
// Dims the main content area, highlights sidebar nav items one at a time,
// and shows a fixed tooltip card centered in the main area.

var TOUR_STEPS = [
  {
    target: '#nav-onboarding',
    title: 'Start Here',
    text: 'Your onboarding checklist and training modules live here. This is the fastest way to get up to speed.'
  },
  {
    target: '[onclick*="portal-sec-referrals"]',
    title: 'Track Referrals',
    text: 'Every referral you submit shows up here -- track status from submission to payout in real time.'
  },
  {
    target: '[onclick*="portal-sec-submit"]',
    title: 'Submit a Referral',
    text: 'Ready to submit? This is where you send new client referrals. It only takes 2 minutes.'
  },
  {
    target: '[onclick*="portal-sec-playbook"]',
    title: 'Referral Playbook',
    text: 'Scripts, objection handling, and follow-up strategies to help you close more referrals naturally.'
  },
  {
    target: '[onclick*="portal-sec-marketing"]',
    title: 'Marketing Kit',
    text: 'Email templates, social assets, and an ad builder -- everything you need to promote your partnership.'
  },
  {
    target: '.dash-quick-submit',
    title: 'Ready to Go?',
    text: 'New to the dashboard? Submit your first referral to start tracking your earnings and building your pipeline.'
  }
];

var TOUR_STORAGE_KEY = 'portal_tour_v3';
var TOUR_MAX_VISITS = 5;

function tourGetState() {
  try {
    var raw = localStorage.getItem(TOUR_STORAGE_KEY);
    return raw ? JSON.parse(raw) : { visits: 0, completed: false, dismissed: false };
  } catch (e) {
    return { visits: 0, completed: false, dismissed: false };
  }
}

function tourSaveState(state) {
  try {
    localStorage.setItem(TOUR_STORAGE_KEY, JSON.stringify(state));
  } catch (e) { /* ignore */ }
}

function tourShouldShow() {
  var state = tourGetState();
  if (state.completed || state.dismissed) return false;
  state.visits = (state.visits || 0) + 1;
  tourSaveState(state);
  return state.visits <= TOUR_MAX_VISITS;
}

function tourStart() {
  if (!tourShouldShow()) return;
  if (document.getElementById('tour-overlay')) return;

  var firstTarget = document.querySelector(TOUR_STEPS[0].target);
  if (!firstTarget) return;

  window._tourStep = 0;
  tourRenderStep(0);
}

function tourRenderStep(stepIndex) {
  tourCleanup();

  if (stepIndex >= TOUR_STEPS.length) {
    tourComplete();
    return;
  }

  var step = TOUR_STEPS[stepIndex];
  var target = document.querySelector(step.target);
  if (!target) {
    tourRenderStep(stepIndex + 1);
    return;
  }

  // --- Overlay: covers only the main content area ---
  var overlay = document.createElement('div');
  overlay.id = 'tour-overlay';
  overlay.className = 'tour-overlay';

  // --- Dim all sidebar nav items, then highlight the active one ---
  var navItems = document.querySelectorAll('.portal-nav-item');
  navItems.forEach(function(item) { item.classList.add('tour-nav-dimmed'); });
  target.classList.remove('tour-nav-dimmed');
  target.classList.add('tour-target-highlight');

  // If target is in main content (last step), lift it above overlay
  var inSidebar = !!target.closest('.portal-sidebar');
  if (!inSidebar) {
    target.style.position = 'relative';
    target.style.zIndex = '10002';
  }

  // --- Build progress dots ---
  var dotsHtml = '';
  for (var i = 0; i < TOUR_STEPS.length; i++) {
    var cls = 'tour-dot';
    if (i < stepIndex) cls += ' tour-dot-done';
    if (i === stepIndex) cls += ' tour-dot-active';
    dotsHtml += '<span class="' + cls + '"></span>';
  }

  // --- Tooltip card (fixed center of main area) ---
  var tooltip = document.createElement('div');
  tooltip.className = 'tour-tooltip';

  var h = '';
  h += '<div class="tour-tooltip-header">';
  h += '<span class="tour-tooltip-eyebrow">Step ' + (stepIndex + 1) + ' of ' + TOUR_STEPS.length + '</span>';
  h += '<button class="tour-tooltip-close" onclick="tourDismiss()" title="Skip tour">';
  h += '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
  h += '</button></div>';
  h += '<div class="tour-tooltip-title">' + step.title + '</div>';
  h += '<div class="tour-tooltip-text">' + step.text + '</div>';
  h += '<div class="tour-dots">' + dotsHtml + '</div>';
  h += '<div class="tour-tooltip-actions">';

  if (stepIndex > 0) {
    h += '<button class="tour-btn-back" onclick="tourPrev()">';
    h += '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>';
    h += ' Back</button>';
  }

  if (stepIndex < TOUR_STEPS.length - 1) {
    h += '<button class="tour-btn-next" onclick="tourNext()">Next ';
    h += '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>';
    h += '</button>';
  } else {
    h += '<button class="tour-btn-next" onclick="tourComplete()">Done</button>';
  }

  h += '</div>';
  tooltip.innerHTML = h;

  // --- Append ---
  document.body.appendChild(overlay);
  document.body.appendChild(tooltip);

  window._tourStep = stepIndex;
  window._tourTarget = target;
  window._tourInSidebar = inSidebar;
}

function tourNext() {
  tourRenderStep((window._tourStep || 0) + 1);
}

function tourPrev() {
  var prev = (window._tourStep || 0) - 1;
  if (prev >= 0) tourRenderStep(prev);
}

function tourDismiss() {
  var state = tourGetState();
  state.dismissed = true;
  tourSaveState(state);
  tourCleanup();
}

function tourComplete() {
  var state = tourGetState();
  state.completed = true;
  tourSaveState(state);
  tourCleanup();
}

function tourCleanup() {
  var overlay = document.getElementById('tour-overlay');
  if (overlay) overlay.remove();

  var tooltips = document.querySelectorAll('.tour-tooltip');
  tooltips.forEach(function(t) { t.remove(); });

  // Remove dimming from all nav items
  var navItems = document.querySelectorAll('.tour-nav-dimmed');
  navItems.forEach(function(item) { item.classList.remove('tour-nav-dimmed'); });

  // Remove highlight from target
  if (window._tourTarget) {
    window._tourTarget.classList.remove('tour-target-highlight');
    if (!window._tourInSidebar) {
      window._tourTarget.style.position = '';
      window._tourTarget.style.zIndex = '';
    }
    window._tourTarget = null;
  }
}

// Dev helper -- tourReset() in console to replay
function tourReset() {
  try { localStorage.removeItem(TOUR_STORAGE_KEY); } catch (e) { /* ignore */ }
}

window.addEventListener('resize', function() {
  if (document.getElementById('tour-overlay') && window._tourStep != null) {
    tourRenderStep(window._tourStep);
  }
});
