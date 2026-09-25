import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import Header from '@/components/home/Header';
import Breadcrumb from '@/components/shared/Breadcrumb';
import InnerFooter from '@/components/inner/InnerFooter';
import {Link} from '@/i18n/navigation';
import {getProduct, type CmsBlock} from '@/lib/cms';

const SKIPPED_BLOCKS = new Set(['product_specs', 'product_intro']);

function blockParagraphs(blocks: CmsBlock[]): string[] {
  const paragraphs: string[] = [];
  for (const block of blocks) {
    if (SKIPPED_BLOCKS.has(block.type)) {
      continue;
    }
    for (const key of ['html', 'content', 'text', 'description', 'body']) {
      const value = block.data[key];
      if (typeof value === 'string' && value.trim() !== '') {
        paragraphs.push(value.trim());
      }
    }
  }
  return paragraphs;
}

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string; slug: string}>;
}): Promise<Metadata> {
  const {locale, slug} = await params;
  const product = await getProduct(locale, slug);
  if (!product) {
    return {};
  }

  const title = product.seo.metaTitle || product.title;
  const description = product.seo.metaDescription || product.excerpt || undefined;

  return {
    title,
    description,
    keywords: product.seo.keywords || undefined,
    alternates: product.seo.canonicalUrl ? {canonical: product.seo.canonicalUrl} : undefined,
    openGraph: {
      title,
      description,
      images: product.image ? [product.image] : undefined
    }
  };
}

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
  const story = [
    ...(product.content && product.content !== product.excerpt ? [product.content] : []),
    ...blockParagraphs(product.blocks)
  ];

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
              {story.length > 0 ? (
                <div className="row mt-5">
                  <div className="col-lg-8">
                    {story.map((paragraph) =>
                      paragraph.includes('<') ? (
                        <div key={paragraph} dangerouslySetInnerHTML={{__html: paragraph}} />
                      ) : (
                        <p key={paragraph}>{paragraph}</p>
                      )
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          </section>
          <InnerFooter />
        </div>
      </div>
    </>
  );
}
