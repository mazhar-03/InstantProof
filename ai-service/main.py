import os
from fastapi.responses import FileResponse
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

    # Use already-read bytes to save the file
    with open(file_path, "wb") as f:
        f.write(file_bytes)

    # Then use the same bytes everywhere else
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

    pdf_filename = os.path.basename(pdf_full_path)

    if not metadata:
        metadata = {"info": "No EXIF metadata found in image."}

    return {
        "filename": file.filename,
        "extracted_text": extracted_text,
        "metadata": metadata,
        "abuse_flags": abuse,
        "pdf_path": os.path.basename(pdf_filename)  # <-- just filename, not path
    }


PDF_DIR = os.path.abspath("generated-pdfs")

@app.get("/download/{filename}")
async def download_pdf(filename: str):
    file_path = os.path.join(PDF_DIR, filename)

    if not os.path.isfile(file_path):
        return {"detail": "Not Found"}

    return FileResponse(
        file_path,
        media_type="application/pdf",
        filename=filename
    )
