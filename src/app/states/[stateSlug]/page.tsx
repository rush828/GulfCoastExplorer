import Link from 'next/link';
import { statesAndCities } from '../../../data/cities';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';

interface StatePageProps {
  params: {
    stateSlug: string;
  };
}

export async function generateMetadata({ params }: StatePageProps): Promise<Metadata> {
  const state = statesAndCities.find(s => s.slug === params.stateSlug.toLowerCase());
  
  if (!state) {
    return {
      title: 'State Not Found',
      description: 'The requested Gulf Coast state could not be found.'
    };
  }

  return {
    title: `${state.name} Gulf Coast - Coastal Cities, Beaches & Tourist Destinations`,
    description: `Explore ${state.name}'s Gulf Coast with ${state.cities.length} coastal cities. Discover beaches, fishing, hotels, restaurants, and tourist attractions in ${state.name}.`,
    keywords: [
      `${state.name} Gulf Coast`,
      `${state.name} beaches`,
      `${state.name} coastal cities`,
      `${state.name} fishing`,
      `${state.name} tourism`,
      `${state.name} vacation`,
      `${state.name} hotels`,
      `${state.name} restaurants`,
      `${state.name} water sports`,
      `${state.name} parasailing`,
      `${state.name} surfing`,
      `${state.name} jet ski rental`,
      `${state.name} boat rental`,
      `${state.name} kayaking`,
      `${state.name} paddleboarding`,
      `${state.name} scuba diving`,
      `${state.name} snorkeling`,
      `${state.name} sailing`,
      `${state.name} deep sea fishing`,
      `${state.name} inshore fishing`,
      `${state.name} Gulf Coast water sports`,
      `${state.name} Gulf Coast parasailing`,
      `${state.name} Gulf Coast surfing`,
      `${state.name} Gulf Coast jet ski rental`,
      `${state.name} Gulf Coast boat rental`,
      `${state.name} Gulf Coast fishing`,
      `${state.name} Gulf Coast kayaking`,
      `${state.name} Gulf Coast paddleboarding`,
      `${state.name} Gulf Coast scuba diving`,
      `${state.name} Gulf Coast snorkeling`,
      `${state.name} Gulf Coast sailing`,
      `${state.name} Gulf Coast deep sea fishing`,
      `${state.name} Gulf Coast inshore fishing`,
      'Gulf Coast destinations',
      'coastal tourism',
      'beach vacations'
    ],
    openGraph: {
      title: `${state.name} Gulf Coast - Complete Coastal Guide`,
      description: `Explore ${state.name}'s Gulf Coast with ${state.cities.length} coastal cities, beaches, fishing, and tourist attractions.`,
      url: `https://gulfcoastexplorer.com/states/${state.slug}`,
      siteName: 'Gulf Coast Tourist Directory',
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: `${state.name} Gulf Coast - Beautiful coastal destinations and attractions`,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${state.name} Gulf Coast - Complete Coastal Guide`,
      description: `Explore ${state.name}'s Gulf Coast with ${state.cities.length} coastal cities, beaches, fishing, and tourist attractions.`,
      images: ['/og-image.jpg'],
    },
    alternates: {
      canonical: `/states/${state.slug}`,
    },
    other: {
      'geo.region': 'US',
      'geo.placename': `${state.name} Gulf Coast`,
      'geo.position': '29.7604;-95.3698',
      'ICBM': '29.7604, -95.3698',
    },
  };
}

