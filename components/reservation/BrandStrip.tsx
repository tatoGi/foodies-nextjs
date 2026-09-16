const BRAND_IMAGES = [1, 2, 3, 4, 5, 6];

export default function BrandStrip() {
  return (
    <div className="brand-section-inner fix section-padding">
      <div className="container">
        <div className="brand-wrapper-3">
          <div className="swiper brand-slider-5">
            <div className="swiper-wrapper">
              {BRAND_IMAGES.map((n) => (
                <div className="swiper-slide" key={n}>
                  <div className="brand-image text-center">
                    <img src={`/assets/img/home-3/b-${n}.png`} alt="" />
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
