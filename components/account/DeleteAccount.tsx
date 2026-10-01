'use client';

import {useState, type FormEvent} from 'react';
import {useLocale, useTranslations} from 'next-intl';
import {accountApi} from '@/lib/client/account-api';
import PasswordInput from './PasswordInput';
import {useErrorText} from './useErrorText';

export default function DeleteAccount({hasPassword}: {hasPassword: boolean}) {
  const t = useTranslations('account');
  const locale = useLocale();
  const errorText = useErrorText();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    const password = new FormData(event.currentTarget).get('password');
    const result = await accountApi('me', {method: 'DELETE', body: {password: password ?? null}, locale});
    if (result.ok) {
      window.location.assign(`/${locale}`);
      return;
    }
    setBusy(false);
    setError(errorText(result.error));
  }

  if (!open) {
    return (
      <button type="button" className="account-btn account-btn--ghost" onClick={() => setOpen(true)}>
        {t('settings.delete')}
      </button>
    );
  }

  return (
    <form className="account-form" onSubmit={submit}>
      <p className="account-note">{t('settings.deleteWarning')}</p>
      {hasPassword ? (
        <div className="account-field">
          <label htmlFor="delete-password">{t('fields.password')}</label>
          <PasswordInput id="delete-password" name="password" autoComplete="current-password" required />
        </div>
      ) : null}
      {error ? <p className="account-error" role="alert">{error}</p> : null}
      <button type="submit" className="account-btn account-btn--danger" disabled={busy}>{t('settings.deleteConfirm')}</button>
    </form>
  );
}
