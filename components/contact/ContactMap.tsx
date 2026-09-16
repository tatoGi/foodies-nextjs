import {useTranslations} from 'next-intl';

export default function ContactMap() {
  const t = useTranslations('contactPage.map');

  return (
    <section className="contact-map-section-in section-padding fix pt-0">
      <div className="container">
        <div className="row g-4">
          <div className="col-xl-6 col-lg-6">
            <div className="google-map-items">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6678.7619084840835!2d144.9618311901502!3d-37.81450084255415!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642b4758afc1d%3A0x3119cc820fdfc62e!2sEnvato!5e0!3m2!1sen!2sbd!4v1641984054261!5m2!1sen!2sbd"
                style={{border: 0}}
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
          <div className="col-xl-6 col-lg-6">
            <div className="contact-right-content-in">
              <div className="contact-box">
                <div className="section-title mb-0">
                  <span className="sub-title text-white tz-sub-tilte tz-sub-anim tx-subTitle">{t('subTitle')}</span>
                  <h2 className="tx-title text-white sec_title tz-itm-title tz-itm-anim">{t('title')}</h2>
                  <div className="sec-line mt-3 mb-4">
                    <img src="/assets/img/inner/white-sec-line.png" alt="img" />
                  </div>
                  <p className="text-white">{t('description')}</p>
                </div>
              </div>
              <form action="#" id="contact-form" className="contact-form-box">
                <div className="row g-4 align-items-center justify-content-center">
                  <div className="col-lg-6 col-md-6 wow fadeInUp" data-wow-delay=".2s">
                    <div className="form-clt">
                      <input type="text" placeholder={t('namePlaceholder')} />
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 wow fadeInUp" data-wow-delay=".3s">
                    <div className="form-clt">
                      <input type="text" placeholder={t('emailPlaceholder')} />
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 wow fadeInUp" data-wow-delay=".4s">
                    <div className="form-clt">
                      <input type="text" placeholder={t('phonePlaceholder')} />
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 wow fadeInUp" data-wow-delay=".5s">
                    <div className="form-clt">
                      <input type="text" placeholder={t('selectSubjectPlaceholder')} />
                    </div>
                  </div>
                  <div className="col-lg-12 wow fadeInUp" data-wow-delay=".6s">
                    <div className="form-clt">
                      <input type="text" placeholder={t('subjectPlaceholder')} />
                    </div>
                  </div>
                  <div className="col-lg-12 wow fadeInUp" data-wow-delay=".8s">
                    <div className="form-clt">
                      <textarea name="message" placeholder={t('messagePlaceholder')} />
                    </div>
                  </div>
                  <div className="col-lg-12 wow fadeInUp" data-wow-delay=".9s">
                    <div className="contact-button">
                      <button type="submit" className="theme-btn">
                        {t('submitLabel')}
                        <i className="far fa-arrow-right" />
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
