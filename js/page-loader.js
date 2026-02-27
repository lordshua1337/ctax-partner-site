// --- Page Loader ---
// Lazy-loads page partials from /pages/ directory on demand.
// Pages are fetched once and cached. The home page is always inline.
var loadedPages = {};

function loadPageContent(id) {
  if (loadedPages[id]) return Promise.resolve();
  var el = document.getElementById('page-' + id);
  if (!el || el.innerHTML.trim() !== '') {
    loadedPages[id] = true;
    return Promise.resolve();
  }
  return fetch('pages/' + id + '.html')
    .then(function(r) {
      if (!r.ok) throw new Error('Failed to load page: ' + id);
      return r.text();
    })
    .then(function(html) {
      el.innerHTML = html;
      loadedPages[id] = true;
      // Run post-load initialization for pages that need it
      onPageLoaded(id);
    })
    .catch(function(err) {
      console.error('Page load error:', err);
      el.innerHTML = '<div style="padding:80px 40px;text-align:center"><p style="color:var(--slate)">Failed to load this page. Please try again.</p></div>';
    });
}

// Hook for initializing page-specific features after lazy load
function onPageLoaded(id) {
  // Re-wire tier radio buttons on apply page
  if (id === 'apply' && typeof initTierRadios === 'function') {
    initTierRadios();
  }
  // Initialize calculator sliders on tiers page
  if (id === 'tiers' && typeof calcUpdate === 'function') {
    calcUpdate();
  }
  // Initialize tier volume selector
  if (id === 'tiers') {
    initTierFinder();
  }
  // Initialize form progress on apply page
  if (id === 'apply') {
    initFormProgress();
  }
  // Initialize How It Works animations
  if (id === 'how' && typeof initHowAnimations === 'function') {
    setTimeout(initHowAnimations, 60);
  }
  // Initialize ad maker logo upload
  if (id === 'admaker') {
    var input = document.getElementById('am-logo-input');
    if (input && !input._wired) {
      input._wired = true;
      input.addEventListener('change', function() {
        var file = input.files && input.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function(e) {
          amLogoDataUrl = e.target.result;
          var lbl = document.getElementById('am-logo-label');
          var drp = document.getElementById('am-logo-drop');
          if (lbl) lbl.textContent = '✓ ' + file.name;
          if (drp) { drp.style.borderColor = 'var(--blue)'; drp.style.background = 'rgba(11,95,216,0.04)'; }
        };
        reader.readAsDataURL(file);
      });
    }
  }
  // Initialize dashboard performance hub
  if ((id === 'dashboard' || id === 'portal') && typeof window.initDashboardHub === 'function') {
    setTimeout(window.initDashboardHub, 80);
  }
  // Initialize portal brand upload
  if (id === 'portal' && typeof initPortalBrand === 'function') {
    setTimeout(initPortalBrand, 80);
  }
  // Initialize portal revenue calculator
  if (id === 'portal' && typeof calcProjection === 'function') {
    setTimeout(calcProjection, 80);
  }
  // Initialize dashboard greeting
  if (id === 'portal' && typeof initDashGreeting === 'function') {
    setTimeout(initDashGreeting, 80);
  }
  // Initialize payout countdown
  if (id === 'portal' && typeof initPayCountdown === 'function') {
    setTimeout(initPayCountdown, 80);
  }
  // Initialize marketing kit builders
  if (id === 'portal' && typeof mkInitBuilders === 'function') {
    setTimeout(mkInitBuilders, 80);
  }
  // Restore saved business planner roadmap
  if (id === 'portal' && typeof bpTryRestore === 'function') {
    setTimeout(bpTryRestore, 100);
  }
  // Initialize collapsible playbook cards
  if (id === 'portal') {
    setTimeout(pbInitCollapsible, 100);
  }
  // Initialize staggered card entrances on newly loaded page
  var el = document.getElementById('page-' + id);
  if (el && typeof window.initStagger === 'function') {
    window.initStagger(el);
  }
  // Initialize data-count-to counters on any newly loaded page
  if (el) {
    el.querySelectorAll('[data-count-to]').forEach(function(counter) {
      if (typeof IntersectionObserver !== 'undefined') {
        var obs = new IntersectionObserver(function(entries) {
          entries.forEach(function(entry) {
            if (entry.isIntersecting) {
              var target = parseFloat(entry.target.getAttribute('data-count-to')) || 0;
              var prefix = entry.target.getAttribute('data-count-prefix') || '';
              var suffix = entry.target.getAttribute('data-count-suffix') || '';
              var decimals = parseInt(entry.target.getAttribute('data-count-decimals')) || 0;
              var duration = 1500;
              var start = performance.now();
              function tick(now) {
                var elapsed = now - start;
                var progress = Math.min(elapsed / duration, 1);
                var eased = 1 - Math.pow(1 - progress, 3);
                var current = target * eased;
                var display = decimals > 0 ? current.toFixed(decimals) : Math.round(current).toLocaleString();
                entry.target.textContent = prefix + display + suffix;
                if (progress < 1) requestAnimationFrame(tick);
              }
              requestAnimationFrame(tick);
              obs.unobserve(entry.target);
            }
          });
        }, { threshold: 0.3 });
        obs.observe(counter);
      }
    });
  }
}

