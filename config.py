import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
MAX_CONTENT_LENGTH = 5 * 1024 * 1024  # 5 MB
ALLOWED_EXTENSIONS = {'pdf', 'docx'}

SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
