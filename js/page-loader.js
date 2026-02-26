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
  if (id === 'dashboard' && typeof window.initDashboardHub === 'function') {
    setTimeout(window.initDashboardHub, 80);
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
