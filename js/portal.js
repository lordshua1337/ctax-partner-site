// --- Referrals interactions ---
function toggleRefDetail(row) {
  if (event && event.target.closest('.ref-act')) return;
  if (event && event.target.closest('.ref-cb')) return;
  row.classList.toggle('ref-row-open');
  // On mobile, scroll tapped row to top of viewport
  if (window.matchMedia('(max-width:768px)').matches && row.classList.contains('ref-row-open')) {
    setTimeout(function() {
      row.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 120);
  }
}

function setRefFilter(btn, status) {
  document.querySelectorAll('.ref-filter-pill').forEach(function(p) { p.classList.remove('ref-fp-active'); });
  btn.classList.add('ref-fp-active');
  var visibleCount = 0;
  document.querySelectorAll('.ref-row').forEach(function(row) {
    if (status === 'all' || row.getAttribute('data-status') === status) {
      row.style.display = '';
      visibleCount++;
    } else {
      row.style.display = 'none';
      row.classList.remove('ref-row-open');
    }
  });
  refShowEmpty(visibleCount === 0);
}

function filterReferrals() {
  var q = (document.getElementById('ref-search').value || '').toLowerCase();
  var visibleCount = 0;
  document.querySelectorAll('.ref-row').forEach(function(row) {
    var visible = row.textContent.toLowerCase().indexOf(q) !== -1;
    row.style.display = visible ? '' : 'none';
    if (visible) visibleCount++;
  });
  if (q) {
    document.querySelectorAll('.ref-filter-pill').forEach(function(p) { p.classList.remove('ref-fp-active'); });
  }
  refShowEmpty(visibleCount === 0);
}

function refShowEmpty(show) {
  var el = document.getElementById('ref-empty-state');
  if (el) el.style.display = show ? 'flex' : 'none';
}

function clearRefFilters() {
  var search = document.getElementById('ref-search');
  if (search) search.value = '';
  var allPill = document.querySelector('.ref-filter-pill');
  if (allPill) setRefFilter(allPill, 'all');
}

// --- KPI card detail expand ---
function toggleKpiDetail(card, panelId) {
  var panel = document.getElementById(panelId);
  if (!panel) return;
  var allCards = document.querySelectorAll('.ref-kpi');
  var allPanels = document.querySelectorAll('.ref-kpi-detail');
  var isOpen = card.classList.contains('ref-kpi-active');

  // Close all
  allCards.forEach(function(c) { c.classList.remove('ref-kpi-active'); });
  allPanels.forEach(function(p) {
    p.style.maxHeight = '0';
    p.classList.remove('ref-kpi-detail-open');
  });

  // Toggle open if wasn't already
  if (!isOpen) {
    card.classList.add('ref-kpi-active');
    panel.classList.add('ref-kpi-detail-open');
    panel.style.maxHeight = panel.scrollHeight + 'px';
  }
}

// --- Referral pipeline click filter ---
function pipelineFilter(status) {
  var pills = document.querySelectorAll('.ref-filter-pill');
  pills.forEach(function(p) {
    if (p.textContent.toLowerCase().indexOf(status) !== -1) {
      setRefFilter(p, status);
    }
  });
}

// --- Referral sort ---
var refSortState = {};
function refSort(field) {
  var rows = Array.from(document.querySelectorAll('.ref-row'));
  var asc = refSortState[field] !== 'asc';
  refSortState[field] = asc ? 'asc' : 'desc';

  rows.sort(function(a, b) {
    var av, bv;
    if (field === 'date') {
      av = new Date(a.querySelectorAll('.ref-td')[1].textContent);
      bv = new Date(b.querySelectorAll('.ref-td')[1].textContent);
    } else if (field === 'debt') {
      av = parseFloat(a.querySelector('.ref-td-money').textContent.replace(/[$,]/g, '')) || 0;
      bv = parseFloat(b.querySelector('.ref-td-money').textContent.replace(/[$,]/g, '')) || 0;
    }
    return asc ? av - bv : bv - av;
  });

  var parent = rows[0].parentElement;
  rows.forEach(function(r) { parent.appendChild(r); });
}

// --- Referral bulk actions ---
function refToggleAll(master) {
  document.querySelectorAll('.ref-row-cb').forEach(function(cb) {
    cb.checked = master.checked;
  });
  refUpdateBulk();
}

function refUpdateBulk() {
  var checked = document.querySelectorAll('.ref-row-cb:checked').length;
  var bar = document.getElementById('ref-bulk-bar');
  var count = document.getElementById('ref-bulk-count');
  if (bar) bar.classList.toggle('ref-bulk-visible', checked > 0);
  if (count) count.textContent = checked + ' selected';
}

function refBulkExport() {
  var rows = document.querySelectorAll('.ref-row-cb:checked');
  if (rows.length === 0) return;
  showToast(rows.length + ' referral(s) exported', 'success');
}

// --- Portal navigation ---
function portalNav(el, secId) {
  document.querySelectorAll('.portal-nav-item').forEach(function(a) { a.classList.remove('pni-active'); });
  el.classList.add('pni-active');
  document.querySelectorAll('.portal-section').forEach(function(s) { s.classList.remove('portal-sec-active'); });
  var sec = document.getElementById(secId);
  if (sec) sec.classList.add('portal-sec-active');
  document.querySelector('.portal-sidebar').classList.remove('portal-sb-open');
  document.querySelector('.portal-main').scrollTo(0, 0);

  // Lazy-init animations on section reveal
  if (secId === 'portal-sec-earnings') initEarningsAnimation();
  if (secId === 'portal-sec-ce') initCeRingAnimation();

  // Entrance animation for section content
  if (sec) portalAnimateEntrance(sec);

  // Sync mobile bottom nav highlight
  mobNavSync(secId);
}

function portalAnimateEntrance(sec) {
  var targets = sec.querySelectorAll('.portal-sec-header, .pb-stats, .pb-streak, .pb-tabs, .pb-quiz, .bp-form-grid, .bp-callout, .dash-kpi-row, .dash-table, .dash-activity-feed, .dash-quick-links, .bp-insights-row, .bp-whatif, .bp-month');
  var delay = 0;
  targets.forEach(function(el) {
    if (el.dataset.entered) return;
    el.dataset.entered = '1';
    el.style.opacity = '0';
    el.style.transform = 'translateY(12px)';
    el.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
    (function(target, d) {
      setTimeout(function() {
        target.style.opacity = '1';
        target.style.transform = 'translateY(0)';
      }, d);
    })(el, delay);
    delay += 50;
  });
}

// --- Dashboard: Welcome greeting ---
function initDashGreeting() {
  var el = document.getElementById('dash-greeting');
  if (!el) return;
  var h = new Date().getHours();
  var greeting = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  el.textContent = greeting + ', Josh';
}

// --- Partner brand ---
function initPortalBrand() {
  var input = document.getElementById('portal-logo-input');
  var preview = document.getElementById('portal-brand-preview');
  var label = document.getElementById('portal-brand-text');
  var drop = document.getElementById('portal-brand-drop');
  if (!input || input._wired) return;
  input._wired = true;

  input.addEventListener('change', function() {
    var file = input.files && input.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(e) {
      var dataUrl = e.target.result;
      showLogo(dataUrl);
      updateCobrandStatus(true);
      extractColors(dataUrl, function(colors) {
        if (colors.length > 1) {
          showColorPicker(colors, dataUrl);
        } else {
          applyAccent(colors[0]);
        }
      });
    };
    reader.readAsDataURL(file);
  });

  function showLogo(url) {
    preview.innerHTML = '<img src="' + url + '" alt="Logo" style="max-width:100%;max-height:100%;object-fit:contain;border-radius:4px">';
    label.textContent = 'Change logo';
    drop.classList.add('portal-brand-loaded');
  }

  function showColorPicker(colors, logoUrl) {
    var old = document.getElementById('portal-color-picker');
    if (old) old.remove();
    var picker = document.createElement('div');
    picker.id = 'portal-color-picker';
    picker.className = 'portal-cpicker';
    picker.innerHTML = '<div class="portal-cpicker-title">Pick your brand color</div><div class="portal-cpicker-swatches" id="portal-cpicker-swatches"></div>';
    var swatches = picker.querySelector('#portal-cpicker-swatches');
    colors.forEach(function(color) {
      var btn = document.createElement('button');
      btn.className = 'portal-cpicker-swatch';
      btn.style.background = color;
      btn.onclick = function() {
        applyAccent(color);
        picker.remove();
      };
      swatches.appendChild(btn);
    });
    drop.parentElement.appendChild(picker);
  }

  function applyAccent(color) {
    var layout = document.querySelector('.portal-layout');
    if (!layout) return;
    var rgb = hexToRgb(color);
    layout.style.setProperty('--pa', color);
    layout.style.setProperty('--pa-rgb', rgb.r + ',' + rgb.g + ',' + rgb.b);
    layout.classList.add('portal-branded');
    var picker = document.getElementById('portal-color-picker');
    if (picker) picker.remove();
  }

  function extractColors(dataUrl, cb) {
    var img = new Image();
    img.onload = function() {
      var c = document.createElement('canvas');
      c.width = 64; c.height = 64;
      var ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0, 64, 64);
      var px = ctx.getImageData(0, 0, 64, 64).data;
      var buckets = {};
      for (var i = 0; i < px.length; i += 8) {
        var r = px[i], g = px[i+1], b = px[i+2], a = px[i+3];
        if (a < 128) continue;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var l = (max + min) / 2;
        if (l < 25 || l > 235) continue;
        var d = max - min;
        var s = d === 0 ? 0 : d / (1 - Math.abs(2 * l / 255 - 1));
        if (s < 50) continue;
        var h = 0;
        if (d > 0) {
          if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
          else if (max === g) h = ((b - r) / d + 2) * 60;
          else h = ((r - g) / d + 4) * 60;
        }
        var bucket = Math.floor(h / 30) * 30;
        if (!buckets[bucket]) buckets[bucket] = { count: 0, totalS: 0, bestS: 0, bestColor: '' };
        buckets[bucket].count++;
        buckets[bucket].totalS += s;
        if (s > buckets[bucket].bestS) {
          buckets[bucket].bestS = s;
          buckets[bucket].bestColor = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        }
      }
      var sorted = Object.keys(buckets).map(function(k) {
        return { hue: k, count: buckets[k].count, color: buckets[k].bestColor, s: buckets[k].bestS };
      }).sort(function(a, b) { return b.count - a.count; });
      if (sorted.length === 0) { cb(['#888888']); return; }
      var results = [sorted[0].color];
      if (sorted.length > 1 && sorted[1].count > sorted[0].count * 0.25) {
        var hueDiff = Math.abs(parseInt(sorted[0].hue) - parseInt(sorted[1].hue));
        if (hueDiff > 30 || hueDiff === 0) {
          if (hueDiff >= 60 || (360 - hueDiff) >= 60) {
            results.push(sorted[1].color);
          }
        }
      }
      cb(results);
    };
    img.src = dataUrl;
  }

  function hexToRgb(hex) {
    var m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return m ? { r: parseInt(m[1],16), g: parseInt(m[2],16), b: parseInt(m[3],16) } : { r: 136, g: 136, b: 136 };
  }
}

