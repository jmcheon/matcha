from typing import Union

from fastapi import FastAPI
from fastapi import HTTPException, Depends
from src.models.db import get_db_connection, database
import aiomysql
from src.controllers import auth_controller
from fastapi.middleware.cors import CORSMiddleware




app = FastAPI()

# List of allowed origins
origins = [
    "http://localhost:8080",  # Frontend URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows specific origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all headers
)

@app.on_event("startup")
async def startup_event():
    await database.init_pool()

@app.on_event("shutdown")
async def shutdown_event():
    await database.close_pool()


@app.get("/")
def read_root():
    return {"Hello": "World"}

app.include_router(auth_controller.router)

# @app.get("/items/{item_id}")
# def read_item(item_id: int, q: Union[str, None] = None):
#     return {"item_id": item_id, "q": q}


@app.get("/items/{item_id}")
async def read_item(item_id: int, connection=Depends(get_db_connection)):
    async with connection.cursor(aiomysql.DictCursor) as cursor:
        await cursor.execute("SELECT * FROM account WHERE account_id = %s", (item_id,))
        item = await cursor.fetchone()
        if item is None:
            raise HTTPException(status_code=404, detail="Item not found")
        return item