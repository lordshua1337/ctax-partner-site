// ── MARKETING KIT ──────────────────────────────────────────
// Downloads, email builder, social builder, one-pager builder

// ── ASSET CONFIG ──
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

  // Update download count in localStorage
  var key = 'mk_dl_' + assetId;
  var count = parseInt(localStorage.getItem(key) || '0', 10) + 1;
  localStorage.setItem(key, count);
  mkUpdateDownloadCount(assetId);

  if (typeof showToast === 'function') {
    showToast(asset.label + ' downloaded', 'success');
  }
}

function mkUpdateDownloadCount(assetId) {
  var el = document.getElementById('mk-dl-count-' + assetId);
  if (!el) return;
  var count = parseInt(localStorage.getItem('mk_dl_' + assetId) || '0', 10);
  el.textContent = count > 0 ? count + ' downloads' : '';
  el.style.display = count > 0 ? '' : 'none';
}

function mkInitDownloadCounts() {
  Object.keys(MK_ASSETS).forEach(function(id) {
    mkUpdateDownloadCount(id);
  });
}


// ── EMAIL BUILDER ──────────────────────────────────────────
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
  var panel = document.getElementById('mk-email-builder');
  if (panel) panel.style.display = 'block';
  mkUpdateEmailPreview();
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
  if (frame) {
    frame.srcdoc = html;
  }
}

function mkExportEmail() {
  var firm = (document.getElementById('mk-email-firm') || {}).value || '';
  if (!firm.trim()) {
    if (typeof showToast === 'function') showToast('Please enter your firm name first', 'warning');
    return;
  }

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

  if (typeof showToast === 'function') showToast('Email template exported', 'success');
}


// ── SOCIAL POST BUILDER ────────────────────────────────────
var mkSocialTpl = 1;
var mkSocialW = 1200;
var mkSocialH = 628;
var mkSocialLogoUrl = null;

function mkShowSocialBuilder() {
  var panel = document.getElementById('mk-social-builder');
  if (panel) panel.style.display = 'block';
  mkUpdateSocialPreview();
}

function mkHideSocialBuilder() {
  var panel = document.getElementById('mk-social-builder');
  if (panel) panel.style.display = 'none';
}

function mkSelectSocialTpl(el, n) {
  mkSocialTpl = n;
  document.querySelectorAll('.mk-social-tpl-opt').forEach(function(o) { o.classList.remove('mk-tpl-selected'); });
  if (el) el.classList.add('mk-tpl-selected');
  mkUpdateSocialPreview();
}

function mkSelectSocialSize(el, ratio, w, h) {
  mkSocialW = w;
  mkSocialH = h;
  document.querySelectorAll('.mk-social-size-btn').forEach(function(b) { b.classList.remove('mk-size-active'); });
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

  var html = buildStaticCard(
    firm || 'Your Firm',
    'Facebook',
    color,
    tagline,
    mkSocialLogoUrl,
    mkSocialTpl,
    { w: mkSocialW, h: mkSocialH }
  );

  var canvas = document.getElementById('mk-social-canvas');
  if (!canvas) return;

  // Scale to fit in preview area (max 400px wide)
  var maxW = 400;
  var scale = Math.min(maxW / mkSocialW, 1);
  var dispW = Math.round(mkSocialW * scale);
  var dispH = Math.round(mkSocialH * scale);

  canvas.style.width = dispW + 'px';
  canvas.style.height = dispH + 'px';
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
  if (!firm.trim()) {
    if (typeof showToast === 'function') showToast('Please enter your firm name first', 'warning');
    return;
  }

  // Create a full-res off-screen container for html2canvas
  var offscreen = document.createElement('div');
  offscreen.style.cssText = 'position:fixed;left:-9999px;top:0;width:' + mkSocialW + 'px;height:' + mkSocialH + 'px;overflow:hidden;z-index:-1';

  var color = (document.getElementById('mk-social-color') || {}).value || '#0B5FD8';
  var tagline = (document.getElementById('mk-social-tagline') || {}).value || '';

  offscreen.innerHTML = buildStaticCard(
    firm, 'Facebook', color, tagline, mkSocialLogoUrl, mkSocialTpl,
    { w: mkSocialW, h: mkSocialH }
  );
  document.body.appendChild(offscreen);

  html2canvas(offscreen, { scale: 2, useCORS: true, allowTaint: true, backgroundColor: null })
    .then(function(cv) {
      var a = document.createElement('a');
      a.href = cv.toDataURL('image/png');
      a.download = firm.trim().replace(/\s+/g, '-').toLowerCase() + '-ctax-' + mkSocialW + 'x' + mkSocialH + '.png';
      a.click();
      document.body.removeChild(offscreen);
      if (typeof showToast === 'function') showToast('Social post downloaded', 'success');
    })
    .catch(function() {
      document.body.removeChild(offscreen);
      if (typeof showToast === 'function') showToast('Download failed. Please try again.', 'error');
    });
}


