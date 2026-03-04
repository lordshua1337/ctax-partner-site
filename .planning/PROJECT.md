# CTAX Partner Portal — AI Tools Upgrade

## What This Is

The Community Tax partner portal (lordshua1337.github.io/ctax-partner-site) is a GitHub Pages-hosted platform for tax resolution referral partners. It includes AI-powered tools (Script Builder, Ad Maker, Client Qualifier, Knowledge Base, Page Builder) and an ICP Builder on the main site. This project upgrades all AI tools to be ICP-driven, dynamic, and connected to external services — making them as polished as the 30-Day Challenge and Business Planner.

## Core Value

Every AI output in the portal must be personalized to the partner's Ideal Client Profile — if the ICP doesn't flow through every tool, nothing else matters.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] ICP Builder on main site gets a "Save to Portal" button that persists ICP data (localStorage/JSON) so the portal can read it
- [ ] Shared ICP context object (JSON schema) consumed by every AI tool in the portal
- [ ] Script Builder uses ICP data to pre-fill client situation, adjust tone to profession type, and generate scripts referencing ICP red flags and talking points
- [ ] Ad Maker pulls ICP demographics, geography, and pain points to auto-generate targeted ad copy with profession-specific hooks
- [ ] Client Qualifier cross-references inputs against ICP disqualifiers and conversion drivers, outputs a qualification score with ICP-informed reasoning
- [ ] Knowledge Base responses are contextualized to the partner's profession type and client persona from ICP
- [ ] Page Builder generates landing pages using ICP data — headlines, testimonials, CTAs all tailored to the partner's ideal client
- [ ] External service integrations: Unsplash/Pexels for stock imagery in Page Builder and Ad Maker, free-tier AI image generation for custom visuals
- [ ] Output quality parity with 30-Day Challenge and Business Planner (structured, multi-section, actionable outputs with tabs/sections)

### Out of Scope

- 30-Day Challenge modifications — already high quality, leave as-is
- Business Planner modifications — already high quality, leave as-is
- Paid API integrations above ~$20/mo — keep it free or cheap
- Backend/server infrastructure — staying on GitHub Pages with client-side logic
- User authentication system — portal doesn't need login for now

## Context

- Portal is a static GitHub Pages site powered by Claude AI (noted in footer)
- ICP Builder exists on the main site's AI Tools experience page with a 6-question flow producing rich output (Who They Are, Red Flags, How to Bring It Up, Why They Convert, Disqualifiers, 12-week playbook)
- The ICP Builder page already states "this profile powers everything in your portal" but that integration doesn't actually exist yet — the save/transfer mechanism is the critical missing link
- Current AI tools work but produce generic outputs not tied to any partner context
- Professional types supported: CPA, Attorney, Financial Advisor, Realtor, Mortgage Broker, Insurance Agent, General
- Existing planning work: AEO strategy (answer engine optimization) and site-wide HTML/SEO optimization plan

## Constraints

- **Tech stack**: GitHub Pages (static site, client-side JS only) — no server-side processing
- **Budget**: Free or very cheap external services only (~$20/mo ceiling)
- **AI provider**: Claude API (already integrated) — all tool outputs go through Claude
- **Data persistence**: localStorage or URL params for ICP transfer between main site and portal (no database)
- **Compatibility**: Must not break existing 30-Day Challenge or Business Planner functionality

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| ICP stored as JSON in localStorage | Simplest cross-page persistence without a backend; portal reads what main site writes | — Pending |
| ICP schema as single shared object | All tools consume same data structure, prevents drift between tools | — Pending |
| Free-tier external APIs only | Partner program shouldn't carry infrastructure costs; Unsplash/Pexels/Cloudinary all have free tiers | — Pending |
| Phase 0 (ICP bridge) ships first | Nothing else works without the ICP data flowing into the portal | — Pending |

---
*Last updated: 2026-03-03 after initialization*
