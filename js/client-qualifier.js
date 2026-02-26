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
    alert('Please fill in at least the tax debt, issue type, and years affected.');
    return;
  }

  document.getElementById('cq-form-wrap').style.display = 'none';
  document.getElementById('cq-loading').style.display = 'block';
  document.getElementById('cq-output').style.display = 'none';
  document.getElementById('cq-error').style.display = 'none';

  var msgs = ['Evaluating tax debt indicators...','Checking resolution eligibility...','Estimating case value...','Preparing talking points...'];
  var mi = 0, mel = document.getElementById('cq-loading-msg');
  var mint = setInterval(function(){ mi=(mi+1)%msgs.length; mel.textContent=msgs[mi]; }, 2500);

  var prompt = 'You are a senior intake analyst at Community Tax, a national IRS tax resolution firm (15 years, $2.3B resolved, 120K+ clients). A referral partner is asking whether a potential client is a good referral candidate.\n\n'
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
    + '{"verdict": "STRONG|LIKELY|WEAK|NOT_QUALIFIED", "verdict_title": "short title", "verdict_desc": "one sentence explanation", "resolution_path": "primary recommended program", "case_value_low": "$X,XXX", "case_value_high": "$XX,XXX", "commission_low": "$X,XXX", "commission_high": "$X,XXX"}\n'
    + 'Rules: verdict=STRONG if debt>$15k with active enforcement. LIKELY if debt>$7k with clear issue. WEAK if debt uncertain or borderline. NOT_QUALIFIED if debt clearly under $7k.\n\n'
    + 'SECTION 2 — ANALYSIS (2-3 paragraphs, use <b>bold</b> for key terms, no markdown/asterisks):\n'
    + 'Explain why this client does or does not qualify. Be specific about which resolution program fits and why. If the client has multiple issues, address each. Mention urgency factors (active levies, garnishments, etc.).\n\n'
    + 'SECTION 3 — TALKING POINTS (4-5 lines, each starting with <b>bold label:</b>):\n'
    + 'Give the partner specific things to say to this client. Frame each around the client\'s situation. Include how to bring up the $295 investigation fee naturally. Use plain, conversational language — not salesy.';

  try {
    var resp = await fetch('https://api.anthropic.com/v1/messages', {
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

    // Parse JSON
    var result = {verdict:'LIKELY',verdict_title:'Likely Candidate',verdict_desc:'This client appears to be a reasonable referral.',resolution_path:'Installment Agreement',case_value_low:'$8,000',case_value_high:'$20,000',commission_low:'$1,500',commission_high:'$3,000'};
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

    document.getElementById('cq-loading').style.display = 'none';
    document.getElementById('cq-output').style.display = 'block';

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

