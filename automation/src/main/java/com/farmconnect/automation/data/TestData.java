package com.farmconnect.automation.data;

/** TestData - Common test data constants. */
public class TestData {
    // Admin credentials
    public static final String ADMIN_PHONE = "9347815378";
    public static final String ADMIN_PASSWORD = "FARMERuse9347@";

    // Test user credentials
    public static final String TEST_USER_PHONE = "9876543210";
    public static final String TEST_USER_PASSWORD = "test1234";
    public static final String TEST_USER_NAME = "Test Farmer";
    public static final String TEST_USER_ROLE = "farmer";
    public static final String TEST_USER_LOCATION = "Hyderabad, Telangana";

    // Additional test users
    public static final String BUYER_PHONE = "8765432109";
    public static final String BUYER_PASSWORD = "buyer1234";
    public static final String BUYER_NAME = "Test Buyer";
    public static final String BUYER_ROLE = "buyer";

    public static final String TRADER_PHONE = "7654321098";
    public static final String TRADER_PASSWORD = "trader1234";
    public static final String TRADER_NAME = "Test Trader";
    public static final String TRADER_ROLE = "trader";

    // Invalid data
    public static final String INVALID_PHONE_SHORT = "12345";
    public static final String INVALID_PHONE_LETTERS = "abcdefghij";
    public static final String INVALID_PHONE_SPECIAL = "!@#$%^&*()";
    public static final String INVALID_PHONE_SPACE = "987 654 321";
    public static final String UNREGISTERED_PHONE = "9999999999";
    public static final String WRONG_PASSWORD = "wrongpass";
    public static final String SHORT_PASSWORD = "ab";
    public static final String EMPTY_STRING = "";
    public static final String SQL_INJECTION = "' OR 1=1 --";
    public static final String XSS_PAYLOAD = "<script>alert('xss')</script>";
    public static final String LONG_STRING = "a".repeat(500);

    // Valid registration data
    public static final String VALID_NAME = "Rajesh Kumar";
    public static final String VALID_PHONE = "9123456789";
    public static final String VALID_PASSWORD = "secure1234";
    public static final String VALID_LOCATION = "Delhi, India";

    // Crop & market data
    public static final String CROP_WHEAT = "wheat";
    public static final String CROP_RICE = "rice";
    public static final String CROP_TOMATO = "tomato";
    public static final String MARKET_DELHI = "delhi";
    public static final String MARKET_MUMBAI = "mumbai";

    // Sections
    public static final String SECTION_DASHBOARD = "dashboard";
    public static final String SECTION_PREDICTION = "prediction";
    public static final String SECTION_MARKET = "market";
    public static final String SECTION_MARKETPLACE = "marketplace";
    public static final String SECTION_ORDERS = "orders";
    public static final String SECTION_WEATHER = "weather";
    public static final String SECTION_ANALYTICS = "analytics";
}
