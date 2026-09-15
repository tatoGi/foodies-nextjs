import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import LocaleSwitcher from './LocaleSwitcher';
import LogoMark from '@/components/shared/LogoMark';

export default function Header({showMegaMenu = false}: {showMegaMenu?: boolean} = {}) {
  const t = useTranslations('header');

  return (
    <>
      {/* Offcanvas Area Start */}
      <div className="fix-area">
        <div className="offcanvas__info">
          <div className="offcanvas__wrapper">
            <div className="offcanvas__content">
              <div className="offcanvas__top d-flex justify-content-between align-items-center">
                <div className="offcanvas__logo">
                  <Link href="/">
                    <LogoMark size="sm" />
                  </Link>
                </div>
                <div className="offcanvas__close">
                  <button>
                    <i className="fa-thin fa-times" />
                  </button>
                </div>
              </div>
              <div className="mobile-menu fix" />
              <div className="shop-icon-right">
                <Link href="/contact" className="shop-icon">
                  <i className="fa-regular fa-user" />
                </Link>
                <Link href="/wishlist" className="shop-icon">
                  <i className="fa-regular fa-heart" />
                  <span>5</span>
                </Link>
                <Link href="/shop-cart" className="shop-icon">
                  <i className="fa-regular fa-bag-shopping" />
                  <span>2</span>
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
      <div className="offcanvas__overlay" />

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
                  <li><Link href="/shop-details">{t('myAccount')}</Link></li>
                  <li><Link href="/shop-cart">{t('orderTracking')}</Link></li>
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
                  <Link href="/wishlist" className="shop-icon">
                    <i className="fa-regular fa-heart" />
                    <span>5</span>
                  </Link>
                  <Link href="/shop-cart" className="shop-icon">
                    <i className="fa-regular fa-bag-shopping" />
                    <span>2</span>
                  </Link>
                  <div className="order-info">
                    <div className="icon">
                      <img src="/assets/img/order.png" alt="" />
                    </div>
                    <div className="info-cont">
                      <p>{t('forOrder')}</p>
                      <a href="tel:2341096666">{t('orderPhone')}</a>
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
                          {showMegaMenu && (
                            <li className="has-dropdown active menu-thumb">
                              <a href="javascript:void(0)">
                                {t('nav.home')}
                                <i className="fa-solid fa-chevron-down" />
                              </a>
                              <ul className="submenu has-homemenu">
                                <li>
                                  <div className="homemenu-items">
                                    <div className="row row-cols-xl-4 row-cols-md-2 row-cols-2">
                                      {[
                                        {img: 'home-1.jpg', label: t('nav.homeDemos.fastFood')},
                                        {img: 'home-2.jpg', label: t('nav.homeDemos.pizzaRestaurant')},
                                        {img: 'home-3.jpg', label: t('nav.homeDemos.foodDelivery')},
                                        {img: 'home-4.jpg', label: t('nav.homeDemos.burgerRestaurant')},
                                        {img: 'home-5.jpg', label: t('nav.homeDemos.iceCreamShop')},
                                        {img: 'home-6.jpg', label: t('nav.homeDemos.iceCreamStore')},
                                        {img: 'home-7.jpg', label: t('nav.homeDemos.restaurant')},
                                        {img: 'home-8.jpg', label: t('nav.homeDemos.coffeeAndTea')}
                                      ].map((demo) => (
                                        <div className="col homemenu" key={demo.img}>
                                          <div className="homemenu-thumb mb-15">
                                            <img src={`/assets/img/header/${demo.img}`} alt={demo.label} />
                                            <div className="demo-button">
                                              <Link href="/" className="theme-btn">
                                                {t('nav.homeDemos.viewPage')}
                                                <i className="fa-solid fa-arrow-up-right" />
                                              </Link>
                                            </div>
                                          </div>
                                          <div className="homemenu-content text-center">
                                            <Link href="/" className="homemenu-title">{demo.label}</Link>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </li>
                              </ul>
                            </li>
                          )}
                          <li className="has-dropdown active d-xl-none">
                            <a href="javascript:void(0)" className="border-none">{t('nav.home')}</a>
                            <ul className="submenu">
                              <li><Link href="/">{t('nav.homeDemos.fastFood')}</Link></li>
                              <li><Link href="/">{t('nav.homeDemos.pizzaRestaurant')}</Link></li>
                              <li><Link href="/">{t('nav.homeDemos.foodDelivery')}</Link></li>
                              <li><Link href="/">{t('nav.homeDemos.burgerRestaurant')}</Link></li>
                              <li><Link href="/">{t('nav.homeDemos.iceCreamShop')}</Link></li>
                              <li><Link href="/">{t('nav.homeDemos.iceCreamStore')}</Link></li>
                              <li><Link href="/">{t('nav.homeDemos.restaurant')}</Link></li>
                              <li><Link href="/">{t('nav.homeDemos.coffeeAndTea')}</Link></li>
                            </ul>
                          </li>
                          <li><Link href="/menu">{t('nav.menu')}</Link></li>
                          <li><Link href="/about">{t('nav.about')}</Link></li>
                          <li><Link href="/gallery">{t('nav.ourGallery')}</Link></li>
                          <li><Link href="/reservation">{t('nav.reservation')}</Link></li>
                          <li className="has-dropdown">
                            <a href="javascript:void(0)">
                              {t('nav.pages')}
                              <i className="fa-solid fa-chevron-down" />
                            </a>
                            <ul className="submenu">
                              <li><Link href="/history">{t('nav.ourHistory')}</Link></li>
                              <li><Link href="/faq">{t('nav.faqPage')}</Link></li>
                              <li><Link href="/404">{t('nav.error404')}</Link></li>
                            </ul>
                          </li>
                          <li>
                            <a href="javascript:void(0)">
                              {t('nav.shop')}
                              <i className="fa-solid fa-chevron-down" />
                            </a>
                            <ul className="submenu">
                              <li><Link href="/shop">{t('nav.shopGrid')}</Link></li>
                              <li><Link href="/shop-list">{t('nav.shopList')}</Link></li>
                              <li><Link href="/shop-grid-sidebar">{t('nav.shopGridSidebar')}</Link></li>
                              <li><Link href="/shop-list-sidebar">{t('nav.shopListSidebar')}</Link></li>
                              <li><Link href="/shop-details">{t('nav.shopDetails')}</Link></li>
                              <li><Link href="/shop-cart">{t('nav.shopCart')}</Link></li>
                              <li><Link href="/wishlist">{t('nav.wishlist')}</Link></li>
                              <li><Link href="/checkout">{t('nav.checkout')}</Link></li>
                            </ul>
                          </li>
                          <li>
                            <a href="javascript:void(0)">
                              {t('nav.blog')}
                              <i className="fa-solid fa-chevron-down" />
                            </a>
                            <ul className="submenu">
                              <li><Link href="/news-grid">{t('nav.blogGrid')}</Link></li>
                              <li><Link href="/news">{t('nav.blogStandard')}</Link></li>
                              <li><Link href="/news-details">{t('nav.blogDetails')}</Link></li>
                            </ul>
                          </li>
                          <li><Link href="/contact">{t('nav.contact')}</Link></li>
                        </ul>
                      </nav>
                    </div>
                  </div>
                </div>
                <div className="header-right d-flex justify-content-end align-items-center">
                  <p className="seller-text">
                    {t('bestSeller')} <b>{t('sale')}</b>
                  </p>
                  <div className="header__hamburger my-auto d-xl-none">
                    <div className="sidebar__toggle">
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
