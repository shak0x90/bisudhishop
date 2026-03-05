import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductPreview from "@modules/products/components/product-preview"

export default async function FreshThisWeek({
    countryCode,
}: {
    countryCode: string
}) {
    const region = await getRegion(countryCode)

    if (!region) return null

    const {
        response: { products, count },
    } = await listProducts({
        regionId: region.id,
        queryParams: {
            fields: "*variants.calculated_price,+variants.inventory_quantity",
            limit: 8,
        },
    })

    if (!products || products.length === 0) {
        return null
    }

    return (
        <div className="content-container mx-auto px-4 lg:px-8 py-10 md:py-16 font-nunito">
            {/* Section Header */}
            <div className="text-center mb-7 md:mb-10">
                <span className="font-caveat text-xl md:text-2xl text-brand-green">This Week's Picks</span>
                <h2 className="text-2xl md:text-4xl font-bold text-brand-dark mt-1">
                    Fresh This Week 🌿
                </h2>
                <p className="text-gray-500 mt-2 md:mt-3 max-w-md mx-auto text-sm md:text-base px-4">
                    Handpicked, chemical-free, and sourced directly from trusted farmers this week.
                </p>
            </div>

            {/* Product Grid — max 8 products, curated feel */}
            <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 items-stretch">
                {products.map((product) => (
                    <li key={product.id} className="h-full">
                        <ProductPreview product={product} region={region} isFeatured />
                    </li>
                ))}
            </ul>

            {/* View All */}
            {count > 8 && (
                <div className="text-center mt-10">
                    <LocalizedClientLink
                        href="/store"
                        className="inline-flex items-center gap-2 border border-brand-green text-brand-green font-semibold text-sm px-6 py-2.5 rounded-lg hover:bg-brand-green hover:text-white transition-colors"
                    >
                        View all products →
                    </LocalizedClientLink>
                </div>
            )}
        </div>
    )
}
