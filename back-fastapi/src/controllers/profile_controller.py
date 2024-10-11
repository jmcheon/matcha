from typing import Optional

import src.repositories.profile_repository as profile_repository
import src.services.auth_service as auth_service
import src.services.profile_service as profile_service
from fastapi import APIRouter, Cookie, Depends, HTTPException, Response, status
from fastapi.responses import JSONResponse
from src.models.dtos.profile_dto import GenerateProfileDTO, ProfileDTO
from src.models.validators import validate_profile_generate

router = APIRouter(tags=["Profile"])


# TODO: token validation
@router.get("/profile", status_code=status.HTTP_200_OK, response_model=None)
async def get_profile(res: Response, access_token: str = Cookie(None)) -> Optional[ProfileDTO]:
    if access_token is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Token is required",
        )
    try:
        payload = auth_service.decode_token(access_token)
        profile: ProfileDTO = await profile_repository.get_by_account_id(payload["account_id"])
        if not profile:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="PROFILE_NOT_FOUND")
        return profile
    except HTTPException as e:
        print("e is here", e)
        return JSONResponse(status_code=e.status_code, content={"code": e.detail})
    except Exception:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={"code": "GENERAL_ERROR"}
        )


# TODO: token validation / profile field validation / account existence verification
@router.post("/profile", status_code=status.HTTP_200_OK, response_model=None)
async def generate_profile(
    res: Response,
    data: GenerateProfileDTO = Depends(validate_profile_generate),
    access_token: str = Cookie(None),
) -> Optional[dict]:
    if access_token is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Token is required",
        )
    try:
        payload = auth_service.decode_token(access_token)
        profile: ProfileDTO = await profile_service.generate_profile(payload["account_id"], data)
        return profile
    except Exception:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={"code": "GENERAL_ERROR"}
        )
