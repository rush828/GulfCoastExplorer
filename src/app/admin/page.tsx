'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminLayout from '../../components/AdminLayout'

interface Business {
  id: string
  name: string
  primary_category: string
  categories_array: string[]
  address: string
  city: string
  state: string
  rating?: number
  reviews_count?: number
  website?: string
  phone?: string
  description?: string
  photos?: string[]
}

const CATEGORY_OPTIONS = [
  'restaurant',
  'bar',
  'coffee_shop',
  'lodging',
  'beach',
  'water-activities',
  'marina',
  'park_recreation',
  'shopping_mall',
  'nightlife-entertainment',
  'entertainment',
  'historic_landmark',
  'tour_agency',
  'spa_fitness',
  'golf_course',
  'car_rental',
  'liquor_store',
  'bakery',
  'ice_cream',
  'seafood_market',
  'winery_brewery',
  'food-dining',
  'store',
  'clothing_store',
  'art_gallery',
  'museum',
  'tourist_attraction',
  '24_hours',
  'meal_delivery',
  'nightclub',
  'music_venue'
]

export default function AdminPage() {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedPrimaryCategory, setSelectedPrimaryCategory] = useState('')
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(20)

  // Load businesses on component mount
  useEffect(() => {
    loadBusinesses()
  }, [])

  // Filter businesses based on search criteria
  useEffect(() => {
    let filtered = businesses

    if (searchTerm) {
      filtered = filtered.filter(business =>
        business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCity) {
      filtered = filtered.filter(business =>
        business.city.toLowerCase().includes(selectedCity.toLowerCase())
      )
    }

    if (selectedState) {
      filtered = filtered.filter(business =>
        business.state.toLowerCase().includes(selectedState.toLowerCase())
      )
    }

    if (selectedCategory) {
      filtered = filtered.filter(business =>
        business.categories_array.includes(selectedCategory)
      )
    }

    if (selectedPrimaryCategory) {
      filtered = filtered.filter(business =>
        business.primary_category === selectedPrimaryCategory
      )
    }

    setFilteredBusinesses(filtered)
    setCurrentPage(1)
  }, [businesses, searchTerm, selectedCity, selectedState, selectedCategory, selectedPrimaryCategory])

  const loadBusinesses = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/businesses', {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setBusinesses(data.businesses || [])
      } else {
        setMessage('Error loading businesses')
      }
    } catch (error) {
      setMessage('Error loading businesses')
    } finally {
      setLoading(false)
    }
  }

  const saveBusiness = async (business: Business) => {
    try {
      setSaving(true)
      const response = await fetch('/api/admin/businesses', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-auth': process.env.ADMIN_SECRET || ''
        },
        body: JSON.stringify(business),
      })

      if (response.ok) {
        // Update local state
        setBusinesses(prev => 
          prev.map(b => b.id === business.id ? business : b)
        )
        setEditingBusiness(null)
        setMessage('Business updated successfully!')
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage('Error saving business')
      }
    } catch (error) {
      setMessage('Error saving business')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (business: Business) => {
    setEditingBusiness({ ...business })
  }

  const handleCancel = () => {
    setEditingBusiness(null)
  }

  const handleSave = () => {
    if (editingBusiness) {
      saveBusiness(editingBusiness)
    }
  }

  const updatePrimaryCategory = (category: string) => {
    if (editingBusiness) {
      setEditingBusiness({
        ...editingBusiness,
        primary_category: category
      })
    }
  }

  const addToCategoriesArray = (category: string) => {
    if (editingBusiness && !editingBusiness.categories_array.includes(category)) {
      setEditingBusiness({
        ...editingBusiness,
        categories_array: [...editingBusiness.categories_array, category]
      })
    }
  }

  const removeFromCategoriesArray = (category: string) => {
    if (editingBusiness) {
      setEditingBusiness({
        ...editingBusiness,
        categories_array: editingBusiness.categories_array.filter(c => c !== category)
      })
    }
  }

  // Get unique cities and states for filters
  const cities = [...new Set(businesses.map(b => b.city))].sort()
  const states = [...new Set(businesses.map(b => b.state))].sort()

  // Pagination
  const totalPages = Math.ceil(filteredBusinesses.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentBusinesses = filteredBusinesses.slice(startIndex, endIndex)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading businesses...</p>
        </div>
      </div>
    )
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Basic Business Editor</h1>
          <p className="text-gray-600">Quick business category management and basic editing</p>
        </div>
        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}>
            {message}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Search & Filter</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, address, or description..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Cities</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All States</option>
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Primary Category</label>
              <select
                value={selectedPrimaryCategory}
                onChange={(e) => setSelectedPrimaryCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Primary Categories</option>
                {CATEGORY_OPTIONS.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Has Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {CATEGORY_OPTIONS.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedCity('')
                setSelectedState('')
                setSelectedCategory('')
                setSelectedPrimaryCategory('')
              }}
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-4">
          <p className="text-gray-600">
            Showing {currentBusinesses.length} of {filteredBusinesses.length} businesses
            {filteredBusinesses.length !== businesses.length && ` (filtered from ${businesses.length} total)`}
          </p>
          {(searchTerm || selectedCity || selectedState || selectedCategory || selectedPrimaryCategory) && (
            <div className="mt-2 flex flex-wrap gap-2">
              {searchTerm && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  Search: "{searchTerm}"
                </span>
              )}
              {selectedCity && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  City: {selectedCity}
                </span>
              )}
              {selectedState && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  State: {selectedState}
                </span>
              )}
              {selectedPrimaryCategory && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Primary: {selectedPrimaryCategory}
                </span>
              )}
              {selectedCategory && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  Has: {selectedCategory}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Business List */}
        <div className="space-y-4">
          {currentBusinesses.map((business) => (
            <div key={business.id} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{business.name}</h3>
                  <p className="text-gray-600 mb-2">{business.address}</p>
                  <p className="text-sm text-gray-500 mb-3">{business.city}, {business.state}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Primary: {business.primary_category}
                    </span>
                    {business.categories_array.map((category, index) => (
                      <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {category}
                      </span>
                    ))}
                  </div>

                  {business.website && (
                    <a
                      href={business.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      {business.website}
                    </a>
                  )}
                </div>
                
                <button
                  onClick={() => handleEdit(business)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 rounded-lg border ${
                    currentPage === page
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          </div>
        )}

        {/* Edit Modal */}
        {editingBusiness && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Edit Business: {editingBusiness.name}</h2>
                
                {/* Primary Category */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Primary Category</label>
                  <select
                    value={editingBusiness.primary_category}
                    onChange={(e) => updatePrimaryCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {CATEGORY_OPTIONS.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Categories Array */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categories Array</label>
                  <div className="space-y-2">
                    {editingBusiness.categories_array.map((category, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span>{category}</span>
                        <button
                          onClick={() => removeFromCategoriesArray(category)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          addToCategoriesArray(e.target.value)
                          e.target.value = ''
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Add category...</option>
                      {CATEGORY_OPTIONS.filter(cat => !editingBusiness.categories_array.includes(cat)).map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}