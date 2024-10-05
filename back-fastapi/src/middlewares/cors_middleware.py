from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI

# List of allowed origins
origins = [
    "http://localhost:8080",  # Frontend URL
]

def add(app: FastAPI):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],  # Allows all HTTP methods
        allow_headers=["*"],  # Allows all headers
)