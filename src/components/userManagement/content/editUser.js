import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useOutletContext } from "react-router-dom";

const EditUser = ({ isOpen, onClose, idUser, fetchUser }) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [nama, setNama] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [role, setRole] = useState(0);
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

    useEffect(() => {
        if (isOpen && idUser) {
            fetchEditUser()
        }
    }, [isOpen, idUser]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:8080/editUser",
                {
                    "id": idUser,
                    "nama": nama,
                    "email": email,
                    "noTelp": phoneNumber,
                    "roleId": Number(role),
                    "updId": "David"
                }
            );
            MySwal.fire({
                title: "Added!",
                text: `${nama} has been edited.`,
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

    const fetchEditUser = async () => {
        try {
            const res = await axios.get("http://localhost:8080/editUserGet?id=" + idUser);
            console.log(res.data.data)
            setUsername(res.data.data.Username);
            setEmail(res.data.data.Email);
            setNama(res.data.data.Nama);
            setPhoneNumber(res.data.data.NoTelp);
            setRole(res.data.data.Roles);
        } catch (err) {
            console.error("Fetch dokumen error:", err);
        } finally {
            // setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 shadow-lg">
                <h2 className={`font-bold mb-4 text-center text-gray-800 dark:text-white ${sizeTextUp[valButtonSize] || "text-base"}`}>Edit User</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <input
                        type="text"
                        placeholder="Enter Username..."
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={`p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black dark:text-black bg-white dark:bg-white ${sizeText[valButtonSize] || "text-base"}`}
                        required
                        readOnly={true}
                    />
                    <input
                        type="text"
                        placeholder="Enter Name..."
                        value={nama}
                        onChange={(e) => setNama(e.target.value)}
                        className={`p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black dark:text-black bg-white dark:bg-white ${sizeText[valButtonSize] || "text-base"}`}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Enter Email..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black dark:text-black bg-white dark:bg-white ${sizeText[valButtonSize] || "text-base"}`}
                        required
                        readOnly={true}
                    />
                    <input
                        type="number"
                        placeholder="Enter Phone Number..."
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className={`p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black dark:text-black bg-white dark:bg-white ${sizeText[valButtonSize] || "text-base"}`}
                        required
                        readOnly={true}
                    />

                    <select className={`p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black dark:text-black bg-white dark:bg-white ${sizeText[valButtonSize] || "text-base"}`}
                        onChange={(e) => setRole(Number(e.target.value))}
                        value={role}
                        required
                    >
                        <option value={1}>Super Admin</option>
                        <option value={2}>Admin</option>
                        <option value={3}>Staff</option>
                    </select>

                    <button
                        type="submit"
                        className={`bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition ${sizeText[valButtonSize] || "text-base"}`}
                    >
                        Edit User
                    </button>
                </form>
                <button
                    onClick={onClose}
                    className={`mt-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 w-full ${sizeTextDown[valButtonSize] || "text-base"}`}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default EditUser;