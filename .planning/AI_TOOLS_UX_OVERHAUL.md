# AI Tools UX Overhaul Plan

## The Core Problem

10 AI tools presented as equals with no hierarchy. User opens the portal and sees a buffet: Script Builder, Ad Maker, Business Planner, Client Qualifier, AI Writer, Marketing Kit, 30-Day Challenge, BP Playbook, ICP Builder, AI Campaign -- all at the same level in the sidebar. No sense of "start here", "do this next", or "you're making progress."

The Business Planner and 30-Day Challenge SHOULD be the backbone that drives tool usage, but right now they're just two more items in the list. A new partner has no idea where to begin.

## The Fix: One Path, Not Ten Doors

### The Journey (what the user experiences)

```
PHASE 1: KNOW YOUR CLIENT (one-time setup, 10 min)
  ICP Builder questionnaire
  Output: Ideal Client Profile saved to context
  CTA: "Now let's build your plan"

PHASE 2: BUILD YOUR PLAN (one-time setup, 15 min)
  Business Planner -- pre-filled with ICP data
  Output: 90-day roadmap with specific tool assignments per week
  CTA: "Start your 30-Day Challenge"

PHASE 3: EXECUTE DAILY (30 days)
  30-Day Challenge -- each day opens the RIGHT tool
  with the RIGHT context pre-loaded
  Progress visible everywhere

PHASE 4: GRADUATE (after day 30)
  BP Playbook generates as a reward
  Monthly rhythm established
  Tools now freely accessible with full context
```

---

## Implementation Plan

### Step 1: Restructure the Portal Sidebar

**File: index.html (portal sidebar section)**

Current sidebar: flat list of 19 sections, all equal weight.

New sidebar structure:
```
YOUR JOURNEY (highlighted section)
  - Dashboard (home)
  - 30-Day Challenge (with day X/30 badge)

TOOLS (organized by when you need them)
  Setup Tools
    - ICP Builder
    - Business Planner
  Daily Tools
    - Script Builder
    - Client Qualifier
    - Marketing Kit
  Create Tools
    - Ad Maker
    - Landing Page Builder
  Learn
    - Training
    - Playbook
    - CE Webinars

ACCOUNT
  - Referrals
  - Earnings
  - Settings
```

Why: Groups tools by WHEN you use them, not WHAT they are. Setup tools you do once. Daily tools you use during the Challenge. Create tools when you need assets. This gives the user a mental model.

### Step 2: Build the Journey Bar

**File: js/portal.js (new component)**

Add a persistent progress bar at the top of the portal that shows:
```
[1. Know Your Client] → [2. Build Your Plan] → [3. Execute Daily] → [4. Graduate]
     ✓ Complete          ✓ Complete           Day 8/30              Locked
```

Logic:
- Phase 1 complete = `ICPContext.hasProfile()` returns true
- Phase 2 complete = `localStorage.getItem('bp_saved_inputs')` exists
- Phase 3 progress = Challenge state `currentDay` / 30
- Phase 4 unlocks = Challenge day 30 completed

This bar appears on EVERY portal section. It's the persistent "you are here" indicator.

Data sources (all already exist):
- `ctax_icp_profile` (localStorage) -- ICP completion
- `bp_saved_inputs` (localStorage) -- Business Planner completion
- `ch_30day_v1` (localStorage) -- Challenge progress

### Step 3: Redesign the Dashboard Landing

**File: js/portal.js (dashboard section rendering)**

Current: Score card + KPI cards + referral pipeline. Dense, metrics-heavy, intimidating for new users.

New: Context-aware landing that changes based on journey phase.

**If Phase 1 not done (no ICP):**
```
"Let's figure out who your ideal client is"
[Big CTA: Build Your Client Profile -- 10 minutes]
Below: Brief explanation of why this matters
```

**If Phase 1 done, Phase 2 not done (no roadmap):**
```
"Great -- you know your client. Now let's build your plan."
ICP summary card (title, fit score, commission range)
[Big CTA: Build Your 90-Day Roadmap]
```

**If Phase 2 done, Challenge not started:**
```
"Your roadmap is ready. Time to execute."
Roadmap summary (3 months, key milestones)
[Big CTA: Start Your 30-Day Challenge]
```

**If Challenge in progress:**
```
Today's Task card (big, prominent)
  "Day 8: Build an email drip sequence"
  [Open Script Builder]
Progress ring (8/30 days, current streak)
Quick stats: scripts created, clients qualified, referrals submitted
```

**If Challenge complete:**
```
"You did it. Here's what you built in 30 days."
Stats summary
[Generate Your Personalized Playbook]
Monthly rhythm card (suggested weekly actions)
Full tool access below
```

### Step 4: Wire ICP → Business Planner

**File: js/business-planner.js**

Current: Business Planner asks 7+ questions from scratch, ignoring ICP data.

Change: On BP init, check `ICPContext.hasProfile()`. If true:
- Pre-fill `practiceType` from `icp.answers.q1` (practice type)
- Pre-fill `audience` from `icp.answers.q2` (client base)
- Pre-fill `geo` from `icp.answers.q5` (geography)
- Show: "Based on your ICP: [title]. We've pre-filled your profile."
- Skip redundant questions, show only: budget, referral goal, timeline

