import LocalizedClientLink from "@modules/common/components/localized-client-link"
import React from "react"
import { ArrowRight } from "@medusajs/icons"
import { listCategories } from "@lib/data/categories"

// Fallback images for categories that don't have their own
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

export default async function CategoriesTemplate() {
  const categories = await listCategories()

  // Filter to only show top-level (no parent) active categories
  const topCategories = categories?.filter(
    (cat: any) => !cat.parent_category
  ) || []

  return (
    <div className="content-container mx-auto px-8 py-16 font-nunito">
      <div className="mb-12 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-brand-dark mb-4">Shop by Categories</h1>
        <p className="text-gray-600 text-lg">Browse our wide selection of premium organic spices, rice, and more.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {topCategories.map((cat: any) => (
          <LocalizedClientLink href={`/categories/${cat.handle}`} key={cat.id} className="group flex flex-col items-center bg-ui-bg-subtle p-6 border rounded-2xl hover:shadow-xl transition-all hover:border-brand-green duration-300">
            <div className="w-3/4 aspect-square relative rounded-full overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105 mb-6 shadow-sm border-2 border-transparent group-hover:border-brand-green">
              <img
                src={categoryImages[cat.handle] || defaultImage}
                alt={cat.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-brand-dark font-bold text-xl text-center mb-2 group-hover:text-brand-green">{cat.name}</h3>
            <p className="text-gray-500 text-sm text-center mb-4 leading-relaxed">
              {cat.description || `Explore our ${cat.name.toLowerCase()} collection.`}
            </p>
            <div className="mt-auto text-brand-green flex items-center text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">
              Browse Category <ArrowRight className="ml-2 w-4 h-4" />
            </div>
          </LocalizedClientLink>
        ))}
      </div>
    </div>
  )
}
