"use client"

import { useTranslation } from "@lib/providers/intl-provider"
import { setLocale } from "@i18n/actions/set-locale"
import { useTransition } from "react"
import { Menu, Transition } from "@headlessui/react"
import { Fragment } from "react"

export default function LanguageSwitcher() {
    const { locale } = useTranslation()
    const [isPending, startTransition] = useTransition()

    const handleLanguageChange = (newLocale: "en" | "bn") => {
        if (newLocale === locale) return

        startTransition(() => {
            setLocale(newLocale)
        })
    }

    return (
        <div className="relative inline-block text-left">
            <Menu as="div">
                <div>
                    <Menu.Button
                        className="inline-flex w-full justify-center items-center gap-x-1.5 rounded-md bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-green tracking-widest disabled:opacity-50"
                        disabled={isPending}
                    >
                        {locale === "en" ? "EN" : "BN"}
                        <svg className="-mr-1 h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                        </svg>
                    </Menu.Button>
                </div>

                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-24 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        onClick={() => handleLanguageChange("en")}
                                        className={`block w-full px-4 py-2 text-left text-sm font-semibold transition-colors ${active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                                            } ${locale === "en" ? "text-brand-green" : ""}`}
                                    >
                                        English
                                    </button>
                                )}
                            </Menu.Item>
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        onClick={() => handleLanguageChange("bn")}
                                        className={`block w-full px-4 py-2 text-left text-sm font-semibold transition-colors ${active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                                            } ${locale === "bn" ? "text-brand-green" : ""}`}
                                    >
                                        বাংলা
                                    </button>
                                )}
                            </Menu.Item>
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
        </div>
    )
}
