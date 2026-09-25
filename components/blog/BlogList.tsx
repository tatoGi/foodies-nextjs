import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import type {BlogCard} from '@/lib/blog';
import BlogSidebar from './BlogSidebar';

const PAGE_SIZE = 10;

export default function BlogList({posts}: {posts: BlogCard[]}) {
  const tCommon = useTranslations('common');
  const tBlog = useTranslations('blogPage');

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
                        {post.commentsLabel ? (
                          <li>
                            <i className="fa-solid fa-comments" />
                            {post.commentsLabel}
                          </li>
                        ) : null}
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
                {posts.length > PAGE_SIZE ? (
                  <div className="page-nav-wrap text-center">
                    <ul>
                      <li><a className="page-numbers" href="#">01</a></li>
                      <li><a className="page-numbers" href="#">02</a></li>
                      <li className="active"><a className="page-numbers" href="#">{tBlog('paginationNext')}</a></li>
                    </ul>
                  </div>
                ) : null}
              </div>
            </div>
            <BlogSidebar recent={posts} />
          </div>
        </div>
      </div>
    </section>
  );
}
