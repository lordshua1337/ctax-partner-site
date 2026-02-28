// --- AI Tool Portal Embeds ---
// Tab switching and demo generation for the AI tools in the portal.

function aiTabSwitch(btn, panelId) {
  var wrap = btn.closest('.ai-portal-embed');
  if (!wrap) return;
  wrap.querySelectorAll('.ai-embed-tab').forEach(function(t) { t.classList.remove('ai-embed-tab-active'); });
  btn.classList.add('ai-embed-tab-active');
  wrap.querySelectorAll('.ai-embed-panel').forEach(function(p) { p.classList.remove('ai-embed-panel-active'); });
  var panel = document.getElementById(panelId);
  if (panel) panel.classList.add('ai-embed-panel-active');
}

function aiDemoGenerate(btn) {
  var wrap = btn.closest('.ai-portal-embed') || btn.closest('.ai-embed-panel');
  var result = wrap ? wrap.querySelector('.ai-embed-result') : null;
  if (!result) {
    var panel = btn.closest('.ai-embed-panel');
    if (panel) result = panel.querySelector('.ai-embed-result');
  }
  if (!result) return;

  btn.disabled = true;
  btn.textContent = 'Generating...';

  setTimeout(function() {
    var sectionId = btn.closest('.portal-section') ? btn.closest('.portal-section').id : '';
    var output = aiGetDemoOutput(sectionId, btn);
    result.innerHTML = '<div class="ai-result-card">' + output + '</div>';
    result.style.display = 'block';
    btn.disabled = false;
    btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Generated';
    setTimeout(function() {
      btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg> Regenerate';
      btn.disabled = false;
    }, 2000);
  }, 1200);
}

