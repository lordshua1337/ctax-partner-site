// -- JOURNEY BAR --
// Persistent progress bar showing the 4-phase partner journey.
// Appears at the top of every portal section.
// Reads from PartnerProgress (partner-progress.js).

var JourneyBar = (function() {
  var CONTAINER_ID = 'journey-bar';
  var _rendered = false;

  var PHASES = [
    { num: 1, label: 'Know Your Client', icon: '<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2"/><circle cx="9" cy="7" r="4"/>', section: null },
    { num: 2, label: 'Build Your Plan', icon: '<path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/>', section: 'portal-sec-planner' },
    { num: 3, label: 'Execute Daily', icon: '<path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>', section: 'portal-sec-challenge' },
    { num: 4, label: 'Graduate', icon: '<path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>', section: 'portal-sec-playbook' }
  ];

  function render() {
    var container = document.getElementById(CONTAINER_ID);
    if (!container) return;

    var progress = PartnerProgress.read();
    var phase = PartnerProgress.currentPhase();

    var html = '<div class="jb-wrap">';

    PHASES.forEach(function(p, i) {
      var status = 'locked';
      var statusText = 'Locked';
      var clickable = false;

      if (p.num < phase) {
        status = 'complete';
        statusText = 'Complete';
        clickable = true;
      } else if (p.num === phase) {
        status = 'active';
        clickable = true;
        if (p.num === 1) statusText = 'Start here';
        else if (p.num === 2) statusText = 'Next step';
        else if (p.num === 3) {
          statusText = progress.challengeStarted
            ? 'Day ' + progress.challengeDay + '/30'
            : 'Ready to start';
        }
        else statusText = 'In progress';
      } else if (p.num === phase + 1) {
        statusText = 'Up next';
      }

      var onclick = '';
      if (clickable && p.section) {
        onclick = ' onclick="portalNav(document.querySelector(\'[onclick*=' + p.section + ']\'),\'' + p.section + '\')"';
      } else if (clickable && p.num === 1) {
        // ICP Builder is on ai-tools page, not in portal
        onclick = ' onclick="showPage(\'ai-tools\')"';
      }

      html += '<button class="jb-phase jb-phase-' + status + '"' + onclick + '>'
        + '<div class="jb-phase-num">'
        + (status === 'complete'
          ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'
          : p.num)
        + '</div>'
        + '<div class="jb-phase-text">'
        + '<div class="jb-phase-label">' + p.label + '</div>'
        + '<div class="jb-phase-status">' + statusText + '</div>'
        + '</div>'
        + '</button>';

      // Connector line between phases
      if (i < PHASES.length - 1) {
        var connStatus = p.num < phase ? 'complete' : 'pending';
        html += '<div class="jb-connector jb-connector-' + connStatus + '"></div>';
      }
    });

    html += '</div>';
    container.innerHTML = html;
    _rendered = true;
  }

  function refresh() {
    render();
  }

  // Inject the journey bar container into the portal main area
  function inject() {
    var main = document.querySelector('.portal-main');
    if (!main) return;
    var existing = document.getElementById(CONTAINER_ID);
    if (existing) return;

    var bar = document.createElement('div');
    bar.id = CONTAINER_ID;
    bar.className = 'jb-container';

    // Insert after the topbar
    var topbar = main.querySelector('.portal-topbar');
    if (topbar && topbar.nextSibling) {
      main.insertBefore(bar, topbar.nextSibling);
    } else {
      main.insertBefore(bar, main.firstChild);
    }

    render();
  }

  return {
    inject: inject,
    render: render,
    refresh: refresh
  };
})();

// Auto-inject on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
  JourneyBar.inject();

  // Update challenge badge in sidebar
  try {
    var badge = document.getElementById('nav-challenge-badge');
    if (badge && typeof PartnerProgress !== 'undefined') {
      var p = PartnerProgress.read();
      if (p.challengeStarted && !p.challengeComplete) {
        badge.textContent = 'Day ' + p.challengeDay;
      } else if (p.challengeComplete) {
        badge.textContent = 'Done';
      } else {
        badge.textContent = 'New';
      }
    }
  } catch (e) {}
});
