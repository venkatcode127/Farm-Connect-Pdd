package com.farmconnect.automation.data;

/** AuthTestData - Authentication-specific test data. */
public class AuthTestData {
    public static final String[][] VALID_LOGINS = {
        {"9347815378", "FARMERuse9347@", "Admin"},
        {"9876543210", "test1234", "Test Farmer"}
    };

    public static final String[][] INVALID_PHONES = {
        {"", "Empty phone"},
        {"12345", "Short phone (5 digits)"},
        {"abcdefghij", "Alphabetic phone"},
        {"!@#$%^&*()", "Special chars phone"},
        {"123456789012345", "Too long phone"},
        {"0000000000", "Starts with 0"},
        {"1234567890", "Starts with 1"}
    };

    public static final String[][] INVALID_PASSWORDS = {
        {"", "Empty password"},
        {"ab", "Too short password"},
        {"   ", "Whitespace only"}
    };

    public static final String[][] REGISTRATION_DATA = {
        {"Amit Sharma", "9111111111", "pass1234", "farmer", "Pune, Maharashtra"},
        {"Priya Devi", "9222222222", "pass5678", "buyer", "Chennai, Tamil Nadu"},
        {"Suresh Reddy", "9333333333", "pass9012", "trader", "Vizag, Andhra Pradesh"}
    };
}
