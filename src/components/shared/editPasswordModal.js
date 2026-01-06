import React, { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
import { FiEye, FiEyeOff } from "react-icons/fi";
const EditPasswordModal = (
    {
        isOpen,
        onClose
    }) => {
    const [newPassword, setNewPassword] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [retypeNewPassword, setRetypeNewPassword] = useState("");
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showRetype, setShowRetype] = useState(false);
    const MySwal = withReactContent(Swal);
    const username = localStorage.getItem("username");
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (retypeNewPassword != newPassword) {
            MySwal.fire({
                title: "Error!",
                text: `Password Baru Tidak Sama.`,
                icon: "error",
                timer: 1500,
                showConfirmButton: false,
            });
            return null;
        }

        const passwordRules = {
            length: newPassword.length >= 8,
            upper: /[A-Z]/.test(newPassword),
            lower: /[a-z]/.test(newPassword),
            number: /\d/.test(newPassword),
            special: /[^A-Za-z0-9]/.test(newPassword),
        };

        const isValidPassword = Object.values(passwordRules).every(Boolean);

        if (!isValidPassword) {
            MySwal.fire({
                title: "Password Tidak Valid",
                html: `
                        <div style="text-align:left;font-size:14px">
                        <p>Pastikan password memenuhi syarat berikut:</p>
                        <ul>
                            <li>${passwordRules.length ? "✅" : "❌"} Minimal 8 karakter</li>
                            <li>${passwordRules.upper ? "✅" : "❌"} Mengandung huruf besar</li>
                            <li>${passwordRules.lower ? "✅" : "❌"} Mengandung huruf kecil</li>
                            <li>${passwordRules.number ? "✅" : "❌"} Mengandung angka</li>
                            <li>${passwordRules.special ? "✅" : "❌"} Mengandung karakter spesial</li>
                        </ul>
                        </div>
                    `,
                icon: "error",
                timer: 2000,
                showConfirmButton: false,
            });
            return;
        }

        try {
            const response = await axios.post("http://localhost:8080/editPassword", {
                Username: username,
                NewPassword: newPassword,
                OldPassword: oldPassword
            });

            const data = response.data;

            MySwal.fire({
                title: "Edit Password Successs!",
                text: `Berhasil Edit Password.`,
                icon: "success",
                timer: 1500,
                showConfirmButton: false
            });
            onClose();

        } catch (error) {
            console.error("ERROR:", error);

            if (error.response) {
                // alert(error.response.data.error || "Login gagal");
                MySwal.fire({
                    title: "Error!",
                    text: `Error Edit Password : ${error.response.data.error}.`,
                    icon: "error",
                    timer: 1500,
                    showConfirmButton: false,
                });
            } else {
                MySwal.fire({
                    title: "Error!",
                    text: `Error Edit Password.`,
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

                {/* LOGO
                <div className="absolute -top-14 left-1/2 -translate-x-1/2">
                    <div className="w-28 h-28 rounded-full bg-white shadow-md flex items-center justify-center">
                        <img
                            src="/BLACK-LOGO.png"
                            alt="logo"
                            className="w-14 h-14 object-contain"
                        />
                    </div>
                </div> */}

                {/* TITLE */}
                <h2 className="text-center text-2xl font-semibold text-gray-800 mb-6">
                    Edit Password
                </h2>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* <input
                        type="text"
                        placeholder="Email or Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    /> */}

                    <div className="relative">
                        <input
                            type={showOld ? "text" : "password"}
                            placeholder="Password Lama"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
                            required
                        />

                        <span
                            onClick={() => setShowOld(!showOld)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                        >
                            {showOld ? <FiEyeOff /> : <FiEye />}
                        </span>
                    </div>

                    <div className="relative">
                        <input
                            type={showNew ? "text" : "password"}
                            placeholder="Password Baru"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
                            required
                        />

                        <span
                            onClick={() => setShowNew(!showNew)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                        >
                            {showNew ? <FiEyeOff /> : <FiEye />}
                        </span>
                    </div>

                    <div className="relative">
                        <input
                            type={showRetype ? "text" : "password"}
                            placeholder="Ketik Ulang Password Baru"
                            value={retypeNewPassword}
                            onChange={(e) => setRetypeNewPassword(e.target.value)}
                            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
                            required
                        />

                        <span
                            onClick={() => setShowRetype(!showRetype)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                        >
                            {showRetype ? <FiEyeOff /> : <FiEye />}
                        </span>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition"
                    >
                        Edit Password
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

export default EditPasswordModal;