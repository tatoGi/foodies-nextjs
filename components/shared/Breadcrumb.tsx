import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';

export default function Breadcrumb({title, currentLabel}: {title: string; currentLabel: string}) {
  const t = useTranslations('breadcrumb');

  return (
    <div className="breadcrumb-wrapper hero-ptb image-distortion p-relative z-index-1" data-background="/assets/img/breadcrumb-bg.jpg">
      <div className="shape-1 d-none d-xl-block">
        <img src="/assets/img/shape-1.png" alt="" />
      </div>
      <div className="girl-shape d-none d-xl-block">
        <img src="/assets/img/girl-image.png" alt="" />
      </div>
      <div className="bottom-shape">
        <img src="/assets/img/bottom-shape.png" alt="" />
      </div>
      <div className="container">
        <div className="page-heading">
          <div className="breadcrumb-sub-title">
            <h1 className="breadcrumb-title text-white split-title">{title}</h1>
          </div>
          <ul className="breadcrumb-items wow fadeInUp" data-wow-delay=".5s">
            <li>
              <Link href="/">{t('homeLabel')}</Link>
            </li>
            <li>
              <i className="fa-regular fa-chevrons-right" />
            </li>
            <li>{currentLabel}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