// --- Submit Referral multi-step form ---
var subCurrentStep = 1;
var subTotalSteps = 4;

function subFormNav(dir) {
  // If moving forward, validate current step
  if (dir === 1 && subCurrentStep < subTotalSteps) {
    if (!validateSubStep(subCurrentStep)) return;
  }

  // If on last step and clicking submit
  if (dir === 1 && subCurrentStep === subTotalSteps) {
    submitReferral();
    return;
  }

  var next = subCurrentStep + dir;
  if (next < 1 || next > subTotalSteps) return;

  // Populate review on step 4
  if (next === 4) populateReview();

  var curPanel = document.getElementById('sub-panel-' + subCurrentStep);
  var nextPanel = document.getElementById('sub-panel-' + next);
  if (curPanel) curPanel.classList.remove('sub-panel-active');
  if (nextPanel) nextPanel.classList.add('sub-panel-active');

  var steps = document.querySelectorAll('.sub-step');
  var fills = [
    document.getElementById('sub-fill-1'),
    document.getElementById('sub-fill-2'),
    document.getElementById('sub-fill-3')
  ];

  steps.forEach(function(step) {
    var stepNum = parseInt(step.getAttribute('data-step'));
    step.classList.remove('sub-step-active', 'sub-step-done');
    if (stepNum < next) step.classList.add('sub-step-done');
    else if (stepNum === next) step.classList.add('sub-step-active');
  });

  fills.forEach(function(fill, i) {
    if (!fill) return;
    fill.style.width = next > (i + 1) ? '100%' : '0';
  });

  subCurrentStep = next;

  var backBtn = document.getElementById('sub-btn-back');
  var nextBtn = document.getElementById('sub-btn-next');
  if (backBtn) backBtn.style.visibility = subCurrentStep === 1 ? 'hidden' : 'visible';
  if (nextBtn) {
    if (subCurrentStep === subTotalSteps) {
      nextBtn.textContent = 'Submit Referral';
      nextBtn.classList.add('sub-btn-submit');
    } else {
      nextBtn.textContent = 'Continue';
      nextBtn.classList.remove('sub-btn-submit');
    }
  }

  var formWrap = document.querySelector('.sub-form-wrap');
  if (formWrap) formWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function validateSubStep(step) {
  var panel = document.getElementById('sub-panel-' + step);
  if (!panel) return true;
  var valid = true;
  panel.querySelectorAll('[data-required]').forEach(function(field) {
    var input = field.querySelector('input, select');
    if (!input) return;
    var val = input.value.trim();
    if (!val) {
      field.classList.add('sub-field-invalid');
      valid = false;
    } else {
      field.classList.remove('sub-field-invalid');
    }
  });
  return valid;
}

function populateReview() {
  var first = (document.getElementById('sub-first-name') || {}).value || '';
  var last = (document.getElementById('sub-last-name') || {}).value || '';
  var phone = (document.getElementById('sub-phone') || {}).value || '';
  var email = (document.getElementById('sub-email') || {}).value || '';
  var debt = (document.getElementById('sub-debt') || {}).value || '';
  var debtType = (document.getElementById('sub-debt-type') || {}).value || '';

  var years = [];
  var checkGroups = document.querySelectorAll('#sub-panel-2 .sub-checkboxes');
  if (checkGroups[0]) {
    checkGroups[0].querySelectorAll('input:checked').forEach(function(cb) {
      years.push(cb.parentElement.textContent.trim());
    });
  }

  var notices = [];
  if (checkGroups[1]) {
    checkGroups[1].querySelectorAll('input:checked').forEach(function(cb) {
      notices.push(cb.parentElement.textContent.trim());
    });
  }

  var setEl = function(id, val) {
    var el = document.getElementById(id);
    if (el) el.textContent = val || '--';
  };

  setEl('sub-rev-name', first && last ? first + ' ' + last : '--');
  setEl('sub-rev-phone', phone || '--');
  setEl('sub-rev-email', email || '--');
  setEl('sub-rev-location', 'See form');
  setEl('sub-rev-debt', debt ? '$' + debt : '--');
  setEl('sub-rev-type', debtType || '--');
  setEl('sub-rev-years', years.length ? years.join(', ') : '--');
  setEl('sub-rev-notices', notices.length ? notices.join(', ') : '--');
}

function submitReferral() {
  // Show success state
  document.querySelector('.sub-form-wrap').style.display = 'none';
  document.querySelector('.sub-steps').style.display = 'none';
  document.getElementById('sub-nav').style.display = 'none';
  document.getElementById('sub-success').classList.add('sub-success-active');
  var refNum = 'REF-2026-' + String(Math.floor(Math.random() * 9000) + 1000).padStart(4, '0');
  document.getElementById('sub-success-id').textContent = 'Referral #' + refNum + ' submitted successfully.';
  showToast('Referral submitted successfully!', 'success');
}

function resetSubForm() {
  document.querySelector('.sub-form-wrap').style.display = '';
  document.querySelector('.sub-steps').style.display = '';
  document.getElementById('sub-nav').style.display = '';
  document.getElementById('sub-success').classList.remove('sub-success-active');
  // Reset to step 1
  subCurrentStep = 1;
  document.querySelectorAll('.sub-panel').forEach(function(p) { p.classList.remove('sub-panel-active'); });
  document.getElementById('sub-panel-1').classList.add('sub-panel-active');
  document.querySelectorAll('.sub-step').forEach(function(s) {
    s.classList.remove('sub-step-active', 'sub-step-done');
    if (s.getAttribute('data-step') === '1') s.classList.add('sub-step-active');
  });
  document.querySelectorAll('.sub-step-fill').forEach(function(f) { f.style.width = '0'; });
  document.getElementById('sub-btn-back').style.visibility = 'hidden';
  var nextBtn = document.getElementById('sub-btn-next');
  nextBtn.textContent = 'Continue';
  nextBtn.classList.remove('sub-btn-submit');
  // Clear inputs
  document.querySelectorAll('#portal-sec-submit .sub-input, #portal-sec-submit .sub-textarea, #portal-sec-submit .sub-select').forEach(function(el) {
    if (el.tagName === 'SELECT') el.selectedIndex = 0;
    else el.value = '';
  });
  document.querySelectorAll('#portal-sec-submit input[type=checkbox]').forEach(function(cb) { cb.checked = false; });
  document.querySelectorAll('.sub-field-invalid').forEach(function(f) { f.classList.remove('sub-field-invalid'); });
}

// --- Phone auto-format ---
function formatPhone(input) {
  var digits = input.value.replace(/\D/g, '');
  if (digits.length === 0) { input.value = ''; return; }
  if (digits.length <= 3) { input.value = '(' + digits; return; }
  if (digits.length <= 6) { input.value = '(' + digits.slice(0, 3) + ') ' + digits.slice(3); return; }
  input.value = '(' + digits.slice(0, 3) + ') ' + digits.slice(3, 6) + '-' + digits.slice(6, 10);
}

// --- Revenue Calculator ---
var _portalTier = 'direct';
var _portalTierConfig = {
  direct:     { rate: 8,  refMax: 20,  refDefault: 5,  name: 'Direct',     next: 'Enterprise', nextRate: 13 },
  enterprise: { rate: 13, refMax: 50,  refDefault: 15, name: 'Enterprise', next: 'Strategic',  nextRate: 18 },
  strategic:  { rate: 18, refMax: 100, refDefault: 30, name: 'Strategic',  next: null,         nextRate: null }
};

function setCalcTier(btn, tier) {
  document.querySelectorAll('.calc-tier-pill').forEach(function(p) { p.classList.remove('calc-tier-pill-active'); });
  btn.classList.add('calc-tier-pill-active');
  _portalTier = tier;

  var cfg = _portalTierConfig[tier];
  var sl = document.getElementById('calc-ref');
  if (sl) {
    sl.min = 1;
    sl.max = cfg.refMax;
    sl.value = cfg.refDefault;
  }
  var lblMin = document.getElementById('calc-ref-min');
  var lblMid = document.getElementById('calc-ref-mid');
  var lblMax = document.getElementById('calc-ref-max');
  if (lblMin) lblMin.textContent = '1';
  if (lblMid) lblMid.textContent = Math.round(cfg.refMax / 2);
  if (lblMax) lblMax.textContent = cfg.refMax;

  // Lock commission rate slider to tier rate
  var rateSl = document.getElementById('calc-rate');
  if (rateSl) rateSl.value = cfg.rate;

  calcProjection();
}

function calcProjection() {
  var cfg = _portalTierConfig[_portalTier];
  var refs = parseInt(document.getElementById('calc-ref').value) || 5;
  var debt = parseInt(document.getElementById('calc-debt').value) || 25000;
  var rate = cfg.rate;

  document.getElementById('calc-ref-val').textContent = refs;
  document.getElementById('calc-debt-val').textContent = '$' + debt.toLocaleString();
  document.getElementById('calc-rate-val').textContent = rate + '%';

  // Sync rate slider to tier
  var rateSl = document.getElementById('calc-rate');
  if (rateSl && parseInt(rateSl.value) !== rate) rateSl.value = rate;

  var monthly = refs * debt * (rate / 100);
  var annual = monthly * 12;
  var threeYr = annual * 3;

  animateCalcValue('calc-monthly', monthly);
  animateCalcValue('calc-annual', annual);
  animateCalcValue('calc-3yr', threeYr);

  // Tier comparison
  var currentAnnual = annual;
  var curName = document.getElementById('calc-tier-current-name');
  var curPct = document.getElementById('calc-tier-current-pct');
  if (curName) curName.textContent = cfg.name;
  if (curPct) curPct.textContent = rate + '% commission';
  document.getElementById('calc-tier-current').textContent = '$' + Math.round(currentAnnual).toLocaleString() + '/yr';

  var nextName = document.getElementById('calc-tier-next-name');
  var nextPct = document.getElementById('calc-tier-next-pct');
  var diffEl = document.getElementById('calc-tier-diff');

  if (cfg.next) {
    var nextAnnual = refs * debt * (cfg.nextRate / 100) * 12;
    if (nextName) nextName.textContent = cfg.next;
    if (nextPct) nextPct.textContent = cfg.nextRate + '% commission';
    document.getElementById('calc-tier-next').textContent = '$' + Math.round(nextAnnual).toLocaleString() + '/yr';
    document.getElementById('calc-tier-bonus').textContent = '$' + Math.round(nextAnnual - currentAnnual).toLocaleString();
    if (diffEl) diffEl.innerHTML = 'Upgrading to ' + cfg.next + ' means <strong id="calc-tier-bonus">$' + Math.round(nextAnnual - currentAnnual).toLocaleString() + '</strong> more per year';
  } else {
    if (nextName) nextName.textContent = '--';
    if (nextPct) nextPct.textContent = 'Max tier';
    document.getElementById('calc-tier-next').textContent = '--';
    if (diffEl) diffEl.innerHTML = 'You are at the <strong>highest tier</strong> -- maximum revenue share';
  }

  // Growth bars
  var maxRef = cfg.refMax;
  var volumes = [Math.round(maxRef * 0.15), Math.round(maxRef * 0.35), Math.round(maxRef * 0.6), maxRef];
  var maxVal = maxRef * debt * (rate / 100) * 12;
  volumes.forEach(function(vol, i) {
    var val = vol * debt * (rate / 100) * 12;
    var pct = Math.max(4, (val / maxVal) * 100);
    var ids = ['calc-grow-3', 'calc-grow-5', 'calc-grow-10', 'calc-grow-20'];
    var bar = document.getElementById(ids[i]);
    var label = document.getElementById(ids[i] + '-val');
    var rowLabel = bar ? bar.closest('.calc-grow-row') : null;
    if (rowLabel) {
      var lbl = rowLabel.querySelector('.calc-grow-label');
      if (lbl) lbl.textContent = vol + '/mo';
    }
    if (bar) bar.style.width = pct + '%';
    if (label) {
      if (val >= 1000000) label.textContent = '$' + (val / 1000000).toFixed(1) + 'M';
      else if (val >= 1000) label.textContent = '$' + Math.round(val / 1000) + 'k';
      else label.textContent = '$' + Math.round(val);
    }
  });

  // Breakeven indicator
  var perRef = debt * (rate / 100);
  var breakeven = perRef > 0 ? Math.ceil(75000 / 12 / perRef) : 0;
  var beVal = document.getElementById('calc-breakeven-val');
  if (beVal) beVal.textContent = breakeven;
}

// Animate calculator projection numbers
function animateCalcValue(id, target) {
  var el = document.getElementById(id);
  if (!el) return;
  var current = parseFloat(el.textContent.replace(/[$,]/g, '')) || 0;
  if (Math.round(current) === Math.round(target)) {
    el.textContent = '$' + Math.round(target).toLocaleString();
    return;
  }
  var start = performance.now();
  var duration = 400;
  function tick(now) {
    var progress = Math.min((now - start) / duration, 1);
    var eased = 1 - Math.pow(1 - progress, 3);
    var val = current + (target - current) * eased;
    el.textContent = '$' + Math.round(val).toLocaleString();
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// --- Earnings: Period pill toggle ---
// --- Earnings: Period Data Sets ---
var EARN_DATA = {
  month: {
    kpis: { total: '$2,490', avg: '$498', best: '$1,280', bestLabel: 'Feb 12', pending: '$2,736', pendingSub: '1 referral' },
    trend: { total: '+8.2%', totalDir: 'up', avg: '+2.4%', avgDir: 'up' },
    chart: { title: 'Weekly Earnings (Feb 2026)', yLabels: ['$1.5k','$1.2k','$900','$600','$300','$0'], bars: [
      { h: '52%', val: '$780', label: 'Wk 1' },
      { h: '85%', val: '$1,280', label: 'Wk 2', best: true },
      { h: '29%', val: '$430', label: 'Wk 3', current: true },
      { h: '0%', val: '--', label: 'Wk 4' }
    ]},
    rows: [
      { initials: 'DL', color: 'var(--cyan-text)', name: 'David Lee', type: 'Penalty Abatement', debt: '$27,100', comm: '$2,168', commColor: 'var(--cyan-text)', date: 'Feb 14, 2026', badge: 'Paid', badgeClass: 'earn-b-paid' },
      { initials: 'JW', color: '#0B5FD8', name: 'James Williams', type: 'Offer in Compromise', debt: '$34,200', comm: '$2,736', commColor: 'var(--blue)', date: 'Pending', badge: 'Pending', badgeClass: 'earn-b-pending' }
    ]
  },
  quarter: {
    kpis: { total: '$9,402', avg: '$470', best: '$4,224', bestLabel: 'Jan 2026', pending: '$5,472', pendingSub: '3 referrals' },
    trend: { total: '+18.6%', totalDir: 'up', avg: '+5.3%', avgDir: 'up' },
    chart: { title: 'Monthly Earnings (Q1 2026)', yLabels: ['$5k','$4k','$3k','$2k','$1k','$0'], bars: [
      { h: '84%', val: '$4,224', label: 'Jan', best: true },
      { h: '50%', val: '$2,490', label: 'Feb', current: true },
      { h: '54%', val: '$2,688', label: 'Mar' }
    ]},
    rows: [
      { initials: 'RT', color: 'var(--cyan-text)', name: 'Robert Thompson', type: 'Installment Agreement', debt: '$52,800', comm: '$4,224', commColor: 'var(--cyan-text)', date: 'Feb 21, 2026', badge: 'Paid', badgeClass: 'earn-b-paid' },
      { initials: 'DL', color: 'var(--cyan-text)', name: 'David Lee', type: 'Penalty Abatement', debt: '$27,100', comm: '$2,168', commColor: 'var(--cyan-text)', date: 'Feb 14, 2026', badge: 'Paid', badgeClass: 'earn-b-paid' },
      { initials: 'JW', color: '#0B5FD8', name: 'James Williams', type: 'Offer in Compromise', debt: '$34,200', comm: '$2,736', commColor: 'var(--blue)', date: 'Pending', badge: 'Pending', badgeClass: 'earn-b-pending' },
      { initials: 'MG', color: 'var(--cyan-text)', name: 'Maria Garcia', type: 'Under Investigation', debt: '$18,500', comm: 'TBD', commColor: 'var(--slate)', date: '--', badge: 'In Progress', badgeClass: 'earn-b-investigation' }
    ]
  },
  year: {
    kpis: { total: '$24,850', avg: '$438', best: '$4,224', bestLabel: 'Jan 2026', pending: '$5,472', pendingSub: '3 referrals' },
    trend: { total: '+34.2%', totalDir: 'up', avg: '+12.1%', avgDir: 'up' },
    chart: { title: 'Monthly Earnings (2026)', yLabels: ['$5k','$4k','$3k','$2k','$1k','$0'], bars: [
      { h: '84%', val: '$4,224', label: 'Jan', best: true },
      { h: '50%', val: '$2,490', label: 'Feb', current: true }
    ]},
    rows: [
      { initials: 'RT', color: 'var(--cyan-text)', name: 'Robert Thompson', type: 'Installment Agreement', debt: '$52,800', comm: '$4,224', commColor: 'var(--cyan-text)', date: 'Feb 21, 2026', badge: 'Paid', badgeClass: 'earn-b-paid' },
      { initials: 'DL', color: 'var(--cyan-text)', name: 'David Lee', type: 'Penalty Abatement', debt: '$27,100', comm: '$2,168', commColor: 'var(--cyan-text)', date: 'Feb 14, 2026', badge: 'Paid', badgeClass: 'earn-b-paid' },
      { initials: 'JW', color: '#0B5FD8', name: 'James Williams', type: 'Offer in Compromise', debt: '$34,200', comm: '$2,736', commColor: 'var(--blue)', date: 'Pending', badge: 'Pending', badgeClass: 'earn-b-pending' },
      { initials: 'MG', color: 'var(--cyan-text)', name: 'Maria Garcia', type: 'Under Investigation', debt: '$18,500', comm: 'TBD', commColor: 'var(--slate)', date: '--', badge: 'In Progress', badgeClass: 'earn-b-investigation' },
      { initials: 'KP', color: 'var(--sky)', name: 'Karen Patel', type: 'TBD', debt: '$12,400', comm: 'TBD', commColor: 'var(--slate)', date: '--', badge: 'New', badgeClass: 'earn-b-new' }
    ]
  },
  all: {
    kpis: { total: '$67,310', avg: '$415', best: '$4,224', bestLabel: 'Jan 2026', pending: '$5,472', pendingSub: '3 referrals' },
    trend: { total: '+142%', totalDir: 'up', avg: '+28.5%', avgDir: 'up' },
    chart: { title: 'Quarterly Earnings (All Time)', yLabels: ['$20k','$16k','$12k','$8k','$4k','$0'], bars: [
      { h: '18%', val: '$3,600', label: 'Q2 \'25' },
      { h: '34%', val: '$6,840', label: 'Q3 \'25' },
      { h: '47%', val: '$9,408', label: 'Q4 \'25' },
      { h: '47%', val: '$9,402', label: 'Q1 \'26', current: true }
    ]},
    rows: [
      { initials: 'RT', color: 'var(--cyan-text)', name: 'Robert Thompson', type: 'Installment Agreement', debt: '$52,800', comm: '$4,224', commColor: 'var(--cyan-text)', date: 'Feb 21, 2026', badge: 'Paid', badgeClass: 'earn-b-paid' },
      { initials: 'DL', color: 'var(--cyan-text)', name: 'David Lee', type: 'Penalty Abatement', debt: '$27,100', comm: '$2,168', commColor: 'var(--cyan-text)', date: 'Feb 14, 2026', badge: 'Paid', badgeClass: 'earn-b-paid' },
      { initials: 'JW', color: '#0B5FD8', name: 'James Williams', type: 'Offer in Compromise', debt: '$34,200', comm: '$2,736', commColor: 'var(--blue)', date: 'Pending', badge: 'Pending', badgeClass: 'earn-b-pending' },
      { initials: 'MG', color: 'var(--cyan-text)', name: 'Maria Garcia', type: 'Under Investigation', debt: '$18,500', comm: 'TBD', commColor: 'var(--slate)', date: '--', badge: 'In Progress', badgeClass: 'earn-b-investigation' },
      { initials: 'KP', color: 'var(--sky)', name: 'Karen Patel', type: 'TBD', debt: '$12,400', comm: 'TBD', commColor: 'var(--slate)', date: '--', badge: 'New', badgeClass: 'earn-b-new' },
      { initials: 'SB', color: '#6366f1', name: 'Sarah Brooks', type: 'Installment Agreement', debt: '$41,200', comm: '$3,296', commColor: 'var(--cyan-text)', date: 'Dec 8, 2025', badge: 'Paid', badgeClass: 'earn-b-paid' },
      { initials: 'TN', color: 'var(--cyan-text)', name: 'Tom Nguyen', type: 'Offer in Compromise', debt: '$29,800', comm: '$2,384', commColor: 'var(--cyan-text)', date: 'Nov 15, 2025', badge: 'Paid', badgeClass: 'earn-b-paid' },
      { initials: 'LM', color: 'var(--sky)', name: 'Lisa Martinez', type: 'Penalty Abatement', debt: '$15,600', comm: '$1,248', commColor: 'var(--cyan-text)', date: 'Oct 22, 2025', badge: 'Paid', badgeClass: 'earn-b-paid' }
    ]
  }
};

function setEarnPeriod(btn, period) {
  document.querySelectorAll('.earn-period').forEach(function(p) { p.classList.remove('earn-period-active'); });
  btn.classList.add('earn-period-active');

  var data = EARN_DATA[period];
  if (!data) return;

  // Update KPIs
  var kpis = document.querySelectorAll('#portal-sec-earnings .earn-kpi');
  if (kpis[0]) {
    kpis[0].querySelector('.earn-kpi-val').textContent = data.kpis.total;
    var t0 = kpis[0].querySelector('.earn-kpi-trend');
    if (t0) { t0.textContent = data.trend.total; t0.className = 'earn-kpi-trend earn-kpi-' + data.trend.totalDir; }
  }
  if (kpis[1]) {
    kpis[1].querySelector('.earn-kpi-val').textContent = data.kpis.avg;
    var t1 = kpis[1].querySelector('.earn-kpi-trend');
    if (t1) { t1.textContent = data.trend.avg; t1.className = 'earn-kpi-trend earn-kpi-' + data.trend.avgDir; }
  }
  if (kpis[2]) {
    kpis[2].querySelector('.earn-kpi-val').textContent = data.kpis.best;
    var sub2 = kpis[2].querySelector('.earn-kpi-subtext');
    if (sub2) sub2.textContent = data.kpis.bestLabel;
  }
  if (kpis[3]) {
    kpis[3].querySelector('.earn-kpi-val').textContent = data.kpis.pending;
    var sub3 = kpis[3].querySelector('.earn-kpi-subtext');
    if (sub3) sub3.textContent = data.kpis.pendingSub;
  }

  // Update chart
  var chartTitle = document.querySelector('#portal-sec-earnings .earn-chart-title');
  if (chartTitle) chartTitle.textContent = data.chart.title;

  var yAxis = document.querySelector('#portal-sec-earnings .earn-chart-y');
  if (yAxis) {
    yAxis.innerHTML = data.chart.yLabels.map(function(l) { return '<span>' + l + '</span>'; }).join('');
  }

  var barsWrap = document.querySelector('#portal-sec-earnings .earn-chart-bars');
  if (barsWrap) {
    barsWrap.innerHTML = data.chart.bars.map(function(b) {
      var barClass = 'earn-bar';
      if (b.best) barClass += ' earn-bar-best';
      if (b.current) barClass += ' earn-bar-current';
      return '<div class="earn-bar-col">' +
        '<div class="' + barClass + '" style="height:' + b.h + '"><span class="earn-bar-val">' + b.val + '</span></div>' +
        '<div class="earn-bar-label">' + b.label + '</div></div>';
    }).join('');
  }

  // Update table
  var tableWrap = document.querySelector('#portal-sec-earnings .earn-table-wrap');
  if (tableWrap) {
    var headHtml = '<div class="earn-table-title">Earnings by Referral</div>' +
      '<div class="earn-table-head"><div>Client</div><div>Resolution Type</div><div>Tax Debt</div><div>Commission</div><div>Date</div><div>Status</div></div>';

    var rowsHtml = data.rows.map(function(r) {
      var commStyle = r.commColor ? 'font-weight:700;color:' + r.commColor : 'font-weight:700';
      return '<div class="earn-table-row">' +
        '<div class="earn-td-client"><div class="earn-avatar" style="background:' + r.color + '">' + r.initials + '</div><span>' + r.name + '</span></div>' +
        '<div>' + r.type + '</div>' +
        '<div style="font-weight:600">' + r.debt + '</div>' +
        '<div style="' + commStyle + '">' + r.comm + '</div>' +
        '<div>' + r.date + '</div>' +
        '<div><span class="earn-badge ' + r.badgeClass + '">' + r.badge + '</span></div></div>';
    }).join('');

    tableWrap.innerHTML = headHtml + rowsHtml;
  }
}

// --- Earnings: Export CSV ---
function exportEarningsCSV() {
  var rows = [['Client', 'Resolution Type', 'Tax Debt', 'Commission', 'Date', 'Status']];
  document.querySelectorAll('.earn-table-row').forEach(function(row) {
    var cells = [];
    row.querySelectorAll(':scope > div').forEach(function(cell) {
      cells.push(cell.textContent.trim());
    });
    rows.push(cells);
  });
  var csv = rows.map(function(r) { return r.join(','); }).join('\n');
  var blob = new Blob([csv], { type: 'text/csv' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'earnings_export.csv';
  a.click();
  URL.revokeObjectURL(url);
  showToast('Earnings exported to CSV', 'success');
}

// --- Earnings: Bar chart animation on reveal ---
var earningsAnimated = false;
function initEarningsAnimation() {
  if (earningsAnimated) return;
  earningsAnimated = true;
  var bars = document.querySelectorAll('.earn-bar');
  bars.forEach(function(bar) {
    var targetH = bar.style.height;
    bar.classList.add('earn-bar-init');
    setTimeout(function() {
      bar.classList.remove('earn-bar-init');
      bar.style.height = targetH;
    }, 50);
  });
}

// --- Payouts: Live countdown ---
function initPayCountdown() {
  var el = document.getElementById('pay-countdown');
  if (!el) return;
  // Count down to March 1, 2026
  var target = new Date('2026-03-01T00:00:00');
  function update() {
    var now = new Date();
    var diff = target - now;
    if (diff <= 0) { el.textContent = 'Today!'; return; }
    var d = Math.floor(diff / 86400000);
    var h = Math.floor((diff % 86400000) / 3600000);
    var m = Math.floor((diff % 3600000) / 60000);
    el.textContent = d + 'd ' + h + 'h ' + m + 'm remaining';
  }
  update();
  setInterval(update, 60000);
}

// --- Payouts: Year filter ---
function payYearFilter(btn, year) {
  document.querySelectorAll('.pay-year-pill').forEach(function(p) { p.classList.remove('pay-year-active'); });
  btn.classList.add('pay-year-active');
  var total = 0;
  document.querySelectorAll('.pay-ledger-row').forEach(function(row) {
    if (!row.getAttribute('data-year')) return;
    if (year === 'all' || row.getAttribute('data-year') === year) {
      row.style.display = '';
      total += parseFloat(row.getAttribute('data-amount') || 0);
    } else {
      row.style.display = 'none';
    }
  });
  var totalEl = document.getElementById('pay-running-total');
  if (totalEl) totalEl.textContent = 'Total Paid to Date: $' + total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// --- Documents: Search ---
function docSearch(q) {
  q = q.toLowerCase();
  document.querySelectorAll('.doc-row').forEach(function(row) {
    var name = (row.querySelector('.doc-td-name span') || {}).textContent || '';
    row.style.display = name.toLowerCase().indexOf(q) !== -1 ? '' : 'none';
  });
}

// --- Documents: Select All ---
function docToggleAll(master) {
  document.querySelectorAll('.doc-row input[type=checkbox]').forEach(function(cb) {
    cb.checked = master.checked;
  });
  docUpdateBulk();
}

function docUpdateBulk() {
  var checked = document.querySelectorAll('.doc-row input[type=checkbox]:checked').length;
  var bar = document.getElementById('doc-bulk-bar');
  var count = document.getElementById('doc-bulk-count');
  if (bar) bar.classList.toggle('doc-bulk-visible', checked > 0);
  if (count) count.textContent = checked + ' selected';
}

// Wire doc row checkboxes
document.addEventListener('change', function(e) {
  if (e.target.closest('.doc-row') && e.target.type === 'checkbox') {
    docUpdateBulk();
  }
});

// --- Documents: Sort ---
var docSortState = {};
function docSort(field) {
  var rows = Array.from(document.querySelectorAll('.doc-row'));
  if (rows.length === 0) return;
  var asc = docSortState[field] !== 'asc';
  docSortState[field] = asc ? 'asc' : 'desc';

  rows.sort(function(a, b) {
    var av, bv;
    if (field === 'name') {
      av = (a.querySelector('.doc-td-name span') || {}).textContent || '';
      bv = (b.querySelector('.doc-td-name span') || {}).textContent || '';
      return asc ? av.localeCompare(bv) : bv.localeCompare(av);
    }
    if (field === 'date') {
      // Direct children: check, name, client, date, size, actions
      var cells_a = a.querySelectorAll(':scope > div');
      var cells_b = b.querySelectorAll(':scope > div');
      av = new Date(cells_a[3] ? cells_a[3].textContent : 0);
      bv = new Date(cells_b[3] ? cells_b[3].textContent : 0);
    }
    if (field === 'size') {
      var cells_a2 = a.querySelectorAll(':scope > div');
      var cells_b2 = b.querySelectorAll(':scope > div');
      av = parseFloat(cells_a2[4] ? cells_a2[4].textContent : '0') || 0;
      bv = parseFloat(cells_b2[4] ? cells_b2[4].textContent : '0') || 0;
    }
    return asc ? av - bv : bv - av;
  });

  var parent = rows[0].parentElement;
  rows.forEach(function(r) { parent.appendChild(r); });
}

// --- Documents: Drag-drop highlight ---
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(function() {
    var dz = document.getElementById('doc-dropzone');
    if (!dz) return;
    dz.addEventListener('dragover', function(e) { e.preventDefault(); dz.classList.add('doc-dropzone-active'); });
    dz.addEventListener('dragleave', function() { dz.classList.remove('doc-dropzone-active'); });
    dz.addEventListener('drop', function(e) { e.preventDefault(); dz.classList.remove('doc-dropzone-active'); showToast('File uploaded', 'success'); });
  }, 200);
});

// --- Settings: API key toggle/copy ---
function toggleApiKey() {
  var input = document.getElementById('set-api-key');
  var btn = input.nextElementSibling;
  if (input.type === 'password') {
    input.type = 'text';
    btn.textContent = 'Hide';
  } else {
    input.type = 'password';
    btn.textContent = 'Show';
  }
}

function copyApiKey() {
  var input = document.getElementById('set-api-key');
  var origType = input.type;
  input.type = 'text';
  input.select();
  document.execCommand('copy');
  input.type = origType;
  var btn = input.nextElementSibling.nextElementSibling;
  btn.textContent = 'Copied!';
  setTimeout(function() { btn.textContent = 'Copy'; }, 2000);
}

function showApiRegenConfirm() {
  var overlay = document.getElementById('set-regen-confirm');
  if (overlay) overlay.classList.add('set-confirm-visible');
}

// --- Settings: Unsaved changes detection ---
function setDetectChanges() {
  var bar = document.getElementById('set-unsaved-bar');
  if (bar) bar.classList.add('set-unsaved-visible');
}

// --- Settings: Avatar upload ---
function setAvatarPreview(input) {
  var file = input.files && input.files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    var container = document.getElementById('set-avatar-upload');
    container.innerHTML = '<img src="' + e.target.result + '" alt="Avatar"><input type="file" accept="image/*" style="display:none" onchange="setAvatarPreview(this)">';
    showToast('Profile photo updated', 'success');
  };
  reader.readAsDataURL(file);
}

// --- Marketing Kit filter ---
function mkFilter(btn, cat) {
  document.querySelectorAll('.mk-tab').forEach(function(t) { t.classList.remove('mk-tab-active'); });
  btn.classList.add('mk-tab-active');
  var visibleCount = 0;
  document.querySelectorAll('.mk-card').forEach(function(card) {
    if (cat === 'all' || card.getAttribute('data-mk-cat') === cat) {
      card.style.display = '';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });
}

// --- Marketing: Co-brand status update ---
function updateCobrandStatus(hasLogo) {
  var notice = document.getElementById('mk-cobrand');
  var title = document.getElementById('mk-cobrand-title');
  var desc = document.getElementById('mk-cobrand-desc');
  if (!notice || !title || !desc) return;
  if (hasLogo) {
    notice.classList.add('mk-cobrand-active');
    title.textContent = 'Your logo is applied to all assets';
    desc.textContent = 'All downloadable collateral now includes your branding.';
  }
}

// --- Documents tab filter ---
function docFilter(btn, cat) {
  document.querySelectorAll('.doc-tab').forEach(function(t) { t.classList.remove('doc-tab-active'); });
  btn.classList.add('doc-tab-active');
  document.querySelectorAll('.doc-row').forEach(function(row) {
    if (cat === 'all' || row.getAttribute('data-cat') === cat) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
}

// --- CE Webinars: Category filter ---
function ceFilter(btn, cat) {
  document.querySelectorAll('.ce-filter').forEach(function(f) { f.classList.remove('ce-filter-active'); });
  btn.classList.add('ce-filter-active');
  document.querySelectorAll('.ce-card').forEach(function(card) {
    if (cat === 'all' || card.getAttribute('data-ce-cat') === cat) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
}

// --- CE Webinars: Search ---
function ceSearch(q) {
  q = q.toLowerCase();
  document.querySelectorAll('.ce-card').forEach(function(card) {
    var title = (card.querySelector('.ce-title') || {}).textContent || '';
    card.style.display = title.toLowerCase().indexOf(q) !== -1 ? '' : 'none';
  });
}

// --- CE: Ring chart animation on reveal ---
var ceRingAnimated = false;
function initCeRingAnimation() {
  if (ceRingAnimated) return;
  ceRingAnimated = true;
  var ring = document.querySelector('.ce-ring circle:nth-child(2)');
  if (!ring) return;
  var target = ring.getAttribute('stroke-dashoffset');
  ring.setAttribute('stroke-dashoffset', '326.73');
  ring.parentElement.classList.add('ce-ring-animate');
  setTimeout(function() {
    ring.setAttribute('stroke-dashoffset', target);
  }, 50);
}

// --- Support: Ticket submission ---
function submitSupportTicket() {
  var subjectEl = document.querySelector('.sup-ticket-form .sup-input');
  var subject = subjectEl ? subjectEl.value.trim() : '';
  if (!subject) {
    showToast('Please enter a subject for your ticket', 'error');
    return;
  }
  // Add new row to table
  var table = document.querySelector('.sup-tickets-table');
  if (table) {
    var ticketNum = '#TK-0' + (97 + Math.floor(Math.random() * 100));
    var today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    var row = document.createElement('div');
    row.className = 'sup-ticket-row';
    row.innerHTML = '<div class="sup-ticket-id">' + ticketNum + '</div>' +
      '<div class="sup-ticket-subject">' + subject + '</div>' +
      '<div><span class="sup-badge sup-b-open">Open</span></div>' +
      '<div>' + today + '</div><div>--</div>';
    var head = table.querySelector('.sup-tickets-head');
    if (head && head.nextSibling) {
      table.insertBefore(row, head.nextSibling);
    } else {
      table.appendChild(row);
    }
  }
  // Clear form
  document.querySelectorAll('.sup-ticket-form input, .sup-ticket-form textarea').forEach(function(el) { el.value = ''; });
  showToast('Support ticket submitted - ' + subject, 'success');
}

// --- Support: KB search ---
function kbSearch(q) {
  q = q.toLowerCase();
  document.querySelectorAll('.sup-kb-item').forEach(function(item) {
    var text = item.textContent.toLowerCase();
    item.style.display = text.indexOf(q) !== -1 ? '' : 'none';
  });
}

// --- Toast notification system ---
function showToast(message, type) {
  type = type || 'info';
  var wrap = document.getElementById('portal-toast-wrap');
  if (!wrap) return;
  var toast = document.createElement('div');
  toast.className = 'portal-toast portal-toast-' + type;

  var icons = {
    success: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>',
    error: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    info: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
    warning: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>'
  };
  toast.innerHTML = (icons[type] || icons.info) + '<span>' + message + '</span>';
  wrap.appendChild(toast);
  setTimeout(function() {
    toast.classList.add('portal-toast-dismiss');
    setTimeout(function() { toast.remove(); }, 300);
  }, 3500);
}

// --- Notification bell ---
function portalToggleNotif() {
  var panel = document.getElementById('portal-notif-panel');
  if (panel) panel.classList.toggle('portal-notif-open');
}

function markAllRead() {
  document.querySelectorAll('.portal-notif-item-unread').forEach(function(item) {
    item.classList.remove('portal-notif-item-unread');
  });
  var badge = document.getElementById('portal-notif-badge');
  if (badge) badge.style.display = 'none';
  showToast('All notifications marked as read', 'info');
}

// Close notification panel on outside click
document.addEventListener('click', function(e) {
  var wrap = document.querySelector('.portal-notif-wrap');
  var panel = document.getElementById('portal-notif-panel');
  if (wrap && panel && !wrap.contains(e.target)) {
    panel.classList.remove('portal-notif-open');
  }
});

// --- Portal-wide search ---
function portalGlobalSearch(q) {
  var results = document.getElementById('portal-search-results');
  if (!results) return;
  q = q.toLowerCase().trim();
  if (q.length < 2) { results.classList.remove('portal-sr-open'); return; }

  var html = '';
  var found = false;

  // Search referrals
  var refMatches = [];
  document.querySelectorAll('.ref-row .ref-name').forEach(function(el) {
    if (el.textContent.toLowerCase().indexOf(q) !== -1) {
      refMatches.push(el.textContent);
    }
  });
  if (refMatches.length) {
    found = true;
    html += '<div class="portal-sr-group">Referrals</div>';
    refMatches.forEach(function(name) {
      html += '<div class="portal-sr-item" onclick="portalNav(document.querySelector(\'[onclick*=portal-sec-referrals]\'),\'portal-sec-referrals\');document.getElementById(\'portal-search-results\').classList.remove(\'portal-sr-open\')">' + name + '</div>';
    });
  }

  // Search documents
  var docMatches = [];
  document.querySelectorAll('.doc-td-name span').forEach(function(el) {
    if (el.textContent.toLowerCase().indexOf(q) !== -1) {
      docMatches.push(el.textContent);
    }
  });
  if (docMatches.length) {
    found = true;
    html += '<div class="portal-sr-group">Documents</div>';
    docMatches.forEach(function(name) {
      html += '<div class="portal-sr-item" onclick="portalNav(document.querySelector(\'[onclick*=portal-sec-documents]\'),\'portal-sec-documents\');document.getElementById(\'portal-search-results\').classList.remove(\'portal-sr-open\')">' + name + '</div>';
    });
  }

  // Search tickets
  var ticketMatches = [];
  document.querySelectorAll('.sup-ticket-subject').forEach(function(el) {
    if (el.textContent.toLowerCase().indexOf(q) !== -1) {
      ticketMatches.push(el.textContent);
    }
  });
  if (ticketMatches.length) {
    found = true;
    html += '<div class="portal-sr-group">Support Tickets</div>';
    ticketMatches.forEach(function(name) {
      html += '<div class="portal-sr-item" onclick="portalNav(document.querySelector(\'[onclick*=portal-sec-support]\'),\'portal-sec-support\');document.getElementById(\'portal-search-results\').classList.remove(\'portal-sr-open\')">' + name + '</div>';
    });
  }

  // Search webinars
  var ceMatches = [];
  document.querySelectorAll('.ce-title').forEach(function(el) {
    if (el.textContent.toLowerCase().indexOf(q) !== -1) {
      ceMatches.push(el.textContent);
    }
  });
  if (ceMatches.length) {
    found = true;
    html += '<div class="portal-sr-group">CE Webinars</div>';
    ceMatches.forEach(function(name) {
      html += '<div class="portal-sr-item" onclick="portalNav(document.querySelector(\'[onclick*=portal-sec-ce]\'),\'portal-sec-ce\');document.getElementById(\'portal-search-results\').classList.remove(\'portal-sr-open\')">' + name + '</div>';
    });
  }

  if (!found) {
    html = '<div class="portal-sr-empty">No results found for "' + q + '"</div>';
  }

  results.innerHTML = html;
  results.classList.add('portal-sr-open');
}

// Close search results on outside click
document.addEventListener('click', function(e) {
  var wrap = document.querySelector('.portal-search-wrap');
  var results = document.getElementById('portal-search-results');
  if (wrap && results && !wrap.contains(e.target)) {
    results.classList.remove('portal-sr-open');
  }
});

// --- Mobile bottom nav ---
var mobNavMap = {
  'portal-sec-dashboard': 'portal-sec-dashboard',
  'portal-sec-referrals': 'portal-sec-referrals',
  'portal-sec-submit': 'portal-sec-submit',
  'portal-sec-earnings': 'portal-sec-earnings',
  'portal-sec-payouts': 'portal-sec-earnings'
};

function mobNavSync(secId) {
  var mapped = mobNavMap[secId] || '';
  document.querySelectorAll('.mob-bnav-tab').forEach(function(tab) {
    var isActive = tab.getAttribute('data-mob-sec') === mapped;
    tab.classList.toggle('mob-bnav-tab-active', isActive);
  });
}

function mobNavTap(tab, secId) {
  var sidebarLink = document.querySelector('.portal-nav-item[onclick*="' + secId + '"]');
  if (sidebarLink) {
    portalNav(sidebarLink, secId);
  }
}

// --- Mobile money hero ---
function initMobMoneyHero() {
  var hero = document.getElementById('mob-money-hero');
  if (!hero) return;
  hero.querySelectorAll('[data-count-to]').forEach(function(el) {
    var target = parseInt(el.getAttribute('data-count-to'), 10);
    var duration = 1200;
    var start = 0;
    var startTime = null;
    function animate(ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(animate);
      else el.textContent = target.toLocaleString();
    }
    requestAnimationFrame(animate);
  });
}
if (window.matchMedia('(max-width:768px)').matches) {
  document.addEventListener('DOMContentLoaded', initMobMoneyHero);
}
