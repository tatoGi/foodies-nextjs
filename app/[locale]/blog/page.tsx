import {getTranslations, setRequestLocale} from 'next-intl/server';
import SitePageLayout from '@/components/cms/SitePageLayout';
import BlogList from '@/components/blog/BlogList';
import {getBlogCards, staticBlogCards, type StaticBlogPost} from '@/lib/blog';

export default async function BlogPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('blogPage');
  const posts = (await getBlogCards(locale)) ?? staticBlogCards(t.raw('posts') as StaticBlogPost[]);

  return (
    <SitePageLayout title={t('pageTitle')}>
      <BlogList posts={posts} />
    </SitePageLayout>
  );
}
