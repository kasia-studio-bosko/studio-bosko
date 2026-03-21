'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'

export interface CarouselSlide {
  slug: string
  title: string
  location: string
  coverImage: string
  coverImageAlt: string
}

interface HeroCarouselProps {
  slides: CarouselSlide[]
  seeIfFitLabel: string
  seeAllLabel: string
}

export default function HeroCarousel({ slides, seeIfFitLabel, seeAllLabel }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const goTo = useCallback((index: number) => {
    setCurrent(index)
  }, [])

  const startInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length)
    }, 5500)
  }, [slides.length])

  useEffect(() => {
    startInterval()
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [startInterval])

  const handleDotClick = (i: number) => {
    goTo(i)
    startInterval() // reset timer on manual nav
  }

  return (
    <div className="absolute inset-0">
      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={slide.slug}
          className="absolute inset-0 transition-opacity duration-[900ms] ease-in-out"
          style={{ opacity: i === current ? 1 : 0 }}
          aria-hidden={i !== current}
        >
          <Image
            src={slide.coverImage}
            alt={slide.coverImageAlt}
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover"
            quality={90}
          />
        </div>
      ))}

      {/* Dark gradient — top (for nav legibility) and bottom (for text) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 35%, transparent 60%, rgba(0,0,0,0.45) 100%)',
        }}
      />

      {/* Bottom-left: intro copy + CTA */}
      <div className="absolute bottom-0 left-0 right-0 px-8 md:px-12 pb-14 flex items-end justify-between gap-6">
        <div>
          <p className="font-cadiz text-xs tracking-[0.18em] uppercase text-white/60 mb-1">
            {slides[current].location}
          </p>
          <p className="font-signifier font-light text-2xl md:text-3xl text-white leading-tight">
            {slides[current].title}
          </p>
        </div>

        {/* Bottom-right: nav dots + see-all link */}
        <div className="flex flex-col items-end gap-4 shrink-0">
          {/* Dots */}
          <div className="flex items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => handleDotClick(i)}
                aria-label={`Show slide ${i + 1}`}
                className="flex items-center justify-center"
              >
                <span
                  className={`block rounded-full transition-all duration-400 bg-white ${
                    i === current
                      ? 'w-6 h-[3px] opacity-100'
                      : 'w-[6px] h-[6px] opacity-40 hover:opacity-70'
                  }`}
                />
              </button>
            ))}
          </div>
          {/* See all link */}
          <Link
            href="/projects"
            className="font-cadiz text-[13px] text-white/70 hover:text-white transition-colors duration-200 tracking-wide"
          >
            {seeAllLabel} →
          </Link>
        </div>
      </div>
    </div>
  )
}
