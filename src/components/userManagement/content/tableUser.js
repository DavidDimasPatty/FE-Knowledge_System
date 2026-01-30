import React, { useState } from "react";
import DataTable from "react-data-table-component";
import AddUser from "./addUser";
import EditUser from "./editUser";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
import { useOutletContext } from "react-router-dom";
const TableUser = ({ users, loading, fetchUser }) => {
    const [isOpenAdd, setIsOpenAdd] = useState(false);
    const [isOpenEdit, setIsOpenEdit] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
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

    const fontSizeMap = {
        small: "13px",
        medium: "15px",
        large: "17px"
    };

    const headerFontSizeMap = {
        small: "14px",
        medium: "16px",
        large: "18px"
    };

    function formatTanggal(isoDate) {
        return new Intl.DateTimeFormat("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            timeZone: "Asia/Jakarta"
        }).format(new Date(isoDate));
    }

    const customStyles = {
        headCells: {
            style: {
                fontSize: headerFontSizeMap[valButtonSize],
                fontWeight: "600"
            }
        },
        cells: {
            style: {
                fontSize: fontSizeMap[valButtonSize]
            }
        },
        rows: {
            style: {
                minHeight:
                    valButtonSize === "small"
                        ? "38px"
                        : valButtonSize === "medium"
                            ? "44px"
                            : "52px"
            }
        },
        pagination: {
            style: {
                fontSize: fontSizeMap[valButtonSize]
            }
        }
    };

    const openEditPopUp = (idUser) => {
        setSelectedUserId(idUser);
        setIsOpenEdit(true);
    };

    const handleDelete = (userId) => {
        const user = users?.find(u => u.ID === userId);

        MySwal.fire({
            title: `Are you sure to delete "${user?.Nama ?? "this user"}"?`,
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

    const handleActivate = (userId) => {
        const user = users?.find(u => u.ID === userId);

        MySwal.fire({
            title: `Are you sure to activate "${user?.Nama ?? "this user"}"?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Hapus!",
            cancelButtonText: "Cancel",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.post("http://localhost:8080/changeStatusUser", { "Id": userId, "Status": user.Status });

                    MySwal.fire({
                        title: "Success!",
                        text: `${user.Nama} has been activated.`,
                        icon: "success",
                        timer: 1500,
                        showConfirmButton: false
                    });
                    fetchUser();
                } catch (err) {
                    MySwal.fire({
                        title: "Error!",
                        text: `${user.Nama} Error activated : ${err}.`,
                        icon: "error",
                        timer: 1500,
                        showConfirmButton: false,
                    });
                }
            }
        });
    };

    const handleDeactivate = (userId) => {
        const user = users?.find(u => u.ID === userId);

        MySwal.fire({
            title: `Are you sure to block "${user?.Nama ?? "this user"}"?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Hapus!",
            cancelButtonText: "Cancel",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.post("http://localhost:8080/changeStatusUser", { "Id": userId, "Status": user.Status });

                    MySwal.fire({
                        title: "Success!",
                        text: `${user.Nama} has been block.`,
                        icon: "success",
                        timer: 1500,
                        showConfirmButton: false
                    });
                    fetchUser();
                } catch (err) {
                    MySwal.fire({
                        title: "Error!",
                        text: `${user.Nama} Error block : ${err}.`,
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
            name: "Name",
            selector: row => row.Nama,
            sortable: true,
            wrap: true
        },
        {
            name: "Role",
            selector: row => row.Roles,
            sortable: true,
        },
        {
            name: "Created At",
            selector: row => formatTanggal(row.AddTime),
            sortable: true,
            maxWidth: "200px",
            wrap: true
        },
        {
            name: "Action",
            cell: row => (
                <div className="flex gap-2">
                    <button
                        onClick={() => openEditPopUp(row.ID)}
                        className={`px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 ${sizeTextDown[valButtonSize] || "text-base"}`}
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => handleDelete(row.ID)}
                        className={`px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 ${sizeTextDown[valButtonSize] || "text-base"}`}
                    >
                        Delete
                    </button>


                    {row.Status == "Active" ? (
                        <button
                            onClick={() => handleDeactivate(row.ID)}
                            className={`w-24 px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 ${sizeTextDown[valButtonSize] || "text-base"}`}
                        >
                            Deactivate
                        </button>
                    ) : (
                        <button
                            onClick={() => handleActivate(row.ID)}
                            className={`w-24 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 ${sizeTextDown[valButtonSize] || "text-base"}`}
                        >
                            Activate
                        </button>
                    )}
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
            <h1 className={`font-bold mb-4 ${sizeTextUp[valButtonSize] || "text-base"}`}>List Users</h1>

            <button
                onClick={() => setIsOpenAdd(true)}
                className={`px-3 py-1 w-30 mb-3 bg-blue-500 text-white rounded hover:bg-blue-600 ${sizeText[valButtonSize] || "text-base"}`}
            >
                Add User
            </button>

            <DataTable
                columns={columns}
                data={users ?? []}
                progressPending={loading}
                pagination
                highlightOnHover
                // selectableRows
                customStyles={customStyles}
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