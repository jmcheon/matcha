from typing import Optional

import src.repositories.profile_repository as profile_repository
import src.services.auth_service as auth_service
from fastapi import APIRouter, Cookie, HTTPException, Response, status
from fastapi.responses import JSONResponse

router = APIRouter(tags=["Profile"])


@router.get("/profile", status_code=status.HTTP_200_OK, response_model=None)
async def get_profile(res: Response, accessToken: str = Cookie(None)) -> Optional[dict]:
    if accessToken is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Token is required",
        )
    payload = auth_service.decode_token(accessToken)
    print("payload bitch", payload)
    account = await profile_repository.get_by_account_id(1)
    if not account:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Account not found")


@router.post("/profile", status_code=status.HTTP_200_OK, response_model=None)
async def generate_profile(res: Response, accessToken: str = Cookie(None)) -> Optional[dict]:
    if accessToken is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Token is required",
        )
    try:
        payload = auth_service.decode_token(accessToken)
        print("payload", payload)
        return None
    except Exception:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={"code": "GENERAL_ERROR"}
        )


# # TODO: data validation: account_id, new_password, confirm_password
# @router.post("/update-password/", status_code=status.HTTP_200_OK, response_model=None)
# @token_required()
# async def update_account_password(req: Request, data: dict) -> Optional[dict]:
#     print("update_account_password()", data)
#     new_password, confirm_password, account_id = data.values()
#     if new_password != confirm_password:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST, detail="Passwords do not match"
#         )
#     await account_service.update_account_password(account_id, new_password)
