# Google/Outscraper to Database Field Mapping

## Field Mapping Analysis

### Direct Mappings (1:1)
| Google Field | Database Field | Notes |
|--------------|----------------|-------|
| `name` | `name` | Direct copy |
| `city` | `city` | Direct copy |
| `state` | `state` | Direct copy |
| `latitude` | `latitude` | Direct copy |
| `longitude` | `longitude` | Direct copy |
| `rating` | `rating` | Direct copy |
| `reviews` | `reviews_count` | **Field name different** |
| `site` | `website` | **Field name different** |
| `phone` | `phone` | Direct copy |
| `full_address` | `address` | **Field name different** |

### Complex Mappings (Requires Processing)
| Google Field | Database Field | Processing Required |
|--------------|----------------|---------------------|
| `category` | `primary_category` | Normalize to underscore format (e.g., "bars" → "bar") |
| `subtypes` | `categories_array` | Parse comma-separated, normalize, remove if matches primary |
| `working_hours` | `categories_array` | Check for "Open 24 hours" → add `24_hours` to array (NEVER primary) |
| `working_hours_old_format` | `opening_hours` | Convert format from pipe-delimited to semicolon + "day:" format |
| `photo` | `photos` | Convert single URL to array format |
| `type` | `google_types` | Convert to array, add generic types |
| `about` | `description` | Extract key highlights from JSON object |

### Fields to Add (Defaults)
| Database Field | Default Value | Notes |
|----------------|---------------|-------|
| `priority_tier` | `1` | Free tier |
| `created_at` | `new Date().toISOString()` | Timestamp |
| `updated_at` | `new Date().toISOString()` | Timestamp |
| `tier_updated_at` | `new Date().toISOString()` | Timestamp |

### Fields Not in Google Data (Will be empty/default)
- `featured_until` - Not set for free tier businesses
- `destin_area` - Would need manual flagging

### Google Fields Not Needed
- `query`, `name_for_emails`, `borough`, `postal_code`, `us_state`, `country`, `country_code`, `h3`, `time_zone`, `area_service`
- `reviews_link`, `reviews_per_score_1-5`, `photos_count`
- `street_view`, `working_hours_csv_compatible`, `working_hours` (JSON format)
- `business_status`, `logo`, `verified`, `owner_*`, `location_*`
- `place_id`, `google_id`, `cid`, `kgmid`, `reviews_id`

## Category Normalization Rules

### Known Mappings
- `bars` → `bar`
- `Bar` → `bar`
- `restaurants` → `restaurant`
- `Hotels` → `lodging`
- `Lodging` → `lodging`

### Subcategory Parsing Rules

**Process:**
1. Parse `subtypes` comma-separated values
2. Normalize each to lowercase, underscores (e.g., "Seafood restaurant" → "seafood_restaurant")
3. Remove any that match the `primary_category`
4. Check `working_hours` field for "Open 24 hours" → add `24_hours` to array
5. **NEVER** add `24_hours` as `primary_category`

**Examples:**
- `category: "bars"`, `subtypes: "Bar"` → `primary_category: "bar"`, `categories_array: []` (removed duplicate)
- `category: "bars"`, `subtypes: "Bar, Restaurant"` → `primary_category: "bar"`, `categories_array: ["restaurant"]`
- `category: "bars"`, `subtypes: "Bar"`, `working_hours: "...Open 24 hours..."` → `primary_category: "bar"`, `categories_array: ["24_hours"]`

## Duplicate Detection Strategy

### Primary Match Criteria (High Confidence)
1. **Exact Name + City Match**: Same name in same city
2. **Phone Number Match**: Same phone number
3. **Address Match**: Similar address (fuzzy match)
4. **Google Place ID**: If we stored it previously

### Secondary Match Criteria (Medium Confidence - Flag for Review)
1. **Similar Name + Same Location**: Levenshtein distance < 3 in same city
2. **Same Coordinates**: Lat/Long within 0.0001 degrees (~10 meters)

### Auto-Skip (Don't Import)
- Exact duplicates (all criteria match)

### Flag for Review
- Partial matches (name similar OR same location but different details)

## Opening Hours Format Conversion

### Google Format (working_hours_old_format)
```
Monday:12PM-2AM|Tuesday:12PM-2AM|Wednesday:12PM-2AM
```

### Database Format (opening_hours)
```
Monday: 12PM-2AM; Tuesday: 12PM-2AM; Wednesday: 12PM-2AM
```

**Conversion**: Replace `|` with `; `, add space after `:` and before hours

## Photo URL Handling

### Google Provides
- Single `photo` URL (main image)
- `street_view` URL

### Database Expects
- Array of URLs in `photos` field

**Strategy**: 
- If we want to avoid Google [[memory:8042634]], we should NOT store these URLs
- Instead, leave `photos` as empty array `[]`
- Our system will fall back to category images

## Description Generation

Google provides `about` as a JSON object with service options, highlights, etc.

### Strategy
Extract 2-3 key highlights to create a brief description:
```javascript
const about = JSON.parse(googleData.about);
const highlights = about.Highlights || {};
const services = about["Service options"] || {};

// Example: "Great beer selection, karaoke, and sports. Offers outdoor seating."
```

## Import Process Flow

1. **Upload Excel** → Parse to JSON
2. **Transform Data** → Apply field mappings
3. **Detect Duplicates** → Check against existing database
4. **Create Backup** → Full database backup before import
5. **Show Preview** → Display what will be added + duplicates flagged
6. **User Review** → Approve/reject duplicates, edit data
7. **Import** → Add approved businesses to database
8. **Verify** → Show success count, allow rollback if needed
9. **Delete Backup** → After user confirmation

## Data Validation Rules

Before importing, validate:
- ✅ Required fields: `name`, `city`, `state`, `primary_category`
- ✅ Valid coordinates: `latitude` and `longitude` are numbers
- ✅ Valid rating: 0-5 range
- ✅ Valid phone: US format (can be empty)
- ✅ City is in Gulf Coast region (Florida, Alabama, Mississippi, Louisiana, Texas coastal cities)
- ⚠️ Warn if: Missing website, missing phone, rating < 3.0, reviews_count < 5
