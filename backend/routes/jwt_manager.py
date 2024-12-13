from datetime import datetime
from flask_jwt_extended import JWTManager, get_jwt
from models.revoked_tokens import RevokedTokens
from models.db import db
from datetime import timedelta

jwt = JWTManager()


@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload):
    jti = jwt_payload['jti']
    expiration_time = datetime.fromtimestamp(jwt_payload['exp'])

    expired_token = RevokedTokens.query.filter_by(token=jti).first()
    if expired_token:
        return True

    if datetime.utcnow() > expiration_time:
        new_expired_token = RevokedTokens(
            token=jti, expiration_time=expiration_time)
        db.session.add(new_expired_token)
        db.session.commit()
        return True

    return False


def revokeToken():
    jti = get_jwt()['jti']
    expiration_time = datetime.utcnow() + timedelta(hours=1)
    revoked_token = RevokedTokens(token=jti, expiration_time=expiration_time)
    db.session.add(revoked_token)
    db.session.commit()
