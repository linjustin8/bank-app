from datetime import datetime
from decimal import Decimal
from typing import Literal

from pydantic import BaseModel


class AccountDocument(BaseModel):
    account_id: int
    user_id: int
    balance: Decimal = Decimal("0.00")
    account_type: Literal["SAVINGS", "CHECKING"]
    created_at: datetime