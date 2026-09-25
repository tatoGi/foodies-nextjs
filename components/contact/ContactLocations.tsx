import {useTranslations} from 'next-intl';
import {image, rows, text, type BlockData} from '@/lib/blockData';

export default function ContactLocations({data}: {data?: BlockData}) {
  const t = useTranslations('contactPage');
  const locations = t.raw('locations') as {
    icon: string;
    title: string;
    findUsLabel: string;
    address: string;
    mailUsLabel: string;
    email: string;
    callUsLabel: string;
    phone: string;
  }[];
  const cmsLocations = rows(data, 'locations').map((row, i) => ({
    icon: image(row, 'icon', locations[i]?.icon ?? '/assets/img/inner/contact-flag-1.png'),
    title: text(row, 'title', ''),
    findUsLabel: text(row, 'find_us_label', locations[0]?.findUsLabel ?? ''),
    address: text(row, 'address', ''),
    mailUsLabel: text(row, 'mail_us_label', locations[0]?.mailUsLabel ?? ''),
    email: text(row, 'email', ''),
    callUsLabel: text(row, 'call_us_label', locations[0]?.callUsLabel ?? ''),
    phone: text(row, 'phone', '')
  }));
  const shown = cmsLocations.length > 0 ? cmsLocations : locations;

  return (
    <section className="contact-flag-section-in section-padding fix">
      <div className="container">
        <div className="row g-4">
          {shown.map((location, index) => (
            <div
              key={`${location.title}-${index}`}
              className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp"
              data-wow-delay={`${0.3 + index * 0.2}s`}
            >
              <div className="contact-flag-box-in text-center">
                <div className="icon">
                  <img src={location.icon} alt="" />
                </div>
                <h2 className="title">{location.title}</h2>
                <div className="content-item">
                  <h3 className="title-2">{location.findUsLabel}</h3>
                  <p>{location.address}</p>
                </div>
                <div className="content-item style-2">
                  <h3 className="title-2">{location.mailUsLabel}</h3>
                  <p>
                    <a href={`mailto:${location.email}`}>{location.email}</a>
                  </p>
                </div>
                <div className="content-item style-2">
                  <h3 className="title-2">{location.callUsLabel}</h3>
                  <p>
                    <a href={`tel:${location.phone.replace(/\s+/g, '')}`}>{location.phone}</a>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
