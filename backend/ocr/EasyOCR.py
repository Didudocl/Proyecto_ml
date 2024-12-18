from pdf2image import convert_from_path
import easyocr
import os
from utils.transform_filter_image import threshold_filter_equializeHist
import cv2

reader = easyocr.Reader(['en', 'es'], gpu=False)

def extract_text_only(detections):
    """Extrae solo el texto de las detecciones de EasyOCR."""
    return [detection[1] for detection in detections]

def process_pdf(pdf_path):
    """Procesa un PDF y extrae solo el texto."""
    images = convert_from_path(pdf_path, dpi=300, fmt="jpeg", output_folder="output/pdf_images")
    text_results = []
    for i, image in enumerate(images):
        temp_image_path = f"output/pdf_images/page_{i+1}.jpg"
        image.save(temp_image_path, "JPEG")
        detections = reader.readtext(temp_image_path, paragraph=True)
        text_results.extend(extract_text_only(detections))
        os.remove(temp_image_path)
    return text_results

def process_image(image_path):
    """Procesa una imagen, dibuja rectángulos en las detecciones y guarda la imagen."""
    print("Cargando imagen desde:", image_path)
    image = cv2.imread(image_path)
    if image is None:
        raise ValueError("Error: No se pudo leer la imagen.")
    
    # Procesar con EasyOCR
    print("Procesando imagen con EasyOCR.")
    detections = reader.readtext(image_path, paragraph=False)

    # Dibujar rectángulos en la imagen y convertir detecciones a tipos serializables
    detections_data = []
    for detection in detections:
        bbox, text, confidence = detection

        # Convertir las coordenadas bbox a listas de floats estándar
        bbox = [[float(coord[0]), float(coord[1])] for coord in bbox]

        # Guardar detecciones en una lista serializable
        detections_data.append({
            "bounding_box": bbox,
            "text": text,
            "confidence": float(confidence)
        })

        # Dibujar rectángulo en la imagen
        p1, p3 = bbox[0], bbox[2]
        x1, y1 = int(p1[0]), int(p1[1])
        x2, y2 = int(p3[0]), int(p3[1])
        cv2.rectangle(image, (x1, y1), (x2, y2), color=(0, 0, 255), thickness=1)

    # Crear carpeta de salida y guardar la imagen procesada
    output_folder = "output/processed_images"
    os.makedirs(output_folder, exist_ok=True)
    output_path = os.path.join(output_folder, "process_image.png")
    cv2.imwrite(output_path, image)
    print(f"Imagen guardada en: {output_path}")

    print(detections_data)
    # Retornar detecciones serializables
    return detections_data