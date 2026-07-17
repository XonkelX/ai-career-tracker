# CareerFlow Design System Review

**Reviewed artifact:** `DESIGN_SYSTEM.md` version 0.1  
**Review perspective:** Senior staff engineering, public-release readiness  
**Review scope:** Design-system specification only; no component or application-code review  
**Recommendation:** Approve the visual direction, but resolve the Priority 1 findings before implementing shared components

## Executive assessment

The design system establishes a strong product character: calm, evidence-oriented, restrained, and accessibility-conscious. Its semantic-token intent, WCAG 2.2 AA target, reduced-motion stance, domain/component boundaries, and phased implementation plan are appropriate for a serious career product.

The document is not yet implementation-complete. The largest risks are not aesthetic; they are contract gaps. Token names and layers are not fully specified, several states have no semantic tokens, interaction behavior is less detailed than visual behavior, high-contrast support is absent, and some components are ordered before their dependencies. If teams begin implementation now, these gaps will produce one-off decisions and incompatible component APIs.

No fundamental visual direction needs to be replaced. The document should be tightened before Phase 0 and Phase 1 implementation.

## Priority definitions

- **P1 — Resolve before shared-component implementation:** Affects foundational contracts, accessibility, or broad scalability.
- **P2 — Resolve before public beta:** Affects consistency across features, alternate modes, or complex workflows.
- **P3 — Resolve during system maturation:** Improves governance, polish, or long-term efficiency without blocking initial primitives.

## 1. Inconsistencies and scalability concerns

### DS-01 — Token names do not have an implementation-safe syntax

**Priority:** P1  
**Issue:** `space-0.5` is readable in prose but is awkward across CSS custom properties, TypeScript keys, and tooling. A literal CSS token such as `--space-0.5` requires escaping and is easy to misuse. The document also shows semantic names without defining their final CSS or TypeScript form.  
**Improvement:** Define one canonical token syntax before Phase 0. For example, use `--space-050`, `--space-100`, or `--space-half`, and prefix categories consistently: `--color-text-primary`, `--radius-md`, `--motion-duration-fast`. Publish the same names through CSS and typed TypeScript metadata if both are needed.

### DS-02 — The token architecture is implied rather than specified

**Priority:** P1  
**Issue:** The document distinguishes primitive and semantic colors but does not define whether components may consume primitives, how aliases resolve, or where component-specific tokens belong. This will lead to direct palette usage in some components and semantic aliases in others.  
**Improvement:** Define three explicit layers: primitive tokens, semantic tokens, and exceptional component tokens. Components should consume semantic tokens by default. Component tokens should alias semantic tokens and require justification. Add rules for naming, ownership, deprecation, and theme overrides.

### DS-03 — Semantic values bypass the documented primitive palette

**Priority:** P1  
**Issue:** Dark `surface-elevated` uses `#111C2F`, which is not a slate primitive, and dark `accent` uses `#C4B5FD`, which is not listed in the violet palette. Application statuses reference blue, emerald, and rose families that have no primitive definitions or exact light/dark mappings. This contradicts the claim that primitive values live in the token layer.
**Improvement:** Either add the missing primitives or explicitly permit semantic-only values and document why. Define exact background, foreground, border, icon, hover, and selected tokens for every application status in both themes.

### DS-04 — Interactive state tokens are incomplete

**Priority:** P1  
**Issue:** Only the primary interaction has a hover token. There are no general tokens for pressed, selected, disabled, read-only, invalid, drag-over, drop-target, loading, or destructive hover states. The component checklist requires these states, but the token system cannot express them consistently.  
**Improvement:** Add a state-token matrix for neutral, primary, destructive, and accent interactions. Include background, foreground, border, icon, and focus treatment for default, hover, active, selected, disabled, read-only, invalid, and loading states in both themes.

### DS-05 — Several essential visual tokens are missing

