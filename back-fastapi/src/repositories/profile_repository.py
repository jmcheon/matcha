from typing import Optional

from aiomysql import DictCursor
from fastapi import HTTPException, status
from src.models.db import get_db_connection
from src.models.dtos.profile_dto import ProfileDTO


async def get_by_account_id(account_id: int) -> Optional[ProfileDTO]:
    async with get_db_connection() as connection, connection.cursor(DictCursor) as cursor:
        try:
            await cursor.execute("SELECT * FROM profile WHERE account_id = %s", (account_id,))
            profile = await cursor.fetchone()
            print("profile: ", profile)
            return None
        except Exception as e:
            print(e)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e),
            )
