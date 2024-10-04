from src.models.db import get_db_connection
from fastapi import HTTPException, Depends
from fastapi import status
from aiomysql import DictCursor

async def checkIfUsernameExists(username: str): {
    # [rows] = await 
}
    
async def createAccount(username: str, email: str, password:str, user_status:str):
    print("createAccount(): ", username, email, password, user_status)
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
        finally:
            await connection.close()