**Priority:** P1  
**Issue:** The system lacks overlay/scrim, inverse surface/text, link/visited-link, selection foreground, disabled opacity, control height, icon size, border width, outline width, and chart-series tokens. It also mentions z-index tokens in Phase 0 without defining a z-index scale.  
**Improvement:** Add these token categories before primitives are built. Define a small named stacking model—such as base, sticky, dropdown, popover, modal, toast, and critical overlay—rather than arbitrary numeric z-index values.

### DS-06 — Elevation has shadows but no complete elevation model

**Priority:** P2  
**Issue:** Shadow names describe size, while their usage describes elevation. Surface tone, border strength, shadow, and stacking order are not tied together. Teams may combine them inconsistently, especially in dark mode.  
**Improvement:** Define named elevation levels with a complete recipe for surface, border, shadow, and z-index. Specify which components may use each level and prohibit nested overlays from inventing new levels.

### DS-07 — Component public-API rules are incomplete

**Priority:** P2  
**Issue:** Naming guidance is strong, but the system does not define controlled versus uncontrolled behavior, ref forwarding, polymorphic rendering, server/client boundaries for compound components, or how native and custom events are composed. `primary` can also become ambiguous when multiple actions appear in one region.  
**Improvement:** Add public-API rules covering controlled state, default values, refs, native attribute passthrough, event cancellation, composition, and Client Component boundaries. Define that each action group has at most one visually primary action and specify when `primary` is inappropriate.

### DS-08 — The folder structure has no governance surface

**Priority:** P3  
**Issue:** `utilities.css` can become a dumping ground, and the proposed structure has no clear location for component documentation, usage examples, accessibility notes, or visual-regression fixtures.  
**Improvement:** Require an owner and acceptance rule for shared utilities. Add a colocated documentation/example convention and a visual-test location. Limit utilities to named, reviewed patterns that cannot be expressed through tokens or component APIs.

### DS-09 — Versioning and deprecation are undefined

**Priority:** P2  
**Issue:** The document has a version but no policy for changing tokens or component contracts. A growing application will otherwise accumulate silent breaking changes.  
**Improvement:** Define semantic versioning for the design system, a changelog requirement, a deprecation window, migration notes, and an owner or approval path for token and primitive changes.

## 2. Accessibility and interaction risks

### A11Y-01 — A single-color focus ring is not robust across surfaces

**Priority:** P1  
**Issue:** One focus-ring color may pass on the canvas but disappear on brand, status, image, or accent-tinted surfaces. A visible offset helps but does not guarantee contrast against both the component and its surroundings.
**Improvement:** Define a two-color focus treatment, such as an inner contrasting keyline plus an outer theme focus ring. Document fallback behavior for dark, brand, destructive, and forced-color surfaces, and prohibit clipping through overflow containers.

### A11Y-02 — Forced-colors and high-contrast modes are not addressed

**Priority:** P1  
**Issue:** WCAG contrast rules alone do not protect users of Windows High Contrast or `forced-colors`. Backgrounds, borders, status fills, shadows, and custom focus rings can disappear when system colors replace authored colors.  
**Improvement:** Add forced-color rules using system colors, visible borders, and `forced-color-adjust` only where strictly necessary. Include forced-colors testing in the definition of done for interactive and status components.

### A11Y-03 — Disabled and read-only behavior is underspecified

**Priority:** P1  
**Issue:** The checklist names disabled states but does not say when controls should be disabled, whether they remain discoverable, or how the reason is communicated. Excessive disabled controls can hide requirements from keyboard and screen-reader users.  
**Improvement:** Define separate disabled, unavailable, and read-only patterns. Prefer leaving an action operable with explanatory validation when safe. When disabling is necessary, provide adjacent explanatory text and ensure disabled styling is not communicated by opacity alone.

### A11Y-04 — Toast and live-region behavior needs concrete limits

