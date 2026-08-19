import os
import csv
import random

DIR = os.path.dirname(os.path.abspath(__file__))

test_cases = []
modules = ['Mobile Auth', 'Mobile Dashboard', 'Offline Sync', 'Push Notifications', 'Camera/Uploads', 'GPS Tracking', 'Mobile Settings']
statuses = ['Passed', 'Failed', 'Skipped']
priorities = ['High', 'Medium', 'Low']

with open(os.path.join(DIR, 'Appium_Test_Summary_Report.csv'), 'w', newline='', encoding='utf-8') as file:
    writer = csv.writer(file)
    writer.writerow(['Test Case ID', 'Module', 'Description', 'Priority', 'Status', 'Execution Time (s)', 'Notes'])
    
    for i in range(1, 301):
        writer.writerow([
            f'APP-TC-{i:03}',
            random.choice(modules),
            f'Verify mobile functionality of {random.choice(modules).lower()} feature {i}',
            random.choice(priorities),
            random.choices(statuses, weights=[85, 10, 5])[0],
            round(random.uniform(2.0, 15.0), 2),
            'Automated via Appium UiAutomator2'
        ])

print("Appium CSV report generated successfully.")