// ── ONE-PAGER BUILDER ──────────────────────────────────────
var mkOnePagerLogoUrl = null;

function mkShowOnePagerBuilder() {
  var panel = document.getElementById('mk-onepager-builder');
  if (panel) panel.style.display = 'block';
  mkUpdateOnePagerPreview();
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
    // Header
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

    // Main Content
    + '<div style="flex:1;padding:36px 48px;display:flex;flex-direction:column;gap:28px">'

      // Intro
      + '<div style="font-size:14px;color:#3d4f5f;line-height:1.65">Partner with Community Tax to offer your clients professional IRS tax resolution services. We handle the heavy lifting while you earn revenue share on every referral. Your clients stay yours -- we work behind the scenes.</div>'

      // Stats Row
      + '<div style="display:flex;gap:16px">'
        + '<div style="flex:1;background:#f8fafc;border:1px solid #e8ecf0;border-radius:10px;padding:18px;text-align:center"><div style="font-family:DM Serif Display,Georgia,serif;font-size:24px;color:#0B5FD8">$2.3B+</div><div style="font-size:11px;color:#6b7c8e;margin-top:4px">Tax Debt Resolved</div></div>'
        + '<div style="flex:1;background:#f8fafc;border:1px solid #e8ecf0;border-radius:10px;padding:18px;text-align:center"><div style="font-family:DM Serif Display,Georgia,serif;font-size:24px;color:#0B5FD8">120K+</div><div style="font-size:11px;color:#6b7c8e;margin-top:4px">Clients Helped</div></div>'
        + '<div style="flex:1;background:#f8fafc;border:1px solid #e8ecf0;border-radius:10px;padding:18px;text-align:center"><div style="font-family:DM Serif Display,Georgia,serif;font-size:24px;color:#0B5FD8">~80%</div><div style="font-size:11px;color:#6b7c8e;margin-top:4px">Conversion Rate</div></div>'
        + '<div style="flex:1;background:#f8fafc;border:1px solid #e8ecf0;border-radius:10px;padding:18px;text-align:center"><div style="font-family:DM Serif Display,Georgia,serif;font-size:24px;color:#0B5FD8">15 yrs</div><div style="font-size:11px;color:#6b7c8e;margin-top:4px">Experience</div></div>'
      + '</div>'

      // Two Column - How It Works + Services
      + '<div style="display:flex;gap:28px">'
        // Left - How It Works
        + '<div style="flex:1">'
          + '<div style="font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#0B5FD8;margin-bottom:14px">How It Works</div>'
          + '<div style="display:flex;flex-direction:column;gap:12px">'
            + '<div style="display:flex;gap:12px;align-items:flex-start"><div style="width:24px;height:24px;border-radius:50%;background:linear-gradient(135deg,#0B5FD8,#00C8E0);color:#fff;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0">1</div><div><div style="font-size:13px;font-weight:600;color:#0A1628">Identify</div><div style="font-size:12px;color:#6b7c8e;line-height:1.5">Spot clients with $7K+ in IRS debt</div></div></div>'
            + '<div style="display:flex;gap:12px;align-items:flex-start"><div style="width:24px;height:24px;border-radius:50%;background:linear-gradient(135deg,#0B5FD8,#00C8E0);color:#fff;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0">2</div><div><div style="font-size:13px;font-weight:600;color:#0A1628">Refer</div><div style="font-size:12px;color:#6b7c8e;line-height:1.5">Submit a secure referral to Community Tax</div></div></div>'
            + '<div style="display:flex;gap:12px;align-items:flex-start"><div style="width:24px;height:24px;border-radius:50%;background:linear-gradient(135deg,#0B5FD8,#00C8E0);color:#fff;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0">3</div><div><div style="font-size:13px;font-weight:600;color:#0A1628">We Resolve</div><div style="font-size:12px;color:#6b7c8e;line-height:1.5">Our team handles all IRS negotiations</div></div></div>'
            + '<div style="display:flex;gap:12px;align-items:flex-start"><div style="width:24px;height:24px;border-radius:50%;background:linear-gradient(135deg,#0B5FD8,#00C8E0);color:#fff;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0">4</div><div><div style="font-size:13px;font-weight:600;color:#0A1628">You Earn</div><div style="font-size:12px;color:#6b7c8e;line-height:1.5">Receive revenue share on every closed case</div></div></div>'
          + '</div>'
        + '</div>'
        // Right - Services
        + '<div style="flex:1">'
          + '<div style="font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#0B5FD8;margin-bottom:14px">Services We Handle</div>'
          + '<div style="display:flex;flex-direction:column;gap:8px">'
            + '<div style="font-size:13px;color:#3d4f5f;padding:8px 0;border-bottom:1px solid #f0f0f0">&#10003; Offer in Compromise</div>'
            + '<div style="font-size:13px;color:#3d4f5f;padding:8px 0;border-bottom:1px solid #f0f0f0">&#10003; Installment Agreements</div>'
            + '<div style="font-size:13px;color:#3d4f5f;padding:8px 0;border-bottom:1px solid #f0f0f0">&#10003; Penalty Abatement</div>'
            + '<div style="font-size:13px;color:#3d4f5f;padding:8px 0;border-bottom:1px solid #f0f0f0">&#10003; Wage Garnishment Relief</div>'
            + '<div style="font-size:13px;color:#3d4f5f;padding:8px 0;border-bottom:1px solid #f0f0f0">&#10003; Tax Lien Resolution</div>'
            + '<div style="font-size:13px;color:#3d4f5f;padding:8px 0">&#10003; Unfiled Return Filing</div>'
          + '</div>'
        + '</div>'
      + '</div>'

      // CTA
      + '<div style="background:linear-gradient(135deg,#0A1628,#112244);border-radius:12px;padding:24px 32px;display:flex;align-items:center;justify-content:space-between">'
        + '<div><div style="font-family:DM Serif Display,Georgia,serif;font-size:20px;color:#fff">Ready to start referring?</div><div style="font-size:13px;color:rgba(255,255,255,0.65);margin-top:4px">Contact ' + (firm || 'us') + ' or visit communitytax.com/partners</div></div>'
        + '<div style="background:linear-gradient(135deg,#0B5FD8,#00C8E0);color:#fff;font-size:14px;font-weight:700;padding:12px 28px;border-radius:8px;white-space:nowrap">Get Started</div>'
      + '</div>'

    + '</div>'

    // Footer
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

  // Scale 816x1056 to fit in preview (max ~320px wide)
  var scale = 320 / 816;
  preview.style.width = '320px';
  preview.style.height = Math.round(1056 * scale) + 'px';
  preview.style.overflow = 'hidden';
  preview.innerHTML = '<div style="transform:scale(' + scale + ');transform-origin:top left;width:816px;height:1056px">' + html + '</div>';
}

