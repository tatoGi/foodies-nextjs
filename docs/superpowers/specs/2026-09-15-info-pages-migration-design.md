# BiteClub Info Pages → Next.js — Design

> **Amendment (2026-09-15, post-review):** After this spec was approved, the
> user reviewed the full 10-page candidate list and explicitly cut `team.html`,
> `team-details.html`, and `testimonial.html` — fake vendor-template demo
> content (a made-up team roster and testimonials), not real content for the
> BiteClub project. The implementation plan
> (`docs/superpowers/plans/2026-09-15-info-pages-migration.md`) targets the
> remaining **6 pages** (about, faq, history, contact, gallery, reservation)
> plus the 404/not-found boundary. The plan also restructures the header nav
> per the user's request: About/Gallery/Reservation/Contact are top-level
> items; only History/FAQ/404 remain in the "Pages" dropdown. Everything below
> this note describes the original 10-page/unchanged-nav design — the plan is
> the authoritative, current scope.

## Context

The home page (`/ka`, `/en`) is live in `foodies-nextjs/`, built from the
original `index.html`. 22 other static pages from the original template
still only exist as static HTML at the `foodies_site/` repo root (the
parent of this repo) and are not reachable from the deployed Next.js app —
every nav link to them (`/about`, `/faq`, etc., already wired in
`Header.tsx`) currently 404s.

This spec covers the first follow-up slice: **10 "info/company" pages**,
chosen as the lowest-complexity, highest-count group to migrate first.
Blog (3 pages), Shop (8 pages, most complex — cart/wishlist/checkout
state), and the standalone Menu page are separate, later specs.

Pages in scope (source file → route slug, matching `Header.tsx`'s
existing `Link href`s):

| Source | Route |
|---|---|
| `about.html` | `/about` |
| `faq.html` | `/faq` |
| `history.html` | `/history` |
| `contact.html` | `/contact` |
| `team.html` | `/team` |
| `team-details.html` | `/team-details` |
| `testimonial.html` | `/testimonial` |
| `gallery.html` | `/gallery` |
| `reservation.html` | `/reservation` |
| `404.html` | not-found boundary (see below) |

## Goals

- Every route above renders in Next.js, visually identical to its source
  HTML file, in both `ka` (default) and `en`.
- Reuse everything already built (Header, Footer's asset-loading layout,
  i18n plumbing, and — where content actually matches — home-page
  section components) rather than re-porting duplicate markup.
- Keep the same manual-verification bar as the home page: no automated
  test framework, `npm run dev` + visual comparison against the original
  HTML file is the pass/fail gate per page.

## Non-goals

- Blog pages, Shop pages, Menu page (separate specs).
- Wiring real form submission for `contact.html`'s contact form or
  `reservation.html`'s booking form — both port as visual-only
  (`action="#"`), matching the home page's existing Contact/newsletter
  forms. Real backend wiring is a future, separately-scoped project.
- Replacing the logo, further rebranding, or any other cross-cutting
  change not specific to these 10 pages.

## Key finding: the header and footer differ from the home page

Verified directly against source (not assumed): the home page's
`Header.tsx` deliberately excludes an 8-tile "mega menu" dropdown under
the Home nav item, because `index.html` itself doesn't have it (this was
a deliberate correction made during the home-page migration). But **all
22 other pages do have it** — confirmed byte-identical (aside from the
breadcrumb title) between `about.html` and `faq.html`'s header blocks
(lines 1–464 in both).

