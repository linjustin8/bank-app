from datetime import datetime
from decimal import Decimal
from typing import Annotated, Literal

from pydantic import BaseModel, Field

#Validates account creating
#INputs: valid userId and permitted account type
class CreateAccountRequest(BaseModel):
    userId: int = Field(gt=0)
    accountType: Literal["SAVINGS", "CHECKING"]


#Validates that user request - positive and 2 decimal places at most
class AmountRequest(BaseModel):
    amount: Annotated[Decimal, Field(gt=0, max_digits=18, decimal_places=2)]


class TransferRequest(BaseModel):
    fromAccountId: int = Field(gt=0)
    toAccountId: int = Field(gt=0)
    amount: Annotated[Decimal, Field(gt=0, max_digits=18, decimal_places=2)]

#Account fields
class Account(BaseModel):
    id: int
    userId: int
    accountType: Literal["SAVINGS", "CHECKING"]
    balance: Decimal = Decimal("0.00")


class TransferResponse(BaseModel):
    fromAccount: Account
    toAccount: Account

#Transaction fields
class Transaction(BaseModel):
    id: int
    accountId: int
    type: Literal["DEPOSIT", "WITHDRAWAL"]
    amount: Decimal
    createdAt: datetime


##User schemas
class User(BaseModel):
    user_id: int
    clerk_user_id: str | None = None
    name: str
    email: str
    created_at: datetime

class CreateUserRequest(BaseModel):
    name: str
    email: str
