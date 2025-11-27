import React, { useState, useEffect } from "react";

const EditDokumen = ({ isOpen, onClose, idDokumen }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        //fetch dataDokumen
        // if (isOpen && idUser) {
        //     const userData = users.find(u => u.id === idUser); 
        //     if (userData) {
        //         setEmail(userData.email);
        //         setName(userData.name);
        //     }
        // }
    }, [isOpen, idDokumen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();

    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 shadow-lg">
                <h2 className="text-xl font-bold mb-4 text-center text-gray-800 dark:text-white">Edit Dokumen</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <input
                        type="text"
                        placeholder="Enter Document Name..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <input
                        type="file"
                        placeholder="Submit File"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
                    >
                        Edit Dokumen
                    </button>
                </form>
                <button
                    onClick={onClose}
                    className="mt-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-sm w-full"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default EditDokumen;