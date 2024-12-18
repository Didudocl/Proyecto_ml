from pdf2image import convert_from_path
import pytesseract
from pytesseract import Output
import os
import cv2

# Asegúrate de que Tesseract esté instalado y configurado en tu sistema
# Puedes especificar la ruta de Tesseract si es necesario
# pytesseract.pytesseract.tesseract_cmd = r'/usr/bin/tesseract'

def extract_text_only_tesseract(image):
    """Extrae solo el texto de una imagen usando Tesseract OCR."""
    custom_config = r'--oem 3 --psm 6'
    return pytesseract.image_to_string(image, lang="spa+eng", config=custom_config)

def process_pdf_tesseract(pdf_path):
    """Procesa un PDF y extrae texto de cada página usando Tesseract OCR."""
    images = convert_from_path(pdf_path, dpi=300, fmt="jpeg", output_folder="output/pdf_images")
    text_results = []
    for i, image in enumerate(images):
        temp_image_path = f"output/pdf_images/page_{i+1}.jpg"
        image.save(temp_image_path, "JPEG")
        # Leer la imagen usando OpenCV
        img_cv = cv2.imread(temp_image_path)
        if img_cv is not None:
            text = extract_text_only_tesseract(img_cv)
            text_results.append(text)
        os.remove(temp_image_path)
    return text_results

def process_image_tesseract(image_path):
    """Procesa una imagen, dibuja rectángulos en las detecciones y guarda la imagen."""
    print("Cargando imagen desde:", image_path)
    image = cv2.imread(image_path)
    if image is None:
        raise ValueError("Error: No se pudo leer la imagen.")

    # Procesar con Tesseract OCR
    print("Procesando imagen con Tesseract OCR.")
    custom_config = r'--oem 3 --psm 11'
    detections = pytesseract.image_to_data(image, lang="spa+eng", config=custom_config, output_type=Output.DICT)

    # Dibujar rectángulos en la imagen y guardar las detecciones
    detections_data = []
    for i in range(len(detections['text'])):
        if int(detections['conf'][i]) > 0:  # Filtrar detecciones sin confianza
            x, y, w, h = detections['left'][i], detections['top'][i], detections['width'][i], detections['height'][i]
            text = detections['text'][i]
            confidence = detections['conf'][i]

            # Guardar las detecciones en una lista
            detections_data.append({
                "bounding_box": [[x, y], [x + w, y], [x + w, y + h], [x, y + h]],
                "text": text,
                "confidence": float(confidence)
            })

            # Dibujar rectángulo en la imagen
            cv2.rectangle(image, (x, y), (x + w, y + h), color=(0, 0, 255), thickness=1)

    # Crear carpeta de salida y guardar la imagen procesada
    output_folder = "output/processed_images"
    os.makedirs(output_folder, exist_ok=True)
    output_path = os.path.join(output_folder, "process_image_tesseract.png")
    cv2.imwrite(output_path, image)
    print(f"Imagen guardada en: {output_path}")

    print(detections_data)
    # Retornar detecciones serializables
    return detections_data
