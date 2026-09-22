import {setRequestLocale} from 'next-intl/server';
import Header from '@/components/home/Header';
import Hero from '@/components/home/Hero';
import ShopCategory from '@/components/home/ShopCategory';
import FoodMenu from '@/components/home/FoodMenu';
import Contact from '@/components/home/Contact';
import News from '@/components/home/News';
import Footer from '@/components/home/Footer';
import {getMenu} from '@/lib/cms';

export default async function HomePage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const menu = await getMenu(locale);
  const products = (menu ?? []).flatMap((category) =>
    category.products.map((product) => ({
      title: product.title,
      slug: product.slug,
      price: product.price,
      image: product.image
    }))
  );

  return (
    <>
      <Header />

      <div id="smooth-wrapper">
        <div id="smooth-content">
          <Hero />
          <ShopCategory products={products} />
          <FoodMenu />
          <Contact />
          <News />
          <Footer />
        </div>
      </div>
    </>
  );
}
