from sqlalchemy import Column, DateTime, DECIMAL, ForeignKey, Integer, String, func
from sqlalchemy.orm import relationship

from .base import Base


class Account(Base):
    __tablename__ = "accounts"  # table name for when there's a DB

    account_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False, index=True)
    balance = Column(DECIMAL(10, 2), nullable=False, default=0)
    account_type = Column(String(50), nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)    #all the attributes specified in project specs

    # Connect this account to its owner.
    user = relationship("User", back_populates="accounts")
    # Connect this account to its deposit and withdrawal records.
    transactions = relationship("Transaction", back_populates="account")