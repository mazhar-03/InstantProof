import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise ValueError("SECRET_KEY is not set in environment variables")

ALGORITHM = "HS256"
ISSUER = "http://localhost:5000"
AUDIENCE = "http://localhost:5000"

UPLOAD_DIR = "uploads"
PDF_DIR = os.path.abspath("generated-pdfs")
