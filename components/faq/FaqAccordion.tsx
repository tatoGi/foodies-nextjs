import {useTranslations} from 'next-intl';
import {rows, text, type BlockData} from '@/lib/blockData';

export default function FaqAccordion({data}: {data?: BlockData}) {
  const t = useTranslations('faq');
  const cmsItems = rows(data, 'items')
    .map((row) => ({question: text(row, 'question', ''), answer: text(row, 'answer', '')}))
    .filter((item) => item.question !== '');
  const items = cmsItems.length > 0 ? cmsItems : (t.raw('items') as {question: string; answer: string}[]);

  return (
    <section className="faq-section fix section-padding">
      <div className="container">
        <div className="section-title text-center mb-0">
          <span className="sub-title tz-sub-tilte tz-sub-anim tx-subTitle">{text(data, 'sub_title', t('subTitle'))}</span>
          <h2 className="tx-title sec_title tz-itm-title tz-itm-anim">{text(data, 'title', t('title'))}</h2>
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
