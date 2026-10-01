'use client';

import {useLocale, useTranslations} from 'next-intl';
import {Link, usePathname} from '@/i18n/navigation';
import {accountApi} from '@/lib/client/account-api';

const ITEMS = [
  {href: '/account', key: 'overview'},
  {href: '/account/favorites', key: 'favorites'},
  {href: '/account/addresses', key: 'addresses'},
  {href: '/account/settings', key: 'settings'}
] as const;

export default function AccountNav() {
  const t = useTranslations('account.nav');
  const locale = useLocale();
  const pathname = usePathname();

  async function logout() {
    await accountApi('logout', {locale});
    window.location.assign(`/${locale}`);
  }

  return (
    <nav className="account-nav" aria-label={t('overview')}>
      {ITEMS.map((item) => (
        <Link key={item.href} href={item.href} className={pathname === item.href ? 'is-active' : undefined}>
          {t(item.key)}
        </Link>
      ))}
      <button type="button" onClick={logout}>{t('logout')}</button>
    </nav>
  );
}
