from functools import wraps
from typing import Any, Callable

import src.services.auth_service as auth_service
from constants import NGINX_HOST
from fastapi import HTTPException, Request, Response, status
from fastapi.responses import RedirectResponse


def guard(redirect_path: str = None):
    def decorator(func: Callable[..., Any]) -> Callable[..., Any]:
        print("guard() decorator", func.__annotations__)

        @wraps(func)
        async def wrapper(res: Response, req: Request, *args, **kwargs):
            print("guard() wrapper", args, kwargs)
            token = req.headers.get("Authorization")
            print("guard() token:", token)
            cookie_header = req.headers.get("cookie")
            if cookie_header:
                cookies = {
                    cookie.split("=")[0]: cookie.split("=")[1]
                    for cookie in cookie_header.split("; ")
                }
                token = cookies.get("access_token")
            print("guard() token:", token)

            if token is None:
                if redirect_path is not None:
                    return RedirectResponse(
                        url=f"{NGINX_HOST}/{kwargs['lang']}/{redirect_path}", headers=req.headers
                    )
                else:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Token is required",
                    )
            if token.startswith("Bearer "):
                token = token.split(" ")[1]
            payload = auth_service.decode_token(token)

            print("guard() payload:", payload)
            # token 만료시
            if payload is None:
                if redirect_path is not None:
                    return RedirectResponse(
                        url=f"{NGINX_HOST}/{kwargs['lang']}/{redirect_path}", headers=req.headers
                    )
                else:
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has expired"
                    )
            # kwargs["data"]["account_id"] = payload["account_id"]
            return await func(res, req, *args, **kwargs)

        return wrapper

    return decorator
