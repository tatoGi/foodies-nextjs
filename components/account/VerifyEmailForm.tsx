'use client';

import {useEffect, useState, type FormEvent} from 'react';
import {useLocale, useTranslations} from 'next-intl';
import {accountApi} from '@/lib/client/account-api';
import {readPendingEmail} from './pendingEmail';
import {useErrorText} from './useErrorText';

const RESEND_WAIT = 60;

export default function VerifyEmailForm({next}: {next: string}) {
  const t = useTranslations('account');
  const locale = useLocale();
  const errorText = useErrorText();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [wait, setWait] = useState(RESEND_WAIT);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sessionStorage exists only in the browser, after mount
    setEmail(readPendingEmail());
  }, []);

  useEffect(() => {
    if (wait <= 0) return;
    const timer = setTimeout(() => setWait(wait - 1), 1000);
    return () => clearTimeout(timer);
  }, [wait]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const code = String(new FormData(event.currentTarget).get('code') ?? '').replace(/\D/g, '');
    setBusy(true);
    setError('');
    const result = await accountApi('verify-email', {body: {email, code}, locale});
    if (result.ok) {
      window.location.assign(next);
      return;
    }
    setBusy(false);
    setError(errorText(result.error));
  }

  async function resend() {
    setWait(RESEND_WAIT);
    const result = await accountApi('verify-email/resend', {body: {email}, locale});
    setNote(result.ok ? t('verify.resent') : '');
    if (!result.ok) setError(errorText(result.error));
  }

  return (
    <div className="account-card">
      <h2>{t('verify.title')}</h2>
      <p>{t('verify.intro')}</p>
      <form className="account-form" onSubmit={submit}>
        <div className="account-field">
          <label htmlFor="verify-email">{t('fields.email')}</label>
          <input id="verify-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
        </div>
        <div className="account-field">
          <label htmlFor="verify-code">{t('fields.code')}</label>
          <input id="verify-code" name="code" inputMode="numeric" autoComplete="one-time-code" pattern="\d{6}" maxLength={6} required style={{letterSpacing: '8px', fontSize: '24px', textAlign: 'center'}} />
        </div>
        {note ? <p className="account-note">{note}</p> : null}
        {error ? <p className="account-error" role="alert">{error}</p> : null}
        <button type="submit" className="account-btn" disabled={busy}>{t('verify.submit')}</button>
        <button type="button" className="account-btn account-btn--ghost" onClick={resend} disabled={wait > 0 || !email}>
          {wait > 0 ? t('verify.resendIn', {seconds: wait}) : t('verify.resend')}
        </button>
      </form>
    </div>
  );
}
