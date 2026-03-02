// -- Page Builder: Client-Facing Copy Dictionary --
// These pages are built by partners and shared with END CLIENTS who have
// tax problems. The partner shares their page URL with people who need
// IRS help. The client visits, reads about how they can get help, and
// applies through the page -- giving the partner credit for the referral.
//
// ALL COPY speaks to the END CLIENT, not to the partner.
// The "persona" determines the context (CPA's client vs realtor's client)
// but the audience is always the person with the tax problem.

var PB_COPY = {

  // ================================================================
  //  HERO COPY -- speaks to end clients with tax issues
  // ================================================================
  hero: {
    cpa: {
      badge: 'Trusted Tax Resolution',
      headline: 'Owe the IRS? There\'s a Path Forward.',
      subtitle: 'Your tax professional connected you with a licensed resolution team that has helped over 50,000 people settle IRS debt, stop penalties, and get a fresh start.',
      cta_primary: 'Get a Free Consultation',
      cta_secondary: 'See How It Works',
      trust_stats: [
        { val: '$2.3B+', label: 'Resolved' },
        { val: '50K+', label: 'Clients Helped' },
        { val: 'A+', label: 'BBB Rating' }
      ]
    },
    attorney: {
      badge: 'Referred by Your Attorney',
      headline: 'IRS Problems Don\'t Fix Themselves. We Do.',
      subtitle: 'Your attorney connected you with our licensed tax resolution team. We negotiate directly with the IRS so you don\'t have to.',
      cta_primary: 'Get a Free Consultation',
      cta_secondary: 'Learn What We Do',
      trust_stats: [
        { val: '$2.3B+', label: 'Resolved' },
        { val: '50K+', label: 'Cases Handled' },
        { val: 'A+', label: 'BBB Rating' }
      ]
    },
    financial_advisor: {
      badge: 'Protect Your Financial Future',
      headline: 'Don\'t Let IRS Debt Destroy Your Wealth.',
      subtitle: 'Your financial advisor connected you with specialists who resolve tax debt, release liens, and protect your assets from IRS enforcement.',
      cta_primary: 'Get a Free Consultation',
      cta_secondary: 'See How It Works',
      trust_stats: [
        { val: '$2.3B+', label: 'Resolved' },
        { val: '50K+', label: 'Clients Helped' },
        { val: '14 Yrs', label: 'Experience' }
      ]
    },
    realtor: {
      badge: 'Clear Your Tax Lien',
      headline: 'IRS Lien Blocking Your Home Sale? We Can Help.',
      subtitle: 'Your real estate agent connected you with a team that specializes in resolving IRS liens so your transaction can move forward.',
      cta_primary: 'Get a Free Consultation',
      cta_secondary: 'Learn How It Works',
      trust_stats: [
        { val: '$2.3B+', label: 'Resolved' },
        { val: '50K+', label: 'Liens Cleared' },
        { val: 'A+', label: 'BBB Rating' }
      ]
    },
    mortgage: {
      badge: 'Get Mortgage-Ready',
      headline: 'Tax Issues Holding Up Your Mortgage? Let\'s Fix That.',
      subtitle: 'Your mortgage professional connected you with tax resolution specialists who clear IRS issues so your loan can move forward.',
      cta_primary: 'Get a Free Consultation',
      cta_secondary: 'Learn How It Works',
      trust_stats: [
        { val: '$2.3B+', label: 'Resolved' },
        { val: '50K+', label: 'Helped' },
        { val: 'A+', label: 'BBB Rating' }
      ]
    },
    insurance: {
      badge: 'Resolve Your Tax Debt',
      headline: 'IRS Debt Is Weighing You Down. We Lift It.',
      subtitle: 'Your insurance professional connected you with licensed tax experts who negotiate with the IRS on your behalf.',
      cta_primary: 'Get a Free Consultation',
      cta_secondary: 'See How It Works',
      trust_stats: [
        { val: '$2.3B+', label: 'Resolved' },
        { val: '50K+', label: 'Helped' },
        { val: 'A+', label: 'BBB Rating' }
      ]
    },
    general: {
      badge: 'Trusted Tax Resolution',
      headline: 'Owe the IRS? You Have Options.',
      subtitle: 'You were referred to a licensed resolution team that has helped over 50,000 people settle IRS debt, stop penalties, and start fresh.',
      cta_primary: 'Get a Free Consultation',
      cta_secondary: 'See How It Works',
      trust_stats: [
        { val: '$2.3B+', label: 'Resolved' },
        { val: '50K+', label: 'Clients Helped' },
        { val: 'A+', label: 'BBB Rating' }
      ]
    }
  },

  // ================================================================
  //  FEATURES COPY -- what Community Tax does for the client
  // ================================================================
  features: {
    cpa: {
      heading: 'How We Resolve Your Tax Problem',
      subtitle: 'Our licensed team handles everything with the IRS so you can move forward with your life.',
      cards: [
        { icon: '&#9878;', title: 'Licensed Professionals', text: 'Enrolled agents and CPAs authorized to represent you directly before the IRS. You never have to call them yourself.' },
        { icon: '&#9733;', title: 'Real Results', text: 'We have resolved over $2.3 billion in tax debt. Offer in Compromise, installment plans, penalty abatement -- we find the right solution for your situation.' },
        { icon: '&#8635;', title: 'Full-Service Resolution', text: 'From unfiled returns to wage garnishments, we handle every aspect of your case from start to finish.' }
      ]
    },
    attorney: {
      heading: 'What We Do for You',
      subtitle: 'Licensed tax professionals who negotiate directly with the IRS on your behalf.',
      cards: [
        { icon: '&#9878;', title: 'IRS Representation', text: 'We speak to the IRS so you don\'t have to. Licensed enrolled agents handle all communication and negotiation.' },
        { icon: '&#9733;', title: 'Proven Track Record', text: 'Over $2.3 billion resolved. We find the right resolution strategy for your specific situation.' },
        { icon: '&#8635;', title: 'End-to-End Service', text: 'Tax returns, debt negotiation, lien release, garnishment stop -- we handle the entire process.' }
      ]
    },
    financial_advisor: {
      heading: 'Protect Your Assets from the IRS',
      subtitle: 'We resolve tax debt before it damages your financial future.',
      cards: [
        { icon: '&#9733;', title: 'Stop Enforcement', text: 'Tax liens, levies, and garnishments can seize your assets. We intervene to stop IRS collection actions.' },
        { icon: '&#9878;', title: 'Licensed Specialists', text: 'EAs and CPAs who focus exclusively on IRS resolution. This is all we do.' },
        { icon: '&#8635;', title: 'Protect Your Wealth', text: 'We negotiate settlements, payment plans, and penalty relief to minimize the impact on your finances.' }
      ]
    },
    realtor: {
      heading: 'How We Clear Tax Liens',
      subtitle: 'We work directly with the IRS to release or subordinate liens blocking your real estate transaction.',
      cards: [
        { icon: '&#9733;', title: 'Lien Release', text: 'We negotiate with the IRS to release federal tax liens so your sale or purchase can proceed.' },
        { icon: '&#9878;', title: 'Licensed Professionals', text: 'Enrolled agents authorized to represent you before the IRS handle all negotiation.' },
        { icon: '&#8635;', title: 'Fast Resolution', text: 'We understand that closing dates don\'t wait. Our team prioritizes time-sensitive cases.' }
      ]
    },
    mortgage: {
      heading: 'Clear Tax Issues. Close Your Loan.',
      subtitle: 'We resolve the IRS problems preventing your mortgage approval.',
      cards: [
        { icon: '&#9733;', title: 'File Unfiled Returns', text: 'Missing tax returns are the number one reason mortgages get denied. We prepare and file them.' },
        { icon: '&#9878;', title: 'Resolve Tax Debt', text: 'Outstanding IRS balances can block underwriting. We negotiate resolution to get you cleared.' },
        { icon: '&#8635;', title: 'Get Compliant Fast', text: 'Our team works efficiently because we know your mortgage timeline matters.' }
      ]
    },
    insurance: {
      heading: 'How We Resolve Your Tax Debt',
      subtitle: 'Licensed professionals who negotiate with the IRS on your behalf.',
      cards: [
        { icon: '&#9878;', title: 'Licensed Team', text: 'Enrolled agents and CPAs represent you directly before the IRS. You never have to make the call.' },
        { icon: '&#9733;', title: '$2.3 Billion Resolved', text: 'We find the right solution for your situation -- settlements, payment plans, penalty relief.' },
        { icon: '&#8635;', title: 'Complete Service', text: 'From investigation to resolution, we handle your entire case. One team, start to finish.' }
      ]
    },
    general: {
      heading: 'How We Resolve Your Tax Problem',
      subtitle: 'Licensed professionals who handle everything with the IRS so you don\'t have to.',
      cards: [
        { icon: '&#9878;', title: 'Licensed Professionals', text: 'Enrolled agents and CPAs authorized to represent you directly before the IRS.' },
        { icon: '&#9733;', title: 'Real Results', text: 'Over $2.3 billion in tax debt resolved. We find the right solution for your situation.' },
        { icon: '&#8635;', title: 'Full-Service Resolution', text: 'Unfiled returns, liens, levies, garnishments -- we handle it all from start to finish.' }
      ]
    }
  },

  // ================================================================
  //  FAQ COPY -- answers for end clients
  // ================================================================
  faq: {
    cpa: {
      heading: 'Frequently Asked Questions',
      subtitle: 'What you need to know about resolving your tax situation.',
      items: [
        { q: 'How much does it cost to get help?', a: 'We offer a free consultation to assess your situation. Resolution fees depend on the complexity of your case and are discussed upfront with no hidden costs.' },
        { q: 'Can you really reduce what I owe the IRS?', a: 'In many cases, yes. Through programs like Offer in Compromise, penalty abatement, and currently not collectible status, we negotiate to reduce or restructure what you owe.' },
        { q: 'Will the IRS stop contacting me?', a: 'Once we are authorized to represent you, all IRS communication goes through our team. You deal with us, not the IRS.' },
        { q: 'How long does the process take?', a: 'Most cases resolve in 3-6 months. We keep you informed at every stage with regular status updates.' }
      ]
    },
    attorney: {
      heading: 'Frequently Asked Questions',
      subtitle: 'Common questions about the tax resolution process.',
      items: [
        { q: 'What can you do that I can\'t do myself?', a: 'We are licensed to represent you before the IRS. We know the programs, the timelines, and the negotiation strategies that get results. Most people who try to resolve on their own miss options that could save them thousands.' },
        { q: 'Is this legitimate?', a: 'Absolutely. Community Tax is a licensed, A+ BBB-rated tax resolution firm with over $2.3 billion resolved. Your attorney referred you because they trust our work.' },
        { q: 'How much does it cost?', a: 'We offer a free consultation. Resolution fees are discussed upfront based on your situation -- no surprises.' },
        { q: 'How long does it take?', a: 'Most cases resolve in 3-6 months depending on complexity.' }
      ]
    },
    financial_advisor: {
      heading: 'Frequently Asked Questions',
      subtitle: 'Understanding how tax resolution protects your finances.',
      items: [
        { q: 'Can the IRS take my retirement accounts?', a: 'The IRS can levy certain accounts. We intervene to protect your assets and negotiate alternatives that minimize impact on your financial plan.' },
        { q: 'Will this affect my credit?', a: 'Tax liens can impact credit. Resolving your tax debt and getting liens released is one of the best things you can do for your credit profile.' },
        { q: 'How much does it cost?', a: 'Free consultation to assess your situation. Fees are transparent and discussed before any work begins.' },
        { q: 'How long does resolution take?', a: 'Most cases resolve in 3-6 months. Complex situations may take longer.' }
      ]
    },
    realtor: {
      heading: 'Frequently Asked Questions',
      subtitle: 'What you need to know about clearing tax liens.',
      items: [
        { q: 'Can you remove a lien before my closing date?', a: 'In many cases, yes. We work to release or subordinate IRS liens as quickly as possible to meet your real estate timeline.' },
        { q: 'How fast can you start?', a: 'We contact the IRS within 48 hours of your consultation. For time-sensitive cases, we prioritize accordingly.' },
        { q: 'How much does it cost?', a: 'Free consultation. Resolution fees depend on case complexity and are discussed upfront.' },
        { q: 'Is this legitimate?', a: 'Community Tax is A+ BBB-rated with over $2.3 billion resolved. Your real estate professional referred you because they trust our work.' }
      ]
    },
    mortgage: {
      heading: 'Frequently Asked Questions',
      subtitle: 'Clearing tax issues to get your mortgage approved.',
      items: [
        { q: 'Can you file my missing tax returns?', a: 'Yes. We prepare and file past-due returns to get you IRS-compliant, which is required for mortgage approval.' },
        { q: 'How fast can you get me compliant?', a: 'Simple unfiled returns can be resolved in weeks. More complex situations with IRS debt take longer but we work efficiently.' },
        { q: 'How much does it cost?', a: 'Free consultation to assess your situation. Fees are discussed upfront with no hidden charges.' },
        { q: 'Will this help my mortgage get approved?', a: 'Resolving tax issues and getting IRS-compliant is often the missing piece for mortgage approval. We work to clear those obstacles.' }
      ]
    },
    insurance: {
      heading: 'Frequently Asked Questions',
      subtitle: 'What you need to know about resolving your tax situation.',
      items: [
        { q: 'How does this work?', a: 'We start with a free consultation to understand your situation. Then our licensed team negotiates directly with the IRS to find the best resolution for you.' },
        { q: 'Can you really reduce what I owe?', a: 'Through IRS programs like Offer in Compromise and penalty abatement, we often significantly reduce what clients owe.' },
        { q: 'Is this legitimate?', a: 'Absolutely. Community Tax is A+ BBB-rated with over $2.3 billion resolved. You were referred by a trusted professional.' },
        { q: 'How long does it take?', a: 'Most cases resolve in 3-6 months. We keep you updated throughout.' }
      ]
    },
    general: {
      heading: 'Frequently Asked Questions',
      subtitle: 'What you need to know about resolving your tax problem.',
      items: [
        { q: 'How much does it cost?', a: 'We offer a free consultation. Resolution fees depend on your situation and are discussed upfront -- no hidden costs.' },
        { q: 'Can you reduce what I owe the IRS?', a: 'In many cases, yes. We negotiate settlements, payment plans, and penalty relief to minimize what you pay.' },
        { q: 'Will the IRS stop contacting me?', a: 'Once we represent you, all IRS communication goes through our team.' },
        { q: 'How long does it take?', a: 'Most cases resolve in 3-6 months.' }
      ]
    }
  },

  // ================================================================
  //  TESTIMONIAL COPY -- from resolved clients (not partners)
  // ================================================================
  testimonial: {
    cpa: {
      quote: '"I owed the IRS $47,000 and had no idea where to start. My CPA connected me with Community Tax and they settled my case for a fraction of what I owed. I wish I had done this years ago."',
      name: 'David M.',
      location: 'Houston, TX',
      initials: 'DM'
    },
    attorney: {
      quote: '"My attorney referred me when I couldn\'t handle the IRS on my own. Community Tax got my $62,000 debt settled and stopped the garnishment on my paycheck within weeks."',
      name: 'Sarah K.',
      location: 'Chicago, IL',
      initials: 'SK'
    },
    financial_advisor: {
      quote: '"I had a $90K tax lien that was threatening my retirement savings. My financial advisor connected me with Community Tax and they got the lien released. My portfolio is safe now."',
      name: 'Robert P.',
      location: 'Denver, CO',
      initials: 'RP'
    },
    realtor: {
      quote: '"A $28K tax lien was blocking the sale of my house. My realtor connected me with Community Tax and they got it resolved in time for closing. The house sold and I got my fresh start."',
      name: 'Maria G.',
      location: 'Miami, FL',
      initials: 'MG'
    },
    mortgage: {
      quote: '"I had 3 years of unfiled returns blocking my mortgage. My loan officer referred me to Community Tax -- they filed everything and got me IRS-compliant. My mortgage closed last month."',
      name: 'Jason R.',
      location: 'Phoenix, AZ',
      initials: 'JR'
    },
    insurance: {
      quote: '"I had been ignoring IRS letters for years. My insurance agent told me about Community Tax and they resolved my entire case. I can finally sleep at night."',
      name: 'Linda W.',
      location: 'Atlanta, GA',
      initials: 'LW'
    },
    general: {
      quote: '"I owed $35,000 to the IRS and had no idea what to do. Community Tax settled my case and set up a plan I can actually afford. They made the whole process painless."',
      name: 'Mark T.',
      location: 'Dallas, TX',
      initials: 'MT'
    }
  },

  // ================================================================
  //  CTA COPY -- drives end client to request consultation
  // ================================================================
  cta: {
    cpa: {
      heading: 'Ready to Resolve Your Tax Debt?',
      subtitle: 'Get a free, no-obligation consultation. Our team will review your situation and explain your options.',
      button: 'Get My Free Consultation',
      trust: 'Free consultation. No obligation. Licensed professionals.'
    },
    attorney: {
      heading: 'Take the First Step Today',
      subtitle: 'Your attorney referred you for a reason. Let our team review your situation and show you what\'s possible.',
      button: 'Get My Free Consultation',
      trust: 'Free consultation. No obligation. A+ BBB rated.'
    },
    financial_advisor: {
      heading: 'Protect Your Financial Future',
      subtitle: 'Don\'t let IRS debt erode what you\'ve built. Get a free assessment of your resolution options.',
      button: 'Get My Free Consultation',
      trust: 'Free consultation. No obligation. Licensed professionals.'
    },
    realtor: {
      heading: 'Clear the Way for Your Transaction',
      subtitle: 'Don\'t let a tax lien hold up your real estate goals. Get a free consultation today.',
      button: 'Get My Free Consultation',
      trust: 'Free consultation. Fast resolution. A+ BBB rated.'
    },
    mortgage: {
      heading: 'Get Mortgage-Ready',
      subtitle: 'Clear the tax issues blocking your loan approval. Start with a free consultation.',
      button: 'Get My Free Consultation',
      trust: 'Free consultation. No obligation. Fast resolution.'
    },
    insurance: {
      heading: 'Stop Worrying About the IRS',
      subtitle: 'You don\'t have to handle this alone. Get a free consultation and see your options.',
      button: 'Get My Free Consultation',
      trust: 'Free consultation. No obligation. Licensed team.'
    },
    general: {
      heading: 'Ready to Resolve Your Tax Problem?',
      subtitle: 'Get a free consultation. Our licensed team will review your situation and walk you through your options.',
      button: 'Get My Free Consultation',
      trust: 'Free consultation. No obligation. Licensed professionals.'
    }
  },

  // ================================================================
  //  FORM COPY -- end client fills this out to request help
  // ================================================================
  form: {
    cpa: {
      heading: 'Request Your Free Consultation',
      subtitle: 'Tell us a little about your situation. A tax resolution specialist will contact you within 24 hours.',
      button: 'Request Free Consultation'
    },
    attorney: {
      heading: 'Request Your Free Consultation',
      subtitle: 'Your attorney referred you to us. Fill out this form and our team will be in touch within 24 hours.',
      button: 'Request Free Consultation'
    },
    financial_advisor: {
      heading: 'Protect Your Assets -- Get Started',
      subtitle: 'Fill out this form for a free assessment of your tax resolution options.',
      button: 'Request Free Consultation'
    },
    realtor: {
      heading: 'Start Clearing Your Tax Lien',
      subtitle: 'Tell us about your situation and timeline. We prioritize time-sensitive real estate cases.',
      button: 'Request Free Consultation'
    },
    mortgage: {
      heading: 'Get Tax-Compliant for Your Mortgage',
      subtitle: 'Tell us about your tax situation so we can help clear the way for your loan approval.',
      button: 'Request Free Consultation'
    },
    insurance: {
      heading: 'Request Your Free Consultation',
      subtitle: 'Tell us about your IRS situation. A resolution specialist will contact you within 24 hours.',
      button: 'Request Free Consultation'
    },
    general: {
      heading: 'Request Your Free Consultation',
      subtitle: 'Tell us a little about your situation. A tax resolution specialist will contact you within 24 hours.',
      button: 'Request Free Consultation'
    }
  },

  // ================================================================
  //  COMPLIANCE FOOTER (same for all personas, per-profession disclaimer)
  // ================================================================
  compliance: {
    cpa: [
      'This page is published by an independent referral partner. Community Tax is a licensed tax resolution firm, not affiliated with the IRS.',
      'Results vary based on individual circumstances. No specific outcome is guaranteed.',
      'See ctax.com/disclosures for full details.'
    ],
    attorney: [
      'This page is published by an independent referral partner. Community Tax is a licensed tax resolution firm, not affiliated with the IRS.',
      'Results vary based on individual circumstances. No specific outcome is guaranteed.',
      'See ctax.com/disclosures for full details.'
    ],
    financial_advisor: [
      'This page is published by an independent referral partner. Community Tax is a licensed tax resolution firm, not affiliated with the IRS.',
      'Results vary based on individual circumstances. No specific outcome is guaranteed.',
      'See ctax.com/disclosures for full details.'
    ],
    realtor: [
      'This page is published by an independent referral partner. Community Tax is a licensed tax resolution firm, not affiliated with the IRS.',
      'Results vary based on individual circumstances. No specific outcome is guaranteed.',
      'See ctax.com/disclosures for full details.'
    ],
    mortgage: [
      'This page is published by an independent referral partner. Community Tax is a licensed tax resolution firm, not affiliated with the IRS.',
      'Results vary based on individual circumstances. No specific outcome is guaranteed.',
      'See ctax.com/disclosures for full details.'
    ],
    insurance: [
      'This page is published by an independent referral partner. Community Tax is a licensed tax resolution firm, not affiliated with the IRS.',
      'Results vary based on individual circumstances. No specific outcome is guaranteed.',
      'See ctax.com/disclosures for full details.'
    ],
    general: [
      'This page is published by an independent referral partner. Community Tax is a licensed tax resolution firm, not affiliated with the IRS.',
      'Results vary based on individual circumstances. No specific outcome is guaranteed.',
      'See ctax.com/disclosures for full details.'
    ]
  }
};

