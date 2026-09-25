import type {Metadata} from 'next';

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

export type CmsBlock = {
  type: string;
  data: Record<string, unknown>;
};

export type CmsProductDetail = CmsProduct & {
  category: string;
  content: string;
  seo: {
    metaTitle: string;
    metaDescription: string | null;
    keywords: string | null;
    canonicalUrl: string | null;
  };
  blocks: CmsBlock[];
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

export async function getMenu(locale: string, {featured = false}: {featured?: boolean} = {}): Promise<CmsCategory[] | null> {
  const base = process.env.CMS_API_URL;
  if (!base) {
    return null;
  }

  try {
    const query = `locale=${locale}${featured ? '&featured=1' : ''}`;
    const response = await fetch(`${base.replace(/\/$/, '')}/api/web/menu?${query}`, {
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
        image: cmsAsset(product.image),
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

const emptySeo = {metaTitle: '', metaDescription: null, keywords: null, canonicalUrl: null};

export async function getProduct(locale: string, slug: string): Promise<CmsProductDetail | null> {
  const fromApi = await fetchProduct(locale, slug);
  if (fromApi) {
    return fromApi;
  }

  const categories = await getMenu(locale);
  if (!categories) {
    return null;
  }

  for (const category of categories) {
    const product = category.products.find((item) => item.slug === slug);
    if (product) {
      return {...product, category: category.name, content: '', seo: emptySeo, blocks: []};
    }
  }

  return null;
}

type ProductResponse = {
  product?: {
    title?: string;
    excerpt?: string | null;
    description?: string | null;
    content?: string | null;
    price?: number | string;
    cover_image?: string | null;
    feature_image?: string | null;
    is_available?: boolean;
    slug?: string;
    category?: string;
    ingredients?: {name?: string; is_removable?: boolean}[];
    addons?: {name?: string; price?: string | number}[];
    blocks?: {type?: string; data?: Record<string, unknown>}[];
  };
  seo?: {
    meta_title?: string | null;
    meta_description?: string | null;
    keywords?: string | null;
    canonical_url?: string | null;
  };
};

async function fetchProduct(locale: string, slug: string): Promise<CmsProductDetail | null> {
  const base = process.env.CMS_API_URL;
  if (!base) {
    return null;
  }

  try {
    const response = await fetch(
      `${base.replace(/\/$/, '')}/api/web/products/${encodeURIComponent(slug)}?locale=${locale}`,
      {next: {tags: ['menu', `product:${slug}`], revalidate: 60}}
    );
    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as ProductResponse;
    const product = data.product;
    if (!product) {
      return null;
    }

    const price = typeof product.price === 'number' ? product.price.toFixed(2) : (product.price ?? '');

    return {
      title: product.title ?? '',
      excerpt: product.excerpt ?? product.description ?? null,
      price: `${price} ₾`,
      image: cmsAsset(product.cover_image ?? product.feature_image),
      isAvailable: product.is_available !== false,
      slug: product.slug ?? slug,
      category: product.category ?? '',
      content: product.content ?? '',
      ingredients: (product.ingredients ?? []).map((row) => ({
        name: row.name ?? '',
        isRemovable: row.is_removable === true
      })),
      addons: (product.addons ?? []).map((row) => ({
        name: row.name ?? '',
        price: `${row.price ?? ''} ₾`
      })),
      seo: {
        metaTitle: data.seo?.meta_title ?? product.title ?? '',
        metaDescription: data.seo?.meta_description ?? null,
        keywords: data.seo?.keywords ?? null,
        canonicalUrl: data.seo?.canonical_url ?? null
      },
      blocks: (product.blocks ?? []).map((block) => ({
        type: block.type ?? '',
        data: block.data ?? {}
      }))
    };
  } catch {
    return null;
  }
}

export type CmsPageBlock = {
  type: string;
  data: Record<string, unknown>;
};

export type CmsLinkedProduct = {
  title: string;
  slug: string;
  price: string;
  image: string | null;
};

export type CmsPage = {
  slug: string;
  title: string;
  description: string;
  template: string;
  image: string | null;
  blocks: CmsPageBlock[];
  products: CmsLinkedProduct[];
  seo: {
    metaTitle: string;
    metaDescription: string | null;
    keywords: string | null;
    canonicalUrl: string | null;
    locales: Record<string, string>;
  };
};

export type CmsPageResult = CmsPage | {redirectSlug: string};

export function isCmsPage(result: CmsPageResult): result is CmsPage {
  return !('redirectSlug' in result);
}

export type HeroSlide = {
  eyebrow: string;
  title: string;
  description: string;
  image: string | null;
  button: string;
  href: string;
};

export function cmsAsset(path: unknown): string | null {
  const value = typeof path === 'string' ? path.trim() : '';
  if (!value) {
    return null;
  }
  if (value.startsWith('http://') || value.startsWith('https://')) {
    return value;
  }
  const base = process.env.CMS_API_URL?.replace(/\/$/, '');
  if (!base) {
    return value;
  }
  if (value.startsWith('/')) {
    return `${base}${value}`;
  }

  return `${base}/storage/${value.replace(/^storage\//, '')}`;
}

export function heroSlidesFromPage(page: CmsPage | null): HeroSlide[] {
  if (!page) {
    return [];
  }

  return page.blocks
    .filter((block) => block.type === 'main_banner' || block.type === 'page_hero')
    .map((block) => ({
      eyebrow: textField(block.data, 'banner_top_title'),
      title: textField(block.data, 'banner_title'),
      description: plainText(textField(block.data, 'banner_description')),
      image: cmsAsset(block.data.banner_image),
      button: textField(block.data, 'button_title') || textField(block.data, 'cta_primary_text'),
      href: textField(block.data, 'redirect_link') || textField(block.data, 'cta_primary_url') || '/menu'
    }))
    .filter((slide) => slide.title || slide.image);
}

export async function getCmsPage(locale: string, slug: string): Promise<CmsPageResult | null> {
  const base = process.env.CMS_API_URL;
  if (!base) {
    return null;
  }

  try {
    const response = await fetch(
      `${base.replace(/\/$/, '')}/api/web/pages/${encodeURIComponent(slug)}?locale=${locale}`,
      {next: {tags: ['pages', `page:${slug}`], revalidate: 60}}
    );
    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as {
      redirect?: {slug?: string};
      page?: {
        slug?: string;
        title?: string;
        description?: string;
        template?: string;
        feature_image?: string | null;
        blocks?: {type?: string; data?: Record<string, unknown>}[];
      };
      relations?: {
        products?: {
          title?: string;
          slug?: string;
          price?: number | string;
          feature_image?: string | null;
          cover_image?: string | null;
        }[];
      };
      seo?: {
        meta_title?: string | null;
        meta_description?: string | null;
        keywords?: string | null;
        canonical_url?: string | null;
        locales?: Record<string, string>;
      };
    };

    if (data.redirect?.slug) {
      return {redirectSlug: data.redirect.slug};
    }

    const page = data.page;
    if (!page) {
      return null;
    }

    return {
      slug: page.slug ?? slug,
      title: page.title ?? '',
      description: plainText(page.description),
      template: page.template ?? 'inner',
      image: cmsAsset(page.feature_image),
      blocks: (page.blocks ?? []).map((block) => ({
        type: block.type ?? '',
        data: block.data ?? {}
      })),
      products: (data.relations?.products ?? []).map((product) => ({
        title: product.title ?? '',
        slug: product.slug ?? '',
        price: `${product.price ?? ''} ₾`,
        image: cmsAsset(product.cover_image ?? product.feature_image)
      })),
      seo: {
        metaTitle: data.seo?.meta_title ?? page.title ?? '',
        metaDescription: data.seo?.meta_description ?? null,
        keywords: data.seo?.keywords ?? null,
        canonicalUrl: data.seo?.canonical_url ?? null,
        locales: data.seo?.locales ?? {}
      }
    };
  } catch {
    return null;
  }
}

export async function cmsPageMetadata(locale: string, slug: string): Promise<Metadata | null> {
  const result = await getCmsPage(locale, slug);
  if (!result || !isCmsPage(result)) {
    return null;
  }

  const title = result.seo.metaTitle || result.title;
  const description = result.seo.metaDescription || result.description || undefined;
  const languages = Object.fromEntries(
    Object.entries(result.seo.locales).map(([code, slug]) => [code, `/${code}/${slug}`])
  );

  return {
    title,
    description,
    keywords: result.seo.keywords || undefined,
    alternates: {
      canonical: result.seo.canonicalUrl || undefined,
      languages: Object.keys(languages).length > 0 ? languages : undefined
    },
    openGraph: {
      title,
      description,
      images: result.image ? [result.image] : undefined
    }
  };
}

function textField(data: Record<string, unknown>, key: string): string {
  const value = data[key];
  return typeof value === 'string' ? value.trim() : '';
}

// CMS rich-text fields arrive as HTML; places that render plain text need the words only.
function plainText(html: string | null | undefined): string {
  return (html ?? '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
