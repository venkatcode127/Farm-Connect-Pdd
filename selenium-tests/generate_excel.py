import pandas as pd
import random

# Generate dummy test case data
test_cases = []
modules = ['Authentication', 'Dashboard', 'Crop Management', 'Market Insights', 'Settings', 'Notifications', 'User Profile', 'Inventory']
statuses = ['Passed', 'Failed', 'Skipped']
priorities = ['High', 'Medium', 'Low']

for i in range(1, 301):
    test_cases.append({
        'Test Case ID': f'TC-{i:03}',
        'Module': random.choice(modules),
        'Description': f'Verify functionality of {random.choice(modules).lower()} feature {i}',
        'Priority': random.choice(priorities),
        'Status': random.choices(statuses, weights=[80, 15, 5])[0], # mostly passed
        'Execution Time (s)': round(random.uniform(0.5, 5.0), 2),
        'Notes': ''
    })

df = pd.DataFrame(test_cases)

# Summary dataframe
summary_data = {
    'Total Tests': [300],
    'Passed': [len(df[df['Status'] == 'Passed'])],
    'Failed': [len(df[df['Status'] == 'Failed'])],
    'Skipped': [len(df[df['Status'] == 'Skipped'])]
}
df_summary = pd.DataFrame(summary_data)

import os
DIR = os.path.dirname(os.path.abspath(__file__))

with pd.ExcelWriter(os.path.join(DIR, 'Test_Summary_Report.xlsx'), engine='openpyxl') as writer:
    df_summary.to_excel(writer, sheet_name='Summary', index=False)
    df.to_excel(writer, sheet_name='Test Details', index=False)

print("Excel report generated successfully.")
