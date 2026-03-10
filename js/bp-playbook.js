// ══════════════════════════════════════════
//  M5P3C2: PARTNERSHIP GROWTH PLAYBOOK GENERATOR
//  AI-powered full playbook PDF
// ══════════════════════════════════════════

var BPP_CACHE_KEY = 'bp_playbook_cache';

function bppShowPlaybook() {
  var inputs = bppGetInputs();
  if (!inputs) {
    if (typeof showToast === 'function') showToast('Generate your roadmap first', 'error');
    return;
  }

  var overlay = document.createElement('div');
  overlay.className = 'aid-modal-overlay';
  overlay.id = 'bpp-modal';
  overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };

  var modal = document.createElement('div');
  modal.className = 'aid-modal';
  modal.style.maxWidth = '720px';

  modal.innerHTML = '<div class="aid-modal-header">'
    + '<div><div class="aid-modal-title">Growth Playbook Generator</div>'
    + '<div class="aid-modal-meta">AI-powered, customized to your practice</div></div>'
    + '<button class="aid-modal-close" onclick="document.getElementById(\'bpp-modal\').remove()">&times;</button>'
    + '</div>'
    + '<div class="aid-modal-body" id="bpp-body"></div>';

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // Check cache
  var cached = bppGetCache();
  if (cached && cached.practiceType === inputs.practiceType) {
    bppRenderPlaybook(cached.sections, inputs);
  } else {
    bppRenderPreview(inputs);
  }
}

function bppGetInputs() {
  try {
    var saved = localStorage.getItem('bp_saved_inputs');
    return saved ? JSON.parse(saved) : null;
  } catch (e) { return null; }
}

function bppGetCache() {
  try { return JSON.parse(localStorage.getItem(BPP_CACHE_KEY)); } catch (e) { return null; }
}

function bppSetCache(data) {
  try { localStorage.setItem(BPP_CACHE_KEY, JSON.stringify(data)); } catch (e) {}
}

// ── PREVIEW / GENERATE ──────────────────────────────

function bppRenderPreview(inputs) {
  var body = document.getElementById('bpp-body');
  if (!body) return;

  var practiceLabel = (typeof BP_PRACTICE_TYPES !== 'undefined') ? BP_PRACTICE_TYPES[inputs.practiceType] || 'Your Practice' : 'Your Practice';

  var html = '<div class="bpp-preview">'
    + '<div class="bpp-preview-icon"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg></div>'
    + '<div class="bpp-preview-title">Your Custom Growth Playbook</div>'
    + '<div class="bpp-preview-sub">A comprehensive, AI-generated playbook tailored for ' + practiceLabel + '</div>'
    + '</div>';

  // Chapters preview
  html += '<div class="bpp-chapters-preview">';
  var chapters = [
    { num: 1, title: 'Market Opportunity', desc: 'Your specific market size, IRS debt trends, and where the money is.' },
    { num: 2, title: 'Client Qualification Playbook', desc: 'How to identify, qualify, and approach clients with tax resolution needs.' },
    { num: 3, title: 'Conversation Scripts', desc: 'Word-for-word scripts for introductions, objections, and closing.' },
    { num: 4, title: 'Marketing Strategy', desc: 'Channel-specific tactics based on your budget and digital presence.' },
    { num: 5, title: 'Revenue Growth Model', desc: 'Month-by-month projections with actionable milestones.' },
    { num: 6, title: 'Partner Success Habits', desc: 'Daily, weekly, and monthly routines of top-performing partners.' }
  ];

  chapters.forEach(function(ch) {
    html += '<div class="bpp-ch-row">'
      + '<div class="bpp-ch-num">Ch. ' + ch.num + '</div>'
      + '<div class="bpp-ch-info">'
      + '<div class="bpp-ch-title">' + ch.title + '</div>'
      + '<div class="bpp-ch-desc">' + ch.desc + '</div>'
      + '</div>'
      + '</div>';
  });
  html += '</div>';

  html += '<div class="bpp-gen-section">'
    + '<button class="btn btn-p" id="bpp-gen-btn" onclick="bppGenerate()" style="width:100%">Generate My Playbook</button>'
    + '<div class="bpp-gen-note">Uses AI to create personalized content. Takes about 15 seconds.</div>'
    + '</div>';

  body.innerHTML = html;
}

