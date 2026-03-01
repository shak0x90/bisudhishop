"use client"

import { useWishlist } from "@lib/context/wishlist-context"
import { useEffect, useState } from "react"
import ProductPreview from "@modules/products/components/product-preview"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"

type WishlistTemplateProps = {
    countryCode: string
}

export default function WishlistTemplate({ countryCode }: WishlistTemplateProps) {
    const { items } = useWishlist()
    const [products, setProducts] = useState<HttpTypes.StoreProduct[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchWishlistProducts = async () => {
            if (!items.length) {
                setProducts([])
                setIsLoading(false)
                return
            }

            try {
                const productIds = items.map(item => item.productId)

                const { response } = await listProducts({
                    countryCode,
                    queryParams: {
                        id: productIds,
                        limit: 50,
                    },
                })

                setProducts(response.products || [])
            } catch (error) {
                console.error("Error fetching wishlist products:", error)
                setProducts([])
            } finally {
                setIsLoading(false)
            }
        }

        fetchWishlistProducts()
    }, [items, countryCode])

    return (
        <div className="content-container py-12 px-4 md:px-8 min-h-[60vh]">
            <div className="mb-8 border-b border-gray-200 pb-6">
                <h1 className="text-3xl font-bold text-brand-dark mb-2">My Wishlist</h1>
                <p className="text-gray-500">
                    {items.length} {items.length === 1 ? "item" : "items"} saved
                </p>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center py-20">
                    <svg className="animate-spin w-8 h-8 text-brand-green" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                </div>
            ) : products.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 md:grid-cols-3 gap-x-6 gap-y-8">
                    {products.map((product) => (
                        <div key={product.id} className="relative group/wishlist">
                            <ProductPreview
                                product={product}
                                region={{ id: "reg_01KJHJW8V42R2HVKWZZMBSXYQ7", currency_code: "bdt", name: "Bangladesh" } as HttpTypes.StoreRegion} // Mock region since we just need it for types/price formatting
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-24 h-24 bg-brand-light rounded-full flex items-center justify-center mb-6 text-brand-green">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-brand-dark mb-3">Your wishlist is empty</h2>
                    <p className="text-gray-500 max-w-md mx-auto mb-8">
                        Found something you like? Tap on the heart icon next to the item to add it to your wishlist! All your saved items will appear here.
                    </p>
                    <LocalizedClientLink
                        href="/store"
                        className="bg-brand-green text-white font-bold px-8 py-3 rounded-lg hover:bg-brand-green-dark transition-colors inline-block tracking-wider uppercase text-sm"
                    >
                        Continue Shopping
                    </LocalizedClientLink>
                </div>
            )}
        </div>
    )
}
