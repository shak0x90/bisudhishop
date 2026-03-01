"use client"

type ProductImageProps = {
    src: string | null | undefined
    alt: string
}

export default function ProductImage({ src, alt }: ProductImageProps) {
    const fallback = "/images/fallback-food.png"
    return (
        <img
            src={src || fallback}
            alt={alt}
            onError={(e) => {
                const img = e.target as HTMLImageElement
                if (img.src !== window.location.origin + fallback) {
                    img.src = fallback
                }
            }}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
    )
}
