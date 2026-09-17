from contextlib import contextmanager

from app.db import database


class MongoDatabase:
    """Shared MongoDB access layer with transaction support."""

    collection_names = ("users", "accounts", "transactions")

    # allows use of MongoDB collections directly. Allowing 
    @staticmethod
    def get_collection(name: str):
        return database[name]

    def read(self) -> dict[str, list[dict]]:
        return {
            name: list(self.get_collection(name).find({}, {"_id": 0}))
            for name in self.collection_names
        }

    @contextmanager
    def transaction(self):
        # opens mongoDB client session
        with database.client.start_session() as session:
            # begins a trasaction on this session
            with session.start_transaction():
                # waits for the instance of transaction to close
                yield session

    def write(self, data: dict[str, list[dict]]) -> None:
        for name in self.collection_names:
            collection = self.get_collection(name)
            collection.delete_many({})
            documents = data.get(name, [])
            if documents:
                collection.insert_many(documents)
