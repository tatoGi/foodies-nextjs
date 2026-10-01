import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {getAccountData, getCurrentUser} from '@/lib/server/auth';

export default async function AccountOverviewPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const [user, t, favorites, addresses] = await Promise.all([
    getCurrentUser(),
    getTranslations('account'),
    getAccountData<{items: unknown[]}>('me/favorites', locale),
    getAccountData<{addresses: unknown[]}>('me/addresses', locale)
  ]);
  if (!user) {
    return null;
  }

  const tiles = [
    {href: '/account/favorites', icon: 'fa-heart', label: t('nav.favorites'), count: favorites?.items.length ?? 0},
    {href: '/account/addresses', icon: 'fa-location-dot', label: t('nav.addresses'), count: addresses?.addresses.length ?? 0},
    {href: '/account/settings', icon: 'fa-gear', label: t('nav.settings'), count: null}
  ] as const;

  return (
    <div className="acc-stack">
      <section className="acc-hero">
        <span className="acc-avatar acc-avatar--lg" aria-hidden="true">{user.name.trim().charAt(0).toUpperCase()}</span>
        <div>
          <h2>{t('overview.greeting', {name: user.name})}</h2>
          <p>{t('overview.tagline')}</p>
        </div>
      </section>

      <div className="acc-tiles">
        {tiles.map((tile) => (
          <Link key={tile.href} href={tile.href} className="acc-tile">
            <i className={`fa-regular ${tile.icon}`} aria-hidden="true" />
            <span>{tile.label}</span>
            {tile.count !== null ? <b>{tile.count}</b> : null}
          </Link>
        ))}
      </div>

      <div className="acc-split">
        <section className="acc-panel">
          <h3>{t('overview.contact')}</h3>
          <dl className="acc-facts">
            <div><dt>{t('fields.email')}</dt><dd>{user.email}</dd></div>
            <div><dt>{t('fields.phone')}</dt><dd>{user.phone}</dd></div>
          </dl>
        </section>
        <section className="acc-panel">
          <h3>{t('overview.orders')}</h3>
          <p className="acc-muted">{t('overview.ordersSoon')}</p>
        </section>
      </div>
    </div>
  );
}
