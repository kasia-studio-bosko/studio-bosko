'use client'

import { useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export interface CarouselProject {
  slug: string
  title: string
  location: string
  year: string
  coverImage: string
  coverImageAlt: string
  category?: string
}

interface ProjectCarouselProps {
  projects: CarouselProject[]
  locale: string
  viewLabel?: string
}

export default function ProjectCarousel({
  projects,
  locale,
  viewLabel = 'View project',
}: ProjectCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const prefix = locale === 'en' ? '' : `/${locale}`
  const projectPath = locale === 'de' ? 'projekt' : locale === 'pl' ? 'projekt' : 'project'

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    const track = trackRef.current
    if (!track) return
    setIsDragging(true)
    setStartX(e.pageX - track.offsetLeft)
    setScrollLeft(track.scrollLeft)
  }, [])

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || !trackRef.current) return
      e.preventDefault()
      const x = e.pageX - trackRef.current.offsetLeft
      const walk = (x - startX) * 1.2
      trackRef.current.scrollLeft = scrollLeft - walk
    },
    [isDragging, startX, scrollLeft]
  )

  const stopDragging = useCallback(() => setIsDragging(false), [])

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="carousel-track py-4 -mx-[var(--page-padding-x)] px-[var(--page-padding-x)] cursor-grab active:cursor-grabbing select-none"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}
        aria-label="Projects carousel"
      >
        {projects.map((project) => (
          <div
            key={project.slug}
            className="carousel-slide w-[min(420px,80vw)] md:w-[480px]"
          >
            <Link
              href={`${prefix}/${projectPath}/${project.slug}`}
              className="group block"
              tabIndex={0}
              draggable={false}
            >
              <div className="img-zoom-wrap aspect-[3/4] w-full bg-[#d4cbc0] overflow-hidden">
                <Image
                  src={project.coverImage}
                  alt={project.coverImageAlt}
                  fill
                  sizes="(max-width: 768px) 80vw, 480px"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  draggable={false}
                />
              </div>
              <div className="mt-4 flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-signifier font-light text-lg leading-tight tracking-tight group-hover:text-[#f5500a] transition-colors duration-200">
                    {project.title}
                  </h3>
                  <p className="mt-1 text-sm font-cadiz text-[#120b09]/60">
                    {project.location}
                    {project.year && ` · ${project.year}`}
                  </p>
                </div>
                <span className="text-xs font-cadiz tracking-widest uppercase text-[#120b09]/50 group-hover:text-[#f5500a] transition-colors duration-200 whitespace-nowrap mt-1">
                  {viewLabel} →
                </span>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
