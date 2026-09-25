import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {link, image, lines, text, type BlockData} from '@/lib/blockData';

export default function DiscountFood({data}: {data?: BlockData}) {
  const t = useTranslations('discountFood');
  const tCommon = useTranslations('common');
  const buttonText = text(data, 'button_text', tCommon('orderNow'));
  const buttonLink = link(data, 'button_link', '/menu');
  const banner3Title = lines(
    text(data, 'banner3_title', [t('banner3Title'), t('banner3TitleLine2'), t('banner3TitleLine3')].join('\n'))
  );

  return (
    <section className="discount-food-section fix section-padding pt-0">
      <div className="container">
        <div className="row g-3">
          <div className="col-xl-8">
            <div
              className="discount-food-banner-1 bg-cover wow fadeInUp"
              data-wow-delay=".3s"
              style={{backgroundImage: `url('${image(data, 'banner1_image', '/assets/img/home-1/food-banner-1.jpg')}')`}}
            >
              <div className="sticker-image">
                <img src="/assets/img/home-1/sticker.png" alt="" />
              </div>
              <div className="content-box">
                <div className="content">
                  <span>{text(data, 'banner1_label', t('limitedTime'))}</span>
                  <h2 className="title">{text(data, 'banner1_title', t('offer50'))}</h2>
                </div>
                <Link href={buttonLink} className="theme-btn small-btn">
                  {buttonText} <i className="fa-solid fa-basket-shopping" />
                </Link>
              </div>
            </div>
            <div className="row g-3">
              <div className="col-lg-6 wow fadeInUp" data-wow-delay=".5s">
                <div
                  className="discount-food-banner-2 bg-cover"
                  style={{backgroundImage: `url('${image(data, 'banner2_background', '/assets/img/home-1/food-banner-2.jpg')}')`}}
                >
                  <div className="content">
                    <span className="sub-text">{text(data, 'banner2_label', t('today'))}</span>
                    <h2>
                      {text(data, 'banner2_title', t('specialMenuTitle'))} <br />
                      <span>{text(data, 'banner2_accent', t('specialMenuAccent'))}</span>
                    </h2>
                    <p>{text(data, 'banner2_text', t('thisWeekendOnly'))}</p>
                  </div>
                  <div className="food-image">
                    <img src={image(data, 'banner2_image', '/assets/img/home-1/food-menu2.png')} alt="" />
                    <div className="discount-box">
                      <img src="/assets/img/home-1/discount-box.png" alt="" />
                      <div className="cont">
                        <p>{text(data, 'banner2_price_label', t('only'))}</p>
                        <span>{text(data, 'banner2_price', t('price19'))}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 wow fadeInUp" data-wow-delay=".7s">
                <div className="discount-food-banner-3">
                  <img src={image(data, 'banner3_image', '/assets/img/home-1/food-banner-3.jpg')} alt="" />
                  <h2 className="title">
                    {banner3Title.map((line, i) => (
                      <span key={line}>
                        {i > 0 ? <br /> : null}
                        {line}
                      </span>
                    ))}
                  </h2>
                  <div className="shape1">
                    <img src="/assets/img/home-1/shape1.png" alt="" />
                  </div>
                  <div className="shape2">
                    <img src="/assets/img/home-1/shape2.png" alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-4 wow fadeInUp" data-wow-delay=".9s">
            <div
              className="discount-food-banner-4 bg-cover"
              style={{backgroundImage: `url('${image(data, 'banner4_background', '/assets/img/home-1/food-banner-4.jpg')}')`}}
            >
              <div className="content">
                <span className="menu-text">{text(data, 'banner4_label', t('specialMenu'))}</span>
                <h2>{text(data, 'banner4_title', t('chesseyPizza'))}</h2>
                <h3>{text(data, 'banner4_subtitle', t('chefSpecial'))}</h3>
                <Link href={buttonLink} className="theme-btn small-btn">
                  {buttonText} <i className="fa-solid fa-basket-shopping" />
                </Link>
              </div>
              <div className="thumb">
                <img src={image(data, 'banner4_image', '/assets/img/home-1/pizza-discount.png')} alt="" />
              </div>
            </div>
          </div>
        </div>
        <div className="dis-shape">
          <img src="/assets/img/home-1/shape-5.png" alt="" />
        </div>
      </div>
    </section>
  );
}
