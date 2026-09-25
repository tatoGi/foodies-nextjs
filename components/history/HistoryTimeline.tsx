import {useTranslations} from 'next-intl';
import {image, rows, text, type BlockData} from '@/lib/blockData';

interface HistoryEntry {
  year: string;
  title: string;
  text: string;
  image: string;
}

export default function HistoryTimeline({data}: {data?: BlockData}) {
  const t = useTranslations('history.timeline');
  const fallback = t.raw('entries') as HistoryEntry[];
  const cmsEntries = rows(data, 'entries').map((row, i) => ({
    year: text(row, 'year', ''),
    title: text(row, 'title', ''),
    text: text(row, 'text', ''),
    image: image(row, 'image', fallback[i]?.image ?? fallback[0]?.image ?? '')
  }));
  const entries = cmsEntries.length > 0 ? cmsEntries : fallback;

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
                key={`${entry.year}-${index}`}
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
