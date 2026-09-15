from fastapi import FastAPI

app = FastAPI()

db = DB()

@app.get("/")
async def root():
    return {"message": "Hello World"}