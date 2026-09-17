from contextlib import nullcontext
from datetime import datetime

from .mongo_database import MongoDatabase


class TransactionRepository:
    def __init__(self):
        self.database = MongoDatabase()

    def _session_scope(self, session=None):
        if session is not None:
            return nullcontext(session)
        return self.database.transaction()

    def get_by_id(self, transaction_id: int, session=None) -> dict | None:
        with self._session_scope(session) as txn_session:
            return self.database.get_collection("transactions").find_one(
                {"txn_id": transaction_id}, session=txn_session
            )

    def get_by_account_id(self, account_id: int, session=None) -> list[dict]:
        with self._session_scope(session) as txn_session:
            return list(
                self.database.get_collection("transactions").find(
                    {"account_id": account_id}, session=txn_session
                )
            )

    def create(self, account_id: int, transaction_type: str, amount: float, session=None) -> dict:
        with self._session_scope(session) as txn_session:
            account_collection = self.database.get_collection("accounts")
            transaction_collection = self.database.get_collection("transactions")

            if account_collection.find_one({"account_id": account_id}, session=txn_session) is None:
                raise ValueError("Cannot create a transaction for an account that does not exist.")

            next_transaction_id = (
                transaction_collection.find_one({}, sort=[("txn_id", -1)], session=txn_session)
                or {"txn_id": 0}
            )["txn_id"] + 1

            transaction = {
                "txn_id": next_transaction_id,
                "account_id": account_id,
                "txn_type": transaction_type,
                "amount": round(amount, 2),
                "created_at": datetime.now().isoformat(timespec="seconds"),
            }
            transaction_collection.insert_one(transaction, session=txn_session)
            return transaction

