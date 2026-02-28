function closeDropdowns(){
  // dropdowns close naturally on mouseleave — this is a no-op hook for future use
}

function toggleMobileNav(){
  var btn=document.getElementById('navHamburger');
  var drawer=document.getElementById('mobileNavDrawer');
  btn.classList.toggle('open');
  drawer.classList.toggle('open');
}
function closeMobileNav(){
  var btn=document.getElementById('navHamburger');
  var drawer=document.getElementById('mobileNavDrawer');
  if(btn) btn.classList.remove('open');
  if(drawer) drawer.classList.remove('open');
}

function showPage(id, skipHistory){
  var current = document.querySelector('.page.active');
  if(current){
    current.classList.add('page-exit');
    setTimeout(function(){
      current.classList.remove('active','page-exit');
      current.style.display='none';
      setTimeout(function(){ current.style.display=''; }, 50);
      _activatePage(id, skipHistory);
    }, 180);
  } else {
    _activatePage(id, skipHistory);
  }
}
function _activatePage(id, skipHistory){
  document.querySelectorAll('.nav-links a').forEach(function(a){a.classList.remove('active');});
  var targetId = id;
  var p=document.getElementById('page-'+id);
  if(!p){
    targetId = '404';
    p=document.getElementById('page-404');
  }
  // Load page content if needed, then show
  var show = function() {
    if(p){
      p.style.display='block';
      p.classList.add('active','page-enter');
      setTimeout(function(){ p.classList.remove('page-enter'); p.style.display=''; }, 1100);
      setTimeout(function(){ revealInView(p); }, 80);
    }
    var n=document.getElementById('nav-'+id);if(n)n.classList.add('active');
    window.scrollTo(0,0);
    if(id==='how'){setTimeout(initHowAnimations,60);}
    // close mobile nav
    var drawer=document.getElementById('mobileNavDrawer');
    var btn=document.getElementById('navHamburger');
    if(drawer)drawer.classList.remove('open');
    if(btn)btn.classList.remove('open');
    // Toggle site chrome for portal
    if(targetId==='portal'){
      document.body.classList.add('portal-mode');
    } else {
      document.body.classList.remove('portal-mode');
    }
    // Update SEO metadata for SPA navigation
    updatePageSEO(targetId);
    // Push browser history so back/forward buttons work
    if (!skipHistory) {
      history.pushState({ page: targetId }, '', '#' + targetId);
    }
  };
  if(typeof loadPageContent === 'function') {
    loadPageContent(targetId).then(show);
  } else {
    show();
  }
}

// Browser back/forward button support
window.addEventListener('popstate', function(e) {
  var pageId = (e.state && e.state.page) ? e.state.page : 'home';
  // Skip history push since we're restoring from history
  var current = document.querySelector('.page.active');
  if (current) {
    current.classList.remove('active', 'page-exit');
    current.style.display = 'none';
    setTimeout(function(){ current.style.display = ''; }, 50);
  }
  _activatePage(pageId, true);
});

