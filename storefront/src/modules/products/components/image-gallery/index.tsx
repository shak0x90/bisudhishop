"use client"

import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import { useState } from "react"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0)

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-square bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 border border-gray-100">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-40">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      </div>
    )
  }

  const activeImage = images[activeIndex]

  return (
    <div className="flex flex-col gap-3">
      {/* Main Image */}
      <div className="relative w-full aspect-square bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm group/gallery">
        {activeImage?.url && (
          <Image
            src={activeImage.url}
            alt={`Product image ${activeIndex + 1}`}
            fill
            priority
            sizes="(max-width: 576px) 100vw, (max-width: 768px) 50vw, 600px"
            className="rounded-xl transition-transform duration-300"
            style={{ objectFit: "contain", padding: "12px" }}
          />
        )}

        {/* Image counter badge */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full font-medium">
            {activeIndex + 1} / {images.length}
          </div>
        )}

        {/* Left/Right arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-md flex items-center justify-center text-gray-600 hover:text-brand-dark transition-all opacity-0 group-hover/gallery:opacity-100"
              aria-label="Previous image"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              onClick={() => setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-md flex items-center justify-center text-gray-600 hover:text-brand-dark transition-all opacity-0 group-hover/gallery:opacity-100"
              aria-label="Next image"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setActiveIndex(index)}
              className={`relative shrink-0 w-20 h-20 sm:w-[72px] sm:h-[72px] rounded-lg overflow-hidden border-2 transition-all ${index === activeIndex
                  ? "border-brand-green shadow-md ring-1 ring-brand-green/30"
                  : "border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100"
                }`}
            >
              {image.url && (
                <Image
                  src={image.url}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  sizes="80px"
                  style={{ objectFit: "cover" }}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ImageGallery
