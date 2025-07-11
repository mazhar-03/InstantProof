from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from ocr_utils import extract_text
from exif_utils import extract_exif_metadata

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

    text = extract_text(file_bytes)
    metadata = extract_exif_metadata(file_bytes)
    if not metadata:
        metadata = {"info": "No EXIF metadata found in image."}

    return {
        "extracted_text": text,
        "metadata": metadata,
        "filename": file.filename
    }
