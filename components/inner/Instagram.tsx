import {useTranslations} from 'next-intl';

const IMAGES = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const GROUPS = [0, 1, 2];

export default function Instagram() {
  const t = useTranslations('instagram');

  return (
    <div className="instagram-section fix pb-3">
      <div className="marquee">
        {GROUPS.map((group) => (
          <div className="marquee-group" key={group}>
            {IMAGES.map((n) => (
              <div className="instagram-image" key={`${group}-${n}`}>
                <img src={`/assets/img/home-2/instagram-image-${n}.jpg`} alt={t('imageAlt', {n})} className="hover-img" />
                <img src={`/assets/img/home-2/instagram-image-${n}.jpg`} alt={t('imageAlt', {n})} className="hover-img" />
                <a href="#" className="icon">
                  <img src="/assets/img/home-2/instagram.png" alt="" />
                </a>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