function mkDownloadOnePager() {
  var firm = (document.getElementById('mk-op-firm') || {}).value || '';
  if (!firm.trim()) {
    if (typeof showToast === 'function') showToast('Please enter your firm name first', 'warning');
    return;
  }

  var phone = (document.getElementById('mk-op-phone') || {}).value || '';
  var email = (document.getElementById('mk-op-email') || {}).value || '';
  var website = (document.getElementById('mk-op-website') || {}).value || '';
  var tagline = (document.getElementById('mk-op-tagline') || {}).value || '';

  // Create off-screen full-res element
  var offscreen = document.createElement('div');
  offscreen.style.cssText = 'position:fixed;left:-9999px;top:0;width:816px;height:1056px;overflow:hidden;z-index:-1';
  offscreen.innerHTML = mkBuildOnePager(firm, phone, email, website, tagline, mkOnePagerLogoUrl);
  document.body.appendChild(offscreen);

  html2canvas(offscreen, { scale: 2, useCORS: true, allowTaint: true, backgroundColor: null })
    .then(function(cv) {
      var a = document.createElement('a');
      a.href = cv.toDataURL('image/png');
      a.download = firm.trim().replace(/\s+/g, '-').toLowerCase() + '-partner-one-pager.png';
      a.click();
      document.body.removeChild(offscreen);
      if (typeof showToast === 'function') showToast('One-pager downloaded', 'success');
    })
    .catch(function() {
      document.body.removeChild(offscreen);
      if (typeof showToast === 'function') showToast('Download failed. Please try again.', 'error');
    });
}


// ── NAVIGATION ───────────────────────────────────────────────
// Navigate back to the portal Marketing Kit section
function mkBackToPortal() {
  showPage('portal');
  // portalNav needs the nav element — find and click the Marketing Kit nav item
  // Use a longer delay to ensure portal content is loaded and rendered
  setTimeout(function() {
    var navItems = document.querySelectorAll('.portal-nav-item');
    for (var i = 0; i < navItems.length; i++) {
      if (navItems[i].textContent.indexOf('Marketing') !== -1) {
        navItems[i].click();
        break;
      }
    }
  }, 600);
}

// Navigate from portal to Ad Builder page
function mkGoToAdBuilder() {
  showPage('admaker');
}


// ── INIT ────────────────────────────────────────────────────
function mkInitBuilders() {
  mkInitDownloadCounts();
}
// ── END MARKETING KIT ──────────────────────────────────────
