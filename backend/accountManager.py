from datetime import datetime

class User:
    def __init__(self, user_id, name, email):
        self._user_id = user_id
        self._name = name
        self._email = email
        self._created_at = datetime.now()
        self._accounts = [] #accountIDs
        
    # def createAccount(self, accountType):
        

class Account:
    def __init__(self, account_id, user_id, balance, account_type):
        self._account_id = account_id
        self._user_id = user_id
        self._balance = balance
        self._account_type = account_type
        self._created_at = datetime.now()
        self._transactions = []
      
    #Returns account details for "Account Details" page  
    def getAccount(self, accountId):
        return {"accountId": self._account_id, "userName": self._user_id, "balance": self._balance} 
    
    def deposit(self, amount):
        if amount > 0:
            self._balance += amount
            #update transaction record
    
    def withdraw(self, amount):
        if amount > 0 and amount <= self._balance:
            self._balance -= amount
            #update transaction record
            
    def getTransactions(self):
        return self._transactions
         
         
            
class Transaction:
    def __init__(self, id, type, amount, date):
        self._id = id
        self._type = type
        self._amount = amount
        self._date = date
        