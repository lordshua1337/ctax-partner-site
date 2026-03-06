// -- MARKETING KIT --
// Downloads, email builder, social builder, one-pager builder,
// inline ad builder, flyer builder, deck builder, thank-you builder

// -- ASSET CONFIG --
var MK_ASSETS = {
  'client-outreach':   { path: 'assets/marketing/emails/client-outreach.html',       label: 'Client Outreach Email' },
  'tax-season':        { path: 'assets/marketing/emails/tax-season.html',            label: 'Tax Season Reminder' },
  'landing-page':      { path: 'assets/marketing/landing/partner-landing-page.html', label: 'Landing Page Template' }
};

function mkDownload(assetId) {
  var asset = MK_ASSETS[assetId];
  if (!asset) return;
  var a = document.createElement('a');
  a.href = asset.path;
  a.download = asset.path.split('/').pop();
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  var key = 'mk_dl_' + assetId;
  var count = parseInt(localStorage.getItem(key) || '0', 10) + 1;
  localStorage.setItem(key, count);
  mkUpdateDownloadCount(assetId);
  if (typeof showToast === 'function') showToast(asset.label + ' downloaded', 'success');
}

function mkUpdateDownloadCount(assetId) {
  var el = document.getElementById('mk-dl-count-' + assetId);
  if (!el) return;
  var count = parseInt(localStorage.getItem('mk_dl_' + assetId) || '0', 10);
  el.textContent = count > 0 ? count + ' downloads' : '';
  el.style.display = count > 0 ? '' : 'none';
}

function mkInitDownloadCounts() {
  Object.keys(MK_ASSETS).forEach(function(id) { mkUpdateDownloadCount(id); });
}


// -- CLOSE ALL BUILDERS --
function mkCloseAllBuilders() {
  var ids = ['mk-email-builder', 'mk-social-builder', 'mk-onepager-builder',
             'mk-ads-builder', 'mk-flyer-builder', 'mk-deck-builder', 'mk-thankyou-builder'];
  ids.forEach(function(id) {
    var panel = document.getElementById(id);
    if (panel) panel.style.display = 'none';
  });
}

