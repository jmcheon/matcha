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
        for key in list(self.__dict__.keys()):
            if getattr(self, key) is None:
                delattr(self, key)

    def __repr__(self):
        # Custom __repr__ to exclude None attributes when printing
        cls = self.__class__.__name__
        attrs = {k: v for k, v in self.__dict__.items() if v is not None}
        attrs_str = ", ".join(f"{key}={value!r}" for key, value in attrs.items())
        return f"{cls}({attrs_str})"


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
