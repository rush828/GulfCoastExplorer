/**
 * Enhanced Google Analytics 4 Tracking
 * Enterprise-level event tracking and conversion monitoring
 */

// Extend the global gtag interface
declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: any) => void;
    dataLayer: any[];
  }
}

// Analytics configuration
const GA_TRACKING_ID = 'G-BS586J74XZ'

/**
 * Initialize enhanced analytics tracking
 */
export function initializeAnalytics() {
  // Ensure gtag is available
  if (typeof window === 'undefined' || !window.gtag) {
    return
  }

  // Enhanced configuration
  window.gtag('config', GA_TRACKING_ID, {
    // Enhanced ecommerce
    allow_google_signals: true,
    allow_ad_personalization_signals: true,
    
    // Custom parameters
    custom_map: {
      'custom_parameter_1': 'business_category',
      'custom_parameter_2': 'search_location',
      'custom_parameter_3': 'subscription_plan'
    },
    
    // Enhanced measurement
    enhanced_measurement_settings: {
      scroll_events: true,
      outbound_clicks: true,
      site_search: true,
      video_engagement: true,
      file_downloads: true
    }
  })

  // Set user properties
  ;(window as any).gtag('set', {
    page_title: document.title,
    page_location: window.location.href,
    language: navigator.language,
    user_agent: navigator.userAgent
  })
}

/**
 * Track business listing views
 */
export function trackBusinessView(business: {
  id: string
  name: string
  category: string
  city: string
  state: string
  rating?: number
}) {
  if (typeof window === 'undefined' || !window.gtag) return

  window.gtag('event', 'view_item', {
    item_id: business.id,
    item_name: business.name,
    item_category: business.category,
    location_city: business.city,
    location_state: business.state,
    rating: business.rating || 0,
    event_category: 'Business Interaction',
    event_label: `${business.name} - ${business.city}`,
    custom_parameter_1: business.category
  })
}

/**
 * Track search interactions
 */
export function trackSearch(searchParams: {
  query?: string
  category?: string
  city?: string
  state?: string
  resultsCount: number
}) {
  if (typeof window === 'undefined' || !window.gtag) return

  window.gtag('event', 'search', {
    search_term: searchParams.query || '',
    search_category: searchParams.category || '',
    search_city: searchParams.city || '',
    search_state: searchParams.state || '',
    results_count: searchParams.resultsCount,
    event_category: 'Search',
    event_label: `${searchParams.category || 'All'} in ${searchParams.city || searchParams.state || 'All Locations'}`,
    custom_parameter_2: `${searchParams.city || ''}, ${searchParams.state || ''}`
  })
}

/**
 * Track subscription form interactions
 */
export function trackSubscriptionStart(planType: 'basic' | 'featured', amount: number) {
  if (typeof window === 'undefined' || !window.gtag) return

  window.gtag('event', 'begin_checkout', {
    currency: 'USD',
    value: amount,
    coupon: '', // Add if you have discount codes
    items: [{
      item_id: `${planType}_listing`,
      item_name: `${planType.charAt(0).toUpperCase() + planType.slice(1)} Business Listing`,
      item_category: 'subscription',
      item_variant: planType,
      price: amount,
      quantity: 1
    }],
    event_category: 'Subscription',
    event_label: `${planType} - $${amount}`,
    custom_parameter_3: planType
  })
}

/**
 * Track subscription completion (revenue tracking)
 */
export function trackSubscriptionComplete(
  transactionId: string, 
  planType: 'basic' | 'featured', 
  amount: number,
  businessName: string
) {
  if (typeof window === 'undefined' || !window.gtag) return

  // Enhanced ecommerce purchase event
  window.gtag('event', 'purchase', {
    transaction_id: transactionId,
    value: amount,
    currency: 'USD',
    payment_type: 'paypal',
    shipping: 0,
    tax: 0,
    items: [{
      item_id: `${planType}_listing`,
      item_name: `${planType.charAt(0).toUpperCase() + planType.slice(1)} Business Listing`,
      item_category: 'subscription',
      item_variant: planType,
      item_brand: 'Gulf Coast Directory',
      price: amount,
      quantity: 1
    }],
    event_category: 'Revenue',
    event_label: `${businessName} - ${planType}`,
    custom_parameter_3: planType
  })

  // Also track as conversion
  window.gtag('event', 'conversion', {
    send_to: GA_TRACKING_ID,
    value: amount,
    currency: 'USD',
    event_category: 'Conversion',
    event_label: planType
  })
}

/**
 * Track newsletter signups
 */
export function trackNewsletterSignup(email: string, source: string = 'website') {
  if (typeof window === 'undefined' || !window.gtag) return

  window.gtag('event', 'sign_up', {
    method: 'email',
    event_category: 'Engagement',
    event_label: source,
    user_email: email // Note: Be careful with PII in production
  })
}

/**
 * Track contact form submissions
 */
export function trackContactForm(formData: {
  name: string
  email: string
  subject: string
  source: string
}) {
  if (typeof window === 'undefined' || !window.gtag) return

  window.gtag('event', 'generate_lead', {
    currency: 'USD',
    value: 0, // Potential customer value
    lead_type: 'contact_form',
    subject: formData.subject,
    source: formData.source,
    event_category: 'Lead Generation',
    event_label: formData.subject
  })
}

/**
 * Track file downloads
 */
