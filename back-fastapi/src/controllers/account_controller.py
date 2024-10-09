from typing import Optional

import src.services.account_service as account_service
from fastapi import APIRouter, HTTPException, Request, status
from src.middlewares.token_required import token_required

router = APIRouter(tags=["Account"])


@router.get("/account/{account_id}", status_code=status.HTTP_200_OK, response_model=None)
async def get_account_by_id(account_id: int) -> Optional[dict]:
    account = await account_service.get_account_by_id(account_id)
    if not account:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Account not found")


# TODO: data validation: account_id, new_password, confirm_password
@router.post("/update-password/", status_code=status.HTTP_200_OK, response_model=None)
@token_required()
async def update_account_password(req: Request, data: dict) -> Optional[dict]:
    print("update_account_password()", data)
    new_password, confirm_password, account_id = data.values()
    if new_password != confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Passwords do not match"
        )
    await account_service.update_account_password(account_id, new_password)
