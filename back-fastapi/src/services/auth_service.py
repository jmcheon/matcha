from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
import os

# Secret key for encoding and decoding JWT
JWT_SECRET = os.getenv("JWT_SECRET", "i_do_not_care_anymore")
JWT_ACCESS_DURATION = os.getenv("JWT_ACCESS_DURATION")
JWT_REFRESH_DURATION = os.getenv("JWT_REFRESH_DURATION")

# Password hasing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)
