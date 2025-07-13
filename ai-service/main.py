from fastapi import FastAPI, File, UploadFile, Depends
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from auth import get_current_user
from services import analyze_file
from config import PDF_DIR

import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze")
async def analyze_endpoint(
        file: UploadFile = File(...),
        current_user: dict = Depends(get_current_user)
):
    return await analyze_file(file)

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
