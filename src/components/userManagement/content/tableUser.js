import React, { useState } from "react";
import DataTable from "react-data-table-component";
import AddUser from "./addUser";
import EditUser from "./editUser";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
const TableUser = ({ users, loading, fetchUser }) => {
    const [isOpenAdd, setIsOpenAdd] = useState(false);
    const [isOpenEdit, setIsOpenEdit] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const MySwal = withReactContent(Swal);

    const openEditPopUp = (idUser) => {
        setSelectedUserId(idUser);
        setIsOpenEdit(true);
    };

    const handleDelete = (userId) => {
        const user = users?.find(u => u.ID === userId);

        MySwal.fire({
            title: `Are you sure to delete ${user?.Nama ?? "this user"}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Hapus!",
            cancelButtonText: "Cancel",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.post("http://localhost:8080/deleteUser", { "Id": userId });

                    MySwal.fire({
                        title: "Deleted!",
                        text: `${user.Nama} has been deleted.`,
                        icon: "success",
                        timer: 1500,
                        showConfirmButton: false
                    });
                    fetchUser();
                } catch (err) {
                    MySwal.fire({
                        title: "Error!",
                        text: `${user.Nama} Error Deleted : ${err}.`,
                        icon: "error",
                        timer: 1500,
                        showConfirmButton: false,
                    });
                }
            }
        });
    };

    const columns = [
        {
            name: "ID",
            selector: row => row.ID,
            sortable: true,
            maxWidth: "80px",
        },
        {
            name: "Nama User",
            selector: row => row.Nama,
            sortable: true,
        },
        {
            name: "Role",
            selector: row => row.Roles,
            sortable: true,
        },
        {
            name: "Tanggal Dibuat",
            selector: row => row.AddTime,
            sortable: true,
            maxWidth: "150px",
        },
        {
            name: "Aksi",
            cell: row => (
                <div className="flex gap-2">
                    <button
                        onClick={() => openEditPopUp(row.ID)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => handleDelete(row.ID)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        Delete
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            width: "300px",
        },
    ];

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">List Users</h1>

            <button
                onClick={() => setIsOpenAdd(true)}
                className="px-3 py-1 w-30 mb-3 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Add User
            </button>

            <DataTable
                columns={columns}
                data={users ?? []}
                progressPending={loading}
                pagination
                highlightOnHover
                selectableRows
            />

            <AddUser
                isOpen={isOpenAdd}
                onClose={() => setIsOpenAdd(false)}
                fetchUser={fetchUser}
            />

            <EditUser
                isOpen={isOpenEdit}
                onClose={() => setIsOpenEdit(false)}
                idUser={selectedUserId}
                fetchUser={fetchUser}
            />
        </div>
    );
};

export default TableUser;