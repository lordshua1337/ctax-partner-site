// -- ICP BUILDER ----------------------------------------------------------
// Questionnaire -> Claude API -> Tabbed results + PDF download
// Follows Partner Fit Quiz IIFE pattern from navigation.js
(function() {
  var _step = 0;
  var _answers = {};
  var _icpData = {};
  var _sections = {};
  var _multiSelected = [];

  var TOTAL_STEPS = 6;
  var QUESTION_KEYS = ['practice', 'clients', 'pain_points', 'scale', 'geography', 'motivation'];
  // Steps that use multi-select (Q3) or textarea (Q5) need Continue button
  var MULTI_STEP = 2;
  var TEXT_STEP = 4;

  var LOADING_MSGS = [
    'Analyzing your practice profile...',
    'Identifying ideal client characteristics...',
    'Building red flag indicators...',
    'Crafting conversation starters...',
    'Mapping conversion patterns...',
    'Generating your 30-day action plan...'
  ];

  var TAB_IDS = ['who', 'flags', 'convo', 'convert', 'disqualify'];

  // ---- Public API exposed on window ----

  window.icpScrollToBuilder = function() {
    var el = document.getElementById('ait-builder');
    if (el) {
      // Account for nav offset
      var navHeight = 70;
      var top = el.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: top, behavior: 'smooth' });
    }
  };

  window.icpPick = function(btn) {
    var isMulti = btn.getAttribute('data-multi') === 'true';

    if (isMulti) {
      // Toggle selection for multi-select (Q3)
      btn.classList.toggle('fq-opt-selected');
      // Rebuild _multiSelected from current DOM state
      var card = btn.closest('.fq-card');
      _multiSelected = [];
      card.querySelectorAll('.fq-opt-selected').forEach(function(sel) {
        _multiSelected.push(sel.getAttribute('data-val'));
      });
      return; // Don't auto-advance -- user clicks Continue
    }

    // Single-select: highlight and auto-advance
    var siblings = btn.parentElement.querySelectorAll('.fq-opt');
    siblings.forEach(function(s) { s.classList.remove('fq-opt-selected'); });
    btn.classList.add('fq-opt-selected');

    var val = btn.getAttribute('data-val');
    _answers[QUESTION_KEYS[_step]] = val;

    setTimeout(function() {
      advance();
    }, 300);
  };

  window.icpContinue = function() {
    if (_step === MULTI_STEP) {
      // Q3 multi-select
      if (_multiSelected.length === 0) {
        showError('Please select at least one option.');
        return;
      }
      _answers[QUESTION_KEYS[_step]] = _multiSelected.join(', ');
      _multiSelected = [];
      advance();
    } else if (_step === TEXT_STEP) {
      // Q5 textarea
      var geo = document.getElementById('ait-iq-geo');
      var val = geo ? geo.value.trim() : '';
      if (!val) {
        showError('Please describe where your clients are located.');
        return;
      }
      _answers[QUESTION_KEYS[_step]] = val;
      advance();
    }
  };

  window.icpBack = function() {
    if (_step <= 0) return;
    hideError();
    _step--;
    // Clear answer for current step
    delete _answers[QUESTION_KEYS[_step]];
    // Clear selections on the card we're going back to
    var cards = document.querySelectorAll('#ait-iq-form .fq-card');
    if (cards[_step]) {
      cards[_step].querySelectorAll('.fq-opt').forEach(function(o) {
        o.classList.remove('fq-opt-selected');
      });
    }
    // Reset multi-select state if going back to Q3
    if (_step === MULTI_STEP) {
      _multiSelected = [];
    }
    // Reset textarea if going back to Q5
    if (_step === TEXT_STEP) {
      var geo = document.getElementById('ait-iq-geo');
      if (geo) geo.value = '';
      var counter = document.getElementById('ait-iq-geo-count');
      if (counter) counter.textContent = '0';
    }
    updateUI();
  };

  window.icpSwitchTab = function(id) {
    var tabs = document.querySelectorAll('.ait-iq-tab');
    var panels = document.querySelectorAll('.ait-iq-panel');

    tabs.forEach(function(t) { t.classList.remove('ait-iq-tab-active'); });
    panels.forEach(function(p) { p.classList.remove('ait-iq-panel-active'); });

    // Find and activate the clicked tab
    tabs.forEach(function(t) {
      if (t.textContent.toLowerCase().indexOf(id === 'who' ? 'who' : id === 'flags' ? 'red' : id === 'convo' ? 'how' : id === 'convert' ? 'why' : 'disq') !== -1) {
        t.classList.add('ait-iq-tab-active');
      }
    });

    var panel = document.getElementById('ait-iq-panel-' + id);
    if (panel) panel.classList.add('ait-iq-panel-active');
  };

  window.icpReset = function() {
    _step = 0;
    _answers = {};
    _icpData = {};
    _sections = {};
    _multiSelected = [];

    // Reset all card selections
    var cards = document.querySelectorAll('#ait-iq-form .fq-card');
    cards.forEach(function(card) {
      card.querySelectorAll('.fq-opt').forEach(function(o) {
        o.classList.remove('fq-opt-selected');
      });
    });

    // Reset textarea
    var geo = document.getElementById('ait-iq-geo');
    if (geo) geo.value = '';
    var counter = document.getElementById('ait-iq-geo-count');
    if (counter) counter.textContent = '0';

    // Swap states
    document.getElementById('ait-iq-form').style.display = 'block';
    document.getElementById('ait-iq-loading').style.display = 'none';
    document.getElementById('ait-iq-output').style.display = 'none';
    hideError();
    updateUI();

    // Scroll back to builder
    window.icpScrollToBuilder();
  };

  window.icpDownloadPdf = function() {
    if (typeof html2pdf === 'undefined') {
      showError('PDF library not loaded. Please try again.');
      return;
    }
    var pdfDoc = buildPdfDoc();
    var origMargin = document.body.style.margin;
    var origPadding = document.body.style.padding;
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.appendChild(pdfDoc);
    window.scrollTo(0, 0);

    var opt = {
      margin: 0,
      filename: 'ideal-client-profile.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        scrollY: -window.scrollY
      },
      jsPDF: { unit: 'mm', format: 'letter', orientation: 'portrait' },
      pagebreak: { mode: ['css'] }
    };

    html2pdf().set(opt).from(pdfDoc).save().then(function() {
      document.body.removeChild(pdfDoc);
      document.body.style.margin = origMargin;
      document.body.style.padding = origPadding;
    }).catch(function(err) {
      console.error('PDF error:', err);
      if (pdfDoc.parentNode) document.body.removeChild(pdfDoc);
      document.body.style.margin = origMargin;
      document.body.style.padding = origPadding;
      showError('PDF generation failed. Please try again.');
    });
  };

  window._icpInit = function() {
    _step = 0;
    _answers = {};
    _multiSelected = [];
    updateUI();
    wireTextarea();
  };

  // Cinematic scroll controller: every scene pins + fades in/out via scroll progress
  window._aitInitScrollReveal = function() {
    var hero = document.getElementById('ait-hero-pin');
    var heroContent = document.getElementById('ait-hero-pin-content');
    var scrollCue = document.getElementById('ait-scroll-cue');
    var scenes = document.querySelectorAll('.ait-scene');
    var ticking = false;

    function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

    // Ease function for smoother transitions
    function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function() {
        var scrollY = window.scrollY;
        var vh = window.innerHeight;

        // Hero: fade out + scale down as you scroll past
        if (hero && heroContent) {
          var heroProgress = clamp(scrollY / (vh * 0.7), 0, 1);
          heroContent.style.opacity = 1 - heroProgress;
          heroContent.style.transform = 'scale(' + (1 - heroProgress * 0.15) + ')';
          if (scrollCue) {
            scrollCue.style.opacity = Math.max(1 - heroProgress * 4, 0);
          }
        }

        // Each scene: compute scroll progress through it
        for (var i = 0; i < scenes.length; i++) {
          var scene = scenes[i];
          var pin = scene.querySelector('.ait-scene-pin');
          if (!pin) continue;

          var rect = scene.getBoundingClientRect();
          var sceneHeight = scene.offsetHeight;
          var pinHeight = vh;

          // How far through this scene are we? 0 = just entered, 1 = fully past
          var sceneTop = rect.top;
          var progress = clamp(-sceneTop / (sceneHeight - pinHeight), 0, 1);

          // Fade zones: 0-0.15 fade in, 0.15-0.7 hold, 0.7-1.0 fade out
          var opacity;
          var translateY;
          var scale;

          if (sceneTop > vh) {
            // Scene hasn't entered viewport yet
            opacity = 0;
            translateY = 40;
            scale = 0.97;
          } else if (progress < 0.15) {
            // Fading in
            var fadeIn = easeOutCubic(progress / 0.15);
            opacity = fadeIn;
            translateY = 40 * (1 - fadeIn);
            scale = 0.97 + 0.03 * fadeIn;
          } else if (progress < 0.7) {
            // Holding visible
            opacity = 1;
            translateY = 0;
            scale = 1;
          } else {
            // Fading out
            var fadeOut = easeOutCubic((progress - 0.7) / 0.3);
            opacity = 1 - fadeOut;
            translateY = -30 * fadeOut;
            scale = 1 - 0.04 * fadeOut;
          }

          pin.style.opacity = opacity;
          pin.style.transform = 'translateY(' + translateY + 'px) scale(' + scale + ')';

          // Proof cards: stagger in individually
          if (scene.dataset.scene === 'proof') {
            var cards = scene.querySelectorAll('.ait-proof-card');
            for (var c = 0; c < cards.length; c++) {
              var cardDelay = c * 0.05;
              var cardProgress = clamp((progress - cardDelay) / 0.15, 0, 1);
              if (progress >= 0.15) cardProgress = 1;
              var cardFadeIn = easeOutCubic(cardProgress);
              cards[c].style.opacity = opacity * cardFadeIn;
              cards[c].style.transform = 'translateY(' + (24 * (1 - cardFadeIn)) + 'px)';
              if (cardProgress >= 1 && opacity > 0.5) {
                cards[c].classList.add('ait-proof-visible');
              } else {
                cards[c].classList.remove('ait-proof-visible');
              }
            }
          }
        }

        ticking = false;
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    // Run once on load to set initial states
    onScroll();
  };

  // ---- Internal functions ----

  function wireTextarea() {
    var geo = document.getElementById('ait-iq-geo');
    var counter = document.getElementById('ait-iq-geo-count');
    if (geo && counter && !geo._wired) {
      geo._wired = true;
      geo.addEventListener('input', function() {
        counter.textContent = geo.value.length;
      });
    }
  }

  function updateUI() {
    var cards = document.querySelectorAll('#ait-iq-form .fq-card');
    var bar = document.getElementById('ait-iq-bar');
    var label = document.getElementById('ait-iq-step-label');
    var backBtn = document.getElementById('ait-iq-back');
    if (!cards.length) return;

    // Progress bar
    var pct = (_step / TOTAL_STEPS) * 100;
    if (bar) bar.style.width = pct + '%';
    if (label) label.textContent = 'Question ' + Math.min(_step + 1, TOTAL_STEPS) + ' of ' + TOTAL_STEPS;

    // Dots
    var dots = document.querySelectorAll('.ait-iq-dot');
    dots.forEach(function(dot, i) {
      dot.classList.remove('ait-iq-dot-active', 'ait-iq-dot-done');
      if (i < _step) dot.classList.add('ait-iq-dot-done');
      else if (i === _step) dot.classList.add('ait-iq-dot-active');
    });

    // Cards
    cards.forEach(function(card, i) {
      card.classList.remove('fq-card-active', 'fq-card-done', 'fq-card-next');
      if (i < _step) card.classList.add('fq-card-done');
      else if (i === _step) card.classList.add('fq-card-active');
      else card.classList.add('fq-card-next');
    });

    // Back button
    if (backBtn) backBtn.style.display = _step > 0 ? '' : 'none';
  }

  function advance() {
    hideError();
    _step++;
    if (_step >= TOTAL_STEPS) {
      callApi();
    } else {
      updateUI();
    }
  }

  function buildPrompt() {
    return 'You are a marketing strategist specializing in tax resolution referral partnerships. A professional partner has answered questions about their practice. Based on their answers, create a detailed Ideal Client Profile (ICP) that describes the exact type of person they should refer to Community Tax for tax resolution services.\n\n'
      + 'Community Tax facts:\n'
      + '- National IRS tax resolution firm, 15+ years, $2.3B+ resolved\n'
      + '- Services: Offer in Compromise, Installment Agreements, Penalty Abatement, Currently Not Collectible, Innocent Spouse, Lien/Levy Release, Audit Representation\n'
      + '- Minimum qualifying debt: $7,000+\n'
      + '- Investigation fee: $295 ($500 business)\n'
      + '- Partner commission: $1,500-$4,000+ per closed case\n\n'
      + 'PARTNER ANSWERS:\n'
      + '1. Practice type: ' + (_answers.practice || 'Not provided') + '\n'
      + '2. Client base: ' + (_answers.clients || 'Not provided') + '\n'
      + '3. Common pain points: ' + (_answers.pain_points || 'Not provided') + '\n'
      + '4. Client financial scale: ' + (_answers.scale || 'Not provided') + '\n'
      + '5. Geography: ' + (_answers.geography || 'Not provided') + '\n'
      + '6. Primary motivation: ' + (_answers.motivation || 'Not provided') + '\n\n'
      + 'Respond in EXACTLY 7 sections separated by "---SECTION---":\n\n'
      + 'SECTION 1 -- JSON (no other text):\n'
      + '{"icp_title": "short descriptive title for the ideal client e.g. The Overwhelmed Small Business Owner", "icp_tagline": "one sentence summary of who this person is", "fit_score": "HIGH or MEDIUM", "commission_range": "$X,XXX - $X,XXX per case", "referral_frequency": "X-X per month estimate"}\n\n'
      + 'SECTION 2 -- WHO THEY ARE (3-4 paragraphs, use <b>bold</b> for key terms, no markdown/asterisks):\n'
      + 'Paint a vivid picture of this ideal client. Demographics, life situation, financial behavior, how they ended up with tax debt. Be specific to the partner\'s practice type and client base. Make it feel like a real person they would recognize in their office.\n\n'
      + 'SECTION 3 -- RED FLAGS TO WATCH FOR (6-8 items, each as: <b>Signal:</b> description):\n'
      + 'Specific behavioral and situational signals this partner would notice in their day-to-day work. Things clients say, documents that reveal issues, behaviors during meetings. Make these practical and recognizable.\n\n'
      + 'SECTION 4 -- HOW TO BRING IT UP (4-5 conversation starters, each as: <b>Trigger:</b> one line describing the situation, then <b>Script:</b> exact words to say):\n'
      + 'Natural, non-salesy ways to introduce Community Tax during real interactions. Match the partner\'s practice type. Include the $295 investigation fee mention in at least one script.\n\n'
      + 'SECTION 5 -- WHY THEY CONVERT (3-4 paragraphs, use <b>bold</b> for key terms):\n'
      + 'Explain why this specific client type tends to move forward with resolution. Connect their pain points to Community Tax\'s services. Address the partner\'s motivation.\n\n'
      + 'SECTION 6 -- DISQUALIFIERS (4-6 items, each as: <b>Warning:</b> description):\n'
      + 'Clients who look like good referrals but are NOT. Save the partner time by flagging situations that won\'t convert or aren\'t a good fit. Be specific.\n\n'
      + 'SECTION 7 -- 30-DAY ACTION PLAN (8-10 numbered tasks, each as: <b>Day X-Y:</b> specific action):\n'
      + 'A concrete, day-by-day plan for the partner to start identifying and referring ideal clients. Include reviewing current client list, setting up tracking, having first conversations, and following up. Match their practice type.';
  }

  async function callApi() {
    if (!CTAX_API_KEY) {
      if (!promptForApiKey()) {
        _step = TOTAL_STEPS - 1;
        updateUI();
        return;
      }
    }

    // Swap to loading state
    document.getElementById('ait-iq-form').style.display = 'none';
    document.getElementById('ait-iq-loading').style.display = 'block';
    document.getElementById('ait-iq-output').style.display = 'none';

    // Rotating loading messages
    var msgEl = document.getElementById('ait-iq-loading-msg');
    var msgIdx = 0;
    var msgInterval = setInterval(function() {
      msgIdx = (msgIdx + 1) % LOADING_MSGS.length;
      if (msgEl) msgEl.textContent = LOADING_MSGS[msgIdx];
    }, 2800);

    try {
      var resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: getApiHeaders(),
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2000,
          messages: [{ role: 'user', content: buildPrompt() }]
        })
      });

      if (!resp.ok) {
        throw new Error(resp.status === 401 ? '401' : 'API returned ' + resp.status);
      }

      var data = await resp.json();
      if (data.error) throw new Error(data.error.message || 'API error');

      var text = data.content && data.content[0] ? data.content[0].text : '';
      if (!text) throw new Error('Empty response');

      clearInterval(msgInterval);
      parseAndRender(text);

    } catch (err) {
      clearInterval(msgInterval);
      document.getElementById('ait-iq-loading').style.display = 'none';
      document.getElementById('ait-iq-form').style.display = 'block';
      _step = TOTAL_STEPS - 1;
      updateUI();

      var isAuth = err.message && err.message.indexOf('401') !== -1;
      var msg = isAuth
        ? 'Invalid API key. Please check your key and try again.'
        : 'Unable to generate your ICP right now. Please try again in a moment.';
      showError(msg);
    }
  }

  function parseAndRender(text) {
    var parts = text.split('---SECTION---');

    // Section 1: JSON metadata
    var jsonRaw = (parts[0] || '').trim();
    _icpData = {
      icp_title: 'Your Ideal Client',
      icp_tagline: 'A personalized profile based on your practice.',
      fit_score: 'HIGH',
      commission_range: '$1,500 - $4,000',
      referral_frequency: '2-5 per month'
    };
    try {
      var jm = jsonRaw.match(/\{[\s\S]*\}/);
      if (jm) {
        var parsed = JSON.parse(jm[0]);
        _icpData = {
          icp_title: parsed.icp_title || _icpData.icp_title,
          icp_tagline: parsed.icp_tagline || _icpData.icp_tagline,
          fit_score: parsed.fit_score || _icpData.fit_score,
          commission_range: parsed.commission_range || _icpData.commission_range,
          referral_frequency: parsed.referral_frequency || _icpData.referral_frequency
        };
      }
    } catch (e) { /* use defaults */ }

    // Sections 2-7
    _sections = {
      who: (parts[1] || '').trim(),
      flags: (parts[2] || '').trim(),
      convo: (parts[3] || '').trim(),
      convert: (parts[4] || '').trim(),
      disqualify: (parts[5] || '').trim(),
      actionPlan: (parts[6] || '').trim()
    };

    renderOutput();
  }

  function renderOutput() {
    // Swap to output state
    document.getElementById('ait-iq-loading').style.display = 'none';
    document.getElementById('ait-iq-output').style.display = 'block';

    // Header
    var badgeClass = _icpData.fit_score === 'HIGH' ? 'ait-iq-fit-high' : 'ait-iq-fit-medium';
    var headerEl = document.getElementById('ait-iq-result-header');
    headerEl.innerHTML =
      '<h2 class="ait-iq-result-title">' + esc(_icpData.icp_title) + '</h2>' +
      '<p class="ait-iq-result-tagline">' + esc(_icpData.icp_tagline) + '</p>' +
      '<div class="ait-iq-result-meta">' +
        '<span class="ait-iq-fit-badge ' + badgeClass + '">' + esc(_icpData.fit_score) + ' FIT</span>' +
        '<span class="ait-iq-meta-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg> ' + esc(_icpData.commission_range) + '</span>' +
        '<span class="ait-iq-meta-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg> ' + esc(_icpData.referral_frequency) + '</span>' +
      '</div>';

    // Tab panels
    document.getElementById('ait-iq-panel-who').innerHTML = formatSection(_sections.who);
    document.getElementById('ait-iq-panel-flags').innerHTML = formatSection(_sections.flags);
    document.getElementById('ait-iq-panel-convo').innerHTML = formatSection(_sections.convo);
    document.getElementById('ait-iq-panel-convert').innerHTML = formatSection(_sections.convert);
    document.getElementById('ait-iq-panel-disqualify').innerHTML = formatSection(_sections.disqualify);

    // Action Plan
    var apEl = document.getElementById('ait-iq-action-plan');
    apEl.innerHTML =
      '<div class="ait-iq-ap-head">' +
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>' +
        '<span>30-Day Action Plan</span>' +
      '</div>' +
      '<div class="ait-iq-ap-body">' + formatSection(_sections.actionPlan) + '</div>';

    // Reset tabs to first
    icpSwitchTab('who');
  }

  function formatSection(html) {
    if (!html) return '<p style="color:rgba(255,255,255,0.5);font-style:italic">No content generated for this section.</p>';
    // The AI returns HTML with <b> tags, we just need to wrap in paragraphs
    // Split on double newlines for paragraph breaks
    var paragraphs = html.split(/\n\n+/);
    return paragraphs.map(function(p) {
      var trimmed = p.trim();
      if (!trimmed) return '';
      // If it already contains block-level elements, don't wrap
      if (trimmed.indexOf('<b>') === 0 || trimmed.indexOf('<p>') === 0) {
        return '<div class="ait-iq-content-block">' + trimmed.replace(/\n/g, '<br>') + '</div>';
      }
      return '<p class="ait-iq-content-p">' + trimmed.replace(/\n/g, '<br>') + '</p>';
    }).join('');
  }

  function esc(t) {
    if (!t) return '';
    return t.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function showError(msg) {
    var el = document.getElementById('ait-iq-error');
    if (el) {
      el.innerHTML = msg + ' <a href="#" onclick="this.parentElement.style.display=\'none\';return false" style="color:var(--sky);text-decoration:underline;margin-left:8px">Dismiss</a>';
      el.style.display = 'block';
    }
  }

  function hideError() {
    var el = document.getElementById('ait-iq-error');
    if (el) el.style.display = 'none';
  }

  // ---- PDF Builder ----
  // Follows playbook: 816px container, 1056px cover, css-only pagebreaks

  function buildPdfDoc() {
    var doc = document.createElement('div');
    doc.className = 'icp-pdf-doc';

    var today = new Date();
    var dateStr = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    // Page 1: Cover
    var cover = document.createElement('div');
    cover.className = 'icp-pdf-cover';
    cover.innerHTML =
      '<div class="icp-pdf-cover-inner">' +
        '<div class="icpd-eyebrow">Ideal Client Profile</div>' +
        '<h1 class="icpd-cover-title">' + esc(_icpData.icp_title) + '</h1>' +
        '<p class="icpd-cover-tagline">' + esc(_icpData.icp_tagline) + '</p>' +
        '<div class="icpd-cover-meta">' +
          '<div class="icpd-meta-box"><div class="icpd-meta-label">Partner Fit</div><div class="icpd-meta-val">' + esc(_icpData.fit_score) + '</div></div>' +
          '<div class="icpd-meta-box"><div class="icpd-meta-label">Commission Range</div><div class="icpd-meta-val">' + esc(_icpData.commission_range) + '</div></div>' +
          '<div class="icpd-meta-box"><div class="icpd-meta-label">Referral Frequency</div><div class="icpd-meta-val">' + esc(_icpData.referral_frequency) + '</div></div>' +
          '<div class="icpd-meta-box"><div class="icpd-meta-label">Generated</div><div class="icpd-meta-val">' + dateStr + '</div></div>' +
        '</div>' +
        '<div class="icpd-cover-footer">Generated by Community Tax Partner AI Tools</div>' +
      '</div>';
    doc.appendChild(cover);

    // Page 2: Who They Are + Why They Convert (first body page)
    var page2 = document.createElement('div');
    page2.className = 'icpd-page icpd-first';
    page2.innerHTML =
      '<h2 class="icpd-section-title">Who Is Your Ideal Client?</h2>' +
      '<div class="icpd-section-body">' + formatPdfSection(_sections.who) + '</div>' +
      '<div class="icpd-divider"></div>' +
      '<h2 class="icpd-section-title">Why They Convert</h2>' +
      '<div class="icpd-section-body">' + formatPdfSection(_sections.convert) + '</div>';
    doc.appendChild(page2);

    // Page 3: Red Flags + Disqualifiers
    var page3 = document.createElement('div');
    page3.className = 'icpd-page';
    page3.innerHTML =
      '<h2 class="icpd-section-title">Red Flags to Watch For</h2>' +
      '<div class="icpd-section-body">' + formatPdfSection(_sections.flags) + '</div>' +
      '<div class="icpd-divider"></div>' +
      '<h2 class="icpd-section-title">Disqualifiers</h2>' +
      '<div class="icpd-section-body icpd-disqualifiers">' + formatPdfSection(_sections.disqualify) + '</div>';
    doc.appendChild(page3);

    // Page 4: Conversation Starters
    var page4 = document.createElement('div');
    page4.className = 'icpd-page';
    page4.innerHTML =
      '<h2 class="icpd-section-title">How to Bring It Up</h2>' +
      '<div class="icpd-section-body">' + formatPdfSection(_sections.convo) + '</div>';
    doc.appendChild(page4);

    // Page 5: 30-Day Action Plan
    var page5 = document.createElement('div');
    page5.className = 'icpd-page';
    page5.innerHTML =
      '<h2 class="icpd-section-title">Your 30-Day Action Plan</h2>' +
      '<div class="icpd-section-body">' + formatPdfSection(_sections.actionPlan) + '</div>' +
      '<div class="icpd-closing">' +
        '<div class="icpd-closing-inner">' +
          '<strong>You now have a clear picture of your ideal referral client.</strong><br>' +
          'Start with Week 1 of the action plan. Every conversation is an opportunity. Your clients already have these problems -- now you know how to spot them and what to say.' +
        '</div>' +
      '</div>';
    doc.appendChild(page5);

    return doc;
  }

  function formatPdfSection(html) {
    if (!html) return '<p>No content available.</p>';
    // Convert AI output to clean PDF paragraphs
    var paragraphs = html.split(/\n\n+/);
    return paragraphs.map(function(p) {
      var trimmed = p.trim();
      if (!trimmed) return '';
      return '<div class="icpd-block">' + trimmed.replace(/\n/g, '<br>') + '</div>';
    }).join('');
  }

})();
