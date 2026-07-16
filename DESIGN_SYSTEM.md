# AI Career Tracker Design System

**Status:** Design specification — no components implemented  
**Version:** 0.1  
**Target:** WCAG 2.2 AA  
**Product character:** Modern, premium, calm, trustworthy, and precise

This document defines the visual and interaction foundation for AI Career Tracker. It is the source of truth for future design tokens, primitives, product components, and accessibility behavior. Values in this document are specifications; they are not yet implemented in application code.

## 1. Design philosophy

### Quiet confidence

The product handles consequential, personal work. Its interface should feel capable and refined without becoming flashy or distracting. Premium quality comes from disciplined spacing, typography, contrast, motion, and detail—not decoration.

### Clarity before density

Users should understand the current state, primary action, and next decision at a glance. Dense application data is allowed, but it must be organized through hierarchy, grouping, progressive disclosure, and consistent alignment.

### Evidence over spectacle

AI suggestions must look reviewable rather than authoritative or magical. Source material, uncertainty, unsupported claims, and user-editable drafts should be visually distinct. AI styling must never imply that generated content is verified.

### Calm momentum

The system should help users feel organized and in control during a stressful job search. Status, deadlines, errors, and empty states should be direct, supportive, and actionable without alarmist language.

### Accessible by construction

Accessibility is a component contract, not a final audit step. Keyboard behavior, focus management, semantics, contrast, text scaling, reduced motion, and error recovery must be designed before a component is considered complete.

### Token-driven consistency

Components must consume semantic tokens rather than hard-coded visual values. A token describes purpose—such as `text-secondary` or `surface-elevated`—instead of a specific color. This keeps light mode, dark mode, and future brand refinements maintainable.

## 2. Color palette

### Color principles

- Slate neutrals carry most of the interface.
- Cyan is the primary brand and focus color. Use it deliberately, not as decoration across every surface.
- Violet identifies AI-assisted workflows but never replaces semantic status colors.
- Success, warning, danger, and information colors communicate meaning and must always include text, an icon, or another non-color cue.
- Use semantic tokens in components. Primitive color values belong only in the token layer.
- Every implemented foreground/background pair must be verified for WCAG contrast in both themes.

### Token architecture and naming

The canonical token name is the CSS custom-property name. The same identifier, without the leading `--`, must be used in typed token metadata. Names use lowercase kebab case, never dots or characters that require escaping.

- Primitive tokens describe raw values and use a category and scale: `--color-slate-950`.
- Semantic tokens describe purpose and use a category, role, and optional state: `--color-text-primary`, `--color-action-primary-hover-background`.
- Component tokens are exceptional aliases such as `--button-primary-background`. They may be introduced only when a component has a durable requirement that cannot be expressed by a semantic token, must alias a semantic token, and must include a rationale in component documentation.
- Components consume semantic tokens by default and must not consume primitive tokens directly.
- Themes override semantic mappings. They must not redefine component styles or change primitive values.
- Token ownership lives in `src/styles/tokens.css` and `src/styles/themes.css`. Removing or renaming a published token requires a deprecation notice and migration note in this document's changelog before implementation changes are made.

### Primitive palette

#### Slate

| Token       | Value     | Typical role                      |
| ----------- | --------- | --------------------------------- |
| `slate-50`  | `#F8FAFC` | Light canvas                      |
| `slate-100` | `#F1F5F9` | Muted light surface               |
| `slate-200` | `#E2E8F0` | Light border                      |
| `slate-300` | `#CBD5E1` | Strong light border               |
| `slate-400` | `#94A3B8` | Muted dark text                   |
| `slate-500` | `#64748B` | Muted light text                  |
| `slate-600` | `#475569` | Secondary light text              |
| `slate-700` | `#334155` | Strong dark border                |
| `slate-800` | `#1E293B` | Muted dark surface                |
| `slate-900` | `#0F172A` | Dark surface / primary light text |
| `slate-950` | `#020617` | Dark canvas                       |

#### Brand cyan

| Token      | Value     |
| ---------- | --------- |
| `cyan-50`  | `#ECFEFF` |
| `cyan-100` | `#CFFAFE` |
| `cyan-200` | `#A5F3FC` |
| `cyan-300` | `#67E8F9` |
| `cyan-400` | `#22D3EE` |
| `cyan-500` | `#06B6D4` |
| `cyan-600` | `#0891B2` |
| `cyan-700` | `#0E7490` |
| `cyan-800` | `#155E75` |
| `cyan-900` | `#164E63` |
| `cyan-950` | `#083344` |

#### AI violet

