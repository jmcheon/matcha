from typing import Dict, Any
from jose import JWTError, jwt
from fastapi import Response, HTTPException, status
from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone

from constants import JWT_SECRET, JWT_ACCESS_DURATION, JWT_REFRESH_DURATION, DOMAIN, ENV
import src.services.account_service as account_service

# Password hasing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

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

def decode_token(token: str):
    try:
        payload = jwt.decode(token, JWT_SECRET)
        return payload
    except JWTError as e:
        print("JWTError:", e)
        return None