// SEO: per-page title and meta description for SPA navigation
var pageSEO = {
  home:       { title: 'Community Tax — Enterprise Partner Program | Earn 8-18% Revenue Share', desc: 'Join 10,000+ financial professionals earning revenue from IRS tax resolution referrals. Community Tax handles everything — you earn 8-18% revenue share with zero overhead.' },
  why:        { title: 'Why Community Tax — Tax Resolution Partner Program Benefits', desc: '18.6 million Americans owe $316B in overdue taxes. Partner with Community Tax to resolve client tax debt, keep relationships, and earn referral revenue.' },
  how:        { title: 'How It Works — Tax Resolution Referral Process | Community Tax', desc: 'From first conversation to sustained revenue. Our six-phase partner lifecycle maximizes revenue potential and eliminates wasted investment from day one.' },
  segments:   { title: 'Who We Serve — CPAs, Advisors, Law Firms, Fintech | Community Tax', desc: 'Whether you are a solo CPA or an enterprise fintech platform, Community Tax has a partnership structure designed for your business model and client base.' },
  tiers:      { title: 'Partner Tiers — Direct, Enterprise, Strategic | Community Tax', desc: 'Three tiers engineered for your model. Compare sales benefits, technical integrations, and revenue share rates across Direct, Enterprise, and Strategic partnerships.' },
  stories:    { title: 'Partner Success Stories — Real Revenue Results | Community Tax', desc: 'See how financial professionals across the country are growing their practice and earning referral revenue with Community Tax partnerships.' },
  compare:    { title: 'Compare Tax Resolution Options — In-House vs Community Tax', desc: 'Side-by-side comparison of handling IRS tax resolution in-house, partnering with other programs, or choosing Community Tax.' },
  apply:      { title: 'Apply to Become a Partner — Community Tax Partner Program', desc: 'Submit your application to join 10,000+ active partners. We evaluate fit, recommend a tier, and walk through revenue structure. 1-day response time.' },
  contact:    { title: 'Contact Us — Community Tax Partner Support', desc: 'Questions about the partner program? Reach our partner support team for program questions, technical support, or general inquiries.' },
  faq:        { title: 'Partner FAQ — Tax Resolution Referral Program Questions', desc: 'Answers to common questions about the Community Tax partner program, revenue share, client identification, IRS programs, and referral tracking.' },
  resources:  { title: 'Partner Resources — Knowledge Base, Templates, Guides | Community Tax', desc: 'Search the partner knowledge base, qualify clients, browse templates, and access onboarding guides for Community Tax referral partners.' },
  calculator: { title: 'Revenue Calculator — Model Your Referral Earnings | Community Tax', desc: 'Calculate your potential annual revenue from tax resolution referrals. Interactive calculator with scenario modeling and tier comparison.' },
  scripts:    { title: 'AI Script Builder — Custom Referral Scripts | Community Tax', desc: 'Generate custom referral scripts for emails, phone calls, and client conversations. AI-powered script builder tuned for tax resolution.' },
  admaker:    { title: 'Ad Maker — Co-Branded Marketing Ads | Community Tax', desc: 'Create professional co-branded ads for social media, email, and print. Upload your logo and generate ready-to-use marketing materials.' },
  webinars:   { title: 'CE Webinars — IRS-Approved Continuing Education | Community Tax', desc: '500+ hours of on-demand continuing education for tax professionals. Tax resolution, ethics, federal law updates — all free for active partners.' },
  dashboard:  { title: 'Partner Dashboard Preview — Real-Time Tracking | Community Tax', desc: 'Preview the partner portal with real-time case tracking, pipeline velocity, commission accruals, and conversion metrics.' },
  onboarding: { title: 'Partner Onboarding Checklist — Get Started | Community Tax', desc: 'Step-by-step onboarding checklist to get your Community Tax partnership up and running quickly.' },
  portal:     { title: 'Partner Portal — Community Tax Dashboard', desc: 'Access your partner portal for referral tracking, earnings, payouts, and client management.' },
  privacy:    { title: 'Privacy Policy — Community Tax', desc: 'Community Tax privacy policy covering data collection, usage, and protection for partner program participants.' },
  terms:      { title: 'Terms of Use — Community Tax', desc: 'Terms of use governing the Community Tax partner program website and services.' },
  '404':      { title: 'Page Not Found — Community Tax', desc: '' }
};
function updatePageSEO(id) {
  var seo = pageSEO[id] || pageSEO.home;
  document.title = seo.title;
  var metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', seo.desc);
}

