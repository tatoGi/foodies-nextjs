import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import AccountShell from '@/components/account/AccountShell';
import ForgotPasswordForm from '@/components/account/ForgotPasswordForm';
import {safeNextPath} from '@/lib/safe-next';

export const metadata: Metadata = {robots: {index: false}};

export default async function ForgotPasswordPage({
  params,
  searchParams
}: {
  params: Promise<{locale: string}>;
  searchParams: Promise<{next?: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const next = safeNextPath((await searchParams).next, locale);
  const t = await getTranslations('account');

  return (
    <AccountShell title={t('forgot.title')}>
      <ForgotPasswordForm next={next} />
    </AccountShell>
  );
}
