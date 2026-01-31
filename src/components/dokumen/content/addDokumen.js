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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className={`w-[480px] rounded-xl shadow-xl ${dark ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}>

                {/* HEADER */}
                <div className="px-8 py-6 pt-9 border-b border-gray-200 dark:border-gray-700">
                    <h2 className={`font-semibold ${sizeTextUp[valButtonSize] || "text-lg"}`}>
                        Add Dokumen
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">
                        Upload and manage your document files
                    </p>
                </div>

                {/* CONTENT */}
                <form onSubmit={handleSubmit}>
                    <div className="px-8 py-6 space-y-6">

                        {/* DOCUMENT NAME */}
                        <div className="relative shadow-lg">
                            <input
                                type="text"
                                placeholder="Document Name"
                                value={docName}
                                onChange={(e) => setDocName(e.target.value)}
                                className={`
                                    w-full h-[52px] px-4 border rounded-lg
                                    focus:outline-none focus:ring-2 focus:ring-blue-500
                                    ${dark
                                        ? "bg-gray-700 text-white border-gray-600 placeholder-gray-400"
                                        : "bg-white text-black border-gray-300 placeholder-gray-500"}
                                    ${sizeText[valButtonSize] || "text-base"}
                                `}
                                required
                            />
                        </div>

                        {/* FILE UPLOAD */}
                        <div className="relative shadow-lg">
                            <label
                                className={`
                                    w-full h-[52px] px-4
                                    flex items-center gap-4
                                    border rounded-lg cursor-pointer
                                    focus-within:ring-2 focus-within:ring-blue-500

                                    ${dark
                                        ? "bg-gray-700 border-gray-600 text-white"
                                        : "bg-white border-gray-300 text-gray-700"}
                                `}
                            >
                                {/* BUTTON */}
                                <span
                                    className={`
                                        px-4 py-2 rounded-md font-semibold
                                        bg-gradient-to-r from-blue-500 to-indigo-500
                                        text-white text-sm
                                `}
                                >
                                    Choose File
                                </span>

                                {/* TEXT */}
                                <span className={`truncate opacity-80 text-sm`}>
                                    {file ? file.name : "No file chosen"}
                                </span>

                                {/* REAL INPUT */}
                                <input
                                    type="file"
                                    className="hidden"
                                    onChange={(e) => setFile(e.target.files[0])}
                                    required
                                />
                            </label>
                        </div>


                        {/* SUBMIT */}
                        <button
                            type="submit"
                            className={`shadow-lg w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white py-3 rounded-lg font-semibold transition ${sizeText[valButtonSize] || "text-base"}`}
                        >
                            Add Dokumen
                        </button>
                    </div>
                </form>

                {/* FOOTER */}
                <div className="px-8 py-5 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                    <button
                        onClick={onClose}
                        className={`px-6 py-2 rounded-lg text-sm font-medium ${dark
                            ? "text-gray-300 hover:bg-gray-700"
                            : "text-gray-600 hover:bg-gray-100"}`}
                    >
                        Cancel
                    </button>
                </div>

            </div>
        </div>
    );
};

export default AddDokumen;