| Token        | Value     | Constraint          |
| ------------ | --------- | ------------------- |
| `violet-50`  | `#F5F3FF` | Light AI tint       |
| `violet-200` | `#DDD6FE` | Light AI border     |
| `violet-400` | `#A78BFA` | Dark-theme accent   |
| `violet-500` | `#8B5CF6` | AI icon/accent      |
| `violet-700` | `#6D28D9` | Light-theme AI text |
| `violet-950` | `#2E1065` | Dark AI tint text   |

### Semantic colors

| Purpose     | Light     | Dark      | Required supporting cue        |
| ----------- | --------- | --------- | ------------------------------ |
| Success     | `#047857` | `#34D399` | Check icon or explicit label   |
| Warning     | `#B45309` | `#FBBF24` | Warning icon or explicit label |
| Danger      | `#B91C1C` | `#F87171` | Error icon and actionable text |
| Information | `#1D4ED8` | `#60A5FA` | Info icon or explicit label    |

### Semantic token mapping

| Token                       | Light mode           | Dark mode            |
| --------------------------- | -------------------- | -------------------- |
| `canvas`                    | `#F8FAFC`            | `#020617`            |
| `surface`                   | `#FFFFFF`            | `#0F172A`            |
| `surface-muted`             | `#F1F5F9`            | `#1E293B`            |
| `surface-elevated`          | `#FFFFFF`            | `#111C2F`            |
| `text-primary`              | `#0F172A`            | `#F8FAFC`            |
| `text-secondary`            | `#475569`            | `#CBD5E1`            |
| `text-muted`                | `#64748B`            | `#94A3B8`            |
| `border-default`            | `#E2E8F0`            | `#334155`            |
| `border-strong`             | `#CBD5E1`            | `#475569`            |
| `interactive-primary`       | `#0E7490`            | `#67E8F9`            |
| `interactive-primary-hover` | `#155E75`            | `#A5F3FC`            |
| `on-primary`                | `#FFFFFF`            | `#083344`            |
| `focus-ring`                | `#0E7490`            | `#67E8F9`            |
| `selection`                 | `#CFFAFE`            | `#164E63`            |
| `selection-foreground`      | `#0F172A`            | `#F8FAFC`            |
| `surface-inverse`           | `#0F172A`            | `#F8FAFC`            |
| `text-inverse`              | `#F8FAFC`            | `#0F172A`            |
| `overlay-scrim`             | `rgb(2 6 23 / 0.48)` | `rgb(2 6 23 / 0.72)` |
| `link`                      | `#0E7490`            | `#67E8F9`            |
| `link-visited`              | `#6D28D9`            | `#A78BFA`            |
| `ai-accent`                 | `#6D28D9`            | `#C4B5FD`            |
| `ai-surface`                | `#F5F3FF`            | `#2E1065`            |

Do not use cyan below `cyan-700` for normal-size text on white. Do not use semantic background colors as the only status indicator.

### Interaction state token contract

Every interaction intent must publish the five slots `background`, `foreground`, `border`, `icon`, and `focus` for every state below. The canonical pattern is `--color-action-{intent}-{state}-{slot}`. Each token must resolve independently in light and dark themes; components may not infer states with opacity, filters, or raw palette values.

| State     | Neutral                      | Primary                      | Destructive                      | AI                      |
| --------- | ---------------------------- | ---------------------------- | -------------------------------- | ----------------------- |
| Default   | `action-neutral-default-*`   | `action-primary-default-*`   | `action-destructive-default-*`   | `action-ai-default-*`   |
| Hover     | `action-neutral-hover-*`     | `action-primary-hover-*`     | `action-destructive-hover-*`     | `action-ai-hover-*`     |
| Active    | `action-neutral-active-*`    | `action-primary-active-*`    | `action-destructive-active-*`    | `action-ai-active-*`    |
| Selected  | `action-neutral-selected-*`  | `action-primary-selected-*`  | `action-destructive-selected-*`  | `action-ai-selected-*`  |
| Disabled  | `action-neutral-disabled-*`  | `action-primary-disabled-*`  | `action-destructive-disabled-*`  | `action-ai-disabled-*`  |
| Read-only | `action-neutral-read-only-*` | `action-primary-read-only-*` | `action-destructive-read-only-*` | `action-ai-read-only-*` |
| Invalid   | `action-neutral-invalid-*`   | `action-primary-invalid-*`   | `action-destructive-invalid-*`   | `action-ai-invalid-*`   |
| Loading   | `action-neutral-loading-*`   | `action-primary-loading-*`   | `action-destructive-loading-*`   | `action-ai-loading-*`   |

