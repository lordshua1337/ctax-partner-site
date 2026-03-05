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

  // Demo response for when API is unavailable or for showcase
  var DEMO_RESPONSE = '{"icp_title": "The Overwhelmed Small Business Owner", "icp_tagline": "A self-employed professional drowning in IRS notices who trusts their CPA but doesn\'t know where to turn for resolution help.", "fit_score": "HIGH", "commission_range": "$2,500 - $4,000 per case", "referral_frequency": "3-5 per month"}'
    + '\n---SECTION---\n'
    + '<b>Your ideal referral client</b> is a small business owner -- typically a sole proprietor or single-member LLC -- earning between $75K and $200K annually. They\'re in their mid-30s to early 50s, running a service-based business like a contracting firm, consulting practice, or local retail operation. They\'re hardworking, but their bookkeeping has fallen behind, and now the IRS has come knocking.\n\n'
    + 'This person has <b>unfiled returns from at least two years</b>, and their tax debt has quietly ballooned to $15K-$50K or more. They may have received CP14 notices, or even a CP504 (intent to levy). They\'re stressed, embarrassed, and avoiding the problem because they don\'t know what to do. They see their CPA as a trusted advisor -- not just a tax preparer -- and they\'re waiting for someone to tell them there\'s a path forward.\n\n'
    + 'What makes this client especially valuable is that <b>they have income and assets</b> -- they\'re not judgment-proof. They can afford the $295 investigation fee without blinking, and their case is complex enough to generate strong resolution revenue. They\'re also likely to refer other business owners in their network once they see how the process works.'
    + '\n---SECTION---\n'
    + '<b>Signal:</b> Client mentions they "haven\'t gotten around to" filing for one or more years -- this casual language often masks significant anxiety about accumulated penalties.\n\n'
    + '<b>Signal:</b> During routine tax prep, you discover estimated tax payments were missed for multiple quarters -- a pattern that suggests growing cash flow problems and potential IRS balances.\n\n'
    + '<b>Signal:</b> Client asks about payment plans or "what happens if I can\'t pay" during a meeting about something else entirely -- they\'re testing the waters.\n\n'
    + '<b>Signal:</b> You notice IRS correspondence in their documents -- CP14, CP501, CP504, or LT11 notices they haven\'t opened or have been ignoring.\n\n'
    + '<b>Signal:</b> Client recently went through a major life event (divorce, business closure, health crisis) and mentions "the IRS situation" in passing as one of many problems they\'re juggling.\n\n'
    + '<b>Signal:</b> Payroll tax deposits have been inconsistent or missed -- a serious red flag that can escalate to trust fund recovery penalties against the owner personally.'
    + '\n---SECTION---\n'
    + '<b>Trigger:</b> You\'re reviewing a client\'s financials and notice unfiled returns.\n<b>Script:</b> "I see we\'re missing returns for 2022 and 2023. That\'s actually more common than you\'d think, especially for business owners. I work with a national firm called Community Tax that specializes in exactly this -- they can negotiate with the IRS on your behalf and usually get penalties reduced significantly. Their initial review is only $295. Want me to connect you?"\n\n'
    + '<b>Trigger:</b> Client brings up an IRS notice they received.\n<b>Script:</b> "These notices can feel scary, but they\'re actually pretty routine to resolve when you have the right team. I partner with Community Tax -- they\'ve resolved over $2.3 billion in tax debt. They can look at your full situation for $295 and tell you exactly what your options are. Would it help if I made an introduction?"\n\n'
    + '<b>Trigger:</b> Client asks about setting up a payment plan with the IRS.\n<b>Script:</b> "Before you set up a payment plan on your own, it\'s worth having a resolution specialist look at your case. Sometimes there are better options -- like an Offer in Compromise or Currently Not Collectible status -- that could save you thousands. I work with Community Tax for situations like this. They\'d do a $295 investigation to map out your best path."\n\n'
    + '<b>Trigger:</b> Year-end planning meeting reveals significant tax liability.\n<b>Script:</b> "Based on what I\'m seeing, your total exposure could be significant once penalties and interest are factored in. I want to make sure you have the best options on the table. I partner with Community Tax for exactly these situations -- they handle the IRS directly and have a strong track record. Can I set up a quick call for you?"'
    + '\n---SECTION---\n'
    + '<b>These clients convert because the pain is real and immediate.</b> Unlike theoretical financial planning, tax debt creates concrete, escalating consequences -- wage garnishment, bank levies, liens on property. Your clients are already feeling this pressure. When you offer a specific, credible path to resolution, the relief is palpable.\n\n'
    + '<b>The trusted advisor effect is your biggest advantage.</b> These clients already trust you. When their CPA says "I work with a firm that handles this," it carries more weight than any Google ad or cold call ever could. You\'re not selling -- you\'re recommending. That distinction is why partner referrals close at 3-4x the rate of direct marketing leads.\n\n'
    + '<b>The $295 investigation fee removes the biggest barrier.</b> Clients who owe $20K+ to the IRS are terrified of hearing "it\'ll cost $5,000 to fix this." The low investigation fee lets them take the first step without committing to a major expense. Once they see their options laid out clearly, 80%+ move forward with resolution -- which is where your $2,500-$4,000 commission per case comes in.'
    + '\n---SECTION---\n'
    + '<b>Warning:</b> Client owes less than $7,000 total -- below Community Tax\'s minimum threshold. These cases don\'t generate enough resolution fees to justify the engagement. Better to help them set up an IRS payment plan directly.\n\n'
    + '<b>Warning:</b> Client is actively in bankruptcy proceedings -- tax debt may be dischargeable or handled by the bankruptcy trustee. Refer to a tax attorney first to determine if resolution services are appropriate.\n\n'
    + '<b>Warning:</b> Client has no income and no assets (truly judgment-proof) -- while they may technically qualify, they\'re unlikely to pay the investigation fee or follow through. Focus on clients who have the means to engage.\n\n'
    + '<b>Warning:</b> Client is already working with another tax resolution firm -- double representation creates conflicts and delays. If they\'re unhappy with their current firm, they need to formally disengage first.'
    + '\n---SECTION---\n'
    + '<b>Week 1:</b> Audit your existing client base. Pull a list of all active clients who had balances due on their last return, unfiled years, or mentioned IRS issues in the past 12 months. Flag the top 15-20 most likely referral candidates and organize them by urgency level.\n\n'
    + '<b>Week 2:</b> Deep-dive into your top 10 flagged client files. Note specific situations, estimated debt amounts, and the best conversation entry point for each. Create a one-page cheat sheet for each client with their trigger points and the most relevant script from the Conversation Starters section.\n\n'
    + '<b>Week 3:</b> Set up your referral tracking system. Create a spreadsheet or CRM tag for "IRS referral candidate" with columns for: client name, trigger observed, conversation date, response, follow-up date, referral status. This becomes your operating dashboard for the rest of the program.\n\n'
    + '<b>Week 4:</b> Have your first 3-4 referral conversations. Start with clients you have the strongest relationships with -- they\'ll be most receptive and give you confidence. Use the scripts from the Conversation Starters section. Log every interaction in your tracker.\n\n'
    + '<b>Week 5:</b> Follow up with any clients from Week 4 who expressed interest but didn\'t commit. A simple "I wanted to check in on that IRS situation we discussed" converts at 2x the rate of first mentions. Also have 2-3 new conversations with your next batch of flagged clients.\n\n'
    + '<b>Week 6:</b> Expand your awareness beyond the flagged list. During every routine meeting this week, actively listen for the red flag signals from your profile. Even a brief mention of "IRS" or "back taxes" is an opening. Track how many signals you catch -- aim for at least 5.\n\n'
    + '<b>Week 7:</b> Launch your first outbound email campaign. Send a targeted email to 20-30 clients who haven\'t been in recently: "As we approach [quarter/year-end], I wanted to check in. If you have any outstanding IRS matters, I now work with a resolution specialist who can help." Track open rates and responses.\n\n'
    + '<b>Week 8:</b> Review your first month of data. Count conversations had, referrals submitted, and clients who engaged with Community Tax. Calculate your conversion rate at each stage. Identify which scripts and triggers work best for your specific practice and client base.\n\n'
    + '<b>Week 9:</b> Double down on what\'s working. If email outreach is driving responses, send a second wave. If in-person conversations convert better, prioritize those. Refine your scripts based on real feedback. Have at least 4-5 new referral conversations this week.\n\n'
    + '<b>Week 10:</b> Build your repeatable monthly system. Based on 9 weeks of data, define your standard monthly rhythm: how many clients to contact, which channels to use, when to follow up. Document this as a simple checklist you can repeat every month without thinking.\n\n'
    + '<b>Week 11:</b> Set your quarterly goals. Based on your conversion rates, calculate how many conversations per month yield your target number of referrals. Set realistic but ambitious targets for the next 3 months. Share your goals with your team if applicable.\n\n'
    + '<b>Week 12:</b> Final review and optimization. Compile your full 12-week results: total conversations, referrals submitted, cases closed, commission earned. Identify your top 3 lessons learned and 3 areas to improve. You should now be on track for 3-5 referrals per month consistently.';

  var LOADING_MSGS = [
    'Analyzing your practice profile...',
    'Identifying ideal client characteristics...',
    'Building red flag indicators...',
    'Crafting conversation starters...',
    'Mapping conversion patterns...',
    'Building your 12-week strategy...'
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

    // Find and activate the clicked tab by data-tab attribute
    tabs.forEach(function(t) {
      if (t.getAttribute('data-tab') === id) {
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

  window.icpLoadDemo = function() {
    hideError();
    document.getElementById('ait-iq-form').style.display = 'none';
    document.getElementById('ait-iq-loading').style.display = 'none';
    parseAndRender(DEMO_RESPONSE);
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
        scrollY: -window.scrollY,
        backgroundColor: '#ffffff'
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

  // Generate starfield
  window._aitInitStars = function() {
    var container = document.getElementById('ait-stars');
    if (!container || container.childNodes.length > 0) return;
    var count = 120;
    var frag = document.createDocumentFragment();
    for (var i = 0; i < count; i++) {
      var star = document.createElement('div');
      var isLarge = Math.random() < 0.18;
      star.className = 'ait-star' + (isLarge ? ' ait-star-lg' : '');
      star.style.left = (Math.random() * 100) + '%';
      star.style.top = (Math.random() * 100) + '%';
      star.style.setProperty('--dur', (1.5 + Math.random() * 3.5).toFixed(1) + 's');
      star.style.setProperty('--lo', (0.08 + Math.random() * 0.12).toFixed(2));
      star.style.setProperty('--hi', (0.5 + Math.random() * 0.5).toFixed(2));
      star.style.animationDelay = (Math.random() * -5).toFixed(1) + 's';
      // Subtle blue/white color variation
      if (Math.random() < 0.25) {
        star.style.background = 'rgba(75,163,255,' + (0.6 + Math.random() * 0.4).toFixed(2) + ')';
      } else if (Math.random() < 0.1) {
        star.style.background = 'rgba(0,200,224,' + (0.5 + Math.random() * 0.4).toFixed(2) + ')';
      }
      frag.appendChild(star);
    }
    container.appendChild(frag);

    // Shooting stars (periodic)
    function spawnShootingStar() {
      var ss = document.createElement('div');
      ss.className = 'ait-shooting-star';
      ss.style.top = (Math.random() * 60) + '%';
      ss.style.left = (Math.random() * 40 + 30) + '%';
      ss.style.setProperty('--angle', (15 + Math.random() * 30) + 'deg');
      container.appendChild(ss);
      setTimeout(function() { ss.remove(); }, 1200);
    }
    setInterval(function() {
      if (Math.random() < 0.5) spawnShootingStar();
    }, 4000);
  };

  // Immersive snap-scroll experience.
  // Two-scroll pacing: requires 2 wheel events to advance.
  // 3D card tilt on mousemove for holo cards.
  // One-way scroll: no going back.
  // Builder section releases snap for free-scroll.
  window._aitInitScrollReveal = function() {
    if (window._aitInitStars) window._aitInitStars();

    var container = document.getElementById('ait-snap-container');
    if (!container) return;

    // Enter immersive mode
    document.body.classList.add('ait-immersive-active');

    var sections = container.querySelectorAll('.ait-snap-section');
    if (!sections.length) return;

    var builderSection = document.querySelector('.ait-snap-section-builder');
    var builderTop = builderSection ? builderSection.offsetTop : Infinity;
    var inBuilder = false;
    var currentIdx = 0;
    var scrollCount = 0;
    var scrollTimer = null;
    var isScrolling = false;

    // IntersectionObserver for fade-in animations + tracking current section
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        var content = entry.target.querySelector('.ait-snap-content');
        if (!content) return;

        if (entry.isIntersecting) {
          // Track which section we're on
          var idx = Array.prototype.indexOf.call(sections, entry.target);
          if (idx >= 0) currentIdx = idx;

          setTimeout(function() {
            content.classList.add('ait-snap-visible');
          }, 80);
        } else {
          content.classList.remove('ait-snap-visible');
        }
      });
    }, {
      root: container,
      threshold: 0.6
    });

    sections.forEach(function(section) {
      observer.observe(section);
    });

    // When builder section is reached, disable snap for free-scroll
    if (builderSection) {
      var builderObs = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting && !inBuilder) {
            inBuilder = true;
            container.style.scrollSnapType = 'none';
          }
        });
      }, { root: container, threshold: 0.2 });
      builderObs.observe(builderSection);
    }

    // Two-scroll pacing: prevent default wheel, count events,
    // advance to next section only after 2 scroll-downs.
    container.addEventListener('wheel', function(e) {
      e.preventDefault();

      // In builder zone, allow free scrolling (but not backward past builder)
      if (inBuilder) {
        if (e.deltaY < 0 && container.scrollTop <= builderTop + 10) {
          return;
        }
        container.scrollTop += e.deltaY;
        return;
      }

      // Block backward scroll entirely (one-way ride)
      if (e.deltaY < 0) return;

      // Block during animated scroll
      if (isScrolling) return;

      // Count scroll events
      scrollCount++;
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(function() { scrollCount = 0; }, 600);

      // Require 2 wheel events to advance
      if (scrollCount >= 2) {
        scrollCount = 0;
        var nextIdx = Math.min(currentIdx + 1, sections.length - 1);
        if (nextIdx !== currentIdx) {
          isScrolling = true;
          sections[nextIdx].scrollIntoView({ behavior: 'smooth', block: 'start' });
          setTimeout(function() { isScrolling = false; }, 700);
        }
      }
    }, { passive: false });

    // Touch: prevent swipe-up (mobile), allow swipe-down
    var touchStartY = 0;
    container.addEventListener('touchstart', function(e) {
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    container.addEventListener('touchmove', function(e) {
      var isScrollingUp = e.touches[0].clientY > touchStartY;
      if (isScrollingUp && !inBuilder) {
        e.preventDefault();
      }
      if (isScrollingUp && inBuilder && container.scrollTop <= builderTop + 10) {
        e.preventDefault();
      }
    }, { passive: false });

    // 3D card tilt on mousemove
    var tiltCards = document.querySelectorAll('[data-tilt]');
    tiltCards.forEach(function(card) {
      var inner = card.querySelector('.ait-holo-inner');
      if (!inner) return;

      card.addEventListener('mousemove', function(e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width;
        var y = (e.clientY - rect.top) / rect.height;
        var rotX = (0.5 - y) * 20;
        var rotY = (x - 0.5) * 20;
        inner.style.transform = 'rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg)';
      });

      card.addEventListener('mouseleave', function() {
        inner.style.transform = 'rotateX(0deg) rotateY(0deg)';
      });
    });
  };

  // Exit the immersive experience
  window.aitExitImmersive = function() {
    document.body.classList.remove('ait-immersive-active');
    var container = document.getElementById('ait-snap-container');
    if (container) {
      container.style.scrollSnapType = '';
      container.scrollTop = 0;
    }
    if (typeof showPage === 'function') {
      showPage('dashboard');
    }
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
      + 'Respond in EXACTLY 7 sections separated by "---SECTION---".\n'
      + 'IMPORTANT: Do NOT include section headers like "SECTION 1" or "WHO THEY ARE" in your output. Just write the content directly. The sections are separated ONLY by the ---SECTION--- delimiter.\n\n'
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
      + 'SECTION 7 -- 12-WEEK STRATEGY (12 numbered items, each as: <b>Week X:</b> specific action with 2-3 detail sentences):\n'
      + 'A comprehensive 12-week strategic plan organized into 4 phases:\n'
      + '- Weeks 1-3 (Foundation): Audit existing client base, identify referral candidates, set up tracking systems, build internal knowledge\n'
      + '- Weeks 4-6 (First Conversations): Start having referral conversations, practice scripts, track responses, refine approach\n'
      + '- Weeks 7-9 (Scale Up): Expand outreach, email campaigns, establish monthly referral rhythm, optimize what is working\n'
      + '- Weeks 10-12 (Optimize & Systematize): Review results, build repeatable system, set quarterly goals, plan next quarter\n'
      + 'Each week should have a specific, actionable focus with clear deliverables. Make this feel like a standalone strategic playbook the partner can follow. Be detailed and practical -- this should be genuinely valuable as a standalone product.';
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
      var resp = await fetch(CTAX_API_URL, {
        method: 'POST',
        headers: getApiHeaders(),
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 8000,
          messages: [{ role: 'user', content: buildPrompt() }]
        })
      });

      if (!resp.ok) {
        var errBody = '';
        try { errBody = await resp.text(); } catch(e) {}
        console.error('[ICP] API error body:', errBody);
        throw new Error(resp.status === 401 ? '401' : 'API returned ' + resp.status);
      }

      var data = await resp.json();
      if (data.error) throw new Error(data.error.message || 'API error');

      var text = data.content && data.content[0] ? data.content[0].text : '';
      if (!text) throw new Error('Empty response');

      clearInterval(msgInterval);
      parseAndRender(text);

    } catch (err) {
      console.error('[ICP] Error:', err);
      clearInterval(msgInterval);
      document.getElementById('ait-iq-loading').style.display = 'none';
      document.getElementById('ait-iq-form').style.display = 'block';
      _step = TOTAL_STEPS - 1;
      updateUI();

      var isAuth = err.message && err.message.indexOf('401') !== -1;
      var msg = isAuth
        ? 'Invalid API key. Please check your key and try again.'
        : 'Unable to generate your ICP right now. <a href="#" onclick="icpLoadDemo();return false" style="color:var(--sky);text-decoration:underline;font-weight:600">See a sample result</a> instead.';
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

    // Tab panels with section headers
    document.getElementById('ait-iq-panel-who').innerHTML =
      '<h3 class="ait-iq-panel-title">Who Is Your Ideal Client?</h3>' + formatSection(_sections.who);
    document.getElementById('ait-iq-panel-flags').innerHTML =
      '<h3 class="ait-iq-panel-title">Red Flags to Watch For</h3>' + formatSection(_sections.flags);
    document.getElementById('ait-iq-panel-convo').innerHTML =
      '<h3 class="ait-iq-panel-title">How to Bring It Up</h3>' + formatSection(_sections.convo);
    document.getElementById('ait-iq-panel-convert').innerHTML =
      '<h3 class="ait-iq-panel-title">Why They Convert</h3>' + formatSection(_sections.convert);
    document.getElementById('ait-iq-panel-disqualify').innerHTML =
      '<h3 class="ait-iq-panel-title">Disqualifiers</h3>' + formatSection(_sections.disqualify);

    // Action Plan
    var apEl = document.getElementById('ait-iq-action-plan');
    if (!apEl) { console.warn('[ICP] ait-iq-action-plan element not found'); }
    if (apEl) apEl.innerHTML =
      '<div class="ait-iq-ap-head">' +
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>' +
        '<span>12-Week Strategy</span>' +
      '</div>' +
      '<div class="ait-iq-ap-body">' + formatSection(_sections.actionPlan) + '</div>';

    // Save to Portal button
    var saveBtn = document.getElementById('ait-iq-save-portal');
    if (saveBtn) {
      saveBtn.style.display = 'block';
      saveBtn.onclick = function() {
        if (typeof ICPContext !== 'undefined') {
          var saved = ICPContext.save({
            icp_title: _icpData.icp_title,
            icp_tagline: _icpData.icp_tagline,
            fit_score: _icpData.fit_score,
            commission_range: _icpData.commission_range,
            referral_frequency: _icpData.referral_frequency,
            profession_type: _answers.practice || '',
            answers: {
              q1: _answers.practice || '',
              q2: _answers.clients || '',
              q3: _answers.pain_points || '',
              q4: _answers.scale || '',
              q5: _answers.geography || '',
              q6: _answers.motivation || ''
            },
            sections: {
              who_they_are: _sections.who,
              red_flags: _sections.flags,
              how_to_bring_it_up: _sections.convo,
              why_they_convert: _sections.convert,
              disqualifiers: _sections.disqualify,
              twelve_week_playbook: _sections.actionPlan
            }
          });

          if (saved) {
            saveBtn.textContent = 'Saved to Portal';
            saveBtn.style.background = '#166534';
            saveBtn.style.borderColor = '#166534';
            setTimeout(function() {
              saveBtn.textContent = 'Save to Portal';
              saveBtn.style.background = '';
              saveBtn.style.borderColor = '';
            }, 2000);
          }
        }
      };
    }

    // Reset tabs to first
    icpSwitchTab('who');
  }

  function formatSection(html) {
    if (!html) return '<p style="color:rgba(255,255,255,0.5);font-style:italic">No content generated for this section.</p>';
    // Strip any "SECTION X" / "SECTION X -- TITLE" headers the AI may have included literally
    var cleaned = html
      .replace(/^(?:SECTION\s+\d+\s*(?:[-–—:]+\s*[^\n]*)?\n*)/i, '')
      .replace(/^(?:#+\s+[^\n]*\n*)/i, '')
      .replace(/^\d+\.\s+[^\n]*\n*/i, '')
      .trim();
    if (!cleaned) return '<p style="color:rgba(255,255,255,0.5);font-style:italic">No content generated for this section.</p>';

    // Split on double newlines for blocks
    var blocks = cleaned.split(/\n\n+/);
    var out = '';
    var hasCards = false;

    // Detect if this section uses structured items (Signal/Trigger/Warning/Day patterns)
    blocks.forEach(function(b) {
      var t = b.trim();
      if (!t) return;
      if (/<b>\s*Signal/i.test(t) || /<b>\s*Trigger/i.test(t) || /<b>\s*Warning/i.test(t) || /<b>\s*(?:Day|Week)\s+\d/i.test(t)) {
        hasCards = true;
      }
    });

    if (hasCards) {
      // Render structured items as visual cards
      out += '<div class="ait-iq-items">';
      var itemIdx = 0;
      blocks.forEach(function(b) {
        var t = b.trim();
        if (!t) return;
        itemIdx++;

        // Detect item type for accent color
        var type = 'default';
        if (/<b>\s*Signal/i.test(t)) type = 'signal';
        else if (/<b>\s*Trigger/i.test(t)) type = 'trigger';
        else if (/<b>\s*Warning/i.test(t)) type = 'warning';
        else if (/<b>\s*(?:Day|Week)\s+\d/i.test(t)) type = 'day';

        if (type !== 'default') {
          // Split label from body at first </b> or first newline
          var labelHtml = '';
          var bodyHtml = t;

          // For Trigger/Script pairs, split into two parts
          if (type === 'trigger' && t.indexOf('<b>Script:</b>') !== -1) {
            var triggerParts = t.split(/<b>Script:<\/b>/i);
            var triggerLabel = triggerParts[0].replace(/<b>Trigger:<\/b>/i, '').trim().replace(/\n/g, ' ');
            var scriptBody = (triggerParts[1] || '').trim().replace(/\n/g, '<br>');
            out += '<div class="ait-iq-item ait-iq-item-' + type + '">'
              + '<div class="ait-iq-item-number">' + itemIdx + '</div>'
              + '<div class="ait-iq-item-content">'
              + '<div class="ait-iq-item-label">Situation</div>'
              + '<p class="ait-iq-item-trigger-text">' + triggerLabel + '</p>'
              + '<div class="ait-iq-item-label" style="margin-top:12px">What to Say</div>'
              + '<p class="ait-iq-item-script">' + scriptBody + '</p>'
              + '</div></div>';
          } else {
            // Extract the bold label and the body
            var labelMatch = t.match(/^<b>([^<]+)<\/b>\s*/i);
            if (labelMatch) {
              labelHtml = labelMatch[1].replace(/:$/, '');
              bodyHtml = t.substring(labelMatch[0].length).trim().replace(/\n/g, '<br>');
            } else {
              bodyHtml = t.replace(/\n/g, '<br>');
            }
            out += '<div class="ait-iq-item ait-iq-item-' + type + '">'
              + '<div class="ait-iq-item-number">' + itemIdx + '</div>'
              + '<div class="ait-iq-item-content">'
              + (labelHtml ? '<div class="ait-iq-item-label">' + labelHtml + '</div>' : '')
              + '<p class="ait-iq-item-body">' + bodyHtml + '</p>'
              + '</div></div>';
          }
        } else {
          // Non-structured paragraph inside a structured section
          out += '<p class="ait-iq-content-p">' + t.replace(/\n/g, '<br>') + '</p>';
        }
      });
      out += '</div>';
    } else {
      // Narrative section: render as well-spaced paragraphs with pull-quotes for key insights
      blocks.forEach(function(b, idx) {
        var t = b.trim();
        if (!t) return;
        // Add a subtle lead-in accent on the first paragraph
        var cls = idx === 0 ? 'ait-iq-content-p ait-iq-content-lead' : 'ait-iq-content-p';
        out += '<p class="' + cls + '">' + t.replace(/\n/g, '<br>') + '</p>';
      });
    }

    return out;
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

    // Page 1: Cover (clean black on white)
    var cover = document.createElement('div');
    cover.className = 'icp-pdf-cover';
    cover.innerHTML =
      '<div class="icp-pdf-cover-inner">' +
        '<div class="icpd-eyebrow">IDEAL CLIENT PROFILE</div>' +
        '<h1 class="icpd-cover-title">' + esc(_icpData.icp_title) + '</h1>' +
        '<p class="icpd-cover-tagline">' + esc(_icpData.icp_tagline) + '</p>' +
        '<div class="icpd-cover-meta">' +
          '<div class="icpd-meta-box"><div class="icpd-meta-label">Partner Fit</div><div class="icpd-meta-val">' + esc(_icpData.fit_score) + '</div></div>' +
          '<div class="icpd-meta-box"><div class="icpd-meta-label">Commission Range</div><div class="icpd-meta-val">' + esc(_icpData.commission_range) + '</div></div>' +
          '<div class="icpd-meta-box"><div class="icpd-meta-label">Referral Frequency</div><div class="icpd-meta-val">' + esc(_icpData.referral_frequency) + '</div></div>' +
          '<div class="icpd-meta-box"><div class="icpd-meta-label">Generated</div><div class="icpd-meta-val">' + dateStr + '</div></div>' +
        '</div>' +
        (typeof CTAX_LOGO_BLUE !== 'undefined' ? '<img src="' + CTAX_LOGO_BLUE + '" style="height:28px;margin-bottom:16px" alt="Community Tax">' : '') +
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

    // Page 5: 12-Week Strategy
    var page5 = document.createElement('div');
    page5.className = 'icpd-page';
    page5.innerHTML =
      '<h2 class="icpd-section-title">Your 12-Week Strategy</h2>' +
      '<div class="icpd-section-body">' + formatPdfSection(_sections.actionPlan) + '</div>' +
      '<div class="icpd-closing">' +
        '<div class="icpd-closing-inner">' +
          '<strong>You now have a clear picture of your ideal referral client and a 12-week roadmap to put it into action.</strong><br>' +
          'Start with Week 1. Every conversation is an opportunity. Your clients already have these problems -- now you know how to spot them and what to say.' +
        '</div>' +
      '</div>';
    doc.appendChild(page5);

    return doc;
  }

  function formatPdfSection(html) {
    if (!html) return '<p>No content available.</p>';
    // Strip section headers
    var cleaned = html
      .replace(/^(?:SECTION\s+\d+\s*(?:[-–—:]+\s*[^\n]*)?\n*)/i, '')
      .replace(/^(?:#+\s+[^\n]*\n*)/i, '')
      .replace(/^\d+\.\s+[^\n]*\n*/i, '')
      .trim();
    if (!cleaned) return '<p>No content available.</p>';

    var blocks = cleaned.split(/\n\n+/);
    var hasCards = false;
    blocks.forEach(function(b) {
      if (/<b>\s*(?:Signal|Trigger|Warning|(?:Day|Week)\s+\d)/i.test(b.trim())) hasCards = true;
    });

    if (hasCards) {
      var out = '';
      var idx = 0;
      blocks.forEach(function(b) {
        var t = b.trim();
        if (!t) return;
        idx++;
        // For trigger/script pairs, format distinctly
        if (/<b>\s*Trigger/i.test(t) && t.indexOf('<b>Script:</b>') !== -1) {
          var parts = t.split(/<b>Script:<\/b>/i);
          var trigger = parts[0].replace(/<b>Trigger:<\/b>/i, '').trim();
          var script = (parts[1] || '').trim();
          out += '<div class="icpd-item"><div class="icpd-item-num">' + idx + '.</div>'
            + '<div class="icpd-item-body">'
            + '<div class="icpd-item-label">Situation</div>'
            + '<p style="margin:0 0 8px">' + trigger.replace(/\n/g, ' ') + '</p>'
            + '<div class="icpd-item-label">What to Say</div>'
            + '<p style="margin:0;font-style:italic">' + script.replace(/\n/g, '<br>') + '</p>'
            + '</div></div>';
        } else {
          out += '<div class="icpd-item"><div class="icpd-item-num">' + idx + '.</div>'
            + '<div class="icpd-item-body">' + t.replace(/\n/g, '<br>') + '</div></div>';
        }
      });
      return out;
    }

    return blocks.map(function(p) {
      var trimmed = p.trim();
      if (!trimmed) return '';
      return '<div class="icpd-block">' + trimmed.replace(/\n/g, '<br>') + '</div>';
    }).join('');
  }

})();
