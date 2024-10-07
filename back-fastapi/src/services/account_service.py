from typing import Any, Dict, Optional

import src.repositories.account_repository as account_repository
import src.services.auth_service as auth_service
from constants import AccountStatus
from fastapi import HTTPException, status


async def check_account(username: str, email: str) -> None: 
    """
    Check if an account already exists for the given username or email.

    Args:
        username (str): The username to check.
        email (str): The email to check.

    Raises:
        HTTPException: If the username or email already exists in the database
                        with a 409 Conflict status code.
    """
    if not (username or email):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="All fields are required",
        )
    await account_repository.check(username, email)

async def create_account(username: str, email: str, password:str) -> int:
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
    print("create_account(): ", username, email, password)
    await check_account(username, email)


    if not password:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Password can not be empty",
        )
    hashed_password = auth_service.hash_password(password)
    print("all passed", hashed_password)

    return await account_repository.create(
        username, 
        email, 
        hashed_password, 
        AccountStatus.PENDING_VERIFICATION.value
        )

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
            detail=f"Invalid account status: {account_status}. Must be one of {[status.value for status in AccountStatus]}",
        )
    await get_account_by_id(account_id)
    await account_repository.update_status(account_id, account_status)

async def update_account_refresh_token(account_id: int, token: str) -> None:
    """
    Update the refresh token of an account.

    Args:
        account_id (int): The ID of the account to update.
        token (str): The new refresh token to set for the account.

    Raises:
        HTTPException: If the account refresh token is invalid.
    """
    if token is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid token"
        )
    await get_account_by_id(account_id)
    await account_repository.update_refresh_token(account_id, token)

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
    return await account_repository.get_by_id(account_id)

async def get_account_by_username(username: str) -> Optional[dict]:
    """
    Retrieve an account by its username.

    Args:
        username (str): The username of the account to retrieve.

    Returns:
        Optional[dict]: A dictionary containing the account details or None if account not found.

    Raises:
        HTTPException: Any bad requests.
    """
    return await account_repository.get_by_username(username)

async def get_account_by_email(email: str) -> Optional[dict]:
    """
    Retrieve an account by its email.

    Args:
        email (str): The email of the account to retrieve.

    Returns:
        Optional[dict]: A dictionary containing the account details or None if account not found.

    Raises:
        HTTPException: Any bad requests.
    """
    return await account_repository.get_by_email(email)

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
    if not account:
        HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account not found"
        )
    return account["status"]