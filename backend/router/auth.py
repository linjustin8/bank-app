from fastapi import APIRouter

from dependencies.auth import ClerkIdentity, CurrentClerkIdentity

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.get("/session", response_model=ClerkIdentity)
def get_session(identity: CurrentClerkIdentity) -> ClerkIdentity:
    return identity
