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
  // Move fixed-position widgets (RP card, jazz bar) to body so CSS
  // transforms on the page container don't break position:fixed
  if (id === 'portal') {
    ['rp-card', 'rp-fab', 'jazz-bar'].forEach(function(elId) {
      var el = document.getElementById(elId);
      if (el && el.parentElement !== document.body) {
        document.body.appendChild(el);
      }
    });
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
  // Initialize collapsible playbook cards, streak tracker, and seasonal content
  if (id === 'portal') {
    setTimeout(pbInitCollapsible, 100);
    setTimeout(pbInitStreak, 100);
    setTimeout(pbApplySeasonal, 120);
    setTimeout(pbInitQuiz, 120);
  }
  // Start guided tour spotlight walkthrough on portal load
  if (id === 'portal' && typeof tourStart === 'function') {
    setTimeout(tourStart, 500);
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
    // Init ratings on conversations panel
    pbInitRatings(target);
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

// ── PLAYBOOK SCENARIO QUIZ ──────────────────────────────────
var PB_QUIZ_DATA = [
  {
    scenario: 'A long-time client mentions during your meeting: "I got a notice from the IRS saying I owe $12,000 but I think it is wrong."',
    options: [
      { text: '"Don\'t worry about it, those notices are often wrong."', correct: false },
      { text: '"Can I see that notice? Depending on what it says, I have a partner team that specializes in resolving these -- often for much less than the full amount."', correct: true },
      { text: '"You should call the IRS and dispute it."', correct: false }
    ],
    explanation: 'The best response shows concern, asks to see the notice (builds trust), and introduces your resolution partner naturally. Dismissing it or sending them to the IRS alone means you lose the referral opportunity.'
  },
  {
    scenario: 'You are preparing a return and discover your client owes $8,400. They look worried when you tell them the number.',
    options: [
      { text: '"I can set up a payment plan on this return for you."', correct: false },
      { text: '"I want to make sure you have a plan for this balance. If it is hard to pay right now, I work with a tax resolution team that can negotiate with the IRS on your behalf."', correct: true },
      { text: '"You will need to pay this by April 15th to avoid penalties."', correct: false }
    ],
    explanation: 'Acknowledge the anxiety and immediately offer a solution path. Setting up a basic payment plan limits the options, and stating the deadline adds pressure without offering help.'
  },
  {
    scenario: 'A divorce attorney you know asks: "Do you ever see clients with tax problems? I have a client going through a divorce with a huge tax bill from a joint return."',
    options: [
      { text: '"Yes, send them my way and I will take a look at their return."', correct: false },
      { text: '"Absolutely. I partner with a tax resolution team that handles exactly this -- joint tax liability from divorce. I can connect your client for a free evaluation. Want me to send you my referral link?"', correct: true },
      { text: '"Tax debt from divorce is complicated. They should talk to a tax attorney."', correct: false }
    ],
    explanation: 'This is a referral network opportunity. The best answer positions you as a connector with a specific solution, and asks for the next step. Deflecting to a tax attorney sends the referral elsewhere.'
  },
  {
    scenario: 'A client who has not filed taxes in 3 years finally comes back to get caught up. After filing, they owe $22,000 across all three years.',
    options: [
      { text: '"Let me introduce you to a team that negotiates with the IRS every day. They can often set up manageable payments or even reduce the total. Want me to connect you?"', correct: true },
      { text: '"You need to pay this as soon as possible or the IRS will put a lien on your property."', correct: false },
      { text: '"I can help you set up an installment agreement on the IRS website."', correct: false }
    ],
    explanation: 'Multiple years of unfiled returns with $22K owed is a perfect resolution case. Scaring them about liens creates panic, and a DIY installment agreement leaves money on the table. Your resolution partner can explore OIC, penalty abatement, and other options.'
  },
  {
    scenario: 'During a year-end planning meeting, your client casually says: "Oh, I also still owe from 2022 but I have been ignoring it."',
    options: [
      { text: '"How much do you owe? Before we plan for next year, let me connect you with a team that resolves these. Ignoring it only makes it worse with penalties compounding."', correct: true },
      { text: '"You should really address that. The IRS charges interest and penalties."', correct: false },
      { text: '"Let us focus on this year first and we can deal with that later."', correct: false }
    ],
    explanation: 'The client just admitted they are avoiding a tax debt problem. The best response quantifies it, creates urgency without fear, and offers your resolution partner as the solution. Pushing it to "later" means they will keep ignoring it.'
  }
];

function pbInitQuiz() {
  var body = document.getElementById('pb-quiz-body');
  if (!body || body.innerHTML.trim() !== '') return;

  var saved = pbLoadQuizState();
  window._pbQuizIndex = saved.index || 0;
  window._pbQuizCorrect = saved.correct || 0;
  window._pbQuizTotal = saved.total || 0;

  pbRenderQuizQuestion();
}

function pbLoadQuizState() {
  try {
    var raw = localStorage.getItem('pb_quiz_state');
    return raw ? JSON.parse(raw) : {};
  } catch (e) { return {}; }
}

function pbSaveQuizState() {
  try {
    localStorage.setItem('pb_quiz_state', JSON.stringify({
      index: window._pbQuizIndex,
      correct: window._pbQuizCorrect,
      total: window._pbQuizTotal
    }));
  } catch (e) { /* ignore */ }
}

function pbRenderQuizQuestion() {
  var body = document.getElementById('pb-quiz-body');
  var scoreEl = document.getElementById('pb-quiz-score');
  if (!body) return;

  var idx = window._pbQuizIndex % PB_QUIZ_DATA.length;
  var q = PB_QUIZ_DATA[idx];

  var html = '<div class="pb-quiz-scenario">' + q.scenario + '</div>';
  html += '<div class="pb-quiz-options">';
  q.options.forEach(function(opt, i) {
    html += '<button class="pb-quiz-option" onclick="pbAnswerQuiz(' + i + ',' + (opt.correct ? 'true' : 'false') + ')">' + opt.text + '</button>';
  });
  html += '</div>';

  body.innerHTML = html;

  if (scoreEl && window._pbQuizTotal > 0) {
    scoreEl.textContent = window._pbQuizCorrect + '/' + window._pbQuizTotal + ' correct';
  }
}

function pbAnswerQuiz(optIndex, isCorrect) {
  var body = document.getElementById('pb-quiz-body');
  if (!body) return;

  var idx = window._pbQuizIndex % PB_QUIZ_DATA.length;
  var q = PB_QUIZ_DATA[idx];

  window._pbQuizTotal++;
  if (isCorrect) window._pbQuizCorrect++;
  pbSaveQuizState();

  // Highlight answers
  var options = body.querySelectorAll('.pb-quiz-option');
  options.forEach(function(opt, i) {
    opt.disabled = true;
    opt.classList.add('pb-quiz-disabled');
    if (q.options[i].correct) {
      opt.classList.add('pb-quiz-correct');
    } else if (i === optIndex && !isCorrect) {
      opt.classList.add('pb-quiz-wrong');
    }
  });

  // Show explanation and next button
  var explain = document.createElement('div');
  explain.className = 'pb-quiz-explain';
  explain.innerHTML = '<strong>' + (isCorrect ? 'Correct!' : 'Not quite.') + '</strong> ' + q.explanation;
  body.appendChild(explain);

  var next = document.createElement('button');
  next.className = 'pb-quiz-next';
  next.textContent = 'Next Scenario';
  next.onclick = function() {
    window._pbQuizIndex++;
    pbSaveQuizState();
    pbRenderQuizQuestion();
  };
  body.appendChild(next);

  // Update score
  var scoreEl = document.getElementById('pb-quiz-score');
  if (scoreEl) scoreEl.textContent = window._pbQuizCorrect + '/' + window._pbQuizTotal + ' correct';
}

// ── PLAYBOOK SEASONAL CONTENT ───────────────────────────────
function pbApplySeasonal() {
  var season = typeof bpGetSeason === 'function' ? bpGetSeason() : 'fall';

  // Seasonal banner text
  var bannerMap = {
    'tax-season': 'Tax season is here -- clients are more receptive to tax debt conversations right now. Focus on the "Starting the Conversation" scripts.',
    'post-season': 'Post-season is ideal for follow-ups. Clients who filed extensions or had balances are ready to hear from you.',
    'year-end': 'Year-end planning meetings are perfect for surfacing old tax issues. Lead with the "Building a Referral Network" tab.',
    'fall': 'Fall is prime time to build your referral pipeline before tax season hits.'
  };

  // Insert seasonal tip if not already present
  var stats = document.querySelector('.pb-stats');
  if (stats && !document.getElementById('pb-seasonal-tip')) {
    var tip = document.createElement('div');
    tip.id = 'pb-seasonal-tip';
    tip.className = 'pb-seasonal-tip';
    tip.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> <span>' + (bannerMap[season] || bannerMap['fall']) + '</span>';
    stats.parentNode.insertBefore(tip, stats.nextSibling);
  }
}

// ── PLAYBOOK WIN TRACKER ────────────────────────────────────
function pbInitStreak() {
  var data = pbLoadStreak();
  var goalEl = document.getElementById('pb-streak-goal');
  if (goalEl && data.goal) goalEl.value = data.goal;
  pbRenderStreak(data);
}

function pbLoadStreak() {
  try {
    var raw = localStorage.getItem('pb_streak');
    if (!raw) return { count: 0, goal: 5, month: new Date().getMonth() };
    var data = JSON.parse(raw);
    // Reset if month has changed
    if (data.month !== new Date().getMonth()) {
      return { count: 0, goal: data.goal || 5, month: new Date().getMonth() };
    }
    return data;
  } catch (e) {
    return { count: 0, goal: 5, month: new Date().getMonth() };
  }
}

function pbSaveStreak(data) {
  try {
    localStorage.setItem('pb_streak', JSON.stringify(data));
  } catch (e) { /* ignore */ }
}

function pbUpdateStreak() {
  var data = pbLoadStreak();
  var goalEl = document.getElementById('pb-streak-goal');
  if (goalEl) data.goal = parseInt(goalEl.value) || 5;
  pbSaveStreak(data);
  pbRenderStreak(data);
}

function pbAddReferral() {
  var data = pbLoadStreak();
  data.count = (data.count || 0) + 1;
  data.month = new Date().getMonth();
  pbSaveStreak(data);
  pbRenderStreak(data);
  if (typeof showToast === 'function') {
    showToast('Referral logged! Keep it up.', 'success');
  }
}

function pbRenderStreak(data) {
  var count = data.count || 0;
  var goal = data.goal || 5;
  var pct = Math.min(Math.round((count / goal) * 100), 100);

  var countEl = document.getElementById('pb-streak-count');
  var goalText = document.getElementById('pb-streak-goal-text');
  var fillEl = document.getElementById('pb-streak-fill');
  var pctEl = document.getElementById('pb-streak-pct');

  if (countEl) countEl.textContent = count;
  if (goalText) {
    if (count >= goal) {
      goalText.textContent = 'goal reached!';
    } else {
      goalText.textContent = (goal - count) + ' to go this month';
    }
  }
  if (fillEl) fillEl.style.width = pct + '%';
  if (pctEl) pctEl.textContent = pct + '%';
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

// ── PLAYBOOK SCRIPT RATING ──────────────────────────────────
function pbInitRatings(container) {
  if (!container) return;
  container.querySelectorAll('.pb-script').forEach(function(script, i) {
    if (script.querySelector('.pb-rate-bar')) return;
    var id = 'pb-script-' + i;
    var ratings = pbLoadRatings();
    var current = ratings[id] || null;

    var bar = document.createElement('div');
    bar.className = 'pb-rate-bar';
    bar.innerHTML = '<span class="pb-rate-label">Was this helpful?</span>' +
      '<button class="pb-rate-btn pb-rate-up' + (current === 'up' ? ' pb-rated' : '') + '" data-id="' + id + '" data-dir="up" title="Helpful">' +
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="' + (current === 'up' ? 'currentColor' : 'none') + '" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z"/><path d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"/></svg></button>' +
      '<button class="pb-rate-btn pb-rate-down' + (current === 'down' ? ' pb-rated' : '') + '" data-id="' + id + '" data-dir="down" title="Not helpful">' +
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="' + (current === 'down' ? 'currentColor' : 'none') + '" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3H10z"/><path d="M17 2h2.67A2.31 2.31 0 0122 4v7a2.31 2.31 0 01-2.33 2H17"/></svg></button>';

    bar.querySelectorAll('.pb-rate-btn').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        pbRateScript(btn.getAttribute('data-id'), btn.getAttribute('data-dir'), bar);
      });
    });

    var body = script.querySelector('.pb-script-body');
    if (body) body.appendChild(bar);
  });
}

function pbLoadRatings() {
  try {
    var raw = localStorage.getItem('pb_script_ratings');
    return raw ? JSON.parse(raw) : {};
  } catch (e) { return {}; }
}

function pbRateScript(id, dir, bar) {
  var ratings = pbLoadRatings();
  // Toggle: if already rated the same, remove it
  if (ratings[id] === dir) {
    delete ratings[id];
  } else {
    ratings[id] = dir;
  }
  try { localStorage.setItem('pb_script_ratings', JSON.stringify(ratings)); } catch (e) { /* ignore */ }

  // Update UI
  var upBtn = bar.querySelector('.pb-rate-up');
  var downBtn = bar.querySelector('.pb-rate-down');
  var current = ratings[id] || null;

  if (upBtn) {
    upBtn.classList.toggle('pb-rated', current === 'up');
    upBtn.querySelector('svg').setAttribute('fill', current === 'up' ? 'currentColor' : 'none');
  }
  if (downBtn) {
    downBtn.classList.toggle('pb-rated', current === 'down');
    downBtn.querySelector('svg').setAttribute('fill', current === 'down' ? 'currentColor' : 'none');
  }
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
