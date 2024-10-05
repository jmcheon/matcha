from src.models.db import get_db_connection
from fastapi import HTTPException, Depends
from fastapi import status
from aiomysql import DictCursor

async def check_account(username: str, email: str) -> None: 
    """
    Check if an account already exists for the given username or email.

    Args:
        username (str): The username to check.
        email (str): The email to check.

    Raises:
        HTTPException: If the username or email already exists in the database
                        with a 409 Conflict status code.
    """
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
    """
    Create a new account after checking for existing username and email.

    Args:
        username (str): The desired username for the new account.
        email (str): The email address for the new account.
        password (str): The password for the new account.

    Raises:
        HTTPException: If there are issues during account creation.

    Returns:
        account_id (int): Created account id
    """
    print("create_account(): ", username, email, password, user_status)

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