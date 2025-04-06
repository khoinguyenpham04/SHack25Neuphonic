import argparse
import json
from aiohttp import web
import aiohttp
import ssl


from services.evaluate_service import evaluate_problem


async def handle_get(request):
    return web.Response(text="GET not allowed", status=403, content_type="text/plain")


async def handle_post(request):
    # Ensure posts are made to the evaluation endpoint
    if request.path != "/eval":
        print("fail")
        return web.json_response(
            {
                "status": 400,
                "body": f"Wrong endpoint: {request.path}\nPlease POST to /generate",
            },
            status=400,
        )

    # Check content type
    if request.content_type != "application/json":
        print("fail2")
        return web.json_response(
            {"status": 400, "body": "Unsupported content type, please use `application/json`"}, status=400
        )

    try:
        # Process JSON data
        data = await request.json()
        problem_name = data.get("problem_name")
        code = data.get("user_code")

        # print(f'Problem: {problem_name}, code: {code}')

        if not problem_name or not code:
            return web.json_response(
                {"status": 400, "body": "`problem_name` and `code` must be provided in the JSON."},
                status=400,
            )

        evaluation_result = evaluate_problem(problem_name, code)

        return web.json_response(
            {
                "status": 200,
                "body": {
                    "testResults": evaluation_result["tests"]
                }
            }
        )

    except json.JSONDecodeError:
        return web.json_response(
            {"status": 400, "body": "Invalid JSON data:\n" + data.text()}, status=400
        )
    except Exception as e:
        print(e)
        return web.json_response(
            {"status": 500, "body": f"Error processing request: {str(e)}"}, status=500
        )


def run_server(port):
    app = web.Application()
    # Configure routes
    app.router.add_get("/{path:.*}", handle_get)
    app.router.add_post("/{path:.*}", handle_post)

    # SSL context
    ssl_context = ssl.create_default_context(ssl.Purpose.CLIENT_AUTH)
    ssl_context.load_cert_chain('cert.pem', 'key.pem')

    # Run with HTTPS
    web.run_app(app, host="", port=port, ssl_context=ssl_context)
    web.run_app(app, host="", port=port)


if __name__ == "__main__":
    parser = argparse.ArgumentParser("code-eval-server")
    parser.add_argument(
        "-p",
        "--port",
        type=int,
        required=True,
        help="Specify the port that the server will run on.",
    )
    args = parser.parse_args()
    run_server(args.port)
