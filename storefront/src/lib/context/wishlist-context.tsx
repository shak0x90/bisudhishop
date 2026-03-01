"use client"

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react"

type WishlistItem = {
    productId: string
    addedAt: number
}

type WishlistContextType = {
    items: WishlistItem[]
    isInWishlist: (productId: string) => boolean
    toggleWishlist: (productId: string) => void
    count: number
}

const WishlistContext = createContext<WishlistContextType>({
    items: [],
    isInWishlist: () => false,
    toggleWishlist: () => { },
    count: 0,
})

const STORAGE_KEY = "bisudhi_wishlist"

function getStoredWishlist(): WishlistItem[] {
    if (typeof window === "undefined") return []
    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        return stored ? JSON.parse(stored) : []
    } catch {
        return []
    }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<WishlistItem[]>([])

    // Load from localStorage on mount
    useEffect(() => {
        setItems(getStoredWishlist())
    }, [])

    // Save to localStorage whenever items change
    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
        }
    }, [items])

    const isInWishlist = useCallback(
        (productId: string) => items.some((item) => item.productId === productId),
        [items]
    )

    const toggleWishlist = useCallback((productId: string) => {
        setItems((prev) => {
            const exists = prev.some((item) => item.productId === productId)
            if (exists) {
                return prev.filter((item) => item.productId !== productId)
            } else {
                return [...prev, { productId, addedAt: Date.now() }]
            }
        })
    }, [])

    return (
        <WishlistContext.Provider value={{ items, isInWishlist, toggleWishlist, count: items.length }}>
            {children}
        </WishlistContext.Provider>
    )
}

export function useWishlist() {
    return useContext(WishlistContext)
}
