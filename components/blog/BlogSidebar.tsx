import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import type {BlogCard} from '@/lib/blog';

type Category = {name: string; count: string};

export default function BlogSidebar({recent}: {recent: BlogCard[]}) {
  const t = useTranslations('blogPage');
  const categories = t.raw('categories') as Category[];
  const tags = t.raw('tags') as string[];
  const posts = recent.slice(0, 3);

  return (
    <div className="col-lg-4 col-12">
      <div className="main-sideber sticky-style">
        <div className="single-sideber-widget">
          <div className="widget-title">
            <h3>{t('searchTitle')}</h3>
          </div>
          <div className="search-widget">
            <form action="#">
              <input type="text" placeholder={t('searchPlaceholder')} />
              <button type="submit"><i className="fa-solid fa-magnifying-glass" /></button>
            </form>
          </div>
        </div>
        <div className="single-sideber-widget">
          <div className="widget-title">
            <h3>{t('categoriesTitle')}</h3>
          </div>
          <ul className="category-list">
            {categories.map((category) => (
              <li key={category.name}>
                <a href="#">{category.name}</a>
                <span>{category.count}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="single-sideber-widget">
          <div className="widget-title">
            <h3>{t('recentPostTitle')}</h3>
          </div>
          <div className="recent-post-area">
            {posts.map((post) => (
              <div className="recent-items" key={post.slug}>
                <div className="recent-thumb">
                  <img src={post.thumb} alt={post.title} />
                </div>
                <div className="recent-content">
                  <h4>
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h4>
                  <ul>
                    <li>{post.date}</li>
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="single-sideber-widget mb-0">
          <div className="widget-title">
            <h3>{t('tagsTitle')}</h3>
          </div>
          <div className="tagcloud">
            {tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
