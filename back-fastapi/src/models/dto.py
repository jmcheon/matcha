from dataclasses import dataclass
from datetime import datetime
from typing import Any, Dict, Optional

from constants import AccountStatus


@dataclass
class AccountDTO:
    status: Optional[AccountStatus] = None
    created_at: Optional[datetime] = None
    accountId: Optional[int] = None
    username: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None
    google_id: Optional[str] = None
    intra42_id: Optional[str] = None
    github_id: Optional[str] = None
    last_modified_at: Optional[datetime] = None
    deleted_at: Optional[datetime] = None
    accessToken: Optional[str] = None
    refreshToken: Optional[str] = None
    google_access_token: Optional[str] = None
    google_refresh_token: Optional[str] = None
    github_access_token: Optional[str] = None
    github_refresh_token: Optional[str] = None
    intra42_access_token: Optional[str] = None
    intra42_refresh_token: Optional[str] = None

    def __post_init__(self):
        # Remove attributes with None values after initialization
        keys_to_remove = [key for key, value in self.__dict__.items() if value is None]
        for key in keys_to_remove:
            delattr(self, key)

    def to_dict(self):
        return {k: v for k, v in self.__dict__.items() if v is not None}

    def __repr__(self):
        # Custom __repr__ to exclude None attributes when printing
        cls = self.__class__.__name__
        attrs = {k: v for k, v in self.__dict__.items() if v is not None}
        attrs_str = ", ".join(f"{key}={value!r}" for key, value in attrs.items())
        return f"{cls}({attrs_str})"

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "AccountDTO":
        def map_account_fields(db_record: Dict[str, Any]) -> Dict[str, Any]:
            mapping = {
                "account_id": "accountId",
                "username": "username",
                "email": "email",
                "password": "password",
                "google_id": "google_id",
                "intra42_id": "intra42_id",
                "github_id": "github_id",
                "refresh_token": "refreshToken",
                "google_access_token": "google_access_token",
                "google_refresh_token": "google_refresh_token",
                "github_access_token": "github_access_token",
                "github_refresh_token": "github_refresh_token",
                "intra42_access_token": "intra42_access_token",
                "intra42_refresh_token": "intra42_refresh_token",
                "status": "status",
                "created_at": "created_at",
                "last_modified_at": "last_modified_at",
                "deleted_at": "deleted_at",
                "access_token": "accessToken",
            }

            return {mapping.get(k, k): v for k, v in db_record.items()}

        # Optionally map database fields to DTO fields
        mapped_data = map_account_fields(data)
        # Handle datetime fields if they are strings or need conversion
        for field_name, field_type in cls.__annotations__.items():
            if field_type is Optional[datetime] and field_name in mapped_data:
                if isinstance(mapped_data[field_name], str):
                    # Convert string to datetime
                    mapped_data[field_name] = datetime.fromisoformat(mapped_data[field_name])
        return cls(**mapped_data)


# @dataclass
# class RegisterAccountDTO(AccountDTO):
#     # Override the init method to exclude unwanted fields
#     username: str
#     email: str
#     status: Optional[AccountStatus]
#     password: Optional[str]
#     accountId: Optional[int]


@dataclass
class RegisterAccountDTO:
    username: str
    email: str
    password: Optional[str] = None
    status: Optional[AccountStatus] = None
    accountId: Optional[int] = None
    accessToken: Optional[str] = None


@dataclass
class CredentialAccountDTO(AccountDTO):
    username: str
    password: str


# @dataclass
# class DetailedAccountDTO(AccountDTO):
#     first_name: str
#     last_name: str
