# Community Tax Partner Site -- Evolution Roadmap

A deep plan for expanding and evolving every major feature on the site.
Organized into waves -- each wave builds on the last. Within each wave,
features are grouped by what part of the site they improve.

---

## Wave 1: Make What Exists Actually Good
*Polish, fix gaps, and make every existing feature feel finished.*

### Landing Page Builder
- [ ] **Real-time auto-save indicator** -- "Saved" / "Saving..." badge in toolbar so users trust their work isn't lost
- [ ] **Undo history panel** -- Show last 20 actions as a list, click to jump back to any state
- [ ] **Image upload blocks** -- Let users drag in their own photos/logos (stored as base64 in localStorage for now)
- [ ] **Link editing** -- Click any button or link to set the URL, open-in-new-tab, phone number, or email
- [ ] **Section reordering** -- Drag entire sections up/down without using the Layers panel
- [ ] **Mobile preview toggle** -- One-click switch to see phone layout without leaving the editor
- [ ] **Guided tooltips** -- First-time hints that explain what blocks are, how to drag, how to publish

### 30-Day Challenge
- [ ] **Daily push notification opt-in** -- Browser notifications reminding them to do today's task
- [ ] **Shareable completion badge** -- Generate a branded image they can post on LinkedIn ("I completed the 30-Day Momentum Challenge")
- [ ] **Difficulty scaling** -- Tasks get harder as the month progresses (week 1: learn, week 2: practice, week 3: execute, week 4: optimize)
- [ ] **Team challenges** -- If a firm has multiple partners, let them compete on a shared leaderboard

### Business Planner
- [ ] **Save multiple roadmaps** -- Let users generate different scenarios and compare them side by side
- [ ] **Quarterly check-in prompt** -- After 90 days, prompt them to review results and generate the next quarter
- [ ] **Actual vs. projected tracking** -- Let them input real referral numbers to see how they're tracking against the plan
- [ ] **Shareable PDF branding** -- Their logo on the cover page, not just the Community Tax logo

### Dashboard
- [ ] **Real KPI animations** -- Numbers should count up on load, not just appear
- [ ] **Pipeline funnel visualization** -- Visual funnel showing referrals moving through stages (Submitted > Investigation > Resolution > Resolved)
- [ ] **Payout calendar** -- Visual calendar showing upcoming and past payout dates with amounts
- [ ] **Goal setting** -- Let them set monthly referral and revenue goals, show progress rings

### AI Tools (Script Builder, Ad Maker, Qualifier, KB)
- [ ] **Save history** -- Every generation saved locally so they can browse past scripts/ads/qualifications
- [ ] **Favorites** -- Star the best generations for quick access
- [ ] **Tone selector** -- Formal, conversational, urgent, empathetic for scripts
- [ ] **Ad Maker batch export** -- Generate all 5 sizes at once as a zip
- [ ] **Knowledge Base source citations** -- Show which document the answer came from

### Marketing Kit
- [ ] **Download tracking dashboard** -- Show which assets they've downloaded vs. haven't touched
- [ ] **Asset preview before download** -- Thumbnail or inline preview instead of blind download
- [ ] **Seasonal content rotation** -- Different assets surface based on tax season timing
- [ ] **Usage suggestions** -- "Partners who downloaded X also used Y" style recommendations

---

## Wave 2: Connect Everything Together
*Make the tools talk to each other. The portal should feel like one system, not 16 separate tools.*

### Cross-Tool Integration
- [ ] **Business Planner > Challenge linking** -- When the planner says "Start the 30-Day Challenge," clicking it pre-selects the right starting day
- [ ] **Script Builder > Referral Submission** -- After generating a script, one-click to pre-fill a referral submission with the client scenario
- [ ] **Ad Maker > Page Builder** -- Export an ad as a hero image block you can drop into your landing page
- [ ] **Dashboard > Planner feedback loop** -- Dashboard shows "Your planner predicted X referrals this month, you're at Y" with a link back to adjust the plan
- [ ] **Challenge streaks > Dashboard widget** -- Show challenge progress on the main dashboard, not just buried in Resources
- [ ] **Page Builder > Marketing Kit** -- Published landing pages appear in Marketing Kit as shareable assets
- [ ] **Qualifier > Script Builder pipeline** -- Qualify a client, then one-click generate a script tailored to that exact situation

### Notification System
- [ ] **In-app notification center** -- Bell icon in topbar showing unread items
- [ ] **Achievement notifications** -- "You hit 5 referrals this month!" toast with confetti
- [ ] **Milestone alerts** -- "You're 2 referrals away from Enterprise tier"
- [ ] **Weekly digest** -- Summary of activity, upcoming tasks, earnings update
- [ ] **Referral status changes** -- Notify when a referral moves from Investigation to Resolution

### Smart Recommendations
- [ ] **Contextual "Next Best Action" card** on dashboard -- Based on their activity patterns, suggest what to do next
- [ ] **Unused tool nudges** -- If they haven't used the Script Builder in 30 days, subtle prompt on the dashboard
- [ ] **Seasonal strategy tips** -- Tax season vs. off-season different recommendations
- [ ] **Peer benchmarking insights** -- "Partners in your tier who use the Page Builder earn 23% more"

---

## Wave 3: Make It Smart
*AI and automation that makes partners more effective without more effort.*

### AI Copilot
- [ ] **Chat-based assistant** -- Floating chat bubble that can answer questions about the portal, program, IRS topics
- [ ] **Natural language referral submission** -- "I have a client named John who owes about $30K" > auto-fills the form
- [ ] **Smart follow-up reminders** -- AI analyzes referral pipeline and suggests who to follow up with and why
- [ ] **Conversation coaching** -- After a referral is submitted, AI suggests the best follow-up script based on the client profile

