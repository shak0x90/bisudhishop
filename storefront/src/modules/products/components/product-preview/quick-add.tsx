"use client"

import { addToCart } from "@lib/data/cart"
import { useWishlist } from "@lib/context/wishlist-context"
import { useParams } from "next/navigation"
import { useState } from "react"

type QuickAddProps = {
    variantId: string
    productHandle: string
    productId: string
    variant?: "overlay" | "inline"
}

export default function QuickAddToCart({ variantId, productHandle, productId, variant = "overlay" }: QuickAddProps) {
    const [isAdding, setIsAdding] = useState(false)
    const [added, setAdded] = useState(false)
    const countryCode = useParams().countryCode as string
    const { isInWishlist, toggleWishlist } = useWishlist()
    const wishlisted = isInWishlist(productId)

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (!variantId || isAdding) return
        setIsAdding(true)
        try {
            await addToCart({ variantId, quantity: 1, countryCode })
            setAdded(true)
            setTimeout(() => setAdded(false), 2000)
        } catch (err) {
            console.error("Failed to add to cart", err)
        } finally {
            setIsAdding(false)
        }
    }

    const handleWishlist = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        toggleWishlist(productId)
    }

    const cartLabel = isAdding ? "Adding…" : added ? "Added ✓" : "Add to Cart"

    // ── OVERLAY: desktop hover-reveal slide-up bar ──
    if (variant === "overlay") {
        return (
            <>
                {/* Wishlist ♡ — desktop: opacity-0 until hover, always visible if wishlisted */}
                <button
                    onClick={handleWishlist}
                    className={`absolute top-2 left-2 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm ${wishlisted
                            ? "bg-red-50 text-red-500"
                            : "bg-white/80 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-50"
                        }`}
                    title={wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill={wishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                </button>

                {/* Add to Cart slide-up bar */}
                <div className="absolute bottom-0 left-0 w-full translate-y-full group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100 z-10 flex">
                    <button
                        onClick={handleAddToCart}
                        disabled={isAdding}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 text-white text-sm font-bold uppercase tracking-wider transition-colors ${added ? "bg-emerald-600" : isAdding ? "bg-brand-green/80 cursor-wait" : "bg-brand-green hover:bg-brand-green-dark"
                            }`}
                    >
                        {isAdding && (
                            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                        )}
                        {cartLabel}
                    </button>
                    <a
                        href={`/${countryCode}/products/${productHandle}`}
                        className="w-12 flex items-center justify-center bg-brand-dark/80 hover:bg-brand-dark text-white transition-colors"
                        title="View Details"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                        </svg>
                    </a>
                </div>
            </>
        )
    }

    // ── INLINE: always-visible Add to Cart button (mobile only) ──
    // Wishlist ♡ is handled by the separate WishlistButton component in product-preview
    return (
        <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`w-full mt-2 flex items-center justify-center gap-1.5 py-2 rounded-lg text-white text-xs font-bold uppercase tracking-wider transition-colors ${added ? "bg-emerald-600" : isAdding ? "bg-brand-green/80 cursor-wait" : "bg-brand-green active:bg-brand-green-dark"
                }`}
        >
            {isAdding && (
                <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
            )}
            {cartLabel}
        </button>
    )
}
