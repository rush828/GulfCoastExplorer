# Google AdSense Manual Ads Setup Guide

## Current Status
✅ **Auto Ads Enabled** - Google automatically places ads on your site  
⏸️ **Manual Ads Ready** - Infrastructure in place but disabled (won't affect site)

---

## How to Enable Manual Ads

### Step 1: Get Your Ad Unit Slot IDs from Google

1. Log into [Google AdSense](https://www.google.com/adsense)
2. Go to **Ads → By ad unit → Display ads**
3. Create new ad units for each placement:

   **Recommended Ad Units:**
   - `Search Results In-Feed` - For between search results
   - `Business Page Sidebar` - For business detail page sidebar
   - `Business Page Bottom` - Below business description
   - `Category Page Top` - Banner at top of category pages
   - `Category Page Inline` - Between category listings

4. Copy each **Ad Slot ID** (looks like `1234567890`)

---

### Step 2: Update Ad Components with Your Slot IDs

Edit these files and replace `YOUR_SLOT_ID_HERE` with your actual slot IDs:

1. **`src/components/ads/SearchResultsAd.tsx`**
   - Replace: `slot="YOUR_SLOT_ID_HERE"`
   - With: `slot="1234567890"` (your search results slot ID)

2. **`src/components/ads/BusinessPageAd.tsx`**
   - Replace: `slot="YOUR_SIDEBAR_SLOT_ID"` 
   - Replace: `slot="YOUR_BOTTOM_SLOT_ID"`

3. **`src/components/ads/CategoryPageAd.tsx`**
   - Replace: `slot="YOUR_CATEGORY_TOP_SLOT_ID"`
   - Replace: `slot="YOUR_CATEGORY_INLINE_SLOT_ID"`

---

### Step 3: Enable Manual Ads

Add this to your `.env.local` file:

```bash
# Enable manual ad placements (Auto Ads will still work too)
NEXT_PUBLIC_ENABLE_MANUAL_ADS=true
```

**That's it!** Manual ads will now show up on your site.

---

### Step 4: Add Ads to Your Pages

#### **Search Results Page** (`src/components/SearchResultsWithPagination.tsx`)

Add ad every 5 businesses:

```tsx
import SearchResultsAd from './ads/SearchResultsAd'

// Inside your businesses.map():
{businesses.map((business, index) => (
  <>
    <BusinessCard key={business.id} business={business} />
    
    {/* Show ad after every 5 businesses */}
    {(index + 1) % 5 === 0 && <SearchResultsAd />}
  </>
))}
```

#### **Business Detail Page** (`src/app/business/[id]/page.tsx`)

Add sidebar and bottom ads:

```tsx
import BusinessPageAd from '@/components/ads/BusinessPageAd'

// Add sidebar ad in the layout
<div className="grid lg:grid-cols-3 gap-6">
  {/* Main content */}
  <div className="lg:col-span-2">
    {/* Business info here */}
  </div>
  
  {/* Sidebar with ad */}
  <aside className="lg:col-span-1">
    <BusinessPageAd position="sidebar" />
  </aside>
</div>

{/* Bottom ad after business info */}
<BusinessPageAd position="bottom" />
```

#### **Category Pages** (`src/app/[category]/page.tsx`)

Add top banner and inline ads:

```tsx
import CategoryPageAd from '@/components/ads/CategoryPageAd'

// Top banner
<CategoryPageAd position="top" />

// Inline between listings
{categories.map((cat, index) => (
  <>
    <CategoryCard key={cat.id} category={cat} />
    {(index + 1) % 8 === 0 && <CategoryPageAd position="inline" />}
  </>
))}
```

---

## Ad Component Reference

### `<GoogleAd />` - Base Component
```tsx
<GoogleAd 
  slot="1234567890"           // Required: Your ad slot ID
  format="auto"               // auto | fluid | rectangle | vertical | horizontal
  responsive={true}           // Makes ad responsive
  className="custom-class"    // Optional styling
/>
```

### Pre-built Components

1. **`<SearchResultsAd />`** - For search results pages
2. **`<BusinessPageAd position="sidebar" />`** - For business pages
3. **`<BusinessPageAd position="bottom" />`** - Below business info
4. **`<CategoryPageAd position="top" />`** - Category page banner
5. **`<CategoryPageAd position="inline" />`** - Between categories

---

## Testing

### To Test Ads Locally:

1. Add `NEXT_PUBLIC_ENABLE_MANUAL_ADS=true` to `.env.local`
2. Restart dev server: `npm run dev`
3. Ads will show placeholder boxes initially
4. Once deployed and approved, real ads will appear

### To Disable Ads:

1. Remove `NEXT_PUBLIC_ENABLE_MANUAL_ADS=true` from `.env.local`
2. OR set it to `false`
3. Restart dev server

---

## Best Practices

### Ad Frequency (Don't Overdo It!)
- ✅ **Search Results:** 1 ad per 4-5 businesses
- ✅ **Business Page:** 1 sidebar + 1 bottom (max 2 ads)
- ✅ **Category Pages:** 1 top banner + 1 inline per 8-10 items

### Ad Placement Strategy
1. **High-Value Pages First:** Search results, popular categories
2. **Monitor Performance:** Check which placements earn most
3. **User Experience:** Never sacrifice UX for more ads
4. **Mobile:** Ads automatically adapt on mobile

### Revenue Optimization
- Start with fewer ads, add more gradually
- Monitor bounce rate - too many ads = users leave
- A/B test different placements
- Review Google AdSense performance reports weekly

---

## Troubleshooting

### Ads Not Showing?
1. Check `.env.local` has `NEXT_PUBLIC_ENABLE_MANUAL_ADS=true`
2. Restart dev server after changing .env
3. Check browser console for errors
4. Verify slot IDs are correct
5. AdSense can take 24-48 hours to start showing ads on new placements

### Ads Showing in Wrong Place?
1. Check the component's `className` prop
2. Adjust spacing with `my-4`, `my-6`, etc.
3. Use responsive utilities: `hidden lg:block` for desktop-only

### Want to Disable Manual Ads Temporarily?
Set `NEXT_PUBLIC_ENABLE_MANUAL_ADS=false` - Auto Ads will still work!

---

## Current Configuration

✅ **Auto Ads:** Active (Google places ads automatically)  
⏸️ **Manual Ads:** Infrastructure ready, disabled by default  
📁 **Ad Components:** Created in `src/components/ads/`  
🔧 **Configuration:** Via `.env.local` environment variable  

**Your site looks exactly the same until you enable manual ads!**




