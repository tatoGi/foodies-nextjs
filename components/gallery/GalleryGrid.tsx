import {useTranslations} from 'next-intl';
import {images, type BlockData} from '@/lib/blockData';

export default function GalleryGrid({data}: {data?: BlockData}) {
  const t = useTranslations('galleryPage');
  // The layout has 14 slots; a slot without a CMS photo keeps today's photo.
  const photos = images(data, 'images', []);

  const renderImage = (n: number, className = '') => (
    <div className={`gallery-iamge5${className ? ` ${className}` : ''}`}>
      <img src={photos[n - 1] ?? `/assets/img/home-4/g-${n}.jpg`} alt={t('imageAlt', {n})} />
    </div>
  );

  return (
    <div className="gallery-section-5 fix section-padding">
      <div className="container">
        <div className="row g-3">
          <div className="col-xl-6 col-lg-6 col-md-6">
            <div className="row g-3">
              <div className="col-xl-6">
                {renderImage(1, 'mb-3')}
                {renderImage(2, 'mb-3')}
                {renderImage(3)}
              </div>
              <div className="col-xl-6">
                {renderImage(4, 'mb-3')}
                {renderImage(5, 'mb-3')}
                {renderImage(6)}
              </div>
            </div>
            {renderImage(13, 'mt-3')}
          </div>
          <div className="col-xl-6 col-lg-6 col-md-6">
            <div className="row">
              <div className="col-xl-6">{renderImage(7, 'mb-3')}</div>
              <div className="col-xl-6">{renderImage(8, 'mb-3')}</div>
            </div>
            {renderImage(9, 'mb-3')}
            <div className="row g-3">
              <div className="col-xl-6">
                {renderImage(10, 'mb-3')}
                {renderImage(14)}
              </div>
              <div className="col-xl-6">
                {renderImage(12, 'mb-3')}
                {renderImage(11, 'mb-3')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