function mkShowPanel(panelId, initFn) {
  mkCloseAllBuilders();
  var panel = document.getElementById(panelId);
  if (panel) {
    panel.style.display = 'block';
    setTimeout(function() { panel.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 60);
  }
  if (initFn) initFn();
}


// -- RECENTLY GENERATED (localStorage) --
var MK_RECENT_KEY = 'mk_recent_generated';

function mkSaveRecent(type, label) {
  var items = JSON.parse(localStorage.getItem(MK_RECENT_KEY) || '[]');
  items.unshift({ type: type, label: label, ts: Date.now() });
  if (items.length > 10) items = items.slice(0, 10);
  localStorage.setItem(MK_RECENT_KEY, JSON.stringify(items));
  mkRenderRecent();
}

function mkRenderRecent() {
  var wrap = document.getElementById('mk-recent');
  var list = document.getElementById('mk-recent-list');
  if (!wrap || !list) return;
  var items = JSON.parse(localStorage.getItem(MK_RECENT_KEY) || '[]');
  if (!items.length) { wrap.style.display = 'none'; return; }
  wrap.style.display = 'block';
  var icons = {
    email: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
    social: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
    ad: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
    onepager: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
    flyer: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
    deck: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
    thankyou: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>'
  };
  var html = '';
  items.slice(0, 3).forEach(function(item) {
    var ago = mkTimeAgo(item.ts);
    html += '<div class="mk-recent-item">'
      + '<span class="mk-recent-icon">' + (icons[item.type] || icons.email) + '</span>'
      + '<span class="mk-recent-label">' + item.label + '</span>'
      + '<span class="mk-recent-time">' + ago + '</span>'
      + '</div>';
  });
  list.innerHTML = html;
}

function mkTimeAgo(ts) {
  var diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
  return Math.floor(diff / 86400) + 'd ago';
}


// -- EMAIL BUILDER --
var mkEmailCurrentTpl = 'outreach';

var MK_EMAIL_TEMPLATES = {
  outreach: function(firm, phone, email, tagline) {
    return '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>'
      + '<body style="margin:0;padding:0;background:#f4f6f9;font-family:Arial,Helvetica,sans-serif">'
      + '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:32px 16px"><tr><td align="center">'
      + '<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(10,22,40,0.06)">'
      + '<tr><td style="background:linear-gradient(135deg,#0A1628,#112244);padding:28px 40px;text-align:center">'
        + '<div style="font-family:Georgia,serif;font-size:22px;color:#fff">' + (firm || 'Your Firm Name') + '</div>'
        + (tagline ? '<div style="font-size:12px;color:rgba(255,255,255,0.6);margin-top:6px">' + tagline + '</div>' : '<div style="font-size:11px;color:rgba(255,255,255,0.5);margin-top:6px;letter-spacing:0.08em;text-transform:uppercase">In partnership with Community Tax</div>')
      + '</td></tr>'
      + '<tr><td style="height:3px;background:linear-gradient(90deg,#00E5CC,#00C8E0,#0B5FD8,#4BA3FF)"></td></tr>'
      + '<tr><td style="padding:36px 40px 28px">'
        + '<p style="font-size:16px;color:#0A1628;margin:0 0 6px;font-weight:bold">Hi [Client Name],</p>'
        + '<p style="font-size:15px;color:#3d4f5f;line-height:1.65;margin:16px 0">I\'m reaching out because I want to make sure you\'re aware of a resource that could make a real difference. If you owe the IRS more than $7,000 in back taxes, there are legitimate options to resolve that debt for less than what\'s owed.</p>'
        + '<p style="font-size:15px;color:#3d4f5f;line-height:1.65;margin:16px 0">I\'ve partnered with <strong style="color:#0A1628">Community Tax</strong>, a national tax resolution firm with 15 years of experience and over <strong style="color:#0A1628">$2.3 billion in tax debt resolved</strong>.</p>'
        + '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;background:#f8fafc;border-radius:8px;border:1px solid #e8ecf0"><tr>'
          + '<td style="padding:20px;text-align:center;width:33%;border-right:1px solid #e8ecf0"><div style="font-family:Georgia,serif;font-size:20px;color:#0B5FD8">$2.3B+</div><div style="font-size:11px;color:#6b7c8e;margin-top:4px">Resolved</div></td>'
          + '<td style="padding:20px;text-align:center;width:33%;border-right:1px solid #e8ecf0"><div style="font-family:Georgia,serif;font-size:20px;color:#0B5FD8">120K+</div><div style="font-size:11px;color:#6b7c8e;margin-top:4px">Clients</div></td>'
          + '<td style="padding:20px;text-align:center;width:34%"><div style="font-family:Georgia,serif;font-size:20px;color:#0B5FD8">15 yrs</div><div style="font-size:11px;color:#6b7c8e;margin-top:4px">Experience</div></td>'
        + '</tr></table>'
        + '<p style="font-size:15px;color:#3d4f5f;line-height:1.65;margin:16px 0">The consultation is confidential and there\'s no obligation.</p>'
        + '<table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px auto"><tr><td style="background:#0B5FD8;border-radius:8px;padding:14px 36px"><a href="#" style="color:#fff;font-size:15px;font-weight:bold;text-decoration:none">Schedule a Free Consultation</a></td></tr></table>'
        + '<p style="font-size:15px;color:#3d4f5f;line-height:1.65;margin:24px 0 0">Best,<br><strong style="color:#0A1628">' + (firm || 'Your Firm Name') + '</strong><br><span style="font-size:13px;color:#6b7c8e">' + (phone || '') + (phone && email ? ' | ' : '') + (email || '') + '</span></p>'
      + '</td></tr>'
      + '<tr><td style="background:#f8fafc;padding:20px 40px;border-top:1px solid #e8ecf0;text-align:center"><p style="font-size:11px;color:#9ca3af;margin:0">Sent on behalf of ' + (firm || 'Your Firm') + ' in partnership with Community Tax, LLC.</p></td></tr>'
      + '</table></td></tr></table></body></html>';
  },

  taxseason: function(firm, phone, email, tagline) {
    return '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>'
      + '<body style="margin:0;padding:0;background:#f4f6f9;font-family:Arial,Helvetica,sans-serif">'
      + '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:32px 16px"><tr><td align="center">'
      + '<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(10,22,40,0.06)">'
      + '<tr><td style="background:linear-gradient(135deg,#0B5FD8,#00C8E0);padding:32px 40px;text-align:center">'
        + '<div style="font-size:11px;font-weight:bold;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.7);margin-bottom:8px">Tax Season Alert</div>'
        + '<div style="font-family:Georgia,serif;font-size:26px;color:#fff;line-height:1.2">The IRS Deadline Is Approaching</div>'
        + (tagline ? '<div style="font-size:13px;color:rgba(255,255,255,0.8);margin-top:8px">' + tagline + '</div>' : '<div style="font-size:14px;color:rgba(255,255,255,0.85);margin-top:8px">Don\'t let unresolved tax debt follow you into another year.</div>')
      + '</td></tr>'
      + '<tr><td style="padding:36px 40px 28px">'
        + '<p style="font-size:16px;color:#0A1628;margin:0 0 6px;font-weight:bold">Hi [Client Name],</p>'
        + '<p style="font-size:15px;color:#3d4f5f;line-height:1.65;margin:16px 0">With tax season here, now is the best time to address any outstanding IRS debt. The IRS is more willing to negotiate during filing season, and taking action now can prevent penalties from compounding.</p>'
        + '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;border-radius:8px;border-left:4px solid #0B5FD8;background:#f0f6ff"><tr><td style="padding:20px 24px">'
          + '<div style="font-size:14px;font-weight:bold;color:#0A1628;margin-bottom:8px">Why act now?</div>'
          + '<div style="font-size:14px;color:#3d4f5f;line-height:1.7">&#8226; Penalties and interest grow every month<br>&#8226; The IRS has increased enforcement<br>&#8226; Filing season = more negotiating leverage<br>&#8226; Resolve before your next return is due</div>'
        + '</td></tr></table>'
        + '<p style="font-size:15px;color:#3d4f5f;line-height:1.65;margin:16px 0">Through my partnership with <strong style="color:#0A1628">Community Tax</strong>, I can connect you with experienced tax resolution specialists who\'ve resolved over <strong style="color:#0A1628">$2.3 billion</strong> in tax debt.</p>'
        + '<table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px auto"><tr><td style="background:linear-gradient(135deg,#0B5FD8,#0099CC);border-radius:8px;padding:14px 36px"><a href="#" style="color:#fff;font-size:15px;font-weight:bold;text-decoration:none">Get a Free Tax Debt Review</a></td></tr></table>'
        + '<p style="font-size:15px;color:#3d4f5f;line-height:1.65;margin:24px 0 0">Warm regards,<br><strong style="color:#0A1628">' + (firm || 'Your Firm Name') + '</strong><br><span style="font-size:13px;color:#6b7c8e">' + (phone || '') + (phone && email ? ' | ' : '') + (email || '') + '</span></p>'
      + '</td></tr>'
      + '<tr><td style="background:#f8fafc;padding:20px 40px;border-top:1px solid #e8ecf0;text-align:center"><p style="font-size:11px;color:#9ca3af;margin:0">Sent on behalf of ' + (firm || 'Your Firm') + ' in partnership with Community Tax, LLC.</p></td></tr>'
      + '</table></td></tr></table></body></html>';
  }
};

function mkShowEmailBuilder() {
  mkShowPanel('mk-email-builder', mkUpdateEmailPreview);
}

function mkHideEmailBuilder() {
  var panel = document.getElementById('mk-email-builder');
  if (panel) panel.style.display = 'none';
}

function mkSelectEmailTpl(el, tplId) {
  mkEmailCurrentTpl = tplId;
  document.querySelectorAll('.mk-email-tpl-opt').forEach(function(o) { o.classList.remove('mk-tpl-selected'); });
  if (el) el.classList.add('mk-tpl-selected');
  mkUpdateEmailPreview();
}

function mkUpdateEmailPreview() {
  var firm = (document.getElementById('mk-email-firm') || {}).value || '';
  var phone = (document.getElementById('mk-email-phone') || {}).value || '';
  var email = (document.getElementById('mk-email-email') || {}).value || '';
  var tagline = (document.getElementById('mk-email-tagline') || {}).value || '';
  var tplFn = MK_EMAIL_TEMPLATES[mkEmailCurrentTpl];
  if (!tplFn) return;
  var html = tplFn(firm, phone, email, tagline);
  var frame = document.getElementById('mk-email-preview');
  if (frame) frame.srcdoc = html;
}

function mkExportEmail() {
  var firm = (document.getElementById('mk-email-firm') || {}).value || '';
  if (!firm.trim()) { if (typeof showToast === 'function') showToast('Please enter your firm name first', 'warning'); return; }
  var tplFn = MK_EMAIL_TEMPLATES[mkEmailCurrentTpl];
  if (!tplFn) return;
  var phone = (document.getElementById('mk-email-phone') || {}).value || '';
  var email = (document.getElementById('mk-email-email') || {}).value || '';
  var tagline = (document.getElementById('mk-email-tagline') || {}).value || '';
  var html = tplFn(firm, phone, email, tagline);
  var blob = new Blob([html], { type: 'text/html' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = firm.trim().replace(/\s+/g, '-').toLowerCase() + '-' + mkEmailCurrentTpl + '-email.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(a.href);
  mkSaveRecent('email', firm + ' - ' + mkEmailCurrentTpl + ' email');
  if (typeof showToast === 'function') showToast('Email template exported', 'success');
}


// -- SMART EMAIL DOWNLOAD (PDF via CTAX_PDF) --
function mkSmartDownload(tplId) {
  var tplFn = MK_EMAIL_TEMPLATES[tplId];
  if (!tplFn) return;
  if (typeof CTAX_PDF === 'undefined' || typeof html2pdf === 'undefined') {
    if (typeof showToast === 'function') showToast('PDF system loading...', 'info');
    return;
  }
  var firm = (document.getElementById('mk-email-firm') || {}).value || 'Your Firm';
  var phone = (document.getElementById('mk-email-phone') || {}).value || '';
  var email = (document.getElementById('mk-email-email') || {}).value || '';
  var tagline = (document.getElementById('mk-email-tagline') || {}).value || '';

  var labels = { outreach: 'Client Outreach Email', taxseason: 'Tax Season Reminder' };
  var doc = CTAX_PDF.createDoc();
  doc.appendChild(CTAX_PDF.createCover(labels[tplId] || 'Email Template', 'Co-branded email template for ' + firm, [
    { label: 'Template', value: labels[tplId] || tplId },
    { label: 'Partner', value: firm }
  ]));
  var page = CTAX_PDF.createPage(false);
  CTAX_PDF.addHeader(page, labels[tplId] || 'Email Template');

  // Render email content as styled HTML in the PDF
  var emailHtml = tplFn(firm, phone, email, tagline);
  var contentDiv = document.createElement('div');
  contentDiv.innerHTML = '<div style="padding:20px 0">'
    + '<div style="font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#64748b;margin-bottom:16px">EMAIL PREVIEW</div>'
    + '<div style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;max-width:600px">'
    + '<iframe srcdoc="' + emailHtml.replace(/"/g, '&quot;') + '" style="width:100%;height:600px;border:none"></iframe>'
    + '</div></div>';
  // Since iframes don't render in pdf, use a flat html render instead
  contentDiv.innerHTML = '<div style="padding:20px 0">'
    + '<div style="font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#64748b;margin-bottom:16px">EMAIL CONTENT</div>'
    + '<div style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;max-width:600px;background:#f4f6f9;padding:16px">'
    + emailHtml + '</div></div>';
  page.appendChild(contentDiv);
  CTAX_PDF.addFooter(page);
  doc.appendChild(page);

  var filename = firm.trim().replace(/\s+/g, '-').toLowerCase() + '-' + tplId + '-email.pdf';
  CTAX_PDF.renderPdf(doc, filename);
  mkSaveRecent('email', firm + ' - ' + (labels[tplId] || tplId) + ' PDF');
  if (typeof showToast === 'function') showToast('Generating PDF...', 'success');
}

function mkCopyEmailText(tplId) {
  var tplFn = MK_EMAIL_TEMPLATES[tplId];
  if (!tplFn) return;
  var firm = (document.getElementById('mk-email-firm') || {}).value || 'Your Firm';
  var html = tplFn(firm, '', '', '');
  // Strip HTML tags to get plain text
  var temp = document.createElement('div');
  temp.innerHTML = html;
  var text = temp.textContent || temp.innerText || '';
  text = text.replace(/\s+/g, ' ').trim();
  navigator.clipboard.writeText(text).then(function() {
    if (typeof showToast === 'function') showToast('Email text copied to clipboard', 'copied');
  });
}


// -- SOCIAL POST BUILDER --
var mkSocialTpl = 1;
var mkSocialW = 1200;
var mkSocialH = 628;
var mkSocialLogoUrl = null;

function mkShowSocialBuilder() {
  mkShowPanel('mk-social-builder', mkUpdateSocialPreview);
}

function mkHideSocialBuilder() {
  var panel = document.getElementById('mk-social-builder');
  if (panel) panel.style.display = 'none';
}

function mkSelectSocialTpl(el, n) {
  mkSocialTpl = n;
  document.querySelectorAll('#mk-social-builder .mk-social-tpl-opt').forEach(function(o) { o.classList.remove('mk-tpl-selected'); });
  if (el) el.classList.add('mk-tpl-selected');
  mkUpdateSocialPreview();
}

function mkSelectSocialSize(el, ratio, w, h) {
  mkSocialW = w;
  mkSocialH = h;
  document.querySelectorAll('#mk-social-builder .mk-social-size-btn').forEach(function(b) { b.classList.remove('mk-size-active'); });
  if (el) el.classList.add('mk-size-active');
  var lbl = document.getElementById('mk-social-size-label');
  if (lbl) lbl.textContent = w + ' x ' + h + 'px';
  mkUpdateSocialPreview();
}

function mkUpdateSocialPreview() {
  var firm = (document.getElementById('mk-social-firm') || {}).value || '';
  var color = (document.getElementById('mk-social-color') || {}).value || '#0B5FD8';
  var tagline = (document.getElementById('mk-social-tagline') || {}).value || '';
  if (typeof buildStaticCard !== 'function') return;
  var html = buildStaticCard(firm || 'Your Firm', 'Facebook', color, tagline, mkSocialLogoUrl, mkSocialTpl, { w: mkSocialW, h: mkSocialH });
  var canvas = document.getElementById('mk-social-canvas');
  if (!canvas) return;
  var maxW = 400;
  var scale = Math.min(maxW / mkSocialW, 1);
  canvas.style.width = Math.round(mkSocialW * scale) + 'px';
  canvas.style.height = Math.round(mkSocialH * scale) + 'px';
  canvas.innerHTML = html;
}

function mkSocialLogoUpload(input) {
  var file = input.files && input.files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    mkSocialLogoUrl = e.target.result;
    var lbl = document.getElementById('mk-social-logo-label');
    if (lbl) lbl.textContent = file.name;
    mkUpdateSocialPreview();
  };
  reader.readAsDataURL(file);
}

function mkDownloadSocialPng() {
  var firm = (document.getElementById('mk-social-firm') || {}).value || '';
  if (!firm.trim()) { if (typeof showToast === 'function') showToast('Please enter your firm name first', 'warning'); return; }
  var offscreen = document.createElement('div');
  offscreen.style.cssText = 'position:fixed;left:-9999px;top:0;width:' + mkSocialW + 'px;height:' + mkSocialH + 'px;overflow:hidden;z-index:-1';
  var color = (document.getElementById('mk-social-color') || {}).value || '#0B5FD8';
  var tagline = (document.getElementById('mk-social-tagline') || {}).value || '';
  offscreen.innerHTML = buildStaticCard(firm, 'Facebook', color, tagline, mkSocialLogoUrl, mkSocialTpl, { w: mkSocialW, h: mkSocialH });
  document.body.appendChild(offscreen);
  (window.loadHtml2Canvas ? window.loadHtml2Canvas() : Promise.resolve()).then(function(){
    html2canvas(offscreen, { scale: 2, useCORS: true, allowTaint: true, backgroundColor: null })
      .then(function(cv) {
        var a = document.createElement('a');
        a.href = cv.toDataURL('image/png');
        a.download = firm.trim().replace(/\s+/g, '-').toLowerCase() + '-ctax-' + mkSocialW + 'x' + mkSocialH + '.png';
        a.click();
        document.body.removeChild(offscreen);
        mkSaveRecent('social', firm + ' social post ' + mkSocialW + 'x' + mkSocialH);
        if (typeof showToast === 'function') showToast('Social post downloaded', 'success');
      })
      .catch(function() {
        document.body.removeChild(offscreen);
        if (typeof showToast === 'function') showToast('Download failed. Please try again.', 'error');
      });
  });
}


// -- ONE-PAGER BUILDER --
var mkOnePagerLogoUrl = null;

function mkShowOnePagerBuilder() {
  mkShowPanel('mk-onepager-builder', mkUpdateOnePagerPreview);
}

function mkHideOnePagerBuilder() {
  var panel = document.getElementById('mk-onepager-builder');
  if (panel) panel.style.display = 'none';
}

function mkOnePagerLogoUpload(input) {
  var file = input.files && input.files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    mkOnePagerLogoUrl = e.target.result;
    var lbl = document.getElementById('mk-op-logo-label');
    if (lbl) lbl.textContent = file.name;
    mkUpdateOnePagerPreview();
  };
  reader.readAsDataURL(file);
}

function mkBuildOnePager(firm, phone, email, website, tagline, logoUrl) {
  var logo = logoUrl
    ? '<img src="' + logoUrl + '" style="height:40px;width:auto;max-width:180px;object-fit:contain">'
    : '<div style="font-family:DM Sans,sans-serif;font-size:24px;font-weight:700;color:#0A1628">' + (firm || 'Your Firm') + '</div>';

  return '<div style="width:816px;height:1056px;background:#fff;font-family:DM Sans,Arial,sans-serif;box-sizing:border-box;display:flex;flex-direction:column;overflow:hidden">'
    + '<div style="background:linear-gradient(135deg,#0A1628 0%,#112244 60%,#1a3160 100%);padding:40px 48px 36px;position:relative">'
      + '<div style="display:flex;justify-content:space-between;align-items:center">'
        + '<div>' + logo + (tagline ? '<div style="font-size:12px;color:rgba(255,255,255,0.6);margin-top:6px">' + tagline + '</div>' : '') + '</div>'
        + '<div style="text-align:right">'
          + (phone ? '<div style="font-size:13px;color:rgba(255,255,255,0.8)">' + phone + '</div>' : '')
          + (email ? '<div style="font-size:13px;color:rgba(255,255,255,0.8)">' + email + '</div>' : '')
          + (website ? '<div style="font-size:13px;color:#00C8E0">' + website + '</div>' : '')
        + '</div>'
      + '</div>'
      + '<div style="margin-top:28px;font-family:DM Serif Display,Georgia,serif;font-size:36px;color:#fff;line-height:1.15;letter-spacing:-0.02em">Help Your Clients<br>Resolve Their <span style="background:linear-gradient(90deg,#00C8E0,#4BA3FF);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">IRS Tax Debt</span></div>'
      + '<div style="height:3px;background:linear-gradient(90deg,#00E5CC,#00C8E0,#0B5FD8,#4BA3FF);margin-top:24px;border-radius:2px"></div>'
    + '</div>'
    + '<div style="flex:1;padding:36px 48px;display:flex;flex-direction:column;gap:28px">'
      + '<div style="font-size:14px;color:#3d4f5f;line-height:1.65">Partner with Community Tax to offer your clients professional IRS tax resolution services. We handle the heavy lifting while you earn revenue share on every referral. Your clients stay yours -- we work behind the scenes.</div>'
      + '<div style="display:flex;gap:16px">'
        + '<div style="flex:1;background:#f8fafc;border:1px solid #e8ecf0;border-radius:10px;padding:18px;text-align:center"><div style="font-family:DM Serif Display,Georgia,serif;font-size:24px;color:#0B5FD8">$2.3B+</div><div style="font-size:11px;color:#6b7c8e;margin-top:4px">Tax Debt Resolved</div></div>'
        + '<div style="flex:1;background:#f8fafc;border:1px solid #e8ecf0;border-radius:10px;padding:18px;text-align:center"><div style="font-family:DM Serif Display,Georgia,serif;font-size:24px;color:#0B5FD8">120K+</div><div style="font-size:11px;color:#6b7c8e;margin-top:4px">Clients Helped</div></div>'
        + '<div style="flex:1;background:#f8fafc;border:1px solid #e8ecf0;border-radius:10px;padding:18px;text-align:center"><div style="font-family:DM Serif Display,Georgia,serif;font-size:24px;color:#0B5FD8">~80%</div><div style="font-size:11px;color:#6b7c8e;margin-top:4px">Conversion Rate</div></div>'
        + '<div style="flex:1;background:#f8fafc;border:1px solid #e8ecf0;border-radius:10px;padding:18px;text-align:center"><div style="font-family:DM Serif Display,Georgia,serif;font-size:24px;color:#0B5FD8">15 yrs</div><div style="font-size:11px;color:#6b7c8e;margin-top:4px">Experience</div></div>'
      + '</div>'
      + '<div style="display:flex;gap:28px">'
        + '<div style="flex:1"><div style="font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#0B5FD8;margin-bottom:14px">How It Works</div><div style="display:flex;flex-direction:column;gap:12px">'
          + '<div style="display:flex;gap:12px;align-items:flex-start"><div style="width:24px;height:24px;border-radius:50%;background:linear-gradient(135deg,#0B5FD8,#00C8E0);color:#fff;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0">1</div><div><div style="font-size:13px;font-weight:600;color:#0A1628">Identify</div><div style="font-size:12px;color:#6b7c8e;line-height:1.5">Spot clients with $7K+ in IRS debt</div></div></div>'
          + '<div style="display:flex;gap:12px;align-items:flex-start"><div style="width:24px;height:24px;border-radius:50%;background:linear-gradient(135deg,#0B5FD8,#00C8E0);color:#fff;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0">2</div><div><div style="font-size:13px;font-weight:600;color:#0A1628">Refer</div><div style="font-size:12px;color:#6b7c8e;line-height:1.5">Submit a secure referral to Community Tax</div></div></div>'
          + '<div style="display:flex;gap:12px;align-items:flex-start"><div style="width:24px;height:24px;border-radius:50%;background:linear-gradient(135deg,#0B5FD8,#00C8E0);color:#fff;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0">3</div><div><div style="font-size:13px;font-weight:600;color:#0A1628">We Resolve</div><div style="font-size:12px;color:#6b7c8e;line-height:1.5">Our team handles all IRS negotiations</div></div></div>'
          + '<div style="display:flex;gap:12px;align-items:flex-start"><div style="width:24px;height:24px;border-radius:50%;background:linear-gradient(135deg,#0B5FD8,#00C8E0);color:#fff;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0">4</div><div><div style="font-size:13px;font-weight:600;color:#0A1628">You Earn</div><div style="font-size:12px;color:#6b7c8e;line-height:1.5">Receive revenue share on every closed case</div></div></div>'
        + '</div></div>'
        + '<div style="flex:1"><div style="font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#0B5FD8;margin-bottom:14px">Services We Handle</div><div style="display:flex;flex-direction:column;gap:8px">'
          + '<div style="font-size:13px;color:#3d4f5f;padding:8px 0;border-bottom:1px solid #f0f0f0">&#10003; Offer in Compromise</div>'
          + '<div style="font-size:13px;color:#3d4f5f;padding:8px 0;border-bottom:1px solid #f0f0f0">&#10003; Installment Agreements</div>'
          + '<div style="font-size:13px;color:#3d4f5f;padding:8px 0;border-bottom:1px solid #f0f0f0">&#10003; Penalty Abatement</div>'
          + '<div style="font-size:13px;color:#3d4f5f;padding:8px 0;border-bottom:1px solid #f0f0f0">&#10003; Wage Garnishment Relief</div>'
          + '<div style="font-size:13px;color:#3d4f5f;padding:8px 0;border-bottom:1px solid #f0f0f0">&#10003; Tax Lien Resolution</div>'
          + '<div style="font-size:13px;color:#3d4f5f;padding:8px 0">&#10003; Unfiled Return Filing</div>'
        + '</div></div>'
      + '</div>'
      + '<div style="background:linear-gradient(135deg,#0A1628,#112244);border-radius:12px;padding:24px 32px;display:flex;align-items:center;justify-content:space-between">'
        + '<div><div style="font-family:DM Serif Display,Georgia,serif;font-size:20px;color:#fff">Ready to start referring?</div><div style="font-size:13px;color:rgba(255,255,255,0.65);margin-top:4px">Contact ' + (firm || 'us') + ' or visit communitytax.com/partners</div></div>'
        + '<div style="background:linear-gradient(135deg,#0B5FD8,#00C8E0);color:#fff;font-size:14px;font-weight:700;padding:12px 28px;border-radius:8px;white-space:nowrap">Get Started</div>'
      + '</div>'
    + '</div>'
    + '<div style="background:#f8fafc;border-top:1px solid #e8ecf0;padding:16px 48px;text-align:center;font-size:11px;color:#9ca3af">'
      + (firm || 'Your Firm') + ' in partnership with Community Tax, LLC. | BBB A+ Rated | communitytax.com'
    + '</div>'
  + '</div>';
}

function mkUpdateOnePagerPreview() {
  var firm = (document.getElementById('mk-op-firm') || {}).value || '';
  var phone = (document.getElementById('mk-op-phone') || {}).value || '';
  var email = (document.getElementById('mk-op-email') || {}).value || '';
  var website = (document.getElementById('mk-op-website') || {}).value || '';
  var tagline = (document.getElementById('mk-op-tagline') || {}).value || '';
  var html = mkBuildOnePager(firm, phone, email, website, tagline, mkOnePagerLogoUrl);
  var preview = document.getElementById('mk-op-preview');
  if (!preview) return;
  var scale = 320 / 816;
  preview.style.width = '320px';
  preview.style.height = Math.round(1056 * scale) + 'px';
  preview.style.overflow = 'hidden';
  preview.innerHTML = '<div style="transform:scale(' + scale + ');transform-origin:top left;width:816px;height:1056px">' + html + '</div>';
}

function mkDownloadOnePager() {
  var firm = (document.getElementById('mk-op-firm') || {}).value || '';
  if (!firm.trim()) { if (typeof showToast === 'function') showToast('Please enter your firm name first', 'warning'); return; }
  var phone = (document.getElementById('mk-op-phone') || {}).value || '';
  var email = (document.getElementById('mk-op-email') || {}).value || '';
  var website = (document.getElementById('mk-op-website') || {}).value || '';
  var tagline = (document.getElementById('mk-op-tagline') || {}).value || '';
  var offscreen = document.createElement('div');
  offscreen.style.cssText = 'position:fixed;left:-9999px;top:0;width:816px;height:1056px;overflow:hidden;z-index:-1';
  offscreen.innerHTML = mkBuildOnePager(firm, phone, email, website, tagline, mkOnePagerLogoUrl);
  document.body.appendChild(offscreen);
  (window.loadHtml2Canvas ? window.loadHtml2Canvas() : Promise.resolve()).then(function(){
    html2canvas(offscreen, { scale: 2, useCORS: true, allowTaint: true, backgroundColor: null })
      .then(function(cv) {
        var a = document.createElement('a');
        a.href = cv.toDataURL('image/png');
        a.download = firm.trim().replace(/\s+/g, '-').toLowerCase() + '-partner-one-pager.png';
        a.click();
        document.body.removeChild(offscreen);
        mkSaveRecent('onepager', firm + ' one-pager (PNG)');
        if (typeof showToast === 'function') showToast('One-pager downloaded as PNG', 'success');
      })
      .catch(function() {
        document.body.removeChild(offscreen);
        if (typeof showToast === 'function') showToast('Download failed. Please try again.', 'error');
      });
  });
}

// Step 4: PDF export for one-pager
function mkDownloadOnePagerPdf() {
  var firm = (document.getElementById('mk-op-firm') || {}).value || '';
  if (!firm.trim()) { if (typeof showToast === 'function') showToast('Please enter your firm name first', 'warning'); return; }
  if (typeof CTAX_PDF === 'undefined' || typeof html2pdf === 'undefined') {
    if (typeof showToast === 'function') showToast('PDF system not loaded yet', 'warning');
    return;
  }
  var phone = (document.getElementById('mk-op-phone') || {}).value || '';
  var email = (document.getElementById('mk-op-email') || {}).value || '';
  var website = (document.getElementById('mk-op-website') || {}).value || '';
  var tagline = (document.getElementById('mk-op-tagline') || {}).value || '';
  var onePagerHtml = mkBuildOnePager(firm, phone, email, website, tagline, mkOnePagerLogoUrl);

  var doc = CTAX_PDF.createDoc();
  // Use the one-pager HTML directly as the single page content
  var wrapper = document.createElement('div');
  wrapper.innerHTML = onePagerHtml;
  doc.appendChild(wrapper.firstChild);
  var filename = firm.trim().replace(/\s+/g, '-').toLowerCase() + '-partner-one-pager.pdf';
  CTAX_PDF.renderPdf(doc, filename);
  mkSaveRecent('onepager', firm + ' one-pager (PDF)');
  if (typeof showToast === 'function') showToast('Generating PDF...', 'success');
}


// -- INLINE AD BUILDER (Step 1) --
var mkAdsTpl = 1;
var mkAdsW = 1200;
var mkAdsH = 628;
var mkAdsLogoUrl = null;

function mkShowAdsBuilder() {
  mkShowPanel('mk-ads-builder', mkAdsUpdatePreview);
}

function mkHideAdsBuilder() {
  var panel = document.getElementById('mk-ads-builder');
  if (panel) panel.style.display = 'none';
}

function mkAdsSelectTpl(el, n) {
  mkAdsTpl = n;
  document.querySelectorAll('#mk-ads-tpl-picker .mk-social-tpl-opt').forEach(function(o) { o.classList.remove('mk-tpl-selected'); });
  if (el) el.classList.add('mk-tpl-selected');
  mkAdsUpdatePreview();
}

function mkAdsSelectSize(el, ratio, w, h) {
  mkAdsW = w;
  mkAdsH = h;
  document.querySelectorAll('#mk-ads-builder .mk-social-size-btn').forEach(function(b) { b.classList.remove('mk-size-active'); });
  if (el) el.classList.add('mk-size-active');
  var lbl = document.getElementById('mk-ads-size-label');
  if (lbl) lbl.textContent = w + ' x ' + h + 'px';
  mkAdsUpdatePreview();
}

function mkAdsLogoUpload(input) {
  var file = input.files && input.files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    mkAdsLogoUrl = e.target.result;
    var lbl = document.getElementById('mk-ads-logo-label');
    if (lbl) lbl.textContent = file.name;
    mkAdsUpdatePreview();
  };
  reader.readAsDataURL(file);
}

function mkAdsUpdatePreview() {
  if (typeof buildStaticCard !== 'function') return;
  var firm = (document.getElementById('mk-ads-firm') || {}).value || 'Your Firm';
  var color = (document.getElementById('mk-ads-color') || {}).value || '#0B5FD8';
  var tagline = (document.getElementById('mk-ads-tagline') || {}).value || '';
  var platform = (document.getElementById('mk-ads-platform') || {}).value || 'Facebook';
  var html = buildStaticCard(firm, platform, color, tagline, mkAdsLogoUrl, mkAdsTpl, { w: mkAdsW, h: mkAdsH });
  var canvas = document.getElementById('mk-ads-canvas');
  if (!canvas) return;
  var maxW = 400;
  var scale = Math.min(maxW / mkAdsW, 1);
  canvas.style.width = Math.round(mkAdsW * scale) + 'px';
  canvas.style.height = Math.round(mkAdsH * scale) + 'px';
  canvas.innerHTML = html;
}

function mkAdsGenerate() {
  var firm = (document.getElementById('mk-ads-firm') || {}).value || '';
  if (!firm.trim()) { if (typeof showToast === 'function') showToast('Please enter your firm name first', 'warning'); return; }
  // Show results area
  var results = document.getElementById('mk-ads-results');
  if (results) results.style.display = 'block';
  mkSaveRecent('ad', firm + ' ad - Template ' + mkAdsTpl);
  // Generate AI headlines + captions inline
  mkAdsGenerateHeadlines(firm);
  mkAdsGenerateCaptions(firm);
  if (typeof showToast === 'function') showToast('Ad generated! Download or generate AI captions below.', 'success');
}

function mkAdsGenerateHeadlines(firm) {
  var container = document.getElementById('mk-ads-headlines');
  if (!container) return;
  if (typeof CTAX_API_URL === 'undefined' || !CTAX_API_KEY) { container.style.display = 'none'; return; }
  container.innerHTML = '<div style="font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:var(--slate);margin-bottom:8px">AI HEADLINE SUGGESTIONS</div><div style="font-size:13px;color:var(--slate)">Generating...</div>';
  var prompt = 'Generate exactly 3 short, punchy ad headlines (max 8 words each) for a co-branded social ad between "' + firm + '" and Community Tax (IRS tax resolution). Format: one per line, numbered 1-3. No quotes, no explanation.';
  fetch(CTAX_API_URL, {
    method: 'POST',
    headers: getApiHeaders(),
    body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 200, messages: [{role: 'user', content: prompt}] })
  }).then(function(r) { return r.json(); }).then(function(d) {
    var text = d.content && d.content[0] ? d.content[0].text.trim() : '';
    var lines = text.split('\n').filter(function(l) { return l.trim(); }).slice(0, 3);
    var html = '<div style="font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:var(--slate);margin-bottom:8px">AI HEADLINE SUGGESTIONS</div>';
    lines.forEach(function(line) {
      var clean = line.replace(/^\d+[\.\)]\s*/, '').replace(/^["']|["']$/g, '');
      html += '<button class="mk-hl-btn" onclick="navigator.clipboard.writeText(this.textContent);if(typeof showToast===\'function\')showToast(\'Copied!\',\'copied\')" style="display:block;width:100%;text-align:left;background:rgba(11,95,216,0.04);border:1px solid rgba(11,95,216,0.1);border-radius:6px;padding:8px 12px;margin-bottom:6px;font-size:13px;font-weight:600;color:var(--navy);cursor:pointer;font-family:DM Sans,sans-serif;transition:all 0.15s">' + clean + '</button>';
    });
    html += '<div style="font-size:11px;color:var(--slate);margin-top:4px">Click to copy</div>';
    container.innerHTML = html;
  }).catch(function() { container.innerHTML = ''; });
}

