'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
// import 'leaflet/dist/leaflet.css' // Commented out due to CSS parsing issues

interface InteractiveMapProps {
  latitude: number
  longitude: number
  businessName: string
  address: string
}

export default function InteractiveMap({ latitude, longitude, businessName, address }: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Initialize the map
    const map = L.map(mapRef.current).setView([latitude, longitude], 15)
    mapInstanceRef.current = map

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map)

    // Add a marker for the business location
    const marker = L.marker([latitude, longitude]).addTo(map)
    
    // Add popup with business info
    marker.bindPopup(`
      <div style="text-align: center;">
        <strong>${businessName}</strong><br>
        <small>${address}</small>
      </div>
    `)

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [latitude, longitude, businessName, address])

  return (
    <div className="w-full h-full">
      <div ref={mapRef} className="w-full h-full rounded-lg" />
    </div>
  )
}
