// Page Performance Dashboard -- Analyze published pages for SEO, content quality,
// mobile readiness, and conversion optimization.
// Gives partners actionable improvement recommendations per page.

(function() {
  'use strict';

  // ══════════════════════════════════════════
  //  Deep analysis engine
  // ══════════════════════════════════════════

  function analyzePage(page) {
    var html = page.html || '';
    var css = page.css || '';
    var results = {
      slug: page.slug,
      title: page.title || page.slug,
      seo: analyzeSEO(page, html),
      content: analyzeContent(html),
      mobile: analyzeMobile(html, css),
      conversion: analyzeConversion(html),
      performance: analyzePerformance(html, css)
    };

    // Calculate overall score (weighted)
    var weights = { seo: 0.25, content: 0.20, mobile: 0.15, conversion: 0.25, performance: 0.15 };
    results.overall = Math.round(
      results.seo.score * weights.seo +
      results.content.score * weights.content +
      results.mobile.score * weights.mobile +
      results.conversion.score * weights.conversion +
      results.performance.score * weights.performance
    );
    results.grade = results.overall >= 85 ? 'A' :
                    results.overall >= 70 ? 'B' :
                    results.overall >= 55 ? 'C' :
                    results.overall >= 40 ? 'D' : 'F';

    return results;
  }

  function analyzeSEO(page, html) {
    var checks = [];
    var score = 0;
    var maxScore = 100;

    // Title tag presence (page title)
    var hasTitle = page.title && page.title.length > 3;
    var titleLen = hasTitle ? page.title.length : 0;
    checks.push({
      name: 'Page Title',
      pass: hasTitle && titleLen >= 10 && titleLen <= 70,
      value: hasTitle ? page.title + ' (' + titleLen + ' chars)' : 'Missing',
      tip: 'Add a descriptive title between 10-70 characters. Include your main keyword.',
      weight: 15
    });
    if (hasTitle && titleLen >= 10 && titleLen <= 70) score += 15;
    else if (hasTitle) score += 8;

    // Meta description
    var hasDesc = page.metaDesc && page.metaDesc.length > 20;
    var descLen = hasDesc ? page.metaDesc.length : 0;
    checks.push({
      name: 'Meta Description',
      pass: hasDesc && descLen >= 50 && descLen <= 160,
      value: hasDesc ? descLen + ' chars' : 'Missing',
      tip: 'Write a compelling meta description (50-160 chars) that includes your target keyword and a call to action.',
      weight: 15
    });
    if (hasDesc && descLen >= 50 && descLen <= 160) score += 15;
    else if (hasDesc) score += 8;

    // H1 tag
    var h1Match = html.match(/<h1[\s>]/gi);
    var h1Count = h1Match ? h1Match.length : 0;
    checks.push({
      name: 'H1 Heading',
      pass: h1Count === 1,
      value: h1Count === 0 ? 'Missing' : h1Count + ' found',
      tip: h1Count === 0 ? 'Add exactly one H1 heading with your primary keyword.' : h1Count > 1 ? 'Use only one H1 per page. Convert extras to H2.' : 'Good',
      weight: 15
    });
    if (h1Count === 1) score += 15;
    else if (h1Count > 1) score += 7;

    // H2 subheadings
    var h2Match = html.match(/<h2[\s>]/gi);
    var h2Count = h2Match ? h2Match.length : 0;
    checks.push({
      name: 'Subheadings (H2)',
      pass: h2Count >= 2,
      value: h2Count + ' found',
      tip: 'Use 2+ H2 subheadings to structure your content and help search engines understand the page.',
      weight: 10
    });
    if (h2Count >= 2) score += 10;
    else if (h2Count === 1) score += 5;

    // Image alt text
    var imgTags = html.match(/<img[^>]*>/gi) || [];
    var imgWithAlt = imgTags.filter(function(tag) { return /alt="[^"]+"/i.test(tag); }).length;
    var imgTotal = imgTags.length;
    checks.push({
      name: 'Image Alt Text',
      pass: imgTotal === 0 || imgWithAlt === imgTotal,
      value: imgTotal === 0 ? 'No images' : imgWithAlt + '/' + imgTotal + ' have alt text',
      tip: 'Add descriptive alt text to all images for accessibility and SEO.',
      weight: 10
    });
    if (imgTotal === 0 || imgWithAlt === imgTotal) score += 10;
    else if (imgWithAlt > 0) score += 5;

    // Internal links
    var linkMatches = html.match(/<a[^>]*href/gi);
    var linkCount = linkMatches ? linkMatches.length : 0;
    checks.push({
      name: 'Links / CTAs',
      pass: linkCount >= 1,
      value: linkCount + ' links found',
      tip: 'Include at least one clear link or CTA button.',
      weight: 10
    });
    if (linkCount >= 1) score += 10;

    // Structured data / schema hints
    var hasSchema = /itemtype|itemscope|schema\.org|ld\+json/i.test(html);
    checks.push({
      name: 'Schema Markup',
      pass: hasSchema,
      value: hasSchema ? 'Detected' : 'Not found',
      tip: 'Consider adding schema markup (FAQ, LocalBusiness, or Organization) to enhance search results.',
      weight: 10
    });
    if (hasSchema) score += 10;

    // OG image
    var hasOG = page.ogImage && page.ogImage.length > 5;
    checks.push({
      name: 'OG Image',
      pass: hasOG,
      value: hasOG ? 'Set' : 'Missing',
      tip: 'Add an Open Graph image for better social media previews when your page is shared.',
      weight: 15
    });
    if (hasOG) score += 15;

    return { score: Math.min(score, maxScore), checks: checks };
  }

  function analyzeContent(html) {
    var checks = [];
    var score = 0;

    // Strip HTML
    var text = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                   .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                   .replace(/<[^>]+>/g, ' ')
                   .replace(/\s+/g, ' ')
                   .trim();
    var words = text.split(' ').filter(function(w) { return w.length > 0; });
    var wordCount = words.length;

    checks.push({
      name: 'Word Count',
      pass: wordCount >= 100,
      value: wordCount + ' words',
      tip: wordCount < 50 ? 'Very thin content. Aim for 200+ words for better engagement and SEO.' :
           wordCount < 100 ? 'Add more content. Landing pages with 200+ words typically convert better.' : 'Good content depth.',
      weight: 20
    });
    if (wordCount >= 200) score += 20;
    else if (wordCount >= 100) score += 14;
    else if (wordCount >= 50) score += 8;

    // CTA presence
    var ctaPatterns = /book|call|schedule|get started|free|contact|apply|sign up|register|download|claim/i;
    var hasCTA = ctaPatterns.test(text);
    checks.push({
      name: 'Call to Action',
      pass: hasCTA,
      value: hasCTA ? 'Found' : 'Missing',
      tip: 'Include clear calls to action like "Get Your Free Analysis" or "Schedule a Consultation".',
      weight: 20
    });
    if (hasCTA) score += 20;

    // Form presence
    var hasForm = /<form/i.test(html) || /class="[^"]*form/i.test(html);
    checks.push({
      name: 'Lead Capture Form',
      pass: hasForm,
      value: hasForm ? 'Found' : 'Not found',
      tip: 'Add a lead capture form to collect visitor information. Even a simple name + email + phone form works.',
      weight: 20
    });
    if (hasForm) score += 20;

    // Social proof
    var hasProof = /testimonial|review|rating|star|client|customer|helped|resolved|trust/i.test(html);
    checks.push({
      name: 'Social Proof',
      pass: hasProof,
      value: hasProof ? 'Found' : 'Not found',
      tip: 'Add testimonials, reviews, or trust indicators ("2,300+ clients helped") to build credibility.',
      weight: 20
    });
    if (hasProof) score += 20;

    // Urgency / scarcity
    var hasUrgency = /limited|today|now|hurry|deadline|expires|last chance|don.t wait/i.test(text);
    checks.push({
      name: 'Urgency Elements',
      pass: hasUrgency,
      value: hasUrgency ? 'Found' : 'Not found',
      tip: 'Consider adding urgency ("Free consultation -- limited availability this month") to increase conversions.',
      weight: 20
    });
    if (hasUrgency) score += 20;

    return { score: Math.min(score, 100), checks: checks, wordCount: wordCount };
  }

  function analyzeMobile(html, css) {
    var checks = [];
    var score = 0;

    // Responsive CSS
    var hasMediaQueries = /@media/i.test(css);
    checks.push({
      name: 'Responsive CSS',
      pass: hasMediaQueries,
      value: hasMediaQueries ? 'Media queries found' : 'No media queries',
      tip: 'Add @media queries to adapt layout at 768px and 480px breakpoints.',
      weight: 25
    });
    if (hasMediaQueries) score += 25;

    // Flexible layouts
    var hasFlexGrid = /display:\s*(flex|grid)/i.test(css);
    checks.push({
      name: 'Flexible Layouts',
      pass: hasFlexGrid,
      value: hasFlexGrid ? 'Flexbox/Grid detected' : 'No flex/grid',
      tip: 'Use CSS Flexbox or Grid for layouts that naturally reflow on smaller screens.',
      weight: 25
    });
    if (hasFlexGrid) score += 25;

    // Font sizes
    var tinyFonts = css.match(/font-size:\s*(\d+)px/gi) || [];
    var hasTinyFonts = tinyFonts.some(function(m) {
      var size = parseInt(m.replace(/[^0-9]/g, ''), 10);
      return size < 12;
    });
    checks.push({
      name: 'Readable Font Sizes',
      pass: !hasTinyFonts,
      value: hasTinyFonts ? 'Small fonts detected (<12px)' : 'All fonts readable',
      tip: 'Keep body text at 14px+ and ensure all text is legible on mobile devices.',
      weight: 25
    });
    if (!hasTinyFonts) score += 25;

    // No horizontal overflow patterns
    var hasFixedWidth = /width:\s*\d{4,}px/i.test(css); // 1000px+ fixed widths
    checks.push({
      name: 'No Fixed Widths',
      pass: !hasFixedWidth,
      value: hasFixedWidth ? 'Large fixed widths found' : 'No overflow issues',
      tip: 'Avoid fixed widths over 100%. Use max-width and percentage-based widths instead.',
      weight: 25
    });
    if (!hasFixedWidth) score += 25;

    return { score: Math.min(score, 100), checks: checks };
  }

  function analyzeConversion(html) {
    var checks = [];
    var score = 0;
    var text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

    // Above the fold CTA
    // Check if CTA appears in first 500 chars of HTML (approximate above-fold)
    var firstFold = html.substring(0, 1500);
    var hasFoldCTA = /<button|class="[^"]*cta|class="[^"]*btn/i.test(firstFold);
    checks.push({
      name: 'Above-Fold CTA',
      pass: hasFoldCTA,
      value: hasFoldCTA ? 'CTA in hero area' : 'No CTA above fold',
      tip: 'Place your primary CTA button in the hero section so visitors see it immediately without scrolling.',
      weight: 20
    });
    if (hasFoldCTA) score += 20;

    // Multiple CTAs
    var btnMatches = html.match(/<button|class="[^"]*btn-p|class="[^"]*cta/gi) || [];
    var ctaCount = btnMatches.length;
    checks.push({
      name: 'CTA Repetition',
      pass: ctaCount >= 2,
      value: ctaCount + ' CTA buttons found',
      tip: 'Repeat your CTA 2-3 times throughout the page (hero, mid-page, final section).',
      weight: 15
    });
    if (ctaCount >= 3) score += 15;
    else if (ctaCount >= 2) score += 10;
    else if (ctaCount >= 1) score += 5;

    // Trust signals
    var trustPatterns = /badge|credential|certified|accredited|licensed|guaranteed|secure|protected|bbb|rating|verified/i;
    var hasTrust = trustPatterns.test(html);
    checks.push({
      name: 'Trust Signals',
      pass: hasTrust,
      value: hasTrust ? 'Trust elements found' : 'No trust signals',
      tip: 'Add trust badges (BBB, certifications, "Secure & Confidential") near your form to reduce friction.',
      weight: 15
    });
    if (hasTrust) score += 15;

    // Phone number
    var hasPhone = /\(\d{3}\)\s*\d{3}[-.]?\d{4}|\d{3}[-.]?\d{3}[-.]?\d{4}|tel:/i.test(html);
    checks.push({
      name: 'Phone Number',
      pass: hasPhone,
      value: hasPhone ? 'Phone number found' : 'No phone number',
      tip: 'Display a phone number prominently. Tax resolution prospects often prefer to call.',
      weight: 15
    });
    if (hasPhone) score += 15;

    // Benefit-focused headlines
    var h2s = html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/gi) || [];
    var benefitWords = /save|stop|resolve|protect|reduce|free|eliminate|avoid|get|keep/i;
    var benefitH2s = h2s.filter(function(h) { return benefitWords.test(h); }).length;
    checks.push({
      name: 'Benefit Headlines',
      pass: benefitH2s >= 1,
      value: benefitH2s + ' of ' + h2s.length + ' headlines are benefit-focused',
      tip: 'Lead with benefits in headlines: "Stop Wage Garnishment Today" instead of "Our Services".',
      weight: 15
    });
    if (benefitH2s >= 2) score += 15;
    else if (benefitH2s >= 1) score += 10;

    // Process / steps section
    var hasProcess = /step|process|how it works|what happens|3 easy|simple/i.test(text);
    checks.push({
      name: 'Process Section',
      pass: hasProcess,
      value: hasProcess ? 'Process/steps found' : 'No process section',
      tip: 'Add a "How It Works" section (3-4 steps) to reduce uncertainty and show the path forward.',
      weight: 20
    });
    if (hasProcess) score += 20;

    return { score: Math.min(score, 100), checks: checks };
  }

  function analyzePerformance(html, css) {
    var checks = [];
    var score = 0;

    // HTML size
    var htmlBytes = new Blob([html]).size;
    var htmlKB = Math.round(htmlBytes / 1024);
    checks.push({
      name: 'HTML Size',
      pass: htmlKB < 100,
      value: htmlKB + ' KB',
      tip: htmlKB >= 100 ? 'HTML is large. Remove unused sections or inline styles to reduce page weight.' : 'Good',
      weight: 25
    });
    if (htmlKB < 50) score += 25;
    else if (htmlKB < 100) score += 18;
    else if (htmlKB < 200) score += 10;

    // CSS size
    var cssBytes = new Blob([css]).size;
    var cssKB = Math.round(cssBytes / 1024);
    checks.push({
      name: 'CSS Size',
      pass: cssKB < 50,
      value: cssKB + ' KB',
      tip: cssKB >= 50 ? 'CSS is large. The page builder may be including unused styles.' : 'Good',
      weight: 25
    });
    if (cssKB < 20) score += 25;
    else if (cssKB < 50) score += 18;
    else if (cssKB < 100) score += 10;

    // DOM depth estimate (count nested divs)
    var divCount = (html.match(/<div/gi) || []).length;
    checks.push({
      name: 'DOM Complexity',
      pass: divCount < 100,
      value: divCount + ' div elements',
      tip: divCount >= 100 ? 'Page has many nested elements. Simplify layout for faster rendering.' : 'Good',
      weight: 25
    });
    if (divCount < 50) score += 25;
    else if (divCount < 100) score += 18;
    else if (divCount < 200) score += 10;

    // External resources
    var extResources = (html.match(/src="https?:\/\//gi) || []).length;
    checks.push({
      name: 'External Resources',
      pass: extResources < 5,
      value: extResources + ' external loads',
      tip: extResources >= 5 ? 'Many external resources slow page load. Host images locally or use optimized CDN URLs.' : 'Good',
      weight: 25
    });
    if (extResources < 3) score += 25;
    else if (extResources < 5) score += 18;
    else if (extResources < 10) score += 10;

    return { score: Math.min(score, 100), checks: checks, htmlKB: htmlKB, cssKB: cssKB };
  }

  // ══════════════════════════════════════════
  //  Dashboard rendering
  // ══════════════════════════════════════════

  function renderDashboard() {
    var container = document.getElementById('pm-dashboard');
    if (!container) return;

    var pages = (typeof pbGetPages === 'function') ? pbGetPages() : [];

    if (pages.length === 0) {
      container.innerHTML = '<div class="pm-empty">' +
        '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>' +
        '<h3>No pages to analyze</h3>' +
        '<p>Publish at least one page from the Page Builder to see performance metrics here.</p>' +
        '</div>';
      return;
    }

    // Analyze all pages
    var analyses = pages.map(analyzePage);

    // Aggregate stats
    var avgScore = Math.round(analyses.reduce(function(sum, a) { return sum + a.overall; }, 0) / analyses.length);
    var bestPage = analyses.reduce(function(best, a) { return a.overall > best.overall ? a : best; }, analyses[0]);
    var worstPage = analyses.reduce(function(worst, a) { return a.overall < worst.overall ? a : worst; }, analyses[0]);

    var html = '';

    // Summary cards
    html += '<div class="pm-summary">';
    html += renderSummaryCard('Average Score', avgScore + '/100', gradeClass(avgScore), gradeIcon(avgScore));
    html += renderSummaryCard('Best Page', bestPage.title, 'pm-good', '<span class="pm-score-lg">' + bestPage.overall + '</span>');
    html += renderSummaryCard('Needs Work', worstPage.title, 'pm-poor', '<span class="pm-score-lg">' + worstPage.overall + '</span>');
    html += renderSummaryCard('Total Pages', pages.length + '', 'pm-neutral', '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/></svg>');
    html += '</div>';

    // Score comparison chart
    html += '<div class="pm-chart-section">';
    html += '<h3 class="pm-section-title">Page Score Comparison</h3>';
    html += '<div class="pm-bar-chart">';
    analyses.forEach(function(a) {
      var color = a.overall >= 80 ? 'var(--teal)' : a.overall >= 60 ? 'var(--blue)' : a.overall >= 40 ? '#f59e0b' : '#ef4444';
      html += '<div class="pm-bar-row">';
      html += '<span class="pm-bar-label">' + escHtml(a.title) + '</span>';
      html += '<div class="pm-bar-track">';
      html += '<div class="pm-bar-fill" style="width:' + a.overall + '%;background:' + color + '"></div>';
      html += '</div>';
      html += '<span class="pm-bar-value">' + a.overall + '</span>';
      html += '</div>';
    });
    html += '</div>';
    html += '</div>';

    // Category breakdown
    html += '<div class="pm-chart-section">';
    html += '<h3 class="pm-section-title">Score Breakdown by Category</h3>';
    html += '<div class="pm-breakdown-grid">';
    var categories = [
      { key: 'seo', label: 'SEO', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>' },
      { key: 'content', label: 'Content', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>' },
      { key: 'mobile', label: 'Mobile', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>' },
      { key: 'conversion', label: 'Conversion', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>' },
      { key: 'performance', label: 'Performance', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>' }
    ];

    categories.forEach(function(cat) {
      var avg = Math.round(analyses.reduce(function(sum, a) { return sum + a[cat.key].score; }, 0) / analyses.length);
      html += '<div class="pm-breakdown-card">';
      html += '<div class="pm-breakdown-icon">' + cat.icon + '</div>';
      html += '<div class="pm-breakdown-label">' + cat.label + '</div>';
      html += '<div class="pm-breakdown-score ' + gradeClass(avg) + '">' + avg + '</div>';
      html += '<div class="pm-breakdown-bar"><div class="pm-breakdown-fill" style="width:' + avg + '%;background:' + gradeColor(avg) + '"></div></div>';
      html += '</div>';
    });
    html += '</div>';
    html += '</div>';

    // Per-page detailed cards
    html += '<div class="pm-chart-section">';
    html += '<h3 class="pm-section-title">Detailed Page Analysis</h3>';
    html += '<div class="pm-detail-grid">';

    analyses.forEach(function(a) {
      html += '<div class="pm-detail-card">';
      html += '<div class="pm-detail-header">';
      html += '<h4 class="pm-detail-title">' + escHtml(a.title) + '</h4>';
      html += '<div class="pm-detail-grade pm-grade-' + a.grade + '">' + a.grade + '</div>';
      html += '</div>';

      // Score ring
      html += '<div class="pm-ring-row">';
      html += renderScoreRing(a.overall);
      html += '<div class="pm-ring-meta">';
      html += '<div class="pm-ring-label">Overall Score</div>';
      html += '<div class="pm-ring-sublabel">' + a.slug + '</div>';
      html += '</div>';
      html += '</div>';

      // Category mini bars
      html += '<div class="pm-mini-bars">';
      categories.forEach(function(cat) {
        var catScore = a[cat.key].score;
        html += '<div class="pm-mini-row">';
        html += '<span class="pm-mini-label">' + cat.label + '</span>';
        html += '<div class="pm-mini-track"><div class="pm-mini-fill" style="width:' + catScore + '%;background:' + gradeColor(catScore) + '"></div></div>';
        html += '<span class="pm-mini-val">' + catScore + '</span>';
        html += '</div>';
      });
      html += '</div>';

      // Top recommendations
      var recs = getTopRecommendations(a, 3);
      if (recs.length > 0) {
        html += '<div class="pm-recs">';
        html += '<div class="pm-recs-title">Top Improvements</div>';
        recs.forEach(function(rec) {
          html += '<div class="pm-rec-item">';
          html += '<span class="pm-rec-dot pm-rec-' + rec.priority + '"></span>';
          html += '<span class="pm-rec-text">' + escHtml(rec.tip) + '</span>';
          html += '</div>';
        });
        html += '</div>';
      }

      // Action button
      html += '<button class="pm-detail-btn" onclick="pmShowFullReport(\'' + escAttr(a.slug) + '\')">Full Report</button>';
      html += '</div>';
    });

    html += '</div>';
    html += '</div>';

    container.innerHTML = html;
  }

  function renderSummaryCard(label, value, cls, icon) {
    return '<div class="pm-card ' + cls + '">' +
      '<div class="pm-card-icon">' + icon + '</div>' +
      '<div class="pm-card-value">' + escHtml(value) + '</div>' +
      '<div class="pm-card-label">' + escHtml(label) + '</div>' +
      '</div>';
  }

  function renderScoreRing(score) {
    var circumference = 2 * Math.PI * 40;
    var offset = circumference - (score / 100) * circumference;
    var color = gradeColor(score);
    return '<div class="pm-ring">' +
      '<svg width="96" height="96" viewBox="0 0 96 96">' +
      '<circle cx="48" cy="48" r="40" fill="none" stroke="#e5e7eb" stroke-width="6"/>' +
      '<circle cx="48" cy="48" r="40" fill="none" stroke="' + color + '" stroke-width="6" ' +
      'stroke-dasharray="' + circumference + '" stroke-dashoffset="' + offset + '" ' +
      'stroke-linecap="round" transform="rotate(-90 48 48)" class="pm-ring-progress"/>' +
      '</svg>' +
      '<span class="pm-ring-text">' + score + '</span>' +
      '</div>';
  }

  function getTopRecommendations(analysis, limit) {
    var recs = [];
    var categories = ['seo', 'content', 'conversion', 'mobile', 'performance'];
    categories.forEach(function(cat) {
      var checks = analysis[cat].checks || [];
      checks.forEach(function(check) {
        if (!check.pass) {
          recs.push({
            category: cat,
            name: check.name,
            tip: check.tip,
            weight: check.weight || 10,
            priority: check.weight >= 20 ? 'high' : check.weight >= 15 ? 'medium' : 'low'
          });
        }
      });
    });
    // Sort by weight (highest priority first)
    recs.sort(function(a, b) { return b.weight - a.weight; });
    return recs.slice(0, limit);
  }

  // ══════════════════════════════════════════
  //  Full report modal
  // ══════════════════════════════════════════

  window.pmShowFullReport = function(slug) {
    var pages = (typeof pbGetPages === 'function') ? pbGetPages() : [];
    var page = null;
    for (var i = 0; i < pages.length; i++) {
      if (pages[i].slug === slug) { page = pages[i]; break; }
    }
    if (!page) return;

    var analysis = analyzePage(page);
    var categories = [
      { key: 'seo', label: 'SEO' },
      { key: 'content', label: 'Content Quality' },
      { key: 'mobile', label: 'Mobile Readiness' },
      { key: 'conversion', label: 'Conversion Optimization' },
      { key: 'performance', label: 'Performance' }
    ];

    var html = '<div class="pm-modal-overlay" onclick="pmCloseReport(event)">';
    html += '<div class="pm-modal">';
    html += '<div class="pm-modal-header">';
    html += '<h3>Performance Report: ' + escHtml(analysis.title) + '</h3>';
    html += '<button class="pm-modal-close" onclick="pmCloseReport(event)" aria-label="Close">&times;</button>';
    html += '</div>';
    html += '<div class="pm-modal-body">';

    // Overall score
    html += '<div class="pm-report-overall">';
    html += renderScoreRing(analysis.overall);
    html += '<div class="pm-report-grade">Grade: <strong>' + analysis.grade + '</strong></div>';
    html += '</div>';

    // Category sections
    categories.forEach(function(cat) {
      var catData = analysis[cat.key];
      html += '<div class="pm-report-section">';
      html += '<div class="pm-report-section-header">';
      html += '<h4>' + cat.label + '</h4>';
      html += '<span class="pm-report-section-score" style="color:' + gradeColor(catData.score) + '">' + catData.score + '/100</span>';
      html += '</div>';

      html += '<div class="pm-report-checks">';
      (catData.checks || []).forEach(function(check) {
        var icon = check.pass
          ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>'
          : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';
        html += '<div class="pm-check-row">';
        html += '<div class="pm-check-icon">' + icon + '</div>';
        html += '<div class="pm-check-info">';
        html += '<div class="pm-check-name">' + escHtml(check.name) + ' <span class="pm-check-val">' + escHtml(check.value) + '</span></div>';
        if (!check.pass) {
          html += '<div class="pm-check-tip">' + escHtml(check.tip) + '</div>';
        }
        html += '</div>';
        html += '</div>';
      });
      html += '</div>';
      html += '</div>';
    });

    html += '</div>';
    html += '</div>';
    html += '</div>';

    // Inject modal
    var modalEl = document.createElement('div');
    modalEl.id = 'pm-report-modal';
    modalEl.innerHTML = html;
    document.body.appendChild(modalEl);
  };

  window.pmCloseReport = function(e) {
    if (!e || !e.target) return;
    var clickedOverlay = e.target.classList.contains('pm-modal-overlay');
    var clickedClose = e.target.classList.contains('pm-modal-close');
    if (clickedOverlay || clickedClose) {
      var modal = document.getElementById('pm-report-modal');
      if (modal) modal.remove();
    }
  };

  // ══════════════════════════════════════════
  //  Helpers
  // ══════════════════════════════════════════

  function gradeClass(score) {
    if (score >= 80) return 'pm-good';
    if (score >= 60) return 'pm-ok';
    if (score >= 40) return 'pm-warn';
    return 'pm-poor';
  }

  function gradeColor(score) {
    if (score >= 80) return '#10b981';
    if (score >= 60) return 'var(--blue)';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
  }

  function gradeIcon(score) {
    if (score >= 80) return '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>';
    if (score >= 60) return '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
    return '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';
  }

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

  window.pmRenderDashboard = renderDashboard;
  window.pmAnalyzePage = analyzePage;

})();
