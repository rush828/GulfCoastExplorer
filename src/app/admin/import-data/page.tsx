'use client'

import { useState } from 'react'
import AdminLayout from '@/components/AdminLayout'

const VALID_CATEGORIES = [
  '24_hours', 'art_gallery', 'bakery', 'bar', 'beach', 'campground', 'car_rental',
  'clothing_store', 'coffee_shop', 'convenience_store', 'entertainment', 'farmers_market',
  'fishing_charter', 'golf_course', 'historic_landmark', 'ice_cream', 'liquor_store',
  'lodging', 'marina', 'meal_delivery', 'museum', 'music_venue', 'nightclub',
  'park_recreation', 'professional_services', 'restaurant', 'rv_park', 'scuba_diving',
  'spa', 'spa_fitness', 'store', 'tour_agency', 'tourist_attraction', 'water_sports',
  'water_sports_equipment_rental_service', 'winery_brewery'
]

interface Business {
  name: string
  primary_category: string
  city: string
  state: string
  rating: number
  reviews_count: number
  phone: string
  address: string
  [key: string]: any
}

interface DuplicateMatch {
  existingBusiness: Business
  existingId: string
  confidence: 'high' | 'medium' | 'low'
  matchReasons: string[]
}

interface BusinessPreview {
  index: number
  business: Business
  validation: { valid: boolean; errors: string[] }
  duplicate: DuplicateMatch | null
}

interface ImportPreview {
  success: boolean
  total: number
  valid: number
  invalid: number
  duplicates: number
  businesses: BusinessPreview[]
}

