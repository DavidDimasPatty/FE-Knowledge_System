import TableUser from "./content/tableUser";
import React, { useState,useEffect } from "react";
import axios from "axios";

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const res = await axios.get("http://localhost:8080/getAllUser");
            console.log(res.data.user.data)
            setUsers(res.data.user.data); 
        } catch (err) {
            console.error("Fetch users error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);
    return (
        <div className="flex-1 flex flex-col">
            <TableUser  users={users} loading={loading}  />
        </div>
    )
}

export default UserManagement;