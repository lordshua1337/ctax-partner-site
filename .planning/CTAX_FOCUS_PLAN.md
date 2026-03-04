# CTAX Focused Iteration Plan

## Scope
5 modules, 3 passes each. Major upgrades only. Each pass must be BIGGER than the last (throttle prevents downgrading).

## Module Order
1. Web Builder (page builder) -- flagship product, visual quality + features
2. AI Tools (Script Builder, Ad Maker, Client Qualifier, Knowledge Base) -- NOT ICP Builder
3. CTAX Portal (dashboard, navigation, overall UX)
4. 30-Day Challenge (gamification, backend hooks, celebrations)
5. Business Planner (intelligence layer, real projections)

---

## MODULE 1: WEB BUILDER (3 passes)

### Pass 1: FEATURE COMPLETENESS (Medium)
**Goal**: Every feature in the builder actually works, nothing feels broken
- [ ] Add background removal option for uploaded images (canvas API or remove.bg integration)
- [ ] Add "Duplicate Page" button in My Pages (tooltip says it exists, doesn't work)
- [ ] Add "Copy Live URL" button in My Pages for sharing published pages
- [ ] Fix re-onboarding on every session -- remember last template/theme choice
- [ ] Add undo/redo keyboard shortcuts (Cmd+Z, Cmd+Shift+Z) visible in toolbar

### Pass 2: DESIGN QUALITY UPGRADE (Large)
**Goal**: Every template looks like a $5K landing page out of the box
- [ ] Add 3 more hero variants (video embed hero, countdown timer hero, split-with-form hero)
- [ ] Add image upload handling with drag-drop zone replacing placeholders
- [ ] Add section-level background options (solid, gradient, image, pattern)
- [ ] Add pre-built color scheme presets beyond Boho Earth (Corporate Blue, Luxury Dark, Fresh Green, Warm Sunset)
- [ ] Add Google Fonts picker with 10 curated pairings
- [ ] Improve mobile responsive preview (show actual phone frame)

### Pass 3: PROFESSIONAL EXPORT (Large+)
**Goal**: Published pages are indistinguishable from hand-coded professional sites
- [ ] Add custom domain/subdomain display in published page URL bar
- [ ] Add analytics snippet injection (Google Analytics, Meta Pixel) in page settings
- [ ] Add SEO meta editor (title, description, OG image) per published page
- [ ] Add form submission handling (email notification, webhook, or localStorage capture)
- [ ] Add page loading animation (skeleton/fade-in) for published pages
- [ ] Add footer with partner branding auto-injected on all published pages

---

## MODULE 2: AI TOOLS -- MAJOR OVERHAUL (3 passes)
*Skip ICP Builder -- it's OK for now*

### Pass 1: UX OVERHAUL (Large)
**Goal**: Every tool feels modern, fast, and delightful to use
- [ ] Script Builder: Add template library (10 pre-built scripts: intro email, follow-up, objection handling, referral ask, etc.)
- [ ] Script Builder: Add copy-to-clipboard on every generated script
- [ ] Ad Maker: Add batch export (all sizes at once, zip download)
- [ ] Ad Maker: Add real-time preview as user types (live updating, not after submit)
- [ ] Client Qualifier: Replace form with conversational UI (one question at a time, animated transitions)
- [ ] Knowledge Base: Replace alert() with toast notifications
- [ ] Knowledge Base: Add search/filter across all knowledge base articles
- [ ] ALL TOOLS: Add "Recent Results" panel showing last 5 generations (localStorage)

### Pass 2: INTELLIGENCE UPGRADE (Large+)
**Goal**: AI outputs are 10x better, context-aware, and personalized
- [ ] Script Builder: Generate 3 script variations (formal, casual, direct) side-by-side
- [ ] Script Builder: Add A/B test suggestion for subject lines
- [ ] Ad Maker: Add AI-powered headline suggestions (3 options per ad)
- [ ] Ad Maker: Add compliance auto-check (flag any claims that need disclaimers)
- [ ] Client Qualifier: Generate follow-up action plan after qualification (next 3 steps)
- [ ] Client Qualifier: Score confidence level with visual gauge (not just text)
- [ ] Knowledge Base: Add contextual recommendations ("Partners who searched this also used...")
- [ ] ALL TOOLS: Inject ICP data as context when available (personalize outputs to partner's audience)

### Pass 3: WORKFLOW INTEGRATION (Large++)
**Goal**: Tools work together as a system, not isolated silos
- [ ] "Generate from ICP" button on Script Builder, Ad Maker (auto-fills context from saved ICP)
- [ ] "Use in Page Builder" button on Ad Maker (exports ad directly as a block)
- [ ] "Add to 30-Day Challenge" -- tool outputs link to specific challenge tasks
- [ ] Results history dashboard showing all AI-generated content across all tools
- [ ] Export all results as branded PDF portfolio ("My Marketing Kit")
- [ ] Add tool usage stats on portal dashboard (X scripts generated, Y ads created)

---

## MODULE 3: CTAX PORTAL (3 passes)

### Pass 1: DASHBOARD UPGRADE (Large)
**Goal**: Portal dashboard is a real command center, not a nav menu
- [ ] Add KPI cards row: referrals submitted, pages published, tools used, challenge progress
- [ ] Add recent activity feed (last 5 actions across all tools)
- [ ] Add quick-action buttons (Create Script, Build Page, Submit Referral)
- [ ] Add welcome banner with partner name and practice type (from settings)
- [ ] Add progress indicators per module (% complete for challenge, pages published count)

### Pass 2: NAVIGATION + SETTINGS (Large)
**Goal**: Portal feels like a real SaaS product
- [ ] Redesign sidebar with collapsible sections and active state indicators
- [ ] Add notification bell with unread count (challenge milestones, new features)
- [ ] Settings page: firm logo upload, brand colors, contact info, referral link
- [ ] Settings page: email preferences, notification preferences
- [ ] Add breadcrumb navigation within deep sections
- [ ] Add keyboard shortcuts overlay (? key to show available shortcuts)

### Pass 3: PROFESSIONAL TOUCHES (Large+)
**Goal**: Partners feel this is worth paying for
- [ ] Add onboarding wizard for new partners (welcome → firm setup → first page → first referral)
- [ ] Add "Partner Score" gamification (composite of challenge progress + tools used + referrals)
- [ ] Add help/support chat widget (or FAQ sidebar)
- [ ] Add data export (all partner data as CSV/JSON)
- [ ] Add dark mode toggle with full theme support
- [ ] Mobile-responsive portal layout (currently desktop-focused)

---

## MODULE 4: 30-DAY CHALLENGE (3 passes)

### Pass 1: GAMIFICATION UPGRADE (Large)
**Goal**: Challenge is addictive, not just functional
- [ ] Add badge unlock system (7 badges: First Day, 3-Day Streak, 7-Day Streak, Week Complete, 14-Day, 21-Day, Perfect Month)
- [ ] Add milestone celebration modals (confetti animation at Days 7, 14, 21, 30)
- [ ] Add catch-up mode (complete skipped tasks on weekends)
- [ ] Fix leaderboard to update user's actual position based on progress
- [ ] Add streak freeze (1 free skip per week without breaking streak)

### Pass 2: SMART TASK LINKING (Large+)
**Goal**: Challenge tasks automatically connect to portal tools
- [ ] Auto-navigate to relevant tool when user clicks "Start Task"
- [ ] Pre-fill tool context from task description (e.g., Day 4 opens Script Builder with email template preloaded)
- [ ] Auto-detect task completion (if user generates a script → Day 4 auto-completes)
- [ ] Show tool output preview in challenge card after completion ("You created: Intro Email v1")
- [ ] Add "Share Progress" button (generates shareable image card with stats)

### Pass 3: COMPLETION EXPERIENCE (Large++)
**Goal**: Day 30 feels like graduation
- [ ] Day 30 completion → "Rainmaker Certificate" modal with downloadable PDF certificate
- [ ] Post-challenge dashboard showing cumulative stats, biggest wins, tools mastered
- [ ] "What's Next" recommendations based on which tasks were skipped/completed
- [ ] Challenge restart option with harder "Advanced Track" (30 more days)
- [ ] Weekly email digest integration (localStorage flag for now, backend-ready)

---

## MODULE 5: BUSINESS PLANNER (3 passes)

### Pass 1: REAL INTELLIGENCE (Large)
**Goal**: Roadmap feels AI-powered, not template-based
- [ ] Connect to Claude API for personalized roadmap generation (dynamic tasks, not hardcoded)
- [ ] Add market-aware projections (adjust revenue estimates by geography + practice type + season)
- [ ] Add competitor awareness (what other partners in this area are doing)
- [ ] Add industry benchmarks ("Average CPA generates X referrals/month in your metro")
- [ ] Expand from 90 days to configurable timeline (30/60/90/180 days)

### Pass 2: PROGRESS DASHBOARD (Large+)
**Goal**: Partners track their actual progress against the plan
- [ ] Visual Gantt-style timeline showing task completion over time
- [ ] Add actual vs projected comparison (are they ahead or behind schedule?)
- [ ] Add weekly check-in prompts ("How many referrals did you submit this week?")
- [ ] Task completion syncs with challenge progress (overlapping tasks auto-complete)
- [ ] Add milestone markers on timeline (end of Month 1, Month 2, Month 3)

### Pass 3: ACTIONABLE OUTPUT (Large++)
**Goal**: Business plan drives real revenue
- [ ] "Execute This Task" button opens relevant portal tool with context pre-filled
- [ ] Revenue calculator updates with actual referral data (not just projections)
- [ ] Email drip integration -- schedule actual reminder emails for upcoming tasks
- [ ] Export roadmap as slide deck (PowerPoint-style PDF for firm presentations)
- [ ] Add ROI tracker (investment in vs referral revenue generated)

---

## Execution Rules

1. **Plan before build**: Read every relevant file before touching code
2. **Major only**: If a task would take <30 minutes, it's too small -- combine it with bigger work
3. **Throttle check**: Before each pass, verify it's BIGGER than the previous pass
4. **Commit after each pass**: One commit per pass with descriptive message
5. **Push after each module**: Push to GitHub after completing all 3 passes on a module
6. **Self-review**: After each pass, walk through as a user. If it doesn't feel different, the pass failed.

---

## THE INFINITE LOOP -- NON-NEGOTIABLE

**This plan NEVER ends. When all 5 modules x 3 passes are complete, you START OVER.**

### How the Loop Works:
1. Complete Module 1 through Module 5 (3 passes each = 15 total passes) = **Cycle 1**
2. Start Module 1 again with 3 MORE passes = **Cycle 2 begins**
3. Each cycle's passes must be BIGGER than the previous cycle's passes on that same module
4. The cycle number only goes up. There is no "done."

### Cycle Escalation:
- **Cycle 1**: Feature completeness, design quality, professional output (DONE)
- **Cycle 2**: Advanced features, multi-tool integration, real-time collaboration, import/export
- **Cycle 3**: Power user features, automation, batch operations, advanced analytics
- **Cycle N**: Keep inventing bigger work. If you can't think of something bigger, you're not trying hard enough.

### Rules:
- NEVER declare the plan "complete" or "finished"
- NEVER make minor improvements on a later cycle -- every pass must be a MAJOR addition
- NEVER repeat work from a previous cycle -- always forward, never backward
- If tokens run low mid-cycle, write a handoff noting exactly which module/pass/cycle you're on
- Track current cycle number in commit messages: `feat: [M2P1C2] AI Tools batch generation`

### Current Status:
- **Cycle 1, Module 1 (Web Builder)**: COMPLETE (3/3 passes, commits 957f16d, 53d013c, 7748d09)
- **Cycle 1, Module 2 (AI Tools)**: COMPLETE (3/3 passes, commits 9b1e9e6, 669fc0b, 9e70a08)
- **Cycle 1, Module 3 (CTAX Portal)**: IN PROGRESS (Pass 1 DONE)
