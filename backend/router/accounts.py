from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Path

from account_service import AccountNotFound, AccountService
from schemas import Account, AmountRequest, CreateAccountRequest, Transaction

router = APIRouter(prefix="/api/accounts", tags=["Accounts"])
_service = AccountService()


def get_account_service():
    return _service


Service = Annotated[AccountService, Depends(get_account_service)]
AccountId = Annotated[int, Path(gt=0)]


#Handles HTTP response to errors 
def call_service(method, *args):
    try:
        return method(*args)
    except AccountNotFound as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


#Create Account: POST /api/accounts 
@router.post("", response_model=Account, status_code=201)
def create_account(body: CreateAccountRequest, service: Service):
    return call_service(service.createAccount, body.userId, body.accountType)


#Account details: GET /api/accounts/{id} 
@router.get("/{id}", response_model=Account)
def get_account(id: AccountId, service: Service):
    return call_service(service.getAccount, id)


#Depoit Money: POST /api/accounts/{id}/deposit 
@router.post("/{id}/deposit", response_model=Account)
def deposit(id: AccountId, body: AmountRequest, service: Service):
    return call_service(service.deposit, id, body.amount)


#Withdraw money: POST /api/accounts/{id}/withdraw 
@router.post("/{id}/withdraw", response_model=Account)
def withdraw(id: AccountId, body: AmountRequest, service: Service):
    return call_service(service.withdraw, id, body.amount)


#Transaction history: GET /api/accounts/{id}/transactions 
@router.get("/{id}/transactions", response_model=list[Transaction])
def get_transactions(id: AccountId, service: Service):
    return call_service(service.getTransactions, id)
