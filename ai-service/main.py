import os
from jose import jwt, JWTError
from fastapi import FastAPI, File, UploadFile, Depends, Header, HTTPException, status
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from ocr_utils import extract_text
from exif_utils import extract_exif_metadata
from detect_abuse import detect_abuse
from pdf_generator import generate_pdf_report

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

SECRET_KEY = "4p6w6RlYydqwjOT1n07lLiiDxRnle4Gv"
ALGORITHM = "HS256"
ISSUER = "http://localhost:5000"
AUDIENCE = "http://localhost:5000"

def verify_token(token: str):
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
            issuer=ISSUER,
            audience=AUDIENCE
        )
        print("Token verified:", payload)
        return payload
    except JWTError as e:
        print("JWT ERROR:", repr(e))
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid or expired token: {str(e)}"
        )


def get_current_user(authorization: str = Header(...)):
    print("Authorization header received:", authorization)
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid auth header")
    token = authorization[len("Bearer "):]
    print("Extracted token:", token)
    payload = verify_token(token)
    return payload


@app.post("/analyze")
async def analyze_file(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
):
    file_bytes = await file.read()
    upload_dir = "uploads"
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, file.filename)

    with open(file_path, "wb") as f:
        f.write(file_bytes)

    extracted_text = extract_text(file_bytes)
    abuse = detect_abuse(extracted_text)
    metadata = extract_exif_metadata(file_bytes)

    pdf_full_path = generate_pdf_report(
        image_path=file_path,
        extracted_text=extracted_text,
        metadata=metadata,
        abuse_flags=abuse,
        filename=file.filename
    )

    return {
        "filename": file.filename,
        "extracted_text": extracted_text,
        "metadata": metadata or {"info": "No EXIF metadata found in image."},
        "abuse_flags": abuse,
        "pdf_path": os.path.basename(pdf_full_path)
    }


PDF_DIR = os.path.abspath("generated-pdfs")

@app.get("/download/{filename}")
async def download_pdf(filename: str, current_user: dict = Depends(get_current_user)):
    file_path = os.path.join(PDF_DIR, filename)

    if not os.path.isfile(file_path):
        return {"detail": "Not Found"}

    return FileResponse(
        file_path,
        media_type="application/pdf",
        filename=filename
    )