function mkAdsGenerateCaptions(firm) {
  var container = document.getElementById('mk-ads-captions');
  if (!container) return;
  if (typeof CTAX_API_URL === 'undefined' || !CTAX_API_KEY) { container.style.display = 'none'; return; }
  var platform = (document.getElementById('mk-ads-platform') || {}).value || 'Facebook';
  var tagline = (document.getElementById('mk-ads-tagline') || {}).value || '';
  container.innerHTML = '<div style="font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:var(--slate);margin-bottom:8px">PLATFORM CAPTIONS</div><div style="font-size:13px;color:var(--slate)">Generating captions for ' + platform + '...</div>';
  var prompt = 'Generate 3 ready-to-post social media captions for a co-branded ad between "' + firm + '" and Community Tax (IRS tax resolution). '
    + (tagline ? 'Tagline: "' + tagline + '". ' : '')
    + 'Platform: ' + platform + '. Each caption should match ' + platform + ' tone, include a CTA, mention the partnership. '
    + 'Return JSON array: [{"label":"Style","text":"Caption","hashtags":"#tags"}]';
  fetch(CTAX_API_URL, {
    method: 'POST',
    headers: getApiHeaders(),
    body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 1024, messages: [{ role: 'user', content: prompt }] })
  }).then(function(r) { return r.json(); }).then(function(data) {
    var text = data.content ? data.content[0].text : '';
    var captions = [];
    try { var match = text.match(/\[[\s\S]*\]/); if (match) captions = JSON.parse(match[0]); } catch(e) {}
    if (!captions.length) {
      captions = [
        { label: 'Professional', text: 'Tax debt doesn\'t resolve itself. ' + firm + ' has partnered with Community Tax to help clients find real solutions.', hashtags: '#TaxRelief #TaxDebt' },
        { label: 'Empathetic', text: 'Owing the IRS is stressful. You don\'t have to face it alone. Through our partnership with Community Tax, we connect clients to proven resolution.', hashtags: '#TaxHelp #DebtFree' },
        { label: 'Direct', text: '$2.3B in tax debt resolved. 120K+ clients helped. ' + firm + ' + Community Tax = your path to IRS relief.', hashtags: '#IRSHelp #TaxResolution' }
      ];
    }
    var html = '<div style="font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:var(--slate);margin-bottom:10px">PLATFORM CAPTIONS</div>';
    captions.forEach(function(c) {
      html += '<div style="background:var(--white);border:1px solid var(--off2);border-radius:8px;padding:14px;margin-bottom:10px">'
        + '<div style="font-size:11px;font-weight:700;color:var(--blue);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px">' + (c.label || 'Caption') + '</div>'
        + '<div style="font-size:13px;color:var(--navy);line-height:1.6;margin-bottom:8px">' + c.text + '</div>'
        + '<div style="display:flex;justify-content:space-between;align-items:center">'
          + '<span style="font-size:11px;color:var(--slate)">' + (c.hashtags || '') + '</span>'
          + '<button class="mk-dl-btn mk-dl-sm" onclick="navigator.clipboard.writeText(\'' + (c.text + ' ' + (c.hashtags || '')).replace(/'/g, "\\'") + '\');if(typeof showToast===\'function\')showToast(\'Caption copied!\',\'copied\')" style="font-size:11px">Copy</button>'
        + '</div></div>';
    });
    container.innerHTML = html;
  }).catch(function() {
    container.innerHTML = '<div style="color:#c0392b;font-size:13px">Failed to generate captions.</div>';
  });
}

