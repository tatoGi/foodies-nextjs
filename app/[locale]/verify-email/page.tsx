import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import AccountShell from '@/components/account/AccountShell';
import VerifyEmailForm from '@/components/account/VerifyEmailForm';
import {safeNextPath} from '@/lib/safe-next';

export const metadata: Metadata = {robots: {index: false}};

export default async function VerifyEmailPage({
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
    <AccountShell title={t('verify.title')}>
      <VerifyEmailForm next={next} />
    </AccountShell>
  );
}
