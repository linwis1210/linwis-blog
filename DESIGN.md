---
version: 1.0
name: Quiet Engineering
project: linwis_
description: >
  A personal technical-blog design language combining Apple-inspired spatial calm
  with GitHub-inspired engineering precision. The interface should feel quiet,
  deliberate, content-first, technically credible, and highly readable.
---

# DESIGN.md

## 1. Design Intent

`linwis_` should feel like a quiet engineering notebook rather than a SaaS landing page.

The visual system combines two influences:

- **Apple-inspired spatial calm** — generous whitespace, strong typography, clear focal hierarchy, restrained motion, and minimal visual noise.
- **GitHub-inspired engineering precision** — structured information, subtle borders, compact metadata, code-first treatment, semantic color, and technical clarity.

The goal is not to imitate either brand.

The goal is to create a distinct personal identity:

> **Quiet Engineering — calm on the outside, precise on the inside.**

The design should feel calm, precise, technical, editorial, personal, modern, restrained, and durable rather than trendy.

Avoid generic AI-generated aesthetics.

## 2. Core Principles

### 2.1 Content dominates chrome
The interface exists to present writing, projects, code, diagrams, and ideas. Navigation, cards, controls, decoration, gradients, and animation must never compete with content.

### 2.2 Whitespace establishes hierarchy
Use spacing before borders, backgrounds, shadows, or cards. Whitespace is a structural element, not unused space.

### 2.3 Typography carries most visual hierarchy
Prefer changes in size, weight, line height, letter spacing, alignment, and whitespace before introducing extra colors or containers.

### 2.4 Borders organize information, never decorate it
Borders should be thin, low contrast, and purposeful. Use them for technical structure such as metadata, code, tables, project information, archive lists, and navigation separation. Do not surround every content block with a border.

### 2.5 Color always has a reason
Most of the interface should be neutral. Accent colors exist for links, active states, focus, important interaction, and semantic state. Do not use color merely to make a section look more exciting.

### 2.6 One primary visual idea per viewport
Do not create several competing focal points in the same screen. Each viewport should have one dominant element: a title, article, project, image, piece of code, or diagram.

### 2.7 Density is contextual
Use spacious layouts for homepage, article hero, section transitions, and major project presentations. Use denser GitHub-like structure for metadata, code, archive lists, tags, repository-like information, and technical tables.

### 2.8 Motion clarifies hierarchy
Animation should explain relationships or provide feedback. Never animate simply because animation is available.

## 3. Visual Theme & Atmosphere

### Light mode
The default experience should be bright, quiet, and slightly softer than pure white: near-white canvas, black or charcoal typography, cool neutral secondary text, thin gray separators, and a single blue interaction accent. The page should feel closer to a well-designed technical publication than a dashboard.

### Dark mode
Dark mode should feel deep and calm rather than neon or cyberpunk. Use near-black background, subtle elevated surfaces, soft white primary text, muted cool-gray secondary text, restrained blue links, and semantic colors only when useful. Avoid glowing borders, neon gradients, and excessive translucency.

## 4. Color System

### 4.1 Light Theme

| Token | Value | Role |
|---|---:|---|
| `canvas` | `#FBFBFD` | Main page background |
| `surface` | `#FFFFFF` | Raised or grouped content |
| `surface-subtle` | `#F6F8FA` | Code-adjacent or technical grouping |
| `surface-hover` | `#F3F4F6` | Soft hover state |
| `ink` | `#1D1D1F` | Primary text |
| `ink-strong` | `#000000` | Strong emphasis |
| `ink-muted` | `#656D76` | Secondary text |
| `ink-faint` | `#8C959F` | Tertiary metadata |
| `border` | `#D8DEE4` | Default divider/border |
| `border-subtle` | `#EAECEF` | Low-priority separation |
| `accent` | `#0071E3` | Primary interactive accent |
| `accent-hover` | `#0066CC` | Accent hover |
| `accent-soft` | `#EAF4FF` | Soft highlighted background |
| `success` | `#1A7F37` | Success / completed |
| `warning` | `#9A6700` | Warning |
| `danger` | `#D1242F` | Error / destructive state |
| `code-bg` | `#F6F8FA` | Inline and block code background |