The `*` suffix represents all five required slots. Loading preserves the control's intent and label contrast. Disabled styling may use `--opacity-disabled` as a supporting token, but opacity must not be its only cue. Read-only and invalid remain legible and distinguishable without relying on color alone.

### Supporting visual tokens

| Category | Tokens                                                                                                | Contract                                                                                |
| -------- | ----------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Opacity  | `--opacity-disabled: 0.56`                                                                            | Supporting treatment only; text and boundaries must still meet their required contrast. |
| Border   | `--border-width-default: 1px`, `--border-width-strong: 2px`                                           | Use the strong width for emphasized boundaries, not as a substitute for focus.          |
| Outline  | `--outline-width-focus-inner: 1px`, `--outline-width-focus-outer: 2px`, `--outline-offset-focus: 2px` | Shared by the two-color focus treatment.                                                |
| Icons    | `--icon-size-sm: 16px`, `--icon-size-md: 20px`, `--icon-size-lg: 24px`                                | Match the control recipes in the spacing scale.                                         |

Chart implementations use `--color-chart-series-1` through `--color-chart-series-5`, mapped respectively to the theme-appropriate cyan, violet, information, success, and warning semantic colors above. Series must also use labels, shapes, patterns, or direct annotation so color is never the only differentiator.

### Application status colors

| Status    | Color family | Label/icon requirement       |
| --------- | ------------ | ---------------------------- |
| Saved     | Slate        | Bookmark + “Saved”           |
| Applied   | Blue         | Send/check + “Applied”       |
| Interview | Violet       | Calendar/users + “Interview” |
| Offer     | Emerald      | Sparkle/check + “Offer”      |
| Rejected  | Rose         | X/closed-circle + “Rejected” |

## 3. Typography

### Font families

- **Primary:** Geist Sans, with `Inter`, `ui-sans-serif`, and `system-ui` fallbacks.
- **Monospace:** Geist Mono, with `SFMono-Regular`, `Consolas`, and `monospace` fallbacks.
- Load fonts through the framework font system when implemented to prevent layout shift and unnecessary third-party requests.
- Do not introduce a display typeface in the first implementation. Hierarchy should come from scale, weight, spacing, and color.

### Type scale

| Token        | Size / line height | Weight  | Use                                   |
| ------------ | ------------------ | ------- | ------------------------------------- |
| `display`    | `48px / 56px`      | 650–700 | Marketing hero only                   |
| `heading-1`  | `36px / 44px`      | 650–700 | Primary page title                    |
| `heading-2`  | `30px / 38px`      | 600–650 | Major section                         |
| `heading-3`  | `24px / 32px`      | 600     | Subsection/card group                 |
| `heading-4`  | `20px / 28px`      | 600     | Component heading                     |
| `body-large` | `18px / 28px`      | 400     | Introductory copy                     |
| `body`       | `16px / 24px`      | 400     | Default content and inputs            |
| `body-small` | `14px / 20px`      | 400–500 | Supporting text and dense controls    |
| `caption`    | `12px / 16px`      | 500–600 | Metadata; never critical instructions |
| `code`       | `14px / 20px`      | 400     | IDs, URLs, technical values           |

### Responsive type scale

Product typography is mobile-first. Only large display roles scale with available space; body and control text remain fixed to protect readability and layout predictability.

| Token       | Responsive size                                | Line height | Constraint                                     |
| ----------- | ---------------------------------------------- | ----------- | ---------------------------------------------- |
| `display`   | `clamp(2.5rem, 2rem + 2.5vw, 3rem)`            | `1.17`      | Marketing surfaces only                        |
| `heading-1` | `clamp(2rem, 1.75rem + 1.25vw, 2.25rem)`       | `1.22`      | Product page titles use the restrained maximum |
| `heading-2` | `clamp(1.75rem, 1.625rem + 0.625vw, 1.875rem)` | `1.27`      | Major sections                                 |

Long display and page titles must be tested at 320 CSS pixels and 200% zoom. Responsive type must never cause clipping, horizontal page scrolling, or loss of content.

### Typography rules

- Use no more than four weights: 400, 500, 600, and 700.
- Default body text remains at least `16px`; `14px` is reserved for secondary information and compact controls.
- Use sentence case for headings, buttons, labels, and navigation.
- Reserve uppercase for short category labels with added letter spacing; never use it for paragraphs.
- Keep prose between 55 and 75 characters per line.
- Do not communicate hierarchy through font size alone; combine size with weight, spacing, and semantic heading levels.
- Preserve a logical `h1`–`h6` outline. Visual styling must not determine semantic level.
- Numeric dashboard values should use tabular numerals.