// ── REFERRAL PLAYBOOK TAB SWITCHER ──────────────────────────
function pbSwitchTab(btn, panelId) {
  var tabs = document.querySelectorAll('.pb-tab');
  tabs.forEach(function(t) { t.classList.remove('pb-tab-active'); });
  btn.classList.add('pb-tab-active');

  var panels = document.querySelectorAll('.pb-panel');
  panels.forEach(function(p) { p.classList.remove('pb-panel-active'); });

  var target = document.getElementById(panelId);
  if (target) {
    target.classList.add('pb-panel-active');
    // Inject copy buttons on first reveal
    pbInitCopyButtons(target);
    // Init collapsible cards on spotting panel
    if (panelId === 'pb-panel-spotting') {
      pbInitCollapsible();
    }
  }
}

// ── PLAYBOOK COPY BUTTONS ───────────────────────────────────
function pbInitCopyButtons(container) {
  if (!container) return;
  // Script text blocks
  container.querySelectorAll('.pb-script-text').forEach(function(el) {
    if (el.querySelector('.pb-copy-btn')) return;
    var btn = document.createElement('button');
    btn.className = 'pb-copy-btn';
    btn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy';
    btn.onclick = function(e) {
      e.preventDefault();
      pbCopyText(el.textContent.replace(/\s*Copy$/, '').trim(), btn);
    };
    el.appendChild(btn);
  });
  // Objection response blocks
  container.querySelectorAll('.pb-obj-a').forEach(function(el) {
    if (el.querySelector('.pb-copy-btn')) return;
    var btn = document.createElement('button');
    btn.className = 'pb-copy-btn';
    btn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy';
    btn.onclick = function(e) {
      e.preventDefault();
      pbCopyText(el.textContent.replace(/\s*Copy$/, '').trim(), btn);
    };
    el.appendChild(btn);
  });
}

function pbCopyText(text, btn) {
  navigator.clipboard.writeText(text).then(function() {
    var original = btn.innerHTML;
    btn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Copied!';
    btn.classList.add('pb-copy-btn-done');
    setTimeout(function() {
      btn.innerHTML = original;
      btn.classList.remove('pb-copy-btn-done');
    }, 2000);
  }).catch(function() {
    // Fallback for older browsers
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;left:-9999px';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    var original = btn.innerHTML;
    btn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Copied!';
    btn.classList.add('pb-copy-btn-done');
    setTimeout(function() {
      btn.innerHTML = original;
      btn.classList.remove('pb-copy-btn-done');
    }, 2000);
  });
}

// ── PLAYBOOK COLLAPSIBLE CARDS ──────────────────────────────
function pbInitCollapsible() {
  var cards = document.querySelectorAll('.pb-card');
  cards.forEach(function(card) {
    // Open the first card by default
    if (card === cards[0]) {
      card.classList.add('pb-card-open');
    }
    var title = card.querySelector('.pb-card-title');
    if (title && !title._pbWired) {
      title._pbWired = true;
      title.addEventListener('click', function() {
        card.classList.toggle('pb-card-open');
      });
    }
  });
}

// ── PLAYBOOK PRINT CHEAT SHEET ─────────────────────────────
function pbPrintCheatSheet() {
  // Show all panels so everything prints
  var panels = document.querySelectorAll('.pb-panel');
  var wasHidden = [];
  panels.forEach(function(p) {
    if (!p.classList.contains('pb-panel-active')) {
      p.classList.add('pb-panel-active');
      wasHidden.push(p);
    }
    // Init copy buttons so text renders fully
    pbInitCopyButtons(p);
  });

  document.body.classList.add('pb-printing');

  setTimeout(function() {
    window.print();
    document.body.classList.remove('pb-printing');
    // Restore hidden panels
    wasHidden.forEach(function(p) { p.classList.remove('pb-panel-active'); });
  }, 100);
}

