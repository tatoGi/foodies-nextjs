'use client';

import {useState, type FormEvent} from 'react';
import {useLocale, useTranslations} from 'next-intl';
import {Link, useRouter} from '@/i18n/navigation';
import {accountApi} from '@/lib/client/account-api';
import GoogleButton from './GoogleButton';
import {rememberPendingEmail} from './pendingEmail';
import {useErrorText} from './useErrorText';

export default function LoginForm({next}: {next: string}) {
  const t = useTranslations('account');
  const locale = useLocale();
  const router = useRouter();
  const errorText = useErrorText();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') ?? '').trim();
    setBusy(true);
    setError('');
    const result = await accountApi('login', {body: {email, password: form.get('password')}, locale});
    if (result.ok) {
      window.location.assign(next);
      return;
    }
    setBusy(false);
    if (result.error.code === 'email_not_verified') {
      rememberPendingEmail(email);
      router.push({pathname: '/verify-email', query: {next}});
      return;
    }
    setError(errorText(result.error));
  }

  return (
    <div className="account-card">
      <h2>{t('login.title')}</h2>
      <form className="account-form" onSubmit={submit}>
        <div className="account-field">
          <label htmlFor="login-email">{t('fields.email')}</label>
          <input id="login-email" name="email" type="email" autoComplete="email" required />
        </div>
        <div className="account-field">
          <label htmlFor="login-password">{t('fields.password')}</label>
          <input id="login-password" name="password" type="password" autoComplete="current-password" required />
        </div>
        {error ? <p className="account-error" role="alert">{error}</p> : null}
        <button type="submit" className="account-btn" disabled={busy}>{t('login.submit')}</button>
        <Link href="/forgot-password" className="account-link">{t('login.forgot')}</Link>
        <div className="account-divider">{t('login.or')}</div>
        <GoogleButton next={next} />
        <p>
          {t('login.noAccount')} <Link href={{pathname: '/register', query: {next}}} className="account-link">{t('login.register')}</Link>
        </p>
      </form>
    </div>
  );
}
