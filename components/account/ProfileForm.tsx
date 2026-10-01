'use client';

import {useState, type FormEvent} from 'react';
import {useLocale, useTranslations} from 'next-intl';
import {useRouter} from '@/i18n/navigation';
import {accountApi} from '@/lib/client/account-api';
import type {AccountUser} from '@/lib/server/auth';
import {useErrorText} from './useErrorText';

export default function ProfileForm({user}: {user: AccountUser}) {
  const t = useTranslations('account');
  const locale = useLocale();
  const router = useRouter();
  const errorText = useErrorText();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    setError('');
    setMessage('');
    const result = await accountApi('me', {method: 'PUT', body: {name: form.get('name'), phone: form.get('phone')}, locale});
    setBusy(false);
    if (result.ok) {
      setMessage(t('settings.saved'));
      router.refresh();
    } else {
      setError(result.error.errors?.phone ? t('errors.phoneFormat') : errorText(result.error));
    }
  }

  return (
    <form className="account-form" onSubmit={submit}>
      <div className="account-field">
        <label htmlFor="profile-name">{t('fields.name')}</label>
        <input id="profile-name" name="name" defaultValue={user.name} autoComplete="name" required maxLength={255} />
      </div>
      <div className="account-field">
        <label htmlFor="profile-email">{t('fields.email')}</label>
        <input id="profile-email" value={user.email} disabled />
        <small>{t('settings.emailLocked')}</small>
      </div>
      <div className="account-field">
        <label htmlFor="profile-phone">{t('fields.phone')}</label>
        <input id="profile-phone" name="phone" type="tel" defaultValue={user.phone.replace(/^\+995/, '')} placeholder={t('fields.phoneHint')} required />
      </div>
      {message ? <p className="account-note">{message}</p> : null}
      {error ? <p className="account-error" role="alert">{error}</p> : null}
      <button type="submit" className="account-btn" disabled={busy}>{t('settings.save')}</button>
    </form>
  );
}
