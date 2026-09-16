from decimal import Decimal

from services.account_services import AccountNotFound, InsufficientFunds
from repositories.account_repository import AccountRepository
from repositories.user_repository import UserRepository
from repositories.transaction_repository import TransactionRepository
from schemas import User, Account, AmountRequest, CreateAccountRequest, Transaction


class UserNotFound(Exception):
    """The requested user does not exist."""



class UserService:
    def __init__(self):
        self.user_repo = UserRepository()
        self.account_repo = AccountRepository()

    @staticmethod
    def _user_response(user: dict) -> User:
        return User(
            user_id=user["user_id"],
            name=user["name"],
            email=user["email"],
            created_at=user["created_at"],
        )

    def createUser(self, name: str, email: str) -> User:
        user = self.user_repo.create(name, email)
        return self._user_response(user)

    def getUser(self, userId: int) -> User:
        user = self.user_repo.get_by_id(userId)
        if user is None:
            raise UserNotFound("User not found")
        return self._user_response(user)

    @staticmethod
    def _account_response(account: dict) -> Account:
        return Account(
            id=account["account_id"],
            userId=account["user_id"],
            accountType=account["account_type"],
            balance=Decimal(str(account["balance"])),
        )

    def createAccount(self, userId: int, accountType: str) -> Account:
        request = CreateAccountRequest(userId=userId, accountType=accountType)
        account = self.account_repo.create(request.userId, request.accountType)
        return self._account_response(account)

    def getAccount(self, accountId: int) -> Account:
        account = self.account_repo.get_by_id(accountId)
        if account is None:
            raise AccountNotFound("Account not found")
        return self._account_response(account)

    def deposit(self, accountId: int, amount: Decimal) -> Account:
        amount = AmountRequest(amount=amount).amount
        account = self.getAccount(accountId)
        updated = self.account_repo.update_balance(
            accountId, float(account.balance + amount)
        )
        if updated is None:
            raise AccountNotFound("Account not found")
        self.transaction_repo.create(accountId, "DEPOSIT", float(amount))
        return self._account_response(updated)

    def withdraw(self, accountId: int, amount: Decimal) -> Account:
        amount = AmountRequest(amount=amount).amount
        account = self.getAccount(accountId)
        if amount > account.balance:
            raise InsufficientFunds("Insufficient funds")
        updated = self.account_repo.update_balance(
            accountId, float(account.balance - amount)
        )
        if updated is None:
            raise AccountNotFound("Account not found")
        self.transaction_repo.create(accountId, "WITHDRAWAL", float(amount))
        return self._account_response(updated)

    def getTransactions(self, accountId: int) -> list[Transaction]:
        self.getAccount(accountId)
        transactions = self.transaction_repo.get_by_account_id(accountId)
        return [
            Transaction(
                id=transaction["txn_id"],
                accountId=transaction["account_id"],
                type=(
                    "WITHDRAWAL"
                    if transaction["txn_type"] == "WITHDRAW"
                    else transaction["txn_type"]
                ),
                amount=Decimal(str(transaction["amount"])),
                createdAt=transaction["created_at"],
            )
            for transaction in transactions
        ]
