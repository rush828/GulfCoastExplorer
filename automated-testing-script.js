const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Test configuration
const BASE_URL = 'http://localhost:3000'; // Using port 3000 for consistency
const TEST_RESULTS = {
  passed: 0,
  failed: 0,
  warnings: 0,
  tests: []
};

// Device configurations for testing
const DEVICES = [
  { name: 'Desktop Chrome', viewport: { width: 1920, height: 1080 }, userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
  { name: 'Desktop Firefox', viewport: { width: 1920, height: 1080 }, userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:91.0) Gecko/20100101 Firefox/91.0' },
  { name: 'iPad', viewport: { width: 768, height: 1024 }, userAgent: 'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X) AppleWebKit/605.1.15' },
  { name: 'iPhone 12', viewport: { width: 390, height: 844 }, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15' },
  { name: 'Samsung Galaxy', viewport: { width: 360, height: 760 }, userAgent: 'Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36' }
];

// Test URLs to check
const TEST_URLS = [
  { url: '/', name: 'Homepage' },
  { url: '/states/alabama', name: 'Alabama State Page' },
  { url: '/states/florida', name: 'Florida State Page' },
  { url: '/alabama/dauphin-island', name: 'Dauphin Island City Page' },
  { url: '/alabama/Dauphin Island', name: 'Dauphin Island (with space)' },
  { url: '/alabama/Orange%20Beach', name: 'Orange Beach (URL encoded)' },
  { url: '/mississippi/bay-st.-louis', name: 'Bay St. Louis (with period)' },
  { url: '/search?city=Pensacola&state=florida', name: 'Search Page' },
  { url: '/search?category=restaurant&city=Pensacola&state=florida', name: 'Search with Category' }
];

// Helper function to add test result
function addTestResult(device, testName, status, message, details = {}) {
  const result = {
    device,
    testName,
    status, // 'pass', 'fail', 'warning'
    message,
    details,
    timestamp: new Date().toISOString()
  };
  
  TEST_RESULTS.tests.push(result);
  
  if (status === 'pass') TEST_RESULTS.passed++;
  else if (status === 'fail') TEST_RESULTS.failed++;
  else if (status === 'warning') TEST_RESULTS.warnings++;
  
  console.log(`[${status.toUpperCase()}] ${device} - ${testName}: ${message}`);
}

// Test function for URL accessibility
async function testUrlAccessibility(page, device, url) {
  try {
    const fullUrl = `${BASE_URL}${url.url}`;
    const response = await page.goto(fullUrl, { waitUntil: 'networkidle2', timeout: 10000 });
    
    if (response.status() === 200) {
      addTestResult(device.name, `URL Access - ${url.name}`, 'pass', `Successfully loaded ${fullUrl}`);
      return true;
    } else {
      addTestResult(device.name, `URL Access - ${url.name}`, 'fail', `HTTP ${response.status()} for ${fullUrl}`);
      return false;
    }
  } catch (error) {
    addTestResult(device.name, `URL Access - ${url.name}`, 'fail', `Error loading ${url.url}: ${error.message}`);
    return false;
  }
}

// Test function for responsive design elements
async function testResponsiveElements(page, device) {
  try {
    // Test if navigation is visible
    const nav = await page.$('nav');
    if (nav) {
      const navVisible = await nav.isVisible();
      addTestResult(device.name, 'Navigation Visibility', navVisible ? 'pass' : 'fail', 
        navVisible ? 'Navigation is visible' : 'Navigation is not visible');
    }

    // Test if back links are present and styled
    const backLinks = await page.$$('.back-link');
    addTestResult(device.name, 'Back Link Styling', backLinks.length > 0 ? 'pass' : 'warning', 
      `Found ${backLinks.length} back links with proper styling`);

    // Test if business listing cards are styled correctly
    // Wait a bit for any dynamic content to load
    await new Promise(resolve => setTimeout(resolve, 2000));
    const businessCards = await page.$$('article[class*="bg-white rounded-xl"]');
    addTestResult(device.name, 'Business Card Styling', businessCards.length > 0 ? 'pass' : 'warning', 
      `Found ${businessCards.length} business listing cards`);

    // Test mobile-specific elements
    if (device.viewport.width <= 768) {
      // Check if mobile menu exists
      const mobileMenu = await page.$('[data-testid="mobile-menu"], .mobile-menu, button[aria-label*="menu"]');
      addTestResult(device.name, 'Mobile Menu', mobileMenu ? 'pass' : 'warning', 
        mobileMenu ? 'Mobile menu found' : 'No mobile menu detected');
    }

  } catch (error) {
    addTestResult(device.name, 'Responsive Elements', 'fail', `Error testing responsive elements: ${error.message}`);
  }
}

// Test function for search functionality
async function testSearchFunctionality(page, device) {
  try {
    // Go to search page
    await page.goto(`${BASE_URL}/search?city=Pensacola&state=florida`, { waitUntil: 'networkidle2' });
    
    // Test if search form is present
    const searchForm = await page.$('form');
    addTestResult(device.name, 'Search Form', searchForm ? 'pass' : 'fail', 
      searchForm ? 'Search form found' : 'Search form not found');

    // Test if category dropdown is present
    const categorySelect = await page.$('#category-select');
    addTestResult(device.name, 'Category Dropdown', categorySelect ? 'pass' : 'fail', 
      categorySelect ? 'Category dropdown found' : 'Category dropdown not found');

      // Wait for search results to load
  try {
    await page.waitForSelector('article[class*="bg-white rounded-xl"]', { timeout: 10000 });
  } catch (e) {
    // If no results found, check for "No Results Found" message
    const noResults = await page.$('text=No Results Found');
    if (noResults) {
      addTestResult(device.name, 'Search Results Display', 'warning', 'No search results found');
      return;
    }
  }
  
  // Test if search results are displayed
  const searchResults = await page.$$('article[class*="bg-white rounded-xl"]');
  addTestResult(device.name, 'Search Results Display', searchResults.length > 0 ? 'pass' : 'warning', 
    `Found ${searchResults.length} search results`);

    // Test pagination if present
    const pagination = await page.$('[data-testid="pagination"], .pagination');
    addTestResult(device.name, 'Pagination', pagination ? 'pass' : 'warning', 
      pagination ? 'Pagination found' : 'No pagination detected');

  } catch (error) {
    addTestResult(device.name, 'Search Functionality', 'fail', `Error testing search: ${error.message}`);
  }
}

// Test function for back link functionality
async function testBackLinks(page, device) {
  try {
    // Test city page back link
    await page.goto(`${BASE_URL}/alabama/dauphin-island`, { waitUntil: 'networkidle2' });
    
    const backLink = await page.$('.back-link');
    if (backLink) {
      const href = await page.evaluate(el => el.getAttribute('href'), backLink);
      addTestResult(device.name, 'Back Link Href', href ? 'pass' : 'fail', 
        href ? `Back link href: ${href}` : 'Back link has no href');
      
      // Test clicking back link
      try {
        await backLink.click();
        await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 5000 });
        addTestResult(device.name, 'Back Link Click', 'pass', 'Back link click successful');
      } catch (clickError) {
        addTestResult(device.name, 'Back Link Click', 'fail', `Back link click failed: ${clickError.message}`);
      }
    } else {
      addTestResult(device.name, 'Back Link Presence', 'fail', 'No back link found on city page');
    }

  } catch (error) {
    addTestResult(device.name, 'Back Link Functionality', 'fail', `Error testing back links: ${error.message}`);
  }
}

