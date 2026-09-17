# Backend

From the repository root:

If uv not already installed

```sh
python -m pip install uv
python -m pip install "pymongo[srv]" python-dotenv
```

After:
```sh
cd backend
uv sync --locked
uv run --locked fastapi dev
```

## Frontend requests (CORS)

The API allows browser requests from `http://localhost:5173` and
`http://127.0.0.1:5173` by default. If your frontend uses another port or domain,
set a comma-separated list of allowed origins in `backend/.env`:

```env
CORS_ORIGINS=http://localhost:5173,https://your-frontend.example.com
```

This replaces the defaults. Include the protocol and port when needed, without
a path or trailing slash, and restart the backend after changing it.

Requests can include Clerk's `Authorization` header and JSON bodies. This setup
uses Bearer tokens, so cross-origin cookies are not enabled. CORS does not verify
Clerk tokens; backend authentication is configured separately.

## Adding dependencies

Run these commands from `backend`:

```sh
uv add <package-name>
```

Run the following to add clerck packages

'''sh
npm install @clerk/react
'''
