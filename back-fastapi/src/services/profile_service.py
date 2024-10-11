import src.repositories.account_repository as account_repository
import src.repositories.profile_repository as profile_repository
from constants import AccountStatus
from fastapi import HTTPException, status
from src.models.dtos.account_dto import AccountDTO
from src.models.dtos.profile_dto import GenerateProfileDTO, ProfileDTO


async def generate_profile(account_id: int, data: GenerateProfileDTO) -> ProfileDTO:
    account: AccountDTO = await account_repository.get_by_id(account_id)
    if not account:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="INVALID_USER_CREDENTIALS"
        )
    existingProfile: ProfileDTO = await profile_repository.get_by_account_id(account_id)
    if existingProfile:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="EMAIL_ALREADY_EXISTS")

    await profile_repository.insert_profile(account_id, data)

    await account_repository.update_status(account_id, AccountStatus.ONLINE.value)

    profile = await profile_repository.get_profile(account_id)

    return profile.to_dict()
