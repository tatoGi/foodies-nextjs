import {useTranslations} from 'next-intl';

export default function ContactLocations() {
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

  return (
    <section className="contact-flag-section-in section-padding fix">
      <div className="container">
        <div className="row g-4">
          {locations.map((location, index) => (
            <div
              key={location.title}
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