// Set initial history state — always start on home, clear any stale hash
history.replaceState({ page: 'home' }, '', window.location.pathname);
function switchSeg(id,btn){
  document.querySelectorAll('.seg-panel').forEach(function(p){p.classList.remove('active');});
  document.querySelectorAll('.seg-tab').forEach(function(t){t.classList.remove('active');});
  var p=document.getElementById('seg-'+id);if(p)p.classList.add('active');
  btn.classList.add('active');
}
function switchFaq(id,btn){
  document.querySelectorAll('.faq-sec').forEach(function(s){s.classList.remove('active');});
  document.querySelectorAll('.faq-nb').forEach(function(b){b.classList.remove('active');});
  var s=document.getElementById('faq-'+id);if(s)s.classList.add('active');
  btn.classList.add('active');
}
function toggleFaq(el){
  var item=el.closest('.faq-item'),isOpen=item.classList.contains('open');
  item.closest('.faq-sec').querySelectorAll('.faq-item').forEach(function(i){i.classList.remove('open');});
  if(!isOpen)item.classList.add('open');
}
function handleApply(e) {
  if(e) e.preventDefault();
  var form = e.target;
  var data = new FormData(form);
  var lines = [];
  lines.push('Name: ' + (data.get('first_name')||'') + ' ' + (data.get('last_name')||''));
  lines.push('Email: ' + (data.get('email')||''));
  lines.push('Phone: ' + (data.get('phone')||''));
  lines.push('Company: ' + (data.get('company')||''));
  lines.push('Business Type: ' + (data.get('business_type')||''));
  lines.push('Client Volume: ' + (data.get('client_volume')||''));
  lines.push('States: ' + (data.get('states')||''));
  lines.push('Tier: ' + (data.get('tier')||'Not selected'));
  lines.push('Notes: ' + (data.get('notes')||''));
  var body = 'New Partner Application\n\n' + lines.join('\n');
  window.location.href = 'mailto:partners@communitytax.com?subject=' + encodeURIComponent('New Partner Application — ' + (data.get('company')||'')) + '&body=' + encodeURIComponent(body);
  var btn = form.querySelector('button[type="submit"], .f-submit');
  if(btn){btn.textContent='Sent — check your email client';btn.disabled=true;btn.style.opacity='0.7';}
  if(typeof showToast === 'function') showToast('Application opened in email client', 'success');
}
function initHowAnimations(){
  var hp=document.getElementById('page-how');if(!hp)return;
  hp.querySelectorAll('.fade-up,.slide-up,.tl-cell,.ph-cell-a').forEach(function(el){el.classList.remove('in-view');});
  var line=document.getElementById('phasesLine');if(line)line.classList.remove('drawn');
  var obs=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting)e.target.classList.add('in-view');});},{threshold:0.15});
  hp.querySelectorAll('.fade-up,.slide-up,.tl-cell').forEach(function(el){obs.observe(el);});
  var phObs=new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        document.querySelectorAll('.ph-cell-a').forEach(function(c,i){setTimeout(function(){c.classList.add('in-view');},i*130);});
        setTimeout(function(){var l=document.getElementById('phasesLine');if(l)l.classList.add('drawn');},200);
        phObs.disconnect();
      }
    });
  },{threshold:0.3});
  var wrap=hp.querySelector('.phases-wrap');if(wrap)phObs.observe(wrap);
}

// Modal
var expCurrent=0,expTotal=4;
function openExploreModal(){
  expCurrent=0;updateExp();
  document.getElementById('exploreModal').classList.add('open');
  document.body.style.overflow='hidden';
}
function closeExploreModal(){
  document.getElementById('exploreModal').classList.remove('open');
  document.body.style.overflow='';
}
function closeExploreModalBg(e){
  if(e.target===document.getElementById('exploreModal'))closeExploreModal();
}
function closeAndNav(page){
  closeExploreModal();
  setTimeout(function(){showPage(page);},220);
}
function shiftCard(dir){expCurrent=Math.max(0,Math.min(expTotal-1,expCurrent+dir));updateExp();}
function goToCard(i){expCurrent=i;updateExp();}
function updateExp(){
  document.getElementById('expTrack').style.transform='translateX(-'+(expCurrent*100)+'%)';
  document.querySelectorAll('.exp-dot').forEach(function(d,i){d.classList.toggle('active',i===expCurrent);});
  document.getElementById('expPrev').disabled=expCurrent===0;
  document.getElementById('expNext').disabled=expCurrent===expTotal-1;
  var hints=['See what you get as a partner','Keep going — it gets better','Almost there',''];
  var hint=document.getElementById('expHint');
  if(hint){
    if(expCurrent===expTotal-1){
      hint.innerHTML='<a class="exp-hint-cta" onclick="closeAndNav(\'apply\')" style="cursor:pointer">Ready to get started? &rarr;</a>';
    }else{
      hint.textContent=hints[expCurrent];
    }
  }
}
document.addEventListener('keydown',function(e){
  if(!document.getElementById('exploreModal').classList.contains('open'))return;
  if(e.key==='Escape')closeExploreModal();
  if(e.key==='ArrowRight')shiftCard(1);
  if(e.key==='ArrowLeft')shiftCard(-1);
});

