from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional

import src.repositories.account_repository as account_repository
import src.services.account_service as account_service
from constants import (DOMAIN, ENV, JWT_ACCESS_DURATION, JWT_REFRESH_DURATION,
                       JWT_SECRET, AccountStatus)
from fastapi import HTTPException, Response, status
from jose import ExpiredSignatureError, JWTError, jwt
from passlib.context import CryptContext

# Password hasing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


async def authenticate(res: Response, username: str, password: str) -> dict:
    account = await account_service.get_account_by_username(username)
    if not account:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Invalid login credentials"
        )
    hashed_password = account["password"]
    verified = verify_password(password, hashed_password)
    if verified is False:
        HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid password"
        )
    account = await account_repository.authenticate(username, hashed_password)
    if not account:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="Invalid login credentials"
            )
    account_id = account["account_id"]
    access_token = await set_token_cookies(res, account_id)
    account_status = account_service.get_account_status(account_id)
    if account_status == AccountStatus.LOGOUT.value:
        await account_service.update_account_status(account_id, AccountStatus.LOGIN.value)
    return {
        "accountId": account_id,
        "username": username,
        "accessToken": access_token
    }

async def logout(res: Response, token: str):
    if not token:
        return {"success": "Logged out"}

    try:
        payload = jwt.decode(token, JWT_SECRET)
        account_id = payload["accountId"]

        await save_refresh_token(account_id, "")
        account_status = await account_service.get_account_status(account_id)
        if account_status is AccountStatus.LOGIN.value:
            await account_service.update_account_status(account_id, AccountStatus.LOGOUT.value)

        res.delete_cookie(key="accessToken", domain=DOMAIN, httponly=True, path='/')
        res.delete_cookie(key="refreshToken", domain=DOMAIN, httponly=True, path='/')
    except ExpiredSignatureError or JWTError:
        pass
    print("loggingout")
    return {"success": "Logged out"}

async def refresh(res: Response, token: str) -> dict:
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )

    try:
        payload = jwt.decode(token, JWT_SECRET)
        account_id = payload["accountId"]

        res.delete_cookie(key="accessToken", domain=DOMAIN, httponly=True, path='/')
        res.delete_cookie(key="refreshToken", domain=DOMAIN, httponly=True, path='/')

        access_token = await set_token_cookies(res, account_id)
        account = await account_service.get_account_by_id(account_id)
        if not account:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Account not found"
            )

    except ExpiredSignatureError or JWTError:
        pass
    print("refresh", access_token)
    return account.update({"accessToken": access_token})

def create_access_token(account_id: int, expire_delta: timedelta=None) -> str:
    payload = {"accountId": account_id}
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
        "expires": expire
    }
    # print("encoded access token:", token, payload, expire)
    
    return {
        "accessToken": token,
        "options": cookie_options
    }

def create_refresh_token(account_id: int, expire_delta: timedelta=None) -> str:
    payload = {"accountId": account_id}
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
        "expires": expire
    }
    
    return {
        "refreshToken": token,
        "options": cookie_options
    }

async def save_refresh_token(account_id: int, refresh_token: str) -> None:
    await account_service.get_account_by_id(account_id)
    await account_service.update_account_refresh_token(account_id, refresh_token)

async def set_token_cookies(res: Response, account_id: int) -> str:
    try:
        # account check
        await account_service.get_account_by_id(account_id)

        access_token_info = create_access_token(account_id)
        refresh_token_info = create_refresh_token(account_id)

        res.set_cookie(key="accessToken", value=access_token_info["accessToken"],
                        httponly=access_token_info["options"]["httponly"], 
                        secure=access_token_info["options"]["secure"],
                        expires=access_token_info["options"]["expires"])
        res.set_cookie(key="refreshToken", value=refresh_token_info["refreshToken"],
                        httponly=refresh_token_info["options"]["httponly"], 
                        secure=refresh_token_info["options"]["secure"],
                        expires=refresh_token_info["options"]["expires"])

        await save_refresh_token(account_id, refresh_token_info["refreshToken"])
    except Exception as e:
        raise HTTPException(
            detail="Error generating tokens",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    return access_token_info["accessToken"]

def decode_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, JWT_SECRET)
        return payload
    except JWTError as e:
        print("JWTError:", e)
        return None