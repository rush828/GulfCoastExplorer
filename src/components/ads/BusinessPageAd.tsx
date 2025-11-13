'use client'

import GoogleAd from '../GoogleAd'

interface BusinessPageAdProps {
  position: 'sidebar' | 'bottom'
}

/**
 * Ad component for Business Detail Page
 * 
 * Positions:
 *   - sidebar: 300x600 or responsive rectangle (desktop sidebar)
 *   - bottom: Below business description, before related businesses
 * 
 * To enable: Set NEXT_PUBLIC_ENABLE_MANUAL_ADS=true in .env.local
 */
export default function BusinessPageAd({ position }: BusinessPageAdProps) {
  
  if (position === 'sidebar') {
    return (
      <div className="hidden lg:block sticky top-4">
        <div className="text-xs text-gray-400 text-center mb-2">Advertisement</div>
        <GoogleAd 
          slot="BUSINESS_PAGE_SIDEBAR_AD_SLOT_ID" 
          format="rectangle"
          responsive
          className="max-w-sm"
        />
      </div>
    )
  }
  
  // Bottom position
  return (
    <div className="my-8">
      <div className="text-xs text-gray-400 text-center mb-2">Advertisement</div>
      <GoogleAd 
        slot="BUSINESS_PAGE_BOTTOM_AD_SLOT_ID" 
        format="auto"
        responsive
        className="max-w-3xl mx-auto"
      />
    </div>
  )
}