function mkAdsDownloadPng() {
  var firm = (document.getElementById('mk-ads-firm') || {}).value || '';
  if (!firm.trim()) return;
  if (typeof buildStaticCard !== 'function') return;
  var color = (document.getElementById('mk-ads-color') || {}).value || '#0B5FD8';
  var tagline = (document.getElementById('mk-ads-tagline') || {}).value || '';
  var platform = (document.getElementById('mk-ads-platform') || {}).value || 'Facebook';
  var offscreen = document.createElement('div');
  offscreen.style.cssText = 'position:fixed;left:-9999px;top:0;width:' + Math.round(mkAdsW * 0.5) + 'px;height:' + Math.round(mkAdsH * 0.5) + 'px;overflow:hidden;z-index:-1';
  offscreen.innerHTML = buildStaticCard(firm, platform, color, tagline, mkAdsLogoUrl, mkAdsTpl, { w: mkAdsW, h: mkAdsH });
  document.body.appendChild(offscreen);
  (window.loadHtml2Canvas ? window.loadHtml2Canvas() : Promise.resolve()).then(function(){
    html2canvas(offscreen, { scale: 2, useCORS: true, allowTaint: true, backgroundColor: null }).then(function(cv) {
      var a = document.createElement('a');
      a.href = cv.toDataURL('image/png');
      a.download = firm.trim().replace(/\s+/g, '-').toLowerCase() + '-ctax-' + mkAdsW + 'x' + mkAdsH + '.png';
      a.click();
      document.body.removeChild(offscreen);
      if (typeof showToast === 'function') showToast('Ad downloaded', 'success');
    });
  });
}

