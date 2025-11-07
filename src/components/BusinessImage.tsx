'use client'

import { useState } from 'react'
import { getCategoryImageUrl } from '@/lib/category-image-mapping'

interface BusinessImageProps {
  businessId: string
  businessName: string
  businessCategory: string
  hasPhotos: boolean
  className?: string
}

// Helper function to get local thumbnail URL
function getLocalThumbnailUrl(businessId: string) {
  // Decode the business ID first (in case it comes URL-encoded from the URL)
  // Then use as-is to match the actual filename
  const decodedId = decodeURIComponent(businessId);
  return `/images/thumbnails/${decodedId}.jpg`;
}

// Helper function to get category fallback image URL
function getCategoryFallbackUrl(primaryCategory: string) {
  return getCategoryImageUrl(primaryCategory);
}

// Get category icon (same logic as other components)
function getCategoryIcon(category: string) {
  switch (category) {
    case 'restaurant':
    case 'food-dining':
      return '🍽️'
    case 'lodging':
    case 'accommodations':
      return '🏨'
    case 'water_sports':
    case 'water-activities':
      return '🏄'
    case 'store':
    case 'shopping-retail':
      return '🛍️'
    case 'entertainment':
    case 'nightlife-entertainment':
      return '🎭'
    case 'bar':
      return '🍺'
    case 'marina':
      return '⛵'
    case 'beach':
      return '🏖️'
    case 'park_recreation':
      return '🌳'
    case 'golf_course':
      return '⛳'
    default:
      return '🏢'
  }
}

export default function BusinessImage({ 
  businessId, 
  businessName, 
  businessCategory, 
  hasPhotos, 
  className = "w-full h-full object-cover" 
}: BusinessImageProps) {
  const [imageState, setImageState] = useState<'loading' | 'thumbnail' | 'category' | 'icon'>('loading')
  const [showIcon, setShowIcon] = useState(false)
  
  const handleImageError = () => {
    if (imageState === 'loading' || imageState === 'thumbnail') {
      // Try category image next
      setImageState('category')
    } else if (imageState === 'category') {
      // Final fallback: show category icon
      setImageState('icon')
      setShowIcon(true)
    }
  }
  
  const handleImageLoad = () => {
    // Successfully loaded
    setShowIcon(false)
  }
  
  const getImageSrc = () => {
    switch (imageState) {
      case 'loading':
      case 'thumbnail':
        return getLocalThumbnailUrl(businessId)
      case 'category':
        return getCategoryFallbackUrl(businessCategory)
      default:
        return getLocalThumbnailUrl(businessId) // This won't be used when showIcon is true
    }
  }
  
  if (showIcon) {
    return (
      <div className={`${className} bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center`}>
        <div className="text-4xl text-white">{getCategoryIcon(businessCategory)}</div>
      </div>
    )
  }
  
  return (
    <img 
      src={getImageSrc()}
      alt={`${businessName} - ${businessCategory}`}
      className={className}
      onError={handleImageError}
      onLoad={handleImageLoad}
    />
  )
}
