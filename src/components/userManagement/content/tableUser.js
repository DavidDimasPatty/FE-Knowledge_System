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
    const { valButtonSize, dark, lang } = useOutletContext();

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

    const sizeButtonAkNon = {
        small: "85px",
        medium: "95px",
        large: "105px"
    };

    const buttonWidth = lang
        ? sizeButtonAcDeac[valButtonSize]
        : sizeButtonAkNon[valButtonSize];

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

    const NoData = ({ dark, valButtonSize, lang }) => (
        <div
            className={`
            w-full text-center py-6
            ${dark ? "bg-gray-800 text-gray-400" : "text-gray-600"}
            ${sizeText[valButtonSize] || "text-base"}
        `}
        >
            {lang ? "There are no records to display" : "Tidak ada data untuk ditampilkan"}
        </div>
    );

    const openEditPopUp = (idUser) => {
        setSelectedUserId(idUser);
        setIsOpenEdit(true);
    };

    const handleDelete = (userId) => {
        const user = users?.find(u => u.ID === userId);

        MySwal.fire({
            title: lang ? `Are you sure to delete "${user?.Nama ?? "this user"}"?` : `Apakah Anda yakin ingin menghapus "${user?.Nama ?? "pengguna ini"}"?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: lang ? "Delete!" : "Hapus!",
            cancelButtonText: lang ? "Cancel" : "Batal",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.post("http://localhost:8080/deleteUser", { "Id": userId });

                    MySwal.fire({
                        title: lang ? "Deleted!" : "Dihapus!",
                        text: lang ? `${user.Nama} has been deleted.` : `${user.Nama} telah dihapus.`,
                        icon: "success",
                        timer: 1500,
                        showConfirmButton: false
                    });
                    fetchUser();
                } catch (err) {
                    MySwal.fire({
                        title: lang ? "Error!" : "Kesalahan!",
                        text: lang ? `${user.Nama} Error Deleted : ${err}.` : `${user.Nama} Gagal Menghapus : ${err}.`,
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
            title: lang ? `Are you sure to activate "${user?.Nama ?? "this user"}"?` : `Apakah Anda yakin ingin mengaktifkan "${user?.Nama ?? "pengguna ini"}"?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: lang ? "Activate!" : "Aktifkan!",
            cancelButtonText: lang ? "Cancel" : "Batal",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.post("http://localhost:8080/changeStatusUser", { "Id": userId, "Status": user.Status });

                    MySwal.fire({
                        title: lang ? "Success!" : "Berhasil!",
                        text: lang ? `${user.Nama} has been activated.` : `${user.Nama} telah diaktifkan.`,
                        icon: "success",
                        timer: 1500,
                        showConfirmButton: false
                    });
                    fetchUser();
                } catch (err) {
                    MySwal.fire({
                        title: lang ? "Error!" : "Kesalahan!",
                        text: lang ? `${user.Nama} Error Activated : ${err}.` : `${user.Nama} Gagal Mengaktifkan : ${err}.`,
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
            title: lang ? `Are you sure to block "${user?.Nama ?? "this user"}"?` : `Apakah Anda yakin ingin memblokir "${user?.Nama ?? "pengguna ini"}"?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: lang ? "Block!" : "Blok",
            cancelButtonText: lang ? "Cancel" : "Batal",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.post("http://localhost:8080/changeStatusUser", { "Id": userId, "Status": user.Status });

                    MySwal.fire({
                        title: lang ? "Success!" : "Berhasil!",
                        text: lang ? `${user.Nama} has been block.` : `${user.Nama} telah diblokir.`,
                        icon: "success",
                        timer: 1500,
                        showConfirmButton: false
                    });
                    fetchUser();
                } catch (err) {
                    MySwal.fire({
                        title: lang ? "Error!" : "Kesalahan!",
                        text: lang ? `${user.Nama} Error Block : ${err}.` : `${user.Nama} Gagal Memblokir : ${err}.`,
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
            name: lang ? "Name" : "Nama",
            selector: row => row.Nama,
            sortable: true,
            wrap: true
        },
        {
            name: lang ? "Role" : "Hak Akses",
            selector: row => row.RoleName,
            sortable: true,
        },
        {
            name: lang ? "Created At" : "Dibuat Pada",
            selector: row => formatTanggal(row.AddTime, lang ? "en-US" : "id-ID"),
            sortable: true,
            maxWidth: "200px",
            wrap: true
        },
        {
            name: lang ? "Action" : "Aksi",
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
                        {lang ? "Edit" : "Ubah"}
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
                        {lang ? "Delete" : "Hapus"}
                    </button>

                    {/* Activate / Deactivate */}
                    {row.Status === "Active" ? (
                        <button
                            onClick={() => handleDeactivate(row.ID)}
                            style={{ width: buttonWidth }}
                            className={`
                                ${actionBtnBase}
                                text-white
                                ${dark
                                    ? "bg-gradient-to-r from-amber-800 to-orange-800 hover:from-amber-700 hover:to-orange-700"
                                    : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"}
                                shadow-sm
                            `}
                        >
                            {lang ? "Deactivate" : "Nonaktifkan"}
                        </button>
                    ) : (
                        <button
                            onClick={() => handleActivate(row.ID)}
                            style={{ width: buttonWidth }}
                            className={`
                                ${actionBtnBase}
                                text-white
                                ${dark
                                    ? "bg-gradient-to-r from-emerald-800 to-teal-800 hover:from-emerald-700 hover:to-teal-700"
                                    : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"}
                                shadow-sm
                            `}
                        >
                            {lang ? "Activate" : "Aktifkan"}
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
                        {lang ? "User List" : "Daftar Pengguna"}
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
                        {lang ? "Add User" : "Tambah Pengguna"}
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
                            <NoData dark={dark} valButtonSize={valButtonSize} lang={lang} />
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