function mkAdsDownloadAll() {
  var firm = (document.getElementById('mk-ads-firm') || {}).value || '';
  if (!firm.trim()) return;
  var sizes = [
    { w: 1200, h: 628 }, { w: 1080, h: 1080 }, { w: 1080, h: 1350 },
    { w: 1080, h: 1920 }, { w: 1350, h: 1080 }
  ];
  var color = (document.getElementById('mk-ads-color') || {}).value || '#0B5FD8';
  var tagline = (document.getElementById('mk-ads-tagline') || {}).value || '';
  var platform = (document.getElementById('mk-ads-platform') || {}).value || 'Facebook';
  var firmSlug = firm.trim().replace(/\s+/g, '-').toLowerCase();
  var btn = document.getElementById('mk-ads-batch-btn');
  if (btn) { btn.disabled = true; btn.textContent = 'Downloading...'; }
  var temp = document.createElement('div');
  temp.style.cssText = 'position:fixed;left:-9999px;top:0;z-index:-1';
  document.body.appendChild(temp);
  var idx = 0;
  function next() {
    if (idx >= sizes.length) {
      document.body.removeChild(temp);
      if (btn) { btn.disabled = false; btn.textContent = 'Download All Sizes'; }
      if (typeof showToast === 'function') showToast('All 5 sizes downloaded', 'copied');
      return;
    }
    var s = sizes[idx];
    temp.style.width = Math.round(s.w * 0.5) + 'px';
    temp.style.height = Math.round(s.h * 0.5) + 'px';
    temp.innerHTML = buildStaticCard(firm, platform, color, tagline, mkAdsLogoUrl, mkAdsTpl, { w: s.w, h: s.h });
    (window.loadHtml2Canvas ? window.loadHtml2Canvas() : Promise.resolve()).then(function() {
      html2canvas(temp, { scale: 2, useCORS: true, allowTaint: true, backgroundColor: null }).then(function(cv) {
        var a = document.createElement('a');
        a.href = cv.toDataURL('image/png');
        a.download = firmSlug + '-ctax-' + s.w + 'x' + s.h + '.png';
        a.click();
        idx++;
        setTimeout(next, 400);
      });
    });
  }
  next();
}


