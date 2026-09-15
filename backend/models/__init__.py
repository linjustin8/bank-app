from .base import Base
from .user import User
from .account import Account
from .transaction import Transaction        #imports all the other models into this one

#allows other files to just call "from models import Base, User, Account, Transaction" instead of having to import each model individually
# or even "from models import *"
#bonus: ensures SQLAlchemy knows about each model before this runs


__all__ = ["Base", "User", "Account", "Transaction"]