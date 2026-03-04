// ══════════════════════════════════════════
//  M1P2C3: SEO METADATA EDITOR
//  Page title, description, OG tags, preview
// ══════════════════════════════════════════

var PBSEO_STORAGE_KEY = 'ctax_pb_seo';

function pbseoShowEditor() {
  var existing = document.getElementById('pbseo-overlay');
  if (existing) existing.remove();

  var overlay = document.createElement('div');
  overlay.className = 'pb-tpl-overlay';
  overlay.id = 'pbseo-overlay';
  overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };

  var modal = document.createElement('div');
  modal.className = 'pb-tpl-modal';
  modal.style.maxWidth = '680px';

  modal.innerHTML = '<div class="pb-tpl-header">'
    + '<div>'
    + '<div class="pb-tpl-title">SEO & Social Settings</div>'
    + '<div class="pb-tpl-subtitle">Optimize how your page appears in search results and social media.</div>'
    + '</div>'
    + '<button class="pb-tpl-close" onclick="document.getElementById(\'pbseo-overlay\').remove()">'
    + '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
    + '</button>'
    + '</div>'
    + '<div id="pbseo-body"></div>';

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  pbseoRenderTabs();
}

function pbseoGetData() {
  try { return JSON.parse(localStorage.getItem(PBSEO_STORAGE_KEY)) || {}; }
  catch (e) { return {}; }
}

function pbseoSaveData(data) {
  try { localStorage.setItem(PBSEO_STORAGE_KEY, JSON.stringify(data)); } catch (e) {}
}

var pbseoActiveTab = 'basics';

function pbseoRenderTabs() {
  var body = document.getElementById('pbseo-body');
  if (!body) return;

  var data = pbseoGetData();
  var tabs = [
    { id: 'basics', label: 'Page Basics' },
    { id: 'social', label: 'Social Sharing' },
    { id: 'preview', label: 'Preview' },
    { id: 'score', label: 'SEO Score' }
  ];

  var html = '<div class="pbseo-tabs">';
  tabs.forEach(function(t) {
    html += '<button class="pbseo-tab' + (t.id === pbseoActiveTab ? ' pbseo-tab-active' : '') + '" onclick="pbseoActiveTab=\'' + t.id + '\';pbseoRenderTabs()">' + t.label + '</button>';
  });
  html += '</div>';

  html += '<div class="pbseo-content">';

  if (pbseoActiveTab === 'basics') {
    html += pbseoRenderBasics(data);
  } else if (pbseoActiveTab === 'social') {
    html += pbseoRenderSocial(data);
  } else if (pbseoActiveTab === 'preview') {
    html += pbseoRenderPreview(data);
  } else if (pbseoActiveTab === 'score') {
    html += pbseoRenderScore(data);
  }

  html += '</div>';

  // Save button
  html += '<div class="pbseo-footer">'
    + '<button class="btn btn-g btn-sm" onclick="document.getElementById(\'pbseo-overlay\').remove()">Cancel</button>'
    + '<button class="btn btn-p btn-sm" onclick="pbseoSave()">Save SEO Settings</button>'
    + '</div>';

  body.innerHTML = html;
}

// ── BASICS TAB ──────────────────────────────

