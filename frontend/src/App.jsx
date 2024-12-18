import { useState } from "react";
import handleUpload, { getProcessedImage } from "./services/file.service.js";
import easyOcrImg from "./assets/easyOcr.webp";
import tesseractImg from "./assets/tesseract.png";
import kerasImg from "./assets/keras.png";

export default function App() {

    const [file, setFile] = useState(null);
    const [textResults, setTextResults] = useState(null);
    const [selectedMode, setSelectedMode] = useState("EasyOCR");
    const [previewUrl, setPreviewUrl] = useState(null);
    const [fileType, setFileType] = useState(null);
    const [loading, setLoading] = useState(false);


    const handleFile = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        if (selectedFile) {
            const url = URL.createObjectURL(selectedFile);
            setPreviewUrl(url);

            const type = selectedFile.type
            setFileType(type);
        }
    };

    const handleUploadFile = async () => {
        try {
            setLoading(true);
            setTextResults(null);
            const formData = new FormData();
            formData.append("file", file);
            console.log(file)
            formData.append("ocr", selectedMode);
            const response = await handleUpload(formData);
            setTextResults(response);
        } catch (error) {
            console.error("Error subiendo el archivo: ", error);
        } finally {
            setLoading(false);
        }
    };

    const formatConfidence = (confidence) => {
        for (let i = 0; i <= confidence.length; i++) {
            let porcentConfidence = confidence * 100
            let porcent = `${porcentConfidence}%`
            return porcent; 
        }
    }

    const handleGetImage = async () => {
        try {
            const response = await getProcessedImage();
            const base64Image = response.data.image_base64;
    
            const imageUrl = `data:image/png;base64,${base64Image}`;
    
            const link = document.createElement("a");
            link.href = imageUrl;
            link.download = "imagen_procesada.png";
            document.body.appendChild(link);
            link.click();
    
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error al obtener la imagen procesada:", error);
        }
    };
    return (
        <div className="w-screen h-screen flex justify-center items-center bg-gray-900">
            <div className="mockup-window bg-base-300 border w-5/6 h-5/6 relative">
                {/* Barra superior con círculos */}
                <div className="absolute top-0 left-0 w-full h-8 bg-gray-800 rounded-t-lg flex items-center px-3">
                    <div className="flex space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                </div>
                {/* Contenido */}
                <div className="bg-base-200 flex justify-center px-4 py-8 h-full text-2xl font-semibold text-gray-800">
                    <div className="flex flex-row w-full h-full gap-x-2">
                        <div className="bg-gray-800 w-1/6 p-4 flex flex-col gap-3 rounded-md">
                        <h2 className="text-white text-xs">Selecciona un OCR</h2>
                        <div className="flex flex-row justify-center items-center gap-3">
                            {[
                                { name: "EasyOCR", src: easyOcrImg },
                                { name: "TesseractOCR", src: tesseractImg },
                                { name: "KerasOCR", src: kerasImg },
                            ].map((mode) => (
                                <button
                                    key={mode.name}
                                    className={`p-1 rounded-sm ${
                                        selectedMode === mode.name
                                            ? "bg-neutral-900"
                                            : "bg-neutral-700"
                                    }`}
                                    onClick={() => setSelectedMode(mode.name)}
                                >
                                    <img
                                        src={mode.src}
                                        alt={mode.name}
                                        className="w-10 h-8 object-contain"
                                    />
                                </button>
                            ))}
                        </div>
                        <h2 className="text-white text-xs">Subida de archivo</h2>
                        <div className="flex flex-col items-center gap-2 mt-2">
                            <input 
                                type="file"
                                onChange={handleFile}
                                className="file-input file-input-bordered file-input-xs w-full max-w-xs text-center"
                                accept=".pdf, .jpg, .jpeg, .png" 
                            />
                            <button
                                className="bg-base-200 text-white rounded p-1 text-sm w-36 mt-1"
                                onClick={handleUploadFile}
                                disabled={!file}
                            >
                                Procesar archivo
                            </button>
                        </div>
                        </div>
                        <div className="bg-gray-800 w-3/6 h-full p-5 overflow-auto rounded-md">
                            <h1 className="text-white text-center mb-4">Texto extraído</h1>
                            <div id="scroll" className="text-white text-lg h-[85%] border-base-200 border-solid border-4 rounded p-4 overflow-auto">
                                {loading ? (
                                    <p className="text-center text-gray-400">Procesando archivo.</p>
                                ) : textResults ? (
                                    <ul className="list-none p-0">
                                        {textResults.map((result, index) => (
                                            <li key={index} className="flex justify-between items-center mb-2 border-gray-700 pb-1">
                                                <div className="flex items-center">
                                                    <span className="mr-2">{result.text}</span>
                                                    <span className="text-red-500 font-bold ml-2">&rarr;</span>
                                                </div>
                                                <span className="text-gray-400 font-semibold">{formatConfidence(result.confidence.toFixed(1))}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-center text-gray-400">No hay texto disponible.</p>
                                )}
                            </div>
                        </div>
                        <div className="bg-gray-800 w-3/6 h-full p-5 overflow-auto rounded-md">
                            <h1 className="text-white text-center mb-4">
                                Previsualización
                            </h1>
                            <div className="text-white text-lg h-[85%] border-base-200 border-solid border-4 rounded p-4">
                                <button onClick={handleGetImage}>
                                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="32" height="32" viewBox="0 0 512 512">
                                    <path d="M 192.08398 80.835938 A 124.964 124.964 0 0 0 67.914062 198.13086 A 93.845 93.845 0 0 0 23.214844 229.30664 A 96.758 96.758 0 0 0 2.609375 288.66406 L 2.5097656 291.83789 C 2.5097656 291.99889 2.5010469 292.15981 2.4980469 292.38281 A 73.29 73.29 0 0 0 76.115234 366 L 255.31641 366 A 137.411 137.411 0 0 0 371.95898 430.95508 C 447.79798 430.95508 509.49609 369.36244 509.49609 293.52344 C 509.49609 217.68444 447.80089 156.08984 371.96289 156.08984 A 138.134 138.134 0 0 0 353.74219 157.29883 A 104.929 104.929 0 0 0 311.10352 148.36133 C 308.65952 148.36133 306.20381 148.44719 303.75781 148.61719 A 124.964 124.964 0 0 0 192.08398 80.835938 z M 195.71875 100.88281 A 104.962 104.962 0 0 1 288.62305 163.3418 A 10 10 0 0 0 299.1582 169.19922 A 85.974 85.974 0 0 1 311.08984 168.36523 C 312.38984 168.36523 313.69052 168.40198 314.97852 168.45898 A 137.422 137.422 0 0 0 234.41016 293.42188 A 134.761 134.761 0 0 0 244.9668 346 L 76.115234 346 A 53.291 53.291 0 0 1 22.5 292.40039 L 22.599609 289.0957 L 22.599609 288.82617 A 76.636 76.636 0 0 1 38.910156 241.68164 A 73.48 73.48 0 0 1 79.910156 215.54102 A 10.023 10.023 0 0 0 87.669922 205.77539 A 104.962 104.962 0 0 1 195.71875 100.88281 z M 367.07422 176.19141 A 117.538 117.538 0 0 1 489.5 293.62891 A 117.671 117.671 0 0 1 371.96289 411.16602 A 117.538 117.538 0 0 1 367.07422 176.19141 z M 370.70703 237.41211 A 10 10 0 0 0 361 247.4082 L 361 316.22852 L 340.06055 295.68945 A 9.85 9.85 0 0 0 326.04492 295.91016 A 10 10 0 0 0 326.32812 310.05273 L 364.50977 347.02734 A 10.027 10.027 0 0 0 378.45117 347.02734 L 416.60547 310.05273 A 10 10 0 0 0 416.70508 295.91016 A 10.149 10.149 0 0 0 402.43945 295.68945 L 381 316.22852 L 381 247.4082 A 10 10 0 0 0 370.70703 237.41211 z"></path>
                                    </svg>
                                </button>
                                {previewUrl && (
                                    fileType === "application/pdf" ? (
                                        <iframe 
                                            src={previewUrl}
                                            className="w-full h-full"
                                        ></iframe>
                                    ) : (
                                        <img 
                                            src={previewUrl}
                                            className="w-full h-[90%] object-contain mt-6"
                                            alt="" 
                                        />
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