// -- CLIENT-FACING FLYER BUILDER (Step 5A) --
var mkFlyerLogoUrl = null;

var MK_FLYER_COPY = {
  general: { headline: 'Do You Owe the IRS?', subhead: 'There may be options to resolve your tax debt for less than you owe.', bullets: ['Offer in Compromise programs', 'Installment agreement options', 'Penalty abatement strategies', 'Wage garnishment relief'] },
  'back-taxes': { headline: 'Unfiled Tax Returns?', subhead: 'Don\'t wait for the IRS to come to you. Get ahead of the problem.', bullets: ['File multiple years of returns', 'Negotiate reduced penalties', 'Avoid criminal prosecution risk', 'Get back into compliance'] },
  business: { headline: 'Business Tax Debt Crushing You?', subhead: 'Protect your business from IRS seizure and resolve your debt.', bullets: ['Payroll tax resolution', 'Business tax negotiation', 'Asset protection strategies', 'Installment plans for businesses'] },
  garnishment: { headline: 'IRS Garnishing Your Wages?', subhead: 'You can stop wage garnishment. There are legitimate options.', bullets: ['Emergency garnishment release', 'Negotiate lower payments', 'Protect your income', 'Resolve the underlying debt'] },
  lien: { headline: 'Tax Lien on Your Property?', subhead: 'A tax lien doesn\'t have to destroy your credit or cost you your home.', bullets: ['Tax lien discharge', 'Lien subordination', 'Lien withdrawal strategies', 'Credit score recovery'] }
};

function mkShowFlyerBuilder() {
  mkShowPanel('mk-flyer-builder', mkUpdateFlyerPreview);
}

function mkHideFlyerBuilder() {
  var panel = document.getElementById('mk-flyer-builder');
  if (panel) panel.style.display = 'none';
}

function mkFlyerLogoUpload(input) {
  var file = input.files && input.files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    mkFlyerLogoUrl = e.target.result;
    var lbl = document.getElementById('mk-flyer-logo-label');
    if (lbl) lbl.textContent = file.name;
    mkUpdateFlyerPreview();
  };
  reader.readAsDataURL(file);
}

function mkBuildFlyer(firm, phone, area, color, logoUrl) {
  var copy = MK_FLYER_COPY[area] || MK_FLYER_COPY.general;
  var logo = logoUrl
    ? '<img src="' + logoUrl + '" style="height:36px;width:auto;max-width:160px;object-fit:contain">'
    : '';
  var ctaxLogo = typeof CTAX_LOGO_WHITE !== 'undefined' ? '<img src="' + CTAX_LOGO_WHITE + '" style="height:24px;width:auto;opacity:0.7">' : '';
  var bulletsHtml = '';
  copy.bullets.forEach(function(b) {
    bulletsHtml += '<div style="display:flex;gap:10px;align-items:flex-start;margin-bottom:12px">'
      + '<div style="width:20px;height:20px;border-radius:50%;background:' + color + ';color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0">&#10003;</div>'
      + '<div style="font-size:14px;color:#3d4f5f;line-height:1.5">' + b + '</div></div>';
  });

  return '<div style="width:816px;height:1056px;background:#fff;font-family:DM Sans,Arial,sans-serif;box-sizing:border-box;display:flex;flex-direction:column;overflow:hidden">'
    + '<div style="background:linear-gradient(135deg,#0A1628 0%,#112244 60%,#1a3160 100%);padding:48px;position:relative;text-align:center">'
      + '<div style="font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:' + color + ';margin-bottom:16px">FREE CONSULTATION</div>'
      + '<div style="font-family:DM Serif Display,Georgia,serif;font-size:44px;color:#fff;line-height:1.1;margin-bottom:16px">' + copy.headline + '</div>'
      + '<div style="font-size:16px;color:rgba(255,255,255,0.75);line-height:1.6;max-width:500px;margin:0 auto">' + copy.subhead + '</div>'
      + '<div style="height:3px;width:80px;background:linear-gradient(90deg,' + color + ',#00C8E0);margin:28px auto 0;border-radius:2px"></div>'
    + '</div>'
    + '<div style="flex:1;padding:48px;display:flex;flex-direction:column;gap:32px">'
      + '<div style="display:flex;gap:20px">'
        + '<div style="flex:1;background:#f8fafc;border:1px solid #e8ecf0;border-radius:12px;padding:24px;text-align:center"><div style="font-family:DM Serif Display,Georgia,serif;font-size:28px;color:' + color + '">$2.3B+</div><div style="font-size:12px;color:#6b7c8e;margin-top:4px">Tax Debt Resolved</div></div>'
        + '<div style="flex:1;background:#f8fafc;border:1px solid #e8ecf0;border-radius:12px;padding:24px;text-align:center"><div style="font-family:DM Serif Display,Georgia,serif;font-size:28px;color:' + color + '">120K+</div><div style="font-size:12px;color:#6b7c8e;margin-top:4px">Clients Helped</div></div>'
        + '<div style="flex:1;background:#f8fafc;border:1px solid #e8ecf0;border-radius:12px;padding:24px;text-align:center"><div style="font-family:DM Serif Display,Georgia,serif;font-size:28px;color:' + color + '">A+</div><div style="font-size:12px;color:#6b7c8e;margin-top:4px">BBB Rated</div></div>'
      + '</div>'
      + '<div style="font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:' + color + '">What We Can Do For You</div>'
      + '<div>' + bulletsHtml + '</div>'
      + '<div style="background:linear-gradient(135deg,#0A1628,#112244);border-radius:12px;padding:28px 36px;display:flex;align-items:center;justify-content:space-between">'
        + '<div><div style="font-family:DM Serif Display,Georgia,serif;font-size:22px;color:#fff">Get Your Free Tax Review</div>'
          + (phone ? '<div style="font-size:14px;color:rgba(255,255,255,0.7);margin-top:6px">Call ' + phone + ' today</div>' : '<div style="font-size:14px;color:rgba(255,255,255,0.7);margin-top:6px">Contact us for a confidential consultation</div>')
        + '</div>'
        + '<div style="background:' + color + ';color:#fff;font-size:15px;font-weight:700;padding:14px 32px;border-radius:8px;white-space:nowrap">Call Now</div>'
      + '</div>'
    + '</div>'
    + '<div style="background:#f8fafc;border-top:1px solid #e8ecf0;padding:16px 48px;display:flex;justify-content:space-between;align-items:center">'
      + '<div>' + logo + '</div>'
      + '<div style="font-size:11px;color:#9ca3af">In partnership with Community Tax, LLC.</div>'
      + '<div>' + ctaxLogo + '</div>'
    + '</div>'
  + '</div>';
}

function mkUpdateFlyerPreview() {
  var firm = (document.getElementById('mk-flyer-firm') || {}).value || '';
  var phone = (document.getElementById('mk-flyer-phone') || {}).value || '';
  var area = (document.getElementById('mk-flyer-area') || {}).value || 'general';
  var color = (document.getElementById('mk-flyer-color') || {}).value || '#0B5FD8';
  var html = mkBuildFlyer(firm, phone, area, color, mkFlyerLogoUrl);
  var preview = document.getElementById('mk-flyer-preview');
  if (!preview) return;
  var scale = 320 / 816;
  preview.style.width = '320px';
  preview.style.height = Math.round(1056 * scale) + 'px';
  preview.style.overflow = 'hidden';
  preview.innerHTML = '<div style="transform:scale(' + scale + ');transform-origin:top left;width:816px;height:1056px">' + html + '</div>';
}

