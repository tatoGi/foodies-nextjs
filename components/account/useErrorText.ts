'use client';

import {useCallback} from 'react';
import {useTranslations} from 'next-intl';

/** Localized text for a BFF error code; unknown codes get the generic message. Stable across renders (safe in effect deps). */
export function useErrorText() {
  const t = useTranslations('account.errors');
  return useCallback((error: {code: string}) => (t.has(error.code) ? t(error.code) : t('generic')), [t]);
}
