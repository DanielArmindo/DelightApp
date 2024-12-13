from flask import Flask
import os
from dotenv import load_dotenv
from datetime import timedelta
from flask_cors import CORS
from models.db import db
from routes.jwt_manager import jwt
from routes.auth import auth_bp
from routes.status import sts_bp
from routes.categories import category_bp
from routes.recipes import recipes_bp

from models.users import Users
from models.revoked_tokens import RevokedTokens
from models.categories import Categories
from models.recipes import Recipes
from models.category_recipes import CategoryRecipes

app = Flask(__name__)

CORS(app)

load_dotenv()

app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=365)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
jwt.init_app(app)

# Rotas/Endpoints
app.register_blueprint(auth_bp)
app.register_blueprint(category_bp)
app.register_blueprint(recipes_bp)
app.register_blueprint(sts_bp)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    # app.run(debug=True)
    app.run(host="0.0.0.0", port=5000, debug=True)