function aiGetDemoOutput(sectionId, btn) {
  if (sectionId === 'portal-sec-ai-scripts') {
    var panel = btn.closest('.ai-embed-panel');
    var panelId = panel ? panel.id : '';
    if (panelId === 'ai-sb-email' || panelId === '') {
      return '<div class="ai-result-label">Generated Email</div>' +
        '<p><strong>Subject:</strong> Quick question about your tax situation</p>' +
        '<p>Hi [Client Name],</p>' +
        '<p>Hope you\'re doing well! I wanted to reach out because during our last conversation, you mentioned some concerns about your IRS balance. I\'ve been working with a licensed tax resolution firm called Community Tax that specializes in exactly this kind of situation.</p>' +
        '<p>They handle everything from offers in compromise to installment agreements, and their team has resolved over $600M in tax debt for clients. I\'d love to connect you -- there\'s no cost or obligation for the initial consultation.</p>' +
        '<p>Would you be open to a quick call this week to discuss?</p>' +
        '<p>Best,<br>[Your Name]</p>';
    }
    if (panelId === 'ai-sb-objections') {
      return '<div class="ai-result-label">Objection Response</div>' +
        '<p><strong>"I can\'t afford it"</strong></p>' +
        '<p>I completely understand that concern -- and honestly, that\'s exactly why this program exists. Community Tax works with clients at every income level, and many of their resolution options actually reduce what you owe. The initial consultation is free, and they can typically outline your options within the first call.</p>' +
        '<p>The real cost is doing nothing -- penalties and interest keep growing, and the IRS has 10 years to collect. The sooner you start, the more options you have.</p>';
    }
    return '<div class="ai-result-label">Conversation Script</div>' +
      '<p><strong>Opening:</strong> "Hey [name], I wanted to bring something up because I think it could really help you. You mentioned the IRS balance from 2021-2023 -- I work with a firm that specializes in exactly this."</p>' +
      '<p><strong>Bridge:</strong> "They\'re called Community Tax. Licensed tax attorneys and enrolled agents who negotiate directly with the IRS. They\'ve resolved over $600M in cases like yours."</p>' +
      '<p><strong>Close:</strong> "The initial consultation is completely free. I can introduce you directly -- would that be helpful?"</p>' +
      '<p class="ai-result-note">Tip: Emphasize that you\'re recommending them because you\'ve seen results, not because you\'re getting paid.</p>';
  }

  if (sectionId === 'portal-sec-ai-admaker') {
    return '<div class="ai-result-label">Generated Ad Preview</div>' +
      '<div class="ai-ad-preview">' +
      '<div class="ai-ad-mock">' +
      '<div class="ai-ad-mock-header">Sponsored</div>' +
      '<div class="ai-ad-mock-body">' +
      '<div class="ai-ad-mock-headline">Struggling with IRS debt?</div>' +
      '<div class="ai-ad-mock-text">You don\'t have to face the IRS alone. Our licensed tax resolution team has helped thousands of taxpayers reduce their debt and get back on track. Free consultation -- no obligation.</div>' +
      '<div class="ai-ad-mock-cta">Get Free Assessment</div>' +
      '</div></div>' +
      '<div class="ai-ad-specs"><strong>Format:</strong> LinkedIn Single Image · <strong>Size:</strong> 1200x628 · <strong>Headline:</strong> 60 chars</div>' +
      '</div>';
  }

  if (sectionId === 'portal-sec-ai-qualifier') {
    return '<div class="ai-result-label">Qualification Result</div>' +
      '<div class="ai-cq-verdict" style="display:flex;align-items:center;gap:12px;padding:16px;background:rgba(5,150,105,0.06);border:1px solid rgba(5,150,105,0.15);border-radius:10px;margin-bottom:16px">' +
      '<div style="font-size:24px;font-weight:800;color:#059669">Strong</div>' +
      '<div style="font-size:14px;color:var(--body)">This client is a strong referral candidate with high resolution potential.</div></div>' +
      '<div class="ai-cq-grid" style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:16px">' +
      '<div style="padding:14px;background:var(--off);border-radius:10px"><div style="font-size:11px;color:var(--mist);text-transform:uppercase;margin-bottom:4px">Resolution Path</div><div style="font-size:14px;font-weight:600;color:var(--navy)">Offer in Compromise</div></div>' +
      '<div style="padding:14px;background:var(--off);border-radius:10px"><div style="font-size:11px;color:var(--mist);text-transform:uppercase;margin-bottom:4px">Estimated Value</div><div style="font-size:14px;font-weight:600;color:var(--navy)">$30,000 - $50,000</div></div>' +
      '<div style="padding:14px;background:var(--off);border-radius:10px"><div style="font-size:11px;color:var(--mist);text-transform:uppercase;margin-bottom:4px">Your Commission</div><div style="font-size:14px;font-weight:600;color:#059669">$2,400 - $4,000</div></div>' +
      '</div>' +
      '<p><strong>Analysis:</strong> Client with $30K-$50K in unpaid taxes across 2-3 years is well within the typical Offer in Compromise range. Recent IRS notices indicate active enforcement, which adds urgency. This is a high-value referral with a clear path to resolution.</p>';
  }

  if (sectionId === 'portal-sec-ai-kb') {
    return '<div class="ai-result-label">Knowledge Base Answer</div>' +
      '<p>Revenue share in the Community Tax Partner Program works on a tiered commission structure based on your partner level:</p>' +
      '<ul style="margin:12px 0;padding-left:20px;color:var(--body)">' +
      '<li><strong>Bronze (0-9 referrals):</strong> 6% of case revenue</li>' +
      '<li><strong>Premium (10-24 referrals):</strong> 8% of case revenue</li>' +
      '<li><strong>Pro (25-49 referrals):</strong> 10% of case revenue</li>' +
      '<li><strong>Platinum (50+ referrals):</strong> 12-15% of case revenue</li>' +
      '</ul>' +
      '<p>Commission is calculated on the total case value and paid when the case reaches "Resolved" status. Average case values range from $15,000 to $75,000, meaning commissions typically range from $900 to $11,250 per case.</p>' +
      '<p class="ai-result-note">Source: Partner Program Revenue Share Guide, Updated Q1 2026</p>';
  }

  return '<p>AI-generated content will appear here.</p>';
}

// Pill selector toggle
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('ai-pill')) {
    var pills = e.target.closest('.ai-embed-pills');
    if (!pills) return;
    pills.querySelectorAll('.ai-pill').forEach(function(p) { p.classList.remove('ai-pill-active'); });
    e.target.classList.add('ai-pill-active');
  }
});
