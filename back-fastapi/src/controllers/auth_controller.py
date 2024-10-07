from typing import Dict, Any
from fastapi import Cookie, Request, Response
from fastapi import status
from fastapi import APIRouter
from fastapi import HTTPException, Query
from src.models import dto

import src.services.auth_service as auth_service
import src.services.email_service as email_service
import src.services.account_service as account_service


# fastapi dev랑 run(prod)으로 실행시 각가 다르게 동작
router = APIRouter(
    # prefix="/auth", 
    tags=["Auth"]
)

# pydantic validator 안 쓸시 response_model=None 지정 필수
# TODO: data validation: username, email, password
@router.post("/register", status_code=status.HTTP_201_CREATED, response_model=None)
async def register(data: dict, lang: str = Query("en")):
    """
    Register a new user account.

    Args:
        data (dict): The user data(username, email, password)
        lang (str) : Specific language selector

    Raises:
        HTTPException: If the account already exists or if there are issues during registration.
    """
    username, email, password = data.values()
    print("register", data, lang)
    # TODO: i18n error messages in en and fr
    if lang not in ["en", "fr"]:
        lang = "en"

    account_id = await account_service.create_account(username, email, password)
    print("account id:", account_id)

    return {
        "accountId": account_id,
        "username": username,
        "email": email,
    }

# TODO: data validation: account_id, username, email
@router.post("/request-email", status_code=status.HTTP_200_OK, response_model=None)
async def request_email(res: Response, data: dict, lang: str = Query("en")):
    print(data)
    account_id, username, email = data.values()
    access_token = await auth_service.set_token_cookies(res, account_id)
    print("access token:", access_token)

    await email_service.send_verification_email(
        {
            "account_id": account_id,
            "username": username, 
            "email": email
        }, 
        lang,
        access_token
    )

    return {
        "accountId": account_id,
        "username": username, 
        "email": email,
        "accessToken": access_token
    }


@router.get("/verify-email", status_code=status.HTTP_200_OK, response_model=None)
async def verify_email(res: Response, token: str, lang: str = Query("en")):
    print(token, lang)
    return await email_service.verify_email(res, token, lang)


# TODO: data validation: username, password
@router.post("/login", status_code=status.HTTP_200_OK, response_model=None)
async def login(res: Response, data: dict) -> dict:
    print("login route")
    print(data)
    username, password = data.values()
    return await auth_service.authenticate(res, username, password)

@router.delete("/logout", status_code=status.HTTP_200_OK, response_model=None)
async def logout(res: Response, accessToken: str = Cookie(None)):
    print("logout():", accessToken)
    return await auth_service.logout(res, accessToken)