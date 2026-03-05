// CTAX Portal Mode System -- Portal / Labs / Full
// Portal shows: dashboard, referrals, earnings, payouts, submit, documents, calculator, CE, onboarding, tunes, challenge, settings, support
// Labs shows: marketing, AI tools, business planner, playbook, page builder, my pages, challenge
// Full shows: everything

(function() {
  var LABS_SECTIONS = [
    'portal-sec-marketing',
    'portal-sec-playbook',
    'portal-sec-planner',
    'portal-sec-ai-scripts',
    'portal-sec-ai-admaker',
    'portal-sec-ai-qualifier',
    'portal-sec-ai-kb',
    'portal-sec-ai-dashboard',
    'portal-sec-page-builder',
    'portal-sec-my-pages'
  ];

  // Sections on both: portal-sec-challenge
  // Everything not in LABS_SECTIONS (and not challenge) is portal-only

  window.setPortalMode = function(mode) {
    // mode: 'portal', 'labs', 'full'
    document.body.classList.remove('labs-mode', 'full-mode');
    if (mode === 'labs') {
      document.body.classList.add('labs-mode');
    } else if (mode === 'full') {
      document.body.classList.add('full-mode');
    }
    // portal mode = no extra class (default)

    localStorage.setItem('ctax_portal_mode', mode);
    updatePortalModeLabel();
    updateModeSwitcher(mode);

    // Navigate to appropriate first section
    if (mode === 'labs') {
      var firstLabsNav = document.querySelector('.portal-nav-item[data-labs]');
      if (firstLabsNav) {
        portalNav(firstLabsNav, 'portal-sec-ai-dashboard');
      }
    } else if (mode === 'portal') {
      var dashNav = document.getElementById('nav-dashboard');
      if (dashNav) {
        portalNav(dashNav, 'portal-sec-dashboard');
      }
    }
    // full mode: stay on current section
  };

  function updatePortalModeLabel() {
    var label = document.querySelector('.portal-logo-label');
    if (!label) return;
    var mode = localStorage.getItem('ctax_portal_mode') || 'portal';
    if (mode === 'labs') {
      label.textContent = 'CTAX LABS';
    } else if (mode === 'full') {
      label.textContent = 'FULL ACCESS';
    } else {
      label.textContent = 'PARTNER PORTAL';
    }
  }

  function updateModeSwitcher(mode) {
    var btns = document.querySelectorAll('.pm-btn');
    btns.forEach(function(btn) {
      btn.classList.remove('pm-btn-active');
      if (btn.getAttribute('data-mode') === mode) {
        btn.classList.add('pm-btn-active');
      }
    });
  }

  // Restore mode on portal load
  window.initLabsMode = function() {
    var saved = localStorage.getItem('ctax_portal_mode') || 'portal';
    if (saved === 'labs') {
      document.body.classList.add('labs-mode');
    } else if (saved === 'full') {
      document.body.classList.add('full-mode');
    }
    updatePortalModeLabel();
    updateModeSwitcher(saved);
  };

  // Called from home page to open portal in labs mode
  window.openLabs = function() {
    localStorage.setItem('ctax_portal_mode', 'labs');
    showPage('portal');
    setTimeout(function() {
      document.body.classList.add('labs-mode');
      document.body.classList.remove('full-mode');
      updatePortalModeLabel();
      updateModeSwitcher('labs');
      var firstLabsNav = document.querySelector('.portal-nav-item[data-labs]');
      if (firstLabsNav) {
        portalNav(firstLabsNav, 'portal-sec-ai-dashboard');
      }
    }, 300);
  };

  // Mark which sections are labs sections (for CSS hiding)
  window.markLabsSections = function() {
    LABS_SECTIONS.forEach(function(id) {
      var sec = document.getElementById(id);
      if (sec) sec.setAttribute('data-labs-section', 'true');
    });
  };
})();
