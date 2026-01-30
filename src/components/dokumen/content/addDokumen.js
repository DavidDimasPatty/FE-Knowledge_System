import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useOutletContext } from "react-router-dom";

const AddDokumen = ({ isOpen, onClose, fetchDokumen, isLoading, setIsLoading }) => {
    const [docName, setDocName] = useState("");
    const [file, setFile] = useState(null);
    const MySwal = withReactContent(Swal);
    const { valButtonSize, dark } = useOutletContext();

    const sizeText = {
        small: "text-sm",
        medium: "text-base",
        large: "text-lg"
    };

    const sizeTextUp = {
        small: "text-xl",
        medium: "text-2xl",
        large: "text-3xl"
    };

    const sizeTextDown = {
        small: "text-xs",
        medium: "text-sm",
        large: "text-base"
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return;
        const formData = new FormData();
        formData.append("file", file);
        formData.append("judul", docName);
        formData.append("addId", "David");
        try {
            setIsLoading(true)
            const res = await fetch("http://localhost:8080/addDokumen", {
                method: "POST",
                body: formData,
            });

            MySwal.fire({
                title: "Added!",
                text: `${docName} has been added.`,
                icon: "success",
                timer: 1500,
                showConfirmButton: false
            });
            fetchDokumen();
            onClose();
            setIsLoading(false)
        } catch (err) {
            setIsLoading(false)
            console.log("Backend error:", err.response.data);
            MySwal.fire({
                title: "Error!",
                text: `Error Add : ${err.response.data.error}.`,
                icon: "error",
                timer: 1500,
                showConfirmButton: false,
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 shadow-lg">
                <h2 className={`font-bold mb-4 text-center text-gray-800 dark:text-white ${sizeTextUp[valButtonSize] || "text-base"}`}>Add Dokumen</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <input
                        type="text"
                        placeholder="Enter Document Name..."
                        value={docName}
                        onChange={(e) => setDocName(e.target.value)}
                        className={`
                            p-2 border border-gray-300 rounded
                            focus:outline-none focus:ring-2 focus:ring-blue-500
                            text-black dark:text-black
                            bg-white dark:bg-white ${sizeText[valButtonSize] || "text-base"}
                        `}
                        required
                    />
                    <input
                        type="file"
                        placeholder="Submit File"
                        onChange={(e) => setFile(e.target.files[0])}
                        className={`
                            p-2 border border-gray-300 rounded
                            focus:outline-none focus:ring-2 focus:ring-blue-500
                            text-black dark:text-black
                            bg-white dark:bg-white ${sizeText[valButtonSize] || "text-base"}
                        `}
                        required
                    />
                    <button
                        type="submit"
                        className={`bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition ${sizeText[valButtonSize] || "text-base"}`}
                    >
                        Add Dokumen
                    </button>
                </form>
                <button
                    onClick={onClose}
                    className={`mt-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 w-full ${sizeTextDown[valButtonSize] || "text-base"}`}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default AddDokumen;