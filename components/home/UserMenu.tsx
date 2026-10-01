'use client';

import {useEffect, useRef, useState} from 'react';
import {useLocale, useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {accountApi} from '@/lib/client/account-api';

type Me = {user: {name: string; email: string}};

/**
 * Header account icon. Signed out: a user icon that opens the sign-in page.
 * Signed in: the first letter of the name, with a dropdown of quick links.
 * The session is checked in the browser so header pages stay cacheable.
 */
export default function UserMenu() {
  const t = useTranslations('account.menu');
  const locale = useLocale();
  const [user, setUser] = useState<Me['user'] | null>(null);
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    accountApi<Me>('me', {method: 'GET', locale}).then((result) => {
      if (active && result.ok) {
        setUser(result.data.user);
      }
    });
    return () => {
      active = false;
    };
  }, [locale]);

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent ? event.key === 'Escape' : !root.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', close);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', close);
    };
  }, [open]);

  async function logout() {
    await accountApi('logout', {locale});
    window.location.assign(`/${locale}`);
  }

  if (!user) {
    return (
      <Link href="/login" className="shop-icon" aria-label={t('signIn')}>
        <i className="fa-regular fa-user" />
      </Link>
    );
  }

  return (
    <div className="user-menu" ref={root}>
      <button type="button" className="shop-icon user-menu__button" aria-haspopup="menu" aria-expanded={open} aria-label={user.name} onClick={() => setOpen((value) => !value)}>
        {user.name.trim().charAt(0).toUpperCase()}
      </button>
      {open ? (
        <div className="user-menu__panel" role="menu">
          <div className="user-menu__head">
            <strong>{user.name}</strong>
            <small>{user.email}</small>
          </div>
          <Link href="/account" role="menuitem" onClick={() => setOpen(false)}><i className="fa-regular fa-user" />{t('profile')}</Link>
          <Link href="/account/favorites" role="menuitem" onClick={() => setOpen(false)}><i className="fa-regular fa-heart" />{t('favorites')}</Link>
          <Link href="/account/addresses" role="menuitem" onClick={() => setOpen(false)}><i className="fa-regular fa-location-dot" />{t('addresses')}</Link>
          <button type="button" role="menuitem" onClick={logout}><i className="fa-regular fa-right-from-bracket" />{t('logout')}</button>
        </div>
      ) : null}
    </div>
  );
}
