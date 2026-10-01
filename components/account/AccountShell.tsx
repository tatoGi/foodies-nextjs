import type {ReactNode} from 'react';
import Header from '@/components/home/Header';
import Breadcrumb from '@/components/shared/Breadcrumb';
import InnerFooter from '@/components/inner/InnerFooter';

/** Site chrome for login and account pages: compact banner, no marketing sections. */
export default function AccountShell({title, children}: {title: string; children: ReactNode}) {
  return (
    <>
      <Header />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <Breadcrumb title={title} currentLabel={title} compact />
          <section className="account-page">
            <div className="container">{children}</div>
          </section>
          <InnerFooter />
        </div>
      </div>
    </>
  );
}