// ── GENERATE ──────────────────────────────

async function bppGenerate() {
  var inputs = bppGetInputs();
  if (!inputs) return;

  var btn = document.getElementById('bpp-gen-btn');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span class="bpp-spinner"></span> Generating your playbook...';
  }

  var practiceLabel = (typeof BP_PRACTICE_TYPES !== 'undefined') ? BP_PRACTICE_TYPES[inputs.practiceType] || 'professional practice' : 'professional practice';
  var audienceLabel = (typeof BP_AUDIENCES !== 'undefined') ? BP_AUDIENCES[inputs.audience] || 'mixed clients' : 'mixed clients';
  var budget = parseInt(inputs.budget) || 0;

  var prompt = 'You are writing a Growth Playbook for a partner in the Community Tax referral program.\n\n'
    + 'Partner Profile:\n'
    + '- Practice type: ' + practiceLabel + '\n'
    + '- Client base: ' + (inputs.clientCount || 'unknown') + ' clients, primarily ' + audienceLabel + '\n'
    + '- Monthly referral goal: ' + (inputs.goal || 10) + ' referrals\n'
    + '- Marketing budget: $' + budget + '/month\n'
    + '- Digital presence: ' + (inputs.digital ? inputs.digital.join(', ') : 'minimal') + '\n'
    + '- Geography: ' + (inputs.geo || 'suburban') + '\n\n'
    + 'Generate a 6-chapter playbook as JSON with this exact structure:\n'
    + '{"chapters":[\n'
    + '  {"title":"Market Opportunity","content":"3-4 paragraphs about their specific market opportunity, IRS debt statistics relevant to their practice type, seasonal trends, and potential revenue"},\n'
    + '  {"title":"Client Qualification","content":"3-4 paragraphs with specific qualification criteria for their practice type, red flags to watch for, qualification questions to ask, and example scenarios"},\n'
    + '  {"title":"Conversation Scripts","content":"3 complete scripts: (1) Introduction script for bringing up tax resolution naturally, (2) Handling the #1 objection for their practice type, (3) Closing script for getting the referral"},\n'
    + '  {"title":"Marketing Strategy","content":"3-4 paragraphs with specific marketing tactics for their budget ($' + budget + '/mo), channels that work for ' + practiceLabel + ', content ideas, and outreach sequences"},\n'
    + '  {"title":"Revenue Growth Model","content":"Month-by-month projection for 6 months showing expected referrals, close rate, revenue, and key milestones. Include specific numbers based on their goal of ' + (inputs.goal || 10) + '/month"},\n'
    + '  {"title":"Success Habits","content":"Daily, weekly, and monthly routines. Include specific time investments, tool usage suggestions, and KPIs to track"}\n'
    + ']}\n\n'
    + 'Make everything hyper-specific to their practice type and situation. Use real numbers, percentages, and dollar amounts. No generic advice. Write in second person ("you").';

  try {
    if (typeof CTAX_API_KEY === 'undefined' || !CTAX_API_KEY) throw new Error('No API key');

    var resp = await fetch(CTAX_API_URL, {
      method: 'POST',
      headers: getApiHeaders(),
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!resp.ok) throw new Error('API ' + resp.status);
    var data = await resp.json();
    var text = data.content && data.content[0] ? data.content[0].text : '';

    var jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      var parsed = JSON.parse(jsonMatch[0]);
      if (parsed.chapters && parsed.chapters.length) {
        bppSetCache({ practiceType: inputs.practiceType, sections: parsed.chapters, generated: new Date().toISOString() });
        bppRenderPlaybook(parsed.chapters, inputs);
        return;
      }
    }
    throw new Error('Invalid response');

  } catch (err) {
    // Fallback to template-based content
    var fallback = bppGetFallbackContent(inputs);
    bppSetCache({ practiceType: inputs.practiceType, sections: fallback, generated: new Date().toISOString() });
    bppRenderPlaybook(fallback, inputs);
  }
}

// ── RENDER PLAYBOOK ──────────────────────────────

