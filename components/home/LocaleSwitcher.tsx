'use client';

import {useEffect, useRef} from 'react';
import {useLocale} from 'next-intl';
import {usePathname, getPathname} from '@/i18n/navigation';

const LOCALES = [
  {code: 'ka', label: 'ქართული'},
  {code: 'en', label: 'English'}
] as const;

export default function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const selectRef = useRef<HTMLSelectElement>(null);

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    navigateToLocale(event.target.value);
  }

  function navigateToLocale(nextLocale: string) {
    if (nextLocale === locale) return;
    const targetUrl = getPathname({href: pathname, locale: nextLocale});
    window.location.href = targetUrl;
  }

  useEffect(() => {
    const el = selectRef.current;
    if (!el) return;

    // jQuery/nice-select load via a `next/script` afterInteractive tag, which
    // can finish after this effect first runs. Poll briefly instead of
    // binding once, so the handler still attaches once jQuery shows up.
    let jq: any = (window as any).jQuery;
    let pollId: ReturnType<typeof setInterval> | null = null;

    const handler = () => {
      navigateToLocale(el.value);
    };

    function bind(instance: any) {
      instance(el).on('change', handler);
    }

    if (jq) {
      bind(jq);
    } else {
      pollId = setInterval(() => {
        jq = (window as any).jQuery;
        if (jq) {
          if (pollId) clearInterval(pollId);
          pollId = null;
          bind(jq);
        }
      }, 100);
    }

    return () => {
      if (pollId) clearInterval(pollId);
      if (jq) jq(el).off('change', handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, locale]);

  return (
    <select
      ref={selectRef}
      className="single-select w-100"
      defaultValue={locale}
      onChange={handleChange}
    >
      {LOCALES.map((l) => (
        <option key={l.code} value={l.code}>
          {l.label}
        </option>
      ))}
    </select>
  );
}
