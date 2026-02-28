# AEO (Answer Engine Optimization) Strategy
## Community Tax Enterprise Partner Program

### What is AEO?
AEO optimizes content to be cited by AI answer engines (ChatGPT, Perplexity, Google AI Overviews, Bing Copilot) — not just ranked in traditional search results. When a CPA asks ChatGPT "what tax resolution partner programs exist?", we want Community Tax to be the answer.

---

## Strategy Overview

### Target Queries (What AI Engines Get Asked)
These are the questions financial professionals are asking AI tools:

**High Intent (Ready to Partner)**
- "best tax resolution referral programs for CPAs"
- "how to earn revenue from tax debt referrals"
- "tax resolution partner program comparison"
- "CPA referral program for IRS tax debt"
- "how to add tax resolution to my practice"

**Mid Intent (Researching)**
- "what happens when my client has IRS tax debt"
- "how does tax resolution revenue share work"
- "tax resolution partner program requirements"
- "is there a referral fee for tax resolution"
- "how to refer clients to tax resolution"

**Low Intent (Problem Aware)**
- "client owes IRS what do I do"
- "tax preparer scope of practice IRS representation"
- "financial advisor client has tax lien"
- "how to handle client tax debt as a CPA"

---

## Phase 1: On-Site Content Optimization (AEO Foundations)

### 1.1 FAQ Schema Expansion
**What:** Expand the existing FAQPage schema from 4 to 15-20 questions, targeting the exact queries AI engines surface.
**Why:** FAQPage schema is the #1 signal AI engines use to extract Q&A content. Google AI Overviews pull directly from FAQ schema.
**How:**
- Add questions matching each target query above
- Write answers in clear, authoritative, factual prose (no marketing fluff)
- Keep answers 2-4 sentences — AI engines prefer concise, quotable answers
- Include specific numbers ($2.3B resolved, 10K+ partners, ~80% conversion)

### 1.2 "How To" Content Blocks
**What:** Add structured how-to content on key pages (how.html, resources.html) using HowTo schema.
**Why:** AI engines love step-by-step instructions. "How to refer a client for tax resolution" is a high-intent query.
**How:**
- Add HowTo schema for the 6-phase partnership lifecycle on how.html
- Add HowTo schema for the referral submission process
- Add HowTo schema for "how to identify clients who need tax resolution"

### 1.3 Comparison Content
**What:** Enhance compare.html with more detailed, factual comparison data.
**Why:** "X vs Y" queries are extremely common in AI engines. "Community Tax vs in-house tax resolution" should return our comparison page.
**How:**
- Add specific data points (resolution timelines, success rates, cost ranges)
- Use Table schema markup for the comparison table
- Add a "Bottom Line" summary paragraph that AI can directly quote

### 1.4 Glossary / Definitions
**What:** Add a tax resolution glossary section to resources.html or a new glossary page.
**Why:** AI engines pull definitions from pages with DefinedTerm schema. When someone asks "what is an offer in compromise", we want to be the source.
**How:**
- Define 15-20 key terms: Offer in Compromise, Installment Agreement, Currently Not Collectible, Penalty Abatement, Innocent Spouse Relief, Tax Lien, Tax Levy, Wage Garnishment, IRS Form 2848, Revenue Officer, etc.
- Use DefinedTerm schema for each
- Keep definitions factual, authoritative, 2-3 sentences

---

## Phase 2: Content Architecture for AI Citability

### 2.1 Entity Signals
**What:** Strengthen the "Community Tax" entity in Google's Knowledge Graph.
**Why:** AI engines cite entities they recognize. The stronger our entity signals, the more likely we are cited.
**How:**
- Ensure Organization schema has all fields filled (founding date, number of employees, area served, etc.) [DONE]
- Add sameAs links to any social profiles, LinkedIn company page, BBB listing
- Add founder/leadership names if public

### 2.2 Authoritative Statistics Page
**What:** Create a "Tax Debt Statistics" or "IRS Tax Resolution Data" page with cited statistics.
**Why:** AI engines love citing authoritative statistics pages. CPAs and advisors asking about market size will see our data.
**How:**
- Compile 20-30 IRS statistics with sources (IRS Data Book, GAO reports)
- Format as a single, well-structured page with clear headers
- Use Dataset schema or Article schema with citation annotations
- Include: total tax gap, delinquent accounts, OIC acceptance rates, average assessment amounts, enforcement trends

### 2.3 Expert Content Signals
**What:** Add author attribution to key content pages.
**Why:** AI engines weight content from identified experts (E-E-A-T). Anonymous content is less likely to be cited.
**How:**
- Add bylines to educational content: "Written by [Name], EA" or "Reviewed by [Name], Tax Attorney"
- Use Person schema for authors with credentials
- Link to author bios (can be a simple section on the about/team page)

---

