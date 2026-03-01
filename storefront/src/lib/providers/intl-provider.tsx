"use client"

import React, { createContext, useContext } from "react"
import type { Locale } from "../../i18n/get-dictionary"

type Dictionary = Record<string, any>

interface IntlContextType {
    dictionary: Dictionary
    locale: Locale
}

const IntlContext = createContext<IntlContextType | null>(null)

export const IntlProvider = ({
    children,
    dictionary,
    locale,
}: {
    children: React.ReactNode
    dictionary: Dictionary
    locale: Locale
}) => {
    return (
        <IntlContext.Provider value={{ dictionary, locale }}>
            {children}
        </IntlContext.Provider>
    )
}

export const useTranslation = () => {
    const context = useContext(IntlContext)
    if (!context) {
        throw new Error("useTranslation must be used within an IntlProvider")
    }

    // Helper function to safely get nested translation keys (e.g. "product.addToCart")
    const t = (key: string) => {
        const keys = key.split(".")
        let value: any = context.dictionary

        for (const k of keys) {
            if (value === undefined) return key
            value = value[k]
        }

        return value || key
    }

    return { t, locale: context.locale, dictionary: context.dictionary }
}
