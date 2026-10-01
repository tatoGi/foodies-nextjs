import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {redirect} from 'next/navigation';
import AccountShell from '@/components/account/AccountShell';
import LoginForm from '@/components/account/LoginForm';
import {getCurrentUser} from '@/lib/server/auth';
import {safeNextPath} from '@/lib/safe-next';

export const metadata: Metadata = {robots: {index: false}};

export default async function LoginPage({
  params,
  searchParams
}: {
  params: Promise<{locale: string}>;
  searchParams: Promise<{next?: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const next = safeNextPath((await searchParams).next, locale);
  if (await getCurrentUser()) {
    redirect(next);
  }
  const t = await getTranslations('account');

  return (
    <AccountShell title={t('login.title')}>
      <LoginForm next={next} />
    </AccountShell>
  );
}
