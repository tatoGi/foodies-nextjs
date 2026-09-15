import {useTranslations} from 'next-intl';

export default function Contact() {
  const t = useTranslations('contact');

  return (
    <section className="contact-section fix section-padding">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-6">
            <div className="contact-left-items-1">
              <div className="section-title mb-0">
                <span className="sub-title tz-sub-tilte tz-sub-anim tx-subTitle">{t('subTitle')}</span>
                <h2 className="tx-title sec_title tz-itm-title tz-itm-anim">{t('title')}</h2>
                <div className="sec-line mt-3">
                  <img src="/assets/img/home-1/sec-line.png" alt="" />
                </div>
              </div>
              <p className="text wow fadeInUp" data-wow-delay=".3s">{t('description')}</p>
              <div className="number-info wow fadeInUp" data-wow-delay=".5s">
                <p>{t('supportCenter')}</p>
                <h3 className="number">
                  <a href="tel:+17189044450">{t('phone')}</a>
                </h3>
              </div>
              <div className="row g-4">
                <div className="col-lg-6 col-md-6 wow fadeInUp" data-wow-delay=".3s">
                  <div className="contact-info-box-items active">
                    <h3>{t('headquarterLabel')}</h3>
                    <p>{t('headquarterAddress')}</p>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 wow fadeInUp" data-wow-delay=".5s">
                  <div className="contact-info-box-items">
                    <h3>{t('emailUsLabel')}</h3>
                    <a href="mailto:hellofodies@gmail.com">{t('emailPrimary')}</a>
                    <a href="mailto:fodies@gmail.com">{t('emailSecondary')}</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 wow fadeInUp" data-wow-delay=".3s">
            <div className="contact-image-1">
              <img src="/assets/img/home-1/contact-image.png" alt="" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