// Test function for phone number links
async function testPhoneLinks(page, device) {
  try {
    await page.goto(`${BASE_URL}/search?city=Pensacola&state=florida`, { waitUntil: 'networkidle2' });
    
    const phoneLinks = await page.$$('a[href^="tel:"]');
    addTestResult(device.name, 'Phone Number Links', phoneLinks.length > 0 ? 'pass' : 'warning', 
      `Found ${phoneLinks.length} phone number links`);

    // Test if phone links have proper styling
    if (phoneLinks.length > 0) {
      const firstPhoneLink = phoneLinks[0];
      const classes = await page.evaluate(el => el.getAttribute('class'), firstPhoneLink);
      const hasPhoneStyling = classes && classes.includes('business-listing-phone');
      addTestResult(device.name, 'Phone Link Styling', hasPhoneStyling ? 'pass' : 'warning', 
        hasPhoneStyling ? 'Phone links have proper styling' : 'Phone links may need styling');
    }

  } catch (error) {
    addTestResult(device.name, 'Phone Link Testing', 'fail', `Error testing phone links: ${error.message}`);
  }
}

// Test function for console errors
async function testConsoleErrors(page, device) {
  const consoleErrors = [];
  const consoleWarnings = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    } else if (msg.type() === 'warning') {
      consoleWarnings.push(msg.text());
    }
  });

  // Navigate through key pages to collect errors
  const testPages = ['/', '/states/alabama', '/alabama/dauphin-island', '/search?city=Pensacola&state=florida'];
  
  for (const testPage of testPages) {
    try {
      await page.goto(`${BASE_URL}${testPage}`, { waitUntil: 'networkidle2' });
      await page.waitForTimeout(1000); // Wait for any async operations
    } catch (error) {
      consoleErrors.push(`Navigation error for ${testPage}: ${error.message}`);
    }
  }

  addTestResult(device.name, 'Console Errors', consoleErrors.length === 0 ? 'pass' : 'fail', 
    consoleErrors.length === 0 ? 'No console errors found' : `Found ${consoleErrors.length} console errors`);

  if (consoleWarnings.length > 0) {
    addTestResult(device.name, 'Console Warnings', 'warning', 
      `Found ${consoleWarnings.length} console warnings`);
  }

  return { errors: consoleErrors, warnings: consoleWarnings };
}

