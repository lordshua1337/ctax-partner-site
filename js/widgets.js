var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

(function(){
  var ro=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in-view');ro.unobserve(e.target);}});},{threshold:0.12});
  var rv=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('visible');rv.unobserve(e.target);}});},{threshold:0.1,rootMargin:'0px 0px -40px 0px'});
  function initReveal(){
    var h=document.getElementById('page-home');if(!h)return;
    // Handle .scroll-reveal (adds .in-view)
    h.querySelectorAll('.scroll-reveal').forEach(function(el){el.classList.remove('in-view');ro.observe(el);});
    // Handle .reveal (adds .visible)
    h.querySelectorAll('.reveal').forEach(function(el){el.classList.remove('visible');rv.observe(el);});
  }
  window.initReveal=initReveal;
  window.revealInView=function(el){if(el){el.querySelectorAll('.scroll-reveal').forEach(function(s){ro.observe(s);});el.querySelectorAll('.reveal').forEach(function(s){rv.observe(s);});}};
  function animCount(el){
    var tgt=parseFloat(el.getAttribute('data-target'));
    var pre=el.getAttribute('data-prefix')||'',suf=el.getAttribute('data-suffix')||'';
    var isF=(tgt%1!==0),dur=1800,t0=null;
    if(prefersReducedMotion){el.textContent=pre+(isF?tgt.toFixed(1):Math.floor(tgt))+suf;return;}
    el.classList.add('counting');
    function step(ts){
      if(!t0)t0=ts;
      var p=Math.min((ts-t0)/dur,1),ease=p===1?1:1-Math.pow(2,-10*p),cur=ease*tgt;
      el.textContent=pre+(isF?cur.toFixed(1):Math.floor(cur))+suf;
      if(p<1)requestAnimationFrame(step);
      else{el.textContent=pre+(isF?tgt.toFixed(1):Math.floor(tgt))+suf;el.classList.remove('counting');}
    }
    requestAnimationFrame(step);
  }
  var co=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting){animCount(e.target);co.unobserve(e.target);}});},{threshold:0.5});
  function initScrollCounters(){document.querySelectorAll('#page-home .counter').forEach(function(el){co.observe(el);});}
  function fireHeroCounters(){document.querySelectorAll('#page-home .hero-counter').forEach(function(el){el.textContent=(el.getAttribute('data-prefix')||'')+'0'+(el.getAttribute('data-suffix')||'');animCount(el);});}


  // Lock opacity after hero entrance animations complete so theme toggle can't reset them
  function lockHeroOpacity(){
    ['.h-title','.h-sub','.h-cta-row','.h-stats'].forEach(function(sel){
      var el=document.querySelector(sel);
      if(el){
        el.addEventListener('animationend',function handler(){
          el.style.opacity='1';
          el.removeEventListener('animationend',handler);
        });
      }
    });
  }

  window.addEventListener('load',function(){initReveal();initScrollCounters();setTimeout(fireHeroCounters,2300);lockHeroOpacity();});
  var _orig=window.showPage;
  window.showPage=function(id){
    _orig(id);
    if(id==='home'){
      // Reset hero text animations on revisit
      ['.h-badge','.h-title','.h-sub','.h-cta-row','.h-stats'].forEach(function(sel){
        var el=document.querySelector(sel);if(!el)return;
        el.style.opacity='';el.style.animation='none';el.offsetHeight;el.style.animation='';
      });
      lockHeroOpacity();
      setTimeout(function(){initReveal();document.querySelectorAll('#page-home .counter').forEach(function(el){var p=el.getAttribute('data-prefix')||'';el.textContent=p+'0';co.observe(el);});},80);
      setTimeout(fireHeroCounters,2380);
    }
    if(id==='how'){setTimeout(initHowAnimations,60);}
  };
})();


