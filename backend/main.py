from pathlib import Path

from dotenv import load_dotenv
from fastapi import Depends, FastAPI

from dependencies.auth import get_clerk_identity
from middleware.cors import configure_cors
from router.accounts import router as accounts_router
from router.auth import router as auth_router
from router.users import router as users_router

load_dotenv(Path(__file__).resolve().parents[1] / ".env")

app = FastAPI()
configure_cors(app)
app.include_router(auth_router)
app.include_router(accounts_router, dependencies=[Depends(get_clerk_identity)])
app.include_router(users_router, dependencies=[Depends(get_clerk_identity)])


@app.get("/")
async def root():
    return {"message": "Hello World"}
