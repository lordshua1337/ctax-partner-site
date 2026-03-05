// -- RESOURCE PDF GENERATOR --
// Generates branded PDFs for all partner resources using CTAX_PDF brand system.
// Replaces the plain .txt downloads in navigation.js handleResourceDownload().

var ResourcePDFs = (function() {

  function e(t) { return CTAX_PDF.esc(t); }

  // ---------------------------------------------------------------
  // 1. PARTNER ONBOARDING KIT (6-page multi-section guide)
  // ---------------------------------------------------------------
  function partnerOnboardingKit() {
    var doc = CTAX_PDF.createDoc();
    doc.appendChild(CTAX_PDF.createCover(
      'Partner Onboarding Kit',
      'Everything you need to start referring clients and earning revenue with Community Tax.',
      [
        { label: 'Pages', value: '6' },
        { label: 'Program', value: 'Partner' },
        { label: 'Updated', value: 'Q1 2026' }
      ]
    ));

    // Page 1: Program Overview
    var p1 = CTAX_PDF.createPage(true);
    CTAX_PDF.addHeader(p1, 'Partner Onboarding Kit');
    p1.innerHTML += '<h2 class="ctpdf-section-title">About Community Tax</h2>' +
      '<p class="ctpdf-p">Community Tax is a national IRS tax resolution firm with <b>15+ years of experience</b>, over <b>$2.3 billion in tax debt resolved</b>, and <b>120,000+ clients served</b>. We are licensed to practice in 48 states and employ a team of enrolled agents, CPAs, and tax attorneys.</p>' +
      '<p class="ctpdf-p">Our partner program enables financial professionals to earn recurring revenue by referring clients who need IRS tax resolution services. You focus on identifying the opportunity -- we handle the entire resolution process from investigation through final resolution.</p>' +
      '<div class="ctpdf-divider"></div>' +
      '<h2 class="ctpdf-section-title">Partner Program Tiers</h2>' +
      '<table class="ctpdf-table"><thead><tr><th>Tier</th><th>Revenue Share</th><th>Requirements</th><th>Benefits</th></tr></thead><tbody>' +
      '<tr><td><b>Direct</b></td><td>8%</td><td>No minimum</td><td>Self-service portal, basic reporting</td></tr>' +
      '<tr><td><b>Enterprise</b></td><td>13%</td><td>10+ referrals/quarter</td><td>Dedicated account manager, co-branded materials</td></tr>' +
      '<tr><td><b>Strategic</b></td><td>18%</td><td>25+ referrals/quarter</td><td>API integration, custom reporting, white-label options</td></tr>' +
      '</tbody></table>' +
      '<div class="ctpdf-callout"><div class="ctpdf-callout-title">Example Revenue</div><div class="ctpdf-callout-body">A $20,000 case generates <b>$1,600</b> at Direct tier, <b>$2,600</b> at Enterprise, or <b>$3,600</b> at Strategic. Average case value ranges from $15,000-$40,000. Most active partners earn $3,000-$8,000+ per month.</div></div>';
    doc.appendChild(p1);

    // Page 2: How It Works
    var p2 = CTAX_PDF.createPage();
    CTAX_PDF.addHeader(p2, 'Partner Onboarding Kit');
    p2.innerHTML += '<h2 class="ctpdf-section-title">How the Referral Process Works</h2>' +
      '<div class="ctpdf-timeline">' +
      '<div class="ctpdf-tl-item"><div class="ctpdf-tl-dot"></div><div class="ctpdf-tl-title">Step 1: Identify the Opportunity</div><div class="ctpdf-tl-body">During your normal client interactions, listen for signs of IRS tax debt -- unfiled returns, IRS notices, mentions of back taxes, wage garnishments, or bank levies. Use the Tax Debt Indicator Checklist to spot these signals.</div></div>' +
      '<div class="ctpdf-tl-item"><div class="ctpdf-tl-dot"></div><div class="ctpdf-tl-title">Step 2: Have the Conversation</div><div class="ctpdf-tl-body">Use the provided scripts to introduce Community Tax naturally. Frame the $295 investigation fee as a low-risk first step. Emphasize that you personally trust this firm with your clients.</div></div>' +
      '<div class="ctpdf-tl-item"><div class="ctpdf-tl-dot"></div><div class="ctpdf-tl-title">Step 3: Submit the Referral</div><div class="ctpdf-tl-body">Log into your Partner Portal and click "New Referral." Enter the client\'s name, phone, email, and estimated debt amount. We contact them within 24 hours.</div></div>' +
      '<div class="ctpdf-tl-item"><div class="ctpdf-tl-dot"></div><div class="ctpdf-tl-title">Step 4: Track Progress</div><div class="ctpdf-tl-body">Monitor your referral\'s status in real-time through the portal. You\'ll see when they complete the investigation, sign for resolution, and when your commission is earned.</div></div>' +
      '<div class="ctpdf-tl-item"><div class="ctpdf-tl-dot"></div><div class="ctpdf-tl-title">Step 5: Get Paid</div><div class="ctpdf-tl-body">Commissions are paid monthly, NET-30, via ACH or check. You earn your share when the client pays for resolution services. The portal shows your earnings dashboard in real-time.</div></div>' +
      '</div>';
    doc.appendChild(p2);

    // Page 3: Client Identification
    var p3 = CTAX_PDF.createPage();
    CTAX_PDF.addHeader(p3, 'Partner Onboarding Kit');
    p3.innerHTML += '<h2 class="ctpdf-section-title">Identifying Referral Candidates</h2>' +
      '<p class="ctpdf-section-sub">Signs your client may need IRS tax resolution services.</p>' +
      '<h3 style="font-size:16px;color:' + CTAX_PDF.NAVY + ';margin:0 0 14px">IRS Notices to Watch For</h3>' +
      '<div class="ctpdf-cols"><div class="ctpdf-col">' +
      '<div class="ctpdf-card"><div class="ctpdf-card-title">CP14 -- Balance Due</div><div class="ctpdf-card-body">Initial notice that taxes are owed. Client may not have seen it yet.</div></div>' +
      '<div class="ctpdf-card"><div class="ctpdf-card-title">CP501-CP504 -- Collection Series</div><div class="ctpdf-card-body">Escalating collection notices. CP504 means levy action is imminent.</div></div>' +
      '</div><div class="ctpdf-col">' +
      '<div class="ctpdf-card"><div class="ctpdf-card-title">Letter 1058 -- Intent to Levy</div><div class="ctpdf-card-body">Final warning before the IRS seizes wages, bank accounts, or assets.</div></div>' +
      '<div class="ctpdf-card"><div class="ctpdf-card-title">Letter 3172 -- Federal Tax Lien</div><div class="ctpdf-card-body">A lien has been filed against the client\'s property. Affects credit and real estate.</div></div>' +
      '</div></div>' +
      '<div class="ctpdf-divider"></div>' +
      '<h3 style="font-size:16px;color:' + CTAX_PDF.NAVY + ';margin:0 0 14px">Verbal Cues from Clients</h3>' +
      '<div class="ctpdf-item"><div class="ctpdf-item-num">1</div><div class="ctpdf-item-body">"I haven\'t filed in a few years" -- Often masks significant anxiety about accumulated penalties.</div></div>' +
      '<div class="ctpdf-item"><div class="ctpdf-item-num">2</div><div class="ctpdf-item-body">"I owe the IRS but can\'t afford to pay" -- Signals they need resolution options beyond a payment plan.</div></div>' +
      '<div class="ctpdf-item"><div class="ctpdf-item-num">3</div><div class="ctpdf-item-body">"I got a letter about a lien/levy" -- Indicates active IRS enforcement action.</div></div>' +
      '<div class="ctpdf-item"><div class="ctpdf-item-num">4</div><div class="ctpdf-item-body">"My refund was offset" -- Means the IRS applied their refund to an existing debt.</div></div>';
    doc.appendChild(p3);

    // Page 4: Scripts
    var p4 = CTAX_PDF.createPage();
    CTAX_PDF.addHeader(p4, 'Partner Onboarding Kit');
    p4.innerHTML += '<h2 class="ctpdf-section-title">Referral Scripts</h2>' +
      '<p class="ctpdf-section-sub">Word-for-word language you can adapt to your communication style.</p>' +
      '<div class="ctpdf-card"><div class="ctpdf-card-title">When a Client Mentions IRS Problems</div><div class="ctpdf-card-body">"I hear that a lot, and you\'re definitely not alone. I actually work with a national firm called Community Tax that specializes in exactly this. They\'ve resolved over $2.3 billion in tax debt. The first step is a $295 investigation where they review your full IRS account and lay out your options. No obligation beyond that. Would you like me to connect you?"</div></div>' +
      '<div class="ctpdf-card"><div class="ctpdf-card-title">Proactive Outreach to Existing Client</div><div class="ctpdf-card-body">"During our last meeting, I noticed some indicators that you may have an unresolved tax situation. I wanted to mention that I partner with Community Tax -- they\'re a national IRS resolution firm I trust. If you\'re dealing with any IRS issues, they can do a full review for $295 and tell you exactly what your options are. It\'s completely confidential."</div></div>' +
      '<div class="ctpdf-card"><div class="ctpdf-card-title">Handling the "I\'ll Deal With It Myself" Objection</div><div class="ctpdf-card-body">"You absolutely can. But the IRS has a team of professionals on their side. Community Tax has enrolled agents and tax attorneys who negotiate these cases every day. Their clients see resolutions at 70-80% of what they owe on average. The $295 investigation alone gives you a full picture of your options -- and you can decide from there."</div></div>';
    doc.appendChild(p4);

    // Page 5: Compliance + Contacts
    var p5 = CTAX_PDF.createPage();
    CTAX_PDF.addHeader(p5, 'Partner Onboarding Kit');
    p5.innerHTML += '<h2 class="ctpdf-section-title">Compliance Guidelines</h2>' +
      '<div class="ctpdf-check-item"><div class="ctpdf-check-box"></div><div class="ctpdf-check-text">Never guarantee specific outcomes or dollar amounts for tax resolution</div></div>' +
      '<div class="ctpdf-check-item"><div class="ctpdf-check-box"></div><div class="ctpdf-check-text">Always disclose your referral relationship with Community Tax</div></div>' +
      '<div class="ctpdf-check-item"><div class="ctpdf-check-box"></div><div class="ctpdf-check-text">Direct clients to communitytax.com for independent verification</div></div>' +
      '<div class="ctpdf-check-item"><div class="ctpdf-check-box"></div><div class="ctpdf-check-text">Do not provide specific tax advice unless you are licensed to do so</div></div>' +
      '<div class="ctpdf-check-item"><div class="ctpdf-check-box"></div><div class="ctpdf-check-text">Maintain client confidentiality throughout the referral process</div></div>' +
      '<div class="ctpdf-check-item"><div class="ctpdf-check-box"></div><div class="ctpdf-check-text">Use only approved marketing materials and messaging</div></div>' +
      '<div class="ctpdf-divider"></div>' +
      '<h2 class="ctpdf-section-title">Key Contacts</h2>' +
      '<div class="ctpdf-cols"><div class="ctpdf-col">' +
      '<div class="ctpdf-card"><div class="ctpdf-card-title">Partner Support</div><div class="ctpdf-card-body">partners@communitytax.com<br>Mon-Fri, 8am-7pm CST</div></div>' +
      '</div><div class="ctpdf-col">' +
      '<div class="ctpdf-card"><div class="ctpdf-card-title">New Partnerships</div><div class="ctpdf-card-body">1-855-332-2873<br>Ask for Partner Development</div></div>' +
      '</div></div>' +
      '<div class="ctpdf-callout"><div class="ctpdf-callout-title">Quick Start Checklist</div><div class="ctpdf-callout-body">1. Log in to your Partner Portal<br>2. Complete the 15-minute orientation video<br>3. Download your co-branded materials<br>4. Submit your first referral within your first week<br>5. Schedule a check-in with your account manager</div></div>';
    CTAX_PDF.addFooter(p5);
    doc.appendChild(p5);

    return CTAX_PDF.renderPdf(doc, 'CTAX-Partner-Onboarding-Kit.pdf');
  }

  // ---------------------------------------------------------------
  // 2. CLIENT INTRODUCTION SCRIPT (2-page styled script)
  // ---------------------------------------------------------------
  function clientIntroScript() {
    var doc = CTAX_PDF.createDoc();
    doc.appendChild(CTAX_PDF.createCover(
      'Client Introduction Script',
      'Word-for-word language to introduce Community Tax during face-to-face and phone conversations.',
      [{ label: 'Type', value: 'Script' }, { label: 'Pages', value: '2' }]
    ));

    var p1 = CTAX_PDF.createPage(true);
    CTAX_PDF.addHeader(p1, 'Client Introduction Script');
    p1.innerHTML += '<h2 class="ctpdf-section-title">The Warm Introduction</h2>' +
      '<p class="ctpdf-section-sub">Use this script when you\'ve identified a client with potential tax debt during a regular meeting.</p>' +
      '<div class="ctpdf-callout"><div class="ctpdf-callout-title">Setting the Scene</div><div class="ctpdf-callout-body">You\'re in a meeting with a client -- could be tax prep, financial planning, a loan review. They\'ve mentioned IRS problems, or you\'ve noticed red flags in their financials. Here\'s exactly what to say.</div></div>' +
      '<div class="ctpdf-card"><div class="ctpdf-card-title">Opening (Acknowledge the Problem)</div><div class="ctpdf-card-body" style="font-style:italic">"You know, what you\'re describing is actually really common. I see this with a lot of my clients, especially [self-employed folks / people going through major life changes / business owners]. The good news is, there are real options for resolving this."</div></div>' +
      '<div class="ctpdf-card"><div class="ctpdf-card-title">The Introduction (Bridge to Community Tax)</div><div class="ctpdf-card-body" style="font-style:italic">"I actually work with a national firm called Community Tax that specializes in IRS resolution. They\'ve been around for 15 years and have resolved over $2.3 billion in tax debt for more than 120,000 clients. I partner with them because they\'re one of the few firms I trust with my own clients."</div></div>' +
      '<div class="ctpdf-card"><div class="ctpdf-card-title">The CTA (Low-Risk Next Step)</div><div class="ctpdf-card-body" style="font-style:italic">"The way it works is, they start with a $295 investigation -- they pull your full IRS transcripts, review everything, and present you with all your options. There\'s no obligation beyond that. You decide what makes sense after you see the full picture. Would you like me to make that connection for you?"</div></div>';
    doc.appendChild(p1);

    var p2 = CTAX_PDF.createPage();
    CTAX_PDF.addHeader(p2, 'Client Introduction Script');
    p2.innerHTML += '<h2 class="ctpdf-section-title">Handling Initial Hesitation</h2>' +
      '<div class="ctpdf-card"><div class="ctpdf-card-title">"I need to think about it"</div><div class="ctpdf-card-body" style="font-style:italic">"Absolutely. The only thing I\'d mention is that penalties and interest compound daily, so the sooner you get a clear picture, the more options you\'ll have. If you want, I can just have them give you a call -- no pressure, just information."</div></div>' +
      '<div class="ctpdf-card"><div class="ctpdf-card-title">"$295 is a lot right now"</div><div class="ctpdf-card-body" style="font-style:italic">"I understand. But consider what you\'re paying in penalties and interest every month by not addressing this. On a $20,000 debt, penalties alone can add $2,000-$3,000 per year. The $295 to understand your full options is a small investment to potentially save you thousands."</div></div>' +
      '<div class="ctpdf-card"><div class="ctpdf-card-title">"I don\'t trust tax resolution companies"</div><div class="ctpdf-card-body" style="font-style:italic">"That\'s a fair concern -- there are bad actors in this space. That\'s exactly why I only partner with one firm. Community Tax has been operating for 15 years, they\'re BBB accredited, and they employ licensed enrolled agents and tax attorneys. I wouldn\'t put my name on it if I didn\'t trust them with my own clients."</div></div>' +
      '<div class="ctpdf-divider"></div>' +
      '<div class="ctpdf-callout"><div class="ctpdf-callout-title">Pro Tips</div><div class="ctpdf-callout-body">' +
      '<b>Tone matters more than words.</b> Be conversational, not salesy. You\'re a trusted advisor making a recommendation, not a salesperson closing a deal.<br><br>' +
      '<b>Don\'t oversell.</b> Your job is to make the introduction. Community Tax handles the rest. The less pressure you apply, the more trust you build.<br><br>' +
      '<b>Follow up.</b> If they don\'t commit immediately, check in 5-7 days later with a simple: "Hey, I wanted to follow up on that IRS situation we discussed. Have you had a chance to think about it?"</div></div>';
    CTAX_PDF.addFooter(p2);
    doc.appendChild(p2);

    return CTAX_PDF.renderPdf(doc, 'CTAX-Client-Introduction-Script.pdf');
  }

  // ---------------------------------------------------------------
  // 3. EMAIL REFERRAL TEMPLATE PACK (3 email templates)
  // ---------------------------------------------------------------
  function emailTemplates() {
    var doc = CTAX_PDF.createDoc();
    doc.appendChild(CTAX_PDF.createCover(
      'Email Referral Template Pack',
      'Three ready-to-send email templates for different referral situations. Copy, customize, and send.',
      [{ label: 'Templates', value: '3' }, { label: 'Type', value: 'Email' }]
    ));

    var p1 = CTAX_PDF.createPage(true);
    CTAX_PDF.addHeader(p1, 'Email Referral Templates');
    p1.innerHTML += '<h2 class="ctpdf-section-title">Template 1: Initial Outreach</h2>' +
      '<p class="ctpdf-section-sub">For clients who mentioned IRS issues during a recent interaction.</p>' +
      '<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:24px;margin-bottom:24px">' +
      '<div style="display:flex;gap:8px;margin-bottom:12px;font-size:12px;color:#64748b"><b>Subject:</b> Quick question about your tax situation</div>' +
      '<div style="border-top:1px solid #e2e8f0;padding-top:16px;font-size:13px;line-height:1.8;color:#334155">' +
      'Hi [Name],<br><br>' +
      'During our recent conversation, you mentioned some concerns about [IRS notices / back taxes / unfiled returns]. I wanted to let you know about a resource that might help.<br><br>' +
      'I partner with Community Tax, a national firm that specializes in IRS tax resolution. They\'ve helped resolve over $2.3 billion in tax debt for 120,000+ clients across the country.<br><br>' +
      'The first step is a $295 tax investigation where they review your full IRS account and present your options. There\'s no obligation beyond that -- you decide what makes sense after seeing the full picture.<br><br>' +
      'Would you like me to connect you? I can make a warm introduction.<br><br>' +
      'Best,<br>[Your Name]</div></div>' +
      '<div class="ctpdf-divider"></div>' +
      '<h2 class="ctpdf-section-title">Template 2: Follow-Up (5-7 Days Later)</h2>' +
      '<p class="ctpdf-section-sub">For clients who expressed interest but haven\'t taken action.</p>' +
      '<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:24px">' +
      '<div style="display:flex;gap:8px;margin-bottom:12px;font-size:12px;color:#64748b"><b>Subject:</b> Following up on tax resolution</div>' +
      '<div style="border-top:1px solid #e2e8f0;padding-top:16px;font-size:13px;line-height:1.8;color:#334155">' +
      'Hi [Name],<br><br>' +
      'I wanted to circle back on the IRS situation we discussed last [day]. I know these things can feel overwhelming, but the one thing I\'d emphasize is that penalties and interest are compounding daily.<br><br>' +
      'Community Tax\'s $295 investigation gives you a complete picture of where you stand and what your options are. No commitment beyond that first step.<br><br>' +
      'Would it be helpful if I set up a quick call between you and their team? They can answer any questions you have.<br><br>' +
      'Just let me know,<br>[Your Name]</div></div>';
    doc.appendChild(p1);

    var p2 = CTAX_PDF.createPage();
    CTAX_PDF.addHeader(p2, 'Email Referral Templates');
    p2.innerHTML += '<h2 class="ctpdf-section-title">Template 3: Proactive Client Scan</h2>' +
      '<p class="ctpdf-section-sub">For reaching out to your broader client base to surface tax debt opportunities.</p>' +
      '<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:24px;margin-bottom:24px">' +
      '<div style="display:flex;gap:8px;margin-bottom:12px;font-size:12px;color:#64748b"><b>Subject:</b> A resource for IRS tax issues</div>' +
      '<div style="border-top:1px solid #e2e8f0;padding-top:16px;font-size:13px;line-height:1.8;color:#334155">' +
      'Hi [Name],<br><br>' +
      'As we approach [tax season / year-end / Q2], I wanted to share a resource that several of my clients have found valuable.<br><br>' +
      'I\'ve partnered with Community Tax, a national IRS tax resolution firm, to help clients who may be dealing with:<br>' +
      '&bull; Unfiled tax returns (1+ years behind)<br>' +
      '&bull; IRS notices or collection letters<br>' +
      '&bull; Wage garnishments or bank levies<br>' +
      '&bull; Tax liens on property<br>' +
      '&bull; Back taxes owed ($7,000+)<br><br>' +
      'If any of these apply to you -- or someone you know -- I can make a confidential introduction. Their team has resolved over $2.3 billion in tax debt, and the process starts with a simple $295 investigation.<br><br>' +
      'Feel free to reply to this email or call me directly if you\'d like to learn more.<br><br>' +
      'Best regards,<br>[Your Name]</div></div>' +
      '<div class="ctpdf-callout"><div class="ctpdf-callout-title">Email Best Practices</div><div class="ctpdf-callout-body">' +
      '<b>Personalize the subject line</b> when possible. Emails with personalized subjects have 26% higher open rates.<br><br>' +
      '<b>Send at optimal times:</b> Tuesday through Thursday, 9-11am or 2-4pm in the recipient\'s time zone.<br><br>' +
      '<b>Keep it short.</b> These templates are designed to be read in under 60 seconds. Don\'t add lengthy paragraphs.<br><br>' +
      '<b>Track responses.</b> Note which template generates the most replies and double down on that approach.</div></div>';
    CTAX_PDF.addFooter(p2);
    doc.appendChild(p2);

    return CTAX_PDF.renderPdf(doc, 'CTAX-Email-Referral-Templates.pdf');
  }

  // ---------------------------------------------------------------
  // 4. OBJECTION HANDLING GUIDE (3-page, 12 objections)
  // ---------------------------------------------------------------
  function objectionHandling() {
    var doc = CTAX_PDF.createDoc();
    doc.appendChild(CTAX_PDF.createCover(
      'Objection Handling Guide',
      'Responses to the 12 most common client objections -- with language that builds trust instead of pressure.',
      [{ label: 'Objections', value: '12' }, { label: 'Type', value: 'Sales Enablement' }]
    ));

    var objections = [
      { q: "I can't afford it", a: "The investigation is only $295, and resolution fees can be structured into affordable monthly payments. Most clients find the cost of NOT resolving far exceeds the cost of resolution -- penalties and interest compound daily. On a $20,000 debt, that's $200+ per month in penalties alone." },
      { q: "I'll handle it myself", a: "You absolutely can. But the IRS has a team of professionals on their side. Community Tax has enrolled agents and tax attorneys who negotiate these cases every day. Their clients see an average resolution of 70-80% of what they owe. The $295 investigation alone gives you leverage you wouldn't have on your own." },
      { q: "I don't trust tax resolution companies", a: "That's fair -- there are bad actors in this space. Community Tax has been around 15 years, resolved $2.3B, and has 120K+ clients. They're BBB accredited and employ licensed professionals. I personally partner with them because I trust them with my clients." },
      { q: "I'll wait and see what happens", a: "The IRS charges penalties and interest daily. A $20K debt can grow to $30K in 18 months just from penalties. More importantly, the longer you wait, the fewer resolution options you have. Acting now means you have the most choices available." },
      { q: "I've heard these companies just rip you off", a: "Some do. That's why I only partner with one firm. Community Tax doesn't charge upfront resolution fees -- the $295 investigation is all you pay to see your full options. If you decide not to proceed, that's it. No pressure, no hidden fees." },
      { q: "I owe too much / not enough", a: "Community Tax works with cases from $7,000 to $500,000+. Whatever the amount, the investigation reveals your best path forward. Many clients are surprised by the options available -- Offer in Compromise, Currently Not Collectible, penalty abatement -- regardless of how much they owe." },
      { q: "I'm already on a payment plan", a: "That's good that you're addressing it. But many IRS payment plans aren't structured optimally. Community Tax can review your current arrangement and see if there's a better option -- sometimes clients qualify for programs that reduce what they owe, not just how they pay." },
      { q: "My tax preparer / accountant is handling it", a: "Tax preparation and tax resolution are very different specialties. Your preparer is great at filing returns, but IRS resolution requires specialized negotiation skills and knowledge of IRS settlement programs. Community Tax's team does this all day, every day." },
      { q: "I need to talk to my spouse first", a: "Absolutely -- this should be a joint decision. Would it be helpful if I set up a three-way call so your spouse can hear directly from Community Tax about the process and options? Sometimes hearing from a third party makes the conversation easier." },
      { q: "How do I know this will actually work?", a: "Community Tax has a documented track record: $2.3B resolved, 120K+ clients, 15 years in business. The $295 investigation gives you a clear picture of your specific options before you commit to anything. You'll know exactly what's possible before spending another dollar." },
      { q: "I'm embarrassed about my tax situation", a: "This is far more common than you'd think. Community Tax works with thousands of people in the same situation every year. Their team handles everything confidentially and without judgment. The hardest part is taking the first step -- everything gets easier from there." },
      { q: "Can't I just negotiate with the IRS myself?", a: "Technically, yes. But the IRS doesn't have to tell you about all the programs you might qualify for. Having a licensed representative means someone who knows every option is advocating specifically for you. It's the difference between representing yourself in court versus hiring an attorney." }
    ];

    // Page 1: Objections 1-6
    var p1 = CTAX_PDF.createPage(true);
    CTAX_PDF.addHeader(p1, 'Objection Handling Guide');
    p1.innerHTML += '<h2 class="ctpdf-section-title">Common Objections & Responses</h2>';
    objections.slice(0, 6).forEach(function(obj, i) {
      p1.innerHTML += '<div class="ctpdf-card"><div class="ctpdf-card-title" style="color:' + CTAX_PDF.BLUE + '">"' + e(obj.q) + '"</div><div class="ctpdf-card-body">' + e(obj.a) + '</div></div>';
    });
    doc.appendChild(p1);

    // Page 2: Objections 7-12
    var p2 = CTAX_PDF.createPage();
    CTAX_PDF.addHeader(p2, 'Objection Handling Guide');
    objections.slice(6, 12).forEach(function(obj, i) {
      p2.innerHTML += '<div class="ctpdf-card"><div class="ctpdf-card-title" style="color:' + CTAX_PDF.BLUE + '">"' + e(obj.q) + '"</div><div class="ctpdf-card-body">' + e(obj.a) + '</div></div>';
    });
    CTAX_PDF.addFooter(p2);
    doc.appendChild(p2);

    return CTAX_PDF.renderPdf(doc, 'CTAX-Objection-Handling-Guide.pdf');
  }

  // ---------------------------------------------------------------
  // 5. TAX DEBT INDICATOR CHECKLIST (1-page visual checklist)
  // ---------------------------------------------------------------
  function taxDebtChecklist() {
    var doc = CTAX_PDF.createDoc();
    doc.appendChild(CTAX_PDF.createCover(
      'Tax Debt Indicator Checklist',
      'A quick-reference checklist of behavioral and financial signals that indicate unresolved tax debt.',
      [{ label: 'Format', value: 'Checklist' }, { label: 'Pages', value: '1' }]
    ));

    var p1 = CTAX_PDF.createPage(true);
    CTAX_PDF.addHeader(p1, 'Tax Debt Indicator Checklist');
    p1.innerHTML += '<h2 class="ctpdf-section-title">Client Red Flag Indicators</h2>' +
      '<p class="ctpdf-section-sub">Check off any signals you observe during client interactions. 2+ checks = strong referral candidate.</p>' +
      '<div class="ctpdf-cols"><div class="ctpdf-col">' +
      '<h3 style="font-size:14px;font-weight:700;color:' + CTAX_PDF.NAVY + ';margin:0 0 12px"><span class="ctpdf-badge ctpdf-badge-blue">Documents</span></h3>' +
      '<div class="ctpdf-check-item"><div class="ctpdf-check-box"></div><div class="ctpdf-check-text">IRS notices in their files (CP14, CP501-504, LT11)</div></div>' +
      '<div class="ctpdf-check-item"><div class="ctpdf-check-box"></div><div class="ctpdf-check-text">Tax lien showing on credit report</div></div>' +
      '<div class="ctpdf-check-item"><div class="ctpdf-check-box"></div><div class="ctpdf-check-text">Unfiled returns for 2+ years</div></div>' +
      '<div class="ctpdf-check-item"><div class="ctpdf-check-box"></div><div class="ctpdf-check-text">Prior year balances due on tax returns</div></div>' +
      '<div class="ctpdf-check-item"><div class="ctpdf-check-box"></div><div class="ctpdf-check-text">Estimated tax payments missed for multiple quarters</div></div>' +
      '<div class="ctpdf-check-item"><div class="ctpdf-check-box"></div><div class="ctpdf-check-text">Refund offset notice (refund applied to prior debt)</div></div>' +
      '<h3 style="font-size:14px;font-weight:700;color:' + CTAX_PDF.NAVY + ';margin:20px 0 12px"><span class="ctpdf-badge ctpdf-badge-blue">Financial Signs</span></h3>' +
      '<div class="ctpdf-check-item"><div class="ctpdf-check-box"></div><div class="ctpdf-check-text">Wage garnishment in payroll records</div></div>' +
      '<div class="ctpdf-check-item"><div class="ctpdf-check-box"></div><div class="ctpdf-check-text">Bank levy (frozen accounts)</div></div>' +
      '<div class="ctpdf-check-item"><div class="ctpdf-check-box"></div><div class="ctpdf-check-text">Estimated debt exceeds $10,000</div></div>' +
      '</div><div class="ctpdf-col">' +
      '<h3 style="font-size:14px;font-weight:700;color:' + CTAX_PDF.NAVY + ';margin:0 0 12px"><span class="ctpdf-badge ctpdf-badge-teal">Verbal Cues</span></h3>' +
      '<div class="ctpdf-check-item"><div class="ctpdf-check-box"></div><div class="ctpdf-check-text">"I haven\'t filed in a few years"</div></div>' +
      '<div class="ctpdf-check-item"><div class="ctpdf-check-box"></div><div class="ctpdf-check-text">"I owe the IRS but can\'t afford to pay"</div></div>' +
      '<div class="ctpdf-check-item"><div class="ctpdf-check-box"></div><div class="ctpdf-check-text">"I got a letter about a lien/levy"</div></div>' +
      '<div class="ctpdf-check-item"><div class="ctpdf-check-box"></div><div class="ctpdf-check-text">Asks about IRS payment plans</div></div>' +
      '<div class="ctpdf-check-item"><div class="ctpdf-check-box"></div><div class="ctpdf-check-text">Mentions "tax problems" casually in passing</div></div>' +
      '<div class="ctpdf-check-item"><div class="ctpdf-check-box"></div><div class="ctpdf-check-text">Avoids discussing specific tax years</div></div>' +
      '<h3 style="font-size:14px;font-weight:700;color:' + CTAX_PDF.NAVY + ';margin:20px 0 12px"><span class="ctpdf-badge ctpdf-badge-teal">Life Events</span></h3>' +
      '<div class="ctpdf-check-item"><div class="ctpdf-check-box"></div><div class="ctpdf-check-text">Recent divorce or separation</div></div>' +
      '<div class="ctpdf-check-item"><div class="ctpdf-check-box"></div><div class="ctpdf-check-text">Business closure or major downturn</div></div>' +
      '<div class="ctpdf-check-item"><div class="ctpdf-check-box"></div><div class="ctpdf-check-text">Health crisis affecting finances</div></div>' +
      '</div></div>' +
      '<div class="ctpdf-callout" style="margin-top:24px"><div class="ctpdf-callout-title">Next Step</div><div class="ctpdf-callout-body">If you checked 2 or more items, this client is likely a strong referral candidate. Use the Client Introduction Script to start the conversation, or submit a referral through your Partner Portal.</div></div>';
    CTAX_PDF.addFooter(p1);
    doc.appendChild(p1);

    return CTAX_PDF.renderPdf(doc, 'CTAX-Tax-Debt-Indicator-Checklist.pdf');
  }

  // ---------------------------------------------------------------
  // 6. REVENUE OPPORTUNITY CALCULATOR (2-page with tables)
  // ---------------------------------------------------------------
  function revenueCalculator() {
    var doc = CTAX_PDF.createDoc();
    doc.appendChild(CTAX_PDF.createCover(
      'Revenue Opportunity Calculator',
      'Estimate your referral revenue based on client volume, debt prevalence, and conversion rates.',
      [{ label: 'Format', value: 'Spreadsheet Guide' }, { label: 'Pages', value: '2' }]
    ));

    var p1 = CTAX_PDF.createPage(true);
    CTAX_PDF.addHeader(p1, 'Revenue Opportunity Calculator');
    p1.innerHTML += '<h2 class="ctpdf-section-title">Revenue Model Assumptions</h2>' +
      '<p class="ctpdf-p">This calculator helps you estimate monthly and annual referral revenue. The model uses conservative assumptions based on actual partner program data.</p>' +
      '<table class="ctpdf-table"><thead><tr><th>Variable</th><th>Conservative</th><th>Moderate</th><th>Aggressive</th></tr></thead><tbody>' +
      '<tr><td>Active clients in your book</td><td>100</td><td>250</td><td>500+</td></tr>' +
      '<tr><td>% with potential IRS issues</td><td>5%</td><td>8%</td><td>12%</td></tr>' +
      '<tr><td>Referral candidates identified</td><td>5</td><td>20</td><td>60</td></tr>' +
      '<tr><td>Conversion rate (referral to investigation)</td><td>40%</td><td>60%</td><td>80%</td></tr>' +
      '<tr><td>Investigation to resolution rate</td><td>65%</td><td>75%</td><td>85%</td></tr>' +
      '<tr><td>Average case value</td><td>$15,000</td><td>$25,000</td><td>$40,000</td></tr>' +
      '<tr><td>Your tier share</td><td>8% (Direct)</td><td>13% (Enterprise)</td><td>18% (Strategic)</td></tr>' +
      '</tbody></table>' +
      '<div class="ctpdf-divider"></div>' +
      '<h2 class="ctpdf-section-title">Example Scenarios</h2>' +
      '<table class="ctpdf-table"><thead><tr><th>Scenario</th><th>Referrals/Mo</th><th>Cases Closed</th><th>Monthly Revenue</th><th>Annual Revenue</th></tr></thead><tbody>' +
      '<tr><td><b>New Partner (Direct 8%)</b></td><td>2</td><td>1</td><td>$1,200</td><td>$14,400</td></tr>' +
      '<tr><td><b>Active Partner (Enterprise 13%)</b></td><td>5</td><td>3</td><td>$9,750</td><td>$117,000</td></tr>' +
      '<tr><td><b>Top Partner (Strategic 18%)</b></td><td>10</td><td>7</td><td>$50,400</td><td>$604,800</td></tr>' +
      '</tbody></table>';
    doc.appendChild(p1);

    var p2 = CTAX_PDF.createPage();
    CTAX_PDF.addHeader(p2, 'Revenue Opportunity Calculator');
    p2.innerHTML += '<h2 class="ctpdf-section-title">Your Personal Estimate</h2>' +
      '<p class="ctpdf-section-sub">Fill in your numbers to calculate your potential revenue.</p>' +
      '<div class="ctpdf-card" style="padding:24px">' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">' +
      '<div><div style="font-size:11px;font-weight:700;color:' + CTAX_PDF.SLATE + ';text-transform:uppercase;letter-spacing:0.1em;margin-bottom:6px">Your Active Clients</div><div style="border-bottom:2px solid ' + CTAX_PDF.BLUE + ';padding-bottom:8px;font-size:16px;color:' + CTAX_PDF.NAVY + '">_____________</div></div>' +
      '<div><div style="font-size:11px;font-weight:700;color:' + CTAX_PDF.SLATE + ';text-transform:uppercase;letter-spacing:0.1em;margin-bottom:6px">Est. % with IRS Issues</div><div style="border-bottom:2px solid ' + CTAX_PDF.BLUE + ';padding-bottom:8px;font-size:16px;color:' + CTAX_PDF.NAVY + '">_____________</div></div>' +
      '<div><div style="font-size:11px;font-weight:700;color:' + CTAX_PDF.SLATE + ';text-transform:uppercase;letter-spacing:0.1em;margin-bottom:6px">Referral Candidates</div><div style="border-bottom:2px solid ' + CTAX_PDF.BLUE + ';padding-bottom:8px;font-size:16px;color:' + CTAX_PDF.NAVY + '">_____________</div></div>' +
      '<div><div style="font-size:11px;font-weight:700;color:' + CTAX_PDF.SLATE + ';text-transform:uppercase;letter-spacing:0.1em;margin-bottom:6px">Expected Monthly Revenue</div><div style="border-bottom:2px solid ' + CTAX_PDF.BLUE + ';padding-bottom:8px;font-size:16px;color:' + CTAX_PDF.NAVY + '">_____________</div></div>' +
      '</div></div>' +
      '<div class="ctpdf-divider"></div>' +
      '<h2 class="ctpdf-section-title">Payout Details</h2>' +
      '<div class="ctpdf-cols"><div class="ctpdf-col">' +
      '<div class="ctpdf-card"><div class="ctpdf-card-title">Payment Schedule</div><div class="ctpdf-card-body">Commissions paid monthly on a NET-30 basis. Your earnings dashboard updates in real-time in the Partner Portal.</div></div>' +
      '</div><div class="ctpdf-col">' +
      '<div class="ctpdf-card"><div class="ctpdf-card-title">Payment Methods</div><div class="ctpdf-card-body">Choose ACH direct deposit (fastest) or check. Set your preference in your Partner Portal account settings.</div></div>' +
      '</div></div>' +
      '<div class="ctpdf-callout"><div class="ctpdf-callout-title">Tier Upgrade Path</div><div class="ctpdf-callout-body">Most partners reach Enterprise tier (13%) within their first quarter. The jump from 8% to 13% means an extra $1,000 per case on a $20K average. Focus on hitting 10 referrals in your first 90 days to unlock Enterprise benefits including a dedicated account manager.</div></div>';
    CTAX_PDF.addFooter(p2);
    doc.appendChild(p2);

    return CTAX_PDF.renderPdf(doc, 'CTAX-Revenue-Opportunity-Calculator.pdf');
  }

  // ---------------------------------------------------------------
  // 7. DISCOVERY QUESTION BANK (2-page, organized by segment)
  // ---------------------------------------------------------------
  function discoveryQuestions() {
    var doc = CTAX_PDF.createDoc();
    doc.appendChild(CTAX_PDF.createCover(
      'Discovery Question Bank',
      'Twenty natural-language questions to surface tax debt situations organically, organized by professional segment.',
      [{ label: 'Questions', value: '20' }, { label: 'Segments', value: '4' }]
    ));

    var p1 = CTAX_PDF.createPage(true);
    CTAX_PDF.addHeader(p1, 'Discovery Question Bank');
    p1.innerHTML += '<h2 class="ctpdf-section-title">Tax Preparation & Accounting</h2>' +
      '<p class="ctpdf-section-sub">Questions to weave into tax prep meetings and financial reviews.</p>' +
      '<div class="ctpdf-item"><div class="ctpdf-item-num">1</div><div class="ctpdf-item-body">"Are you current on all your tax filings, or are there any years we should catch up on?"</div></div>' +
      '<div class="ctpdf-item"><div class="ctpdf-item-num">2</div><div class="ctpdf-item-body">"Have you received any correspondence from the IRS that you\'d like me to take a look at?"</div></div>' +
      '<div class="ctpdf-item"><div class="ctpdf-item-num">3</div><div class="ctpdf-item-body">"I noticed your estimated payments were lower than expected this year. Is there a reason you adjusted those?"</div></div>' +
      '<div class="ctpdf-item"><div class="ctpdf-item-num">4</div><div class="ctpdf-item-body">"When we ran last year\'s numbers, there was a balance due. Were you able to get that resolved?"</div></div>' +
      '<div class="ctpdf-item"><div class="ctpdf-item-num">5</div><div class="ctpdf-item-body">"Are there any tax-related concerns keeping you up at night that we haven\'t addressed?"</div></div>' +
      '<div class="ctpdf-divider"></div>' +
      '<h2 class="ctpdf-section-title">Lending & Mortgage</h2>' +
      '<p class="ctpdf-section-sub">Questions for loan applications, mortgage reviews, and credit discussions.</p>' +
      '<div class="ctpdf-item"><div class="ctpdf-item-num">6</div><div class="ctpdf-item-body">"I see a tax lien on your credit report. Can you tell me more about that situation?"</div></div>' +
      '<div class="ctpdf-item"><div class="ctpdf-item-num">7</div><div class="ctpdf-item-body">"For the income verification, do you have all your tax returns filed for the last three years?"</div></div>' +
      '<div class="ctpdf-item"><div class="ctpdf-item-num">8</div><div class="ctpdf-item-body">"Is there anything on the IRS side that might affect your ability to qualify for this loan?"</div></div>' +
      '<div class="ctpdf-item"><div class="ctpdf-item-num">9</div><div class="ctpdf-item-body">"Your debt-to-income ratio includes an IRS installment payment. Is that something you\'d want to explore reducing?"</div></div>' +
      '<div class="ctpdf-item"><div class="ctpdf-item-num">10</div><div class="ctpdf-item-body">"Before we proceed with the application, are there any outstanding federal tax obligations we should be aware of?"</div></div>';
    doc.appendChild(p1);

    var p2 = CTAX_PDF.createPage();
    CTAX_PDF.addHeader(p2, 'Discovery Question Bank');
    p2.innerHTML += '<h2 class="ctpdf-section-title">Financial Advisory & Wealth Management</h2>' +
      '<p class="ctpdf-section-sub">Questions for planning sessions, portfolio reviews, and retirement discussions.</p>' +
      '<div class="ctpdf-item"><div class="ctpdf-item-num">11</div><div class="ctpdf-item-body">"As we plan for retirement, are there any tax liabilities we need to factor into the picture?"</div></div>' +
      '<div class="ctpdf-item"><div class="ctpdf-item-num">12</div><div class="ctpdf-item-body">"Have any major life changes -- divorce, business sale, inheritance -- created unexpected tax obligations?"</div></div>' +
      '<div class="ctpdf-item"><div class="ctpdf-item-num">13</div><div class="ctpdf-item-body">"I want to make sure we\'re looking at your complete financial picture. Are there any IRS matters outstanding?"</div></div>' +
      '<div class="ctpdf-item"><div class="ctpdf-item-num">14</div><div class="ctpdf-item-body">"Your cash flow suggests some obligations beyond what we\'ve discussed. Is the IRS one of those?"</div></div>' +
      '<div class="ctpdf-item"><div class="ctpdf-item-num">15</div><div class="ctpdf-item-body">"For our estate planning work, we should address any federal tax liens. Are there any we should know about?"</div></div>' +
      '<div class="ctpdf-divider"></div>' +
      '<h2 class="ctpdf-section-title">Legal & Insurance</h2>' +
      '<p class="ctpdf-section-sub">Questions for attorneys, insurance agents, and credit counselors.</p>' +
      '<div class="ctpdf-item"><div class="ctpdf-item-num">16</div><div class="ctpdf-item-body">"In your divorce filing, are there any joint tax debts or IRS issues we need to address?"</div></div>' +
      '<div class="ctpdf-item"><div class="ctpdf-item-num">17</div><div class="ctpdf-item-body">"For your business dissolution, have all employment taxes and payroll taxes been settled with the IRS?"</div></div>' +
      '<div class="ctpdf-item"><div class="ctpdf-item-num">18</div><div class="ctpdf-item-body">"I notice some financial stress in your application. Is any of that related to IRS obligations?"</div></div>' +
      '<div class="ctpdf-item"><div class="ctpdf-item-num">19</div><div class="ctpdf-item-body">"As we work through your debt picture, are there any government debts -- state or federal taxes -- that we haven\'t included?"</div></div>' +
      '<div class="ctpdf-item"><div class="ctpdf-item-num">20</div><div class="ctpdf-item-body">"Before we finalize your policy, are there any liens or levies that could affect your assets?"</div></div>' +
      '<div class="ctpdf-callout" style="margin-top:20px"><div class="ctpdf-callout-title">How to Use These Questions</div><div class="ctpdf-callout-body">These questions are designed to feel natural in your existing conversations. You don\'t need to ask all of them -- pick the 3-5 most relevant to your practice type and weave them into your standard client intake or review process. If a client answers affirmatively, transition to the Client Introduction Script.</div></div>';
    CTAX_PDF.addFooter(p2);
    doc.appendChild(p2);

    return CTAX_PDF.renderPdf(doc, 'CTAX-Discovery-Question-Bank.pdf');
  }

  // ---------------------------------------------------------------
  // 8. IRS RESOLUTION PROGRAMS OVERVIEW (3-page with comparison table)
  // ---------------------------------------------------------------
  function irsPrograms() {
    var doc = CTAX_PDF.createDoc();
    doc.appendChild(CTAX_PDF.createCover(
      'IRS Resolution Programs Overview',
      'Plain-language explanations of every major IRS resolution program -- so you can answer client questions confidently.',
      [{ label: 'Programs', value: '7' }, { label: 'Type', value: 'Education' }]
    ));

    var p1 = CTAX_PDF.createPage(true);
    CTAX_PDF.addHeader(p1, 'IRS Resolution Programs');
    p1.innerHTML += '<h2 class="ctpdf-section-title">Program Comparison</h2>' +
      '<table class="ctpdf-table"><thead><tr><th>Program</th><th>Best For</th><th>Debt Reduction</th><th>Timeline</th></tr></thead><tbody>' +
      '<tr><td><b>Offer in Compromise</b></td><td>Clients who can\'t pay full amount</td><td>Up to 90%+ reduction</td><td>6-12 months</td></tr>' +
      '<tr><td><b>Installment Agreement</b></td><td>Clients who can pay over time</td><td>None (full amount)</td><td>30-90 days setup</td></tr>' +
      '<tr><td><b>Currently Not Collectible</b></td><td>Clients with no ability to pay</td><td>Pauses collection</td><td>30-60 days</td></tr>' +
      '<tr><td><b>Penalty Abatement</b></td><td>First-time offenders</td><td>Penalties removed</td><td>30-90 days</td></tr>' +
      '<tr><td><b>Innocent Spouse Relief</b></td><td>Spouse unaware of tax fraud</td><td>Full relief possible</td><td>3-6 months</td></tr>' +
      '<tr><td><b>Lien/Levy Release</b></td><td>Active enforcement cases</td><td>Stops seizure</td><td>Days to weeks</td></tr>' +
      '<tr><td><b>Audit Representation</b></td><td>IRS audit or examination</td><td>Varies</td><td>Varies</td></tr>' +
      '</tbody></table>' +
      '<div class="ctpdf-divider"></div>' +
      '<h2 class="ctpdf-section-title">Offer in Compromise (OIC)</h2>' +
      '<p class="ctpdf-p"><b>What it is:</b> A settlement agreement where the IRS accepts less than the full amount owed. This is the "settle for pennies on the dollar" program you see advertised -- though results vary widely based on the client\'s situation.</p>' +
      '<p class="ctpdf-p"><b>Who qualifies:</b> Clients whose reasonable collection potential (income, assets, expenses) is less than their total tax liability. The IRS uses a specific formula. Generally, clients with limited assets and income relative to their debt.</p>' +
      '<p class="ctpdf-p"><b>What to tell clients:</b> "There\'s a program where the IRS may accept a reduced amount to settle your debt. Whether you qualify depends on your specific financial situation, and Community Tax can evaluate that during the investigation."</p>';
    doc.appendChild(p1);

    var p2 = CTAX_PDF.createPage();
    CTAX_PDF.addHeader(p2, 'IRS Resolution Programs');
    p2.innerHTML += '<h2 class="ctpdf-section-title">Installment Agreement (IA)</h2>' +
      '<p class="ctpdf-p"><b>What it is:</b> A monthly payment plan with the IRS. The most common resolution program. The client pays the full amount owed, but over an extended period (up to 72 months).</p>' +
      '<p class="ctpdf-p"><b>Who qualifies:</b> Almost anyone who owes taxes. Streamlined IAs are available for debts under $50,000 with minimal paperwork. Larger debts require financial disclosure.</p>' +
      '<p class="ctpdf-p"><b>What to tell clients:</b> "Even if you can\'t pay everything today, the IRS offers structured payment plans that can spread payments over several years. The key is getting it set up properly so the terms work for your budget."</p>' +
      '<div class="ctpdf-divider"></div>' +
      '<h2 class="ctpdf-section-title">Currently Not Collectible (CNC)</h2>' +
      '<p class="ctpdf-p"><b>What it is:</b> The IRS pauses all collection activity because the client genuinely cannot pay. No payments, no levies, no garnishments. The debt still exists but the IRS stops trying to collect.</p>' +
      '<p class="ctpdf-p"><b>Who qualifies:</b> Clients whose monthly expenses meet or exceed their income. The IRS reviews this annually. After 10 years, the debt expires under the collection statute of limitations.</p>' +
      '<p class="ctpdf-p"><b>What to tell clients:</b> "If you truly can\'t afford to pay anything right now, there\'s a status that puts your account on hold. The IRS stops collection and you don\'t make payments. Community Tax can help determine if you qualify."</p>' +
      '<div class="ctpdf-divider"></div>' +
      '<h2 class="ctpdf-section-title">Penalty Abatement</h2>' +
      '<p class="ctpdf-p"><b>What it is:</b> Removal of IRS-assessed penalties (late filing, late payment, accuracy). Penalties often make up 25-50% of a client\'s total balance. Removing them can save thousands.</p>' +
      '<p class="ctpdf-p"><b>Who qualifies:</b> First-time penalty abatement is available to clients with a clean history for the prior 3 years. Reasonable cause abatement is available if the client had a legitimate reason for non-compliance (illness, disaster, bad advice).</p>' +
      '<p class="ctpdf-p"><b>What to tell clients:</b> "A significant portion of what you owe is penalties, not the actual tax. The IRS has programs to remove those penalties if you meet certain criteria. That alone could cut your balance substantially."</p>';
    doc.appendChild(p2);

    var p3 = CTAX_PDF.createPage();
    CTAX_PDF.addHeader(p3, 'IRS Resolution Programs');
    p3.innerHTML += '<h2 class="ctpdf-section-title">Innocent Spouse Relief</h2>' +
      '<p class="ctpdf-p"><b>What it is:</b> Relief from tax debt that resulted from a spouse\'s or former spouse\'s actions. If one spouse filed fraudulent returns or hid income, the other spouse may not be liable.</p>' +
      '<p class="ctpdf-p"><b>Who qualifies:</b> Spouses or former spouses who can demonstrate they had no knowledge of the tax understatement and it would be unfair to hold them responsible.</p>' +
      '<div class="ctpdf-divider"></div>' +
      '<h2 class="ctpdf-section-title">Lien & Levy Release</h2>' +
      '<p class="ctpdf-p"><b>What it is:</b> Emergency intervention to stop or reverse IRS enforcement actions. A levy seizes bank accounts or wages. A lien attaches to property. Both can be released or subordinated through proper channels.</p>' +
      '<p class="ctpdf-p"><b>Who qualifies:</b> Any client with active enforcement action. Time-sensitive -- the sooner they engage professional help, the more options are available.</p>' +
      '<p class="ctpdf-p"><b>What to tell clients:</b> "If the IRS has frozen your bank account or started garnishing your wages, that can often be stopped or reversed. Community Tax handles these situations regularly and can act quickly to protect your assets."</p>' +
      '<div class="ctpdf-divider"></div>' +
      '<div class="ctpdf-callout"><div class="ctpdf-callout-title">Important Reminder</div><div class="ctpdf-callout-body">You don\'t need to become a tax resolution expert. Your role is to identify the opportunity and make the introduction. Community Tax\'s licensed professionals handle the evaluation, recommendation, and resolution. The $295 investigation determines which programs the client qualifies for.</div></div>';
    CTAX_PDF.addFooter(p3);
    doc.appendChild(p3);

    return CTAX_PDF.renderPdf(doc, 'CTAX-IRS-Resolution-Programs-Overview.pdf');
  }

  // ---------------------------------------------------------------
  // 9. TWO-PHASE PROCESS EXPLAINER (2-page with timeline)
  // ---------------------------------------------------------------
  function twoPhaseProcess() {
    var doc = CTAX_PDF.createDoc();
    doc.appendChild(CTAX_PDF.createCover(
      'Two-Phase Process Explainer',
      'A visual walkthrough of the Investigation and Resolution process -- timeline, expectations, and revenue milestones.',
      [{ label: 'Phases', value: '2' }, { label: 'Type', value: 'Visual Guide' }]
    ));

    var p1 = CTAX_PDF.createPage(true);
    CTAX_PDF.addHeader(p1, 'Two-Phase Process');
    p1.innerHTML += '<h2 class="ctpdf-section-title">Phase 1: Investigation ($295)</h2>' +
      '<p class="ctpdf-section-sub">Duration: 2-4 weeks from client enrollment</p>' +
      '<div class="ctpdf-timeline">' +
      '<div class="ctpdf-tl-item"><div class="ctpdf-tl-dot"></div><div class="ctpdf-tl-title">Day 1-2: Client Enrollment</div><div class="ctpdf-tl-body">Client pays the $295 investigation fee and completes intake paperwork. Community Tax assigns a case manager and begins pulling IRS transcripts via Power of Attorney.</div></div>' +
      '<div class="ctpdf-tl-item"><div class="ctpdf-tl-dot"></div><div class="ctpdf-tl-title">Day 3-7: IRS Account Analysis</div><div class="ctpdf-tl-body">The team pulls all IRS transcripts, reviews filed and unfiled returns, identifies all balances and penalties, and checks for active enforcement actions (liens, levies).</div></div>' +
      '<div class="ctpdf-tl-item"><div class="ctpdf-tl-dot"></div><div class="ctpdf-tl-title">Day 7-14: Financial Assessment</div><div class="ctpdf-tl-body">The client\'s income, assets, and expenses are analyzed to determine qualification for resolution programs (OIC, IA, CNC, etc.). The team builds the strongest possible case.</div></div>' +
      '<div class="ctpdf-tl-item"><div class="ctpdf-tl-dot"></div><div class="ctpdf-tl-title">Day 14-21: Options Presentation</div><div class="ctpdf-tl-body">Client receives a detailed report showing their full IRS account status, qualified resolution programs, estimated costs, and recommended path forward. <b>No obligation to proceed.</b></div></div>' +
      '</div>' +
      '<div class="ctpdf-callout"><div class="ctpdf-callout-title">Your Role in Phase 1</div><div class="ctpdf-callout-body">After submitting the referral, your work is done. Community Tax contacts the client within 24 hours. Track the status in your Partner Portal. You don\'t need to be involved in the investigation process.</div></div>';
    doc.appendChild(p1);

    var p2 = CTAX_PDF.createPage();
    CTAX_PDF.addHeader(p2, 'Two-Phase Process');
    p2.innerHTML += '<h2 class="ctpdf-section-title">Phase 2: Resolution</h2>' +
      '<p class="ctpdf-section-sub">Duration: 30-90 days (up to 12 months for complex cases)</p>' +
      '<div class="ctpdf-timeline">' +
      '<div class="ctpdf-tl-item"><div class="ctpdf-tl-dot"></div><div class="ctpdf-tl-title">Resolution Agreement</div><div class="ctpdf-tl-body">Client reviews the investigation findings and agrees to proceed with the recommended resolution program. Resolution fees are structured -- often in monthly installments.</div></div>' +
      '<div class="ctpdf-tl-item"><div class="ctpdf-tl-dot"></div><div class="ctpdf-tl-title">File Preparation</div><div class="ctpdf-tl-body">Community Tax prepares any unfiled returns, completes IRS forms, and assembles the resolution package. This includes financial disclosures, supporting documentation, and strategic positioning.</div></div>' +
      '<div class="ctpdf-tl-item"><div class="ctpdf-tl-dot"></div><div class="ctpdf-tl-title">IRS Submission & Negotiation</div><div class="ctpdf-tl-body">The resolution package is submitted to the IRS. Community Tax negotiates directly with IRS agents on the client\'s behalf. This is where enrolled agents and tax attorneys earn their keep.</div></div>' +
      '<div class="ctpdf-tl-item"><div class="ctpdf-tl-dot"></div><div class="ctpdf-tl-title">Resolution & Compliance</div><div class="ctpdf-tl-body">The IRS accepts the resolution. The client receives their settlement terms. Community Tax ensures the client stays compliant going forward to avoid future issues.</div></div>' +
      '</div>' +
      '<div class="ctpdf-divider"></div>' +
      '<h2 class="ctpdf-section-title">When You Earn Your Commission</h2>' +
      '<div class="ctpdf-card" style="background:rgba(11,95,216,0.04);border-color:rgba(11,95,216,0.15)">' +
      '<div class="ctpdf-card-body" style="font-size:14px">' +
      'Your revenue share is earned when the client pays for resolution services (Phase 2). This happens after the investigation is complete and the client agrees to proceed.<br><br>' +
      '<b>Example:</b> A client with $25,000 in tax debt enrolls in resolution. The resolution fee is $5,000. At Enterprise tier (13%), your commission is $650 on this case. The client may also have additional fees for unfiled returns or amended filings, further increasing your share.<br><br>' +
      'Commissions are paid monthly, NET-30, via your preferred payment method.' +
      '</div></div>';
    CTAX_PDF.addFooter(p2);
    doc.appendChild(p2);

    return CTAX_PDF.renderPdf(doc, 'CTAX-Two-Phase-Process-Explainer.pdf');
  }

  // ---------------------------------------------------------------
  // 10. SPANISH-LANGUAGE CLIENT EXPLAINER (1-page bilingual)
  // ---------------------------------------------------------------
  function spanishExplainer() {
    var doc = CTAX_PDF.createDoc();
    doc.appendChild(CTAX_PDF.createCover(
      'Explicacion para Clientes\nClient Explainer',
      'A bilingual one-pager explaining the Community Tax process and IRS resolution options. Designed to share directly with Spanish-speaking clients.',
      [{ label: 'Languages', value: 'EN / ES' }, { label: 'Format', value: 'Client-Facing' }]
    ));

    var p1 = CTAX_PDF.createPage(true);
    CTAX_PDF.addHeader(p1, 'Client Explainer / Explicacion para Clientes');
    p1.innerHTML += '<div class="ctpdf-cols" style="gap:32px">' +
      '<div class="ctpdf-col" style="border-right:2px solid ' + CTAX_PDF.BLUE + ';padding-right:24px">' +
      '<h2 style="font-family:DM Serif Display,serif;font-size:20px;color:' + CTAX_PDF.NAVY + ';margin:0 0 12px">English</h2>' +
      '<h3 style="font-size:15px;font-weight:700;color:' + CTAX_PDF.BLUE + ';margin:0 0 8px">Do You Owe the IRS?</h3>' +
      '<p class="ctpdf-p" style="font-size:12px">If you have unfiled tax returns, owe back taxes, or have received IRS notices, <b>you have options</b>. Community Tax is a national firm that specializes in helping people resolve their IRS tax debt.</p>' +
      '<h3 style="font-size:13px;font-weight:700;color:' + CTAX_PDF.NAVY + ';margin:16px 0 6px">How It Works</h3>' +
      '<p class="ctpdf-p" style="font-size:12px"><b>Step 1:</b> Pay $295 for a complete IRS investigation. We pull your records and analyze your options.</p>' +
      '<p class="ctpdf-p" style="font-size:12px"><b>Step 2:</b> We present your resolution options -- payment plans, settlements, penalty removal, and more.</p>' +
      '<p class="ctpdf-p" style="font-size:12px"><b>Step 3:</b> If you choose to proceed, we negotiate directly with the IRS on your behalf.</p>' +
      '<h3 style="font-size:13px;font-weight:700;color:' + CTAX_PDF.NAVY + ';margin:16px 0 6px">Available Programs</h3>' +
      '<p class="ctpdf-p" style="font-size:12px">&bull; Offer in Compromise (settle for less)<br>&bull; Payment Plans<br>&bull; Penalty Removal<br>&bull; Lien & Levy Release<br>&bull; Unfiled Return Assistance</p>' +
      '<p class="ctpdf-p" style="font-size:12px"><b>15+ years</b> in business &bull; <b>$2.3B+</b> resolved &bull; <b>120,000+</b> clients helped</p>' +
      '</div>' +
      '<div class="ctpdf-col" style="padding-left:8px">' +
      '<h2 style="font-family:DM Serif Display,serif;font-size:20px;color:' + CTAX_PDF.NAVY + ';margin:0 0 12px">Espanol</h2>' +
      '<h3 style="font-size:15px;font-weight:700;color:' + CTAX_PDF.BLUE + ';margin:0 0 8px">Le Debe al IRS?</h3>' +
      '<p class="ctpdf-p" style="font-size:12px">Si tiene declaraciones de impuestos sin presentar, debe impuestos atrasados, o ha recibido avisos del IRS, <b>tiene opciones</b>. Community Tax es una firma nacional especializada en resolver deudas tributarias con el IRS.</p>' +
      '<h3 style="font-size:13px;font-weight:700;color:' + CTAX_PDF.NAVY + ';margin:16px 0 6px">Como Funciona</h3>' +
      '<p class="ctpdf-p" style="font-size:12px"><b>Paso 1:</b> Pague $295 por una investigacion completa del IRS. Revisamos sus registros y analizamos sus opciones.</p>' +
      '<p class="ctpdf-p" style="font-size:12px"><b>Paso 2:</b> Le presentamos sus opciones de resolucion -- planes de pago, acuerdos, eliminacion de multas, y mas.</p>' +
      '<p class="ctpdf-p" style="font-size:12px"><b>Paso 3:</b> Si decide continuar, negociamos directamente con el IRS en su nombre.</p>' +
      '<h3 style="font-size:13px;font-weight:700;color:' + CTAX_PDF.NAVY + ';margin:16px 0 6px">Programas Disponibles</h3>' +
      '<p class="ctpdf-p" style="font-size:12px">&bull; Oferta de Compromiso (pagar menos)<br>&bull; Planes de Pago<br>&bull; Eliminacion de Multas<br>&bull; Liberacion de Embargos<br>&bull; Ayuda con Declaraciones Atrasadas</p>' +
      '<p class="ctpdf-p" style="font-size:12px"><b>15+ anos</b> de experiencia &bull; <b>$2.3B+</b> resueltos &bull; <b>120,000+</b> clientes ayudados</p>' +
      '</div></div>' +
      '<div style="text-align:center;margin-top:24px;padding:16px;background:' + CTAX_PDF.NAVY + ';border-radius:8px;color:#fff">' +
      '<div style="font-size:14px;font-weight:700;margin-bottom:4px">Call / Llame: 1-855-332-2873</div>' +
      '<div style="font-size:12px;color:rgba(255,255,255,0.7)">communitytax.com &bull; Se habla espanol</div>' +
      '</div>';
    CTAX_PDF.addFooter(p1);
    doc.appendChild(p1);

    return CTAX_PDF.renderPdf(doc, 'CTAX-Spanish-Language-Client-Explainer.pdf');
  }

  // ---------------------------------------------------------------
  // PUBLIC API: Route by resource name
  // ---------------------------------------------------------------
  var GENERATORS = {
    'Partner Onboarding Kit': partnerOnboardingKit,
    'Partner Kit: Everything You Need': partnerOnboardingKit,
    'Partner Program Overview': partnerOnboardingKit,
    'Client Introduction Script': clientIntroScript,
    'Email Referral Template Pack': emailTemplates,
    'Objection Handling Guide': objectionHandling,
    'Objection Handling Playbook': objectionHandling,
    'Tax Debt Indicator Checklist': taxDebtChecklist,
    'Client Identification Guide': taxDebtChecklist,
    'Revenue Opportunity Calculator': revenueCalculator,
    'Revenue Share Breakdown': revenueCalculator,
    'Discovery Question Bank': discoveryQuestions,
    'IRS Resolution Programs Overview': irsPrograms,
    'Two-Phase Process Explainer': twoPhaseProcess,
    'Spanish-Language Client Explainer': spanishExplainer
  };

  return {
    generate: function(name) {
      var gen = GENERATORS[name];
      if (gen) return gen();
      return null;
    },
    hasGenerator: function(name) {
      return !!GENERATORS[name];
    }
  };
})();