Separately, every one of these 10 pages shares a completely different
footer from the home page's `Footer.tsx`: an Instagram feed strip, a CTA
banner, and a `footer-section-4` footer (vs. home's `footer-section`) —
verified byte-identical across `about.html`, `faq.html`, `reservation.html`,
`gallery.html`, and `team-details.html` (the whole block from
`instagram-section` to end-of-file diffs at 0 lines between all of them).
The home page has none of these three sections at all.

**Design decision:** `Header.tsx` gets a new `showMegaMenu?: boolean`
prop (default `false`, so the home page's call site needs no change).
Three new shared components — `InnerFooter.tsx`, `Cta.tsx`,
`Instagram.tsx` — live under `components/inner/` and are used by all 10
pages here (and, later, by the Blog/Shop/Menu pages too, since those are
also part of the "22 other pages" family).

## Architecture

- New route per page: `app/[locale]/<slug>/page.tsx` (e.g.
  `app/[locale]/about/page.tsx`), following the same
  `setRequestLocale(locale)` pattern already established in the home
  page's `page.tsx`.
- New shared components (`components/shared/`):
  - `Breadcrumb.tsx` — props `{title: string; currentLabel: string}`,
    renders the `breadcrumb-wrapper` block (verified byte-identical
    structure across all 10 pages, differing only in the title text and
    trail label — "Home Page" link + current page name).
- New shared components (`components/inner/`), used by all 10 pages:
  - `InnerFooter.tsx` (the `footer-section-4` footer)
  - `Cta.tsx` (the `cta-section-4` call-to-action banner)
  - `Instagram.tsx` (the `instagram-section` feed strip)
- `Header.tsx` modified: add `showMegaMenu` prop, gate the existing
  mega-menu `<li>` block on it. Every one of these 10 pages renders
  `<Header showMegaMenu />`.
- Per-page component folders (`components/<page>/`) for content unique
  to that page — see breakdown below.
- `app/[locale]/not-found.tsx` — built from `404.html`'s `error-section`.
  Because no literal `/404` page route is created, this single component
  serves both purposes discussed and agreed: Next.js renders it
  automatically for any unmatched route, **and** it's what the nav's
  existing "Error 404" link (`href="/404"`) hits, since nothing shadows
  it. No separate page component needed.

## Per-page component breakdown

Verified against actual page source (line-numbered sections, in document
order). Reuse/recovery notes are load-bearing — implementers must
byte-diff-verify each claim against current source before treating it as
confirmed, same discipline the home-page plan's pre-flight scan used.

**`about.html`** (by far the largest of the 10 — 8 unique sections):
`why-choose-us-section-4`, `discount-food-section` **(recoverable: this
is the same content previously built as `DiscountFood.tsx` for the home
page, then removed when the home page was trimmed to match `index.html`
exactly — recover its last version from git history at
`foodies_site` commit `fca4cfc^:foodies-nextjs/components/home/DiscountFood.tsx`
rather than re-porting from scratch, then move/adapt it to
`components/about/`)**, `food-menu-section-3` (new — a differently
laid-out tabbed menu, not the same component as home's `FoodMenu.tsx`),
`gallery-section` (new), `best-delivery-section` **(confirmed reuse:
byte-identical content to the home page's, verified by whitespace-
normalized diff — reuse `BestDelivery.tsx` directly, no new component)**,
`discount-banner-section-4` (new), `testimonial-section-3` (new — note:
`testimonial.html` also has a `testimonial-section-3`; verify whether
these two are the same shared component or coincidentally-named
different content before building both), `news-section-two` (new —
different from home's `News.tsx`, verify before assuming reuse).

**`faq.html`**: `faq-section` (new — accordion-style FAQ list).

**`history.html`**: `history-top-section` (new).

**`contact.html`**: `contact-flag-section-in`, `contact-map-section-in`
(both new — note this is a distinct page from the home page's `Contact`
*section component*; this page's content and the home section's content
are different, hence the separate `contactPage` message namespace below).

**`team.html`**: `team-section-two` (new — chef/team grid).

**`team-details.html`**: `team-details-section` (new — appears to be a
single static detail page, not parameterized per team member; confirm
during implementation whether the source has any per-chef dynamic data
or is a fixed demo page, and match that exactly rather than inventing
dynamic routing that doesn't exist in the source).

**`testimonial.html`**: `testimonial-section`, `testimonial-section-3`
(see about.html cross-check above), `testimonial-section-two` — three
distinct testimonial layouts on one page, each its own component unless
verification shows otherwise.

**`gallery.html`**: `gallery-section-5` (new — note the class differs
from about.html's `gallery-section`; these are not the same component).

**`reservation.html`**: `feature-section`, `comboo-offer-section-two`,
`brand-section-inner` (all new; `comboo-offer-section-two` is a
different class from the home page's `comboo-banner-section` —
`ComboBanner.tsx` — treat as different content, verify before assuming
reuse).

**`404.html`**: `error-section` (new — feeds `not-found.tsx`).

## Content & translation

New top-level message namespaces, one per page, plus shared ones:

- `breadcrumb` — shared trail label ("Home Page").
- `about`, `faq`, `history`, `contactPage` (not `contact` — that name is
  already used by the home page's Contact *section*, with different
  fields; reusing it would collide), `teamPage` (not `team` — avoids
  future collision if a `team` section namespace is ever needed
  elsewhere), `teamDetails`, `testimonial`, `gallery`, `reservation`,
  `notFound`.
- `innerFooter`, `cta`, `instagram` — for the three new shared
  components.
- `discountFood` namespace: recovered alongside the component (see
  above) rather than re-authored, if the recovered git-history version
  already has it in a usable shape — verify at implementation time.

Same rules as the home page: every string through `useTranslations()`,
no hardcoded copy, informational images get real translated `alt`
(logos, chef photos, gallery photos actually depicting content),
decorative images (shapes, background textures, bullet icons) get
`alt=""` — per the ruling already established during the home-page
migration.

## Images

Plain `<img>` tags, no `next/image` — same reasoning as the home page
(CSS-driven sizing/positioning the template already handles).

## Testing / verification

Same bar as the home page: `npm run dev`, compare each new route in both
locales against its source HTML file opened directly. No automated test
suite. Additionally for this slice: confirm `not-found.tsx` triggers both
by visiting a genuinely broken URL (e.g. `/ka/does-not-exist`) and by
clicking the header's "Error 404" nav link, and confirm both render the
same design.

## Open questions / assumptions

- `team-details.html` is assumed to be a single static page (not
  per-chef dynamic) based on the "demo page" pattern seen elsewhere in
  this template (the header's home mega-menu tiles all point to `/` for
  the same reason) — confirm against actual source before building.
- The `testimonial-section-3` / `best-delivery-section` cross-page reuse
  candidates flagged above are diff-verified for `best-delivery-section`
  only; `testimonial-section-3` needs the same verification before the
  plan commits to either reusing or duplicating it.
- This spec's docs live in `foodies-nextjs/docs/superpowers/` (this
  repo), not the parent `foodies_site/docs/superpowers/` where the
  home-page spec lives — `foodies-nextjs` is now a standalone repo (git
  history split off after the home-page migration merged), and is where
  all further work happens going forward.
