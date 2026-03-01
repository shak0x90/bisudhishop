"use client"

import { Popover, Transition } from "@headlessui/react"
import { Fragment } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CountrySelect from "../country-select"
import LanguageSelect from "../language-select"
import { useToggleState } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"
import { Locale } from "@lib/data/locales"

const navItems = [
  { label: "Home", href: "/" },
  { label: "Shop Fresh", href: "/store" },
  { label: "Browse Categories", href: "/categories" },
  { label: "Track My Order", href: "/tracking" },
  { label: "My Account", href: "/account" },
  { label: "My Cart", href: "/cart" },
]

const WHATSAPP_NUMBER = "8801711000000"
const MESSENGER_PAGE = "100000000000000"

type SideMenuProps = {
  regions: HttpTypes.StoreRegion[] | null
  locales: Locale[] | null
  currentLocale: string | null
}

const SideMenu = ({ regions, locales, currentLocale }: SideMenuProps) => {
  const countryToggleState = useToggleState()
  const languageToggleState = useToggleState()

  return (
    <div className="h-full flex items-center">
      <Popover className="h-full flex items-center">
        {({ open, close }) => (
          <>
            {/* Trigger */}
            <Popover.Button
              data-testid="nav-menu-button"
              className="flex flex-col gap-[5px] items-center justify-center w-8 h-8 focus:outline-none"
              aria-label="Open menu"
            >
              <span className={`block w-5 h-[2px] bg-brand-dark transition-all duration-300 ${open ? "rotate-45 translate-y-[7px]" : ""}`} />
              <span className={`block w-5 h-[2px] bg-brand-dark transition-all duration-300 ${open ? "opacity-0" : ""}`} />
              <span className={`block w-5 h-[2px] bg-brand-dark transition-all duration-300 ${open ? "-rotate-45 -translate-y-[7px]" : ""}`} />
            </Popover.Button>

            <Transition
              show={open}
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 -translate-y-2"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 -translate-y-2"
            >
              <Popover.Panel className="fixed inset-0 z-[100] bg-[#153526]/95 backdrop-blur-xl flex flex-col px-6 pt-6 pb-10 overflow-y-auto">

                {/* Header */}
                <div className="flex items-start justify-between mb-10">
                  <div>
                    <p className="text-white font-bold text-[18px] tracking-tight leading-none font-nunito">OrganicHub</p>
                    <p className="text-white/50 text-[12px] mt-1">Fresh for every family</p>
                  </div>
                  <button
                    onClick={close}
                    data-testid="close-menu-button"
                    className="h-10 w-10 rounded-full bg-white/10 text-white/80 flex items-center justify-center hover:bg-white/20 transition-colors flex-shrink-0"
                    aria-label="Close menu"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>

                {/* Nav items */}
                <nav className="flex-1">
                  {navItems.map(({ label, href }, i) => (
                    <div key={href}>
                      <LocalizedClientLink
                        href={href}
                        onClick={close}
                        data-testid={`${label.toLowerCase().replace(/\s+/g, "-")}-link`}
                        className="block py-4 text-[22px] font-medium text-white/90 hover:text-white hover:bg-white/5 rounded-xl px-2 -mx-2 transition-colors"
                      >
                        {label}
                      </LocalizedClientLink>
                      {i < navItems.length - 1 && (
                        <div className="border-b border-white/10" />
                      )}
                    </div>
                  ))}
                </nav>

                {/* Quick order pills */}
                <div className="mt-10">
                  <p className="text-white/40 text-[11px] uppercase tracking-widest mb-3">Quick order</p>
                  <div className="flex gap-3">
                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => close()}
                      className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-white/80 text-sm hover:bg-white/15 transition-colors"
                    >
                      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-[#25D366]"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /><path d="M12 0C5.373 0 0 5.373 0 12c0 2.114.553 4.101 1.524 5.828L.057 23.57l5.903-1.43A11.935 11.935 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.37l-.36-.213-3.502.921.902-3.44-.232-.369A9.818 9.818 0 0112 2.182c5.42 0 9.818 4.398 9.818 9.818 0 5.421-4.398 9.818-9.818 9.818z" /></svg>
                      WhatsApp
                    </a>
                    <a
                      href={`https://m.me/${MESSENGER_PAGE}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => close()}
                      className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-white/80 text-sm hover:bg-white/15 transition-colors"
                    >
                      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-[#0084FF]"><path d="M12 0C5.373 0 0 5.104 0 11.4c0 3.6 1.8 6.804 4.62 8.904V24l4.236-2.328c1.128.312 2.328.48 3.564.48 6.624 0 12-5.104 12-11.4C24 5.104 18.624 0 12 0zm1.188 15.348L10.5 12.516l-5.424 2.952 5.964-6.336 2.724 2.832 5.4-2.952-5.976 6.336z" /></svg>
                      Messenger
                    </a>
                  </div>
                </div>

                {/* Footer */}
                <p className="text-white/50 text-xs mt-8">
                  Shipping: Bangladesh • Serving families across Dhaka
                </p>

              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  )
}

export default SideMenu