### 4.2 Dark Theme

| Token | Value | Role |
|---|---:|---|
| `canvas` | `#0D1117` | Main background |
| `surface` | `#161B22` | Raised content |
| `surface-subtle` | `#11161D` | Technical grouping |
| `surface-hover` | `#1C2128` | Hover state |
| `ink` | `#F0F6FC` | Primary text |
| `ink-strong` | `#FFFFFF` | Strong emphasis |
| `ink-muted` | `#8B949E` | Secondary text |
| `ink-faint` | `#6E7681` | Tertiary metadata |
| `border` | `#30363D` | Default divider/border |
| `border-subtle` | `#21262D` | Low-priority separation |
| `accent` | `#58A6FF` | Primary interactive accent |
| `accent-hover` | `#79C0FF` | Accent hover |
| `accent-soft` | `#0D2742` | Soft highlighted background |
| `success` | `#3FB950` | Success |
| `warning` | `#D29922` | Warning |
| `danger` | `#F85149` | Error |
| `code-bg` | `#161B22` | Code background |

### 4.3 Color Rules
- The primary accent is blue.
- Do not introduce a second brand accent without a strong reason.
- Semantic green/red/yellow should remain functional.
- Large sections should usually remain neutral.
- Gradients are exceptional, not default.
- Never use gradient text for ordinary headings.
- Do not create decorative colored blobs behind content.

## 5. Typography

### 5.1 Font Families

#### UI / Display / Body
Use the native system sans stack:

```css
font-family:
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  Helvetica,
  Arial,
  sans-serif;
```

Do not depend on proprietary Apple fonts being distributed with the site.

#### Monospace

```css
font-family:
  ui-monospace,
  SFMono-Regular,
  SF Mono,
  Menlo,
  Monaco,
  Consolas,
  "Liberation Mono",
  monospace;
```

Use monospace selectively for code, dates when useful, paths, commands, commit-like identifiers, technical metadata, and compact labels. Do not render normal prose in monospace.

## 6. Type Scale

### Display

#### `display-xl`
- desktop: `clamp(3.5rem, 7vw, 6.5rem)`
- weight: `700`
- line-height: `0.98–1.05`
- letter-spacing: `-0.045em`
- use: homepage identity or rare major statement

#### `display-lg`
- desktop: `clamp(2.75rem, 5vw, 4.75rem)`
- weight: `700`
- line-height: `1.02–1.08`
- letter-spacing: `-0.035em`
- use: article hero / major page title

### Headings

#### `h1`
- `clamp(2.4rem, 4.5vw, 4rem)`
- weight: `700`
- line-height: `1.08`
- letter-spacing: `-0.03em`

#### `h2`
- `clamp(1.75rem, 3vw, 2.5rem)`
- weight: `650`
- line-height: `1.15`
- letter-spacing: `-0.025em`

#### `h3`
- `1.35rem–1.6rem`
- weight: `650`
- line-height: `1.25`
- letter-spacing: `-0.015em`

#### `h4`
- `1.1rem–1.25rem`
- weight: `650`
- line-height: `1.3`

### Body

#### Article body
- desktop: `17–18px`
- mobile: `16.5–17px`
- line-height: `1.72–1.82`
- weight: `400`
- maximum text width: `68ch`

#### Intro / Lead
- `20–22px`
- line-height: `1.55–1.65`
- color: `ink-muted`
- maximum width: `60ch`

#### Small text
- `14px`
- line-height: `1.5`

#### Metadata
- `12–13px`
- line-height: `1.4`
- color: `ink-muted`
- may use monospace when it strengthens technical identity

