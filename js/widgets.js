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


  window.addEventListener('load',function(){initReveal();initScrollCounters();setTimeout(fireHeroCounters,2300);});
  var _orig=window.showPage;
  window.showPage=function(id){
    _orig(id);
    if(id==='home'){
      var s=document.querySelector('.h-stats');if(s){s.style.animation='none';s.offsetHeight;s.style.animation='';}
      // Reset hero text animations on revisit
      ['.h-badge','.h-title','.h-sub','.h-cta-row'].forEach(function(sel){
        var el=document.querySelector(sel);if(!el)return;
        el.style.opacity='';el.style.animation='none';el.offsetHeight;el.style.animation='';
      });
      setTimeout(function(){initReveal();document.querySelectorAll('#page-home .counter').forEach(function(el){var p=el.getAttribute('data-prefix')||'';el.textContent=p+'0';co.observe(el);});},80);
      setTimeout(fireHeroCounters,2380);
    }
    if(id==='how'){setTimeout(initHowAnimations,60);}
  };
})();


// ── SOCIAL PROOF TICKER ──────────────────────────────────────
(function(){
  var proofs = [
    {text:'A CPA in Houston just submitted a referral', time:'2 minutes ago'},
    {text:'Partner in Phoenix earned $2,400 this month', time:'15 minutes ago'},
    {text:'New Enterprise partner joined from Dallas', time:'28 minutes ago'},
    {text:'$34,200 in tax debt resolved for a referred client', time:'1 hour ago'},
    {text:'Mortgage broker in Atlanta saved 3 loans this week', time:'2 hours ago'},
    {text:'Strategic partner hit $50K quarterly earnings', time:'3 hours ago'},
    {text:'Financial advisor in NYC referred 5 clients today', time:'4 hours ago'},
    {text:'Law firm partner earned $4,800 on one referral', time:'5 hours ago'}
  ];
  var idx = 0;
  function showProof(){
    var ticker = document.getElementById('social-proof-ticker');
    var textEl = document.getElementById('proof-text');
    var timeEl = document.getElementById('proof-time');
    if(!ticker||!textEl||!timeEl) return;
    textEl.textContent = proofs[idx].text;
    timeEl.textContent = proofs[idx].time;
    ticker.style.display = 'block';
    ticker.style.animation = 'slideInUp 0.4s ease';
    idx = (idx + 1) % proofs.length;
    setTimeout(function(){
      ticker.style.animation = 'slideOutDown 0.4s ease forwards';
      setTimeout(function(){ ticker.style.display = 'none'; }, 400);
    }, 5000);
  }
  // Start after 8 seconds, repeat every 25 seconds
  setTimeout(function(){
    showProof();
    setInterval(showProof, 25000);
  }, 8000);
})();

// ── COOKIE CONSENT ──────────────────────────────────────
function acceptCookies(){
  localStorage.setItem('ctax_cookies_accepted','1');
  document.getElementById('cookie-consent').style.display='none';
}
(function(){
  if(!localStorage.getItem('ctax_cookies_accepted')){
    setTimeout(function(){
      var el = document.getElementById('cookie-consent');
      if(el) el.style.display='flex';
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
}
(function(){
  var saved = localStorage.getItem('ctax_theme');
  if(saved === 'dark'){
    document.documentElement.setAttribute('data-theme', 'dark');
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
}


// ── ONBOARDING CHECKLIST ──────────────────────────────────────
function toggleOnboardStep(el) {
  var step = el.closest('.ob-step');
  if (!step) return;
  step.classList.toggle('ob-done');
  updateOnboardProgress();
}
function updateOnboardProgress() {
  var steps = document.querySelectorAll('.ob-step');
  var done = document.querySelectorAll('.ob-step.ob-done');
  var pct = Math.round((done.length / steps.length) * 100);
  var bar = document.getElementById('onboard-bar');
  if (bar) bar.style.width = pct + '%';
  var complete = document.getElementById('onboard-complete');
  if (complete) complete.style.display = pct === 100 ? 'block' : 'none';
}


// ── ANIMATED COUNTERS ON ANY PAGE ──────────────────────────────────────
(function(){
  var counted = new Set();
  var obs = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting && !counted.has(entry.target)){
        counted.add(entry.target);
        var el = entry.target;
        var target = parseInt(el.getAttribute('data-count-to')) || 0;
        var prefix = el.getAttribute('data-count-prefix') || '';
        var suffix = el.getAttribute('data-count-suffix') || '';
        var duration = 1500;
        var start = performance.now();
        function tick(now){
          var elapsed = now - start;
          var progress = Math.min(elapsed / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          var current = Math.round(target * eased);
          el.textContent = prefix + current.toLocaleString() + suffix;
          if(progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      }
    });
  }, {threshold:0.3});
  document.querySelectorAll('[data-count-to]').forEach(function(el){ obs.observe(el); });
})();
