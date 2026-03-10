// ── CLIENT QUALIFIER ──────────────────────────────────────
var cqAnalysisText = '';

function resetQualifier() {
  document.getElementById('cq-form-wrap').style.display = 'block';
  document.getElementById('cq-output').style.display = 'none';
  document.getElementById('cq-loading').style.display = 'none';
  document.getElementById('cq-error').style.display = 'none';
  cqAnalysisText = '';
}

function copyCqAnalysis() {
  navigator.clipboard.writeText(cqAnalysisText).then(function(){
    var btns = document.querySelectorAll('#cq-output .btn-s');
    btns.forEach(function(b){ if(b.textContent.indexOf('Copy')!==-1){ var o=b.innerHTML; b.innerHTML='Copied'; setTimeout(function(){b.innerHTML=o;},2000); }});
  });
}

async function qualifyClient() {
  if (!CTAX_API_KEY) { if (!promptForApiKey()) return; }

  var debt = document.getElementById('cq-debt').value;
  var issue = document.getElementById('cq-issue').value;
  var years = document.getElementById('cq-years').value;
  var notices = document.getElementById('cq-notices').value;
  var employment = document.getElementById('cq-employment').value;
  var notes = document.getElementById('cq-notes').value.trim();

  if (!debt || !issue || !years) {
    var cqErr = document.getElementById('cq-error');
    if (cqErr) {
      cqErr.textContent = 'Please fill in at least the tax debt, issue type, and years affected.';
      cqErr.style.display = 'block';
    }
    return;
  }

  document.getElementById('cq-form-wrap').style.display = 'none';
  document.getElementById('cq-loading').style.display = 'block';
  document.getElementById('cq-output').style.display = 'none';
  document.getElementById('cq-error').style.display = 'none';

  var msgs = ['Evaluating tax debt indicators...','Checking resolution eligibility...','Estimating case value...','Preparing talking points...'];
  var mi = 0, mel = document.getElementById('cq-loading-msg');
  var mint = setInterval(function(){ mi=(mi+1)%msgs.length; mel.textContent=msgs[mi]; }, 2500);

  var icpBlock = '';
  if (typeof ICPContext !== 'undefined' && ICPContext.hasProfile()) {
    icpBlock = ICPContext.getPromptContext() + '\n\nUse the ICP profile above to cross-reference this client against the partner\'s ideal client persona. Check alignment with their ICP red flags, disqualifiers, and conversion drivers. Factor ICP insights into your qualification reasoning.\n\n';
  }

  var prompt = icpBlock + 'You are a senior intake analyst at Community Tax, a national IRS tax resolution firm (15 years, $2.3B resolved, 120K+ clients). A referral partner is asking whether a potential client is a good referral candidate.\n\n'
    + 'Program facts:\n'
    + '- Minimum qualifying tax debt: $7,000+\n'
    + '- Investigation fee: $295 ($500 for businesses)\n'
    + '- Average case value: $8,000-$80,000+\n'
    + '- Partner revenue per closed case: $1,500-$4,000\n'
    + '- Resolution options: Offer in Compromise (OIC), Installment Agreement (IA), Currently Not Collectible (CNC), Penalty Abatement, Innocent Spouse Relief, Lien/Levy Release, Audit Representation\n'
    + '- ~80% referral-to-consultation conversion rate\n'
    + '- Typical timeline: 30-90 days\n\n'
    + 'CLIENT PROFILE:\n'
    + '- Estimated tax debt: ' + debt + '\n'
    + '- Type of issue: ' + issue + '\n'
    + '- Years affected: ' + years + '\n'
    + '- IRS notices received: ' + (notices || 'Not provided') + '\n'
    + '- Employment type: ' + (employment || 'Not provided') + '\n'
    + (notes ? '- Additional context: ' + notes + '\n' : '')
    + '\nRespond in EXACTLY this format with sections separated by "---SECTION---":\n\n'
    + 'SECTION 1 — JSON (no other text):\n'
    + '{"verdict": "STRONG|LIKELY|WEAK|NOT_QUALIFIED", "verdict_title": "short title", "verdict_desc": "one sentence explanation", "resolution_path": "primary recommended program", "case_value_low": "$X,XXX", "case_value_high": "$XX,XXX", "commission_low": "$X,XXX", "commission_high": "$X,XXX", "confidence": 85}\n'
    + 'Rules: verdict=STRONG if debt>$15k with active enforcement. LIKELY if debt>$7k with clear issue. WEAK if debt uncertain or borderline. NOT_QUALIFIED if debt clearly under $7k. confidence is 0-100 score indicating how sure you are this is a good referral.\n\n'
    + 'SECTION 2 — ANALYSIS (2-3 paragraphs, use <b>bold</b> for key terms, no markdown/asterisks):\n'
    + 'Explain why this client does or does not qualify. Be specific about which resolution program fits and why. If the client has multiple issues, address each. Mention urgency factors (active levies, garnishments, etc.).\n\n'
    + 'SECTION 3 — TALKING POINTS (4-5 lines, each starting with <b>bold label:</b>):\n'
    + 'Give the partner specific things to say to this client. Frame each around the client\'s situation. Include how to bring up the $295 investigation fee naturally. Use plain, conversational language — not salesy.\n\n'
    + 'SECTION 4 — NEXT STEPS (exactly 3 lines, numbered 1-3):\n'
    + 'The exact 3 things the partner should do next with this client, in order. Be specific and actionable — not generic advice. Include timeframes (e.g., "within 48 hours", "this week").';

  try {
    var resp = await fetch(CTAX_API_URL, {
      method: 'POST',
      headers: getApiHeaders(),
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1200,
        messages: [{role: 'user', content: prompt}]
      })
    });
    if(!resp.ok) throw new Error(resp.status === 401 ? '401' : 'API returned ' + resp.status);
    var data = await resp.json();
    if(data.error) throw new Error(data.error.message || 'API error');
    var text = data.content && data.content[0] ? data.content[0].text : '';
    clearInterval(mint);

    var sections = text.split('---SECTION---');
    var jsonRaw = (sections[0] || '').trim();
    var analysis = (sections[1] || '').trim();
    var talking = (sections[2] || '').trim();
    var nextSteps = (sections[3] || '').trim();

    // Parse JSON
    var result = {verdict:'LIKELY',verdict_title:'Likely Candidate',verdict_desc:'This client appears to be a reasonable referral.',resolution_path:'Installment Agreement',case_value_low:'$8,000',case_value_high:'$20,000',commission_low:'$1,500',commission_high:'$3,000',confidence:70};
    try {
      var jm = jsonRaw.match(/\{[\s\S]*\}/);
      if(jm) result = JSON.parse(jm[0]);
    } catch(e){}

    // Store for copy
    cqAnalysisText = 'CLIENT QUALIFICATION ANALYSIS\n\nVerdict: ' + result.verdict_title + '\n' + result.verdict_desc + '\n\nResolution Path: ' + result.resolution_path + '\nEstimated Case Value: ' + result.case_value_low + ' - ' + result.case_value_high + '\nEstimated Commission: ' + result.commission_low + ' - ' + result.commission_high + '\n\n' + analysis.replace(/<[^>]+>/g, '') + '\n\nTalking Points:\n' + talking.replace(/<[^>]+>/g, '');

    // Verdict banner
    var verdictClass = 'cq-verdict-likely';
    var verdictIcon = '';
    if(result.verdict === 'STRONG'){ verdictClass = 'cq-verdict-strong'; verdictIcon = '\u2714'; }
    else if(result.verdict === 'LIKELY'){ verdictClass = 'cq-verdict-likely'; verdictIcon = '\u2714'; }
    else if(result.verdict === 'WEAK'){ verdictClass = 'cq-verdict-weak'; verdictIcon = '\u26A0'; }
    else if(result.verdict === 'NOT_QUALIFIED'){ verdictClass = 'cq-verdict-no'; verdictIcon = '\u2716'; }

    var vEl = document.getElementById('cq-verdict');
    vEl.className = 'cq-verdict ' + verdictClass;
    vEl.innerHTML = '<div class="cq-verdict-icon">' + verdictIcon + '</div><div class="cq-verdict-text"><div class="cq-verdict-title">' + (result.verdict_title || result.verdict) + '</div><div class="cq-verdict-desc">' + (result.verdict_desc || '') + '</div></div>';

    // Detail cards
    document.getElementById('cq-path').textContent = result.resolution_path || 'See analysis';
    document.getElementById('cq-value').textContent = (result.case_value_low || '$8,000') + ' \u2013 ' + (result.case_value_high || '$20,000');
    document.getElementById('cq-commission').textContent = (result.commission_low || '$1,500') + ' \u2013 ' + (result.commission_high || '$3,000');

    // Analysis & talking points
    document.getElementById('cq-analysis-text').innerHTML = analysis;
    document.getElementById('cq-talking-text').innerHTML = talking;

    // Animated verdict entrance
    vEl.style.transform = 'scale(0.8)';
    vEl.style.opacity = '0';
    vEl.style.transition = 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease';
    setTimeout(function() { vEl.style.transform = 'scale(1)'; vEl.style.opacity = '1'; }, 50);

    // Confidence gauge with animated fill
    var conf = parseInt(result.confidence) || 70;
    window._cqResult = result;
    window._cqConf = conf;
    var gaugeEl = document.getElementById('cq-confidence');
    if (gaugeEl) {
      var gaugeColor = conf >= 80 ? '#22c55e' : conf >= 60 ? '#eab308' : conf >= 40 ? '#f97316' : '#ef4444';
      gaugeEl.innerHTML = '<div class="f-sec-lbl" style="margin-bottom:12px">REFERRAL CONFIDENCE</div>'
        + '<div style="display:flex;align-items:center;gap:16px">'
        + '<div style="flex:1;height:8px;background:var(--off2);border-radius:4px;overflow:hidden">'
        + '<div id="cq-gauge-fill" style="width:0%;height:100%;background:' + gaugeColor + ';border-radius:4px;transition:width 0.8s cubic-bezier(0.16,1,0.3,1)"></div>'
        + '</div>'
        + '<div id="cq-gauge-num" style="font-size:24px;font-weight:700;color:' + gaugeColor + ';min-width:50px;text-align:right">0%</div>'
        + '</div>'
        + '<div style="font-size:13px;color:var(--slate);margin-top:6px">' + (conf >= 80 ? 'High confidence — this is a strong referral candidate.' : conf >= 60 ? 'Moderate confidence — worth pursuing, gather more details if possible.' : 'Lower confidence — consider gathering more information before referring.') + '</div>';
      gaugeEl.style.display = 'block';
      // Animate fill after render
      setTimeout(function() {
        var fill = document.getElementById('cq-gauge-fill');
        var num = document.getElementById('cq-gauge-num');
        if (fill) fill.style.width = conf + '%';
        // Count up the number
        var current = 0;
        var step = Math.max(1, Math.round(conf / 30));
        var counter = setInterval(function() {
          current = Math.min(current + step, conf);
          if (num) num.textContent = current + '%';
          if (current >= conf) clearInterval(counter);
        }, 25);
      }, 200);
    }

    // Next steps / action plan
    var stepsEl = document.getElementById('cq-next-steps');
    if (stepsEl && nextSteps) {
      var stepsHtml = '<div class="f-sec-lbl" style="margin-bottom:12px">YOUR NEXT 3 STEPS</div>';
      var stepLines = nextSteps.split('\n').filter(function(l) { return l.trim(); });
      stepLines.forEach(function(line, i) {
        var cleanLine = line.replace(/^\d+[\.\)]\s*/, '');
        stepsHtml += '<div class="cq-step">'
          + '<div class="cq-step-num">' + (i + 1) + '</div>'
          + '<div class="cq-step-text">' + cleanLine + '</div>'
          + '</div>';
      });
      stepsEl.innerHTML = stepsHtml;
      stepsEl.style.display = 'block';
    }

    document.getElementById('cq-loading').style.display = 'none';
    document.getElementById('cq-output').style.display = 'block';

    // Track usage
    if (typeof trackToolUsage === 'function') trackToolUsage('client-qualifier');

    // Save to recent results
    if (typeof saveToolResult === 'function') {
      saveToolResult('client-qualifier', (result.verdict_title || result.verdict) + ' · ' + debt, {
        text: cqAnalysisText,
        verdict: result.verdict,
        debt: debt,
        issue: issue
      });
    }

    // M2P2C2: Save cross-tool context
    if (typeof saveToolContext === 'function') {
      saveToolContext('client-qualifier', {
        verdict: result.verdict, debt: debt, issueType: issue,
        confidence: result.confidence, analysis: (cqAnalysisText || '').substring(0, 300)
      });
    }

    // M2P2C2: Show smart suggestions
    setTimeout(function() { if (typeof showSmartSuggestions === 'function') showSmartSuggestions('client-qualifier'); }, 500);

    // What's Next CTA
    if (typeof WhatsNext !== 'undefined') {
      var cqOut = document.getElementById('cq-output');
      if (cqOut) WhatsNext.render(cqOut, 'client-qualifier');
    }

  } catch(err) {
    clearInterval(mint);
    document.getElementById('cq-loading').style.display = 'none';
    document.getElementById('cq-form-wrap').style.display = 'block';
    var errDiv = document.getElementById('cq-error');
    var isAuth = err.message && err.message.indexOf('401') !== -1;
    var msg = isAuth
      ? 'Invalid API key. Please check your key and try again.'
      : 'Unable to qualify this client right now. Please try again in a moment.';
    errDiv.innerHTML = msg + ' <a href="#" onclick="document.getElementById(\'cq-error\').style.display=\'none\';return false" style="color:var(--blue);text-decoration:underline;margin-left:8px">Dismiss</a>';
    errDiv.style.display = 'block';
  }
}

