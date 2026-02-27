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
