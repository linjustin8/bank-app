import json
from pathlib import Path


class FakeDatabase:
    def __init__(self):
        self.file_path = Path(__file__).resolve().parent.parent / "db.json"

    def read(self) -> dict:
        with self.file_path.open("r", encoding="utf-8") as database_file:
            return json.load(database_file)

    def write(self, data: dict) -> None:
        with self.file_path.open("w", encoding="utf-8") as database_file:
            json.dump(data, database_file, indent=2)
            database_file.write("\n")