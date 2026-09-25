import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {link, image, text, type BlockData} from '@/lib/blockData';

export default function DiscountBanner({data}: {data?: BlockData}) {
  const t = useTranslations('about.discountBanner');

  return (
    <section
      className="discount-banner-section-4 fix hero-ptb image-distortion p-relative z-index-1"
      style={{backgroundImage: `url('${image(data, 'background_image', '/assets/img/home-4/banner-bg.jpg')}')`}}
    >
      <div className="bottom-shape">
        <img src="/assets/img/home-4/banner.png" alt="" />
      </div>
      <div className="tomato-shape float-bob-x">
        <img src="/assets/img/home-4/tomato-2.png" alt="" />
      </div>
      <div className="offer float-bob-y">
        <img src="/assets/img/home-4/offer.png" alt="" />
      </div>
      <div className="left-shape float-bob-y">
        <img src="/assets/img/home-4/rice.png" alt="" />
      </div>
      <div className="pizza-shape">
        <img src="/assets/img/home-4/pizza-5.png" alt="" />
      </div>
      <div className="container">
        <div className="row g-4 align-items-end">
          <div className="col-lg-6">
            <div className="discount-banner-content-4">
              <h2 className="tx-title sec_title tz-itm-title tz-itm-anim">{text(data, 'title', t('title'))}</h2>
              <p>{text(data, 'description', t('description'))}</p>
              <div className="red-image">
                <img src="/assets/img/home-4/red-shape.png" alt="" />
                <span>{text(data, 'discount_text', t('discountOffer'))}</span>
              </div>
              <Link href={link(data, 'button_link', '/menu')} className="theme-btn small-btn">
                {text(data, 'button_text', t('browseOffers'))} <i className="fa-regular fa-arrow-up-right" />
              </Link>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="right-content">
              <h2 className="tx-title sec_title tz-itm-title tz-itm-anim">{text(data, 'right_title', t('rightTitle'))}</h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
