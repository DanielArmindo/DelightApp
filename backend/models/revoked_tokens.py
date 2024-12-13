from models.db import db


class RevokedTokens(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    token = db.Column(db.String(500), nullable=False, unique=True)
    expiration_time = db.Column(db.DateTime, nullable=False)

    def __init__(self, token, expiration_time):
        self.token = token
        self.expiration_time = expiration_time
