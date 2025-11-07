# 🧪 Manual Cross-Browser & Device Testing Checklist

## 📋 **Pre-Test Setup**
- [ ] Development server running on http://localhost:3001
- [ ] Clear browser cache and cookies
- [ ] Disable browser extensions that might interfere
- [ ] Test in incognito/private mode

---

## 🌐 **Desktop Browser Testing**

### **Chrome (Latest)**
- [ ] **Homepage**: http://localhost:3001/
- [ ] **State Pages**: http://localhost:3001/states/alabama
- [ ] **City Pages**: http://localhost:3001/alabama/dauphin-island
- [ ] **Search Page**: http://localhost:3001/search?city=Pensacola&state=florida
- [ ] **Business Detail**: http://localhost:3001/business/pensacola_beach_pensacola_beach_1

### **Firefox (Latest)**
- [ ] Test all same URLs as Chrome
- [ ] Check for any rendering differences
- [ ] Verify JavaScript functionality

### **Safari (Mac only)**
- [ ] Test all same URLs as Chrome
- [ ] Check WebKit-specific rendering
- [ ] Test touch interactions if on MacBook with touch

### **Edge (Latest)**
- [ ] Test all same URLs as Chrome
- [ ] Check for any Edge-specific issues

---

## 📱 **Mobile Device Testing**

### **iPhone (Safari)**
- [ ] **Viewport**: 390x844 (iPhone 12)
- [ ] **Navigation**: Test hamburger menu if present
- [ ] **Touch**: Test all buttons and links
- [ ] **Scrolling**: Test smooth scrolling
- [ ] **Orientation**: Test portrait/landscape

### **Android (Chrome)**
- [ ] **Viewport**: 360x760 (Samsung Galaxy)
- [ ] **Navigation**: Test mobile navigation
- [ ] **Touch**: Test all interactive elements
- [ ] **Performance**: Check loading speed

### **iPad (Safari)**
- [ ] **Viewport**: 768x1024
- [ ] **Touch**: Test touch interactions
- [ ] **Orientation**: Test both orientations

---

## 🔗 **URL Normalization Testing**

Test these URLs work in ALL browsers:

### **Case Sensitivity**
- [ ] http://localhost:3001/alabama/Elberta ✅
- [ ] http://localhost:3001/alabama/elberta ✅

### **Spaces in URLs**
- [ ] http://localhost:3001/alabama/Dauphin Island ✅
- [ ] http://localhost:3001/alabama/dauphin-island ✅

### **URL Encoding**
- [ ] http://localhost:3001/alabama/Orange%20Beach ✅
- [ ] http://localhost:3001/alabama/orange-beach ✅

### **Periods in URLs**
- [ ] http://localhost:3001/mississippi/bay-st.-louis ✅
- [ ] http://localhost:3001/mississippi/bay-st-louis ✅

---

## 🎨 **UI/UX Testing**

### **Navigation**
- [ ] **Logo**: Clickable and returns to home
- [ ] **State Links**: Work correctly
- [ ] **City Links**: Navigate properly
- [ ] **Search Link**: Opens search page

### **Back Links**
- [ ] **City Page**: Back link works
- [ ] **Search Page**: Back link works
- [ ] **Business Detail**: Back link works
- [ ] **State Page**: Back link works

### **Search Functionality**
- [ ] **Form Submission**: Works correctly
- [ ] **Category Dropdown**: Populates and filters
- [ ] **Results Display**: Shows businesses
- [ ] **Pagination**: Works if present
- [ ] **Sorting**: By review count works

### **Business Listings**
- [ ] **Cards**: Display properly
- [ ] **Images**: Load correctly
- [ ] **Phone Links**: Clickable tel: links
- [ ] **Website Links**: Open in new tab
- [ ] **View Details**: Navigate to business page

---

## 📞 **Phone Number Testing**

### **Format Consistency**
- [ ] All phone numbers show as (555) 555-5555
- [ ] Phone numbers are clickable links
- [ ] Links use tel: protocol
- [ ] Styling is consistent across pages

### **Phone Link Functionality**
- [ ] **Desktop**: Click opens default phone app
- [ ] **Mobile**: Click initiates phone call
- [ ] **Tablet**: Click opens phone app or prompts

---

## 🎯 **Performance Testing**

### **Loading Speed**
- [ ] **Homepage**: Loads under 3 seconds
- [ ] **City Pages**: Loads under 3 seconds
- [ ] **Search Results**: Loads under 3 seconds
- [ ] **Business Detail**: Loads under 3 seconds

### **Image Loading**
- [ ] **Business Photos**: Load properly
- [ ] **Placeholder Images**: Show when photos missing
- [ ] **Lazy Loading**: Works if implemented

---

## 🐛 **Error Testing**

### **404 Errors**
- [ ] **Invalid City**: http://localhost:3001/alabama/invalid-city
- [ ] **Invalid State**: http://localhost:3001/invalid-state/city
- [ ] **Invalid Business**: http://localhost:3001/business/invalid-id

### **Console Errors**
- [ ] **Chrome DevTools**: No JavaScript errors
- [ ] **Firefox DevTools**: No JavaScript errors
- [ ] **Safari Web Inspector**: No JavaScript errors

---

## 📊 **Responsive Design Testing**

### **Breakpoints**
- [ ] **Mobile**: 320px - 767px
- [ ] **Tablet**: 768px - 1023px
- [ ] **Desktop**: 1024px+

### **Layout Elements**
- [ ] **Navigation**: Adapts to screen size
- [ ] **Grid Layouts**: Responsive columns
- [ ] **Text**: Readable at all sizes
- [ ] **Buttons**: Touch-friendly on mobile

---

## 🔍 **SEO Testing**

### **Meta Tags**
- [ ] **Title**: Unique for each page
- [ ] **Description**: Present and relevant
- [ ] **Viewport**: Mobile-friendly

### **URL Structure**
- [ ] **Clean URLs**: No query parameters in main URLs
- [ ] **Hyphenated**: City names use hyphens
- [ ] **Lowercase**: Consistent casing

---

## 📝 **Test Results Template**

### **Browser/Device**: ________________
### **Date**: ________________
### **Tester**: ________________

#### **Passed Tests**: ___/___
#### **Failed Tests**: ___/___
#### **Warnings**: ___/___

#### **Issues Found**:
1. ________________________________
2. ________________________________
3. ________________________________

#### **Notes**:
________________________________
________________________________

---

## 🚀 **Quick Test Commands**

```bash
# Start development server
npm run dev

# Run automated tests
node automated-testing-script.js

# View test reports
# Open test-report.html in browser
```

---

## 📋 **Priority Issues to Fix**

Based on automated test results:

1. **❌ Category Dropdown Not Found** - Search page missing category selector
2. **❌ Console Errors** - 20+ JavaScript errors need fixing
3. **⚠️ Mobile Navigation** - No mobile menu detected
4. **⚠️ Search Results** - No business cards found on search page
5. **❌ Back Link Functionality** - JavaScript errors in back link testing

---

## 🎯 **Success Criteria**

- [ ] All URLs load without 404 errors
- [ ] No JavaScript console errors
- [ ] Responsive design works on all devices
- [ ] All interactive elements function properly
- [ ] Phone numbers are clickable and properly formatted
- [ ] Back navigation works consistently
- [ ] Search functionality returns results
- [ ] Page load times under 3 seconds
