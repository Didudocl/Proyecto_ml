from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import JSONResponse
from ocr.EasyOCR import process_pdf, process_image
from ocr.TesseractOCR import process_pdf_tesseract, process_image_tesseract
from utils.file_utils import save_uploaded_file, delete_file
import base64


router = APIRouter()

@router.post("/upload/")
async def upload_file(
    file: UploadFile = File(...), 
    ocr: str = Form(...)
):
    """
    Endpoint para subir un archivo (PDF o imagen) y extraer texto con el OCR seleccionado.
    """
    if not file.filename.endswith(('.pdf', '.jpg', '.jpeg', '.png')):
        return JSONResponse({"error": "Solo se permiten archivos PDF o imágenes"}, status_code=400)

    archive_path = ""

    if file.filename.endswith('.pdf'):
        archive_path = save_uploaded_file(await file.read(), f"archives/pdf/{file.filename}")
    elif file.filename.endswith(('.jpg', '.jpeg', '.png')):
        archive_path = save_uploaded_file(await file.read(), f"archives/images/{file.filename}")

    if ocr == "EasyOCR":
        text_results = process_pdf(archive_path) if file.filename.endswith('.pdf') else process_image(archive_path)
    elif ocr == "TesseractOCR":
        text_results = process_pdf_tesseract(archive_path) if file.filename.endswith('.pdf') else process_image_tesseract(archive_path)
    else:
        return JSONResponse({"error": "OCR no valido"}, status_code=500)
    
    return {"text": text_results}

@router.get("/get-processed-image/")
async def get_processed_image():
    output_path = "output/processed_images/process_image.png"
    with open(output_path, "rb") as image_file:
        base64_image = base64.b64encode(image_file.read()).decode("utf-8")
    
    return JSONResponse(content={"image_base64": base64_image})