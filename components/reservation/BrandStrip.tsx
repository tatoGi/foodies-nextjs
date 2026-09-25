import {images, type BlockData} from '@/lib/blockData';

const FALLBACK_LOGOS = [1, 2, 3, 4, 5, 6].map((n) => `/assets/img/home-3/b-${n}.png`);

export default function BrandStrip({data}: {data?: BlockData}) {
  const logos = images(data, 'logos', FALLBACK_LOGOS);

  return (
    <div className="brand-section-inner fix section-padding">
      <div className="container">
        <div className="brand-wrapper-3">
          <div className="swiper brand-slider-5">
            <div className="swiper-wrapper">
              {logos.map((src) => (
                <div className="swiper-slide" key={src}>
                  <div className="brand-image text-center">
                    <img src={src} alt="" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
