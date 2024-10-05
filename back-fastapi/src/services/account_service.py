from fastapi import HTTPException, status
import src.services.auth_service as auth_service
import src.repositories.account_repository as account_repository


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
            detail="All fields are required",
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY
        )
    await account_repository.check_account(username, email)

async def create_account(username: str, email: str, password:str, user_status:str) -> int:
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
    print("create_account(): ", username, email, password, user_status)

    if not password:
        raise HTTPException(
            detail="Password can not be empty",
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY
        )
    hashed_password = auth_service.hash_password(password)
    print("all passed", hashed_password)

    return await account_repository.create_account(username, email, hashed_password, user_status)