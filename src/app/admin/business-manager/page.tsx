'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '../../../components/AdminLayout'
import BusinessCrudForm from '../../../components/BusinessCrudForm'

interface Business {
  id?: string  // Made optional to match the form component
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
  // Contact information (private)
  contact_name?: string
  contact_email?: string
  contact_phone?: string
}

type ViewMode = 'list' | 'add' | 'edit'

export default function ManageBusinessesCrudPage() {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [selectedBusiness, setSelectedBusiness] = useState<Business | undefined>()
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [stateFilter, setStateFilter] = useState('')
  const [cityFilter, setCityFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [businessesPerPage] = useState(20)
  const [csrfToken, setCsrfToken] = useState('')

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

  // Fetch businesses
  const fetchBusinesses = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/business-crud', {
        credentials: 'include'
      })
      
      const data = await response.json()
      if (data.success) {
        setBusinesses(data.businesses)
        setFilteredBusinesses(data.businesses)
      } else {
        console.error('Failed to fetch businesses:', data.error)
      }
    } catch (error) {
      console.error('Error fetching businesses:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBusinesses()
  }, [])

  // Filter businesses based on search criteria
  useEffect(() => {
    let filtered = businesses

    if (searchTerm) {
      filtered = filtered.filter(business =>
        business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.address.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (categoryFilter) {
      filtered = filtered.filter(business => 
        business.primary_category === categoryFilter
      )
    }

    if (stateFilter) {
      filtered = filtered.filter(business => 
        business.state === stateFilter
      )
    }

    if (cityFilter) {
      filtered = filtered.filter(business => 
        business.city === cityFilter
      )
    }

    setFilteredBusinesses(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }, [searchTerm, categoryFilter, stateFilter, cityFilter, businesses])

  // Pagination
  const indexOfLastBusiness = currentPage * businessesPerPage
  const indexOfFirstBusiness = indexOfLastBusiness - businessesPerPage
  const currentBusinesses = filteredBusinesses.slice(indexOfFirstBusiness, indexOfLastBusiness)
  const totalPages = Math.ceil(filteredBusinesses.length / businessesPerPage)

  const handleEdit = (business: Business) => {
    setSelectedBusiness(business)
    setViewMode('edit')
  }

  const handleDelete = async (business: Business) => {
    if (!business.id) {
      alert('Cannot delete business: Invalid business ID')
      return
    }

    if (!confirm(`Are you sure you want to delete "${business.name}"? This action cannot be undone and will also delete the associated image.`)) {
      return
    }

    if (!csrfToken) {
      alert('Security token not available. Please refresh the page and try again.')
      return
    }

    try {
      console.log('🗑️ Deleting business:', business.id)
      console.log('🔐 CSRF Token:', csrfToken ? 'Present' : 'MISSING!')
      
      const response = await fetch(`/api/admin/business-crud?id=${encodeURIComponent(business.id)}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken
        },
        credentials: 'include',
        body: JSON.stringify({ csrfToken })
      })

      console.log('📥 Delete response status:', response.status)
      const data = await response.json()
      console.log('📦 Delete response data:', data)
      
      if (data.success) {
        // Refresh the list
        await fetchBusinesses()
        alert('Business deleted successfully')
      } else {
        alert(`Failed to delete business: ${data.error}`)
      }
    } catch (error) {
      console.error('Error deleting business:', error)
      alert('Network error. Please try again.')
    }
  }

  const handleFormSuccess = async (business: Business) => {
    // Refresh the list
    await fetchBusinesses()
    setViewMode('list')
    setSelectedBusiness(undefined)
    
    const action = selectedBusiness ? 'updated' : 'created'
    alert(`Business ${action} successfully!`)
  }

  const handleFormCancel = () => {
    setViewMode('list')
    setSelectedBusiness(undefined)
  }

  // Get unique categories, states, and cities for filters
  const uniqueCategories = [...new Set(businesses.map(b => b.primary_category))].sort()
  const uniqueStates = [...new Set(businesses.map(b => b.state))].sort()
  const uniqueCities = stateFilter 
    ? [...new Set(businesses.filter(b => b.state === stateFilter).map(b => b.city))].sort()
    : [...new Set(businesses.map(b => b.city))].sort()

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading businesses...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (viewMode === 'add' || viewMode === 'edit') {
    return (
      <AdminLayout>
        <BusinessCrudForm
          business={selectedBusiness}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
          isEditing={viewMode === 'edit'}
        />
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Manage Businesses</h1>
          <button
            onClick={() => setViewMode('add')}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Add New Business
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6 bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                placeholder="Search name, city, or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {uniqueCategories.map(category => (
                  <option key={category} value={category}>
                    {category.replace(/_/g, ' ').replace(/-/g, ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <select
                value={stateFilter}
                onChange={(e) => {
                  setStateFilter(e.target.value)
                  setCityFilter('') // Reset city when state changes
                }}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All States</option>
                {uniqueStates.map(state => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!stateFilter && uniqueCities.length > 50} // Disable if too many cities and no state selected
              >
                <option value="">All Cities</option>
                {uniqueCities.map(city => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              {!stateFilter && uniqueCities.length > 50 && (
                <p className="text-xs text-gray-500 mt-1">Select a state first to filter cities</p>
              )}
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('')
                  setCategoryFilter('')
                  setStateFilter('')
                  setCityFilter('')
                }}
                className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-4 text-sm text-gray-600">
          Showing {indexOfFirstBusiness + 1}-{Math.min(indexOfLastBusiness, filteredBusinesses.length)} of {filteredBusinesses.length} businesses
          {filteredBusinesses.length !== businesses.length && ` (filtered from ${businesses.length} total)`}
        </div>

        {/* Business List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {currentBusinesses.map((business, index) => (
              <li key={business.id || `business-${index}`} className="hover:bg-gray-50">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-blue-600">
                            {business.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            <span className="font-semibold">Primary:</span> {business.primary_category.replace(/_/g, ' ').replace(/-/g, ' ')} • {business.city}, {business.state}
                          </p>
                          {business.categories_array && business.categories_array.length > 0 && (
                            <p className="text-sm text-gray-600 mt-1">
                              <span className="font-semibold">Categories:</span> {business.categories_array.map(cat => cat.replace(/_/g, ' ')).join(', ')}
                            </p>
                          )}
                          <p className="text-sm text-gray-500 mt-1">
                            {business.address}
                          </p>
                          {business.phone && (
                            <p className="text-sm text-gray-500">
                              📞 {business.phone}
                            </p>
                          )}
                          {business.rating && (
                            <p className="text-sm text-gray-500">
                              ⭐ {business.rating} ({business.reviews_count || 0} reviews)
                            </p>
                          )}
                          {(business.contact_name || business.contact_email || business.contact_phone) && (
                            <div className="mt-2 pt-2 border-t border-gray-200">
                              <p className="text-xs font-semibold text-gray-700 mb-1">👤 Owner Contact (Private):</p>
                              {business.contact_name && (
                                <p className="text-xs text-gray-600">Name: {business.contact_name}</p>
                              )}
                              {business.contact_email && (
                                <p className="text-xs text-gray-600">Email: <a href={`mailto:${business.contact_email}`} className="text-blue-600 hover:underline">{business.contact_email}</a></p>
                              )}
                              {business.contact_phone && (
                                <p className="text-xs text-gray-600">Phone: <a href={`tel:${business.contact_phone}`} className="text-blue-600 hover:underline">{business.contact_phone}</a></p>
                              )}
                            </div>
                          )}
                          {business.priority_tier && business.priority_tier > 1 && (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${
                              business.priority_tier === 3 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {business.priority_tier === 3 ? 'Featured' : 'Verified'}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          {business.thumbnails && business.thumbnails.length > 0 && (
                            <img
                              src={business.thumbnails[0]}
                              alt={business.name}
                              className="w-16 h-12 object-cover rounded"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleEdit(business)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(business)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div>
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="bg-white border border-gray-300 text-gray-500 hover:text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
            </div>
            
            <div className="hidden sm:flex space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 rounded-md text-sm ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="bg-white border border-gray-300 text-gray-500 hover:text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredBusinesses.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No businesses found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || categoryFilter || stateFilter
                  ? 'Try adjusting your search criteria.'
                  : 'Get started by adding a new business.'}
              </p>
              {(!searchTerm && !categoryFilter && !stateFilter) && (
                <div className="mt-6">
                  <button
                    onClick={() => setViewMode('add')}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Add New Business
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
