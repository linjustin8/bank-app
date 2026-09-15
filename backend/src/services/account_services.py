
class AccountService:
    def __init__(self):
        self.account_repo = AccountRepository()  
        self.transaction_repo = TransactionRepository()
        
    # TODO: Implement createAccount method
    async def createAccount(self, userId: int, accountType: str):
        # Creates a new account for the user with the given userId and accountType.
        pass

    async def getAccount(self, accountId: int):
        try:
            account = await self.account_repo.get_by_id(accountId)
            return account
        except Exception as e:
            raise Exception(f"Error retrieving account: {str(e)}")

    # TODO: Implement deposit method
    async def deposit(self, accountId: int, amount: float):
        try:
            account = await self.account_repo.get_by_id(accountId)
            if not account:
                raise Exception("Account not found")
            # TODO: Perform deposit logic here
        except Exception as e:
            raise Exception(f"Error occurred while depositing: {str(e)}")

    #   TODO: Implement withdraw method
    async def withdraw(self, accountId: int, amount: float):
        # Withdraws the specified amount from the account with the given accountId.
        try:
            account = await self.account_repo.get_by_id(accountId)
            if not account:
                raise Exception("Account not found")
            # TODO: Perform withdrawal logic here
        except Exception as e:
            raise Exception(f"Error occurred while withdrawing: {str(e)}")

    async def getTransactions(self, accountId: int):
        try:
            transactions = await self.transaction_repo.get_by_account_id(accountId)
            return transactions
        except Exception as e:
            raise Exception(f"Error retrieving transactions: {str(e)}")
    
    