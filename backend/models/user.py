from datetime import datetime

from pydantic import BaseModel


class UserDocument(BaseModel):
    user_id: int
    name: str
    email: str
    created_at: datetime