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
  }
};

mkdirSync(join(seeders, 'data'), {recursive: true});
writeFileSync(join(seeders, 'data', 'site-pages.json'), `${JSON.stringify(pages, null, 2)}\n`);
console.log(`Exported ${Object.keys(pages).length} page(s) to foodies-cms/database/seeders/data/site-pages.json`);
