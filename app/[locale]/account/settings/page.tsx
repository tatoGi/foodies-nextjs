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
    <div className="acc-stack">
      <section className="acc-panel acc-section">
        <header>
          <h3>{t('profile')}</h3>
          <p>{t('profileHint')}</p>
        </header>
        <ProfileForm user={user} />
      </section>
      <section className="acc-panel acc-section">
        <header>
          <h3>{t('password')}</h3>
          <p>{t('passwordHint')}</p>
        </header>
        <PasswordForm hasPassword={user.has_password} />
      </section>
      <section className="acc-panel acc-section acc-section--danger">
        <header>
          <h3>{t('delete')}</h3>
          <p>{t('deleteWarning')}</p>
        </header>
        <DeleteAccount hasPassword={user.has_password} />
      </section>
    </div>
  );
}