This cuts the BP intake from 7 questions to 3. Faster, smarter, connected.

### Step 5: Wire Business Planner → Challenge

**File: js/challenge.js + js/business-planner.js**

Current: Challenge and BP are independent. Both track tasks. Both have progress bars. User does double work.

Change:
- After BP generates a roadmap, auto-prompt: "Start your 30-Day Challenge? Your roadmap will guide each day."
- Challenge Day 1 task changes from "Set your 90-day referral goal" (which IS the BP) to "Review your roadmap and pick your first client to contact"
- BP task completion syncs to Challenge progress where tasks overlap
- Kill BP's independent task-tracking UI. Challenge owns daily progress. BP owns the strategic view (monthly milestones).

### Step 6: Add Context to Challenge Tool Links

**File: js/challenge.js**

Current: Day 4 says "Build your referral intro script" and links to `portal-sec-ai-scripts`. User opens Script Builder and sees a blank form.

Change: Pass context when opening tools from Challenge.

```javascript
// Current
portalNav(null, 'portal-sec-ai-scripts');

// New
portalNav(null, 'portal-sec-ai-scripts', {
  source: 'challenge',
  day: 4,
  preset: 'intro-script',
  context: ICPContext.hasProfile() ? ICPContext.load().profession_type : null
});
```

Each tool checks for incoming context on init:
- Script Builder: pre-selects the right template, pre-fills practice type
- Client Qualifier: shows "Qualifying against your ICP: [title]"
- Ad Maker: pre-loads brand colors from settings
- Marketing Kit: highlights the specific asset type the Challenge recommends

This means each Challenge task opens a tool that's READY TO USE, not blank.

### Step 7: Add "What's Next" CTAs to Every Tool

**File: Each tool's JS file**

Current: After generating a script, the user sees "Copy" and "Download PDF". No suggestion of what to do next.

Change: After every tool output, show a contextual next-step card:

Script Builder → "Now practice this script. When ready, qualify a real client." [Open Client Qualifier]
Client Qualifier → "This client scores 87%. Ready to refer?" [Submit Referral]
Ad Maker → "Ad created. Share it on social for Day 12." [Mark Challenge Day Complete]
Marketing Kit → "Email template ready. Send it to 3 prospects." [Mark Day Complete]
ICP Builder → "Profile saved. Now build your 90-day plan." [Open Business Planner]

Logic: Check Challenge state. If user is on Day X which uses this tool, show "Complete Day X" button. Otherwise show the generic next-step.

### Step 8: Retire/Merge Redundant Tools

**AI Writer** -- Currently orphaned. Zero connections to Challenge or BP. Two options:
- Option A: Merge into Script Builder as a "freeform" tab
- Option B: Wire into Challenge Days 6, 14, 22 for email drafting

Recommendation: Option A. Script Builder already handles multiple output types. AI Writer's freeform mode becomes Script Builder's "Custom" template.

**BP Playbook** -- Currently available alongside BP. Should be a graduation reward.
- Remove from sidebar during Challenge
- Auto-generate after Day 30 completes
- Position as: "Your personalized playbook based on 30 days of real data"

### Step 9: Unified Progress Tracking

**File: js/portal.js (new module)**

Create a single progress object that all tools read/write:

```javascript
var PartnerProgress = {
  icpComplete: boolean,
  planComplete: boolean,
  challengeDay: number,
  challengeComplete: boolean,
  scriptsCreated: number,
  clientsQualified: number,
  referralsSubmitted: number,
  adsCreated: number,
  emailsSent: number
};
```

Sources: aggregated from existing localStorage keys. No new storage -- just a unified read layer.

This feeds:
- Journey bar (step 2)
- Dashboard landing (step 3)
- Challenge progress ring
- "What's next" logic (step 7)

---

## Execution Order

| Order | Step | Files Changed | Depends On | Risk |
|-------|------|---------------|------------|------|
| 1 | Unified Progress Tracking | portal.js (new module) | Nothing | Low -- read-only aggregation |
| 2 | Journey Bar | portal.js + index.html | Step 1 | Low -- additive UI |
| 3 | Dashboard Redesign | portal.js | Steps 1-2 | Medium -- changes first impression |
| 4 | Sidebar Restructure | index.html + portal.js | Step 2 | Medium -- changes navigation |
| 5 | ICP → BP Data Flow | business-planner.js | Nothing | Low -- additive logic |
| 6 | BP → Challenge Sync | challenge.js + business-planner.js | Step 5 | Medium -- two files touch shared state |
| 7 | Challenge Context Passing | challenge.js + each tool JS | Step 6 | Medium -- touches many files |
| 8 | "What's Next" CTAs | All tool JS files | Steps 1, 7 | Low -- additive to each tool |
| 9 | AI Writer Merge | script-builder.js + ai-writer.js | Step 8 | Low -- consolidation |
| 10 | Marketing Kit: Brand Persistence | marketing-kit.js | Nothing | Low -- localStorage save/load |
| 11 | Marketing Kit: Quick Start Kit | marketing-kit.js | Step 10 | Medium -- generates 3 assets |
| 12 | Marketing Kit: Challenge-Aware | marketing-kit.js | Steps 7, 10 | Low -- reads context |
| 13 | Marketing Kit: Smarter Defaults | marketing-kit.js | Step 10 | Low -- default value changes |
| 14 | BP Playbook Gating | bp-playbook.js + portal.js | Step 6 | Low -- visibility toggle |

