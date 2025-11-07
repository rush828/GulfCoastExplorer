'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '../../../components/AdminLayout'

interface CacheStats {
  size: number
  keys: string[]
}

interface GoogleDataStatus {
  success: boolean
  status: string
  message?: string
  cacheStats?: CacheStats
}

export default function GoogleDataAdminPage() {
  const [apiKey, setApiKey] = useState('')
  const [status, setStatus] = useState<GoogleDataStatus | null>(null)
  const [isCollecting, setIsCollecting] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState('')
  const [cacheStats, setCacheStats] = useState<CacheStats | null>(null)

  const gulfCoastLocations = [
    'Galveston', 'Corpus Christi', 'South Padre Island',
    'New Orleans', 'Baton Rouge',
    'Biloxi', 'Gulfport',
    'Gulf Shores', 'Mobile',
    'Pensacola', 'Destin', 'Panama City Beach'
  ]

  useEffect(() => {
    // Load API key from localStorage if available
    const savedApiKey = localStorage.getItem('google_api_key')
    if (savedApiKey) {
      setApiKey(savedApiKey)
    }
    
    // Check initial status
    checkStatus()
  }, [])

  const checkStatus = async () => {
    try {
      const response = await fetch('/api/google-data/collect')
      const data = await response.json()
      setStatus(data)
      
      if (data.cacheStats) {
        setCacheStats(data.cacheStats)
      }
    } catch (error) {
      console.error('Error checking status:', error)
      setStatus({
        success: false,
        status: 'error',
        message: 'Failed to check status'
      })
    }
  }

  const handleAction = async (action: string, locationName?: string) => {
    if (!apiKey) {
      alert('Please enter your Google API key first')
      return
    }

    setIsCollecting(true)
    
    try {
      const payload: any = { action, apiKey }
      if (locationName) {
        payload.locationName = locationName
      }

      const response = await fetch('/api/google-data/collect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      
      if (data.success) {
        alert(data.message || 'Action completed successfully')
        // Refresh status after action
        setTimeout(checkStatus, 1000)
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error('Error performing action:', error)
      alert('An error occurred while performing the action')
    } finally {
      setIsCollecting(false)
    }
  }

  const saveApiKey = () => {
    if (apiKey) {
      localStorage.setItem('google_api_key', apiKey)
      alert('API key saved successfully')
    }
  }

  const clearApiKey = () => {
    localStorage.removeItem('google_api_key')
    setApiKey('')
    alert('API key cleared')
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Google Data Information
            </h1>
            <p className="text-lg text-gray-600">
              View information about Google Places API integration (Data collection disabled in admin)
            </p>
          </div>

          {/* API Key Management */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Google API Key Management</h2>
            <div className="grid md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Google Places API Key
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your Google API key"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <button
                  onClick={saveApiKey}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                  Save API Key
                </button>
              </div>
              <div>
                <button
                  onClick={clearApiKey}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                  Clear API Key
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Your API key is stored locally in your browser and used for search results retrieval.
            </p>
          </div>

          {/* Information Notice */}
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-lg font-semibold text-yellow-900 mb-2">Google API Data Collection Disabled</h3>
                <p className="text-yellow-800 mb-2">
                  Direct Google API data collection has been disabled in the admin panel to prevent accidental API calls during development.
                </p>
                <p className="text-yellow-800">
                  <strong>To add businesses:</strong> Use the <strong>Import Data</strong> tool to upload Excel files exported from Google/Outscraper.
                </p>
              </div>
            </div>
          </div>

          {/* Cache Status */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Cache Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Cache Status</h3>
                <div className="text-sm">
                  <p className="mb-1">Cache Size: <span className="font-semibold">{cacheStats?.size || 0}</span> entries</p>
                  <p>Status: <span className="font-semibold">{(cacheStats?.size || 0) > 0 ? 'Active' : 'Empty'}</span></p>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Actions</h3>
                <button
                  onClick={checkStatus}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                  Refresh Cache Status
                </button>
              </div>
            </div>
          </div>

          {/* Information Panel */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-blue-900 mb-4">Recommended Workflow</h2>
            <div className="grid md:grid-cols-2 gap-6 text-sm text-blue-800">
              <div>
                <h3 className="font-semibold mb-2">1. Export from Google/Outscraper</h3>
                <p>Use external tools like Outscraper to export Google Places data to Excel format with business information, reviews, and photos.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">2. Import via Admin Tool</h3>
                <p>Use the <strong>Import Data</strong> admin tool to upload Excel files. The system will automatically map categories, detect duplicates, and optimize images.</p>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-blue-100 rounded-md">
              <h3 className="font-semibold text-blue-900 mb-2">Benefits of This Approach</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• No accidental API calls during development</li>
                <li>• Full control over what data gets imported</li>
                <li>• Review and edit categories before import</li>
                <li>• Automatic duplicate detection</li>
                <li>• Image optimization included</li>
              </ul>
            </div>
          </div>
      </div>
    </AdminLayout>
  )
}
