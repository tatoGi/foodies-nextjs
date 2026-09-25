import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {image, text, type BlockData} from '@/lib/blockData';

export default function BestDelivery({data}: {data?: BlockData}) {
  const t = useTranslations('bestDelivery');
  const tCommon = useTranslations('common');

  return (
    <section className="best-delivery-section fix section-padding">
      <div className="container">
        <div className="best-delivery-wrapper">
          <div className="row g-4">
            <div className="col-xl-4 col-lg-6 cols-item-1">
              <div className="content">
                <div className="section-title mb-0">
                  <span className="sub-title tz-sub-tilte tz-sub-anim tx-subTitle">{text(data, 'sub_title', t('subTitle'))}</span>
                  <h2 className="tx-title sec_title tz-itm-title tz-itm-anim">{text(data, 'title', t('title'))}</h2>
                  <div className="sec-line mt-3">
                    <img src="/assets/img/home-1/sec-line.png" alt="" />
                  </div>
                </div>
                <p className="text wow fadeInUp" data-wow-delay=".3s">{text(data, 'description', t('description'))}</p>
              </div>
            </div>
            <div className="col-xl-5 cols-item-3">
              <div className="delivery-items text-center">
                <div className="delivery-image float-bob-x">
                  <img src={image(data, 'image', '/assets/img/home-1/delivery-image.png')} alt="" />
                </div>
                <Link href={text(data, 'button_link', '/menu')} className="theme-btn small-btn">
                  {text(data, 'button_text', tCommon('orderNow'))} <i className="fa-solid fa-basket-shopping" />
                </Link>
              </div>
            </div>
            <div className="col-xl-3 col-lg-6 cols-item-2">
              <div className="content-2">
                <div className="section-title mb-0">
                  <span className="sub-title tz-sub-tilte tz-sub-anim tx-subTitle">{text(data, 'points_sub_title', t('earnPointsSubTitle'))}</span>
                  <h2 className="tx-title sec_title tz-itm-title tz-itm-anim">{text(data, 'points_title', t('earnPointsTitle'))}</h2>
                  <div className="sec-line mt-3">
                    <img src="/assets/img/home-1/sec-line.png" alt="" />
                  </div>
                </div>
                <div className="info-items wow fadeInUp" data-wow-delay=".5s">
                  <p>{text(data, 'info_text', t('infoText'))}</p>
                  <div className="info-img">
                    <img src="/assets/img/home-1/info.png" alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
