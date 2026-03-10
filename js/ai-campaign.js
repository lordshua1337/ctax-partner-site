// ══════════════════════════════════════════
//  M2P1C3: AI CAMPAIGN BUILDER
//  One-click full marketing campaign:
//  ICP analysis -> scripts -> qualifier -> ads
// ══════════════════════════════════════════

var AIC_CACHE_KEY = 'ctax_ai_campaigns';

function aicShowBuilder() {
  var overlay = document.createElement('div');
  overlay.className = 'aid-modal-overlay';
  overlay.id = 'aic-modal';
  overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };

  var modal = document.createElement('div');
  modal.className = 'aid-modal';
  modal.style.maxWidth = '740px';

  modal.innerHTML = '<div class="aid-modal-header">'
    + '<div><div class="aid-modal-title">Campaign Builder</div>'
    + '<div class="aid-modal-meta">Generate a complete marketing campaign in one click</div></div>'
    + '<button class="aid-modal-close" onclick="document.getElementById(\'aic-modal\').remove()">&times;</button>'
    + '</div>'
    + '<div class="aid-modal-body" id="aic-body"></div>';

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  aicRenderSetup();
}

function aicRenderSetup() {
  var body = document.getElementById('aic-body');
  if (!body) return;

  // Check for ICP data
  var icp = aicGetICPData();
  var hasICP = icp && icp.practiceType;

  var html = '<div class="aic-setup">';

  // ICP status
  if (hasICP) {
    var practiceLabel = (typeof BP_PRACTICE_TYPES !== 'undefined' && BP_PRACTICE_TYPES[icp.practiceType]) ? BP_PRACTICE_TYPES[icp.practiceType] : icp.practiceType;
    html += '<div class="aic-icp-card">'
      + '<div class="aic-icp-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>'
      + '<div class="aic-icp-info">'
      + '<div class="aic-icp-name">' + practiceLabel + '</div>'
      + '<div class="aic-icp-detail">' + (icp.clientCount || '?') + ' clients -- ' + (icp.geo || 'unknown') + ' area</div>'
      + '</div>'
      + '<div class="aic-icp-badge">ICP Connected</div>'
      + '</div>';
  } else {
    html += '<div class="aic-icp-card aic-icp-missing">'
      + '<div class="aic-icp-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div>'
      + '<div class="aic-icp-info">'
      + '<div class="aic-icp-name">No ICP Profile Found</div>'
      + '<div class="aic-icp-detail">Build your ICP profile first for personalized campaigns, or use defaults.</div>'
      + '</div>'
      + '</div>';
  }

  // Campaign goal
  html += '<div class="aic-field">'
    + '<label class="aic-label">Campaign Goal</label>'
    + '<select class="aic-select" id="aic-goal">'
    + '<option value="referrals">Generate Referrals</option>'
    + '<option value="awareness">Build Awareness</option>'
    + '<option value="reactivation">Reactivate Past Clients</option>'
    + '<option value="event">Promote Event/Webinar</option>'
    + '</select>'
    + '</div>';

  // Target audience
  html += '<div class="aic-field">'
    + '<label class="aic-label">Primary Audience</label>'
    + '<select class="aic-select" id="aic-audience">'
    + '<option value="existing_clients">Existing Clients</option>'
    + '<option value="new_prospects">New Prospects</option>'
    + '<option value="referral_partners">Referral Partners</option>'
    + '<option value="general">General Public</option>'
    + '</select>'
    + '</div>';

  // Channels
  html += '<div class="aic-field">'
    + '<label class="aic-label">Channels (select all that apply)</label>'
    + '<div class="aic-channels">'
    + '<label class="aic-channel-opt"><input type="checkbox" value="email" checked> Email</label>'
    + '<label class="aic-channel-opt"><input type="checkbox" value="linkedin" checked> LinkedIn</label>'
    + '<label class="aic-channel-opt"><input type="checkbox" value="facebook"> Facebook</label>'
    + '<label class="aic-channel-opt"><input type="checkbox" value="phone"> Phone Script</label>'
    + '<label class="aic-channel-opt"><input type="checkbox" value="in_person"> In-Person</label>'
    + '</div>'
    + '</div>';

  // Campaign components to generate
  html += '<div class="aic-components">'
    + '<div class="aic-label">Components to Generate</div>'
    + '<div class="aic-comp-grid">';

  var components = [
    { id: 'scripts', label: 'Outreach Scripts', desc: 'Conversation & email scripts for each channel', icon: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z' },
    { id: 'qualifier', label: 'Qualification Criteria', desc: 'How to identify and score leads for this campaign', icon: 'M9 11l3 3L22 4' },
    { id: 'ads', label: 'Ad Copy & Headlines', desc: 'Platform-specific ad copy and creative direction', icon: 'M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z' },
    { id: 'emails', label: 'Email Sequence', desc: '3-email drip sequence with subject lines', icon: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z' },
    { id: 'timeline', label: 'Campaign Timeline', desc: 'Week-by-week execution plan', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'kpis', label: 'KPI Targets', desc: 'Measurable goals and tracking benchmarks', icon: 'M16 3h5v5M8 3H3v5M12 22V8M21 3l-9 9M3 3l9 9' }
  ];

  components.forEach(function(c) {
    html += '<label class="aic-comp-card">'
      + '<input type="checkbox" value="' + c.id + '" checked class="aic-comp-check">'
      + '<div class="aic-comp-content">'
      + '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="' + c.icon + '"/></svg>'
      + '<div class="aic-comp-label">' + c.label + '</div>'
      + '<div class="aic-comp-desc">' + c.desc + '</div>'
      + '</div>'
      + '</label>';
  });

  html += '</div></div>';

  // Generate button
  html += '<div class="aic-actions">'
    + '<button class="btn btn-p" id="aic-gen-btn" onclick="aicGenerate()" style="width:100%">Generate Campaign</button>'
    + '</div>';

  // Previous campaigns
  var campaigns = aicGetCampaigns();
  if (campaigns.length > 0) {
    html += '<div class="aic-history">'
      + '<div class="aic-history-label">Previous Campaigns</div>';
    campaigns.slice(0, 3).forEach(function(c, i) {
      html += '<div class="aic-history-item" onclick="aicLoadCampaign(' + i + ')">'
        + '<div class="aic-history-name">' + c.name + '</div>'
        + '<div class="aic-history-meta">' + new Date(c.timestamp).toLocaleDateString() + ' -- ' + c.components.length + ' components</div>'
        + '</div>';
    });
    html += '</div>';
  }

  html += '</div>';
  body.innerHTML = html;
}

// ── GENERATE ──────────────────────────────

async function aicGenerate() {
  var btn = document.getElementById('aic-gen-btn');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span class="bpp-spinner"></span> Building your campaign...';
  }

  var goalEl = document.getElementById('aic-goal');
  var audienceEl = document.getElementById('aic-audience');
  var goal = goalEl ? goalEl.value : 'referrals';
  var audience = audienceEl ? audienceEl.value : 'existing_clients';

  // Get selected channels
  var channels = [];
  document.querySelectorAll('.aic-channel-opt input:checked').forEach(function(cb) {
    channels.push(cb.value);
  });

  // Get selected components
  var components = [];
  document.querySelectorAll('.aic-comp-check:checked').forEach(function(cb) {
    components.push(cb.value);
  });

  var icp = aicGetICPData();
  var practiceType = icp ? icp.practiceType : 'general';
  var practiceLabel = (typeof BP_PRACTICE_TYPES !== 'undefined' && BP_PRACTICE_TYPES[practiceType]) ? BP_PRACTICE_TYPES[practiceType] : 'professional practice';

  var goalLabels = { referrals: 'Generate Referrals', awareness: 'Build Awareness', reactivation: 'Reactivate Past Clients', event: 'Promote Event/Webinar' };
  var audienceLabels = { existing_clients: 'Existing Clients', new_prospects: 'New Prospects', referral_partners: 'Referral Partners', general: 'General Public' };

  var prompt = 'You are a marketing strategist for a Community Tax referral partner.\n\n'
    + 'Partner: ' + practiceLabel + '\n'
    + 'Campaign Goal: ' + (goalLabels[goal] || goal) + '\n'
    + 'Target Audience: ' + (audienceLabels[audience] || audience) + '\n'
    + 'Channels: ' + channels.join(', ') + '\n'
    + 'Client base: ' + (icp ? (icp.clientCount || 'unknown') + ' clients' : 'unknown') + '\n'
    + 'Geography: ' + (icp ? (icp.geo || 'unknown') : 'unknown') + '\n\n'
    + 'Generate a complete marketing campaign as JSON with this structure:\n'
    + '{"name":"Campaign name (short, catchy)",'
    + '"components":[';

  var compDefs = [];
  if (components.indexOf('scripts') !== -1) {
    compDefs.push('{"type":"scripts","title":"Outreach Scripts","content":"One script per selected channel. Each script should be word-for-word, ready to use. Include opening, body, CTA."}');
  }
  if (components.indexOf('qualifier') !== -1) {
    compDefs.push('{"type":"qualifier","title":"Lead Qualification","content":"5 qualification criteria with scoring (1-5 scale), ideal lead profile, red flags to watch for."}');
  }
  if (components.indexOf('ads') !== -1) {
    compDefs.push('{"type":"ads","title":"Ad Copy","content":"3 ad variations with headlines (max 40 chars), body copy (max 125 chars), and CTA button text. Platform-specific notes."}');
  }
  if (components.indexOf('emails') !== -1) {
    compDefs.push('{"type":"emails","title":"Email Sequence","content":"3-email drip: subject lines, preview text, body copy, timing (days between). Include personalization tokens."}');
  }
  if (components.indexOf('timeline') !== -1) {
    compDefs.push('{"type":"timeline","title":"Campaign Timeline","content":"4-week execution plan. Week by week: what to do, which channel, expected outcomes."}');
  }
  if (components.indexOf('kpis') !== -1) {
    compDefs.push('{"type":"kpis","title":"KPI Targets","content":"6 measurable KPIs with target values, tracking method, and benchmark comparisons."}');
  }

  prompt += compDefs.join(',');
  prompt += ']}\n\nMake everything specific to their practice type and goal. Use real numbers and actionable content.';

  try {
    if (typeof CTAX_API_KEY === 'undefined' || !CTAX_API_KEY) throw new Error('No API key');

    var resp = await fetch(CTAX_API_URL, {
      method: 'POST',
      headers: getApiHeaders(),
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 6000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!resp.ok) throw new Error('API ' + resp.status);
    var data = await resp.json();
    var text = data.content && data.content[0] ? data.content[0].text : '';
    var jsonMatch = text.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      var parsed = JSON.parse(jsonMatch[0]);
      if (parsed.components) {
        parsed.goal = goal;
        parsed.audience = audience;
        parsed.channels = channels;
        parsed.timestamp = Date.now();
        aicSaveCampaign(parsed);
        aicRenderCampaign(parsed);
        return;
      }
    }
    throw new Error('Invalid response');

  } catch (err) {
    var fallback = aicGetFallback(goal, audience, channels, components, practiceLabel);
    aicSaveCampaign(fallback);
    aicRenderCampaign(fallback);
  }
}

function aicRenderCampaign(campaign) {
  var body = document.getElementById('aic-body');
  if (!body) return;

  var html = '<div class="aic-campaign">';

  // Header
  html += '<div class="aic-campaign-header">'
    + '<div class="aic-campaign-name">' + (campaign.name || 'Marketing Campaign') + '</div>'
    + '<div class="aic-campaign-meta">'
    + '<span>' + (campaign.channels || []).length + ' channels</span>'
    + '<span>' + (campaign.components || []).length + ' components</span>'
    + '<span>' + new Date(campaign.timestamp || Date.now()).toLocaleDateString() + '</span>'
    + '</div>'
    + '<div class="aic-campaign-actions">'
    + '<button class="btn btn-g btn-sm" onclick="aicRenderSetup()">New Campaign</button>'
    + '<button class="btn btn-p btn-sm" onclick="aicExportCampaign()">Export as PDF</button>'
    + '</div>'
    + '</div>';

  // Components
  html += '<div class="aic-components-list">';
  (campaign.components || []).forEach(function(comp, i) {
    var typeIcons = {
      scripts: '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>',
      qualifier: '<polyline points="9 11 12 14 22 4"/>',
      ads: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>',
      emails: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>',
      timeline: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
      kpis: '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>'
    };

    html += '<div class="aic-comp-section">'
      + '<div class="aic-comp-header" onclick="this.parentElement.classList.toggle(\'aic-comp-open\')">'
      + '<div class="aic-comp-header-left">'
      + '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + (typeIcons[comp.type] || '') + '</svg>'
      + '<span class="aic-comp-title">' + (comp.title || comp.type) + '</span>'
      + '</div>'
      + '<svg class="aic-comp-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>'
      + '</div>'
      + '<div class="aic-comp-body">'
      + '<div class="aic-comp-text">' + aicFormatContent(comp.content || '') + '</div>'
      + '</div>'
      + '</div>';
  });
  html += '</div>';

  html += '</div>';
  body.innerHTML = html;

  // Auto-open first component
  var firstComp = body.querySelector('.aic-comp-section');
  if (firstComp) firstComp.classList.add('aic-comp-open');
}

function aicFormatContent(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .split(/\n\n+/)
    .map(function(p) {
      p = p.trim();
      if (!p) return '';
      if (p.match(/^[\d]+\./)) return '<p class="aic-list-item">' + p + '</p>';
      if (p.match(/^[-*]/)) return '<p class="aic-list-item">' + p.replace(/^[-*]\s*/, '') + '</p>';
      return '<p>' + p + '</p>';
    })
    .join('');
}

function aicExportCampaign() {
  var campaigns = aicGetCampaigns();
  if (campaigns.length === 0) return;
  var campaign = campaigns[0];

  var doc = document.createElement('div');
  doc.style.cssText = 'width:816px;font-family:DM Sans,sans-serif;color:#1a2b3c;padding:40px;box-sizing:border-box';

  doc.innerHTML = '<div style="text-align:center;padding:48px 24px;background:linear-gradient(155deg,#0A1628,#0B5FD8);color:white;border-radius:12px;margin-bottom:32px">'
    + '<div style="font-size:12px;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:8px">Marketing Campaign</div>'
    + '<div style="font-family:DM Serif Display,serif;font-size:28px;margin-bottom:4px">' + (campaign.name || 'Campaign') + '</div>'
    + '<div style="font-size:14px;opacity:0.7">Generated ' + new Date(campaign.timestamp).toLocaleDateString() + '</div>'
    + '</div>';

  (campaign.components || []).forEach(function(comp) {
    doc.innerHTML += '<div style="margin-bottom:24px">'
      + '<h3 style="font-size:18px;color:#0A1628;border-bottom:2px solid #0B5FD8;padding-bottom:6px;margin-bottom:12px">' + (comp.title || comp.type) + '</h3>'
      + '<div style="font-size:14px;line-height:1.75;color:#333">' + aicFormatContent(comp.content || '') + '</div>'
      + '</div>';
  });

  CTAX_PDF.exportElement(doc, 'Campaign_' + (campaign.name || 'export').replace(/\s+/g, '_') + '.pdf', { margin: 10, unit: 'mm', format: 'a4' });
}

// ── STORAGE ──────────────────────────────

function aicGetCampaigns() {
  try { return JSON.parse(localStorage.getItem(AIC_CACHE_KEY)) || []; }
  catch (e) { return []; }
}

function aicSaveCampaign(campaign) {
  var all = aicGetCampaigns();
  all.unshift(campaign);
  if (all.length > 10) all = all.slice(0, 10);
  try { localStorage.setItem(AIC_CACHE_KEY, JSON.stringify(all)); } catch (e) {}
}

function aicLoadCampaign(index) {
  var campaigns = aicGetCampaigns();
  if (campaigns[index]) aicRenderCampaign(campaigns[index]);
}

function aicGetICPData() {
  try {
    var saved = localStorage.getItem('bp_saved_inputs');
    return saved ? JSON.parse(saved) : null;
  } catch (e) { return null; }
}

// ── FALLBACK ──────────────────────────────

function aicGetFallback(goal, audience, channels, components, practiceLabel) {
  var campaign = {
    name: goal === 'referrals' ? 'Referral Blitz Campaign' : goal === 'awareness' ? 'Authority Builder Campaign' : goal === 'reactivation' ? 'Win-Back Campaign' : 'Event Launch Campaign',
    goal: goal,
    audience: audience,
    channels: channels,
    components: [],
    timestamp: Date.now()
  };

  if (components.indexOf('scripts') !== -1) {
    campaign.components.push({
      type: 'scripts',
      title: 'Outreach Scripts',
      content: '**Email Script**\n\nSubject: Quick question about your tax situation\n\nHi [Name],\n\nI wanted to reach out because I have been working with a program that helps people resolve IRS tax debt -- things like back taxes, unfiled returns, and wage garnishments.\n\nAs your ' + practiceLabel + ', I see a lot of clients who are dealing with these issues quietly. If that sounds like you or anyone you know, I can connect you with a team that handles everything from start to finish.\n\nThe initial review is just $295, and most clients save 50-80% on what they owe.\n\nWould it be worth a quick conversation?\n\n**Phone Script**\n\n"Hi [Name], this is [Your Name]. I am calling because I have been partnering with Community Tax to help my clients who are dealing with IRS issues. Have you or anyone you know been getting notices from the IRS lately?"\n\n[If yes]: "I can connect you with their team -- they handle everything. The first step is a $295 investigation where they pull your transcripts and show you exactly what your options are. Would you like me to set that up?"\n\n[If no]: "No worries at all. Just wanted you to know this is something I can help with if it ever comes up. I will send you some info in case anyone in your network needs it."'
    });
  }

  if (components.indexOf('qualifier') !== -1) {
    campaign.components.push({
      type: 'qualifier',
      title: 'Lead Qualification',
      content: '**Qualification Criteria** (score 1-5 for each):\n\n1. **Tax Debt Amount** -- Under $5K (1), $5-15K (2), $15-50K (3), $50-100K (4), Over $100K (5)\n2. **IRS Activity Level** -- No notices (1), CP14 notice (2), CP501-504 (3), Intent to Levy (4), Active Levy/Lien (5)\n3. **Urgency** -- No time pressure (1), Concerned (2), Stressed (3), Deadline approaching (4), Crisis mode (5)\n4. **Financial Ability** -- Cannot afford anything (1), Very tight (2), Moderate means (3), Comfortable (4), Strong finances (5)\n5. **Engagement** -- Unresponsive (1), Hesitant (2), Interested (3), Ready to act (4), Requesting help (5)\n\n**Scoring**: 20-25 = Hot Lead (submit immediately). 15-19 = Warm Lead (nurture for 1-2 weeks). 10-14 = Cool Lead (add to long-term drip). Under 10 = Not qualified.\n\n**Red Flags**: Currently in bankruptcy, debt under $5K, already has a tax attorney, unwilling to share IRS notices.'
    });
  }

  if (components.indexOf('ads') !== -1) {
    campaign.components.push({
      type: 'ads',
      title: 'Ad Copy',
      content: '**Ad Variation 1 -- Fear/Urgency**\nHeadline: IRS Penalties Growing Daily?\nBody: Every day you wait, your tax debt increases. Get expert help resolving your IRS issues. Free consultation. BBB A+ rated.\nCTA: Get Free Consultation\n\n**Ad Variation 2 -- Relief/Hope**\nHeadline: Reduce Your Tax Debt by Up to 80%\nBody: Thousands have found relief from IRS debt. Our enrolled agents negotiate directly with the IRS on your behalf.\nCTA: Start Your Fresh Start\n\n**Ad Variation 3 -- Social Proof**\nHeadline: 10,000+ Cases Resolved Successfully\nBody: Join thousands who have settled their tax debt. Average client saves $8,400. No upfront fees. Payment plans available.\nCTA: See If You Qualify\n\n**Platform Notes**:\n- LinkedIn: Use Ad 2 or 3 (professional audience responds to credibility)\n- Facebook: Use Ad 1 (urgency performs well in newsfeed)\n- Google: Use Ad 1 headline as primary, Ad 3 body as description'
    });
  }

  if (components.indexOf('emails') !== -1) {
    campaign.components.push({
      type: 'emails',
      title: 'Email Sequence',
      content: '**Email 1 -- Day 0 (Awareness)**\nSubject: Did you know the IRS has $181 billion in outstanding debt?\nPreview: And some of your clients might be part of that number...\nBody: [Introduce the tax resolution opportunity, share 1 stat, mention free consultation, soft CTA]\n\n**Email 2 -- Day 3 (Value)**\nSubject: How [practice type] are earning $420+ per referral\nPreview: A simple conversation that could change your revenue...\nBody: [Explain the partner program, commission structure, how easy it is, include a success story, medium CTA]\n\n**Email 3 -- Day 7 (Action)**\nSubject: Your clients are waiting for this conversation\nPreview: 8-12% of clients at any practice have unresolved tax issues...\nBody: [Create urgency with IRS enforcement stats, provide scripts/talking points, strong CTA with direct referral link]'
    });
  }

  if (components.indexOf('timeline') !== -1) {
    campaign.components.push({
      type: 'timeline',
      title: 'Campaign Timeline',
      content: '**Week 1 -- Setup & Launch**\n- Monday: Finalize email sequences and scripts\n- Tuesday: Set up tracking (UTM parameters, referral codes)\n- Wednesday: Send Email 1 to full list\n- Thursday: Begin LinkedIn outreach (5 personalized messages/day)\n- Friday: Review open rates, adjust subject lines if under 25%\n\n**Week 2 -- Momentum**\n- Monday: Send Email 2 to openers from Email 1\n- Tuesday-Thursday: Phone follow-up with top 10 engaged contacts\n- Friday: Post first LinkedIn article on tax resolution awareness\n- Expected: 2-3 initial conversations\n\n**Week 3 -- Conversion Push**\n- Monday: Send Email 3 with direct referral CTA\n- Tuesday: Facebook ad campaign goes live (if selected)\n- Wednesday-Thursday: In-person meetings with warmest leads\n- Friday: Mid-campaign review, adjust targeting\n- Expected: 3-5 qualified referrals submitted\n\n**Week 4 -- Optimize & Scale**\n- Monday: Analyze what worked (best channel, best message)\n- Tuesday: Double down on winning channel\n- Wednesday: Create retargeting list from engaged contacts\n- Thursday: Plan next month campaign based on learnings\n- Friday: Campaign wrap-up report\n- Expected: 5-8 total referrals, 2-4 closed'
    });
  }

  if (components.indexOf('kpis') !== -1) {
    campaign.components.push({
      type: 'kpis',
      title: 'KPI Targets',
      content: '**1. Referrals Submitted**: Target 8-10 per campaign cycle. Track in portal dashboard. Benchmark: average partner submits 6/month.\n\n**2. Close Rate**: Target 65% or higher. Track via partner dashboard. Benchmark: network average is 58%.\n\n**3. Email Open Rate**: Target 30%+. Track via email platform. Benchmark: financial services average is 21%.\n\n**4. Response Rate**: Target 15% of outreach gets a reply. Track manually. Benchmark: cold outreach averages 8%.\n\n**5. Revenue per Campaign**: Target $3,360+ (8 referrals x 65% close x $420 commission). Track via commission reports.\n\n**6. Cost per Acquisition**: Target under $50 per qualified referral. Calculate: total campaign spend / referrals submitted.'
    });
  }

  return campaign;
}
