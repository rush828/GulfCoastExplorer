'use client'

import GoogleAd from '../GoogleAd'

/**
 * Ad component for Search Results Page
 * Displays between business listings
 * 
 * To enable: Set NEXT_PUBLIC_ENABLE_MANUAL_ADS=true in .env.local
 * 
 * Usage in SearchResults:
 *   {index > 0 && index % 5 === 0 && <SearchResultsAd />}
 */
export default function SearchResultsAd() {
  return (
    <div className="my-6">
      <div className="text-xs text-gray-400 text-center mb-2">Advertisement</div>
      <GoogleAd 
        slot="SEARCH_RESULTS_INFEED_AD_SLOT_ID" 
        format="fluid"
        responsive
        className="max-w-4xl mx-auto"
      />
    </div>
  )
}




