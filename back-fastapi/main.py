from fastapi import FastAPI
from src.controllers import account_controller, auth_controller, profile_controller
from src.middlewares import cors_middleware
from src.models.db import database

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


app.include_router(auth_controller.router)
app.include_router(account_controller.router)
app.include_router(profile_controller.router)