## 7. Spacing System

Use an 8px-oriented spacing rhythm.

| Token | Value |
|---|---:|
| `space-1` | `4px` |
| `space-2` | `8px` |
| `space-3` | `12px` |
| `space-4` | `16px` |
| `space-5` | `24px` |
| `space-6` | `32px` |
| `space-7` | `48px` |
| `space-8` | `64px` |
| `space-9` | `96px` |
| `space-10` | `128px` |

Typical section spacing:
- mobile: `64–80px`
- tablet: `80–96px`
- desktop: `96–128px`

Do not compress large editorial sections into dashboard-like blocks.

## 8. Layout

### 8.1 Global Container
Default maximum width: `1200–1280px`.

Horizontal padding:
- mobile: `20px`
- tablet: `32px`
- desktop: `40–48px`

### 8.2 Article Width
Main prose column: `max-width: 68ch`.

Prefer `62–68ch` for dense technical writing. Images, code, diagrams, and tables may break wider than the prose column when useful.

### 8.3 Grid
Use grids only when content genuinely benefits from comparison.

Prefer:
- 1 column for reading;
- 2 columns for selected project/feature layouts;
- 3 columns only for short, comparable items.

Avoid grids of many identical cards.

### 8.4 Alignment
Favor strong vertical and left-edge alignment. Do not center all content merely to create a premium appearance.

Centered layouts are best reserved for homepage opening statements, short hero messages, and rare visual breaks. Article and technical content should usually be left aligned.

## 9. Navigation

Navigation should feel quiet and permanent.

### Desktop
- compact height;
- minimal chrome;
- no oversized pill container around the entire navbar;
- logo/name on the left;
- primary destinations on the right;
- theme/search controls subtle and secondary.

Recommended links:
- Writing
- Projects
- About

Search may be an icon or compact command-style trigger.

### Mobile
Use a simple compact menu. Do not create an elaborate animated navigation system.

### Active State
Use one of:
- darker text;
- small underline;
- subtle background;
- thin bottom border.

Do not combine several indicators.

## 10. Links

### Inline links
- use accent blue;
- avoid permanent heavy decoration;
- underline on hover/focus or use a subtle text-decoration treatment;
- visible keyboard focus.

### Navigation links
Usually neutral until hover/active.

### Article-list links
The title should carry most clickable emphasis. Avoid large CTA buttons for ordinary article navigation.

## 11. Buttons

Buttons should be rare in a content-first blog.

### Primary
- solid accent background;
- white text;
- medium weight;
- radius: `8–10px`;
- no gradient;
- no glow;
- no dramatic shadow.

### Secondary
- transparent or neutral background;
- subtle `1px` border;
- text uses primary ink.

### Ghost
- transparent;
- used for compact toolbar/navigation actions.

Avoid huge pill buttons, excessive rounded corners, decorative icons inside every button, and multiple strong CTAs in one viewport.

## 12. Borders, Radius, and Elevation

### Border
Default:

```css
1px solid var(--border-subtle)
```

Technical or interactive containers may use the stronger border token.

### Radius

| Use | Radius |
|---|---:|
| Inline control | `6px` |
| Button / input | `8–10px` |
| Code block | `8–10px` |
| Medium content panel | `12–14px` |
| Large visual feature | `16–20px` |

Avoid making every surface highly rounded.

### Shadows
Default: none.

Use shadows only when elevation is functionally meaningful: floating search palette, dropdown, popover, or modal. Use soft shadows with low opacity. Do not use shadows as a substitute for hierarchy.

## 13. Cards

Cards are not the default layout primitive.

Before using a card, ask:

> Could spacing, alignment, or a divider express this relationship more clearly?

Good card use:
- project summary;
- interactive demo;
- isolated technical artifact;
- grouped external resource.

Avoid wrapping every article in a card, cards inside cards, four-column dashboard layouts for editorial content, and large numbers of visually identical boxes.

