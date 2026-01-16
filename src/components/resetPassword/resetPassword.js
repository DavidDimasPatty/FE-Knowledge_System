import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
import { FiEye, FiEyeOff } from "react-icons/fi";

const ResetPassword = () => {
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

    useEffect(() => {
        if (!token) {
            MySwal.fire({
                title: "Error",
                text: "Token tidak ditemukan",
                icon: "error",
            }).then(() => navigate("/"));
            return;
        }

        axios.get("http://localhost:8080/validateResetToken", {
            params: { token }
        })
            .then(() => {
                setCheckingToken(false);
            })
            .catch((error) => {
                MySwal.fire({
                    title: "Error",
                    text: error.response?.data?.error || "Link reset password tidak valid atau sudah digunakan",
                    icon: "error",
                }).then(() => navigate("/"));
            });
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!token) {
            MySwal.fire("Error", "Token tidak valid", "error");
            return;
        }

        if (newPassword !== retypePassword) {
            MySwal.fire({
                title: "Error!",
                text: "Password tidak sama",
                icon: "error",
                timer: 1500,
                showConfirmButton: false,
            });
            return;
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
                        <ul>
                            <li>${passwordRules.length ? "✅" : "❌"} Minimal 8 karakter</li>
                            <li>${passwordRules.upper ? "✅" : "❌"} Huruf besar</li>
                            <li>${passwordRules.lower ? "✅" : "❌"} Huruf kecil</li>
                            <li>${passwordRules.number ? "✅" : "❌"} Angka</li>
                            <li>${passwordRules.special ? "✅" : "❌"} Karakter spesial</li>
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
            setLoading(true);
            await axios.post("http://localhost:8080/resetPassword", {
                token: token,
                newPassword: newPassword,
            });

            MySwal.fire({
                title: "Success!",
                text: "Password berhasil direset",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
            });

            setTimeout(() => navigate("/"), 1500);
        } catch (error) {
            MySwal.fire({
                title: "Error!",
                text: error.response?.data?.error || "Reset password gagal",
                icon: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    if (checkingToken) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
                <p className="text-gray-600">Memverifikasi token...</p>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-white/100 backdrop-blur-md flex items-center justify-center z-50">
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


                <h2 className="text-center text-2xl font-semibold mb-6">
                    Reset Password
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <input
                            type={showNew ? "text" : "password"}
                            placeholder="Password Baru"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-3 border rounded-lg pr-12"
                            required
                        />
                        <span
                            onClick={() => setShowNew(!showNew)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                        >
                            {showNew ? <FiEyeOff /> : <FiEye />}
                        </span>
                    </div>

                    <div className="relative">
                        <input
                            type={showRetype ? "text" : "password"}
                            placeholder="Ketik Ulang Password"
                            value={retypePassword}
                            onChange={(e) => setRetypePassword(e.target.value)}
                            className="w-full px-4 py-3 border rounded-lg pr-12"
                            required
                        />
                        <span
                            onClick={() => setShowRetype(!showRetype)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                        >
                            {showRetype ? <FiEyeOff /> : <FiEye />}
                        </span>
                    </div>

                    <button disabled={loading} className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold">
                        {loading ? "Processing..." : "Reset Password"}
                    </button>

                </form>

                {/* FOOTER */}
                <button
                    onClick={() => navigate("/")}
                    className="mt-4 w-full text-sm text-gray-500 hover:text-gray-700"
                >
                    Back to Login
                </button>
            </div>
        </div>
    );
};

export default ResetPassword;
