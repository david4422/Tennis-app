from flask import Blueprint, request, jsonify
from managers.user_manager import UserManager

# Create Blueprint for user routes
# 'users' is the name, __name__ is the module name
user_bp = Blueprint('users', __name__)

# Create UserManager instance
user_manager = UserManager()

@user_bp.route('/login', methods=['POST'])
def login():
    """Login a user"""
    try:
        data = request.get_json()
        print(f"precived data for login user {data}")
        if data is None:
            return jsonify({
                'success': False,
                'message': 'No JSON data provided. Make sure Content-Type is application/json'
            }), 400
        
        success, message, user = user_manager.login_user(
            email=data['email'],
            password=data['password']
        )
        if success:
            return jsonify({
                'success': True,
                'message': message,
                'user': user.to_dict()
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': message
            }), 400

    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Server error: {str(e)}'
        }), 500

@user_bp.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    try:
        data = request.get_json()
        
        # Check if JSON data was sent
        if data is None:
            return jsonify({
                'success': False,
                'message': 'No JSON data provided. Make sure Content-Type is application/json'
            }), 400
        
        # Validate required fields
        required_fields = ['name', 'email', 'password']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'success': False,
                    'message': f'Missing required field: {field}'
                }), 400
        print("precived data for register user")
        # Register user
        success, message, user = user_manager.register_user(
            name=data['name'],
            email=data['email'],
            phone=data.get('phone'),
            skill_level=data.get('skill_level'),
            password=data['password']
        )
        
        if success:
            return jsonify({
                'success': True,
                'message': message,
                'user': user.to_dict()
            }), 201
        else:
            return jsonify({
                'success': False,
                'message': message
            }), 400
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Server error: {str(e)}'
        }), 500