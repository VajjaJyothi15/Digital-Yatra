import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = os.path.join(BASE_DIR, 'database', 'digital_yatra.db')
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'sih2026_digital_yatra_secret_key_987654')
    DATABASE = DB_PATH
    UPLOAD_FOLDER = UPLOAD_FOLDER
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB max upload
    CORS_HEADERS = 'Content-Type'