## 4. Spacing scale

Use a four-pixel base grid. Prefer the named scale and avoid one-off values.

| Token       | Value  | Typical use                   |
| ----------- | ------ | ----------------------------- |
| `space-0`   | `0`    | Reset                         |
| `space-050` | `2px`  | Optical adjustment only       |
| `space-1`   | `4px`  | Tight icon/text gap           |
| `space-2`   | `8px`  | Compact internal gap          |
| `space-3`   | `12px` | Control group gap             |
| `space-4`   | `16px` | Default component padding     |
| `space-5`   | `20px` | Comfortable component padding |
| `space-6`   | `24px` | Card padding / section gap    |
| `space-8`   | `32px` | Major group spacing           |
| `space-10`  | `40px` | Page-section spacing          |
| `space-12`  | `48px` | Large page spacing            |
| `space-16`  | `64px` | Marketing-section spacing     |
| `space-20`  | `80px` | Large-screen hero spacing     |
| `space-24`  | `96px` | Maximum editorial separation  |

Rules:

- Use `8px` as the normal gap between related controls and `24–32px` between conceptual groups.
- Form fields use `16–24px` vertical separation depending on helper/error text.
- Page gutters are `16px` on compact screens, `24px` on tablets, and `32px` on desktop.
- Touch targets must be at least `44 × 44px`, even when the visible icon is smaller.

### Control and density recipes

| Token        | Height | Horizontal padding | Icon box | Intended use                          |
| ------------ | ------ | ------------------ | -------- | ------------------------------------- |
| `control-sm` | `44px` | `12px`             | `16px`   | Compact toolbar and secondary actions |
| `control-md` | `48px` | `16px`             | `20px`   | Default buttons, selects, and inputs  |
| `control-lg` | `52px` | `20px`             | `24px`   | Prominent actions and spacious forms  |

Row-size tokens are `row-compact: 44px`, `row-standard: 52px`, and `row-comfortable: 60px`. Compact density is limited to desktop data tables and toolbars where users explicitly choose or expect dense data; authentication, primary forms, dialogs, and touch-first layouts use standard or comfortable density. Component padding may grow for wrapped content, so these row tokens are minimum heights rather than clipping constraints.

## 5. Border radius

| Token         | Value    | Use                          |
| ------------- | -------- | ---------------------------- |
| `radius-none` | `0`      | Edge-to-edge data regions    |
| `radius-sm`   | `4px`    | Tags and compact controls    |
| `radius-md`   | `8px`    | Inputs and buttons           |
| `radius-lg`   | `12px`   | Cards and menus              |
| `radius-xl`   | `16px`   | Dialogs and prominent panels |
| `radius-2xl`  | `20px`   | Marketing surfaces only      |
| `radius-full` | `9999px` | Avatars, status dots, pills  |

Use one radius per component boundary. Nested surfaces should generally use a smaller radius than their parent. Avoid excessive pills; reserve them for statuses, filters, and compact segmented choices.

## 6. Shadows

Shadows communicate elevation, not decoration. Borders and surface contrast should carry most structure.

| Token       | Light mode                                                          | Dark mode                       | Use                  |
| ----------- | ------------------------------------------------------------------- | ------------------------------- | -------------------- |
| `shadow-xs` | `0 1px 2px rgb(15 23 42 / 0.06)`                                    | `0 1px 2px rgb(0 0 0 / 0.30)`   | Inputs, subtle cards |
| `shadow-sm` | `0 1px 3px rgb(15 23 42 / 0.08), 0 1px 2px rgb(15 23 42 / 0.04)`    | `0 2px 4px rgb(0 0 0 / 0.30)`   | Raised card          |
| `shadow-md` | `0 8px 24px rgb(15 23 42 / 0.10), 0 2px 6px rgb(15 23 42 / 0.06)`   | `0 12px 28px rgb(0 0 0 / 0.40)` | Popover, menu        |
| `shadow-lg` | `0 24px 64px rgb(15 23 42 / 0.16), 0 6px 16px rgb(15 23 42 / 0.08)` | `0 28px 72px rgb(0 0 0 / 0.55)` | Dialog only          |

- Never use shadows to replace a required focus indicator.
- Dark-mode elevation should rely more on surface tone and border contrast than shadow.
- Avoid colored glow effects in product UI. A restrained brand glow may appear only in marketing artwork.

### Stacking scale

Use named layers rather than arbitrary `z-index` values. A component remains within its nearest stacking context; creating a new stacking context must be intentional and documented.

