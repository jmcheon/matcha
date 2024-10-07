import os
from enum import Enum


class AccountStatus(Enum):
    PENDING_VERIFICATION = "pending_verification"
    INCOMPLETE_PROFILE = "incomplete_profile"
    LOGIN = "login"
    LOGOUT = "logout"

NGINX_HOST = os.getenv("NGINX_HOST")
BACK_HOST = os.getenv("BACK_HOST")
DOMAIN = os.getenv("DOMAIN")
ENV = "development" # "production"

# Get database info from .env
DB_PORT = int(os.getenv("DB_PORT"))
DB_HOST = os.getenv("MYSQL_HOST")
DB_USER = os.getenv("MYSQL_USER")
DB_PASSWORD = os.getenv("MYSQL_PASSWORD")
DB_DATABASE = os.getenv("MYSQL_DATABASE")

# Secret key for encoding and decoding JWT
JWT_SECRET = os.getenv("JWT_SECRET", "i_do_not_care_anymore")
JWT_ACCESS_DURATION = int(os.getenv("JWT_ACCESS_DURATION"))
JWT_REFRESH_DURATION = int(os.getenv("JWT_REFRESH_DURATION"))

# google email
GMAIL_ID = os.getenv("GMAIL_ID")
GMAIL_PASSWORD = os.getenv("GMAIL_PASSWORD")

