'use client';

import {useState, type FormEvent} from 'react';
import {useLocale, useTranslations} from 'next-intl';
import {accountApi} from '@/lib/client/account-api';
import {useErrorText} from './useErrorText';

export default function ForgotPasswordForm({next}: {next: string}) {
  const t = useTranslations('account');
  const locale = useLocale();
  const errorText = useErrorText();
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function sendCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');
    const result = await accountApi('password/forgot', {body: {email}, locale});
    setBusy(false);
    if (result.ok) setStep('code');
    else setError(errorText(result.error));
  }

  async function reset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = String(form.get('password') ?? '');
    if (password.length < 8) {
      setError(t('errors.passwordShort'));
      return;
    }
    setBusy(true);
    setError('');
    const result = await accountApi('password/reset', {body: {email, code: String(form.get('code') ?? '').replace(/\D/g, ''), password}, locale});
    if (result.ok) {
      window.location.assign(next);
      return;
    }
    setBusy(false);
    setError(errorText(result.error));
  }

  return (
    <div className="account-card">
      <h2>{t('forgot.title')}</h2>
      {step === 'email' ? (
        <form className="account-form" onSubmit={sendCode}>
          <p>{t('forgot.intro')}</p>
          <div className="account-field">
            <label htmlFor="forgot-email">{t('fields.email')}</label>
            <input id="forgot-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
          </div>
          {error ? <p className="account-error" role="alert">{error}</p> : null}
          <button type="submit" className="account-btn" disabled={busy}>{t('forgot.sendCode')}</button>
        </form>
      ) : (
        <form className="account-form" onSubmit={reset}>
          <p>{t('forgot.codeIntro')}</p>
          <div className="account-field">
            <label htmlFor="forgot-code">{t('fields.code')}</label>
            <input id="forgot-code" name="code" inputMode="numeric" autoComplete="one-time-code" pattern="\d{6}" maxLength={6} required />
          </div>
          <div className="account-field">
            <label htmlFor="forgot-password">{t('fields.newPassword')}</label>
            <input id="forgot-password" name="password" type="password" autoComplete="new-password" minLength={8} required />
            <small>{t('fields.passwordHint')}</small>
          </div>
          {error ? <p className="account-error" role="alert">{error}</p> : null}
          <button type="submit" className="account-btn" disabled={busy}>{t('forgot.submit')}</button>
        </form>
      )}
    </div>
  );
}
