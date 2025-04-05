import os
import json
from typing import Any, Dict, List

from services.driver import run_test_cases

# Assumes your test cases JSON files are stored in a folder called 'test_cases'
TEST_CASES_DIR = "../test_cases"
TEST_CASES_DIR = os.path.join(os.path.dirname(__file__), "..", "test_cases")

def evaluate_problem(problem_name: int, user_code: str) -> Dict[str, Any]:
    """
    Loads the test cases for the given problem, runs the user's code,
    and returns the results in a JSON-serializable format.
    
    Args:
        problem_name: The name of the problem (e.g., "sum_two_numbers").
        user_code: A string containing the user's Python solution.
    
    Returns:
        A dictionary ready to be serialized and sent to the next service.
    """
    # Build the path to the test case file
    test_case_path = os.path.join(TEST_CASES_DIR, f"{problem_name}.json")

    if not os.path.exists(test_case_path):
        raise FileNotFoundError(f"Test case file not found: {test_case_path}")

    # Load the test cases from file
    with open(test_case_path, "r") as f:
        test_case_data = json.load(f)

    test_cases = test_case_data.get("test_cases", [])

    results = run_test_cases(user_code, test_cases)

    return {
        "problem_id": problem_name,
        "code": user_code,
        "tests": results
    }
