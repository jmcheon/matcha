from dataclasses import dataclass
from datetime import datetime
from typing import Any, Dict, List, Optional


@dataclass
class ProfileDTO:
    account_id: Optional[int] = None
    profile_id: Optional[int] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    location: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    like_gender: Optional[str] = None
    height: Optional[int] = None
    interests: Optional[List[str]] = None
    image_paths: Optional[List[str]] = None
    bio: Optional[str] = None
    fame_score: Optional[int] = None

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
    def from_dict(cls, data: Dict[str, Any]) -> "ProfileDTO":
        def map_account_fields(db_record: Dict[str, Any]) -> Dict[str, Any]:
            mapping = {
                "profile_id": "profile_id",
                "account_id": "account_id",
                "first_name": "first_name",
                "last_name": "last_name",
                "location": "location",
                "gender": "gender",
                "like_gender": "like_gender",
                "interests": "interests",
                "image_paths": "image_paths",
                "bio": "bio",
                "fame_score": "fame_score",
            }

            return {mapping.get(k, k): v for k, v in db_record.items()}

        # Optionally map database fields to DTO fields
        mapped_data = map_account_fields(data)
        # Handle datetime fields if they are strings or need conversion
        for field_name, field_type in cls.__annotations__.items():
            if field_type is Optional[datetime] and field_name in mapped_data:  # noqa: F821
                if isinstance(mapped_data[field_name], str):
                    # Convert string to datetime
                    mapped_data[field_name] = datetime.fromisoformat(mapped_data[field_name])
        return cls(**mapped_data)


@dataclass
class GenerateProfileDTO(ProfileDTO):
    first_name: str
    last_name: str
    location: str
    age: int
    gender: str
    like_gender: str
    bio: str
    interests: List[str]
