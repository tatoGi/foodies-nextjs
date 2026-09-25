import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {link, image, text, type BlockData} from '@/lib/blockData';

export default function SpecialMenuBanner({data}: {data?: BlockData}) {
  const t = useTranslations('menuPage.banner');
  const tCommon = useTranslations('common');

  return (
    <section className="special-menu-banner-two fix section-padding image-moving pt-0">
      <div className="shape d-none d-xxl-block float-bob-y">
        <img src="/assets/img/home-2/shape9.png" alt="" />
      </div>
      <div className="shape-2 d-none d-xxl-block float-bob-y">
        <img src="/assets/img/home-2/shape10.png" alt="" />
      </div>
      <div className="container">
        <div
          className="special-menu-banner-wrapper-two bg-cover"
          style={{backgroundImage: `url('${image(data, 'background_image', '/assets/img/home-2/offer-bg.jpg')}')`}}
        >
          <div className="content">
            <span className="sub-text">{text(data, 'sub_text', t('subText'))}</span>
            <h2 className="split-title">{text(data, 'title', t('title'))}</h2>
            <p>{text(data, 'text', t('text'))}</p>
          </div>
          <div className="pizza-image">
            <img src={image(data, 'image', '/assets/img/home-2/pizza-image.png')} alt="" className="tilt_scale" />
          </div>
          <Link href={link(data, 'button_link', '/contact')} className="theme-btn small-btn">
            {text(data, 'button_text', tCommon('orderNow'))} <i className="fa-solid fa-basket-shopping" />
          </Link>
          <div className="vec-shape float-bob-x">
            <img src="/assets/img/home-2/vec.png" alt="" />
          </div>
          <div className="shape-3">
            <img src="/assets/img/home-2/shape3.png" alt="" />
          </div>
        </div>
      </div>
    </section>
  );
}