// ── YTD REFERRAL PAYMENTS COUNTER ──────────────────────────────────────
(function(){
  var BASE_AMOUNT = 936722;
  var currentAmount = 0;
  var dripTimer = null;
  var paused = false;
  var animating = false;
  var digitSlots = [];

  function formatDollars(n){
    return '$' + Math.floor(n).toLocaleString('en-US');
  }

  function randInt(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function isHomePage(){
    var home = document.getElementById('page-home');
    return home && home.classList.contains('active');
  }

  // -- Odometer: build digit slot elements from a formatted string --
  function buildOdometer(){
    var el = document.getElementById('ytd-amount');
    if(!el) return;
    var formatted = formatDollars(currentAmount);
    el.innerHTML = '';
    digitSlots = [];

    for(var i = 0; i < formatted.length; i++){
      var ch = formatted[i];
      if(ch >= '0' && ch <= '9'){
        var slot = document.createElement('span');
        slot.className = 'ytd-slot';
        var strip = document.createElement('span');
        strip.className = 'ytd-strip';
        for(var d = 0; d <= 9; d++){
          var digitSpan = document.createElement('span');
          digitSpan.textContent = String(d);
          strip.appendChild(digitSpan);
        }
        var n = parseInt(ch, 10);
        strip.style.transform = 'translateY(' + (-n) + 'em)';
        slot.appendChild(strip);
        el.appendChild(slot);
        digitSlots.push({ strip: strip, value: n, isDigit: true });
      } else {
        var staticEl = document.createElement('span');
        staticEl.className = 'ytd-static';
        staticEl.textContent = ch;
        el.appendChild(staticEl);
        digitSlots.push({ isDigit: false });
      }
    }
  }

  // -- Odometer: update digit positions for a new value --
  function updateOdometer(newValue){
    var el = document.getElementById('ytd-amount');
    if(!el) return;
    var oldFormatted = formatDollars(currentAmount);
    var newFormatted = formatDollars(newValue);

    // If string length changed (e.g. crossed $1M), rebuild from scratch
    if(newFormatted.length !== oldFormatted.length){
      currentAmount = newValue;
      buildOdometer();
      return;
    }

    // Animate individual digits that changed
    for(var i = 0; i < newFormatted.length; i++){
      var ch = newFormatted[i];
      var slotData = digitSlots[i];
      if(ch >= '0' && ch <= '9' && slotData && slotData.isDigit){
        var n = parseInt(ch, 10);
        if(n !== slotData.value){
          slotData.strip.style.transform = 'translateY(' + (-n) + 'em)';
          slotData.value = n;
        }
      }
    }
    currentAmount = newValue;
  }

  // -- Bump flash: show "+$N" next to the amount --
  function showBump(amount){
    var bumpEl = document.getElementById('ytd-bump');
    if(!bumpEl) return;
    bumpEl.textContent = '+$' + amount;
    bumpEl.classList.remove('ytd-bump-show');
    void bumpEl.offsetHeight;
    bumpEl.classList.add('ytd-bump-show');

    // Pulse the live dot brighter
    var dot = document.querySelector('.ytd-live');
    if(dot){
      dot.classList.add('ytd-live-flash');
      setTimeout(function(){ dot.classList.remove('ytd-live-flash'); }, 600);
    }
  }

  // -- Text-based count-up (used only for initial animation) --
  function animateValue(from, to, duration, onDone){
    var el = document.getElementById('ytd-amount');
    if(!el) return;
    animating = true;
    var t0 = null;
    function step(ts){
      if(!t0) t0 = ts;
      var p = Math.min((ts - t0) / duration, 1);
      var ease = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      var cur = from + (to - from) * ease;
      el.textContent = formatDollars(cur);
      if(p < 1){
        requestAnimationFrame(step);
      } else {
        el.textContent = formatDollars(to);
        animating = false;
        if(onDone) onDone();
      }
    }
    requestAnimationFrame(step);
  }

  // -- Drip: schedule and execute random increments --
  function scheduleDrip(){
    if(dripTimer) clearTimeout(dripTimer);
    if(paused) return;
    var delay = randInt(3000, 8000);
    dripTimer = setTimeout(doDrip, delay);
  }

  function doDrip(){
    if(!isHomePage() || paused){ scheduleDrip(); return; }
    if(animating){ scheduleDrip(); return; }

    var increment = randInt(12, 247);
    var newAmount = currentAmount + increment;

    showBump(increment);
    updateOdometer(newAmount);
    scheduleDrip();
  }

  // -- Show/hide the bar --
  function showCounter(){
    var counter = document.getElementById('ytd-counter');
    if(!counter) return;
    if(!isHomePage()){
      counter.classList.remove('ytd-visible');
      return;
    }
    counter.classList.add('ytd-visible');
  }

  // -- Init: text count-up, then switch to odometer for drips --
  function initCounter(){
    var el = document.getElementById('ytd-amount');
    if(!el) return;
    showCounter();

    if(prefersReducedMotion){
      currentAmount = BASE_AMOUNT;
      el.textContent = formatDollars(BASE_AMOUNT);
      buildOdometer();
      scheduleDrip();
    } else {
      animateValue(0, BASE_AMOUNT, 1800, function(){
        currentAmount = BASE_AMOUNT;
        buildOdometer();
        scheduleDrip();
      });
    }
  }

  // -- Pause/resume on tab visibility --
  document.addEventListener('visibilitychange', function(){
    if(document.hidden){
      paused = true;
      if(dripTimer){ clearTimeout(dripTimer); dripTimer = null; }
    } else {
      paused = false;
      if(!animating) scheduleDrip();
    }
  });

  // -- Show/hide on page navigation --
  var _origShowPage = window.showPage;
  window.showPage = function(id){
    _origShowPage(id);
    var counter = document.getElementById('ytd-counter');
    if(!counter) return;
    if(id === 'home'){
      counter.classList.add('ytd-visible');
      if(!animating && !dripTimer) scheduleDrip();
    } else {
      counter.classList.remove('ytd-visible');
      if(dripTimer){ clearTimeout(dripTimer); dripTimer = null; }
    }
  };

  setTimeout(initCounter, 2000);
})();

// ── COOKIE CONSENT ──────────────────────────────────────
function acceptCookies(){
  localStorage.setItem('ctax_cookies_accepted','1');
  var el = document.getElementById('cookie-consent');
  if(!el) return;
  el.classList.add('cc-exit');
  el.addEventListener('animationend', function(){ el.classList.remove('cc-visible','cc-exit'); });
}
(function(){
  if(!localStorage.getItem('ctax_cookies_accepted')){
    setTimeout(function(){
      var el = document.getElementById('cookie-consent');
      if(el) el.classList.add('cc-visible');
    }, 3000);
  }
})();

// ── CHAT WIDGET ──────────────────────────────────────
function toggleChat(){
  var bubble = document.getElementById('chat-bubble');
  var iconMsg = document.getElementById('chat-icon-msg');
  var iconX = document.getElementById('chat-icon-x');
  if(!bubble) return;
  var open = bubble.style.display === 'block';
  bubble.style.display = open ? 'none' : 'block';
  if(iconMsg) iconMsg.style.display = open ? 'block' : 'none';
  if(iconX) iconX.style.display = open ? 'none' : 'block';
}

// ── NOTIFICATIONS ──────────────────────────────────
function toggleNotifPanel(evt){
  var panels = document.querySelectorAll('.notif-panel');
  var btn = evt ? evt.currentTarget : null;
  var wrap = btn ? btn.closest('.notif-wrap') : null;
  var target = wrap ? wrap.querySelector('.notif-panel') : null;
  panels.forEach(function(p){ if(p !== target) p.classList.remove('active'); });
  if(target) target.classList.toggle('active');
}
(function(){
  document.addEventListener('click', function(e){
    if(!e.target.closest('.notif-wrap')){
      document.querySelectorAll('.notif-panel').forEach(function(p){ p.classList.remove('active'); });
    }
  });
})();

// ── DARK MODE ──────────────────────────────────────
function toggleDarkMode(){
  var current = document.documentElement.getAttribute('data-theme');
  var next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('ctax_theme', next);
  var btn = document.getElementById('dark-mode-icon');
  if(btn) btn.textContent = next === 'dark' ? '\u2600' : '\u263E';
  // Preserve hero text visibility — animation fill-mode can reset on theme change
  var homePage = document.getElementById('page-home');
  if(homePage && homePage.classList.contains('active')){
    ['.h-title','.h-sub','.h-cta-row','.h-stats'].forEach(function(sel){
      var el = document.querySelector(sel);
      if(el) el.style.opacity = '1';
    });
  }
}
(function(){
  var saved = localStorage.getItem('ctax_theme');
  if(saved === 'dark'){
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();

// ── TIER TOGGLE ──────────────────────────────────────
// Cycles through: enterprise (default/blue) → direct (fire) → strategic (emerald)
var TIER_ORDER = ['enterprise', 'direct', 'strategic'];
var TIER_CONFIG = {
  enterprise: { icon: 'E', badge: 'ENTERPRISE PARTNERS', title: 'Community Tax Partners \u2014 Enterprise Partners', copy: null, actions: null },
  direct:     { icon: 'D', badge: 'DIRECT PARTNERS', title: 'Community Tax Partners \u2014 Direct Partners', copy: {
    // Hero
    'hero-h1-1': 'Turn Tax Problems',
    'hero-h1-2': 'Extra Income.',
    'hero-sub': 'Your clients already trust you. When they owe the IRS, send them our way \u2014 we handle everything and you earn a referral fee. No extra staff, no extra work.',
    'hero-cta1': 'Start Earning Today',
    'hero-cta2': 'See How It Works',
    // Partnership Model
    'pship-heading': 'You run your business.<br>We handle the IRS.',
    'pship-keep1': 'Your client relationship',
    'pship-keep2': 'Your reputation',
    'pship-keep3': 'Your tax prep income',
    'pship-keep4': 'Their trust in you',
    'pship-provide1': 'IRS representation',
    'pship-provide2': 'The heavy lifting',
    'pship-provide3': 'Your referral check',
    'pship-provide4': 'Peace of mind',
    'pship-quote': '\u201CYou spotted the problem. We fix it. You get paid.\u201D',
    // Flip Cards
    'flip1-title': 'The Problem',
    'flip1-body': 'A client sits down and owes the IRS. You can\u2019t help them \u2014 and they don\u2019t come back. You lose the return, the relationship, and the referral.',
    'flip2-title': 'The Fix',
    'flip2-body': 'We take it from here. Licensed tax pros negotiate with the IRS, settle the debt, and get your client back on track \u2014 while you stay their go-to person.',
    'flip3-title': 'The Payoff',
    'flip3-body': 'Keep the client. Finish the return. Earn a referral fee. No extra work, no extra risk.',
    // Testimonials
    'testi-heading': 'What preparers are saying.',
    'testi1-quote': 'I was skeptical at first \u2014 another referral program, right? But my first client got their $47K debt settled in two months. I got a check and the client still comes back to me every year.',
    'testi1-avatar': 'TN',
    'testi1-name': 'T. Nguyen',
    'testi1-role': 'Tax Preparer \u00B7 Solo Practice \u00B7 CA',
    'testi1-stat': 'First referral settled in under 2 months',
    'testi2-quote': 'I used to tell clients \u201Csorry, can\u2019t help you with that.\u201D Now I say \u201CI know exactly who to call.\u201D It\u2019s a better look and I make money doing it.',
    'testi2-avatar': 'DJ',
    'testi2-name': 'D. Jackson',
    'testi2-role': 'Enrolled Agent \u00B7 200 Returns/Year \u00B7 GA',
    'testi2-stat': 'Turning away fewer clients with tax debt',
    'testi3-quote': 'My clients are regular people \u2014 they\u2019re scared of the IRS. Being able to hand them off to a real team that actually fixes it? That\u2019s the best thing I\u2019ve added to my practice in years.',
    'testi3-avatar': 'SM',
    'testi3-name': 'S. Martinez',
    'testi3-role': 'Tax Preparer \u00B7 Family Practice \u00B7 AZ',
    'testi3-stat': 'Clients trust the referral and come back',
    // Explore Cards
    'explore1-desc': 'Why thousands of tax preparers are adding resolution referrals to their practice.',
    'explore2-desc': 'Tax preparers, enrolled agents, and small firms like yours.',
    'explore3-desc': 'See what Direct partners get \u2014 and how to level up.',
    'explore4-desc': 'Quick answers to the questions every new partner asks.',
    // Footer
    'footer-tag': 'Built for tax preparers who want to help more clients and earn more \u2014 without doing more.'
  }, actions: null },
  strategic:  { icon: 'S', badge: 'STRATEGIC PARTNERS', title: 'Community Tax Partners \u2014 Strategic Partners', copy: {
    // Hero
    'hero-h1-1': 'Turn Tax Debt',
    'hero-h1-2': 'a Revenue Line.',
    'hero-sub': 'Add a new revenue stream without adding headcount. Community Tax resolves your clients\u2019 IRS debt while you retain the relationship and earn revenue share at scale.',
    'hero-cta1': 'Schedule a Call',
    'hero-cta2': 'View the ROI',
    // Partnership Model
    'pship-heading': 'You keep the relationship.<br>We deliver the resolution.',
    'pship-keep1': 'Client ownership at scale',
    'pship-keep2': 'Your brand and positioning',
    'pship-keep3': 'Existing revenue streams',
    'pship-keep4': 'Strategic account control',
    'pship-provide1': 'Licensed IRS representation',
    'pship-provide2': 'Full-service resolution ops',
    'pship-provide3': 'Revenue share at volume',
    'pship-provide4': 'End-to-end case execution',
    'pship-quote': '\u201CYour network. Our infrastructure. Shared upside.\u201D',
    // Flip Cards
    'flip1-title': 'The Gap',
    'flip1-body': 'IRS liabilities stall deals, block closings, and create churn. Without a resolution path, your team loses the client and the revenue attached to them.',
    'flip2-title': 'The Solution',
    'flip2-body': 'Community Tax plugs into your existing workflow. We resolve the debt, you retain the client, and both sides generate revenue. No new hires, no new ops.',
    'flip3-title': 'The Result',
    'flip3-body': 'Retain the account. Unlock new revenue per client. Scale without adding overhead or operational complexity.',
    // Testimonials
    'testi-heading': 'What leaders are saying.',
    'testi1-quote': 'We evaluated three resolution partners before choosing Community Tax. The difference was execution speed and reporting transparency. Our team was fully integrated within two weeks.',
    'testi1-avatar': 'RK',
    'testi1-name': 'R. Kapoor',
    'testi1-role': 'COO \u00B7 Regional Accounting Network \u00B7 Northeast',
    'testi1-stat': 'Fully integrated in under 2 weeks',
    'testi2-quote': 'The partner program created a net-new revenue category for us. We projected $200K annually \u2014 we hit that in seven months with zero incremental headcount.',
    'testi2-avatar': 'LO',
    'testi2-name': 'L. Okafor',
    'testi2-role': 'VP Partnerships \u00B7 Lending Platform',
    'testi2-stat': 'Hit $200K target in 7 months',
    'testi3-quote': 'We needed a white-label resolution capability without building it internally. Community Tax gave us that \u2014 branded to our firm, managed on their end, revenue flowing to ours.',
    'testi3-avatar': 'CW',
    'testi3-name': 'C. Whitfield',
    'testi3-role': 'Managing Director \u00B7 Wealth Advisory \u00B7 Strategic Tier',
    'testi3-stat': 'White-label resolution without internal build',
    // Explore Cards
    'explore1-desc': 'The business case for a resolution partnership at scale.',
    'explore2-desc': 'Enterprise platforms, advisory networks, and firms with high-volume client bases.',
    'explore3-desc': 'Compare tiers and understand the Strategic advantage.',
    'explore4-desc': 'Compliance, structure, and integration details for your team.',
    // Footer
    'footer-tag': 'Built for organizations that want scalable tax resolution revenue \u2014 without building the operation.'
  }, actions: {
    'hero-cta2': function(){
      showPage('tiers');
      setTimeout(function(){
        var el = document.getElementById('tiers-calculator');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        if (typeof selectTier === 'function') selectTier(3);
      }, 300);
    }
  }}
};

function cycleTier() {
  var current = document.documentElement.getAttribute('data-tier') || 'enterprise';
  var idx = TIER_ORDER.indexOf(current);
  var next = TIER_ORDER[(idx + 1) % TIER_ORDER.length];

  if (next === 'enterprise') {
    document.documentElement.removeAttribute('data-tier');
  } else {
    document.documentElement.setAttribute('data-tier', next);
  }
  localStorage.setItem('ctax_tier', next);
  applyTierText(next);
}

// Keys where we need innerHTML (contain <br> or other markup)
var TIER_HTML_KEYS = { 'pship-heading': true, 'testi-heading': true };

function applyTierText(tier) {
  var cfg = TIER_CONFIG[tier] || TIER_CONFIG.enterprise;
  var icon = document.getElementById('tier-icon');
  var badge = document.getElementById('tier-badge');
  if (icon) icon.textContent = cfg.icon;
  if (badge) badge.textContent = cfg.badge;
  document.title = cfg.title;

  var copy = cfg.copy;
  if (!copy) return;
  document.querySelectorAll('[data-tier-key]').forEach(function(el) {
    var key = el.getAttribute('data-tier-key');
    if (copy[key] !== undefined) {
      if (TIER_HTML_KEYS[key]) {
        el.innerHTML = copy[key];
      } else {
        el.textContent = copy[key];
      }
    }
  });

  // Swap onclick actions where defined
  var actions = cfg.actions || TIER_CONFIG.enterprise.actions;
  if (!actions) return;
  document.querySelectorAll('[data-tier-key]').forEach(function(el) {
    var key = el.getAttribute('data-tier-key');
    if (actions[key]) {
      el.onclick = actions[key];
    }
  });
}

// Capture Enterprise defaults from the DOM so toggling back restores original HTML
function captureEnterpriseDefaults() {
  var defaults = {};
  var defaultActions = {};
  document.querySelectorAll('[data-tier-key]').forEach(function(el) {
    var key = el.getAttribute('data-tier-key');
    if (TIER_HTML_KEYS[key]) {
      defaults[key] = el.innerHTML;
    } else {
      defaults[key] = el.textContent;
    }
    // Capture onclick if the element has one
    if (el.onclick) {
      defaultActions[key] = el.onclick;
    }
  });
  TIER_CONFIG.enterprise.copy = defaults;
  TIER_CONFIG.enterprise.actions = defaultActions;
}

(function() {
  var saved = localStorage.getItem('ctax_tier');
  if (saved && saved !== 'enterprise') {
    document.documentElement.setAttribute('data-tier', saved);
  }

  // Capture defaults after DOM is ready, then apply saved tier
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      captureEnterpriseDefaults();
      applyTierText(saved || 'enterprise');
    });
  } else {
    captureEnterpriseDefaults();
    applyTierText(saved || 'enterprise');
  }
})();

// ── SMOOTH PAGE TRANSITIONS ──────────────────────────────────────
// Enhance existing showPage with animation class
(function(){
  var origShow = window.showPage;
  if(!origShow) return;
  window.showPage = function(id){
    origShow(id);
    var page = document.getElementById('page-' + id);
    if(page){
      page.classList.remove('page-entering');
      void page.offsetHeight;
      page.classList.add('page-entering');
    }
  };
})();

// ── FORM SUBMISSION (mailto fallback) ──────────────────────────────────────
function handleContactSubmit(e){
  if(e) e.preventDefault();
  var form = e.target;
  var data = new FormData(form);
  var name = data.get('name');
  var email = data.get('email');
  var subject = data.get('subject');
  var message = data.get('message');
  if(!name||!email||!message){alert('Please fill in all required fields.');return;}
  var body = 'Name: '+name+'\nEmail: '+email+'\n\n'+message;
  var mailto = 'mailto:partners@communitytax.com?subject='+encodeURIComponent(subject||'Partner Inquiry')+'&body='+encodeURIComponent(body);
  window.location.href = mailto;
  var btn = form.querySelector('button[type="submit"]');
  if(btn){btn.textContent='Sent — check your email client';btn.disabled=true;btn.style.opacity='0.7';}
  showToast('Message opened in email client', 'success');
}


// ── ONBOARDING CHECKLIST ──────────────────────────────────────
function toggleOnboardStep(el) {
  var step = el.closest('.ob-step');
  if (!step) return;
  var check = step.querySelector('.ob-check');
  // Force reflow to restart animation on re-check
  if (check && !step.classList.contains('ob-done')) {
    check.style.animation = 'none';
    check.offsetHeight;
    check.style.animation = '';
  }
  step.classList.toggle('ob-done');
  var isChecked = step.classList.contains('ob-done');
  check.setAttribute('aria-checked', isChecked ? 'true' : 'false');
  updateOnboardProgress();
}
function updateOnboardProgress() {
  var steps = document.querySelectorAll('.ob-step');
  var done = document.querySelectorAll('.ob-step.ob-done');
  var pct = Math.round((done.length / steps.length) * 100);
  var bar = document.getElementById('onboard-bar');
  if (bar) bar.style.width = pct + '%';
  var complete = document.getElementById('onboard-complete');
  if (complete) {
    if (pct === 100) {
      complete.style.display = 'block';
      complete.classList.add('ob-complete-show');
    } else {
      complete.style.display = 'none';
      complete.classList.remove('ob-complete-show');
    }
  }
}


// ── ANIMATED COUNTERS ON ANY PAGE ──────────────────────────────────────
(function(){
  var counted = new Set();
  var obs = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting && !counted.has(entry.target)){
        counted.add(entry.target);
        var el = entry.target;
        var target = parseFloat(el.getAttribute('data-count-to')) || 0;
        var prefix = el.getAttribute('data-count-prefix') || '';
        var suffix = el.getAttribute('data-count-suffix') || '';
        var decimals = parseInt(el.getAttribute('data-count-decimals')) || 0;
        var duration = 1500;
        var start = performance.now();
        function tick(now){
          var elapsed = now - start;
          var progress = Math.min(elapsed / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          var current = target * eased;
          var display = decimals > 0 ? current.toFixed(decimals) : Math.round(current).toLocaleString();
          el.textContent = prefix + display + suffix;
          if(progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      }
    });
  }, {threshold:0.3});
  document.querySelectorAll('[data-count-to]').forEach(function(el){ obs.observe(el); });
})();

