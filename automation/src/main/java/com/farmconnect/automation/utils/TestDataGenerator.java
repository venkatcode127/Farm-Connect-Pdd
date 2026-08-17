package com.farmconnect.automation.utils;

import org.testng.annotations.DataProvider;
import java.util.ArrayList;
import java.util.List;

public class TestDataGenerator {

    @DataProvider(name = "testCases", parallel = true)
    public static Object[][] getTestCases() {
        List<Object[]> cases = new ArrayList<>();
        
        addCases(cases, "Authentication", "TC_AUTH_", 40);
        addCases(cases, "Authorization", "TC_AUTHZ_", 30);
        addCases(cases, "Registration", "TC_REG_", 20);
        addCases(cases, "Profile Management", "TC_PROFILE_", 20);
        addCases(cases, "Navigation", "TC_NAV_", 30);
        addCases(cases, "Dashboard", "TC_DASH_", 20);
        addCases(cases, "Forms", "TC_FORM_", 40);
        addCases(cases, "CRUD Operations", "TC_CRUD_", 40);
        addCases(cases, "Search", "TC_SEARCH_", 20);
        addCases(cases, "Filters", "TC_FILTER_", 20);
        addCases(cases, "Input Validation", "TC_VAL_", 40);
        addCases(cases, "Error Handling", "TC_ERR_", 20);
        addCases(cases, "Session Management", "TC_SESS_", 20);
        addCases(cases, "Notifications", "TC_NOTIF_", 20);
        addCases(cases, "File Upload", "TC_FILE_", 20);
        addCases(cases, "Offline Handling", "TC_OFF_", 10);
        addCases(cases, "Accessibility", "TC_A11Y_", 20);
        addCases(cases, "Responsive UI", "TC_RESP_", 10);
        addCases(cases, "Performance Smoke Tests", "TC_PERF_", 20);
        addCases(cases, "Regression Suite", "TC_REGRESS_", 50);

        return cases.toArray(new Object[0][0]);
    }

    private static void addCases(List<Object[]> cases, String module, String prefix, int count) {
        for (int i = 1; i <= count; i++) {
            String testId = prefix + String.format("%03d", i);
            String testName = "Verify " + module + " functionality " + i;
            String priority = (i % 3 == 0) ? "High" : (i % 2 == 0 ? "Medium" : "Low");
            cases.add(new Object[]{testId, module, testName, priority});
        }
    }
}
