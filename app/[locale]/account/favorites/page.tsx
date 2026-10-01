import {setRequestLocale} from 'next-intl/server';
import FavoritesGrid from '@/components/account/FavoritesGrid';
import {cmsAsset, type CmsProduct} from '@/lib/cms';
import {getAccountData} from '@/lib/server/auth';

type FavoriteItem = {id: number; slug: string; title: string; excerpt: string | null; price: string; sale_price: string | null; image: string | null; is_available: boolean};

export default async function AccountFavoritesPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const data = await getAccountData<{items: FavoriteItem[]}>('me/favorites', locale);
  const products: CmsProduct[] = (data?.items ?? []).map((item) => ({
    id: item.id,
    title: item.title,
    excerpt: item.excerpt,
    price: `${item.sale_price ?? item.price} ₾`,
    image: cmsAsset(item.image),
    isAvailable: item.is_available,
    slug: item.slug,
    ingredients: [],
    addons: []
  }));

  return <FavoritesGrid products={products} />;
}
