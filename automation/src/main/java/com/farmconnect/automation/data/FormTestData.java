package com.farmconnect.automation.data;

/** FormTestData - Form and validation specific test data. */
public class FormTestData {
    public static final String[] VALID_NAMES = {"Rajesh Kumar", "Priya Sharma", "Amit Singh", "Sunita Devi", "Manoj Reddy"};
    public static final String[] INVALID_NAMES = {"", "AB", "123Name", "Name@#$", "A".repeat(100)};
    public static final String[] VALID_LOCATIONS = {"Delhi, India", "Mumbai, Maharashtra", "Hyderabad, Telangana", "Bengaluru, Karnataka"};
    public static final String[] VALID_INDIAN_PHONES = {"9876543210", "8765432109", "7654321098", "6543210987"};
    public static final String[] INVALID_INDIAN_PHONES = {"1234567890", "0987654321", "5432109876", "abcdefghij"};
    public static final String[] CROP_NAMES = {"Wheat", "Rice", "Tomato", "Onion", "Potato", "Cotton", "Sugarcane"};
    public static final String[] QUANTITY_VALUES = {"10", "50", "100", "500", "1000"};
    public static final String[] PRICE_VALUES = {"100", "500", "1000", "5000", "10000"};

    public static final String[][] SELL_FORM_DATA = {
        {"Wheat", "100", "2500", "Delhi Mandi"},
        {"Rice", "50", "3500", "Mumbai Mandi"},
        {"Tomato", "200", "800", "Hyderabad Mandi"}
    };
}
