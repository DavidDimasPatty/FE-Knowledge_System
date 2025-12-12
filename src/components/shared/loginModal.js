import React, { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
const LoginModal = (
    { 
    isOpen,
    onClose,
    onLogin,
    setLogin,
    login,
        
    }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const MySwal = withReactContent(Swal);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:8080/login", {
                username: username,
                password: password,
            });

            const data = response.data;


            MySwal.fire({
                title: "Login Successs!",
                text: `Berhasil Login.`,
                icon: "success",
                timer: 1500,
                showConfirmButton: false
            });
            onLogin(data);
            setLogin(!login);
            onClose();

        } catch (error) {
            console.error("ERROR:", error);

            if (error.response) {
                // alert(error.response.data.error || "Login gagal");
                MySwal.fire({
                    title: "Error!",
                    text: `Error Login : ${error.response.data.error}.`,
                    icon: "error",
                    timer: 1500,
                    showConfirmButton: false,
                });
            } else {
                MySwal.fire({
                    title: "Error!",
                    text: `Error Login.`,
                    icon: "error",
                    timer: 1500,
                    showConfirmButton: false,
                });
            }
        }
    };

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 shadow-lg">
                <h2 className="text-xl font-bold mb-4 text-center text-gray-800 dark:text-white">Login</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <input
                        type="text"
                        placeholder="Enter Username..."
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Enter Password..."
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
                    >
                        Login
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

export default LoginModal;