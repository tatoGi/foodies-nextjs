'use client';

import {useState, type ComponentProps} from 'react';
import {useTranslations} from 'next-intl';

/** Password field with an eye button that shows or hides what was typed. */
export default function PasswordInput(props: Omit<ComponentProps<'input'>, 'type'>) {
  const t = useTranslations('account.fields');
  const [visible, setVisible] = useState(false);

  return (
    <div className="account-password">
      <input {...props} type={visible ? 'text' : 'password'} />
      <button type="button" onClick={() => setVisible((value) => !value)} aria-label={visible ? t('hidePassword') : t('showPassword')} aria-pressed={visible}>
        <i className={visible ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'} />
      </button>
    </div>
  );
}
