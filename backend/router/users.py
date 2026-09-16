from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Path

# Extraneous imports from the account router; this users router does not use them.
from services.account_services import AccountNotFound, AccountService
from services.user_services import UserNotFound, UserService
# Account and transaction schemas are only needed if the related routes are enabled here.
from schemas import UpdateUserRequest, User, Account, AmountRequest, CreateAccountRequest, Transaction, CreateUserRequest

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


#User details: GET /api/users/{id} 
@router.get("/{id}", response_model=User)
def get_user(id: UserId, service: Service):
    return call_service(service.getUser, id)


#User will need to create an account first
@router.post("/{id}/accounts", response_model=Account, status_code=201)
def create_account(id: UserId, body: CreateAccountRequest, service: Service):
    return call_service(service.createAccount, id, body.accountType)

#update user account details
@router.patch("/{id}", response_model=User)
def update_user(id: UserId, body: UpdateUserRequest, service: Service):
    return call_service(service.updateUser, id, body.name, body.email)

#delete user account
@router.delete("/{id}", response_model=User)
def delete_user(id: UserId, service: Service):
    return call_service(service.deleteUser, id)

