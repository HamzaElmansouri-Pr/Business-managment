import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const screensDir = path.join(__dirname, 'public', 'screenshots');

if (!fs.existsSync(screensDir)) {
  fs.mkdirSync(screensDir, { recursive: true });
}

(async () => {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  
  console.log("Navigating to login...");
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0' });
  
  await page.screenshot({ path: path.join(screensDir, 'login.png') });
  console.log("Screenshot: login.png");
  
  // Login
  console.log("Logging in...");
  // Email is already pre-filled in the frontend!
  await page.type('input[type="password"]', 'password');
  await page.click('button[type="submit"]');
  
  // Next.js uses client-side routing, so we wait for the main layout instead of navigation
  try {
    await page.waitForSelector('main', { timeout: 10000 });
    await new Promise(r => setTimeout(r, 2000)); // wait for network calls to finish
    await page.screenshot({ path: path.join(screensDir, 'dashboard.png') });
    console.log("Screenshot: dashboard.png");
  } catch (e) {
    console.error("Failed to login or load dashboard");
    await page.screenshot({ path: path.join(screensDir, 'error-dashboard.png') });
    throw e;
  }
  
  // Customers page
  console.log("Navigating to Customers...");
  await page.goto('http://localhost:3000/customers', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(screensDir, 'customers.png') });
  console.log("Screenshot: customers.png");
  
  // Products page
  console.log("Navigating to Products...");
  await page.goto('http://localhost:3000/products', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(screensDir, 'products.png') });
  console.log("Screenshot: products.png");
  
  // Orders page
  console.log("Navigating to Orders...");
  await page.goto('http://localhost:3000/orders', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(screensDir, 'orders.png') });
  console.log("Screenshot: orders.png");

  // Order Details
  console.log("Finding an order to detail...");
  const hasOrders = await page.$('tbody tr');
  if (hasOrders) {
    await page.click('tbody tr:first-child');
    await page.waitForSelector('h2', { timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: path.join(screensDir, 'order-detail.png') });
    console.log("Screenshot: order-detail.png");
  } else {
    console.log("No orders found to screenshot detail view.");
  }
  
  await browser.close();
  console.log("Done!");
})();
