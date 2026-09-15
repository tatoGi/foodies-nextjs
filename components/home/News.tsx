import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';

export default function News() {
  const t = useTranslations('news');
  const tCommon = useTranslations('common');
  const posts = t.raw('posts') as {day: string; month: string; title: string}[];

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
          {posts.map((post, i) => (
            <div className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp" key={post.title}>
              <div className="news-box-items">
                <div className="thumb">
                  <img src={`/assets/img/home-1/news-${i + 1}.jpg`} alt={post.title} />
                  <div className="date-items">
                    <span className="date">{post.day}</span>
                    <span className="month">{post.month}</span>
                  </div>
                </div>
                <div className="content">
                  <ul>
                    <li>
                      <img src="/assets/img/home-1/user.png" alt="" />
                      {t('author')}
                    </li>
                    <li>
                      <img src="/assets/img/home-1/comments.png" alt="" />
                      {t('comments')}
                    </li>
                  </ul>
                  <h3 className="title">
                    <Link href="/news-details">{post.title}</Link>
                  </h3>
                  <Link href="/news-details" className="link-btn">
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
