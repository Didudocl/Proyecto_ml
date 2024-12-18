import cv2

def threshold_filter_equializeHist(image, output_path):
    """
    Procesa la imagen aplicando escala de grises, ecualización y umbral adaptativo.
    Guarda la imagen procesada en el `output_path`.
    """
    image_crop_gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    image_crop_thresh = cv2.adaptiveThreshold(
        image_crop_gray, 255, 
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY, 21, 30
    )
    
    cv2.imwrite(output_path, image_crop_thresh)
    return output_path
