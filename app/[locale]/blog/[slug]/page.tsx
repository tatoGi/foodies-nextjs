import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import SitePageLayout from '@/components/cms/SitePageLayout';
import BlogPost from '@/components/blog/BlogPost';
import {getBlogArticle, getBlogCards, staticBlogArticle, staticBlogCards, type StaticBlogPost} from '@/lib/blog';

type Params = {params: Promise<{locale: string; slug: string}>};

// A CMS post first; today's static post with that slug when the CMS has none.
async function loadArticle(locale: string, slug: string) {
  const cms = await getBlogArticle(locale, slug);
  if (cms) {
    return cms;
  }
  const t = await getTranslations({locale, namespace: 'blogPage'});
  return staticBlogArticle(t.raw('posts') as StaticBlogPost[], slug);
}

export async function generateMetadata({params}: Params): Promise<Metadata> {
  const {locale, slug} = await params;
  const post = await loadArticle(locale, slug);
  return post ? {title: post.title, description: post.excerpt || undefined} : {};
}

export default async function BlogDetailsPage({params}: Params) {
  const {locale, slug} = await params;
  setRequestLocale(locale);
  const post = await loadArticle(locale, slug);
  if (!post) {
    notFound();
  }
  const t = await getTranslations('blogPage');
  const recent = (await getBlogCards(locale, 3)) ?? staticBlogCards(t.raw('posts') as StaticBlogPost[]);

  return (
    <SitePageLayout title={post.title}>
      <BlogPost post={post} recent={recent} />
    </SitePageLayout>
  );
}