| Token        | Value | Use                                 |
| ------------ | ----- | ----------------------------------- |
| `z-base`     | `0`   | Normal document flow                |
| `z-raised`   | `10`  | Raised local content                |
| `z-sticky`   | `20`  | Sticky headers and local navigation |
| `z-dropdown` | `30`  | Menus and dropdowns                 |
| `z-popover`  | `40`  | Popovers and teaching surfaces      |
| `z-modal`    | `50`  | Dialogs, drawers, and their scrims  |
| `z-toast`    | `60`  | Non-modal notifications             |
| `z-critical` | `70`  | Critical blocking overlays only     |

## 7. Component naming conventions

### Files and exports

- Component files use kebab case: `status-badge.tsx`.
- React component exports use PascalCase: `StatusBadge`.
- One primary component per file; colocate small private subcomponents only when they are not reusable.
- Tests use `component-name.test.tsx`; stories or examples, if introduced, use `component-name.stories.tsx`.
- Hooks begin with `use`: `useMediaQuery`.

### API naming

- Use intent-based variants: `primary`, `secondary`, `destructive`, `quiet`.
- Use consistent sizes: `sm`, `md`, `lg`; default to `md`.
- Boolean props begin with `is`, `has`, `can`, or `should`.
- Event props begin with `on`; internal handlers begin with `handle`.
- Use `children`, `label`, `description`, `error`, and `helperText` consistently.
- Expose standard HTML attributes and refs where the underlying element is meaningful.
- Prefer explicit compound components for complex relationships: `Dialog.Root`, `Dialog.Trigger`, `Dialog.Content`.
- Use `data-state`, `data-variant`, and `data-size` for styling state without leaking implementation details.

### Boundaries

- Primitives are domain-neutral: `Button`, `Dialog`, `Badge`.
- Product components describe the business concept: `ApplicationStatusBadge`, `ResumeVersionCard`.
- Patterns compose components without owning business data: `EmptyState`, `PageHeader`, `FilterBar`.
- Avoid vague names such as `Box`, `Wrapper`, `Item`, `Card2`, or `CommonButton`.

## 8. Folder structure

```text
src/
├── app/                          # Routes and route-level composition
├── components/
│   ├── ui/                       # Accessible, domain-neutral primitives
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── patterns/                 # Reusable compositions
│   │   ├── empty-state.tsx
│   │   ├── page-header.tsx
│   │   └── ...
│   └── layout/                   # App shell, navigation, page frame
├── features/
│   ├── applications/
│   │   └── components/           # Application-specific components
│   ├── auth/
│   ├── dashboard/
│   ├── resumes/
│   └── ai/
├── styles/
│   ├── tokens.css                # Primitive and semantic CSS variables
│   ├── themes.css                # Light/dark semantic mappings
│   └── utilities.css             # Rare shared visual utilities
└── lib/
    └── cn.ts                     # Class composition helper, if required
```

Rules:

- Do not create a global component until at least two features need it or it is a true primitive.
- Feature components may consume primitives but primitives must never import feature code.
- Keep token definitions framework-independent and centralized.
- Avoid barrel files for large component directories when they obscure dependency boundaries or increase client bundles.
- Server Components remain the default. Add `"use client"` only at the smallest interactive boundary.

## 9. Accessibility rules

The minimum standard is WCAG 2.2 AA.

### Semantics and structure

- Use native elements before ARIA. A clickable action is a `button`; navigation is a link.
- Each page has one descriptive `h1`, a logical heading hierarchy, and correctly named landmarks.
- Every input has a persistent programmatic label. Placeholder text is never a label.
- Icon-only controls require an accessible name.
- Tables retain proper headers and captions. Kanban views require an equivalent keyboard- and screen-reader-accessible representation.

### Keyboard and focus

- All interactive controls are reachable and operable with a keyboard.
- Focus order follows visual and reading order.
- Focus indicators are never removed. Use a two-color treatment: a one-pixel inner keyline that contrasts with the control and a two-pixel outer `focus-ring` with a two-pixel offset that contrasts with the adjacent surface. The treatment must maintain at least `3:1` contrast against both boundaries.
- Brand, destructive, AI-tinted, image-backed, and dark surfaces must use the semantic inner keyline that provides the stronger local contrast; they must not substitute a single brand-colored ring.
- Focus indicators must not be clipped by overflow containers. In forced-colors mode, the focus fallback uses a visible system-color outline rather than relying on authored shadows or fills.
- Dialogs trap focus, close with `Escape`, restore focus to the trigger, and have an accessible title.
- Menus, listboxes, tabs, and comboboxes follow established WAI-ARIA interaction patterns.
- Drag-and-drop interactions always provide a non-drag alternative.

