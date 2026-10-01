'use client';

import {useEffect, useRef, useState} from 'react';
import {useLocale} from 'next-intl';
import {accountApi} from '@/lib/client/account-api';
import {useErrorText} from './useErrorText';

type GoogleId = {
  initialize(options: {client_id: string; callback: (response: {credential: string}) => void}): void;
  renderButton(element: HTMLElement, options: Record<string, unknown>): void;
};
declare global {
  interface Window {
    google?: {accounts: {id: GoogleId}};
  }
}

const SCRIPT_SRC = 'https://accounts.google.com/gsi/client';

/** Google Identity Services button; hidden when NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set. */
export default function GoogleButton({next}: {next: string}) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const locale = useLocale();
  const holder = useRef<HTMLDivElement>(null);
  const [error, setError] = useState('');
  const errorText = useErrorText();

  useEffect(() => {
    if (!clientId) {
      return;
    }
    const render = () => {
      if (!window.google || !holder.current) {
        return;
      }
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async ({credential}) => {
          const result = await accountApi('google', {body: {id_token: credential}, locale});
          if (result.ok) {
            window.location.assign(next);
          } else {
            setError(errorText(result.error));
          }
        }
      });
      window.google.accounts.id.renderButton(holder.current, {theme: 'outline', size: 'large', shape: 'pill', text: 'continue_with', locale, width: 320});
    };

    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
    if (existing) {
      if (window.google) {
        render();
      } else {
        existing.addEventListener('load', render, {once: true});
      }
      return;
    }
    const script = document.createElement('script');
    script.src = SCRIPT_SRC;
    script.async = true;
    script.addEventListener('load', render, {once: true});
    document.head.appendChild(script);
  }, [clientId, locale, next, errorText]);

  if (!clientId) {
    return null;
  }

  return (
    <div className="d-grid gap-2 justify-content-center">
      <div ref={holder} />
      {error ? <p className="account-error text-center">{error}</p> : null}
    </div>
  );
}
