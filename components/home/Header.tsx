'use client';

import {useEffect, useState} from 'react';
import {useTranslations} from 'next-intl';
import {Link, usePathname} from '@/i18n/navigation';
import LocaleSwitcher from './LocaleSwitcher';
import LogoMark from '@/components/shared/LogoMark';

export default function Header() {
  const t = useTranslations('header');
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const nav = [
    {href: '/', label: t('nav.home')},
    {href: '/menu', label: t('nav.menu')},
    {href: '/about', label: t('nav.about')},
    {href: '/gallery', label: t('nav.ourGallery')},
    {href: '/reservation', label: t('nav.reservation')},
    {href: '/blog', label: t('nav.blog')},
    {href: '/history', label: t('nav.ourHistory')},
    {href: '/faq', label: t('nav.faqPage')},
    {href: '/contact', label: t('nav.contact')}
  ] as const;

  return (
    <>
      {/* Offcanvas Area Start */}
      <div className="fix-area">
        <div className={`offcanvas__info${menuOpen ? ' info-open' : ''}`}>
          <div className="offcanvas__wrapper">
            <div className="offcanvas__content">
              <div className="offcanvas__top d-flex justify-content-between align-items-center">
                <div className="offcanvas__logo">
                  <Link href="/">
                    <LogoMark size="sm" />
                  </Link>
                </div>
                <div className="offcanvas__close">
                  <button type="button" onClick={closeMenu}>
                    <i className="fa-thin fa-times" />
                  </button>
                </div>
              </div>
              <div style={{margin: '20px 0'}}>
                <LocaleSwitcher />
              </div>
              <div className="mobile-menu fix mean-container">
                <nav className="mean-nav">
                  <ul>
                    {nav.map((item) => (
                      <li key={item.href}>
                        <Link href={item.href} onClick={closeMenu}>{item.label}</Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
              <div className="shop-icon-right">
                <Link href="/contact" className="shop-icon">
                  <i className="fa-regular fa-user" />
                </Link>
              </div>
              <form action="#">
                <input type="text" placeholder={t('searchPlaceholder')} />
                <button type="submit">
                  <i className="fa-regular fa-magnifying-glass" />
                </button>
              </form>
            </div>
            <div className="social-icon-list">
              <span className="follow-title">{t('followUs')}</span>
              <div className="social-icon d-flex align-items-center">
                <a href="javascript:void(0)"><i className="fab fa-facebook-f" /></a>
                <a href="javascript:void(0)"><i className="fab fa-twitter" /></a>
                <a href="javascript:void(0)"><i className="fab fa-vimeo-v" /></a>
                <a href="javascript:void(0)"><i className="fab fa-pinterest-p" /></a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={`offcanvas__overlay${menuOpen ? ' overlay-open' : ''}`} onClick={closeMenu} />

      {/* Header Section Start */}
      <header className="header-section">
        <div className="header-top-sec">
          <div className="container-fluid">
            <div className="header-one-top-wrap">
              <div className="logo-hides" />
              <div className="header-top-wrap">
                <button className="array-prev">
                  <i className="fa-regular fa-chevron-left" />
                </button>
                <div className="swiper head-top-slider">
                  <div className="swiper-wrapper">
                    <div className="swiper-slide">
                      <p>{t('promo')}</p>
                    </div>
                    <div className="swiper-slide">
                      <p>{t('promo')}</p>
                    </div>
                    <div className="swiper-slide">
                      <p>{t('promo')}</p>
                    </div>
                  </div>
                </div>
                <button className="array-next">
                  <i className="fa-regular fa-chevron-right" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="header-middle-sec d-none d-xl-block">
          <div className="head-line" />
          <div className="header-middle-wrap">
            <Link href="/" className="main-logo">
              <LogoMark size="md" />
            </Link>
            <div className="header-middle-items">
              <div className="middle-list-items">
                <ul className="middle-list">
                  <li><Link href="/about">{t('aboutUs')}</Link></li>
                  <li><Link href="/faq">{t('faq')}</Link></li>
                  <li>
                    <span>
                      <img src="/assets/img/logo/vec.png" alt="" />
                      {t('orderWithin15')}
                    </span>
                  </li>
                </ul>
                <div className="middle-right">
                  <Link href="/contact" className="link-text">{t('contact')}</Link>
                  <LocaleSwitcher />
                </div>
              </div>
              <div className="head-form-items">
                <form action="#">
                  <input type="text" placeholder={t('searchPlaceholder')} />
                  <button type="submit"><i className="fa-regular fa-magnifying-glass" /></button>
                </form>
                <div className="shop-icon-right">
                  <Link href="/contact" className="shop-icon">
                    <i className="fa-regular fa-user" />
                  </Link>
                  <div className="order-info">
                    <div className="icon">
                      <img src="/assets/img/order.png" alt="" />
                    </div>
                    <div className="info-cont">
                      <p>{t('forOrder')}</p>
                      <a href="tel:+995577422942">{t('orderPhone')}</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="header-sticky" className="header-1 header-1-sticky">
          <div className="container-fluid">
            <div className="mega-menu-wrapper">
              <div className="header-main">
                <Link href="/" className="logo-1">
                  <LogoMark size="sm" />
                </Link>
                <div className="logo-itemsss">
                  <div className="logo-hides" />
                  <div className="mean__menu-wrapper">
                    <div className="main-menu">
                      <nav id="mobile-menu">
                        <ul>
                          {nav.map((item) => (
                            <li key={item.href}>
                              <Link href={item.href}>{item.label}</Link>
                            </li>
                          ))}
                        </ul>
                      </nav>
                    </div>
                  </div>
                </div>
                <div className="header-right d-flex justify-content-end align-items-center">
                  <div className="header__hamburger my-auto d-xl-none">
                    <div className="sidebar__toggle" onClick={() => setMenuOpen(true)} role="button" tabIndex={0}>
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
