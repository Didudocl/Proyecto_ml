import axios from "axios";

const API_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8000';

const instance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'multipart/form-data',
    },
})

export default instance;