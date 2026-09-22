import {getTranslations, setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import Header from '@/components/home/Header';
import Breadcrumb from '@/components/shared/Breadcrumb';
import InnerFooter from '@/components/inner/InnerFooter';
import {Link} from '@/i18n/navigation';
import {getProduct} from '@/lib/cms';

const PLACEHOLDER = '/assets/img/home-1/food-menu-1.png';

export default async function ProductPage({
  params
}: {
  params: Promise<{locale: string; slug: string}>;
}) {
  const {locale, slug} = await params;
  setRequestLocale(locale);
  const product = await getProduct(locale, slug);
  if (!product) {
    notFound();
  }

  const tMenu = await getTranslations('menuPage.liveMenu');
  const tProduct = await getTranslations('menuPage.productPage');
  const ingredients = product.ingredients.map((row) => row.name).filter(Boolean);

  return (
    <>
      <Header />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <Breadcrumb title={product.title} currentLabel={product.title} />
          <section className="section-padding">
            <div className="container">
              <div className="row g-4 align-items-center">
                <div className="col-lg-5">
                  <img src={product.image ?? PLACEHOLDER} alt={product.title} />
                </div>
                <div className="col-lg-7">
                  <p>{product.category}</p>
                  <h2>{product.title}</h2>
                  {product.excerpt ? <p>{product.excerpt}</p> : null}
                  {ingredients.length > 0 ? (
                    <p>
                      {tMenu('ingredients')}: {ingredients.join(', ')}
                    </p>
                  ) : null}
                  {product.addons.length > 0 ? (
                    <p>
                      {tMenu('addons')}: {product.addons.map((row) => `${row.name} +${row.price}`).join(', ')}
                    </p>
                  ) : null}
                  <h3>{product.isAvailable ? product.price : tMenu('soldOut')}</h3>
                  <Link href="/menu" className="theme-btn">
                    {tProduct('back')}
                  </Link>
                </div>
              </div>
            </div>
          </section>
          <InnerFooter />
        </div>
      </div>
    </>
  );
}
