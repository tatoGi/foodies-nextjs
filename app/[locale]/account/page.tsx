import {getTranslations, setRequestLocale} from 'next-intl/server';
import {getCurrentUser} from '@/lib/server/auth';

export default async function AccountOverviewPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const user = await getCurrentUser();
  const t = await getTranslations('account');
  if (!user) {
    return null;
  }

  return (
    <div className="d-grid gap-4">
      <div className="account-card account-card--wide">
        <h2>{t('overview.greeting', {name: user.name})}</h2>
        <h4 className="mt-4">{t('overview.contact')}</h4>
        <p className="mb-1">{user.email}</p>
        <p className="mb-0">{user.phone}</p>
      </div>
      <div className="account-card account-card--wide">
        <h2>{t('overview.orders')}</h2>
        <p className="mb-0">{t('overview.ordersSoon')}</p>
      </div>
    </div>
  );
}
