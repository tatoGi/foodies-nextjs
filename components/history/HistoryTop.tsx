import {useTranslations} from 'next-intl';
import {image, text, type BlockData} from '@/lib/blockData';

export default function HistoryTop({data}: {data?: BlockData}) {
  const t = useTranslations('history.top');

  return (
    <section className="history-top-section section-padding fix">
      <div className="shape-1">
        <img src="/assets/img/inner/history-shape-1.png" alt="" />
      </div>
      <div className="shape-2">
        <img src="/assets/img/inner/history-shape-2.png" alt="" />
      </div>
      <div className="container">
        <div className="section-title text-center mb-0">
          <span className="sub-title tz-sub-tilte tz-sub-anim tx-subTitle">{text(data, 'sub_title', t('subTitle'))}</span>
          <h2 className="tx-title sec_title tz-itm-title tz-itm-anim">{text(data, 'title', t('title'))}</h2>
          <div className="sec-line mt-3 mb-4">
            <img src="/assets/img/home-1/sec-line.png" alt="img" />
          </div>
          <p>{text(data, 'description', t('description'))}</p>
          <div className="client-img mt-5">
            <img src={image(data, 'image', '/assets/img/inner/history-client-01.png')} alt="" />
          </div>
          <div className="client-sing mt-4">
            <img src={image(data, 'signature_image', '/assets/img/inner/history-client-sing.png')} alt="" />
          </div>
        </div>
      </div>
    </section>
  );
}