function pbseoRenderBasics(data) {
  var title = data.title || '';
  var desc = data.description || '';
  var slug = data.slug || '';
  var canonical = data.canonical || '';
  var noindex = data.noindex || false;

  var html = '<div class="pbseo-section">'
    + '<div class="pbseo-field">'
    + '<label class="pbseo-label">Page Title <span class="pbseo-counter" id="pbseo-title-count">' + title.length + '/60</span></label>'
    + '<input type="text" class="pbseo-input" id="pbseo-title" value="' + pbseoEscape(title) + '" placeholder="Tax Relief Services | Your City | Free Consultation" maxlength="80" oninput="pbseoUpdateCounter(this,\'pbseo-title-count\',60)">'
    + '<div class="pbseo-hint">Ideal length: 50-60 characters. Include your main keyword near the beginning.</div>'
    + '</div>';

  html += '<div class="pbseo-field">'
    + '<label class="pbseo-label">Meta Description <span class="pbseo-counter" id="pbseo-desc-count">' + desc.length + '/160</span></label>'
    + '<textarea class="pbseo-textarea" id="pbseo-desc" placeholder="Get expert tax resolution help from a trusted local professional. Free consultation. BBB A+ rated. Reduce your IRS debt by up to 80%." maxlength="200" rows="3" oninput="pbseoUpdateCounter(this,\'pbseo-desc-count\',160)">' + pbseoEscape(desc) + '</textarea>'
    + '<div class="pbseo-hint">Ideal length: 140-160 characters. Include a call-to-action and unique value proposition.</div>'
    + '</div>';

  html += '<div class="pbseo-field">'
    + '<label class="pbseo-label">URL Slug</label>'
    + '<div class="pbseo-slug-row">'
    + '<span class="pbseo-slug-prefix">yoursite.com/</span>'
    + '<input type="text" class="pbseo-input pbseo-slug-input" id="pbseo-slug" value="' + pbseoEscape(slug) + '" placeholder="tax-relief-services" oninput="this.value=this.value.toLowerCase().replace(/[^a-z0-9-]/g,\'-\').replace(/--+/g,\'-\')">'
    + '</div>'
    + '</div>';

  html += '<div class="pbseo-field">'
    + '<label class="pbseo-label">Canonical URL <span style="font-weight:400;color:var(--gray)">(optional)</span></label>'
    + '<input type="url" class="pbseo-input" id="pbseo-canonical" value="' + pbseoEscape(canonical) + '" placeholder="https://yoursite.com/tax-relief">'
    + '</div>';

  html += '<div class="pbseo-field pbseo-checkbox-row">'
    + '<label class="pbseo-checkbox-label">'
    + '<input type="checkbox" id="pbseo-noindex"' + (noindex ? ' checked' : '') + '>'
    + ' <span>No-index this page</span>'
    + '</label>'
    + '<div class="pbseo-hint">Check this to hide the page from search engines (useful for test pages).</div>'
    + '</div>';

  html += '</div>';

  // AI suggestion button
  html += '<div class="pbseo-ai-row">'
    + '<button class="btn btn-g btn-sm" id="pbseo-ai-btn" onclick="pbseoAISuggest()"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg> AI Suggest Title & Description</button>'
    + '</div>';

  return html;
}

// ── SOCIAL TAB ──────────────────────────────

function pbseoRenderSocial(data) {
  var ogTitle = data.ogTitle || data.title || '';
  var ogDesc = data.ogDescription || data.description || '';
  var ogImage = data.ogImage || '';
  var twitterCard = data.twitterCard || 'summary_large_image';

  var html = '<div class="pbseo-section">'
    + '<div class="pbseo-section-title">Open Graph (Facebook, LinkedIn)</div>';

  html += '<div class="pbseo-field">'
    + '<label class="pbseo-label">OG Title</label>'
    + '<input type="text" class="pbseo-input" id="pbseo-og-title" value="' + pbseoEscape(ogTitle) + '" placeholder="Uses page title if empty">'
    + '</div>';

  html += '<div class="pbseo-field">'
    + '<label class="pbseo-label">OG Description</label>'
    + '<textarea class="pbseo-textarea" id="pbseo-og-desc" rows="2" placeholder="Uses meta description if empty">' + pbseoEscape(ogDesc) + '</textarea>'
    + '</div>';

  html += '<div class="pbseo-field">'
    + '<label class="pbseo-label">OG Image URL</label>'
    + '<input type="url" class="pbseo-input" id="pbseo-og-image" value="' + pbseoEscape(ogImage) + '" placeholder="https://yoursite.com/images/og-cover.jpg">'
    + '<div class="pbseo-hint">Recommended size: 1200x630 pixels. This image appears when shared on social media.</div>'
    + '</div>';

  html += '</div>';

  html += '<div class="pbseo-section">'
    + '<div class="pbseo-section-title">Twitter Card</div>';

  html += '<div class="pbseo-field">'
    + '<label class="pbseo-label">Card Type</label>'
    + '<select class="pbseo-select" id="pbseo-twitter-card">'
    + '<option value="summary_large_image"' + (twitterCard === 'summary_large_image' ? ' selected' : '') + '>Large Image Card</option>'
    + '<option value="summary"' + (twitterCard === 'summary' ? ' selected' : '') + '>Summary Card</option>'
    + '</select>'
    + '</div>';

  html += '</div>';

  return html;
}

// ── PREVIEW TAB ──────────────────────────────

function pbseoRenderPreview(data) {
  var title = data.title || 'Your Page Title';
  var desc = data.description || 'Add a meta description to control what appears in search results.';
  var slug = data.slug || 'your-page';
  var ogTitle = data.ogTitle || data.title || 'Your Page Title';
  var ogDesc = data.ogDescription || data.description || 'Your page description will appear here.';

  var html = '<div class="pbseo-section">';

  // Google Preview
  html += '<div class="pbseo-section-title">Google Search Preview</div>'
    + '<div class="pbseo-google-preview">'
    + '<div class="pbseo-gp-url">yoursite.com > ' + (slug || 'your-page') + '</div>'
    + '<div class="pbseo-gp-title">' + pbseoEscape(title) + '</div>'
    + '<div class="pbseo-gp-desc">' + pbseoEscape(desc) + '</div>'
    + '</div>';

  // Facebook Preview
  html += '<div class="pbseo-section-title" style="margin-top:20px">Facebook / LinkedIn Preview</div>'
    + '<div class="pbseo-social-preview">'
    + '<div class="pbseo-sp-image">'
    + (data.ogImage
      ? '<img src="' + pbseoEscape(data.ogImage) + '" style="width:100%;height:100%;object-fit:cover" alt="OG preview">'
      : '<div class="pbseo-sp-placeholder"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg><div>No OG image set</div></div>'
    )
    + '</div>'
    + '<div class="pbseo-sp-body">'
    + '<div class="pbseo-sp-domain">yoursite.com</div>'
    + '<div class="pbseo-sp-title">' + pbseoEscape(ogTitle) + '</div>'
    + '<div class="pbseo-sp-desc">' + pbseoEscape(ogDesc) + '</div>'
    + '</div>'
    + '</div>';

  html += '</div>';
  return html;
}

