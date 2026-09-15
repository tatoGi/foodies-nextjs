import {useTranslations} from 'next-intl';

export default function FaqAccordion() {
  const t = useTranslations('faq');
  const items = t.raw('items') as {question: string; answer: string}[];

  return (
    <section className="faq-section fix section-padding">
      <div className="container">
        <div className="section-title text-center mb-0">
          <span className="sub-title tz-sub-tilte tz-sub-anim tx-subTitle">{t('subTitle')}</span>
          <h2 className="tx-title sec_title tz-itm-title tz-itm-anim">{t('title')}</h2>
          <div className="sec-line mt-3">
            <img src="/assets/img/home-1/sec-line.png" alt="img" />
          </div>
        </div>
        <div className="faq-items-style-1">
          <ul className="accordion-box">
            {items.map((item, index) => (
              <li
                key={`${index}-${item.question}`}
                className={`accordion block wow fadeInUp${index === 0 ? ' active-block' : ''}`}
                data-wow-delay={`${0.2 + (index % 5) * 0.2}s`}
              >
                <div className={`acc-btn${index === 0 ? ' active' : ''}`}>
                  {item.question}
                  <div className="icon fa-regular fa-plus" />
                </div>
                <div className={`acc-content${index === 0 ? ' current' : ''}`}>
                  <div className="content">
                    <div className="text">{item.answer}</div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
