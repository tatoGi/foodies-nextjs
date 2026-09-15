import {useTranslations} from 'next-intl';

export default function Cta() {
  const t = useTranslations('cta');

  return (
    <section className="cta-section-4 section-padding pb-0 bg-white">
      <div className="shape-1 d-none d-xl-block">
        <img src="/assets/img/home-2/footer-shape1.png" alt="" />
      </div>
      <div className="shape-2 d-none d-xl-block">
        <img src="/assets/img/home-2/footer-shape3.png" alt="" />
      </div>
      <div className="shape-3 d-none d-xl-block float-bob-y">
        <img src="/assets/img/home-2/footer-shape2.png" alt="" />
      </div>
      <div className="container">
        <div className="row g-6">
          <div className="cta-from-content">
            <div className="section-title text-center mb-0">
              <span className="sub-title tz-sub-tilte tz-sub-anim tx-subTitle">{t('subTitle')}</span>
              <h2 className="tx-title sec_title tz-itm-title tz-itm-anim">
                {t('title')} <span>{t('titleAccent')}</span> {t('titleEnd')}
              </h2>
              <div className="sec-line mt-3 mb-4">
                <img src="/assets/img/home-1/sec-line.png" alt="" />
              </div>
              <p className="wow fadeInUp" data-wow-delay=".3s">{t('description')}</p>
            </div>
            <div className="content wow fadeInUp" data-wow-delay=".5s">
              <form action="#">
                <input type="text" placeholder={t('emailPlaceholder')} />
                <button className="email-btn" type="submit">{t('subscribe')}</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
