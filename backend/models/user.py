from datetime import datetime

from pydantic import BaseModel


class UserDocument(BaseModel):
    user_id: int
    clerk_user_id: str | None = None
    name: str
    email: str
    created_at: datetime