import exifread
import io

def extract_exif_metadata(image_bytes: bytes) -> dict:
    try:
        tags = exifread.process_file(io.BytesIO(image_bytes), stop_tag="EXIF DateTimeOriginal", details=False)
        metadata = {}

        if "EXIF DateTimeOriginal" in tags:
            metadata["timestamp"] = str(tags["EXIF DateTimeOriginal"])
        if "Image Make" in tags:
            metadata["device_make"] = str(tags["Image Make"])
        if "Image Model" in tags:
            metadata["device_model"] = str(tags["Image Model"])

        return metadata
    except Exception as e:
        return {"error": f"EXIF extraction failed: {str(e)}"}
