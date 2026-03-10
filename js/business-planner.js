// --- Business Planner (90-Day GTM Roadmap Generator) ---

var BP_PRACTICE_TYPES = {
  'tax-prep': 'Tax Preparation Practice',
  'accounting': 'Accounting / Bookkeeping Firm',
  'financial-advisory': 'Financial Advisory / Wealth Management',
  'legal': 'Law Firm (Tax or Estate)',
  'insurance': 'Insurance Agency',
  'mortgage': 'Mortgage / Real Estate',
  'other': 'Other Professional Services'
};

var BP_AUDIENCES = {
  'individuals': 'Individual Taxpayers',
  'small-biz': 'Small Business Owners',
  'high-net-worth': 'High-Net-Worth Individuals',
  'self-employed': 'Self-Employed / Freelancers',
  'mixed': 'Mixed (Individuals + Businesses)'
};

var BP_BUDGETS = {
  '0': '$0 (Organic Only)',
  '250': 'Under $250/month',
  '500': '$250 - $500/month',
  '1000': '$500 - $1,000/month',
  '2500': '$1,000 - $2,500/month',
  '5000': '$2,500+/month'
};

// ── Carousel State ────────────────────────────────────────────
var _bpcStep = 1;
var _bpcTotal = 7;

function bpcGetSelectedVal(containerId) {
  var sel = document.querySelector('#' + containerId + ' .bpc-opt-selected');
  return sel ? sel.getAttribute('data-val') : '';
}

function bpcSelect(btn) {
  var siblings = btn.parentElement.querySelectorAll('.bpc-opt');
  siblings.forEach(function(s) { s.classList.remove('bpc-opt-selected'); });
  btn.classList.add('bpc-opt-selected');
}

function bpcShowStep(step) {
  var slides = document.querySelectorAll('.bpc-slide');
  slides.forEach(function(s) { s.classList.remove('bpc-slide-active'); });
  var target = document.querySelector('.bpc-slide[data-step="' + step + '"]');
  if (target) target.classList.add('bpc-slide-active');

  var label = document.getElementById('bpc-step-label');
  if (label) label.textContent = 'Step ' + step + ' of ' + _bpcTotal;
  var fill = document.getElementById('bpc-progress-fill');
  if (fill) fill.style.width = (step / _bpcTotal * 100) + '%';
  var back = document.getElementById('bpc-back');
  if (back) back.style.visibility = step === 1 ? 'hidden' : 'visible';
  var next = document.getElementById('bpc-next');
  if (next) {
    if (step === _bpcTotal) {
      next.innerHTML = 'Generate My Roadmap <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>';
    } else {
      next.innerHTML = 'Next <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';
    }
  }
  _bpcStep = step;
}

function bpcNext() {
  // Validate current step
  if (_bpcStep === 1 && !bpcGetSelectedVal('bpc-practice-opts')) {
    showToast('Please select your practice type', 'warning');
    return;
  }
  if (_bpcStep === _bpcTotal) {
    bpGenerateRoadmap();
    return;
  }
  bpcShowStep(_bpcStep + 1);
}

function bpcPrev() {
  if (_bpcStep > 1) bpcShowStep(_bpcStep - 1);
}

// Generate the 90-day roadmap based on carousel inputs
function bpGenerateRoadmap() {
  var practiceType = bpcGetSelectedVal('bpc-practice-opts');
  var clientCount = parseInt(document.getElementById('bp-client-count').value) || 0;
  var audience = bpcGetSelectedVal('bpc-audience-opts') || 'individuals';
  var budget = bpcGetSelectedVal('bpc-budget-opts') || '0';
  var refGoal = parseInt(document.getElementById('bp-ref-goal').value) || 5;
  var hasWebsite = document.getElementById('bp-has-website').checked;
  var hasSocial = document.getElementById('bp-has-social').checked;
  var hasEmail = document.getElementById('bp-has-email').checked;
  var geo = document.getElementById('bp-geo') ? document.getElementById('bp-geo').value : '';
  var years = document.getElementById('bp-years') ? document.getElementById('bp-years').value : '';
  var currentRefs = document.getElementById('bp-current-refs') ? document.getElementById('bp-current-refs').value : '';
  var season = bpGetSeason();

  if (!practiceType) {
    showToast('Please select your practice type', 'warning');
    return;
  }

  var inputs = {
    practiceType: practiceType,
    clientCount: clientCount,
    audience: audience,
    budget: parseInt(budget),
    refGoal: refGoal,
    hasWebsite: hasWebsite,
    hasSocial: hasSocial,
    hasEmail: hasEmail,
    geo: geo,
    years: years,
    currentRefs: currentRefs,
    season: season,
    timeline: parseInt(document.getElementById('bp-timeline') ? document.getElementById('bp-timeline').value : '90') || 90
  };

  var roadmap = bpBuildRoadmap(inputs);
  bpSaveInputs(inputs);
  bpRenderRoadmap(roadmap);
}

// Save/restore form inputs to localStorage
function bpSaveInputs(inputs) {
  try {
    localStorage.setItem('bp_saved_inputs', JSON.stringify(inputs));
  } catch (e) { /* ignore quota errors */ }
}

