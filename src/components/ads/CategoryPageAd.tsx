'use client'

import GoogleAd from '../GoogleAd'

interface CategoryPageAdProps {
  position: 'top' | 'inline'
}

/**
 * Ad component for Category Pages
 * 
 * Positions:
 *   - top: Banner at top of category page
 *   - inline: Between category listings
 * 
 * To enable: Set NEXT_PUBLIC_ENABLE_MANUAL_ADS=true in .env.local
 */
export default function CategoryPageAd({ position }: CategoryPageAdProps) {
  
  if (position === 'top') {
    return (
      <div className="my-6">
        <div className="text-xs text-gray-400 text-center mb-2">Advertisement</div>
        <GoogleAd 
          slot="CATEGORY_PAGE_TOP_AD_SLOT_ID" 
          format="horizontal"
          responsive
          className="max-w-5xl mx-auto"
        />
      </div>
    )
  }
  
  // Inline position - between listings
  return (
    <div className="my-6">
      <div className="text-xs text-gray-400 text-center mb-2">Advertisement</div>
      <GoogleAd 
        slot="CATEGORY_PAGE_INLINE_AD_SLOT_ID" 
        format="fluid"
        responsive
        className="max-w-4xl mx-auto"
      />
    </div>
  )
}




