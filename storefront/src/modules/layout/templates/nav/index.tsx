import { Suspense } from "react"

import { listRegions } from "@lib/data/regions"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import WishlistButton from "@modules/layout/components/wishlist-button"
import SearchBar from "@modules/layout/components/search-bar"
import SideMenu from "@modules/layout/components/side-menu"
import LanguageSwitcher from "@i18n/components/language-switcher"
import { getDictionary } from "@i18n/get-dictionary"

export default async function Nav() {
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
  ])

  // NOTE: This component is rendered on the server (async) so we fetch the dictionary directly
  const dictionary = await getDictionary();

  // Helper function for server components
  const t = (key: string) => {
    const keys = key.split(".")
    let value: any = dictionary

    for (const k of keys) {
      if (value === undefined) return key
      value = value[k]
    }

    return value || key
  }

  return (
    <div className="sticky top-0 inset-x-0 z-50 group font-nunito">
      {/* Top utility bar */}
      <div className="bg-brand-light border-b border-gray-200 hidden md:block">
        <div className="content-container mx-auto flex items-center justify-between h-10 text-xs text-brand-dark px-8">
          <p className="text-gray-500">Fast Delivery inside Dhaka 🚚</p>
          <div className="flex items-center gap-6">
            <LocalizedClientLink href="/tracking" className="hover:text-brand-green font-semibold transition-colors">
              {t("nav.trackOrder")}
            </LocalizedClientLink>
            <span className="font-bold flex items-center gap-1 text-brand-dark">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
              +880 1711-XXXXXX
            </span>
          </div>
        </div>
      </div>

      <header className="relative h-16 md:h-20 mx-auto duration-200 bg-white shadow-sm">
        <nav className="content-container mx-auto flex items-center justify-between w-full h-full text-sm font-semibold px-4 md:px-8">

          {/* Logo */}
          <div className="flex-1 basis-0 h-full flex items-center">
            <LocalizedClientLink href="/" className="flex items-center -ml-4">
              <h1 className="text-2xl font-bold tracking-wider text-brand-green mt-2">Organichub</h1>
            </LocalizedClientLink>
          </div>

          {/* Main Links */}
          <div className="items-center h-full hidden lg:flex gap-8 text-brand-dark font-bold uppercase">
            <LocalizedClientLink href="/" className="text-brand-green">{t("nav.shop").replace("Shop", "Home")}</LocalizedClientLink>
            <LocalizedClientLink href="/store" className="hover:text-brand-green transition-colors">{t("nav.shop")}</LocalizedClientLink>
            <LocalizedClientLink href="/categories" className="hover:text-brand-green transition-colors">Categories</LocalizedClientLink>
            <LocalizedClientLink href="/about" className="hover:text-brand-green transition-colors">About Us</LocalizedClientLink>
          </div>

          {/* Right Icons */}
          {/*
            Desktop: gap-6 (24px) between icons, pr-0 (content-container handles edge)
            Mobile: gap-4 (16px) between icons, icons hidden behind hamburger except cart
          */}
          <div className="flex items-center h-full flex-1 basis-0 justify-end gap-4 md:gap-6">

            {/* Search — hidden on mobile, shown on md+ */}
            <div className="hidden md:flex">
              <SearchBar />
            </div>

            {/* Icon cluster — all 20×20, vertically centered, gap-4 mobile / gap-6 desktop */}
            <div className="flex items-center gap-4 md:gap-6 text-brand-dark">

              {/* Wishlist — visible on all screen sizes */}
              <Suspense fallback={<div className="w-5 h-5" />}>
                <WishlistButton />
              </Suspense>

              {/* Cart — always visible */}
              <Suspense fallback={<div className="w-5 h-5" />}>
                <CartButton />
              </Suspense>

              {/* Account — visible on all screen sizes */}
              <LocalizedClientLink
                href="/account"
                className="flex items-center cursor-pointer hover:text-brand-green transition-colors"
                aria-label="Account"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </LocalizedClientLink>

              {/* Language Switcher — desktop only (inside hamburger on mobile) */}
              <div className="hidden md:flex items-center border-l border-gray-200 pl-5">
                <LanguageSwitcher />
              </div>
            </div>

            {/* Mobile hamburger — rightmost, consistent 16px from edge */}
            <div className="flex lg:hidden items-center">
              <SideMenu regions={regions} locales={locales} currentLocale={currentLocale} />
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}
