import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {cmsMetadata, resolveCmsPage} from '@/components/cms/CmsPageView';
import SitePageLayout, {renderBlocks} from '@/components/cms/SitePageLayout';
import BestSellingFood from '@/components/menu/BestSellingFood';
import SpecialMenuBanner from '@/components/menu/SpecialMenuBanner';
import BestFoodMenu from '@/components/menu/BestFoodMenu';
import BakeryMenu from '@/components/menu/BakeryMenu';
import {getMenu, type CmsPageBlock} from '@/lib/cms';

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale} = await params;
  return (await cmsMetadata(locale, 'menu')) ?? {};
}

export default async function MenuPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('menuPage');
  const menu = await getMenu(locale);
  const live = menu && menu.some((category) => category.products.length > 0) ? menu : null;
  const cmsPage = await resolveCmsPage(locale, 'menu');

  if (cmsPage?.template === 'menu') {
    const needsFeatured = cmsPage.blocks.some((b) => b.type === 'menu_best_selling' || b.type === 'menu_best_food');
    const featured = needsFeatured ? await getMenu(locale, {featured: true}) : null;
    const featuredItems = (featured ?? []).flatMap((category) =>
      category.products.map((product) => ({
        image: product.image ?? '/assets/img/home-2/food-menu-1.png',
        name: product.title,
        price: product.price,
        available: product.isAvailable
      }))
    );

    return (
      <SitePageLayout title={cmsPage.title} bannerImage={cmsPage.image}>
        {renderBlocks(cmsPage.blocks, (block: CmsPageBlock) => {
          switch (block.type) {
            case 'menu_full':
              return live ? <BakeryMenu categories={live} data={block.data} /> : <BestSellingFood data={block.data} />;
            case 'menu_special_banner':
              return <SpecialMenuBanner data={block.data} />;
            case 'menu_best_selling':
              return <BestSellingFood data={block.data} categories={featured} />;
            case 'menu_best_food':
              return <BestFoodMenu data={block.data} items={featuredItems} />;
            default:
              return null;
          }
        })}
      </SitePageLayout>
    );
  }

  return (
    <SitePageLayout title={t('pageTitle')}>
      {live ? <BakeryMenu categories={live} /> : <BestSellingFood />}
      <SpecialMenuBanner />
      {live ? null : <BestFoodMenu />}
    </SitePageLayout>
  );
}
