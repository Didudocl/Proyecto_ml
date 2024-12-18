import os

def save_uploaded_file(file, path):
    """Guarda un archivo subido temporalmente."""
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "wb") as temp_file:
        temp_file.write(file)
    return path

def delete_file(path):
    """Elimina un archivo temporal."""
    if os.path.exists(path):
        os.remove(path)
