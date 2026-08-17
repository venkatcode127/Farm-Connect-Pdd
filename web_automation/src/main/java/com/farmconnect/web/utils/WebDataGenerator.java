package com.farmconnect.web.utils;

import org.testng.annotations.DataProvider;
import java.util.ArrayList;
import java.util.List;

public class WebDataGenerator {

    @DataProvider(name = "webTestCases", parallel = true)
    public static Object[][] getTestCases() {
        List<Object[]> cases = new ArrayList<>();
        
        // Generate 350 test cases for various buttons and workflows
        String[] components = {"Login", "Dashboard", "Profile", "Orders", "Settings", "Checkout", "Cart"};
        String[] actions = {"Submit", "Cancel", "Edit", "Delete", "Refresh", "Navigate", "Search"};

        int id = 1;
        for (int i = 0; i < 50; i++) {
            for (String component : components) {
                String action = actions[i % actions.length];
                boolean multiTab = (id % 5 == 0); // Every 5th test verifies multiple tabs
                cases.add(new Object[]{"TC_WEB_" + String.format("%03d", id), component, action, multiTab});
                id++;
                if (id > 350) break;
            }
            if (id > 350) break;
        }

        return cases.toArray(new Object[0][0]);
    }
}
