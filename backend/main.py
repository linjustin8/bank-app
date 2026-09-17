from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI

from middleware.cors import configure_cors
from router.accounts import router as accounts_router
from router.users import router as users_router

load_dotenv(Path(__file__).resolve().parent / ".env")

app = FastAPI()
configure_cors(app)
app.include_router(accounts_router)
app.include_router(users_router)


@app.get("/")
async def root():
    return {"message": "Hello World"}
