# Comprehensive Pensacola Data Collection Guide

## Overview

This guide explains how to use the comprehensive data collection script to gather complete business data for Pensacola, Florida. The goal is to create a useful tourist directory with comprehensive coverage of all major business categories.

## What We're Collecting

### Target Business Counts by Category

| Category | Target Count | Description |
|----------|--------------|-------------|
| **lodging** | 25 | Hotels, resorts, inns, vacation rentals, B&Bs |
| **restaurant** | 60 | Restaurants, cafes, diners, various cuisines |
| **beach** | 15 | Beach access points, beach parks, public beaches |
| **water_sport** | 20 | Parasailing, jet ski rentals, boat rentals, kayaking |
| **marina** | 12 | Marinas, boat docks, boat ramps, harbors |
| **shopping_mall** | 8 | Shopping centers, malls, plazas |
| **outlet_mall** | 3 | Outlet stores and malls |
| **car_rental** | 8 | Car rental companies |
| **tour_agency** | 10 | Tour companies, guided tours, adventures |
| **historic_landmark** | 15 | Historic sites, museums, forts, landmarks |
| **bar** | 20 | Bars, pubs, breweries, wine bars |
| **liquor_store** | 8 | Liquor stores, wine shops, beer stores |

**Total Target: 204 businesses**

## Search Areas

The script searches in these key areas around Pensacola:

1. **Downtown Pensacola** (5km radius) - Historic district, restaurants, bars
2. **Pensacola Beach** (3km radius) - Beachfront businesses, water sports
3. **Gulf Breeze** (4km radius) - Suburban businesses, shopping
4. **Perdido Key** (3km radius) - Beach area, resorts
5. **Navarre Beach** (3km radius) - Beach area, water activities

## How to Run

### Prerequisites

1. **Google API Key**: Ensure your API key has access to:
   - Places API (Text Search)
   - Places API (Place Details)
   - Places API (Photos)

2. **API Quota**: This collection will use approximately:
   - 200-300 Text Search requests
   - 200-300 Place Details requests
   - Estimated cost: $5-15 depending on your quota

### Running the Collection

```bash
# Run the comprehensive collection
npm run collect-pensacola

# Or run directly with Node
node src/scripts/comprehensive-pensacola-collection.js
```

### What Happens During Collection

1. **Progress Tracking**: The script saves progress after each category
2. **Rate Limiting**: 200ms delay between requests to respect API limits
3. **Duplicate Prevention**: Checks for existing businesses to avoid duplicates
4. **Error Handling**: Continues collection even if individual requests fail
5. **Progress Files**: Saves intermediate results in `data/progress/` directory

## Output Files

### Progress Files
- Location: `data/progress/`
- Format: `pensacola-{category}-{date}.json`
- Purpose: Backup and resume capability

### Final Output
- **Main File**: `data/pensacola-comprehensive.json`
- **Fallback Database**: Updates `src/data/businesses-fallback.json`
- **Metadata**: Includes collection statistics and API usage info

## Data Quality Features

### What We Collect
- **Basic Info**: Name, address, coordinates, category
- **Contact**: Phone, website
- **Ratings**: Google rating, review count
- **Photos**: High-quality business photos
- **Hours**: Opening hours when available
- **Price Level**: Budget indicators
- **Types**: Google Places categories
- **Description**: Editorial summaries when available

### Data Validation
- **Duplicate Prevention**: Checks place_id to avoid duplicates
- **Location Filtering**: Ensures businesses are in Pensacola area
- **Category Mapping**: Maps Google types to our categories
- **Quality Checks**: Filters out low-quality or incomplete listings

## Monitoring and Control

### Real-time Progress
The script provides detailed console output:
```
🔍 Collecting data for restaurant...
  📍 Searching in Downtown Pensacola...
    🔎 Searching for: restaurant
      ✅ Added: The Burrow
      ✅ Added: Five Sisters Blues Cafe
    🔎 Searching for: cafe
      ✅ Added: Coffee Shop Downtown
  📊 Collected 45 businesses for restaurant
```

### Stopping and Resuming
- **Graceful Stop**: Use Ctrl+C to stop collection
- **Progress Saved**: Each category saves progress automatically
- **Resume Capability**: Can restart from where it left off

## Cost Management

### API Usage Optimization
- **Efficient Queries**: Uses targeted search terms
- **Rate Limiting**: Respects API limits to avoid quota issues
- **Batch Processing**: Groups related searches together
- **Progress Saving**: Prevents data loss if collection stops

### Estimated Costs
- **Text Search**: ~$0.017 per request
- **Place Details**: ~$0.017 per request
- **Total Estimated**: $5-15 for complete collection
- **Monthly Budget**: $200 Google Cloud credit should cover this easily

## Troubleshooting

### Common Issues

1. **API Quota Exceeded**
   - Check Google Cloud Console for quota status
   - Wait for quota reset or increase limits
   - Resume collection from progress files

2. **Rate Limiting**
   - Script automatically handles rate limiting
   - Increase `rateLimitDelay` if needed
   - Monitor API response headers

3. **Network Errors**
   - Script continues on individual failures
   - Check internet connection
   - Verify API key permissions

### Error Recovery
- **Automatic Retry**: Failed requests are logged but don't stop collection
- **Progress Files**: Each category saves independently
- **Resume Capability**: Can restart from any point

## Post-Collection

### Data Review
1. **Check Progress Files**: Review collected data quality
2. **Validate Categories**: Ensure proper category assignment
3. **Review Photos**: Check photo quality and relevance
4. **Verify Locations**: Confirm businesses are in correct areas

### Integration
1. **Website Update**: New data automatically appears on the site
2. **Category Counts**: Real-time business counts for each category
3. **Search Results**: Enhanced search with more comprehensive results
4. **User Experience**: Tourists can find many more options

## Future Expansion

### Additional Categories
- **Entertainment**: Movie theaters, bowling alleys, arcades
- **Health & Fitness**: Gyms, spas, medical services
- **Professional Services**: Real estate, legal, financial
- **Religious**: Churches, temples, community centers

### Other Cities
- **Galveston, TX**: Similar coastal tourism focus
- **Biloxi, MS**: Casino and beach tourism
- **Mobile, AL**: Historic port city
- **New Orleans, LA**: Major tourist destination

## Success Metrics

### Collection Goals
- **Coverage**: 80%+ of major businesses in each category
- **Quality**: Complete information for 90%+ of businesses
- **Photos**: At least 3 photos per business
- **Accuracy**: Correct addresses and contact information

### User Experience Goals
- **Findability**: Tourists can easily find what they're looking for
- **Completeness**: Comprehensive coverage of tourist needs
- **Accuracy**: Reliable information for planning trips
- **Visual Appeal**: High-quality photos and information

## Support

If you encounter issues during collection:
1. Check the console output for error messages
2. Verify your Google API key permissions
3. Check your API quota status
4. Review the progress files for partial results

The script is designed to be robust and provide detailed feedback throughout the collection process.