## 14. Article Lists

Article discovery should feel closer to a structured publication or repository history than a card gallery.

Preferred pattern:

```text
Latest

01
Building a practical multi-agent workflow
Thoughts on persistent context, verification and parallel execution.
2026-09-08 · 14 min
────────────────────────────────────────────

02
Designing reliable agent handoffs
Notes on scope, evidence and context ownership.
2026-09-03 · 8 min
────────────────────────────────────────────
```

Use title as primary hierarchy, short description when useful, compact date/read-time metadata, thin separators, and generous row spacing.

Avoid thumbnail-heavy card grids unless imagery is important to the content.

## 15. Article Page

The article page is the most important surface.

### Hero
Use category or series label, large title, restrained summary, metadata, and optional cover visual.

Example:

```text
AGENTS / WORKFLOW

Building a practical
multi-agent workflow

A system for coordinating persistent agents
without turning the workflow into bureaucracy.

September 8, 2026 · 14 min read
```

Do not add decorative widgets around the hero.

### Body
- narrow readable prose;
- strong vertical rhythm;
- headings separated generously;
- code and diagrams visually distinct but restrained;
- links visible;
- images can expand beyond the prose column.

### Table of Contents
Use only for longer articles.

Desktop:
- optional sticky side TOC;
- compact;
- subtle;
- low visual priority.

Mobile:
- collapsed or inline.

### Reading Progress
Optional. If used, keep it subtle and functional.

## 16. Code

Code treatment should borrow from GitHub's engineering clarity.

### Inline code
- monospace;
- slightly smaller than body;
- subtle neutral background;
- small radius;
- no bright border.

### Code blocks
- neutral technical surface;
- `1px` subtle border;
- radius `8–10px`;
- generous internal padding;
- horizontal scroll;
- clear syntax highlighting;
- optional compact header for filename/language.

Do not over-style code blocks with large headers, glowing syntax, or fake terminal decorations unless the content explicitly calls for a terminal.

## 17. Technical Metadata

Technical metadata is a core part of the identity.

Examples:
- date;
- reading time;
- tag;
- path;
- version;
- repository;
- status;
- language;
- commit-like identifier.

Use small type, muted text, monospace selectively, compact spacing, and thin separators. Metadata should feel precise, not decorative.

## 18. Tags and Labels

Tags should be compact.

Recommended:
- text-only;
- subtle border;
- or soft neutral background.

Radius: `6px`.

Avoid oversized pill tags and random colors for every tag. Color should carry meaning, not category decoration.

## 19. Search

Search should feel fast and technical.

Prefer a command-palette style experience with `⌘ K / Ctrl K`.

Search interface should be compact, keyboard friendly, use clear result hierarchy, show article title first and metadata second, and highlight query matches only when useful.

Avoid turning search into a large separate product surface unless content volume requires it.

## 20. Projects

Projects may be more visual than articles.

Each project should communicate:
1. name;
2. purpose;
3. current state;
4. stack or technical context;
5. optional screenshot;
6. source/demo links when relevant.

Prefer one strong project presentation over several tiny cards. A project section may alternate between a large visual and concise technical information.

## 21. About Page

The About page should feel personal but restrained.

Include:
- brief personal introduction;
- what you work on;
- what you write about;
- selected tools/interests;
- contact or external profiles.

Avoid résumé-dashboard aesthetics unless the page specifically needs a detailed CV.

## 22. Imagery

Images should be purposeful.

Good uses:
- project screenshots;
- diagrams;
- research figures;
- interface details;
- article-specific illustrations;
- technical visualizations.

When an image is important, let it breathe, allow it to become a major composition element, and avoid unnecessary frames.

Do not fill empty space with generic stock imagery.

## 23. Icons

Use one consistent icon family.

Preferred qualities:
- simple;
- geometric;
- utilitarian;
- small;
- aligned to text;
- limited stroke variation.