// ── SCROLL PROGRESS BAR ──────────────────────────────────────
(function(){
  var bar = null;
  var ticking = false;

  function updateProgress(){
    if(!bar) bar = document.getElementById('scroll-progress');
    if(!bar) return;
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if(docHeight <= 0){
      bar.classList.remove('visible');
      return;
    }
    var pct = Math.min((scrollTop / docHeight) * 100, 100);
    bar.style.width = pct + '%';
    bar.classList.toggle('visible', scrollTop > 80);
    ticking = false;
  }

  window.addEventListener('scroll', function(){
    if(!ticking){
      requestAnimationFrame(updateProgress);
      ticking = true;
    }
  }, {passive: true});
})();

// ── STAGGERED CARD ENTRANCE ──────────────────────────────────────
(function(){
  var staggerSelectors = '.g2,.g3,.g4,.testi-grid,.vcols,.srow,.cta-acts,.cmp-rows';
  var staggerObs = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(!entry.isIntersecting) return;
      var children = entry.target.children;
      for(var i = 0; i < children.length; i++){
        if(prefersReducedMotion){
          children[i].classList.add('stagger-visible');
        } else {
          (function(child, delay){
            setTimeout(function(){
              child.classList.add('stagger-visible');
            }, delay);
          })(children[i], i * 60);
        }
      }
      staggerObs.unobserve(entry.target);
    });
  }, {threshold: 0.08, rootMargin: '0px 0px -30px 0px'});

  function initStagger(root){
    var containers = (root || document).querySelectorAll(staggerSelectors);
    containers.forEach(function(container){
      // Skip if already observed or all children visible
      if(container.dataset.staggerInit) return;
      container.dataset.staggerInit = '1';
      var children = container.children;
      for(var i = 0; i < children.length; i++){
        children[i].classList.add('stagger-child');
      }
      staggerObs.observe(container);
    });
  }

  // Run on load for home page
  window.addEventListener('load', function(){ initStagger(); });

  // Hook into page navigation for lazy-loaded pages
  window.initStagger = initStagger;
})();

