"use client"

import { Button } from "@medusajs/ui"
import Image from "next/image"
import { useState, useEffect } from "react"

type HeroProps = {
  slides: any[]
}

const Hero = ({ slides }: HeroProps) => {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Use fallback if no slides exist in CMS
  const activeSlides = slides && slides.length > 0 ? slides : [{
    title: "Premium Spices & Aromatic Rice",
    subtitle: "100% organic, farm-direct spices and hand-selected rice varieties from Bangladesh.",
    image_url: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&h=600&fit=crop",
    badge_text: "100% ORGANIC"
  }]

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [activeSlides])

  if (activeSlides.length === 0) return null;

  const slide = activeSlides[currentSlide]

  return (
    <div className="w-full relative bg-brand-light border-b border-gray-100 overflow-hidden font-nunito">

      {/* Decorative leaf background watermarks */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-contain bg-no-repeat opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Cpath d=\'M0 100 Q 50 0 100 0 Q 50 100 0 100\' fill=\'%23000\'/%3E%3C/svg%3E")' }}></div>

      <div className="content-container mx-auto px-8 min-h-[600px] flex flex-col md:flex-row items-center justify-between relative z-10">

        {/* Left Side: Text Content */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left pt-20 pb-10 md:py-32 max-w-xl z-20">

          <div className="flex flex-col items-center md:items-start mb-6">
            <span className="font-caveat text-4xl text-brand-green tracking-wider">LOCAL & FRESH</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl text-brand-dark font-bold leading-tight mb-4 tracking-tight min-h-[120px] md:min-h-0 flex items-center">
            <span className="block w-full">{slide.title}</span>
          </h1>

          <p className="text-gray-500 mb-10 text-lg min-h-[56px] md:min-h-0 flex items-center">
            {slide.subtitle}
          </p>

          <Button variant="primary" className="bg-brand-green hover:bg-brand-green-dark text-white border-none rounded-sm px-8 py-3 h-12 text-sm font-bold tracking-widest uppercase transition-all shadow-[0_4px_14px_0_rgba(97,206,112,0.39)] hover:shadow-[0_6px_20px_rgba(97,206,112,0.23)] w-[200px]">
            START SHOPPING
          </Button>

          {/* Slider dots indicator */}
          {activeSlides.length > 1 && (
            <div className="flex gap-2 mt-20 md:mt-32">
              {activeSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${index === currentSlide ? "bg-brand-green" : "bg-gray-300"
                    }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Image Content */}
        <div className="relative w-full md:w-1/2 flex justify-center md:justify-end mt-10 md:mt-0 z-10">

          {/* Main Hero Image Placeholder */}
          <div className="relative w-full max-w-[500px] aspect-square flex items-center justify-center">
            {/* The Ajvar Jar - using a placeholder image */}
            <div className="absolute right-0 bottom-0 top-0 left-0">
              {/* Background sketched leaves under the jar */}
              <svg className="absolute w-[120%] h-[120%] -top-[10%] -left-[10%] opacity-20 text-blue-300" viewBox="0 0 200 200" fill="currentColor">
                <path d="M50 150 Q 80 100 150 50 Q 120 100 50 150" />
                <path d="M70 120 Q 100 70 170 20 Q 140 70 70 120" />
                <path d="M100 180 Q 130 130 200 80 Q 170 130 100 180" />
              </svg>
            </div>

            <img
              src={slide.image_url}
              alt={slide.title}
              className="relative z-20 w-full h-full object-cover rounded-3xl rotate-[-5deg] shadow-2xl transition-opacity duration-500"
              style={{ mixBlendMode: 'multiply', aspectRatio: '1/1' }}
            />

            {/* ECO Friendly Badge */}
            {slide.badge_text && (
              <div className="absolute top-[10%] right-[10%] z-30 bg-[#423326] text-white rounded-full w-28 h-28 flex flex-col items-center justify-center text-center p-2 shadow-lg border-[1px] border-dashed border-white border-opacity-30 transform rotate-12 transition-all duration-500">
                <span className="font-caveat flex flex-col text-2xl leading-none font-bold whitespace-pre-line">{slide.badge_text}</span>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  )
}

export default Hero
