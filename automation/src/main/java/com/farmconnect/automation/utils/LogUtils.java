package com.farmconnect.automation.utils;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * LogUtils - Centralized logging utility.
 */
public class LogUtils {

    private static LogUtils instance;
    private static final Logger logger = LogManager.getLogger("FarmConnectAutomation");
    private static final String LOG_DIR = "test-output/logs";
    private static PrintWriter fileWriter;

    static {
        try {
            new File(LOG_DIR).mkdirs();
            String logFile = LOG_DIR + "/automation_" +
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")) + ".log";
            fileWriter = new PrintWriter(new BufferedWriter(new FileWriter(logFile, true)));
        } catch (Exception e) {
            System.err.println("Could not initialize log file: " + e.getMessage());
        }
    }

    private LogUtils() {}

    public static LogUtils getInstance() {
        if (instance == null) {
            instance = new LogUtils();
        }
        return instance;
    }

    private void writeToFile(String level, String message) {
        if (fileWriter != null) {
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSS"));
            fileWriter.println(String.format("[%s] [%s] %s", timestamp, level, message));
            fileWriter.flush();
        }
    }

    public void info(String message) {
        logger.info(message);
        writeToFile("INFO", message);
    }

    public void warn(String message) {
        logger.warn(message);
        writeToFile("WARN", message);
    }

    public void error(String message) {
        logger.error(message);
        writeToFile("ERROR", message);
    }

    public void error(String message, Throwable throwable) {
        logger.error(message, throwable);
        writeToFile("ERROR", message + " | " + throwable.getMessage());
    }

    public void debug(String message) {
        logger.debug(message);
        writeToFile("DEBUG", message);
    }
}