### Contrast and color

- Normal text: minimum `4.5:1` contrast.
- Large text: minimum `3:1` contrast.
- Controls, focus indicators, icons conveying meaning, and component boundaries: minimum `3:1` against adjacent colors.
- Never use color alone for application status, validation, selection, or AI confidence.

### Forms and feedback

- Instructions appear before the relevant control.
- Errors identify the field, explain the problem, and suggest recovery.
- Invalid controls use `aria-invalid`; errors use stable `aria-describedby` relationships.
- On failed submission, move focus to an error summary or the first invalid field according to context.
- Loading states announce meaningful progress without repeatedly interrupting screen readers.
- Toasts supplement inline feedback; they never contain the only copy of critical information.
- Inputs use the correct `autocomplete` token and, where it improves the software keyboard, an appropriate `inputMode`. Authentication fields must remain compatible with password managers and must not block paste.
- Required fields are identified in visible text and programmatically with the native `required` attribute or equivalent accessible state. Instructions explain the required-field convention before the form.
- Validate on understandable boundaries: on submit, and on blur after a field has been interacted with. Do not interrupt typing with premature errors. Async validation exposes a stable checking state and ignores stale responses.
- Submission handlers are idempotent. While a submission is pending, prevent duplicate activation without moving focus or replacing the focused control; announce the pending state and preserve the submitted label in context.
- Preserve user-entered values after client or server errors. Submission errors use a focusable summary linked to the affected fields, while field-level messages remain adjacent to their controls.

### Content, zoom, and motion

- The interface remains usable at 200% browser zoom and with 400% text reflow at a 320 CSS-pixel viewport.
- Content must not require two-dimensional scrolling except for genuinely tabular regions.
- Respect `prefers-reduced-motion` and remove nonessential movement.
- AI-generated content must be labeled as a draft, editable, and distinguishable from user-provided facts without relying on color alone.

## 10. Dark mode strategy

- Implement themes through semantic CSS custom properties, not duplicated component classes.
- The theme preference has one source of truth: a cookie containing `light`, `dark`, or `system`. An explicit `light` or `dark` cookie wins; a missing, invalid, or `system` value resolves from `prefers-color-scheme`.
- The server renders the explicit theme attribute when the cookie is `light` or `dark`. For `system`, root CSS media rules provide the initial mapping and a Content-Security-Policy-compatible pre-paint resolver may set the resolved root attribute before hydration. Server and client must use the same resolution contract to avoid hydration mismatches.
- Local storage is not an authority. If introduced as a performance cache, it must mirror the cookie and be repaired from the cookie whenever they differ.
- When `system` is active, changes to the operating-system preference update the active theme immediately without writing an explicit preference. Components must not inspect system preference directly.
- Set root `color-scheme` to the resolved theme so native form controls, date pickers, and browser-rendered surfaces match it.
- Define theme-aware autofill foreground, background, caret, and focus styling without obscuring browser autofill indication. Selection always uses both `selection` and `selection-foreground` tokens.
- Use platform-default scrollbars where possible. Any authored scrollbar must preserve contrast, size, and forced-color behavior in both themes.
- Keep `meta[name="theme-color"]` synchronized with the resolved canvas color so supported browser chrome follows the active theme.
- Do not invert colors mechanically. Dark surfaces use distinct semantic mappings and reduced shadow intensity.
- Avoid pure black and pure white for large surfaces; use slate-950 and slate-50 to reduce glare.
- Recheck semantic, status, chart, disabled, hover, focus, and selected-state contrast independently in both themes.
- User-authored documents may offer a neutral “paper” preview, but surrounding controls still follow the selected theme.

## 11. Responsive breakpoints

Use mobile-first styles. Breakpoints indicate available space, not device categories.

| Token | Minimum width | Intended behavior                                          |
| ----- | ------------- | ---------------------------------------------------------- |
| Base  | `0px`         | Single column, compact gutters, touch-first controls       |
| `sm`  | `640px`       | Wider forms, paired compact controls                       |
| `md`  | `768px`       | Persistent secondary navigation where space permits        |
| `lg`  | `1024px`      | Multi-column dashboard and application detail layouts      |
| `xl`  | `1280px`      | Full table/Kanban density and generous gutters             |
| `2xl` | `1536px`      | Maximum content framing; do not stretch prose indefinitely |

Layout rules:

