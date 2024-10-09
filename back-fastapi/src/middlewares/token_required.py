


from functools import wraps
from typing import Any, Callable
from fastapi import HTTPException, Response, status
from fastapi.responses import RedirectResponse

import src.services.auth_service as auth_service

def token_required(redirect_url: str = None):
    def decorator(func: Callable[..., Any]) -> Callable[..., Any]:
        @wraps(func)
        async def wrapper(res: Response, *args, **kwargs):
            token = res.headers.get("Authorization")
            print("token_required()", token)
            if token is None or not token.startswith("Bearer "):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Token is required",
                )
            token = token.split(" ")[1]
            payload = auth_service.decode_token(token)

            # token 만료시
            if payload is None:
                if redirect_url is not None:
                    return RedirectResponse(url=redirect_url, headers=res.headers)
                else:
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="Token has expired"
                    )
            kwargs["account_id"] = payload["accountId"]
            return await func(res, *args, **kwargs)
        return wrapper
    return decorator