package com.farmconnect.automation.utils;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

public class ExcelReportUtils {

    private static Workbook workbook;
    private static Sheet executedSheet;
    private static Sheet passedSheet;
    private static Sheet failedSheet;
    private static String reportPath = System.getProperty("user.dir") + "/reports/Excel/Automation_Test_Report.xlsx";

    public static void initializeReport() {
        workbook = new XSSFWorkbook();
        executedSheet = workbook.createSheet("Executed Test Cases");
        passedSheet = workbook.createSheet("Passed Tests");
        failedSheet = workbook.createSheet("Failed Tests");

        createHeader(executedSheet, "Test ID", "Module", "Test Name", "Priority", "Status");
        createHeader(passedSheet, "Test ID", "Test Name", "Priority");
        createHeader(failedSheet, "Test ID", "Test Name", "Priority", "Failure Reason");
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

    public static void addResult(String testId, String module, String testName, String priority, String status, String reason) {
        if(workbook == null) return;
        
        Row row = executedSheet.createRow(executedSheet.getLastRowNum() + 1);
        row.createCell(0).setCellValue(testId);
        row.createCell(1).setCellValue(module);
        row.createCell(2).setCellValue(testName);
        row.createCell(3).setCellValue(priority);
        row.createCell(4).setCellValue(status);

        if (status.equalsIgnoreCase("PASS")) {
            Row passRow = passedSheet.createRow(passedSheet.getLastRowNum() + 1);
            passRow.createCell(0).setCellValue(testId);
            passRow.createCell(1).setCellValue(testName);
            passRow.createCell(2).setCellValue(priority);
        } else if (status.equalsIgnoreCase("FAIL")) {
            Row failRow = failedSheet.createRow(failedSheet.getLastRowNum() + 1);
            failRow.createCell(0).setCellValue(testId);
            failRow.createCell(1).setCellValue(testName);
            failRow.createCell(2).setCellValue(priority);
            failRow.createCell(3).setCellValue(reason);
        }
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
