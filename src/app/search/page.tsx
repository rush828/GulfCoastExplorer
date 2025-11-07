'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import SearchResultsWithPagination from '../../components/SearchResultsWithPagination'
import { statesAndCities } from '../../data/cities'

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [hasSearched, setHasSearched] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)
  


  // Get URL parameters on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const city = urlParams.get('city')
      const state = urlParams.get('state')
      const category = urlParams.get('category')
      const search = urlParams.get('search')
      
      // Set all parameters from URL
      if (state) {
        // Convert state to lowercase to match dropdown values
        setSelectedState(state.toLowerCase())
      }
      
      if (category) {
        // Handle both composite categories and expanded category lists
        const firstCategory = category.split(',')[0].trim()
        
        // Check if it's already a composite category
        if (firstCategory === 'food-dining' || firstCategory === 'beaches-outdoors' || firstCategory === 'water-activities' || firstCategory === 'lodging') {
          setSelectedCategory(firstCategory)
        } else {
          // Map individual categories to their parent dropdown categories
          let dropdownCategory = firstCategory
          if (firstCategory === 'restaurant' || firstCategory === 'coffee_shop' || firstCategory === 'ice_cream' || firstCategory === 'seafood_market' || firstCategory === 'winery_brewery') {
            dropdownCategory = 'food-dining'
          } else if (firstCategory === 'beach' || firstCategory === 'marina') {
            dropdownCategory = 'beaches-outdoors'
          } else if (firstCategory === 'water_sports' || firstCategory === 'boat_tour' || firstCategory === 'fishing-charter' || firstCategory === 'scuba_diving' || firstCategory === 'surf_shop') {
            dropdownCategory = 'water-activities'
          } else if (firstCategory === 'lodging') {
            dropdownCategory = 'lodging'
          }
          
          setSelectedCategory(dropdownCategory)
        }
      }
      if (search) setSearchTerm(search)
      
      // Set city from URL parameters with delay to ensure state is processed
      if (city) {
        const decodedCity = decodeURIComponent(city)
        // Convert city name to slug format to match dropdown options
        const citySlug = decodedCity.toLowerCase().replace(/\s+/g, '-')
        setTimeout(() => {
          setSelectedCity(citySlug)
          // Auto-trigger search if we have URL parameters (from category card clicks)
          if (state || category || search) {
            setHasSearched(true)
          }
        }, 100)
      } else {
        // Auto-trigger search if we have URL parameters (from category card clicks)
        if (state || category || search) {
        setHasSearched(true)
        }
      }
      
      // Mark initialization as complete
      setIsInitializing(false)
    }
  }, [])


  // Function to determine where to go back to
  const getBackUrl = () => {
    // Use URL parameters from the current page URL
    const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
    const city = urlParams.get('city')
    const state = urlParams.get('state')
    
    // If we have city and state, go back to that city page
    if (city && state) {
      // Normalize city slug to handle URL-encoded spaces and case sensitivity
      const normalizedCity = decodeURIComponent(city).toLowerCase().replace(/\s+/g, '-')
      return `/${state}/${normalizedCity}`
    }
    
    // If we have just state, go to state page
    if (state) {
      return `/states/${state}`
    }
    
    // Otherwise go to home
    return '/'
  }

  // Reset city when state changes (but only for user interactions, not URL initialization)
  useEffect(() => {
    // Only reset city if this is not the initial load and state is being changed by user
    // Skip this if we're coming from URL parameters (hasSearched will be true from URL params)
    if (!isInitializing && selectedState !== '' && !hasSearched) {
      setSelectedCity('')
    }
    // Auto-search when state changes if we already have search results
    if (hasSearched && !isInitializing) {
      handleSearch(new Event('submit') as any)
    }
  }, [selectedState])

  // Auto-search when category changes if we already have search results
  useEffect(() => {
    if (hasSearched) {
      handleSearch(new Event('submit') as any)
    }
  }, [selectedCategory])

  // Set city from URL when state is available
  useEffect(() => {
    if (typeof window !== 'undefined' && selectedState && !selectedCity) {
      const urlParams = new URLSearchParams(window.location.search)
      const city = urlParams.get('city')
      if (city) {
        const decodedCity = decodeURIComponent(city).toLowerCase()
        setSelectedCity(decodedCity)
      }
    }
  }, [selectedState, selectedCity])

  // Auto-search when city changes if we already have search results
  useEffect(() => {
    if (hasSearched) {
      handleSearch(new Event('submit') as any)
    }
  }, [selectedCity])

  const states = [
    { name: 'All States', value: '' },
    { name: 'Alabama', value: 'alabama' },
    { name: 'Florida', value: 'florida' },
    { name: 'Louisiana', value: 'louisiana' },
    { name: 'Mississippi', value: 'mississippi' },
    { name: 'Texas', value: 'texas' }
  ]

  const categories = [
    // Composite categories first
    { name: 'Lodging', value: 'lodging' },
    { name: 'Beaches & Outdoors', value: 'beaches-outdoors' },
    { name: 'Food & Dining', value: 'food-dining' },
    { name: 'Water Activities', value: 'water-activities' },
    // Individual categories sorted alphabetically
    { name: 'Bar', value: 'bar' },
    { name: 'Beach', value: 'beach' },
    { name: 'Campground', value: 'campground' },
    { name: 'Car Rental', value: 'car_rental' },
    { name: 'Clothing Store', value: 'clothing_store' },
    { name: 'Coffee Shop', value: 'coffee_shop' },
    { name: 'Entertainment', value: 'entertainment' },
    { name: 'Fishing Charter', value: 'fishing-charter' },
    { name: 'Health & Wellness', value: 'spa_fitness' },
    { name: 'Historic Landmark', value: 'historic_landmark' },
    { name: 'Liquor Store', value: 'liquor_store' },
    { name: 'Marina', value: 'marina' },
    { name: 'Meal Delivery', value: 'meal_delivery' },
    { name: 'Nightlife & Entertainment', value: 'nightlife-entertainment' },
    { name: 'Open 24 Hours', value: '24_hours' },
    { name: 'Park Recreation', value: 'park_recreation' },
    { name: 'Restaurant', value: 'restaurant' },
    { name: 'RV Park', value: 'rv_park' },
    { name: 'Sports & Recreation', value: 'golf_course' },
    { name: 'Shopping', value: 'shopping_mall' },
    { name: 'Tour Agency', value: 'tour_agency' },
    { name: 'Tourist Attraction', value: 'tourist_attraction' }
  ]

  // Get cities based on selected state
  const getCitiesForState = () => {
    if (!selectedState) {
      // If no state selected, return empty array
      return []
    }
    
    // If state selected, show only cities from that state
    const stateData = statesAndCities.find(s => s.slug === selectedState)
    const cities = stateData ? stateData.cities.map(city => ({
      name: city.name,
      value: city.slug,
      state: stateData.name
    })).sort((a, b) => a.name.localeCompare(b.name)) : []
    
    return cities
  }



  const updateUrlAndSearch = () => {
    // Update URL with search parameters
    const params = new URLSearchParams()
    if (searchTerm) params.append('search', searchTerm)
    if (selectedCity) params.append('city', selectedCity)
    if (selectedState) params.append('state', selectedState)
    if (selectedCategory) params.append('category', selectedCategory)
    
    const newUrl = params.toString() ? `?${params.toString()}` : ''
    window.history.pushState({}, '', newUrl)
    
    // Set the search flag to trigger results display
    setHasSearched(true)
  }

  const handleSearch = async (e?: React.FormEvent) => {
    // Prevent default only if it's a form submission
    if (e) {
      e.preventDefault()
    }
    
    // Only perform search if at least one field has a value
    if (!searchTerm && !selectedCity && !selectedState && !selectedCategory) {
      return
    }
    
    setIsSearching(true)
    
    updateUrlAndSearch()
    
    // Small delay to show loading state, then scroll to results
    setTimeout(() => {
      setIsSearching(false)
      
      // Scroll to results section only on mobile and tablet (not desktop)
      const resultsSection = document.getElementById('search-results')
      if (resultsSection && window.innerWidth < 1024) { // lg breakpoint is 1024px
        resultsSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        })
      }
    }, 500)
  }

  const handleStateChange = (newState: string) => {
    setSelectedState(newState)
    // Clear city and category when state changes
    setSelectedCity('')
    setSelectedCategory('')
    // Don't trigger search - only update state
  }

  const handleCategoryChange = (newCategory: string) => {
    setSelectedCategory(newCategory)
    // Don't trigger search - only update state
  }

  return (
    <>
      <main className="min-h-screen bg-gray-50">
        {/* Back Link - Show when coming from category cards */}
        {(selectedState && selectedCity) && (
          <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-30 lg:hidden">
            <div className="container mx-auto px-4 sm:px-6 py-1">
              <div className="max-w-4xl mx-auto">
                <Link
                  href={`/${selectedState}/${selectedCity.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200 text-sm"
                >
                  <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to {selectedCity.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Hero Section with Background Image */}
      <section className="relative bg-gradient-to-r from-gulf-600 to-blue-600 text-white py-12 sm:pt-20 sm:pb-8 md:pt-20 md:pb-12 overflow-hidden" aria-labelledby="hero-heading">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&h=800&fit=crop&crop=center"
            alt="Beautiful Gulf Coast beach with turquoise waters, white sand, palm trees, and stunning sunset"
            fill
            className="object-cover opacity-20"
            priority
          />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center -mt-5 sm:mt-0">
          <h1 id="hero-heading" className="text-2xl sm:text-4xl md:text-5xl font-bold mb-6">
            Gulf Coast Tourist Directory
          </h1>
          <p className="text-sm sm:text-xl max-w-3xl mx-auto">
            Search our comprehensive Gulf Coast tourist directory with 500+ verified local businesses. Find restaurants, hotels, attractions, and services across Texas, Louisiana, Mississippi, Alabama, and Florida with detailed reviews and contact information.
          </p>
        </div>
      </section>

      {/* Search Form - Mobile Optimized */}
      <section className="pt-2 pb-4 sm:pt-6 sm:pb-8 bg-white" aria-labelledby="search-form-heading">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
          
          {/* Mobile: Compact Header */}
          <header className="text-center mb-3 sm:mb-6">
            <h2 id="search-form-heading" className="text-base sm:text-2xl font-bold text-gray-800 mb-1 sm:mb-3">
              Find Your Perfect Destination
            </h2>
            <p className="hidden sm:block text-base text-gray-600 max-w-2xl mx-auto px-4">
              Search by location, category, or specific terms to discover Gulf Coast gems. 
            </p>
          </header>
          
          <form onSubmit={handleSearch} className="max-w-5xl mx-auto">
            {/* Mobile: Single Row Compact Layout */}
            <div className="block sm:hidden">
              {/* Main Search Bar */}
              <div className="mb-2">
                <input
                  type="text"
                  id="search-term-mobile"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search hotels, beaches, seafood..."
                  className="w-full px-1.5 py-0 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gulf-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>
              
              {/* Compact Filter Row */}
              <div className="flex gap-2 mb-2">
                <select
                  id="state-select-mobile"
                  value={selectedState}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="flex-1 px-1 py-0 sm:py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gulf-500 focus:border-transparent text-sm"
                >
                  {states.map((state) => (
                    <option key={state.value} value={state.value}>
                      {state.name}
                    </option>
                  ))}
                </select>
                
                <select
                  id="city-select-mobile"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="flex-1 px-1 py-0 sm:py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gulf-500 focus:border-transparent text-sm"
                  disabled={!selectedState}
                >
                  <option value="">All Cities</option>
                  {getCitiesForState().map((city) => (
                    <option key={city.value} value={city.value}>
                      {city.name}
                    </option>
                  ))}
                </select>
                
                <select
                  id="category-select-mobile"
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="flex-1 px-1 py-0 sm:py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gulf-500 focus:border-transparent text-sm"
                  disabled={!selectedState}
                >
                  <option value="">{!selectedState ? 'Select state first' : 'All Categories'}</option>
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Mobile Action Buttons */}
              <div className="flex gap-2 justify-center">
                <button
                  type="submit"
                  className="mobile-search-button bg-gulf-600 hover:bg-gulf-700 text-white font-medium py-0.5 sm:py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center text-sm"
                  disabled={isSearching}
                >
                  {isSearching ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Searching...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      Search
                    </>
                  )}
                </button>
                {hasSearched && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm('')
                      setSelectedCity('')
                      setSelectedState('')
                      setSelectedCategory('')
                      setHasSearched(false)
                      window.history.pushState({}, '', '/search')
                    }}
                    className="mobile-search-button bg-gray-500 hover:bg-gray-600 text-white font-medium py-0.5 sm:py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center text-sm"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
            
            {/* Desktop: Original Layout */}
            <div className="hidden sm:block">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div>
                  <label htmlFor="search-term" className="block text-sm font-medium text-gray-700 mb-1">
                    Search Term
                  </label>
                  <input
                    type="text"
                    id="search-term"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Hotels, beaches, seafood..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gulf-500 focus:border-transparent text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="state-select" className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <select
                    id="state-select"
                    value={selectedState}
                    onChange={(e) => handleStateChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gulf-500 focus:border-transparent text-sm"
                  >
                    {states.map((state) => (
                      <option key={state.value} value={state.value}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="city-select" className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <select
                    id="city-select"
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gulf-500 focus:border-transparent text-sm"
                    disabled={!selectedState}
                  >
                    <option value="">{!selectedState ? 'Select a state first' : 'All Cities'}</option>
                    {getCitiesForState().map((city) => (
                      <option key={city.value} value={city.value}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="category-select" className="block text-sm font-medium text-gray-700 mb-1">
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                      </svg>
                      Category
                    </span>
                  </label>
                  <select
                    id="category-select"
                    value={selectedCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gulf-500 focus:border-transparent text-sm"
                    disabled={!selectedState}
                  >
                    <option value="">{!selectedState ? 'Select a state first' : 'Filter by Category'}</option>
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="text-center">
                <div className="flex flex-row gap-3 justify-center items-center">
              <button
                type="submit"
                    className="btn-primary text-sm px-8 py-2"
                aria-label="Search Gulf Coast destinations"
                disabled={isSearching}
              >
                {isSearching ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Searching...
                  </>
                ) : (
                  'Search Destinations'
                )}
              </button>
              
              {hasSearched && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedCity('')
                    setSelectedState('')
                    setSelectedCategory('')
                    setHasSearched(false)
                    window.history.pushState({}, '', '/search')
                  }}
                      className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors text-sm"
                  aria-label="Clear search and start over"
                >
                  Clear Search
                </button>
              )}
                </div>
              </div>
            </div>
          </form>
          </div>
        </div>
      </section>

      {/* Search Results - Show Below Search Form */}
      {hasSearched && (
        <section id="search-results" className="py-4 sm:py-8 bg-gray-50" aria-labelledby="results-heading">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
            <h2 id="results-heading" className="text-2xl font-bold text-gray-800 mb-6 hidden md:block">
              Search Results
            </h2>
            
            {/* Active Filters Display - Hidden on mobile and tablet */}
            <div className="hidden md:block mb-6 p-4 bg-white rounded-lg border border-gray-200 sm:mt-0 -mt-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Active Filters:</h3>
              <div className="flex flex-wrap gap-2">
                {searchTerm && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                    Search: "{searchTerm}"
                  </span>
                )}
                {selectedState && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                    State: {states.find(s => s.value === selectedState)?.name}
                  </span>
                )}
                {selectedCity && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                    City: {getCitiesForState().find(c => c.value === selectedCity)?.name || selectedCity}
                  </span>
                )}
                {selectedCategory && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800">
                    Category: {categories.find(c => c.value === selectedCategory)?.name}
                  </span>
                )}
              </div>
            </div>
            
            <SearchResultsWithPagination 
              searchTerm={hasSearched ? searchTerm : ''}
              selectedState={hasSearched ? selectedState : ''}
              selectedCategory={hasSearched ? selectedCategory : ''}
              city={hasSearched ? selectedCity : ''}
            />
            
            {/* Filter Hint - Show when there are many results */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Use the filters above</span> to narrow down your results and find exactly what you're looking for
              </p>
            </div>
            </div>
          </div>
        </section>
      )}
      </main>
    </>
  )
}
