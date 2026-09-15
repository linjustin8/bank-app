from fastapi import FastAPI
from .models import Base, Engine

Base.metadata.create_all(bind=engine)

app = FastAPI()

db = DB()

@app.get("/")
async def root():
    return {"message": "Hello World"}

