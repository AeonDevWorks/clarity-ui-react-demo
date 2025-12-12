"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBrowser = getBrowser;
exports.closeBrowser = closeBrowser;
exports.fetchPage = fetchPage;
const playwright_1 = require("playwright");
let browserInstance = null;
async function getBrowser() {
    if (!browserInstance) {
        browserInstance = await playwright_1.chromium.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
    }
    return browserInstance;
}
async function closeBrowser() {
    if (browserInstance) {
        await browserInstance.close();
        browserInstance = null;
    }
}
async function fetchPage(url, waitForSelector) {
    const browser = await getBrowser();
    const page = await browser.newPage();
    try {
        await page.setViewportSize({ width: 1280, height: 720 });
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        // Optional: wait for a specific selector if provided to ensure hydration
        if (waitForSelector) {
            try {
                await page.waitForSelector(waitForSelector, { timeout: 5000 });
            }
            catch (e) {
                console.warn(`Timeout waiting for selector ${waitForSelector}`);
            }
        }
        else {
            // Evaluate a small sleep to allow basic hydration for SPA
            await page.waitForTimeout(2000);
        }
        const title = await page.title();
        // Get HTML (outerHTML of document element)
        const html = await page.content();
        // Get Screenshot
        const buffer = await page.screenshot({ fullPage: false, type: 'jpeg', quality: 80 });
        const screenshot = buffer.toString('base64');
        return { title, html, screenshot };
    }
    finally {
        await page.close();
    }
}
