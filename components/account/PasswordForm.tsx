'use client';

import {useState, type FormEvent} from 'react';
import {useLocale, useTranslations} from 'next-intl';
import {useRouter} from '@/i18n/navigation';
import {accountApi} from '@/lib/client/account-api';
import PasswordInput from './PasswordInput';
import {useErrorText} from './useErrorText';

export default function PasswordForm({hasPassword}: {hasPassword: boolean}) {
  const t = useTranslations('account');
  const locale = useLocale();
  const router = useRouter();
  const errorText = useErrorText();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const password = String(form.get('password') ?? '');
    if (password.length < 8) {
      setError(t('errors.passwordShort'));
      return;
    }
    setBusy(true);
    setError('');
    setMessage('');
    const result = await accountApi('me/password', {method: 'PUT', body: {current_password: form.get('current_password') ?? null, password}, locale});
    setBusy(false);
    if (result.ok) {
      formElement.reset();
      setMessage(t('settings.passwordChanged'));
      router.refresh();
    } else {
      setError(errorText(result.error));
    }
  }

  return (
    <form className="account-form" onSubmit={submit}>
      {hasPassword ? (
        <div className="account-field">
          <label htmlFor="pw-current">{t('fields.currentPassword')}</label>
          <PasswordInput id="pw-current" name="current_password" autoComplete="current-password" required />
        </div>
      ) : null}
      <div className="account-field">
        <label htmlFor="pw-new">{t('fields.newPassword')}</label>
        <PasswordInput id="pw-new" name="password" autoComplete="new-password" minLength={8} required />
        <small>{t('fields.passwordHint')}</small>
      </div>
      {message ? <p className="account-note">{message}</p> : null}
      {error ? <p className="account-error" role="alert">{error}</p> : null}
      <button type="submit" className="account-btn" disabled={busy}>
        {hasPassword ? t('settings.changePassword') : t('settings.setPassword')}
      </button>
    </form>
  );
}
