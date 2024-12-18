import axios from './root.service.js';

export default async function handleUpload(file) {
    try {
        const response = await axios.post('/upload/', file);
        return response.data.text;
    } catch (error) {
        console.error("Error subiendo el archivo: ", error);
    }
}

export async function getProcessedImage() {
    try {
        const response = await axios.get('/get-processed-image/')
        return response;
    } catch (error) {
        console.error("Error obteniendo la imagen: ", error);
    }
}