// ── PDF EXPORT ─────────────────────────────────────────
function downloadQualifierPdf() {
  if (typeof CTAX_PDF === 'undefined') {
    if (typeof showToast === 'function') showToast('PDF system not loaded. Please refresh and try again.', 'error');
    return;
  }
  var r = window._cqResult || {};
  var conf = window._cqConf || 70;
  var doc = CTAX_PDF.createDoc();

  doc += CTAX_PDF.createCover('Client Qualification Report', (r.verdict_title || r.verdict || 'Analysis'), 'Generated by CTAX Studios Client Qualifier');

  var verdictColor = r.verdict === 'STRONG' ? '#22c55e' : r.verdict === 'LIKELY' ? '#0B5FD8' : r.verdict === 'WEAK' ? '#f97316' : '#ef4444';

  doc += CTAX_PDF.createPage(
    '<div style="text-align:center;padding:20px 0 24px">' +
      '<div style="display:inline-block;padding:12px 28px;border-radius:8px;background:' + verdictColor + ';color:#fff;font-size:18px;font-weight:700">' + CTAX_PDF.esc(r.verdict_title || r.verdict || '') + '</div>' +
      '<div style="font-size:13px;color:#64748b;margin-top:8px">' + CTAX_PDF.esc(r.verdict_desc || '') + ' | Confidence: ' + conf + '%</div>' +
    '</div>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:20px">' +
      '<div style="background:#f0f4f8;border-radius:8px;padding:14px;text-align:center"><div style="font-size:11px;font-weight:700;color:#64748b;margin-bottom:4px">RESOLUTION PATH</div><div style="font-size:14px;font-weight:600;color:#0A1628">' + CTAX_PDF.esc(r.resolution_path || '') + '</div></div>' +
      '<div style="background:#f0f4f8;border-radius:8px;padding:14px;text-align:center"><div style="font-size:11px;font-weight:700;color:#64748b;margin-bottom:4px">CASE VALUE</div><div style="font-size:14px;font-weight:600;color:#0A1628">' + CTAX_PDF.esc((r.case_value_low || '') + ' - ' + (r.case_value_high || '')) + '</div></div>' +
      '<div style="background:#f0f4f8;border-radius:8px;padding:14px;text-align:center"><div style="font-size:11px;font-weight:700;color:#64748b;margin-bottom:4px">YOUR COMMISSION</div><div style="font-size:14px;font-weight:600;color:#0A1628">' + CTAX_PDF.esc((r.commission_low || '') + ' - ' + (r.commission_high || '')) + '</div></div>' +
    '</div>' +
    '<h3 style="font-family:DM Serif Display,serif;font-size:18px;color:#0A1628;margin-bottom:10px">Analysis</h3>' +
    '<div style="font-size:13px;line-height:1.8;color:#1a2a3a;margin-bottom:20px">' + (document.getElementById('cq-analysis-text') || {}).innerHTML + '</div>' +
    '<h3 style="font-family:DM Serif Display,serif;font-size:18px;color:#0A1628;margin-bottom:10px">Talking Points</h3>' +
    '<div style="font-size:13px;line-height:1.8;color:#1a2a3a">' + (document.getElementById('cq-talking-text') || {}).innerHTML + '</div>'
  );

  doc += '</div>';
  CTAX_PDF.renderPdf(doc, 'CTAX-Client-Qualification.pdf');
}