// Partner Fit Quiz
(function(){
  var step = 0;
  var scores = []; // scores[0..3] filled as user answers
  var dimKeys = ['v','r','c','e'];

  var resultTiers = [
    { test: function(s,a){ return a < 2.2 || Math.min.apply(null,s) <= 1.5; },
      bg:'rgba(248,113,113,0.06)', border:'rgba(248,113,113,0.18)',
      icon:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></svg>',
      title:"The timing might not be right -- and that's worth knowing.",
      text:"Based on your answers, at least one area needs more foundation before a partnership would create real value for either side. That's not a door closing -- it's useful information. The organizations that work best with us tend to have a clear internal owner, some baseline client volume with tax exposure, and the operational footing to move quickly once they're in. If you're building toward that, we're happy to reconnect.",
      cta:null },
    { test: function(s,a){ return a < 3.0; },
      bg:'rgba(255,190,50,0.05)', border:'rgba(255,190,50,0.18)',
      icon:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 8 16 12 12 16 8 12 12 8"/></svg>',
      title:"There's something here -- a few things to sort out first.",
      text:"You're showing up strong in some areas and lighter in others. That's actually pretty common at this stage -- a lot of our best partners looked exactly like this when they first reached out. The FAQ walks through what the early partnership structure looks like and what we ask for on each side. Worth a read before we talk.",
      cta:'faq', ctaText:'See what the program actually asks for', ctaStyle:'background:rgba(255,190,50,0.1);color:#f5c842;border:1px solid rgba(255,190,50,0.18)' },
    { test: function(s,a){ return a < 3.8 && Math.min.apply(null,s) >= 2; },
      bg:'rgba(11,95,216,0.06)', border:'rgba(75,163,255,0.18)',
      icon:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
      title:"This looks like a real fit.",
      text:"Across the dimensions that matter most, you're in a good place. A Direct partnership is probably the right structure -- low overhead on your end, clear economics, and a path to deepening the relationship as volume grows. The intake form takes about five minutes.",
      cta:'apply', ctaText:'Start the conversation', ctaStyle:'background:rgba(75,163,255,0.12);color:#4BA3FF;border:1px solid rgba(75,163,255,0.22)' },
    { test: function(s,a){ return a >= 3.8 && Math.min.apply(null,s) >= 3; },
      bg:'rgba(0,229,204,0.05)', border:'rgba(0,229,204,0.2)',
      icon:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
      title:"Strong alignment across the board.",
      text:"You're scoring well on every dimension -- which usually means an Enterprise or Strategic structure is worth exploring. Those tiers come with meaningfully higher revenue share, a dedicated account relationship, and a more tailored integration.",
      cta:'apply', ctaText:'Let\'s talk about a deeper structure', ctaStyle:'background:rgba(0,229,204,0.1);color:var(--cyan-text);border:1px solid rgba(0,229,204,0.18)' }
  ];

  function updateUI(){
    var cards = document.querySelectorAll('.fq-card');
    var bar = document.getElementById('fqProgressBar');
    var label = document.getElementById('fqStepLabel');
    var backBtn = document.getElementById('fqBackBtn');
    var result = document.getElementById('fqResult');
    if(!cards.length) return;

    var showResult = step >= 4;

    // Progress
    var pct = showResult ? 100 : (step / 4) * 100;
    if(bar) bar.style.width = pct + '%';
    if(label) label.textContent = showResult ? 'Complete' : 'Question ' + (step + 1) + ' of 4';

    // Dots
    var dots = document.querySelectorAll('.fq-dot');
    dots.forEach(function(dot, i){
      dot.classList.remove('fq-dot-active','fq-dot-done');
      if(showResult || i < step) dot.classList.add('fq-dot-done');
      else if(i === step) dot.classList.add('fq-dot-active');
    });

    // Cards
    cards.forEach(function(card, i){
      card.classList.remove('fq-card-active', 'fq-card-done', 'fq-card-next');
      if(i < step) card.classList.add('fq-card-done');
      else if(i === step && !showResult) card.classList.add('fq-card-active');
      else card.classList.add('fq-card-next');
    });

    // Hide all cards when showing result
    if(showResult){
      cards.forEach(function(card){ card.classList.add('fq-card-done'); });
    }

    // Back button
    if(backBtn) backBtn.style.display = step > 0 ? '' : 'none';

    // Result
    if(showResult && result){
      showFqResult();
    } else if(result){
      result.classList.remove('fq-result-show', 'fq-result-glow');
      result.innerHTML = '';
    }
  }

  function showFqResult(){
    var el = document.getElementById('fqResult');
    if(!el) return;
    var avg = (scores[0] + scores[1] + scores[2] + scores[3]) / 4;
    var tier = resultTiers[0];
    var tierIdx = 0;
    for(var i = resultTiers.length - 1; i >= 0; i--){
      if(resultTiers[i].test(scores, avg)){ tier = resultTiers[i]; tierIdx = i; break; }
    }
    var ctaHtml = tier.cta
      ? '<button class="fq-result-cta" style="' + tier.ctaStyle + '" onclick="showPage(\'' + tier.cta + '\')">' + tier.ctaText + ' <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></button>'
      : '<p style="font-size:14px;color:rgba(255,255,255,0.55);margin-top:8px">Build toward those areas first, then come back and retake the assessment.</p>';
    var restartHtml = '<button class="fq-restart-btn" onclick="fqRestart()"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 105.64-11.36L1 10"/></svg> Retake</button>';
    el.style.background = tier.bg;
    el.style.borderColor = tier.border;
    el.innerHTML = '<div class="fq-result-icon">' + tier.icon + '</div><div class="fq-result-body"><div class="fq-result-title">' + tier.title + '</div><p class="fq-result-text">' + tier.text + '</p><div class="fq-result-actions">' + ctaHtml + restartHtml + '</div></div>';
    el.classList.remove('fq-result-glow');
    el.classList.add('fq-result-show');
    // Add glow for good fit (tier 2) and strong alignment (tier 3)
    if (tierIdx >= 2) {
      el.style.setProperty('--fq-glow-color', tierIdx === 3 ? 'rgba(0,229,204,0.3)' : 'rgba(75,163,255,0.3)');
      el.classList.add('fq-result-glow');
    }
  }

  window.fqPick = function(btn){
    var score = parseFloat(btn.getAttribute('data-score'));
    scores[step] = score;

    // Highlight selected option
    var siblings = btn.parentElement.querySelectorAll('.fq-opt');
    siblings.forEach(function(s){ s.classList.remove('fq-opt-selected'); });
    btn.classList.add('fq-opt-selected');

    // Advance after brief delay so user sees their selection
    setTimeout(function(){
      step++;
      updateUI();
    }, 300);
  };

  window.fqBack = function(){
    if(step <= 0) return;
    step--;
    scores.length = step; // discard answer for this step
    // Clear selection on the card we're going back to
    var cards = document.querySelectorAll('.fq-card');
    if(cards[step]){
      cards[step].querySelectorAll('.fq-opt').forEach(function(o){ o.classList.remove('fq-opt-selected'); });
    }
    updateUI();
  };

  window.fqRestart = function(){
    step = 0;
    scores = [];
    var cards = document.querySelectorAll('.fq-card');
    cards.forEach(function(card){
      card.querySelectorAll('.fq-opt').forEach(function(o){ o.classList.remove('fq-opt-selected'); });
    });
    updateUI();
  };

  function initQuiz(){
    step = 0;
    scores = [];
    updateUI();
  }

  // Init on SPA navigation
  var origShowPage3 = window.showPage;
  window.showPage = function(id){ origShowPage3(id); if(id === 'how') setTimeout(initQuiz, 120); };
})();