**Priority:** P1  
**Issue:** The document correctly says toasts cannot be the sole critical feedback, but it does not specify announcement priority, timeout behavior, queue limits, pause behavior, or duplicate-message handling. Poor toast behavior can interrupt screen-reader users or make information disappear too quickly.  
**Improvement:** Define `status` versus `alert` usage, default persistence, maximum visible toasts, deduplication, and pause on hover/focus. Errors requiring action should remain inline or persistent and should not auto-dismiss.

### A11Y-05 — Tooltip, popover, and disclosure interaction contracts are missing

**Priority:** P1  
**Issue:** The document references WAI-ARIA patterns generally but does not state how tooltips open on focus and hover, how dismissible content handles `Escape`, or when a popover must become a dialog. Touch and keyboard users could receive different information.  
**Improvement:** Define trigger, delay, dismissal, focus, pointer, and touch behavior for every overlay class. Tooltips must never contain required interactive content. Interactive content should use popover or dialog semantics with deterministic focus behavior.

### A11Y-06 — Form rules omit important input-purpose and submission behavior

**Priority:** P1  
**Issue:** Labels and errors are covered, but there are no rules for `autocomplete`, input modes, password-manager compatibility, required-field indication, async validation timing, duplicate submission, or preserving user input after server errors.  
**Improvement:** Add a form interaction contract: correct autocomplete tokens, `inputMode` where appropriate, visible and programmatic required state, validation on understandable boundaries, focusable error summaries, idempotent submission, retained values, and a loading state that prevents duplicate actions without losing focus context.

### A11Y-07 — Data-table and Kanban accessibility is too high level

**Priority:** P1  
**Issue:** An “equivalent” table view is required, but the system does not define sortable-header semantics, row-action access, selection behavior, keyboard Kanban movement, status announcements, or focus recovery after moving a card.  
**Improvement:** Specify a keyboard model and announcement contract before these components are implemented. Include `aria-sort`, labeled row actions, non-drag move controls, destination announcements, predictable focus retention, and equivalent feature coverage between board and table views.

### A11Y-08 — Localization and bidirectional layouts are missing

**Priority:** P2  
**Issue:** Long text is included in testing, but right-to-left layouts, locale-sensitive dates/numbers/currency, text expansion, and icon mirroring are not. Career data is inherently international.  
**Improvement:** Add RTL and localization rules. Use logical CSS properties, avoid embedding direction in component APIs, define which icons mirror, and require locale-aware formatting for salary, dates, and numbers. Test at least one RTL locale and 30–50% text expansion.

### A11Y-09 — Target-size guidance lacks dense-interface exceptions and spacing rules

**Priority:** P2  
**Issue:** A universal `44 × 44px` target is a good product goal but can conflict with dense tables and inline actions. Without a documented alternative, teams will either violate density goals or silently shrink targets.  
**Improvement:** Keep 44px as the default and document any narrowly permitted compact pattern. Compact targets should still satisfy WCAG 2.2 minimums, maintain adequate spacing from adjacent targets, and expose a larger equivalent action where possible.

## 3. Typography issues

### TYPE-01 — Font-weight guidance contradicts the type scale

**Priority:** P1  
**Issue:** The rules allow only 400, 500, 600, and 700, while the type table specifies ranges including 650. Fallback fonts may not support intermediate weights and can synthesize inconsistent output.  
**Improvement:** Choose exact weights from the declared set or explicitly require a variable Geist font with a tested weight axis. Do not express a range in a token; each type token should resolve to one deterministic weight.

### TYPE-02 — Responsive typography is undefined

**Priority:** P1  
**Issue:** `display` at 48px and `heading-1` at 36px have no compact-screen values. Large headings can wrap excessively at 320px or under text expansion, while a single fixed scale can feel undersized on large marketing surfaces.  
**Improvement:** Define responsive type tokens or bounded `clamp()` formulas with minimum, preferred, and maximum sizes. Keep product page headings more restrained than marketing display text and test long titles at 320px and 200% zoom.

