from flask import Blueprint, jsonify, request
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)
from models.db import db
from models.categories import Categories
from models.category_recipes import CategoryRecipes
from models.recipes import Recipes

category_bp = Blueprint('categories', __name__)


@category_bp.route('/categories/<int:id>/recipes', methods=['GET'])
@jwt_required()
def getRecipes(id):
    try:
        category_recipes = CategoryRecipes.query.filter_by(
            id_category=id).all()
        recipes_data = []
        for category_recipe in category_recipes:
            recipe = category_recipe.recipe
            recipes_data.append(Recipes.response(recipe))
        return jsonify(recipes_data), 200
    except Exception as e:
        return jsonify({"error": "Erro ao retornar as receitas!"}), 500


@category_bp.route('/categories', methods=['GET'])
@jwt_required()
def getAll():
    user = get_jwt_identity()
    categories = Categories.query.filter_by(user_id=user).all()
    return jsonify(Categories.responseArray(categories)), 200


@category_bp.route('/categories', methods=['POST'])
@jwt_required()
def create():
    user = get_jwt_identity()
    name = request.json.get('name')
    description = request.json.get('description')

    if not name or name == "default":
        return jsonify({"error": "O campo 'name' é necessário e não pode conter 'default'!"}), 400

    category = Categories(user_id=user, name=name, description=description)

    db.session.add(category)
    db.session.commit()

    return jsonify(Categories.response(category)), 201


@category_bp.route('/categories/<int:id>', methods=['PUT'])
@jwt_required()
def update(id):
    user = get_jwt_identity()
    category = Categories.query.get(id)

    if category.name == "default" or category.user.id != user:
        return jsonify({"error": "Acesso a categoria proibida!"}), 403

    name = request.json.get('name')
    description = request.json.get('description')

    if not name or len(name) < 3:
        return jsonify({"error": "O campo 'name' inválido!"}), 400

    category.name = name
    category.description = description
    db.session.commit()

    return jsonify({"msg": "Categoria atualizada!"}), 200


@category_bp.route('/categories/<int:id>', methods=['DELETE'])
@jwt_required()
def delete(id):
    user = get_jwt_identity()
    category = Categories.query.get(id)

    if category.name == "default" or category.user.id != user:
        return jsonify({"error": "Acesso a categoria proibida!"}), 403

    method = request.headers.get('method')

    match method:
        case "soft":
            CategoryRecipes.query.filter_by(id_category=id).delete()
            db.session.delete(category)
            db.session.commit()
            return jsonify({"msg": "Categoria eliminada!"}), 200
        case "clear":
            CategoryRecipes.query.filter_by(id_category=id).delete()
            db.session.commit()
            return jsonify({"msg": "Receitas Eliminadas da Categoria!"}), 200
        case "all":
            id_recipes = CategoryRecipes.query.filter_by(id_category=id).all()
            id_recipes = [item.id_recipe for item in id_recipes]
            for id_recipe in id_recipes:
                CategoryRecipes.query.filter_by(
                    id_recipe=id_recipe, id_user=user).delete()
            db.session.delete(category)
            db.session.commit()
            return jsonify({"msg": "Categoria eliminada em conjunto das receitas!"}), 200
        case _:
            return jsonify({"error": "Método de eliminição não específicado!"}), 400


@category_bp.route('/me/statistics', methods=['GET'])
@jwt_required()
def getStatistics():
    user = get_jwt_identity()
    categories = Categories.query.filter(
        Categories.user_id == user, Categories.name != 'default').all()
    category_statistics = []

    total_recipes = 0
    max_category = None
    min_category = None
    total_category_recipes = 0

    total_recipes = CategoryRecipes.query.filter_by(id_user=user).with_entities(
        CategoryRecipes.id_recipe).distinct().count()

    for category in categories:
        num_recipes = CategoryRecipes.query.filter_by(
            id_category=category.id).count()

        total_category_recipes += num_recipes

        category_statistics.append({
            'category_name': category.name,
            'num_recipes': num_recipes
        })

        if not max_category or num_recipes > max_category['num_recipes']:
            max_category = {'category_name': category.name,
                            'num_recipes': num_recipes}

        if not min_category or num_recipes < min_category['num_recipes']:
            min_category = {'category_name': category.name,
                            'num_recipes': num_recipes}

    average_recipes = total_category_recipes / \
        len(categories) if len(categories) > 0 else 0

    categories_with_recipes = len(
        [cat for cat in categories if CategoryRecipes.query.filter_by(id_category=cat.id).count() > 0])
    categories_without_recipes = len(categories) - categories_with_recipes

    stats = {
        "total_categories": len(categories),
        "total_recipes": total_recipes,
        "max_category": max_category,
        "min_category": min_category,
        "average_recipes_per_category": average_recipes,
        "categories_with_recipes": categories_with_recipes,
        "categories_without_recipes": categories_without_recipes,
        "category_statistics": category_statistics
    }

    return jsonify(stats), 200
