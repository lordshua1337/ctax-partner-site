// Authority Builder -- Template gallery from Partner Portal Templates
// Users browse real templates, preview in full-screen iframe, and publish to their portal
(function () {
  'use strict';

  var BASE_URL = 'https://partner-portal-templates.vercel.app';

  // All available templates from the Partner Portal Templates project
  var AB_TEMPLATES = [
    // Educational Authority Pages (Tax Resolution Guides)
    {
      id: 'edu-irs-wage-garnishment',
      name: 'IRS Wage Garnishment',
      category: 'educational',
      desc: 'Help clients understand wage garnishment options and resolution paths.',
      tags: ['4 resolution options', '5 FAQs', '7 glossary terms'],
      url: BASE_URL + '/tax-resolution/irs-wage-garnishment',
    },
    {
      id: 'edu-irs-bank-levy',
      name: 'IRS Bank Levy',
      category: 'educational',
      desc: 'Explain bank levy timelines and how to act within the 21-day window.',
      tags: ['4 resolution options', '5 FAQs', '6 glossary terms'],
      url: BASE_URL + '/tax-resolution/irs-bank-levy',
    },
    {
      id: 'edu-federal-tax-lien',
      name: 'Federal Tax Lien',
      category: 'educational',
      desc: 'Break down how tax liens affect credit and property, plus removal options.',
      tags: ['4 resolution options', '5 FAQs', '7 glossary terms'],
      url: BASE_URL + '/tax-resolution/tax-lien',
    },
    {
      id: 'edu-offer-in-compromise',
      name: 'Offer in Compromise',
      category: 'educational',
      desc: 'Guide clients through the IRS settlement process and qualification criteria.',
      tags: ['4 resolution options', '5 FAQs', '6 glossary terms'],
      url: BASE_URL + '/tax-resolution/offer-in-compromise',
    },
    {
      id: 'edu-installment-agreement',
      name: 'Installment Agreement',
      category: 'educational',
      desc: 'Explain IRS payment plan types, eligibility, and application process.',
      tags: ['4 resolution options', '5 FAQs', '6 glossary terms'],
      url: BASE_URL + '/tax-resolution/installment-agreement',
    },
    {
      id: 'edu-penalty-abatement',
      name: 'Penalty Abatement',
      category: 'educational',
      desc: 'Show clients how to get IRS penalties reduced or removed entirely.',
      tags: ['4 resolution options', '5 FAQs', '6 glossary terms'],
      url: BASE_URL + '/tax-resolution/penalty-abatement',
    },
    {
      id: 'edu-unfiled-tax-returns',
      name: 'Unfiled Tax Returns',
      category: 'educational',
      desc: 'Help clients resolve years of unfiled returns and avoid further penalties.',
      tags: ['4 resolution options', '5 FAQs', '6 glossary terms'],
      url: BASE_URL + '/tax-resolution/unfiled-tax-returns',
    },
    {
      id: 'edu-irs-audit-representation',
      name: 'IRS Audit Representation',
      category: 'educational',
      desc: 'Prepare clients for IRS audits and explain professional representation.',
      tags: ['4 resolution options', '5 FAQs', '6 glossary terms'],
      url: BASE_URL + '/tax-resolution/irs-audit-representation',
    },
    {
      id: 'edu-innocent-spouse-relief',
      name: 'Innocent Spouse Relief',
      category: 'educational',
      desc: 'Explain relief options when a spouse\'s tax issues affect the other.',
      tags: ['4 resolution options', '5 FAQs', '6 glossary terms'],
      url: BASE_URL + '/tax-resolution/innocent-spouse-relief',
    },
    {
      id: 'edu-currently-not-collectible',
      name: 'Currently Not Collectible',
      category: 'educational',
      desc: 'Show clients how to pause IRS collection when they can\'t afford to pay.',
      tags: ['4 resolution options', '5 FAQs', '6 glossary terms'],
      url: BASE_URL + '/tax-resolution/currently-not-collectible',
    },

    // Conversion Templates
    {
      id: 'tpl-lead-gen',
      name: 'Lead Generation',
      category: 'conversion',
      desc: 'High-converting lead capture page with trust signals and urgency.',
      tags: ['hero', 'stats', 'form', 'testimonials'],
      url: BASE_URL + '/templates/lead-gen',
    },
    {
      id: 'tpl-saas',
      name: 'SaaS Product',
      category: 'conversion',
      desc: 'Modern SaaS product landing page with pricing tiers and feature grid.',
      tags: ['pricing', 'features', 'FAQ', 'CTA'],
      url: BASE_URL + '/templates/saas',
    },
    {
      id: 'tpl-b2b',
      name: 'Professional Services',
      category: 'conversion',
      desc: 'B2B professional services page with authority positioning.',
      tags: ['trust bar', 'process', 'testimonials'],
      url: BASE_URL + '/templates/b2b',
    },
    {
      id: 'tpl-event',
      name: 'Event / Launch',
      category: 'conversion',
      desc: 'Event registration and product launch countdown page.',
      tags: ['countdown', 'speakers', 'registration'],
      url: BASE_URL + '/templates/event',
    },
    {
      id: 'tpl-ecommerce',
      name: 'E-Commerce',
      category: 'conversion',
      desc: 'Product showcase with pricing, gallery, and purchase CTA.',
      tags: ['gallery', 'pricing', 'reviews', 'cart'],
      url: BASE_URL + '/templates/ecommerce',
    },
    {
      id: 'tpl-attorney',
      name: 'Attorney / Legal',
      category: 'conversion',
      desc: 'Legal services page with case results and consultation booking.',
      tags: ['practice areas', 'results', 'consultation'],
      url: BASE_URL + '/templates/attorney',
    },
    {
      id: 'tpl-financial-advisor',
      name: 'Financial Advisor',
      category: 'conversion',
      desc: 'Wealth management page with trust signals and consultation CTA.',
      tags: ['services', 'credentials', 'booking'],
      url: BASE_URL + '/templates/financial-advisor',
    },
    {
      id: 'tpl-cpa',
      name: 'CPA / Accounting',
      category: 'conversion',
      desc: 'Accounting firm page with service tiers and client testimonials.',
      tags: ['services', 'pricing', 'testimonials'],
      url: BASE_URL + '/templates/cpa',
    },
    {
      id: 'tpl-bookkeeper',
      name: 'Bookkeeper',
      category: 'conversion',
      desc: 'Bookkeeping services page with pricing and process breakdown.',
      tags: ['packages', 'process', 'FAQ'],
      url: BASE_URL + '/templates/bookkeeper',
    },
    {
      id: 'tpl-consultant',
      name: 'Consultant / Strategy',
      category: 'conversion',
      desc: 'Consulting services page with methodology and results showcase.',
      tags: ['methodology', 'case studies', 'booking'],
      url: BASE_URL + '/templates/consultant',
    },
    {
      id: 'tpl-workflow',
      name: 'Workflow / SaaS Tool',
      category: 'conversion',
      desc: 'Workflow automation tool page with feature comparison and demo CTA.',
      tags: ['features', 'comparison', 'demo'],
      url: BASE_URL + '/templates/workflow',
    },
  ];

  var activeFilter = 'all';
  var previewingTemplate = null;

  // ── Brand query params helper ──
  // Reads ctax_partner_brand from localStorage and builds a query string
  function getBrandQueryString() {
    var brand = (typeof PartnerBrand !== 'undefined' && PartnerBrand.load) ? PartnerBrand.load() : null;
    if (!brand || !brand.firmName) return '';

    var params = [];
    if (brand.firmName) params.push('brand=' + encodeURIComponent(brand.firmName));
    if (brand.phone) params.push('phone=' + encodeURIComponent(brand.phone));
    if (brand.email) params.push('email=' + encodeURIComponent(brand.email));
    if (brand.website) params.push('website=' + encodeURIComponent(brand.website));

    return params.length ? '?' + params.join('&') : '';
  }

  // Build a branded URL for a template
  function brandedUrl(baseUrl) {
    return baseUrl + getBrandQueryString();
  }

  // ── Demo Mode -- fills brand data with mock profile ──
  window.abLoadDemoProfile = function () {
    if (typeof PartnerBrand === 'undefined') return;

    PartnerBrand.save({
      firmName: 'Meridian Tax Partners',
      phone: '(312) 555-0199',
      email: 'info@meridiantax.com',
      website: 'meridiantax.com',
      tagline: 'Resolution starts here.',
      brandColor: '#1E3A5F',
    });

    // Update the brand preview in the sidebar
    var preview = document.getElementById('portal-brand-preview');
    var text = document.getElementById('portal-brand-text');
    if (text) text.textContent = 'Meridian Tax Partners';
    if (preview) {
      preview.style.background = '#1E3A5F';
      preview.innerHTML = '<span style="color:#fff;font-weight:700;font-size:14px">MTP</span>';
    }

    // Toggle demo buttons
    var clearBtn = document.getElementById('ab-demo-clear');
    if (clearBtn) clearBtn.style.display = '';

    abShowToast('Demo profile loaded: Meridian Tax Partners');
    abRenderGallery();
  };

  window.abClearDemoProfile = function () {
    if (typeof PartnerBrand === 'undefined') return;
    PartnerBrand.clear();

    var preview = document.getElementById('portal-brand-preview');
    var text = document.getElementById('portal-brand-text');
    if (text) text.textContent = 'Upload your logo';
    if (preview) {
      preview.style.background = '';
      preview.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>';
    }

    var clearBtn = document.getElementById('ab-demo-clear');
    if (clearBtn) clearBtn.style.display = 'none';

    abShowToast('Demo profile cleared');
    abRenderGallery();
  };

  // ── Render the template gallery ──
  window.abRenderGallery = function () {
    var grid = document.getElementById('ab-grid');
    if (!grid) return;

    var filtered = activeFilter === 'all'
      ? AB_TEMPLATES
      : AB_TEMPLATES.filter(function (t) { return t.category === activeFilter; });

    if (filtered.length === 0) {
      grid.innerHTML = '<p class="ab-empty">No templates in this category.</p>';
      return;
    }

    // Check if brand profile exists for the badge
    var hasBrand = (typeof PartnerBrand !== 'undefined' && PartnerBrand.hasProfile && PartnerBrand.hasProfile());

    grid.innerHTML = filtered.map(function (t) {
      return '<div class="ab-card" data-id="' + t.id + '">' +
        '<div class="ab-card-preview">' +
          '<iframe src="' + brandedUrl(t.url) + '" loading="lazy" sandbox="allow-scripts allow-same-origin" tabindex="-1"></iframe>' +
          '<div class="ab-card-overlay">' +
            '<button class="ab-btn ab-btn-preview" onclick="abPreview(\'' + t.id + '\')">Preview</button>' +
            '<button class="ab-btn ab-btn-publish" onclick="abOpenPublish(\'' + t.id + '\')">Publish</button>' +
          '</div>' +
        '</div>' +
        '<div class="ab-card-body">' +
          '<div class="ab-card-cat">' + (t.category === 'educational' ? 'Educational' : 'Conversion') + '</div>' +
          '<h3 class="ab-card-title">' + t.name + '</h3>' +
          '<p class="ab-card-desc">' + t.desc + '</p>' +
          '<div class="ab-card-tags">' +
            t.tags.map(function (tag) { return '<span class="ab-tag">' + tag + '</span>'; }).join('') +
            (hasBrand ? '<span class="ab-tag ab-tag-branded">Branded</span>' : '') +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('');
  };

  // ── Filter buttons ──
  window.abFilter = function (cat, btn) {
    activeFilter = cat;
    var btns = document.querySelectorAll('.ab-filter-btn');
    btns.forEach(function (b) { b.classList.remove('ab-filter-active'); });
    if (btn) btn.classList.add('ab-filter-active');
    abRenderGallery();
  };

  // ── Full-screen preview ──
  window.abPreview = function (id) {
    var t = AB_TEMPLATES.find(function (tpl) { return tpl.id === id; });
    if (!t) return;
    previewingTemplate = t;

    var modal = document.getElementById('ab-preview-modal');
    if (!modal) return;

    modal.innerHTML =
      '<div class="ab-preview-bar">' +
        '<button class="ab-preview-back" onclick="abClosePreview()">' +
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>' +
          ' Back to Templates' +
        '</button>' +
        '<span class="ab-preview-name">' + t.name + '</span>' +
        '<div class="ab-preview-actions">' +
          '<button class="ab-btn ab-btn-publish" onclick="abOpenPublish(\'' + t.id + '\')">Publish This Page</button>' +
        '</div>' +
      '</div>' +
      '<iframe class="ab-preview-iframe" src="' + brandedUrl(t.url) + '" sandbox="allow-scripts allow-same-origin"></iframe>';

    modal.classList.add('ab-preview-open');
    document.body.style.overflow = 'hidden';
  };

  window.abClosePreview = function () {
    var modal = document.getElementById('ab-preview-modal');
    if (modal) {
      modal.classList.remove('ab-preview-open');
      modal.innerHTML = '';
    }
    document.body.style.overflow = '';
    previewingTemplate = null;
  };

  // ── Publish modal ──
  window.abOpenPublish = function (id) {
    var t = AB_TEMPLATES.find(function (tpl) { return tpl.id === id; });
    if (!t) return;

    abClosePreview();

    var modal = document.getElementById('ab-publish-modal');
    if (!modal) return;

    var defaultSlug = t.id.replace(/^(edu|tpl)-/, '');

    // Pre-fill from brand data
    var brand = (typeof PartnerBrand !== 'undefined' && PartnerBrand.load) ? PartnerBrand.load() : {};
    var hasBrand = !!(brand.firmName);

    modal.innerHTML =
      '<div class="ab-publish-backdrop" onclick="abClosePublish()"></div>' +
      '<div class="ab-publish-dialog">' +
        '<button class="ab-publish-close" onclick="abClosePublish()">&times;</button>' +
        '<h3 class="ab-publish-title">Publish: ' + t.name + '</h3>' +
        '<p class="ab-publish-desc">This page will be available at <code>#lp/your-slug</code> within the portal.</p>' +
        '<div class="ab-publish-field">' +
          '<label>Page Title</label>' +
          '<input type="text" id="ab-pub-title" value="' + t.name + '" placeholder="Page title">' +
        '</div>' +
        '<div class="ab-publish-field">' +
          '<label>URL Slug</label>' +
          '<div class="ab-slug-wrap">' +
            '<span class="ab-slug-prefix">#lp/</span>' +
            '<input type="text" id="ab-pub-slug" value="' + defaultSlug + '" placeholder="my-page">' +
          '</div>' +
        '</div>' +
        (hasBrand
          ? '<div class="ab-brand-preview">' +
              '<div class="ab-brand-preview-label">Your branding will appear in the footer:</div>' +
              '<div class="ab-brand-preview-info">' +
                '<strong>' + brand.firmName + '</strong>' +
                (brand.phone ? ' &middot; ' + brand.phone : '') +
                (brand.email ? ' &middot; ' + brand.email : '') +
              '</div>' +
            '</div>'
          : '<div class="ab-brand-preview ab-brand-preview-empty">' +
              '<div class="ab-brand-preview-label">No brand profile set. Pages will publish without branding.</div>' +
              '<button class="ab-btn ab-btn-demo" onclick="abLoadDemoProfile();abClosePublish();setTimeout(function(){abOpenPublish(\'' + t.id + '\')},300)">Load Demo Profile</button>' +
            '</div>'
        ) +
        '<div class="ab-publish-actions">' +
          '<button class="ab-btn ab-btn-cancel" onclick="abClosePublish()">Cancel</button>' +
          '<button class="ab-btn ab-btn-publish" onclick="abDoPublish(\'' + t.id + '\')">Publish Page</button>' +
        '</div>' +
      '</div>';

    modal.classList.add('ab-publish-open');
  };

  window.abClosePublish = function () {
    var modal = document.getElementById('ab-publish-modal');
    if (modal) {
      modal.classList.remove('ab-publish-open');
      setTimeout(function () { modal.innerHTML = ''; }, 200);
    }
  };

  // ── Actually publish -- saves to ctax_pb_pages with brand params baked into URL ──
  window.abDoPublish = function (id) {
    var t = AB_TEMPLATES.find(function (tpl) { return tpl.id === id; });
    if (!t) return;

    var titleInput = document.getElementById('ab-pub-title');
    var slugInput = document.getElementById('ab-pub-slug');
    var title = (titleInput && titleInput.value.trim()) || t.name;
    var slug = (slugInput && slugInput.value.trim()) || t.id.replace(/^(edu|tpl)-/, '');

    slug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    if (!slug) slug = t.id;

    // Build branded URL with partner data baked in
    var finalUrl = brandedUrl(t.url);

    var iframeHtml = '<div style="position:fixed;inset:0;width:100%;height:100%;overflow:hidden">' +
      '<iframe src="' + finalUrl + '" style="width:100%;height:100%;border:none" ' +
      'sandbox="allow-scripts allow-same-origin allow-popups allow-forms"></iframe></div>';

    var page = {
      slug: slug,
      title: title,
      html: iframeHtml,
      css: 'body{margin:0;overflow:hidden}',
      theme: 'authority',
      published: Date.now(),
      source: 'authority-builder',
      sourceTemplate: t.id,
      sourceUrl: finalUrl,
      views: 0,
      conversions: 0,
    };

    var pages = [];
    try { pages = JSON.parse(localStorage.getItem('ctax_pb_pages') || '[]'); } catch (e) { pages = []; }

    var existing = pages.findIndex(function (p) { return p.slug === slug; });
    if (existing !== -1) {
      if (!confirm('A page with slug "' + slug + '" already exists. Overwrite it?')) return;
      pages[existing] = page;
    } else {
      pages.push(page);
    }

    localStorage.setItem('ctax_pb_pages', JSON.stringify(pages));

    abClosePublish();
    abShowToast('Published! View at #lp/' + slug);

    if (typeof pbRenderMyPages === 'function') pbRenderMyPages();
  };

  // ── Toast notification ──
  window.abShowToast = function (msg) {
    var toast = document.createElement('div');
    toast.className = 'ab-toast';
    toast.textContent = msg;
    document.body.appendChild(toast);
    requestAnimationFrame(function () { toast.classList.add('ab-toast-show'); });
    setTimeout(function () {
      toast.classList.remove('ab-toast-show');
      setTimeout(function () { toast.remove(); }, 300);
    }, 3000);
  };

  // ── Keyboard handling ──
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (document.querySelector('.ab-publish-open')) {
        abClosePublish();
      } else if (document.querySelector('.ab-preview-open')) {
        abClosePreview();
      }
    }
  });

})();