export default function StatePage({ params }: StatePageProps) {
  const state = statesAndCities.find(s => s.slug === params.stateSlug.toLowerCase());
  
  if (!state) {
    notFound();
  }


  return (
    <>

      
      {/* Enhanced Structured Data for State Page with Local Business Focus */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": `${state.name} Gulf Coast - Complete Coastal Guide`,
            "description": `Explore ${state.name}'s Gulf Coast with ${state.cities.length} coastal cities, beaches, fishing, and tourist attractions.`,
            "url": `https://gulfcoastexplorer.com/states/${state.slug}`,
            "mainEntity": {
              "@type": "State",
              "name": `${state.name} Gulf Coast`,
              "description": `${state.name} Gulf Coast region with ${state.cities.length} coastal cities and tourist destinations`,
              "containsPlace": state.cities.map((city, index) => ({
                "@type": "City",
                "name": city.name,
                "description": city.description,
                "url": `https://gulfcoastexplorer.com/${state.slug}/${city.slug}`,
                "position": index + 1,
                "geo": {
                  "@type": "GeoCoordinates",
                  "latitude": getCityCoordinates(city.slug, state.slug).lat,
                  "longitude": getCityCoordinates(city.slug, state.slug).lng
                }
              })),
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": getStateCoordinates(state.slug).lat,
                "longitude": getStateCoordinates(state.slug).lng
              }
            },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://gulfcoastexplorer.com"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "States",
                  "item": "https://gulfcoastexplorer.com/states"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": `${state.name} Gulf Coast`,
                  "item": `https://gulfcoastexplorer.com/states/${state.slug}`
                }
              ]
            }
          })
        }}
      />

      {/* Local Business Directory Schema for State */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": `${state.name} Gulf Coast Tourism Directory`,
            "description": `Comprehensive directory of ${state.name} Gulf Coast businesses, attractions, and services`,
            "url": `https://gulfcoastexplorer.com/states/${state.slug}`,
            "telephone": "+1-800-GULF-COAST",
            "address": {
              "@type": "PostalAddress",
              "addressRegion": state.name,
              "addressCountry": "US"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": getStateCoordinates(state.slug).lat,
              "longitude": getStateCoordinates(state.slug).lng
            },
            "areaServed": state.cities.map(city => ({
              "@type": "City",
              "name": city.name,
              "addressRegion": state.name
            })),
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": `${state.name} Gulf Coast Services`,
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Beach Access Information",
                    "description": "Information about beaches and coastal access points"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Fishing Charter Directory",
                    "description": "Local fishing charters and boat rentals"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Accommodation Guide",
                    "description": "Hotels, resorts, and vacation rentals"
                  }
                }
              ]
            }
          })
        }}
      />
      
      <main className="min-h-screen bg-gradient-to-br from-gulf-50 to-blue-50">
        {/* Hero Section with State Image */}
        <section className="relative bg-gradient-to-r from-gulf-600 to-blue-600 text-white overflow-hidden" style={{paddingTop: '2rem', paddingBottom: '3rem'}} aria-labelledby="hero-heading">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&h=800&fit=crop&crop=center"
              alt={`Beautiful ${state.name} Gulf Coast beach with turquoise waters, white sand, palm trees, and stunning sunset`}
              fill
              className="object-cover opacity-20"
              priority
            />
          </div>
          <div id="states-hero-container" className="relative z-10 container mx-auto px-4 text-center">
          <h1 id="hero-heading" className="text-4xl md:text-5xl font-bold mb-6">
            {state.name}
          </h1>
          <p className="text-xl max-w-3xl mx-auto">
            {state.description}
          </p>
          <div className="mt-6">
            <span className="text-lg">
              {state.cities.length} Coastal Cities to Explore
            </span>
          </div>
        </div>
      </section>


      {/* Cities Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {state.cities.map((city) => (
              <article key={city.slug} className="card bg-white hover:shadow-xl transition-shadow overflow-hidden rounded-lg shadow-md">
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-4 text-blue-700">
                    {city.name}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {city.description}
                  </p>

                  {/* Explore Button */}
                  <Link 
                    href={`/${state.slug}/${city.slug}`}
                    className="btn-primary w-full text-center"
                    aria-label={`Explore ${city.name} in ${state.name}`}
                  >
                    Explore {city.name}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      </main>
    </>
  );
}

// Helper function to get state hero images
function getStateHeroImage(stateSlug: string): string {
  const stateHeroImages: { [key: string]: string } = {
    texas: "https://images.unsplash.com/photo-nJISUbYg6_k?w=1920&h=800&fit=crop&crop=center", // Texas Gulf Coast - Palm tree at sunset
    louisiana: "https://images.unsplash.com/photo-LDAOazirpL0?w=1920&h=800&fit=crop&crop=center", // Louisiana Gulf Coast - Bird on post
    mississippi: "https://images.unsplash.com/photo-2HNZrPeTr_g?w=1920&h=800&fit=crop&crop=center", // Mississippi Gulf Coast - Gulfport Pier
    alabama: "https://images.unsplash.com/photo-R8RCDkpKQeE?w=1920&h=800&fit=crop&crop=center", // Alabama Gulf Coast - Orange Beach
    florida: "https://images.unsplash.com/photo-y5-n_mf2NpE?w=1920&h=800&fit=crop&crop=center" // Florida Gulf Coast - Lifeguard tower at sunset
  };
  return stateHeroImages[stateSlug] || stateHeroImages.texas;
}

// Helper function to get state coordinates
function getStateCoordinates(stateSlug: string): { lat: string; lng: string } {
  const coordinates: { [key: string]: { lat: string; lng: string } } = {
    texas: { lat: "29.7604", lng: "-95.3698" },
    louisiana: { lat: "30.9843", lng: "-91.9623" },
    mississippi: { lat: "32.3547", lng: "-89.3985" },
    alabama: { lat: "32.806671", lng: "-86.791130" },
    florida: { lat: "27.7663", lng: "-82.6404" }
  };
  return coordinates[stateSlug] || coordinates.texas;
}

