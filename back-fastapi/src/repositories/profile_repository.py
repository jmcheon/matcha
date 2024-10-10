import json
from typing import Optional

from aiomysql import DictCursor
from fastapi import HTTPException, status
from src.models.db import get_db_connection
from src.models.dtos.profile_dto import GenerateProfileDTO, ProfileDTO


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


async def insert_profile(account_id: int, data: GenerateProfileDTO) -> None:
    async with get_db_connection() as connection, connection.cursor(DictCursor) as cursor:
        try:
            insert_query = """
                INSERT INTO profile
                (account_id, first_name, last_name, location, gender, like_gender, height,
                user_language, interests, bio)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            interests_json = json.dumps(data.interests)  # Convert list to JSON format
            user_language = "en"
            await cursor.execute(
                insert_query,
                (
                    account_id,
                    data.first_name,
                    data.last_name,
                    data.location,
                    data.gender,
                    data.like_gender,
                    data.height,
                    user_language,
                    interests_json,  # Insert interests as a JSON string
                    data.bio,
                ),
            )
            await connection.commit()
        except Exception as e:
            print(e)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e),
            )


async def get_profile(account_id: int) -> Optional[ProfileDTO]:
    async with get_db_connection() as connection, connection.cursor(DictCursor) as cursor:
        try:
            select_query = """
            SELECT profile_id, account_id, first_name, last_name, image_paths, location, gender,
            like_gender, height, interests, bio, fame_score
            FROM profile
            WHERE account_id = %s
            """
            # Fetch the profile for the given account_id
            await cursor.execute(select_query, (account_id,))
            profile = await cursor.fetchone()  # Fetch the inserted profile
            print("selected query", profile)
            return ProfileDTO.from_dict(dict(profile))

        except Exception as e:
            print(e)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e),
            )
