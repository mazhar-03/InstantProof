from PIL import Image
import pytesseract
import io

def extract_text(image_bytes: bytes) -> str:
    try:
        image = Image.open(io.BytesIO(image_bytes))
        text = pytesseract.image_to_string(image)
        # removes leading and trailing whitespace characters from a string
        return text.strip()
    except Exception as e:
        return f"OCR failed: {str(e)}"
