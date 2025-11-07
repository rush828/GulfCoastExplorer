'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import OptimizedImage from './OptimizedImage';

interface Business {
  id: string;
  name: string;
  primary_category: string;
  categories: string[];
  address: string;
  city: string;
  state: string;
  rating?: number;
  reviews_count?: number;
  website?: string;
  phone?: string;
  description?: string;
  priority_tier?: number;
  featured_until?: string;
}

interface FeaturedBusinessesProps {
  city: string;
  state: string;
  limit?: number;
  className?: string;
}

export default function FeaturedBusinesses({ city, state, limit = 6, className = "" }: FeaturedBusinessesProps) {
  const [featuredBusinesses, setFeaturedBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFeaturedBusinesses() {
      try {
        setLoading(true);
        setError(null);

        // Fetch businesses for this city with priority tiers
        const response = await fetch(`/api/google-data/retrieve?city=${encodeURIComponent(city.toLowerCase())}&state=${encodeURIComponent(state.toLowerCase())}&limit=50`);
        const data = await response.json();

        if (data.success && data.businesses) {
          // Filter for featured businesses (priority tier 2 or 3)
          // featured_until is for record keeping only - no automatic expiration
          const featured = data.businesses
            .filter((business: Business) => {
              const tier = business.priority_tier || 1;
              // Show all businesses with tier 2 or 3, regardless of featured_until date
              return tier >= 2;
            })
            .slice(0, limit);

          setFeaturedBusinesses(featured);
        } else {
          setError(data.error || 'Failed to load featured businesses');
        }
      } catch (err) {
        setError('Error loading featured businesses');
        console.error('Featured businesses error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchFeaturedBusinesses();
  }, [city, state, limit]);

  const getCategoryName = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      'accommodations': 'Lodging',
      'restaurant': 'Restaurant',
      'lodging': 'Lodging',
      'marina': 'Marina',
      'beach': 'Beach',
      'bar': 'Bar',
      'store': 'Store',
      'tour_agency': 'Tour Agency',
      'fishing_charter': 'Fishing Charter',
      'water_sports': 'Water Sports',
      'water-activities': 'Water Activities',
      'parks-recreation': 'Parks & Recreation',
      'beaches-outdoors': 'Beaches & Outdoors',
      'shopping_mall': 'Shopping & Retail',
      'spa_fitness': 'Health & Wellness',
      'tourist_attraction': 'Tourist Attraction',
    };
    return categoryMap[category] || category.charAt(0).toUpperCase() + category.slice(1).replace(/_/g, ' ');
  };

  const getTierBadge = (tier: number) => {
    switch (tier) {
      case 3:
        return (
          <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold shadow-md">
            ⭐ FEATURED
          </div>
        );
               case 2:
                 return (
                   <div className="absolute top-2 right-2 bg-gradient-to-r from-blue-400 to-blue-500 text-blue-900 px-2 py-1 rounded-full text-xs font-bold shadow-md">
                     ✅ VERIFIED
                   </div>
                 );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className={`${className}`}>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Businesses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: limit }).map((_, index) => (
            <div key={index} className="bg-gray-100 rounded-lg h-64 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className}`}>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Businesses</h2>
        <div className="text-center py-8">
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  if (featuredBusinesses.length === 0) {
    return null; // Don't show section if no featured businesses
  }

  return (
    <div className={`${className}`}>
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Businesses in {city}</h2>
        <div className="text-sm text-gray-500">
          Verified & Featured Partners
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredBusinesses.map((business) => (
          <Link
            key={business.id}
            href={`/business/${encodeURIComponent(business.id)}`}
            className="group block"
          >
            <article className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 relative">
              {/* Tier Badge */}
              {getTierBadge(business.priority_tier || 1)}
              
              {/* Image */}
              <div className="h-48 overflow-hidden">
                <OptimizedImage
                  businessId={business.id}
                  businessName={business.name}
                  primaryCategory={business.primary_category}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  width={400}
                  height={300}
                  alt={`${business.name} - ${getCategoryName(business.primary_category)}`}
                />
              </div>
              
              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {business.name}
                  </h3>
                  {business.rating && (
                    <div className="flex items-center ml-2 flex-shrink-0">
                      <div className="flex items-center">
                        <span className="text-yellow-400 text-sm">★</span>
                        <span className="text-sm font-medium text-gray-700 ml-1">
                          {business.rating}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                
                <p className="text-sm text-blue-600 font-medium mb-2">
                  {getCategoryName(business.primary_category)}
                </p>
                
                {business.description && (
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                    {business.description}
                  </p>
                )}
                
                <div className="text-xs text-gray-500">
                  {business.city}, {business.state}
                </div>
                
                {business.reviews_count && business.reviews_count > 0 && (
                  <div className="text-xs text-gray-500 mt-1">
                    {business.reviews_count} reviews
                  </div>
                )}
              </div>
            </article>
          </Link>
        ))}
      </div>
      
      {/* Call to Action for Business Owners */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Want your business featured here?
          </h3>
                   <p className="text-gray-600 mb-4">
                     Join our Verified ($149/year) or Featured ($399/year) Business program to get priority placement in search results and featured sections.
                   </p>
          <Link
            href="/business-listing"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Learn More About Business Listings
          </Link>
        </div>
      </div>
    </div>
  );
}
