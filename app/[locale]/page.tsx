import type {Metadata} from 'next';
import {setRequestLocale} from 'next-intl/server';
import Header from '@/components/home/Header';
import Hero from '@/components/home/Hero';
import ShopCategory from '@/components/home/ShopCategory';
import FoodMenu from '@/components/home/FoodMenu';
import Contact from '@/components/home/Contact';
import News from '@/components/home/News';
import Footer from '@/components/home/Footer';
import {cmsPageMetadata, getCmsPage, getMenu, heroSlidesFromPage, isCmsPage} from '@/lib/cms';
import {getBlogCards} from '@/lib/blog';

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  return (await cmsPageMetadata(locale, 'home')) ?? {};
}

export default async function HomePage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const menu = await getMenu(locale);
  const bestDishes = await getMenu(locale, {featured: true});
  const news = await getBlogCards(locale, 3);
  const home = await getCmsPage(locale, 'home');
  const slides = home && isCmsPage(home) ? heroSlidesFromPage(home) : [];
  const products = (menu ?? []).flatMap((category) =>
    category.products.map((product) => ({
      title: product.title,
      slug: product.slug,
      price: product.price,
      image: product.image,
      excerpt: product.excerpt
    }))
  );

  return (
    <>
      <Header />

      <div id="smooth-wrapper">
        <div id="smooth-content">
          <Hero slides={slides} />
          <ShopCategory products={products} />
          <FoodMenu categories={bestDishes} />
          <Contact />
          <News posts={news} />
          <Footer />
        </div>
      </div>
    </>
  );
}
