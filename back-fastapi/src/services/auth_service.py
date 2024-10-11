from datetime import datetime, timedelta, timezone
from typing import Optional

import src.repositories.account_repository as account_repository
import src.services.account_service as account_service
from constants import (
    DOMAIN,
    ENV,
    JWT_ACCESS_DURATION,
    JWT_REFRESH_DURATION,
    JWT_SECRET,
    AccountStatus,
)
from fastapi import HTTPException, Response, status
from jose import ExpiredSignatureError, JWTError, jwt
from passlib.context import CryptContext
from src.models.dto import AccountDTO, CredentialAccountDTO

# Password hasing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


async def authenticate(res: Response, data: CredentialAccountDTO) -> AccountDTO:
    account: AccountDTO = await account_repository.get_by_username(data.username)
    if not account:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="INVALID_LOGIN"
        )
    hashed_password = account.password
    verified = verify_password(data.password, hashed_password)
    if verified is False:
        HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail={"code": "INVALID_USER_CREDENTIALS"}
        )
    account: AccountDTO = await account_repository.authenticate(data.username, hashed_password)
    if not account:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="INVALID_USER_CREDENTIALS"
        )
    account.access_token = await set_token_cookies(res, account.account_id)
    if account.status == AccountStatus.OFFLINE.value:
        await account_service.update_account_status(account.account_id, AccountStatus.ONLINE.value)
    return account.to_dict()


async def logout(res: Response, token: str):
    if not token:
        return {"success": "Logged out"}

    try:
        payload = jwt.decode(token, JWT_SECRET)
        account_id = payload["account_id"]

        await save_refresh_token(account_id, "")
        account_status = await account_service.get_account_status(account_id)
        if account_status is AccountStatus.ONLINE.value:
            await account_service.update_account_status(account_id, AccountStatus.OFFLINE.value)

        res.delete_cookie(key="access_token", domain=DOMAIN, httponly=True, path="/")
        res.delete_cookie(key="refresh_token", domain=DOMAIN, httponly=True, path="/")
    except ExpiredSignatureError or JWTError:
        pass
    print("loggingout")
    return {"success": "Logged out"}


async def refresh(res: Response, token: str) -> dict:
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    try:
        payload = jwt.decode(token, JWT_SECRET)
        account_id = payload["account_id"]

        res.delete_cookie(key="access_token", domain=DOMAIN, httponly=True, path="/")
        res.delete_cookie(key="refresh_token", domain=DOMAIN, httponly=True, path="/")

        access_token = await set_token_cookies(res, account_id)
        account = await account_service.get_account_by_id(account_id)
        if not account:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Account not found")

    except ExpiredSignatureError or JWTError:
        pass
    print("refresh", access_token)
    return account.update({"access_token": access_token})


def create_access_token(account_id: int, expire_delta: timedelta = None) -> str:
    payload = {"account_id": account_id}
    if expire_delta:
        expire = datetime.now(timezone.utc) + expire_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=JWT_ACCESS_DURATION)
    payload.update({"exp": expire})
    token = jwt.encode(payload, JWT_SECRET)

    cookie_options = {
        "domain": DOMAIN,
        "path": "/",
        "httponly": True,
        "secure": ENV == "production",
        "expires": expire,
    }
    # print("encoded access token:", token, payload, expire)

    return {"access_token": token, "options": cookie_options}


def create_refresh_token(account_id: int, expire_delta: timedelta = None) -> str:
    payload = {"account_id": account_id}
    if expire_delta:
        expire = datetime.now(timezone.utc) + expire_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=JWT_REFRESH_DURATION)
    payload.update({"exp": expire})
    token = jwt.encode(payload, JWT_SECRET)

    cookie_options = {
        "domain": DOMAIN,
        "path": "/",
        "httponly": True,
        "secure": ENV == "production",
        "expires": expire,
    }

    return {"refresh_token": token, "options": cookie_options}


async def save_refresh_token(account_id: int, refresh_token: str) -> None:
    await account_service.get_account_by_id(account_id)
    await account_service.update_account_refresh_token(account_id, refresh_token)


async def set_token_cookies(res: Response, account_id: int) -> str:
    try:
        # account check
        await account_service.get_account_by_id(account_id)

        access_token_info = create_access_token(account_id)
        refresh_token_info = create_refresh_token(account_id)

        res.set_cookie(
            key="access_token",
            value=access_token_info["access_token"],
            httponly=access_token_info["options"]["httponly"],
            secure=access_token_info["options"]["secure"],
            expires=access_token_info["options"]["expires"],
        )
        res.set_cookie(
            key="refresh_token",
            value=refresh_token_info["refresh_token"],
            httponly=refresh_token_info["options"]["httponly"],
            secure=refresh_token_info["options"]["secure"],
            expires=refresh_token_info["options"]["expires"],
        )

        await save_refresh_token(account_id, refresh_token_info["refresh_token"])
    except Exception:
        raise HTTPException(
            detail="Error generating tokens",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    return access_token_info["access_token"]


def decode_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, JWT_SECRET)
        return payload
    except JWTError as e:
        print("JWTError:", e)
        return None