Icons should support meaning. Do not place icons before every label. Avoid decorative emoji as UI chrome.

## 24. Motion

Motion should be restrained.

### Recommended
- `150–220ms` for control feedback;
- `250–450ms` for larger content transitions;
- opacity;
- small translation;
- gentle scale;
- subtle reveal;
- restrained sticky transitions.

### Avoid
- continuous floating;
- animated gradients;
- glowing borders;
- large parallax effects;
- bouncing controls;
- hover movement on every card;
- page elements entering from many directions.

Animation should never delay reading.

Respect:

```css
@media (prefers-reduced-motion: reduce)
```

## 25. Hover States

Hover should communicate interactivity without theatrics.

Preferred:
- text color change;
- subtle background change;
- border emphasis;
- small underline;
- optional `1–2px` translation in rare cases.

Avoid large scale changes, dramatic shadows, rotating icons, and spring animations for ordinary links.

## 26. Responsive Behavior

### Mobile-first priorities
On small screens:
1. preserve reading comfort;
2. reduce display type size;
3. reduce section whitespace proportionally;
4. collapse multi-column layouts;
5. keep touch targets at least `44px`;
6. allow code/tables to scroll horizontally where necessary;
7. remove secondary decorative elements before compressing core content.

Do not simply shrink desktop layouts.

### Breakpoint guidance
Suggested:
- small: `< 640px`
- medium: `640–1024px`
- large: `> 1024px`

Use content-driven breakpoints when a component requires different behavior.

## 27. Accessibility

Accessibility is part of the visual system.

Requirements:
- sufficient text/background contrast;
- visible keyboard focus;
- semantic heading order;
- usable keyboard navigation;
- alt text for meaningful images;
- reduced-motion support;
- touch target minimum around `44px`;
- do not communicate state through color alone;
- body text must remain readable at browser zoom.

Focus states may use the accent color but must remain clearly visible in light and dark themes.

## 28. Light / Dark Mode

Both modes are first-class.

Do not design light mode first and merely invert colors.

Maintain equivalent hierarchy across canvas, surface, text, border, accent, code, and semantic states.

Dark mode should not use pure black everywhere. Avoid high-contrast white-on-black for large quantities of body text when a softer combination reads better.

## 29. Page-Specific Density

### Homepage
Density: low to medium.

Emphasize identity, latest writing, and selected work.

### Article
Density: low in hero, medium in body.

### Archive
Density: medium to high.

Use GitHub-like structure: year, date, title, tags, separators.

### Projects
Density: medium. Allow visual variation.

### Search
Density: medium to high. Optimize for scanning.

## 30. Homepage Direction

Recommended composition:

```text
linwis_

Thoughts on software,
agents and things I build.

Writing about engineering,
AI, systems and experiments.


Latest

01  Building a practical multi-agent workflow
    Sep 08, 2026 · 14 min                         →

02  Designing persistent agent contexts
    Sep 04, 2026 · 9 min                          →

03  Notes on Astro architecture
    Aug 29, 2026 · 11 min                         →


Selected work
...
```

The homepage should not look like a startup pitch deck.

Avoid:
- “Trusted by...”;
- fake metrics;
- testimonial sections;
- feature-grid marketing patterns;
- oversized CTA blocks;
- abstract gradient hero backgrounds.

## 31. Design Anti-Patterns

### Generic AI SaaS patterns
Do not use unless clearly justified:
- purple/blue gradient hero;
- gradient text;
- glowing orb backgrounds;
- glassmorphism everywhere;
- giant pill-shaped navbar;
- repeated rounded feature cards;
- decorative metrics;
- fake dashboards;
- excessive badges;
- “AI-powered” visual clichés.

### Excessive Apple imitation
Avoid:
- copying Apple product-page layouts literally;
- huge empty space without meaningful hierarchy;
- enormous headings on every page;
- overusing blur/translucency;
- reproducing proprietary Apple UI elements exactly.

