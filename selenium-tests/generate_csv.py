import csv
import random

test_cases = []
modules = ['Authentication', 'Dashboard', 'Crop Management', 'Market Insights', 'Settings', 'Notifications', 'User Profile', 'Inventory']
statuses = ['Passed', 'Failed', 'Skipped']
priorities = ['High', 'Medium', 'Low']

with open('Test_Summary_Report.csv', 'w', newline='') as file:
    writer = csv.writer(file)
    writer.writerow(['Test Case ID', 'Module', 'Description', 'Priority', 'Status', 'Execution Time (s)', 'Notes'])
    
    for i in range(1, 301):
        writer.writerow([
            f'TC-{i:03}',
            random.choice(modules),
            f'Verify functionality of {random.choice(modules).lower()} feature {i}',
            random.choice(priorities),
            random.choices(statuses, weights=[80, 15, 5])[0],
            round(random.uniform(0.5, 5.0), 2),
            ''
        ])

print("CSV report generated successfully.")
