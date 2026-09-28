import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import Header from '@/components/home/Header';
import Breadcrumb from '@/components/shared/Breadcrumb';
import InnerFooter from '@/components/inner/InnerFooter';
import ProductDetail from '@/components/product/ProductDetail';
import RelatedProducts from '@/components/product/RelatedProducts';
import {getMenu, getProduct, type CmsBlock} from '@/lib/cms';
import {cleanHtml} from '@/lib/sanitize';

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

  const t = await getTranslations('menuPage.productPage');
  const tMenu = await getTranslations('menuPage.liveMenu');
  const story = [
    ...(product.content && product.content !== product.excerpt ? [product.content] : []),
    ...blockParagraphs(product.blocks)
  ];

  const categories = (await getMenu(locale)) ?? [];
  const category = categories.find((row) => row.products.some((item) => item.slug === product.slug));
  const sameCategory = (category?.products ?? []).filter((item) => item.slug && item.slug !== product.slug);
  const featured = sameCategory.length > 0 ? [] : ((await getMenu(locale, {featured: true})) ?? []).flatMap((row) => row.products);
  const related = sameCategory.length > 0 ? sameCategory : featured.filter((item) => item.slug && item.slug !== product.slug);
  const categoryHref = category ? `/menu#cat-${category.slug}` : '/menu';

  return (
    <>
      <Header />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <Breadcrumb
            title={product.title}
            currentLabel={product.title}
            image={product.image}
            parent={{href: '/menu', label: t('menu')}}
            compact
          />
          <section className="product-page">
            <div className="container">
              <ProductDetail product={product} categoryHref={categoryHref} />
              {story.length > 0 ? (
                <div className="product-story">
                  <h3>{t('details')}</h3>
                  {story.map((paragraph) =>
                    paragraph.includes('<') ? (
                      <div key={paragraph} dangerouslySetInnerHTML={{__html: cleanHtml(paragraph)}} />
                    ) : (
                      <p key={paragraph}>{paragraph}</p>
                    )
                  )}
                </div>
              ) : null}
            </div>
          </section>
          {related.length > 0 ? (
            <RelatedProducts
              title={sameCategory.length > 0 ? t('relatedTitle') : t('featuredTitle')}
              subTitle={sameCategory.length > 0 ? (category?.name ?? '') : t('featuredSub')}
              products={related}
              labels={{prev: t('prev'), next: t('next'), soldOut: tMenu('soldOut')}}
            />
          ) : null}
          <InnerFooter />
        </div>
      </div>
    </>
  );
}
