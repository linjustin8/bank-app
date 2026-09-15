from datetime import datetime

from .fake_database import FakeDatabase


class AccountRepository:
	def __init__(self):
		self.database = FakeDatabase()

	def get_by_id(self, account_id: int) -> dict | None:
		data = self.database.read()
		return next(
			(account for account in data["accounts"] if account["account_id"] == account_id),
			None,
		)

	def get_all(self) -> list[dict]:
		return self.database.read()["accounts"]

	def get_by_user_id(self, user_id: int) -> list[dict]:
		return [account for account in self.get_all() if account["user_id"] == user_id]

	def create(self, user_id: int, account_type: str) -> dict:
		data = self.database.read()
		if not any(user["user_id"] == user_id for user in data["users"]):
			raise ValueError("Cannot create an account for a user that does not exist.")

		next_account_id = max(
			(account["account_id"] for account in data["accounts"]), default=0
		) + 1
		account = {
			"account_id": next_account_id,
			"user_id": user_id,
			"balance": 0.00,
			"account_type": account_type,
			"created_at": datetime.now().isoformat(timespec="seconds"),
		}
		data["accounts"].append(account)
		self.database.write(data)
		return account

	def update_balance(self, account_id: int, balance: float) -> dict | None:
		data = self.database.read()
		account = next(
			(account for account in data["accounts"] if account["account_id"] == account_id),
			None,
		)
		if account is None:
			return None

		account["balance"] = round(balance, 2)
		self.database.write(data)
		return account

	def delete(self, account_id: int) -> dict | None:
		data = self.database.read()
		if any(transaction["account_id"] == account_id for transaction in data["transactions"]):
			raise ValueError("Cannot delete an account that has transactions.")

		for index, account in enumerate(data["accounts"]):
			if account["account_id"] == account_id:
				deleted_account = data["accounts"].pop(index)
				self.database.write(data)
				return deleted_account
		return None
