"use client"

import { Button } from "@medusajs/ui"
import { useState, useEffect } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type HeroProps = {
  slides: any[]
}

const Hero = ({ slides }: HeroProps) => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const activeSlides = slides && slides.length > 0 ? slides : [{
    title: "Safe, Fresh Food for Your Family",
    subtitle: "Chemical-free groceries from Bangladeshi farmers, delivered to your door.",
    image_url: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=700&h=500&fit=crop",
    badge_text: "CHEMICAL FREE"
  }]

  useEffect(() => {
    if (activeSlides.length <= 1) return
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [activeSlides])

  if (activeSlides.length === 0) return null

  const slide = activeSlides[currentSlide]

  return (
    <div className="w-full relative bg-brand-light border-b border-gray-100 overflow-hidden font-nunito">

      <div className="content-container mx-auto px-6 md:px-8">
        {/*
          Mobile: stacked vertically, text on top, image below.
          Desktop: side by side.
          Max height capped at ~80vh on mobile via py constraints.
        */}
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12 py-10 md:py-20">

          {/* ── Text side ── */}
          <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left order-1">

            {/* Label */}
            <span className="font-caveat text-xl md:text-2xl text-brand-green tracking-wide mb-2">
              Locally Grown, Carefully Delivered
            </span>

            {/* Headline — no min-h, just clamp */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl text-brand-dark font-bold leading-tight mb-3 tracking-tight">
              {slide.title}
            </h1>

            {/* Subtitle — max 2 lines */}
            <p className="text-gray-500 text-base md:text-lg mb-7 max-w-sm md:max-w-none line-clamp-2">
              {slide.subtitle}
            </p>

            {/* Primary CTA */}
            <Button
              variant="primary"
              className="bg-brand-green hover:bg-brand-green-dark text-white border-none rounded-lg px-7 py-3 h-11 text-sm font-bold tracking-wider uppercase transition-all shadow-md w-full sm:w-auto mb-3"
            >
              Shop Fresh Groceries
            </Button>

            {/* Soft anchor link */}
            <a
              href="#categories"
              className="text-brand-green font-medium text-sm hover:text-brand-green-dark transition-colors flex items-center gap-1.5 mt-1"
            >
              Browse Categories
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </a>

            {/* Slide dots */}
            {activeSlides.length > 1 && (
              <div className="flex gap-2 mt-5">
                {activeSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${index === currentSlide ? "bg-brand-green" : "bg-gray-300"}`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ── Image side ── */}
          {/* Hidden on very small screens (< 380px), shown from xs up */}
          <div className="w-full md:w-1/2 flex justify-center order-2 md:justify-end">
            <div className="relative w-full max-w-[320px] md:max-w-[440px] aspect-[4/3] md:aspect-square rounded-2xl overflow-hidden shadow-xl">
              <img
                src={slide.image_url}
                alt={slide.title}
                className="w-full h-full object-cover transition-opacity duration-500"
              />
              {/* Badge */}
              {slide.badge_text && (
                <div className="absolute top-3 right-3 bg-[#2B2D26]/90 text-white rounded-full w-16 h-16 flex items-center justify-center text-center p-1 shadow-lg">
                  <span className="font-caveat text-[11px] leading-tight font-bold">{slide.badge_text}</span>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Hero
