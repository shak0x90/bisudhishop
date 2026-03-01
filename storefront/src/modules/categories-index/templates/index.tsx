import LocalizedClientLink from "@modules/common/components/localized-client-link"
import React from "react"
import { ArrowRight } from "@medusajs/icons"

const customCategories = [
  { title: "Fresh Vegetables", img: "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=400&h=400&fit=crop", bg: "bg-[#DFF7F9]", link: "/categories/fresh-vegetables", description: "Farm fresh vegetables from local farmers directly to your doorstep." },
  { title: "Local Fruits", img: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&h=400&fit=crop", bg: "bg-[#FCF5EB]", link: "/categories/local-fruits", description: "Seasonal and sweet organic fruits sourced from across Bangladesh." },
  { title: "Meat & Fish", img: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&h=400&fit=crop", bg: "bg-[#FCEDEF]", link: "/categories/meat-fish", description: "Freshly cut halal meat and riveren fish for your daily needs." },
  { title: "Dairy & Eggs", img: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&h=400&fit=crop", bg: "bg-[#E8F5E9]", link: "/categories/dairy", description: "Pure milk, desi eggs, and traditional dairy products." },
  { title: "Spices & Masala", img: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=400&fit=crop", bg: "bg-[#F5F5ED]", link: "/categories/spices", description: "Authentic deshi spices ground to perfection." },
  { title: "Snacks", img: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400&h=400&fit=crop", bg: "bg-[#F0F0FC]", link: "/categories/snacks", description: "Healthy organic snacks for your tea time cravings." }
];

export default function CategoriesTemplate() {
  return (
    <div className="content-container mx-auto px-8 py-16 font-nunito">
      <div className="mb-12 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-brand-dark mb-4">Shop by Categories</h1>
        <p className="text-gray-600 text-lg">Browse our wide selection of fresh, authentic Bangladeshi grocery products across all categories.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {customCategories.map((cat, idx) => (
          <LocalizedClientLink href={cat.link} key={idx} className="group flex flex-col items-center bg-ui-bg-subtle p-6 border rounded-2xl hover:shadow-xl transition-all hover:border-brand-green duration-300">
            <div className={`w-3/4 aspect-square relative rounded-full overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105 mb-6 shadow-sm border-2 border-transparent group-hover:border-brand-green`}>
              <img src={cat.img} alt={cat.title} className="w-full h-full object-cover" />
            </div>
            <h3 className="text-brand-dark font-bold text-xl text-center mb-2 group-hover:text-brand-green">{cat.title}</h3>
            <p className="text-gray-500 text-sm text-center mb-4 leading-relaxed">{cat.description}</p>
            <div className="mt-auto text-brand-green flex items-center text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">
              Browse Category <ArrowRight className="ml-2 w-4 h-4" />
            </div>
          </LocalizedClientLink>
        ))}
      </div>
    </div>
  )
}
