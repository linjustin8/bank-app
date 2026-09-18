from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Path

from services.account_services import AccountNotFound, AccountService
from schemas import Account, AmountRequest, CreateAccountRequest, Transaction
from dependencies.auth import CurrentUser

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


@router.get("", response_model=list[Account])
def list_accounts(user: CurrentUser, service: Service):
    return service.getAccountsForUser(user.user_id)


def require_owned_account(id: int, user: CurrentUser, service: AccountService):
    account = call_service(service.getAccount, id)
    if account.userId != user.user_id:
        raise HTTPException(status_code=404, detail="Account not found")
    return account


#Create Account: POST /api/accounts 
@router.post("", response_model=Account, status_code=201)
def create_account(body: CreateAccountRequest, service: Service):
    return call_service(service.createAccount, body.userId, body.accountType)


#Account details: GET /api/accounts/{id} 
@router.get("/{id}", response_model=Account)
def get_account(id: AccountId, user: CurrentUser, service: Service):
    return require_owned_account(id, user, service)


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
def get_transactions(id: AccountId, user: CurrentUser, service: Service):
    require_owned_account(id, user, service)
    return call_service(service.getTransactions, id)

# Deletes the user account with accountId = id
@router.delete("/{id}", status_code=204)
def delete_account(id: AccountId, service: Service):
    call_service(service.deleteAccount, id)
