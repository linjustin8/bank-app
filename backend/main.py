from fastapi import FastAPI

from router.accounts import router as accounts_router
from router.users import router as users_router

app = FastAPI()
app.include_router(accounts_router)
app.include_router(users_router)


@app.get("/")
async def root():
    return {"message": "Hello World"}
