"use client"

import { useRouter, useParams } from "next/navigation"
import { useState, useRef, useEffect, useCallback } from "react"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type SearchResult = {
    id: string
    title: string
    handle: string
    thumbnail: string | null
    price?: string
}

export default function SearchBar() {
    const [query, setQuery] = useState("")
    const [isFocused, setIsFocused] = useState(false)
    const [results, setResults] = useState<SearchResult[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [showDropdown, setShowDropdown] = useState(false)
    const router = useRouter()
    const countryCode = useParams().countryCode as string
    const inputRef = useRef<HTMLInputElement>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const debounceRef = useRef<NodeJS.Timeout | null>(null)

    const fetchResults = useCallback(async (q: string) => {
        if (!q.trim() || q.trim().length < 2) {
            setResults([])
            setShowDropdown(false)
            return
        }

        setIsLoading(true)
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"}/store/products?q=${encodeURIComponent(q)}&limit=6`,
                {
                    credentials: "include",
                    headers: {
                        "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
                    },
                }
            )
            if (!res.ok) throw new Error("Search failed")
            const data = await res.json()
            const items: SearchResult[] = (data.products || []).map((p: any) => {
                // Try to get price from variants
                let price: string | undefined
                const variant = p.variants?.[0]
                const calcPrice = variant?.calculated_price
                if (calcPrice?.calculated_amount) {
                    price = `BDT ${Number(calcPrice.calculated_amount).toFixed(2)}`
                } else if (variant?.prices?.[0]?.amount) {
                    price = `BDT ${(Number(variant.prices[0].amount) / 100).toFixed(2)}`
                }
                return {
                    id: p.id,
                    title: p.title,
                    handle: p.handle,
                    thumbnail: p.thumbnail,
                    price,
                }
            })
            setResults(items)
            setShowDropdown(items.length > 0)
        } catch {
            setResults([])
            setShowDropdown(false)
        } finally {
            setIsLoading(false)
        }
    }, [])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setQuery(val)

        // Debounce API calls (300ms)
        if (debounceRef.current) clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(() => {
            fetchResults(val)
        }, 300)
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        const trimmed = query.trim()
        if (!trimmed) return
        setShowDropdown(false)
        router.push(`/${countryCode}/results/${trimmed}`)
        setQuery("")
        inputRef.current?.blur()
    }

    const handleResultClick = (handle: string) => {
        setShowDropdown(false)
        setQuery("")
        router.push(`/${countryCode}/products/${handle}`)
    }

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
                inputRef.current && !inputRef.current.contains(e.target as Node)
            ) {
                setShowDropdown(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    // Keyboard shortcut: "/" to focus search
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
                e.preventDefault()
                inputRef.current?.focus()
            }
            if (e.key === "Escape") {
                setShowDropdown(false)
                inputRef.current?.blur()
            }
        }
        window.addEventListener("keydown", handler)
        return () => window.removeEventListener("keydown", handler)
    }, [])

    // Cleanup debounce on unmount
    useEffect(() => {
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current)
        }
    }, [])

    return (
        <div className="relative hidden xl:block w-64">
            <form onSubmit={handleSearch}>
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    onFocus={() => {
                        setIsFocused(true)
                        if (results.length > 0) setShowDropdown(true)
                    }}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Search products..."
                    className={`w-full bg-gray-50 rounded-full py-2.5 pl-4 pr-10 text-sm font-normal transition-all border ${isFocused
                        ? "border-brand-green ring-2 ring-brand-green/20 bg-white"
                        : "border-gray-200 hover:border-gray-300"
                        } focus:outline-none`}
                />
                <button
                    type="submit"
                    className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-brand-green hover:bg-brand-green/10 transition-colors z-10"
                >
                    {isLoading ? (
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                    ) : (
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <circle cx="11" cy="11" r="8" />
                            <path d="M21 21l-4.35-4.35" />
                        </svg>
                    )}
                </button>
            </form>

            {/* Suggestions Dropdown */}
            {showDropdown && (
                <div
                    ref={dropdownRef}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 max-h-[420px] overflow-y-auto"
                >
                    {results.map((product, idx) => (
                        <button
                            key={product.id}
                            onClick={() => handleResultClick(product.handle)}
                            className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left ${idx !== results.length - 1 ? "border-b border-gray-50" : ""
                                }`}
                        >
                            {/* Thumbnail */}
                            <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0 relative">
                                {product.thumbnail ? (
                                    <Image
                                        src={product.thumbnail}
                                        alt={product.title}
                                        fill
                                        sizes="48px"
                                        style={{ objectFit: "cover" }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="3" y="3" width="18" height="18" rx="2" />
                                            <circle cx="8.5" cy="8.5" r="1.5" />
                                            <polyline points="21 15 16 10 5 21" />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-brand-dark truncate">
                                    {product.title}
                                </p>
                                {product.price && (
                                    <p className="text-xs font-bold text-brand-green mt-0.5">
                                        {product.price}
                                    </p>
                                )}
                            </div>

                            {/* Arrow */}
                            <svg className="w-4 h-4 text-gray-300 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </button>
                    ))}

                    {/* View all link */}
                    <button
                        onClick={() => {
                            setShowDropdown(false)
                            router.push(`/${countryCode}/results/${query.trim()}`)
                            setQuery("")
                        }}
                        className="w-full px-4 py-3 bg-gray-50 text-sm font-bold text-brand-green hover:bg-gray-100 transition-colors text-center border-t border-gray-100"
                    >
                        View all results for &ldquo;{query.trim()}&rdquo; →
                    </button>
                </div>
            )}
        </div>
    )
}
