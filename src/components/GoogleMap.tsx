'use client'

import { useCallback, useEffect, useState } from 'react'

interface GoogleMapProps {
  latitude: number
  longitude: number
  businessName: string
  address: string
  apiKey: string
}

declare global {
  interface Window {
    google: any
  }
}

export default function GoogleMap({ latitude, longitude, businessName, address, apiKey }: GoogleMapProps) {
  const [mapError, setMapError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mapContainer, setMapContainer] = useState<HTMLElement | null>(null)

  // Callback ref that will definitely be called when the DOM element is ready
  const containerRef = useCallback((node: HTMLDivElement | null) => {
    if (node !== null) {
      // Create the map container element
      const mapDiv = document.createElement('div')
      mapDiv.style.width = '100%'
      mapDiv.style.height = '100%'
      mapDiv.style.minHeight = '256px'
      
      // Append it to the container
      node.appendChild(mapDiv)
      setMapContainer(mapDiv)
      
      // Start loading the script
      loadGoogleMapsScript(mapDiv)
    } else {
      setMapContainer(null)
    }
  }, [])

  useEffect(() => {
    // Component mounted
  }, [latitude, longitude, businessName, address, apiKey, mapContainer])

  const loadGoogleMapsScript = (mapContainer: HTMLElement) => {
    // Check if script is already loaded
    if (window.google && window.google.maps && window.google.maps.Map) {
      initializeMap(mapContainer)
      return
    }

    // Check if script is already being loaded
    if (document.querySelector('script[src*="maps.googleapis.com"]')) {
      const checkInterval = setInterval(() => {
        if (window.google && window.google.maps && window.google.maps.Map) {
          clearInterval(checkInterval)
          initializeMap(mapContainer)
        }
      }, 100)
      return
    }

    // Create new script element
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&v=weekly&loading=async`
    script.async = true
    script.defer = true
    
    script.onload = () => {
      // Add a small delay to ensure Google Maps is fully initialized
      setTimeout(() => {
        if (window.google && window.google.maps && window.google.maps.Map) {
          initializeMap(mapContainer)
        } else {
          setMapError('Google Maps failed to initialize properly')
          setIsLoading(false)
        }
      }, 500)
    }
    
    script.onerror = () => {
      setMapError('Failed to load Google Maps script')
      setIsLoading(false)
    }

    document.head.appendChild(script)
  }

  const initializeMap = (mapContainer: HTMLElement) => {
    if (!mapContainer) {
      setMapError('Map container not available during initialization')
      setIsLoading(false)
      return
    }

    if (!window.google || !window.google.maps) {
      setMapError('Google Maps API not available')
      setIsLoading(false)
      return
    }

    try {
      const mapOptions = {
        center: { lat: latitude, lng: longitude },
        zoom: 15,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      }

      const map = new window.google.maps.Map(mapContainer, mapOptions)

      // Add marker
      const marker = new window.google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map: map,
        title: businessName,
        animation: window.google.maps.Animation.DROP
      })

      // Add info window
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 10px; max-width: 200px;">
            <h3 style="margin: 0 0 5px 0; font-size: 16px; font-weight: bold;">${businessName}</h3>
            <p style="margin: 0; font-size: 14px; color: #666;">${address}</p>
          </div>
        `
      })

      marker.addListener('click', () => {
        infoWindow.open(map, marker)
      })

      // Center map on marker
      map.panTo({ lat: latitude, lng: longitude })
      setIsLoading(false)
    } catch (error) {
      setMapError(`Failed to initialize map: ${error instanceof Error ? error.message : 'Unknown error'}`)
      setIsLoading(false)
    }
  }

  if (mapError) {
    return (
      <div className="w-full h-64 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
        <div className="text-center p-4">
          <div className="text-red-500 text-4xl mb-2">🗺️</div>
          <p className="text-gray-700 font-medium mb-2">Map Unavailable</p>
          <p className="text-gray-500 text-sm mb-3">{mapError}</p>
          <div className="mt-3">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium underline"
            >
              Open in Google Maps
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-96 rounded-2xl overflow-hidden bg-gray-50 shadow-lg">
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600 text-sm">Loading map...</p>
          </div>
        </div>
      )}
      <div ref={containerRef} className="w-full h-full" />
    </div>
  )
}
