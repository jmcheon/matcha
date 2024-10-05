from fastapi import HTTPException
from fastapi import status
from aiomysql import DictCursor

from src.models.db import get_db_connection

async def check_account(username: str, email: str) -> None: 
    connection = await get_db_connection()
    async with connection.cursor(DictCursor) as cursor:
        # check by username
        rows = await cursor.execute(
            'SELECT username FROM account WHERE username = %s', (username, )
        )
        if rows > 0:
            raise HTTPException(
                detail="Account already exists",
                status_code=status.HTTP_409_CONFLICT
            )
        # check by email
        rows = await cursor.execute(
            'SELECT username FROM account WHERE email = %s', (email, )
        )
        if rows > 0:
            raise HTTPException(
                detail="Account already exists",
                status_code=status.HTTP_409_CONFLICT
            )

async def create_account(username: str, email: str, password:str, user_status:str) -> int:
    connection = await get_db_connection()
    async with connection.cursor(DictCursor) as cursor:
        try:
            print("creating account...")
            await cursor.execute(
                'INSERT INTO account (username, email, password, status) VALUES (%s, %s, %s, %s)',
                (username, email, password, user_status)
            )
            await connection.commit()
            print("user created: ", username)
            return cursor.lastrowid
        except Exception as e:
            print(e)
            raise HTTPException(
                detail=str(e),
                status_code=status.HTTP_400_BAD_REQUEST
            )
        # finally:
        #     await connection.close()