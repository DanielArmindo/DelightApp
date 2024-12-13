from flask import Blueprint, jsonify, request
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity,
    create_access_token
)
from models.db import db
from models.users import Users
from models.categories import Categories
from routes.jwt_manager import revokeToken

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/login', methods=['POST'])
def login():
    email = request.json.get('email')
    password = request.json.get('password')

    user = Users.query.filter_by(email=email).first()
    if user and user.verify_password(password):
        access_token = create_access_token(identity=user.id)
        return jsonify(access_token=access_token), 200

    return jsonify({"msg": "Credenciais inválidas"}), 401


@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    revokeToken()
    db.session.commit()
    return jsonify(msg="Logout bem-sucedido!"), 200


@auth_bp.route('/register', methods=['POST'])
def register():
    username = request.json.get('username')
    password = request.json.get('password')
    email = request.json.get('email')

    if Users.query.filter_by(email=email).first():
        return jsonify({"error": "Utilizador já existe."}), 400

    new_user = Users(username=username, email=email)
    new_user.set_password(password)

    db.session.add(new_user)
    db.session.commit()

    default_category = Categories(user_id=new_user.id, name="default")
    db.session.add(default_category)
    db.session.commit()

    return jsonify({"msg": "Utilizador registado com sucesso!"}), 201


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_user():
    try:
        current_user = get_jwt_identity()
        user = Users.query.filter_by(id=current_user).first()
        return jsonify(Users.response(user)), 200
    except Exception as e:
        return jsonify({"error": "Erro ao consultar dados do utilizador"}), 400


@auth_bp.route('/me', methods=['PUT'])
@jwt_required()
def credentials():
    current_user = get_jwt_identity()
    password = request.json.get('password')
    current_password = request.json.get('current_password')

    user = Users.query.filter_by(id=current_user).first()

    if user.verify_password(current_password):
        user.set_password(password)
        revokeToken()
        db.session.commit()
        return jsonify({"msg": "Credenciais atualizadas com sucesso!"}), 200

    return jsonify({"error": "Password atual incorreta!"}), 400