## Phase 3: Off-Site AEO Signals

### 3.1 Content Distribution
**What:** Publish derivative content on platforms AI engines index heavily.
**Why:** Perplexity and ChatGPT pull from Reddit, LinkedIn, Quora, Medium, and industry publications. Presence on these platforms increases citation probability.
**Channels:**
- **LinkedIn Articles:** "How CPAs Can Earn Revenue from IRS Tax Debt Referrals" (link back to site)
- **Industry Publications:** Guest posts on AccountingToday, CPA Practice Advisor, ThinkAdvisor, etc.
- **YouTube:** Short videos explaining the partner program (YouTube is heavily indexed by AI)
- **Quora/Reddit:** Answer questions about tax resolution referral programs (genuine, helpful, not spammy)

### 3.2 Mentions and Citations
**What:** Get Community Tax mentioned in existing content that AI engines already cite.
**Why:** When AI engines see a brand mentioned across multiple authoritative sources, they're more confident citing it.
**How:**
- Pitch to existing "best tax resolution services" listicle sites
- Get included in CPA/financial advisor partner program directories
- Seek reviews on G2, Trustpilot, or industry-specific review platforms

### 3.3 Structured Data Ecosystem
**What:** Ensure every touchpoint has consistent structured data.
**Why:** AI engines cross-reference entities across the web. Consistency builds trust.
**How:**
- Google Business Profile with matching Organization schema
- LinkedIn company page with matching description
- BBB listing with matching business info

---

## Phase 4: Technical AEO Implementation

### 4.1 Speakable Schema
**What:** Add Speakable schema to key content sections.
**Why:** Google specifically uses Speakable schema for voice assistant and AI Overview responses.
**How:**
- Mark the FAQ answers as speakable
- Mark the "how it works" summary as speakable
- Mark the comparison "bottom line" as speakable
- Keep speakable content under 3 sentences

### 4.2 Crawlable SPA Content
**What:** Add a prerendered/static HTML fallback for key pages.
**Why:** While Googlebot renders JavaScript, AI engines like Perplexity and ChatGPT's Browse tool may not fully render SPAs. Static HTML ensures content is accessible.
**How:**
- Generate static HTML snapshots for the top 5-7 pages (home, why, how, tiers, faq, compare, apply)
- Serve via prerender.io or a simple build script that snapshots the rendered SPA
- Alternatively, add a `<noscript>` content block with key page text for non-JS crawlers

### 4.3 Semantic HTML Improvements
**What:** Continue improving semantic HTML across all pages.
**Why:** AI engines parse HTML structure to understand content hierarchy and extract relevant answers.
**How:**
- Ensure every page has proper heading hierarchy (h1 > h2 > h3) [PARTIALLY DONE]
- Use `<article>` for standalone content sections
- Use `<aside>` for supplementary information
- Add `<time>` elements for dates
- Add `lang` attributes if any content is in Spanish

---

## Implementation Priority

| Phase | Effort | Impact | Priority |
|-------|--------|--------|----------|
| 1.1 FAQ Schema Expansion | Low | Very High | Do First |
| 1.2 HowTo Schema | Low | High | Do Second |
| 1.4 Glossary / Definitions | Medium | High | Do Third |
| 4.1 Speakable Schema | Low | Medium | Do Fourth |
| 1.3 Comparison Enhancement | Medium | High | Do Fifth |
| 2.2 Statistics Page | High | Very High | Do Sixth |
| 2.1 Entity Signals | Low | Medium | Do Seventh |
| 2.3 Expert Content | Medium | Medium | Later |
| 3.1-3.3 Off-Site | Ongoing | Very High | Parallel |
| 4.2 Prerendering | High | High | Later |
| 4.3 Semantic HTML | Medium | Medium | Ongoing |

---

## Success Metrics

1. **AI Citation Rate:** Search "[brand] tax resolution partner" in ChatGPT, Perplexity, Gemini — track whether Community Tax appears in responses
2. **Google AI Overview Presence:** Monitor target queries for AI Overview inclusion
3. **Organic Click-Through:** Track clicks from AI-generated snippets vs traditional SERP
4. **FAQ Rich Results:** Monitor Search Console for FAQ rich result impressions
5. **Referral Traffic from AI:** Track referral traffic from perplexity.ai, chat.openai.com domains

---

## Estimated Timeline

- **Week 1:** Phase 1 (FAQ expansion, HowTo schema, glossary, comparison enhancements)
- **Week 2:** Phase 4.1 (Speakable schema) + Phase 2.1 (Entity signals)
- **Week 3:** Phase 2.2 (Statistics page) + Phase 2.3 (Expert content)
- **Week 4+:** Phase 3 (Off-site) + Phase 4.2 (Prerendering) — ongoing

---

*Strategy prepared for review. Implementation paused pending Josh's approval.*
