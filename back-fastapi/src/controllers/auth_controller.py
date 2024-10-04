from fastapi import Response
from fastapi import status
from fastapi import APIRouter
from fastapi import HTTPException, Query
from src.models import dto
from src.models.account_model import createAccount
import bcrypt

router = APIRouter(
    prefix="/auth", 
    tags=["Auth"]
)

@router.post("/register", response_model=None)
async def register(user: dict, lang: str = Query("en")):
    username, email, password = user.values()
    print("register", user, lang)
    print("register", username, email, password)
    if lang not in ["en", "fr"]:
        lang = "en"

    if not user["username"]:
        raise HTTPException(
            detail="All fields are required",
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY
        )

    if not user["password"]:
        raise HTTPException(
            detail="Password can not be empty",
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY
        )

    if not user["email"]:
        raise HTTPException(
            detail="Email can not be empty",
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY
        )
    print("all passed")
    account_id = await createAccount(username, email, password, user_status="pending_verification")
    print("id:", account_id)