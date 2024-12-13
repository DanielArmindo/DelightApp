from models.db import db


class Recipes(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=False)
    title = db.Column(db.String(255), unique=True, nullable=False)
    servings = db.Column(db.Integer, nullable=False)
    readyInMinutes = db.Column(db.Integer, nullable=False)
    image = db.Column(db.String(255))

    def response(item):
        return {
            "id": item.id,
            "title": item.title,
            "servings": item.servings,
            "readyInMinutes": item.readyInMinutes,
            "image": item.image,
        }
