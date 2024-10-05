from fastapi import Response
from fastapi import status
from fastapi import APIRouter
from fastapi import HTTPException, Query
from src.models import dto
from src.models.account_model import create_account, check_account
from src.services.auth_service import hash_password, verify_password
import bcrypt

# fastapi dev랑 run(prod)으로 실행시 각가 다르게 동작
router = APIRouter(
    # prefix="/auth", 
    # tags=["Auth"]
)

# pydantic validator 안 쓸시 response_model=None 지정 필수
@router.post("/register", response_model=None)
async def register(user: dict, lang: str = Query("en")):
    username, email, password = user.values()
    print("register", user, lang)
    print("register", username, email, password)
    # TODO: i18n error messages in en and fr
    if lang not in ["en", "fr"]:
        lang = "en"

    if not any(username, email):
        raise HTTPException(
            detail="All fields are required",
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY
        )
    await check_account(username, email)

    if not password:
        raise HTTPException(
            detail="Password can not be empty",
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY
        )
    
    hashed_password = hash_password(password)

    print("all passed")
    account_id = await create_account(username, email, hashed_password, user_status="pending_verification")
    print("id:", account_id)

    # TODO: send verification email