// ── EMAIL DRAFT ────────────────────────────────────────
function draftQualifierEmail() {
  var r = window._cqResult || {};
  var verdict = r.verdict_title || r.verdict || 'Qualification Result';
  var path = r.resolution_path || 'tax resolution';
  var value = (r.case_value_low || '$8,000') + ' - ' + (r.case_value_high || '$20,000');

  var subject = 'Quick Update on Your Tax Situation';
  var body = 'Hi [Client Name],\n\n'
    + 'I wanted to follow up on our conversation about your tax situation. '
    + 'After reviewing the details, I believe you could be a strong candidate for ' + path + ' through Community Tax, a firm I partner with that specializes in IRS resolution.\n\n'
    + 'Here\'s what stood out:\n'
    + '- Your case fits their ' + path + ' program\n'
    + '- Estimated case value: ' + value + '\n'
    + '- They\'ve resolved over $2.3 billion in tax debt for 120,000+ clients\n\n'
    + 'The first step is a free consultation to review your options. There\'s no obligation — just a conversation to see what\'s possible.\n\n'
    + 'Would you be open to a quick call this week? I can make the introduction directly.\n\n'
    + 'Best,\n[Your Name]';

  // Show in a modal
  var overlay = document.createElement('div');
  overlay.id = 'cq-email-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(10,22,40,0.6);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px';
  overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };

  var modal = document.createElement('div');
  modal.style.cssText = 'background:var(--white);border-radius:14px;padding:32px;max-width:600px;width:100%;max-height:80vh;overflow-y:auto;box-shadow:0 24px 64px rgba(10,22,40,0.3)';
  modal.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">'
    + '<div style="font-family:DM Serif Display,serif;font-size:20px;color:var(--navy)">Draft Client Email</div>'
    + '<button onclick="document.getElementById(\'cq-email-overlay\').remove()" style="background:none;border:none;font-size:20px;cursor:pointer;color:var(--slate)">&times;</button>'
    + '</div>'
    + '<div style="font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--slate);margin-bottom:6px">Subject</div>'
    + '<input type="text" id="cq-email-subject" value="' + subject.replace(/"/g, '&quot;') + '" style="width:100%;padding:10px 14px;border:1.5px solid var(--off2);border-radius:8px;font-size:15px;margin-bottom:16px;box-sizing:border-box">'
    + '<div style="font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--slate);margin-bottom:6px">Body</div>'
    + '<textarea id="cq-email-body" style="width:100%;height:300px;padding:14px;border:1.5px solid var(--off2);border-radius:8px;font-size:14px;line-height:1.7;resize:vertical;box-sizing:border-box;font-family:DM Sans,sans-serif">' + body.replace(/</g, '&lt;') + '</textarea>'
    + '<div style="display:flex;gap:10px;margin-top:16px">'
    + '<button class="btn btn-p" onclick="copyCqEmail()">Copy to Clipboard</button>'
    + '<button class="btn btn-s" onclick="document.getElementById(\'cq-email-overlay\').remove()">Close</button>'
    + '</div>';

  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}

function copyCqEmail() {
  var subject = (document.getElementById('cq-email-subject') || {}).value || '';
  var body = (document.getElementById('cq-email-body') || {}).value || '';
  var full = 'Subject: ' + subject + '\n\n' + body;
  navigator.clipboard.writeText(full).then(function() {
    if (typeof showToast === 'function') showToast('Email copied to clipboard!', 'copied');
    var overlay = document.getElementById('cq-email-overlay');
    if (overlay) setTimeout(function() { overlay.remove(); }, 500);
  });
}

