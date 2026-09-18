import {notFound} from 'next/navigation';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import Header from '@/components/home/Header';
import Breadcrumb from '@/components/shared/Breadcrumb';
import Instagram from '@/components/inner/Instagram';
import Cta from '@/components/inner/Cta';
import InnerFooter from '@/components/inner/InnerFooter';
import BlogPost from '@/components/blog/BlogPost';

const SLUGS = ['khinkali-history', 'spring-menu', 'visit-this-weekend'];

export async function generateStaticParams() {
  return SLUGS.map((slug) => ({slug}));
}

export default async function BlogDetailsPage({
  params
}: {
  params: Promise<{locale: string; slug: string}>;
}) {
  const {locale, slug} = await params;
  setRequestLocale(locale);

  if (!SLUGS.includes(slug)) {
    notFound();
  }

  const t = await getTranslations('blogPage');
  const post = (t.raw('posts') as {slug: string; title: string}[]).find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <Header showMegaMenu />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <Breadcrumb title={post.title} currentLabel={post.title} />
          <BlogPost slug={slug} />
          <Instagram />
          <Cta />
          <InnerFooter />
        </div>
      </div>
    </>
  );
}