### Predictive Analytics
- [ ] **Revenue forecasting** -- Based on current pipeline and historical conversion rates, predict next 3 months of earnings
- [ ] **Churn prediction** -- If a partner's activity drops, flag it and suggest re-engagement tasks
- [ ] **Client scoring** -- When submitting a referral, AI estimates case value and resolution likelihood
- [ ] **Seasonal demand curves** -- Show when referral volume historically peaks so partners can prepare

### Content Generation
- [ ] **Blog post generator** -- AI writes tax-awareness blog posts they can publish on their site
- [ ] **Social media calendar** -- Auto-generate a month of social posts with scheduling
- [ ] **Email campaign builder** -- Multi-email drip sequences, not just one-off templates
- [ ] **Video script generator** -- For partners who want to create YouTube/TikTok content about tax resolution

---

## Wave 4: Scale Beyond the Portal
*Expand the platform beyond a portal into a full partner ecosystem.*

### Partner Marketplace
- [ ] **Referral network directory** -- Partners can opt-in to a directory so they can refer clients to each other across specialties
- [ ] **Success story submissions** -- Partners submit their own case studies for the Stories page
- [ ] **Template marketplace** -- Top partners share their landing page templates for others to use

### Mobile Experience
- [ ] **Progressive Web App (PWA)** -- Install on home screen, offline access to key data
- [ ] **Quick referral from phone** -- Simplified mobile form for submitting referrals on the go
- [ ] **Push notifications** -- Referral status updates, payout alerts, challenge reminders
- [ ] **Business card scanner** -- Take a photo of a prospect's card, auto-fills referral form

### API and Integrations
- [ ] **CRM sync** -- Salesforce, HubSpot, Zoho integration to push/pull referral data
- [ ] **Calendar integration** -- Sync follow-up reminders to Google Calendar / Outlook
- [ ] **Zapier / webhook support** -- Let partners build their own automations
- [ ] **White-label embed** -- Strategic tier partners can embed the referral form on their own website

### Analytics Platform
- [ ] **Custom report builder** -- Drag-and-drop report creation with filters and date ranges
- [ ] **Export to Excel/CSV** -- Full data export for partners who want to analyze in their own tools
- [ ] **Multi-location rollup** -- Enterprise partners with multiple offices see aggregated + per-location data
- [ ] **ROI attribution** -- Track which marketing channel (email, social, landing page, in-person) drives the most revenue

---

## Wave 5: Community and Retention
*Turn partners into a community that retains itself.*

### Community Features
- [ ] **Partner forum / discussion board** -- Ask questions, share tips, celebrate wins
- [ ] **Mentor matching** -- Connect new partners with experienced ones for guidance
- [ ] **Live Q&A sessions** -- Monthly video calls with top performers sharing strategies
- [ ] **Annual awards** -- Top Referrer, Fastest Ramp, Best Landing Page, etc.

### Gamification 2.0
- [ ] **Year-round achievement system** -- Badges for milestones (first referral, 10th referral, $10K earned, etc.)
- [ ] **Tier progression visualization** -- Visual path showing how close they are to the next tier with specific actions to get there
- [ ] **Seasonal challenges** -- Tax season sprint, summer hustle, year-end push (30-day challenge variants)
- [ ] **Team competitions** -- Firm-wide leaderboards for multi-partner organizations

### Retention Mechanics
- [ ] **Win-back campaigns** -- If a partner goes dormant, automated re-engagement sequence
- [ ] **Anniversary celebrations** -- "You've been a partner for 1 year! Here's your impact: X referrals, $Y earned, Z clients helped"
- [ ] **Referral program for partners** -- Refer another professional to become a partner, earn a bonus
- [ ] **Exclusive content unlocks** -- Hit milestones to unlock advanced training, priority support, or better rates

---

## Technical Debt and Infrastructure
*Things that need to happen for any of the above to work well.*

### Must Do Soon
- [ ] **Move API keys server-side** -- api-config.js has client-side keys (demo mode). Production needs a backend proxy
- [ ] **Authentication system** -- Real login/logout, session management, role-based access
- [ ] **Database layer** -- Replace localStorage with a real database (referrals, pages, progress, settings)
- [ ] **Error boundaries** -- Graceful handling when localStorage is full, API calls fail, or scripts error

### Performance
- [ ] **Code splitting** -- Load JS modules on demand instead of all 24 files on every page
- [ ] **Image optimization** -- WebP with fallbacks, lazy loading, proper srcset
- [ ] **CSS consolidation** -- 6 CSS files should be bundled and minified for production
- [ ] **Service worker** -- Cache static assets for instant repeat loads

### Testing
- [ ] **End-to-end tests** -- Playwright or Cypress tests for critical flows (submit referral, generate roadmap, publish landing page)
- [ ] **Visual regression tests** -- Screenshot comparison to catch CSS breakage
- [ ] **Accessibility audit** -- WCAG 2.1 AA compliance, keyboard navigation, screen reader support

---

## Prioritization Framework

When deciding what to build next, score each item on:

1. **Partner Impact** (1-5) -- How much does this help partners make money?
2. **Retention Value** (1-5) -- Does this keep partners coming back?
3. **Build Effort** (1-5, lower is easier) -- How long does it take?
4. **Dependency** -- Does something else need to exist first?

**High impact, low effort wins:**
- Real-time auto-save indicator (builder)
- Pipeline funnel visualization (dashboard)
- Save history for AI tools
- Cross-tool linking (planner > challenge, qualifier > scripts)
- Shareable challenge badge

**High impact, high effort (plan carefully):**
- AI Copilot chat
- CRM integrations
- Authentication system
- PWA mobile experience
