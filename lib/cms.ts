export type CmsIngredient = {
  name: string;
  isRemovable: boolean;
};

export type CmsAddon = {
  name: string;
  price: string;
};

export type CmsProduct = {
  title: string;
  excerpt: string | null;
  price: string;
  image: string | null;
  isAvailable: boolean;
  slug: string;
  ingredients: CmsIngredient[];
  addons: CmsAddon[];
};

export type CmsProductDetail = CmsProduct & {
  category: string;
};

export type CmsCategory = {
  slug: string;
  name: string;
  description: string | null;
  products: CmsProduct[];
};

type MenuResponse = {
  categories?: {
    slug?: string;
    name?: string;
    description?: string | null;
    products?: {
      title?: string;
      excerpt?: string | null;
      price?: string;
      sale_price?: string | null;
      image?: string | null;
      is_available?: boolean;
      slug?: string;
      ingredients?: {name?: string; is_removable?: boolean}[];
      addons?: {name?: string; price?: string}[];
    }[];
  }[];
};

export async function getMenu(locale: string): Promise<CmsCategory[] | null> {
  const base = process.env.CMS_API_URL;
  if (!base) {
    return null;
  }

  try {
    const response = await fetch(`${base.replace(/\/$/, '')}/api/web/menu?locale=${locale}`, {
      next: {tags: ['menu'], revalidate: 60}
    });
    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as MenuResponse;

    return (data.categories ?? []).map((category) => ({
      slug: category.slug ?? 'menu',
      name: category.name ?? '',
      description: category.description ?? null,
      products: (category.products ?? []).map((product) => ({
        title: product.title ?? '',
        excerpt: product.excerpt ?? null,
        price: `${product.sale_price ?? product.price ?? ''} ₾`,
        image: product.image ?? null,
        isAvailable: product.is_available !== false,
        slug: product.slug ?? '',
        ingredients: (product.ingredients ?? []).map((row) => ({
          name: row.name ?? '',
          isRemovable: row.is_removable === true
        })),
        addons: (product.addons ?? []).map((row) => ({
          name: row.name ?? '',
          price: `${row.price ?? ''} ₾`
        }))
      }))
    }));
  } catch {
    return null;
  }
}

export type SiteChrome = {
  breadcrumbImage: string | null;
  breadcrumbColor: string;
};

const DEFAULT_BANNER_COLOR = '#1c1714';

export async function getSiteChrome(): Promise<SiteChrome> {
  const fallback = {breadcrumbImage: null, breadcrumbColor: DEFAULT_BANNER_COLOR};
  const base = process.env.CMS_API_URL;
  if (!base) {
    return fallback;
  }

  try {
    const response = await fetch(`${base.replace(/\/$/, '')}/api/web/bootstrap?locale=ka`, {
      next: {tags: ['settings'], revalidate: 60}
    });
    if (!response.ok) {
      return fallback;
    }
    const data = (await response.json()) as {settings?: {breadcrumbImage?: string | null; breadcrumbColor?: string}};
    const color = data.settings?.breadcrumbColor ?? '';
    const image = data.settings?.breadcrumbImage || null;
    const origin = base.replace(/\/$/, '');

    return {
      breadcrumbImage: image && image.startsWith('/') ? `${origin}${image}` : image,
      breadcrumbColor: /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(color) ? color : DEFAULT_BANNER_COLOR
    };
  } catch {
    return fallback;
  }
}

export async function getProduct(locale: string, slug: string): Promise<CmsProductDetail | null> {
  const categories = await getMenu(locale);
  if (!categories) {
    return null;
  }

  for (const category of categories) {
    const product = category.products.find((item) => item.slug === slug);
    if (product) {
      return {...product, category: category.name};
    }
  }

  return null;
}
