from functools import wraps
from typing import Any, Callable

import src.services.auth_service as auth_service
from fastapi import HTTPException, Request, status
from fastapi.responses import RedirectResponse


def token_required(redirect_url: str = None):
    def decorator(func: Callable[..., Any]) -> Callable[..., Any]:
        # print("token_required() decorator", func.__annotations__)
        @wraps(func)
        async def wrapper(req: Request, *args, **kwargs):
            # print("token_required() wrapper", args, kwargs)
            token = req.headers.get("Authorization")
            print("token_required() token:", token)
            cookie_header = req.headers.get("cookie")
            if cookie_header:
                cookies = {
                    cookie.split("=")[0]: cookie.split("=")[1]
                    for cookie in cookie_header.split("; ")
                }
                token = cookies.get("accessToken")
            print("token_required() token:", token)

            if token is None:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Token is required",
                )
            if token.startswith("Bearer "):
                token = token.split(" ")[1]
            payload = auth_service.decode_token(token)

            print("token_required() payload:", payload)
            # token 만료시
            if payload is None:
                if redirect_url is not None:
                    return RedirectResponse(url=redirect_url, headers=req.headers)
                else:
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has expired"
                    )
            kwargs["data"]["account_id"] = payload["accountId"]
            return await func(req, *args, **kwargs)

        return wrapper

    return decorator