import os
from enum import Enum


class AccountStatus(Enum):
    PENDING_VERIFICATION = "pending_verification"
    INCOMPLETE_SOCIAL = "incomplete_social"
    INCOMPLETE_PROFILE = "incomplete_profile"
    ONLINE = "online"
    OFFLINE = "offline"


DEFAULT_MAX = 20
DEFAULT_MIN = 2

NGINX_HOST = os.getenv("NGINX_HOST")
BACK_HOST = os.getenv("BACK_HOST")
FRONT_HOST = os.getenv("FRONT_HOST")
DOMAIN = os.getenv("DOMAIN")
ENV = "development"  # "production"

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

# Google email
GMAIL_ID = os.getenv("GMAIL_ID")
GMAIL_PASSWORD = os.getenv("GMAIL_PASSWORD")

# Google oauth

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
# GOOGLE_CALLBACK_URL = os.getenv("GOOGLE_CALLBACK_URL")
# GOOGLE_CALLBACK_URL = NGINX_HOST + "/auth/google/callback"
GOOGLE_CALLBACK_URL = "http://localhost:8080/auth/google/callback"
