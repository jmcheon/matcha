import mysql.connector
from mysql.connector import Error
from fastapi import HTTPException
from fastapi import Depends
import aiomysql
import os

# Get database info from .env
DB_PORT = int(os.getenv("DB_PORT"))
# DB_HOST = os.getenv("MYSQL_HOST")
DB_USER = os.getenv("MYSQL_USER")
DB_PASSWORD = os.getenv("MYSQL_PASSWORD")
DB_DATABASE = os.getenv("MYSQL_DATABASE")


class Database:
    def __init__(self, db_info):
        self.db_info = db_info
        self.pool = None

    async def init_pool(self):
        self.pool = await aiomysql.create_pool(**self.db_info)

    async def close_pool(self):
        self.pool.close()
        await self.pool.wait_closed()


db_info = {
    "host": "db",
    "port": DB_PORT,
    "user": DB_USER,
    "password": DB_PASSWORD,
    "db": DB_DATABASE,
}

print("hihi", db_info)
database = Database(db_info)


async def get_db_connection():
    if database.pool is None:
        raise RuntimeError("Connection pool hasn't been initialized")
    # async with database.pool.acquire() as connection:
    return await database.pool.acquire()
