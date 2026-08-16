package com.farmconnect.automation.constants;

/** AppConstants - Application-wide constants. */
public class AppConstants {
    public static final String APP_NAME = "FarmConnect AI";
    public static final String APP_PACKAGE = "com.farmconnect.ai.debug";
    public static final String APP_ACTIVITY = "com.farmconnect.ai.MainActivity";
    public static final String APP_VERSION = "1.0.0";
    public static final int IMPLICIT_WAIT = 15;
    public static final int EXPLICIT_WAIT = 30;
    public static final int PAGE_LOAD_TIMEOUT = 60;
    public static final String WEBVIEW_CONTEXT_PREFIX = "WEBVIEW_";
    public static final String NATIVE_CONTEXT = "NATIVE_APP";

    // Sections
    public static final String[] ALL_SECTIONS = {"dashboard", "prediction", "market", "marketplace", "orders", "weather", "analytics"};

    // Roles
    public static final String ROLE_FARMER = "farmer";
    public static final String ROLE_BUYER = "buyer";
    public static final String ROLE_TRADER = "trader";
    public static final String ROLE_ADMIN = "admin";
}
