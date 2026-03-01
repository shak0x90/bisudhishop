"use client"

import { useWishlist } from "@lib/context/wishlist-context"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function WishlistButton() {
    const { count } = useWishlist()

    return (
        <LocalizedClientLink href="/wishlist" className="relative cursor-pointer hover:text-brand-green">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-red text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                    {count > 9 ? "9+" : count}
                </span>
            )}
        </LocalizedClientLink>
    )
}
