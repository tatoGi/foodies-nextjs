# BiteClub Info Pages → Next.js Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port 6 static HTML pages (about, faq, history, contact, gallery, reservation) plus a 404/not-found boundary into the Next.js app at `foodies-nextjs/`, bilingual (ka/en), reusing the home page's established patterns. `team.html`, `team-details.html`, and `testimonial.html` were in the original spec's 10-page group but are explicitly out of scope — the user reviewed the curated list and rejected them as not relevant to the real BiteClub project (fake demo team roster and testimonials, not real content).

**Architecture:** One route per page under `app/[locale]/<slug>/page.tsx`. Four new shared components (`Breadcrumb`, `InnerFooter`, `Cta`, `Instagram`) used by all 10 pages, plus a `Header` prop change (`showMegaMenu`) since these pages' header differs from the home page's. Per-page components live under `components/<page>/`. Two components are reused/recovered rather than rebuilt: `BestDelivery` (byte-identical to the home page's) and `DiscountFood` (recovered from git history — it was built for the home page, then removed when the home page was trimmed to match `index.html` exactly; its real home is `about.html`).

**Tech Stack:** Same as the home page — Next.js 16 App Router, TypeScript, next-intl, existing jQuery/Swiper/GSAP/WOW.js assets (unchanged).

**Spec:** `docs/superpowers/specs/2026-09-15-info-pages-migration-design.md`

## Global Constraints

- The static HTML source for every page in this plan lives at the **parent repo root**: `C:\Users\pc\Desktop\tato\foodies_site\<page>.html` (one level up from this `foodies-nextjs/` repo, e.g. `../about.html`). Read the exact line ranges cited in each task before writing code — do not guess or invent content.
- Locales: `ka` (default), `en`. All routes locale-prefixed via the existing `[locale]` segment and `next-intl` routing already configured — no i18n plumbing changes needed in this plan.
- JSX conversion rules (same as the home-page migration): `class`→`className`, self-closing void tags, `style="background-image:url(...)"` → `style={{backgroundImage: "url('...')"}}`, internal page links (`<a href="X.html">`) → `<Link href="/X">` from `@/i18n/navigation` (strip `.html`, keep leading slash — `index.html`→`/`), external/no-op links (`href="javascript:void(0)"`, `href="#"`, `tel:`, `mailto:`) stay plain `<a>`. No `next/image` — plain `<img src="/assets/...">`.
- Alt-text rubric (established during the home-page migration, applies here unchanged): informational images (photos that are the actual content — gallery photos, team photos, blog thumbnails, logos) get a real translated `alt`; decorative images (shapes, background textures, bullet/social icons) get `alt=""`.
- Every user-facing string goes through `useTranslations()` — no hardcoded copy. Namespace plan (all new, added to `foodies-nextjs/messages/en.json` and `foodies-nextjs/messages/ka.json`):
  - `breadcrumb` — shared trail label, used by all 10 pages' `Breadcrumb` instances.
  - `innerFooter`, `cta`, `instagram` — the three new shared components.
  - `notFound` — the 404 / not-found page.
  - `about` (nested: `about.whyChooseUs`, `about.foodMenu`, `about.gallery`, `about.discountBanner`, `about.news`), `discountFood` (top-level, recovered — see Task 6).
  - `faq`, `history`, `contactPage` (not `contact` — that name is already used by the home page's `Contact` section with different fields), `galleryPage`, `reservation`.
- Forms (`contact.html`, `reservation.html`) port as visual-only (`action="#"`), matching the home page's existing Contact/newsletter forms — no real submission wiring, per the approved spec.
- No automated test framework. `npm run dev` + visual comparison against the source HTML file (open directly, e.g. `file:///C:/Users/pc/Desktop/tato/foodies_site/about.html`) is each task's verification gate, same as every prior task in this project.
- Every task ends with: `./node_modules/.bin/tsc --noEmit`, `npm run build`, then commit.

---

## Task 1: Header mega-menu prop + shared page chrome + nav restructure

**Files:**
- Modify: `foodies-nextjs/components/home/Header.tsx`
- Modify: `foodies-nextjs/app/[locale]/layout.tsx`
- Modify: `foodies-nextjs/app/[locale]/page.tsx`
- Modify: `foodies-nextjs/messages/en.json`, `foodies-nextjs/messages/ka.json`

**Interfaces:**
- Produces: `Header` accepts an optional `showMegaMenu?: boolean` prop (default `false`). Every task in this plan that renders `<Header />` renders it as `<Header showMegaMenu />`.
- Produces: the preloader, back-to-top button, and mouse-cursor elements move from the home page's `page.tsx` into the shared `layout.tsx`, so every page gets them automatically — no page task in this plan needs to render them itself.
- Produces: the nav's top-level items now include `/about`, `/gallery`, `/reservation` (alongside the existing `/menu` and `/contact`); the "Pages" dropdown is trimmed to History/FAQ/404 only. `/team`, `/team-details`, `/testimonial` links are removed entirely (see Task 5 — those pages are out of scope).

**Context:** The home page's `Header.tsx` deliberately excludes an 8-tile "mega menu" dropdown under the nav's "Home" item, because `index.html` doesn't have it (a correction made during the home-page migration). But all 10 pages in this plan **do** have it — verified byte-identical (aside from the breadcrumb title) between `about.html` and `faq.html`'s header blocks. Rather than duplicating ~300 lines of otherwise-identical header markup into a second component, add a prop that conditionally renders the one differing block.

- [ ] **Step 1: Add the prop and conditional mega-menu block**

Edit `foodies-nextjs/components/home/Header.tsx`. Change the function signature:

```tsx
export default function Header({showMegaMenu = false}: {showMegaMenu?: boolean} = {}) {
```

Find the first `<li>` inside `<nav id="mobile-menu"><ul>` — it currently is:

```tsx
<li className="has-dropdown active d-xl-none">
  <a href="javascript:void(0)" className="border-none">{t('nav.home')}</a>
  <ul className="submenu">
    <li><Link href="/">{t('nav.homeDemos.fastFood')}</Link></li>
    ...
  </ul>
</li>
```

Insert the following **new** `<li>` immediately **before** it (still inside the same `<ul>`), wrapped in the prop check:

```tsx
{showMegaMenu && (
  <li className="has-dropdown active menu-thumb">
    <a href="javascript:void(0)">
      {t('nav.home')}
      <i className="fa-solid fa-chevron-down" />
    </a>
    <ul className="submenu has-homemenu">
      <li>
        <div className="homemenu-items">
          <div className="row row-cols-xl-4 row-cols-md-2 row-cols-2">
            {[
              {img: 'home-1.jpg', label: t('nav.homeDemos.fastFood')},
              {img: 'home-2.jpg', label: t('nav.homeDemos.pizzaRestaurant')},
              {img: 'home-3.jpg', label: t('nav.homeDemos.foodDelivery')},
              {img: 'home-4.jpg', label: t('nav.homeDemos.burgerRestaurant')},
              {img: 'home-5.jpg', label: t('nav.homeDemos.iceCreamShop')},
              {img: 'home-6.jpg', label: t('nav.homeDemos.iceCreamStore')},
              {img: 'home-7.jpg', label: t('nav.homeDemos.restaurant')},
              {img: 'home-8.jpg', label: t('nav.homeDemos.coffeeAndTea')}
            ].map((demo) => (
              <div className="col homemenu" key={demo.img}>
                <div className="homemenu-thumb mb-15">
                  <img src={`/assets/img/header/${demo.img}`} alt={demo.label} />
                  <div className="demo-button">
                    <Link href="/" className="theme-btn">
                      {t('nav.homeDemos.viewPage')}
                      <i className="fa-solid fa-arrow-up-right" />
                    </Link>
                  </div>
                </div>
                <div className="homemenu-content text-center">
                  <Link href="/" className="homemenu-title">{demo.label}</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </li>
    </ul>
  </li>
)}
```

Note: the tile links point to `/` (not to `/about`, `/faq`, etc.) — these tiles represent *other home-page template variants* (out of scope for this project), not the current page. This is unchanged from how the home page's now-removed version had them.

- [ ] **Step 2: Move the preloader/back-to-top/cursor/page-wrapper into the shared layout**

Every one of the 10 static source pages (not just `index.html`) independently includes the same preloader, back-to-top button, and mouse-cursor markup (verified in `../about.html` lines 37–48, identical to `../index.html`). Currently only the home page's `page.tsx` renders these, inside its own `page-wrapper` div — every new page this plan adds would need them too. Rather than duplicating this in 10 more files, move it into the shared layout, which already wraps every page.

Edit `foodies-nextjs/app/[locale]/layout.tsx` — replace:

```tsx
<NextIntlClientProvider>
  {children}
</NextIntlClientProvider>
```

with:

```tsx
<NextIntlClientProvider>
  <div className="page-wrapper">
    <div className="preloader">
      <div className="loader" />
    </div>

    <button id="back-top" className="back-to-top">
      <i className="fa-regular fa-arrow-up" />
    </button>

    <div className="mouseCursor cursor-outer" />
    <div className="mouseCursor cursor-inner" />

    {children}
  </div>
</NextIntlClientProvider>
```

Then edit `foodies-nextjs/app/[locale]/page.tsx` (the home page) — remove the now-redundant outer `page-wrapper` div and the preloader/back-top/cursor elements it contained, since `layout.tsx` now provides them. Its `return` becomes:

```tsx
return (
  <>
    <Header />

    <div id="smooth-wrapper">
      <div id="smooth-content">
        <Hero />
        <ShopCategory />
        <FoodMenu />
        <ComboBanner />
        <BestDelivery />
        <Contact />
        <News />
        <Footer />
      </div>
    </div>
  </>
);
```

**Every later task in this plan** (Task 4's `not-found.tsx`, and every page task from Task 8 onward) follows this same shape: a top-level fragment (`<>...</>`) containing `<Header .../>` then `<div id="smooth-wrapper"><div id="smooth-content">...</div></div>` — **never** its own `page-wrapper`/preloader/back-top/cursor, since `layout.tsx` now provides those once for every route. Where this plan's later task examples still show `<div className="page-wrapper">` wrapping their content, treat that as an error to correct, not as instruction — use the fragment shape above instead.

- [ ] **Step 3: Restructure the nav — promote curated pages, trim the "Pages" dropdown**

The user reviewed the full 10-page candidate list and curated it down to 6 real pages (about, faq, history, contact, gallery, reservation — team/team-details/testimonial are explicitly out of scope, not fake demo content on the real site) — see this plan's Goal section. They also asked for the header's generic "Pages" dropdown (a leftover grouping from the vendor template) to have "a real shape" instead of dumping every inner page into one dropdown: **About, Gallery, Reservation, and Contact become top-level nav items** (alongside the existing `Menu`); **History and FAQ stay in the trimmed "Pages" dropdown**, alongside the "Error 404" link every page needs.

In `foodies-nextjs/components/home/Header.tsx`, find the nav `<ul>` inside `<nav id="mobile-menu">` (this single list drives both the desktop nav and — via meanmenu's clone — the mobile offcanvas menu, so one edit covers both). Replace this block:

```tsx
<li className="has-dropdown">
  <a href="javascript:void(0)">
    {t('nav.pages')}
    <i className="fa-solid fa-chevron-down" />
  </a>
  <ul className="submenu">
    <li className="has-dropdown">
      <a href="javascript:void(0)">
        {t('nav.ourChefs')}
        <i className="fas fa-angle-right" />
      </a>
      <ul className="submenu">
        <li><Link href="/team">{t('nav.ourChefs')}</Link></li>
        <li><Link href="/team-details">{t('nav.chefsDetails')}</Link></li>
      </ul>
    </li>
    <li><Link href="/history">{t('nav.ourHistory')}</Link></li>
    <li><Link href="/reservation">{t('nav.reservation')}</Link></li>
    <li><Link href="/testimonial">{t('nav.testimonial')}</Link></li>
    <li><Link href="/gallery">{t('nav.ourGallery')}</Link></li>
    <li><Link href="/faq">{t('nav.faqPage')}</Link></li>
    <li><Link href="/404">{t('nav.error404')}</Link></li>
  </ul>
</li>
<li><Link href="/about">{t('nav.about')}</Link></li>
```

with:

```tsx
<li><Link href="/about">{t('nav.about')}</Link></li>
<li><Link href="/gallery">{t('nav.ourGallery')}</Link></li>
<li><Link href="/reservation">{t('nav.reservation')}</Link></li>
<li className="has-dropdown">
  <a href="javascript:void(0)">
    {t('nav.pages')}
    <i className="fa-solid fa-chevron-down" />
  </a>
  <ul className="submenu">
    <li><Link href="/history">{t('nav.ourHistory')}</Link></li>
    <li><Link href="/faq">{t('nav.faqPage')}</Link></li>
    <li><Link href="/404">{t('nav.error404')}</Link></li>
  </ul>
</li>
```

(`Contact` is untouched — it's already its own top-level `<li>` later in the same list, at `<li><Link href="/contact">{t('nav.contact')}</Link></li>`.)

Then remove the 3 now-orphaned translation keys — `header.nav.ourChefs`, `header.nav.chefsDetails`, `header.nav.testimonial` — from both `foodies-nextjs/messages/en.json` and `foodies-nextjs/messages/ka.json` (they're nested under `header.nav`, alongside `header.nav.pages`, `header.nav.ourHistory`, etc.). Confirm no other file references them (`grep -rn "ourChefs\|chefsDetails\|nav.testimonial" foodies-nextjs/components foodies-nextjs/app` should return nothing) before deleting.

- [ ] **Step 4: Verify**

`npm run dev`, open `/ka`: confirm the home page renders exactly as before this task — preloader flashes briefly then disappears, back-to-top button and custom cursor still work, header still has no mega-menu (since `page.tsx` still calls `<Header />` with no prop). Confirm the nav now shows About, Gallery, Reservation as top-level items and the "Pages" dropdown only contains History/FAQ Page/Error 404 (Gallery and Reservation routes don't exist until Tasks 15–16, so their links 404 via `not-found.tsx` for now — that's expected at this point in the plan). Confirm `tsc --noEmit` and `npm run build` pass.

- [ ] **Step 5: Commit**

```bash
git add components/home/Header.tsx app/[locale]/layout.tsx app/[locale]/page.tsx messages/en.json messages/ka.json
git commit -m "$(cat <<'EOF'
Add showMegaMenu prop to Header; move preloader/back-to-top/cursor into shared layout; restructure nav for the curated 6-page set

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Shared Breadcrumb component

**Files:**
- Create: `foodies-nextjs/components/shared/Breadcrumb.tsx`
- Modify: `foodies-nextjs/messages/en.json`, `foodies-nextjs/messages/ka.json`

**Interfaces:**
- Produces: `export default function Breadcrumb({title, currentLabel}: {title: string; currentLabel: string})`. Every page task in this plan renders `<Breadcrumb title={t('title')} currentLabel={t('title')} />` (or similar — the exact translation key varies per page, documented in each task) as the first thing after `<Header showMegaMenu />`.

**Reference source:** `../about.html` lines 469–497 (the `breadcrumb-wrapper` block, identical in shape across all 10 pages — verified byte-identical structure, differing only in the `<h1>` title text and the trail's current-page label).

- [ ] **Step 1: Add the `breadcrumb` namespace**

Add to `foodies-nextjs/messages/en.json` (top level, alongside `common`, `header`, etc.):

```json
"breadcrumb": {
  "homeLabel": "Home Page"
},
```

Add to `foodies-nextjs/messages/ka.json`:

```json
"breadcrumb": {
  "homeLabel": "მთავარი გვერდი"
},
```

- [ ] **Step 2: Build the component**

Create `foodies-nextjs/components/shared/Breadcrumb.tsx`:

```tsx
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';

export default function Breadcrumb({title, currentLabel}: {title: string; currentLabel: string}) {
  const t = useTranslations('breadcrumb');

  return (
    <div className="breadcrumb-wrapper hero-ptb image-distortion p-relative z-index-1" data-background="/assets/img/breadcrumb-bg.jpg">
      <div className="shape-1 d-none d-xl-block">
        <img src="/assets/img/shape-1.png" alt="" />
      </div>
      <div className="girl-shape d-none d-xl-block">
        <img src="/assets/img/girl-image.png" alt="" />
      </div>
      <div className="bottom-shape">
        <img src="/assets/img/bottom-shape.png" alt="" />
      </div>
      <div className="container">
        <div className="page-heading">
          <div className="breadcrumb-sub-title">
            <h1 className="breadcrumb-title text-white split-title">{title}</h1>
          </div>
          <ul className="breadcrumb-items wow fadeInUp" data-wow-delay=".5s">
            <li>
              <Link href="/">{t('homeLabel')}</Link>
            </li>
            <li>
              <i className="fa-regular fa-chevrons-right" />
            </li>
            <li>{currentLabel}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
```

Note: `data-background="..."` is a `main.js`/WOW.js convention used elsewhere in this codebase for lazy-loaded background images (grep `data-background` in `public/assets/js/main.js` if you need to confirm the attribute is actually read by existing JS before relying on it — if it turns out unused by any script, it's still harmless to keep since it mirrors the source exactly).

- [ ] **Step 3: Verify**

`tsc --noEmit` passes. This component isn't rendered anywhere yet — full visual verification happens once a page task uses it (Task 7 onward).

- [ ] **Step 4: Commit**

```bash
git add components/shared/Breadcrumb.tsx messages/en.json messages/ka.json
git commit -m "$(cat <<'EOF'
Add shared Breadcrumb component for info pages

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Shared InnerFooter, Cta, and Instagram components

**Files:**
- Create: `foodies-nextjs/components/inner/InnerFooter.tsx`
- Create: `foodies-nextjs/components/inner/Cta.tsx`
- Create: `foodies-nextjs/components/inner/Instagram.tsx`
- Modify: `foodies-nextjs/messages/en.json`, `foodies-nextjs/messages/ka.json`

**Interfaces:**
- Produces: `export default function InnerFooter()`, `export default function Cta()`, `export default function Instagram()` — no props on any of the three. Every page task in this plan renders them in this exact order as the last three elements on the page: `<Instagram />`, `<Cta />`, `<InnerFooter />`.

**Reference source:** `../about.html` lines 1315–1783 (`instagram-section` through end of `</footer>`) — verified byte-identical across `about.html`, `faq.html`, `reservation.html`, `gallery.html`, and `team-details.html`.

- [ ] **Step 1: Add the three namespaces**

Add to `foodies-nextjs/messages/en.json`:

```json
"instagram": {
  "imageAlt": "BiteClub Instagram photo {n}"
},
"cta": {
  "subTitle": "Our Newsletter",
  "title": "Get",
  "titleAccent": "10% off",
  "titleEnd": "Your order!",
  "description": "Enter your email and receive a 10% discount on your next order!",
  "emailPlaceholder": "Enter your email",
  "subscribe": "Subscribe"
},
"innerFooter": {
  "openingHoursTitle": "Opening Hours",
  "hoursLabel": "Hours:",
  "hours": "9.30am – 6.30pm",
  "hoursDays": "Monday to Friday",
  "sundayLabel": "Sunday:",
  "sundayValue": "Closed",
  "informationTitle": "Information",
  "privacyPolicy": "Privacy Policy",
  "refundPolicy": "Refund Policy",
  "shippingReturn": "Shipping & Return",
  "termsOfUse": "Terms of use",
  "discountOffer": "Discount Offer",
  "bestSeller": "Best Seller",
  "logoAlt": "BiteClub logo",
  "aboutText": "We believe it has the power to do amazing things.",
  "phone": "+1 718-904 4450",
  "email": "yordomain@gmial.com",
  "address": "4517 Washington Ave. Manchester, Kentucky 39495",
  "productsTitle": "Our Products",
  "products": ["BBQ Pizza TinTin", "Burger Kingo", "Chicken Sandwich", "Chocolate Donuts", "BBQ Pizza TinTin", "French Fries"],
  "quickLinksTitle": "Quick Links",
  "aboutUs": "About Us",
  "ourMenu": "Our Menu",
  "contactUs": "Contact Us",
  "faq": "FAQ's",
  "copyright": "Copyright © 2026 All Rights Reserved."
},
```

Add to `foodies-nextjs/messages/ka.json`:

```json
"instagram": {
  "imageAlt": "BiteClub-ის Instagram ფოტო {n}"
},
"cta": {
  "subTitle": "ჩვენი სიახლეები",
  "title": "მიიღეთ",
  "titleAccent": "10% ფასდაკლება",
  "titleEnd": "თქვენს შეკვეთაზე!",
  "description": "შეიყვანეთ თქვენი ელფოსტა და მიიღეთ 10% ფასდაკლება შემდეგ შეკვეთაზე!",
  "emailPlaceholder": "შეიყვანეთ ელფოსტა",
  "subscribe": "გამოწერა"
},
"innerFooter": {
  "openingHoursTitle": "სამუშაო საათები",
  "hoursLabel": "საათები:",
  "hours": "9:30 - 18:30",
  "hoursDays": "ორშაბათი-პარასკევი",
  "sundayLabel": "კვირა:",
  "sundayValue": "დახურულია",
  "informationTitle": "ინფორმაცია",
  "privacyPolicy": "კონფიდენციალურობის პოლიტიკა",
  "refundPolicy": "დაბრუნების პოლიტიკა",
  "shippingReturn": "მიწოდება და დაბრუნება",
  "termsOfUse": "მოხმარების პირობები",
  "discountOffer": "ფასდაკლების შეთავაზება",
  "bestSeller": "პოპულარული",
  "logoAlt": "BiteClub-ის ლოგო",
  "aboutText": "გვჯერა, რომ ამას შეუძლია საოცარი საქმეების გაკეთება.",
  "phone": "+1 718-904 4450",
  "email": "yordomain@gmial.com",
  "address": "4517 Washington Ave. Manchester, Kentucky 39495",
  "productsTitle": "ჩვენი პროდუქტები",
  "products": ["BBQ პიცა თინთინი", "ბურგერ კინგო", "ქათმის სენდვიჩი", "შოკოლადის დონატები", "BBQ პიცა თინთინი", "კარტოფილი ფრი"],
  "quickLinksTitle": "სწრაფი ბმულები",
  "aboutUs": "ჩვენს შესახებ",
  "ourMenu": "ჩვენი მენიუ",
  "contactUs": "დაგვიკავშირდით",
  "faq": "ხშირად დასმული კითხვები",
  "copyright": "საავტორო უფლებები © 2026. დაცულია ყველა უფლება."
},
```

- [ ] **Step 2: Build Instagram**

Create `foodies-nextjs/components/inner/Instagram.tsx`. The source repeats the same 9 images 3 times (for a seamless CSS marquee loop) — generate the 3 groups from one array instead of hand-duplicating:

```tsx
import {useTranslations} from 'next-intl';

const IMAGES = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const GROUPS = [0, 1, 2];

export default function Instagram() {
  const t = useTranslations('instagram');

  return (
    <div className="instagram-section fix pb-3">
      <div className="marquee">
        {GROUPS.map((group) => (
          <div className="marquee-group" key={group}>
            {IMAGES.map((n) => (
              <div className="instagram-image" key={`${group}-${n}`}>
                <img src={`/assets/img/home-2/instagram-image-${n}.jpg`} alt={t('imageAlt', {n})} className="hover-img" />
                <img src={`/assets/img/home-2/instagram-image-${n}.jpg`} alt={t('imageAlt', {n})} className="hover-img" />
                <a href="#" className="icon">
                  <img src="/assets/img/home-2/instagram.png" alt="" />
                </a>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Build Cta**

Create `foodies-nextjs/components/inner/Cta.tsx`:

```tsx
import {useTranslations} from 'next-intl';

export default function Cta() {
  const t = useTranslations('cta');

  return (
    <section className="cta-section-4 section-padding pb-0 bg-white">
      <div className="shape-1 d-none d-xl-block">
        <img src="/assets/img/home-2/footer-shape1.png" alt="" />
      </div>
      <div className="shape-2 d-none d-xl-block">
        <img src="/assets/img/home-2/footer-shape3.png" alt="" />
      </div>
      <div className="shape-3 d-none d-xl-block float-bob-y">
        <img src="/assets/img/home-2/footer-shape2.png" alt="" />
      </div>
      <div className="container">
        <div className="row g-6">
          <div className="cta-from-content">
            <div className="section-title text-center mb-0">
              <span className="sub-title tz-sub-tilte tz-sub-anim tx-subTitle">{t('subTitle')}</span>
              <h2 className="tx-title sec_title tz-itm-title tz-itm-anim">
                {t('title')} <span>{t('titleAccent')}</span> {t('titleEnd')}
              </h2>
              <div className="sec-line mt-3 mb-4">
                <img src="/assets/img/home-1/sec-line.png" alt="" />
              </div>
              <p className="wow fadeInUp" data-wow-delay=".3s">{t('description')}</p>
            </div>
            <div className="content wow fadeInUp" data-wow-delay=".5s">
              <form action="#">
                <input type="text" placeholder={t('emailPlaceholder')} />
                <button className="email-btn" type="submit">{t('subscribe')}</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Build InnerFooter**

Create `foodies-nextjs/components/inner/InnerFooter.tsx`:

```tsx
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';

export default function InnerFooter() {
  const t = useTranslations('innerFooter');
  const products = t.raw('products') as string[];

  return (
    <>
      <footer className="footer-section-4 fix pb-0 bg-white footer-fix-padding-7">
        <div className="container">
          <div className="footer-widget-wrapper style-widget-wrapper-4">
            <div className="row">
              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-4 col-sm-6 wow fadeInUp">
                <div className="footer-widget-items">
                  <div className="widget-head">
                    <span className="widget-title">{t('openingHoursTitle')}</span>
                    <div className="dashed" />
                  </div>
                  <ul className="opening-hours-list">
                    <li><span>{t('hoursLabel')}</span> {t('hours')}</li>
                    <li>{t('hoursDays')}</li>
                    <li className="style-4"><span>{t('sundayLabel')}</span> {t('sundayValue')}</li>
                  </ul>
                  <div className="social-icon d-flex align-items-center">
                    <a href="javascript:void(0)"><i className="fab fa-facebook-f" /></a>
                    <a href="javascript:void(0)"><i className="fab fa-twitter" /></a>
                    <a href="javascript:void(0)"><i className="fa-regular fa-basketball" /></a>
                    <a href="javascript:void(0)"><i className="fa-brands fa-instagram" /></a>
                  </div>
                </div>
              </div>
              <div className="col-xxl-2 col-xl-3 col-lg-2 col-md-3 col-sm-6 wow fadeInUp" data-wow-delay=".2s">
                <div className="footer-widget-items">
                  <div className="widget-head">
                    <span className="widget-title">{t('informationTitle')}</span>
                    <div className="dashed" />
                  </div>
                  <ul className="list-items">
                    <li><Link href="/contact">{t('privacyPolicy')}</Link></li>
                    <li><Link href="/contact">{t('refundPolicy')}</Link></li>
                    <li><Link href="/contact">{t('shippingReturn')}</Link></li>
                    <li><Link href="/contact">{t('termsOfUse')}</Link></li>
                    <li><Link href="/contact">{t('discountOffer')}</Link></li>
                    <li><Link href="/contact">{t('bestSeller')}</Link></li>
                  </ul>
                </div>
              </div>
              <div className="col-xxl-3 col-xl-3 col-lg-4 col-md-5 col-sm-6 wow fadeInUp" data-wow-delay=".4s">
                <div className="footer-widget-items">
                  <div className="footer-content">
                    <div className="footer-logo">
                      <Link href="/">
                        <img src="/assets/img/home-4/footer-logo.png" alt={t('logoAlt')} />
                      </Link>
                    </div>
                    <p className="text">{t('aboutText')}</p>
                    <h2><a href="tel:+17189044450">{t('phone')}</a></h2>
                    <div className="contact-items">
                      <a href={`mailto:${t('email')}`}><i className="fa-regular fa-envelope" /> {t('email')}</a>
                    </div>
                    <div className="contact-items">
                      <p><i className="fa-solid fa-magnifying-glass" /> {t('address')}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xxl-2 col-xl-3 col-lg-3 ps-xl-5 col-md-6 col-sm-6 col-6 wow fadeInUp" data-wow-delay=".6s">
                <div className="footer-widget-items">
                  <div className="widget-head">
                    <span className="widget-title">{t('productsTitle')}</span>
                    <div className="dashed" />
                  </div>
                  <ul className="list-items">
                    {products.map((product, i) => (
                      <li key={`${product}-${i}`}>
                        <Link href="/shop"><i className="fa-solid fa-chevron-right" /> {product}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="col-xxl-2 col-xl-3 col-lg-4 ps-xxl-5 col-md-6 col-sm-6 col-6 wow fadeInUp" data-wow-delay=".8s">
                <div className="footer-widget-items">
                  <div className="widget-head">
                    <span className="widget-title">{t('quickLinksTitle')}</span>
                    <div className="dashed" />
                  </div>
                  <ul className="list-items">
                    <li><Link href="/about">{t('aboutUs')}</Link></li>
                    <li><Link href="/shop">{t('ourMenu')}</Link></li>
                    <li><Link href="/contact">{t('contactUs')}</Link></li>
                    <li><Link href="/contact">{t('privacyPolicy')}</Link></li>
                    <li><Link href="/faq">{t('faq')}</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom style-3">
          <div className="container">
            <div className="footer-bottom-wrapper">
              <p>{t('copyright')}</p>
              <div className="app-image">
                <img src="/assets/img/home-3/app.png" alt="" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
```

Note: the "Our Products" links all point to `/shop` and the "Information" column's links all point to `/contact` in the source (`shop.html`/`contact.html` repeated for every item) — this is the original template's own behavior (those pages/anchors don't exist separately), not a porting error. Keep it as-is.

- [ ] **Step 5: Verify**

`tsc --noEmit` passes. Not rendered anywhere yet.

- [ ] **Step 6: Commit**

```bash
git add components/inner/ messages/en.json messages/ka.json
git commit -m "$(cat <<'EOF'
Add shared InnerFooter, Cta, and Instagram components for info pages

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: not-found.tsx (404 page)

**Files:**
- Create: `foodies-nextjs/app/[locale]/not-found.tsx`
- Modify: `foodies-nextjs/messages/en.json`, `foodies-nextjs/messages/ka.json`

**Interfaces:**
- Consumes: `Header` (Task 1, `showMegaMenu`), `Breadcrumb` (Task 2), `Instagram`/`Cta`/`InnerFooter` (Task 3).
- Produces: the Next.js special `not-found.tsx` file — automatically rendered for any unmatched route under `[locale]`, and also what the header nav's "Error 404" link (`href="/404"`, already wired in `Header.tsx`) hits, since no literal `/404` page route exists to shadow it.

**Reference source:** `../404.html` lines 502–537 (`error-section`).

- [ ] **Step 1: Add the `notFound` namespace**

Add to `foodies-nextjs/messages/en.json`:

```json
"notFound": {
  "breadcrumbTitle": "Error 404",
  "title": "Page not found",
  "description": "The page you are looking for does not exist. It may have been moved, or removed altogether. Perhaps you can return back to the site's homepage and see if you can find what you are looking for.",
  "goHome": "Go to Homepage"
},
```

Add to `foodies-nextjs/messages/ka.json`:

```json
"notFound": {
  "breadcrumbTitle": "შეცდომა 404",
  "title": "გვერდი ვერ მოიძებნა",
  "description": "გვერდი, რომელსაც ეძებთ, არ არსებობს. შესაძლოა გადატანილი ან წაშლილი იყოს. სცადეთ დაბრუნება მთავარ გვერდზე.",
  "goHome": "მთავარ გვერდზე დაბრუნება"
},
```

- [ ] **Step 2: Build the component**

Create `foodies-nextjs/app/[locale]/not-found.tsx`:

```tsx
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import Header from '@/components/home/Header';
import Breadcrumb from '@/components/shared/Breadcrumb';
import Instagram from '@/components/inner/Instagram';
import Cta from '@/components/inner/Cta';
import InnerFooter from '@/components/inner/InnerFooter';

export default function NotFound() {
  const t = useTranslations('notFound');

  return (
    <>
      <Header showMegaMenu />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <Breadcrumb title={t('breadcrumbTitle')} currentLabel={t('breadcrumbTitle')} />
          <section className="error-section fix section-padding">
            <div className="shape-1 d-none d-xxl-block float-bob-y">
              <img src="/assets/img/inner/404-shape-1.png" alt="" />
            </div>
            <div className="shape-2 d-none d-xxl-block float-bob-x">
              <img src="/assets/img/inner/404-shape-2.png" alt="" />
            </div>
            <div className="shape-3 d-none d-xxl-block float-bob-y">
              <img src="/assets/img/inner/404-shape-3.png" alt="" />
            </div>
            <div className="shape-4 d-none d-xxl-block float-bob-y">
              <img src="/assets/img/inner/404-shape-4.png" alt="" />
            </div>
            <div className="shape-5 d-none d-xxl-block float-bob-x">
              <img src="/assets/img/inner/404-shape-5.png" alt="" />
            </div>
            <div className="container">
              <div className="error-items">
                <div className="thumb wow fadeInUp" data-wow-delay=".3s">
                  <img src="/assets/img/404.png" alt="" />
                </div>
                <div className="content">
                  <h2 className="hero_title wow fadeInUp" data-wow-delay=".2s">{t('title')}</h2>
                  <p className="wow fadeInUp" data-wow-delay=".4s">{t('description')}</p>
                  <Link href="/" className="theme-btn small-btn">
                    {t('goHome')} <i className="fa-solid fa-arrow-right" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
          <Instagram />
          <Cta />
          <InnerFooter />
        </div>
      </div>
    </>
  );
}
```

Note: `notFound.tsx` doesn't receive `params`/`locale` the way `page.tsx` does — `useTranslations`/`Link` still work because they read the active locale from the `NextIntlClientProvider`/routing context already set up in `layout.tsx`. If TypeScript or next-intl complains about missing locale context here, check `foodies-nextjs/app/[locale]/layout.tsx` for how `notFound()` (the function call, not this file) is already invoked there for invalid locales — this file is the render target for that path, not a new locale boundary.

- [ ] **Step 3: Verify**

`npm run dev`, visit a genuinely broken URL (e.g. `http://localhost:3000/ka/this-does-not-exist`) — confirm this page renders. Then click the header's "Error 404" nav link (under Pages) — confirm it renders the same page (via `/404`, which also has no real route). Check both `/ka` and `/en` produce correctly localized text. Confirm `tsc --noEmit` and `npm run build` pass.

- [ ] **Step 4: Commit**

```bash
git add app/[locale]/not-found.tsx messages/en.json messages/ka.json
git commit -m "$(cat <<'EOF'
Add not-found.tsx (serves both broken URLs and the header's Error 404 link)

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: REMOVED — out of scope

The user reviewed the curated page list and explicitly rejected `testimonial.html` as a standalone page ("we don't want this at all", alongside `team.html`/`team-details.html` — see Tasks 12–14, also removed). Since the only consumer of a shared `TestimonialSlider` would have been the About page's own `testimonial-section-3` content, and the user's rejection of testimonial content is treated as covering that embedded section too (not just the standalone page), this task and the About page's use of it are both dropped. Task 6/7/8 (About page) do not include a testimonial section. No files are created by this task; skip it.

---

## Task 6: About page — part 1 (WhyChooseUs, DiscountFood recovery, FoodMenu3)

**Files:**
- Create: `foodies-nextjs/components/about/WhyChooseUs.tsx`
- Create: `foodies-nextjs/components/about/DiscountFood.tsx` (recovered, not written from scratch)
- Create: `foodies-nextjs/components/about/FoodMenu3.tsx`
- Modify: `foodies-nextjs/messages/en.json`, `foodies-nextjs/messages/ka.json`

**Interfaces:**
- Produces: `export default function WhyChooseUs()`, `export default function DiscountFood()`, `export default function FoodMenu3()`. Consumed by Task 8's `app/[locale]/about/page.tsx`.

- [ ] **Step 1: Recover DiscountFood from git history**

This component was already built once (for the home page), then deleted when the home page was trimmed to match `index.html` exactly — its content actually belongs to `about.html` (`discount-food-section`, `../about.html` lines 577–655), not the home page. Recover it instead of re-porting from scratch:

```bash
cd "C:\Users\pc\Desktop\tato\foodies_site"
git show fca4cfc^:foodies-nextjs/components/home/DiscountFood.tsx > foodies-nextjs/components/about/DiscountFood.tsx
```

Open the recovered file and verify it compiles as-is (it uses `useTranslations('discountFood')` and `@/i18n/navigation`'s `Link` — both already valid from this location, no import path changes needed since imports use the `@/` alias). Compare its JSX against `../about.html` lines 577–655 to confirm it's still an accurate port (the source hasn't changed since it was built).

- [ ] **Step 2: Recover the `discountFood` namespace**

Add to `foodies-nextjs/messages/en.json` (top level):

```json
"discountFood": {
  "limitedTime": "*** FOR LIMITED TIME ONLY ***",
  "offer50": "50% Offer",
  "today": "Today's",
  "specialMenuTitle": "Special",
  "specialMenuAccent": "Food Menu",
  "thisWeekendOnly": "This Weekend Only",
  "only": "ONLY",
  "price19": "$19",
  "banner3Title": "Yummy",
  "banner3TitleLine2": "Delicious Hot",
  "banner3TitleLine3": "Pizza",
  "specialMenu": "Special Menu",
  "chesseyPizza": "Chessey Pizza",
  "chefSpecial": "CHEF SPECIAL"
},
```

Add to `foodies-nextjs/messages/ka.json`:

```json
"discountFood": {
  "limitedTime": "*** მხოლოდ შეზღუდული დროით ***",
  "offer50": "50%-იანი ფასდაკლება",
  "today": "დღეს",
  "specialMenuTitle": "სპეციალური",
  "specialMenuAccent": "კერძების მენიუ",
  "thisWeekendOnly": "მხოლოდ ამ შაბათ-კვირას",
  "only": "მხოლოდ",
  "price19": "$19",
  "banner3Title": "გემრიელი",
  "banner3TitleLine2": "ცხელი",
  "banner3TitleLine3": "პიცა",
  "specialMenu": "სპეციალური მენიუ",
  "chesseyPizza": "ყველიანი პიცა",
  "chefSpecial": "შეფის სპეციალური შეთავაზება"
},
```

- [ ] **Step 3: Build WhyChooseUs**

Read `../about.html` lines 502–577 (`why-choose-us-section-4`). Port it into `foodies-nextjs/components/about/WhyChooseUs.tsx` using the standard conversion rules. Extract every visible string (sub-title "Best Food Menu", title "We're Making the Best burger for You", the description paragraph, the two 3-item feature lists, the two CTA buttons "Order Now"/"Reserve Table") into a new `about.whyChooseUs` namespace in both message files — nest it under the top-level `about` key already reserved in Global Constraints:

```json
"about": {
  "whyChooseUs": {
    "subTitle": "...", "title": "...", "titleLine2": "...",
    "description": "...",
    "listOne": ["...", "...", "..."],
    "listTwo": ["...", "...", "..."],
    "orderNow": "Order Now", "reserveTable": "Reserve Table"
  }
}
```
(exact key names are your judgment — match the shape of what you actually read; the important part is real, non-invented copy for every string in the section, and both `.html` links in the source — `contact.html` — become `<Link href="/contact">`.)

- [ ] **Step 4: Build FoodMenu3**

Read `../about.html` lines 655–914 (`food-menu-section-3`). This is a 4-tab food menu (Beef Burger / Chicken Pizza / Fresh Pasta / Hot Sushi — note: 4 tabs here, not the home page's 5; don't add a "Drink & Juice" tab that doesn't exist in this source) with a Bootstrap tab-pane structure like the home page's `FoodMenu.tsx` (read that file for the established tab-pane JSX pattern — same `data-bs-toggle="tab"` mechanism — but this section's specific items, images (`home-3/` folder), and layout (`food-menu-image` + `food-menu-mid-item` two-column layout, not `FoodMenu.tsx`'s structure) are different; port what's actually in this source, don't reuse `FoodMenu.tsx`'s JSX shape wholesale). Extract all copy into `about.foodMenu` in both message files.

- [ ] **Step 5: Verify**

`tsc --noEmit` passes. Not yet rendered — verified visually in Task 8.

- [ ] **Step 6: Commit**

```bash
git add components/about/WhyChooseUs.tsx components/about/DiscountFood.tsx components/about/FoodMenu3.tsx messages/en.json messages/ka.json
git commit -m "$(cat <<'EOF'
Add About page part 1: WhyChooseUs, recovered DiscountFood, FoodMenu3

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: About page — part 2 (Gallery, DiscountBanner, News2)

**Files:**
- Create: `foodies-nextjs/components/about/Gallery.tsx`
- Create: `foodies-nextjs/components/about/DiscountBanner.tsx`
- Create: `foodies-nextjs/components/about/News2.tsx`
- Modify: `foodies-nextjs/messages/en.json`, `foodies-nextjs/messages/ka.json`

**Interfaces:**
- Produces: `export default function Gallery()`, `export default function DiscountBanner()`, `export default function News2()`. Consumed by Task 8's `app/[locale]/about/page.tsx`.

- [ ] **Step 1: Build Gallery**

Read `../about.html` lines 914–961 (`gallery-section`, a 3-image swiper slider with a "View Our Gallery" button linking to `gallery.html`). Port into `foodies-nextjs/components/about/Gallery.tsx`. The button becomes `<Link href="/gallery">`. Add copy to `about.gallery` in both message files. Note: this is `about.html`'s own small teaser gallery — distinct from `gallery.html`'s full page-length gallery (Task 15) which uses a different class (`gallery-section-5`) and different images; do not conflate the two.

- [ ] **Step 2: Build DiscountBanner**

Read `../about.html` lines 1016–1059 (`discount-banner-section-4`). Port into `foodies-nextjs/components/about/DiscountBanner.tsx`. The "Browse Offers" button's `href="shop.html"` becomes `<Link href="/shop">`. Add copy to `about.discountBanner` in both message files.

- [ ] **Step 3: Build News2**

Read `../about.html` lines 1210–1315 (`news-section-two`, a 3-card blog teaser grid — different from the home page's `News.tsx`, which uses `news-section`/different card markup and images from a different folder; this one uses `home-2/news-0N.jpg`). Port into `foodies-nextjs/components/about/News2.tsx`. Each card's title links to `news-details.html` → `<Link href="/news-details">`. Add copy (post dates, categories, titles, author names, comment counts) to `about.news` in both message files.

- [ ] **Step 4: Verify**

`tsc --noEmit` passes. Not yet rendered — verified visually in Task 8.

- [ ] **Step 5: Commit**

```bash
git add components/about/Gallery.tsx components/about/DiscountBanner.tsx components/about/News2.tsx messages/en.json messages/ka.json
git commit -m "$(cat <<'EOF'
Add About page part 2: Gallery, DiscountBanner, News2

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 8: About page assembly

**Files:**
- Create: `foodies-nextjs/app/[locale]/about/page.tsx`
- Modify: `foodies-nextjs/messages/en.json`, `foodies-nextjs/messages/ka.json`

**Interfaces:**
- Consumes: `Header` (Task 1), `Breadcrumb` (Task 2), `Instagram`/`Cta`/`InnerFooter` (Task 3), `WhyChooseUs`/`DiscountFood`/`FoodMenu3` (Task 6), `Gallery`/`DiscountBanner`/`News2` (Task 7), and `BestDelivery` from `@/components/home/BestDelivery` (reused directly — confirmed byte-identical content to the home page's version via whitespace-normalized diff against `../index.html`'s `best-delivery-section`, no new component needed). No testimonial section — dropped per Task 5.

- [ ] **Step 1: Add the page-title translation**

Add an `about.pageTitle` key (used for the breadcrumb) to both message files, e.g. `"About us"` / `"ჩვენს შესახებ"`.

- [ ] **Step 2: Build the page**

Create `foodies-nextjs/app/[locale]/about/page.tsx`, assembling sections in the exact order they appear in `../about.html`:

```tsx
import {useTranslations} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import Header from '@/components/home/Header';
import Breadcrumb from '@/components/shared/Breadcrumb';
import Instagram from '@/components/inner/Instagram';
import Cta from '@/components/inner/Cta';
import InnerFooter from '@/components/inner/InnerFooter';
import WhyChooseUs from '@/components/about/WhyChooseUs';
import DiscountFood from '@/components/about/DiscountFood';
import FoodMenu3 from '@/components/about/FoodMenu3';
import Gallery from '@/components/about/Gallery';
import BestDelivery from '@/components/home/BestDelivery';
import DiscountBanner from '@/components/about/DiscountBanner';
import News2 from '@/components/about/News2';

export default async function AboutPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = useTranslations('about');

  return (
    <>
      <Header showMegaMenu />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <Breadcrumb title={t('pageTitle')} currentLabel={t('pageTitle')} />
          <WhyChooseUs />
          <DiscountFood />
          <FoodMenu3 />
          <Gallery />
          <BestDelivery />
          <DiscountBanner />
          <News2 />
          <Instagram />
          <Cta />
          <InnerFooter />
        </div>
      </div>
    </>
  );
}
```

(This order matches the section survey minus the dropped testimonial-section-3 — see Task 5: why-choose-us-section-4 → discount-food-section → food-menu-section-3 → gallery-section → best-delivery-section → discount-banner-section-4 → news-section-two → instagram-section → cta-section-4 → footer-section-4. Calling `useTranslations` directly inside this async function body is safe and matches existing precedent — `components/home/Header.tsx` already does the same thing without a `'use client'` directive, confirmed in this codebase.)

- [ ] **Step 3: Verify**

`npm run dev`, compare `/ka/about` and `/en/about` against `../about.html` opened directly, section by section, top to bottom. Confirm `BestDelivery`'s content matches (it should, since it's the same component already live on the home page). Confirm no console errors. `tsc --noEmit` and `npm run build` pass.

- [ ] **Step 4: Commit**

```bash
git add app/[locale]/about/page.tsx messages/en.json messages/ka.json
git commit -m "$(cat <<'EOF'
Assemble About page

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 9: FAQ page

**Files:**
- Create: `foodies-nextjs/components/faq/FaqAccordion.tsx`
- Create: `foodies-nextjs/app/[locale]/faq/page.tsx`
- Modify: `foodies-nextjs/messages/en.json`, `foodies-nextjs/messages/ka.json`

**Interfaces:**
- Consumes: `Header`, `Breadcrumb`, `Instagram`, `Cta`, `InnerFooter` (Tasks 1–3).
- Produces: the `/faq` route.

**Reference source:** `../faq.html` lines 502–660 (`faq-section`, a 10-item Bootstrap/WOW accordion — the CSS/JS accordion behavior is driven by `main.js`'s existing accordion handlers, same mechanism already relied on elsewhere in this codebase; no new JS needed).

- [ ] **Step 1: Extract content and build the accordion component**

Read `../faq.html` lines 502–660 yourself — 10 accordion items, each with a question (`.acc-btn`) and answer (`.acc-content .text`). All 10 answers in the source are the identical "Lorem Ipsum..." placeholder paragraph (verify this yourself — if true, keep it that way rather than inventing 10 different real answers not present in the source; this is template demo content). Port the structure into `foodies-nextjs/components/faq/FaqAccordion.tsx`, driving the 10 items from a `t.raw('items')` array (`{question: string; answer: string}[]`) rather than duplicating the JSX 10 times. Add the section title/sub-title and the `items` array to a `faq` namespace in both message files.

- [ ] **Step 2: Build the page**

Create `foodies-nextjs/app/[locale]/faq/page.tsx` following the exact structure of Task 8's `about/page.tsx` (async component, `setRequestLocale`, `Header showMegaMenu`, `Breadcrumb`, page content, `Instagram`/`Cta`/`InnerFooter`), substituting `<FaqAccordion />` as the sole content section. Add `faq.pageTitle` (breadcrumb title, e.g. "Our FAQ's" / matching Georgian) to both message files.

- [ ] **Step 3: Verify**

`npm run dev`, compare `/ka/faq` and `/en/faq` against `../faq.html`. Click an accordion item — confirm it expands/collapses (this depends on `main.js`'s existing accordion handler finding `.acc-btn`/`.accordion-box` in the DOM — if it doesn't work, check whether `main.js` binds this by class selector broadly enough to pick up a React-rendered instance the same way it already does for other jQuery-driven UI in this codebase, rather than assuming it needs new code). `tsc --noEmit` and `npm run build` pass.

- [ ] **Step 4: Commit**

```bash
git add components/faq/ app/[locale]/faq/page.tsx messages/en.json messages/ka.json
git commit -m "$(cat <<'EOF'
Add FAQ page

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 10: History page

**Files:**
- Create: `foodies-nextjs/components/history/HistoryTop.tsx`
- Create: `foodies-nextjs/components/history/HistoryTimeline.tsx`
- Create: `foodies-nextjs/app/[locale]/history/page.tsx`
- Modify: `foodies-nextjs/messages/en.json`, `foodies-nextjs/messages/ka.json`

**Interfaces:**
- Consumes: `Header`, `Breadcrumb`, `Instagram`, `Cta`, `InnerFooter` (Tasks 1–3).
- Produces: the `/history` route.

**Context:** This page has **two** sections, not one — `history-top-section` (`../history.html` lines 502–528) and a second, separately-named `history-food-list` section (lines 530–635) that an earlier "-section"-suffix-only survey missed. Both are in scope.

- [ ] **Step 1: Build HistoryTop**

Read `../history.html` lines 502–528. Port into `foodies-nextjs/components/history/HistoryTop.tsx` (intro title, description paragraph, client signature images). Add copy to `history.top` in both message files.

- [ ] **Step 2: Build HistoryTimeline**

Read `../history.html` lines 530–635 (`history-food-list`, 6 alternating-layout timeline entries: 1960/1980/2000/2020/2023/2026, each with a year badge, image, title, and paragraph). Drive the 6 entries from a `t.raw('entries')` array rather than duplicating JSX, but preserve the alternating left/right layout (odd entries: image-then-content; even entries: content-then-image, per the source's `year-icon style-2` alternation — check each entry's actual DOM order in the source rather than assuming a simple pattern). Add to `history.timeline` in both message files.

- [ ] **Step 3: Build the page**

Create `foodies-nextjs/app/[locale]/history/page.tsx` following Task 8's structure, rendering `<HistoryTop />` then `<HistoryTimeline />` as the page content. Add `history.pageTitle` to both message files.

- [ ] **Step 4: Verify**

`npm run dev`, compare `/ka/history` and `/en/history` against `../history.html`. `tsc --noEmit` and `npm run build` pass.

- [ ] **Step 5: Commit**

```bash
git add components/history/ app/[locale]/history/page.tsx messages/en.json messages/ka.json
git commit -m "$(cat <<'EOF'
Add History page

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 11: Contact page

**Files:**
- Create: `foodies-nextjs/components/contact/ContactLocations.tsx`
- Create: `foodies-nextjs/components/contact/ContactMap.tsx`
- Create: `foodies-nextjs/app/[locale]/contact/page.tsx`
- Modify: `foodies-nextjs/messages/en.json`, `foodies-nextjs/messages/ka.json`

**Interfaces:**
- Consumes: `Header`, `Breadcrumb`, `Instagram`, `Cta`, `InnerFooter` (Tasks 1–3).
- Produces: the `/contact` route.

**Reference source:** `../contact.html` lines 502–686 (`contact-flag-section-in` + `contact-map-section-in`).

- [ ] **Step 1: Build ContactLocations**

Read `../contact.html` lines 502–613 (`contact-flag-section-in`, 3 office cards: South Africa / USA / German — verify these labels yourself; all 3 cards share identical placeholder address/email/phone text in the source, which is template demo content, not real business data — port it verbatim, do not invent or "correct" it). Drive the 3 cards from a `t.raw('locations')` array. Add to `contactPage.locations` in both message files.

- [ ] **Step 2: Build ContactMap**

Read `../contact.html` lines 615–686 (`contact-map-section-in`) — a Google Maps `<iframe>` plus a contact form (Name/Email/Phone/Subject/Message fields, `action="contact.php"`, ports as visual-only per Global Constraints — change the `action` attribute to `"#"`). Port into `foodies-nextjs/components/contact/ContactMap.tsx`. Add copy (section title/description, form placeholders, submit button) to `contactPage.map` in both message files. Keep the `<iframe src="https://www.google.com/maps/embed?...">` URL exactly as in the source — it's a generic Envato/demo map embed, not something to regenerate.

- [ ] **Step 3: Build the page**

Create `foodies-nextjs/app/[locale]/contact/page.tsx` following Task 8's structure. Add `contactPage.pageTitle` (e.g. "Contact Us") to both message files.

- [ ] **Step 4: Verify**

`npm run dev`, compare `/ka/contact` and `/en/contact` against `../contact.html`. Confirm the map iframe loads. `tsc --noEmit` and `npm run build` pass.

- [ ] **Step 5: Commit**

```bash
git add components/contact/ app/[locale]/contact/page.tsx messages/en.json messages/ka.json
git commit -m "$(cat <<'EOF'
Add Contact page

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Tasks 12–14: REMOVED — out of scope

`team.html` (Task 12), `team-details.html` (Task 13), and `testimonial.html` (Task 14) were in the original 10-page spec but are dropped per the user's curation decision (see this plan's Goal section and Task 5) — fake demo team roster and testimonials aren't real content for the BiteClub project. No `/team`, `/team-details`, or `/testimonial` routes are built. `Header.tsx`'s nav no longer links to any of them (Task 1). Any old link to these paths (e.g. from external bookmarks) resolves through `not-found.tsx` (Task 4) like any other unmatched route — no special handling needed.

---

## Task 15: Gallery page

**Files:**
- Create: `foodies-nextjs/components/gallery/GalleryGrid.tsx`
- Create: `foodies-nextjs/app/[locale]/gallery/page.tsx`
- Modify: `foodies-nextjs/messages/en.json`, `foodies-nextjs/messages/ka.json`

**Interfaces:**
- Consumes: `Header`, `Breadcrumb`, `Instagram`, `Cta`, `InnerFooter` (Tasks 1–3).
- Produces: the `/gallery` route.

**Reference source:** `../gallery.html` lines 502–574 (`gallery-section-5`, a 14-image masonry grid — `home-4/g-1.jpg` through `g-14.jpg`, arranged in an asymmetric column layout, no text copy beyond image alt text).

- [ ] **Step 1: Build GalleryGrid**

Read the range yourself and reproduce the exact column/row nesting (it's asymmetric — a left 2-column sub-grid, a right 2-column sub-grid with its own irregular nesting; don't flatten it into a uniform grid, the layout depends on this specific nesting for its masonry look). Drive the image list from an array of filenames rather than hand-writing 14 near-identical `<img>` blocks, but preserve each image's exact position in the nested structure. Since these are actual gallery photos (the page's entire content), they're informational per the alt-text rubric — give each a real translated alt (e.g. "BiteClub gallery photo {n}", matching the pattern used for `Instagram`'s alt text in Task 3) rather than `alt=""`. Add to `galleryPage` in both message files.

- [ ] **Step 2: Build the page**

Create `foodies-nextjs/app/[locale]/gallery/page.tsx` following Task 8's structure. Add `galleryPage.pageTitle` (e.g. "Our Gallery") to both message files.

- [ ] **Step 3: Verify**

`npm run dev`, compare `/ka/gallery` and `/en/gallery` against `../gallery.html` — confirm the asymmetric masonry layout matches, not just that 14 images are present. `tsc --noEmit` and `npm run build` pass.

- [ ] **Step 4: Commit**

```bash
git add components/gallery/ app/[locale]/gallery/page.tsx messages/en.json messages/ka.json
git commit -m "$(cat <<'EOF'
Add Gallery page

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 16: Reservation page

**Files:**
- Create: `foodies-nextjs/components/reservation/Feature.tsx`
- Create: `foodies-nextjs/components/reservation/ComboOffer.tsx`
- Create: `foodies-nextjs/components/reservation/BrandStrip.tsx`
- Create: `foodies-nextjs/app/[locale]/reservation/page.tsx`
- Modify: `foodies-nextjs/messages/en.json`, `foodies-nextjs/messages/ka.json`

**Interfaces:**
- Consumes: `Header`, `Breadcrumb`, `Instagram`, `Cta`, `InnerFooter` (Tasks 1–3).
- Produces: the `/reservation` route.

**Context:** Three sections — `feature-section` (lines 502–580), `comboo-offer-section-two` (lines 580–688), `brand-section-inner` (lines 688–730). Note `comboo-offer-section-two` is a **different** section from the home page's `comboo-banner-section` (`ComboBanner.tsx`) — different class name, different content; do not reuse `ComboBanner.tsx`, build fresh from this source.

- [ ] **Step 1: Build Feature**

Read `../reservation.html` lines 502–580 (`feature-section`) — likely contains the reservation form (check for `<form>` fields; if present, port as visual-only per Global Constraints, `action="#"`). Port into `foodies-nextjs/components/reservation/Feature.tsx`. Add copy to `reservation.feature` in both message files.

- [ ] **Step 2: Build ComboOffer**

Read `../reservation.html` lines 580–688 (`comboo-offer-section-two`). Port into `foodies-nextjs/components/reservation/ComboOffer.tsx`. Add copy to `reservation.comboOffer` in both message files.

- [ ] **Step 3: Build BrandStrip**

Read `../reservation.html` lines 688–730 (`brand-section-inner`, likely a row of partner/brand logos — check whether any need translated alt text per the rubric, or are purely decorative). Port into `foodies-nextjs/components/reservation/BrandStrip.tsx`. Add copy (if any beyond image alts) to `reservation.brands` in both message files.

- [ ] **Step 4: Build the page**

Create `foodies-nextjs/app/[locale]/reservation/page.tsx` following Task 8's structure, rendering `<Feature />`, `<ComboOffer />`, `<BrandStrip />` in that order. Add `reservation.pageTitle` (e.g. "Reservation") to both message files.

- [ ] **Step 5: Verify**

`npm run dev`, compare `/ka/reservation` and `/en/reservation` against `../reservation.html`. If a reservation form is present, confirm it renders correctly but doesn't submit anywhere (visual-only, per the earlier "keep non-functional" decision). `tsc --noEmit` and `npm run build` pass.

- [ ] **Step 6: Commit**

```bash
git add components/reservation/ app/[locale]/reservation/page.tsx messages/en.json messages/ka.json
git commit -m "$(cat <<'EOF'
Add Reservation page

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 17: Final cross-page verification

**Files:** None (verification only).

**Interfaces:** N/A.

- [ ] **Step 1: JSON parity check**

```bash
node -e "JSON.parse(require('fs').readFileSync('messages/ka.json','utf8')); JSON.parse(require('fs').readFileSync('messages/en.json','utf8')); console.log('valid JSON')"
```

Then write a short one-off script (or reuse the pattern from the home-page migration) to confirm every leaf key path present in `en.json` also exists in `ka.json` and vice versa — no drift between the two catalogs after this plan's edits. Confirm the orphaned `header.nav.ourChefs`/`chefsDetails`/`testimonial` keys removed in Task 1 are actually gone from both files, not just unused.

- [ ] **Step 2: Full build + route check**

```bash
npm run build
```

Confirm the build output lists all 6 new routes (`/about`, `/faq`, `/history`, `/contact`, `/gallery`, `/reservation`) plus the existing `/` for both `ka` and `en`, all prerendered as static (SSG), and `not-found` handling present. No `/team`, `/team-details`, or `/testimonial` routes should exist (Tasks 12–14 were dropped).

- [ ] **Step 3: Nav link audit**

Open `/ka`, exercise every nav link that now has a real destination: top-level About, Gallery, Reservation, Contact, Menu (still expected to 404 via `not-found.tsx` — out of scope for this plan) plus the trimmed "Pages" dropdown's History, FAQ Page, and Error 404. Confirm none of the removed team/team-details/testimonial links remain anywhere in the header (grep the rendered HTML or the component source for `/team`, `/team-details`, `/testimonial` — none should be found). Shop/Blog dropdown links are still genuinely out of scope and expected to 404 via `not-found.tsx` — confirm that page still renders correctly for those, not a raw error.

- [ ] **Step 4: Mobile check**

At a mobile viewport width, confirm the header's offcanvas menu (Task 1's `showMegaMenu` prop doesn't affect the mobile offcanvas clone, which is unconditional in `Header.tsx` today — verify this is still true) opens and lets you navigate to each new page.

- [ ] **Step 5: Commit (if any fixes were needed)**

If Steps 1–4 found anything to fix, fix it and commit with a message describing what cross-page issue was found and corrected.
