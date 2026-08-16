import json
import sys

def main():
    json_file = "test-results/JSON/execution-results.json"
    try:
        with open(json_file, "r", encoding="utf-8") as f:
            d = json.load(f)
    except FileNotFoundError:
        print(f"::error::Test results JSON file '{json_file}' was not found. Failing build as quality gate cannot be verified!")
        sys.exit(1)
    except Exception as e:
        print(f"::error::Failed to parse test results JSON: {e}")
        sys.exit(1)

    summary = d.get("summary", {})
    pass_rate = float(summary.get("passRate", 0.0))
    crit_fail = float(summary.get("criticalFailRate", 0.0))
    total = int(summary.get("totalTests", 0))
    passed = int(summary.get("passed", 0))
    failed = int(summary.get("failed", 0))
    skipped = int(summary.get("skipped", 0))

    print("==========================================")
    print("      Quality Gate Evaluation Report      ")
    print("==========================================")
    print(f"Total Tests Executed : {total}")
    print(f"Passed               : {passed}")
    print(f"Failed               : {failed}")
    print(f"Skipped              : {skipped}")
    print(f"Pass Rate            : {pass_rate:.2f}% (Requirement: >= 95.0%)")
    print(f"Critical Fail Rate   : {crit_fail:.2f}% (Requirement: <= 5.0%)")
    print("==========================================")

    gate_failed = False
    if pass_rate < 95.0:
        print(f"::error::Quality Gate Failed: Pass rate {pass_rate:.2f}% is below the mandatory threshold of 95.0%!")
        gate_failed = True

    if crit_fail > 5.0:
        print(f"::error::Quality Gate Failed: Critical failure rate {crit_fail:.2f}% exceeds the maximum allowable threshold of 5.0%!")
        gate_failed = True

    if gate_failed:
        sys.exit(1)

    print("✅ All Quality Gate thresholds successfully satisfied!")

if __name__ == "__main__":
    main()
