import { useState } from "react";
import handleUpload, { getProcessedImage } from "./services/file.service.js";

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
        <div className="flex flex-col w-full h-screen">
            <div className="flex flex-row w-full h-screen">
                <div className="bg-black w-1/6 p-4 flex flex-col gap-3 border-r border-white">
                    <div className="flex flex-row gap-2 justify-center">
                        {["EasyOCR", "TesseractOCR", "KerasOCR"].map((mode) => (
                            <button
                                key={mode}
                                className={`p-1.5 rounded ${
                                    selectedMode === mode
                                        ? "bg-neutral-900 text-white"
                                        : "bg-neutral-700 text-gray-300"
                                }`}
                                onClick={() => setSelectedMode(mode)}
                            >
                                {mode}
                            </button>
                        ))}
                    </div>
                    <h2 className="text-base font-semibold text-white mt-4">Subida de archivo</h2>
                    <div className="flex flex-col items-center gap-2 mt-2">
                        <input
                            type="file"
                            onChange={handleFile}
                            className="w-full bg-gray-200 p-2 rounded"
                            accept=".pdf, .jpg, .jpeg, .png"
                        />
                        <button
                            className="bg-neutral-800 text-white rounded p-2 w-full mt-2"
                            onClick={handleUploadFile}
                            disabled={!file}
                        >
                            Procesar archivo
                        </button>
                    </div>
                </div>
                <div className="bg-black w-5/6 h-full p-5 overflow-auto">
                    <h1 className="text-white text-5xl w-full text-center mt-5 mb-10">
                        Texto extraído
                    </h1>
                    <div id="scroll" className="text-white text-lg h-[85%] border-white border-solid border rounded p-4 overflow-auto">
                        {loading ? (
                            <p className="text-center text-gray-400">Procesando archivo...</p>
                        ) : textResults ? (
                            <ul className="list-none p-0">
                                {textResults.map((result, index) => (
                                    <li key={index} className="flex justify-between items-center mb-2 border-b border-gray-700 pb-1">
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
                <div className="bg-black w-5/6 h-full p-5 overflow-auto ">
                    <h1 className="text-white text-5xl w-full text-center mt-5 mb-10">
                        Previsualización
                    </h1>
                    <div className="text-white text-lg h-[85%] border-white border-solid border rounded p-4">
                        <button onClick={handleGetImage}>Click</button>
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
    );
}