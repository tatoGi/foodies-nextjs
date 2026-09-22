import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {getSiteChrome} from '@/lib/cms';

export default async function Breadcrumb({title, currentLabel}: {title: string; currentLabel: string}) {
  const t = await getTranslations('breadcrumb');
  const chrome = await getSiteChrome();
  const image = chrome.breadcrumbImage
    ? `linear-gradient(rgba(28, 23, 20, 0.55), rgba(28, 23, 20, 0.55)), url("${chrome.breadcrumbImage}")`
    : undefined;

  return (
    <div
      className="breadcrumb-wrapper hero-ptb image-distortion p-relative z-index-1"
      style={{
        backgroundColor: chrome.breadcrumbColor,
        backgroundImage: image,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
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
