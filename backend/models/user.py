from sqlalchemy import Column, DateTime, Integer, String, func
from sqlalchemy.orm import relationship

from .base import Base


class User(Base):
    __tablename__ = "users" #table name for when there's a DB

    user_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=True)
    email = Column(String(100), unique=True, nullable=True, index=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)    #all the attributes specified in project specs

    # Connect this user to all accounts they own.
    accounts = relationship("Account", back_populates="user")