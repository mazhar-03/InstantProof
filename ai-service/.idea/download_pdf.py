from fastapi.responses import FileResponse

@app.get("/download/{pdf_filename}")
def download_pdf(pdf_filename: str):
    pdf_path = os.path.join("generated-pdfs", pdf_filename)
    if os.path.exists(pdf_path):
        return FileResponse(pdf_path, media_type='application/pdf', filename=pdf_filename)
    return {"error": "File not found"}
