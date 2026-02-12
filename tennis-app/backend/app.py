from flask import Flask
from flask_cors import CORS
from config import DATABASE_URL, SECRET_KEY, FLASK_ENV
from models.database import init_app, db
from models.user import User  # Import models so db.create_all() knows about them
from controllers.user_controller import user_bp

app = Flask(__name__)
app.config['SECRET_KEY'] = SECRET_KEY

# Initialize database connection
init_app(app)

# Enable CORS to allow Streamlit frontend to connect
CORS(app)


# Register Blueprints
app.register_blueprint(user_bp, url_prefix='/api/users')


@app.route('/', methods=['GET'])
def health():
    return {'status': 'ok and david yo right', 'message': 'Server is running on port 5000'}, 200


@app.route('/init-db', methods=['POST'])
def init_database():
    """Create all database tables"""
    try:
        db.create_all()
        return {'status': 'success', 'message': 'Database tables created'}, 200
    except Exception as e:
        return {'status': 'error', 'message': str(e)}, 500


@app.route('/check-db', methods=['GET'])
def check_database():
    """Check all users in database"""
    try:
        users = User.query.all()
        users_list = [user.to_dict() for user in users]
        return {
            'status': 'success',
            'total': len(users_list),
            'users': users_list
        }, 200
    except Exception as e:
        return {'status': 'error', 'message': str(e)}, 500


if __name__ == '__main__':
    # Create database tables on startup
    with app.app_context():
        db.create_all()
    
    app.run(host='0.0.0.0', port=5000, debug=True)
