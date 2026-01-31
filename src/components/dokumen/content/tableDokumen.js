import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import AddDokumen from "./addDokumen";
import EditDokumen from "./editDokumen";
import Swal from "sweetalert2";
import axios from "axios";
import withReactContent from "sweetalert2-react-content";
import { useLocation, useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
const TableDokumen = ({ dokumen, loading, fetchDokumen }) => {
    const [isOpenAdd, setIsOpenAdd] = useState(false);
    const [isOpenEdit, setIsOpenEdit] = useState(false);
    const [selectedDokumenId, setSelectedDokumenId] = useState(null);
    const MySwal = withReactContent(Swal);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const { valButtonSize, dark } = useOutletContext();

    console.log("Font Size:", valButtonSize);
    console.log("Dark Mode:", dark);

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

    const downloadDokumen = async (id) => {
        try {
            setIsLoading(true)
            const response = await axios.post(
                "http://localhost:8080/downloadDokumen",
                { id },
                {
                    responseType: "blob",
                }
            );

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");

            const contentDisposition = response.headers["content-disposition"];
            let fileName = "file.pdf";
            if (contentDisposition) {
                const fileNameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
                if (fileNameMatch.length > 1) fileName = fileNameMatch[1];
            }

            link.href = url;
            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            console.log("File downloaded:", fileName);
            setIsLoading(false)
        } catch (err) {
            setIsLoading(false)
            console.error("Download failed:", err);
        }
    };

    const openEditPopUp = (idUser) => {
        setSelectedDokumenId(idUser);
        setIsOpenEdit(true);
    }

    const handleDelete = async (id) => {
        const document = dokumen.find(u => u.ID === id);
        MySwal.fire({
            title: `Are you sure to delete "${document.Judul}"?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Delete!",
            cancelButtonText: "Cancel",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    setIsLoading(true)
                    await axios.post("http://localhost:8080/deleteDokumen", { id });

                    MySwal.fire({
                        title: "Deleted!",
                        text: `${document.Judul} has been deleted.`,
                        icon: "success",
                        timer: 1500,
                        showConfirmButton: false
                    });
                    fetchDokumen();
                    setIsLoading(false)
                } catch (err) {
                    setIsLoading(false)
                    MySwal.fire({
                        title: "Error!",
                        text: `${document.Judul} Error Deleted : ${err}.`,
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
            maxWidth: "80px"
        },
        {
            name: "Document Name",
            selector: row => row.Judul,
            sortable: true,
            wrap: true
        },
        {
            name: "Created At",
            selector: row => formatTanggal(row.AddTime, "en-US"),
            sortable: true,
            maxWidth: "180px",
            wrap: true
        },
        {
            name: "Action",
            cell: row => (
                <div className="flex gap-2">
                    {/* Download */}
                    <button
                        onClick={() => downloadDokumen(row.ID)}
                        className={`
                    ${actionBtnBase}
                    ${dark
                                ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"}
                `}
                    >
                        Download
                    </button>

                    {/* Edit */}
                    <button
                        onClick={() => openEditPopUp(row.ID)}
                        className={`
                    ${actionBtnBase}
                    text-white
                    bg-gradient-to-r from-indigo-500 to-blue-500
                    hover:from-indigo-600 hover:to-blue-600
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
                    ${dark
                                ? "border border-red-500/40 text-red-400 hover:bg-red-500/10"
                                : "border border-red-500/30 text-red-600 hover:bg-red-50"}
                `}
                    >
                        Delete
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            width: "320px"
        }
    ];
    return (
        <div className="relative mt-5">
            {isLoading && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div
                        className={`
                        w-12 h-12 border-4 rounded-full animate-spin
                        ${dark
                                ? "border-white/30 border-t-white"
                                : "border-gray-300 border-t-gray-800"}
                    `}
                    />
                </div>
            )}

            <div
                className={`
                p-6 rounded-xl shadow-sm
                ${dark ? "text-gray-100" : "text-gray-800"}
            `}
            >
                <div className="flex items-center justify-between mb-6">
                    <h1
                        className={`
                        font-semibold
                        ${sizeTextUp[valButtonSize] || "text-lg"}
                        ${dark ? "text-gray-100" : "text-gray-800"}
                    `}
                    >
                        Document List
                    </h1>

                    <button
                        onClick={() => setIsOpenAdd(true)}
                        className="
                        group relative flex items-center gap-2
                        px-4 py-2
                        rounded-lg
                        font-medium
                        text-white
                        bg-gradient-to-r from-indigo-500 to-blue-500
                        shadow-md
                        transition-all duration-300
                        hover:shadow-lg
                        active:scale-95
                    "
                    >
                        <span
                            className="
                            absolute inset-0
                            bg-gradient-to-r from-blue-500 to-indigo-500
                            opacity-0
                            transition-opacity duration-300
                            group-hover:opacity-100
                            rounded-lg
                        "
                        />
                        <span className={`relative z-10 ${sizeText[valButtonSize] || "text-sm"}`}>
                            Add Dokumen
                        </span>
                    </button>
                </div>

                <div
                    className={`
                    rounded-lg overflow-hidden border
                    ${dark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}
                `}
                >
                    <DataTable
                        columns={columns}
                        data={dokumen}
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

            <AddDokumen
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                isOpen={isOpenAdd}
                onClose={() => setIsOpenAdd(!isOpenAdd)}
                fetchDokumen={fetchDokumen}
            />

            <EditDokumen
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                isOpen={isOpenEdit}
                onClose={() => setIsOpenEdit(!isOpenEdit)}
                idDokumen={selectedDokumenId}
                fetchDokumen={fetchDokumen}
            />
        </div>
    );
}

export default TableDokumen;