export function trackFileDownload(fileName: string, fileType: string) {
  if (typeof window === 'undefined' || !window.gtag) return

  window.gtag('event', 'file_download', {
    file_name: fileName,
    file_extension: fileType,
    link_url: window.location.href,
    event_category: 'File Download',
    event_label: fileName
  })
}

/**
 * Track external link clicks
 */
export function trackExternalLink(url: string, linkText: string) {
  if (typeof window === 'undefined' || !window.gtag) return

  window.gtag('event', 'click', {
    link_url: url,
    link_text: linkText,
    link_domain: new URL(url).hostname,
    outbound: true,
    event_category: 'External Link',
    event_label: linkText
  })
}

/**
 * Track scroll depth milestones
 */
export function trackScrollDepth(percentage: number) {
  if (typeof window === 'undefined' || !window.gtag) return

  window.gtag('event', 'scroll', {
    percent_scrolled: percentage,
    event_category: 'Engagement',
    event_label: `${percentage}% Scrolled`
  })
}

/**
 * Track admin actions (for business intelligence)
 */
export function trackAdminAction(action: string, details?: any) {
  if (typeof window === 'undefined' || !window.gtag) return

  window.gtag('event', 'admin_action', {
    action_type: action,
    action_details: JSON.stringify(details || {}),
    event_category: 'Admin',
    event_label: action
  })
}

/**
 * Track user engagement timing
 */
export function trackUserTiming(category: string, variable: string, value: number) {
  if (typeof window === 'undefined' || !window.gtag) return

  window.gtag('event', 'timing_complete', {
    name: variable,
    value: value,
    event_category: category,
    event_label: `${variable}: ${value}ms`
  })
}

/**
 * Track custom business metrics
 */
export function trackBusinessMetric(metric: string, value: number, category: string) {
  if (typeof window === 'undefined' || !window.gtag) return

  window.gtag('event', 'custom_metric', {
    metric_name: metric,
    metric_value: value,
    metric_category: category,
    event_category: 'Business Metrics',
    event_label: `${metric}: ${value}`
  })
}

/**
 * Set user properties for segmentation
 */
export function setUserProperties(properties: {
  user_type?: 'visitor' | 'business_owner' | 'admin'
  subscription_status?: 'none' | 'basic' | 'featured'
  location_preference?: string
  category_interest?: string
}) {
  if (typeof window === 'undefined' || !window.gtag) return

  ;(window as any).gtag('set', {
    user_properties: {
      user_type: properties.user_type || 'visitor',
      subscription_status: properties.subscription_status || 'none',
      location_preference: properties.location_preference || '',
      category_interest: properties.category_interest || ''
    }
  })
}

/**
 * Track page performance metrics
 */
export function trackPagePerformance() {
  if (typeof window === 'undefined' || !window.gtag || !window.performance) return

  // Track Core Web Vitals when available
  if ('performance' in window && 'getEntriesByType' in window.performance) {
    // Navigation timing
    const navigation = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    if (navigation) {
      window.gtag('event', 'page_performance', {
        load_time: Math.round(navigation.loadEventEnd - navigation.fetchStart),
        dom_ready: Math.round(navigation.domContentLoadedEventEnd - navigation.fetchStart),
        first_byte: Math.round(navigation.responseStart - navigation.fetchStart),
        event_category: 'Performance',
        event_label: window.location.pathname
      })
    }
  }
}

/**
 * Enhanced error tracking
 */
export function trackError(error: Error, context?: string) {
  if (typeof window === 'undefined' || !window.gtag) return

  window.gtag('event', 'exception', {
    description: error.message,
    fatal: false,
    error_context: context || 'unknown',
    error_stack: error.stack?.substring(0, 150) || '', // Limit stack trace
    event_category: 'Error',
    event_label: error.message
  })
}

/**
 * Initialize scroll tracking
 */
export function initializeScrollTracking() {
  if (typeof window === 'undefined') return

  let scrollDepthTracked = new Set<number>()
  const milestones = [25, 50, 75, 90, 100]

  const trackScrollMilestones = () => {
    const scrollPercent = Math.round(
      (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    )

    milestones.forEach(milestone => {
      if (scrollPercent >= milestone && !scrollDepthTracked.has(milestone)) {
        trackScrollDepth(milestone)
        scrollDepthTracked.add(milestone)
      }
    })
  }

  // Throttled scroll listener
  let ticking = false
  const scrollListener = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        trackScrollMilestones()
        ticking = false
      })
      ticking = true
    }
  }

  window.addEventListener('scroll', scrollListener, { passive: true })
  
  // Clean up on page unload
  window.addEventListener('beforeunload', () => {
    window.removeEventListener('scroll', scrollListener)
  })
}

/**
 * Initialize external link tracking
 */
export function initializeExternalLinkTracking() {
  if (typeof window === 'undefined') return

  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement
    const link = target.closest('a')
    
    if (link && link.href) {
      const url = new URL(link.href, window.location.href)
      const isExternal = url.hostname !== window.location.hostname
      
      if (isExternal) {
        trackExternalLink(link.href, link.textContent || link.href)
      }
    }
  }, true)
}

// Auto-initialize enhanced tracking when module loads
if (typeof window !== 'undefined') {
  // Wait for gtag to be available
  const initWhenReady = () => {
    if ((window as any).gtag) {
      initializeAnalytics()
      initializeScrollTracking()
      initializeExternalLinkTracking()
      trackPagePerformance()
    } else {
      setTimeout(initWhenReady, 100)
    }
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWhenReady)
  } else {
    initWhenReady()
  }
}
