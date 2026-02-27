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

// Generate the 90-day roadmap based on user inputs
function bpGenerateRoadmap() {
  var practiceType = document.getElementById('bp-practice-type').value;
  var clientCount = parseInt(document.getElementById('bp-client-count').value) || 0;
  var audience = document.getElementById('bp-audience').value;
  var budget = document.getElementById('bp-budget').value;
  var refGoal = parseInt(document.getElementById('bp-ref-goal').value) || 5;
  var hasWebsite = document.getElementById('bp-has-website').checked;
  var hasSocial = document.getElementById('bp-has-social').checked;
  var hasEmail = document.getElementById('bp-has-email').checked;
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
    season: season
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

  // Restore form field values so "Edit" flow is seamless
  var el;
  el = document.getElementById('bp-practice-type');
  if (el) el.value = inputs.practiceType;
  el = document.getElementById('bp-client-count');
  if (el) el.value = inputs.clientCount || '';
  el = document.getElementById('bp-audience');
  if (el) el.value = inputs.audience || '';
  el = document.getElementById('bp-budget');
  if (el) el.value = inputs.budget != null ? String(inputs.budget) : '';
  el = document.getElementById('bp-ref-goal');
  if (el) el.value = inputs.refGoal || 5;
  el = document.getElementById('bp-has-website');
  if (el) el.checked = !!inputs.hasWebsite;
  el = document.getElementById('bp-has-social');
  if (el) el.checked = !!inputs.hasSocial;
  el = document.getElementById('bp-has-email');
  if (el) el.checked = !!inputs.hasEmail;

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
    desc: 'Finish all training modules in the Training section. Focus on "Tax Resolution Basics" and "Handling Client Objections" -- these are the two modules that directly drive referral conversions.',
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
    title: 'Review and Plan Your Next Quarter',
    desc: 'Check your Revenue Calculator with actual numbers from the past 90 days. Compare projected vs. actual referrals and earnings. Set your Q2 target at 25-50% above Q1. Identify your top referral source (conversations, email, social, network) and allocate 70% of effort there. Diminishing returns happen when you spread too thin.',
    type: 'growth',
    priority: 'high'
  });

  // Build the insight cards
  var insights = [];
  insights.push({
    title: 'Your Estimated 90-Day Revenue',
    value: '$' + (inputs.refGoal * 420).toLocaleString(),
    desc: 'Based on ' + inputs.refGoal + ' referrals at $420 avg commission (Silver tier). Gold tier would yield $' + (inputs.refGoal * 525).toLocaleString() + '.'
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
  html += '<div class="bp-action-title">Your 90-Day Growth Roadmap</div>';
  html += '<div class="bp-action-btns">';
  html += '<button class="bp-action-btn bp-btn-pdf" onclick="bpPrintRoadmap()"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> Save as PDF</button>';
  html += '<button class="bp-action-btn bp-btn-reset" onclick="bpResetPlanner()"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 105.64-11.36L1 10"/></svg> Start Over</button>';
  html += '</div></div>';

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
  { text: 'Email Template Builder', section: 'portal-sec-marketing' },
  { text: 'Social Post Builder', section: 'portal-sec-marketing' },
  { text: 'One-Pager Builder', section: 'portal-sec-marketing' },
  { text: 'Ad Builder', section: 'portal-sec-marketing' },
  { text: 'Marketing Kit', section: 'portal-sec-marketing' },
  { text: 'Referral Playbook', section: 'portal-sec-playbook' },
  { text: 'Revenue Calculator', section: 'portal-sec-calculator' },
  { text: 'Referrals dashboard', section: 'portal-sec-referrals' },
  { text: 'Training section', section: 'portal-sec-training' },
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

// Print roadmap as PDF using browser print dialog
function bpPrintRoadmap() {
  var result = document.getElementById('bp-result');
  if (!result) return;

  // Add a print-mode class to body so CSS can target it
  document.body.classList.add('bp-printing');

  // Brief delay to let CSS apply, then trigger print
  setTimeout(function() {
    window.print();
    // Remove print class after dialog closes
    document.body.classList.remove('bp-printing');
  }, 100);
}

function bpResetPlanner() {
  var result = document.getElementById('bp-result');
  var form = document.getElementById('bp-form-wrap');
  if (result) { result.innerHTML = ''; result.style.display = 'none'; }
  if (form) form.style.display = 'block';
  // Clear saved progress and inputs when starting over
  try {
    localStorage.removeItem('bp_task_progress');
    localStorage.removeItem('bp_saved_inputs');
  } catch (e) { /* ignore */ }
}
