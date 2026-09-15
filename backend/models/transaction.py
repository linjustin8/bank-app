from sqlalchemy import Column, DateTime, DECIMAL, ForeignKey, Integer, String, func
from sqlalchemy.orm import relationship

from .base import Base


class Transaction(Base):
    __tablename__ = "transactions"  # Table name for the transactions table for when there's a DB

    txn_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    account_id = Column(Integer, ForeignKey("accounts.account_id"), nullable=False, index=True)
    txn_type = Column(String(20), nullable=True)
    amount = Column(DECIMAL(10, 2), nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)    #all the attributes specified in project specs

    # Connect this transaction to the account it belongs to.
    account = relationship("Account", back_populates="transactions")