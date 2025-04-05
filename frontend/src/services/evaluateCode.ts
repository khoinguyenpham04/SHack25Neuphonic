export async function evaluateUserCode(problem: number, code: string): Promise<any> {
    try {
      const response = await fetch("http://0.0.0.0:3001/eval", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          problem_name: problem,
          user_code: code,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to evaluate code");
      }
  
      const result = await response.json();
      return result;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
  