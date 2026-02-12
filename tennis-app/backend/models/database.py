from flask_sqlalchemy import SQLAlchemy
from config import DATABASE_URL

# SQLAlchemy database instance
db = SQLAlchemy()

def init_app(app):
    """
    Initialize database connection for Flask app.
    Configures SQLAlchemy with database URI and initializes the db instance.
    """
    app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)