### TYPE-03 — Letter spacing and font-feature behavior are incomplete

**Priority:** P2  
**Issue:** Uppercase labels mention added tracking, and dashboard values mention tabular numerals, but no tokens specify tracking or OpenType features. Monospace usage also lacks wrapping and overflow rules for IDs and URLs.  
**Improvement:** Add tracking tokens, a tabular-number utility/token, and code/identifier wrapping rules. Define whether headings use optical sizing and ensure font-feature settings degrade safely with system fallbacks.

### TYPE-04 — Text roles do not define interactive and validation styles

**Priority:** P2  
**Issue:** The scale covers headings and body text but not links, form labels, errors, buttons, table headers, or numerical metrics. Teams may compose these inconsistently from generic tokens.  
**Improvement:** Add semantic text styles that alias the base scale—such as `text-label`, `text-button`, `text-link`, `text-error`, `text-table-header`, and `text-metric`—without creating a second unrelated scale.

## 4. Spacing and sizing issues

### SPACE-01 — Control sizing and density are not tokenized

**Priority:** P1  
**Issue:** The system defines spacing and touch targets but not control heights, icon boxes, input padding, table row heights, or density modes. Components built independently will not align vertically.  
**Improvement:** Define `control-sm`, `control-md`, and `control-lg` height and padding recipes, plus icon and row-size tokens. If a compact density is allowed, define it centrally and restrict where it can be used.

### SPACE-02 — Page gutters and content widths are prose values, not layout tokens

**Priority:** P2  
**Issue:** Gutters, 1280px content width, 1440px board width, and 720px reading width are specified but not named. Repeated raw values will drift across layouts.  
**Improvement:** Create semantic layout tokens for compact/standard/wide gutters, reading width, content width, analytical width, sidebar width, and navigation height.

### SPACE-03 — The spacing scale has no policy for component-local exceptions

**Priority:** P3  
**Issue:** “Avoid one-off values” is correct but insufficient for optical alignment, dense data visualization, or third-party primitives. Without an exception process, arbitrary values may appear under different names.  
**Improvement:** Permit documented optical exceptions only inside a component, prohibit publishing them as shared tokens without repeated use, and require a short rationale in component documentation.

## 5. Responsive-design concerns

### RESP-01 — Breakpoints are defined, but component responsiveness is not

**Priority:** P1  
**Issue:** The document says breakpoints represent available space, yet component adaptations are tied mainly to viewport breakpoints. Components inside drawers, split panes, or narrow dashboard columns may render incorrectly despite a wide viewport.  
**Improvement:** Define when to use container queries for cards, filter bars, tables, and composite panels. Reserve viewport breakpoints for page-level structure and use component-owned thresholds for reusable components.

### RESP-02 — Grid and layout behavior is underspecified

**Priority:** P2  
**Issue:** There is no column grid, minimum card width, gap strategy, sidebar width, or exact navigation-collapse rule. “Where space permits” is not testable.  
**Improvement:** Define page-level grid recipes and measurable collapse conditions. Prefer intrinsic layout rules such as `minmax()` and minimum component widths over device assumptions.

### RESP-03 — Dense data adaptation is too discretionary

**Priority:** P1  
**Issue:** Tables “may” prioritize columns, scroll, or switch to cards, but no decision rule preserves feature equivalence. Different teams could hide different information or ship inaccessible two-dimensional scrolling.  
**Improvement:** Define required columns, optional columns, overflow containment, sticky-header behavior, card-equivalent content, and the point at which the table switches presentation. Document which actions and sorting/filtering capabilities must remain available in every layout.

### RESP-04 — Input modality and safe-area behavior are missing