- Default content maximum: `1280px`; analytical boards may extend to `1440px`.
- Reading/form column maximum: `720px`.
- Navigation collapses based on content fit, not user-agent detection.
- Tables may use responsive column priority, horizontal containment, or a card alternative; never hide essential information without another route to it.
- Kanban columns become horizontally scrollable only when an equivalent list/table view remains available.
- Test at 320, 390, 768, 1024, 1280, and 1536 CSS pixels, plus 200% zoom.

### Viewport and container query ownership

- Viewport breakpoints control page-level structure only: the app shell, primary navigation, page gutters, and top-level page grids.
- Reusable cards, filter bars, tables, and composite panels own a named containment context and adapt with container queries when their behavior depends on allocated width.
- Component thresholds are chosen from the minimum space required by their content and interactions; they must not copy viewport breakpoint values by default.
- A component must behave correctly in a narrow drawer, split pane, or dashboard column even when the viewport is wide. Its documentation records each container threshold and the resulting layout change.
- Where container queries are unavailable, the fallback preserves content and actions in a single-column layout; enhancement may add density but must not restore hidden functionality.

## 12. Animation principles

Motion communicates relationship, state, and continuity. It must never delay work or make the product feel theatrical.

### Durations

| Token               | Duration | Use                                     |
| ------------------- | -------- | --------------------------------------- |
| `motion-instant`    | `0ms`    | Reduced motion / immediate state        |
| `motion-fast`       | `100ms`  | Hover and pressed feedback              |
| `motion-standard`   | `160ms`  | Small state transitions                 |
| `motion-emphasized` | `240ms`  | Menus, popovers, compact panels         |
| `motion-layout`     | `320ms`  | Large but infrequent layout transitions |

### Easing

- Enter: `cubic-bezier(0.16, 1, 0.3, 1)`.
- Exit: `cubic-bezier(0.4, 0, 1, 1)`.
- State change: `cubic-bezier(0.2, 0, 0, 1)`.

### Rules

- Prefer opacity and transform; avoid animating layout properties when possible.
- Hover movement is limited to one or two pixels and must not shift surrounding layout.
- Skeletons use a restrained opacity pulse, never an aggressive shimmer.
- Progress indicators represent real waiting, not decorative activity.
- Do not animate large background gradients in application UI.
- Under `prefers-reduced-motion: reduce`, remove parallax, auto-scrolling, spring effects, and nonessential transitions; preserve only immediate state feedback.
- No essential information may depend on an animation completing.

### Reduced-motion behavior by pattern

| Pattern                           | Behavior when `prefers-reduced-motion: reduce`                                                                                                        |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Skeleton                          | Show a static placeholder with no pulse or shimmer.                                                                                                   |
| Spinner or progress               | Prefer determinate text and a static progress representation. Indeterminate waits include persistent “Loading…” text rather than relying on rotation. |
| Dialog or drawer                  | Appear and disappear without travel; focus management and state changes remain immediate.                                                             |
| Sorting and table updates         | Reorder immediately without spatial animation and announce the new sort or result state.                                                              |
| Kanban movement                   | Move the item immediately, retain a non-drag control path, and announce its new position.                                                             |
| Hover and pressed feedback        | Remove translation and preserve immediate color, border, or text feedback.                                                                            |
| Auto-scroll and carousel behavior | Disable automatic movement and provide explicit user controls.                                                                                        |

## 13. Icon strategy

- Use one consistent outline icon family. **Lucide** is the preferred implementation candidate because of its coverage, visual neutrality, and tree-shakable React exports.
- Do not install an icon library until the first component implementation requires it.
- Default sizes: `16px` in compact controls, `20px` in standard controls, and `24px` for standalone emphasis.
- Use a consistent `1.75–2px` optical stroke and `currentColor`.
- Icons align to the text’s visual center, not merely the line box.
- Decorative icons use `aria-hidden="true"`.
- Meaningful standalone icons require an accessible name, usually through the parent control.
- Pair unfamiliar icons with text. Never use an icon alone for destructive, AI, upload, or status meaning unless the label is available to assistive technology and the interaction is well established.
- Product-specific illustrations or logos must not be assembled from arbitrary icon combinations.
- Status icons always accompany status text.

## 14. Component checklist and implementation order

Do not skip directly to product composites. Each layer depends on the accessibility and token contracts beneath it.

### Phase 0 — Tokens and foundations

- [ ] Machine-readable token schema with canonical-name and reference validation
- [ ] Duplicate-value report with reviewed, documented intentional aliases
- [ ] Automated contrast tests for approved foreground/background, boundary, focus, and interaction-state pairs in light and dark themes
- [ ] Primitive and semantic color tokens
- [ ] Typography tokens and framework font loading
- [ ] Spacing, radius, shadow, motion, and z-index tokens
- [ ] Light and dark theme mappings
- [ ] Global focus style, selection style, and reduced-motion reset
- [ ] Class composition utility, if justified

