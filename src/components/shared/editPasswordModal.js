import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
import { FiEye, FiEyeOff } from "react-icons/fi";
const EditPasswordModal = (
    {
        isOpen,
        onClose,
        valButtonSize,
        dark,
        lang
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
                title: lang ? "Error!" : "Kesalahan!",
                text: lang ? `New passwords do not match.` : `Kata sandi baru tidak cocok.`,
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
                title: lang ? "Invalid Password" : "Kata sandi tidak valid",
                html: lang ?
                    `
                    <div style="text-align:left;font-size:14px">
                        <p>Make sure the password meets the following requirements:</p>
                        <ul>
                            <li>${passwordRules.length ? "✅" : "❌"} Minimum 8 characters</li>
                            <li>${passwordRules.upper ? "✅" : "❌"} Uppercase letter</li>
                            <li>${passwordRules.lower ? "✅" : "❌"} Lowercase letter</li>
                            <li>${passwordRules.number ? "✅" : "❌"} Number</li>
                            <li>${passwordRules.special ? "✅" : "❌"} Special character</li>
                        </ul>
                    </div>
                    ` :
                    `
                    <div style="text-align:left;font-size:14px">
                        <p>Pastikan kata sandi memenuhi ketentuan berikut:</p>
                        <ul>
                            <li>${passwordRules.length ? "✅" : "❌"} Minimal 8 karakter</li>
                            <li>${passwordRules.upper ? "✅" : "❌"} Mengandung huruf besar</li>
                            <li>${passwordRules.lower ? "✅" : "❌"} Mengandung huruf kecil</li>
                            <li>${passwordRules.number ? "✅" : "❌"} Mengandung angka</li>
                            <li>${passwordRules.special ? "✅" : "❌"} Mengandung karakter khusus</li>
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
                title: lang ? "Password Updated Successfully!" : "Kata sandi berhasil diperbarui!",
                text: lang ? `Password Updated Successfully.` : `Kata sandi berhasil diperbarui.`,
                icon: "success",
                timer: 1500,
                showConfirmButton: false
            });
            onClose();

        } catch (error) {
            console.error("ERROR:", error);

            if (error.response) {
                MySwal.fire({
                    title: lang ? "Error!" : "Kesalahan!",
                    text: lang ? `Failed to Edit Password : ${error.response.data.error}.` : `Gagal mengubah kata sandi : ${error.response.data.error}.`,
                    icon: "error",
                    timer: 1500,
                    showConfirmButton: false,
                });
            } else {
                MySwal.fire({
                    title: lang ? "Error!" : "Kesalahan!",
                    text: lang ? `Failed to Edit Password.` : `Gagal mengubah kata sandi.`,
                    icon: "error",
                    timer: 1500,
                    showConfirmButton: false,
                });
            }
        }
    };

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
            <div className={`w-[480px] rounded-xl shadow-xl ${dark ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}>

                {/* HEADER */}
                <div className="px-8 py-6 pt-9 border-b border-gray-200 dark:border-gray-700">
                    <h2 className={`font-semibold ${sizeTextUp[valButtonSize] || "text-lg"}`}>
                        {lang ? "Edit Password" : "Ubah Kata Sandi"}
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">
                        {lang ? "Change your account password securely" : "Ubah kata sandi akun Anda dengan aman"}
                    </p>
                </div>

                {/* CONTENT */}
                <form onSubmit={handleSubmit}>
                    <div className="px-8 py-6 space-y-6">
                        {/* OLD PASSWORD */}
                        <div className="relative shadow-lg">
                            <input
                                type={showOld ? "text" : "password"}
                                placeholder={lang ? "Current Password" : "Kata Sandi Saat Ini"}
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                className={`
            w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12
            ${dark ? "bg-gray-700 text-white border-gray-600 placeholder-gray-400" : "bg-white text-black border-gray-300 placeholder-gray-500"}
            ${sizeText[valButtonSize] || "text-base"}
        `}
                                required
                            />
                            <span
                                onClick={() => setShowOld(!showOld)}
                                className={`absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer
            ${dark ? "text-white" : "text-gray-500"}
        `}
                            >
                                {showOld ? <FiEyeOff /> : <FiEye />}
                            </span>
                        </div>

                        {/* NEW PASSWORD */}
                        <div className="relative shadow-lg">
                            <input
                                type={showNew ? "text" : "password"}
                                placeholder={lang ? "New Password" : "Kata Sandi Baru"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className={`
            w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12
            ${dark ? "bg-gray-700 text-white border-gray-600 placeholder-gray-400" : "bg-white text-black border-gray-300 placeholder-gray-500"}
            ${sizeText[valButtonSize] || "text-base"}
        `}
                                required
                            />
                            <span
                                onClick={() => setShowNew(!showNew)}
                                className={`absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer
            ${dark ? "text-white" : "text-gray-500"}
        `}
                            >
                                {showNew ? <FiEyeOff /> : <FiEye />}
                            </span>
                        </div>

                        {/* RETYPE NEW PASSWORD */}
                        <div className="relative shadow-lg">
                            <input
                                type={showRetype ? "text" : "password"}
                                placeholder={lang ? "Confirm New Password" : "Konfirmasi Kata Sandi Baru"}
                                value={retypeNewPassword}
                                onChange={(e) => setRetypeNewPassword(e.target.value)}
                                className={`
            w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12
            ${dark ? "bg-gray-700 text-white border-gray-600 placeholder-gray-400" : "bg-white text-black border-gray-300 placeholder-gray-500"}
            ${sizeText[valButtonSize] || "text-base"}
        `}
                                required
                            />
                            <span
                                onClick={() => setShowRetype(!showRetype)}
                                className={`absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer
            ${dark ? "text-white" : "text-gray-500"}
        `}
                            >
                                {showRetype ? <FiEyeOff /> : <FiEye />}
                            </span>
                        </div>

                        {/* SUBMIT BUTTON */}
                        <button
                            type="submit"
                            className={`shadow-lg w-full text-white py-3 rounded-lg font-semibold transition
                                ${dark
                                    ? "bg-gradient-to-r from-indigo-800 to-blue-800 hover:from-indigo-700 hover:to-blue-700"
                                    : "bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600"}
                                ${sizeText[valButtonSize] || "text-base"}`}
                        >
                            {lang ? "Update Password" : "Ubah Kata Sandi"}
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

export default EditPasswordModal;