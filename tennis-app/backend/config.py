import os
from dotenv import load_dotenv

# Load environment variables from .env file
# Load from parent directory (project root)
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))

# Read environment variables
db_url = os.getenv('DATABASE_URL', 'sqlite:///tennis_matchmaking.db')

# If relative path, make it absolute relative to project root
if db_url.startswith('sqlite:///'):
    db_path = db_url.replace('sqlite:///', '')
    if not os.path.isabs(db_path):
        # Make path relative to project root
        project_root = os.path.dirname(os.path.dirname(__file__))
        db_path = os.path.join(project_root, db_path)
        db_path = os.path.normpath(db_path)
    DATABASE_URL = f'sqlite:///{db_path}'
else:
    DATABASE_URL = db_url

SECRET_KEY = os.getenv('SECRET_KEY')
FLASK_ENV = os.getenv('FLASK_ENV')
