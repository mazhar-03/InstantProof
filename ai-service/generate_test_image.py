import os
from PIL import Image, ImageDraw, ImageFont
import piexif
from datetime import datetime

try:
    # Create image with error handling
    img = Image.new('RGB', (800, 1000), color=(240, 242, 245))
    draw = ImageDraw.Draw(img)

    # Load fonts with fallbacks
    try:
        font = ImageFont.truetype("arial.ttf", 22)
        bold_font = ImageFont.truetype("arialbd.ttf", 24)
    except:
        font = ImageFont.load_default()
        bold_font = ImageFont.load_default()

    # Chat content
    messages = [
        {"sender": "Alice", "text": "Did you send the documents?", "time": "10:00 AM"},
        {"sender": "Bob", "text": "Yes, but the file contains atakan's notes", "time": "10:02 AM"},
        {"sender": "Alice", "text": "Please check page 12 for errors", "time": "10:05 AM"},
    ]

    # Draw messages
    y = 50
    for msg in messages:
        # Sender and time
        draw.text((50, y), f"{msg['sender']} • {msg['time']}", font=bold_font, fill=(0, 0, 128))
        y += 30

        # Message text
        draw.text((50, y), msg['text'], font=font, fill=(0, 0, 0))
        y += 50

    # Save without EXIF to avoid piexif dependency
    if not os.path.exists("test_images"):
        os.makedirs("test_images")
    img.save("test_images/chat.jpg")
    print("Successfully generated: test_images/chat.jpg")

except Exception as e:
    print(f"Error generating image: {str(e)}")