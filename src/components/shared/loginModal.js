import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
import { FiEye, FiEyeOff } from "react-icons/fi";
const LoginModal = (
    {
        isOpen,
        onClose,
        onLogin,
        setLogin,
        login,
        dark,
        lang,
        valButtonSize,
    }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const MySwal = withReactContent(Swal);

    const [mode, setMode] = useState("login"); // login | reset
    const [email, setEmail] = useState("");

    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);

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

        try {
            const response = await axios.post("http://localhost:8080/login", {
                username: username,
                password: password,
            });

            const data = response.data;


            MySwal.fire({
                title: lang ? "Log In Successful!" : "Log In Berhasil!",
                text: lang ? `Log In Successful.` : `Log In Berhasil.`,
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
                    title: lang ? "Error!" : "Kesalahan!",
                    text: lang ? `Error Log In : ${error.response.data.error}.` : `Gagal Log In : ${error.response.data.error}.`,
                    icon: "error",
                    timer: 1500,
                    showConfirmButton: false,
                });
            } else {
                MySwal.fire({
                    title: lang ? "Error!" : "Kesalahan!",
                    text: lang ? `Error Log In.` : `Gagal Log In.`,
                    icon: "error",
                    timer: 1500,
                    showConfirmButton: false,
                });
            }
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (loading) return;

        setLoading(true);

        try {
            const response = await axios.post("http://localhost:8080/sendEmailResetPassword", {
                email: email,
            });

            MySwal.fire({
                title: lang ? "Success!" : "Berhasil!",
                text: lang ? "Password reset link has been sent to your email." : "Tautan reset kata sandi telah dikirim ke email Anda.",
                icon: "success",
                timer: 2000,
                showConfirmButton: false,
            });

            setMode("login");
            setEmail("");

        } catch (error) {
            MySwal.fire({
                title: lang ? "Error!" : "Kesalahan!",
                text: lang ? error.response?.data?.error || "Failed to reset password." : error.response?.data?.error || "Gagal reset kata sandi.",
                icon: "error",
                timer: 2000,
                showConfirmButton: false,
            });
        } finally {
            setLoading(false);
        }
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
            <div className={`w-[480px] min-h-[470px] flex flex-col rounded-xl shadow-xl ${dark ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}>

                {/* HEADER */}
                <div className="px-8 pt-20 pb-6 border-b border-gray-200 dark:border-gray-700 relative">
                    {/* LOGO */}
                    <div className="absolute -top-14 left-1/2 -translate-x-1/2">
                        <div className={`w-28 h-28 rounded-full ${dark ? "bg-gray-700" : "bg-white"} shadow-md flex items-center justify-center`}>
                            <img src={dark ? "/WHITE-LOGO.png" : "/BLACK-LOGO.png"} alt="logo" className="w-14 h-14 object-contain" />
                        </div>
                    </div>

                    {/* TITLE */}
                    {mode === "login" && (
                        <>
                            <h2 className={`font-semibold text-center ${sizeTextUp[valButtonSize] || "text-2xl"}`}>Log In</h2>
                        </>
                    )}
                    {mode === "reset" && (
                        <>
                            <h2 className={`font-semibold text-center ${sizeTextUp[valButtonSize] || "text-2xl"}`}>Reset {lang ? "Password" : "Kata Sandi"}</h2>
                        </>
                    )}
                </div>

                {/* CONTENT / FORM */}
                <form onSubmit={mode === "login" ? handleSubmit : handleResetPassword} className="flex-1 flex items-center">
                    <div className="px-8 py-6 space-y-6 w-full">
                        {mode === "login" && (
                            <>
                                <div className="relative shadow-lg">
                                    <input
                                        type="text"
                                        placeholder="Username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className={`w-full h-[52px] px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                                            ${dark ? "bg-gray-700 text-white border-gray-600 placeholder-gray-400" : "bg-white text-black border-gray-300 placeholder-gray-500"}
                                            ${sizeText[valButtonSize] || "text-base"}`}
                                        required
                                    />
                                </div>
                                <div className="relative shadow-lg">
                                    <input
                                        type={showPass ? "text" : "password"}
                                        placeholder={lang ? "Password" : "Kata Sandi"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className={`w-full h-[52px] px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                                            ${dark ? "bg-gray-700 text-white border-gray-600 placeholder-gray-400" : "bg-white text-black border-gray-300 placeholder-gray-500"}
                                            ${sizeText[valButtonSize] || "text-base"}`}
                                        required
                                    />
                                    <span
                                        onClick={() => setShowPass(!showPass)}
                                        className={`absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer
                                                ${dark ? "text-white" : "text-gray-500"}
                                            `}
                                    >
                                        {showPass ? <FiEyeOff /> : <FiEye />}
                                    </span>
                                </div>
                            </>
                        )}
                        {mode === "reset" && (
                            <div className="relative shadow-lg">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`w-full h-[52px] px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500
                                        ${dark ? "bg-gray-700 text-white border-gray-600 placeholder-gray-400" : "bg-white text-black border-gray-300 placeholder-gray-500"}
                                        ${sizeText[valButtonSize] || "text-base"}`}
                                    required
                                />
                            </div>
                        )}

                        {/* SUBMIT */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`shadow-lg w-full py-3 rounded-lg font-semibold text-white transition
                                ${mode === "login"
                                    ? dark
                                        ? "bg-gradient-to-r from-blue-800 to-indigo-800 hover:from-blue-700 hover:to-indigo-700"
                                        : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                                    : dark
                                        ? "bg-gradient-to-r from-red-800 to-pink-800 hover:from-red-700 hover:to-pink-700"
                                        : "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"}
                                ${loading ? "opacity-60 cursor-not-allowed" : ""}
                                ${sizeText[valButtonSize] || "text-base"}`}
                        >
                            {loading ? (lang ? "Processing..." : "Proses...") : mode === "login" ? "Log In" : (lang ? "Reset Password" : "Reset Kata Sandi")}
                        </button>
                    </div>
                </form>

                {/* FOOTER */}
                <div className="px-8 py-5 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">

                        {/* LEFT */}
                        {mode === "login" ? (
                            <button
                                type="button"
                                onClick={() => setMode("reset")}
                                className="text-sm text-red-500 hover:underline"
                            >
                                {lang ? "Forgot Password?" : "Lupa Kata Sandi?"}
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setMode("login")}
                                className="text-sm text-blue-500 hover:underline"
                            >
                                {lang ? "Back to" : "Kembali ke"} <b>Log In</b>
                            </button>
                        )}

                        {/* RIGHT */}
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
        </div>
    );
};

export default LoginModal;