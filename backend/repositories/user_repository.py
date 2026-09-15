(No previous content)
from datetime import datetime

from .fake_database import FakeDatabase


class UserRepository:
	def __init__(self):
		self.database = FakeDatabase()

	def get_by_id(self, user_id: int) -> dict | None:
		data = self.database.read()
		return next((user for user in data["users"] if user["user_id"] == user_id), None)

	def get_all(self) -> list[dict]:
		return self.database.read()["users"]

	def get_by_email(self, email: str) -> dict | None:
		return next(
			(user for user in self.get_all() if user["email"].lower() == email.lower()),
			None,
		)

	def create(self, name: str, email: str) -> dict:
		if self.get_by_email(email) is not None:
			raise ValueError("A user with this email already exists.")

		data = self.database.read()
		next_user_id = max((user["user_id"] for user in data["users"]), default=0) + 1
		user = {
			"user_id": next_user_id,
			"name": name,
			"email": email,
			"created_at": datetime.now().isoformat(timespec="seconds"),
		}
		data["users"].append(user)
		self.database.write(data)
		return user

	def update(self, user_id: int, name: str, email: str) -> dict | None:
		existing_email_user = self.get_by_email(email)
		if existing_email_user is not None and existing_email_user["user_id"] != user_id:
			raise ValueError("A user with this email already exists.")

		data = self.database.read()
		user = next((user for user in data["users"] if user["user_id"] == user_id), None)
		if user is None:
			return None

		user["name"] = name
		user["email"] = email
		self.database.write(data)
		return user

	def delete(self, user_id: int) -> dict | None:
		data = self.database.read()
		if any(account["user_id"] == user_id for account in data["accounts"]):
			raise ValueError("Cannot delete a user who has accounts.")

		for index, user in enumerate(data["users"]):
			if user["user_id"] == user_id:
				deleted_user = data["users"].pop(index)
				self.database.write(data)
				return deleted_user
		return None
