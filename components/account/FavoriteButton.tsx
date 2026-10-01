'use client';

import {useEffect, useState, type MouseEvent} from 'react';
import {useLocale, useTranslations} from 'next-intl';
import {loadFavoriteIds, storeFavoriteIds} from '@/lib/client/favorites-cache';

export default function FavoriteButton({productId, className = ''}: {productId: number; className?: string}) {
  const t = useTranslations('account.favorites');
  const locale = useLocale();
  const [ids, setIds] = useState<Set<number> | null | undefined>(undefined);
  const active = Boolean(ids?.has(productId));

  useEffect(() => {
    loadFavoriteIds(locale).then(setIds);
  }, [locale]);

  async function toggle(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (!ids) {
      window.location.assign(`/${locale}/login?next=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    const response = active
      ? await fetch(`/api/account/favorites/${productId}?locale=${locale}`, {method: 'DELETE'})
      : await fetch(`/api/account/favorites?locale=${locale}`, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({product_id: productId})});
    if (!response.ok) {
      return;
    }
    const nextIds = new Set(ids);
    if (active) nextIds.delete(productId);
    else nextIds.add(productId);
    storeFavoriteIds(nextIds);
    setIds(nextIds);
  }

  if (!productId) {
    return null;
  }

  return (
    <button type="button" className={`favorite-btn${active ? ' is-active' : ''} ${className}`.trim()} onClick={toggle} aria-pressed={active} aria-label={active ? t('remove') : t('add')} title={active ? t('remove') : t('add')}>
      <i className={active ? 'fa-solid fa-heart' : 'fa-regular fa-heart'} />
    </button>
  );
}
