import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { HttpTypes } from "@medusajs/types"
import ProductPreview from "@modules/products/components/product-preview"

export default async function AllProducts({
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
            limit: 50,
        },
    })

    if (!products || products.length === 0) {
        return null
    }

    return (
        <div className="content-container mx-auto px-4 lg:px-8 py-10 md:py-14 font-nunito">
            {/* Section Header */}
            <div className="text-center mb-8 md:mb-10">
                <span className="font-caveat text-xl md:text-2xl text-brand-green">Our Collection</span>
                <h2 className="text-2xl md:text-4xl font-bold text-brand-dark mt-1">
                    Premium Spices & Rice
                </h2>
                <p className="text-gray-500 mt-2 md:mt-3 max-w-md mx-auto text-sm md:text-base px-4">
                    Handpicked, organic, and sourced directly from farmers. Every product is a promise of purity.
                </p>
            </div>

            {/* Product Grid */}
            <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                {products.map((product) => (
                    <li key={product.id}>
                        <ProductPreview product={product} region={region} isFeatured />
                    </li>
                ))}
            </ul>

            {/* View All link if many products */}
            {count > 50 && (
                <div className="text-center mt-10">
                    <a
                        href={`/${countryCode}/store`}
                        className="inline-flex items-center gap-2 text-brand-green font-semibold hover:underline text-sm uppercase tracking-wider"
                    >
                        View All Products →
                    </a>
                </div>
            )}
        </div>
    )
}
