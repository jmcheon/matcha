import src.repositories.profile_repository as profile_repository
from src.models.dtos.profile_dto import GenerateProfileDTO, ProfileDTO


async def generate_profile(account_id: int, data: GenerateProfileDTO) -> ProfileDTO:
    await profile_repository.insert_profile(account_id, data)
    profile = await profile_repository.get_profile(account_id)

    return profile.to_dict()
