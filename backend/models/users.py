from models.db import db
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()


class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False)
    password = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)

    categories = db.relationship('Categories', back_populates='user')

    def set_password(self, password):
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')

    def verify_password(self, password):
        return bcrypt.check_password_hash(self.password, password)

    def response(item):
        return {
            "id": item.id,
            "username": item.username,
            "email": item.email,
            # "categories": [category.name for category in item.categories],
            # "num_categories": len(item.categories),
        }
