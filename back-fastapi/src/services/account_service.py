from typing import Optional

import src.repositories.account_repository as account_repository
import src.services.auth_service as auth_service
from constants import AccountStatus
from fastapi import HTTPException, status
from src.models.dto import AccountDTO, RegisterAccountDTO


async def create_account(data: RegisterAccountDTO) -> RegisterAccountDTO:
    """
    Create a new account after checking for existing username and email.

    Args:
        username (str): The desired username for the new account.
        email (str): The email address for the new account.
        password (str): The password for the new account.

    Raises:
        HTTPException: If there are issues during account creation.

    Returns:
        account_id (int): Created account id
    """
    print("create_account(): ", data.username, data.email, data.password)
    await account_repository.check(data.username, data.email)
    hashed_password = auth_service.hash_password(data.password)
    account_id = await account_repository.create(
        data.username, data.email, hashed_password, AccountStatus.PENDING_VERIFICATION.value
    )

    result = RegisterAccountDTO(
        account_id=account_id,
        status=AccountStatus.PENDING_VERIFICATION.value,
        username=data.username,
        email=data.email,
        password=None,  # Exclude the password in the response for security reasons
    )
    return result


async def update_account_status(account_id: int, account_status: str) -> None:
    """
    Update the status of an account.

    Args:
        account_id (int): The ID of the account to update.
        account_status (str): The new status to set for the account.

    Raises:
        HTTPException: If the account status is invalid.
    """
    try:
        AccountStatus(account_status)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid account status: {account_status}."
            + " Must be one of {[status.value for status in AccountStatus]}",
        )
    await get_account_by_id(account_id)
    await account_repository.update_status(account_id, account_status)


async def update_account_refresh_token(account_id: int, token: str) -> None:
    """
    Update the refresh token of an account."

    Args:
        account_id (int): The ID of the account to update.
        token (str): The new refresh token to set for the account.

    Raises:
        HTTPException: If the account refresh token is invalid.
    """
    if token is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid token")
    await get_account_by_id(account_id)
    await account_repository.update_refresh_token(account_id, token)


async def update_account_password(account_id: str, password: str) -> None:
    """
    Update the password of an account.

    Args:
        account_id (int): The ID of the account to update.
        password (str): The new password to set for the account.

    Raises:
        HTTPException: Any bad requests.
    """
    if password is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid password")
    hashed_password = auth_service.hash_password(password)

    await get_account_by_id(account_id)
    await account_repository.update_password(account_id, hashed_password)


async def get_account_by_id(account_id: int) -> Optional[dict]:
    """
    Retrieve an account by its ID.

    Args:
        account_id (int): The ID of the account to retrieve.

    Returns:
        Optional[dict]: A dictionary containing the account details or None if account not found.

    Raises:
        HTTPException: Any bad requests.
    """
    account = await account_repository.get_by_id(account_id)
    if account is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="INVALID_USER_CREDENTIALS"
        )
    return account


async def get_account_by_email(email: str) -> Optional[AccountDTO]:
    """
    Retrieve an account by its email.

    Args:
        email (str): The email of the account to retrieve.

    Returns:
        dict: A dictionary containing the account details.

    Raises:
        HTTPException: Any bad requests.
    """
    account = await account_repository.get_by_email(email)
    if account is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="INVALID_USER_CREDENTIALS"
        )
    return account


async def get_account_status(account_id: int) -> str:
    """
    Retrieve the account status by its ID.

    Args:
        account_id (int): The ID of the account to retrieve.

    Returns:
        str: The retrieved account status.

    Raises:
        HTTPException: Any bad requests.
    """
    account = await account_repository.get_by_id(account_id)
    if account is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="INVALID_USER_CREDENTIALS"
        )
    return account["status"]
