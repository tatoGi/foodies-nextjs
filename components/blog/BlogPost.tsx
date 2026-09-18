import {useTranslations} from 'next-intl';
import BlogSidebar from './BlogSidebar';

type Comment = {name: string; date: string; text: string};

type Post = {
  slug: string;
  detailImage: string;
  secondaryImage: string;
  date: string;
  category: string;
  title: string;
  body: string[];
  pullQuote: string;
  closingParagraph: string;
  tags: string[];
  comments: Comment[];
};

export default function BlogPost({slug}: {slug: string}) {
  const tBlog = useTranslations('blogPage');
  const posts = tBlog.raw('posts') as Post[];
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return null;
  }

  return (
    <section className="news-standard-section section-padding">
      <div className="container">
        <div className="news-details-area">
          <div className="row g-4">
            <div className="col-12 col-lg-8">
              <div className="blog-post-details">
                <div className="single-blog-post">
                  <div className="post-featured-thumb fix">
                    <img data-speed=".8" src={post.detailImage} alt={post.title} />
                  </div>
                  <div className="post-content">
                    <ul className="post-list d-flex align-items-center">
                      <li>
                        <i className="fa-regular fa-user" />
                        {tBlog('byLabel')} {tBlog('authorName')}
                      </li>
                      <li>
                        <i className="fa-solid fa-calendar-days" />
                        {post.date}
                      </li>
                      <li>
                        <i className="fa-solid fa-tag" />
                        {post.category}
                      </li>
                    </ul>
                    <h2>{post.title}</h2>
                    {post.body.map((paragraph, index) => (
                      <p className="mb-3" key={index}>{paragraph}</p>
                    ))}
                    <div className="hilight-text mt-4 mb-4">
                      <p>{post.pullQuote}</p>
                      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 20.3698H7.71428L2.57139 30.5546H10.2857L15.4286 20.3698V5.09247H0V20.3698Z" fill="#FFC222" />
                        <path d="M20.5703 5.09247V20.3698H28.2846L23.1417 30.5546H30.856L35.9989 20.3698V5.09247H20.5703Z" fill="#FFC222" />
                      </svg>
                    </div>
                    <div className="row g-4">
                      <div className="col-lg-12">
                        <div className="details-image">
                          <img src={post.secondaryImage} alt={post.title} />
                        </div>
                      </div>
                    </div>
                    <p className="pt-5">{post.closingParagraph}</p>
                  </div>
                </div>
                <div className="row tag-share-wrap mt-4 mb-5">
                  <div className="col-lg-8 col-12">
                    <div className="tagcloud">
                      {post.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="col-lg-4 col-12 mt-3 mt-lg-0 text-lg-end">
                    <div className="social-share">
                      <span className="me-3">{tBlog('shareLabel')}</span>
                      <a href="javascript:void(0)"><i className="fab fa-facebook-f" /></a>
                      <a href="javascript:void(0)"><i className="fab fa-twitter" /></a>
                      <a href="javascript:void(0)"><i className="fab fa-linkedin-in" /></a>
                    </div>
                  </div>
                </div>
                <div className="comments-area">
                  <div className="comments-heading">
                    <h3>{tBlog('commentsHeading', {count: post.comments.length})}</h3>
                  </div>
                  {post.comments.map((comment, index) => {
                    const isLast = index === post.comments.length - 1;
                    return (
                      <div
                        className={
                          isLast
                            ? 'blog-single-comment bb-none d-flex gap-4 pt-5'
                            : 'blog-single-comment d-flex gap-4 pt-4 pb-5'
                        }
                        key={comment.name}
                      >
                        <div className="image">
                          <img src={`/assets/img/inner/news/client-0${index + 1}.png`} alt={comment.name} />
                        </div>
                        <div className="content">
                          <div className="head d-flex flex-wrap gap-2 align-items-center justify-content-between">
                            <div className="con">
                              <h3>{comment.name}</h3>
                              <span>{comment.date}</span>
                            </div>
                            <div className="star">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <i className="fa-solid fa-star" key={star} />
                              ))}
                            </div>
                          </div>
                          <p className="mt-30 mb-4">{comment.text}</p>
                          <a href="#" className="reply">{tBlog('replyLabel')}</a>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="comment-form-wrap">
                  <h3>{tBlog('leaveCommentTitle')}</h3>
                  <form action="#" id="contact-form" method="POST">
                    <div className="row g-4">
                      <div className="col-lg-6">
                        <div className="form-clt">
                          <input type="text" placeholder={tBlog('namePlaceholder')} />
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="form-clt">
                          <input type="text" placeholder={tBlog('emailPlaceholder')} />
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="form-clt">
                          <textarea name="message" placeholder={tBlog('messagePlaceholder')} />
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <button type="submit" className="theme-btn">
                          {tBlog('submitLabel')} <i className="fa-solid fa-arrow-right" />
                        </button>
                      </div>
                    </div>
                  </form>
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
