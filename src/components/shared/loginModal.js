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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="relative bg-white rounded-xl shadow-xl w-[460px] pt-20 pb-10 px-10">

                {/* LOGO */}
                <div className="absolute -top-14 left-1/2 -translate-x-1/2">
                    <div className="w-28 h-28 rounded-full bg-white shadow-md flex items-center justify-center">
                        <img
                            src="/BLACK-LOGO.png"
                            alt="logo"
                            className="w-14 h-14 object-contain"
                        />
                    </div>
                </div>

                {/* TITLE */}
                <h2 className="text-center text-2xl font-semibold text-gray-800 mb-6">
                    Log in
                </h2>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Email or Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />

                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition"
                    >
                        Log In
                    </button>
                </form>

                {/* FOOTER */}
                <button
                    onClick={onClose}
                    className="mt-4 w-full text-sm text-gray-500 hover:text-gray-700"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default LoginModal;