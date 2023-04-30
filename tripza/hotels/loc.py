from PIL import Image

def has_exif(image_path):
    with Image.open(image_path) as img:
        return bool(img._getexif())

print(has_exif('hotel/image.jpg'))