// ================================================================
//  Persona definitions for the onboarding flow
//  NOTE: "persona" = the type of professional building the page.
//  The copy targets their CLIENTS, not the professional themselves.
// ================================================================
var PB_PERSONAS = [
  { id: 'cpa', label: 'CPA', desc: 'Your clients see you for tax prep and accounting', icon: '<svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="12" y2="14"/></svg>' },
  { id: 'attorney', label: 'Attorney', desc: 'Your clients see you for legal matters', icon: '<svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="5" r="3"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="5" y1="16" x2="19" y2="16"/><line x1="5" y1="16" x2="5" y2="20"/><line x1="19" y1="16" x2="19" y2="20"/></svg>' },
  { id: 'financial_advisor', label: 'Financial Advisor', desc: 'Your clients see you for wealth management', icon: '<svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="3" y1="20" x2="21" y2="20"/></svg>' },
  { id: 'realtor', label: 'Realtor', desc: 'Your clients see you for real estate', icon: '<svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 10L12 3l9 7v11H3z"/><rect x="9" y="14" width="6" height="7"/></svg>' },
  { id: 'mortgage', label: 'Mortgage Broker', desc: 'Your clients see you for home loans', icon: '<svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="6" width="20" height="14" rx="2"/><line x1="2" y1="11" x2="22" y2="11"/><circle cx="17" cy="15" r="2"/></svg>' },
  { id: 'insurance', label: 'Insurance Agent', desc: 'Your clients see you for coverage', icon: '<svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>' },
  { id: 'general', label: 'General', desc: 'Other type of professional', icon: '<svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-7 8-7s8 3 8 7"/></svg>' }
];


