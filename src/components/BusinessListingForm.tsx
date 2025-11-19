'use client'

import { useState, useEffect } from 'react'
import { validateBusinessForm, validateField, formatters, sanitizeInput, type BusinessFormData } from '@/lib/validation'
import { trackSubscriptionStart, trackSubscriptionComplete } from '@/lib/analytics'

export default function BusinessListingForm() {
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    contactName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    website: '',
    description: '',
    listingType: 'basic',
    agreeToTerms: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [isValidating, setIsValidating] = useState(false)
  const [csrfToken, setCsrfToken] = useState('')
  
  // Check if PayPal is in production mode
  const isDevelopment = process.env.NEXT_PUBLIC_PAYPAL_ENVIRONMENT !== 'production'
  
  // Debug: Log PayPal config on mount (only in development)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('PayPal Config Check:', {
        businessEmail: process.env.NEXT_PUBLIC_PAYPAL_BUSINESS_EMAIL ? 'Set' : 'Missing',
        environment: process.env.NEXT_PUBLIC_PAYPAL_ENVIRONMENT || 'Not set',
        isDevelopment
      })
    }
  }, [isDevelopment])

  // Get CSRF token on component mount
  useEffect(() => {
    const fetchCSRFToken = async () => {
      try {
        const response = await fetch('/api/csrf')
        const data = await response.json()
        if (data.success) {
          setCsrfToken(data.csrfToken)
        }
      } catch (error) {
        console.error('Failed to get CSRF token:', error)
      }
    }
    fetchCSRFToken()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    let processedValue: any = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    
    // Don't sanitize during typing - it interferes with normal input (especially spaces)
    // Sanitization will happen on form submit for security
    // Only apply formatters for specific fields that need formatting
    if (typeof processedValue === 'string') {
      // Apply formatters only for fields that need them
      // Phone and zipCode formatters remove non-digits, which is expected
      // Website formatter should only run when user finishes typing (not on every keystroke)
      if (name === 'phone') {
        processedValue = formatters.phone(processedValue)
      } else if (name === 'zipCode') {
        processedValue = formatters.zipCode(processedValue)
      }
      // Don't apply website formatter during typing - it interferes with spaces
      // Website formatting will happen on blur or submit
      // For all other fields (including website), use the value as-is to preserve spaces
    }
    
    // Update form data immediately with the raw or formatted value
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }))
    
    // Clear error for this field when user starts typing (they're fixing it)
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
    
    // Don't validate while typing - only validate on submit
    // This prevents annoying error messages while the user is still entering data
  }

  // Handle website field blur to format URL properly
  const handleWebsiteBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value.trim()
    // Format URL if needed (only format, don't validate)
    if (value && !value.startsWith('http')) {
      setFormData(prev => ({
        ...prev,
        website: `https://${value}`
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted', { formData, agreeToTerms: formData.agreeToTerms })
    
    // Check if terms are agreed
    if (!formData.agreeToTerms) {
      alert('Please agree to the terms and conditions to continue.')
      return
    }
    
    setIsSubmitting(true)
    setIsValidating(true)

    try {
      // Comprehensive form validation
      console.log('Validating form data...', formData)
      const validation = await validateBusinessForm(formData as BusinessFormData)
      console.log('Validation result:', validation)
      
      if (!validation.isValid) {
        console.log('Validation failed:', validation.errors)
        setFieldErrors(validation.errors)
        
        // Show alert with first error
        const firstError = Object.values(validation.errors)[0]
        if (firstError) {
          alert(`Please fix the following error: ${firstError}`)
        }
        
        // Focus on first error field
        const firstErrorField = Object.keys(validation.errors)[0]
        const errorElement = document.querySelector(`[name="${firstErrorField}"]`) as HTMLElement
        if (errorElement) {
          errorElement.focus()
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
        
        setIsSubmitting(false)
        setIsValidating(false)
        return
      }
      
      // Clear any previous errors
      setFieldErrors({})
      console.log('Validation passed, saving business listing...')

      // Save business listing to database before redirecting to PayPal
      const submitFormData = new FormData()
      submitFormData.append('businessName', formData.businessName)
      submitFormData.append('businessType', formData.businessType)
      submitFormData.append('contactName', formData.contactName)
      submitFormData.append('email', formData.email)
      submitFormData.append('phone', formData.phone)
      submitFormData.append('address', formData.address)
      submitFormData.append('city', formData.city)
      submitFormData.append('state', formData.state)
      submitFormData.append('zipCode', formData.zipCode)
      submitFormData.append('website', formData.website || '')
      submitFormData.append('description', formData.description)
      submitFormData.append('listingType', formData.listingType)
      submitFormData.append('csrfToken', csrfToken)

      const saveResponse = await fetch('/api/business-listing/submit', {
        method: 'POST',
        body: submitFormData,
        credentials: 'include'
      })

      const saveData = await saveResponse.json()

      if (!saveData.success) {
        alert(`Failed to save business listing: ${saveData.error || 'Unknown error'}. Please try again.`)
        setIsSubmitting(false)
        setIsValidating(false)
        return
      }

      console.log('Business listing saved:', saveData)
      
      // Create PayPal subscription URL
      const amount = formData.listingType === 'basic' ? '149.00' : '399.00'
      const itemName = `${formData.listingType === 'basic' ? 'Basic' : 'Featured'} Business Listing - ${formData.businessName}`
      
      // Track subscription start for analytics
      trackSubscriptionStart(
        formData.listingType as 'basic' | 'featured',
        parseFloat(amount)
      )
      
      // Check if PayPal business email is configured
      const paypalBusinessEmail = process.env.NEXT_PUBLIC_PAYPAL_BUSINESS_EMAIL
      if (!paypalBusinessEmail || paypalBusinessEmail === 'your-paypal-email@example.com') {
        alert('PayPal is not configured. Please contact support or check your environment variables.')
        console.error('NEXT_PUBLIC_PAYPAL_BUSINESS_EMAIL is not set in environment variables')
        setIsSubmitting(false)
        setIsValidating(false)
        return
      }

      console.log('PayPal Configuration:', {
        businessEmail: paypalBusinessEmail,
        isDevelopment,
        amount,
        listingType: formData.listingType,
        businessId: saveData.businessId
      })

      // PayPal subscription parameters
      // Pass business ID in custom field so webhook can link subscription to business
      const paypalParams = new URLSearchParams({
        cmd: '_xclick-subscriptions',
        business: paypalBusinessEmail,
        item_name: itemName,
        a3: amount,
        p3: '1',
        t3: 'Y',
        src: '1',
        currency_code: 'USD',
        no_note: '1',
        no_shipping: '1',
        custom: saveData.businessId, // Pass business ID to PayPal
        cn: isDevelopment ? 'Gulf Coast Directory (Test)' : 'Gulf Coast Directory',
        return: `${window.location.origin}/business-listing/success?businessId=${saveData.businessId}&plan=${formData.listingType}`,
        cancel_return: `${window.location.origin}/business-listing/cancel?businessId=${saveData.businessId}`,
        notify_url: `${window.location.origin}/api/paypal/webhook`
      })
      
      // For testing, bypass PayPal and go directly to success page
      if (isDevelopment) {
        console.log('Test mode: Bypassing PayPal, redirecting to success page')
        window.location.href = `${window.location.origin}/business-listing/success`
        return
      }

      // Use Sandbox for development, Live for production
      const paypalBaseUrl = isDevelopment 
        ? 'https://www.sandbox.paypal.com/cgi-bin/webscr'
        : 'https://www.paypal.com/cgi-bin/webscr'
      
      const paypalUrl = `${paypalBaseUrl}?${paypalParams.toString()}`
      
      console.log('Redirecting to PayPal:', paypalUrl)

      // Redirect to PayPal
      console.log('Redirecting to PayPal URL:', paypalUrl)
      window.location.href = paypalUrl

    } catch (error) {
      console.error('Error submitting form:', error)
      alert(`An error occurred while processing your request: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`)
      setIsSubmitting(false)
      setIsValidating(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      {/* General Error Display */}
      {Object.keys(fieldErrors).length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Please fix the following errors:
              </h3>
              <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                {Object.entries(fieldErrors).map(([field, error]) => (
                  <li key={field}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      
      {isDevelopment && (
        <div className="mb-6 p-4 bg-yellow-100 border border-yellow-400 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Development Mode
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>Using PayPal Sandbox for testing. No real payments will be processed.</p>
              </div>
            </div>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* CSRF Protection */}
        <input type="hidden" name="csrfToken" value={csrfToken} />
        
        {/* Business Information */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
              Business Name *
            </label>
            <input
              type="text"
              id="businessName"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              required
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent ${
                fieldErrors.businessName 
                  ? 'border-red-300 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="Your business name"
            />
            {fieldErrors.businessName && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.businessName}</p>
            )}
          </div>
          <div>
            <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 mb-2">
              Business Type *
            </label>
            <select
              id="businessType"
              name="businessType"
              value={formData.businessType}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select business type</option>
              <option value="hotel">Hotel/Resort</option>
              <option value="restaurant">Restaurant</option>
              <option value="attraction">Tourist Attraction</option>
              <option value="fishing">Fishing Charter</option>
              <option value="water-sports">Water Sports</option>
              <option value="shopping">Shopping</option>
              <option value="entertainment">Entertainment</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-2">
              Contact Person *
            </label>
            <input
              type="text"
              id="contactName"
              name="contactName"
              value={formData.contactName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="your.email@example.com"
            />
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="(555) 123-4567"
          />
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
            Street Address *
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="123 Main Street"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
              City *
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="City name"
            />
          </div>
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
              State *
            </label>
            <select
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select state</option>
              <option value="TX">Texas</option>
              <option value="LA">Louisiana</option>
              <option value="MS">Mississippi</option>
              <option value="AL">Alabama</option>
              <option value="FL">Florida</option>
            </select>
          </div>
          <div>
            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
              ZIP Code *
            </label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="12345"
            />
          </div>
        </div>

        <div>
          <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
            Website (optional)
          </label>
          <input
            type="url"
            id="website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            onBlur={handleWebsiteBlur}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://yourwebsite.com"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Business Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
              onChange={handleChange}
              rows={4}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe your business, what makes it special, and why travelers should visit..."
          />
        </div>

        {/* Listing Type Selection */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-4">Select Your Listing Type</h4>
          <div className="space-y-4">
            <label className="flex items-start">
              <input
                type="radio"
                name="listingType"
                value="basic"
                checked={formData.listingType === 'basic'}
                onChange={handleChange}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
                             <div className="ml-3">
                 <span className="font-medium text-gray-900">Basic Listing - $149/year</span>
                 <p className="text-sm text-blue-600 font-medium">Just $12.42/month</p>
                 <p className="text-sm text-gray-600">Standard profile with SEO optimization</p>
               </div>
            </label>
            <label className="flex items-start">
              <input
                type="radio"
                name="listingType"
                value="featured"
                checked={formData.listingType === 'featured'}
                onChange={handleChange}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
                             <div className="ml-3">
                 <span className="font-medium text-gray-900">Featured Listing - $399/year</span>
                 <p className="text-sm text-blue-600 font-medium">Just $33.25/month</p>
                 <p className="text-sm text-gray-600">Premium placement with enhanced visibility</p>
               </div>
            </label>
          </div>
        </div>

        {/* Terms Agreement */}
        <div>
          <label className="flex items-start">
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              required
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-600">
              I agree to the terms and conditions and understand that this is an annual subscription 
              that will automatically renew each year. I can cancel anytime through my PayPal account. 
              I authorize recurring payments through PayPal.
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            disabled={isSubmitting || !formData.agreeToTerms}
            onClick={(e) => {
              // Backup handler in case form submission doesn't trigger
              if (!formData.agreeToTerms) {
                e.preventDefault()
                alert('Please agree to the terms and conditions to continue.')
                return
              }
              // Let the form's onSubmit handle it
            }}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-4 px-8 rounded-lg transition-colors duration-200 transform hover:scale-105 disabled:transform-none disabled:hover:scale-100"
          >
            {isSubmitting ? 'Processing...' : `Pay with PayPal - $${formData.listingType === 'basic' ? '149' : '399'}`}
          </button>
          {!formData.agreeToTerms && (
            <p className="text-sm text-red-500 mt-2">
              Please check the agreement checkbox above to enable payment
            </p>
          )}
          {formData.agreeToTerms && (
            <p className="text-sm text-gray-500 mt-2">
              You'll be redirected to PayPal to set up your secure subscription
            </p>
          )}
        </div>
      </form>
    </div>
  )
}
