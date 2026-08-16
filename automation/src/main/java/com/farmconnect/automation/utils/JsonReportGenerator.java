package com.farmconnect.automation.utils;

import com.google.gson.*;
import java.io.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

/**
 * JsonReportGenerator - Generates JSON execution reports and Markdown summaries.
 */
public class JsonReportGenerator {

    private static final LogUtils log = LogUtils.getInstance();

    public static void generateJsonReport(List<Map<String, String>> results, String filePath) {
        try {
            new File(new File(filePath).getParent()).mkdirs();
            long total = results.size();
            long passed = results.stream().filter(t -> "PASS".equals(t.get("status"))).count();
            long failed = results.stream().filter(t -> "FAIL".equals(t.get("status"))).count();
            long skipped = results.stream().filter(t -> "SKIP".equals(t.get("status"))).count();
            long blocked = results.stream().filter(t -> "BLOCKED".equals(t.get("status"))).count();
            long executed = passed + failed;

            long totalDurationMs = 0;
            long criticalTotal = 0;
            long criticalFailed = 0;

            for (Map<String, String> tc : results) {
                try {
                    totalDurationMs += Long.parseLong(tc.getOrDefault("executionTime", "0"));
                } catch (Exception ignored) {}

                String priority = tc.getOrDefault("priority", "2");
                if ("1".equals(priority)) {
                    criticalTotal++;
                    if ("FAIL".equals(tc.get("status"))) {
                        criticalFailed++;
                    }
                }
            }

            double passRate = total > 0 ? Math.round(passed * 10000.0 / total) / 100.0 : 0;
            double failRate = total > 0 ? Math.round(failed * 10000.0 / total) / 100.0 : 0;
            double criticalFailRate = criticalTotal > 0 ? Math.round(criticalFailed * 10000.0 / criticalTotal) / 100.0 : 0;

            JsonObject root = new JsonObject();
            root.addProperty("reportTitle", "FarmConnect AI - E2E Automation Report");
            root.addProperty("generatedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            root.addProperty("framework", "Appium + TestNG");
            root.addProperty("platform", "Android");
            root.addProperty("androidVersion", "14 (API 34)");
            root.addProperty("device", "Android Emulator (API 34)");
            root.addProperty("appVersion", "1.0.0");
            root.addProperty("appPackage", "com.farmconnect.ai.debug");

            JsonObject summary = new JsonObject();
            summary.addProperty("totalTests", total);
            summary.addProperty("executed", executed);
            summary.addProperty("passed", passed);
            summary.addProperty("failed", failed);
            summary.addProperty("skipped", skipped);
            summary.addProperty("blocked", blocked);
            summary.addProperty("passRate", passRate);
            summary.addProperty("failRate", failRate);
            summary.addProperty("executionDurationMs", totalDurationMs);
            summary.addProperty("executionDurationSec", String.format("%.2f", totalDurationMs / 1000.0));
            summary.addProperty("criticalTotal", criticalTotal);
            summary.addProperty("criticalFailed", criticalFailed);
            summary.addProperty("criticalFailRate", criticalFailRate);
            summary.addProperty("qualityGatePassed", passRate >= 95.0 && criticalFailRate <= 5.0);
            root.add("summary", summary);

            JsonArray testArray = new JsonArray();
            for (Map<String, String> tc : results) {
                JsonObject obj = new JsonObject();
                tc.forEach(obj::addProperty);
                testArray.add(obj);
            }
            root.add("testResults", testArray);

            Gson gson = new GsonBuilder().setPrettyPrinting().create();
            try (Writer writer = new FileWriter(filePath)) { gson.toJson(root, writer); }
            log.info("JSON report generated: " + filePath);
        } catch (Exception e) {
            log.error("Failed to generate JSON report: " + e.getMessage());
        }
    }

    public static void generateMarkdownSummary(List<Map<String, String>> results, String filePath) {
        try {
            new File(new File(filePath).getParent()).mkdirs();
            long total = results.size();
            long passed = results.stream().filter(t -> "PASS".equals(t.get("status"))).count();
            long failed = results.stream().filter(t -> "FAIL".equals(t.get("status"))).count();
            long skipped = results.stream().filter(t -> "SKIP".equals(t.get("status"))).count();
            long blocked = results.stream().filter(t -> "BLOCKED".equals(t.get("status"))).count();
            long executed = passed + failed;

            long totalDurationMs = 0;
            long criticalTotal = 0;
            long criticalFailed = 0;

            for (Map<String, String> tc : results) {
                try {
                    totalDurationMs += Long.parseLong(tc.getOrDefault("executionTime", "0"));
                } catch (Exception ignored) {}

                String priority = tc.getOrDefault("priority", "2");
                if ("1".equals(priority)) {
                    criticalTotal++;
                    if ("FAIL".equals(tc.get("status"))) {
                        criticalFailed++;
                    }
                }
            }

            double passRate = total > 0 ? (passed * 100.0 / total) : 0;
            double failRate = total > 0 ? (failed * 100.0 / total) : 0;
            double criticalFailRate = criticalTotal > 0 ? (criticalFailed * 100.0 / criticalTotal) : 0;
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

            StringBuilder md = new StringBuilder();
            md.append("# 🌾 FarmConnect AI - E2E Execution Summary\n\n");
            md.append("**Generated:** ").append(timestamp).append("\n\n");
            md.append("## Execution Metrics\n\n");
            md.append("| Metric | Value |\n|--------|-------|\n");
            md.append("| Total Test Cases | ").append(total).append(" |\n");
            md.append("| Executed | ").append(executed).append(" |\n");
            md.append("| ✅ Passed | ").append(passed).append(" |\n");
            md.append("| ❌ Failed | ").append(failed).append(" |\n");
            md.append("| ⏭️ Skipped | ").append(skipped).append(" |\n");
            md.append("| 🚫 Blocked | ").append(blocked).append(" |\n");
            md.append("| 📈 Pass Rate | ").append(String.format("%.2f%%", passRate)).append(" |\n");
            md.append("| 📉 Fail Rate | ").append(String.format("%.2f%%", failRate)).append(" |\n");
            md.append("| ⏱️ Execution Duration | ").append(String.format("%.2fs (%d ms)", totalDurationMs / 1000.0, totalDurationMs)).append(" |\n");
            md.append("| 🎯 Critical Pass Rate | ").append(String.format("%.2f%% (Failed: %d/%d)", 100.0 - criticalFailRate, criticalFailed, criticalTotal)).append(" |\n");
            md.append("| 🚦 Quality Gate | ").append(passRate >= 95.0 && criticalFailRate <= 5.0 ? "✅ PASSED" : "❌ FAILED").append(" |\n\n");

            md.append("## Environment\n\n");
            md.append("| Property | Value |\n|----------|-------|\n");
            md.append("| Platform | Android 14 (API 34) |\n");
            md.append("| Device | Android Emulator (API 34) |\n");
            md.append("| App Version | 1.0.0 |\n");
            md.append("| Package | com.farmconnect.ai.debug |\n");
            md.append("| Framework | Appium 9.1 + TestNG 7.9 |\n\n");

            // Passed tests
            md.append("## ✅ Passed Tests (").append(passed).append(")\n\n");
            for (Map<String, String> tc : results) {
                if ("PASS".equals(tc.get("status"))) {
                    md.append("- ✓ **").append(tc.getOrDefault("testId", "")).append("** - `").append(tc.getOrDefault("testName", "")).append("` (").append(tc.getOrDefault("module", "")).append(", ").append(tc.getOrDefault("executionTime", "0")).append("ms)\n");
                }
            }

            // Failed tests
            md.append("\n## ❌ Failed Tests (").append(failed).append(")\n\n");
            if (failed == 0) {
                md.append("*No failed tests.*\n");
            } else {
                for (Map<String, String> tc : results) {
                    if ("FAIL".equals(tc.get("status"))) {
                        md.append("- ✗ **").append(tc.getOrDefault("testId", "")).append("** - `").append(tc.getOrDefault("testName", "")).append("` (").append(tc.getOrDefault("module", "")).append(")\n");
                        md.append("  - **Reason:** `").append(tc.getOrDefault("failureReason", "Unknown")).append("`\n");
                    }
                }
            }

            // Skipped tests
            md.append("\n## ⏭️ Skipped Tests (").append(skipped).append(")\n\n");
            if (skipped == 0) {
                md.append("*No skipped tests.*\n");
            } else {
                for (Map<String, String> tc : results) {
                    if ("SKIP".equals(tc.get("status"))) {
                        md.append("- ⊘ **").append(tc.getOrDefault("testId", "")).append("** - `").append(tc.getOrDefault("testName", "")).append("` (").append(tc.getOrDefault("module", "")).append(")\n");
                        md.append("  - **Reason:** `").append(tc.getOrDefault("failureReason", "Skipped")).append("`\n");
                    }
                }
            }

            try (Writer writer = new FileWriter(filePath)) { writer.write(md.toString()); }
            log.info("Markdown summary generated: " + filePath);
        } catch (Exception e) {
            log.error("Failed to generate Markdown summary: " + e.getMessage());
        }
    }
}