export default function ImportDataPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<ImportPreview | null>(null)
  const [selectedBusinesses, setSelectedBusinesses] = useState<Set<number>>(new Set())
  const [error, setError] = useState<string>('')
  const [filter, setFilter] = useState<'all' | 'valid' | 'invalid' | 'duplicates' | 'needs_review'>('all')
  const [editingDuplicate, setEditingDuplicate] = useState<number | null>(null)
  const [editingNeedsReview, setEditingNeedsReview] = useState<number | null>(null)
  const [editedCategories, setEditedCategories] = useState<Record<number, { primary: string; array: string[] }>>({})
  const [editedBusinesses, setEditedBusinesses] = useState<Record<number, { primary: string; array: string[] }>>({})

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setPreview(null)
      setError('')
    }
  }

  const handleCancel = () => {
    setFile(null)
    setPreview(null)
    setSelectedBusinesses(new Set())
    setError('')
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    if (fileInput) {
      fileInput.value = ''
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/admin/import-businesses', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        setPreview(data)
        // Auto-select all valid, non-duplicate businesses
        const autoSelect = new Set<number>()
        data.businesses.forEach((b: BusinessPreview) => {
          if (b.validation.valid && !b.duplicate) {
            autoSelect.add(b.index)
          }
        })
        setSelectedBusinesses(autoSelect)
      } else {
        // Show full error details for debugging
        const errorMsg = `${data.error || 'Failed to process file'}\n\nDetails: ${data.details || 'No details'}\n\n${data.stack || ''}`
        setError(errorMsg)
      }
    } catch (err) {
      setError('Upload failed: ' + (err as Error).message)
    } finally {
      setIsUploading(false)
    }
  }

  const toggleBusiness = (index: number) => {
    const newSelected = new Set(selectedBusinesses)
    if (newSelected.has(index)) {
      newSelected.delete(index)
    } else {
      newSelected.add(index)
    }
    setSelectedBusinesses(newSelected)
  }

  const toggleAll = () => {
    if (selectedBusinesses.size === preview?.businesses.length) {
      setSelectedBusinesses(new Set())
    } else {
      const all = new Set(preview?.businesses.map(b => b.index) || [])
      setSelectedBusinesses(all)
    }
  }

  const handleImport = async () => {
    if (!preview || selectedBusinesses.size === 0) {
      alert('Please select businesses to import')
      return
    }

    const confirmed = confirm(
      `Import ${selectedBusinesses.size} businesses?\n\n` +
      `This will download and optimize images automatically.\n` +
      `A backup will be created first.`
    )

    if (!confirmed) return

    setIsUploading(true)
    setError('')

    try {
      // Get selected businesses
      const approved = preview.businesses
        .filter(item => selectedBusinesses.has(item.index))
        .map(item => item.business)

      // Debug: Log what we're sending
      console.log('=== IMPORT DEBUG ===')
      console.log('Total businesses to import:', approved.length)
      approved.forEach(biz => {
        console.log(`${biz.name}: primary=${biz.primary_category}, categories=[${biz.categories_array?.join(', ')}]`)
      })

      const response = await fetch('/api/admin/import-businesses', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ approvedBusinesses: approved })
      })

      const data = await response.json()

      if (data.success) {
        alert(
          `✅ Import successful!\n\n` +
          `• Added: ${data.added_count} businesses\n` +
          `• Images uploaded: ${data.images_uploaded || 0}\n` +
          `• Total businesses: ${data.total_businesses}` +
          (data.image_errors ? `\n\n⚠️  Some images failed to upload` : '')
        )
        // Reset form
        setFile(null)
        setPreview(null)
        setSelectedBusinesses(new Set())
      } else {
        setError(`Import failed: ${data.error || 'Unknown error'}`)
      }
    } catch (err) {
      setError('Import failed: ' + (err as Error).message)
    } finally {
      setIsUploading(false)
    }
  }

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'text-red-600 bg-red-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'low': return 'text-blue-600 bg-blue-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const handleEditCategories = (index: number, existing: Business) => {
    setEditingDuplicate(index)
    setEditedCategories({
      ...editedCategories,
      [index]: {
        primary: existing.primary_category,
        array: [...(existing.categories_array || [])]
      }
    })
  }

  const handleEditNeedsReview = (index: number, business: Business) => {
    setEditingNeedsReview(index)
    setEditedBusinesses({
      ...editedBusinesses,
      [index]: {
        primary: business.primary_category,
        array: [...(business.categories_array || [])]
      }
    })
  }

  const handleAddCategory = (index: number, category: string) => {
    const current = editedCategories[index]
    if (!current.array.includes(category)) {
      setEditedCategories({
        ...editedCategories,
        [index]: {
          ...current,
          array: [...current.array, category]
        }
      })
    }
  }

  const handleAddCategoryToNew = (index: number, category: string) => {
    const current = editedBusinesses[index]
    if (!current.array.includes(category)) {
      setEditedBusinesses({
        ...editedBusinesses,
        [index]: {
          ...current,
          array: [...current.array, category]
        }
      })
    }
  }

  const handleRemoveCategory = (index: number, category: string) => {
    const current = editedCategories[index]
    setEditedCategories({
      ...editedCategories,
      [index]: {
        ...current,
        array: current.array.filter(c => c !== category)
      }
    })
  }

  const handleRemoveCategoryFromNew = (index: number, category: string) => {
    const current = editedBusinesses[index]
    setEditedBusinesses({
      ...editedBusinesses,
      [index]: {
        ...current,
        array: current.array.filter(c => c !== category)
      }
    })
  }

  const handleChangePrimaryCategory = (index: number, newPrimary: string) => {
    const current = editedBusinesses[index]
    setEditedBusinesses({
      ...editedBusinesses,
      [index]: {
        ...current,
        primary: newPrimary
      }
    })
  }

  const handleSaveNeedsReview = (index: number) => {
    // Update the preview data with edited categories
    if (preview) {
      const updatedBusinesses = [...preview.businesses]
      const businessItem = updatedBusinesses[index]
      const edited = editedBusinesses[index]
      
      businessItem.business.primary_category = edited.primary
      businessItem.business.categories_array = edited.array
      businessItem.business.categories = edited.array  // Also update legacy field
      
      setPreview({
        ...preview,
        businesses: updatedBusinesses
      })
      
      setEditingNeedsReview(null)
      alert('✅ Categories updated! This will be imported when you click "Import Selected".')
    }
  }

  const handleSaveCategories = async (index: number, duplicateId: string) => {
    const updated = editedCategories[index]
    
    try {
      const response = await fetch('/api/admin/businesses', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: duplicateId,
          primary_category: updated.primary,
          categories_array: updated.array
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update categories')
      }

      alert('✅ Categories updated successfully!')
      setEditingDuplicate(null)
      
      // Refresh preview to show updated data
      if (file) {
        await handleUpload()
      }
    } catch (err) {
      console.error('Error saving categories:', err)
      alert('❌ Failed to update categories. Please try again.')
    }
  }

  // Filter businesses based on current filter
  const filteredBusinesses = preview?.businesses.filter(item => {
    switch (filter) {
      case 'valid':
        return item.validation.valid && !item.duplicate
      case 'invalid':
        return !item.validation.valid
      case 'duplicates':
        return item.duplicate !== null
      case 'needs_review':
        return item.business.needs_manual_categorization === true
      case 'all':
      default:
        return true
    }
  }) || []
  
  // Count businesses needing review
  const needsReviewCount = preview?.businesses.filter(item => 
    item.business.needs_manual_categorization === true
  ).length || 0

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Import Businesses from Excel</h1>

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">1. Upload Excel File</h2>
          <p className="text-sm text-gray-600 mb-4">
            Upload an Excel file exported from Google Places API / Outscraper with business data.
          </p>

          <div className="flex items-center gap-4">
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <button
              onClick={handleUpload}
              disabled={!file || isUploading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {isUploading ? 'Processing...' : 'Analyze File'}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
              <pre className="whitespace-pre-wrap text-xs font-mono">{error}</pre>
            </div>
          )}
        </div>

        {/* Preview Section */}
        {preview && (
          <>
            {/* Summary */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">2. Import Summary (Click to Filter)</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <button
                  onClick={() => setFilter('all')}
                  className={`text-center p-3 rounded-lg transition-all ${
                    filter === 'all' ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="text-3xl font-bold text-blue-600">{preview.total}</div>
                  <div className="text-sm text-gray-600">Total</div>
                </button>
                <button
                  onClick={() => setFilter('valid')}
                  className={`text-center p-3 rounded-lg transition-all ${
                    filter === 'valid' ? 'ring-2 ring-green-500 bg-green-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="text-3xl font-bold text-green-600">{preview.valid}</div>
                  <div className="text-sm text-gray-600">Valid</div>
                </button>
                <button
                  onClick={() => setFilter('invalid')}
                  className={`text-center p-3 rounded-lg transition-all ${
                    filter === 'invalid' ? 'ring-2 ring-red-500 bg-red-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="text-3xl font-bold text-red-600">{preview.invalid}</div>
                  <div className="text-sm text-gray-600">Invalid</div>
                </button>
                <button
                  onClick={() => setFilter('duplicates')}
                  className={`text-center p-3 rounded-lg transition-all ${
                    filter === 'duplicates' ? 'ring-2 ring-yellow-500 bg-yellow-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="text-3xl font-bold text-yellow-600">{preview.duplicates}</div>
                  <div className="text-sm text-gray-600">Duplicates</div>
                </button>
                <button
                  onClick={() => setFilter('needs_review')}
                  className={`text-center p-3 rounded-lg transition-all ${
                    filter === 'needs_review' ? 'ring-2 ring-orange-500 bg-orange-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="text-3xl font-bold text-orange-600">{needsReviewCount}</div>
                  <div className="text-sm text-gray-600">Needs Review</div>
                </button>
                <div className="text-center p-3">
                  <div className="text-3xl font-bold text-purple-600">{selectedBusinesses.size}</div>
                  <div className="text-sm text-gray-600">Selected</div>
                </div>
              </div>
            </div>

            {/* Business List */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-lg font-semibold">3. Review & Select Businesses</h2>
                  <p className="text-sm text-gray-500">
                    Showing {filteredBusinesses.length} of {preview.total} businesses
                    {filter !== 'all' && <span> (filtered by: {filter})</span>}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={toggleAll}
                    className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
                  >
                    {selectedBusinesses.size === preview.businesses.length ? 'Deselect All' : 'Select All'}
                  </button>
                  <button
                    onClick={handleImport}
                    disabled={selectedBusinesses.size === 0 || isUploading}
                    className="px-6 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-md font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {isUploading ? 'Importing...' : `Import Selected (${selectedBusinesses.size})`}
                  </button>
                </div>
              </div>

              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {filteredBusinesses.map((item) => (
                  <div
                    key={item.index}
                    className={`border rounded-lg p-4 ${
                      item.duplicate ? 'border-yellow-300 bg-yellow-50' :
                      !item.validation.valid ? 'border-red-300 bg-red-50' :
                      'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={selectedBusinesses.has(item.index)}
                        onChange={() => toggleBusiness(item.index)}
                        disabled={!item.validation.valid}
                        className="mt-1"
                      />

                      {/* Business Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{item.business.name}</h3>
                            <p className="text-sm text-gray-600">
                              {item.business.address}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              ⭐ {item.business.rating} ({item.business.reviews_count} reviews) • {item.business.phone}
                              {item.business.website && (
                                <> • <a href={item.business.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Website</a></>
                              )}
                            </p>
                            <div className="mt-2 text-xs">
                              <div className="mb-1">
                                <strong>Primary:</strong> <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{item.business.primary_category}</span>
                              </div>
                              <div>
                                <strong>Categories Array:</strong> {item.business.categories_array?.map((cat: string, i: number) => (
                                  <span key={i} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded ml-1">{cat}</span>
                                ))}
                              </div>
                            </div>
                            {item.business.description && (
                              <p className="text-xs text-gray-600 mt-2 italic">{item.business.description}</p>
                            )}
                            
                            {/* Needs Review - Editable Categories */}
                            {item.business.needs_manual_categorization && !item.duplicate && (
                              <div className="mt-3 p-3 bg-orange-50 border-2 border-orange-300 rounded">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="text-orange-800 font-semibold text-sm">
                                    🔍 Needs Review - Edit Before Import
                                  </div>
                                  {editingNeedsReview === item.index ? (
                                    <div className="flex gap-2">
                                      <button
                                        className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                                        onClick={() => handleSaveNeedsReview(item.index)}
                                      >
                                        Save Changes
                                      </button>
                                      <button
                                        className="px-3 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600"
                                        onClick={() => setEditingNeedsReview(null)}
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                                      onClick={() => handleEditNeedsReview(item.index, item.business)}
                                    >
                                      Edit Categories
                                    </button>
                                  )}
                                </div>

                                {/* Current Categories */}
                                <div className="mb-3 p-2 bg-white rounded border border-orange-200">
                                  <div className="mb-2">
                                    <label className="text-xs font-semibold text-gray-700 block mb-1">
                                      Primary Category:
                                    </label>
                                    {editingNeedsReview === item.index ? (
                                      <select
                                        value={editedBusinesses[item.index]?.primary || item.business.primary_category}
                                        onChange={(e) => handleChangePrimaryCategory(item.index, e.target.value)}
                                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                      >
                                        {VALID_CATEGORIES.map(cat => (
                                          <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                      </select>
                                    ) : (
                                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm">
                                        {item.business.primary_category}
                                      </span>
                                    )}
                                  </div>
                                  
                                  <div>
                                    <label className="text-xs font-semibold text-gray-700 block mb-1">
                                      Categories Array:
                                    </label>
                                    <div className="flex flex-wrap gap-1">
                                      {(editedBusinesses[item.index]?.array || item.business.categories_array || []).map((cat: string) => (
                                        <span key={cat} className="bg-gray-100 px-2 py-1 rounded text-xs flex items-center gap-1">
                                          {cat}
                                          {editingNeedsReview === item.index && (
                                            <button
                                              onClick={() => handleRemoveCategoryFromNew(item.index, cat)}
                                              className="text-red-600 hover:text-red-800 font-bold"
                                            >
                                              ×
                                            </button>
                                          )}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>

                                {/* Unmapped Categories Reference */}
                                {item.business.unmapped_categories && item.business.unmapped_categories.length > 0 && (
                                  <div className="mb-3 p-2 bg-orange-100 rounded border border-orange-200">
                                    <div className="text-xs font-semibold text-orange-800 mb-1">
                                      Unmapped Google Categories (for reference):
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                      {item.business.unmapped_categories.map((cat: string, idx: number) => (
                                        <span key={idx} className="bg-orange-200 text-orange-800 px-2 py-1 rounded text-xs">
                                          {cat}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Add Categories Selector */}
                                {editingNeedsReview === item.index && (
                                  <div className="p-2 bg-blue-50 border border-blue-300 rounded">
                                    <div className="text-xs font-semibold text-blue-800 mb-2">
                                      ➕ Add Categories:
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                      {VALID_CATEGORIES
                                        .filter(cat => !(editedBusinesses[item.index]?.array || item.business.categories_array || []).includes(cat))
                                        .map(cat => (
                                          <button
                                            key={cat}
                                            onClick={() => handleAddCategoryToNew(item.index, cat)}
                                            className="px-2 py-1 bg-white hover:bg-blue-100 border border-blue-400 rounded text-xs transition-colors"
                                          >
                                            {cat} +
                                          </button>
                                        ))}
                                    </div>
                                  </div>
                                )}

                                <div className="mt-2 text-xs text-orange-700 italic">
                                  💡 Edit the categories above, then import. Whatever you set here will be saved to the database.
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <span className={`px-2 py-1 text-xs rounded ${
                              item.validation.valid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {item.validation.valid ? 'Valid' : 'Invalid'}
                            </span>
                          </div>
                        </div>

                        {/* Validation Errors */}
                        {!item.validation.valid && (
                          <div className="mt-2 p-2 bg-red-100 rounded text-sm text-red-700">
                            <strong>Errors:</strong>
                            <ul className="list-disc list-inside">
                              {item.validation.errors.map((err, idx) => (
                                <li key={idx}>{err}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Duplicate Warning */}
                        {item.duplicate && (
                          <div className="mt-2 p-3 bg-yellow-100 border border-yellow-300 rounded">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-yellow-700 font-semibold">⚠️ Potential Duplicate</span>
                                <span className={`px-2 py-0.5 text-xs rounded ${getConfidenceColor(item.duplicate.confidence)}`}>
                                  {item.duplicate.confidence} confidence
                                </span>
                              </div>
                              {editingDuplicate === item.index ? (
                                <div className="flex gap-2">
                                  <button
                                    className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                                    onClick={() => handleSaveCategories(item.index, item.duplicate?.existingId || '')}
                                  >
                                    Save Changes
                                  </button>
                                  <button
                                    className="px-3 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600"
                                    onClick={() => setEditingDuplicate(null)}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <button
                                  className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                                  onClick={() => handleEditCategories(item.index, item.duplicate?.existingBusiness || {} as Business)}
                                >
                                  Edit Categories
                                </button>
                              )}
                            </div>
                            <div className="text-sm text-yellow-800 mb-2">
                              <strong>Match reasons:</strong> {item.duplicate.matchReasons.join(', ')}
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              {/* Existing Business - Editable */}
                              <div className="bg-white p-2 rounded border-2 border-gray-300">
                                <div className="font-semibold text-gray-700 mb-1">
                                  {editingDuplicate === item.index ? '✏️ Editing:' : 'Existing in Database:'}
                                </div>
                                <div><strong>Name:</strong> {item.duplicate.existingBusiness.name}</div>
                                <div><strong>Primary:</strong> <span className="bg-gray-200 px-1 rounded">{editedCategories[item.index]?.primary || item.duplicate.existingBusiness.primary_category}</span></div>
                                <div><strong>Categories:</strong> 
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {(editedCategories[item.index]?.array || item.duplicate.existingBusiness.categories_array || []).map((cat: string) => (
                                      <span key={cat} className="bg-gray-100 px-2 py-0.5 rounded text-xs flex items-center gap-1">
                                        {cat}
                                        {editingDuplicate === item.index && (
                                          <button
                                            onClick={() => handleRemoveCategory(item.index, cat)}
                                            className="text-red-600 hover:text-red-800 font-bold"
                                          >
                                            ×
                                          </button>
                                        )}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                <div className="text-gray-600 text-xs mt-1">
                                  ⭐ {item.duplicate.existingBusiness.rating} • {item.duplicate.existingBusiness.phone}
                                </div>
                              </div>
                              
                              {/* New Business from Excel - Reference Only */}
                              <div className="bg-green-50 p-2 rounded border border-green-200">
                                <div className="font-semibold text-green-700 mb-1">New from Excel (Reference):</div>
                                <div><strong>Name:</strong> {item.business.name}</div>
                                <div><strong>Primary:</strong> <span className="bg-green-200 px-1 rounded">{item.business.primary_category}</span></div>
                                <div><strong>Categories:</strong> 
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {item.business.categories_array?.map((cat: string) => (
                                      <span key={cat} className="bg-green-100 px-2 py-0.5 rounded text-xs">
                                        {cat}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                {item.business.unmapped_categories && item.business.unmapped_categories.length > 0 && (
                                  <div className="mt-2">
                                    <div className="text-xs text-orange-700 font-semibold">Unmapped:</div>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {item.business.unmapped_categories.map((cat: string, idx: number) => (
                                        <span key={idx} className="bg-orange-100 px-2 py-0.5 rounded text-xs">
                                          {cat}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                <div className="text-gray-600 text-xs mt-1">
                                  ⭐ {item.business.rating} • {item.business.phone}
                                </div>
                              </div>
                            </div>
                            
                            {/* Add Categories Selector (Only when editing) */}
                            {editingDuplicate === item.index && (
                              <div className="mt-3 p-3 bg-blue-50 border-2 border-blue-300 rounded">
                                <div className="font-semibold text-blue-800 mb-2">➕ Add Categories to Existing Business:</div>
                                <div className="flex flex-wrap gap-1">
                                  {VALID_CATEGORIES
                                    .filter(cat => !(editedCategories[item.index]?.array || item.duplicate?.existingBusiness.categories_array || []).includes(cat))
                                    .map(cat => (
                                      <button
                                        key={cat}
                                        onClick={() => handleAddCategory(item.index, cat)}
                                        className="px-2 py-1 bg-white hover:bg-blue-100 border border-blue-400 rounded text-xs transition-colors"
                                        title="Click to add this category"
                                      >
                                        {cat} +
                                      </button>
                                    ))}
                                </div>
                              </div>
                            )}
                            
                            <div className="mt-2 text-xs text-gray-600 italic">
                              💡 Tip: Click "Edit Categories", review the Excel data on the right for reference, then select from valid categories below to add to existing business. Click × to remove. Save when done.
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Import Button */}
              <div className="mt-6 pt-6 border-t flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleCancel}
                    className="px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 font-semibold"
                  >
                    Cancel & Start Over
                  </button>
                  <p className="text-sm text-gray-600">
                    {selectedBusinesses.size} businesses selected for import
                  </p>
                </div>
                <button
                  disabled={selectedBusinesses.size === 0}
                  className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold"
                >
                  Import Selected Businesses
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  )
}