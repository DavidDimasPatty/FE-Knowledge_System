import React, { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
const AddUser = ({ isOpen, onClose, fetchUser }) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [nama, setNama] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [role, setRole] = useState(1);
    const MySwal = withReactContent(Swal);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            var res = await axios.post("http://localhost:8080/addUser",
                {
                    "nama": nama,
                    "username": username,
                    "email": email,
                    "noTelp": phoneNumber,
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
            console.log("Backend error:", err);
            MySwal.fire({
                title: "Error!",
                text: `Error Add : ${err}.`,
                icon: "error",
                timer: 1500,
                showConfirmButton: false,
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 shadow-lg">
                <h2 className="text-xl font-bold mb-4 text-center text-gray-800 dark:text-white">Add User</h2>
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
                        type="text"
                        placeholder="Enter Name..."
                        value={nama}
                        onChange={(e) => setNama(e.target.value)}
                        className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Enter Email..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <input
                        type="number"
                        placeholder="Enter Phone Number..."
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <select className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
                    >
                        Add User
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

export default AddUser;