// ── SEO SCORE TAB ──────────────────────────────

function pbseoRenderScore(data) {
  var checks = [];
  var score = 0;

  // Title checks
  var titleLen = (data.title || '').length;
  if (titleLen >= 50 && titleLen <= 60) {
    checks.push({ pass: true, label: 'Title length is optimal (' + titleLen + ' chars)' });
    score += 20;
  } else if (titleLen > 0 && titleLen < 50) {
    checks.push({ pass: false, label: 'Title is too short (' + titleLen + '/50-60 chars)' });
    score += 10;
  } else if (titleLen > 60) {
    checks.push({ pass: false, label: 'Title is too long (' + titleLen + '/60 chars) -- may be truncated' });
    score += 10;
  } else {
    checks.push({ pass: false, label: 'Missing page title' });
  }

  // Description checks
  var descLen = (data.description || '').length;
  if (descLen >= 140 && descLen <= 160) {
    checks.push({ pass: true, label: 'Meta description length is optimal (' + descLen + ' chars)' });
    score += 20;
  } else if (descLen > 0 && descLen < 140) {
    checks.push({ pass: false, label: 'Meta description is short (' + descLen + '/140-160 chars)' });
    score += 10;
  } else if (descLen > 160) {
    checks.push({ pass: false, label: 'Meta description is too long (' + descLen + '/160 chars)' });
    score += 10;
  } else {
    checks.push({ pass: false, label: 'Missing meta description' });
  }

  // Slug check
  if (data.slug && data.slug.length > 0) {
    checks.push({ pass: true, label: 'Custom URL slug is set' });
    score += 15;
  } else {
    checks.push({ pass: false, label: 'No custom URL slug set' });
  }

  // OG checks
  if (data.ogTitle || data.title) {
    checks.push({ pass: true, label: 'Social sharing title configured' });
    score += 15;
  } else {
    checks.push({ pass: false, label: 'No social sharing title' });
  }

  if (data.ogImage) {
    checks.push({ pass: true, label: 'OG image is set for social sharing' });
    score += 15;
  } else {
    checks.push({ pass: false, label: 'No OG image -- social shares will look plain' });
  }

  // Keyword check (simple: title contains tax-related words)
  var taxKeywords = /tax|irs|resolution|relief|debt|penalty|audit/i;
  if (taxKeywords.test(data.title || '')) {
    checks.push({ pass: true, label: 'Title contains relevant keywords' });
    score += 15;
  } else if ((data.title || '').length > 0) {
    checks.push({ pass: false, label: 'Title missing tax-related keywords (tax, IRS, resolution, relief)' });
    score += 5;
  } else {
    checks.push({ pass: false, label: 'Cannot check keywords -- no title set' });
  }

  // Score color
  var scoreColor = score >= 80 ? '#059669' : score >= 50 ? '#d97706' : '#dc2626';
  var scoreLabel = score >= 80 ? 'Great' : score >= 50 ? 'Needs Work' : 'Poor';

  var html = '<div class="pbseo-section">';

  // Score circle
  html += '<div class="pbseo-score-display">'
    + '<div class="pbseo-score-circle" style="border-color:' + scoreColor + '">'
    + '<div class="pbseo-score-num" style="color:' + scoreColor + '">' + score + '</div>'
    + '<div class="pbseo-score-label">' + scoreLabel + '</div>'
    + '</div>'
    + '</div>';

  // Checklist
  html += '<div class="pbseo-checklist">';
  checks.forEach(function(c) {
    html += '<div class="pbseo-check-item">'
      + '<div class="pbseo-check-icon' + (c.pass ? ' pbseo-check-pass' : ' pbseo-check-fail') + '">'
      + (c.pass ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>' : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>')
      + '</div>'
      + '<div class="pbseo-check-text">' + c.label + '</div>'
      + '</div>';
  });
  html += '</div>';

  html += '</div>';
  return html;
}

// ── AI SUGGEST ──────────────────────────────

