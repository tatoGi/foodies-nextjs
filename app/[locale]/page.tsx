import {setRequestLocale} from 'next-intl/server';
import Header from '@/components/home/Header';
import Hero from '@/components/home/Hero';
import ShopCategory from '@/components/home/ShopCategory';
import FoodMenu from '@/components/home/FoodMenu';
import Contact from '@/components/home/Contact';
import News from '@/components/home/News';
import Footer from '@/components/home/Footer';

export default async function HomePage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);

  return (
    <>
      <Header />

      <div id="smooth-wrapper">
        <div id="smooth-content">
          <Hero />
          <ShopCategory />
          <FoodMenu />
          <Contact />
          <News />
          <Footer />
        </div>
      </div>
    </>
  );
}
