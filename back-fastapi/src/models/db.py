from contextlib import asynccontextmanager

import aiomysql
from constants import DB_DATABASE, DB_PASSWORD, DB_PORT, DB_USER


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

# print("hihi", db_info)
database = Database(db_info)


@asynccontextmanager
async def get_db_connection():
    if database.pool is None:
        raise RuntimeError("Connection pool hasn't been initialized")
    # async with database.pool.acquire() as connection:
    connection = await database.pool.acquire()
    try:
        yield connection
    finally:
        database.pool.release(connection)
