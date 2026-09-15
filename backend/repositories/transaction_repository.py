from datetime import datetime

from .fake_database import FakeDatabase


class TransactionRepository:
    def __init__(self):
        self.database = FakeDatabase()

    def get_by_id(self, transaction_id: int) -> dict | None:
        data = self.database.read()
        return next(
            (
                transaction
                for transaction in data["transactions"]
                if transaction["txn_id"] == transaction_id
            ),
            None,
        )

    def get_by_account_id(self, account_id: int) -> list[dict]:
        data = self.database.read()
        return [
            transaction
            for transaction in data["transactions"]
            if transaction["account_id"] == account_id
        ]

    def create(self, account_id: int, transaction_type: str, amount: float) -> dict:
        data = self.database.read()
        if not any(account["account_id"] == account_id for account in data["accounts"]):
            raise ValueError("Cannot create a transaction for an account that does not exist.")

        next_transaction_id = max(
            (transaction["txn_id"] for transaction in data["transactions"]), default=0
        ) + 1
        transaction = {
            "txn_id": next_transaction_id,
            "account_id": account_id,
            "txn_type": transaction_type,
            "amount": round(amount, 2),
            "created_at": datetime.now().isoformat(timespec="seconds"),
        }
        data["transactions"].append(transaction)
        self.database.write(data)
        return transaction
        

