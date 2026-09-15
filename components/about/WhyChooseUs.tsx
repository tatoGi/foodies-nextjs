import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';

export default function WhyChooseUs() {
  const t = useTranslations('about.whyChooseUs');
  const listOne = t.raw('listOne') as string[];
  const listTwo = t.raw('listTwo') as string[];

  return (
    <section className="why-choose-us-section-4 section-padding">
      <div className="left-shape float-bob-y">
        <img src="/assets/img/home-4/choose-1.png" alt="" />
      </div>
      <div className="right-shape float-bob-y">
        <img src="/assets/img/home-4/choose-2.png" alt="" />
      </div>
      <div className="container">
        <div className="why-choose-us-wrapper-4">
          <div className="row g-4 align-items-center">
            <div className="col-lg-6 wow fadeInUp" data-wow-delay=".3s">
              <div className="burger-image float-bob-y">
                <img src="/assets/img/home-4/burger-1.png" alt="" />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="choose-us-content">
                <div className="section-title mb-0">
                  <span className="sub-title tz-sub-tilte tz-sub-anim tx-subTitle">{t('subTitle')}</span>
                  <h2 className="tx-title sec_title tz-itm-title tz-itm-anim">
                    {t('title')} <br /> {t('titleLine2')}
                  </h2>
                  <div className="sec-line mt-3 mb-4">
                    <img src="/assets/img/home-1/sec-line.png" alt="" />
                  </div>
                </div>
                <p className="text wow fadeInUp" data-wow-delay=".3s">
                  {t('description')}
                </p>
                <div className="choose-us-box">
                  <ul className="list wow fadeInUp" data-wow-delay=".3s">
                    {listOne.map((item) => (
                      <li key={item}>
                        <i className="fa-solid fa-chevrons-right" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <ul className="list wow fadeInUp" data-wow-delay=".5s">
                    {listTwo.map((item) => (
                      <li key={item}>
                        <i className="fa-solid fa-chevrons-right" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="choose-button wow fadeInUp" data-wow-delay=".7s">
                  <Link href="/contact" className="theme-btn theme-bg-2">
                    {t('orderNow')} <i className="fa-solid fa-basket-shopping" />
                  </Link>
                  <Link href="/contact" className="theme-btn small-btn">
                    {t('reserveTable')} <i className="fa-regular fa-arrow-up-right" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