// Main testing function
async function runTests() {
  console.log('🚀 Starting Automated Cross-Browser Testing...\n');
  console.log(`Testing against: ${BASE_URL}\n`);

  const browser = await puppeteer.launch({ 
    headless: false, // Set to true for headless mode
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  for (const device of DEVICES) {
    console.log(`\n📱 Testing on ${device.name}...`);
    
    const page = await browser.newPage();
    await page.setViewport(device.viewport);
    await page.setUserAgent(device.userAgent);

    // Test URL accessibility
    for (const testUrl of TEST_URLS) {
      await testUrlAccessibility(page, device, testUrl);
    }

    // Test responsive elements
    await testResponsiveElements(page, device);

    // Test search functionality
    await testSearchFunctionality(page, device);

    // Test back links
    await testBackLinks(page, device);

    // Test phone links
    await testPhoneLinks(page, device);

    // Test console errors
    await testConsoleErrors(page, device);

    await page.close();
  }

  await browser.close();

  // Generate test report
  generateTestReport();
}

// Generate comprehensive test report
function generateTestReport() {
  console.log('\n📊 TEST RESULTS SUMMARY');
  console.log('='.repeat(50));
  console.log(`✅ Passed: ${TEST_RESULTS.passed}`);
  console.log(`❌ Failed: ${TEST_RESULTS.failed}`);
  console.log(`⚠️  Warnings: ${TEST_RESULTS.warnings}`);
  console.log(`📈 Total Tests: ${TEST_RESULTS.tests.length}`);

  // Group results by device
  const resultsByDevice = {};
  TEST_RESULTS.tests.forEach(test => {
    if (!resultsByDevice[test.device]) {
      resultsByDevice[test.device] = { passed: 0, failed: 0, warnings: 0 };
    }
    resultsByDevice[test.device][test.status]++;
  });

  console.log('\n📱 RESULTS BY DEVICE:');
  console.log('-'.repeat(30));
  Object.entries(resultsByDevice).forEach(([device, results]) => {
    console.log(`${device}: ✅${results.passed} ❌${results.failed} ⚠️${results.warnings}`);
  });

  // Show failed tests
  const failedTests = TEST_RESULTS.tests.filter(test => test.status === 'fail');
  if (failedTests.length > 0) {
    console.log('\n❌ FAILED TESTS:');
    console.log('-'.repeat(20));
    failedTests.forEach(test => {
      console.log(`${test.device} - ${test.testName}: ${test.message}`);
    });
  }

  // Show warnings
  const warningTests = TEST_RESULTS.tests.filter(test => test.status === 'warning');
  if (warningTests.length > 0) {
    console.log('\n⚠️  WARNINGS:');
    console.log('-'.repeat(20));
    warningTests.forEach(test => {
      console.log(`${test.device} - ${test.testName}: ${test.message}`);
    });
  }

  // Save detailed report to file
  const reportData = {
    summary: {
      passed: TEST_RESULTS.passed,
      failed: TEST_RESULTS.failed,
      warnings: TEST_RESULTS.warnings,
      total: TEST_RESULTS.tests.length,
      timestamp: new Date().toISOString()
    },
    resultsByDevice,
    detailedResults: TEST_RESULTS.tests
  };

  const reportPath = path.join(__dirname, 'test-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
  console.log(`\n📄 Detailed report saved to: ${reportPath}`);

  // Generate HTML report
  generateHTMLReport(reportData);
}

// Generate HTML report
function generateHTMLReport(data) {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cross-Browser Test Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .summary-card { padding: 20px; border-radius: 8px; text-align: center; }
        .passed { background: #d4edda; color: #155724; }
        .failed { background: #f8d7da; color: #721c24; }
        .warnings { background: #fff3cd; color: #856404; }
        .device-results { margin-bottom: 30px; }
        .test-item { padding: 10px; margin: 5px 0; border-radius: 4px; border-left: 4px solid; }
        .test-pass { background: #d4edda; border-left-color: #28a745; }
        .test-fail { background: #f8d7da; border-left-color: #dc3545; }
        .test-warning { background: #fff3cd; border-left-color: #ffc107; }
        .timestamp { color: #666; font-size: 0.9em; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🌐 Cross-Browser Test Report</h1>
            <p class="timestamp">Generated: ${new Date(data.summary.timestamp).toLocaleString()}</p>
        </div>
        
        <div class="summary">
            <div class="summary-card passed">
                <h3>✅ Passed</h3>
                <h2>${data.summary.passed}</h2>
            </div>
            <div class="summary-card failed">
                <h3>❌ Failed</h3>
                <h2>${data.summary.failed}</h2>
            </div>
            <div class="summary-card warnings">
                <h3>⚠️ Warnings</h3>
                <h2>${data.summary.warnings}</h2>
            </div>
            <div class="summary-card">
                <h3>📊 Total Tests</h3>
                <h2>${data.summary.total}</h2>
            </div>
        </div>

        ${Object.entries(data.resultsByDevice).map(([device, results]) => `
        <div class="device-results">
            <h2>📱 ${device}</h2>
            <div class="summary">
                <div class="summary-card passed">✅ ${results.passed}</div>
                <div class="summary-card failed">❌ ${results.failed}</div>
                <div class="summary-card warnings">⚠️ ${results.warnings}</div>
            </div>
            ${data.detailedResults.filter(test => test.device === device).map(test => `
            <div class="test-item test-${test.status}">
                <strong>${test.testName}</strong><br>
                <span>${test.message}</span>
                ${test.details && Object.keys(test.details).length > 0 ? `<br><small>Details: ${JSON.stringify(test.details)}</small>` : ''}
            </div>
            `).join('')}
        </div>
        `).join('')}
    </div>
</body>
</html>`;

  const htmlPath = path.join(__dirname, 'test-report.html');
  fs.writeFileSync(htmlPath, html);
  console.log(`📄 HTML report saved to: ${htmlPath}`);
}

// Run the tests
runTests().catch(console.error);
