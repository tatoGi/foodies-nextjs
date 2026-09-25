import {useTranslations} from 'next-intl';
import {image, text, type BlockData} from '@/lib/blockData';
import LogoMark from '@/components/shared/LogoMark';

export default function ComboOffer({data}: {data?: BlockData}) {
  const t = useTranslations('reservationPage.comboOffer');
  const peopleOptions = t.raw('peopleOptions') as string[];
  const phone = text(data, 'support_phone', t('supportPhone'));

  return (
    <section
      className="comboo-offer-section-two section-padding bg-cover pb-0"
      style={{backgroundImage: `url('${image(data, 'background_image', '/assets/img/home-2/comboo-offer-bg.jpg')}')`}}
    >
      <div className="shape-1">
        <img src="/assets/img/home-2/shape13.png" alt="" />
      </div>
      <div className="shape-2">
        <img src="/assets/img/home-2/shape14.png" alt="" />
      </div>
      <div className="shape-3 d-none d-xl-block">
        <img src="/assets/img/home-2/shape15.png" alt="" />
      </div>
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-6">
            <div className="comboo-offer-content-two">
              <div className="section-title mb-0">
                <span className="sub-title tz-sub-tilte tz-sub-anim tx-subTitle">{text(data, 'sub_title', t('subTitle'))}</span>
                <h2 className="tx-title sec_title  tz-itm-title tz-itm-anim text-white">{text(data, 'title', t('title'))}</h2>
                <div className="sec-line mt-3">
                  <img src="/assets/img/home-1/sec-line.png" alt="" />
                </div>
              </div>
              <p className="text wow fadeInUp" data-wow-delay=".3s">
                {text(data, 'description', t('description'))}
              </p>
              <div className="info-items wow fadeInUp" data-wow-delay=".5s">
                <div className="icon">
                  <img src="/assets/img/home-2/support.png" alt="" />
                </div>
                <div className="info-content">
                  <span>{text(data, 'support_label', t('supportLabel'))}</span>
                  <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="number">
                    {phone}
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="comboo-contact-form wow fadeInUp" data-wow-delay=".3s">
              <div className="shape1">
                <img src="/assets/img/home-2/shape16.png" alt="" />
              </div>
              <div className="shape2">
                <img src="/assets/img/home-2/shape17.png" alt="" />
              </div>
              <div className="logo">
                <LogoMark size="md" />
              </div>
              <h2 className="title">{text(data, 'form_title', t('formTitle'))}</h2>
              <p className="text">{text(data, 'form_description', t('formDescription'))}</p>
              <form action="#">
                <div className="row g-4">
                  <div className="col-lg-6 col-md-6">
                    <div className="form-clt">
                      <input type="text" placeholder={t('namePlaceholder')} />
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6">
                    <div className="form-clt">
                      <input type="text" placeholder={t('emailPlaceholder')} />
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6">
                    <div className="form-clt">
                      <div className="form">
                        <select className="single-select w-100">
                          {peopleOptions.map((option) => (
                            <option key={option}>{option}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6">
                    <div className="form-clt">
                      <input type="date" className="form-control" />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-clt">
                      <div className="form">
                        <select className="single-select w-100">
                          <option>{t('timeSelectPlaceholder')}</option>
                          <option>{t('timeSelectPlaceholder')}</option>
                          <option>{t('timeSelectPlaceholder')}</option>
                          <option>{t('timeSelectPlaceholder')}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-clt">
                      <button type="submit" className="theme-btn small-btn">
                        {t('submitLabel')} <i className="fa-light fa-arrow-up-right" />
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
