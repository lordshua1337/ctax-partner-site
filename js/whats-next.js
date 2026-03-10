// -- WHAT'S NEXT CTAs --
// After every tool output, show a contextual next-step card.
// Checks Challenge state to determine if the user just completed a daily task.

var WhatsNext = (function() {

  // Tool-to-section mapping for navigation
  var TOOL_SECTIONS = {
    'script-builder': 'portal-sec-ai-scripts',
    'ad-maker': 'portal-sec-ai-admaker',
    'client-qualifier': 'portal-sec-ai-qualifier',
    'marketing-kit': 'portal-sec-marketing',
    'business-planner': 'portal-sec-planner',
    'icp-builder': null // on ai-tools page
  };

  // Default next steps when not in Challenge context
  var DEFAULT_NEXT = {
    'script-builder': {
      text: 'Script ready. Now qualify a real client with it.',
      action: 'portal-sec-ai-qualifier',
      label: 'Open Client Qualifier'
    },
    'client-qualifier': {
      text: 'Client qualified. Ready to refer them?',
      action: 'portal-sec-submit',
      label: 'Submit Referral'
    },
    'ad-maker': {
      text: 'Ad created. Share it on social or download for later.',
      action: null,
      label: null
    },
    'marketing-kit': {
      text: 'Asset ready. Send it to 3 prospects this week.',
      action: null,
      label: null
    },
    'business-planner': {
      text: 'Roadmap built. Time to execute it daily.',
      action: 'portal-sec-challenge',
      label: 'Start Your 30-Day Challenge'
    }
  };

  // Render a "What's Next" card after tool output
  // containerEl: DOM element to append the card to
  // toolId: which tool just produced output (e.g. 'script-builder')
  function render(containerEl, toolId) {
    if (!containerEl) return;

    // Remove any existing card first
    var existing = containerEl.querySelector('.wn-card');
    if (existing) existing.remove();

    var card = document.createElement('div');
    card.className = 'wn-card';

    // Check if in Challenge context
    var challengeDay = 0;
    var inChallenge = false;
    try {
      var chState = JSON.parse(localStorage.getItem('ch_30day_v1') || '{}');
      if (chState.currentDay && chState.currentDay > 0 && chState.currentDay <= 30) {
        challengeDay = chState.currentDay;
        inChallenge = true;
      }
    } catch (e) {}

    var next = DEFAULT_NEXT[toolId] || { text: 'Nice work. Keep building momentum.', action: 'portal-sec-dashboard', label: 'Back to Dashboard' };

    var html = '<div class="wn-content">'
      + '<svg class="wn-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>'
      + '<div class="wn-text">' + next.text + '</div>'
      + '</div>'
      + '<div class="wn-actions">';

    if (inChallenge) {
      html += '<button class="wn-btn wn-btn-challenge" onclick="WhatsNext.markChallengeDay(' + challengeDay + ')">'
        + 'Complete Day ' + challengeDay
        + '</button>';
    }

    if (next.action && next.label) {
      html += '<button class="wn-btn wn-btn-next" onclick="portalNav(document.querySelector(\'[onclick*=' + next.action + ']\'),\'' + next.action + '\')">'
        + next.label
        + ' <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>'
        + '</button>';
    }

    html += '</div>';
    card.innerHTML = html;
    containerEl.appendChild(card);
  }

  function markChallengeDay(day) {
    try {
      var chState = JSON.parse(localStorage.getItem('ch_30day_v1') || '{}');
      if (!chState.completedDays) chState.completedDays = {};
      chState.completedDays[day] = true;
      localStorage.setItem('ch_30day_v1', JSON.stringify(chState));
      if (typeof showToast === 'function') showToast('Day ' + day + ' marked complete!', 'success');
      if (typeof JourneyBar !== 'undefined') JourneyBar.refresh();
    } catch (e) {}
  }

  return {
    render: render,
    markChallengeDay: markChallengeDay
  };
})();
