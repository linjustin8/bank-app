from datetime import datetime
from decimal import Decimal
from typing import Literal

from pydantic import BaseModel


class TransactionDocument(BaseModel):
    txn_id: int
    account_id: int
    txn_type: Literal["DEPOSIT", "WITHDRAW"]
    amount: Decimal
    created_at: datetime