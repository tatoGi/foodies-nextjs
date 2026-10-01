'use client';

import {useLocale, useTranslations} from 'next-intl';
import {Link, usePathname} from '@/i18n/navigation';
import {accountApi} from '@/lib/client/account-api';

const ITEMS = [
  {href: '/account', key: 'overview', icon: 'fa-house'},
  {href: '/account/favorites', key: 'favorites', icon: 'fa-heart'},
  {href: '/account/addresses', key: 'addresses', icon: 'fa-location-dot'},
  {href: '/account/settings', key: 'settings', icon: 'fa-gear'}
] as const;

export default function AccountNav({name, email}: {name: string; email: string}) {
  const t = useTranslations('account.nav');
  const locale = useLocale();
  const pathname = usePathname();

  async function logout() {
    await accountApi('logout', {locale});
    window.location.assign(`/${locale}`);
  }

  return (
    <aside className="acc-side">
      <div className="acc-member">
        <span className="acc-avatar" aria-hidden="true">{name.trim().charAt(0).toUpperCase()}</span>
        <div className="acc-member__text">
          <strong>{name}</strong>
          <small>{email}</small>
        </div>
      </div>
      <nav className="acc-nav" aria-label={t('overview')}>
        {ITEMS.map((item) => (
          <Link key={item.href} href={item.href} className={pathname === item.href ? 'is-active' : undefined} aria-current={pathname === item.href ? 'page' : undefined}>
            <i className={`fa-regular ${item.icon}`} aria-hidden="true" />
            {t(item.key)}
          </Link>
        ))}
        <button type="button" onClick={logout}>
          <i className="fa-regular fa-right-from-bracket" aria-hidden="true" />
          {t('logout')}
        </button>
      </nav>
    </aside>
  );
}
