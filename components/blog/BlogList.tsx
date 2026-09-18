import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import BlogSidebar from './BlogSidebar';

type Post = {
  slug: string;
  image: string;
  date: string;
  commentsLabel: string;
  title: string;
  excerpt: string;
};

export default function BlogList() {
  const tCommon = useTranslations('common');
  const tBlog = useTranslations('blogPage');
  const posts = tBlog.raw('posts') as Post[];

  return (
    <section className="news-standard-section section-padding">
      <div className="container">
        <div className="news-standard-wrapper">
          <div className="row g-4">
            <div className="col-12 col-lg-8">
              <div className="news-standard-items">
                {posts.map((post, index) => (
                  <div
                    className={`news-card-items-4${index === posts.length - 1 ? ' mb-0' : ''}`}
                    key={post.slug}
                  >
                    <div className="news-image">
                      <img src={post.image} alt={post.title} />
                    </div>
                    <div className="news-content">
                      <ul className="date-list">
                        <li>
                          <i className="fa-solid fa-calendar-days" />
                          {post.date}
                        </li>
                        <li>
                          <i className="fa-solid fa-comments" />
                          {post.commentsLabel}
                        </li>
                      </ul>
                      <h2>
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h2>
                      <p>{post.excerpt}</p>
                      <Link href={`/blog/${post.slug}`} className="theme-btn small-btn">
                        {tCommon('readMore')} <i className="fa-solid fa-arrow-right" />
                      </Link>
                    </div>
                  </div>
                ))}
                <div className="page-nav-wrap text-center">
                  <ul>
                    <li><a className="page-numbers" href="#">01</a></li>
                    <li><a className="page-numbers" href="#">02</a></li>
                    <li><a className="page-numbers" href="#">03</a></li>
                    <li className="active"><a className="page-numbers" href="#">{tBlog('paginationNext')}</a></li>
                  </ul>
                </div>
              </div>
            </div>
            <BlogSidebar />
          </div>
        </div>
      </div>
    </section>
  );
}
