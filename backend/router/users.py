from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Path

from dependencies.auth import CurrentUser
from services.account_services import AccountNotFound, AccountService
from services.user_services import UserNotFound, UserService
from schemas import User, Account, AmountRequest, CreateAccountRequest, Transaction, CreateUserRequest

router = APIRouter(prefix="/api/users", tags=["Users"])
_service = UserService()


def get_user_service():
    return _service


Service = Annotated[UserService, Depends(get_user_service)]
UserId = Annotated[int, Path(gt=0)]


#Handles HTTP response to errors 
def call_service(method, *args):
    try:
        return method(*args)
    except UserNotFound as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


#Create User: POST /api/users 
@router.post("", response_model=User, status_code=201)
def create_user(body: CreateUserRequest, service: Service):
    return call_service(service.createUser, body.name, body.email)


#Current user linked to the Clerk session: GET /api/users/me
@router.get("/me", response_model=User)
def get_current_user_record(user: CurrentUser):
    return user


#User details: GET /api/users/{id} 
@router.get("/{id}", response_model=User)
def get_user(id: UserId, service: Service):
    return call_service(service.getUser, id)


#User will need to create an account first
@router.post("/{id}/accounts", response_model=Account, status_code=201)
def create_account(id: UserId, body: CreateAccountRequest, service: Service):
    return call_service(service.createAccount, id, body.accountType)

# #Transaction history: GET /api/accounts/{id}/transactions 
# @router.get("/{id}/transactions", response_model=list[Transaction])
# def get_transactions(id: AccountId, service: Service):
#     return call_service(service.getTransactions, id)