function mkGenerateFlyer() {
  var firm = (document.getElementById('mk-flyer-firm') || {}).value || '';
  if (!firm.trim()) { if (typeof showToast === 'function') showToast('Please enter your firm name', 'warning'); return; }
  if (typeof CTAX_PDF === 'undefined' || typeof html2pdf === 'undefined') {
    if (typeof showToast === 'function') showToast('PDF system loading...', 'info'); return;
  }
  var phone = (document.getElementById('mk-flyer-phone') || {}).value || '';
  var area = (document.getElementById('mk-flyer-area') || {}).value || 'general';
  var color = (document.getElementById('mk-flyer-color') || {}).value || '#0B5FD8';
  var flyerHtml = mkBuildFlyer(firm, phone, area, color, mkFlyerLogoUrl);
  var doc = CTAX_PDF.createDoc();
  var wrapper = document.createElement('div');
  wrapper.innerHTML = flyerHtml;
  doc.appendChild(wrapper.firstChild);
  var filename = firm.trim().replace(/\s+/g, '-').toLowerCase() + '-client-flyer.pdf';
  CTAX_PDF.renderPdf(doc, filename);
  mkSaveRecent('flyer', firm + ' client flyer');
  // Show PNG download button
  var pngBtn = document.getElementById('mk-flyer-png-btn');
  if (pngBtn) pngBtn.style.display = 'flex';
  if (typeof showToast === 'function') showToast('Generating flyer PDF...', 'success');
}

function mkDownloadFlyerPng() {
  var firm = (document.getElementById('mk-flyer-firm') || {}).value || '';
  if (!firm.trim()) return;
  var phone = (document.getElementById('mk-flyer-phone') || {}).value || '';
  var area = (document.getElementById('mk-flyer-area') || {}).value || 'general';
  var color = (document.getElementById('mk-flyer-color') || {}).value || '#0B5FD8';
  var offscreen = document.createElement('div');
  offscreen.style.cssText = 'position:fixed;left:-9999px;top:0;width:816px;height:1056px;overflow:hidden;z-index:-1';
  offscreen.innerHTML = mkBuildFlyer(firm, phone, area, color, mkFlyerLogoUrl);
  document.body.appendChild(offscreen);
  (window.loadHtml2Canvas ? window.loadHtml2Canvas() : Promise.resolve()).then(function(){
    html2canvas(offscreen, { scale: 2, useCORS: true, allowTaint: true, backgroundColor: null }).then(function(cv) {
      var a = document.createElement('a');
      a.href = cv.toDataURL('image/png');
      a.download = firm.trim().replace(/\s+/g, '-').toLowerCase() + '-client-flyer.png';
      a.click();
      document.body.removeChild(offscreen);
      if (typeof showToast === 'function') showToast('Flyer PNG downloaded', 'success');
    }).catch(function() { document.body.removeChild(offscreen); });
  });
}


// -- PRESENTATION DECK BUILDER (Step 5B) --
function mkShowDeckBuilder() {
  mkShowPanel('mk-deck-builder');
}

function mkHideDeckBuilder() {
  var panel = document.getElementById('mk-deck-builder');
  if (panel) panel.style.display = 'none';
}

function mkGenerateDeck() {
  var firm = (document.getElementById('mk-deck-firm') || {}).value || '';
  if (!firm.trim()) { if (typeof showToast === 'function') showToast('Please enter your firm name', 'warning'); return; }
  if (typeof CTAX_PDF === 'undefined' || typeof html2pdf === 'undefined') {
    if (typeof showToast === 'function') showToast('PDF system loading...', 'info'); return;
  }
  var audience = (document.getElementById('mk-deck-audience') || {}).value || 'general';
  var stats = (document.getElementById('mk-deck-stats') || {}).value || '';
  var value = (document.getElementById('mk-deck-value') || {}).value || '';
  var btn = document.getElementById('mk-deck-gen-btn');
  if (btn) { btn.disabled = true; btn.textContent = 'Generating...'; }
  var status = document.getElementById('mk-deck-status');
  if (status) status.innerHTML = '<div class="spin" style="width:24px;height:24px;border:2px solid var(--off2);border-top-color:var(--blue);border-radius:50%;animation:spin .6s linear infinite;margin:0 auto 12px"></div><div style="font-size:14px">AI is generating your 5-slide pitch deck...</div>';

  var audienceLabels = { cpas: 'CPAs and Tax Professionals', attorneys: 'Attorneys', 'financial-advisors': 'Financial Advisors', insurance: 'Insurance Agents', general: 'General Partners' };
  var prompt = 'Create a 5-slide pitch deck outline for "' + firm + '" to pitch the Community Tax partner program to ' + (audienceLabels[audience] || audience) + '. '
    + (stats ? 'Key stats: ' + stats + '. ' : '')
    + (value ? 'Value proposition: ' + value + '. ' : '')
    + 'Return JSON array of 5 objects: [{"title":"Slide title","bullets":["point 1","point 2","point 3"],"note":"Speaker note"}]. '
    + 'Slides should be: 1) Intro/Welcome, 2) The Problem (tax debt landscape), 3) The Solution (Community Tax partnership), 4) Why Community Tax (stats/credibility), 5) Next Steps/CTA.';

  fetch(CTAX_API_URL, {
    method: 'POST',
    headers: getApiHeaders(),
    body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 2048, messages: [{ role: 'user', content: prompt }] })
  }).then(function(r) { return r.json(); }).then(function(data) {
    var text = data.content ? data.content[0].text : '';
    var slides = [];
    try { var match = text.match(/\[[\s\S]*\]/); if (match) slides = JSON.parse(match[0]); } catch(e) {}
    if (!slides.length || slides.length < 5) {
      slides = [
        { title: 'Welcome to the ' + firm + ' Partnership', bullets: ['Introducing the Community Tax referral program', 'Revenue share on every closed case', 'White-label support for your clients'] },
        { title: 'The Problem: $200B+ in Unpaid Tax Debt', bullets: ['Millions of Americans owe the IRS', 'Many don\'t know their resolution options', 'Your clients need expert help'] },
        { title: 'The Solution: Community Tax Partnership', bullets: ['Full-service tax resolution', 'You identify, we resolve', 'Clients stay yours throughout'] },
        { title: 'Why Community Tax?', bullets: ['$2.3B+ in tax debt resolved', '120,000+ clients helped', 'BBB A+ rated, 15 years experience'] },
        { title: 'Get Started Today', bullets: ['Sign the partner agreement', 'Access the partner portal', 'Start referring in minutes'] }
      ];
    }
    mkBuildDeckPdf(firm, slides);
    if (btn) { btn.disabled = false; btn.textContent = 'Generate Pitch Deck PDF'; }
    if (status) status.innerHTML = '<div style="font-size:14px;color:var(--navy);font-weight:600">Pitch deck generated and downloading!</div><div style="font-size:13px;color:var(--slate);margin-top:8px">5 slides with AI-generated content.</div>';
  }).catch(function(err) {
    console.error('Deck generation error:', err);
    if (btn) { btn.disabled = false; btn.textContent = 'Generate Pitch Deck PDF'; }
    if (status) status.innerHTML = '<div style="color:#c0392b;font-size:14px">Failed to generate deck. Please try again.</div>';
  });
}

function mkBuildDeckPdf(firm, slides) {
  var doc = CTAX_PDF.createDoc();
  doc.appendChild(CTAX_PDF.createCover(firm + ' Partner Pitch Deck', 'Community Tax Referral Program Overview', [
    { label: 'For', value: firm },
    { label: 'Slides', value: slides.length + '' },
    { label: 'Program', value: 'Community Tax Partners' }
  ]));
  slides.forEach(function(slide, i) {
    var page = CTAX_PDF.createPage(false);
    CTAX_PDF.addHeader(page, 'Slide ' + (i + 1) + ' of ' + slides.length);
    var content = document.createElement('div');
    content.style.padding = '20px 0';
    content.innerHTML = '<div class="ctpdf-section-title">' + CTAX_PDF.esc(slide.title) + '</div>';
    if (slide.bullets && slide.bullets.length) {
      slide.bullets.forEach(function(b, j) {
        content.innerHTML += '<div class="ctpdf-item"><div class="ctpdf-item-num">' + (j + 1) + '</div><div class="ctpdf-item-body">' + CTAX_PDF.esc(b) + '</div></div>';
      });
    }
    if (slide.note) {
      content.innerHTML += '<div class="ctpdf-callout"><div class="ctpdf-callout-title">Speaker Notes</div><div class="ctpdf-callout-body">' + CTAX_PDF.esc(slide.note) + '</div></div>';
    }
    page.appendChild(content);
    CTAX_PDF.addFooter(page);
    doc.appendChild(page);
  });
  var filename = firm.trim().replace(/\s+/g, '-').toLowerCase() + '-pitch-deck.pdf';
  CTAX_PDF.renderPdf(doc, filename);
  mkSaveRecent('deck', firm + ' pitch deck');
}