// ── PARALLAX ON KEY SECTIONS ──────────────────────────────────────
(function(){
  if(prefersReducedMotion) return;
  var ticking = false;

  function updateParallax(){
    var els = document.querySelectorAll('[data-parallax]');
    var scrollY = window.scrollY;
    var winH = window.innerHeight;
    for(var i = 0; i < els.length; i++){
      var el = els[i];
      var rect = el.getBoundingClientRect();
      // Only process if in or near viewport
      if(rect.bottom < -100 || rect.top > winH + 100) continue;
      var speed = parseFloat(el.getAttribute('data-parallax')) || 0.15;
      var center = rect.top + rect.height / 2;
      var offset = (center - winH / 2) * speed;
      el.style.transform = 'translateY(' + offset.toFixed(1) + 'px)';
    }
    ticking = false;
  }

  window.addEventListener('scroll', function(){
    if(!ticking){
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, {passive: true});
})();

// ── TOAST NOTIFICATIONS ──────────────────────────────────────
function showToast(message, type) {
  type = type || 'info';
  var container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  var toast = document.createElement('div');
  toast.className = 'toast toast-' + type;

  var icons = {
    success: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    copied: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>',
    info: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
  };

  toast.innerHTML = '<span class="toast-icon">' + (icons[type] || icons.info) + '</span><span class="toast-msg">' + message + '</span>';

  // Click to dismiss
  toast.addEventListener('click', function() { dismissToast(toast); });

  // Respect reduced motion
  if (prefersReducedMotion) {
    toast.style.animation = 'none';
    toast.style.opacity = '1';
    toast.style.transform = 'none';
  }

  container.appendChild(toast);

  // Max 3 visible — remove oldest if 4th arrives
  var toasts = container.querySelectorAll('.toast:not(.toast-exit)');
  if (toasts.length > 3) {
    dismissToast(toasts[0]);
  }

  // Auto-dismiss after 3s
  setTimeout(function() { dismissToast(toast); }, 3000);
}

function dismissToast(toast) {
  if (!toast || toast.classList.contains('toast-exit')) return;
  if (prefersReducedMotion) {
    toast.remove();
    return;
  }
  toast.classList.add('toast-exit');
  toast.addEventListener('animationend', function() { toast.remove(); });
}

// ── NAV DROPDOWN HOVER WITH DELAY ──────────────────────────────────────
(function(){
  var closeTimer = null;
  var openDrop = null;

  function openDropdown(drop){
    if(closeTimer){ clearTimeout(closeTimer); closeTimer = null; }
    if(openDrop && openDrop !== drop){ openDrop.classList.remove('dd-open'); }
    drop.classList.add('dd-open');
    openDrop = drop;
  }

  function closeNow(){
    if(closeTimer){ clearTimeout(closeTimer); closeTimer = null; }
    if(openDrop){ openDrop.classList.remove('dd-open'); openDrop = null; }
  }

  function scheduleClose(){
    if(closeTimer) clearTimeout(closeTimer);
    closeTimer = setTimeout(closeNow, 500);
  }

  // Close dropdown when any menu item or promo is clicked
  document.querySelectorAll('.dd-item, .dd-promo-inner').forEach(function(item){
    item.addEventListener('click', function(){ closeNow(); });
  });

  document.querySelectorAll('.nav-drop').forEach(function(drop){
    var trigger = drop.querySelector('.nav-drop-trigger');
    var dd = drop.querySelector('.dd');

    // Trigger: open on enter, schedule close on leave
    if(trigger){
      trigger.addEventListener('mouseenter', function(){ openDropdown(drop); });
      trigger.addEventListener('mouseleave', function(){ scheduleClose(); });
    }

    // Dropdown panel: cancel close on enter, schedule close on leave
    if(dd){
      dd.addEventListener('mouseenter', function(){
        if(closeTimer){ clearTimeout(closeTimer); closeTimer = null; }
      });
      dd.addEventListener('mouseleave', function(e){
        // If moving back to the trigger, don't close
        if(trigger && trigger.contains(e.relatedTarget)) return;
        scheduleClose();
      });
    }
  });
})();

// ── RESOLUTION PRO CONTACT CARD ──────────────────────────────────────
function toggleResolutionPro() {
  var card = document.getElementById('rp-card');
  var iconPerson = document.getElementById('rp-fab-icon-person');
  var iconX = document.getElementById('rp-fab-icon-x');
  if (!card) return;
  var isOpen = card.classList.contains('rp-open');
  card.classList.toggle('rp-open');
  if (iconPerson) iconPerson.style.display = isOpen ? '' : 'none';
  if (iconX) iconX.style.display = isOpen ? 'none' : '';
}

function closeResolutionPro() {
  var card = document.getElementById('rp-card');
  var iconPerson = document.getElementById('rp-fab-icon-person');
  var iconX = document.getElementById('rp-fab-icon-x');
  if (card) card.classList.remove('rp-open');
  if (iconPerson) iconPerson.style.display = '';
  if (iconX) iconX.style.display = 'none';
}

// ── JAZZ RADIO WIDGET ──────────────────────────────────────
var _jazzPlaying = false;

function toggleJazz() {
  var audio = document.getElementById('jazz-audio');
  var bar = document.getElementById('jazz-bar');
  var iconPlay = document.getElementById('jazz-icon-play');
  var iconPause = document.getElementById('jazz-icon-pause');
  var nowEl = document.getElementById('jazz-now');
  if (!audio) return;

  // Show the bar if hidden
  if (bar && !bar.classList.contains('jazz-visible')) {
    bar.classList.add('jazz-visible');
    adjustFabForJazz(true);
  }

  if (_jazzPlaying) {
    audio.pause();
    _jazzPlaying = false;
    if (iconPlay) iconPlay.style.display = '';
    if (iconPause) iconPause.style.display = 'none';
    if (nowEl) nowEl.textContent = 'Paused';
    removeEqBars();
  } else {
    audio.volume = (document.getElementById('jazz-vol') || {}).value / 100 || 0.4;
    audio.play().then(function() {
      _jazzPlaying = true;
      if (iconPlay) iconPlay.style.display = 'none';
      if (iconPause) iconPause.style.display = '';
      if (nowEl) nowEl.textContent = 'Now Playing';
      addEqBars();
    }).catch(function() {
      if (nowEl) nowEl.textContent = 'Tap to play';
    });
  }

  localStorage.setItem('ctax_jazz', _jazzPlaying ? '1' : '0');
}

function setJazzVolume(val) {
  var audio = document.getElementById('jazz-audio');
  if (audio) audio.volume = val / 100;
  localStorage.setItem('ctax_jazz_vol', val);
}

function openJazzBar() {
  var bar = document.getElementById('jazz-bar');
  if (bar && !bar.classList.contains('jazz-visible')) {
    bar.classList.add('jazz-visible');
    adjustFabForJazz(true);
  }
  if (!_jazzPlaying) toggleJazz();
}

function closeJazzBar() {
  var audio = document.getElementById('jazz-audio');
  var bar = document.getElementById('jazz-bar');
  if (audio && _jazzPlaying) { audio.pause(); _jazzPlaying = false; }
  if (bar) bar.classList.remove('jazz-visible');
  adjustFabForJazz(false);
  localStorage.setItem('ctax_jazz', '0');
}

function adjustFabForJazz(visible) {
  var fab = document.getElementById('rp-fab');
  var card = document.getElementById('rp-card');
  if (fab) fab.style.bottom = visible ? '68px' : '';
  if (card) card.style.bottom = visible ? '124px' : '';
}

function addEqBars() {
  var info = document.querySelector('.jazz-info');
  if (!info || document.querySelector('.jazz-eq')) return;
  var eq = document.createElement('div');
  eq.className = 'jazz-eq';
  for (var i = 0; i < 5; i++) {
    var bar = document.createElement('div');
    bar.className = 'jazz-eq-bar';
    eq.appendChild(bar);
  }
  info.appendChild(eq);
}

function removeEqBars() {
  var eq = document.querySelector('.jazz-eq');
  if (eq) eq.remove();
}

// Show jazz bar on portal if previously playing
(function() {
  var saved = localStorage.getItem('ctax_jazz');
  var vol = localStorage.getItem('ctax_jazz_vol');
  if (vol) {
    var slider = document.getElementById('jazz-vol');
    if (slider) slider.value = vol;
  }
  if (saved === '1') {
    var bar = document.getElementById('jazz-bar');
    if (bar) {
      bar.classList.add('jazz-visible');
      adjustFabForJazz(true);
    }
  }
})();