// ================================================================
//  Apply persona copy to the canvas
// ================================================================
function pbApplyPersonaCopy(personaId) {
  if (typeof pbEditor === 'undefined' || !pbEditor) return;

  var frame = pbEditor.Canvas.getFrameEl();
  if (!frame) return;
  var doc = frame.contentDocument;
  if (!doc) return;

  localStorage.setItem('ctax_pb_persona', personaId);

  // Hero copy -- swap badge, headline, subtitle, CTAs, and trust stats
  var heroCopy = PB_COPY.hero[personaId] || PB_COPY.hero.general;
  var heroSections = doc.querySelectorAll('.pb-hero-centered, .pb-hero-split, .pb-hero-dark, .pb-hero-minimal, .pb-hero-bold');
  heroSections.forEach(function(hero) {
    var badge = hero.querySelector('.pb-badge');
    if (badge) badge.textContent = heroCopy.badge;

    var h1 = hero.querySelector('h1');
    if (h1) h1.textContent = heroCopy.headline;

    var sub = hero.querySelector('.pb-hero-sub') || hero.querySelector('.pb-hero-split-text > p:not(.pb-badge)');
    if (sub) sub.textContent = heroCopy.subtitle;

    // For minimal/bold heroes, the subtitle is a direct p child
    if (!sub) {
      var directP = hero.querySelector('p');
      if (directP && !directP.classList.contains('pb-badge')) {
        directP.textContent = heroCopy.subtitle;
      }
    }

    // CTA buttons
    var primaryBtn = hero.querySelector('.pb-btn');
    if (primaryBtn) primaryBtn.textContent = heroCopy.cta_primary;
    var secondaryBtn = hero.querySelector('.pb-btn-secondary');
    if (secondaryBtn) secondaryBtn.textContent = heroCopy.cta_secondary;

    // Trust stats row
    if (heroCopy.trust_stats) {
      var trustItems = hero.querySelectorAll('.pb-trust-item');
      for (var i = 0; i < trustItems.length && i < heroCopy.trust_stats.length; i++) {
        var val = trustItems[i].querySelector('.pb-trust-val');
        var label = trustItems[i].querySelector('.pb-trust-label');
        if (val) val.textContent = heroCopy.trust_stats[i].val;
        if (label) label.textContent = heroCopy.trust_stats[i].label;
      }
    }
  });

  // Also update standalone badges outside heroes
  var standaloneBadges = doc.querySelectorAll('.pb-badge');
  standaloneBadges.forEach(function(el) {
    if (!el.closest('.pb-hero-centered, .pb-hero-split, .pb-hero-dark, .pb-hero-minimal, .pb-hero-bold')) {
      el.textContent = heroCopy.badge;
    }
  });

  // Feature cards copy
  var featCopy = PB_COPY.features[personaId] || PB_COPY.features.general;
  var featSections = doc.querySelectorAll('.pb-features, .pb-showcase');
  featSections.forEach(function(section) {
    var h2 = section.querySelector('h2');
    if (h2) h2.textContent = featCopy.heading;
    var sub = section.querySelector('.pb-section-sub');
    if (sub) sub.textContent = featCopy.subtitle;
  });

  // FAQ copy
  var faqCopy = PB_COPY.faq[personaId] || PB_COPY.faq.general;
  var faqSections = doc.querySelectorAll('.pb-faq, .pb-faq-two-col');
  faqSections.forEach(function(section) {
    var h2 = section.querySelector('h2');
    if (h2) h2.textContent = faqCopy.heading;
    var sub = section.querySelector('.pb-section-sub');
    if (sub) sub.textContent = faqCopy.subtitle;
  });

  // CTA copy
  var ctaCopy = PB_COPY.cta[personaId] || PB_COPY.cta.general;
  var ctaSections = doc.querySelectorAll('.pb-cta-dark, .pb-cta-gradient, .pb-cta-card-section');
  ctaSections.forEach(function(section) {
    var h2 = section.querySelector('h2');
    if (h2) h2.textContent = ctaCopy.heading;
    var p = section.querySelector('p:not(.pb-cta-trust)');
    if (p) p.textContent = ctaCopy.subtitle;
    var trust = section.querySelector('.pb-cta-trust');
    if (trust) trust.textContent = ctaCopy.trust;
    var ctaBtn = section.querySelector('.pb-btn');
    if (ctaBtn && ctaCopy.button) ctaBtn.textContent = ctaCopy.button;
  });

  // Form copy
  var formCopy = PB_COPY.form[personaId] || PB_COPY.form.general;
  var formSections = doc.querySelectorAll('.pb-form-section, .pb-form-split');
  formSections.forEach(function(section) {
    var h2 = section.querySelector('h2');
    if (h2) h2.textContent = formCopy.heading;
    var sub = section.querySelector('.pb-section-sub');
    if (sub) sub.textContent = formCopy.subtitle;
  });

  // Compliance footer
  var compCopy = PB_COPY.compliance[personaId] || PB_COPY.compliance.general;
  var compFooters = doc.querySelectorAll('.pb-compliance-footer');
  compFooters.forEach(function(footer) {
    var ps = footer.querySelectorAll('p');
    for (var i = 0; i < ps.length && i < compCopy.length; i++) {
      ps[i].textContent = compCopy[i];
    }
  });

  // Sync DOM changes back to GrapesJS component model
  var updatedHtml = doc.body.innerHTML;
  pbEditor.setComponents(updatedHtml);

  // Re-lock compliance footer after component reset
  setTimeout(function() {
    if (typeof pbLockComplianceFooter === 'function') {
      pbLockComplianceFooter();
    }
  }, 300);

  // Save
  if (typeof pbSave === 'function') pbSave();
}
