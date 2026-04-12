const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
require('chromedriver');

async function openSite() {
    let options = new chrome.Options();
    // Use headless mode because we are likely in a CI/Server environment
    options.addArguments('--headless');
    options.addArguments('--disable-gpu');
    options.addArguments('--no-sandbox');
    options.addArguments('--window-size=1920,1080');

    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    try {
        console.log('Navigating to https://heritage-hubs.vercel.app...');
        await driver.get('https://heritage-hubs.vercel.app');
        
        const title = await driver.getTitle();
        console.log('Page Title:', title);

        const url = await driver.getCurrentUrl();
        console.log('Current URL:', url);

        // Take a screenshot to prove it worked
        const screenshot = await driver.takeScreenshot();
        const fs = require('fs');
        fs.writeFileSync('tools/site_screenshot.png', screenshot, 'base64');
        console.log('Screenshot saved to tools/site_screenshot.png');

    } catch (error) {
        console.error('Error occurred:', error);
    } finally {
        await driver.quit();
    }
}

openSite();
