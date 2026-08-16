package com.farmconnect.automation.utils;

import java.io.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

/**
 * HtmlReportGenerator - Generates rich HTML test execution reports with charts and dashboards.
 */
public class HtmlReportGenerator {

    private static final LogUtils log = LogUtils.getInstance();

    public static void generateReports(List<Map<String, String>> testResults, String outputDir) {
        new File(outputDir).mkdirs();
        try {
            generateExecutionReport(testResults, outputDir + "/execution-report.html");
            generateDashboard(testResults, outputDir + "/dashboard.html");
            generateTrends(testResults, outputDir + "/trends.html");
            log.info("HTML reports generated in: " + outputDir);
        } catch (Exception e) {
            log.error("Failed to generate HTML reports: " + e.getMessage());
        }
    }

    private static void generateExecutionReport(List<Map<String, String>> results, String filePath) throws IOException {
        long total = results.size();
        long passed = results.stream().filter(t -> "PASS".equals(t.get("status"))).count();
        long failed = results.stream().filter(t -> "FAIL".equals(t.get("status"))).count();
        long skipped = results.stream().filter(t -> "SKIP".equals(t.get("status"))).count();
        double passRate = total > 0 ? (passed * 100.0 / total) : 0;
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

        StringBuilder html = new StringBuilder();
        html.append("<!DOCTYPE html><html lang='en'><head><meta charset='UTF-8'>");
        html.append("<meta name='viewport' content='width=device-width,initial-scale=1.0'>");
        html.append("<title>FarmConnect AI - E2E Test Execution Report</title>");
        html.append("<script src='https://cdn.jsdelivr.net/npm/chart.js'></script>");
        html.append("<style>");
        html.append("*{margin:0;padding:0;box-sizing:border-box}");
        html.append("body{font-family:'Segoe UI',system-ui,-apple-system,sans-serif;background:#0f172a;color:#e2e8f0;min-height:100vh}");
        html.append(".header{background:linear-gradient(135deg,#065f46,#064e3b);padding:2rem;text-align:center;border-bottom:3px solid #10b981}");
        html.append(".header h1{font-size:2rem;color:#fff;margin-bottom:0.5rem}");
        html.append(".header .subtitle{color:#6ee7b7;font-size:1rem}");
        html.append(".container{max-width:1400px;margin:0 auto;padding:2rem}");
        html.append(".metrics{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1.5rem;margin-bottom:2rem}");
        html.append(".metric-card{background:linear-gradient(145deg,#1e293b,#334155);border-radius:16px;padding:1.5rem;text-align:center;border:1px solid #334155;transition:transform 0.3s}");
        html.append(".metric-card:hover{transform:translateY(-4px)}");
        html.append(".metric-card .value{font-size:2.5rem;font-weight:800;margin:0.5rem 0}");
        html.append(".metric-card .label{color:#94a3b8;font-size:0.875rem;text-transform:uppercase;letter-spacing:1px}");
        html.append(".pass .value{color:#10b981}.fail .value{color:#ef4444}.skip .value{color:#f59e0b}.total .value{color:#3b82f6}");
        html.append(".section{background:#1e293b;border-radius:16px;padding:2rem;margin-bottom:2rem;border:1px solid #334155}");
        html.append(".section h2{color:#f1f5f9;margin-bottom:1rem;font-size:1.5rem;border-bottom:2px solid #334155;padding-bottom:0.5rem}");
        html.append("table{width:100%;border-collapse:collapse;margin-top:1rem}");
        html.append("th{background:#064e3b;color:#fff;padding:12px 16px;text-align:left;font-size:0.875rem;text-transform:uppercase;letter-spacing:0.5px}");
        html.append("td{padding:10px 16px;border-bottom:1px solid #334155;font-size:0.875rem}");
        html.append("tr:hover{background:#334155}");
        html.append(".status-pass{color:#10b981;font-weight:700}.status-fail{color:#ef4444;font-weight:700}.status-skip{color:#f59e0b;font-weight:700}");
        html.append(".chart-container{display:grid;grid-template-columns:1fr 1fr;gap:2rem;margin-bottom:2rem}");
        html.append(".chart-box{background:#1e293b;border-radius:16px;padding:2rem;border:1px solid #334155}");
        html.append(".info-grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem}");
        html.append(".info-item{display:flex;justify-content:space-between;padding:0.5rem 0;border-bottom:1px solid #334155}");
        html.append(".info-label{color:#94a3b8}.info-value{color:#f1f5f9;font-weight:600}");
        html.append(".badge{padding:2px 8px;border-radius:12px;font-size:0.75rem;font-weight:600}");
        html.append(".badge-pass{background:#064e3b;color:#10b981}.badge-fail{background:#450a0a;color:#ef4444}.badge-skip{background:#451a03;color:#f59e0b}");
        html.append("@media(max-width:768px){.chart-container,.info-grid{grid-template-columns:1fr}.metrics{grid-template-columns:repeat(2,1fr)}}");
        html.append("</style></head><body>");

        // Header
        html.append("<div class='header'><h1>🌾 FarmConnect AI - E2E Test Execution Report</h1>");
        html.append("<div class='subtitle'>Generated: ").append(timestamp).append(" | Framework: Appium + TestNG</div></div>");

        // Metrics Cards
        html.append("<div class='container'>");
        html.append("<div class='metrics'>");
        html.append("<div class='metric-card total'><div class='label'>Total Tests</div><div class='value'>").append(total).append("</div></div>");
        html.append("<div class='metric-card pass'><div class='label'>Passed</div><div class='value'>").append(passed).append("</div></div>");
        html.append("<div class='metric-card fail'><div class='label'>Failed</div><div class='value'>").append(failed).append("</div></div>");
        html.append("<div class='metric-card skip'><div class='label'>Skipped</div><div class='value'>").append(skipped).append("</div></div>");
        html.append("<div class='metric-card pass'><div class='label'>Pass Rate</div><div class='value'>").append(String.format("%.1f%%", passRate)).append("</div></div>");
        html.append("</div>");

        // Charts
        html.append("<div class='chart-container'>");
        html.append("<div class='chart-box'><h2 style='color:#f1f5f9;margin-bottom:1rem'>Results Distribution</h2><canvas id='pieChart'></canvas></div>");
        html.append("<div class='chart-box'><h2 style='color:#f1f5f9;margin-bottom:1rem'>Module Pass Rates</h2><canvas id='barChart'></canvas></div>");
        html.append("</div>");

        // Device Info
        html.append("<div class='section'><h2>📱 Environment Information</h2><div class='info-grid'>");
        html.append("<div class='info-item'><span class='info-label'>Device</span><span class='info-value'>Android Emulator</span></div>");
        html.append("<div class='info-item'><span class='info-label'>Android Version</span><span class='info-value'>14 (API 34)</span></div>");
        html.append("<div class='info-item'><span class='info-label'>App Version</span><span class='info-value'>1.0.0</span></div>");
        html.append("<div class='info-item'><span class='info-label'>Automation</span><span class='info-value'>Appium 9.1 + UiAutomator2</span></div>");
        html.append("</div></div>");

        // Test Results Table
        html.append("<div class='section'><h2>📋 Test Results</h2><table>");
        html.append("<thead><tr><th>Test ID</th><th>Module</th><th>Test Name</th><th>Priority</th><th>Status</th><th>Time (ms)</th><th>Details</th></tr></thead><tbody>");
        for (Map<String, String> tc : results) {
            String status = tc.getOrDefault("status", "UNKNOWN");
            String statusClass = "PASS".equals(status) ? "status-pass" : "FAIL".equals(status) ? "status-fail" : "status-skip";
            String badgeClass = "PASS".equals(status) ? "badge-pass" : "FAIL".equals(status) ? "badge-fail" : "badge-skip";
            html.append("<tr>");
            html.append("<td>").append(tc.getOrDefault("testId", "")).append("</td>");
            html.append("<td>").append(tc.getOrDefault("module", "")).append("</td>");
            html.append("<td>").append(tc.getOrDefault("testName", "")).append("</td>");
            html.append("<td>").append(tc.getOrDefault("priority", "")).append("</td>");
            html.append("<td><span class='badge ").append(badgeClass).append("'>").append(status).append("</span></td>");
            html.append("<td>").append(tc.getOrDefault("executionTime", "0")).append("</td>");
            html.append("<td>").append(tc.getOrDefault("failureReason", "—")).append("</td>");
            html.append("</tr>");
        }
        html.append("</tbody></table></div>");

        // Module summary data for chart
        Map<String, long[]> moduleStats = new LinkedHashMap<>();
        for (Map<String, String> tc : results) {
            String mod = tc.getOrDefault("module", "Unknown");
            moduleStats.putIfAbsent(mod, new long[3]);
            long[] s = moduleStats.get(mod);
            if ("PASS".equals(tc.get("status"))) s[0]++;
            else if ("FAIL".equals(tc.get("status"))) s[1]++;
            else s[2]++;
        }

        // Chart.js Scripts
        html.append("<script>");
        html.append("new Chart(document.getElementById('pieChart'),{type:'doughnut',data:{labels:['Passed','Failed','Skipped'],");
        html.append("datasets:[{data:[").append(passed).append(",").append(failed).append(",").append(skipped).append("],");
        html.append("backgroundColor:['#10b981','#ef4444','#f59e0b'],borderWidth:0}]},");
        html.append("options:{responsive:true,plugins:{legend:{labels:{color:'#e2e8f0'}}}}});");

        // Bar chart
        html.append("new Chart(document.getElementById('barChart'),{type:'bar',data:{");
        html.append("labels:[");
        String labels = moduleStats.keySet().stream().map(m -> "'" + m + "'").collect(Collectors.joining(","));
        html.append(labels).append("],");
        html.append("datasets:[{label:'Pass Rate %',data:[");
        String passRates = moduleStats.values().stream()
            .map(s -> { long t = s[0]+s[1]+s[2]; return String.format("%.1f", t>0?(s[0]*100.0/t):0); })
            .collect(Collectors.joining(","));
        html.append(passRates).append("],backgroundColor:'#10b981'}]},");
        html.append("options:{responsive:true,scales:{y:{beginAtZero:true,max:100,ticks:{color:'#94a3b8'},grid:{color:'#334155'}},x:{ticks:{color:'#94a3b8',maxRotation:45},grid:{display:false}}},");
        html.append("plugins:{legend:{labels:{color:'#e2e8f0'}}}}});");
        html.append("</script>");

        html.append("</div></body></html>");

        try (Writer writer = new BufferedWriter(new FileWriter(filePath))) {
            writer.write(html.toString());
        }
        log.info("Execution report generated: " + filePath);
    }

