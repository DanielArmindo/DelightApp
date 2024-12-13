from models.db import db


class CategoryRecipes(db.Model):
    __tablename__ = 'category_recipes'

    id_category = db.Column(db.Integer, db.ForeignKey(
        'categories.id'), primary_key=True)
    id_recipe = db.Column(db.Integer, db.ForeignKey(
        'recipes.id'), primary_key=True)
    id_user = db.Column(db.Integer, db.ForeignKey(
        'users.id'), nullable=False)

    category = db.relationship('Categories', backref='category_recipes')
    recipe = db.relationship('Recipes', backref='category_recipes')

    def responseIDs(items):
        return [item.id_category for item in items]