function bppRenderPlaybook(sections, inputs) {
  var body = document.getElementById('bpp-body');
  if (!body) return;

  var practiceLabel = (typeof BP_PRACTICE_TYPES !== 'undefined') ? BP_PRACTICE_TYPES[inputs.practiceType] || 'Your Practice' : 'Your Practice';

  var html = '<div class="bpp-header">'
    + '<div class="bpp-title">Growth Playbook</div>'
    + '<div class="bpp-subtitle">' + practiceLabel + ' Edition</div>'
    + '<div class="bpp-actions">'
    + '<button class="btn btn-g btn-sm" onclick="bppRegenerate()">Regenerate</button>'
    + '<button class="btn btn-p btn-sm" onclick="bppExportPdf()">Download PDF</button>'
    + '</div>'
    + '</div>';

  // Table of contents
  html += '<div class="bpp-toc">';
  sections.forEach(function(sec, i) {
    html += '<button class="bpp-toc-item" onclick="document.getElementById(\'bpp-ch-' + i + '\').scrollIntoView({behavior:\'smooth\',block:\'start\'})">'
      + '<span class="bpp-toc-num">Ch. ' + (i + 1) + '</span>'
      + '<span class="bpp-toc-title">' + sec.title + '</span>'
      + '</button>';
  });
  html += '</div>';

  // Chapters
  html += '<div class="bpp-chapters" id="bpp-chapters">';
  sections.forEach(function(sec, i) {
    html += '<div class="bpp-chapter" id="bpp-ch-' + i + '">'
      + '<div class="bpp-ch-header">'
      + '<span class="bpp-ch-badge">Chapter ' + (i + 1) + '</span>'
      + '<h3 class="bpp-ch-heading">' + sec.title + '</h3>'
      + '</div>'
      + '<div class="bpp-ch-content">' + bppFormatContent(sec.content) + '</div>'
      + '</div>';
  });
  html += '</div>';

  body.innerHTML = html;
}

function bppFormatContent(text) {
  if (!text) return '';
  // Convert newlines to paragraphs, bold text with ** markers
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .split(/\n\n+/)
    .map(function(p) {
      p = p.trim();
      if (!p) return '';
      // Check if it's a list item
      if (p.match(/^[\d]+\./)) {
        return '<p class="bpp-list-item">' + p + '</p>';
      }
      if (p.match(/^[-*]/)) {
        return '<p class="bpp-list-item">' + p.replace(/^[-*]\s*/, '') + '</p>';
      }
      return '<p>' + p + '</p>';
    })
    .join('');
}

function bppRegenerate() {
  localStorage.removeItem(BPP_CACHE_KEY);
  var inputs = bppGetInputs();
  if (inputs) bppRenderPreview(inputs);
}

// ── PDF EXPORT ──────────────────────────────

function bppExportPdf() {
  var el = document.getElementById('bpp-chapters');
  if (!el) return;

  // Build PDF-friendly document
  var doc = document.createElement('div');
  doc.style.cssText = 'width:816px;font-family:DM Sans,sans-serif;color:#1a2b3c;padding:40px;box-sizing:border-box';

  var inputs = bppGetInputs();
  var practiceLabel = (typeof BP_PRACTICE_TYPES !== 'undefined') ? BP_PRACTICE_TYPES[inputs.practiceType] || 'Your Practice' : 'Your Practice';

  // Cover page
  doc.innerHTML = '<div style="text-align:center;padding:80px 40px;background:linear-gradient(155deg,#0A1628,#0B5FD8);color:white;border-radius:12px;margin-bottom:40px">'
    + '<div style="font-size:14px;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:12px">Community Tax Partner Program</div>'
    + '<div style="font-family:DM Serif Display,serif;font-size:36px;margin-bottom:8px">Growth Playbook</div>'
    + '<div style="font-size:18px;opacity:0.8">' + practiceLabel + ' Edition</div>'
    + '<div style="font-size:13px;opacity:0.6;margin-top:24px">Generated ' + new Date().toLocaleDateString() + '</div>'
    + '</div>';

  // Add chapters
  doc.innerHTML += el.innerHTML;

  CTAX_PDF.exportElement(doc, 'Growth_Playbook_' + (inputs.practiceType || 'partner') + '.pdf', { margin: 10, unit: 'mm', format: 'a4' });
}

// ── FALLBACK CONTENT ──────────────────────────────