### Phase 1 — Core interaction primitives

- [ ] Button and icon button
- [ ] Link styles
- [ ] Input and textarea
- [ ] Label, helper text, field error, and field wrapper
- [ ] Checkbox, radio group, and switch
- [ ] Select / combobox foundation
- [ ] Badge and status indicator
- [ ] Separator and visually hidden utility

### Phase 2 — Layout and navigation

- [ ] Container and stack primitives
- [ ] Page header
- [ ] App header and responsive navigation
- [ ] Breadcrumbs
- [ ] Tabs
- [ ] Pagination
- [ ] Theme control

### Phase 3 — Feedback and state

- [ ] Spinner and progress indicator
- [ ] Skeleton
- [ ] Inline alert
- [ ] Toast system
- [ ] Empty state
- [ ] Error state and error summary
- [ ] Confirmation pattern for destructive actions

### Phase 4 — Overlays and disclosure

- [ ] Tooltip
- [ ] Popover
- [ ] Dropdown menu
- [ ] Dialog / alert dialog
- [ ] Drawer / sheet
- [ ] Accordion / disclosure

### Phase 5 — Data display

- [ ] Card and metric card
- [ ] Definition list
- [ ] Accessible data table
- [ ] Filter bar and active-filter chips
- [ ] Sort control
- [ ] Date/deadline presentation
- [ ] Chart color and labeling rules

### Phase 6 — Product components

- [ ] Application status badge
- [ ] Application summary card
- [ ] Application table row
- [ ] Kanban column and keyboard movement controls
- [ ] Resume version card
- [ ] Activity timeline
- [ ] Deadline indicator
- [ ] AI draft label and provenance panel
- [ ] Unsupported-claim warning
- [ ] AI generation review panel

### Phase 7 — Page patterns and validation

- [ ] Authentication form pattern
- [ ] Application editor pattern
- [ ] Dashboard composition
- [ ] Resume management composition
- [ ] AI workflow composition
- [ ] Responsive and zoom review
- [ ] Keyboard and screen-reader review
- [ ] Light/dark contrast audit
- [ ] Automated accessibility tests plus manual verification

## Component definition of done

Before any component is considered stable, confirm:

- [ ] Uses semantic tokens only
- [ ] Supports light and dark themes
- [ ] Has correct native semantics and accessible naming
- [ ] Works with keyboard only
- [ ] Shows a visible focus indicator
- [ ] Meets contrast requirements in every state
- [ ] Handles default, hover, focus, active, disabled, loading, error, and empty states as applicable
- [ ] Works at 320px, 200% zoom, and with long translated or user-provided text
- [ ] Respects reduced motion
- [ ] Avoids unnecessary Client Component boundaries
- [ ] Includes focused unit/component accessibility tests
- [ ] Has documented usage, variants, and anti-patterns
- [ ] Passes token-schema validation and automated contrast checks for every supported theme and state

## Changelog

### Current update

- **DS-01:** Defined canonical CSS-safe token naming and renamed `space-0.5` to `space-050`.
- **DS-02:** Specified primitive, semantic, and exceptional component token layers, including consumption, ownership, override, and deprecation rules.
- **DS-04:** Added the required neutral, primary, destructive, and AI interaction-state token matrix and its five visual slots for both themes.
- **DS-05:** Added overlay, inverse, link, visited-link, selection-foreground, opacity, border, outline, icon, chart-series, and named stacking tokens.
- **A11Y-01:** Replaced the single focus-ring rule with a two-color, non-clipping focus treatment and defined surface and forced-color fallbacks.
- **A11Y-06:** Added input-purpose, password-manager, required-field, validation, idempotent submission, focus, and value-retention requirements.
- **TYPE-02:** Added bounded responsive type formulas and compact-screen and zoom constraints for large headings.
- **SPACE-01:** Added control-height, padding, icon-box, row-size, and density recipes.
- **RESP-01:** Defined viewport-query ownership, container-query ownership, intrinsic thresholds, and narrow-container fallbacks.
- **DARK-01:** Established cookie-first theme precedence, system-theme updates, server/client synchronization, and CSP-compatible pre-paint behavior.
- **DARK-02:** Added native `color-scheme`, autofill, selection, scrollbar, and browser theme-color requirements.
- **MOTION-02:** Added explicit reduced-motion alternatives for loading, overlays, sorting, Kanban, feedback, and automatic movement.
- **QA-01:** Added Phase 0 token-schema, duplicate-value, and automated contrast validation requirements.