// Helper function to get city coordinates
function getCityCoordinates(citySlug: string, stateSlug: string): { lat: string; lng: string } {
  const coordinates: { [key: string]: { lat: string; lng: string } } = {
    // Texas cities
    galveston: { lat: "29.3013", lng: "-94.7977" },
    corpus_christi: { lat: "27.8006", lng: "-97.3964" },
    port_aransas: { lat: "27.8339", lng: "-97.0611" },
    south_padre_island: { lat: "26.1118", lng: "-97.1656" },
    
    // Louisiana cities
    grand_isle: { lat: "29.2361", lng: "-90.0112" },
    lafitte: { lat: "29.6669", lng: "-90.1081" },
    port_fourchon: { lat: "29.1058", lng: "-90.1995" },
    cocodrie: { lat: "29.2458", lng: "-90.6612" },
    dulac: { lat: "29.3888", lng: "-90.7137" },
    
    // Mississippi cities
    biloxi: { lat: "30.3960", lng: "-88.8853" },
    gulfport: { lat: "30.3674", lng: "-89.0928" },
    ocean_springs: { lat: "30.4113", lng: "-88.8278" },
    pascagoula: { lat: "30.3658", lng: "-88.5561" },
    
    // Alabama cities
    gulf_shores: { lat: "30.2460", lng: "-87.7008" },
    orange_beach: { lat: "30.2944", lng: "-87.5736" },
    dauphin_island: { lat: "30.2505", lng: "-88.1097" },
    
    // Florida cities
    pensacola: { lat: "30.4213", lng: "-87.2169" },
    destin: { lat: "30.3935", lng: "-86.4958" },
    panama_city_beach: { lat: "30.1766", lng: "-85.8055" },
    key_west: { lat: "24.5551", lng: "-81.7826" },
    naples: { lat: "26.1420", lng: "-81.7948" },
    sarasota: { lat: "27.3364", lng: "-82.5307" }
  };
  return coordinates[citySlug] || getStateCoordinates(stateSlug);
}

// Helper function to get city hero images
function getCityHeroImage(citySlug: string, stateSlug: string): string {
  const cityHeroImages: { [key: string]: string } = {
    // Texas cities - Gulf Coast beaches
    galveston: "https://images.unsplash.com/photo-nJISUbYg6_k?w=800&h=600&fit=crop&crop=center", // Galveston Beach - Palm tree at sunset
    corpus_christi: "https://images.unsplash.com/photo-fGHB8MVUvjw?w=800&h=600&fit=crop&crop=center", // Corpus Christi Beach - Sunset over water
    port_aransas: "https://images.unsplash.com/photo-Zhm7GR7rAC4?w=800&h=600&fit=crop&crop=center", // Port Aransas Beach - Sandy beach with dead tree
    south_padre: "https://images.unsplash.com/photo-dBxr8y--z6s?w=800&h=600&fit=crop&crop=center", // South Padre Beach - Surfer riding wave
    
    // Louisiana cities - Gulf Coast beaches
    grand_isle: "https://images.unsplash.com/photo-LDAOazirpL0?w=800&h=600&fit=crop&crop=center", // Grand Isle Beach - Bird on post
    venice: "https://images.unsplash.com/photo-2REknYb4PV8?w=800&h=600&fit=crop&crop=center", // Venice Beach - Cloudy sunset
    empire: "https://images.unsplash.com/photo-s0yqNj7sbnc?w=800&h=600&fit=crop&crop=center", // Empire Beach - Wooden bench on beach
    
    // Mississippi cities - Gulf Coast beaches
    biloxi: "https://images.unsplash.com/photo-R8RCDkpKQeE?w=800&h=600&fit=crop&crop=center", // Biloxi Beach - Orange Beach sunset
    gulfport: "https://images.unsplash.com/photo-2HNZrPeTr_g?w=800&h=600&fit=crop&crop=center", // Gulfport Beach - Gulfport Pier
    ocean_springs: "https://images.unsplash.com/photo-HhO4AbNLSAA?w=800&h=600&fit=crop&crop=center", // Ocean Springs Beach - Group of people on beach
    
    // Alabama cities - Gulf Coast beaches
    gulf_shores: "https://images.unsplash.com/photo-2hThlNRD21w?w=800&h=600&fit=crop&crop=center", // Gulf Shores Beach - Bird on beach
    orange_beach: "https://images.unsplash.com/photo-R8RCDkpKQeE?w=800&h=600&fit=crop&crop=center", // Orange Beach - Orange Beach sunset
    dauphin_island: "https://images.unsplash.com/photo-s0yqNj7sbnc?w=800&h=600&fit=crop&crop=center", // Dauphin Island Beach - Wooden bench on beach
    
    // Florida cities - Gulf Coast beaches
    destin: "https://images.unsplash.com/photo-y5-n_mf2NpE?w=800&h=600&fit=crop&crop=center", // Destin Beach - Lifeguard tower at sunset
    panama_city: "https://images.unsplash.com/photo-Zhm7GR7rAC4?w=800&h=600&fit=crop&crop=center", // Panama City Beach - Sandy beach with dead tree
    pensacola: "https://images.unsplash.com/photo-J-XmSEyTY4k?w=800&h=600&fit=crop&crop=center", // Pensacola Beach - Structures beside water
    perdido_key: "https://images.unsplash.com/photo-L1ggoof0Jvs?w=800&h=600&fit=crop&crop=center" // Perdido Key Beach - Sunset with clouds
  };
  return cityHeroImages[citySlug] || getStateHeroImage(stateSlug);
}
