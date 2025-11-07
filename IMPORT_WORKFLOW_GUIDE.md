# Business Import Workflow Guide

## Overview
This guide explains how the Excel business import system works and how to use it effectively.

---

## 🎯 Import Workflow

### Step 1: Upload Excel File
- Navigate to **Admin → Import Data**
- Upload an Excel file with business data from Google/Outscraper

### Step 2: Automatic Processing
The system automatically:
1. **Parses** the Excel data (name, address, phone, categories, etc.)
2. **Maps Categories** using smart logic (see below)
3. **Downloads & Optimizes Images** from Google photo URLs
4. **Detects Duplicates** by comparing names, addresses, and phone numbers
5. **Validates** all data against your database schema

### Step 3: Review & Select
Businesses are categorized into:
- ✅ **Valid** - Ready to import
- ⚠️ **Duplicates** - Already exists in database (edit categories if needed)
- ❌ **Invalid** - Missing required data (cannot import)
- 🔍 **Needs Review** - Has unmapped categories (import with caution)

### Step 4: Handle Duplicates & Needs Review

#### For **Duplicates** (existing businesses):
1. Click **"Edit Categories"**
2. **Review the Excel data** (right panel) to see what categories Google found
3. **View unmapped categories** (if any) to understand what couldn't be mapped
4. **Select categories to add** from the blue panel showing all your valid categories
5. Click the **× button** to remove unwanted categories
6. Click **"Save Changes"** to update the existing business in the database

#### For **Needs Review** (new businesses with unmapped categories):
1. Click **"Edit Categories"**
2. **Change the primary category** using the dropdown (if needed)
3. **Add categories** from the blue panel (your valid categories)
4. **Remove categories** by clicking the × button
5. **Review unmapped categories** to understand what Google found
6. Click **"Save Changes"** - edits are saved locally in the preview
7. When you **"Import Selected"**, the edited version will be imported

**Important:** 
- You can ONLY add categories that already exist in your database (the whitelist)
- For duplicates: Changes are saved immediately to the database
- For needs review: Changes are saved when you import
- Unmapped categories are shown for reference only

### Step 5: Import Selected
- Check the businesses you want to import
- Click **"Import Selected"**
- The system will:
  - Add new businesses to the database
  - Update existing businesses with new categories (if you edited them)
  - Download and optimize all images
  - Create a backup before import
  - Update metadata (last import date, counts, etc.)

---

## 🧠 Smart Category Mapping

### How It Works
The system tries to automatically map Google categories to your internal categories using:

1. **Direct Mapping** - Exact matches (e.g., "Bar" → `bar`)
2. **Google Category Mapping** - Predefined mappings (e.g., "Jazz club" → `music_venue`)
3. **Keyword Detection** - Analyzes business name, description, and type for keywords
   - Example: "Deep Sea Fishing Charter" → detects `fishing_charter`
   - Example: "Tiki Bar & Grill" → detects `bar` and `restaurant`

### Valid Categories (Whitelist)
Only these categories are allowed:
```
24_hours, art_gallery, bakery, bar, beach, campground, car_rental,
clothing_store, coffee_shop, convenience_store, entertainment, farmers_market,
fishing_charter, golf_course, historic_landmark, ice_cream, liquor_store,
lodging, marina, meal_delivery, museum, music_venue, nightclub,
park_recreation, professional_services, restaurant, rv_park, scuba_diving,
spa, spa_fitness, store, tour_agency, tourist_attraction, water_sports,
water_sports_equipment_rental_service, winery_brewery
```

### What Happens to Unmapped Categories?
If a Google category cannot be mapped:
- It is **NOT added** to the business
- It is stored in `unmapped_categories` for your reference
- The business is flagged as **"Needs Review"**
- You can see what Google found and decide manually

---

## 🖼️ Image Handling

### Automatic Download & Optimization
For each business with a photo URL:
1. **Downloads** the image from Google
2. **Resizes** to 400×300 (maintains aspect ratio, crops to fit)
3. **Converts** to JPEG format
4. **Compresses** to 85% quality (progressive encoding)
5. **Saves** to `public/images/thumbnails/{businessId}.jpg`

### Fallback
- If image download fails, the business is still imported (without an image)
- Error is logged in the import results

---

## 📋 Best Practices

### Before Import
1. **Review the preview** - Check counts (valid, duplicates, invalid, needs review)
2. **Handle duplicates first** - Edit categories to enrich existing businesses (saves immediately)
3. **Edit "Needs Review" items** - Fix categories before importing (saves on import)

### During Import
1. **Duplicates**: Only import if you want to add them as separate entries (usually uncheck these)
2. **Needs Review**: Edit categories first, then import with corrected data
3. **Use the category selector** (blue panel) when editing - only valid categories are shown

### After Import
1. **Verify the data** in the Business Manager
2. **Check the backup** if something went wrong (`data-backup-[timestamp].json`)
3. **Review imported businesses** - All edits should be reflected

---

## 🔧 Troubleshooting

### "Needs Review" Items
**Q:** Why is this business flagged?  
**A:** The system couldn't automatically map one or more Google categories. Check the "Unmapped" section to see what was excluded.

**Q:** Should I import it?  
**A:** Click "Edit Categories" first! You can add the correct categories from your whitelist right here in the import tool. Then import with the corrected data.

**Q:** Can I change the primary category?  
**A:** Yes! When editing a "Needs Review" business, you can change the primary category using the dropdown selector.

### Duplicates Not Detected
**Q:** Why didn't the system detect this duplicate?  
**A:** Duplicate detection uses name similarity, address matching, and phone matching. If the data is significantly different, it may not match.

**Q:** Can I still prevent duplicates?  
**A:** Yes, manually review the "Valid" list before importing. If you see a duplicate, uncheck it.

### Categories Not Being Added
**Q:** Why can't I add a category I see in the Excel data?  
**A:** Only categories in the whitelist can be added. If a Google category isn't mapped, you cannot use it directly. Choose the closest valid category instead.

---

## 📊 Data Structure

### Excel Columns (Outscraper Format)
- `name` - Business name
- `category` - Primary category → maps to `primary_category`
- `subtypes` - Comma-separated categories → maps to `categories_array`
- `full_address` - Full address
- `city`, `state`, `zip` - Location details
- `phone` - Phone number
- `site` - Website URL
- `rating` - Star rating
- `reviews` - Number of reviews
- `description` - Business description
- `working_hours` - Operating hours (checked for "Open 24 hours")
- `photo` - Google photo URL

### Database Format (After Transformation)
```json
{
  "businessId": {
    "name": "Business Name",
    "primary_category": "bar",
    "categories_array": ["bar", "restaurant", "music_venue"],
    "address": "123 Main St",
    "city": "Orange Beach",
    "state": "Alabama",
    "zip": "36561",
    "phone": "(251) 555-1234",
    "website": "https://example.com",
    "rating": 4.5,
    "reviews_count": 123,
    "description": "Great place...",
    "thumbnails": ["/images/thumbnails/businessId.jpg"],
    "priority_tier": 1,
    "featured_until": null
  }
}
```

---

## 🎓 Summary

**The system does the heavy lifting:**
- Smart category mapping reduces manual work
- Automatic image optimization keeps load times fast
- Duplicate detection prevents data corruption

**You stay in control:**
- Review all data before import
- Manually decide what to add for duplicates
- See unmapped categories to make informed decisions
- Only use categories that already exist in your system

**Result:** Clean, consistent data with minimal manual intervention! 🚀