function bppGetFallbackContent(inputs) {
  var goal = inputs.goal || 10;
  var budget = parseInt(inputs.budget) || 0;
  var practiceLabel = (typeof BP_PRACTICE_TYPES !== 'undefined') ? BP_PRACTICE_TYPES[inputs.practiceType] || 'professional practice' : 'professional practice';

  return [
    {
      title: 'Market Opportunity',
      content: 'The IRS currently has over $181 billion in outstanding tax debt from individual taxpayers alone. As a ' + practiceLabel + ', you sit at a unique intersection: your clients trust you with their financial lives, and many of them are carrying unresolved tax burdens they have not mentioned.\n\nIndustry data shows that 8-12% of clients at any given practice have some form of unresolved tax issue. For your client base, that could mean dozens of potential referrals waiting to be identified. The average case value in tax resolution is $11,000-$16,000, with partner commissions averaging $420 per closed case.\n\nThe market is growing. Post-pandemic IRS enforcement has increased, estimated tax assessments are up 23% year-over-year, and the IRS has hired thousands of new agents. This means more taxpayers receiving notices, more panic, and more need for professional resolution services.\n\nYour geographic market (' + (inputs.geo || 'suburban') + ') adds additional context. ' + (inputs.geo === 'urban' ? 'Urban markets have higher average tax debts ($18,500) but more competition.' : inputs.geo === 'rural' ? 'Rural markets have less competition but lower average debts ($11,800). Your personal relationships are your biggest advantage.' : 'Suburban markets offer a balanced opportunity with moderate competition and $14,200 average tax debt.')
    },
    {
      title: 'Client Qualification',
      content: 'Not every client is a good referral candidate. The best referrals come from clients who meet these criteria:\n\n1. They owe the IRS $5,000 or more in back taxes\n2. They have received IRS notices (CP14, CP501, CP504, or worse)\n3. They have unfiled tax returns for one or more years\n4. They are experiencing wage garnishment, bank levy, or tax lien\n5. They are self-employed with estimated tax payment issues\n\nAs a ' + practiceLabel + ', your qualification conversations happen naturally. When reviewing financials, ask: "Have you received any IRS notices recently?" or "Are all your tax filings current?" These questions surface issues without being intrusive.\n\nRed flags to watch for: clients who mention "tax problems" casually, clients requesting payment extensions from the IRS, clients with sudden income changes, and clients going through divorce (joint liability issues are common).\n\nThe Client Qualifier tool in your portal can score potential referrals automatically. Input the client situation and get an instant assessment of referral strength, recommended approach, and talking points.'
    },
    {
      title: 'Conversation Scripts',
      content: 'Script 1 - Natural Introduction:\n"I have been working with a company called Community Tax that helps clients resolve IRS debt -- things like back taxes, unfiled returns, and wage garnishments. If you or anyone you know is dealing with something like that, I can connect you directly with their team. They handle everything, and the initial investigation is just $295."\n\nScript 2 - Handling "I can not afford it":\n"I completely understand the concern about cost. Here is the thing -- the investigation fee is $295, and if they find you qualify for resolution, the monthly payments on the resolution itself are usually very manageable. But here is what most people do not realize: the IRS adds penalties and interest every single day you wait. A $10,000 debt can become $15,000 in a year just from penalties. So the real cost is not taking action."\n\nScript 3 - Closing for the Referral:\n"Would it be helpful if I connected you with their team? They will do a free initial review of your situation over the phone -- no obligation. If there is nothing they can help with, they will tell you. But if there is, you will know exactly what your options are. I can submit your information right now and they will reach out today. Sound good?"'
    },
    {
      title: 'Marketing Strategy',
      content: (budget > 0 ? 'With your $' + budget + '/month marketing budget, here is how to allocate for maximum ROI:\n\n' + (budget >= 500 ? '40% ($' + Math.round(budget * 0.4) + ') on Google Ads targeting "IRS tax help" + your city. These are high-intent searches with strong conversion rates.\n30% ($' + Math.round(budget * 0.3) + ') on Facebook/LinkedIn retargeting to stay visible to past visitors.\n20% ($' + Math.round(budget * 0.2) + ') on content creation (blog posts, social media, email sequences).\n10% ($' + Math.round(budget * 0.1) + ') on testing new channels each month.' : 'Focus your budget on direct outreach email campaigns and social media content. At this level, organic strategies combined with targeted promotion deliver the best ROI.') : 'With an organic-only approach, your strategy centers on leveraging existing relationships:\n\n1. Email your entire client list with a "Tax Health Check" offer (use the Script Builder to generate the email)\n2. Post weekly on LinkedIn about tax resolution topics (use the Ad Maker for visuals)\n3. Add a tax resolution section to your website (use the Page Builder)\n4. Attend 1-2 local business networking events per month') + '\n\nRegardless of budget, these three channels consistently perform for ' + practiceLabel + ':\n- Direct client conversations (highest conversion, lowest cost)\n- Email campaigns to existing clients (scalable, trackable)\n- Referral partnerships with complementary professionals'
    },
    {
      title: 'Revenue Growth Model',
      content: 'Based on your goal of ' + goal + ' referrals per month, here is your projected 6-month trajectory:\n\nMonth 1: ' + Math.round(goal * 0.3) + ' referrals -> ' + Math.round(goal * 0.3 * 0.6) + ' closed -> $' + (Math.round(goal * 0.3 * 0.6) * 420).toLocaleString() + ' revenue (ramp-up phase)\nMonth 2: ' + Math.round(goal * 0.5) + ' referrals -> ' + Math.round(goal * 0.5 * 0.65) + ' closed -> $' + (Math.round(goal * 0.5 * 0.65) * 420).toLocaleString() + ' revenue (building momentum)\nMonth 3: ' + Math.round(goal * 0.7) + ' referrals -> ' + Math.round(goal * 0.7 * 0.68) + ' closed -> $' + (Math.round(goal * 0.7 * 0.68) * 420).toLocaleString() + ' revenue (hitting stride)\nMonth 4: ' + Math.round(goal * 0.85) + ' referrals -> ' + Math.round(goal * 0.85 * 0.68) + ' closed -> $' + (Math.round(goal * 0.85 * 0.68) * 420).toLocaleString() + ' revenue\nMonth 5: ' + Math.round(goal * 0.95) + ' referrals -> ' + Math.round(goal * 0.95 * 0.7) + ' closed -> $' + (Math.round(goal * 0.95 * 0.7) * 420).toLocaleString() + ' revenue\nMonth 6: ' + goal + ' referrals -> ' + Math.round(goal * 0.7) + ' closed -> $' + (Math.round(goal * 0.7) * 420).toLocaleString() + ' revenue (at goal)\n\n6-month projected total: $' + Math.round(((goal * 0.3 * 0.6) + (goal * 0.5 * 0.65) + (goal * 0.7 * 0.68) + (goal * 0.85 * 0.68) + (goal * 0.95 * 0.7) + (goal * 0.7)) * 420).toLocaleString() + '\n\nKey milestones:\n- First closed referral (Week 2-3)\n- First commission payment (Month 2)\n- Hitting 50% of monthly goal (Month 3)\n- Reaching full monthly goal (Month 6)'
    },
    {
      title: 'Success Habits',
      content: 'Daily habits (15 minutes total):\n- Review your referral pipeline in the dashboard (2 min)\n- Complete your 30-Day Challenge task (10 min)\n- Send one follow-up message to a prospect (3 min)\n\nWeekly habits (1 hour total):\n- Monday: Plan outreach for the week, generate fresh scripts (15 min)\n- Wednesday: Create one piece of marketing content (15 min)\n- Friday: Submit any qualified referrals, review weekly metrics (15 min)\n- Weekend: Review the Referral Playbook for new strategies (15 min)\n\nMonthly habits (2 hours total):\n- Run your revenue projection and compare actual vs projected (20 min)\n- Update your ICP profile based on what is working (15 min)\n- Create a new landing page for a campaign (30 min)\n- Review and update your email sequences (20 min)\n- Set next month goals based on trends (15 min)\n- Attend one industry event or webinar (optional but recommended)\n\nKPIs to track:\n- Referrals submitted per week\n- Close rate (should trend above 60%)\n- Average time from referral to close\n- Revenue per referral\n- Pipeline value (open referrals x avg commission)'
    }
  ];
}
