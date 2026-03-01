import { listProducts } from "@lib/data/products"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"

export default async function ProductPreview({
  product,
  isFeatured,
  region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  const { cheapestPrice } = getProductPrice({
    product,
  })

  // Simulated badge logic based on price type or arbitrary logic setup
  const isSale = cheapestPrice?.price_type === "sale"
  const isHotSale = false // Placeholder logic for "HOT SALE!" badge

  return (
    <div className="group relative bg-white border border-transparent hover:border-gray-100 hover:shadow-lg transition-all duration-300 font-nunito flex flex-col items-center p-4">
      {/* Badges */}
      {isSale && (
        <div className="absolute top-2 right-2 bg-brand-peach text-white text-[10px] font-bold uppercase rounded-full w-10 h-10 flex items-center justify-center z-20">
          SALE!
        </div>
      )}
      {isHotSale && (
        <div className="absolute top-2 right-2 bg-brand-red text-white text-[10px] font-bold uppercase rounded-full w-10 h-10 flex flex-col items-center justify-center z-20 leading-none">
          <span>HOT</span><span>SALE!</span>
        </div>
      )}

      {/* Image container */}
      <div className="relative w-full aspect-square flex items-center justify-center overflow-hidden mb-4">
        <LocalizedClientLink href={`/products/${product.handle}`} className="w-full h-full flex items-center justify-center">
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="full"
            isFeatured={isFeatured}
          />
        </LocalizedClientLink>

        {/* Hover overlay bar */}
        <div className="absolute bottom-0 left-0 w-full bg-brand-green translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-between text-white py-2 opacity-0 group-hover:opacity-100 z-10 px-4">
          <button className="hover:text-amber-200 transition-colors tooltip" aria-label="Add to cart"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg></button>
          <div className="w-px h-4 bg-white/30"></div>
          <button className="hover:text-amber-200 transition-colors tooltip" aria-label="Wishlist"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg></button>
          <div className="w-px h-4 bg-white/30"></div>
          <button className="hover:text-amber-200 transition-colors tooltip" aria-label="Quick View"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg></button>
          <div className="w-px h-4 bg-white/30"></div>
          <button className="hover:text-amber-200 transition-colors tooltip" aria-label="Compare"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 3 21 3 21 8" /><line x1="4" y1="20" x2="21" y2="3" /><polyline points="21 16 21 21 16 21" /><line x1="15" y1="15" x2="21" y2="21" /><line x1="4" y1="4" x2="9" y2="9" /></svg></button>
        </div>
      </div>

      {/* Product info */}
      <div className="flex flex-col items-center w-full mt-2 z-20 bg-white">
        <LocalizedClientLink href={`/products/${product.handle}`} className="text-center w-full">
          <h3 className="text-brand-dark font-bold text-sm tracking-wide mb-1" data-testid="product-title">
            {product.title}
          </h3>
        </LocalizedClientLink>
        {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
      </div>
    </div>
  )
}
