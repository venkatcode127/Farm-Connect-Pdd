const wdio = require('webdriverio');
const assert = require('assert');

const opts = {
    path: '/wd/hub',
    port: 4723,
    capabilities: {
        platformName: "Android",
        platformVersion: "11",
        deviceName: "Android Emulator",
        app: "/path/to/app-debug.apk",
        appPackage: "com.farmconnect",
        appActivity: "com.farmconnect.MainActivity",
        automationName: "UiAutomator2"
    }
};

describe('FarmConnect Appium Mobile E2E Tests', function () {
    let client;

    before(async function () {
        this.timeout(60000); // Booting emulator and app takes time
        client = await wdio.remote(opts);
    });

    after(async function () {
        if (client) {
            await client.deleteSession();
        }
    });

    it('should login with valid credentials', async function () {
        // Find username field
        const usernameField = await client.$('~username_input');
        await usernameField.waitForDisplayed({ timeout: 5000 });
        await usernameField.setValue('admin');

        // Find password field
        const passwordField = await client.$('~password_input');
        await passwordField.setValue('password123');

        // Click login button
        const loginBtn = await client.$('~login_button');
        await loginBtn.click();

        // Verify successful login by checking dashboard element
        const dashboardElement = await client.$('~dashboard_screen');
        await dashboardElement.waitForDisplayed({ timeout: 10000 });
        const isDisplayed = await dashboardElement.isDisplayed();
        assert.ok(isDisplayed);
    });

    it('should fail login with invalid credentials', async function () {
        // Reset App for clean state (Optional based on framework setup)
        await client.reset();

        const usernameField = await client.$('~username_input');
        await usernameField.waitForDisplayed({ timeout: 5000 });
        await usernameField.setValue('wronguser');

        const passwordField = await client.$('~password_input');
        await passwordField.setValue('wrongpass');

        const loginBtn = await client.$('~login_button');
        await loginBtn.click();

        // Verify error message toast/element
        const errorMsg = await client.$('~error_message_text');
        await errorMsg.waitForDisplayed({ timeout: 5000 });
        const text = await errorMsg.getText();
        assert.strictEqual(text, 'Invalid credentials provided');
    });
});
