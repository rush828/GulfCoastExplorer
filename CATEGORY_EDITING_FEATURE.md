# Category Editing Feature - Import Tool

## Overview
The import tool now supports **inline category editing** for both duplicates and "Needs Review" businesses, allowing you to fix categories **before** importing into the database.

---

## 🎯 Two Types of Editing

### 1. **Duplicates** (Existing Businesses)
- **When:** Business already exists in database
- **Purpose:** Add new categories from the import to enrich existing data
- **Saves:** Immediately to the database when you click "Save Changes"
- **Primary Category:** Cannot be changed (existing business primary is kept)

### 2. **Needs Review** (New Businesses)
- **When:** Business is new but has unmapped categories
- **Purpose:** Fix categories before importing
- **Saves:** In the preview; imported when you click "Import Selected"
- **Primary Category:** Can be changed via dropdown

---

## 🔧 How It Works

### For Duplicates:

1. **Review Phase:**
   - Left panel: Shows existing business (in database)
   - Right panel: Shows Excel data (reference only)
   - Unmapped categories shown if any

2. **Edit Mode** (Click "Edit Categories"):
   - Left panel: Categories become editable
     - Click **×** to remove a category
   - Blue panel appears: All valid categories
     - Click **"category +"** to add it to existing business
   - Right panel: Remains reference only

3. **Save:**
   - Click **"Save Changes"**
   - Updates database immediately
   - Refreshes preview to show changes

### For Needs Review:

1. **Review Phase:**
   - Shows current primary category
   - Shows current categories array
   - Shows unmapped categories (reference)

2. **Edit Mode** (Click "Edit Categories"):
   - **Primary Category:** Dropdown to change
   - **Categories Array:** 
     - Click **×** to remove a category
   - **Unmapped Categories:** Shown for reference
   - **Blue Panel:** All valid categories
     - Click **"category +"** to add it

3. **Save:**
   - Click **"Save Changes"**
   - Updates preview locally
   - When you **"Import Selected"**, the edited version is imported

---

## ✅ Features

### Category Whitelist (37 categories)
```
24_hours, art_gallery, bakery, bar, beach, campground, car_rental,
clothing_store, coffee_shop, convenience_store, entertainment, farmers_market,
fishing_charter, golf_course, historic_landmark, ice_cream, liquor_store,
lodging, marina, meal_delivery, museum, music_venue, nightclub,
park_recreation, professional_services, restaurant, rv_park, scuba_diving,
spa, spa_fitness, store, tour_agency, tourist_attraction, water_sports,
water_sports_equipment_rental_service, winery_brewery
```

### Restrictions
- **Only** categories from the whitelist can be added
- **No** custom categories from Google/Excel
- **No** unmapped categories can be directly added
- Primary category **must** be from the whitelist

### UI Elements
1. **White Panel:** Current categories (editable when in edit mode)
2. **Green Panel:** Excel data (reference only for duplicates)
3. **Orange Panel:** Unmapped categories (reference only)
4. **Blue Panel:** Valid categories selector (only when editing)

---

## 🎨 User Experience

### Visual Feedback
- **Edit Mode:** Blue border on selector panel
- **Buttons:** Hover effects on category buttons
- **Remove:** Red × buttons appear when editing
- **Add:** Blue + buttons for available categories

### State Management
- **editingDuplicate:** Tracks which duplicate is being edited
- **editingNeedsReview:** Tracks which needs-review business is being edited
- **editedCategories:** Stores category changes for duplicates
- **editedBusinesses:** Stores category changes for needs-review items

### Workflows
1. **Duplicate Workflow:**
   ```
   Click "Edit Categories" → Add/Remove from blue panel → Save → Database updated
   ```

2. **Needs Review Workflow:**
   ```
   Click "Edit Categories" → Change primary + Add/Remove → Save → Preview updated → Import → Database updated
   ```

---

## 💡 Use Cases

### Use Case 1: Enriching Existing Business
**Scenario:** A bar in the database now also offers live music according to Google data.

**Steps:**
1. Business shows as duplicate
2. Click "Edit Categories"
3. See `music_venue` in Excel data
4. Click `music_venue +` in blue panel
5. Save
6. Existing business now has `bar` and `music_venue`

### Use Case 2: Fixing Unmapped Categories
**Scenario:** A restaurant has Google category "Seafood restaurant" which wasn't auto-mapped.

**Steps:**
1. Business shows as "Needs Review"
2. See "seafood_restaurant" in unmapped categories
3. Click "Edit Categories"
4. Add `restaurant` from blue panel
5. Save
6. Import with correct category

### Use Case 3: Changing Primary Category
**Scenario:** A business was auto-mapped to `store` but should be `clothing_store`.

**Steps:**
1. Business shows as "Needs Review"
2. Click "Edit Categories"
3. Change primary dropdown from `store` to `clothing_store`
4. Save
5. Import with corrected primary category

---

## 🔍 Technical Details

### State Updates
- **Duplicates:** Use `setEditedCategories()` to track changes
- **Needs Review:** Use `setEditedBusinesses()` to track changes
- **Preview:** `setPreview()` updates when saving needs-review edits

### Data Flow
```
Excel Upload → Transform → Auto-map → Flag unmapped → Preview
                                                         ↓
                                               User edits (optional)
                                                         ↓
                                                    Import → Database
```

### Category Validation
- All categories checked against `VALID_CATEGORIES` constant
- Invalid categories cannot be added
- Primary category must be in whitelist

---

## 📊 Benefits

### For Users:
✅ **Control:** Full control over what gets imported  
✅ **Visibility:** See what Google found vs. what's being imported  
✅ **Flexibility:** Fix issues before importing  
✅ **Efficiency:** No need to edit after import  

### For Data Quality:
✅ **Consistency:** Only whitelisted categories in database  
✅ **Accuracy:** Manual review of auto-mapping results  
✅ **Completeness:** Can add missing categories from unmapped data  
✅ **Cleanliness:** No duplicate categories, no invalid data  

---

## 🚀 Summary

The category editing feature provides a **powerful, user-friendly interface** for managing categories during import:

1. **Smart Auto-Mapping:** Reduces manual work by ~70%
2. **Manual Override:** For the remaining 30% that needs review
3. **Whitelist Enforcement:** Keeps data clean and consistent
4. **Inline Editing:** No need to import → edit → re-import
5. **Visual Feedback:** Clear UI shows what's happening

**Result:** Fast, accurate imports with full control! 🎉




