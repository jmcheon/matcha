from datetime import timedelta

import src.services.account_service as account_service
import src.services.auth_service as auth_service
import src.services.email_service as email_service
from constants import NGINX_HOST
from fastapi import APIRouter, Cookie, Depends, HTTPException, Query, Response, status
from fastapi.responses import JSONResponse, RedirectResponse
from src.models.dtos.account_dto import AccountDTO, CredentialAccountDTO, RegisterAccountDTO
from src.models.validators import validate_account_register

# fastapi dev랑 run(prod)으로 실행시 각가 다르게 동작
router = APIRouter(
    # prefix="/auth",
    tags=["Auth"]
)


# pydantic validator 안 쓸시 response_model=None 지정 필수
@router.post("/register", status_code=status.HTTP_201_CREATED, response_model=None)
async def register(
    res: Response,
    data: RegisterAccountDTO = Depends(validate_account_register),
    lang: str = Query("en"),
):
    """
    Register a new user account.

    Args:
        data (dict): The user data(username, email, password)
        lang (str) : Specific language selector

    Raises:
        HTTPException: If the account already exists or if there are issues during registration.
    """
    try:
        created_account = await account_service.create_account(data)
        access_token = await auth_service.set_token_cookies(res, created_account.account_id)
        await email_service.send_verification_email(created_account, lang, access_token)
        created_account.access_token = access_token
        return created_account
    except HTTPException as e:
        return JSONResponse(status_code=e.status_code, content={"code": e.detail})
    except Exception:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={"code": "GENERAL_ERROR"}
        )


# TODO: data validation: account_id, username, email
@router.post("/request-email", status_code=status.HTTP_200_OK, response_model=None)
async def request_email(res: Response, data: dict, lang: str = Query("en")):
    print(data)
    account_id, username, email = data.values()
    access_token = await auth_service.set_token_cookies(res, account_id)
    print("access token:", access_token)

    await email_service.send_verification_email(
        {"account_id": account_id, "username": username, "email": email}, lang, access_token
    )

    return {
        "account_id": account_id,
        "username": username,
        "email": email,
        "accessToken": access_token,
    }


@router.get("/verify-email", status_code=status.HTTP_200_OK, response_model=None)
async def verify_email(res: Response, token: str, lang: str = Query("en")):
    print(token, lang)
    return await email_service.verify_email(res, token, lang)


# TODO: data validation: username, password
@router.post("/login", status_code=status.HTTP_200_OK, response_model=None)
async def login(res: Response, data: CredentialAccountDTO) -> AccountDTO:
    try:
        return await auth_service.authenticate(res, data)
    except HTTPException as e:
        return JSONResponse(status_code=e.status_code, content={"code": e.detail})
    except Exception:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={"code": "GENERAL_ERROR"}
        )


@router.delete("/logout", status_code=status.HTTP_200_OK, response_model=None)
async def logout(res: Response, access_token: str = Cookie(None)):
    print("logout():", access_token)
    return await auth_service.logout(res, access_token)


@router.post("/refresh", status_code=status.HTTP_200_OK, response_model=None)
async def refresh(res: Response, refresh_token: str = Cookie(None)):
    print("refresh():", refresh_token)
    return await auth_service.refresh(res, refresh_token)


# TODO: data validation: email
@router.post("/forgot-password", status_code=status.HTTP_200_OK, response_model=None)
async def forgot_password(data: dict, lang: str = Query("en")) -> None:
    (email,) = data.values()
    print("forgot-password():", data, lang, email)

    account = await account_service.get_account_by_email(email)
    if not account:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Account not found")
    account_id = account.account_id
    token_info = auth_service.create_access_token(account_id, timedelta(hours=24))
    await email_service.send_password_reset_email(
        {"email": email}, lang, token_info["access_token"]
    )


@router.get("/reset-password", status_code=status.HTTP_200_OK, response_model=None)
async def reset_password(res: Response, token: str, lang: str = Query("en")) -> None:
    print("reset-password():", token, lang)

    if token is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Token is required",
        )
    payload = auth_service.decode_token(token)
    # TODO: token 만료 시 redirection
    if payload is None:
        # temp exception
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has expired")
        # example
        redirect_url = f"{NGINX_HOST}/{lang}/auth/forgot-password"
        return RedirectResponse(url=redirect_url, headers=res.headers)
    account_id = payload["account_id"]
    await auth_service.set_token_cookies(res, account_id)
    redirect_url = f"{NGINX_HOST}/{lang}/auth/reset-password"
    return RedirectResponse(url=redirect_url, headers=res.headers)
