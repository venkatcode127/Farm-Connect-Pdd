package com.farmconnect.automation.utils;

import java.io.FileInputStream;
import java.util.Properties;

/**
 * TestDataUtils - Loads and manages test data.
 */
public class TestDataUtils {

    private static Properties testData;

    static {
        testData = new Properties();
        try {
            testData.load(new FileInputStream("config/test-config.properties"));
        } catch (Exception e) {
            System.err.println("Could not load test data: " + e.getMessage());
        }
    }

    public static String get(String key) { return testData.getProperty(key, ""); }
    public static String get(String key, String defaultValue) { return testData.getProperty(key, defaultValue); }
    public static String getAdminPhone() { return get("test.admin.phone", "9347815378"); }
    public static String getAdminPassword() { return get("test.admin.password", "FARMERuse9347@"); }
    public static String getTestUserPhone() { return get("test.user.phone", "9876543210"); }
    public static String getTestUserPassword() { return get("test.user.password", "test1234"); }
    public static String getTestUserName() { return get("test.user.name", "Test Farmer"); }
    public static String getTestUserRole() { return get("test.user.role", "farmer"); }
    public static String getTestUserLocation() { return get("test.user.location", "Hyderabad, Telangana"); }
}
