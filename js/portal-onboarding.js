// ── ONBOARDING WIZARD ──────────────────────────────────
// Extracted from portal.js — new partner setup wizard

var OB_WIZARD_KEY = 'ctax_ob_wizard';

function obWizardShouldShow() {
  try {
    var state = JSON.parse(localStorage.getItem(OB_WIZARD_KEY) || '{}');
    return !state.completed && !state.dismissed;
  } catch (e) { return true; }
}

function obWizardStart() {
  var overlay = document.getElementById('ob-wizard-overlay');
  if (!overlay) createObWizard();
  overlay = document.getElementById('ob-wizard-overlay');
  if (overlay) overlay.classList.add('ob-open');
  obWizardGoTo(0);
}

function obWizardClose() {
  var overlay = document.getElementById('ob-wizard-overlay');
  if (overlay) overlay.classList.remove('ob-open');
}

function obWizardDismiss() {
  try {
    var state = JSON.parse(localStorage.getItem(OB_WIZARD_KEY) || '{}');
    state.dismissed = true;
    localStorage.setItem(OB_WIZARD_KEY, JSON.stringify(state));
  } catch (e) {}
  obWizardClose();
}

function obWizardComplete() {
  try {
    var state = JSON.parse(localStorage.getItem(OB_WIZARD_KEY) || '{}');
    state.completed = true;
    state.completedAt = Date.now();
    localStorage.setItem(OB_WIZARD_KEY, JSON.stringify(state));
  } catch (e) {}
  obWizardClose();
  showToast('Welcome aboard! Your portal is ready.', 'success');
  if (typeof addNotification === 'function') {
    addNotification('Onboarding complete! Welcome to the partner program.', 'info');
  }
}

var _obStep = 0;
var OB_STEPS = [
  {
    title: 'Welcome to Community Tax Partners',
    desc: 'You are about to set up your partner portal. This quick wizard will help you get the most out of the platform from day one.',
    icon: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
    action: null
  },
  {
    title: 'Upload Your Brand',
    desc: 'Add your firm logo in the sidebar to co-brand all marketing materials. Your logo will appear on referral pages, email templates, and ad creatives.',
    icon: '<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>',
    action: 'sidebar'
  },
  {
    title: 'Build Your ICP Profile',
    desc: 'Tell us about your ideal client. This powers personalized AI scripts, smarter client qualifications, and targeted ad copy.',
    icon: '<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>',
    action: 'icp'
  },
  {
    title: 'Create Your First Page',
    desc: 'Use the Page Builder to create a professional landing page in minutes. Choose a template, customize it, and publish it instantly.',
    icon: '<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/>',
    action: 'page-builder'
  },
  {
    title: 'Submit Your First Referral',
    desc: 'When you have a client with $7,000+ in IRS tax debt, submit their info through the portal. Community Tax handles everything -- you earn commission.',
    icon: '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/>',
    action: 'submit'
  },
  {
    title: 'You Are All Set!',
    desc: 'Your portal is configured and ready to generate revenue. Start with the 30-Day Challenge for a guided path, or explore the AI tools to create scripts, ads, and qualification reports.',
    icon: '<polyline points="20 6 9 17 4 12"/>',
    action: 'complete'
  }
];

function createObWizard() {
  var overlay = document.createElement('div');
  overlay.id = 'ob-wizard-overlay';
  overlay.className = 'ob-wizard-overlay';
  overlay.onclick = function(e) { if (e.target === overlay) obWizardClose(); };

  overlay.innerHTML = '<div class="ob-wizard-modal" id="ob-wizard-modal">'
    + '<button class="ob-wizard-close" onclick="obWizardDismiss()">&times;</button>'
    + '<div class="ob-wizard-progress" id="ob-wizard-progress"></div>'
    + '<div class="ob-wizard-body" id="ob-wizard-body"></div>'
    + '<div class="ob-wizard-footer" id="ob-wizard-footer"></div>'
    + '</div>';

  document.body.appendChild(overlay);
}

function obWizardGoTo(step) {
  _obStep = step;
  var s = OB_STEPS[step];
  if (!s) return;

  // Progress dots
  var progEl = document.getElementById('ob-wizard-progress');
  if (progEl) {
    var progHtml = '';
    OB_STEPS.forEach(function(_, i) {
      progHtml += '<div class="ob-dot' + (i === step ? ' ob-dot-active' : i < step ? ' ob-dot-done' : '') + '"></div>';
    });
    progEl.innerHTML = progHtml;
  }

  // Body
  var bodyEl = document.getElementById('ob-wizard-body');
  if (bodyEl) {
    bodyEl.innerHTML = '<div class="ob-step-icon"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' + s.icon + '</svg></div>'
      + '<div class="ob-step-title">' + s.title + '</div>'
      + '<div class="ob-step-desc">' + s.desc + '</div>';
  }

  // Footer
  var footerEl = document.getElementById('ob-wizard-footer');
  if (footerEl) {
    var html = '';
    if (step > 0) {
      html += '<button class="ob-btn ob-btn-secondary" onclick="obWizardGoTo(' + (step - 1) + ')">Back</button>';
    } else {
      html += '<button class="ob-btn ob-btn-secondary" onclick="obWizardDismiss()">Skip for now</button>';
    }
    if (step < OB_STEPS.length - 1) {
      html += '<button class="ob-btn ob-btn-primary" onclick="obWizardGoTo(' + (step + 1) + ')">Next</button>';
    } else {
      html += '<button class="ob-btn ob-btn-primary" onclick="obWizardComplete()">Get Started</button>';
    }
    footerEl.innerHTML = html;
  }
}
