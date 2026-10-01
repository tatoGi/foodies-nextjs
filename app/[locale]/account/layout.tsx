import type {ReactNode} from 'react';
import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {redirect} from 'next/navigation';
import AccountNav from '@/components/account/AccountNav';
import AccountShell from '@/components/account/AccountShell';
import {getCurrentUser} from '@/lib/server/auth';

export const metadata: Metadata = {robots: {index: false}};

/** Every /account page: the proxy only checks the cookie exists; here the token is verified with the CMS. */
export default async function AccountLayout({children, params}: {children: ReactNode; params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  if (!(await getCurrentUser())) {
    redirect(`/${locale}/login?next=/${locale}/account`);
  }
  const t = await getTranslations('account');

  return (
    <AccountShell title={t('title')}>
      <div className="account-layout">
        <AccountNav />
        <div>{children}</div>
      </div>
    </AccountShell>
  );
}
