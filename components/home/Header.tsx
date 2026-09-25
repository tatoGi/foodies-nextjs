import {getLocale} from 'next-intl/server';
import {getNavigation} from '@/lib/cms';
import HeaderClient from './HeaderClient';

/** Loads the header menu from the CMS on the server and hands it to the interactive header. */
export default async function Header() {
  const locale = await getLocale();
  const items = await getNavigation(locale);

  return <HeaderClient items={items} />;
}