**Priority:** P2  
**Issue:** Responsive guidance does not cover coarse pointers, hoverless devices, landscape mobile layouts, virtual keyboards, or safe-area insets. Fixed navigation and dialogs can become inaccessible on mobile browsers.  
**Improvement:** Add tests and rules for `hover`, `pointer`, safe-area padding, dynamic viewport units, virtual-keyboard overlap, and landscape heights. Never place required information behind hover-only interactions.

## 6. Dark-mode issues

### DARK-01 — Theme source-of-truth and precedence are ambiguous

**Priority:** P1  
**Issue:** The document proposes a cookie and optionally local storage but does not define which wins, how `system` reacts to OS changes, or how server and client remain synchronized. This risks theme flashes and hydration mismatches.  
**Improvement:** Define a deterministic precedence: explicit cookie preference, otherwise system preference. Treat local storage only as a synchronized cache or omit it. Specify server-rendered attributes, pre-paint behavior compatible with the Content Security Policy, and handling of system-theme changes.

### DARK-02 — Native controls and browser surfaces are not covered

**Priority:** P1  
**Issue:** The strategy does not require `color-scheme`, theme-aware form controls, scrollbars, text selection foreground, browser chrome metadata, or autofill styling. These surfaces can remain light in dark mode or become unreadable.  
**Improvement:** Define root `color-scheme`, native-control behavior, autofill colors, selection foreground/background, scrollbar policy, and theme-aware `meta[name="theme-color"]` handling.

### DARK-03 — Non-token assets and analytical visuals have no dark-mode policy

**Priority:** P2  
**Issue:** Logos, illustrations, resume previews, charts, uploaded images, and code blocks may require different treatment from standard surfaces. “Do not invert mechanically” is correct but not actionable.  
**Improvement:** Define asset variants, neutral framing, chart palettes, gridline/tooltip colors, image contrast boundaries, and the exact behavior of the paper preview. Never apply global CSS inversion to user content.

### DARK-04 — State contrast is deferred too late

**Priority:** P1  
**Issue:** The document says to recheck disabled, hover, focus, and selected contrast, but it does not provide values. Those states will otherwise be invented during component implementation.  
**Improvement:** Make a light/dark state matrix a Phase 0 deliverable, with automated contrast checks for every approved foreground/background/border pairing before components consume the tokens.

## 7. Animation problems

### MOTION-01 — Layout motion can delay task completion

**Priority:** P2  
**Issue:** `motion-layout` permits 320ms transitions but does not distinguish decorative reflow from blocking navigation or confirmation. Repeated 320ms transitions can make a productivity tool feel slow.  
**Improvement:** Prohibit delayed interaction and cap routine product transitions at 240ms. Reserve 320ms for rare, non-blocking spatial changes. State changes and confirmations should update immediately even if a visual transition continues.

### MOTION-02 — Reduced-motion fallbacks are not defined per pattern

**Priority:** P1  
**Issue:** The global reduced-motion rule is sound, but skeleton pulses, progress indicators, drawers, sorting, and Kanban movement lack explicit static alternatives. “Remove nonessential transitions” will be interpreted differently by each component author.  
**Improvement:** Add a reduced-motion behavior table. Skeletons become static, drawers appear without travel, reordered items update without spatial animation, and progress remains perceivable through text or a non-animated indicator.

### MOTION-03 — Interruptions and nested motion are unspecified

**Priority:** P2  
**Issue:** There are no rules for interrupted animations, rapid toggles, route changes, focus during transitions, or multiple nested animated components. This can produce stale end states, motion stacking, and focus moving into invisible content.  
**Improvement:** Require interruptible transitions that resolve to the latest state, limit one dominant motion per region, and make focus/semantics reflect the logical state immediately rather than waiting for animation completion.

### MOTION-04 — Hover translation risks visual instability

**Priority:** P3  
**Issue:** One- or two-pixel hover movement is allowed broadly. On dense controls and cards, this can create perceived jitter and misalignment even without layout shift.  
**Improvement:** Restrict translation to clearly elevated promotional cards or large standalone actions. Prefer color, border, or shadow changes for dense product controls.

