from datetime import datetime

from app.db import database


class MongoDatabase:

    # These collection names match the data groups used by the repositories.
    collection_names = ("users", "accounts", "transactions")

    def read(self) -> dict[str, list[dict]]:
        # Read every collection and omit MongoDB's internal _id field.
        return {
            name: list(database[name].find({}, {"_id": 0}))
            for name in self.collection_names
        }

    def write(self, data: dict[str, list[dict]]) -> None:
        # Replace each collection with the current repository data.
        for name in self.collection_names:
            collection = database[name]
            collection.delete_many({})
            documents = data.get(name, [])
            # Avoid calling insert_many when there are no documents to insert.
            if documents:
                collection.insert_many(documents)

    def apply_transfer(
        self, from_account_id: int, to_account_id: int, amount: float
    ) -> tuple[dict, dict]:
        accounts = database["accounts"]
        transactions = database["transactions"]

        with database.client.start_session() as session:
            with session.start_transaction():
                source = accounts.find_one(
                    {"account_id": from_account_id}, {"_id": 0}, session=session
                )
                destination = accounts.find_one(
                    {"account_id": to_account_id}, {"_id": 0}, session=session
                )

                if source is None or destination is None:
                    raise ValueError("Account not found")
                if source["balance"] < amount:
                    raise ValueError("Insufficient funds")

                accounts.update_one(
                    {"account_id": from_account_id},
                    {"$inc": {"balance": -amount}},
                    session=session,
                )
                accounts.update_one(
                    {"account_id": to_account_id},
                    {"$inc": {"balance": amount}},
                    session=session,
                )

                next_transaction_id = (
                    transactions.find_one(
                        sort=[("txn_id", -1)], session=session
                    )
                    or {"txn_id": 0}
                )["txn_id"] + 1
                created_at = datetime.now().isoformat(timespec="seconds")
                transactions.insert_many(
                    [
                        {
                            "txn_id": next_transaction_id,
                            "account_id": from_account_id,
                            "txn_type": "WITHDRAW",
                            "amount": round(amount, 2),
                            "created_at": created_at,
                        },
                        {
                            "txn_id": next_transaction_id + 1,
                            "account_id": to_account_id,
                            "txn_type": "DEPOSIT",
                            "amount": round(amount, 2),
                            "created_at": created_at,
                        },
                    ],
                    session=session,
                )

                updated_source = accounts.find_one(
                    {"account_id": from_account_id}, {"_id": 0}, session=session
                )
                updated_destination = accounts.find_one(
                    {"account_id": to_account_id}, {"_id": 0}, session=session
                )

        return updated_source, updated_destination
