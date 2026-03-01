"use client"

import { useWishlist } from "@lib/context/wishlist-context"

type WishlistButtonProps = {
    productId: string
}

export default function WishlistButton({ productId }: WishlistButtonProps) {
    const { isInWishlist, toggleWishlist } = useWishlist()
    const wishlisted = isInWishlist(productId)

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        toggleWishlist(productId)
    }

    return (
        <button
            onClick={handleClick}
            className={`absolute top-2 left-2 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm ${wishlisted
                    ? "bg-red-50 text-red-500"
                    : "bg-white/80 text-gray-400 hover:text-red-500 hover:bg-red-50"
                }`}
            title={wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={wishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
        </button>
    )
}
