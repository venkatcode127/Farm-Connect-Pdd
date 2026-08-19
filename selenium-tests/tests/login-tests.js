const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

describe('FarmConnect Web Frontend - Login E2E Tests', function() {
    let driver;

    before(async function() {
        this.timeout(30000); // Set timeout to 30 seconds
        const chrome = require('selenium-webdriver/chrome');
        let options = new chrome.Options();
        options.addArguments('--headless', '--no-sandbox', '--disable-dev-shm-usage');
        
        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();
    });

    after(async function() {
        if (driver) {
            await driver.quit();
        }
    });

    beforeEach(async function() {
        // Clear local storage before each test to prevent state leakage
        await driver.get('http://127.0.0.1:3000');
        await driver.executeScript('window.localStorage.clear();');
    });

    it('should successfully login with valid credentials', async function() {
        // Option B: Seed localStorage with a valid normal user object first
        const testUser = {
            name: 'Test Farmer',
            phone: '9876543210',
            password: 'password123',
            role: 'farmer',
            location: 'India',
            registered: new Date().toISOString()
        };
        await driver.get('http://127.0.0.1:3000');
        await driver.executeScript(`window.localStorage.setItem('fc_users', JSON.stringify([arguments[0]]));`, testUser);
        
        // Navigate to login page again to load the fresh state
        await driver.get('http://127.0.0.1:3000');
        console.log("Navigated to:", await driver.getCurrentUrl());
        console.log("Page Title:", await driver.getTitle());
        
        // Find username and password fields and enter the seeded credentials
        const usernameField = await driver.findElement(By.id('loginPhone'));
        await usernameField.sendKeys('9876543210');
        
        const passwordField = await driver.findElement(By.id('loginPassword'));
        await passwordField.sendKeys('password123');
        
        // Click the login button
        const loginBtn = await driver.findElement(By.id('loginBtn'));
        await loginBtn.click();
        
        // Wait for user Profile to be visible on dashboard
        const profileElement = await driver.wait(until.elementLocated(By.id('userProfile')), 5000);
        assert.ok(await profileElement.isDisplayed());
    });

    it('should fail login with invalid credentials', async function() {
        await driver.get('http://127.0.0.1:3000');
        console.log("Navigated to:", await driver.getCurrentUrl());
        
        await driver.findElement(By.id('loginPhone')).sendKeys('9999999999');
        await driver.findElement(By.id('loginPassword')).sendKeys('wrongpass');
        await driver.findElement(By.id('loginBtn')).click();
        
        // Wait for error message
        const errorMsg = await driver.wait(until.elementLocated(By.id('loginError')), 5000);
        const text = await errorMsg.getText();
        assert.ok(text.includes('No account found') || text.includes('Incorrect password'));
    });

    it('should fail login with empty fields', async function() {
        await driver.get('http://127.0.0.1:3000');
        console.log("Navigated to:", await driver.getCurrentUrl());
        
        await driver.findElement(By.id('loginBtn')).click();
        
        // Should show validation error
        const errorMsg = await driver.wait(until.elementLocated(By.id('loginError')), 5000);
        assert.ok(await errorMsg.isDisplayed());
    });
});
