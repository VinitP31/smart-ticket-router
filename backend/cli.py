"""Terminal tester for the routing pipeline. Usage:
    python cli.py "I was charged twice this month"
    python cli.py               (prompts for input)
"""

import sys
import time

from src.router import route_ticket


def main() -> None:
    if len(sys.argv) > 1:
        ticket = " ".join(sys.argv[1:])
    else:
        ticket = input("Enter a support ticket: ")

    debug = {}
    start = time.perf_counter()
    result = route_ticket(ticket, debug=debug)
    elapsed_ms = round((time.perf_counter() - start) * 1000)

    print(f"\nWord count: {debug.get('word_count', 0)}")
    if debug.get("was_summarized"):
        print("Ticket exceeded 300 words — summarized before routing.")
        print("Summary sent to the router:")
        print(f"  {debug['summary']}\n")

    print(f"{len(result['issues'])} issue(s) detected:\n")
    for issue in result["issues"]:
        print(f"  [{issue['id']}] {issue['category']}")
        print(f"      Priority     : {issue['priority']}")
        print(f"      Assigned to  : {issue['assigned_team']}")
        print(f"      Reasoning    : {issue['reasoning']}\n")

    print(f"Response Time: {elapsed_ms / 1000:.2f} seconds ({elapsed_ms} ms)")


if __name__ == "__main__":
    main()
