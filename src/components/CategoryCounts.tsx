'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

interface Category {
  name: string
  slug: string
  description: string
  icon: string
  count: number
}

interface CategoryCountsProps {
  city: string
  state: string
  categories: Omit<Category, 'count'>[]
}

export default function CategoryCounts({ city, state, categories }: CategoryCountsProps) {
  const [categoryCounts, setCategoryCounts] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  // Function to get the proper search URL for a category
  const getSearchUrl = (categorySlug: string) => {
    // Build base search URL - URL encode the city name
    const baseUrl = city ? `/search?city=${encodeURIComponent(city)}&state=${state}` : `/search?state=${state}`;
    
    // Map display category slugs to actual search parameters
    switch (categorySlug) {
      case 'food-dining':
        // Search for all food-related categories (EXCLUDING bars that are primarily for nightlife)
        return `${baseUrl}&category=food-dining`
      case 'beaches-outdoors':
        // Search for all outdoor/beach categories
        return `${baseUrl}&category=beaches-outdoors`
      case 'water-activities':
        // Search for water activity categories (matches search API exactly)
        return `${baseUrl}&category=water-activities`
      case 'accommodations':
        // Search for all accommodation categories
        return `${baseUrl}&category=accommodations`
      case 'shopping_mall':
        // Search for all shopping categories
        return `${baseUrl}&category=shopping_mall,outlet_mall,souvenir_shop,farmers_market,shopping-retail`
      case 'nightlife-entertainment':
        // Search for entertainment categories (bars, clubs, music venues)
        return `${baseUrl}&category=bar,music_venue,nightclub,entertainment`
      case 'history-culture':
        // Search for all cultural categories
        return `${baseUrl}&category=historic_landmark,history-culture,museum`
      case 'tours-adventures':
        // Search for all tour categories
        return `${baseUrl}&category=tour_agency,tours-adventures`
      case 'spa_fitness':
        // Search for all wellness categories
        return `${baseUrl}&category=spa_fitness,wellness,health`
      case 'golf_course':
        // Search for all golf categories
        return `${baseUrl}&category=golf_course,golf`
      case 'car_rental':
        // Search for all transportation categories
        return `${baseUrl}&category=car_rental,transportation`
      case 'liquor_store':
        // Search for all beverage categories (EXCLUDING bars that are primarily for nightlife)
        return `${baseUrl}&category=liquor_store,winery_brewery`
      default:
        // For other categories, use the slug directly
        return `${baseUrl}&category=${categorySlug}`
    }
  }

  useEffect(() => {
    const fetchCategoryCounts = async () => {
      try {
        setLoading(true)
        
        // Use the new optimized API endpoint that returns all category counts in one request
        // Convert city and state names to lowercase to match API expectations
        const normalizedCity = city?.toLowerCase();
        const normalizedState = state?.toLowerCase();
        const apiUrl = normalizedCity ? `/api/category-counts?city=${normalizedCity}&state=${normalizedState}` : `/api/category-counts?state=${normalizedState}`;
        
        const response = await fetch(apiUrl)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json()
        
        if (data.success && data.counts) {
          // Map the API response to the component's category format
          const counts = categories.map(category => {
            // Use the pre-calculated values from the API
            const count = data.counts[category.slug] || 0;
            
            return {
              ...category,
              count: count
            };
          });
          
          setCategoryCounts(counts)
        } else {
          // Fallback to original categories with 0 counts
          setCategoryCounts(categories.map(cat => ({ ...cat, count: 0 })))
        }
      } catch (error) {
        console.error('Error fetching category counts:', error)
        // Fallback to original categories with 0 counts
        setCategoryCounts(categories.map(cat => ({ ...cat, count: 0 })))
      } finally {
        setLoading(false)
      }
    }

    fetchCategoryCounts()
  }, [city, state])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categories.map((category) => (
          <div key={category.slug} className="bg-white rounded-xl p-4 text-center animate-pulse border border-gray-100 shadow-sm">
            <div className="text-3xl mb-3">{category.icon}</div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">{category.name}</h3>
            <p className="text-gray-500 text-xs mb-3 line-clamp-2">{category.description}</p>
            <div className="text-primary-600 text-xs font-medium">Loading...</div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {categoryCounts.map((category) => (
        <Link key={category.slug} href={getSearchUrl(category.slug)} className="group">
          <article className="bg-white rounded-xl p-3 text-center border border-gray-100 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col">
            {/* Icon */}
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">
              {category.icon}
            </div>
            
            {/* Title */}
            <h3 className="text-sm font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
              {category.name}
            </h3>
            
            {/* Description */}
            <p className="text-gray-500 text-xs mb-3 line-clamp-2 leading-relaxed flex-grow">
              {category.description}
            </p>
            
            {/* Count Badge */}
            <div className="inline-flex items-center justify-center px-2.5 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full border border-blue-100">
              <span className="text-blue-700 text-xs font-semibold">
                {category.count} listing{category.count !== 1 ? 's' : ''}
              </span>
            </div>
            
            {/* Hover Indicator */}
            <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="text-blue-500 text-xs font-medium flex items-center justify-center gap-1">
                <span>Explore</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </article>
        </Link>
      ))}
    </div>
  )
}
