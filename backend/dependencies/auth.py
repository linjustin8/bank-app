# https://clerk.com/articles/how-to-add-authentication-to-a-python-backend

import os
from dataclasses import dataclass
from typing import Annotated

import httpx
from clerk_backend_api.security import AuthenticateRequestOptions, authenticate_request
from fastapi import Depends, HTTPException, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jwt import InvalidTokenError


@dataclass(frozen=True)
class ClerkIdentity:
    clerk_user_id: str
    session_id: str


bearer_scheme = HTTPBearer(auto_error=False)


def get_clerk_identity(request: Request, credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer_scheme)],) -> ClerkIdentity:
    
    unauthorized = HTTPException(status_code=401, detail="Missing or invalid session token", headers={"WWW-Authenticate": "Bearer"},)
    
    if credentials is None:
        raise unauthorized

    options = AuthenticateRequestOptions(
        secret_key=os.getenv("CLERK_SECRET_KEY") or None,
        jwt_key=os.getenv("CLERK_JWT_KEY", "").replace("\\n", "\n") or None,
        authorized_parties=[origin.strip() for origin in os.getenv(
            "CLERK_AUTHORIZED_PARTIES",
            "http://localhost:5173,http://127.0.0.1:5173",
        ).split(",") if origin.strip()],
        accepts_token=["session_token"],
    )
    issuer = os.getenv("CLERK_ISSUER_URL", "").strip().rstrip("/")
    if not issuer or not (options.secret_key or options.jwt_key) or not options.authorized_parties:
        raise HTTPException(status_code=503, detail="Clerk authentication is not configured")

    try:
        state = authenticate_request(
            httpx.Request(request.method, str(request.url), headers={"Authorization": f"Bearer {credentials.credentials}",}),
            options,
        )
    except httpx.RequestError as exc:
        raise HTTPException(status_code=503, detail="Session verification is unavailable") from exc
    except (InvalidTokenError, TypeError, ValueError) as exc:
        raise unauthorized from exc

    claims = state.payload or {}
    if (
        not state.is_signed_in
        or claims.get("iss") != issuer
        or any(not isinstance(claims.get(name), str) or not claims[name].strip() for name in ("sub", "sid"))
        or any(type(claims.get(name)) is not int for name in ("exp", "iat", "nbf"))
        or claims.get("sts") == "pending"
    ):
        raise unauthorized

    return ClerkIdentity(clerk_user_id=claims["sub"], session_id=claims["sid"])


CurrentClerkIdentity = Annotated[ClerkIdentity, Depends(get_clerk_identity)]