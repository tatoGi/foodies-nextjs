import {getTranslations, setRequestLocale} from 'next-intl/server';
import DeleteAccount from '@/components/account/DeleteAccount';
import PasswordForm from '@/components/account/PasswordForm';
import ProfileForm from '@/components/account/ProfileForm';
import {getCurrentUser} from '@/lib/server/auth';

export default async function AccountSettingsPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const user = await getCurrentUser();
  const t = await getTranslations('account.settings');
  if (!user) {
    return null;
  }

  return (
    <div className="d-grid gap-4">
      <div className="account-card account-card--wide">
        <h2>{t('profile')}</h2>
        <ProfileForm user={user} />
      </div>
      <div className="account-card account-card--wide">
        <h2>{t('password')}</h2>
        <PasswordForm hasPassword={user.has_password} />
      </div>
      <div className="account-card account-card--wide">
        <h2>{t('delete')}</h2>
        <DeleteAccount hasPassword={user.has_password} />
      </div>
    </div>
  );
}
