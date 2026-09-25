import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {cmsMetadata, resolveCmsPage} from '@/components/cms/CmsPageView';
import SitePageLayout from '@/components/cms/SitePageLayout';
import BlogList from '@/components/blog/BlogList';
import {getBlogCards, staticBlogCards, type StaticBlogPost} from '@/lib/blog';

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale} = await params;
  return (await cmsMetadata(locale, 'blog')) ?? {};
}

export default async function BlogPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('blogPage');
  // The CMS "blog" page only carries the list's title, banner image and SEO; the posts come from the blog itself.
  const cmsPage = await resolveCmsPage(locale, 'blog');
  const posts = (await getBlogCards(locale)) ?? staticBlogCards(t.raw('posts') as StaticBlogPost[]);

  return (
    <SitePageLayout title={cmsPage?.title || t('pageTitle')} bannerImage={cmsPage?.image}>
      <BlogList posts={posts} />
    </SitePageLayout>
  );
}
