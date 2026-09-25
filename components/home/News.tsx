import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import type {BlogCard} from '@/lib/blog';

type Item = {key: string; day: string; month: string; title: string; image: string; href: string; author: string; comments: string | null};

/** Home page news: the latest CMS posts, or today's static items when the CMS has none. */
export default function News({posts}: {posts?: BlogCard[] | null}) {
  const t = useTranslations('news');
  const tCommon = useTranslations('common');
  const tBlog = useTranslations('blogPage');
  const items: Item[] =
    posts && posts.length > 0
      ? posts.slice(0, 3).map((post) => ({
          key: post.slug,
          day: post.day,
          month: post.month,
          title: post.title,
          image: post.image,
          href: `/blog/${post.slug}`,
          author: tBlog('authorName'),
          comments: null
        }))
      : (t.raw('posts') as {day: string; month: string; title: string}[]).map((post, i) => ({
          key: post.title,
          day: post.day,
          month: post.month,
          title: post.title,
          image: `/assets/img/home-1/news-${i + 1}.jpg`,
          href: '/blog',
          author: t('author'),
          comments: t('comments')
        }));

  return (
    <section className="news-section section-padding pt-0">
      <div className="container">
        <div className="section-title text-center">
          <span className="sub-title tz-sub-tilte tz-sub-anim tx-subTitle">{t('subTitle')}</span>
          <h2 className="tx-title sec_title tz-itm-title tz-itm-anim">{t('title')}</h2>
          <div className="sec-line mt-3">
            <img src="/assets/img/home-1/sec-line.png" alt="" />
          </div>
        </div>
        <div className="row">
          {items.map((item) => (
            <div className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp" key={item.key}>
              <div className="news-box-items">
                <div className="thumb">
                  <img src={item.image} alt={item.title} />
                  <div className="date-items">
                    <span className="date">{item.day}</span>
                    <span className="month">{item.month}</span>
                  </div>
                </div>
                <div className="content">
                  <ul>
                    <li>
                      <img src="/assets/img/home-1/user.png" alt="" />
                      {item.author}
                    </li>
                    {item.comments ? (
                      <li>
                        <img src="/assets/img/home-1/comments.png" alt="" />
                        {item.comments}
                      </li>
                    ) : null}
                  </ul>
                  <h3 className="title">
                    <Link href={item.href}>{item.title}</Link>
                  </h3>
                  <Link href={item.href} className="link-btn">
                    <span className="text">
                      <span className="text-default">{tCommon('readMore')} <i className="fa-regular fa-arrow-up-right" /></span>
                      <span className="text-hover">{tCommon('readMore')} <i className="fa-regular fa-arrow-up-right" /></span>
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
