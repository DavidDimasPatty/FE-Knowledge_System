
import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useOutletContext } from "react-router-dom";
const EditDokumen = ({ isOpen, onClose, idDokumen, fetchDokumen, loading, setIsLoading }) => {
    const [docName, setDocName] = useState("");
    const [docLink, setDocLink] = useState("");
    const [file, setFile] = useState(null);
    const MySwal = withReactContent(Swal);
    const { valButtonSize, dark, lang } = useOutletContext();

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

    const fetchEditDokumen = async () => {
        try {
            const res = await axios.get("http://localhost:8080/editDokumenGet?id=" + idDokumen);
            console.log(res.data.data)
            setDocName(res.data.data.Judul);
            setDocLink(res.data.data.Link);
        } catch (err) {
            console.log("Backend error:", err.response.data);
            MySwal.fire({
                title: lang ? "Error!" : "Kesalahan!",
                text: lang ? `Error Add : ${err.response.data.error}.` : `Gagal Menambahkan : ${err.response.data.error}.`,
                icon: "error",
                timer: 1500,
                showConfirmButton: false,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("file", file);
        formData.append("id", idDokumen);
        formData.append("judul", docName);
        formData.append("updId", "David");
        try {
            setIsLoading(true)
            const res = await fetch("http://localhost:8080/editDokumen", {
                method: "POST",
                body: formData,
            });
            const data = await res.text();
            MySwal.fire({
                title: lang ? "Edited!" : "Data Berhasil Diubah!",
                text: lang ? `${docName} success edited.` : `${docName} berhasil diubah.`,
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
                title: lang ? "Error!" : "Kesalahan!",
                text: lang ? `Error Edit : ${err.response.data.error}.` : `Gagal Mengubah : ${err.response.data.error}.`,
                icon: "error",
                timer: 1500,
                showConfirmButton: false,
            });
        }
    };

    useEffect(() => {
        if (isOpen && idDokumen) {
            fetchEditDokumen()
        }
    }, [isOpen, idDokumen]);

    useEffect(() => {
        if (!isOpen) return;

        const handleEsc = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleEsc);

        return () => {
            window.removeEventListener("keydown", handleEsc);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;


    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div
                className={`w-[480px] rounded-xl shadow-xl ${dark ? "bg-gray-800 text-white" : "bg-white text-gray-800"
                    }`}
            >
                {/* HEADER */}
                <div className="px-8 py-6 pt-9 border-b border-gray-200 dark:border-gray-700">
                    <h2 className={`font-semibold ${sizeTextUp[valButtonSize] || "text-lg"}`}>
                        {lang ? "Edit Document" : "Ubah Dokumen"}
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">
                        {lang ? "Update document information or replace file" : "Perbarui informasi dokumen atau ganti file"}
                    </p>
                </div>

                {/* CONTENT */}
                <form onSubmit={handleSubmit}>
                    <div className="px-8 py-6 space-y-6">

                        {/* DOCUMENT NAME */}
                        <div className="relative shadow-lg">
                            <input
                                type="text"
                                placeholder={lang ? "Document Name" : "Nama Dokumen"}
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

                        {/* CURRENT FILE (READ ONLY) */}
                        <div className="relative shadow-lg">
                            <input
                                type="text"
                                value={docLink}
                                readOnly
                                className={`
                                w-full h-[52px] px-4 border rounded-lg
                                cursor-not-allowed opacity-80
                                ${dark
                                        ? "bg-gray-700 text-gray-300 border-gray-600"
                                        : "bg-gray-100 text-gray-600 border-gray-300"}
                                ${sizeText[valButtonSize] || "text-base"}
                            `}
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
                                    px-4 py-2 rounded-md font-semibold text-sm
                                    text-white
                                    ${dark
                                            ? "bg-gradient-to-r from-indigo-800 to-blue-800 hover:from-indigo-700 hover:to-blue-700"
                                            : "bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600"}
                                `}
                                >
                                    {lang ? "Choose File" : "Pilih File"}
                                </span>

                                {/* TEXT */}
                                <span className="truncate opacity-80 text-sm">
                                    {file ? file.name : lang ? "No file chosen" : "Belum ada file dipilih"}
                                </span>

                                {/* REAL INPUT */}
                                <input
                                    type="file"
                                    className="hidden"
                                    onChange={(e) => setFile(e.target.files[0])}
                                />
                            </label>
                        </div>

                        {/* SUBMIT */}
                        <button
                            type="submit"
                            className={`shadow-lg w-full text-white py-3 rounded-lg font-semibold transition
                                ${dark
                                    ? "bg-gradient-to-r from-indigo-800 to-blue-800 hover:from-indigo-700 hover:to-blue-700"
                                    : "bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600"}
                                ${sizeText[valButtonSize] || "text-base"}`}
                        >
                            {lang ? "Edit Document" : "Ubah Dokumen"}
                        </button>
                    </div>
                </form>

                {/* FOOTER */}
                <div className="px-8 py-5 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                    <button
                        onClick={onClose}
                        className={`px-6 py-2 rounded-lg text-sm font-medium transition shadow-md
                                border
                                ${dark
                                ? "text-gray-300 border-gray-600 hover:border-gray-500 hover:bg-gray-700"
                                : "text-gray-600 border-gray-300 hover:border-gray-400 hover:bg-gray-100"}
                            `}
                    >
                        {lang ? "Cancel" : "Batal"}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default EditDokumen;