## 8. Icon-strategy concerns

### ICON-01 — Stroke weight is a range rather than a token

**Priority:** P2  
**Issue:** A `1.75–2px` range leaves individual authors to choose, causing inconsistent optical weight.  
**Improvement:** Define one default stroke and explicitly named exceptions by size or context. Centralize size and stroke through an icon wrapper or documented icon recipe.

### ICON-02 — Dependency, licensing, and import governance are absent

**Priority:** P3  
**Issue:** Lucide is a reasonable candidate, but the system does not specify version pinning, license recording, import style, tree-shaking verification, or rules for adding missing custom icons.  
**Improvement:** Record the selected package and license when adopted, pin its compatible version, require named direct imports, prohibit runtime-wide icon registries unless justified, and define review criteria for custom icons.

### ICON-03 — Selected and filled icon behavior is undefined

**Priority:** P3  
**Issue:** A single outline family may not provide enough distinction for selected navigation, favorite/bookmark states, or dense statuses. Authors may introduce arbitrary fills.  
**Improvement:** Specify whether selection uses container/background changes only or an approved filled variant. Require the text label and `aria-current`/pressed state to carry semantics regardless of icon style.

## 9. Component-order and quality-gate concerns

### ORDER-01 — Combobox implementation is scheduled before its dependencies

**Priority:** P1  
**Issue:** “Select / combobox foundation” appears in Phase 1, while popover and disclosure primitives appear in Phase 4. An accessible combobox depends on overlay positioning, focus management, listbox behavior, and keyboard interaction.  
**Improvement:** Separate native select from custom combobox. Implement native select in Phase 1; move combobox until after popover/listbox foundations and their interaction tests are stable.

### ORDER-02 — Theme control appears before the complete theme contract

**Priority:** P2  
**Issue:** Theme control is in Phase 2, but theme persistence, pre-paint resolution, and native surface behavior are unresolved.  
**Improvement:** Treat theme resolution and persistence as Phase 0 infrastructure. Build the visible control only after the theme contract is tested server-side and client-side.

### QA-01 — Automated token and contrast validation is missing from Phase 0

**Priority:** P1  
**Issue:** The definition of done requires contrast, but the implementation order does not include machine-readable token validation or automated contrast checks. Manual review alone will not scale across states and themes.  
**Improvement:** Add token-schema validation, duplicate-value reporting, and automated contrast tests for approved token pairs before shared components are built.

### QA-02 — Visual and interaction regression coverage is underspecified

**Priority:** P2  
**Issue:** Unit/component accessibility tests are required, but there is no explicit visual-regression matrix or cross-input interaction suite. Premium quality depends on detecting subtle theme, density, and responsive regressions.  
**Improvement:** Add representative visual snapshots for light/dark, compact/wide, zoomed, long-content, and critical component states. Add keyboard, pointer, touch, reduced-motion, and forced-colors interaction tests, while retaining manual screen-reader verification.

## Recommended resolution order

1. Define the canonical token syntax, token layers, missing state tokens, layout tokens, and z-index/elevation model.
2. Resolve the typography weight contradiction and add responsive type and control-size contracts.
3. Specify interaction contracts for forms, overlays, toasts, data tables, and Kanban movement.
4. Add forced-colors, focus-ring, localization, and reduced-motion behavior matrices.
5. Finalize theme precedence, native browser-surface behavior, and dark-mode state mappings.
6. Reorder dependent components and add Phase 0 token/contrast validation.
7. Establish versioning, ownership, documentation, and regression-test policies.

## Release-readiness conclusion

The design system is directionally strong and suitable for continued investment. It should not yet be treated as a frozen implementation contract. Resolve all P1 findings before building the shared primitive layer; resolve P2 findings before public beta. P3 findings can mature alongside the first product components, provided owners and follow-up milestones are explicit.
