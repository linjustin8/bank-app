# Backend

From the repository root:

If uv not already installed

```sh
python -m pip install uv
```

After:
```sh
cd backend
uv sync --locked
uv run --locked fastapi dev
```

## Adding dependencies

Run these commands from `backend`:

```sh
uv add <package-name>
```
