import os
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from ocr_utils import extract_text
from exif_utils import extract_exif_metadata
from detect_abuse import detect_abuse
from pdf_generator import generate_pdf_report

app = FastAPI()

# Allow local dev CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze")
async def analyze_file(file: UploadFile = File(...)):
    file_bytes = await file.read()

    upload_dir = "uploads"
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, file.filename)

    contents = await file.read()
    with open(file_path, "wb") as f:
        f.write(contents)

    extracted_text = extract_text(file_bytes)
    abuse = detect_abuse(extracted_text)
    metadata = extract_exif_metadata(file_bytes)
    pdf_path = generate_pdf_report(
        image_path=file_path,
        extracted_text=extracted_text,
        metadata=metadata,
        abuse_flags=abuse,
        filename=file.filename
    )

    if not metadata:
        metadata = {"info": "No EXIF metadata found in image."}

    return {
        "filename": file.filename,
        "extracted_text": extracted_text,
        "metadata": metadata,
        "abuse_flags": abuse,
        "pdf_path": pdf_path
    }
