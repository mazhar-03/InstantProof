from PIL import Image, ImageDraw, ImageFont
import piexif
from datetime import datetime

# Create image with test text
img = Image.new('RGB', (800, 600), color=(255, 255, 255))
draw = ImageDraw.Draw(img)

# Use default font (size may vary by system)
try:
    font = ImageFont.truetype("arial.ttf", 24)
except:
    font = ImageFont.load_default()

text = """Instant Proof Test Image

This image contains:
- Sample text for OCR testing
- Basic EXIF metadata
- The word 'atakan' for threat detection
- Normal text to show the app works

Generated: {date}
""".format(date=datetime.now().strftime('%Y-%m-%d %H:%M:%S'))

draw.text((50, 50), text, font=font, fill=(0, 0, 0))

exif_dict = {
    "0th": {
        piexif.ImageIFD.Make: "TestCamera",
        piexif.ImageIFD.Model: "TestDevice",
    },
    "Exif": {
        piexif.ExifIFD.DateTimeOriginal: datetime.now().strftime("%Y:%m:%d %H:%M:%S"),
    },
    "1st": {}
}

exif_bytes = piexif.dump(exif_dict)

# Save image with EXIF data
filename = "test_image.jpg"
img.save(filename, "jpeg", exif=exif_bytes)
print(f"Test image generated: {filename}")