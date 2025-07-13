import os
from fastapi import UploadFile
from ocr_utils import extract_text
from exif_utils import extract_exif_metadata
from detect_abuse import detect_abuse
from pdf_generator import generate_pdf_report
from config import UPLOAD_DIR

os.makedirs(UPLOAD_DIR, exist_ok=True)

async def analyze_file(file: UploadFile):
    file_bytes = await file.read()
    file_path = os.path.join(UPLOAD_DIR, file.filename)

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
