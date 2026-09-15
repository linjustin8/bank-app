from fastapi import FastAPI
from .models import Base, Engine

Base.metadata.create_all(bind=engine)

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}

