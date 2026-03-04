// ══════════════════════════════════════════
//  M2P2C3: AI CONTENT REPURPOSER
//  Transform any generated content across
//  8 formats: email, social, SMS, blog,
//  video script, newsletter, ad copy, FAQ
// ══════════════════════════════════════════

var ARP_CACHE_KEY = 'ctax_ai_repurposed';
var ARP_FORMATS = [
  { id: 'email', label: 'Email Sequence', icon: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6', desc: '3-part drip sequence with subject lines and CTAs' },
  { id: 'social', label: 'Social Posts', icon: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z', desc: 'LinkedIn, Facebook, and Twitter/X posts' },
  { id: 'sms', label: 'SMS / Text', icon: 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z', desc: 'Short 160-char messages with link placeholders' },
  { id: 'blog', label: 'Blog Article', icon: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8', desc: '800-word article with SEO-friendly headers' },
  { id: 'video', label: 'Video Script', icon: 'M23 7l-7 5 7 5V7z M1 5h15v14H1z', desc: '60-90 second script with scene directions' },
  { id: 'newsletter', label: 'Newsletter Block', icon: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6', desc: 'Drop-in section for your email newsletter' },
  { id: 'ad', label: 'Ad Variations', icon: 'M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0', desc: 'Google, Facebook, and LinkedIn ad copy sets' },
  { id: 'faq', label: 'FAQ / Q&A', icon: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3 M12 17h.01', desc: '5-7 questions and answers from the content' }
];

// ── MAIN MODAL ──────────────────────────────────────

function arpShowRepurposer() {
  var existing = document.getElementById('arp-overlay');
  if (existing) existing.remove();

  var overlay = document.createElement('div');
  overlay.id = 'arp-overlay';
  overlay.className = 'arp-overlay';
  overlay.innerHTML = '<div class="arp-modal">' +
    '<div class="arp-header">' +
      '<h2 class="arp-title">Content Repurposer</h2>' +
      '<p class="arp-subtitle">Transform any generated content into multiple formats instantly</p>' +
      '<button class="arp-close" onclick="arpClose()">&times;</button>' +
    '</div>' +
    '<div class="arp-body" id="arp-body"></div>' +
  '</div>';

  document.body.appendChild(overlay);
  requestAnimationFrame(function() { overlay.classList.add('arp-visible'); });
  arpRenderSourcePicker();
}

function arpClose() {
  var overlay = document.getElementById('arp-overlay');
  if (overlay) {
    overlay.classList.remove('arp-visible');
    setTimeout(function() { overlay.remove(); }, 250);
  }
}

// ── SOURCE PICKER ──────────────────────────────────

function arpRenderSourcePicker() {
  var body = document.getElementById('arp-body');
  if (!body) return;

  // Gather all available source content
  var sources = arpGatherSources();

  var html = '<div class="arp-step-label">Step 1: Choose Source Content</div>';

  if (sources.length === 0) {
    html += '<div class="arp-empty">' +
      '<p>No generated content found yet. Use any AI tool first:</p>' +
      '<ul>' +
        '<li>Script Builder -- generate outreach scripts</li>' +
        '<li>Ad Maker -- create ad copy</li>' +
        '<li>Campaign Builder -- build full campaigns</li>' +
        '<li>Knowledge Base -- get Q&A answers</li>' +
      '</ul>' +
      '<p style="margin-top:12px">Or paste your own content below:</p>' +
    '</div>';
  } else {
    html += '<div class="arp-sources">';
    for (var i = 0; i < sources.length; i++) {
      var s = sources[i];
      html += '<div class="arp-source-card" onclick="arpSelectSource(' + i + ')" data-idx="' + i + '">' +
        '<div class="arp-source-tool">' + arpEsc(s.tool) + '</div>' +
        '<div class="arp-source-label">' + arpEsc(s.label) + '</div>' +
        '<div class="arp-source-date">' + arpTimeAgo(s.timestamp) + '</div>' +
      '</div>';
    }
    html += '</div>';
  }

  // Custom paste area
  html += '<div class="arp-divider"><span>or paste your own</span></div>';
  html += '<textarea id="arp-custom-input" class="arp-textarea" placeholder="Paste any content here -- scripts, emails, articles, notes, anything..." rows="5"></textarea>';
  html += '<button class="arp-btn arp-btn-primary" onclick="arpUseCustom()" style="margin-top:8px">Use This Content</button>';

  body.innerHTML = html;

  // Store sources globally for selection
  window._arpSources = sources;
}

function arpGatherSources() {
  var sources = [];

  // 1. Tool history (scripts, ads, knowledge base)
  try {
    var history = JSON.parse(localStorage.getItem('ctax_tool_history') || '[]');
    for (var i = 0; i < history.length; i++) {
      var h = history[i];
      var content = '';
      if (h.data && typeof h.data === 'object') {
        // Script builder results
        if (h.data.conversation) content += h.data.conversation + '\n';
        if (h.data.email) content += h.data.email + '\n';
        if (h.data.objections) content += h.data.objections + '\n';
        if (h.data.followup) content += h.data.followup + '\n';
        // Generic text data
        if (h.data.result) content += h.data.result + '\n';
        if (h.data.answer) content += h.data.answer + '\n';
        if (h.data.content) content += h.data.content + '\n';
      } else if (typeof h.data === 'string') {
        content = h.data;
      }
      if (content.trim().length > 30) {
        sources.push({
          tool: arpToolLabel(h.tool),
          label: h.label || 'Generated content',
          content: content.trim(),
          timestamp: h.timestamp || Date.now()
        });
      }
    }
  } catch (e) {}

  // 2. Campaigns
  try {
    var campaigns = JSON.parse(localStorage.getItem('ctax_ai_campaigns') || '[]');
    for (var c = 0; c < campaigns.length; c++) {
      var camp = campaigns[c];
      var campContent = '';
      if (camp.components) {
        for (var j = 0; j < camp.components.length; j++) {
          campContent += '## ' + (camp.components[j].title || '') + '\n' + (camp.components[j].content || '') + '\n\n';
        }
      }
      if (campContent.trim().length > 30) {
        sources.push({
          tool: 'Campaign Builder',
          label: camp.name || 'Campaign',
          content: campContent.trim(),
          timestamp: camp.timestamp || Date.now()
        });
      }
    }
  } catch (e) {}

  // 3. Business planner playbook
  try {
    var playbook = localStorage.getItem('bp_playbook_cache');
    if (playbook) {
      var pb = JSON.parse(playbook);
      var pbContent = '';
      if (pb.chapters) {
        for (var k = 0; k < pb.chapters.length; k++) {
          pbContent += '## ' + (pb.chapters[k].title || '') + '\n' + (pb.chapters[k].content || '') + '\n\n';
        }
      }
      if (pbContent.trim().length > 30) {
        sources.push({
          tool: 'Growth Playbook',
          label: 'Partnership Growth Playbook',
          content: pbContent.trim(),
          timestamp: pb.timestamp || Date.now()
        });
      }
    }
  } catch (e) {}

  // Sort by most recent
  sources.sort(function(a, b) { return b.timestamp - a.timestamp; });
  return sources.slice(0, 15);
}

function arpToolLabel(key) {
  var labels = {
    'script-builder': 'Script Builder',
    'ad-maker': 'Ad Maker',
    'client-qualifier': 'Client Qualifier',
    'knowledge-base': 'Knowledge Base'
  };
  return labels[key] || key || 'AI Tool';
}

function arpSelectSource(idx) {
  var sources = window._arpSources || [];
  if (!sources[idx]) return;

  // Highlight selected card
  document.querySelectorAll('.arp-source-card').forEach(function(c) { c.classList.remove('arp-selected'); });
  var card = document.querySelector('.arp-source-card[data-idx="' + idx + '"]');
  if (card) card.classList.add('arp-selected');

  window._arpContent = sources[idx].content;
  window._arpSourceLabel = sources[idx].label;
  arpRenderFormatPicker();
}

function arpUseCustom() {
  var input = document.getElementById('arp-custom-input');
  if (!input || input.value.trim().length < 20) {
    if (typeof showToast === 'function') showToast('Please paste at least 20 characters of content', 'error');
    return;
  }
  window._arpContent = input.value.trim();
  window._arpSourceLabel = 'Custom content';
  arpRenderFormatPicker();
}

// ── FORMAT PICKER ──────────────────────────────────

function arpRenderFormatPicker() {
  var body = document.getElementById('arp-body');
  if (!body) return;

  var html = '<div class="arp-step-label">Step 2: Choose Output Formats</div>';
  html += '<p class="arp-hint">Select one or more formats to transform your content into.</p>';

  html += '<div class="arp-formats">';
  for (var i = 0; i < ARP_FORMATS.length; i++) {
    var f = ARP_FORMATS[i];
    html += '<label class="arp-format-card" for="arp-fmt-' + f.id + '">' +
      '<input type="checkbox" id="arp-fmt-' + f.id + '" value="' + f.id + '" class="arp-fmt-check">' +
      '<div class="arp-format-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="' + f.icon + '"/></svg></div>' +
      '<div class="arp-format-label">' + f.label + '</div>' +
      '<div class="arp-format-desc">' + f.desc + '</div>' +
    '</label>';
  }
  html += '</div>';

  html += '<div class="arp-actions">';
  html += '<button class="arp-btn" onclick="arpSelectAllFormats()">Select All</button>';
  html += '<button class="arp-btn arp-btn-primary" onclick="arpGenerate()">Transform Content</button>';
  html += '</div>';

  body.innerHTML = html;
}

function arpSelectAllFormats() {
  var checks = document.querySelectorAll('.arp-fmt-check');
  var allChecked = true;
  checks.forEach(function(c) { if (!c.checked) allChecked = false; });
  checks.forEach(function(c) { c.checked = !allChecked; });
}

// ── GENERATE ──────────────────────────────────────

async function arpGenerate() {
  var selected = [];
  document.querySelectorAll('.arp-fmt-check:checked').forEach(function(c) { selected.push(c.value); });

  if (selected.length === 0) {
    if (typeof showToast === 'function') showToast('Select at least one output format', 'error');
    return;
  }

  var body = document.getElementById('arp-body');
  if (!body) return;

  var content = window._arpContent || '';
  var formatLabels = selected.map(function(id) {
    var f = ARP_FORMATS.find(function(fmt) { return fmt.id === id; });
    return f ? f.label : id;
  });

  body.innerHTML = '<div class="arp-generating">' +
    '<div class="arp-spinner"></div>' +
    '<p class="arp-gen-text">Transforming into ' + selected.length + ' format' + (selected.length > 1 ? 's' : '') + '...</p>' +
    '<p class="arp-gen-formats">' + formatLabels.join(' | ') + '</p>' +
  '</div>';

  var results = {};
  var apiAvailable = typeof CTAX_API_URL !== 'undefined' && typeof getApiHeaders === 'function';

  if (apiAvailable) {
    try {
      var formatInstructions = selected.map(function(id) {
        var f = ARP_FORMATS.find(function(fmt) { return fmt.id === id; });
        return '- "' + id + '": ' + (f ? f.desc : 'Generate content in ' + id + ' format');
      }).join('\n');

      var resp = await fetch(CTAX_API_URL, {
        method: 'POST',
        headers: getApiHeaders(),
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4000,
          messages: [{
            role: 'user',
            content: 'You are a marketing content transformer for Community Tax, a tax resolution company that works through referral partners (CPAs, attorneys, financial advisors, etc.).\n\nTransform the following source content into these output formats:\n' + formatInstructions + '\n\nSource content:\n' + content.substring(0, 3000) + '\n\nReturn valid JSON with format IDs as keys. Each value should be a string with the full formatted content using markdown. Make every format feel distinct and purpose-built, not just reformatted copies. Adapt tone, length, and structure to each channel.\n\nFor emails: include subject lines, body, and CTAs.\nFor social: include platform-specific versions (LinkedIn, Facebook, X).\nFor SMS: keep under 160 chars per message, include 3 variations.\nFor blog: include H2 headers, intro, 3-4 sections, conclusion with CTA.\nFor video: include scene directions, spoken text, and timing notes.\nFor newsletter: include a headline, 2-3 paragraph block, and CTA button text.\nFor ads: include 3 variations with headline, body, and CTA for Google/Facebook/LinkedIn.\nFor FAQ: include 5-7 Q&A pairs derived from the content.'
          }]
        })
      });

      var data = await resp.json();
      if (data.content && data.content[0] && data.content[0].text) {
        var text = data.content[0].text;
        // Extract JSON from response
        var jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          results = JSON.parse(jsonMatch[0]);
        }
      }
    } catch (e) {
      // Fall through to fallback
    }
  }

  // Fill in any missing formats with fallback
  for (var i = 0; i < selected.length; i++) {
    if (!results[selected[i]]) {
      results[selected[i]] = arpGetFallback(selected[i], content);
    }
  }

  // Save to history
  arpSaveResult({
    source: window._arpSourceLabel || 'Content',
    formats: selected,
    results: results,
    timestamp: Date.now()
  });

  arpRenderResults(results, selected);
}

// ── RENDER RESULTS ────────────────────────────────

function arpRenderResults(results, formats) {
  var body = document.getElementById('arp-body');
  if (!body) return;

  var html = '<div class="arp-results-header">' +
    '<div class="arp-step-label">Transformed Content</div>' +
    '<div class="arp-results-actions">' +
      '<button class="arp-btn" onclick="arpExportAll()">Export All (PDF)</button>' +
      '<button class="arp-btn" onclick="arpRenderSourcePicker()">Transform Again</button>' +
    '</div>' +
  '</div>';

  html += '<div class="arp-results-tabs" id="arp-results-tabs">';
  for (var i = 0; i < formats.length; i++) {
    var f = ARP_FORMATS.find(function(fmt) { return fmt.id === formats[i]; });
    var label = f ? f.label : formats[i];
    html += '<button class="arp-rtab' + (i === 0 ? ' arp-rtab-active' : '') + '" onclick="arpSwitchResult(this,\'' + formats[i] + '\')">' + label + '</button>';
  }
  html += '</div>';

  for (var j = 0; j < formats.length; j++) {
    var fmtId = formats[j];
    var content = results[fmtId] || 'No content generated';
    html += '<div class="arp-result-panel' + (j === 0 ? ' arp-result-active' : '') + '" id="arp-result-' + fmtId + '">' +
      '<div class="arp-result-content">' + arpFormatContent(content) + '</div>' +
      '<div class="arp-result-footer">' +
        '<button class="arp-btn arp-btn-sm" onclick="arpCopyResult(\'' + fmtId + '\')">Copy</button>' +
        '<button class="arp-btn arp-btn-sm" onclick="arpExportSingle(\'' + fmtId + '\')">Export PDF</button>' +
      '</div>' +
    '</div>';
  }

  // History section
  var history = arpGetHistory();
  if (history.length > 1) {
    html += '<div class="arp-history-section">';
    html += '<div class="arp-step-label" style="margin-top:20px">Recent Transformations</div>';
    for (var h = 1; h < Math.min(history.length, 6); h++) {
      var item = history[h];
      html += '<div class="arp-history-item" onclick="arpLoadHistory(' + h + ')">' +
        '<span class="arp-hist-source">' + arpEsc(item.source) + '</span>' +
        '<span class="arp-hist-formats">' + item.formats.length + ' format' + (item.formats.length > 1 ? 's' : '') + '</span>' +
        '<span class="arp-hist-date">' + arpTimeAgo(item.timestamp) + '</span>' +
      '</div>';
    }
    html += '</div>';
  }

  body.innerHTML = html;

  // Store for export
  window._arpResults = results;
  window._arpFormats = formats;
}

function arpSwitchResult(btn, fmtId) {
  document.querySelectorAll('.arp-rtab').forEach(function(t) { t.classList.remove('arp-rtab-active'); });
  document.querySelectorAll('.arp-result-panel').forEach(function(p) { p.classList.remove('arp-result-active'); });
  btn.classList.add('arp-rtab-active');
  var panel = document.getElementById('arp-result-' + fmtId);
  if (panel) panel.classList.add('arp-result-active');
}

function arpCopyResult(fmtId) {
  var results = window._arpResults || {};
  var text = results[fmtId] || '';
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(function() {
      if (typeof showToast === 'function') showToast('Copied to clipboard', 'copied');
    });
  }
}

function arpExportSingle(fmtId) {
  var results = window._arpResults || {};
  var content = results[fmtId] || '';
  var f = ARP_FORMATS.find(function(fmt) { return fmt.id === fmtId; });
  var label = f ? f.label : fmtId;

  var el = document.createElement('div');
  el.style.cssText = 'padding:40px;max-width:700px;margin:0 auto;font-family:Georgia,serif;color:#1a1a1a';
  el.innerHTML = '<div style="text-align:center;padding:30px 0;border-bottom:2px solid #0B5FD8;margin-bottom:30px">' +
    '<h1 style="font-size:24px;color:#0B5FD8;margin:0">' + arpEsc(label) + '</h1>' +
    '<p style="color:#666;margin:8px 0 0;font-size:14px">Generated by Community Tax AI Content Repurposer</p>' +
  '</div>' +
  '<div style="line-height:1.8;font-size:15px">' + arpFormatContent(content) + '</div>';

  document.body.appendChild(el);

  if (typeof html2pdf !== 'undefined') {
    html2pdf().set({ margin: 0.5, filename: 'ctax-' + fmtId + '.pdf', html2canvas: { scale: 2 }, jsPDF: { format: 'letter' } })
      .from(el).save().then(function() { el.remove(); });
  } else {
    // Fallback: open print dialog
    var win = window.open('', '_blank');
    win.document.write('<html><head><title>' + label + '</title></head><body>' + el.outerHTML + '</body></html>');
    win.document.close();
    win.print();
    el.remove();
  }
}

function arpExportAll() {
  var results = window._arpResults || {};
  var formats = window._arpFormats || [];

  var el = document.createElement('div');
  el.style.cssText = 'padding:40px;max-width:700px;margin:0 auto;font-family:Georgia,serif;color:#1a1a1a';

  // Cover page
  el.innerHTML = '<div style="text-align:center;padding:60px 0;border-bottom:3px solid #0B5FD8;margin-bottom:40px">' +
    '<h1 style="font-size:28px;color:#0B5FD8;margin:0">Content Transformation Pack</h1>' +
    '<p style="color:#666;font-size:16px;margin:12px 0 0">Generated by Community Tax AI</p>' +
    '<p style="color:#999;font-size:13px;margin:8px 0 0">' + new Date().toLocaleDateString() + ' | ' + formats.length + ' formats</p>' +
  '</div>';

  for (var i = 0; i < formats.length; i++) {
    var fmtId = formats[i];
    var f = ARP_FORMATS.find(function(fmt) { return fmt.id === fmtId; });
    var label = f ? f.label : fmtId;
    var content = results[fmtId] || '';

    el.innerHTML += '<div style="page-break-before:' + (i > 0 ? 'always' : 'auto') + ';margin-bottom:30px">' +
      '<h2 style="font-size:20px;color:#0B5FD8;border-bottom:1px solid #e2e8f0;padding-bottom:8px;margin-bottom:16px">' + arpEsc(label) + '</h2>' +
      '<div style="line-height:1.8;font-size:14px">' + arpFormatContent(content) + '</div>' +
    '</div>';
  }

  document.body.appendChild(el);

  if (typeof html2pdf !== 'undefined') {
    html2pdf().set({ margin: 0.5, filename: 'ctax-content-pack.pdf', html2canvas: { scale: 2 }, jsPDF: { format: 'letter' }, pagebreak: { mode: 'css' } })
      .from(el).save().then(function() { el.remove(); });
  } else {
    var win = window.open('', '_blank');
    win.document.write('<html><head><title>Content Pack</title></head><body>' + el.outerHTML + '</body></html>');
    win.document.close();
    win.print();
    el.remove();
  }
}

// ── FALLBACK TEMPLATES ────────────────────────────

function arpGetFallback(formatId, sourceContent) {
  // Extract key phrases from source
  var short = sourceContent.substring(0, 500);
  var hasDebt = /tax debt|irs|owe/i.test(short);
  var hasTopic = hasDebt ? 'tax resolution' : 'financial services';
  var audience = /cpa|accountant|attorney|advisor|broker/i.test(short) ? 'referral partners' : 'potential clients';

  var templates = {
    email: '**Email 1: Introduction (Day 1)**\n\nSubject: Quick question about your ' + hasTopic + ' clients\n\nHi [Name],\n\nI wanted to reach out about something that might help your practice. We have been working with ' + audience + ' to help their clients resolve IRS tax issues -- back taxes, unfiled returns, wage garnishments, and more.\n\nMost of our partners see an average of 3-5 qualified referrals per month, and every case starts with a low-risk $295 investigation.\n\nWould a quick call be worth your time this week?\n\nBest,\n[Your Name]\n\n---\n\n**Email 2: Value Add (Day 4)**\n\nSubject: How [Partner Type] are earning $500+ per referral\n\nHi [Name],\n\nFollowing up on my last email. I wanted to share some numbers that might interest you:\n\n- Average client saves $8,400 through our program\n- Partners earn $500+ per qualified referral\n- 10,000+ cases successfully resolved\n- BBB A+ rating with 4.8-star reviews\n\nYour clients already trust you. This is an easy way to help them with something they are probably struggling with silently.\n\nHere is a one-pager that explains how it works: [Link]\n\n---\n\n**Email 3: Final Touch (Day 8)**\n\nSubject: Last thought on this\n\nHi [Name],\n\nI know you are busy, so I will keep this short. If you ever have a client who mentions owing the IRS, I would love to be your go-to resource.\n\nNo pressure, no commitment -- just a conversation when the timing is right.\n\nI will send over some materials so you have them on file. Thanks for your time.\n\n[Your Name]',

    social: '**LinkedIn Post**\n\nDid you know that 1 in 6 Americans owes money to the IRS? As a financial professional, you are probably seeing this more than you realize.\n\nHere is the thing -- most clients will not bring it up. They are embarrassed, overwhelmed, or both.\n\nBut when you can offer a solution (a $295 investigation that often saves clients 50-80%), you become more than their [advisor/CPA/attorney]. You become the person who changed their life.\n\nIf you are a financial professional who wants to help clients with IRS issues, let us talk.\n\n#TaxResolution #PartnerProgram #FinancialAdvisors #IRSDebt\n\n---\n\n**Facebook Post**\n\nOwing the IRS is stressful. Ignoring it makes it worse.\n\nIf you or someone you know is dealing with:\n- Back taxes\n- Unfiled returns\n- Wage garnishments\n- IRS notices\n\nThere IS a path forward. Our team has resolved 10,000+ cases and we start every engagement with a transparent $295 investigation.\n\nDrop a comment or DM for details.\n\n---\n\n**X (Twitter) Post**\n\nIRS sending you notices? You are not alone. 1 in 6 Americans owes back taxes.\n\nThe good news: most people qualify for significant relief. We have helped 10,000+ people resolve their tax debt.\n\nDMs are open if you have questions.',

    sms: '**SMS 1 (Intro)**\nHi [Name], this is [Your Name]. I work with a program that helps people resolve IRS tax debt. If you or anyone you know needs help, I can connect you. Reply YES for info.\n\n**SMS 2 (Value)**\nQuick update: our tax resolution partners have saved clients an avg of $8,400. Most people qualify for relief but don\'t know it. Want me to send details? Reply INFO.\n\n**SMS 3 (Urgency)**\nIRS penalties grow daily. If you have been putting off dealing with tax debt, now is the time. Free 5-min assessment available. Reply HELP to get started.',

    blog: '## How Financial Professionals Are Helping Clients Resolve IRS Tax Debt\n\nIf you work in financial services, you have probably had at least one client quietly mention that they owe the IRS. Maybe they brought it up during tax prep. Maybe it surfaced during a mortgage application. Maybe you noticed it in their financial statements.\n\nHere is what most professionals do: nothing. Not because they do not care, but because they do not know what to say.\n\nThis article changes that.\n\n### The Hidden Problem Your Clients Are Not Talking About\n\nAccording to the IRS, Americans collectively owe over $114 billion in back taxes. That is not a small number -- and a surprising portion of it comes from everyday people who fell behind and felt too overwhelmed to catch up.\n\nThe typical profile:\n- Self-employed individuals who did not set aside enough for quarterly taxes\n- People who went through a divorce, job loss, or medical crisis\n- Small business owners who got behind on payroll taxes\n- Retirees who did not account for taxes on retirement distributions\n\n### What Tax Resolution Actually Looks Like\n\nTax resolution is not a scam or a too-good-to-be-true scheme. It is a legitimate process where enrolled agents and tax attorneys negotiate directly with the IRS on behalf of the taxpayer.\n\nCommon outcomes include:\n- **Offer in Compromise**: Settling the debt for less than the full amount\n- **Installment Agreements**: Affordable monthly payment plans\n- **Currently Not Collectible**: Pausing collections when the taxpayer cannot pay\n- **Penalty Abatement**: Removing penalties for first-time or reasonable cause situations\n\n### Why Partner Programs Work\n\nReferral partner programs give financial professionals a turnkey way to help clients with tax issues. The process is simple:\n\n1. Client mentions IRS issues\n2. You make an introduction\n3. The resolution team takes over from there\n4. Client gets help, you earn a referral fee\n\nThe initial investigation is $295 -- transparent, upfront, no surprises. Most clients save 50-80% on what they owe.\n\n### Getting Started\n\nIf you are a CPA, attorney, financial advisor, mortgage broker, or any professional who works with clients facing tax issues, a referral partnership might be the perfect addition to your practice.\n\nYou do not need to become a tax expert. You just need to know where to send people when they need help.\n\n[Contact us to learn more about our partner program.]',

    video: '**VIDEO SCRIPT: Partner Program Overview (90 seconds)**\n\n---\n\n**[SCENE 1: 0:00 - 0:15]**\n*Medium shot. Speaker at desk or in professional setting.*\n\nSPEAKER: "If you work with clients -- whether you are a CPA, attorney, financial advisor, or any kind of professional -- I want to ask you something. Have any of your clients ever mentioned owing the IRS?"\n\n*[Beat. Direct eye contact.]*\n\n---\n\n**[SCENE 2: 0:15 - 0:35]**\n*Cut to B-roll: worried person looking at papers, IRS notice close-up, calculator.*\n\nSPEAKER (V/O): "One in six Americans owes back taxes. That means statistically, several of your clients are dealing with this right now. And most of them are not going to bring it up. They are embarrassed. They think nothing can be done."\n\n---\n\n**[SCENE 3: 0:35 - 0:55]**\n*Back to speaker. Animated graphics showing the process.*\n\nSPEAKER: "But here is the thing -- there IS something you can do. Our partner program lets you connect clients with a tax resolution team that has handled over 10,000 cases. Average savings? Over $8,400 per client. And you earn a referral fee for every case."\n\n---\n\n**[SCENE 4: 0:55 - 1:15]**\n*Speaker standing. Confident, closing energy.*\n\nSPEAKER: "The process starts with a $295 investigation -- no surprises, no hidden fees. Your client gets a full breakdown of their options. You get a grateful client and a new revenue stream."\n\n---\n\n**[SCENE 5: 1:15 - 1:30]**\n*End card with logo, CTA, and contact info.*\n\nSPEAKER: "Want to learn more? Click the link below to schedule a quick call. It takes 10 minutes to get started."\n\n*[CTA on screen: "Schedule a Partner Call | communitytax.com/partners"]*',

    newsletter: '**NEWSLETTER BLOCK**\n\n---\n\n**YOUR CLIENTS MIGHT BE HIDING SOMETHING**\n\nHere is a stat that should make every financial professional pay attention: 1 in 6 Americans owes money to the IRS. That means several of your clients are likely dealing with tax debt right now -- and they are probably not telling you about it.\n\nWhy? Shame. Overwhelm. The belief that nothing can be done.\n\nBut something CAN be done. Our partner program connects you with a tax resolution team that has successfully resolved over 10,000 cases. The process starts with a simple $295 investigation, and most clients save 50-80% on what they owe.\n\nThe best part? You earn a referral fee for every case. It is a win for your client and a win for your practice.\n\n[Learn More About Our Partner Program ->]\n\n---',

    ad: '**GOOGLE ADS**\n\nAd 1:\nHeadline: Help Your Clients Resolve IRS Debt\nDescription: Join 500+ financial professionals earning referral fees while helping clients save an avg of $8,400. $295 to start. BBB A+ rated.\nCTA: Become a Partner\n\nAd 2:\nHeadline: Earn $500+ Per Tax Resolution Referral\nDescription: Your clients trust you. Help them with IRS issues through our proven partner program. 10,000+ cases resolved. Free training provided.\nCTA: Get Started Free\n\n---\n\n**FACEBOOK / INSTAGRAM ADS**\n\nAd 1 (Awareness):\nHeadline: Your Clients Are Hiding Something\nBody: 1 in 6 Americans owes the IRS. As a financial professional, you can help -- and earn referral fees in the process. Our partner program makes it easy.\nCTA: Learn More\n\nAd 2 (Conversion):\nHeadline: Add Tax Resolution to Your Practice\nBody: No license needed. No risk. Just connect clients who owe the IRS with our resolution team. $295 investigation, avg savings of $8,400. You earn $500+ per case.\nCTA: Join the Program\n\n---\n\n**LINKEDIN ADS**\n\nAd 1:\nHeadline: Financial Professionals: This Changes Your Practice\nBody: Tax resolution referrals are the highest-value, lowest-effort addition to any financial practice. 10,000+ cases. BBB A+. Partner with Community Tax.\nCTA: Request Partner Kit\n\nAd 2:\nHeadline: CPAs and Advisors: New Revenue Stream\nBody: When clients owe the IRS, be the one with the answer. Our partner program handles everything -- you just make the intro. Avg partner earns $500+ per referral.\nCTA: Schedule a Call',

    faq: '**Q: What is tax resolution?**\nA: Tax resolution is the process of negotiating with the IRS on behalf of a taxpayer to resolve outstanding tax debt. This can include settling for less than owed (Offer in Compromise), setting up payment plans, removing penalties, or pausing collections.\n\n**Q: How much does it cost to get started?**\nA: Every engagement begins with a $295 investigation. During this phase, enrolled agents pull IRS transcripts, analyze the situation, and present all available options. There are no hidden fees or surprises.\n\n**Q: How much can clients typically save?**\nA: Results vary by case, but most clients save between 50-80% on what they owe. The average client saves approximately $8,400 through our programs.\n\n**Q: Do I need a tax license to refer clients?**\nA: No. You do not need any special licensing. You simply make the introduction -- our team of enrolled agents and tax attorneys handles everything from there.\n\n**Q: How much do referral partners earn?**\nA: Partners earn $500 or more per qualified referral. The exact amount depends on the case size and program. There is no cap on referrals.\n\n**Q: What types of professionals become referral partners?**\nA: CPAs, tax preparers, financial advisors, mortgage brokers, attorneys, insurance agents, bookkeepers, real estate agents, and any professional who works with clients who may have IRS issues.\n\n**Q: How long does the resolution process take?**\nA: The initial investigation takes about 2-4 weeks. Full resolution typically takes 3-9 months depending on the complexity of the case and the IRS program pursued.'
  };

  return templates[formatId] || 'Content transformation for ' + formatId + ' format. Please try again with the AI generator for best results.';
}

// ── UTILITIES ──────────────────────────────────────

function arpFormatContent(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^### (.*$)/gm, '<h4 style="margin:16px 0 6px;color:#0B5FD8">$1</h4>')
    .replace(/^## (.*$)/gm, '<h3 style="margin:20px 0 8px;color:#0B5FD8">$1</h3>')
    .replace(/^# (.*$)/gm, '<h2 style="margin:24px 0 10px;color:#0B5FD8">$1</h2>')
    .replace(/^- (.*$)/gm, '<div style="padding-left:16px;margin:2px 0">&#8226; $1</div>')
    .replace(/^---$/gm, '<hr style="border:none;border-top:1px solid #e2e8f0;margin:16px 0">')
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>');
}

function arpEsc(str) {
  if (!str) return '';
  var div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function arpTimeAgo(ts) {
  if (!ts) return '';
  var diff = Date.now() - ts;
  var mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return mins + 'm ago';
  var hrs = Math.floor(mins / 60);
  if (hrs < 24) return hrs + 'h ago';
  var days = Math.floor(hrs / 24);
  return days + 'd ago';
}

function arpGetHistory() {
  try { return JSON.parse(localStorage.getItem(ARP_CACHE_KEY)) || []; }
  catch (e) { return []; }
}

function arpSaveResult(result) {
  var history = arpGetHistory();
  history.unshift(result);
  if (history.length > 10) history = history.slice(0, 10);
  try { localStorage.setItem(ARP_CACHE_KEY, JSON.stringify(history)); } catch (e) {}
}

function arpLoadHistory(idx) {
  var history = arpGetHistory();
  if (history[idx]) {
    window._arpResults = history[idx].results;
    window._arpFormats = history[idx].formats;
    arpRenderResults(history[idx].results, history[idx].formats);
  }
}