function bpLoadInputs() {
  try {
    var data = localStorage.getItem('bp_saved_inputs');
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
}

// Restore a previously saved roadmap on page load
function bpTryRestore() {
  var inputs = bpLoadInputs();
  if (!inputs || !inputs.practiceType) return;

  // Restore carousel selections
  var practiceOpt = document.querySelector('#bpc-practice-opts .bpc-opt[data-val="' + inputs.practiceType + '"]');
  if (practiceOpt) practiceOpt.classList.add('bpc-opt-selected');
  var el = document.getElementById('bp-client-count');
  if (el) el.value = inputs.clientCount || '';
  var audOpt = document.querySelector('#bpc-audience-opts .bpc-opt[data-val="' + inputs.audience + '"]');
  if (audOpt) audOpt.classList.add('bpc-opt-selected');
  el = document.getElementById('bp-ref-goal');
  if (el) el.value = inputs.refGoal || 5;
  var budOpt = document.querySelector('#bpc-budget-opts .bpc-opt[data-val="' + inputs.budget + '"]');
  if (budOpt) budOpt.classList.add('bpc-opt-selected');
  el = document.getElementById('bp-has-website');
  if (el) el.checked = !!inputs.hasWebsite;
  el = document.getElementById('bp-has-social');
  if (el) el.checked = !!inputs.hasSocial;
  el = document.getElementById('bp-has-email');
  if (el) el.checked = !!inputs.hasEmail;
  el = document.getElementById('bp-geo');
  if (el && inputs.geo) el.value = inputs.geo;
  el = document.getElementById('bp-years');
  if (el && inputs.years) el.value = inputs.years;
  el = document.getElementById('bp-current-refs');
  if (el && inputs.currentRefs) el.value = inputs.currentRefs;

  // Regenerate and render roadmap with current season
  var freshInputs = Object.assign({}, inputs, { season: bpGetSeason() });
  var roadmap = bpBuildRoadmap(freshInputs);
  bpRenderRoadmap(roadmap);
}

function bpGetSeason() {
  var month = new Date().getMonth();
  if (month >= 0 && month <= 3) return 'tax-season';
  if (month >= 4 && month <= 6) return 'post-season';
  if (month >= 7 && month <= 9) return 'fall';
  return 'year-end';
}

function bpBuildRoadmap(inputs) {
  var weeks = [];
  var practiceLabel = BP_PRACTICE_TYPES[inputs.practiceType] || 'Your Practice';
  var audienceLabel = BP_AUDIENCES[inputs.audience] || 'your clients';
  var monthlyRef = Math.ceil(inputs.refGoal / 3);
  var isNewToReferrals = inputs.clientCount < 50;
  var hasDigital = inputs.hasWebsite || inputs.hasSocial;
  var hasBudget = inputs.budget > 0;

  // MONTH 1: Foundation
  var m1Tasks = [];
  m1Tasks.push({
    title: 'Complete Your Partner Onboarding',
    desc: 'Finish all training modules in the Onboarding section. Focus on "Tax Resolution Basics" and "Handling Client Objections" -- these are the two modules that directly drive referral conversions.',
    type: 'setup',
    priority: 'high'
  });
  m1Tasks.push({
    title: 'Audit Your Client Base for Tax Debt Signals',
    desc: 'Review your existing ' + (inputs.clientCount || 'active') + ' clients for red flags: unfiled returns, large balances owed on transcripts, IRS notices mentioned in prior conversations, payment plan discussions, or clients who disappeared after receiving CP2000 or CP14 notices. Create a list of your top 10 prospects.',
    type: 'action',
    priority: 'high'
  });
  m1Tasks.push({
    title: 'Set Up Your Referral Conversation Framework',
    desc: 'Prepare 3 natural conversation openers for your practice type. For ' + practiceLabel.toLowerCase() + ' settings, the best approach is mentioning it during routine interactions: "I noticed something on your return I want to flag -- have you addressed that balance with the IRS?" Print the Referral Playbook scripts and keep them at your desk.',
    type: 'action',
    priority: 'high'
  });

  if (inputs.hasEmail) {
    m1Tasks.push({
      title: 'Launch Your First Tax Debt Awareness Email',
      desc: 'Use the Email Template Builder in Marketing Kit to create a "Did You Know?" email. Subject line: "The IRS is increasing enforcement -- here\'s what to do if you owe." Send to your full client list. This single email typically generates 2-4 leads for practices with ' + (inputs.clientCount > 200 ? '200+' : inputs.clientCount + '') + ' clients.',
      type: 'marketing',
      priority: 'high'
    });
  }

  if (hasDigital && hasBudget) {
    m1Tasks.push({
      title: 'Create Your First Social Ad Campaign',
      desc: 'Use the Ad Builder tool to create co-branded ads for ' + (inputs.hasSocial ? 'Facebook and Instagram' : 'LinkedIn') + '. Target: ' + audienceLabel.toLowerCase() + ' within 25 miles of your office. Budget: $' + Math.min(inputs.budget, 250) + '/month. Ad angle: "Owe $10K+ to the IRS? Free consultation -- we partner with tax resolution specialists to help."',
      type: 'marketing',
      priority: 'medium'
    });
  }

  // New practice onboarding boost
  if (inputs.years === 'new') {
    m1Tasks.push({
      title: 'New Practice Fast-Start: Join 2 Local Business Groups',
      desc: 'As a newer practice, your network is your biggest growth lever. Join your local chamber of commerce and one industry-specific group (CPA society, bar association, etc.). Introduce yourself as someone who helps clients with tax debt. New practices that network actively generate referrals 40% faster.',
      type: 'growth',
      priority: 'high'
    });
  }

  // Geography-specific outreach
  if (inputs.geo === 'rural') {
    m1Tasks.push({
      title: 'Community-Based Outreach Strategy',
      desc: 'In rural areas, word-of-mouth is the dominant channel. Focus on community events, church bulletin boards, and local print ads. Partner with the local H&R Block or Liberty Tax -- they handle volume but don\'t do resolution. One rural partnership can yield 5-8 referrals per quarter.',
      type: 'marketing',
      priority: 'medium'
    });
  } else if (inputs.geo === 'urban') {
    m1Tasks.push({
      title: 'Urban Digital Presence Quick-Win',
      desc: 'In metro areas, competition is higher but volume is too. Ensure your Google Business Profile mentions "tax debt help" and "IRS resolution referrals." Urban practices see 3x more inbound leads from search than suburban or rural.',
      type: 'marketing',
      priority: 'medium'
    });
  }

  // Current referrals context
  if (inputs.currentRefs === '10+') {
    m1Tasks.push({
      title: 'Scale What Already Works',
      desc: 'You are already generating 10+ referrals monthly -- that puts you in the top 5% of partners. Focus on systematizing: document your process, train staff, and consider upgrading to Pro or Platinum tier for higher per-referral earnings. At your volume, a tier upgrade could mean an extra $1,000-2,500 per month.',
      type: 'growth',
      priority: 'high'
    });
  }

  m1Tasks.push({
    title: 'Start the 30-Day Momentum Challenge',
    desc: 'Open the 30-Day Momentum Challenge in Resources -- it gives you one small daily action for 30 straight days to build referral habits. Partners who complete it generate 2.5x more referrals in their first quarter than those who skip it. It only takes 5-10 minutes per day and tracks your streak automatically.',
    type: 'action',
    priority: 'high'
  });

  m1Tasks.push({
    title: 'Build Your Referral Landing Page',
    desc: 'Use the Landing Page Builder to create a custom referral page you can share with prospects and network contacts. Pick a template, add your info, and publish it in under 10 minutes. Partners with a dedicated landing page convert 35% more referrals than those using generic links.',
    type: 'marketing',
    priority: 'medium'
  });

  m1Tasks.push({
    title: 'Make Your First 3 Referral Conversations',
    desc: 'Use your audit list from week 1. Start with the 3 easiest -- clients you have strong relationships with who you know have tax issues. Goal: ' + monthlyRef + ' referrals submitted this month. Even if they decline, the practice of asking builds your referral muscle.',
    type: 'action',
    priority: 'high'
  });

  // MONTH 2: Scale
  var m2Tasks = [];
  m2Tasks.push({
    title: 'Implement the "Every Appointment" Habit',
    desc: 'Add a tax debt check to every client interaction this month. It takes 30 seconds: "Before we wrap up, I want to make sure -- are you current with the IRS on everything? Any notices or balances you\'re worried about?" This question alone is responsible for 60% of referrals among top-performing partners.',
    type: 'action',
    priority: 'high'
  });

  if (inputs.practiceType === 'tax-prep' || inputs.practiceType === 'accounting') {
    m2Tasks.push({
      title: 'Run a "Back Tax" File Review',
      desc: 'Pull files for clients who haven\'t filed in 1+ years or who had balances due. Cross-reference with your tax software. These are your warmest leads -- they already know they have a problem. Call each one: "Hi [name], I was reviewing your account and wanted to check in about your [year] return. We have a resource that can help."',
      type: 'action',
      priority: 'high'
    });
  }

  m2Tasks.push({
    title: 'Build Your Referral Network',
    desc: 'Identify 3-5 professionals in adjacent fields who encounter tax debt clients: bankruptcy attorneys, financial planners, real estate agents handling distressed sales, or divorce attorneys. Offer a co-referral arrangement. Send them your Co-Brand landing page and suggest a 15-minute intro call.',
    type: 'growth',
    priority: 'medium'
  });

  if (inputs.hasEmail) {
    m2Tasks.push({
      title: 'Send a Case Study Email',
      desc: 'Use the Email Template Builder. Subject: "How we helped a client reduce $47K in tax debt to $8,200." People respond to real results. Include a call-to-action: "Know someone in this situation? I can connect them with the same team." Social proof drives 3x more referral inquiries than generic awareness emails.',
      type: 'marketing',
      priority: 'medium'
    });
  }

  if (inputs.hasSocial) {
    m2Tasks.push({
      title: 'Start a Weekly Social Post Schedule',
      desc: 'Post 2-3x per week using Marketing Kit assets. Mix: (1) educational -- "5 signs the IRS is about to levy your account," (2) social proof -- "Another client\'s $32K tax debt resolved," (3) call-to-action -- "Free tax debt evaluation for a limited time." Use the Social Post Builder to batch-create a month of content in 30 minutes.',
      type: 'marketing',
      priority: 'medium'
    });
  }

  m2Tasks.push({
    title: 'Generate Custom Scripts with AI Script Builder',
    desc: 'Open the AI Script Builder in your portal. Enter your practice type and client scenario, and it generates word-for-word referral scripts for phone calls, emails, and in-person conversations. Create 3-5 scripts tailored to your most common client situations and save them for quick access.',
    type: 'action',
    priority: 'medium'
  });

  m2Tasks.push({
    title: 'Create Co-Branded Ads with Ad Maker',
    desc: 'Use the Ad Maker tool to generate professional social media ads with your branding. Upload your logo, pick a template, and it produces ready-to-post images for Facebook, Instagram, and LinkedIn. Partners who run co-branded ads see 40% higher click-through rates than generic tax resolution ads.',
    type: 'marketing',
    priority: 'medium'
  });

  m2Tasks.push({
    title: 'Optimize Based on Month 1 Results',
    desc: 'Review your Referrals dashboard. Which conversation approach got the most "yes" responses? Which clients said no and why? Adjust your pitch. Target: ' + monthlyRef + ' referrals this month. If month 1 was below target, double down on the "every appointment" habit -- consistency beats volume.',
    type: 'action',
    priority: 'high'
  });

  // MONTH 3: Systematize
  var m3Tasks = [];
  m3Tasks.push({
    title: 'Create Your Referral System Documentation',
    desc: 'Write down your process so it\'s repeatable: (1) When to bring it up, (2) Exact words that work, (3) How to handle objections, (4) Follow-up timeline. If you have team members, train them this month. A practice that systematizes referrals generates 3-5x more than one relying on memory.',
    type: 'growth',
    priority: 'high'
  });

  m3Tasks.push({
    title: 'Launch a Client Referral Incentive',
    desc: 'Create a simple program: "Know someone with IRS trouble? If they get help through our partner program, I\'ll give you a $50 credit on your next service." Print cards using the One-Pager Builder. Give 5 cards to every client at their next appointment. Client-to-client referrals convert at 2x the rate of cold outreach.',
    type: 'growth',
    priority: 'high'
  });

  if (hasBudget && inputs.budget >= 500) {
    m3Tasks.push({
      title: 'Scale Your Paid Advertising',
      desc: 'Based on month 1-2 ad performance, increase budget to $' + Math.min(inputs.budget, 1000) + '/month on your best-performing platform. Retarget website visitors who didn\'t convert. Test new ad angles: IRS deadline urgency, penalty calculator, or free consultation offer. At this budget, expect 8-15 leads per month.',
      type: 'marketing',
      priority: 'medium'
    });
  }

  if (inputs.season === 'tax-season') {
    m3Tasks.push({
      title: 'Tax Season Push: Extension Client Outreach',
      desc: 'Every extension filer is a potential referral. When filing extensions, ask: "Is the extension because of a balance you\'re not sure how to handle?" Run a dedicated "Tax Season Resolution" email blast. This is the highest-conversion period of the year -- top partners generate 40% of annual referrals in Q1.',
      type: 'action',
      priority: 'high'
    });
  } else if (inputs.season === 'year-end') {
    m3Tasks.push({
      title: 'Year-End Tax Planning Conversations',
      desc: 'During year-end planning meetings, ask about unresolved prior-year issues: "Before we plan for next year, let\'s make sure we\'ve addressed everything from previous years." Clients are more receptive to resolving old issues when thinking about their financial future.',
      type: 'action',
      priority: 'high'
    });
  }

  m3Tasks.push({
    title: 'Use the Client Qualifier AI Tool',
    desc: 'Open the Client Qualifier in your portal\'s AI Tools. Input a client scenario and it instantly tells you whether that person is a good candidate for tax resolution, what programs they might qualify for, and the best way to bring it up. Use it before every referral conversation to go in prepared.',
    type: 'action',
    priority: 'medium'
  });

  m3Tasks.push({
    title: 'Share Your Landing Page with Referral Network',
    desc: 'Revisit the landing page you built in Month 1. Update it with your results and testimonials from the first 60 days. Share the live link with your referral network partners -- bankruptcy attorneys, financial advisors, and other professionals you identified in Month 2. A branded page gives them something concrete to send their clients.',
    type: 'marketing',
    priority: 'medium'
  });

  m3Tasks.push({
    title: 'Complete 2+ CE Webinars for Deeper Expertise',
    desc: 'The CE Webinars section has IRS-approved continuing education on tax resolution topics. Complete at least 2 modules this month -- "Advanced OIC Strategies" and "Identifying Levy vs. Lien Situations" are the highest-rated. Deeper knowledge directly translates to more confident referral conversations and better client outcomes.',
    type: 'setup',
    priority: 'medium'
  });

  m3Tasks.push({
    title: 'Review and Plan Your Next Quarter',
    desc: 'Check your Revenue Calculator with actual numbers from the past 90 days. Compare projected vs. actual referrals and earnings. Set your Q2 target at 25-50% above Q1. Identify your top referral source (conversations, email, social, network) and allocate 70% of effort there. Diminishing returns happen when you spread too thin.',
    type: 'growth',
    priority: 'high'
  });

  // Build the insight cards
  var insights = [];
  insights.push({
    title: 'Your Estimated ' + (inputs.timeline || 90) + '-Day Revenue',
    value: '$' + (inputs.refGoal * 420).toLocaleString(),
    desc: 'Based on ' + inputs.refGoal + ' referrals at $420 avg commission (Premium tier). Pro tier would yield $' + (inputs.refGoal * 525).toLocaleString() + '.'
  });
  insights.push({
    title: 'Client Base Referral Potential',
    value: Math.round(inputs.clientCount * 0.08) + ' leads',
    desc: 'Industry data shows ~8% of any client base has unresolved tax debt. With ' + inputs.clientCount + ' clients, that\'s roughly ' + Math.round(inputs.clientCount * 0.08) + ' potential referrals already in your book.'
  });
  insights.push({
    title: 'Best Channel for Your Practice',
    value: bpBestChannel(inputs),
    desc: bpBestChannelDesc(inputs)
  });

  return {
    practiceLabel: practiceLabel,
    inputs: inputs,
    months: [
      { label: 'Month 1: Foundation', subtitle: 'Weeks 1-4', tasks: m1Tasks },
      { label: 'Month 2: Scale', subtitle: 'Weeks 5-8', tasks: m2Tasks },
      { label: 'Month 3: Systematize', subtitle: 'Weeks 9-12', tasks: m3Tasks }
    ],
    insights: insights
  };
}

function bpBestChannel(inputs) {
  if (inputs.clientCount >= 200 && inputs.hasEmail) return 'Email Outreach';
  if (inputs.hasSocial && inputs.budget >= 500) return 'Paid Social Ads';
  if (inputs.practiceType === 'tax-prep' || inputs.practiceType === 'accounting') return 'In-Person Conversations';
  if (inputs.hasWebsite) return 'Website + SEO';
  return 'Direct Client Conversations';
}

function bpBestChannelDesc(inputs) {
  if (inputs.clientCount >= 200 && inputs.hasEmail) {
    return 'With ' + inputs.clientCount + ' clients and email capability, your highest-ROI play is targeted email campaigns. One well-crafted email to your list can generate 5-10 leads at zero cost.';
  }
  if (inputs.hasSocial && inputs.budget >= 500) {
    return 'With $' + inputs.budget + '/mo budget and social presence, paid ads will scale fastest. Tax debt ads on Facebook typically cost $15-40 per lead.';
  }
  if (inputs.practiceType === 'tax-prep' || inputs.practiceType === 'accounting') {
    return 'As a tax/accounting practice, you already have face time with the exact right audience. The "every appointment" habit is your highest-converting channel at zero cost.';
  }
  return 'Start with direct conversations -- no budget required, highest conversion rate. Add digital channels as you build momentum.';
}

function bpRenderRoadmap(roadmap) {
  var html = '';
  var saved = bpLoadProgress();

  // Count total tasks
  var totalTasks = 0;
  roadmap.months.forEach(function(m) { totalTasks += m.tasks.length; });
  var doneCount = 0;
  for (var k in saved) { if (saved[k]) doneCount++; }
  // Clamp to actual total
  if (doneCount > totalTasks) doneCount = totalTasks;
  var pct = totalTasks > 0 ? Math.round((doneCount / totalTasks) * 100) : 0;

  // Action bar
  html += '<div class="bp-action-bar">';
  var _tlDays = roadmap.inputs.timeline || 90;
  var _tlSuffix = (typeof BP_TIMELINES !== 'undefined' && BP_TIMELINES[_tlDays]) ? BP_TIMELINES[_tlDays].suffix : 'Growth Roadmap';
  html += '<div class="bp-action-title">Your ' + _tlDays + '-Day ' + _tlSuffix + '</div>';
  html += '<div class="bp-action-btns">';
  html += '<button class="bp-action-btn bp-btn-pdf" onclick="bpPrintRoadmap()"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> Save as PDF</button>';
  html += '<button class="bp-action-btn bp-btn-ai" id="bp-ai-btn" onclick="bpGenerateAIRoadmap()"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg> Enhance with AI</button>';
  html += '<button class="bp-action-btn bp-btn-slides" onclick="bpExportSlides()"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg> Export Slides</button>';
  html += '<button class="bp-action-btn bp-btn-reset" onclick="bpResetPlanner()"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 105.64-11.36L1 10"/></svg> Start Over</button>';
  // M5P1C2 + M5P2C2: Competitor Intelligence + Scenario Modeler
  html += '<button class="bp-action-btn bp-btn-compete" onclick="bpcShowCompetitors()"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg> Competitors</button>';
  html += '<button class="bp-action-btn bp-btn-scenario" onclick="bpsShowScenarios()"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> Scenarios</button>';
  // M5P3C2: Partnership Growth Playbook Generator
  html += '<button class="bp-action-btn bp-btn-playbook" onclick="bppShowPlaybook()"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg> Playbook</button>';
  html += '</div></div>';

  // Industry benchmarks panel
  html += '<div id="bp-benchmarks" class="bp-benchmarks" style="display:none"></div>';

  // Weekly check-in prompt
  html += '<div id="bp-weekly-checkin" style="display:none"></div>';

  // Actual vs Projected referrals
  html += '<div id="bp-actuals" class="bp-actuals" style="display:none"></div>';

  // Visual Gantt timeline
  html += '<div id="bp-gantt" class="bp-gantt" style="display:none"></div>';

  // Email drip toggle
  var dripEnabled = false;
  try { dripEnabled = localStorage.getItem('bp_email_drip') === 'true'; } catch (e) { /* ignore */ }
  html += '<div class="bp-drip-bar">';
  html += '<div class="bp-drip-left">';
  html += '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>';
  html += '<div><div class="bp-drip-title">Weekly Task Reminders</div>';
  html += '<div class="bp-drip-desc">Get your upcoming tasks delivered to your inbox every Monday</div></div>';
  html += '</div>';
  html += '<label class="bp-drip-toggle"><input type="checkbox" id="bp-drip-check"' + (dripEnabled ? ' checked' : '') + ' onchange="bpToggleDrip(this.checked)"><span class="bp-drip-slider"></span></label>';
  html += '</div>';

  // Progress bar
  html += '<div class="bp-progress-wrap">';
  html += '<div class="bp-progress-header">';
  html += '<div class="bp-progress-label"><span id="bp-done-count">' + doneCount + '</span> of ' + totalTasks + ' tasks completed</div>';
  html += '<div class="bp-progress-pct" id="bp-progress-pct">' + pct + '%</div>';
  html += '</div>';
  html += '<div class="bp-progress-bar"><div class="bp-progress-fill" id="bp-progress-fill" style="width:' + pct + '%"></div></div>';
  html += '</div>';

  // Insights row
  html += '<div class="bp-insights-row">';
  roadmap.insights.forEach(function(ins) {
    html += '<div class="bp-insight-card">';
    html += '<div class="bp-insight-val">' + ins.value + '</div>';
    html += '<div class="bp-insight-title">' + ins.title + '</div>';
    html += '<div class="bp-insight-desc">' + ins.desc + '</div>';
    html += '</div>';
  });
  html += '</div>';

  // ROI Tracker (M5P3)
  html += '<div id="bp-roi-tracker" class="bp-roi-tracker" style="display:none"></div>';

  // Drip schedule (M5P3)
  html += '<div id="bp-drip-schedule" class="bp-drip-schedule" style="display:none"></div>';

  // "What if?" comparison cards
  var currentRev = roadmap.inputs.refGoal * 420;
  var proRev = roadmap.inputs.refGoal * 525;
  var doubleRev = (roadmap.inputs.refGoal * 2) * 420;
  html += '<div class="bp-whatif">';
  html += '<div class="bp-whatif-title">What If?</div>';
  html += '<div class="bp-whatif-row">';
  html += '<div class="bp-whatif-card">';
  html += '<div class="bp-whatif-label">Upgrade to Pro Tier</div>';
  html += '<div class="bp-whatif-val">$' + proRev.toLocaleString() + '</div>';
  html += '<div class="bp-whatif-delta">+$' + (proRev - currentRev).toLocaleString() + ' more per quarter</div>';
  html += '<div class="bp-whatif-desc">Pro tier pays $525/referral instead of $420. Same effort, 25% more revenue.</div>';
  html += '</div>';
  html += '<div class="bp-whatif-card">';
  html += '<div class="bp-whatif-label">Double Your Referrals</div>';
  html += '<div class="bp-whatif-val">$' + doubleRev.toLocaleString() + '</div>';
  html += '<div class="bp-whatif-delta">+$' + (doubleRev - currentRev).toLocaleString() + ' more per quarter</div>';
  html += '<div class="bp-whatif-desc">Partners who add 1 new referral per week typically double within 90 days by following this roadmap consistently.</div>';
  html += '</div>';
  html += '</div></div>';

  // Portal Toolkit callout
  html += '<div class="bp-toolkit">';
  html += '<div class="bp-toolkit-header">';
  html += '<div class="bp-toolkit-title">Your Launch Toolkit</div>';
  html += '<div class="bp-toolkit-desc">These tools are built into your partner portal. Use them alongside this roadmap to hit your targets faster.</div>';
  html += '</div>';
  html += '<div class="bp-toolkit-grid">';

  var tools = [
    { icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>', name: 'Page Builder', desc: 'Create a branded referral landing page', section: 'portal-sec-page-builder' },
    { icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>', name: '30-Day Challenge', desc: 'Daily actions to build referral habits', section: 'portal-sec-challenge' },
    { icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>', name: 'AI Script Builder', desc: 'Generate custom referral scripts', section: 'portal-sec-ai-scripts' },
    { icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>', name: 'Ad Maker', desc: 'Co-branded social media ads', section: 'portal-sec-ai-admaker' },
    { icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>', name: 'Marketing Kit', desc: 'Templates, emails, and assets', section: 'portal-sec-marketing' },
    { icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>', name: 'CE Webinars', desc: 'IRS-approved continuing education', section: 'portal-sec-ce' },
    { icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>', name: 'Client Qualifier', desc: 'AI-powered prospect screening', section: 'portal-sec-ai-qualifier' },
    { icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="12" y2="14"/></svg>', name: 'Revenue Calculator', desc: 'Model referral earnings scenarios', section: 'portal-sec-calculator' }
  ];

  tools.forEach(function(tool) {
    html += '<a class="bp-toolkit-card" href="javascript:void(0)" onclick="bpGoToSection(\'' + tool.section + '\')">';
    html += '<div class="bp-toolkit-icon">' + tool.icon + '</div>';
    html += '<div class="bp-toolkit-name">' + tool.name + '</div>';
    html += '<div class="bp-toolkit-card-desc">' + tool.desc + '</div>';
    html += '</a>';
  });

  html += '</div></div>';

  // Timeline
  var taskIndex = 0;
  html += '<div class="bp-timeline">';
  roadmap.months.forEach(function(month, mi) {
    html += '<div class="bp-month">';
    html += '<div class="bp-month-header">';
    html += '<div class="bp-month-num">' + (mi + 1) + '</div>';
    html += '<div><div class="bp-month-label">' + month.label + '</div>';
    html += '<div class="bp-month-sub">' + month.subtitle + '</div></div>';
    html += '</div>';
    html += '<div class="bp-task-list">';
    month.tasks.forEach(function(task) {
      var tid = 'bp-t-' + taskIndex;
      var isDone = saved[tid] === true;
      var typeIcon = bpTypeIcon(task.type);
      var prioClass = task.priority === 'high' ? 'bp-prio-high' : 'bp-prio-med';
      var doneClass = isDone ? ' bp-task-done' : '';
      html += '<div class="bp-task' + doneClass + '" id="' + tid + '-wrap">';
      html += '<label class="bp-task-check" for="' + tid + '">';
      html += '<input type="checkbox" id="' + tid + '"' + (isDone ? ' checked' : '') + ' onchange="bpToggleTask(\'' + tid + '\', this.checked, ' + totalTasks + ')">';
      html += '<span class="bp-check-box"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>';
      html += '</label>';
      html += '<div class="bp-task-type bp-type-' + task.type + '">' + typeIcon + '</div>';
      html += '<div class="bp-task-body">';
      html += '<div class="bp-task-head">';
      html += '<div class="bp-task-title">' + task.title + '</div>';
      html += '<span class="bp-prio ' + prioClass + '">' + task.priority + '</span>';
      html += '</div>';
      html += '<div class="bp-task-desc">' + task.desc + '</div>';
      // Execute button (M5P3)
      var _execMap = (typeof BP_TASK_TOOLS !== 'undefined') ? BP_TASK_TOOLS[task.title] : null;
      if (_execMap && !isDone) {
        html += '<button class="bp-exec-btn" onclick="bpExecuteTask(\'' + task.title.replace(/'/g, "\\'") + '\')">';
        html += '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg> ';
        html += _execMap.label;
        html += '</button>';
      }
      html += '</div>';
      html += '</div>';
      taskIndex++;
    });
    html += '</div>';
    html += '</div>';
  });
  html += '</div>';

  // Store total for progress updates
  window._bpTotalTasks = totalTasks;

  var result = document.getElementById('bp-result');
  var form = document.getElementById('bp-form-wrap');
  if (result) {
    result.innerHTML = html;
    bpLinkTools(result);
    result.style.display = 'block';
  }
  if (form) form.style.display = 'none';

  // Scroll to results
  if (result) {
    setTimeout(function() { result.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 60);
  }

  // Render benchmarks
  setTimeout(function() { bpRenderBenchmarks(roadmap.inputs); }, 100);

  // Render progress dashboard components (M5P2)
  bpSaveStartDate();
  setTimeout(function() { bpRenderGantt(roadmap); }, 150);
  setTimeout(function() { bpRenderActuals(roadmap.inputs); }, 180);
  setTimeout(function() { bpCheckWeeklyCheckin(); }, 200);
  setTimeout(function() { bpSyncWithChallenge(); }, 250);

  // Render actionable output components (M5P3)
  setTimeout(function() { bpRenderROITracker(roadmap.inputs); }, 280);
  setTimeout(function() { bpRenderDripSchedule(); }, 300);

  // Restore AI insights if available
  bpTryRestoreAI();
}

// Save/load task progress from localStorage
function bpLoadProgress() {
  try {
    var data = localStorage.getItem('bp_task_progress');
    return data ? JSON.parse(data) : {};
  } catch (e) {
    return {};
  }
}

function bpSaveProgress(progress) {
  try {
    localStorage.setItem('bp_task_progress', JSON.stringify(progress));
  } catch (e) { /* ignore quota errors */ }
}

function bpToggleTask(taskId, checked, totalTasks) {
  var progress = bpLoadProgress();
  if (checked) {
    progress[taskId] = true;
  } else {
    delete progress[taskId];
  }
  bpSaveProgress(progress);

  // Toggle done class on task wrapper
  var wrap = document.getElementById(taskId + '-wrap');
  if (wrap) {
    if (checked) {
      wrap.classList.add('bp-task-done');
    } else {
      wrap.classList.remove('bp-task-done');
    }
  }

  // Update progress bar
  var doneCount = 0;
  for (var k in progress) { if (progress[k]) doneCount++; }
  if (doneCount > totalTasks) doneCount = totalTasks;
  var pct = totalTasks > 0 ? Math.round((doneCount / totalTasks) * 100) : 0;

  var countEl = document.getElementById('bp-done-count');
  var pctEl = document.getElementById('bp-progress-pct');
  var fillEl = document.getElementById('bp-progress-fill');
  if (countEl) countEl.textContent = doneCount;
  if (pctEl) pctEl.textContent = pct + '%';
  if (fillEl) fillEl.style.width = pct + '%';
}

function bpTypeIcon(type) {
  var icons = {
    'setup': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4"/></svg>',
    'action': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>',
    'marketing': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
    'growth': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>'
  };
  return icons[type] || icons['action'];
}

// Replace tool mentions in task descriptions with clickable portal links
var BP_TOOL_LINKS = [
  { text: '30-Day Momentum Challenge', section: 'portal-sec-challenge' },
  { text: 'Landing Page Builder', section: 'portal-sec-page-builder' },
  { text: 'AI Script Builder', section: 'portal-sec-ai-scripts' },
  { text: 'Ad Maker', section: 'portal-sec-ai-admaker' },
  { text: 'Client Qualifier', section: 'portal-sec-ai-qualifier' },
  { text: 'CE Webinars', section: 'portal-sec-ce' },
  { text: 'Email Template Builder', section: 'portal-sec-marketing' },
  { text: 'Social Post Builder', section: 'portal-sec-marketing' },
  { text: 'One-Pager Builder', section: 'portal-sec-marketing' },
  { text: 'Ad Builder', section: 'portal-sec-marketing' },
  { text: 'Marketing Kit', section: 'portal-sec-marketing' },
  { text: 'Referral Playbook', section: 'portal-sec-playbook' },
  { text: 'Revenue Calculator', section: 'portal-sec-calculator' },
  { text: 'Referrals dashboard', section: 'portal-sec-referrals' },
  { text: 'Onboarding section', section: 'portal-sec-training' },
  { text: 'Co-Brand landing page', section: 'portal-sec-marketing' }
];

function bpLinkTools(container) {
  var descs = container.querySelectorAll('.bp-task-desc');
  descs.forEach(function(el) {
    var html = el.innerHTML;
    BP_TOOL_LINKS.forEach(function(link) {
      if (html.indexOf(link.text) === -1) return;
      var linkHtml = '<a class="bp-tool-link" href="javascript:void(0)" onclick="bpGoToSection(\'' + link.section + '\')">' + link.text + '</a>';
      html = html.replace(link.text, linkHtml);
    });
    el.innerHTML = html;
  });
}

function bpGoToSection(sectionId) {
  // Find the nav item that activates this section and click it
  var navItems = document.querySelectorAll('.portal-nav-item');
  for (var i = 0; i < navItems.length; i++) {
    var onclick = navItems[i].getAttribute('onclick') || '';
    if (onclick.indexOf(sectionId) !== -1) {
      navItems[i].click();
      // Scroll the section into view
      var sec = document.getElementById(sectionId);
      if (sec) {
        setTimeout(function() { sec.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 100);
      }
      return;
    }
  }
}

// Toggle weekly email drip (mock for now)
function bpToggleDrip(enabled) {
  try { localStorage.setItem('bp_email_drip', enabled ? 'true' : 'false'); } catch (e) { /* ignore */ }
  if (typeof showToast === 'function') {
    if (enabled) {
      showToast('Weekly reminders enabled! You will receive tasks every Monday.', 'success');
    } else {
      showToast('Weekly reminders disabled.', 'info');
    }
  }
}

// ── PDF Document Builder ─────────────────────────────────────
// Builds a proper formatted document instead of screenshotting the dashboard.
// Cover page is edge-to-edge blue, then body pages use document typography.

function bpBuildPdfDoc() {
  var inputs = bpLoadInputs();
  if (!inputs || !inputs.practiceType) return null;

  var roadmap = bpBuildRoadmap(Object.assign({}, inputs, { season: bpGetSeason() }));
  var practiceLabel = roadmap.practiceLabel;
  var refGoal = inputs.refGoal || 5;
  var revenue = '$' + (refGoal * 420).toLocaleString();
  var proRevenue = '$' + (refGoal * 525).toLocaleString();
  var clientCount = inputs.clientCount || 0;
  var monthlyRef = Math.ceil(refGoal / 3);
  var bestChannel = bpBestChannel(inputs);
  var bestChannelDesc = bpBestChannelDesc(inputs);
  var potentialLeads = Math.round(clientCount * 0.08);

  var today = new Date();
  var monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var dateStr = monthNames[today.getMonth()] + ' ' + today.getDate() + ', ' + today.getFullYear();

  // Calculate end date (90 days out)
  var endDate = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000);
  var endDateStr = monthNames[endDate.getMonth()] + ' ' + endDate.getDate() + ', ' + endDate.getFullYear();

  var doc = document.createElement('div');
  doc.className = 'bp-pdf-doc';

  var html = '';

  // ── PAGE 1: COVER (edge-to-edge blue, no margins) ──
  html += '<div class="bp-pdf-cover">';
  html += '<div class="bp-cover-inner">';
  html += '<div class="bp-cover-logo"><img src="images/logo-white.svg" alt="Community Tax" class="bp-cover-logo-img"></div>';
  html += '<div class="bp-cover-title">Your 90-Day<br>Growth Roadmap</div>';
  html += '<div class="bp-cover-divider"></div>';
  html += '<div class="bp-cover-meta">';
  html += '<div class="bp-cover-meta-row"><span class="bp-cover-label">Practice Type</span><span class="bp-cover-val">' + practiceLabel + '</span></div>';
  html += '<div class="bp-cover-meta-row"><span class="bp-cover-label">Client Base</span><span class="bp-cover-val">' + (clientCount > 0 ? clientCount + ' Active Clients' : 'Getting Started') + '</span></div>';
  html += '<div class="bp-cover-meta-row"><span class="bp-cover-label">90-Day Goal</span><span class="bp-cover-val">' + refGoal + ' Referrals</span></div>';
  html += '<div class="bp-cover-meta-row"><span class="bp-cover-label">Projected Revenue</span><span class="bp-cover-val">' + revenue + '</span></div>';
  html += '<div class="bp-cover-meta-row"><span class="bp-cover-label">Timeline</span><span class="bp-cover-val">' + dateStr + ' - ' + endDateStr + '</span></div>';
  html += '</div>';
  html += '<div class="bp-cover-footer">Personalized growth plan generated from your Business Planner inputs.<br>Community Tax Enterprise Partner Program</div>';
  html += '</div></div>';

  // ── PAGE 2+: EXECUTIVE SUMMARY ──
  html += '<div class="bpd-page bpd-summary">';
  html += '<div class="bpd-page-header"><span>90-Day Growth Roadmap</span><span>' + practiceLabel + '</span></div>';

  html += '<h1 class="bpd-h1">Executive Summary</h1>';
  html += '<p class="bpd-lead">This roadmap is your personalized 90-day action plan for building a sustainable referral pipeline through the Community Tax Enterprise Partner Program. Every task is tailored to your practice type, client base, and growth goals.</p>';

  html += '<div class="bpd-summary-grid">';
  html += '<div class="bpd-summary-card">';
  html += '<div class="bpd-summary-val">' + revenue + '</div>';
  html += '<div class="bpd-summary-label">Projected 90-Day Revenue</div>';
  html += '<div class="bpd-summary-note">Based on ' + refGoal + ' referrals at $420 avg commission (Premium tier). Pro tier: ' + proRevenue + '.</div>';
  html += '</div>';
  html += '<div class="bpd-summary-card">';
  html += '<div class="bpd-summary-val">' + (potentialLeads > 0 ? potentialLeads + ' Leads' : 'New Pipeline') + '</div>';
  html += '<div class="bpd-summary-label">Client Base Potential</div>';
  html += '<div class="bpd-summary-note">' + (potentialLeads > 0 ? 'Industry data shows ~8% of any client base has unresolved tax debt. With ' + clientCount + ' clients, roughly ' + potentialLeads + ' are already in your book.' : 'As you build your client base, expect roughly 8% to have unresolved tax debt -- your primary referral source.') + '</div>';
  html += '</div>';
  html += '<div class="bpd-summary-card">';
  html += '<div class="bpd-summary-val">' + bestChannel + '</div>';
  html += '<div class="bpd-summary-label">Recommended Primary Channel</div>';
  html += '<div class="bpd-summary-note">' + bestChannelDesc + '</div>';
  html += '</div>';
  html += '</div>';

  // Why this works section
  html += '<h2 class="bpd-h2">Why This Plan Works</h2>';
  html += '<p class="bpd-body">This roadmap follows a proven three-phase approach used by the highest-earning partners in the program:</p>';
  html += '<ul class="bpd-list">';
  html += '<li><strong>Month 1 -- Foundation:</strong> Build awareness and start conversations. The goal is not volume -- it is developing the habit of identifying and referring tax debt cases. Partners who establish this habit early generate 3x more referrals over their first year.</li>';
  html += '<li><strong>Month 2 -- Scale:</strong> Expand beyond your existing client base. Add referral network partners, launch digital outreach, and systematize what worked in Month 1. This is where the compounding effect kicks in.</li>';
  html += '<li><strong>Month 3 -- Systematize:</strong> Turn your referral activity into a repeatable system. Document your process, train team members, and set up the infrastructure to sustain growth without relying on memory or motivation alone.</li>';
  html += '</ul>';
  html += '<p class="bpd-body">Each task includes specific context for your practice type (' + practiceLabel.toLowerCase() + ') and your stated goal of ' + refGoal + ' referrals in 90 days -- roughly ' + monthlyRef + ' per month.</p>';

  html += '</div>'; // end page

  // ── MONTH PAGES ──
  var taskGlobalIndex = 0;
  var monthInsights = [
    {
      title: 'Why Foundation Matters',
      body: 'The biggest mistake new partners make is jumping straight to marketing without building referral awareness into their daily workflow. Month 1 is about wiring the habit into every client interaction. Partners who skip this phase and go straight to ads spend 2-3x more per referral and burn out faster. Start with the people who already trust you -- your existing clients.'
    },
    {
      title: 'The Compounding Effect',
      body: 'Month 2 is where effort turns into momentum. Every referral network contact you add becomes a recurring source -- a bankruptcy attorney who sends you one client this month might send three next month once they see the results. Every email campaign builds your reputation as someone who can help with tax debt. This is also when your best channel (' + bestChannel.toLowerCase() + ') starts producing consistent results.'
    },
    {
      title: 'Systems Beat Motivation',
      body: 'By Month 3, the initial excitement has worn off, but your pipeline should be growing. The partners who succeed long-term are the ones who build systems -- documented scripts, trained staff, automated email sequences, and regular check-ins with their referral network. A good system produces referrals even on the weeks when you are busy with other work.'
    }
  ];

  roadmap.months.forEach(function(month, mi) {
    html += '<div class="bpd-page bpd-month">';
    html += '<div class="bpd-page-header"><span>90-Day Growth Roadmap</span><span>' + month.label + '</span></div>';

    html += '<h1 class="bpd-h1">' + month.label + '</h1>';
    html += '<p class="bpd-subtitle">' + month.subtitle + ' -- ' + month.tasks.length + ' action items</p>';

    // Month insight box
    html += '<div class="bpd-insight-box">';
    html += '<div class="bpd-insight-title">' + monthInsights[mi].title + '</div>';
    html += '<p class="bpd-insight-body">' + monthInsights[mi].body + '</p>';
    html += '</div>';

    // Tasks as numbered list with full descriptions
    month.tasks.forEach(function(task, ti) {
      var num = ti + 1;
      var prioTag = task.priority === 'high' ? '<span class="bpd-prio-high">HIGH PRIORITY</span>' : '<span class="bpd-prio-med">MEDIUM</span>';
      html += '<div class="bpd-task">';
      html += '<div class="bpd-task-num">' + num + '</div>';
      html += '<div class="bpd-task-content">';
      html += '<div class="bpd-task-header">';
      html += '<span class="bpd-task-title">' + task.title + '</span> ' + prioTag;
      html += '</div>';
      html += '<p class="bpd-task-desc">' + task.desc + '</p>';
      html += '</div>';
      html += '</div>';
      taskGlobalIndex++;
    });

    // Monthly target reminder
    html += '<div class="bpd-month-target">';
    html += '<strong>Monthly Target:</strong> ' + monthlyRef + ' referrals submitted. ';
    if (mi === 0) {
      html += 'Focus on quality over quantity this month -- each conversation teaches you something.';
    } else if (mi === 1) {
      html += 'You should be hitting your stride. If you are behind, double down on the "every appointment" habit.';
    } else {
      html += 'Review your 90-day numbers against this plan. Set your Q2 target 25-50% higher.';
    }
    html += '</div>';

    html += '</div>'; // end page
  });

  // ── WHAT-IF / GROWTH SCENARIOS PAGE ──
  var currentRev = refGoal * 420;
  var proRev = refGoal * 525;
  var doubleRev = (refGoal * 2) * 420;
  var yearRev = refGoal * 4 * 420;

  html += '<div class="bpd-page bpd-scenarios">';
  html += '<div class="bpd-page-header"><span>90-Day Growth Roadmap</span><span>Growth Scenarios</span></div>';

  html += '<h1 class="bpd-h1">Growth Scenarios</h1>';
  html += '<p class="bpd-lead">Here is what your referral business looks like at different performance levels. Small improvements compound quickly.</p>';

  html += '<table class="bpd-table">';
  html += '<thead><tr><th>Scenario</th><th>Referrals</th><th>Quarterly Revenue</th><th>Annual Projection</th></tr></thead>';
  html += '<tbody>';
  html += '<tr><td>Current Plan (Premium Tier)</td><td>' + refGoal + '</td><td>' + revenue + '</td><td>$' + yearRev.toLocaleString() + '</td></tr>';
  html += '<tr><td>Upgrade to Pro Tier</td><td>' + refGoal + '</td><td>$' + proRev.toLocaleString() + '</td><td>$' + (proRev * 4).toLocaleString() + '</td></tr>';
  html += '<tr><td>Double Your Referrals</td><td>' + (refGoal * 2) + '</td><td>$' + doubleRev.toLocaleString() + '</td><td>$' + (doubleRev * 4).toLocaleString() + '</td></tr>';
  html += '<tr class="bpd-table-highlight"><td>Pro Tier + Double Referrals</td><td>' + (refGoal * 2) + '</td><td>$' + ((refGoal * 2) * 525).toLocaleString() + '</td><td>$' + ((refGoal * 2) * 525 * 4).toLocaleString() + '</td></tr>';
  html += '</tbody></table>';

  html += '<h2 class="bpd-h2">How to Move Up</h2>';
  html += '<ul class="bpd-list">';
  html += '<li><strong>Premium to Pro Tier:</strong> Consistently hit ' + refGoal + '+ referrals per quarter. Pro tier pays $525 per referral instead of $420 -- a 25% raise for the same effort. That is an extra $' + ((proRev - currentRev)).toLocaleString() + ' per quarter.</li>';
  html += '<li><strong>Double Your Volume:</strong> Add one new referral per week beyond your current pace. The easiest way is adding a second channel (e.g., email campaigns if you are currently only doing in-person conversations). Partners who use 2+ channels average 2.3x more referrals.</li>';
  html += '<li><strong>Maximize Both:</strong> The partners earning $50K+ annually almost always combine tier upgrades with consistent volume growth. It is not about working harder -- it is about building systems that produce referrals predictably.</li>';
  html += '</ul>';

  html += '</div>'; // end growth scenarios page

  // ── YOUR LAUNCH TOOLKIT PAGE ──
  html += '<div class="bpd-page bpd-toolkit">';
  html += '<div class="bpd-page-header"><span>90-Day Growth Roadmap</span><span>Your Launch Toolkit</span></div>';

  html += '<h1 class="bpd-h1">Your Launch Toolkit</h1>';
  html += '<p class="bpd-lead">These tools are built into your partner portal and referenced throughout this roadmap. Each one is designed to save you time and increase your referral conversion rate.</p>';

  html += '<div class="bpd-tools-grid">';
  var toolDescs = [
    { name: 'Landing Page Builder', desc: 'Create a professional, branded referral page in minutes. Share the link with clients and network contacts. Partners with a dedicated page convert 35% more referrals.' },
    { name: 'AI Script Builder', desc: 'Generate custom word-for-word scripts for phone calls, emails, and in-person conversations. Tailored to your practice type and client scenarios.' },
    { name: 'Ad Maker', desc: 'Create co-branded social media ads with your logo and Community Tax branding. Ready to post on Facebook, Instagram, and LinkedIn.' },
    { name: 'Client Qualifier', desc: 'AI-powered tool that screens prospects before you refer them. Input a scenario and get instant guidance on eligibility, programs, and conversation approach.' },
    { name: 'Marketing Kit', desc: 'Pre-built email templates, social posts, one-pagers, and presentation decks. Download, customize, and deploy.' },
    { name: 'Revenue Calculator', desc: 'Model different referral scenarios to see projected earnings by tier, volume, and timeframe.' },
    { name: 'CE Webinars', desc: 'IRS-approved continuing education on tax resolution topics. Deeper expertise means more confident referral conversations.' }
  ];
  toolDescs.forEach(function(tool) {
    html += '<div class="bpd-tool-item">';
    html += '<div class="bpd-tool-name">' + tool.name + '</div>';
    html += '<div class="bpd-tool-desc">' + tool.desc + '</div>';
    html += '</div>';
  });
  html += '</div>';

  // 30-Day Challenge CTA
  html += '<div class="bpd-challenge-cta">';
  html += '<div class="bpd-challenge-cta-inner">';
  html += '<h2 class="bpd-challenge-title">Start the 30-Day Momentum Challenge</h2>';
  html += '<p class="bpd-challenge-desc">The single most impactful thing you can do right now. One small daily action for 30 days builds the referral habits that make this entire roadmap work. Partners who complete it generate 2.5x more referrals in their first quarter. It takes 5 minutes today.</p>';
  html += '<p class="bpd-challenge-action">Open your Partner Portal and click <strong>30-Day Challenge</strong> in the Resources menu to begin.</p>';
  html += '</div>';
  html += '</div>';

  html += '</div>'; // end launch toolkit page

  // ── FINAL PAGE: NEXT STEPS ──
  html += '<div class="bpd-page bpd-nextsteps">';
  html += '<div class="bpd-page-header"><span>90-Day Growth Roadmap</span><span>Next Steps</span></div>';

  html += '<h1 class="bpd-h1">Your Next Steps</h1>';
  html += '<p class="bpd-lead">You have the plan. Here is how to put it into action starting today.</p>';

  html += '<div class="bpd-steps-list">';
  html += '<div class="bpd-step-item"><div class="bpd-step-num">1</div><div class="bpd-step-body"><strong>Log into your Partner Portal</strong> and bookmark it. This is your home base for the next 90 days. Everything referenced in this document lives there.</div></div>';
  html += '<div class="bpd-step-item"><div class="bpd-step-num">2</div><div class="bpd-step-body"><strong>Start the 30-Day Momentum Challenge</strong> -- it takes 5 minutes today and builds the daily habit that makes everything else in this plan easier.</div></div>';
  html += '<div class="bpd-step-item"><div class="bpd-step-num">3</div><div class="bpd-step-body"><strong>Audit your client list this week.</strong> Identify your top 10 prospects who may have unresolved tax debt. These are your warmest leads and easiest first referrals.</div></div>';
  html += '<div class="bpd-step-item"><div class="bpd-step-num">4</div><div class="bpd-step-body"><strong>Make your first referral conversation within 7 days.</strong> It does not have to be perfect. The goal is to start. Every top-earning partner says the same thing: the first one was the hardest.</div></div>';
  html += '<div class="bpd-step-item"><div class="bpd-step-num">5</div><div class="bpd-step-body"><strong>Check back on this roadmap every Monday.</strong> Open the Business Planner in your portal, check off completed tasks, and review what is next. Consistency beats intensity.</div></div>';
  html += '</div>';

  html += '<div class="bpd-closing">';
  html += '<p>This roadmap was generated on ' + dateStr + ' based on your specific inputs. As your practice grows and your results come in, regenerate it to get updated recommendations.</p>';
  html += '<p><strong>Questions?</strong> Use the Knowledge Base in your portal or reach out to your partner success manager.</p>';
  html += '<div class="bpd-closing-brand">Community Tax Enterprise Partner Program</div>';
  html += '</div>';

  html += '</div>'; // end page

  doc.innerHTML = html;
  return doc;
}

// Export roadmap as PDF using html2pdf.js
function bpPrintRoadmap() {
  if (typeof html2pdf === 'undefined') {
    showToast('PDF library still loading -- try again in a moment.', 'warning');
    return;
  }

  var pdfDoc = bpBuildPdfDoc();
  if (!pdfDoc) {
    showToast('No roadmap data found -- generate a roadmap first.', 'warning');
    return;
  }

  showToast('Generating PDF -- this may take a moment...', 'info');

  CTAX_PDF.renderPdf(pdfDoc, '90-Day-Growth-Roadmap.pdf').then(function() {
    showToast('PDF downloaded!', 'success');
  }).catch(function(err) {
    console.error('PDF export error:', err);
    showToast('PDF export failed -- try again.', 'error');
  });
}

function bpResetPlanner() {
  var result = document.getElementById('bp-result');
  var form = document.getElementById('bp-form-wrap');
  if (result) { result.innerHTML = ''; result.style.display = 'none'; }
  if (form) form.style.display = 'block';
  // Reset carousel to step 1
  document.querySelectorAll('.bpc-opt-selected').forEach(function(o) { o.classList.remove('bpc-opt-selected'); });
  var cc = document.getElementById('bp-client-count'); if (cc) cc.value = '';
  var rg = document.getElementById('bp-ref-goal'); if (rg) rg.value = '5';
  var hw = document.getElementById('bp-has-website'); if (hw) hw.checked = false;
  var hs = document.getElementById('bp-has-social'); if (hs) hs.checked = false;
  var he = document.getElementById('bp-has-email'); if (he) he.checked = false;
  var geo = document.getElementById('bp-geo'); if (geo) geo.value = '';
  var yrs = document.getElementById('bp-years'); if (yrs) yrs.value = '';
  var cr = document.getElementById('bp-current-refs'); if (cr) cr.value = '';
  bpcShowStep(1);
  // Clear saved progress and inputs when starting over
  try {
    localStorage.removeItem('bp_task_progress');
    localStorage.removeItem('bp_saved_inputs');
    localStorage.removeItem('bp_ai_roadmap');
  } catch (e) { /* ignore */ }
}

// ═══ M5P2C1: PROGRESS DASHBOARD -- GANTT TIMELINE + TRACKING ═══

// Render visual Gantt-style timeline with task completion, milestones, and projections
function bpRenderGantt(roadmap) {
  var container = document.getElementById('bp-gantt');
  if (!container) return;
  var saved = bpLoadProgress();
  var timeline = roadmap.inputs.timeline || 90;
  var totalDays = timeline;
  var startDate = new Date();
  try {
    var savedInputs = bpLoadInputs();
    if (savedInputs && savedInputs._startDate) startDate = new Date(savedInputs._startDate);
  } catch (e) {}

  // Build flat task array with month mapping
  var tasks = [];
  var monthBoundaries = [];
  var taskIdx = 0;
  roadmap.months.forEach(function(month, mi) {
    var monthStart = Math.round(mi * (totalDays / roadmap.months.length));
    var monthEnd = Math.round((mi + 1) * (totalDays / roadmap.months.length));
    monthBoundaries.push({ start: monthStart, end: monthEnd, label: month.label });
    month.tasks.forEach(function(task, ti) {
      var taskDayStart = monthStart + Math.round(ti * (monthEnd - monthStart) / month.tasks.length);
      var taskDayEnd = monthStart + Math.round((ti + 1) * (monthEnd - monthStart) / month.tasks.length);
      tasks.push({
        id: 'bp-t-' + taskIdx,
        title: task.title,
        type: task.type,
        priority: task.priority,
        dayStart: taskDayStart,
        dayEnd: taskDayEnd,
        monthIndex: mi,
        done: saved['bp-t-' + taskIdx] === true
      });
      taskIdx++;
    });
  });

  // Calculate days elapsed since roadmap start
  var now = new Date();
  var elapsed = Math.max(0, Math.round((now - startDate) / (1000 * 60 * 60 * 24)));
  if (elapsed > totalDays) elapsed = totalDays;
  var elapsedPct = (elapsed / totalDays) * 100;

  // Projected vs actual
  var totalTasks = tasks.length;
  var doneCount = tasks.filter(function(t) { return t.done; }).length;
  var expectedDone = 0;
  tasks.forEach(function(t) { if (t.dayEnd <= elapsed) expectedDone++; });

  var html = '<div class="bp-gantt-header">';
  html += '<div class="bp-gantt-title">';
  html += '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>';
  html += ' Progress Timeline</div>';
  html += '<div class="bp-gantt-legend">';
  html += '<span class="bp-gantt-leg"><span class="bp-gantt-leg-dot bp-gantt-dot-done"></span>Done</span>';
  html += '<span class="bp-gantt-leg"><span class="bp-gantt-leg-dot bp-gantt-dot-todo"></span>To Do</span>';
  html += '<span class="bp-gantt-leg"><span class="bp-gantt-leg-dot bp-gantt-dot-late"></span>Overdue</span>';
  html += '</div></div>';

  // Gantt chart area
  html += '<div class="bp-gantt-chart">';

  // Month headers
  html += '<div class="bp-gantt-months">';
  monthBoundaries.forEach(function(mb) {
    var widthPct = ((mb.end - mb.start) / totalDays) * 100;
    html += '<div class="bp-gantt-month" style="width:' + widthPct + '%">' + mb.label.split(':')[0] + '</div>';
  });
  html += '</div>';

  // Task bars
  html += '<div class="bp-gantt-bars">';
  tasks.forEach(function(task) {
    var leftPct = (task.dayStart / totalDays) * 100;
    var widthPct = Math.max(3, ((task.dayEnd - task.dayStart) / totalDays) * 100);
    var cls = 'bp-gantt-bar bp-gantt-type-' + task.type;
    if (task.done) {
      cls += ' bp-gantt-done';
    } else if (task.dayEnd <= elapsed) {
      cls += ' bp-gantt-late';
    }
    html += '<div class="bp-gantt-row">';
    html += '<div class="bp-gantt-row-label" title="' + task.title + '">' + task.title.substring(0, 30) + (task.title.length > 30 ? '...' : '') + '</div>';
    html += '<div class="bp-gantt-row-track">';
    html += '<div class="' + cls + '" style="left:' + leftPct + '%;width:' + widthPct + '%"></div>';
    html += '</div></div>';
  });
  html += '</div>';

  // Today marker
  if (elapsed > 0 && elapsed < totalDays) {
    html += '<div class="bp-gantt-today" style="left:calc(' + elapsedPct + '% + 120px)">';
    html += '<div class="bp-gantt-today-line"></div>';
    html += '<div class="bp-gantt-today-label">Day ' + elapsed + '</div>';
    html += '</div>';
  }

  // Milestone markers
  html += '<div class="bp-gantt-milestones">';
  monthBoundaries.forEach(function(mb, i) {
    if (i === 0) return;
    var leftPct = (mb.start / totalDays) * 100;
    html += '<div class="bp-gantt-milestone" style="left:calc(' + leftPct + '% + 120px)">';
    html += '<div class="bp-gantt-ms-diamond"></div>';
    html += '<div class="bp-gantt-ms-label">' + mb.label.split(':')[0] + ' Start</div>';
    html += '</div>';
  });
  html += '</div>';

  html += '</div>'; // close chart

  // Status comparison
  html += '<div class="bp-gantt-status">';
  var diff = doneCount - expectedDone;
  var statusIcon, statusText, statusClass;
  if (elapsed === 0) {
    statusIcon = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>';
    statusText = 'Your roadmap starts today! Complete tasks to see your progress here.';
    statusClass = 'bp-status-neutral';
  } else if (diff >= 2) {
    statusIcon = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>';
    statusText = 'Ahead of schedule! You\'ve completed ' + doneCount + ' tasks vs ' + expectedDone + ' expected by Day ' + elapsed + '. Keep this momentum!';
    statusClass = 'bp-status-ahead';
  } else if (diff >= 0) {
    statusIcon = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>';
    statusText = 'On track! ' + doneCount + ' tasks done, ' + expectedDone + ' expected by Day ' + elapsed + '.';
    statusClass = 'bp-status-ontrack';
  } else {
    statusIcon = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
    statusText = Math.abs(diff) + ' tasks behind schedule. You\'ve done ' + doneCount + ' vs ' + expectedDone + ' expected by Day ' + elapsed + '. Focus on overdue items (shown in red).';
    statusClass = 'bp-status-behind';
  }
  html += '<div class="bp-gantt-status-card ' + statusClass + '">';
  html += '<div class="bp-gantt-status-icon">' + statusIcon + '</div>';
  html += '<div class="bp-gantt-status-text">' + statusText + '</div>';
  html += '</div>';

  // Mini stats
  html += '<div class="bp-gantt-stats">';
  html += '<div class="bp-gantt-stat"><div class="bp-gantt-stat-val">' + doneCount + '/' + totalTasks + '</div><div class="bp-gantt-stat-label">Tasks Done</div></div>';
  html += '<div class="bp-gantt-stat"><div class="bp-gantt-stat-val">Day ' + elapsed + '/' + totalDays + '</div><div class="bp-gantt-stat-label">Timeline</div></div>';
  var velocity = elapsed > 0 ? (doneCount / elapsed * 7).toFixed(1) : '0';
  html += '<div class="bp-gantt-stat"><div class="bp-gantt-stat-val">' + velocity + '</div><div class="bp-gantt-stat-label">Tasks/Week</div></div>';
  var projectedEnd = doneCount > 0 ? Math.round((totalTasks / doneCount) * elapsed) : totalDays;
  html += '<div class="bp-gantt-stat"><div class="bp-gantt-stat-val">Day ' + Math.min(projectedEnd, totalDays * 2) + '</div><div class="bp-gantt-stat-label">Projected Finish</div></div>';
  html += '</div>';
  html += '</div>';

  container.innerHTML = html;
  container.style.display = 'block';
}

// Weekly check-in system
function bpCheckWeeklyCheckin() {
  var container = document.getElementById('bp-weekly-checkin');
  if (!container) return;
  var now = new Date();
  var lastCheckin = null;
  try { lastCheckin = localStorage.getItem('bp_last_checkin'); } catch (e) {}

  // Show if last checkin was 7+ days ago or never
  var showCheckin = false;
  if (!lastCheckin) {
    showCheckin = true;
  } else {
    var daysSince = Math.round((now - new Date(lastCheckin)) / (1000 * 60 * 60 * 24));
    showCheckin = daysSince >= 7;
  }

  if (!showCheckin) {
    container.style.display = 'none';
    return;
  }

  var html = '<div class="bp-checkin-card">';
  html += '<div class="bp-checkin-header">';
  html += '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>';
  html += '<span>Weekly Check-In</span>';
  html += '</div>';
  html += '<p class="bp-checkin-prompt">Quick pulse check -- how did this week go?</p>';
  html += '<div class="bp-checkin-fields">';
  html += '<div class="bp-checkin-field">';
  html += '<label class="bp-checkin-label">Referrals submitted this week</label>';
  html += '<input type="number" id="bp-checkin-refs" class="bp-checkin-input" min="0" value="0" placeholder="0">';
  html += '</div>';
  html += '<div class="bp-checkin-field">';
  html += '<label class="bp-checkin-label">New conversations started</label>';
  html += '<input type="number" id="bp-checkin-convos" class="bp-checkin-input" min="0" value="0" placeholder="0">';
  html += '</div>';
  html += '<div class="bp-checkin-field">';
  html += '<label class="bp-checkin-label">Biggest win or lesson learned</label>';
  html += '<input type="text" id="bp-checkin-win" class="bp-checkin-input" placeholder="e.g. Got 2 referrals from one lunch meeting">';
  html += '</div>';
  html += '</div>';
  html += '<div class="bp-checkin-actions">';
  html += '<button class="btn btn-p" onclick="bpSubmitCheckin()">Submit Check-In</button>';
  html += '<button class="btn btn-g" onclick="bpDismissCheckin()">Skip This Week</button>';
  html += '</div>';
  html += '</div>';
  container.innerHTML = html;
  container.style.display = 'block';
}

function bpSubmitCheckin() {
  var refs = parseInt(document.getElementById('bp-checkin-refs').value) || 0;
  var convos = parseInt(document.getElementById('bp-checkin-convos').value) || 0;
  var win = document.getElementById('bp-checkin-win').value || '';
  var now = new Date().toISOString().slice(0, 10);

  // Save checkin history
  var history = [];
  try {
    var raw = localStorage.getItem('bp_checkin_history');
    if (raw) history = JSON.parse(raw);
  } catch (e) {}

  history.push({ date: now, refs: refs, convos: convos, win: win });
  try {
    localStorage.setItem('bp_checkin_history', JSON.stringify(history));
    localStorage.setItem('bp_last_checkin', now);
  } catch (e) {}

  // Update actual referrals tracker
  var totalActualRefs = 0;
  history.forEach(function(h) { totalActualRefs += (h.refs || 0); });
  try { localStorage.setItem('bp_actual_refs', totalActualRefs.toString()); } catch (e) {}

  var container = document.getElementById('bp-weekly-checkin');
  if (container) container.style.display = 'none';

  if (typeof showToast === 'function') {
    showToast('Check-in saved! ' + refs + ' referrals logged this week.', 'success');
  }

  // Refresh the Gantt and actuals display
  bpRefreshActuals();
}

function bpDismissCheckin() {
  try { localStorage.setItem('bp_last_checkin', new Date().toISOString().slice(0, 10)); } catch (e) {}
  var container = document.getElementById('bp-weekly-checkin');
  if (container) container.style.display = 'none';
}

// Actual vs Projected referrals panel
function bpRenderActuals(inputs) {
  var container = document.getElementById('bp-actuals');
  if (!container) return;

  var timeline = inputs.timeline || 90;
  var refGoal = inputs.refGoal || 5;
  var now = new Date();
  var startDate = now;
  try {
    var saved = bpLoadInputs();
    if (saved && saved._startDate) startDate = new Date(saved._startDate);
  } catch (e) {}

  var weeksElapsed = Math.max(1, Math.round((now - startDate) / (1000 * 60 * 60 * 24 * 7)));
  var totalWeeks = Math.ceil(timeline / 7);
  var weeklyTarget = refGoal / totalWeeks;

  // Get actual data from check-in history
  var history = [];
  try {
    var raw = localStorage.getItem('bp_checkin_history');
    if (raw) history = JSON.parse(raw);
  } catch (e) {}

  var totalActual = 0;
  history.forEach(function(h) { totalActual += (h.refs || 0); });
  var projectedByNow = Math.round(weeklyTarget * weeksElapsed * 10) / 10;
  var diff = totalActual - projectedByNow;
  var onTrack = diff >= 0;

  var html = '<div class="bp-actuals-header">';
  html += '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>';
  html += '<span>Actual vs Projected Referrals</span>';
  html += '</div>';

  // Visual comparison bars
  html += '<div class="bp-actuals-chart">';
  var maxVal = Math.max(refGoal, totalActual, projectedByNow, 1);

  // Projected bar
  html += '<div class="bp-actuals-row">';
  html += '<div class="bp-actuals-label">Projected (Week ' + weeksElapsed + ')</div>';
  html += '<div class="bp-actuals-bar-wrap"><div class="bp-actuals-bar bp-actuals-bar-projected" style="width:' + Math.min(100, (projectedByNow / maxVal) * 100) + '%"></div></div>';
  html += '<div class="bp-actuals-val">' + projectedByNow.toFixed(1) + '</div>';
  html += '</div>';

  // Actual bar
  html += '<div class="bp-actuals-row">';
  html += '<div class="bp-actuals-label">Actual</div>';
  html += '<div class="bp-actuals-bar-wrap"><div class="bp-actuals-bar bp-actuals-bar-actual' + (onTrack ? ' bp-actuals-ahead' : ' bp-actuals-behind') + '" style="width:' + Math.min(100, (totalActual / maxVal) * 100) + '%"></div></div>';
  html += '<div class="bp-actuals-val">' + totalActual + '</div>';
  html += '</div>';

  // Goal bar
  html += '<div class="bp-actuals-row">';
  html += '<div class="bp-actuals-label">' + timeline + '-Day Goal</div>';
  html += '<div class="bp-actuals-bar-wrap"><div class="bp-actuals-bar bp-actuals-bar-goal" style="width:100%"></div></div>';
  html += '<div class="bp-actuals-val">' + refGoal + '</div>';
  html += '</div>';
  html += '</div>';

  // Delta message
  html += '<div class="bp-actuals-delta ' + (onTrack ? 'bp-delta-pos' : 'bp-delta-neg') + '">';
  if (onTrack) {
    html += '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg> ';
    html += 'You\'re ' + Math.abs(diff).toFixed(1) + ' referrals ahead of schedule!';
  } else {
    html += '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/></svg> ';
    html += Math.abs(diff).toFixed(1) + ' referrals behind target. Submit your weekly check-in to update!';
  }
  html += '</div>';

  // Check-in history mini-table
  if (history.length > 0) {
    html += '<div class="bp-actuals-history">';
    html += '<div class="bp-actuals-hist-title">Check-In History</div>';
    html += '<div class="bp-actuals-hist-table">';
    html += '<div class="bp-actuals-hist-head"><span>Week</span><span>Referrals</span><span>Conversations</span><span>Notes</span></div>';
    history.slice(-5).forEach(function(h, i) {
      html += '<div class="bp-actuals-hist-row">';
      html += '<span>' + h.date + '</span>';
      html += '<span>' + (h.refs || 0) + '</span>';
      html += '<span>' + (h.convos || 0) + '</span>';
      html += '<span class="bp-actuals-hist-win">' + (h.win || '-') + '</span>';
      html += '</div>';
    });
    html += '</div></div>';
  }

  container.innerHTML = html;
  container.style.display = 'block';
}

function bpRefreshActuals() {
  var inputs = bpLoadInputs();
  if (inputs) bpRenderActuals(inputs);
}

// Challenge sync: detect overlapping tasks and auto-complete
function bpSyncWithChallenge() {
  if (typeof chGetState !== 'function') return;
  var state = chGetState();
  if (!state || !state.completedDays) return;
  var progress = bpLoadProgress();
  var changed = false;

  // Map challenge days to business planner task IDs
  var challengeMap = {
    1: 'bp-t-0',   // Day 1: setup onboarding -> first BP task
    4: 'bp-t-2',   // Day 4: email script -> marketing task
    9: 'bp-t-3',   // Day 9: follow-up script -> action task
    14: 'bp-t-5',  // Day 14: social post -> marketing
    21: 'bp-t-8',  // Day 21: advanced outreach -> growth
    28: 'bp-t-10'  // Day 28: systematize -> growth
  };

  for (var dayNum in challengeMap) {
    if (state.completedDays[dayNum] && !progress[challengeMap[dayNum]]) {
      progress[challengeMap[dayNum]] = true;
      changed = true;
      // Visually update the task
      var wrap = document.getElementById(challengeMap[dayNum] + '-wrap');
      if (wrap) wrap.classList.add('bp-task-done');
      var cb = document.getElementById(challengeMap[dayNum]);
      if (cb) cb.checked = true;
    }
  }

  if (changed) {
    bpSaveProgress(progress);
    // Show sync notification
    if (typeof showToast === 'function') {
      showToast('Challenge progress synced with your roadmap!', 'success');
    }
  }
}

// Save start date when generating roadmap for first time
function bpSaveStartDate() {
  var inputs = bpLoadInputs();
  if (inputs && !inputs._startDate) {
    inputs._startDate = new Date().toISOString().slice(0, 10);
    try { localStorage.setItem('bp_saved_inputs', JSON.stringify(inputs)); } catch (e) {}
  }
}

// ═══ M5P3C1: ACTIONABLE OUTPUT -- EXECUTE TASKS + ROI TRACKER ═══

// Task-to-tool mapping for "Execute This Task" buttons
var BP_TASK_TOOLS = {
  'Complete Your Partner Onboarding': { section: 'portal-sec-training', label: 'Open Training' },
  'Build Your Referral Landing Page': { section: 'portal-sec-page-builder', label: 'Open Page Builder' },
  'Start the 30-Day Momentum Challenge': { section: 'portal-sec-challenge', label: 'Open Challenge' },
  'Launch Your First Tax Debt Awareness Email': { section: 'portal-sec-marketing', label: 'Open Marketing Kit' },
  'Create Your First Social Ad Campaign': { section: 'portal-sec-ai-admaker', label: 'Open Ad Maker' },
  'Generate Custom Scripts with AI Script Builder': { section: 'portal-sec-ai-scripts', label: 'Open Script Builder' },
  'Create Co-Branded Ads with Ad Maker': { section: 'portal-sec-ai-admaker', label: 'Open Ad Maker' },
  'Use the Client Qualifier AI Tool': { section: 'portal-sec-ai-qualifier', label: 'Open Qualifier' },
  'Complete 2+ CE Webinars for Deeper Expertise': { section: 'portal-sec-ce', label: 'Open Webinars' },
  'Share Your Landing Page with Referral Network': { section: 'portal-sec-page-builder', label: 'Open Pages' },
  'Review and Plan Your Next Quarter': { section: 'portal-sec-calculator', label: 'Open Calculator' },
  'Start a Weekly Social Post Schedule': { section: 'portal-sec-marketing', label: 'Open Marketing Kit' },
  'Send a Case Study Email': { section: 'portal-sec-marketing', label: 'Open Marketing Kit' },
  'Optimize Based on Month 1 Results': { section: 'portal-sec-referrals', label: 'Open Referrals' }
};

function bpExecuteTask(taskTitle) {
  var mapping = BP_TASK_TOOLS[taskTitle];
  if (!mapping) {
    if (typeof showToast === 'function') showToast('This task is best completed offline.', 'info');
    return;
  }
  bpGoToSection(mapping.section);
}

// ROI Tracker: Investment vs Revenue Generated
function bpRenderROITracker(inputs) {
  var container = document.getElementById('bp-roi-tracker');
  if (!container) return;

  var timeline = inputs.timeline || 90;
  var budget = inputs.budget || 0;
  var totalInvestment = budget * Math.ceil(timeline / 30);

  // Get actual referral data
  var actualRefs = 0;
  try {
    var raw = localStorage.getItem('bp_checkin_history');
    if (raw) {
      JSON.parse(raw).forEach(function(h) { actualRefs += (h.refs || 0); });
    }
  } catch (e) {}

  var actualRevenue = actualRefs * 420;
  var projectedRevenue = inputs.refGoal * 420;
  var roi = totalInvestment > 0 ? Math.round(((actualRevenue - totalInvestment) / totalInvestment) * 100) : (actualRevenue > 0 ? Infinity : 0);

  var html = '<div class="bp-roi-header">';
  html += '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>';
  html += '<span>ROI Tracker</span>';
  html += '</div>';

  html += '<div class="bp-roi-grid">';

  // Investment card
  html += '<div class="bp-roi-card bp-roi-invest">';
  html += '<div class="bp-roi-card-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg></div>';
  html += '<div class="bp-roi-card-val">$' + totalInvestment.toLocaleString() + '</div>';
  html += '<div class="bp-roi-card-label">Total Investment</div>';
  html += '<div class="bp-roi-card-note">$' + budget.toLocaleString() + '/mo x ' + Math.ceil(timeline / 30) + ' months (marketing budget)</div>';
  html += '</div>';

  // Revenue card
  html += '<div class="bp-roi-card bp-roi-revenue">';
  html += '<div class="bp-roi-card-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg></div>';
  html += '<div class="bp-roi-card-val">$' + actualRevenue.toLocaleString() + '</div>';
  html += '<div class="bp-roi-card-label">Actual Revenue Earned</div>';
  html += '<div class="bp-roi-card-note">' + actualRefs + ' referrals x $420 avg commission</div>';
  html += '</div>';

  // ROI card
  html += '<div class="bp-roi-card bp-roi-return">';
  html += '<div class="bp-roi-card-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg></div>';
  if (totalInvestment === 0 && actualRevenue > 0) {
    html += '<div class="bp-roi-card-val bp-roi-positive">Infinite</div>';
  } else if (roi >= 0) {
    html += '<div class="bp-roi-card-val bp-roi-positive">' + roi + '%</div>';
  } else {
    html += '<div class="bp-roi-card-val bp-roi-negative">' + roi + '%</div>';
  }
  html += '<div class="bp-roi-card-label">Return on Investment</div>';
  html += '<div class="bp-roi-card-note">' + (roi >= 0 ? 'Net profit: $' + (actualRevenue - totalInvestment).toLocaleString() : 'Net loss: -$' + (totalInvestment - actualRevenue).toLocaleString() + ' (keep going!)') + '</div>';
  html += '</div>';

  // Projected card
  html += '<div class="bp-roi-card bp-roi-projected">';
  html += '<div class="bp-roi-card-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>';
  html += '<div class="bp-roi-card-val">$' + projectedRevenue.toLocaleString() + '</div>';
  html += '<div class="bp-roi-card-label">Projected ' + timeline + '-Day Revenue</div>';
  var pctToGoal = actualRevenue > 0 ? Math.round((actualRevenue / projectedRevenue) * 100) : 0;
  html += '<div class="bp-roi-card-note">' + pctToGoal + '% of goal reached</div>';
  html += '</div>';

  html += '</div>';

  // Visual progress toward projected revenue
  html += '<div class="bp-roi-progress">';
  html += '<div class="bp-roi-progress-label">Revenue Progress: $' + actualRevenue.toLocaleString() + ' of $' + projectedRevenue.toLocaleString() + ' goal</div>';
  html += '<div class="bp-roi-progress-bar"><div class="bp-roi-progress-fill" style="width:' + Math.min(100, pctToGoal) + '%"></div></div>';
  html += '</div>';

  container.innerHTML = html;
  container.style.display = 'block';
}

// Enhanced email drip: show upcoming scheduled tasks
function bpRenderDripSchedule() {
  var container = document.getElementById('bp-drip-schedule');
  if (!container) return;

  var dripEnabled = false;
  try { dripEnabled = localStorage.getItem('bp_email_drip') === 'true'; } catch (e) {}
  if (!dripEnabled) {
    container.style.display = 'none';
    return;
  }

  var inputs = bpLoadInputs();
  if (!inputs) return;
  var roadmap = bpBuildRoadmap(inputs);
  var saved = bpLoadProgress();

  // Find upcoming incomplete tasks
  var taskIdx = 0;
  var upcoming = [];
  roadmap.months.forEach(function(month, mi) {
    month.tasks.forEach(function(task) {
      var tid = 'bp-t-' + taskIdx;
      if (!saved[tid]) {
        upcoming.push({ title: task.title, month: month.label, type: task.type, priority: task.priority });
      }
      taskIdx++;
      if (upcoming.length >= 5) return;
    });
  });

  if (upcoming.length === 0) {
    container.style.display = 'none';
    return;
  }

  var html = '<div class="bp-drip-schedule-header">';
  html += '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>';
  html += '<span>Upcoming Task Reminders</span>';
  html += '<span class="bp-drip-active-badge">Active</span>';
  html += '</div>';

  html += '<div class="bp-drip-list">';
  upcoming.forEach(function(task, i) {
    var dayOffset = (i + 1) * 7;
    var sendDate = new Date();
    sendDate.setDate(sendDate.getDate() + dayOffset - sendDate.getDay() + 1); // Next Monday + offset
    var dateStr = sendDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    html += '<div class="bp-drip-item">';
    html += '<div class="bp-drip-date">' + dateStr + '</div>';
    html += '<div class="bp-drip-task-info">';
    html += '<div class="bp-drip-task-title">' + task.title + '</div>';
    html += '<div class="bp-drip-task-meta">' + task.month + ' -- ' + task.priority + ' priority</div>';
    html += '</div>';
    html += '</div>';
  });
  html += '</div>';

  container.innerHTML = html;
  container.style.display = 'block';
}

// Export roadmap as presentation-style PDF
function bpExportSlides() {
  var inputs = bpLoadInputs();
  if (!inputs || !inputs.practiceType) {
    if (typeof showToast === 'function') showToast('Generate a roadmap first!', 'warning');
    return;
  }

  var roadmap = bpBuildRoadmap(inputs);
  var practiceLabel = roadmap.practiceLabel;
  var timeline = inputs.timeline || 90;
  var today = new Date();
  var monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var dateStr = monthNames[today.getMonth()] + ' ' + today.getDate() + ', ' + today.getFullYear();

  var doc = document.createElement('div');
  doc.className = 'bp-slides-doc';
  doc.style.cssText = 'position:fixed;left:-9999px;top:0;width:1024px;font-family:"DM Sans",system-ui,sans-serif';

  // Slide 1: Title
  var html = '<div class="bp-slide" style="width:1024px;height:576px;background:linear-gradient(135deg,#0b1e3d,#162d5a);display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;color:#fff;page-break-after:always">';
  html += '<div style="font-size:14px;letter-spacing:0.15em;text-transform:uppercase;color:rgba(255,255,255,0.6);margin-bottom:16px">Community Tax Enterprise Partner Program</div>';
  html += '<div style="font-family:\'DM Serif Display\',serif;font-size:44px;margin-bottom:12px">Your ' + timeline + '-Day<br>Growth Roadmap</div>';
  html += '<div style="font-size:16px;color:rgba(255,255,255,0.7);margin-bottom:32px">' + practiceLabel + '</div>';
  html += '<div style="width:60px;height:2px;background:linear-gradient(90deg,#0B5FD8,#00C8E0);margin-bottom:32px"></div>';
  html += '<div style="font-size:13px;color:rgba(255,255,255,0.5)">' + dateStr + '</div>';
  html += '</div>';

  // Slide 2: Executive Summary
  html += '<div class="bp-slide" style="width:1024px;height:576px;background:#fff;padding:48px 64px;page-break-after:always">';
  html += '<div style="font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:#0B5FD8;margin-bottom:8px">Executive Summary</div>';
  html += '<div style="font-family:\'DM Serif Display\',serif;font-size:32px;color:#0b1e3d;margin-bottom:24px">Key Metrics at a Glance</div>';
  html += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:24px;margin-bottom:32px">';

  var metrics = [
    { val: '$' + (inputs.refGoal * 420).toLocaleString(), label: 'Projected Revenue', note: inputs.refGoal + ' referrals x $420' },
    { val: Math.round(inputs.clientCount * 0.08) + '', label: 'Potential Leads', note: '8% of ' + inputs.clientCount + ' clients' },
    { val: bpBestChannel(inputs), label: 'Top Channel', note: 'Based on your profile' }
  ];
  metrics.forEach(function(m) {
    html += '<div style="text-align:center;padding:24px;background:#f8f9fa;border-radius:12px">';
    html += '<div style="font-family:\'DM Serif Display\',serif;font-size:28px;color:#0B5FD8;margin-bottom:4px">' + m.val + '</div>';
    html += '<div style="font-size:13px;font-weight:700;color:#0b1e3d;margin-bottom:4px">' + m.label + '</div>';
    html += '<div style="font-size:11px;color:#666">' + m.note + '</div>';
    html += '</div>';
  });
  html += '</div>';

  html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">';
  html += '<div style="padding:16px 20px;background:rgba(11,95,216,0.04);border:1px solid rgba(11,95,216,0.1);border-radius:10px">';
  html += '<div style="font-size:12px;font-weight:700;color:#0b1e3d;margin-bottom:4px">Timeline</div>';
  html += '<div style="font-size:13px;color:#555">' + timeline + ' days starting ' + dateStr + '</div>';
  html += '</div>';
  html += '<div style="padding:16px 20px;background:rgba(11,95,216,0.04);border:1px solid rgba(11,95,216,0.1);border-radius:10px">';
  html += '<div style="font-size:12px;font-weight:700;color:#0b1e3d;margin-bottom:4px">Monthly Budget</div>';
  html += '<div style="font-size:13px;color:#555">$' + (inputs.budget || 0).toLocaleString() + '/month</div>';
  html += '</div>';
  html += '</div>';
  html += '</div>';

  // Slide 3+: One slide per month
  roadmap.months.forEach(function(month, mi) {
    html += '<div class="bp-slide" style="width:1024px;height:576px;background:#fff;padding:48px 64px;page-break-after:always">';
    html += '<div style="font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:#0B5FD8;margin-bottom:8px">' + month.label + '</div>';
    html += '<div style="font-family:\'DM Serif Display\',serif;font-size:28px;color:#0b1e3d;margin-bottom:20px">' + month.subtitle + ' Action Plan</div>';
    html += '<div style="display:flex;flex-direction:column;gap:10px">';
    month.tasks.forEach(function(task) {
      var prioColor = task.priority === 'high' ? '#ef4444' : '#f59e0b';
      html += '<div style="display:flex;align-items:flex-start;gap:12px;padding:10px 14px;background:#f8f9fa;border-radius:8px;border-left:3px solid ' + prioColor + '">';
      html += '<div style="flex:1">';
      html += '<div style="font-size:13px;font-weight:700;color:#0b1e3d">' + task.title + '</div>';
      html += '<div style="font-size:11px;color:#666;line-height:1.4;margin-top:2px">' + task.desc.substring(0, 120) + (task.desc.length > 120 ? '...' : '') + '</div>';
      html += '</div>';
      html += '<span style="font-size:9px;font-weight:700;text-transform:uppercase;color:' + prioColor + ';flex-shrink:0">' + task.priority + '</span>';
      html += '</div>';
    });
    html += '</div>';
    html += '</div>';
  });

  // Final slide: Next Steps
  html += '<div class="bp-slide" style="width:1024px;height:576px;background:linear-gradient(135deg,#0b1e3d,#162d5a);display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;color:#fff">';
  html += '<div style="font-family:\'DM Serif Display\',serif;font-size:36px;margin-bottom:16px">Ready to Get Started?</div>';
  html += '<div style="font-size:15px;color:rgba(255,255,255,0.7);max-width:480px;line-height:1.7;margin-bottom:32px">Log in to your partner portal to access all the tools mentioned in this roadmap. Your first task: complete your onboarding and start the 30-Day Momentum Challenge.</div>';
  html += '<div style="display:flex;gap:16px">';
  html += '<div style="padding:12px 24px;background:#0B5FD8;border-radius:8px;font-size:13px;font-weight:700">Open Partner Portal</div>';
  html += '<div style="padding:12px 24px;border:1px solid rgba(255,255,255,0.3);border-radius:8px;font-size:13px;font-weight:600">Contact Your Rep</div>';
  html += '</div>';
  html += '<div style="font-size:11px;color:rgba(255,255,255,0.4);margin-top:32px">Generated by Community Tax Business Planner -- ' + dateStr + '</div>';
  html += '</div>';

  doc.innerHTML = html;

  // Use overlay approach for clean capture (1024px for landscape slides)
  var overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;top:0;left:0;width:1024px;height:100vh;z-index:999999;background:#0A1628;overflow-y:auto;overflow-x:hidden;margin:0;padding:0;';
  overlay.appendChild(doc);
  document.body.appendChild(overlay);
  doc.style.position = 'relative';
  doc.style.display = 'block';
  doc.style.margin = '0';

  function doExport() {
    var opt = {
      margin: 0,
      filename: 'Growth-Roadmap-Presentation.pdf',
      image: { type: 'jpeg', quality: 0.95 },
      html2canvas: { scale: 2, useCORS: true, scrollX: 0, scrollY: 0, width: 1024 },
      jsPDF: { unit: 'px', format: [1024, 576], orientation: 'landscape', hotfixes: ['px_scaling'] },
      pagebreak: { mode: 'css' }
    };
    requestAnimationFrame(function() {
      setTimeout(function() {
        html2pdf().set(opt).from(doc).save().then(function() {
          if (overlay.parentNode) document.body.removeChild(overlay);
          if (typeof showToast === 'function') showToast('Presentation PDF saved!', 'success');
        }).catch(function() {
          if (overlay.parentNode) document.body.removeChild(overlay);
          if (typeof showToast === 'function') showToast('PDF export failed. Try again.', 'error');
        });
      }, 200);
    });
  }

  if (typeof html2pdf === 'undefined') {
    var script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    script.onload = doExport;
    document.head.appendChild(script);
  } else {
    doExport();
  }
}

// ═══ M5P1C1: REAL INTELLIGENCE -- AI-POWERED ROADMAP ═══

// Industry benchmark data (per practice type, per geography)
var BP_BENCHMARKS = {
  'tax-prep': { avgRefs: 8, topRefs: 22, convRate: 0.68, avgDeal: 11200, seasonMult: { 'tax-season': 1.8, 'post-season': 0.7, 'fall': 0.85, 'year-end': 1.1 } },
  'accounting': { avgRefs: 6, topRefs: 18, convRate: 0.62, avgDeal: 9800, seasonMult: { 'tax-season': 1.5, 'post-season': 0.8, 'fall': 0.9, 'year-end': 1.2 } },
  'financial-advisory': { avgRefs: 5, topRefs: 15, convRate: 0.55, avgDeal: 14500, seasonMult: { 'tax-season': 1.3, 'post-season': 0.9, 'fall': 1.0, 'year-end': 1.1 } },
  'legal': { avgRefs: 4, topRefs: 12, convRate: 0.72, avgDeal: 16200, seasonMult: { 'tax-season': 1.2, 'post-season': 1.0, 'fall': 1.0, 'year-end': 1.0 } },
  'insurance': { avgRefs: 3, topRefs: 10, convRate: 0.48, avgDeal: 8900, seasonMult: { 'tax-season': 1.4, 'post-season': 0.8, 'fall': 0.9, 'year-end': 1.1 } },
  'mortgage': { avgRefs: 4, topRefs: 14, convRate: 0.51, avgDeal: 10500, seasonMult: { 'tax-season': 1.3, 'post-season': 0.85, 'fall': 1.1, 'year-end': 0.9 } },
  'other': { avgRefs: 3, topRefs: 8, convRate: 0.45, avgDeal: 9000, seasonMult: { 'tax-season': 1.3, 'post-season': 0.85, 'fall': 0.95, 'year-end': 1.0 } }
};

var BP_GEO_MULTIPLIERS = {
  'urban': { refs: 1.25, competition: 'high', avgDebt: 18500 },
  'suburban': { refs: 1.0, competition: 'medium', avgDebt: 14200 },
  'rural': { refs: 0.75, competition: 'low', avgDebt: 11800 },
  '': { refs: 1.0, competition: 'medium', avgDebt: 14200 }
};

// Timeline duration options
var BP_TIMELINES = {
  30: { label: '30 Days', months: 1, suffix: 'Sprint' },
  60: { label: '60 Days', months: 2, suffix: 'Launch' },
  90: { label: '90 Days', months: 3, suffix: 'Growth Roadmap' },
  180: { label: '180 Days', months: 6, suffix: 'Strategic Plan' }
};

function bpRenderBenchmarks(inputs) {
  var el = document.getElementById('bp-benchmarks');
  if (!el) return;

  var bench = BP_BENCHMARKS[inputs.practiceType] || BP_BENCHMARKS['other'];
  var geoMult = BP_GEO_MULTIPLIERS[inputs.geo] || BP_GEO_MULTIPLIERS[''];
  var season = inputs.season || bpGetSeason();
  var sMult = bench.seasonMult[season] || 1.0;

  var adjustedAvg = Math.round(bench.avgRefs * geoMult.refs * sMult);
  var adjustedTop = Math.round(bench.topRefs * geoMult.refs * sMult);
  var practiceLabel = BP_PRACTICE_TYPES[inputs.practiceType] || 'Your Practice Type';

  var seasonLabels = {
    'tax-season': 'Tax Season (Jan-Apr)',
    'post-season': 'Post-Season (May-Jul)',
    'fall': 'Fall (Aug-Oct)',
    'year-end': 'Year-End (Nov-Dec)'
  };

  el.style.display = 'block';
  el.innerHTML = '<div class="bp-bench-header">'
    + '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>'
    + '<span>Industry Benchmarks: ' + practiceLabel + '</span>'
    + '</div>'
    + '<div class="bp-bench-grid">'
    + '<div class="bp-bench-card">'
    + '<div class="bp-bench-val">' + adjustedAvg + '</div>'
    + '<div class="bp-bench-label">Avg Referrals/Month</div>'
    + '<div class="bp-bench-note">Adjusted for ' + (seasonLabels[season] || season) + ' + ' + (inputs.geo || 'your') + ' market</div>'
    + '</div>'
    + '<div class="bp-bench-card">'
    + '<div class="bp-bench-val">' + adjustedTop + '</div>'
    + '<div class="bp-bench-label">Top 10% Partners</div>'
    + '<div class="bp-bench-note">Best performers in your practice category</div>'
    + '</div>'
    + '<div class="bp-bench-card">'
    + '<div class="bp-bench-val">' + Math.round(bench.convRate * 100) + '%</div>'
    + '<div class="bp-bench-label">Referral Close Rate</div>'
    + '<div class="bp-bench-note">% of submitted referrals that result in signed cases</div>'
    + '</div>'
    + '<div class="bp-bench-card">'
    + '<div class="bp-bench-val">$' + geoMult.avgDebt.toLocaleString() + '</div>'
    + '<div class="bp-bench-label">Avg Tax Debt in Market</div>'
    + '<div class="bp-bench-note">Typical client debt size in ' + (inputs.geo || 'your') + ' areas</div>'
    + '</div>'
    + '</div>'
    + '<div class="bp-bench-comparison">'
    + '<div class="bp-bench-comp-title">Your Goal vs Market</div>'
    + '<div class="bp-bench-comp-bar">'
    + '<div class="bp-bench-bar-track">'
    + '<div class="bp-bench-bar-avg" style="left:' + Math.min(95, (adjustedAvg / adjustedTop) * 100) + '%"><div class="bp-bench-bar-dot"></div><div class="bp-bench-bar-label">Avg (' + adjustedAvg + ')</div></div>'
    + '<div class="bp-bench-bar-you" style="left:' + Math.min(95, (inputs.refGoal / adjustedTop) * 100) + '%"><div class="bp-bench-bar-dot bp-bench-bar-dot-you"></div><div class="bp-bench-bar-label">You (' + inputs.refGoal + ')</div></div>'
    + '<div class="bp-bench-bar-top" style="left:95%"><div class="bp-bench-bar-dot bp-bench-bar-dot-top"></div><div class="bp-bench-bar-label">Top (' + adjustedTop + ')</div></div>'
    + '</div>'
    + '</div>'
    + '</div>';
}

// AI-Powered Roadmap Generation
async function bpGenerateAIRoadmap() {
  var inputs = bpLoadInputs();
  if (!inputs || !inputs.practiceType) {
    if (typeof showToast === 'function') showToast('Generate a standard roadmap first, then enhance with AI.', 'warning');
    return;
  }

  var btn = document.getElementById('bp-ai-btn');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span class="bp-ai-spinner"></span> Generating personalized roadmap...';
  }

  var bench = BP_BENCHMARKS[inputs.practiceType] || BP_BENCHMARKS['other'];
  var geoMult = BP_GEO_MULTIPLIERS[inputs.geo] || BP_GEO_MULTIPLIERS[''];
  var practiceLabel = BP_PRACTICE_TYPES[inputs.practiceType] || 'professional practice';
  var timeline = inputs.timeline || 90;

  var prompt = 'You are a business growth strategist for a tax resolution referral partner program. '
    + 'Generate a personalized ' + timeline + '-day growth roadmap for a ' + practiceLabel.toLowerCase() + ' partner.\n\n'
    + 'Partner profile:\n'
    + '- Practice type: ' + practiceLabel + '\n'
    + '- Client base: ' + (inputs.clientCount || 'unknown') + ' active clients\n'
    + '- Target audience: ' + (BP_AUDIENCES[inputs.audience] || 'mixed') + '\n'
    + '- Monthly marketing budget: $' + (inputs.budget || 0) + '\n'
    + '- Referral goal: ' + inputs.refGoal + ' per quarter\n'
    + '- Has website: ' + (inputs.hasWebsite ? 'Yes' : 'No') + '\n'
    + '- Has social media: ' + (inputs.hasSocial ? 'Yes' : 'No') + '\n'
    + '- Has email list: ' + (inputs.hasEmail ? 'Yes' : 'No') + '\n'
    + '- Geography: ' + (inputs.geo || 'not specified') + '\n'
    + '- Years in business: ' + (inputs.years || 'not specified') + '\n'
    + '- Current referrals/month: ' + (inputs.currentRefs || 'not specified') + '\n'
    + '- Season: ' + (inputs.season || bpGetSeason()) + '\n'
    + '- Industry avg referrals/month: ' + bench.avgRefs + '\n'
    + '- Top 10% referrals/month: ' + bench.topRefs + '\n\n'
    + 'Generate exactly 3 personalized strategic insights as JSON. Each insight should be specific to this partner\'s situation, not generic advice.\n\n'
    + 'Format: {"insights":[{"title":"string","value":"string","detail":"2-3 sentence explanation"}]}\n\n'
    + 'Focus on: (1) their biggest untapped opportunity, (2) their recommended first action based on current assets, (3) a specific revenue projection with reasoning.\n\n'
    + 'Be extremely specific -- reference their client count, practice type, geography, and season. No generic advice.';

  try {
    if (typeof CTAX_API_KEY === 'undefined' || !CTAX_API_KEY) {
      throw new Error('No API key');
    }

    var resp = await fetch(CTAX_API_URL, {
      method: 'POST',
      headers: getApiHeaders(),
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 800,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!resp.ok) throw new Error('API ' + resp.status);
    var data = await resp.json();
    var text = data.content && data.content[0] ? data.content[0].text : '';

    // Extract JSON from response
    var jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      var parsed = JSON.parse(jsonMatch[0]);
      if (parsed.insights && parsed.insights.length) {
        bpRenderAIInsights(parsed.insights);
        try { localStorage.setItem('bp_ai_roadmap', JSON.stringify(parsed)); } catch (e) {}
      }
    }

  } catch (err) {
    if (typeof showToast === 'function') {
      showToast('AI enhancement unavailable right now. Your standard roadmap is still excellent.', 'info');
    }
  }

  if (btn) {
    btn.disabled = false;
    btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg> Enhance with AI';
  }
}

function bpRenderAIInsights(insights) {
  var container = document.getElementById('bp-ai-insights');
  if (!container) {
    container = document.createElement('div');
    container.id = 'bp-ai-insights';
    container.className = 'bp-ai-insights';
    var insRow = document.querySelector('.bp-insights-row');
    if (insRow) insRow.parentNode.insertBefore(container, insRow.nextSibling);
  }

  var html = '<div class="bp-ai-header">'
    + '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>'
    + '<span>AI-Powered Insights</span>'
    + '<span class="bp-ai-badge">Personalized</span>'
    + '</div>'
    + '<div class="bp-ai-grid">';

  insights.forEach(function(ins) {
    html += '<div class="bp-ai-card">'
      + '<div class="bp-ai-card-val">' + (ins.value || '') + '</div>'
      + '<div class="bp-ai-card-title">' + (ins.title || '') + '</div>'
      + '<div class="bp-ai-card-detail">' + (ins.detail || '') + '</div>'
      + '</div>';
  });

  html += '</div>';
  container.innerHTML = html;
  container.style.display = 'block';
}

// Restore AI insights on page load
function bpTryRestoreAI() {
  try {
    var saved = localStorage.getItem('bp_ai_roadmap');
    if (saved) {
      var parsed = JSON.parse(saved);
      if (parsed.insights) {
        setTimeout(function() { bpRenderAIInsights(parsed.insights); }, 200);
      }
    }
  } catch (e) {}
}
