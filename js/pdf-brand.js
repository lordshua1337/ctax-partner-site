// -- CTAX PDF BRAND SYSTEM --
// Shared branding components for all PDF generation across the site.
// Uses html2pdf.js playbook: 816px container, 1056px cover, css-only pagebreaks.

var CTAX_PDF = (function() {
  var NAVY = '#0A1628';
  var BLUE = '#0B5FD8';
  var CYAN = '#00C8E0';
  var TEAL = '#0D9488';
  var SLATE = '#64748b';
  var BODY_COLOR = '#334155';
  var MIST = '#e2e8f0';
  var OFF = '#f8fafc';

  // Use the same logo data URLs from ad-maker
  var LOGO_WHITE = typeof CTAX_LOGO_WHITE !== 'undefined' ? CTAX_LOGO_WHITE : '';
  var LOGO_BLUE = typeof CTAX_LOGO_BLUE !== 'undefined' ? CTAX_LOGO_BLUE : '';

  var STYLE_TAG = null;

  function injectStyles() {
    if (STYLE_TAG) return;
    STYLE_TAG = document.createElement('style');
    STYLE_TAG.textContent = [
      '.ctpdf-doc { width:816px; margin:0; padding:0; display:block; font-family:"DM Sans",system-ui,sans-serif; line-height:1.6; color:' + BODY_COLOR + '; }',
      '.ctpdf-cover { width:100%; height:1056px; background:linear-gradient(135deg,' + NAVY + ' 0%,#112244 60%,#1a3160 100%); display:flex; align-items:center; justify-content:center; padding:0; margin:0; position:relative; overflow:hidden; }',
      '.ctpdf-cover-inner { text-align:center; padding:60px; position:relative; z-index:1; }',
      '.ctpdf-cover-logo { height:36px; width:auto; margin-bottom:40px; }',
      '.ctpdf-cover-eyebrow { font-size:13px; font-weight:700; letter-spacing:0.25em; text-transform:uppercase; color:' + CYAN + '; margin-bottom:20px; }',
      '.ctpdf-cover-title { font-family:"DM Serif Display",serif; font-size:42px; line-height:1.15; color:#fff; margin:0 0 16px; letter-spacing:-0.02em; }',
      '.ctpdf-cover-subtitle { font-size:16px; color:rgba(255,255,255,0.7); line-height:1.6; max-width:500px; margin:0 auto 40px; }',
      '.ctpdf-cover-line { width:60px; height:3px; background:linear-gradient(90deg,' + BLUE + ',' + CYAN + '); margin:0 auto 40px; border-radius:2px; }',
      '.ctpdf-cover-meta { display:flex; justify-content:center; gap:32px; margin-top:24px; }',
      '.ctpdf-cover-meta-item { text-align:center; }',
      '.ctpdf-cover-meta-label { font-size:10px; font-weight:700; letter-spacing:0.15em; text-transform:uppercase; color:rgba(255,255,255,0.4); margin-bottom:4px; }',
      '.ctpdf-cover-meta-val { font-size:14px; font-weight:600; color:rgba(255,255,255,0.85); }',
      '.ctpdf-cover-footer { position:absolute; bottom:40px; left:0; right:0; text-align:center; font-size:11px; color:rgba(255,255,255,0.3); }',
      '.ctpdf-cover-dots { position:absolute; top:0; left:0; right:0; bottom:0; opacity:0.04; background-image:radial-gradient(circle,#fff 1px,transparent 1px); background-size:24px 24px; }',

      '.ctpdf-page { padding:56px 48px 40px; box-sizing:border-box; width:100%; background:#fff; page-break-before:always; }',
      '.ctpdf-first { page-break-before:auto; }',

      '.ctpdf-header { display:flex; justify-content:space-between; align-items:center; padding-bottom:16px; margin-bottom:28px; border-bottom:2px solid ' + MIST + '; }',
      '.ctpdf-header-logo { height:20px; width:auto; }',
      '.ctpdf-header-title { font-size:10px; font-weight:700; letter-spacing:0.15em; text-transform:uppercase; color:' + SLATE + '; }',

      '.ctpdf-section-title { font-family:"DM Serif Display",serif; font-size:24px; color:' + NAVY + '; margin:0 0 20px; line-height:1.3; page-break-after:avoid; }',
      '.ctpdf-section-sub { font-size:13px; color:' + SLATE + '; margin:-12px 0 24px; line-height:1.5; }',

      '.ctpdf-p { font-size:13px; line-height:1.75; margin:0 0 14px; color:' + BODY_COLOR + '; }',
      '.ctpdf-p:last-child { margin-bottom:0; }',
      '.ctpdf-p b { color:' + NAVY + '; font-weight:600; }',

      '.ctpdf-card { background:' + OFF + '; border:1px solid ' + MIST + '; border-radius:8px; padding:18px 22px; margin-bottom:14px; page-break-inside:avoid; }',
      '.ctpdf-card-title { font-size:14px; font-weight:700; color:' + NAVY + '; margin-bottom:8px; }',
      '.ctpdf-card-body { font-size:13px; line-height:1.7; color:' + BODY_COLOR + '; }',

      '.ctpdf-item { display:flex; gap:14px; margin-bottom:14px; page-break-inside:avoid; }',
      '.ctpdf-item-num { flex-shrink:0; width:28px; height:28px; background:' + BLUE + '; color:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; margin-top:2px; }',
      '.ctpdf-item-body { flex:1; font-size:13px; line-height:1.7; }',
      '.ctpdf-item-body b { color:' + NAVY + '; font-weight:600; }',

      '.ctpdf-check-item { display:flex; gap:12px; margin-bottom:10px; page-break-inside:avoid; }',
      '.ctpdf-check-box { flex-shrink:0; width:18px; height:18px; border:2px solid ' + BLUE + '; border-radius:4px; margin-top:2px; }',
      '.ctpdf-check-text { flex:1; font-size:13px; line-height:1.6; }',

      '.ctpdf-table { width:100%; border-collapse:collapse; margin-bottom:20px; font-size:12px; }',
      '.ctpdf-table th { background:' + NAVY + '; color:#fff; padding:10px 14px; text-align:left; font-weight:600; font-size:11px; letter-spacing:0.05em; text-transform:uppercase; }',
      '.ctpdf-table td { padding:10px 14px; border-bottom:1px solid ' + MIST + '; line-height:1.5; }',
      '.ctpdf-table tr:nth-child(even) td { background:' + OFF + '; }',

      '.ctpdf-callout { background:rgba(11,95,216,0.04); border-left:3px solid ' + BLUE + '; padding:16px 20px; margin:20px 0; border-radius:0 8px 8px 0; page-break-inside:avoid; }',
      '.ctpdf-callout-title { font-size:12px; font-weight:700; color:' + BLUE + '; text-transform:uppercase; letter-spacing:0.1em; margin-bottom:6px; }',
      '.ctpdf-callout-body { font-size:13px; line-height:1.7; color:' + BODY_COLOR + '; }',

      '.ctpdf-timeline { position:relative; padding-left:36px; margin:20px 0; }',
      '.ctpdf-timeline::before { content:""; position:absolute; left:13px; top:0; bottom:0; width:2px; background:' + MIST + '; }',
      '.ctpdf-tl-item { position:relative; margin-bottom:20px; page-break-inside:avoid; }',
      '.ctpdf-tl-dot { position:absolute; left:-36px; top:4px; width:12px; height:12px; border-radius:50%; border:3px solid ' + BLUE + '; background:#fff; z-index:1; }',
      '.ctpdf-tl-title { font-size:14px; font-weight:700; color:' + NAVY + '; margin-bottom:4px; }',
      '.ctpdf-tl-body { font-size:13px; line-height:1.7; color:' + BODY_COLOR + '; }',

      '.ctpdf-cols { display:flex; gap:24px; }',
      '.ctpdf-col { flex:1; }',

      '.ctpdf-divider { height:1px; background:' + MIST + '; margin:28px 0; }',

      '.ctpdf-footer { margin-top:auto; padding-top:20px; border-top:1px solid ' + MIST + '; text-align:center; font-size:10px; color:' + SLATE + '; }',

      '.ctpdf-badge { display:inline-block; padding:3px 10px; border-radius:4px; font-size:10px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; }',
      '.ctpdf-badge-blue { background:rgba(11,95,216,0.1); color:' + BLUE + '; }',
      '.ctpdf-badge-teal { background:rgba(13,148,136,0.1); color:' + TEAL + '; }',

      'h1, h2, h3 { page-break-after: avoid; }',
    ].join('\n');
    document.head.appendChild(STYLE_TAG);
  }

  function createDoc() {
    injectStyles();
    var doc = document.createElement('div');
    doc.className = 'ctpdf-doc';
    return doc;
  }

  function createCover(title, subtitle, metaItems) {
    var cover = document.createElement('div');
    cover.className = 'ctpdf-cover';
    var logoSrc = LOGO_WHITE || '';
    var today = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    var metaHtml = '';
    if (metaItems && metaItems.length) {
      metaHtml = '<div class="ctpdf-cover-meta">';
      metaItems.forEach(function(m) {
        metaHtml += '<div class="ctpdf-cover-meta-item"><div class="ctpdf-cover-meta-label">' + m.label + '</div><div class="ctpdf-cover-meta-val">' + m.value + '</div></div>';
      });
      metaHtml += '</div>';
    }
    cover.innerHTML =
      '<div class="ctpdf-cover-dots"></div>' +
      '<div class="ctpdf-cover-inner">' +
        (logoSrc ? '<img src="' + logoSrc + '" class="ctpdf-cover-logo" alt="Community Tax">' : '') +
        '<div class="ctpdf-cover-eyebrow">PARTNER RESOURCE</div>' +
        '<div class="ctpdf-cover-line"></div>' +
        '<h1 class="ctpdf-cover-title">' + esc(title) + '</h1>' +
        (subtitle ? '<p class="ctpdf-cover-subtitle">' + esc(subtitle) + '</p>' : '') +
        metaHtml +
        '<div class="ctpdf-cover-footer">Community Tax Partner Program &middot; partners.communitytax.com &middot; ' + today + '</div>' +
      '</div>';
    return cover;
  }

  function createPage(isFirst) {
    var page = document.createElement('div');
    page.className = 'ctpdf-page' + (isFirst ? ' ctpdf-first' : '');
    return page;
  }

  function addHeader(page, docTitle) {
    var logoSrc = LOGO_BLUE || '';
    var hdr = document.createElement('div');
    hdr.className = 'ctpdf-header';
    hdr.innerHTML =
      (logoSrc ? '<img src="' + logoSrc + '" class="ctpdf-header-logo" alt="Community Tax">' : '<span></span>') +
      '<div class="ctpdf-header-title">' + esc(docTitle) + '</div>';
    page.appendChild(hdr);
    return page;
  }

  function addFooter(page) {
    var f = document.createElement('div');
    f.className = 'ctpdf-footer';
    f.textContent = 'Community Tax Partner Program | partners@communitytax.com | 1-855-332-2873';
    page.appendChild(f);
    return page;
  }

  function renderPdf(doc, filename) {
    // Create a full-viewport overlay so html2canvas captures cleanly
    var overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:999999;background:#fff;overflow:auto;margin:0;padding:0;';
    overlay.appendChild(doc);
    document.body.appendChild(overlay);

    // Force the doc to block display at a known position
    doc.style.position = 'relative';
    doc.style.display = 'block';
    doc.style.margin = '0 auto';

    var opt = {
      margin: 0,
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        scrollX: 0,
        scrollY: 0,
        windowWidth: 816,
        backgroundColor: '#ffffff'
      },
      jsPDF: { unit: 'mm', format: 'letter', orientation: 'portrait' },
      pagebreak: { mode: ['css'] }
    };

    // Wait for styles/fonts/images to compute before capturing
    return new Promise(function(resolve) {
      requestAnimationFrame(function() {
        setTimeout(resolve, 200);
      });
    }).then(function() {
      return html2pdf().set(opt).from(doc).save();
    }).then(function() {
      if (overlay.parentNode) document.body.removeChild(overlay);
    }).catch(function(err) {
      console.error('PDF error:', err);
      if (overlay.parentNode) document.body.removeChild(overlay);
    });
  }

  function esc(t) {
    if (!t) return '';
    return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // General-purpose PDF export for any DOM element.
  // Used by tools that build their own HTML (ai-campaign, ai-writer, etc.)
  // instead of using the CTAX_PDF brand system.
  function exportElement(el, filename, extraOpts) {
    if (typeof html2pdf === 'undefined') {
      // Fallback: open in new window for printing
      var win = window.open('', '_blank');
      if (win) {
        win.document.write('<!DOCTYPE html><html><head><meta charset="UTF-8"><title>' + esc(filename) + '</title></head><body>' + el.outerHTML + '</body></html>');
        win.document.close();
        win.print();
      }
      return Promise.resolve();
    }

    var overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:999999;background:#fff;overflow:auto;margin:0;padding:0;';
    overlay.appendChild(el);
    document.body.appendChild(overlay);

    el.style.position = 'relative';
    el.style.display = 'block';

    var opt = {
      margin: extraOpts && extraOpts.margin != null ? extraOpts.margin : 0.5,
      filename: filename,
      image: { type: 'jpeg', quality: 0.95 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        scrollX: 0,
        scrollY: 0,
        backgroundColor: '#ffffff'
      },
      jsPDF: {
        unit: extraOpts && extraOpts.unit || 'in',
        format: extraOpts && extraOpts.format || 'letter',
        orientation: 'portrait'
      },
      pagebreak: { mode: ['css'] }
    };

    return new Promise(function(resolve) {
      requestAnimationFrame(function() {
        setTimeout(resolve, 200);
      });
    }).then(function() {
      return html2pdf().set(opt).from(el).save();
    }).then(function() {
      if (overlay.parentNode) document.body.removeChild(overlay);
    }).catch(function(err) {
      console.error('PDF export error:', err);
      if (overlay.parentNode) document.body.removeChild(overlay);
    });
  }

  return {
    createDoc: createDoc,
    createCover: createCover,
    createPage: createPage,
    addHeader: addHeader,
    addFooter: addFooter,
    renderPdf: renderPdf,
    exportElement: exportElement,
    esc: esc,
    NAVY: NAVY,
    BLUE: BLUE,
    CYAN: CYAN,
    TEAL: TEAL,
    SLATE: SLATE
  };
})();
