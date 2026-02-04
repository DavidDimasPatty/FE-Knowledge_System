import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
import { FiEye, FiEyeOff } from "react-icons/fi";

const ResetPassword = ({ dark = false, valButtonSize = "medium" }) => {
    const MySwal = withReactContent(Swal);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get("token");

    const [newPassword, setNewPassword] = useState("");
    const [retypePassword, setRetypePassword] = useState("");
    const [showNew, setShowNew] = useState(false);
    const [showRetype, setShowRetype] = useState(false);

    const [checkingToken, setCheckingToken] = useState(true);
    const [loading, setLoading] = useState(false);

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

    useEffect(() => {
        if (!token) {
            MySwal.fire({
                title: "Error",
                text: "Token not found.",
                icon: "error",
            }).then(() => navigate("/"));
            return;
        }

        axios.get("http://localhost:8080/validateResetToken", {
            params: { token }
        })
            .then(() => setCheckingToken(false))
            .catch((error) => {
                MySwal.fire({
                    title: "Error",
                    text: error.response?.data?.error || "The password reset link is invalid or has already been used.",
                    icon: "error",
                }).then(() => navigate("/"));
            });
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!token) return MySwal.fire("Error", "Invalid token.", "error");

        if (newPassword !== retypePassword) {
            return MySwal.fire({
                title: "Error!",
                text: "Passwords do not match.",
                icon: "error",
                timer: 1500,
                showConfirmButton: false,
            });
        }

        const passwordRules = {
            length: newPassword.length >= 8,
            upper: /[A-Z]/.test(newPassword),
            lower: /[a-z]/.test(newPassword),
            number: /\d/.test(newPassword),
            special: /[^A-Za-z0-9]/.test(newPassword),
        };

        if (!Object.values(passwordRules).every(Boolean)) {
            return MySwal.fire({
                title: "Invalid Password",
                html: `
                    <div style="text-align:left;font-size:14px">
                        <ul>
                            <li>${passwordRules.length ? "✅" : "❌"} Minimum 8 characters</li>
                            <li>${passwordRules.upper ? "✅" : "❌"} Uppercase letter</li>
                            <li>${passwordRules.lower ? "✅" : "❌"} Lowercase letter</li>
                            <li>${passwordRules.number ? "✅" : "❌"} Number</li>
                            <li>${passwordRules.special ? "✅" : "❌"} Special character</li>
                        </ul>
                    </div>
                `,
                icon: "error",
                timer: 2000,
                showConfirmButton: false,
            });
        }

        try {
            setLoading(true);
            await axios.post("http://localhost:8080/resetPassword", { token, newPassword });

            MySwal.fire({
                title: "Success!",
                text: "Password has been successfully reset.",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
            });

            setTimeout(() => navigate("/"), 1500);
        } catch (error) {
            MySwal.fire({
                title: "Error!",
                text: error.response?.data?.error || "Failed to reset password.",
                icon: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    if (checkingToken) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
                <p className="text-gray-600">Verifying token...</p>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-white/100 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className={`w-[480px] rounded-xl shadow-xl ${dark ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}>

                {/* HEADER */}
                <div className="px-8 py-6 pt-20 border-b border-gray-200 dark:border-gray-700 relative text-center">
                    {/* LOGO */}
                    <div className="absolute -top-14 left-1/2 -translate-x-1/2">
                        <div className={`w-28 h-28 rounded-full ${dark ? "bg-gray-700" : "bg-white"} shadow-md flex items-center justify-center`}>
                            <img src={dark ? "/WHITE-LOGO.png" : "/BLACK-LOGO.png"} alt="logo" className="w-14 h-14 object-contain" />
                        </div>
                    </div>
                    <h2 className={`font-semibold ${sizeTextUp[valButtonSize] || "text-2xl"}`}>Reset Password</h2>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6">
                    {/* NEW PASSWORD */}
                    <div className="relative shadow-lg">
                        <input
                            type={showNew ? "text" : "password"}
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 pr-12
                                ${dark ? "bg-gray-700 text-white border-gray-600 placeholder-gray-400" : "bg-white text-black border-gray-300 placeholder-gray-500"}
                                ${sizeText[valButtonSize] || "text-base"}`}
                            required
                        />
                        <span
                            onClick={() => setShowNew(!showNew)}
                            className={`absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer ${dark ? "text-white" : "text-gray-500"}`}
                        >
                            {showNew ? <FiEyeOff /> : <FiEye />}
                        </span>
                    </div>

                    {/* RETYPE PASSWORD */}
                    <div className="relative shadow-lg">
                        <input
                            type={showRetype ? "text" : "password"}
                            placeholder="Retype Password"
                            value={retypePassword}
                            onChange={(e) => setRetypePassword(e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 pr-12
                                ${dark ? "bg-gray-700 text-white border-gray-600 placeholder-gray-400" : "bg-white text-black border-gray-300 placeholder-gray-500"}
                                ${sizeText[valButtonSize] || "text-base"}`}
                            required
                        />
                        <span
                            onClick={() => setShowRetype(!showRetype)}
                            className={`absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer ${dark ? "text-white" : "text-gray-500"}`}
                        >
                            {showRetype ? <FiEyeOff /> : <FiEye />}
                        </span>
                    </div>

                    {/* SUBMIT */}
                    <button
                        disabled={loading}
                        className={`w-full py-3 rounded-lg font-semibold text-white shadow-lg transition 
                            ${dark ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700" : "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"}
                            ${sizeText[valButtonSize] || "text-base"}`}
                    >
                        {loading ? "Processing..." : "Reset Password"}
                    </button>
                </form>

                {/* FOOTER */}
                <div className="px-8 py-5 border-t border-gray-200 dark:border-gray-700 text-center">
                    <div className="flex items-center justify-center">
                        <button
                                type="button"
                                onClick={() => navigate("/")}
                                className="text-sm text-blue-500 hover:underline"
                            >
                                Back to <b>Log In</b>
                            </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;