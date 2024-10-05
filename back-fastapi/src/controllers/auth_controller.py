from fastapi import Response
from fastapi import status
from fastapi import APIRouter
from fastapi import HTTPException, Query
import src.services.account_service as account_service


# fastapi dev랑 run(prod)으로 실행시 각가 다르게 동작
router = APIRouter(
    # prefix="/auth", 
    # tags=["Auth"]
)

# pydantic validator 안 쓸시 response_model=None 지정 필수
# TODO: data validation
@router.post("/register", status_code=status.HTTP_201_CREATED, response_model=None)
async def register(data: dict, lang: str = Query("en")):
    """
    Register a new user account.

    Args:
        user (dict): The user data(username, email, password)
        lang (str) : Specific language selector

    Raises:
        HTTPException: If the account already exists or if there are issues during registration.
    """
    username, email, password = data.values()
    print("register", username, email, password, lang)
    # TODO: i18n error messages in en and fr
    if lang not in ["en", "fr"]:
        lang = "en"

    await account_service.check_account(username, email)

    account_id = await account_service.create_account(username, email, password, user_status="pending_verification")
    print("id:", account_id)