async function pbseoAISuggest() {
  var btn = document.getElementById('pbseo-ai-btn');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span class="bpp-spinner"></span> Generating...';
  }

  // Get page content from editor
  var pageText = '';
  if (typeof pbEditor !== 'undefined' && pbEditor) {
    var wrapper = pbEditor.getWrapper();
    if (wrapper && wrapper.view && wrapper.view.el) {
      pageText = wrapper.view.el.textContent || '';
    }
  }
  pageText = pageText.substring(0, 2000).trim();

  if (!pageText) {
    pageText = 'A Community Tax partner landing page for tax resolution referrals';
  }

  try {
    if (typeof CTAX_API_KEY === 'undefined' || !CTAX_API_KEY) throw new Error('No API key');

    var resp = await fetch(CTAX_API_URL, {
      method: 'POST',
      headers: getApiHeaders(),
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        messages: [{
          role: 'user',
          content: 'Given this landing page content, generate SEO metadata. Return ONLY valid JSON with these exact keys: {"title":"50-60 char page title with keywords","description":"140-160 char meta description with call to action","slug":"url-friendly-slug"}\n\nPage content:\n' + pageText
        }]
      })
    });

    if (!resp.ok) throw new Error('API error');
    var data = await resp.json();
    var text = data.content && data.content[0] ? data.content[0].text : '';
    var jsonMatch = text.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      var parsed = JSON.parse(jsonMatch[0]);
      if (parsed.title) {
        var titleEl = document.getElementById('pbseo-title');
        if (titleEl) { titleEl.value = parsed.title; pbseoUpdateCounter(titleEl, 'pbseo-title-count', 60); }
      }
      if (parsed.description) {
        var descEl = document.getElementById('pbseo-desc');
        if (descEl) { descEl.value = parsed.description; pbseoUpdateCounter(descEl, 'pbseo-desc-count', 160); }
      }
      if (parsed.slug) {
        var slugEl = document.getElementById('pbseo-slug');
        if (slugEl) slugEl.value = parsed.slug;
      }
      if (typeof showToast === 'function') showToast('AI suggestions applied', 'success');
    } else {
      throw new Error('Invalid response');
    }

  } catch (err) {
    // Fallback suggestions
    var titleEl = document.getElementById('pbseo-title');
    if (titleEl && !titleEl.value) titleEl.value = 'Tax Relief Services | Free Consultation | Community Tax Partner';
    var descEl = document.getElementById('pbseo-desc');
    if (descEl && !descEl.value) descEl.value = 'Get expert help resolving your IRS tax debt. Free consultation. BBB A+ rated. Trusted by 10,000+ clients. Reduce penalties by up to 80%.';
    if (typeof showToast === 'function') showToast('Default suggestions applied', 'info');
  }

  if (btn) {
    btn.disabled = false;
    btn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg> AI Suggest Title & Description';
  }
}

// ── SAVE ──────────────────────────────

function pbseoSave() {
  var data = {
    title: (document.getElementById('pbseo-title') || {}).value || '',
    description: (document.getElementById('pbseo-desc') || {}).value || '',
    slug: (document.getElementById('pbseo-slug') || {}).value || '',
    canonical: (document.getElementById('pbseo-canonical') || {}).value || '',
    noindex: (document.getElementById('pbseo-noindex') || {}).checked || false,
    ogTitle: (document.getElementById('pbseo-og-title') || {}).value || '',
    ogDescription: (document.getElementById('pbseo-og-desc') || {}).value || '',
    ogImage: (document.getElementById('pbseo-og-image') || {}).value || '',
    twitterCard: (document.getElementById('pbseo-twitter-card') || {}).value || 'summary_large_image'
  };

  pbseoSaveData(data);

  // Inject meta tags into editor if available
  pbseoInjectMeta(data);

  var overlay = document.getElementById('pbseo-overlay');
  if (overlay) overlay.remove();

  if (typeof portalToast === 'function') portalToast('SEO settings saved', 'success');
}

function pbseoInjectMeta(data) {
  if (typeof pbEditor === 'undefined' || !pbEditor) return;

  // Build meta tag HTML to inject into the page head area
  var metaHtml = '';
  if (data.title) metaHtml += '<!-- SEO: ' + data.title + ' -->\n';

  // We store metadata in localStorage since GrapesJS manages canvas content
  // The meta is applied during HTML export
}

// ── HELPERS ──────────────────────────────

function pbseoEscape(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function pbseoUpdateCounter(el, counterId, ideal) {
  var counter = document.getElementById(counterId);
  if (!counter) return;
  var len = el.value.length;
  counter.textContent = len + '/' + ideal;
  counter.style.color = len >= ideal * 0.85 && len <= ideal * 1.05 ? '#059669' : len > ideal * 1.05 ? '#dc2626' : '#888';
}
