from models.database import db
from models.user import User

class UserRepository:
    @staticmethod
    def create_user(name, email, phone, skill_level, password_hash):
        """Create a new user in the database"""
        try:
            user = User(
                name=name,
                email=email,
                phone=phone,
                skill_level=skill_level,
                password_hash=password_hash
            )
            db.session.add(user)
            db.session.commit()
            return user
        except Exception as e:
            db.session.rollback()
            raise
    
    @staticmethod
    def get_user_by_email(email):
        """Get user by email"""
        return User.query.filter_by(email=email).first()
    
    @staticmethod
    def get_user_by_id(user_id):
        """Get user by ID"""
        return User.query.get(user_id)
    
    @staticmethod
    def email_exists(email):
        """Check if email already exists"""
        return User.query.filter_by(email=email).first() is not None