from werkzeug.security import generate_password_hash, check_password_hash
from repositories.user_repo import UserRepository

class UserManager:
    def __init__(self):
        self.repository = UserRepository()
    
    def register_user(self, name, email, phone, skill_level, password):
        """
        Register a new user
        Returns: (success: bool, message: str, user: User or None)
        """
        
        # Validate email format
        if not self._is_valid_email(email):
            return False, "Invalid email format", None
        
        # Check if email already exists
        if self.repository.email_exists(email):
            return False, "Email already registered", None
        
        # Validate password
        if not password or len(password) < 6:
            return False, "Password must be at least 6 characters", None
        
        # Hash password
        password_hash = generate_password_hash(password)
        
        # Create user
        print("creating user in database")
        try:
            user = self.repository.create_user(
                name=name,
                email=email,
                phone=phone,
                skill_level=skill_level,
                password_hash=password_hash
            )
            print("user created successfully")
            return True, "User registered successfully", user
        except Exception as e:
            return False, f"Error creating user: {str(e)}", None


    def login_user(self, email, password):
        """Login a user"""
        user = self.repository.get_user_by_email(email)
        if user and self.verify_password(user, password):
            print(f"login successful for user {user.email}")
            return True, "Login successful", user
        else:
            print(f"login failed for user {email}")
            return False, "Invalid email or password", None


    def verify_password(self, user, password):
        """Verify user password"""
        return check_password_hash(user.password_hash, password)
    
    def _is_valid_email(self, email):
        """Basic email validation"""
        return '@' in email and '.' in email.split('@')[1]