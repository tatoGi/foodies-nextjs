import type {Metadata} from 'next';
import {permanentRedirect} from 'next/navigation';
import Header from '@/components/home/Header';
import Breadcrumb from '@/components/shared/Breadcrumb';
import InnerFooter from '@/components/inner/InnerFooter';
import {Link} from '@/i18n/navigation';
import {cmsAsset, cmsPageMetadata, getCmsPage, isCmsPage, type CmsPage, type CmsPageBlock} from '@/lib/cms';

const TEXT_KEYS = ['html', 'content', 'text', 'description', 'body', 'title', 'subtitle', 'heading'];

export async function resolveCmsPage(locale: string, slug: string): Promise<CmsPage | null> {
  const result = await getCmsPage(locale, slug);
  if (!result) {
    return null;
  }
  if (!isCmsPage(result)) {
    permanentRedirect(`/${locale}/${result.redirectSlug}`);
  }

  return result;
}

export async function cmsMetadata(locale: string, slug: string): Promise<Metadata | undefined> {
  return (await cmsPageMetadata(locale, slug)) ?? undefined;
}

function stringsFrom(data: Record<string, unknown>): string[] {
  return TEXT_KEYS.map((key) => data[key]).filter((value): value is string => typeof value === 'string' && value.trim() !== '');
}

function imagesFrom(data: Record<string, unknown>): string[] {
  const raw = data.images ?? data.gallery ?? data.product_images ?? data.banner_image;
  const list = Array.isArray(raw) ? raw : raw ? [raw] : [];

  return list.map((item) => cmsAsset(item)).filter((item): item is string => Boolean(item));
}

function BlockSection({block}: {block: CmsPageBlock}) {
  const texts = stringsFrom(block.data);
  const images = imagesFrom(block.data);
  const button = typeof block.data.button_title === 'string' ? block.data.button_title : '';
  const href = typeof block.data.redirect_link === 'string' ? block.data.redirect_link : '';

  if (texts.length === 0 && images.length === 0) {
    return null;
  }

  return (
    <section className="section-padding">
      <div className="container">
        <div className="row g-4 align-items-center">
          {images.length > 0 ? (
            <div className={texts.length > 0 ? 'col-lg-5' : 'col-12'}>
              <div className="row g-3">
                {images.map((src) => (
                  <div className={images.length > 1 ? 'col-6' : 'col-12'} key={src}>
                    <img src={src} alt="" />
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          {texts.length > 0 ? (
            <div className={images.length > 0 ? 'col-lg-7' : 'col-lg-8'}>
              {texts.map((paragraph, index) =>
                index === 0 && !paragraph.includes('<') ? (
                  <h2 key={paragraph}>{paragraph}</h2>
                ) : paragraph.includes('<') ? (
                  <div key={paragraph} dangerouslySetInnerHTML={{__html: paragraph}} />
                ) : (
                  <p key={paragraph}>{paragraph}</p>
                )
              )}
              {button && href ? (
                href.startsWith('http') ? (
                  <a href={href} className="theme-btn">
                    {button}
                  </a>
                ) : (
                  <Link href={href} className="theme-btn">
                    {button}
                  </Link>
                )
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default function CmsPageView({page}: {page: CmsPage}) {
  return (
    <>
      <Header />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <Breadcrumb title={page.title} currentLabel={page.title} image={page.image} />
          {page.description ? (
            <section className="section-padding pb-0">
              <div className="container">
                <div className="row">
                  <div className="col-lg-8">
                    <p>{page.description}</p>
                  </div>
                </div>
              </div>
            </section>
          ) : null}
          {page.image ? (
            <section className="section-padding pb-0">
              <div className="container">
                <img src={page.image} alt={page.title} />
              </div>
            </section>
          ) : null}
          {page.blocks
            .filter((block) => block.type !== 'main_banner' && block.type !== 'page_hero')
            .map((block, index) => (
              <BlockSection key={`${block.type}-${index}`} block={block} />
            ))}
          {page.products.length > 0 ? (
            <section className="section-padding">
              <div className="container">
                <div className="row g-4">
                  {page.products.map((product) => (
                    <div className="col-lg-4" key={product.slug || product.title}>
                      {product.slug ? (
                        <Link href={`/products/${product.slug}`}>
                          {product.image ? <img src={product.image} alt={product.title} /> : null}
                          <h3>{product.title}</h3>
                        </Link>
                      ) : (
                        <h3>{product.title}</h3>
                      )}
                      <span>{product.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ) : null}
          <InnerFooter />
        </div>
      </div>
    </>
  );
}
