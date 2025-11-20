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
  const [status, setStatus] = useState<GoogleDataStatus | null>(null)
  const [cacheStats, setCacheStats] = useState<CacheStats | null>(null)

  const gulfCoastLocations = [
    'Galveston', 'Corpus Christi', 'South Padre Island',
    'New Orleans', 'Baton Rouge',
    'Biloxi', 'Gulfport',
    'Gulf Shores', 'Mobile',
    'Pensacola', 'Destin', 'Panama City Beach'
  ]

  useEffect(() => {
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
