import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
import { useOutletContext } from "react-router-dom";
const AddUser = ({ isOpen, onClose, fetchUser }) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [nama, setNama] = useState("");
    // const [phoneNumber, setPhoneNumber] = useState("");
    const [role, setRole] = useState(1);
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
        try {
            var res = await axios.post("http://localhost:8080/addUser",
                {
                    "nama": nama,
                    "username": username,
                    "email": email,
                    // "noTelp": phoneNumber,
                    "roleId": Number(role),
                    "addId": "David"
                }
            );
            console.log("Success:", res.data);
            MySwal.fire({
                title: "Added!",
                text: `${nama} has been added.`,
                icon: "success",
                timer: 1500,
                showConfirmButton: false
            });
            fetchUser();
            onClose();
        } catch (err) {
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
                className={`
                w-[480px] rounded-xl shadow-xl
                ${dark ? "bg-gray-800 text-white" : "bg-white text-gray-800"}
            `}
            >
                {/* HEADER */}
                <div className="px-8 py-6 pt-9 border-b border-gray-200 dark:border-gray-700">
                    <h2 className={`font-semibold ${sizeTextUp[valButtonSize] || "text-lg"}`}>
                        Add User
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">
                        Create and manage application users
                    </p>
                </div>

                {/* CONTENT */}
                <form onSubmit={handleSubmit}>
                    <div className="px-8 py-6 space-y-5">

                        {/* USERNAME */}
                        <div className="relative shadow-lg">
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
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

                        {/* NAME */}
                        <div className="relative shadow-lg">
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={nama}
                                onChange={(e) => setNama(e.target.value)}
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

                        {/* EMAIL */}
                        <div className="relative shadow-lg">
                            <input
                                type="text"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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

                        {/* PHONE */}
                        {/* <div className="relative shadow-lg">
                            <input
                                type="text"
                                inputMode="tel"
                                placeholder="Phone Number"
                                value={phoneNumber}
                                onChange={(e) => {
                                    let value = e.target.value;

                                    // hapus semua selain angka dan +
                                    value = value.replace(/[^0-9+]/g, "");

                                    // pastikan + hanya di awal dan hanya satu
                                    if (value.includes("+")) {
                                        value =
                                            "+" +
                                            value
                                                .replace(/\+/g, "")
                                                .replace(/^0+/, "");
                                    }

                                    setPhoneNumber(value);
                                }}
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
                        </div> */}

                        {/* ROLE */}
                        <div className="relative shadow-lg">
                            <select
                                className={`
                                    w-full h-[52px] px-4 pr-12
                                    border rounded-lg
                                    appearance-none
                                    focus:outline-none focus:ring-2 focus:ring-blue-500
                                    ${dark
                                        ? "bg-gray-700 text-white border-gray-600"
                                        : "bg-white text-black border-gray-300"}
                                    ${sizeText[valButtonSize] || "text-base"}
                                `}
                                value={role}
                                onChange={(e) => setRole(Number(e.target.value))}
                                required
                            >
                                <option value={1}>Super Admin</option>
                                <option value={2}>Admin</option>
                                <option value={3}>Staff</option>
                            </select>

                            {/* Custom Arrow */}
                            <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                                <svg
                                    className={`w-4 h-4 ${dark ? "text-gray-300" : "text-gray-500"}`}
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </span>
                        </div>

                        {/* SUBMIT */}
                        <button
                            type="submit"
                            className={`
                                shadow-lg w-full text-white py-3 rounded-lg font-semibold transition
                                ${dark
                                    ? "bg-gradient-to-r from-indigo-800 to-blue-800 hover:from-indigo-700 hover:to-blue-700"
                                    : "bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600"}
                                ${sizeText[valButtonSize] || "text-base"}
                        `}
                        >
                            Add User
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
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddUser;