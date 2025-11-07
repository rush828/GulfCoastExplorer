'use client'

import { useState, useEffect, useRef } from 'react'
import { validateBusinessForm, validateField, type BusinessFormData } from '@/lib/validation'

interface Business {
  id?: string
  name: string
  primary_category: string
  categories: string[]
  categories_array: string[]
  address: string
  city: string
  state: string
  latitude?: number
  longitude?: number
  rating?: number
  reviews_count?: number
  website?: string
  phone?: string
  description?: string
  priority_tier?: number
  featured_until?: string
  google_types?: string[]
  thumbnails?: string[]
  // Contact information (private - not displayed publicly)
  contact_name?: string
  contact_email?: string
  contact_phone?: string
}

interface BusinessCrudFormProps {
  business?: Business
  onSuccess: (business: Business) => void
  onCancel: () => void
  isEditing?: boolean
}

const CATEGORY_OPTIONS = [
  'restaurant', 'bar', 'coffee_shop', 'lodging', 'beach', 'water_sports', 'marina',
  'park_recreation', 'shopping_mall', 'nightlife-entertainment', 'entertainment',
  'historic_landmark', 'tour_agency', 'spa_fitness', 'golf_course', 'car_rental',
  'liquor_store', 'bakery', 'ice_cream', 'seafood_market', 'winery_brewery',
  'food-dining', 'store', 'clothing_store', 'art_gallery', 'museum',
  'tourist_attraction', 'convenience_store', 'fishing_charter', '24_hours',
  'nightclub', 'rv_park'
]

const STATE_OPTIONS = [
  'Texas', 'Louisiana', 'Mississippi', 'Alabama', 'Florida'
]

export default function BusinessCrudForm({ business, onSuccess, onCancel, isEditing = false }: BusinessCrudFormProps) {
  const [formData, setFormData] = useState<Business>({
    name: '',
    primary_category: '',
    categories: [],
    categories_array: [],
    address: '',
    city: '',
    state: '',
    latitude: undefined,
    longitude: undefined,
    rating: undefined,
    reviews_count: undefined,
    website: '',
    phone: '',
    description: '',
    priority_tier: 1,
    featured_until: '',
    google_types: ['establishment'],
    thumbnails: [],
    contact_name: '',
    contact_email: '',
    contact_phone: ''
  })

  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [csrfToken, setCsrfToken] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Initialize form with business data if editing
  useEffect(() => {
    if (isEditing && business) {
      setFormData({
        ...business,
        categories: business.categories || [],
        categories_array: business.categories_array || [],
        google_types: business.google_types || ['establishment']
      })

      // Set image preview if business has thumbnail
      if (business.thumbnails && business.thumbnails.length > 0) {
        setImagePreview(business.thumbnails[0])
      }
    }
  }, [isEditing, business])

  // Get CSRF token
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    
    let processedValue: any = value
    
    // Handle number inputs
    if (type === 'number') {
      processedValue = value === '' ? undefined : parseFloat(value)
    }

    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }))

    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }

    // Real-time validation for specific fields (only for fields that exist in BusinessFormData)
    const validationFields: (keyof BusinessFormData)[] = ['email', 'phone', 'website', 'zipCode', 'state']
    if (validationFields.includes(name as keyof BusinessFormData)) {
      const fieldError = validateField(name as keyof BusinessFormData, processedValue)
      if (fieldError) {
        setErrors(prev => ({
          ...prev,
          [name]: fieldError
        }))
      }
    }
  }

  const handleCategoryChange = (category: string, checked: boolean) => {
    let newCategories = [...formData.categories]
    
    if (checked) {
      if (!newCategories.includes(category)) {
        newCategories.push(category)
      }
    } else {
      newCategories = newCategories.filter(c => c !== category)
    }

    setFormData(prev => ({
      ...prev,
      categories: newCategories,
      categories_array: newCategories
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      const maxSize = 5 * 1024 * 1024 // 5MB

      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          image: 'Invalid file type. Only JPG, PNG, and WebP files are allowed.'
        }))
        return
      }

      if (file.size > maxSize) {
        setErrors(prev => ({
          ...prev,
          image: 'File size too large. Maximum size is 5MB.'
        }))
        return
      }

      setSelectedImage(file)
      setErrors(prev => ({ ...prev, image: '' }))

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('🚀 Form submitted!')
    console.log('📋 Form data:', formData)
    setIsSubmitting(true)

    try {
      // Simple validation for admin form (bypass the public form validation)
      const requiredFields = {
        name: 'Business name is required',
        primary_category: 'Primary category is required',
        address: 'Address is required',
        city: 'City is required',
        state: 'State is required'
      }
      
      const validationErrors: Record<string, string> = {}
      
      for (const [field, message] of Object.entries(requiredFields)) {
        if (!formData[field as keyof typeof formData]) {
          validationErrors[field] = message
        }
      }

      if (Object.keys(validationErrors).length > 0) {
        console.log('❌ Validation failed:', validationErrors)
        setErrors(validationErrors)
        setIsSubmitting(false)
        alert('Please fill in all required fields: ' + Object.values(validationErrors).join(', '))
        return
      }
      
      console.log('✅ Validation passed')

      // Prepare form data for submission
      const submitFormData = new FormData()
      
      // Add all business fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            submitFormData.append(key, JSON.stringify(value))
          } else {
            submitFormData.append(key, value.toString())
          }
        }
      })

      // Add CSRF token
      submitFormData.append('csrfToken', csrfToken)

      // Add image if selected
      if (selectedImage) {
        submitFormData.append('image', selectedImage)
      }

      // Add business ID if editing
      if (isEditing && business?.id) {
        submitFormData.append('id', business.id)
      }

      // Submit to API
      const url = '/api/admin/business-crud'
      const method = isEditing ? 'PUT' : 'POST'
      
      console.log('📡 Sending request:', method, url)
      console.log('🔐 CSRF Token:', csrfToken ? 'Present' : 'MISSING!')
      
      const response = await fetch(url, {
        method,
        headers: {
          'x-csrf-token': csrfToken
        },
        credentials: 'include',
        body: submitFormData
      })

      console.log('📥 Response status:', response.status)
      const result = await response.json()
      console.log('📦 Response data:', result)

      if (result.success) {
        console.log('✅ Business saved successfully:', result.businessId || result.business?.id)
        onSuccess(result.business)
      } else {
        console.error('❌ Save failed:', result.error)
        setErrors({ submit: result.error || 'Failed to save business' })
        alert(`Error: ${result.error || 'Failed to save business'}`)
      }
    } catch (error) {
      console.error('❌ Error submitting form:', error)
      setErrors({ submit: 'Network error. Please try again.' })
      alert(`Network error: ${error instanceof Error ? error.message : 'Please try again.'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">
        {isEditing ? 'Edit Business' : 'Add New Business'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Category *
            </label>
            <select
              name="primary_category"
              value={formData.primary_category}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Category</option>
              {CATEGORY_OPTIONS.map(category => (
                <option key={category} value={category}>
                  {category.replace(/_/g, ' ').replace(/-/g, ' ')}
                </option>
              ))}
            </select>
            {errors.primary_category && <p className="text-red-500 text-sm mt-1">{errors.primary_category}</p>}
          </div>
        </div>

        {/* Location Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address *
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State *
              </label>
              <select
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select State</option>
                {STATE_OPTIONS.map(state => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
            </div>
          </div>
        </div>

        {/* Coordinates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Latitude
            </label>
            <input
              type="number"
              name="latitude"
              value={formData.latitude || ''}
              onChange={handleInputChange}
              step="any"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Longitude
            </label>
            <input
              type="number"
              name="longitude"
              value={formData.longitude || ''}
              onChange={handleInputChange}
              step="any"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Business Contact Information */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Business Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone || ''}
                onChange={handleInputChange}
                placeholder="Public business phone"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website || ''}
                onChange={handleInputChange}
                placeholder="https://example.com"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.website && <p className="text-red-500 text-sm mt-1">{errors.website}</p>}
            </div>
          </div>
        </div>

        {/* Owner/Contact Information (Private) */}
        <div className="border-t pt-6 bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">👤 Owner/Manager Contact (Private)</h3>
          <p className="text-sm text-gray-600 mb-4">This information is never displayed publicly. Use for renewals and support.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Name
              </label>
              <input
                type="text"
                name="contact_name"
                value={formData.contact_name || ''}
                onChange={handleInputChange}
                placeholder="John Smith"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Email
              </label>
              <input
                type="email"
                name="contact_email"
                value={formData.contact_email || ''}
                onChange={handleInputChange}
                placeholder="owner@example.com"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Phone
              </label>
              <input
                type="tel"
                name="contact_phone"
                value={formData.contact_phone || ''}
                onChange={handleInputChange}
                placeholder="555-555-5555"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Rating and Reviews */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating (1-5)
            </label>
            <input
              type="number"
              name="rating"
              value={formData.rating || ''}
              onChange={handleInputChange}
              min="1"
              max="5"
              step="0.1"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reviews Count
            </label>
            <input
              type="number"
              name="reviews_count"
              value={formData.reviews_count || ''}
              onChange={handleInputChange}
              min="0"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Priority Tier */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Priority Tier
          </label>
          <select
            name="priority_tier"
            value={formData.priority_tier || 1}
            onChange={handleInputChange}
            className="w-full md:w-1/2 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={1}>Free Tier</option>
            <option value={2}>Verified ($149/year)</option>
            <option value={3}>Featured ($399/year)</option>
          </select>
        </div>

        {/* Featured Until (for Premium tier) */}
        {formData.priority_tier === 3 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Featured Until (Reference)
            </label>
            <input
              type="date"
              name="featured_until"
              value={formData.featured_until || ''}
              onChange={handleInputChange}
              className="w-full md:w-1/2 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description || ''}
            onChange={handleInputChange}
            rows={4}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        {/* Categories */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Categories
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-48 overflow-y-auto border border-gray-300 rounded-md p-3">
            {CATEGORY_OPTIONS.map(category => (
              <label key={category} className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={formData.categories.includes(category)}
                  onChange={(e) => handleCategoryChange(category, e.target.checked)}
                  className="rounded"
                />
                <span>{category.replace(/_/g, ' ').replace(/-/g, ' ')}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Image
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleImageChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
          
          {imagePreview && (
            <div className="mt-3">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 h-24 object-cover rounded-md border"
              />
            </div>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : (isEditing ? 'Update Business' : 'Create Business')}
          </button>
        </div>

        {errors.submit && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{errors.submit}</span>
          </div>
        )}
      </form>
    </div>
  )
}
