const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const http = require('http');

const CHROME_PATH = fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
  ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  : 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const OUT_DIR = path.resolve(__dirname, 'docs', 'screenshots');
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

function loginApi(email, password) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ email, password });
    const req = http.request({
      hostname: 'localhost',
      port: 8080,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch(e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function capture() {
  console.log('Authenticating users via API...');
  const adminAuth = await loginApi('admin@shopsphere.com', 'Admin@123');
  const custAuth = await loginApi('customer@shopsphere.com', 'Customer@123');

  console.log('Launching browser with:', CHROME_PATH);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1366,850']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 850 });

  // 1. Home Page
  console.log('1. Capturing Home Page...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(OUT_DIR, '01_home_page.png') });

  // 2. Product Catalog
  console.log('2. Capturing Product Catalog...');
  await page.goto('http://localhost:5173/products', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(OUT_DIR, '02_catalog_search.png') });

  // 3. Product Details
  console.log('3. Capturing Product Details...');
  await page.goto('http://localhost:5173/products/1', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(OUT_DIR, '03_product_details.png') });

  // 4. Cart Page with Customer Login
  console.log('4. Logging in as Customer for Cart & Orders...');
  await page.evaluate((auth) => {
    localStorage.setItem('token', auth.token);
    localStorage.setItem('user', JSON.stringify({
      id: auth.id,
      firstName: auth.firstName,
      lastName: auth.lastName,
      email: auth.email,
      roles: auth.roles
    }));
  }, custAuth);

  // Add item 1 to cart via API or navigate
  await page.goto('http://localhost:5173/cart', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(OUT_DIR, '04_cart_page.png') });

  // 5. Orders History
  console.log('5. Capturing Customer Orders History...');
  await page.goto('http://localhost:5173/orders', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(OUT_DIR, '05_customer_orders.png') });

  // 6. Admin Login & Dashboard
  console.log('6. Switching to Admin...');
  await page.evaluate((auth) => {
    localStorage.setItem('token', auth.token);
    localStorage.setItem('user', JSON.stringify({
      id: auth.id,
      firstName: auth.firstName,
      lastName: auth.lastName,
      email: auth.email,
      roles: auth.roles
    }));
  }, adminAuth);

  console.log('7. Capturing Admin Dashboard...');
  await page.goto('http://localhost:5173/admin', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2500));
  await page.screenshot({ path: path.join(OUT_DIR, '06_admin_dashboard.png') });

  console.log('8. Capturing Admin Products...');
  await page.goto('http://localhost:5173/admin/products', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(OUT_DIR, '07_admin_products.png') });

  console.log('9. Capturing Admin Orders...');
  await page.goto('http://localhost:5173/admin/orders', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(OUT_DIR, '08_admin_orders.png') });

  console.log('10. Capturing Admin Inventory...');
  await page.goto('http://localhost:5173/admin/inventory', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(OUT_DIR, '09_admin_inventory.png') });

  await browser.close();
  console.log('All screenshots captured successfully!');
}

capture().catch(err => {
  console.error('Capture error:', err);
  process.exit(1);
});
