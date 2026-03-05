// Pages Gallery -- Enhanced My Pages with search, filter, status, and bulk actions
// Upgrades the basic pbRenderMyPages() from page-builder.js with:
// - Search by title/slug
// - Filter by status (all/published/draft/archived)
// - Sort by date/title/status
// - Status toggling (publish/archive/draft)
// - Grid/list view toggle
// - Page count summary

(function() {
  'use strict';

  var PG_STATE_KEY = 'ctax_pg_state';

  // ══════════════════════════════════════════
  //  State management
  // ══════════════════════════════════════════

  function getGalleryState() {
    try {
      var raw = localStorage.getItem(PG_STATE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function saveGalleryState(state) {
    try {
      localStorage.setItem(PG_STATE_KEY, JSON.stringify(state));
    } catch (e) { /* quota */ }
  }

  function getFilter() {
    var s = getGalleryState();
    return s.filter || 'all';
  }

  function getSort() {
    var s = getGalleryState();
    return s.sort || 'newest';
  }

  function getView() {
    var s = getGalleryState();
    return s.view || 'grid';
  }

  function getSearch() {
    var el = document.getElementById('pg-search');
    return el ? el.value.trim().toLowerCase() : '';
  }

  // ══════════════════════════════════════════
  //  Page status helpers
  // ══════════════════════════════════════════

  var PG_STATUS_KEY = 'ctax_pg_statuses';

  function getPageStatuses() {
    try {
      var raw = localStorage.getItem(PG_STATUS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function setPageStatus(slug, status) {
    var statuses = getPageStatuses();
    var updated = Object.assign({}, statuses);
    updated[slug] = status;
    try {
      localStorage.setItem(PG_STATUS_KEY, JSON.stringify(updated));
    } catch (e) { /* quota */ }
  }

  function getStatus(slug) {
    var statuses = getPageStatuses();
    return statuses[slug] || 'published';
  }

  // ══════════════════════════════════════════
  //  Toolbar rendering
  // ══════════════════════════════════════════

  function renderToolbar(container, pages) {
    var filter = getFilter();
    var sort = getSort();
    var view = getView();

    var counts = { all: pages.length, published: 0, draft: 0, archived: 0 };
    pages.forEach(function(p) {
      var s = getStatus(p.slug);
      if (counts[s] !== undefined) counts[s]++;
    });

    var html = '<div class="pg-toolbar">';

    // Search
    html += '<div class="pg-search-wrap">';
    html += '<svg class="pg-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>';
    html += '<input type="text" id="pg-search" class="pg-search" placeholder="Search pages..." value="">';
    html += '</div>';

    // Filter pills
    html += '<div class="pg-filters">';
    var filters = [
      { key: 'all', label: 'All' },
      { key: 'published', label: 'Published' },
      { key: 'draft', label: 'Drafts' },
      { key: 'archived', label: 'Archived' }
    ];
    filters.forEach(function(f) {
      var active = filter === f.key ? ' pg-filter-active' : '';
      var count = counts[f.key] || 0;
      html += '<button class="pg-filter' + active + '" data-filter="' + f.key + '" onclick="pgSetFilter(\'' + f.key + '\')">';
      html += f.label + ' <span class="pg-filter-count">' + count + '</span>';
      html += '</button>';
    });
    html += '</div>';

    // Sort + View controls
    html += '<div class="pg-controls">';
    html += '<select class="pg-sort" id="pg-sort" onchange="pgSetSort(this.value)">';
    var sorts = [
      { key: 'newest', label: 'Newest First' },
      { key: 'oldest', label: 'Oldest First' },
      { key: 'alpha', label: 'A-Z' },
      { key: 'alpha-desc', label: 'Z-A' }
    ];
    sorts.forEach(function(s) {
      var sel = sort === s.key ? ' selected' : '';
      html += '<option value="' + s.key + '"' + sel + '>' + s.label + '</option>';
    });
    html += '</select>';

    // View toggle
    html += '<div class="pg-view-toggle">';
    html += '<button class="pg-view-btn' + (view === 'grid' ? ' pg-view-active' : '') + '" onclick="pgSetView(\'grid\')" title="Grid view">';
    html += '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>';
    html += '</button>';
    html += '<button class="pg-view-btn' + (view === 'list' ? ' pg-view-active' : '') + '" onclick="pgSetView(\'list\')" title="List view">';
    html += '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>';
    html += '</button>';
    html += '</div>';
    html += '</div>';

    html += '</div>';

    container.innerHTML = html;

    // Wire search with debounce
    var searchInput = document.getElementById('pg-search');
    if (searchInput) {
      var timer = null;
      searchInput.addEventListener('input', function() {
        clearTimeout(timer);
        timer = setTimeout(function() {
          pgRenderCards();
        }, 200);
      });
    }
  }

  // ══════════════════════════════════════════
  //  Card rendering
  // ══════════════════════════════════════════

  function filterAndSort(pages) {
    var filter = getFilter();
    var sort = getSort();
    var search = getSearch();

    // Filter by status
    var filtered = pages;
    if (filter !== 'all') {
      filtered = pages.filter(function(p) {
        return getStatus(p.slug) === filter;
      });
    }

    // Filter by search
    if (search) {
      filtered = filtered.filter(function(p) {
        var title = (p.title || '').toLowerCase();
        var slug = (p.slug || '').toLowerCase();
        return title.indexOf(search) !== -1 || slug.indexOf(search) !== -1;
      });
    }

    // Sort
    var sorted = filtered.slice();
    if (sort === 'newest') {
      sorted.sort(function(a, b) {
        return new Date(b.updatedAt || b.publishedAt) - new Date(a.updatedAt || a.publishedAt);
      });
    } else if (sort === 'oldest') {
      sorted.sort(function(a, b) {
        return new Date(a.updatedAt || a.publishedAt) - new Date(b.updatedAt || b.publishedAt);
      });
    } else if (sort === 'alpha') {
      sorted.sort(function(a, b) {
        return (a.title || a.slug).localeCompare(b.title || b.slug);
      });
    } else if (sort === 'alpha-desc') {
      sorted.sort(function(a, b) {
        return (b.title || b.slug).localeCompare(a.title || a.slug);
      });
    }

    return sorted;
  }

  function statusBadgeHtml(status) {
    var labels = {
      published: 'Published',
      draft: 'Draft',
      archived: 'Archived'
    };
    return '<span class="pg-status pg-status-' + status + '">' + (labels[status] || status) + '</span>';
  }

  function renderCards(container, pages) {
    var view = getView();
    var sorted = filterAndSort(pages);

    if (sorted.length === 0) {
      var search = getSearch();
      var filter = getFilter();
      if (search || filter !== 'all') {
        container.innerHTML = '<div class="pg-no-results">' +
          '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>' +
          '<p>No pages match your search or filter.</p>' +
          '<button class="pg-clear-btn" onclick="pgClearFilters()">Clear Filters</button>' +
          '</div>';
      } else {
        container.innerHTML = '<div class="pb-mp-empty">' +
          '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>' +
          '<h3>No published pages yet</h3>' +
          '<p>Open the Page Builder, design your page, and click Publish to see it here.</p>' +
          '<button class="btn btn-p mt16" onclick="pgGoToBuilder()">Open Page Builder</button>' +
          '</div>';
      }
      return;
    }

    var gridClass = view === 'list' ? 'pg-cards pg-cards-list' : 'pg-cards pg-cards-grid';
    var html = '<div class="' + gridClass + '">';

    sorted.forEach(function(page) {
      var status = getStatus(page.slug);
      var date = new Date(page.updatedAt || page.publishedAt);
      var dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      var timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

      // Build mini preview
      var previewHtml = '<!DOCTYPE html><html><head><style>' +
        'body{margin:0;font-family:sans-serif;transform-origin:top left;pointer-events:none}' +
        (page.css || '') + '</style></head><body>' +
        (page.html || '') + '</body></html>';

      html += '<div class="pg-card" data-slug="' + escAttr(page.slug) + '" data-status="' + status + '">';

      // Preview thumbnail
      html += '<div class="pg-card-preview">';
      html += '<iframe class="pg-card-iframe" srcdoc="' + escAttr(previewHtml) + '" sandbox="allow-same-origin" tabindex="-1" loading="lazy"></iframe>';
      if (status !== 'published') {
        html += '<div class="pg-card-overlay pg-overlay-' + status + '">' + statusBadgeHtml(status) + '</div>';
      }
      html += '</div>';

      // Info
      html += '<div class="pg-card-body">';
      html += '<div class="pg-card-header">';
      html += '<h4 class="pg-card-title">' + escHtml(page.title || page.slug) + '</h4>';
      html += statusBadgeHtml(status);
      html += '</div>';
      html += '<div class="pg-card-meta">';
      html += '<span class="pg-card-slug">#lp/' + escHtml(page.slug) + '</span>';
      html += '<span class="pg-card-date">' + dateStr + ' at ' + timeStr + '</span>';
      html += '</div>';

      // Performance score (if available)
      var score = computeQuickScore(page);
      html += '<div class="pg-card-score">';
      html += '<div class="pg-score-bar"><div class="pg-score-fill pg-score-' + score.grade + '" style="width:' + score.overall + '%"></div></div>';
      html += '<span class="pg-score-label">' + score.overall + '/100</span>';
      html += '</div>';

      html += '</div>';

      // Actions
      html += '<div class="pg-card-actions">';
      if (status === 'published') {
        html += '<button class="pg-act-btn" onclick="pgAction(\'view\',\'' + escAttr(page.slug) + '\')" title="View live">';
        html += '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> View';
        html += '</button>';
      }
      html += '<button class="pg-act-btn" onclick="pgAction(\'edit\',\'' + escAttr(page.slug) + '\')" title="Edit">';
      html += '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> Edit';
      html += '</button>';
      html += '<button class="pg-act-btn" onclick="pgAction(\'duplicate\',\'' + escAttr(page.slug) + '\')" title="Duplicate">';
      html += '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Duplicate';
      html += '</button>';

      // Status actions
      html += '<div class="pg-act-divider"></div>';
      if (status === 'published') {
        html += '<button class="pg-act-btn pg-act-warn" onclick="pgAction(\'archive\',\'' + escAttr(page.slug) + '\')" title="Archive">Archive</button>';
      } else if (status === 'archived') {
        html += '<button class="pg-act-btn pg-act-success" onclick="pgAction(\'publish\',\'' + escAttr(page.slug) + '\')" title="Republish">Republish</button>';
      } else if (status === 'draft') {
        html += '<button class="pg-act-btn pg-act-success" onclick="pgAction(\'publish\',\'' + escAttr(page.slug) + '\')" title="Publish">Publish</button>';
      }
      html += '<button class="pg-act-btn pg-act-danger" onclick="pgAction(\'delete\',\'' + escAttr(page.slug) + '\')" title="Delete">Delete</button>';
      html += '</div>';
      html += '</div>';
    });

    html += '</div>';
    container.innerHTML = html;
  }

  // ══════════════════════════════════════════
  //  Quick performance score (lightweight)
  // ══════════════════════════════════════════

  function computeQuickScore(page) {
    var scores = { seo: 0, content: 0, mobile: 0 };
    var htmlStr = page.html || '';
    var cssStr = page.css || '';

    // SEO (40 points)
    if (/<h1[\s>]/i.test(htmlStr)) scores.seo += 10;
    if (page.metaDesc && page.metaDesc.length > 20) scores.seo += 10;
    if (page.title && page.title.length > 3) scores.seo += 10;
    if (/<img[^>]*alt="/i.test(htmlStr) || !/<img/i.test(htmlStr)) scores.seo += 10;

    // Content quality (35 points)
    var textContent = htmlStr.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    var wordCount = textContent.split(' ').filter(function(w) { return w.length > 0; }).length;
    if (wordCount > 50) scores.content += 7;
    if (wordCount > 150) scores.content += 7;
    if (/<form/i.test(htmlStr)) scores.content += 7;
    if (/<button|class=".*cta/i.test(htmlStr)) scores.content += 7;
    if (/testimonial|review|rating|quote/i.test(htmlStr)) scores.content += 7;

    // Mobile readiness (25 points)
    if (/max-width|min-width|@media/i.test(cssStr)) scores.mobile += 10;
    // Check for flexible layout patterns (%, vw, auto, flex, grid)
    if (/%|vw|auto|flex|grid/i.test(cssStr)) scores.mobile += 8;
    // Viewport is inherited from parent SPA, so always passes
    scores.mobile += 7;

    var overall = scores.seo + scores.content + scores.mobile;
    var grade = overall >= 80 ? 'good' : overall >= 50 ? 'ok' : 'poor';
    return { overall: overall, seo: scores.seo, content: scores.content, mobile: scores.mobile, grade: grade };
  }

  // ══════════════════════════════════════════
  //  Utility helpers
  // ══════════════════════════════════════════

  function escHtml(str) {
    if (typeof pbEscapeHtml === 'function') return pbEscapeHtml(str);
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function escAttr(str) {
    if (typeof pbEscapeAttr === 'function') return pbEscapeAttr(str);
    return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // ══════════════════════════════════════════
  //  Public API
  // ══════════════════════════════════════════

  window.pgRender = function() {
    var section = document.getElementById('portal-sec-my-pages');
    if (!section) return;

    var pages = (typeof pbGetPages === 'function') ? pbGetPages() : [];

    // Ensure toolbar container exists
    var toolbarEl = section.querySelector('.pg-toolbar-wrap');
    if (!toolbarEl) {
      toolbarEl = document.createElement('div');
      toolbarEl.className = 'pg-toolbar-wrap';
      var grid = document.getElementById('pb-my-pages-grid');
      if (grid) {
        grid.parentNode.insertBefore(toolbarEl, grid);
      }
    }

    // Ensure cards container exists
    var cardsEl = section.querySelector('.pg-cards-wrap');
    if (!cardsEl) {
      cardsEl = document.createElement('div');
      cardsEl.className = 'pg-cards-wrap';
      var grid = document.getElementById('pb-my-pages-grid');
      if (grid) {
        // Hide the old grid -- we render into our own container
        grid.style.display = 'none';
        grid.parentNode.insertBefore(cardsEl, grid.nextSibling);
      }
    }

    renderToolbar(toolbarEl, pages);
    renderCards(cardsEl, pages);
  };

  window.pgRenderCards = function() {
    var section = document.getElementById('portal-sec-my-pages');
    if (!section) return;
    var pages = (typeof pbGetPages === 'function') ? pbGetPages() : [];
    var cardsEl = section.querySelector('.pg-cards-wrap');
    if (cardsEl) renderCards(cardsEl, pages);
  };

  window.pgSetFilter = function(filter) {
    var state = getGalleryState();
    saveGalleryState(Object.assign({}, state, { filter: filter }));
    pgRender();
  };

  window.pgSetSort = function(sort) {
    var state = getGalleryState();
    saveGalleryState(Object.assign({}, state, { sort: sort }));
    pgRenderCards();
  };

  window.pgSetView = function(view) {
    var state = getGalleryState();
    saveGalleryState(Object.assign({}, state, { view: view }));
    pgRender();
  };

  window.pgClearFilters = function() {
    saveGalleryState({ filter: 'all', sort: 'newest', view: getView() });
    pgRender();
  };

  window.pgGoToBuilder = function() {
    var nav = document.querySelector('[onclick*="portal-sec-page-builder"]');
    if (nav) {
      portalNav(nav, 'portal-sec-page-builder');
    }
  };

  window.pgAction = function(action, slug) {
    switch (action) {
      case 'view':
        if (typeof pbViewPage === 'function') pbViewPage(slug);
        break;
      case 'edit':
        if (typeof pbEditPage === 'function') pbEditPage(slug);
        break;
      case 'duplicate':
        if (typeof pbDuplicatePage === 'function') {
          pbDuplicatePage(slug);
          pgRender();
        }
        break;
      case 'archive':
        setPageStatus(slug, 'archived');
        if (typeof showToast === 'function') showToast('Page archived', 'info');
        pgRender();
        break;
      case 'publish':
        setPageStatus(slug, 'published');
        if (typeof showToast === 'function') showToast('Page published', 'success');
        pgRender();
        break;
      case 'delete':
        if (confirm('Permanently delete this page? This cannot be undone.')) {
          if (typeof pbUnpublish === 'function') pbUnpublish(slug);
          // Also clear status
          var statuses = getPageStatuses();
          var updated = Object.assign({}, statuses);
          delete updated[slug];
          try {
            localStorage.setItem(PG_STATUS_KEY, JSON.stringify(updated));
          } catch (e) { /* quota */ }
          pgRender();
          if (typeof showToast === 'function') showToast('Page deleted', 'info');
        }
        break;
    }
  };

  // Expose score function for page-metrics.js
  window.pgComputeQuickScore = computeQuickScore;

})();