### Step 10: Marketing Kit -- Ready Out of the Box

**Files: js/marketing-kit.js + js/portal.js**

The Marketing Kit has 7 builders and 3 downloadable templates. The content is solid. The problem is friction: every builder starts blank, logos don't persist, and there's no "just get me started" path.

#### 10a: Save Firm Branding Once (localStorage)

**Current:** Partner re-enters firm name, phone, email, tagline, uploads logo separately in every single builder. Logo stored in JS variables -- gone on refresh.

**Change:** Create a `PartnerBrand` object in localStorage (`ctax_partner_brand`):
```javascript
{
  firmName: "Smith Tax Group",
  phone: "555-123-4567",
  email: "info@smithtax.com",
  website: "smithtax.com",
  tagline: "Your tax resolution partner",
  brandColor: "#0B5FD8",
  logoDataUrl: "data:image/png;base64,..."
}
```

- On Marketing Kit init, check `PartnerBrand`. If exists, auto-fill every builder's fields.
- Add a "Brand Settings" card at the top of the Marketing Kit: "Set up once, use everywhere." Shows current brand info with edit button.
- Logo upload saves to `PartnerBrand.logoDataUrl` as base64 data URL. Persists across sessions and all builders.
- If ICP profile exists, pre-fill practice type context into flyer/deck builders.

#### 10b: Quick Start Kit (one-click starter pack)

**Current:** Partner has to open each builder individually, fill fields, generate, download. 7 builders = 7 separate workflows.

**Change:** Add a "Generate Starter Kit" button at the top of Marketing Kit.

One click generates 3 ready-to-use assets:
1. **Client outreach email** -- pre-filled with firm info, practice area from ICP
2. **Social media post** -- firm-branded, uses ICP target audience for messaging
3. **One-pager** -- complete partner flyer with all firm details

All three use saved `PartnerBrand` data. Downloads as a zip or sequential PDFs. Partner walks away with usable marketing materials in under 2 minutes.

Requirements:
- `PartnerBrand` must be set (if not, prompt to fill it first -- 30 seconds)
- ICP data optional but enhances output (practice area, geography, client type)

#### 10c: Challenge-Aware Asset Surfacing

**Current:** Challenge Day 12 says "create a social ad" and sends the partner to the Marketing Kit grid. Partner sees 10+ options and has to find the right builder.

**Change:** When Marketing Kit receives context from Challenge (via Step 6 context passing):
- Auto-open the specific builder the Challenge task calls for
- Pre-fill with `PartnerBrand` + ICP data
- Show a banner: "Day 12 Task: Create a social ad for your practice"
- After generating, show "Mark Day 12 Complete" button (ties into Step 7 What's Next CTAs)

Context mapping:
- Challenge tasks mentioning "email" → open Email Builder
- Challenge tasks mentioning "social" or "ad" → open Ad Builder or Social Builder
- Challenge tasks mentioning "flyer" or "print" → open Flyer Builder
- Challenge tasks mentioning "presentation" or "pitch" → open Deck Builder

#### 10d: Smarter Defaults in Each Builder

Small changes that eliminate decision fatigue:

- **Ad Builder:** Default to Facebook size (most common). Pre-select "Dark Navy" template (highest contrast, most professional). If ICP exists, auto-generate first headline.
- **Flyer Builder:** Auto-select practice area from ICP answers. Generate copy immediately on open instead of requiring a click.
- **Deck Builder:** Auto-select audience from ICP (CPA → "CPAs/Tax Professionals"). Pre-fill firm stats.
- **Email Builder:** Default to "Client Outreach" (higher conversion than seasonal). Pre-fill all firm fields.
- **Social Builder:** Default to Instagram Feed size (most versatile). Pre-fill firm name and color.

---

## What This Does NOT Change

- The AI tools themselves (prompts, outputs, quality) -- those work fine
- The 30-day task content (titles, descriptions, points) -- good as-is
- The referral submission flow -- separate system
- Any backend/API logic -- all changes are frontend JS

## Success Criteria

A new partner who has never seen the portal should:
1. Know EXACTLY what to do first (ICP Builder)
2. Feel guided through setup (ICP → BP → Challenge)
3. Never see a blank tool (context always pre-loaded from Challenge)
4. Know what to do after every tool interaction (next-step CTA)
5. See their progress everywhere (journey bar)
6. Never feel overwhelmed by 10 tools at once (sidebar hierarchy + phased reveal)
7. Have usable marketing materials within 2 minutes (Quick Start Kit)
8. Never re-enter firm info twice (Brand Persistence)
