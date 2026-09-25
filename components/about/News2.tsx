import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {text, type BlockData} from '@/lib/blockData';
import type {BlogCard} from '@/lib/blog';

type Item = {key: string; day: string; month: string; category: string; title: string; image: string; href: string; author: string; comments: string | null};

/** About page news: the latest CMS posts, or today's static items when the CMS has none. */
export default function News2({data, posts}: {data?: BlockData; posts?: BlogCard[] | null}) {
  const t = useTranslations('about.news');
  const tBlog = useTranslations('blogPage');
  const items: Item[] =
    posts && posts.length > 0
      ? posts.slice(0, 3).map((post) => ({
          key: post.slug,
          day: post.day,
          month: post.month,
          category: post.category,
          title: post.title,
          image: post.image,
          href: `/blog/${post.slug}`,
          author: tBlog('authorName'),
          comments: null
        }))
      : (t.raw('posts') as {day: string; month: string; category: string; title: string; author: string; comments: string}[]).map(
          (post, i) => ({
            key: post.title,
            day: post.day,
            month: post.month,
            category: post.category,
            title: post.title,
            image: `/assets/img/home-2/news-0${i + 1}.jpg`,
            href: '/blog',
            author: post.author,
            comments: post.comments
          })
        );

  return (
    <section className="news-section-two fix section-padding bg-white">
      <div className="container">
        <div className="section-title text-center">
          <span className="sub-title tz-sub-tilte tz-sub-anim tx-subTitle">{text(data, 'sub_title', t('subTitle'))}</span>
          <h2 className="tx-title sec_title tz-itm-title tz-itm-anim">{text(data, 'title', t('title'))}</h2>
          <div className="sec-line mt-3 mb-0">
            <img src="/assets/img/home-1/sec-line.png" alt="" />
          </div>
        </div>
        <div className="row">
          {items.map((item, i) => (
            <div className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp" data-wow-delay={`.${3 + i * 2}s`} key={item.key}>
              <div className="news-box-items-two style-box-shadow">
                <div className="thumb">
                  <img src={item.image} alt={item.title} />
                  <div className="date-box">
                    <span>{item.day}</span>
                    <p>{item.month}</p>
                  </div>
                </div>
                <div className="content-box">
                  <div className="content">
                    <p>{item.category}</p>
                    <h3 className="title">
                      <Link href={item.href}>{item.title}</Link>
                    </h3>
                  </div>
                  <ul>
                    <li>
                      <img src="/assets/img/home-2/user.png" alt="" /> {item.author}
                    </li>
                    {item.comments ? (
                      <li>
                        <img src="/assets/img/home-2/comments.png" alt="" /> {item.comments}
                      </li>
                    ) : null}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
