package com.farmconnect.automation.utils;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;

import java.io.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

/**
 * ExcelReportGenerator - Generates comprehensive Excel test reports using Apache POI.
 * Creates multi-sheet workbooks with formatted results, metrics, and summaries.
 */
public class ExcelReportGenerator {

    private static final LogUtils log = LogUtils.getInstance();

    public static void generateReports(List<Map<String, String>> testResults, String outputDir) {
        new File(outputDir).mkdirs();
        try {
            generateMainReport(testResults, outputDir + "/Automation_Test_Report.xlsx");
            generateFilteredReport(testResults, "PASS", outputDir + "/Passed_Test_Cases.xlsx");
            generateFilteredReport(testResults, "FAIL", outputDir + "/Failed_Test_Cases.xlsx");
            generateSummaryReport(testResults, outputDir + "/Execution_Summary.xlsx");
            log.info("Excel reports generated in: " + outputDir);
        } catch (Exception e) {
            log.error("Failed to generate Excel reports: " + e.getMessage());
        }
    }

    private static void generateMainReport(List<Map<String, String>> results, String filePath) throws IOException {
        XSSFWorkbook workbook = new XSSFWorkbook();

        // Styles
        CellStyle headerStyle = createHeaderStyle(workbook);
        CellStyle passStyle = createStatusStyle(workbook, IndexedColors.GREEN);
        CellStyle failStyle = createStatusStyle(workbook, IndexedColors.RED);
        CellStyle skipStyle = createStatusStyle(workbook, IndexedColors.ORANGE);
        CellStyle defaultStyle = createDefaultStyle(workbook);

        // Sheet 1: All Executed Test Cases
        XSSFSheet sheet1 = workbook.createSheet("Executed Test Cases");
        String[] headers = {"Test ID", "Module", "Test Name", "Priority", "Status", "Execution Time (ms)", "Failure Reason"};
        createHeaderRow(sheet1, headers, headerStyle);
        int rowIdx = 1;
        for (Map<String, String> tc : results) {
            Row row = sheet1.createRow(rowIdx++);
            createCell(row, 0, tc.getOrDefault("testId", ""), defaultStyle);
            createCell(row, 1, tc.getOrDefault("module", ""), defaultStyle);
            createCell(row, 2, tc.getOrDefault("testName", ""), defaultStyle);
            createCell(row, 3, tc.getOrDefault("priority", ""), defaultStyle);
            String status = tc.getOrDefault("status", "UNKNOWN");
            CellStyle statusCellStyle = "PASS".equals(status) ? passStyle : "FAIL".equals(status) ? failStyle : skipStyle;
            createCell(row, 4, status, statusCellStyle);
            createCell(row, 5, tc.getOrDefault("executionTime", "0"), defaultStyle);
            createCell(row, 6, tc.getOrDefault("failureReason", ""), defaultStyle);
        }
        autoSizeColumns(sheet1, headers.length);

        // Sheet 2: Passed Tests
        XSSFSheet sheet2 = workbook.createSheet("Passed Tests");
        createHeaderRow(sheet2, headers, headerStyle);
        rowIdx = 1;
        for (Map<String, String> tc : results) {
            if ("PASS".equals(tc.get("status"))) {
                Row row = sheet2.createRow(rowIdx++);
                createCell(row, 0, tc.getOrDefault("testId", ""), defaultStyle);
                createCell(row, 1, tc.getOrDefault("module", ""), defaultStyle);
                createCell(row, 2, tc.getOrDefault("testName", ""), defaultStyle);
                createCell(row, 3, tc.getOrDefault("priority", ""), defaultStyle);
                createCell(row, 4, "PASS", passStyle);
                createCell(row, 5, tc.getOrDefault("executionTime", "0"), defaultStyle);
                createCell(row, 6, "", defaultStyle);
            }
        }
        autoSizeColumns(sheet2, headers.length);

        // Sheet 3: Failed Tests
        XSSFSheet sheet3 = workbook.createSheet("Failed Tests");
        createHeaderRow(sheet3, headers, headerStyle);
        rowIdx = 1;
        for (Map<String, String> tc : results) {
            if ("FAIL".equals(tc.get("status"))) {
                Row row = sheet3.createRow(rowIdx++);
                createCell(row, 0, tc.getOrDefault("testId", ""), defaultStyle);
                createCell(row, 1, tc.getOrDefault("module", ""), defaultStyle);
                createCell(row, 2, tc.getOrDefault("testName", ""), defaultStyle);
                createCell(row, 3, tc.getOrDefault("priority", ""), defaultStyle);
                createCell(row, 4, "FAIL", failStyle);
                createCell(row, 5, tc.getOrDefault("executionTime", "0"), defaultStyle);
                createCell(row, 6, tc.getOrDefault("failureReason", ""), defaultStyle);
            }
        }
        autoSizeColumns(sheet3, headers.length);

        // Sheet 4: Skipped Tests
        XSSFSheet sheet4 = workbook.createSheet("Skipped Tests");
        createHeaderRow(sheet4, headers, headerStyle);
        rowIdx = 1;
        for (Map<String, String> tc : results) {
            if ("SKIP".equals(tc.get("status"))) {
                Row row = sheet4.createRow(rowIdx++);
                createCell(row, 0, tc.getOrDefault("testId", ""), defaultStyle);
                createCell(row, 1, tc.getOrDefault("module", ""), defaultStyle);
                createCell(row, 2, tc.getOrDefault("testName", ""), defaultStyle);
                createCell(row, 3, tc.getOrDefault("priority", ""), defaultStyle);
                createCell(row, 4, "SKIP", skipStyle);
                createCell(row, 5, tc.getOrDefault("executionTime", "0"), defaultStyle);
                createCell(row, 6, tc.getOrDefault("failureReason", ""), defaultStyle);
            }
        }
        autoSizeColumns(sheet4, headers.length);

        // Sheet 5: Execution Metrics
        XSSFSheet sheet5 = workbook.createSheet("Execution Metrics");
        long totalTests = results.size();
        long passed = results.stream().filter(t -> "PASS".equals(t.get("status"))).count();
        long failed = results.stream().filter(t -> "FAIL".equals(t.get("status"))).count();
        long skipped = results.stream().filter(t -> "SKIP".equals(t.get("status"))).count();
        double passRate = totalTests > 0 ? (passed * 100.0 / totalTests) : 0;

        String[] metricsHeaders = {"Metric", "Value"};
        createHeaderRow(sheet5, metricsHeaders, headerStyle);
        String[][] metrics = {
            {"Total Test Cases", String.valueOf(totalTests)},
            {"Executed", String.valueOf(totalTests)},
            {"Passed", String.valueOf(passed)},
            {"Failed", String.valueOf(failed)},
            {"Skipped", String.valueOf(skipped)},
            {"Pass Rate (%)", String.format("%.2f", passRate)},
            {"Fail Rate (%)", String.format("%.2f", totalTests > 0 ? (failed * 100.0 / totalTests) : 0)},
            {"Execution Date", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))},
            {"Framework", "Appium + TestNG"},
            {"Platform", "Android"},
            {"App", "FarmConnect AI"}
        };
        for (int i = 0; i < metrics.length; i++) {
            Row row = sheet5.createRow(i + 1);
            createCell(row, 0, metrics[i][0], defaultStyle);
            createCell(row, 1, metrics[i][1], defaultStyle);
        }
        autoSizeColumns(sheet5, 2);

        // Sheet 6: Defect Summary
        XSSFSheet sheet6 = workbook.createSheet("Defect Summary");
        String[] defectHeaders = {"Defect ID", "Test ID", "Module", "Summary", "Severity", "Status"};
        createHeaderRow(sheet6, defectHeaders, headerStyle);
        rowIdx = 1;
        int defectIdx = 1;
        for (Map<String, String> tc : results) {
            if ("FAIL".equals(tc.get("status"))) {
                Row row = sheet6.createRow(rowIdx++);
                createCell(row, 0, "DEF_" + String.format("%03d", defectIdx++), defaultStyle);
                createCell(row, 1, tc.getOrDefault("testId", ""), defaultStyle);
                createCell(row, 2, tc.getOrDefault("module", ""), defaultStyle);
                createCell(row, 3, tc.getOrDefault("failureReason", "Test failed"), defaultStyle);
                createCell(row, 4, tc.getOrDefault("priority", "Medium"), defaultStyle);
                createCell(row, 5, "Open", failStyle);
            }
        }
        autoSizeColumns(sheet6, defectHeaders.length);

        // Sheet 7: Pass Rate Summary by Module
        XSSFSheet sheet7 = workbook.createSheet("Pass Rate Summary");
        String[] prHeaders = {"Module", "Total", "Passed", "Failed", "Skipped", "Pass Rate (%)"};
        createHeaderRow(sheet7, prHeaders, headerStyle);
        Map<String, int[]> moduleCounts = new LinkedHashMap<>();
        for (Map<String, String> tc : results) {
            String module = tc.getOrDefault("module", "Unknown");
            moduleCounts.putIfAbsent(module, new int[3]);
            int[] counts = moduleCounts.get(module);
            if ("PASS".equals(tc.get("status"))) counts[0]++;
            else if ("FAIL".equals(tc.get("status"))) counts[1]++;
            else counts[2]++;
        }
        rowIdx = 1;
        for (Map.Entry<String, int[]> entry : moduleCounts.entrySet()) {
            Row row = sheet7.createRow(rowIdx++);
            int[] c = entry.getValue();
            int total = c[0] + c[1] + c[2];
            createCell(row, 0, entry.getKey(), defaultStyle);
            createCell(row, 1, String.valueOf(total), defaultStyle);
            createCell(row, 2, String.valueOf(c[0]), defaultStyle);
            createCell(row, 3, String.valueOf(c[1]), defaultStyle);
            createCell(row, 4, String.valueOf(c[2]), defaultStyle);
            createCell(row, 5, String.format("%.1f", total > 0 ? (c[0] * 100.0 / total) : 0), defaultStyle);
        }
        autoSizeColumns(sheet7, prHeaders.length);

        try (FileOutputStream fos = new FileOutputStream(filePath)) {
            workbook.write(fos);
        }
        workbook.close();
        log.info("Main Excel report generated: " + filePath);
    }

    private static void generateFilteredReport(List<Map<String, String>> results, String statusFilter, String filePath) throws IOException {
        XSSFWorkbook workbook = new XSSFWorkbook();
        CellStyle headerStyle = createHeaderStyle(workbook);
        CellStyle defaultStyle = createDefaultStyle(workbook);

        XSSFSheet sheet = workbook.createSheet(statusFilter.equals("PASS") ? "Passed Tests" : "Failed Tests");
        String[] headers = {"Test ID", "Module", "Test Name", "Priority", "Status", "Execution Time (ms)", "Details"};
        createHeaderRow(sheet, headers, headerStyle);

        int rowIdx = 1;
        for (Map<String, String> tc : results) {
            if (statusFilter.equals(tc.get("status"))) {
                Row row = sheet.createRow(rowIdx++);
                createCell(row, 0, tc.getOrDefault("testId", ""), defaultStyle);
                createCell(row, 1, tc.getOrDefault("module", ""), defaultStyle);
                createCell(row, 2, tc.getOrDefault("testName", ""), defaultStyle);
                createCell(row, 3, tc.getOrDefault("priority", ""), defaultStyle);
                createCell(row, 4, statusFilter, defaultStyle);
                createCell(row, 5, tc.getOrDefault("executionTime", "0"), defaultStyle);
                createCell(row, 6, tc.getOrDefault("failureReason", ""), defaultStyle);
            }
        }
        autoSizeColumns(sheet, headers.length);

        try (FileOutputStream fos = new FileOutputStream(filePath)) { workbook.write(fos); }
        workbook.close();
    }

    private static void generateSummaryReport(List<Map<String, String>> results, String filePath) throws IOException {
        XSSFWorkbook workbook = new XSSFWorkbook();
        CellStyle headerStyle = createHeaderStyle(workbook);
        CellStyle defaultStyle = createDefaultStyle(workbook);

        XSSFSheet sheet = workbook.createSheet("Execution Summary");
        long total = results.size();
        long passed = results.stream().filter(t -> "PASS".equals(t.get("status"))).count();
        long failed = results.stream().filter(t -> "FAIL".equals(t.get("status"))).count();
        long skipped = results.stream().filter(t -> "SKIP".equals(t.get("status"))).count();

        String[][] data = {
            {"Execution Summary", "FarmConnect AI E2E Automation"},
            {"Date", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))},
            {"Total Tests", String.valueOf(total)},
            {"Passed", String.valueOf(passed)},
            {"Failed", String.valueOf(failed)},
            {"Skipped", String.valueOf(skipped)},
            {"Pass Rate", String.format("%.2f%%", total > 0 ? (passed * 100.0 / total) : 0)},
            {"Framework", "Appium 9.1 + TestNG 7.9"},
            {"Platform", "Android 14 (API 34)"},
            {"Device", "Emulator"},
            {"App Version", "1.0.0"}
        };

        String[] headers = {"Field", "Value"};
        createHeaderRow(sheet, headers, headerStyle);
        for (int i = 0; i < data.length; i++) {
            Row row = sheet.createRow(i + 1);
            createCell(row, 0, data[i][0], defaultStyle);
            createCell(row, 1, data[i][1], defaultStyle);
        }
        autoSizeColumns(sheet, 2);

        try (FileOutputStream fos = new FileOutputStream(filePath)) { workbook.write(fos); }
        workbook.close();
    }

    // --- Style Helpers ---

    private static CellStyle createHeaderStyle(XSSFWorkbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        font.setColor(IndexedColors.WHITE.getIndex());
        font.setFontHeightInPoints((short) 12);
        style.setFont(font);
        style.setFillForegroundColor(IndexedColors.DARK_GREEN.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        return style;
    }

    private static CellStyle createStatusStyle(XSSFWorkbook workbook, IndexedColors color) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        font.setColor(color.getIndex());
        style.setFont(font);
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        return style;
    }

    private static CellStyle createDefaultStyle(XSSFWorkbook workbook) {
        CellStyle style = workbook.createCellStyle();
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        return style;
    }

    private static void createHeaderRow(XSSFSheet sheet, String[] headers, CellStyle style) {
        Row row = sheet.createRow(0);
        for (int i = 0; i < headers.length; i++) {
            Cell cell = row.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(style);
        }
    }

    private static void createCell(Row row, int col, String value, CellStyle style) {
        Cell cell = row.createCell(col);
        cell.setCellValue(value);
        cell.setCellStyle(style);
    }

    private static void autoSizeColumns(XSSFSheet sheet, int columnCount) {
        for (int i = 0; i < columnCount; i++) {
            sheet.autoSizeColumn(i);
        }
    }
}
