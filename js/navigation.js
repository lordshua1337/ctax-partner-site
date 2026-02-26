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

function showPage(id){
  var current = document.querySelector('.page.active');
  if(current){
    current.classList.add('page-exit');
    setTimeout(function(){
      current.classList.remove('active','page-exit');
      current.style.display='none';
      setTimeout(function(){ current.style.display=''; }, 50);
      _activatePage(id);
    }, 200);
  } else {
    _activatePage(id);
  }
}
function _activatePage(id){
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
      setTimeout(function(){ p.classList.remove('page-enter'); p.style.display=''; }, 460);
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
  };
  if(typeof loadPageContent === 'function') {
    loadPageContent(targetId).then(show);
  } else {
    show();
  }
}
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
  var hints=['Swipe or use arrows to explore','Keep going →','Almost there →','Ready to dive in?'];
  var hint=document.getElementById('expHint');if(hint)hint.textContent=hints[expCurrent];
}
document.addEventListener('keydown',function(e){
  if(!document.getElementById('exploreModal').classList.contains('open'))return;
  if(e.key==='Escape')closeExploreModal();
  if(e.key==='ArrowRight')shiftCard(1);
  if(e.key==='ArrowLeft')shiftCard(-1);
});

// Radar Chart
(function(){
  var dims = {
    v: {
      color:'#4BA3FF', spokeId:'spoke-v', dotId:'dot-v', lblId:'lbl-v',
      cx:210, cy:50,
      polyPoints: function(s){ return '210,'+(210-s)+' 370,210 210,370 50,210'; },
      tipAnchor: function(w,h){ return {x:w/2-124, y:40}; },
      eyebrow:'Value', quote:'"There\'s a gap in how most financial organizations serve clients with tax problems. We built a program to close it together."',
      body:'Every client you\'ve lost to a tax debt situation was money that didn\'t have to walk out the door. Partners who bring this program in unlock a revenue line nobody else saw coming.',
      items:['Do we solve a critical customer problem?','Total addressable market opportunity','Short-term SAM/SOM revenue potential','Company report card: customers, growth, sales']
    },
    r: {
      color:'#f87171', spokeId:'spoke-r', dotId:'dot-r', lblId:'lbl-r',
      cx:370, cy:210,
      polyPoints: function(s){ return '210,50 '+(210+s)+',210 210,370 50,210'; },
      tipAnchor: function(w,h){ return {x:w-268, y:h/2-110}; },
      eyebrow:'Risks', quote:'"We ask hard questions upfront so neither of us is surprised six months in."',
      body:'The compliance, security, and integration criteria aren\'t bureaucracy. They\'re how we make sure nothing surfaces six months in to embarrass either of us.',
      items:['Modern tech stack & integration capability','Competing products or competitor relationships','Support capabilities as we scale together','Privacy, security & compliance posture']
    },
    c: {
      color:'#3D917F', spokeId:'spoke-c', dotId:'dot-c', lblId:'lbl-c',
      cx:210, cy:370,
      polyPoints: function(s){ return '210,50 370,210 210,'+(210+s)+' 50,210'; },
      tipAnchor: function(w,h){ return {x:w/2-124, y:h-290}; },
      eyebrow:'Commitment', quote:'"We\'re clear about what we need from you — and equally clear about what we handle ourselves."',
      body:'Everything we ask of you is finite and documented. A point of contact, a data agreement, a shared revenue structure. What we don\'t ask for is your team\'s bandwidth.',
      items:['Revenue share alignment and margin structure','Willingness to market and position CTAX','Dedicated primary point of contact','Standard data sharing agreement']
    },
    e: {
      color:'#c4a0ff', spokeId:'spoke-e', dotId:'dot-e', lblId:'lbl-e',
      cx:50, cy:210,
      polyPoints: function(s){ return '210,50 370,210 210,370 '+(210-s)+',210'; },
      tipAnchor: function(w,h){ return {x:20, y:h/2-110}; },
      eyebrow:'Effectiveness', quote:'"The partnerships that perform best are the ones where both sides bring real capability to the table."',
      body:'Most referral programs fail because there\'s no infrastructure for execution — no tracking, no accountability. We measure conversion at every stage.',
      items:['Industry expertise and vertical knowledge','Sales cycle and historical conversion rate','SSO integration willingness and timeline','Referral volume capacity']
    }
  };
  var fillMap={v:'rgba(75,163,255,0.13)',r:'rgba(248,113,113,0.1)',c:'rgba(61,145,127,0.09)',e:'rgba(196,160,255,0.1)'};
  var defaultPoly='210,100 310,210 210,320 110,210';
  var active=null, mode='explore', scores={v:3,r:3,c:3,e:3};

  function scoreToPoint(k,score){
    var d=dims[k],maxR=160,r=maxR*(score/5);
    var dx=d.cx-210,dy=d.cy-210,len=Math.sqrt(dx*dx+dy*dy);
    return {x:210+(dx/len)*r,y:210+(dy/len)*r};
  }

  function updateScorePoly(){
    var v=scoreToPoint('v',scores.v),r=scoreToPoint('r',scores.r),c=scoreToPoint('c',scores.c),e=scoreToPoint('e',scores.e);
    var poly=document.getElementById('radarScorePoly');
    if(poly)poly.setAttribute('points',v.x+','+v.y+' '+r.x+','+r.y+' '+c.x+','+c.y+' '+e.x+','+e.y);
    var avg=(scores.v+scores.r+scores.c+scores.e)/4;
    var stroke=avg>=4?'rgba(75,163,255,0.7)':avg>=3?'rgba(75,163,255,0.45)':'rgba(248,113,113,0.5)';
    var fill=avg>=4?'rgba(75,163,255,0.08)':avg>=3?'rgba(75,163,255,0.04)':'rgba(248,113,113,0.05)';
    if(poly){poly.setAttribute('stroke',stroke);poly.setAttribute('fill',fill);}
  }

  var descriptors={
    v:{
      1:"Tax debt situations rarely come up in your client relationships, and there's no established process for introducing outside services. That's okay — it just means we'd be building from zero together.",
      2:"You encounter tax debt issues occasionally but haven't formalized a way to address them. There's latent opportunity here that a light referral structure could start to unlock.",
      3:"A meaningful portion of your clients carry unresolved tax debt, and you have some structure for introducing third-party services — though it's not yet a formal process.",
      4:"Tax-related financial distress is a recurring theme in your book, and you already have some muscle memory for cross-referring or co-servicing clients who need outside help.",
      5:"Tax debt is a consistent, high-volume issue across your client base, and you have established workflows for connecting clients with specialized services. The opportunity here is immediate and significant."
    },
    r:{
      1:"Your infrastructure is still maturing — legacy systems, limited compliance documentation, or existing vendor relationships that could create conflicts. Nothing insurmountable, but worth addressing before we go deeper.",
      2:"You have some operational gaps that would need to be resolved before a formal partnership — whether that's tech stack limitations, compliance gray areas, or competing arrangements that need to be clarified.",
      3:"Your tech infrastructure is reasonably current, there are no major competitive conflicts, and your compliance posture is generally solid — though not fully documented at a partner level.",
      4:"You're operationally clean: modern stack, documented compliance practices, no meaningful conflicts, and a clear path to data-sharing agreements if needed.",
      5:"You have a mature, well-documented operational environment — enterprise-grade compliance, clean vendor relationships, and the infrastructure to support a deep integration with confidence on both sides."
    },
    c:{
      1:"Right now, bandwidth for a new program is limited and there's no clear internal owner. A partnership would be difficult to activate without someone to carry it forward on your side.",
      2:"There's genuine interest but limited capacity — you'd want a very lightweight structure with minimal asks on your team, and co-promotion isn't realistic in the near term.",
      3:"You're open to co-promoting the program and can assign someone to manage the relationship, but internal bandwidth is limited and you'd need a light-touch integration to get started.",
      4:"You have a designated person who can own this, organizational appetite to actively promote it, and a clear picture of how revenue share aligns with your existing model.",
      5:"You're fully bought in — dedicated internal champion, executive alignment, and a willingness to deeply integrate this into how you serve clients. This is a strategic partnership, not a side arrangement."
    },
    e:{
      1:"Your team doesn't yet have much familiarity with tax resolution services or referral-based revenue models, and there's no existing motion to build from. A partnership would require significant onboarding.",
      2:"You have some relevant expertise and a loose cross-sell process, but conversion of referrals has been inconsistent. The capability is there — it just needs structure.",
      3:"Your team understands the space and has a working referral or cross-sell motion — you've done something like this before, even if not at full scale.",
      4:"You have strong industry expertise, a proven referral process, and a track record of converting these opportunities. Your clients trust your recommendations and act on them.",
      5:"You're operating at the highest level — deep domain knowledge, a high-conversion referral engine, and the volume to make a Strategic-tier partnership the obvious structure for both sides."
    }
  };

  var resultTiers=[
    {test:function(s,a){return a<2.2||Math.min(s.v,s.r,s.c,s.e)<=1;},
     bg:'rgba(248,113,113,0.06)',border:'rgba(248,113,113,0.18)',icon:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></svg>',
     title:"The timing might not be right — and that's worth knowing.",
     text:"Based on where you're landing, at least one dimension needs more foundation before a partnership would create real value for either of us. That's not a door closing — it's useful information. The organizations that work best with us tend to have a clear internal owner, some baseline client volume with tax exposure, and the operational footing to move quickly once they're in. If you're building toward that, we're happy to reconnect.",
     cta:null},
    {test:function(s,a){return a<3.0;},
     bg:'rgba(255,190,50,0.05)',border:'rgba(255,190,50,0.18)',icon:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 8 16 12 12 16 8 12 12 8"/></svg>',
     title:"There's something here — a few things to sort out first.",
     text:"You're showing up strong in some areas and lighter in others. That's actually pretty common at this stage — a lot of our best partners looked exactly like this when they first reached out. The FAQ walks through what the early partnership structure looks like and what we ask for on each side. Worth a read before we talk.",
     cta:'faq',ctaText:'See what the program actually asks for →',ctaStyle:'background:rgba(255,190,50,0.1);color:#f5c842;border:1px solid rgba(255,190,50,0.18)'},
    {test:function(s,a){return a<3.8&&Math.min(s.v,s.r,s.c,s.e)>=2;},
     bg:'rgba(11,95,216,0.06)',border:'rgba(75,163,255,0.18)',icon:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
     title:"This looks like a real fit.",
     text:"Across the dimensions that matter most for getting started, you're in a good place. A Direct partnership is probably the right structure — low overhead on your end, clear economics, and a path to deepening the relationship as volume grows. The intake form takes about five minutes and gets a conversation started.",
     cta:'apply',ctaText:'Start the conversation →',ctaStyle:'background:rgba(75,163,255,0.12);color:#4BA3FF;border:1px solid rgba(75,163,255,0.22)'},
    {test:function(s,a){return a>=3.8&&Math.min(s.v,s.r,s.c,s.e)>=3;},
     bg:'rgba(61,145,127,0.05)',border:'rgba(61,145,127,0.2)',icon:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 8 16 12 12 16 8 12 12 8"/></svg>',
     title:"Strong alignment across the board.",
     text:"You're scoring well on every dimension — which usually means an Enterprise or Strategic structure is worth exploring. Those tiers come with meaningfully higher revenue share, a dedicated account relationship, and a more tailored integration. Norm handles these conversations directly and can walk you through what that looks like for your specific situation.",
     cta:'apply',ctaText:'Let\'s talk about a deeper structure →',ctaStyle:'background:rgba(61,145,127,0.1);color:#3D917F;border:1px solid rgba(61,145,127,0.18)'}
  ];

  function updateResult(){
    var avg=(scores.v+scores.r+scores.c+scores.e)/4;
    var tier=resultTiers[0];
    for(var i=resultTiers.length-1;i>=0;i--){if(resultTiers[i].test(scores,avg)){tier=resultTiers[i];break;}}
    var el=document.getElementById('critResult');
    if(!el)return;
    el.style.background=tier.bg;el.style.borderColor=tier.border;
    var ctaHtml=tier.cta?['<button class="crit-result-cta" style="',tier.ctaStyle,'" onclick="showPage(&quot;',tier.cta,'&quot;">',(tier.ctaText||'Apply'),'</button>'].join(''):['<p style="font-size:15px;color:rgba(255,255,255,0.65);margin-top:4px">Address the low-scoring dimensions first, then revisit.</p>'].join('');
    el.innerHTML='<div class="crit-result-icon">'+tier.icon+'</div><div class="crit-result-body"><div class="crit-result-title">'+tier.title+'</div><p class="crit-result-text">'+tier.text+'</p>'+ctaHtml+'</div>';
    el.classList.add('show');
  }

  function fireSonar(k){
    var d=dims[k],g=document.getElementById('sonarGroup');
    if(!g)return;
    var c=document.createElementNS('http://www.w3.org/2000/svg','circle');
    c.setAttribute('cx',d.cx);c.setAttribute('cy',d.cy);c.setAttribute('r','6');
    c.setAttribute('fill','none');c.setAttribute('stroke',d.color);c.setAttribute('stroke-width','1.5');c.setAttribute('opacity','0.9');
    g.appendChild(c);
    var start=null,dur=1100;
    function step(ts){
      if(!start)start=ts;var p=Math.min((ts-start)/dur,1);
      c.setAttribute('r',6+p*88);c.setAttribute('opacity',0.85*(1-p));
      if(p<1)requestAnimationFrame(step);else if(c.parentNode)c.parentNode.removeChild(c);
    }
    requestAnimationFrame(step);
  }

  function hideTooltip(){var t=document.getElementById('critTooltip');if(t)t.classList.remove('visible');}

  function showTooltip(k){
    var d=dims[k],wrap=document.querySelector('.crit-radar-svg-wrap'),t=document.getElementById('critTooltip');
    if(!t||!wrap)return;
    document.getElementById('ctLabel').textContent=d.eyebrow;
    document.getElementById('ctLabel').style.color=d.color;
    document.getElementById('ctQuote').textContent=d.quote;
    document.getElementById('ctBody').textContent=d.body;
    var list=document.getElementById('ctList');list.innerHTML='';
    d.items.forEach(function(item){var li=document.createElement('li');li.textContent=item;list.appendChild(li);});
    var bmap={v:'rgba(75,163,255,0.3)',r:'rgba(248,113,113,0.3)',c:'rgba(61,145,127,0.25)',e:'rgba(196,160,255,0.25)'};
    t.style.borderColor=bmap[k];
    var w=wrap.offsetWidth,h=wrap.offsetHeight,pos=d.tipAnchor(w,h);
    t.style.left=Math.max(0,Math.min(pos.x,w-258))+'px';
    t.style.top=Math.max(0,Math.min(pos.y,h-300))+'px';
    t.classList.add('visible');
  }

  function resetExplore(){
    Object.keys(dims).forEach(function(k){
      var d=dims[k];
      var spoke=document.getElementById(d.spokeId),dot=document.getElementById(d.dotId),lbl=document.getElementById(d.lblId);
      if(spoke){spoke.setAttribute('stroke-width','1');spoke.style.opacity='0.5';}
      if(dot){dot.setAttribute('r','5');dot.style.opacity='1';}
      if(lbl)lbl.style.opacity='0.55';
    });
    var poly=document.getElementById('radarPoly');
    if(poly){poly.setAttribute('points',defaultPoly);poly.setAttribute('stroke','rgba(75,163,255,0.4)');poly.setAttribute('fill','rgba(11,95,216,0.12)');}
    hideTooltip();active=null;
  }

  function activateDim(k){
    if(mode!=='explore')return;
    if(active===k){resetExplore();return;}
    Object.keys(dims).forEach(function(j){
      if(j===k)return;
      var dj=dims[j];
      var spoke=document.getElementById(dj.spokeId),dot=document.getElementById(dj.dotId),lbl=document.getElementById(dj.lblId);
      if(spoke){spoke.setAttribute('stroke-width','1');spoke.style.opacity='0.18';}
      if(dot){dot.setAttribute('r','4');dot.style.opacity='0.35';}
      if(lbl)lbl.style.opacity='0.18';
    });
    active=k;
    var d=dims[k];
    var spoke=document.getElementById(d.spokeId),dot=document.getElementById(d.dotId),lbl=document.getElementById(d.lblId);
    if(spoke){spoke.setAttribute('stroke',d.color);spoke.setAttribute('stroke-width','2.5');spoke.style.opacity='1';}
    if(dot){dot.setAttribute('r','8');dot.setAttribute('fill',d.color);dot.style.opacity='1';}
    if(lbl)lbl.style.opacity='1';
    var poly=document.getElementById('radarPoly');
    if(poly){poly.setAttribute('points',d.polyPoints(165));poly.setAttribute('stroke',d.color);poly.setAttribute('fill',fillMap[k]);}
    fireSonar(k);showTooltip(k);
  }

  window.onSlider=function(k,val){
    scores[k]=parseInt(val);
    document.getElementById('scoreVal-'+k).textContent=val;
    var sl=document.getElementById('slider-'+k);
    if(sl)sl.style.setProperty('--pct',((val-1)/4*100)+'%');
    var desc=document.getElementById('desc-'+k);
    if(desc&&descriptors[k])desc.textContent=descriptors[k][parseInt(val)];
    updateScorePoly();updateResult();fireSonar(k);
  };

  window.setCritMode=function(m){
    mode=m;
    document.getElementById('modeExplore').classList.toggle('active',m==='explore');
    document.getElementById('modeAssess').classList.toggle('active',m==='assess');
    var aw=document.getElementById('critAssessWrap'),hint=document.getElementById('critHint'),
        tt=document.getElementById('critTooltip'),sp=document.getElementById('radarScorePoly'),mp=document.getElementById('radarPoly');
    if(m==='explore'){
      if(aw)aw.classList.remove('show');if(hint)hint.style.display='';
      if(sp)sp.style.display='none';if(mp)mp.style.display='';
      resetExplore();
    } else {
      hideTooltip();
      if(aw)aw.classList.add('show');if(hint)hint.style.display='none';
      if(sp){sp.style.display='';updateScorePoly();}if(mp)mp.style.display='none';
      Object.keys(dims).forEach(function(k){
        var d=dims[k];
        var spoke=document.getElementById(d.spokeId),dot=document.getElementById(d.dotId),lbl=document.getElementById(d.lblId);
        if(spoke){spoke.setAttribute('stroke',d.color);spoke.setAttribute('stroke-width','1.5');spoke.style.opacity='0.55';}
        if(dot){dot.setAttribute('r','5');dot.style.opacity='0.8';}
        if(lbl)lbl.style.opacity='0.65';
      });
      updateResult();
      ['v','r','c','e'].forEach(function(k){
        var sl=document.getElementById('slider-'+k);
        if(sl)sl.style.setProperty('--pct',((scores[k]-1)/4*100)+'%');
        var desc=document.getElementById('desc-'+k);
        if(desc&&descriptors[k])desc.textContent=descriptors[k][scores[k]];
      });
    }
  };

  function initRadar(){
    Object.keys(dims).forEach(function(k){
      ['dot-'+k,'lbl-'+k,'spoke-'+k].forEach(function(id){
        var el=document.getElementById(id);if(!el)return;
        el.style.cursor='pointer';
        el.addEventListener('mouseenter',function(){if(mode==='explore')activateDim(k);});
        el.addEventListener('touchstart',function(e){e.preventDefault();if(mode==='explore')activateDim(k);},{passive:false});
      });
    });
    var wrap=document.querySelector('.crit-radar-svg-wrap');
    if(wrap)wrap.addEventListener('mouseleave',function(){if(mode==='explore')resetExplore();});
    document.addEventListener('touchstart',function(e){
      var w=document.querySelector('.crit-radar-svg-wrap');
      if(w&&!w.contains(e.target)&&active&&mode==='explore')resetExplore();
    },{passive:true});
    var poly=document.getElementById('radarPoly');
    if(poly){poly.setAttribute('points','210,210 210,210 210,210 210,210');setTimeout(function(){poly.setAttribute('points',defaultPoly);},80);}
    Object.keys(dims).forEach(function(k){
      var lbl=document.getElementById('lbl-'+k);if(lbl)lbl.style.opacity='0.55';
      var spoke=document.getElementById(dims[k].spokeId);if(spoke)spoke.style.opacity='0.5';
    });
  }

  var origShowPage3=window.showPage;
  window.showPage=function(id){origShowPage3(id);if(id==='how')setTimeout(initRadar,120);};
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
  btn.style.background = 'rgba(61,145,127,0.1)';
  btn.style.color = 'var(--teal)';
  btn.style.borderColor = 'rgba(61,145,127,0.3)';
}

