from flask import Blueprint, jsonify, request
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)
from models.db import db
from models.recipes import Recipes
from models.categories import Categories
from models.category_recipes import CategoryRecipes

recipes_bp = Blueprint('recipes', __name__)


@recipes_bp.route('/recipes/<int:id>/categories', methods=['GET'])
@jwt_required()
def getCategories(id):
    user = get_jwt_identity()
    categories = CategoryRecipes.query.filter_by(
        id_user=user, id_recipe=id).all()
    return jsonify(CategoryRecipes.responseIDs(categories)), 200


@recipes_bp.route('/recipes/<int:id>', methods=['DELETE'])
@jwt_required()
def delete(id):
    user = get_jwt_identity()
    category_id = request.json.get('category')

    if not category_id:
        return jsonify({"error": "Categoria Invalida!"}), 400

    category = Categories.query.get(category_id)

    if category is None or category.user.id != user:
        return jsonify({"error": "Acesso a categoria proibida!"}), 403

    CategoryRecipes.query.filter_by(
        id_user=user, id_category=category.id, id_recipe=id).delete()

    db.session.commit()

    return jsonify({"msg": "Receita eliminada com sucesso da categoria!"}), 200


@recipes_bp.route('/recipes', methods=['POST'])
@jwt_required()
def create():
    user = get_jwt_identity()
    id = request.json.get('recipe_id')
    title = request.json.get('title')
    servings = request.json.get('servings')
    readyInMinutes = request.json.get('readyInMinutes')
    imageUrl = request.json.get('imageUrl')
    categories = request.json.get('categories')

    if not id:
        return jsonify({"error": "Parâmetros Invalidos, categorias e id da receita necessários"}), 400

    recipe = Recipes.query.get(id)
    if recipe is None:
        if not title or not servings or not readyInMinutes:
            return jsonify({"error": "Parâmetros Invalidos"}), 400
        recipe = Recipes(id=id, title=title,
                         servings=servings, readyInMinutes=readyInMinutes, image=imageUrl)
        db.session.add(recipe)
        db.session.commit()

    # eliminar categorias que previamente estão com a receita
    categoriesFilled = CategoryRecipes.query.filter_by(
        id_user=user, id_recipe=id).all()

    categoriesFilled = [item.id_category for item in categoriesFilled]

    categories_set = set(categories)
    categories_filled_set = set(categoriesFilled)

    deleteFromCategories = list(categories_filled_set - categories_set)
    addToCategories = list(categories_set - categories_filled_set)

    CategoryRecipes.query.filter(
        CategoryRecipes.id_recipe == recipe.id,
        CategoryRecipes.id_category.in_(deleteFromCategories),
        CategoryRecipes.id_user == user).delete()

    # adicionar às categorias
    for category in addToCategories:
        addRecipeCategory = CategoryRecipes(
            id_recipe=recipe.id, id_category=category, id_user=user)
        db.session.add(addRecipeCategory)

    db.session.commit()

    return jsonify({"msg": "Receita adicionada com sucesso!"}), 200