// ── WEBINAR CATEGORY FILTER ──────────────────────────────────
function filterWebinars(pill, cat) {
  // Update active pill
  var pills = document.querySelectorAll('.wbn-pill');
  pills.forEach(function(p) { p.classList.remove('wbn-pill-active'); });
  pill.classList.add('wbn-pill-active');

  // Filter cards
  var cards = document.querySelectorAll('.wbn-card');
  var visibleCount = 0;
  cards.forEach(function(card) {
    if (cat === 'all' || card.getAttribute('data-cat') === cat) {
      card.style.display = '';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });

  // Show/hide empty state
  var empty = document.getElementById('wbn-empty');
  if (empty) {
    empty.style.display = visibleCount === 0 ? 'block' : 'none';
  }
}

// ── TIER VOLUME SELECTOR ──────────────────────────────────────
function initTierFinder() {
  // Reset state on page load
  var pills = document.querySelectorAll('.tier-vol-pill');
  pills.forEach(function(p) { p.classList.remove('tvp-active'); });
  var cards = document.querySelectorAll('.tg .tc');
  cards.forEach(function(c) {
    c.classList.remove('tc-recommended', 'tc-dimmed');
  });
}

// ── FORM PROGRESS OBSERVER ──────────────────────────────────────
function initFormProgress() {
  var sections = document.querySelectorAll('[data-form-step]');
  var steps = document.querySelectorAll('.fp-step');
  var fills = [document.getElementById('fp-fill-1'), document.getElementById('fp-fill-2')];
  if (!sections.length || !steps.length) return;

  var observer = new IntersectionObserver(function(entries) {
    // Find the highest visible step
    var highestVisible = 0;
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var stepNum = parseInt(entry.target.getAttribute('data-form-step'));
        if (stepNum > highestVisible) highestVisible = stepNum;
      }
    });
    // Also check all section labels to find current
    sections.forEach(function(sec) {
      var rect = sec.getBoundingClientRect();
      var stepNum = parseInt(sec.getAttribute('data-form-step'));
      if (rect.top < window.innerHeight * 0.6 && rect.bottom > 0) {
        if (stepNum > highestVisible) highestVisible = stepNum;
      }
    });
    if (highestVisible === 0) return;
    updateFormProgress(highestVisible, steps, fills);
  }, { threshold: 0.1, rootMargin: '0px 0px -40% 0px' });

  sections.forEach(function(sec) { observer.observe(sec); });

  // Also update on scroll for more precise tracking
  var scrollEl = document.getElementById('page-apply');
  if (scrollEl) {
    var scrollTicking = false;
    window.addEventListener('scroll', function() {
      if (!scrollTicking) {
        requestAnimationFrame(function() {
          var current = 1;
          sections.forEach(function(sec) {
            var rect = sec.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.5) {
              current = parseInt(sec.getAttribute('data-form-step'));
            }
          });
          updateFormProgress(current, steps, fills);
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    }, { passive: true });
  }
}

function updateFormProgress(currentStep, steps, fills) {
  steps.forEach(function(step, i) {
    var num = i + 1;
    step.classList.remove('fp-active', 'fp-done');
    if (num < currentStep) {
      step.classList.add('fp-done');
    } else if (num === currentStep) {
      step.classList.add('fp-active');
    }
  });
  // Fill connecting lines
  fills.forEach(function(fill, i) {
    if (!fill) return;
    var lineStep = i + 1; // line after step 1, line after step 2
    fill.style.width = currentStep > lineStep ? '100%' : '0';
  });
}

function selectVolumePill(btn) {
  var pills = document.querySelectorAll('.tier-vol-pill');
  var wasActive = btn.classList.contains('tvp-active');

  // Clear all pills
  pills.forEach(function(p) { p.classList.remove('tvp-active'); });

  var cards = document.querySelectorAll('.tg .tc');

  if (wasActive) {
    // Deselect: reset all cards to default
    cards.forEach(function(c) {
      c.classList.remove('tc-recommended', 'tc-dimmed');
    });
    return;
  }

  // Activate this pill
  btn.classList.add('tvp-active');
  var matchTier = btn.getAttribute('data-tier-match');

  cards.forEach(function(c) {
    var tier = c.getAttribute('data-tier');
    if (tier === matchTier) {
      c.classList.add('tc-recommended');
      c.classList.remove('tc-dimmed');
    } else {
      c.classList.remove('tc-recommended');
      c.classList.add('tc-dimmed');
    }
  });
}
