// Exports the site's current texts (messages/{ka,en}.json) and content images as CMS demo data.
// Run from foodies-nextjs: node scripts/export-cms-demo.mjs
// Writes ../foodies-cms/database/seeders/data/site-pages.json and ../foodies-cms/database/seeders/demo-images/.
import {copyFileSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {basename, dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const seeders = join(root, '..', 'foodies-cms', 'database', 'seeders');
const messages = {
  ka: JSON.parse(readFileSync(join(root, 'messages', 'ka.json'), 'utf8')),
  en: JSON.parse(readFileSync(join(root, 'messages', 'en.json'), 'utf8'))
};

/** Reads a translation by dotted path and fails loudly when a key is missing. */
function pick(m, path) {
  const value = path.split('.').reduce((node, key) => (node == null ? undefined : node[key]), m);
  if (value === undefined) {
    throw new Error(`Missing translation: ${path}`);
  }
  return value;
}

/** Copies a site image into the CMS seeder folder; returns its path on the CMS public disk. */
function asset(page, file) {
  const name = basename(file);
  const target = join(seeders, 'demo-images', page, name);
  mkdirSync(dirname(target), {recursive: true});
  copyFileSync(join(root, 'public', 'assets', 'img', file), target);
  return `demo/${page}/${name}`;
}

/** Same as asset() for a public URL such as '/assets/img/inner/contact-flag-1.png'. */
function assetUrl(page, url) {
  return asset(page, url.replace(/^\/assets\/img\//, ''));
}

function block(type, build) {
  return {type, data: {ka: build(messages.ka), en: build(messages.en)}};
}

const img = {
  burger: asset('about', 'home-4/burger-1.png'),
  banner1: asset('about', 'home-1/food-banner-1.jpg'),
  banner2: asset('about', 'home-1/food-banner-2.jpg'),
  banner2Dish: asset('about', 'home-1/food-menu2.png'),
  banner3: asset('about', 'home-1/food-banner-3.jpg'),
  banner4: asset('about', 'home-1/food-banner-4.jpg'),
  banner4Dish: asset('about', 'home-1/pizza-discount.png'),
  menuLeft: asset('about', 'home-3/food-menu.jpg'),
  menuRight: asset('about', 'home-3/food-menu-2.jpg'),
  gallery: [1, 2, 3].map((n) => asset('about', `home-2/gallery-${n}.jpg`)),
  delivery: asset('about', 'home-1/delivery-image.png'),
  discountBg: asset('about', 'home-4/banner-bg.jpg')
};

const MAP_EMBED_URL =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6678.7619084840835!2d144.9618311901502!3d-37.81450084255415!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642b4758afc1d%3A0x3119cc820fdfc62e!2sEnvato!5e0!3m2!1sen!2sbd!4v1641984054261!5m2!1sen!2sbd';
const galleryImages = Array.from({length: 14}, (_, i) => asset('gallery', `home-4/g-${i + 1}.jpg`));

const pages = {
  about: {
    template: 'about',
    slugs: {ka: 'about', en: 'about-us'},
    titles: {ka: pick(messages.ka, 'about.pageTitle'), en: pick(messages.en, 'about.pageTitle')},
    blocks: [
      block('about_why_choose_us', (m) => ({
        sub_title: pick(m, 'about.whyChooseUs.subTitle'),
        title: pick(m, 'about.whyChooseUs.title'),
        title_line2: pick(m, 'about.whyChooseUs.titleLine2'),
        description: pick(m, 'about.whyChooseUs.description'),
        list_one: pick(m, 'about.whyChooseUs.listOne').map((text) => ({text})),
        list_two: pick(m, 'about.whyChooseUs.listTwo').map((text) => ({text})),
        image: img.burger,
        primary_button_text: pick(m, 'about.whyChooseUs.orderNow'),
        primary_button_link: '/contact',
        secondary_button_text: pick(m, 'about.whyChooseUs.reserveTable'),
        secondary_button_link: '/contact'
      })),
      block('about_discount_food', (m) => ({
        banner1_label: pick(m, 'discountFood.limitedTime'),
        banner1_title: pick(m, 'discountFood.offer50'),
        banner1_image: img.banner1,
        banner2_label: pick(m, 'discountFood.today'),
        banner2_title: pick(m, 'discountFood.specialMenuTitle'),
        banner2_accent: pick(m, 'discountFood.specialMenuAccent'),
        banner2_text: pick(m, 'discountFood.thisWeekendOnly'),
        banner2_price_label: pick(m, 'discountFood.only'),
        banner2_price: pick(m, 'discountFood.price19'),
        banner2_image: img.banner2Dish,
        banner2_background: img.banner2,
        banner3_title: ['banner3Title', 'banner3TitleLine2', 'banner3TitleLine3'].map((k) => pick(m, `discountFood.${k}`)).join('\n'),
        banner3_image: img.banner3,
        banner4_label: pick(m, 'discountFood.specialMenu'),
        banner4_title: pick(m, 'discountFood.chesseyPizza'),
        banner4_subtitle: pick(m, 'discountFood.chefSpecial'),
        banner4_image: img.banner4Dish,
        banner4_background: img.banner4,
        button_text: pick(m, 'common.orderNow'),
        button_link: '/menu'
      })),
      block('about_food_menu', (m) => ({
        sub_title: pick(m, 'about.foodMenu.subTitle'),
        title: pick(m, 'about.foodMenu.title'),
        left_image: img.menuLeft,
        right_image: img.menuRight,
        button_text: pick(m, 'about.foodMenu.reserveTable'),
        button_link: '/menu'
      })),
      block('about_gallery', (m) => ({
        sub_title: pick(m, 'about.gallery.subTitle'),
        title: pick(m, 'about.gallery.title'),
        images: img.gallery,
        button_text: pick(m, 'about.gallery.viewGallery'),
        button_link: '/gallery'
      })),
      block('best_delivery', (m) => ({
        sub_title: pick(m, 'bestDelivery.subTitle'),
        title: pick(m, 'bestDelivery.title'),
        description: pick(m, 'bestDelivery.description'),
        points_sub_title: pick(m, 'bestDelivery.earnPointsSubTitle'),
        points_title: pick(m, 'bestDelivery.earnPointsTitle'),
        info_text: pick(m, 'bestDelivery.infoText'),
        image: img.delivery,
        button_text: pick(m, 'common.orderNow'),
        button_link: '/menu'
      })),
      block('about_discount_banner', (m) => ({
        title: pick(m, 'about.discountBanner.title'),
        description: pick(m, 'about.discountBanner.description'),
        discount_text: pick(m, 'about.discountBanner.discountOffer'),
        right_title: pick(m, 'about.discountBanner.rightTitle'),
        background_image: img.discountBg,
        button_text: pick(m, 'about.discountBanner.browseOffers'),
        button_link: '/menu'
      })),
      block('about_news', (m) => ({
        sub_title: pick(m, 'about.news.subTitle'),
        title: pick(m, 'about.news.title')
      }))
    ]
  },
  contact: {
    template: 'contact',
    slugs: {ka: 'contact', en: 'contact-us'},
    titles: {ka: pick(messages.ka, 'contactPage.pageTitle'), en: pick(messages.en, 'contactPage.pageTitle')},
    blocks: [
      block('contact_locations', (m) => ({
        locations: pick(m, 'contactPage.locations').map((l) => ({
          icon: assetUrl('contact', l.icon),
          title: l.title,
          find_us_label: l.findUsLabel,
          address: l.address,
          mail_us_label: l.mailUsLabel,
          email: l.email,
          call_us_label: l.callUsLabel,
          phone: l.phone
        }))
      })),
      block('contact_map', (m) => ({
        map_embed_url: MAP_EMBED_URL,
        sub_title: pick(m, 'contactPage.map.subTitle'),
        title: pick(m, 'contactPage.map.title'),
        description: pick(m, 'contactPage.map.description')
      }))
    ]
  },
  faq: {
    template: 'faq',
    slugs: {ka: 'faq', en: 'faqs'},
    titles: {ka: pick(messages.ka, 'faq.pageTitle'), en: pick(messages.en, 'faq.pageTitle')},
    blocks: [
      block('faq_accordion', (m) => ({
        sub_title: pick(m, 'faq.subTitle'),
        title: pick(m, 'faq.title'),
        items: pick(m, 'faq.items').map((item) => ({question: item.question, answer: item.answer}))
      }))
    ]
  },
  gallery: {
    template: 'gallery',
    slugs: {ka: 'gallery', en: 'our-gallery'},
    titles: {ka: pick(messages.ka, 'galleryPage.pageTitle'), en: pick(messages.en, 'galleryPage.pageTitle')},
    blocks: [block('gallery_grid', () => ({images: galleryImages}))]
  },
  history: {
    template: 'history',
    slugs: {ka: 'history', en: 'our-history'},
    titles: {ka: pick(messages.ka, 'history.pageTitle'), en: pick(messages.en, 'history.pageTitle')},
    blocks: [
      block('history_top', (m) => ({
        sub_title: pick(m, 'history.top.subTitle'),
        title: pick(m, 'history.top.title'),
        description: pick(m, 'history.top.description'),
        image: asset('history', 'inner/history-client-01.png'),
        signature_image: asset('history', 'inner/history-client-sing.png')
      })),
      block('history_timeline', (m) => ({
        entries: pick(m, 'history.timeline.entries').map((e) => ({
          year: e.year,
          title: e.title,
          text: e.text,
          image: assetUrl('history', e.image)
        }))
      }))
    ]
  },
  reservation: {
    template: 'reservation',
    slugs: {ka: 'reservation', en: 'book-a-table'},
    titles: {ka: pick(messages.ka, 'reservationPage.pageTitle'), en: pick(messages.en, 'reservationPage.pageTitle')},
    blocks: [
      block('reservation_feature', (m) => ({
        items: pick(m, 'reservationPage.feature.items').map((item) => ({
          icon: assetUrl('reservation', item.icon),
          title: item.title,
          description: item.description
        })),
        button_text: pick(m, 'common.orderNow'),
        button_link: '/contact'
      })),
      block('reservation_combo_offer', (m) => ({
        sub_title: pick(m, 'reservationPage.comboOffer.subTitle'),
        title: pick(m, 'reservationPage.comboOffer.title'),
        description: pick(m, 'reservationPage.comboOffer.description'),
        support_label: pick(m, 'reservationPage.comboOffer.supportLabel'),
        support_phone: pick(m, 'reservationPage.comboOffer.supportPhone'),
        background_image: asset('reservation', 'home-2/comboo-offer-bg.jpg'),
        form_title: pick(m, 'reservationPage.comboOffer.formTitle'),
        form_description: pick(m, 'reservationPage.comboOffer.formDescription')
      })),
      block('brand_strip', () => ({logos: [1, 2, 3, 4, 5, 6].map((n) => asset('reservation', `home-3/b-${n}.png`))}))
    ]
  },
  menu: {
    template: 'menu',
    slugs: {ka: 'menu', en: 'food-menu'},
    titles: {ka: pick(messages.ka, 'menuPage.pageTitle'), en: pick(messages.en, 'menuPage.pageTitle')},
    block_types: ['menu_full', 'menu_special_banner', 'menu_best_selling', 'menu_best_food'],
    blocks: [
      block('menu_full', (m) => ({
        sub_title: pick(m, 'menuPage.liveMenu.subTitle'),
        title: pick(m, 'menuPage.liveMenu.title')
      })),
      block('menu_special_banner', (m) => ({
        sub_text: pick(m, 'menuPage.banner.subText'),
        title: pick(m, 'menuPage.banner.title'),
        text: pick(m, 'menuPage.banner.text'),
        image: asset('menu', 'home-2/pizza-image.png'),
        background_image: asset('menu', 'home-2/offer-bg.jpg'),
        button_text: pick(m, 'common.orderNow'),
        button_link: '/contact'
      }))
    ]
  }
};

const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

/** '3 March, 2026' → '2026-03-03' (the en date of a static post). */
function isoDate(value) {
  const match = /^(\d{1,2})\s+([A-Za-z]+),?\s+(\d{4})$/.exec(value.trim());
  const month = match ? MONTHS.indexOf(match[2].toLowerCase()) + 1 : 0;
  if (!match || month === 0) {
    throw new Error(`Unrecognised post date: ${value}`);
  }
  return `${match[3]}-${String(month).padStart(2, '0')}-${match[1].padStart(2, '0')}`;
}

const kaPosts = pick(messages.ka, 'blogPage.posts');
const enPosts = pick(messages.en, 'blogPage.posts');
const blogPosts = kaPosts.map((ka, i) => {
  const en = enPosts[i];
  const detailImage = assetUrl('blog', ka.detailImage);
  const secondaryImage = assetUrl('blog', ka.secondaryImage);
  const article = (p) => ({
    category: p.category,
    detail_image: detailImage,
    paragraphs: p.body.map((text) => ({text})),
    pull_quote: p.pullQuote,
    secondary_image: secondaryImage,
    closing_paragraph: p.closingParagraph,
    tags: p.tags.map((text) => ({text}))
  });

  return {
    slug: {ka: ka.slug, en: `${en.slug}-en`},
    published_at: isoDate(en.date),
    feature_image: assetUrl('blog', ka.image),
    translations: {
      ka: {title: ka.title, excerpt: ka.excerpt, category: ka.category, article: article(ka)},
      en: {title: en.title, excerpt: en.excerpt, category: en.category, article: article(en)}
    }
  };
});

mkdirSync(join(seeders, 'data'), {recursive: true});
writeFileSync(join(seeders, 'data', 'site-pages.json'), `${JSON.stringify(pages, null, 2)}\n`);
writeFileSync(join(seeders, 'data', 'blog-posts.json'), `${JSON.stringify(blogPosts, null, 2)}\n`);
console.log(`Exported ${Object.keys(pages).length} page(s) and ${blogPosts.length} blog post(s) to foodies-cms/database/seeders/data/`);