function handleResourceDownload(btn, name) {
  var resources = {
    'Partner Program Overview': 'COMMUNITY TAX - PARTNER PROGRAM OVERVIEW\n\n1. About Community Tax\n- 15+ years in IRS tax resolution\n- $2.3B in tax debt resolved\n- 120,000+ clients served\n- Licensed in 48 states\n\n2. Partner Program\n- 3 tiers: Direct (8%), Enterprise (13%), Strategic (18%)\n- ~80% client conversion rate\n- $295 investigation fee (low barrier for clients)\n- Dedicated account manager for Enterprise+\n\n3. How It Works\n- You refer clients with IRS tax debt\n- We handle all resolution work\n- You earn revenue share on every case\n- Average case value: $15,000-$40,000\n\n4. Getting Started\n- Apply at partners.communitytax.com\n- 15-min intro call with partner manager\n- Sign agreement, get portal access\n- Submit first referral in < 1 week\n\nContact: partners@communitytax.com | 1-855-332-2873',
    'Revenue Share Breakdown': 'COMMUNITY TAX - REVENUE SHARE BREAKDOWN\n\nDirect Tier (8% share)\n- No minimum referrals\n- Self-service portal\n- Example: $20K case = $1,600 your share\n\nEnterprise Tier (13% share)\n- 10+ referrals/quarter\n- Dedicated account manager\n- Co-branded materials\n- Example: $20K case = $2,600 your share\n\nStrategic Tier (18% share)\n- 25+ referrals/quarter\n- API integration available\n- Custom reporting\n- White-label options\n- Example: $20K case = $3,600 your share\n\nPayout Schedule: Monthly, NET-30\nPayment Methods: ACH, Check\n\nContact: partners@communitytax.com',
    'Client Identification Guide': 'COMMUNITY TAX - CLIENT IDENTIFICATION GUIDE\n\nSigns Your Client May Need Tax Resolution:\n\n1. IRS Notices\n- CP14 (Balance Due)\n- CP501-CP504 (Collection notices)\n- Letter 1058 (Intent to Levy)\n- Letter 3172 (Notice of Federal Tax Lien)\n\n2. Verbal Cues\n- "I haven\'t filed in a few years"\n- "I owe the IRS but can\'t afford to pay"\n- "I got a letter about a lien/levy"\n- "My refund was offset"\n\n3. Financial Red Flags\n- Tax liens on credit report\n- Wage garnishment\n- Bank levy\n- Unfiled returns (2+ years)\n- Estimated debt > $10,000\n\nThe Conversation:\n"I work with a firm that specializes in IRS resolution. They\'ve resolved $2.3B in tax debt. The first step is a $295 investigation - would you like me to connect you?"\n\nContact: partners@communitytax.com',
    'Email Referral Template Pack': 'COMMUNITY TAX - EMAIL REFERRAL TEMPLATES\n\nTemplate 1: Initial Outreach\nSubject: Quick question about your tax situation\n\nHi [Name],\n\nDuring our recent conversation, you mentioned some concerns about [IRS notices/back taxes/unfiled returns]. I wanted to let you know about a resource that might help.\n\nI partner with Community Tax, a firm that specializes in IRS tax resolution. They\'ve helped resolve over $2.3 billion in tax debt for 120,000+ clients.\n\nThe first step is a $295 tax investigation where they review your full IRS account and present your options. No obligation beyond that.\n\nWould you like me to connect you? I can make a warm introduction.\n\nBest,\n[Your Name]\n\n---\nTemplate 2: Follow-Up\nSubject: Following up on tax resolution\n\nHi [Name], just checking in on this...',
    'Objection Handling Playbook': 'COMMUNITY TAX - OBJECTION HANDLING PLAYBOOK\n\nObjection: "I can\'t afford it"\nResponse: "The investigation is only $295, and resolution fees can be structured into affordable monthly payments. Most clients find the cost of NOT resolving far exceeds the cost of resolution - penalties and interest compound daily."\n\nObjection: "I\'ll handle it myself"\nResponse: "You absolutely can. But the IRS has a team of professionals on their side. Community Tax has enrolled agents and tax attorneys who negotiate these cases every day. Their clients see an average resolution of 70-80% of what they owe."\n\nObjection: "I don\'t trust tax resolution companies"\nResponse: "That\'s fair - there are bad actors in this space. Community Tax has been around 15 years, resolved $2.3B, and has 120K+ clients. They\'re BBB accredited. I personally partner with them because I trust them with my clients."\n\nObjection: "I\'ll wait and see"\nResponse: "The IRS charges penalties and interest daily. A $20K debt can grow to $30K in 18 months just from penalties. The sooner you act, the more options you have."',
    'Partner Kit: Everything You Need': 'COMMUNITY TAX - COMPLETE PARTNER KIT\n\nThis kit contains everything you need to start referring clients:\n\n1. Program Overview (see Partner Program Overview)\n2. Revenue Share Details (see Revenue Share Breakdown)\n3. Client Identification Guide (see guide)\n4. Email Templates (see template pack)\n5. Objection Handling (see playbook)\n6. Compliance Guidelines:\n   - Never guarantee specific outcomes\n   - Always disclose your referral relationship\n   - Direct clients to communitytax.com for verification\n   - Do not provide tax advice unless licensed\n\n7. Key Contacts:\n   Partner Support: partners@communitytax.com\n   New Partnerships: 1-855-332-2873\n   Hours: Mon-Fri, 8am-7pm CST\n\n8. Quick Start:\n   Step 1: Log in to Partner Portal\n   Step 2: Click "New Referral"\n   Step 3: Enter client name, phone, email, estimated debt\n   Step 4: We call them within 24 hours\n   Step 5: Track status in real-time'
  };

  var content = resources[name] || 'COMMUNITY TAX - ' + name.toUpperCase() + '\n\nThis resource is being prepared. Contact partners@communitytax.com for immediate access.';
  
  var blob = new Blob([content], {type: 'text/plain'});
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = name.replace(/[^a-zA-Z0-9 ]/g, '').replace(/ +/g, '-').toLowerCase() + '.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  btn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Downloaded';
  btn.style.background = 'rgba(0,229,204,0.1)';
  btn.style.color = 'var(--cyan-text)';
  btn.style.borderColor = 'rgba(0,229,204,0.3)';
}

