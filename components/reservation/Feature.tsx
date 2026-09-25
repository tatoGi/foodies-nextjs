import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {image, rows, text, type BlockData} from '@/lib/blockData';

export default function Feature({data}: {data?: BlockData}) {
  const t = useTranslations('reservationPage.feature');
  const tCommon = useTranslations('common');
  const fallback = t.raw('items') as {icon: string; title: string; description: string}[];
  const cmsItems = rows(data, 'items').map((row, i) => ({
    icon: image(row, 'icon', fallback[i]?.icon ?? fallback[0]?.icon ?? ''),
    title: text(row, 'title', ''),
    description: text(row, 'description', '')
  }));
  const items = cmsItems.length > 0 ? cmsItems : fallback;

  return (
    <section className="feature-section fix">
      <div className="row g-0">
        {items.map((item, index) => (
          <div
            key={`${item.title}-${index}`}
            className="col-xl-3 col-lg-4 col-md-6 col-sm-6 wow fadeInUp"
            data-wow-delay={`${0.2 + index * 0.2}s`}
          >
            <div className={`feature-box-items style-two${index === 1 ? ' active' : ''}`}>
              <div className="icon">
                <img src={item.icon} alt="" />
              </div>
              <div className="content">
                <h2 className="title">{item.title}</h2>
                <p>{item.description}</p>
                <Link href={text(data, 'button_link', '/contact')} className="theme-btn theme-bg-2 ">
                  {text(data, 'button_text', tCommon('orderNow'))} <i className="fa-solid fa-basket-shopping" />
                </Link>
              </div>
              <span className="number">{String(index + 1).padStart(2, '0')}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
