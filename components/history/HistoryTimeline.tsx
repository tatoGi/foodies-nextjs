import {useTranslations} from 'next-intl';

interface HistoryEntry {
  year: string;
  title: string;
  text: string;
  image: string;
}

export default function HistoryTimeline() {
  const t = useTranslations('history.timeline');
  const entries = t.raw('entries') as HistoryEntry[];

  return (
    <section className="history-food-list section-padding fix pt-0">
      <div className="container">
        <div className="history-food-list-wrap">
          {entries.map((entry, index) => {
            const reversed = index % 2 === 1;
            const thumb = (
              <div className="thumb">
                <img src={entry.image} alt="" />
              </div>
            );
            const yearIcon = (
              <div className={`year-icon${reversed ? ' style-2' : ''}`}>{entry.year}</div>
            );
            const content = (
              <div className="content">
                <h3 className="title">{entry.title}</h3>
                <p>{entry.text}</p>
              </div>
            );

            return (
              <div
                key={entry.year}
                className={`history-food-list-items${index === entries.length - 1 ? ' mb-0' : ''}`}
              >
                {reversed ? (
                  <>
                    {content}
                    {yearIcon}
                    {thumb}
                  </>
                ) : (
                  <>
                    {thumb}
                    {yearIcon}
                    {content}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
