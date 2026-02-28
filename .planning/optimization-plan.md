# Site-Wide Optimization Plan
## Community Tax Enterprise Partner Program

Status: Executing sequentially, contractor-style outcome reports after each item.

---

## Optimization Items (Priority Order)

### 1. Fix FAQ Mismatched Heading Tags
- **File:** pages/faq.html
- **Issue:** 7 headings open as `<h2>` but close as `</h3>` — invalid HTML
- **Fix:** Change all `</h3>` to `</h2>`
- **Impact:** SEO (heading hierarchy), HTML validity
- **Effort:** 2 min

### 2. Fix how.html Heading Hierarchy
- **File:** pages/how.html
- **Issue:** Uses h1 > h2 > h5 > h6, skipping h3/h4
- **Fix:** Change h5 to h3, h6 to h4
- **Impact:** SEO, accessibility (screen reader heading navigation)
- **Effort:** 5 min

### 3. Add Lazy Loading to Below-the-Fold Images
- **Files:** index.html, pages/*.html
- **Issue:** No images use `loading="lazy"` — all load eagerly
- **Fix:** Add `loading="lazy"` to every `<img>` except the hero/above-fold
- **Impact:** Performance (LCP, initial load time)
- **Effort:** 10 min

### 4. Add Width/Height to Images
- **Files:** index.html, pages/*.html
- **Issue:** Images without explicit dimensions cause CLS
- **Fix:** Add `width` and `height` to every `<img>`
- **Impact:** Performance (CLS score)
- **Effort:** 15 min

### 5. Fix Nav Links Missing href (Keyboard Accessibility)
- **File:** index.html
- **Issue:** All nav `<a>` tags use `onclick` without `href` — unreachable by keyboard
- **Fix:** Add `href="#section"` to all nav links, footer links
- **Impact:** Accessibility (WCAG 2.1 AA compliance)
- **Effort:** 15 min

### 6. Add Focus-Visible Styles
- **File:** css/base.css or css/components.css
- **Issue:** No `:focus-visible` styles anywhere — keyboard users have no focus indicator
- **Fix:** Add global `:focus-visible` outline styles, replace `outline:none` with proper alternatives
- **Impact:** Accessibility (WCAG 2.1 AA compliance)
- **Effort:** 10 min

### 7. Fix Interactive Divs — Keyboard + ARIA Support
- **Files:** index.html (flip cards), pages/faq.html (FAQ toggles), pages/onboarding.html (checklist)
- **Issue:** `div onclick` without `role`, `tabindex`, or keyboard handlers
- **Fix:** Add `role="button"`, `tabindex="0"`, keydown handler for Enter/Space
- **Impact:** Accessibility (WCAG 2.1 AA compliance)
- **Effort:** 20 min

### 8. Add ARIA Attributes to Nav Controls
- **File:** index.html
- **Issue:** Hamburger missing `aria-expanded`, dark mode button missing `aria-label`
- **Fix:** Add `aria-expanded="false"` to hamburger, `aria-label` to dark mode, toggle in JS
- **Impact:** Accessibility (screen reader experience)
- **Effort:** 5 min

### 9. Add og:image and twitter:image Meta Tags
- **File:** index.html
- **Issue:** Social media link previews render without an image
- **Fix:** Add og:image, twitter:image, twitter:card meta tags
- **Impact:** Social media sharing, click-through rates
- **Effort:** 5 min

### 10. Deep Link Support (History State Fix)
- **File:** js/navigation.js
- **Issue:** `history.replaceState` always resets to home on load — deep links broken
- **Fix:** Read hash from URL on load, navigate to that page instead of always home
- **Impact:** SEO (crawlability), UX (shareable links, refresh preserves page)
- **Effort:** 10 min

### 11. Remaining Alt Text Optimization
- **Files:** All pages/*.html partials
- **Issue:** Some images may still have generic/missing alt text
- **Fix:** Audit every `<img>` across all partials and ensure descriptive, keyword-rich alt text
- **Impact:** SEO, accessibility
- **Effort:** 20 min

### 12. Semantic HTML Improvements
- **Files:** pages/*.html
- **Issue:** Missing `<article>`, `<section>`, `<aside>`, `<time>` elements
- **Fix:** Wrap appropriate content in semantic elements
- **Impact:** SEO, accessibility, AEO readiness
- **Effort:** 15 min

---

## Not Doing (Deferred)
- **portal.js split** — 1401 lines, but refactoring a working file risks regressions without tests
- **SPA prerendering** — High effort, deferred to AEO Phase 4.2
- **showPage monkey-patching refactor** — Works currently, high regression risk
- **pages.css split** — Would break existing media query organization

---

## Execution Log

### Item 1: Fix FAQ Mismatched Heading Tags -- DONE
- Fixed 7 `<h2>...</h3>` mismatches in pages/faq.html
- Commit: e528e00

### Item 2: Fix how.html Heading Hierarchy -- DONE
- Changed h5 to h3, h6 to h4 in pages/how.html
- Updated CSS selectors in css/pages.css (.ph-content h3, .ph-tooltip h4)
- Commit: e528e00

### Item 3: Add Lazy Loading -- DONE
- Added loading="lazy" to 7 images (explore modal x4, footer logo, portal logos x2)
- Nav logos left eager (above-the-fold)
- Commit: 571a50e

### Item 4: Add Width/Height to Images -- DONE
- Added width/height to cookie image (80x80), portal logos (166x18), dashboard logos (148x16)
- Explore SVGs skipped (CSS container provides fixed dimensions)
- Commit: f0f781f

### Item 5: Fix Nav Links Missing href -- DONE
- Added href="#page" to all 40+ anchor tags: desktop nav dropdown items, mobile drawer links, footer links, cookie consent link
- All use event.preventDefault() to preserve SPA behavior
- Commit: 866b574

### Item 6: Add Focus-Visible Styles -- DONE
- Added global :focus-visible { outline: 2px solid var(--blue); outline-offset: 2px } to base.css
- Added dark mode override using var(--sky) in dark-mode.css
- Commit: d74cbb6

### Item 7: Fix Interactive Divs -- DONE
- Flip cards: Added role="button", tabindex="0", Enter/Space keydown handler (3 cards)
- FAQ toggles: Added role="button", tabindex="0", Enter/Space keydown handler (28 questions)
- Onboarding checklist: Added role="checkbox", aria-checked, tabindex="0", Enter/Space handler (7 steps)
- Home cards: Added role="link", tabindex="0", Enter keydown handler (4 cards)
- Updated toggleOnboardStep() to toggle aria-checked
- Commit: 24b4eb0

### Item 8: Add ARIA Attributes to Nav Controls -- DONE
- Added aria-label="Toggle dark mode" to dark mode button
- Added aria-expanded="false" to hamburger, toggled in toggleMobileNav()/closeMobileNav()
- Commit: b9aa33b

### Item 9: Add og:image and twitter:image -- DONE
- Added og:image and twitter:image meta tags using logo.svg
- Note: A dedicated 1200x630 OG image (PNG/JPG) should replace this for better social previews
- Commit: cc581c2

### Item 10: Deep Link Support -- DONE
- Replaced always-home replaceState with hash detection on load
- If URL has valid hash (#faq, #tiers, etc.), navigates to that page after partials load
- Enables shareable URLs, refresh preserves page state
- Commit: 8efe4ad

### Item 11: Alt Text Optimization -- ALREADY COMPLETE
- All images already have descriptive, keyword-rich alt text
- Cookie image correctly uses alt="" with aria-hidden="true" (decorative)

### Item 12: Semantic HTML -- ALREADY SOLID
- Most pages use <section> extensively
- Portal has <aside> for sidebar
- <main> wraps content area
- Low-impact improvements would risk breaking existing CSS
