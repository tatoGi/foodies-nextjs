'use client';

import {useState, type FormEvent} from 'react';
import {useLocale, useTranslations} from 'next-intl';
import {Link, useRouter} from '@/i18n/navigation';
import {accountApi} from '@/lib/client/account-api';
import GoogleButton from './GoogleButton';
import {rememberPendingEmail} from './pendingEmail';
import {useErrorText} from './useErrorText';

const PHONE = /^(?:\+?995)?\s*5(?:[\s-]*\d){8}$/;

export default function RegisterForm({next}: {next: string}) {
  const t = useTranslations('account');
  const locale = useLocale();
  const router = useRouter();
  const errorText = useErrorText();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const data = {
      name: String(form.get('name') ?? '').trim(),
      email: String(form.get('email') ?? '').trim(),
      phone: String(form.get('phone') ?? '').trim(),
      password: String(form.get('password') ?? '')
    };
    const fieldErrors: Record<string, string> = {};
    if (!PHONE.test(data.phone)) fieldErrors.phone = t('errors.phoneFormat');
    if (data.password.length < 8) fieldErrors.password = t('errors.passwordShort');
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) {
      return;
    }

    setBusy(true);
    setError('');
    const result = await accountApi('register', {body: data, locale});
    setBusy(false);
    if (!result.ok) {
      setError(errorText(result.error));
      return;
    }
    rememberPendingEmail(data.email);
    router.push({pathname: '/verify-email', query: {next}});
  }

  return (
    <div className="account-card">
      <h2>{t('register.title')}</h2>
      <form className="account-form" onSubmit={submit}>
        <div className="account-field">
          <label htmlFor="reg-name">{t('fields.name')}</label>
          <input id="reg-name" name="name" autoComplete="name" required maxLength={255} />
        </div>
        <div className="account-field">
          <label htmlFor="reg-email">{t('fields.email')}</label>
          <input id="reg-email" name="email" type="email" autoComplete="email" required />
        </div>
        <div className="account-field">
          <label htmlFor="reg-phone">{t('fields.phone')}</label>
          <input id="reg-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder={t('fields.phoneHint')} required />
          {errors.phone ? <p className="account-error">{errors.phone}</p> : null}
        </div>
        <div className="account-field">
          <label htmlFor="reg-password">{t('fields.password')}</label>
          <input id="reg-password" name="password" type="password" autoComplete="new-password" minLength={8} required />
          <small>{t('fields.passwordHint')}</small>
          {errors.password ? <p className="account-error">{errors.password}</p> : null}
        </div>
        {error ? <p className="account-error" role="alert">{error}</p> : null}
        <button type="submit" className="account-btn" disabled={busy}>{t('register.submit')}</button>
        <div className="account-divider">{t('login.or')}</div>
        <GoogleButton next={next} />
        <p>
          {t('register.haveAccount')} <Link href={{pathname: '/login', query: {next}}} className="account-link">{t('register.login')}</Link>
        </p>
      </form>
    </div>
  );
}
