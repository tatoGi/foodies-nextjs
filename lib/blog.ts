import {cmsAsset} from '@/lib/cms';
import {rows, text, type BlockData} from '@/lib/blockData';

/** A post as the list, sidebar and news sections show it. */
export type BlogCard = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  thumb: string;
  date: string;
  day: string;
  month: string;
  category: string;
  commentsLabel: string | null;
};

export type BlogComment = {name: string; date: string; text: string};

/** A full post as the designed article shows it. `comments === null` hides comments and the comment form. */
export type BlogArticle = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  detailImage: string;
  secondaryImage: string | null;
  body: string[];
  pullQuote: string;
  closingParagraph: string;
  tags: string[];
  comments: BlogComment[] | null;
};

/** Today's static posts (messages blogPage.posts). */
export type StaticBlogPost = {
  slug: string;
  image: string;
  detailImage: string;
  secondaryImage: string;
  recentThumb: string;
  date: string;
  commentsLabel: string;
  category: string;
  title: string;
  excerpt: string;
  body: string[];
  pullQuote: string;
  closingParagraph: string;
  tags: string[];
  comments: BlogComment[];
};

const FALLBACK_IMAGE = '/assets/img/inner/news/blog-post-1.jpg';

function intlLocale(locale: string): string {
  return locale === 'ka' ? 'ka-GE' : 'en-GB';
}

/** 'YYYY-MM-DD' (list API) or 'DD/MM/YYYY' (post API) → Date at UTC midnight. */
function parseDate(value: string | null | undefined): Date | null {
  const raw = (value ?? '').trim();
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw);
  const dmy = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(raw);
  const [y, m, d] = iso ? [iso[1], iso[2], iso[3]] : dmy ? [dmy[3], dmy[2], dmy[1]] : [];
  return y ? new Date(Date.UTC(Number(y), Number(m) - 1, Number(d))) : null;
}

export function formatPostDate(value: string | null | undefined, locale: string): string {
  const date = parseDate(value);
  return date
    ? new Intl.DateTimeFormat(intlLocale(locale), {day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'}).format(date)
    : '';
}

function dayMonth(value: string | null | undefined, locale: string): {day: string; month: string} {
  const date = parseDate(value);
  if (!date) {
    return {day: '', month: ''};
  }
  return {
    day: String(date.getUTCDate()),
    month: new Intl.DateTimeFormat(intlLocale(locale), {month: 'short', timeZone: 'UTC'}).format(date)
  };
}

function cmsBase(): string | null {
  const base = process.env.CMS_API_URL;
  return base ? base.replace(/\/$/, '') : null;
}

type ListResponse = {
  posts?: {slug?: string; title?: string; excerpt?: string; category?: string; published_at?: string | null; feature_image?: string | null}[];
};

/** Latest CMS posts, or null when the CMS is unreachable or has none (callers then show today's static posts). */
export async function getBlogCards(locale: string, limit = 12): Promise<BlogCard[] | null> {
  const base = cmsBase();
  if (!base) {
    return null;
  }

  try {
    const response = await fetch(`${base}/api/web/posts?locale=${locale}&limit=${limit}`, {
      next: {tags: ['posts'], revalidate: 60}
    });
    if (!response.ok) {
      return null;
    }
    const data = (await response.json()) as ListResponse;
    const cards = (data.posts ?? [])
      .filter((post) => post.slug && post.title)
      .map((post): BlogCard => {
        const image = cmsAsset(post.feature_image) ?? FALLBACK_IMAGE;
        return {
          slug: post.slug ?? '',
          title: post.title ?? '',
          excerpt: post.excerpt ?? '',
          image,
          thumb: image,
          date: formatPostDate(post.published_at, locale),
          ...dayMonth(post.published_at, locale),
          category: post.category ?? '',
          commentsLabel: null
        };
      });
    return cards.length > 0 ? cards : null;
  } catch {
    return null;
  }
}

type PostResponse = {
  post?: {
    slug?: string;
    title?: string;
    excerpt?: string;
    category?: string;
    published_at?: string;
    feature_image?: string | null;
    blocks?: {type?: string; data?: BlockData}[];
  };
};

/** One CMS post by any of its slugs, in the requested language; null when missing or the CMS is down. */
export async function getBlogArticle(locale: string, slug: string): Promise<BlogArticle | null> {
  const base = cmsBase();
  if (!base) {
    return null;
  }

  try {
    const response = await fetch(`${base}/api/web/blog/${encodeURIComponent(slug)}?locale=${locale}`, {
      next: {tags: ['posts', `post:${slug}`], revalidate: 60}
    });
    if (!response.ok) {
      return null;
    }
    const post = ((await response.json()) as PostResponse).post;
    if (!post?.title) {
      return null;
    }
    const article = post.blocks?.find((block) => block.type === 'blog_article')?.data;

    return {
      slug: post.slug ?? slug,
      title: post.title,
      excerpt: post.excerpt ?? '',
      date: formatPostDate(post.published_at, locale),
      category: text(article, 'category', post.category ?? ''),
      detailImage: cmsAsset(article?.detail_image) ?? cmsAsset(post.feature_image) ?? FALLBACK_IMAGE,
      secondaryImage: cmsAsset(article?.secondary_image),
      body: rows(article, 'paragraphs').map((row) => text(row, 'text', '')).filter(Boolean),
      pullQuote: text(article, 'pull_quote', ''),
      closingParagraph: text(article, 'closing_paragraph', ''),
      tags: rows(article, 'tags').map((row) => text(row, 'text', '')).filter(Boolean),
      comments: null
    };
  } catch {
    return null;
  }
}

export function staticBlogCards(posts: StaticBlogPost[]): BlogCard[] {
  return posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    image: post.image,
    thumb: post.recentThumb,
    date: post.date,
    day: '',
    month: '',
    category: post.category,
    commentsLabel: post.commentsLabel
  }));
}

export function staticBlogArticle(posts: StaticBlogPost[], slug: string): BlogArticle | null {
  const post = posts.find((p) => p.slug === slug);
  return post
    ? {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        date: post.date,
        category: post.category,
        detailImage: post.detailImage,
        secondaryImage: post.secondaryImage,
        body: post.body,
        pullQuote: post.pullQuote,
        closingParagraph: post.closingParagraph,
        tags: post.tags,
        comments: post.comments
      }
    : null;
}
