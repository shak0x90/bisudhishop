import { cookies } from "next/headers"

// Dynamic imports for the dictionary JSON files
const dictionaries = {
    en: () => import("./dictionaries/en.json").then((module) => module.default),
    bn: () => import("./dictionaries/bn.json").then((module) => module.default),
}

export type Locale = keyof typeof dictionaries

export const getDictionary = async () => {
    const cookieStore = await cookies()
    const locale = (cookieStore.get("NEXT_LOCALE")?.value as Locale) || "en"

    // Fallback to English if the locale doesn't exist in our dictionary
    const loadDictionary = dictionaries[locale] || dictionaries.en

    return loadDictionary()
}
