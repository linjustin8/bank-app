from app.db import database


class MongoDatabase:
    """Small compatibility adapter for the existing repository interfaces."""

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
