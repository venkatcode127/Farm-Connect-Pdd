package com.farmconnect.automation.base;

import com.farmconnect.automation.utils.LogUtils;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;

/**
 * AppiumServerManager - Manages Appium server lifecycle.
 * Starts and stops the Appium server programmatically for CI/CD environments.
 */
public class AppiumServerManager {

    private static final LogUtils log = LogUtils.getInstance();
    private static Process appiumProcess;

    /**
     * Start Appium server.
     */
    public static void startServer(String host, int port) {
        try {
            if (isServerRunning(host, port)) {
                log.info("Appium server already running on " + host + ":" + port);
                return;
            }

            String command = String.format("appium --address %s --port %d --relaxed-security --log-timestamp", host, port);
            log.info("Starting Appium server: " + command);

            ProcessBuilder pb = new ProcessBuilder();
            String os = System.getProperty("os.name").toLowerCase();
            if (os.contains("win")) {
                pb.command("cmd", "/c", command);
            } else {
                pb.command("bash", "-c", command);
            }

            pb.redirectErrorStream(true);
            appiumProcess = pb.start();

            // Wait for server to be ready
            int maxRetries = 30;
            int retryCount = 0;
            while (retryCount < maxRetries) {
                Thread.sleep(2000);
                if (isServerRunning(host, port)) {
                    log.info("Appium server started successfully on " + host + ":" + port);
                    return;
                }
                retryCount++;
                log.info("Waiting for Appium server... (" + retryCount + "/" + maxRetries + ")");
            }

            throw new RuntimeException("Appium server failed to start within timeout");

        } catch (Exception e) {
            log.error("Failed to start Appium server: " + e.getMessage());
            throw new RuntimeException(e);
        }
    }

    /**
     * Stop Appium server.
     */
    public static void stopServer() {
        try {
            if (appiumProcess != null) {
                appiumProcess.destroyForcibly();
                appiumProcess.waitFor();
                log.info("Appium server stopped");
            }
        } catch (Exception e) {
            log.warn("Error stopping Appium server: " + e.getMessage());
        }
    }

    /**
     * Check if Appium server is running.
     */
    public static boolean isServerRunning(String host, int port) {
        try {
            URL url = new URL(String.format("http://%s:%d/status", host, port));
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setConnectTimeout(5000);
            conn.setReadTimeout(5000);
            int responseCode = conn.getResponseCode();
            conn.disconnect();
            return responseCode == 200;
        } catch (Exception e) {
            return false;
        }
    }
}
