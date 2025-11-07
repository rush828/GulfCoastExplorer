# Import Category Filtering & Smart Mapping

## Overview
The import system now features **intelligent category mapping** with **keyword-based detection** that automatically translates Google/Outscraper categories into your database classification system by analyzing:
- Google category labels
- Business name
- Business description  
- Google type field
- Subtypes array

## How It Works

### 1. **Category Whitelist**
A whitelist of 37 valid categories is maintained in `src/lib/import-transformer.ts`:

```typescript
const VALID_CATEGORIES = new Set([
  "24_hours",
  "art_gallery",
  "bakery",
  "bar",
  "beach",
  "campground",
  "car_rental",
  "clothing_store",
  "coffee_shop",
  "convenience_store",
  "entertainment",
  "farmers_market",
  "fishing_charter",
  "golf_course",
  "historic_landmark",
  "ice_cream",
  "liquor_store",
  "lodging",
  "marina",
  "meal_delivery",
  "museum",
  "music_venue",
  "nightclub",
  "park_recreation",
  "professional_services",
  "restaurant",
  "rv_park",
  "scuba_diving",
  "spa",
  "spa_fitness",
  "store",
  "tour_agency",
  "tourist_attraction",
  "water_sports",
  "water_sports_equipment_rental_service",
  "winery_brewery"
]);
```

### 2. **Primary Category Filtering**
- If a business has an invalid primary category (e.g., `Mediterranean restaurant`), the **entire business is rejected**
- It will show as **invalid** in the import preview with the error: `"Invalid category: "Mediterranean restaurant" not in allowed list"`

### 3. **Keyword-Based Detection**
The system analyzes the business name, description, and type for keywords to automatically add relevant categories:

**Keywords for each category:**
- `water_sports`: "parasailing", "jet ski", "kayak", "paddleboard", "surf", etc.
- `fishing_charter`: "fishing", "charter", "deep sea", "offshore", "angling"
- `music_venue`: "live music", "jazz", "blues", "band", "acoustic", "karaoke"
- `marina`: "marina", "dock", "boat slip", "harbor", "yacht club"
- `bar`: "bar", "pub", "tavern", "lounge", "cocktail", "beer", "wine"
- And 30+ more category mappings!

**Example:**
- Business name: `"Sunset Bar & Grill - Live Jazz Every Friday"`
- Detected keywords: "bar", "grill", "jazz"
- **Auto-added categories**: `bar`, `restaurant`, `music_venue` ✨

### 4. **Category Array Filtering**
- For `subtypes`/`categories_array`, **only valid categories are included**
- Invalid categories are flagged for manual review
- Keyword-detected categories are automatically added
- Example:
  - **Google says**: Category: `"Bar"`, Subtypes: `"Bar, Wine bar"`, Name: `"Blues Lounge - Live Music Nightly"`
  - **You get**: `["bar", "music_venue"]` (bar from mapping + music_venue from keyword detection)

### 5. **Normalization & Mapping**
The system also handles:
- **Plurals**: `bars` → `bar`, `restaurants` → `restaurant`
- **Spaces**: `Mediterranean restaurant` → `mediterranean_restaurant` (then filtered out if not in whitelist)
- **Special chars**: Removed automatically
- **Case**: All lowercase

## Example Workflow

### Input from Google:
```json
{
  "name": "Coastal Bar & Grill",
  "category": "Mediterranean restaurant",
  "subtypes": "Bar, Restaurant, Mediterranean restaurant, Wine bar"
}
```

### Result:
❌ **REJECTED** - Invalid primary category `"Mediterranean restaurant"`
- Error: `Invalid category: "Mediterranean restaurant" not in allowed list`

---

### Input from Google:
```json
{
  "name": "Sunset Lounge",
  "category": "Bar",
  "subtypes": "Bar, Cocktail bar, Mediterranean restaurant, Wine bar, Live music"
}
```

### Result:
✅ **ACCEPTED** with filtered categories
```json
{
  "primary_category": "bar",
  "categories_array": ["bar", "cocktail_bar"]
}
```

Note: `Mediterranean restaurant`, `Wine bar`, and `Live music` were **silently dropped** because they're not in your whitelist.

## Benefits

1. **No junk categories**: Only your predefined categories make it into the database
2. **Data consistency**: All imports follow your classification system
3. **Clean editing**: When you edit duplicates, you only see relevant categories
4. **Automatic cleanup**: No need to manually remove useless categories like "Mediterranean restaurant"

## Manual Review System

### What Gets Flagged?

Businesses are flagged for manual review when:
- Google provides categories that can't be automatically mapped (e.g., `"Wine cellar"`, `"DJ service"`, `"Tex-Mex restaurant"`)
- The system isn't sure which of your categories to assign

### Review Workflow

1. **"Needs Review" Filter**: Click the orange "Needs Review" button in the import dashboard
2. **See Unmapped Categories**: Each flagged business shows an orange box with the unmapped Google categories
3. **Review After Import**: The business will import with the categories that *could* be mapped
4. **Manual Categorization**: After import, go to the business editor and manually add appropriate categories

### Example

**Google says:**
```json
{
  "category": "Bar",
  "subtypes": "Bar, Wine bar, DJ service, Live music"
}
```

**System processes:**
- ✅ `"Bar"` → `bar` (mapped)
- ✅ `"Wine bar"` → `bar` (mapped, deduplicated)
- ❌ `"DJ service"` → unmapped (flagged)
- ❌ `"Live music"` → unmapped (flagged)

**Result:**
- **Imported as**: `primary_category: "bar"`, `categories_array: ["bar"]`
- **Flagged with**: `unmapped_categories: ["DJ service", "Live music"]`
- **Shows orange warning**: "Unmapped Google Categories: DJ service, Live music"
- **Your action**: Review and decide if you want to add `music_venue` or another category manually

## Updating the Whitelist

To add a new category to the whitelist:

1. Open `src/lib/import-transformer.ts`
2. Add the category to the `VALID_CATEGORIES` Set
3. Make sure it's in your standard format (lowercase, underscores, no special chars)

## Adding Smart Mappings

To add a new Google → Your Category mapping:

1. Open `src/lib/import-transformer.ts`
2. Add to the `GOOGLE_CATEGORY_MAPPING` object:
   ```typescript
   'wine_cellar': 'liquor_store',
   'dj_service': 'music_venue',
   'live_music': 'music_venue',
   ```
3. The system will now automatically map these instead of flagging them

## Testing

Test with the sample data:
```bash
# Upload data/Outscraper-sarasota_bar.xlsx to the import tool
# View statistics in the dashboard
# Click "Needs Review" to see flagged businesses
# Review unmapped categories and decide on manual categorization
```
