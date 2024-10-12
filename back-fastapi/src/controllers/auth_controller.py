from datetime import timedelta

import src.services.account_service as account_service
import src.services.auth_service as auth_service
import src.services.email_service as email_service
from constants import NGINX_HOST
from fastapi import APIRouter, Cookie, Depends, HTTPException, Query, Response, status
from fastapi.responses import JSONResponse, RedirectResponse
from src.models.dto import CredentialAccountDTO, GeneralAccountDTO, RegisterAccountDTO
from src.models.validators import validate_account, validate_account_register

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
) -> RegisterAccountDTO:
    """
    Register a new user account.

    Args:
        data (dict): The user data(username, email, password)
        lang (str) : Specific language selector

    Raises:
        HTTPException: If the account already exists or if there are issues during registration.
    """
    try:
        return await account_service.create_account(data)
    except HTTPException as e:
        return JSONResponse(status_code=e.status_code, content={"code": e.detail})
    except Exception:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={"code": "GENERAL_ERROR"}
        )


@router.post("/request-email", status_code=status.HTTP_200_OK, response_model=None)
async def request_email(
    res: Response,
    data: GeneralAccountDTO = Depends(validate_account),
    lang: str = Query("en"),
) -> GeneralAccountDTO:
    try:
        print("request-email()", data)
        access_token = await auth_service.set_token_cookies(res, data.account_id)
        await email_service.send_verification_email(data, lang, access_token)
        data.access_token = access_token
        return data
    except HTTPException as e:
        return JSONResponse(status_code=e.status_code, content={"code": e.detail})
    except Exception:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={"code": "GENERAL_ERROR"}
        )


@router.get("/verify-email", status_code=status.HTTP_200_OK, response_model=None)
async def verify_email(res: Response, token: str, lang: str = Query("en")):
    try:
        print(token, lang)
        return await email_service.verify_email(res, token, lang)
    except HTTPException as e:
        return JSONResponse(status_code=e.status_code, content={"code": e.detail})
    except Exception:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={"code": "GENERAL_ERROR"}
        )


@router.post("/login", status_code=status.HTTP_200_OK, response_model=None)
async def login(res: Response, data: CredentialAccountDTO) -> GeneralAccountDTO:
    try:
        return await auth_service.authenticate(res, data)
    except HTTPException as e:
        return JSONResponse(status_code=e.status_code, content={"code": e.detail})
    except Exception as e:
        print("e2", e)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={"code": "GENERAL_ERROR"}
        )


@router.delete("/logout", status_code=status.HTTP_200_OK, response_model=None)
async def logout(res: Response, accessToken: str = Cookie(None)):
    try:
        print("logout():", accessToken)
        return await auth_service.logout(res, accessToken)
    except HTTPException as e:
        return JSONResponse(status_code=e.status_code, content={"code": e.detail})
    except Exception:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={"code": "GENERAL_ERROR"}
        )


@router.post("/refresh", status_code=status.HTTP_200_OK, response_model=None)
async def refresh(res: Response, refresh_token: str = Cookie(None)):
    print("refresh():", refresh_token)
    return await auth_service.refresh(res, refresh_token)


# TODO: data validation: email
@router.post("/forgot-password", status_code=status.HTTP_200_OK, response_model=None)
async def forgot_password(data: dict, lang: str = Query("en")) -> None:
    try:
        (email,) = data.values()
        print("forgot-password():", data, lang, email)

        account = await account_service.get_account_by_email(email)
        account_id = account["account_id"]
        token_info = auth_service.create_access_token(account_id, timedelta(hours=24))
        await email_service.send_password_reset_email(
            {"email": email}, lang, token_info["accessToken"]
        )
    except HTTPException as e:
        return JSONResponse(status_code=e.status_code, content={"code": e.detail})
    except Exception:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={"code": "GENERAL_ERROR"}
        )


@router.get("/reset-password", status_code=status.HTTP_200_OK, response_model=None)
async def reset_password(res: Response, token: str, lang: str = Query("en")) -> None:
    print("reset-password():", token, lang)

    if token is None:
        redirect_url = f"{NGINX_HOST}/{lang}/auth/forgot-passord"
        return RedirectResponse(url=redirect_url, headers=res.headers)
    payload = auth_service.decode_token(token)
    # TODO: token 만료 시 redirection
    if payload is None:
        redirect_url = f"{NGINX_HOST}/{lang}/auth/forgot-password"
        return RedirectResponse(url=redirect_url, headers=res.headers)
    account_id = payload["account_id"]
    await auth_service.set_token_cookies(res, account_id)
    redirect_url = f"{NGINX_HOST}/{lang}/auth/reset-password"
    return RedirectResponse(url=redirect_url, headers=res.headers)
