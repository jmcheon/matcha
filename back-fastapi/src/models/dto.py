from dataclasses import dataclass
from datetime import datetime
from typing import Optional

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
    access_token: Optional[str] = None
    refresh_token: Optional[str] = None
    google_access_token: Optional[str] = None
    google_refresh_token: Optional[str] = None
    github_access_token: Optional[str] = None
    github_refresh_token: Optional[str] = None
    intra42_access_token: Optional[str] = None
    intra42_refresh_token: Optional[str] = None

    def __post_init__(self):
        # Remove attributes with None values after initialization
        to_remove = [key for key, value in self.__dict__.items() if value is None]
        for key in to_remove:
            delattr(self, key)

    def __repr__(self):
        # Custom __repr__ to exclude None attributes when printing
        attrs = ", ".join(f"{k}={v!r}" for k, v in self.__dict__.items())
        return f"{self.__class__.__name__}({attrs})"


@dataclass
class RegisterAccountDTO:
    # Override the init method to exclude unwanted fields
    username: str
    email: str
    password: Optional[str] = None
    status: Optional[AccountStatus] = None
    accountId: Optional[int] = None
    accessToken: Optional[str] = None


# @dataclass
# class DetailedAccountDTO(AccountDTO):
#     first_name: str
#     last_name: str
