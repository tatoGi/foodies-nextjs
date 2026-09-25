import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {text, type BlockData} from '@/lib/blockData';

export default function News2({data}: {data?: BlockData}) {
  const t = useTranslations('about.news');
  const posts = t.raw('posts') as {day: string; month: string; category: string; title: string; author: string; comments: string}[];

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
          {posts.map((post, i) => (
            <div className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp" data-wow-delay={`.${3 + i * 2}s`} key={post.title}>
              <div className="news-box-items-two style-box-shadow">
                <div className="thumb">
                  <img src={`/assets/img/home-2/news-0${i + 1}.jpg`} alt={post.title} />
                  <div className="date-box">
                    <span>{post.day}</span>
                    <p>{post.month}</p>
                  </div>
                </div>
                <div className="content-box">
                  <div className="content">
                    <p>{post.category}</p>
                    <h3 className="title">
                      <Link href="/news-details">{post.title}</Link>
                    </h3>
                  </div>
                  <ul>
                    <li>
                      <img src="/assets/img/home-2/user.png" alt="" /> {post.author}
                    </li>
                    <li>
                      <img src="/assets/img/home-2/comments.png" alt="" /> {post.comments}
                    </li>
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
