'use client';

import {useLocale} from 'next-intl';
import {usePathname, getPathname} from '@/i18n/navigation';

const LOCALES = [
  {code: 'ka', label: 'ქართ'},
  {code: 'en', label: 'EN'}
] as const;

export default function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  function navigateToLocale(nextLocale: string) {
    if (nextLocale === locale) return;
    const targetUrl = getPathname({href: pathname, locale: nextLocale});
    window.location.href = targetUrl;
  }

  return (
    <div style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
      {LOCALES.map((l, i) => (
        <span key={l.code} style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
          {i > 0 && <span style={{color: 'rgba(255,255,255,0.4)'}}>|</span>}
          <button
            type="button"
            onClick={() => navigateToLocale(l.code)}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: l.code === locale ? 'default' : 'pointer',
              color: l.code === locale ? 'var(--theme)' : 'var(--white)',
              fontWeight: l.code === locale ? 700 : 500,
              fontSize: '14px'
            }}
          >
            {l.label}
          </button>
        </span>
      ))}
    </div>
  );
}
