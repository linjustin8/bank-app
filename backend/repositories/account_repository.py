from contextlib import nullcontext
from datetime import datetime

from pymongo import ReturnDocument

from .mongo_database import MongoDatabase


class AccountRepository:
    def __init__(self):
        self.database = MongoDatabase()

    def _session_scope(self, session=None):
        if session is not None:
            return nullcontext(session)
        return self.database.transaction()

    def get_by_id(self, account_id: int, session=None) -> dict | None:
        with self._session_scope(session) as txn_session:
            return self.database.get_collection("accounts").find_one(
                {"account_id": account_id}, session=txn_session
            )

    def get_all(self, session=None) -> list[dict]:
        with self._session_scope(session) as txn_session:
            return list(
                self.database.get_collection("accounts").find({}, session=txn_session)
            )

    def get_by_user_id(self, user_id: int, session=None) -> list[dict]:
        with self._session_scope(session) as txn_session:
            return list(
                self.database.get_collection("accounts").find(
                    {"user_id": user_id}, session=txn_session
                )
            )

    def create(self, user_id: int, account_type: str, session=None) -> dict:
        with self._session_scope(session) as txn_session:
            user_collection = self.database.get_collection("users")
            account_collection = self.database.get_collection("accounts")

            if user_collection.find_one({"user_id": user_id}, session=txn_session) is None:
                raise ValueError("Cannot create an account for a user that does not exist.")

            next_account_id = (
                account_collection.find_one({}, sort=[("account_id", -1)], session=txn_session)
                or {"account_id": 0}
            )["account_id"] + 1

            account = {
                "account_id": next_account_id,
                "user_id": user_id,
                "balance": 0.00,
                "account_type": account_type,
                "created_at": datetime.now().isoformat(timespec="seconds"),
            }
            account_collection.insert_one(account, session=txn_session)
            return account

    def update_balance(self, account_id: int, balance: float, session=None) -> dict | None:
        with self._session_scope(session) as txn_session:
            account_collection = self.database.get_collection("accounts")
            account = account_collection.find_one({"account_id": account_id}, session=txn_session)
            if account is None:
                return None

            updated = account_collection.find_one_and_update(
                {"account_id": account_id},
                {"$set": {"balance": round(balance, 2)}},
                return_document=ReturnDocument.AFTER,
                session=txn_session,
            )
            return updated

    def delete(self, account_id: int, session=None) -> dict | None:
        with self._session_scope(session) as txn_session:
            account_collection = self.database.get_collection("accounts")
            deleted_account = account_collection.find_one_and_delete(
                {"account_id": account_id}, session=txn_session
            )
            return deleted_account
