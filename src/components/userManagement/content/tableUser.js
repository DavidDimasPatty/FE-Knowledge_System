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

    const sizeButtonAcDeac = {
        small: "77px",
        medium: "86px",
        large: "94px"
    };

    function formatTanggal(isoDate, locale = "en-US") {
        return new Intl.DateTimeFormat(locale, {
            day: "2-digit",
            month: "long",
            year: "numeric",
            timeZone: "Asia/Jakarta"
        }).format(new Date(isoDate));
    }

    const customStyles = {
        table: {
            style: {
                backgroundColor: dark ? "#111827" : "#ffffff"
            }
        },
        headRow: {
            style: {
                backgroundColor: dark ? "#1f2937" : "#f9fafb",
                borderBottom: dark ? "1px solid #374151" : "1px solid #e5e7eb"
            }
        },
        headCells: {
            style: {
                fontSize: headerFontSizeMap[valButtonSize],
                fontWeight: "600",
                color: dark ? "#e5e7eb" : "#374151"
            }
        },
        rows: {
            style: {
                minHeight:
                    valButtonSize === "small"
                        ? "38px"
                        : valButtonSize === "medium"
                            ? "44px"
                            : "52px",

                backgroundColor: dark ? "#111827" : "#ffffff",
                color: dark ? "#e5e7eb" : "#374151",

                borderTop: dark
                    ? "1px solid rgba(255, 255, 255, 0.19)"
                    : "1px solid #e5e7eb",

                borderBottom: dark
                    ? "1px solid rgba(255, 255, 255, 0.19)"
                    : "1px solid #e5e7eb",

                transition: "background-color 0.2s ease"
            },

            highlightOnHoverStyle: {
                backgroundColor: dark ? "#283548" : "#f9fafb",
                color: dark ? "#f9fafb" : "#374151",
                borderLeft: "3px solid #6366f1"
            }
        },
        cells: {
            style: {
                fontSize: fontSizeMap[valButtonSize]
            }
        },
        pagination: {
            style: {
                backgroundColor: dark ? "#111827" : "#ffffff",
                color: dark ? "#e5e7eb" : "#374151",
                borderTop: dark ? "1px solid #1f2937" : "1px solid #e5e7eb"
            },
            pageButtonsStyle: {
                color: dark ? "#e5e7eb" : "#374151",
                fill: dark ? "#e5e7eb" : "#374151",
                backgroundColor: "transparent",
                borderRadius: "6px",

                "&:disabled": {
                    color: dark ? "#6b7280" : "#9ca3af",
                    fill: dark ? "#6b7280" : "#9ca3af"
                },

                "&:hover:not(:disabled)": {
                    backgroundColor: dark ? "#1f2937" : "#f3f4f6"
                },

                "&:focus": {
                    outline: "none",
                    backgroundColor: dark ? "#283548" : "#e5e7eb"
                }
            }
        }
    };

    const CustomLoader = ({ dark }) => (
        <div
            className={`flex items-center justify-center py-10 w-full
            ${dark ? "bg-gray-800" : "bg-white"}
            `}
        >
            <div
                className={`flex items-center gap-4 rounded-lg px-6 py-4
                ${dark
                        ? "text-gray-300 shadow-black/40"
                        : "text-gray-600"
                    }`}
            >
                {/* Dots */}
                <div className="flex items-center gap-1">
                    <span
                        className={`h-2 w-2 rounded-full animate-bounce
                        ${dark ? "bg-blue-400" : "bg-blue-600"}`}
                    />
                    <span
                        className={`h-2 w-2 rounded-full animate-bounce [animation-delay:150ms]
                        ${dark ? "bg-blue-400" : "bg-blue-600"}`}
                    />
                    <span
                        className={`h-2 w-2 rounded-full animate-bounce [animation-delay:300ms]
                        ${dark ? "bg-blue-400" : "bg-blue-600"}`}
                    />
                </div>
            </div>
        </div>
    );

    const NoData = ({ dark, valButtonSize }) => (
        <div
            className={`
            w-full text-center py-6
            ${dark ? "bg-gray-800 text-gray-400" : "text-gray-600"}
            ${sizeText[valButtonSize] || "text-base"}
        `}
        >
            There are no records to display
        </div>
    );

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
            confirmButtonText: "Delete!",
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
            confirmButtonText: "Activate!",
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
            confirmButtonText: "Block!",
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

    const actionBtnBase = "px-3 py-1 rounded-md font-medium transition-all duration-200 " + (sizeTextDown[valButtonSize] || "text-sm");

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
            selector: row => row.RoleName,
            sortable: true,
        },
        {
            name: "Created At",
            selector: row => formatTanggal(row.AddTime, "en-US"),
            sortable: true,
            maxWidth: "200px",
            wrap: true
        },
        {
            name: "Action",
            cell: row => (
                <div className="flex gap-2">
                    {/* Edit */}
                    <button
                        onClick={() => openEditPopUp(row.ID)}
                        className={`
                            ${actionBtnBase}
                            text-white
                            ${dark
                                ? "bg-gradient-to-r from-indigo-800 to-blue-800 hover:from-indigo-700 hover:to-blue-700"
                                : "bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600"}
                            shadow-sm
                        `}
                    >
                        Edit
                    </button>

                    {/* Delete */}
                    <button
                        onClick={() => handleDelete(row.ID)}
                        className={`
                            ${actionBtnBase}
                            text-white
                            ${dark
                                ? "bg-gradient-to-r from-red-800 to-rose-800 hover:from-red-700 hover:to-rose-700"
                                : "bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600"}
                            shadow-sm
                        `}
                    >
                        Delete
                    </button>

                    {/* Activate / Deactivate */}
                    {row.Status === "Active" ? (
                        <button
                            onClick={() => handleDeactivate(row.ID)}
                            style={{ width: sizeButtonAcDeac[valButtonSize] }}
                            className={`
                                ${actionBtnBase}
                                text-white
                                ${dark
                                    ? "bg-gradient-to-r from-amber-800 to-orange-800 hover:from-amber-700 hover:to-orange-700"
                                    : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"}
                                shadow-sm
                            `}
                        >
                            Deactivate
                        </button>
                    ) : (
                        <button
                            onClick={() => handleActivate(row.ID)}
                            style={{ width: sizeButtonAcDeac[valButtonSize] }}
                            className={`
                                ${actionBtnBase}
                                text-white
                                ${dark
                                    ? "bg-gradient-to-r from-emerald-800 to-teal-800 hover:from-emerald-700 hover:to-teal-700"
                                    : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"}
                                shadow-sm
                            `}
                        >
                            Activate
                        </button>
                    )}
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            width: "320px",
        },
    ];

    return (
        <div className="relative mt-5">
            <div
                className={`
                p-6 rounded-xl shadow-sm
                ${dark ? "text-gray-100" : "text-gray-800"}
            `}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h1
                        className={`
                        font-semibold
                        ${sizeTextUp[valButtonSize] || "text-lg"}
                        ${dark ? "text-gray-100" : "text-gray-800"}
                    `}
                    >
                        User List
                    </h1>

                    <button
                        onClick={() => setIsOpenAdd(true)}
                        className={`
                        group relative flex items-center gap-2
                        px-4 py-2
                        rounded-lg
                        font-medium
                        text-white
                        ${dark
                                ? "bg-gradient-to-r from-indigo-800 to-blue-800 hover:from-indigo-700 hover:to-blue-700"
                                : "bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600"}
                        shadow-md
                        ${sizeText[valButtonSize] || "text-sm"}
                    `}
                    >
                        Add User
                    </button>
                </div>

                {/* Table Wrapper */}
                <div
                    className={`
                    rounded-lg overflow-hidden border
                    ${dark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}
                `}
                >
                    <DataTable
                        columns={columns}
                        data={users ?? []}
                        progressPending={loading}
                        progressComponent={<CustomLoader dark={dark} />}
                        pagination
                        highlightOnHover
                        customStyles={customStyles}
                        noDataComponent={
                            <NoData dark={dark} valButtonSize={valButtonSize} />
                        }
                    />
                </div>
            </div>

            {/* Modal */}
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