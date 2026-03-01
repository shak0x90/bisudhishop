import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { listCategories } from "@lib/data/categories"

// Fallback images for categories
const categoryImages: Record<string, string> = {
    "fresh-vegetables": "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=400&h=400&fit=crop",
    "local-fruits": "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&h=400&fit=crop",
    "meat-fish": "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&h=400&fit=crop",
    "meat-&-fish": "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&h=400&fit=crop",
    "dairy-&-eggs": "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&h=400&fit=crop",
    "dairy": "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&h=400&fit=crop",
    "spices-&-masala": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=400&fit=crop",
    "snacks": "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400&h=400&fit=crop",
    "whole-spices": "https://images.unsplash.com/photo-1599909533601-4c1baa65b5e8?w=400&h=400&fit=crop",
    "ground-spices": "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&h=400&fit=crop",
    "spice-blends": "https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=400&h=400&fit=crop",
    "premium-rice": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop",
    "organic-rice": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop",
    "rice-&-lentils": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop",
    "gift-boxes": "https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=400&h=400&fit=crop",
}

const defaultImage = "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=400&h=400&fit=crop"

// Priority categories to show on homepage (in order)
const homepagePriority = [
    "whole-spices",
    "ground-spices",
    "spice-blends",
    "premium-rice",
    "organic-rice",
    "gift-boxes",
]

const Categories = async () => {
    const allCategories = await listCategories()

    // Only show top-level categories (no parent)
    const topCategories = allCategories?.filter(
        (cat: any) => !cat.parent_category
    ) || []

    // Sort: show priority categories first, then others
    const sortedCategories = topCategories.sort((a: any, b: any) => {
        const aIdx = homepagePriority.indexOf(a.handle)
        const bIdx = homepagePriority.indexOf(b.handle)
        if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx
        if (aIdx !== -1) return -1
        if (bIdx !== -1) return 1
        return 0
    })

    // Show max 6 on homepage
    const displayCategories = sortedCategories.slice(0, 6)

    return (
        <div id="categories" className="content-container mx-auto px-6 md:px-8 py-12 md:py-20 font-nunito">
            <div className="text-center mb-10">
                <span className="font-caveat text-2xl text-brand-green">Browse</span>
                <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mt-1">Shop by Category</h2>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
                {displayCategories.map((cat: any) => (
                    <LocalizedClientLink href={`/categories/${cat.handle}`} key={cat.id} className="flex flex-col items-center group">
                        <div className="w-full aspect-square relative rounded-2xl overflow-hidden flex items-center justify-center transition-all group-hover:-translate-y-1 group-hover:shadow-lg mb-3 shadow-sm border-2 border-transparent group-hover:border-brand-green bg-gray-50">
                            <img
                                src={categoryImages[cat.handle] || defaultImage}
                                alt={cat.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <span className="text-brand-dark font-semibold text-xs md:text-sm text-center group-hover:text-brand-green transition-colors">{cat.name}</span>
                    </LocalizedClientLink>
                ))}
            </div>

            {/* View All Categories link */}
            {topCategories.length > 6 && (
                <div className="text-center mt-8">
                    <LocalizedClientLink
                        href="/categories"
                        className="inline-flex items-center gap-2 text-brand-green font-semibold hover:underline text-sm uppercase tracking-wider"
                    >
                        View All Categories →
                    </LocalizedClientLink>
                </div>
            )}
        </div>
    )
}

export default Categories
