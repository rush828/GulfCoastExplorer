'use client'

import Image from 'next/image'
import { useState, useCallback } from 'react'

interface OptimizedImageProps {
  businessId: string
  businessName: string
  primaryCategory: string
  className?: string
  priority?: boolean
  sizes?: string
  width?: number
  height?: number
  alt?: string
}

const getCategoryIcon = (category: string) => {
  const iconMap: Record<string, string> = {
    restaurant: '🍽️',
    lodging: '🏨',
    beach: '🏖️',
    water_sports: '🏄',
    marina: '⛵',
    bar: '🍺',
    coffee_shop: '☕',
    shopping_mall: '🛍️',
    spa: '💆',
    spa_fitness: '🧘',
    golf_course: '⛳',
    park_recreation: '🌳',
    historic_landmark: '🏛️',
    tourist_attraction: '📸',
    default: '🏢'
  }
  return iconMap[category] || iconMap.default
}

const getCategoryFallbackImage = (category: string) => {
  const fallbackMap: Record<string, string> = {
    restaurant: '/images/categories/restaurant-default.jpg',
    lodging: '/images/categories/hotel-default.jpg',
    beach: '/images/categories/beach-default.jpg',
    water_sports: '/images/categories/water-sports-default.jpg',
    marina: '/images/categories/marina-default.jpg',
    bar: '/images/categories/bar-default.jpg',
    coffee_shop: '/images/categories/coffee-default.jpg',
    shopping_mall: '/images/categories/shopping-default.jpg',
    spa: '/images/categories/spa-default.jpg',
    spa_fitness: '/images/categories/fitness-default.jpg',
    golf_course: '/images/categories/golf-default.jpg',
    park_recreation: '/images/categories/park-default.jpg',
    historic_landmark: '/images/categories/historic-default.jpg',
    tourist_attraction: '/images/categories/attraction-default.jpg',
  }
  return fallbackMap[category] || '/images/categories/business-default.jpg'
}

export default function OptimizedImage({
  businessId,
  businessName,
  primaryCategory,
  className = "w-full h-full object-cover",
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  width = 400,
  height = 300,
  alt
}: OptimizedImageProps) {
  const [imageState, setImageState] = useState<'thumbnail' | 'category' | 'icon'>('thumbnail')
  const [hasError, setHasError] = useState(false)

  const handleError = useCallback(() => {
    if (imageState === 'thumbnail') {
      setImageState('category')
    } else if (imageState === 'category') {
      setImageState('icon')
      setHasError(true)
    }
  }, [imageState])

  const getImageSrc = () => {
    switch (imageState) {
      case 'thumbnail':
        // Clean the business ID for filename
        const cleanId = businessId.replace(/[<>:"/\\|?*]/g, '_')
        return `/images/thumbnails/${encodeURIComponent(cleanId)}.jpg`
      case 'category':
        return getCategoryFallbackImage(primaryCategory)
      default:
        return '/images/placeholder.jpg' // This won't be used when showing icon
    }
  }

  const imageAlt = alt || `${businessName} - ${primaryCategory}`

  // Show icon fallback
  if (hasError && imageState === 'icon') {
    return (
      <div className={`${className} bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center relative overflow-hidden`}>
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50"></div>
          <div 
            className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e0f2fe' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          />
        </div>
        
        {/* Category icon with background */}
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
            <span className="text-2xl">{getCategoryIcon(primaryCategory)}</span>
          </div>
          <div className="text-white font-semibold text-sm">{primaryCategory.replace('_', ' ')}</div>
          <div className="text-blue-100 text-xs mt-1">Photo coming soon</div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-2 right-2 w-3 h-3 bg-blue-200 rounded-full opacity-60"></div>
        <div className="absolute bottom-3 left-3 w-2 h-2 bg-cyan-200 rounded-full opacity-60"></div>
      </div>
    )
  }

  return (
    <Image
      src={getImageSrc()}
      alt={imageAlt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      sizes={sizes}
      onError={handleError}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
      quality={85}
      loading={priority ? "eager" : "lazy"}
    />
  )
}

