'use client';

import dynamic from 'next/dynamic';
import {useState, type FormEvent} from 'react';
import {useLocale, useTranslations} from 'next-intl';
import {useRouter} from '@/i18n/navigation';
import {accountApi} from '@/lib/client/account-api';
import {useErrorText} from './useErrorText';

const AddressMapPicker = dynamic(() => import('./AddressMapPicker'), {ssr: false});

export type Address = {
  id: number;
  label: string;
  address_line: string;
  entrance: string | null;
  floor: string | null;
  apartment: string | null;
  lat: number;
  lng: number;
  notes: string | null;
  is_default: boolean;
};

type Editing = Address | 'new' | null;

export default function AddressBook({addresses}: {addresses: Address[]}) {
  const t = useTranslations('account.addresses');
  const locale = useLocale();
  const router = useRouter();
  const errorText = useErrorText();
  const [editing, setEditing] = useState<Editing>(null);
  const [point, setPoint] = useState<{lat: number; lng: number} | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  function start(target: Editing) {
    setEditing(target);
    setPoint(target && target !== 'new' ? {lat: target.lat, lng: target.lng} : null);
    setError('');
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!point) {
      setError(t('pinRequired'));
      return;
    }
    const form = new FormData(event.currentTarget);
    const body = {
      label: form.get('label'),
      address_line: form.get('address_line'),
      entrance: form.get('entrance') || null,
      floor: form.get('floor') || null,
      apartment: form.get('apartment') || null,
      notes: form.get('notes') || null,
      lat: point.lat,
      lng: point.lng
    };
    setBusy(true);
    const result = editing === 'new'
      ? await accountApi('addresses', {body, locale})
      : await accountApi(`addresses/${(editing as Address).id}`, {method: 'PUT', body, locale});
    setBusy(false);
    if (!result.ok) {
      setError(errorText(result.error));
      return;
    }
    setEditing(null);
    router.refresh();
  }

  async function remove(address: Address) {
    await accountApi(`addresses/${address.id}`, {method: 'DELETE', locale});
    router.refresh();
  }

  async function makeDefault(address: Address) {
    const {id, ...fields} = address;
    await accountApi(`addresses/${id}`, {method: 'PUT', body: {...fields, is_default: true}, locale});
    router.refresh();
  }

  const current = editing && editing !== 'new' ? editing : null;

  return (
    <div className="account-card account-card--wide">
      <h2>{t('title')}</h2>
      {addresses.length === 0 && !editing ? <p>{t('empty')}</p> : null}
      <div className="address-list mt-3">
        {addresses.map((address) => (
          <div key={address.id} className="address-item">
            <div>
              <strong>{address.label}</strong>
              {address.is_default ? <span className="address-badge">{t('default')}</span> : null}
              <p className="mb-0">{address.address_line}</p>
            </div>
            <div className="address-item__actions">
              {!address.is_default ? <button type="button" onClick={() => makeDefault(address)}>{t('makeDefault')}</button> : null}
              <button type="button" onClick={() => start(address)}>{t('edit')}</button>
              <button type="button" onClick={() => remove(address)}>{t('delete')}</button>
            </div>
          </div>
        ))}
      </div>

      {editing ? (
        <form className="account-form" onSubmit={save} key={current?.id ?? 'new'}>
          <div className="account-field">
            <label htmlFor="addr-label">{t('label')}</label>
            <input id="addr-label" name="label" defaultValue={current?.label ?? ''} maxLength={40} required />
          </div>
          <div className="account-field">
            <label htmlFor="addr-line">{t('line')}</label>
            <input id="addr-line" name="address_line" defaultValue={current?.address_line ?? ''} maxLength={255} autoComplete="street-address" required />
          </div>
          <div className="account-grid-2">
            <div className="account-field">
              <label htmlFor="addr-entrance">{t('entrance')}</label>
              <input id="addr-entrance" name="entrance" defaultValue={current?.entrance ?? ''} maxLength={20} />
            </div>
            <div className="account-field">
              <label htmlFor="addr-floor">{t('floor')}</label>
              <input id="addr-floor" name="floor" defaultValue={current?.floor ?? ''} maxLength={20} />
            </div>
            <div className="account-field">
              <label htmlFor="addr-apartment">{t('apartment')}</label>
              <input id="addr-apartment" name="apartment" defaultValue={current?.apartment ?? ''} maxLength={20} />
            </div>
          </div>
          <div className="account-field">
            <label htmlFor="addr-notes">{t('notes')}</label>
            <textarea id="addr-notes" name="notes" defaultValue={current?.notes ?? ''} maxLength={500} rows={2} />
          </div>
          <small>{t('mapHint')}</small>
          <AddressMapPicker value={point} onChange={setPoint} locateLabel={t('locate')} />
          {error ? <p className="account-error" role="alert">{error}</p> : null}
          <div className="d-flex gap-3">
            <button type="submit" className="account-btn" disabled={busy}>{t('save')}</button>
            <button type="button" className="account-btn account-btn--ghost" onClick={() => start(null)}>{t('cancel')}</button>
          </div>
        </form>
      ) : (
        <button type="button" className="account-btn mt-4" onClick={() => start('new')}>{t('add')}</button>
      )}
    </div>
  );
}
