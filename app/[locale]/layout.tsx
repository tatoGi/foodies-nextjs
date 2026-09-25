import type {Metadata} from 'next';
import Script from 'next/script';
import {hasLocale, NextIntlClientProvider} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import {routing} from '@/i18n/routing';
import {notFound} from 'next/navigation';
import TemplateRuntime from '@/components/shared/TemplateRuntime';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || 'http://localhost:3000'),
  title: 'BiteClub – Multipurpose Restaurant & Fast Food',
  description: 'BiteClub – Multipurpose Restaurant & Fast Food HTML Template',
  icons: {icon: '/assets/img/favicon.svg'}
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

const cssHrefs = [
  '/assets/css/bootstrap.min.css',
  '/assets/css/all.min.css',
  '/assets/css/animate.css',
  '/assets/css/magnific-popup.css',
  '/assets/css/meanmenu.css',
  '/assets/css/swiper-bundle.min.css',
  '/assets/css/nice-select.css',
  '/assets/css/main.css'
];

const jsSrcs = [
  '/assets/js/jquery-3.7.1.min.js',
  '/assets/js/bootstrap.bundle.min.js',
  '/assets/js/gsap.min.js',
  '/assets/js/ScrollTrigger.min.js',
  '/assets/js/ScrollSmoother.min.js',
  '/assets/js/ScrollToPlugin.min.js',
  '/assets/js/SplitText.min.js',
  '/assets/js/TextPlugin.js',
  '/assets/js/chroma.min.js',
  '/assets/js/three.js',
  '/assets/js/ripple-2.js',
  '/assets/js/webgl.js',
  '/assets/js/jquery.nice-select.min.js',
  '/assets/js/jquery.waypoints.js',
  '/assets/js/jquery.counterup.min.js',
  '/assets/js/swiper-bundle.min.js',
  '/assets/js/jquery.meanmenu.min.js',
  '/assets/js/jquery.magnific-popup.min.js',
  '/assets/js/wow.min.js',
  '/assets/js/main.js'
];

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html lang={locale}>
      <head>
        {cssHrefs.map((href) => (
          <link key={href} rel="stylesheet" href={href} />
        ))}
      </head>
      <body suppressHydrationWarning>
        <NextIntlClientProvider>
          <div className="page-wrapper">
            <div className="preloader">
              <div className="loader" />
            </div>

            <button id="back-top" className="back-to-top">
              <i className="fa-regular fa-arrow-up" />
            </button>

            <div className="mouseCursor cursor-outer" />
            <div className="mouseCursor cursor-inner" />

            {children}
            <TemplateRuntime />
          </div>
        </NextIntlClientProvider>
        {jsSrcs.map((src) => (
          <Script key={src} src={src} strategy="afterInteractive" />
        ))}
        <Script
          src="/assets/js/distortion-img.js"
          type="module"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
      </body>
    </html>
  );
}
