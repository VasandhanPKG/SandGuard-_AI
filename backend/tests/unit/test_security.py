"""
Unit Tests for Security Primitives: Password Hashing & JWT Tokens
"""

import pytest
from app.core.security import verify_password, get_password_hash, create_access_token, decode_jwt_token


def test_password_hashing():
    raw = "SandGuardSecret123"
    hashed = get_password_hash(raw)
    assert hashed != raw
    assert verify_password(raw, hashed) is True
    assert verify_password("WrongPass", hashed) is False


def test_jwt_access_token_creation_and_decoding():
    user_id = "user-12345"
    role = "ADMIN"
    token = create_access_token(subject=user_id, role=role)
    payload = decode_jwt_token(token)

    assert payload.sub == user_id
    assert payload.role == role
