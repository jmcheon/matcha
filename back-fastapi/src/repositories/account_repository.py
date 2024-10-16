from typing import Optional

from aiomysql import DictCursor
from fastapi import HTTPException, status
from src.models.db import get_db_connection
from src.models.dtos.account_dto import AccountDTO


async def check(username: str, email: str) -> None:
    async with get_db_connection() as connection, connection.cursor(DictCursor) as cursor:
        # check by username
        rows = await cursor.execute("SELECT username FROM account WHERE username = %s", (username,))
        if rows > 0:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="USERNAME_ALREADY_EXISTS",
            )
        # check by email
        rows = await cursor.execute("SELECT username FROM account WHERE email = %s", (email,))
        if rows > 0:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="EMAIL_ALREADY_EXISTS",
            )


async def create(username: str, email: str, password: str, account_status: str) -> int:
    async with get_db_connection() as connection, connection.cursor(DictCursor) as cursor:
        try:
            print("creating account...", account_status)
            await cursor.execute(
                "INSERT INTO account (username, email, password, status) VALUES (%s, %s, %s, %s)",
                (username, email, password, account_status),
            )
            await connection.commit()
            print("account created: ", username)
            return cursor.lastrowid
        except Exception as e:
            print(e)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e),
            )


async def update_status(account_id: int, account_status: str) -> None:
    async with get_db_connection() as connection, connection.cursor(DictCursor) as cursor:
        try:
            await cursor.execute(
                "UPDATE account SET status = %s WHERE account_id = %s",
                (account_status, account_id),
            )
            await connection.commit()
            print("account status updated: ", account_status, account_id)
        except Exception as e:
            print(e)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e),
            )


async def update_refresh_token(account_id: int, token: str) -> None:
    async with get_db_connection() as connection, connection.cursor(DictCursor) as cursor:
        try:
            await cursor.execute(
                "UPDATE account SET refresh_token = %s WHERE account_id = %s",
                (token, account_id),
            )
            await connection.commit()
            print("account refresh token updated: ", token, account_id)
        except Exception as e:
            print(e)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e),
            )


async def update_password(account_id: int, hashed_password: str) -> None:
    async with get_db_connection() as connection, connection.cursor(DictCursor) as cursor:
        try:
            await cursor.execute(
                "UPDATE account SET password = %s WHERE account_id = %s",
                (hashed_password, account_id),
            )
            await connection.commit()
            print("account password updated: ", hashed_password, account_id)
        except Exception as e:
            print(e)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e),
            )


async def get_by_id(account_id: int) -> Optional[AccountDTO]:
    async with get_db_connection() as connection, connection.cursor(DictCursor) as cursor:
        try:
            await cursor.execute("SELECT * FROM account WHERE account_id = %s", (account_id,))
            account = await cursor.fetchone()
            # print("account: ", account)
            if account:
                return AccountDTO.from_dict(dict(account))
            return None
        except Exception as e:
            print(e)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e),
            )


async def get_by_username(username: str) -> Optional[AccountDTO]:
    async with get_db_connection() as connection, connection.cursor(DictCursor) as cursor:
        try:
            await cursor.execute("SELECT * FROM account WHERE username = %s", (username,))
            account = await cursor.fetchone()
            # print("account: ", account)
            if account:
                return AccountDTO.from_dict(dict(account))
            return None
        except Exception as e:
            print(e)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e),
            )


async def get_by_email(email: str) -> Optional[AccountDTO]:
    async with get_db_connection() as connection, connection.cursor(DictCursor) as cursor:
        try:
            print("get_by_email():", email)
            await cursor.execute("SELECT * FROM account WHERE email = %s", (email,))
            account = await cursor.fetchone()
            if account:
                return AccountDTO.from_dict(dict(account))
            return None
        except Exception as e:
            print(e)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e),
            )


async def authenticate(username: str, hashed_password: str) -> Optional[AccountDTO]:
    async with get_db_connection() as connection, connection.cursor(DictCursor) as cursor:
        try:
            await cursor.execute(
                "SELECT account_id, username, status, email FROM account"
                + " WHERE username = %s AND password = %s",
                (username, hashed_password),
            )
            account = await cursor.fetchone()
            print("account", account)
            if account:
                return AccountDTO.from_dict(dict(account))
            return None
        except Exception as e:
            print(e)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e),
            )