### Excessive GitHub imitation
Avoid:
- turning the whole blog into a developer dashboard;
- placing borders around every section;
- dense tables where prose is better;
- using monospace too broadly;
- making every article look like a repository page.

## 32. Component Guardrails

Before creating a component, ask:
1. Does this component express a real content or interaction boundary?
2. Could typography and spacing solve the problem instead?
3. Does the design already contain an equivalent component?
4. Does this increase visual noise?
5. Is it consistent with Quiet Engineering?

Prefer fewer, stronger primitives.

## 33. Design Tokens First

When implementing or redesigning the site:
1. establish tokens;
2. establish typography;
3. establish global spacing;
4. establish article width;
5. establish borders/radius;
6. establish code treatment;
7. establish shared controls;
8. then redesign individual pages.

Do not independently style each page.

## 34. Agent Implementation Rules

When an AI coding agent modifies the UI:
1. Read this file before making visual decisions.
2. Preserve the Quiet Engineering direction.
3. Reuse existing design tokens and components before creating new ones.
4. Do not introduce a new color, radius, shadow, font, or spacing pattern casually.
5. Prefer removing visual noise over adding decoration.
6. Keep editorial surfaces spacious.
7. Keep technical surfaces structured and compact.
8. Validate both light and dark themes.
9. Validate desktop and mobile layouts.
10. Inspect the rendered result rather than judging from code alone.
11. When uncertain, choose the simpler implementation.
12. Do not imitate Apple or GitHub literally; preserve the project's own identity.

## 35. Visual Review Checklist

### Hierarchy
- Is the primary focal point obvious?
- Are there competing headings or CTAs?
- Can important content be identified within a few seconds?

### Typography
- Is body text comfortable to read?
- Are line lengths controlled?
- Are headings clearly differentiated without excessive styling?

### Spacing
- Does the page breathe?
- Are related items visually grouped?
- Is spacing consistent across pages?

### Structure
- Are borders being used for structure rather than decoration?
- Are there unnecessary cards or containers?

### Color
- Is the page primarily neutral?
- Does every strong color have a clear purpose?

### Technical identity
- Are code and metadata clear and precise?
- Is monospace used selectively?

### Motion
- Does movement improve understanding?
- Is anything moving without a reason?

### Responsiveness
- Does mobile feel intentionally designed?
- Are reading width and touch targets comfortable?

### Identity
- Does the page feel like `linwis_`, rather than a generic Apple clone, GitHub clone, or AI template?

## 36. Quick Prompt Guide for Agents

### General redesign
> Redesign this surface according to `DESIGN.md`. Preserve Quiet Engineering: Apple-inspired spatial calm, GitHub-inspired engineering precision, strong typography, restrained color, purposeful borders, limited cards, and content-first hierarchy. Reuse existing tokens and components. Inspect the rendered desktop and mobile result before finishing.

### Article page
> Make the article feel like a premium technical publication rather than a dashboard. Use generous spacing and typography for the editorial layer, and GitHub-like precision for code, metadata, tables, tags, and technical structure.

### Homepage
> Keep the homepage quiet and personal. Prioritize identity, latest writing, and selected work. Avoid SaaS landing-page patterns, decorative feature grids, gradients, and unnecessary cards.

### Visual cleanup
> Reduce visual noise before adding new decoration. Remove unnecessary cards, borders, colors, shadows, badges, and motion. Strengthen hierarchy using typography, spacing, alignment, and content structure first.

## 37. Final Design Statement

`linwis_` should not look like Apple.

`linwis_` should not look like GitHub.

It should feel like a personal technical publication designed by someone who values both:

- the calm visual discipline of Apple;
- the engineering clarity of GitHub.

The final impression should be:

> **quiet enough to read, precise enough to trust, personal enough to remember.**
