from models.db import db


class Categories(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255))

    user = db.relationship('Users', back_populates='categories')

    def response(item):
        return {
            "id": item.id,
            "name": item.name,
            "description": item.description,
        }

    def responseArray(items):
        return [{
            "id": category.id,
            "name": category.name,
            "description": category.description
        } for category in items]
