package com.farmconnect.web.utils;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

public class ExcelAnalysisUtils {
    private static Workbook workbook;
    private static Sheet summarySheet;
    private static String reportPath = System.getProperty("user.dir") + "/reports/Excel/Web_Automation_Analysis.xlsx";

    public static void initializeReport() {
        workbook = new XSSFWorkbook();
        summarySheet = workbook.createSheet("E2E Test Analysis");
        createHeader(summarySheet, "Test ID", "Component", "Action/Button", "Browser Type", "Multi-Tab Checked", "Status");
    }

    private static void createHeader(Sheet sheet, String... headers) {
        Row headerRow = sheet.createRow(0);
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            CellStyle style = workbook.createCellStyle();
            Font font = workbook.createFont();
            font.setBold(true);
            style.setFont(font);
            cell.setCellStyle(style);
        }
    }

    public static synchronized void addResult(String testId, String component, String action, String browserType, boolean multiTab, String status) {
        if (workbook == null) initializeReport();
        Row row = summarySheet.createRow(summarySheet.getLastRowNum() + 1);
        row.createCell(0).setCellValue(testId);
        row.createCell(1).setCellValue(component);
        row.createCell(2).setCellValue(action);
        row.createCell(3).setCellValue(browserType);
        row.createCell(4).setCellValue(multiTab ? "Yes" : "No");
        row.createCell(5).setCellValue(status);
    }

    public static void saveReport() {
        if(workbook == null) return;
        try (FileOutputStream outputStream = new FileOutputStream(new File(reportPath))) {
            workbook.write(outputStream);
            workbook.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
