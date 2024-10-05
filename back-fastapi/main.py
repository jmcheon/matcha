from typing import Union

from fastapi import FastAPI, status
from fastapi import HTTPException, Depends
from src.models.db import get_db_connection, database
import aiomysql
from src.controllers import auth_controller
from src.middlewares import cors_middleware




app = FastAPI()

cors_middleware.add(app)

@app.on_event("startup")
async def startup_event():
    await database.init_pool()

@app.on_event("shutdown")
async def shutdown_event():
    await database.close_pool()


@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/accounts/{account_id}")
async def read_account(account_id: int, connection=Depends(get_db_connection)):
    async with connection.cursor(aiomysql.DictCursor) as cursor:
        await cursor.execute("SELECT * FROM account WHERE account_id = %s", (account_id, ))
        account = await cursor.fetchone()
        if account is None:
            raise HTTPException(
                detail="Account not found",
                status_code=status.HTTP_404_NOT_FOUND
                )
        return account

app.include_router(auth_controller.router)