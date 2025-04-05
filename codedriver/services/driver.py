import json
import time
from typing import Any, Dict, List
import concurrent.futures
import ast
from typing import Any, Dict

def _ast_check_no_imports(user_code: str, allowed_imports: set) -> None:
    """
    Parse the user's code via AST. 
    Raise ValueError if there is an import of a non-whitelisted module.
    """
    tree = ast.parse(user_code)
    
    for node in ast.walk(tree):
        # Check plain import statements: 'import xyz'
        if isinstance(node, ast.Import):
            for alias in node.names:
                print(alias.name)
                if alias.name not in allowed_imports:
                    raise ValueError(f"Import of '{alias.name}' is not allowed.")
        # Check 'from xyz import abc' statements
        if isinstance(node, ast.ImportFrom):
            if node.module not in allowed_imports:
                raise ValueError(f"Import from '{node.module}' is not allowed.")

_real_import = __import__  # keep a handle to the real built-in __import__


def restricted_import(name, globals=None, locals=None, fromlist=(), level=0):
    """
    Only allow importing from the 'allowed_imports' set. Everything else raises ImportError.
    """
    # You might store 'allowed_imports' in a global or
    # pass it in via closures, etc. For illustration:
    if name not in ALLOWED_MODULES:
        raise ImportError(f"Importing '{name}' is not allowed.")
    return _real_import(name, globals, locals, fromlist, level)

def _sanitize_top_level(tree: ast.Module) -> ast.Module:
    """
    Modify the AST in-place so the top-level only has:
      - FunctionDef / ClassDef
      - Import / ImportFrom
      - Assign / AnnAssign
      - Expr (if it's just a string literal, i.e. a module docstring)
    All other statements at the top level are removed (not executed).
    """
    new_body = []
    for node in tree.body:
        if isinstance(node, (ast.FunctionDef, ast.ClassDef, ast.Import, ast.ImportFrom, ast.Assign, ast.AnnAssign)):
            
            new_body.append(node)
        elif isinstance(node, ast.Expr):
            
            if isinstance(node.value, ast.Constant) and isinstance(node.value.value, str):
                new_body.append(node)
            # else skip any other expression
        else:
            # Skip anything else (like calls, if-statements, for-loops, etc.)
            pass

    tree.body = new_body
    return tree

def run_user_code(user_code: str, input_data: Any) -> Any:
    """
    Executes the user code (in a restricted environment) and calls 'solution' with the provided input data.
    Raises:
        RuntimeError: If compilation or execution fails (including timeouts).
        ValueError: If code does not define 'solution' or uses disallowed imports.
    """
    # Check that the AST does not contain disallowed imports.

    global ALLOWED_MODULES
    ALLOWED_MODULES = {"math"}

    _ast_check_no_imports(user_code, ALLOWED_MODULES)

    # 3) Parse and sanitize top-level statements
    try:
        tree = ast.parse(user_code, mode="exec")
    except Exception as e:
        raise RuntimeError(f"Could not parse user code: {e}")

    # Remove anything outside function/class/assignment/import/docstring
    sanitized_tree = _sanitize_top_level(tree)

    # Prepare restricted built-ins and globals
    ALLOWED_BUILTINS = {
        "__import__":restricted_import,
        "abs": abs,
        "range": range,
        "len": len,
        "print": print,
        "str": str,
        "int": int,
        "float": float,
        "bool": bool,
    }

    safe_globals: Dict[str, Any] = {
        "__builtins__": ALLOWED_BUILTINS
    }

    # Compile the user code (with a small local timeout).
    # synchronous call, doesnt yield to the threadpool yet.
    try:
        compiled_code = compile(sanitized_tree, "<user_code>", "exec")
    except Exception as e:
        raise RuntimeError(f"Error compiling user code: {e}")

    # 4) Execute user code in a restricted environment using ThreadPoolExecutor
    def _exec_user_code():
        exec(compiled_code, safe_globals, safe_globals)

    with concurrent.futures.ThreadPoolExecutor(max_workers=1) as executor:
        # Exec the code
        future = executor.submit(_exec_user_code)
        try:
            future.result(timeout=15)  # 15s limit 
        except concurrent.futures.TimeoutError:
            raise RuntimeError("User code took too long to execute (timeout).")
        except Exception as e:
            raise RuntimeError(f"Error during user code execution: {e}")

        # Verify that solution function defined
        if "solution" not in safe_globals or not callable(safe_globals["solution"]):
            raise ValueError("User code must define a callable function named 'solution'.")

        solution_func = safe_globals["solution"]

        # Step (b): Invoke the 'solution' function with a 15s limit
        # Unpack input data if needed
        def _call_solution():
            if isinstance(input_data, (list, tuple)):
                return solution_func(*input_data)
            else:
                return solution_func(input_data)

        future_call = executor.submit(_call_solution)

        try:
            return [future_call.result(timeout=15)]
        except concurrent.futures.TimeoutError:
            raise RuntimeError("Call to 'solution' timed out.")
        except Exception as e:
            raise RuntimeError(f"Error running 'solution': {e}")



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


# TESTING

# def main() -> None:
#     # Example JSON structure with test cases.
#     json_data = '''
#     {
#       "test_cases": [
#         {
#           "input": [1, 2],
#           "expected_output": 3
#         },
#         {
#           "input": [5, 7],
#           "expected_output": 12
#         },
#         {
#           "input": [0, 0],
#           "expected_output": 0
#         },
#         {
#           "input": [-1, 1],
#           "expected_output": 0
#         },
#         {
#           "input": [10, -5],
#           "expected_output": 5
#         }
#       ]
#     }
#     '''
#     data = json.loads(json_data)
#     test_cases = data["test_cases"]

#     # Example user code string that defines a function `solution`
#     user_code = '''

# '''

#     results = run_test_cases(user_code, test_cases)
#     for result in results:
#         print(result)

# if __name__ == "__main__":
#     main()