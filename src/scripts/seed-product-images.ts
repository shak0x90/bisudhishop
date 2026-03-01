import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

/**
 * Seed script to add multiple images to existing products.
 * Run: npx medusa exec src/scripts/seed-product-images.ts
 */
export default async function seedProductImages({ container }: ExecArgs) {
    const productService = container.resolve(Modules.PRODUCT)

    // Additional images mapped by product handle
    const productImages: Record<string, string[]> = {
        // Spice products
        "holud-turmeric-powder-200g": [
            "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=800&h=800&fit=crop",
        ],
        "whole-cumin-jeera-200g": [
            "https://images.unsplash.com/photo-1599909533601-4c1baa65b5e8?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&h=800&fit=crop",
        ],
        "whole-coriander-dhonia-200g": [
            "https://images.unsplash.com/photo-1599909533601-4c1baa65b5e8?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=800&h=800&fit=crop",
        ],
        "whole-black-pepper-golmorich-100g": [
            "https://images.unsplash.com/photo-1599909533601-4c1baa65b5e8?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&h=800&fit=crop",
        ],
        "whole-cardamom-elachi-50g": [
            "https://images.unsplash.com/photo-1599909533601-4c1baa65b5e8?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&h=800&fit=crop",
        ],
        "coriander-powder-250g": [
            "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=800&h=800&fit=crop",
        ],
        "chili-powder-morich-gura-200g": [
            "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&h=800&fit=crop",
        ],
        "garam-masala-100g": [
            "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=800&h=800&fit=crop",
        ],
        // Rice products
        "miniket-rice-5kg": [
            "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=800&h=800&fit=crop",
        ],
        "nazirshail-rice-5kg": [
            "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=800&h=800&fit=crop",
        ],
        "chinigura-aromatic-rice-2kg": [
            "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=800&h=800&fit=crop",
        ],
        "kataribhog-premium-rice-2kg": [
            "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=800&h=800&fit=crop",
        ],
        // Blend products
        "biryani-masala-100g": [
            "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=800&h=800&fit=crop",
        ],
        "curry-masala-blend-150g": [
            "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=800&h=800&fit=crop",
        ],
        "fish-curry-masala-100g": [
            "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=800&h=800&fit=crop",
        ],
    }

    let updatedCount = 0
    let skippedCount = 0

    for (const [handle, additionalImages] of Object.entries(productImages)) {
        try {
            // Find the product by handle
            const [product] = await productService.listProducts(
                { handle },
                { relations: ["images"] }
            )

            if (!product) {
                console.log(`⚠️  Product not found: ${handle}`)
                skippedCount++
                continue
            }

            // Get existing images
            const existingUrls = product.images?.map((img: any) => img.url) || []

            // Only add images that don't already exist
            const newImages = additionalImages.filter(
                (url) => !existingUrls.includes(url)
            )

            if (newImages.length === 0) {
                console.log(`✓  ${handle} — already has all images`)
                skippedCount++
                continue
            }

            // Combine existing + new images
            const allImages = [
                ...existingUrls.map((url: string) => ({ url })),
                ...newImages.map((url) => ({ url })),
            ]

            await productService.updateProducts(product.id, {
                images: allImages,
            })

            console.log(
                `✅ ${handle} — added ${newImages.length} images (total: ${allImages.length})`
            )
            updatedCount++
        } catch (error: any) {
            console.error(`❌ Error updating ${handle}:`, error.message)
        }
    }

    console.log(
        `\n🎉 Done! Updated: ${updatedCount}, Skipped: ${skippedCount}`
    )
}
