import {setRequestLocale} from 'next-intl/server';
import AddressBook, {type Address} from '@/components/account/AddressBook';
import {getAccountData} from '@/lib/server/auth';

export default async function AccountAddressesPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const data = await getAccountData<{addresses: Address[]}>('me/addresses', locale);

  return <AddressBook addresses={data?.addresses ?? []} />;
}
