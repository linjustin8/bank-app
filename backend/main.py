from fastapi import FastAPI

from router.accounts import router as accounts_router

app = FastAPI()
app.include_router(accounts_router)


@app.get("/")
async def root():
    return {"message": "Hello World"}
