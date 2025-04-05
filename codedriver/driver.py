import json
import time
from typing import Any, Dict, List

def run_user_code(user_code: str, input_data: Any) -> Any:
    """
    Executes the user code and calls a function named 'solution' with the provided input data.
    
    Args:
        user_code: A string containing the user-defined Python code.
        input_data: The input data to be passed to the solution function.
        
    Returns:
        The output produced by the user's solution function.
        
    Raises:
        RuntimeError: If there is an error during code compilation.
        ValueError: If 'solution' is not defined in the user code.
    """
    local_namespace: Dict[str, Any] = {}

    try:
        exec(user_code, {}, local_namespace)
    except Exception as e:
        raise RuntimeError(f"Error compiling user code: {e}")
    
    if "solution" not in local_namespace or not callable(local_namespace["solution"]):
        raise ValueError("User code must define a function named 'solution'")
    
    solution = local_namespace["solution"]
    # If input_data is a list or tuple, unpack it
    if isinstance(input_data, (list, tuple)):
        return solution(*input_data)
    else:
        return solution(input_data)



def run_test_cases(user_code: str, test_cases: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Executes each test case against the user code and records the output,
    success status, and execution time.
    
    Args:
        user_code: A string containing the user-defined Python code.
        test_cases: A list of dictionaries, each containing 'input' and 'expected_output'.
        
    Returns:
        A list of dictionaries with the result of each test case.
    """
    results: List[Dict[str, Any]] = []

    for index, case in enumerate(test_cases):
        input_data = case.get("input")
        expected_output = case.get("expected_output")
        start_time = time.perf_counter()
        try:
            user_output = run_user_code(user_code, input_data)
            success = user_output == expected_output
        except Exception as e:
            user_output = str(e)
            success = False
        execution_time = time.perf_counter() - start_time
        
        results.append({
            "test_case": index,
            "input": input_data,
            "expected_output": expected_output,
            "user_output": user_output,
            "execution_time": execution_time,
            "success": success
        })
        
    return results

def main() -> None:
    # Example JSON structure with test cases.
    json_data = '''
    {
      "test_cases": [
        {
          "input": [1, 2],
          "expected_output": 3
        },
        {
          "input": [5, 7],
          "expected_output": 12
        },
        {
          "input": [0, 0],
          "expected_output": 0
        },
        {
          "input": [-1, 1],
          "expected_output": 0
        },
        {
          "input": [10, -5],
          "expected_output": 5
        }
      ]
    }
    '''
    data = json.loads(json_data)
    test_cases = data["test_cases"]

    # Example user code string that defines a function `solution`
    user_code = '''
def solution(a, b):
    return a + b
'''

    results = run_test_cases(user_code, test_cases)
    for result in results:
        print(result)

if __name__ == "__main__":
    main()