// -- REFERRAL THANK-YOU CARD (Step 5C) --
function mkShowThankYouBuilder() {
  mkShowPanel('mk-thankyou-builder', mkUpdateThankYouPreview);
}

function mkHideThankYouBuilder() {
  var panel = document.getElementById('mk-thankyou-builder');
  if (panel) panel.style.display = 'none';
}

function mkBuildThankYouHtml(firm, client, caseType, amount) {
  return '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>'
    + '<body style="margin:0;padding:0;background:#f4f6f9;font-family:Arial,Helvetica,sans-serif">'
    + '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:32px 16px"><tr><td align="center">'
    + '<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(10,22,40,0.06)">'
    + '<tr><td style="background:linear-gradient(135deg,#0A1628,#112244);padding:32px 40px;text-align:center">'
      + '<div style="font-size:11px;font-weight:bold;letter-spacing:0.14em;text-transform:uppercase;color:#00C8E0;margin-bottom:8px">Thank You</div>'
      + '<div style="font-family:Georgia,serif;font-size:26px;color:#fff;line-height:1.2">For Your Referral</div>'
    + '</td></tr>'
    + '<tr><td style="height:3px;background:linear-gradient(90deg,#00E5CC,#00C8E0,#0B5FD8,#4BA3FF)"></td></tr>'
    + '<tr><td style="padding:36px 40px 28px">'
      + '<p style="font-size:16px;color:#0A1628;margin:0 0 20px;font-weight:bold">Dear ' + (client || 'Valued Partner') + ',</p>'
      + '<p style="font-size:15px;color:#3d4f5f;line-height:1.65;margin:0 0 16px">Thank you for trusting us with your referral. We wanted to let you know that the case has been <strong style="color:#0A1628">successfully resolved</strong> through our partnership with Community Tax.</p>'
      + (amount ? '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;background:rgba(11,95,216,0.04);border-left:4px solid #0B5FD8;border-radius:0 8px 8px 0"><tr><td style="padding:16px 20px"><div style="font-size:12px;font-weight:bold;color:#0B5FD8;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px">Resolution Details</div><div style="font-size:15px;color:#0A1628;font-weight:600">' + caseType + '</div><div style="font-size:14px;color:#3d4f5f;margin-top:4px">' + amount + '</div></td></tr></table>' : '')
      + '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;background:#f8fafc;border-radius:8px;border:1px solid #e8ecf0"><tr>'
        + '<td style="padding:16px;text-align:center;width:50%;border-right:1px solid #e8ecf0"><div style="font-family:Georgia,serif;font-size:18px;color:#0B5FD8">Case Resolved</div><div style="font-size:11px;color:#6b7c8e;margin-top:4px">' + caseType + '</div></td>'
        + '<td style="padding:16px;text-align:center;width:50%"><div style="font-family:Georgia,serif;font-size:18px;color:#0B5FD8">Partnership Active</div><div style="font-size:11px;color:#6b7c8e;margin-top:4px">Ready for more referrals</div></td>'
      + '</tr></table>'
      + '<p style="font-size:15px;color:#3d4f5f;line-height:1.65;margin:16px 0">We appreciate your partnership and look forward to helping more of your clients find relief from their tax burdens.</p>'
      + '<p style="font-size:15px;color:#3d4f5f;line-height:1.65;margin:24px 0 0">With gratitude,<br><strong style="color:#0A1628">' + (firm || 'Your Firm Name') + '</strong><br><span style="font-size:13px;color:#6b7c8e">In partnership with Community Tax</span></p>'
    + '</td></tr>'
    + '<tr><td style="background:#f8fafc;padding:20px 40px;border-top:1px solid #e8ecf0;text-align:center"><p style="font-size:11px;color:#9ca3af;margin:0">Sent from ' + (firm || 'Your Firm') + ' via Community Tax Partner Program</p></td></tr>'
    + '</table></td></tr></table></body></html>';
}

function mkUpdateThankYouPreview() {
  var firm = (document.getElementById('mk-ty-firm') || {}).value || '';
  var client = (document.getElementById('mk-ty-client') || {}).value || '';
  var caseType = (document.getElementById('mk-ty-case') || {}).value || '';
  var amount = (document.getElementById('mk-ty-amount') || {}).value || '';
  var html = mkBuildThankYouHtml(firm, client, caseType, amount);
  var frame = document.getElementById('mk-ty-preview');
  if (frame) frame.srcdoc = html;
}

function mkGenerateThankYou() {
  mkUpdateThankYouPreview();
  var actions = document.getElementById('mk-ty-actions');
  if (actions) actions.style.display = 'flex';
  var firm = (document.getElementById('mk-ty-firm') || {}).value || 'Your Firm';
  mkSaveRecent('thankyou', firm + ' thank-you card');
  if (typeof showToast === 'function') showToast('Thank-you card generated', 'success');
}

function mkCopyThankYou() {
  var firm = (document.getElementById('mk-ty-firm') || {}).value || '';
  var client = (document.getElementById('mk-ty-client') || {}).value || '';
  var caseType = (document.getElementById('mk-ty-case') || {}).value || '';
  var amount = (document.getElementById('mk-ty-amount') || {}).value || '';
  var html = mkBuildThankYouHtml(firm, client, caseType, amount);
  navigator.clipboard.writeText(html).then(function() {
    if (typeof showToast === 'function') showToast('HTML copied to clipboard', 'copied');
  });
}

function mkDownloadThankYouPdf() {
  var firm = (document.getElementById('mk-ty-firm') || {}).value || '';
  if (!firm.trim()) { if (typeof showToast === 'function') showToast('Please enter your firm name', 'warning'); return; }
  if (typeof CTAX_PDF === 'undefined' || typeof html2pdf === 'undefined') {
    if (typeof showToast === 'function') showToast('PDF system loading...', 'info'); return;
  }
  var client = (document.getElementById('mk-ty-client') || {}).value || 'Valued Partner';
  var caseType = (document.getElementById('mk-ty-case') || {}).value || '';
  var amount = (document.getElementById('mk-ty-amount') || {}).value || '';

  var doc = CTAX_PDF.createDoc();
  doc.appendChild(CTAX_PDF.createCover('Referral Thank You', 'For ' + client + ' - Case resolved through Community Tax', [
    { label: 'Partner', value: firm },
    { label: 'Case Type', value: caseType }
  ]));
  var page = CTAX_PDF.createPage(false);
  CTAX_PDF.addHeader(page, 'Referral Thank You');
  var content = document.createElement('div');
  content.style.padding = '20px 0';
  content.innerHTML = '<div class="ctpdf-section-title">Thank You for Your Referral</div>'
    + '<div class="ctpdf-p">Dear ' + CTAX_PDF.esc(client) + ',</div>'
    + '<div class="ctpdf-p">Thank you for trusting us with your referral. The case has been <b>successfully resolved</b> through our partnership with Community Tax.</div>'
    + (amount ? '<div class="ctpdf-callout"><div class="ctpdf-callout-title">Resolution Details</div><div class="ctpdf-callout-body"><b>' + CTAX_PDF.esc(caseType) + '</b><br>' + CTAX_PDF.esc(amount) + '</div></div>' : '')
    + '<div class="ctpdf-p">We appreciate your partnership and look forward to helping more of your clients find relief from their tax burdens.</div>'
    + '<div class="ctpdf-p" style="margin-top:24px">With gratitude,<br><b>' + CTAX_PDF.esc(firm) + '</b><br><span style="color:#64748b">In partnership with Community Tax</span></div>';
  page.appendChild(content);
  CTAX_PDF.addFooter(page);
  doc.appendChild(page);
  var filename = firm.trim().replace(/\s+/g, '-').toLowerCase() + '-thankyou-' + client.trim().replace(/\s+/g, '-').toLowerCase() + '.pdf';
  CTAX_PDF.renderPdf(doc, filename);
}


// -- NAVIGATION --
function mkBackToPortal() {
  showPage('portal');
  setTimeout(function() {
    var navItems = document.querySelectorAll('.portal-nav-item');
    for (var i = 0; i < navItems.length; i++) {
      if (navItems[i].textContent.indexOf('Marketing') !== -1) { navItems[i].click(); break; }
    }
  }, 600);
}

function mkGoToAdBuilder() {
  portalNav(document.querySelector('[onclick*="portal-sec-ai-admaker"]'), 'portal-sec-ai-admaker');
}


// -- INIT --
function mkInitBuilders() {
  mkInitDownloadCounts();
  mkRenderRecent();
}
// -- END MARKETING KIT --
