from weasyprint import HTML
from datetime import datetime
import os
import base64

def generate_pdf_report(image_path, extracted_text, metadata, abuse_flags, filename):
    # reads the image as base64
    with open(image_path, "rb") as img_file:
        img_base64 = base64.b64encode(img_file.read()).decode("utf-8")

    html = f"""
    <html>
    <head>
        <style>
            body {{ font-family: Arial; padding: 20px; }}
            h1 {{ color: #333; }}
            .section {{ margin-bottom: 30px; }}
            pre {{ background: #f0f0f0; padding: 10px; border-radius: 5px; }}
            img {{ max-width: 100%; height: auto; border: 1px solid #ccc; }}
        </style>
    </head>
    <body>
        <h1>Instant Proof Report</h1>
        <div class="section"><strong>Generated:</strong> {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</div>
        <div class="section"><strong>Filename:</strong> {filename}</div>
        <div class="section">
            <h2>Original Image</h2>
            <img src="data:image/jpeg;base64,{img_base64}" />
        </div>
        <div class="section">
            <h2>Extracted Text</h2>
            <pre>{extracted_text}</pre>
        </div>
        <div class="section">
            <h2>EXIF Metadata</h2>
            <pre>{metadata}</pre>
        </div>
        <div class="section">
            <h2>Abuse Flags</h2>
            <pre>{abuse_flags}</pre>
        </div>
    </body>
    </html>
    """

    output_path = os.path.join("generated-pdfs", f"{filename}.pdf")
    os.makedirs("generated-pdfs", exist_ok=True)
    HTML(string=html).write_pdf(output_path)
    return output_path
