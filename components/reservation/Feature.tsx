import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';

export default function Feature() {
  const t = useTranslations('reservationPage.feature');
  const tCommon = useTranslations('common');
  const items = t.raw('items') as {icon: string; title: string; description: string}[];

  return (
    <section className="feature-section fix">
      <div className="row g-0">
        {items.map((item, index) => (
          <div
            key={item.title}
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
                <Link href="/contact" className="theme-btn theme-bg-2 ">
                  {tCommon('orderNow')} <i className="fa-solid fa-basket-shopping" />
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
