import re

from constants import DEFAULT_MAX, DEFAULT_MIN
from fastapi import HTTPException

from src.models.dto import GeneralAccountDTO, RegisterAccountDTO


def validate_string_field(value: str, field_name: str, min_length: int, max_length: int) -> None:
    """
    Reusable validation function for string fields.

    Args:
        value (str): The value of the field to validate.
        field_name (str): The name of the field (e.g., 'username', 'email').
        min_length (int): The minimum length for the field.
        max_length (int): The maximum length for the field.

    Raises:
        HTTPException: If validation fails.
    """
    if len(value) == 0:
        raise HTTPException(status_code=400, detail=f"{field_name} is required")
    elif len(value) < min_length:
        raise HTTPException(
            status_code=400, detail=f"{field_name} must be at least {min_length} characters long"
        )
    elif len(value) > max_length:
        raise HTTPException(
            status_code=400, detail=f"{field_name} must be less than {max_length} characters long"
        )


def validate_email(email: str) -> None:
    re_pattern = r"^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$"  # Updated regex to match JS pattern

    # maximum email address is set 50 chars on DB.
    validate_string_field(email, "email", DEFAULT_MIN, 50)
    if not re.match(re_pattern, email):
        raise HTTPException(status_code=400, detail="Invalid email format")

    # if option and option.get("prev_email") == email:
    #     return  # Email hasn't changed

    # # Simulate a database check for an existing email
    # user_exists = False  # Change this as per your query logic
    # if user_exists:
    #     raise HTTPException(status_code=400, detail="Email is already taken")


def validate_username(username: str) -> None:
    validate_string_field(username, "username", DEFAULT_MIN, DEFAULT_MAX)


def validate_password(password: str) -> None:
    re_pattern = r"(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}"

    if len(password) == 0:
        raise HTTPException(status_code=400, detail="password is required")
    # didn't use validate_string_field as regex handles min
    if not re.match(re_pattern, password):
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 8 characters long and include an uppercase letter,"
            + " a lowercase letter, a digit, and a special character.",
        )


# def validate_languages(languages: List[str]) -> None:
#     if len(languages) == 0:
#         raise HTTPException(status_code=400, detail="Languages are required")
#     elif len(languages) > 3:
#         raise HTTPException(status_code=400, detail="You can specify at most 3 languages")


# def validate_biography(biography: str) -> None:
#     if len(biography) == 0:
#         raise HTTPException(status_code=400, detail="Biography is required")
#     elif len(biography) > 150:
#         raise HTTPException(status_code=400, detail="Biography is too long")


# def validate_birthdate(birthdate: str) -> None:
#     age = AgeCalculator.get_age(datetime.strptime(birthdate, "%Y-%m-%d"))
#     if age < 18:
#         raise HTTPException(status_code=400, detail="You must be at least 18 years old")


def validate_account_register(data: RegisterAccountDTO) -> RegisterAccountDTO:
    validate_email(data.email)
    # need to choose
    # validate_username(data.username)
    validate_string_field(data.username, "username", DEFAULT_MIN, DEFAULT_MAX)
    validate_password(data.password)
    return data

def validate_account(data: GeneralAccountDTO) -> GeneralAccountDTO:
    validate_email(data.email)
    # need to choose
    # validate_username(data.username)
    validate_string_field(data.username, "username", DEFAULT_MIN, DEFAULT_MAX)
    return data
