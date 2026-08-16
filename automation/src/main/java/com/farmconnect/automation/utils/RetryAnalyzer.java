package com.farmconnect.automation.utils;

import org.testng.IRetryAnalyzer;
import org.testng.ITestResult;

/**
 * RetryAnalyzer - Retries failed tests up to MAX_RETRY_COUNT times.
 */
public class RetryAnalyzer implements IRetryAnalyzer {

    private int retryCount = 0;
    private static final int MAX_RETRY_COUNT = 2;

    @Override
    public boolean retry(ITestResult result) {
        if (retryCount < MAX_RETRY_COUNT) {
            retryCount++;
            LogUtils.getInstance().info("Retrying test: " + result.getName() + " | Attempt: " + retryCount);
            return true;
        }
        return false;
    }
}