    private static void generateDashboard(List<Map<String, String>> results, String filePath) throws IOException {
        long total = results.size();
        long passed = results.stream().filter(t -> "PASS".equals(t.get("status"))).count();
        long failed = results.stream().filter(t -> "FAIL".equals(t.get("status"))).count();
        long skipped = results.stream().filter(t -> "SKIP".equals(t.get("status"))).count();
        double passRate = total > 0 ? (passed * 100.0 / total) : 0;
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

        StringBuilder html = new StringBuilder();
        html.append("<!DOCTYPE html><html lang='en'><head><meta charset='UTF-8'>");
        html.append("<title>FarmConnect AI - Test Dashboard</title>");
        html.append("<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Segoe UI',sans-serif;background:#0f172a;color:#e2e8f0;padding:2rem}");
        html.append("h1{text-align:center;color:#10b981;margin-bottom:2rem;font-size:2rem}");
        html.append(".grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.5rem}");
        html.append(".card{background:#1e293b;border-radius:16px;padding:2rem;border:1px solid #334155}");
        html.append(".card h3{color:#94a3b8;font-size:0.9rem;text-transform:uppercase;margin-bottom:1rem}");
        html.append(".big-number{font-size:3rem;font-weight:800;color:#10b981}");
        html.append(".stat-row{display:flex;justify-content:space-between;padding:0.75rem 0;border-bottom:1px solid #334155}");
        html.append("</style></head><body>");
        html.append("<h1>🌾 FarmConnect AI — Test Dashboard</h1>");
        html.append("<div class='grid'>");
        html.append("<div class='card'><h3>Pass Rate</h3><div class='big-number'>").append(String.format("%.1f%%", passRate)).append("</div></div>");
        html.append("<div class='card'><h3>Test Summary</h3>");
        html.append("<div class='stat-row'><span>Total</span><span>").append(total).append("</span></div>");
        html.append("<div class='stat-row'><span>✅ Passed</span><span style='color:#10b981'>").append(passed).append("</span></div>");
        html.append("<div class='stat-row'><span>❌ Failed</span><span style='color:#ef4444'>").append(failed).append("</span></div>");
        html.append("<div class='stat-row'><span>⏭️ Skipped</span><span style='color:#f59e0b'>").append(skipped).append("</span></div>");
        html.append("</div>");
        html.append("<div class='card'><h3>Environment</h3>");
        html.append("<div class='stat-row'><span>Platform</span><span>Android 14</span></div>");
        html.append("<div class='stat-row'><span>Device</span><span>Emulator</span></div>");
        html.append("<div class='stat-row'><span>App</span><span>FarmConnect AI v1.0.0</span></div>");
        html.append("<div class='stat-row'><span>Date</span><span>").append(timestamp).append("</span></div>");
        html.append("</div></div></body></html>");

        try (Writer writer = new BufferedWriter(new FileWriter(filePath))) { writer.write(html.toString()); }
    }

    private static void generateTrends(List<Map<String, String>> results, String filePath) throws IOException {
        StringBuilder html = new StringBuilder();
        html.append("<!DOCTYPE html><html lang='en'><head><meta charset='UTF-8'><title>Test Trends</title>");
        html.append("<style>body{font-family:'Segoe UI',sans-serif;background:#0f172a;color:#e2e8f0;padding:2rem}");
        html.append("h1{text-align:center;color:#10b981;margin-bottom:2rem}</style></head><body>");
        html.append("<h1>📈 Execution Trends</h1>");
        html.append("<p style='text-align:center;color:#94a3b8'>Historical trend data will be populated after multiple CI/CD runs.</p>");
        html.append("</body></html>");
        try (Writer writer = new BufferedWriter(new FileWriter(filePath))) { writer.write(html.toString()); }
    }
}
