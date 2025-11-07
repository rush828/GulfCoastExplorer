'use client'

import { useEffect } from 'react'

interface GoogleAdProps {
  slot: string
  format?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal'
  responsive?: boolean
  className?: string
}

/**
 * Google AdSense Ad Component
 * 
 * Only displays ads when NEXT_PUBLIC_ENABLE_MANUAL_ADS=true in .env.local
 * This prevents ads from showing until you're ready to enable them.
 * 
 * Usage:
 *   <GoogleAd slot="1234567890" format="auto" responsive />
 * 
 * Common formats:
 *   - auto: Responsive, adapts to available space
 *   - fluid: In-feed ads (good for listings)
 *   - rectangle: 300x250 or responsive rectangle
 *   - vertical: 160x600 skyscraper
 *   - horizontal: 728x90 leaderboard
 */
export default function GoogleAd({ 
  slot, 
  format = 'auto', 
  responsive = true,
  className = ''
}: GoogleAdProps) {
  
  // Only show ads if manual ads are enabled
  const adsEnabled = process.env.NEXT_PUBLIC_ENABLE_MANUAL_ADS === 'true'
  
  useEffect(() => {
    if (adsEnabled && typeof window !== 'undefined') {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch (error) {
        console.error('AdSense error:', error)
      }
    }
  }, [adsEnabled])

  // Don't render anything if ads are disabled
  if (!adsEnabled) {
    return null
  }

  return (
    <div className={`my-4 ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-8279188739485299"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  )
}




