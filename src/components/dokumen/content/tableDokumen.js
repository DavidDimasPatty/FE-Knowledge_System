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
            confirmButtonText: "Hapus!",
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
            selector: row => formatTanggal(row.AddTime),
            sortable: true,
            maxWidth: "180px",
            wrap: true
        },
        {
            name: "Action",
            cell: row => (
                <div className="flex gap-2">
                    <button
                        onClick={() => downloadDokumen(row.ID)}
                        className={`px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 ${sizeTextDown[valButtonSize] || "text-base"}`}
                    >
                        Download
                    </button>
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
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            width: "300px",
        }
    ];
    return (
        <div>
            {isLoading && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                    <div className="w-12 h-12 border-4 border-white/50 border-t-white rounded-full animate-spin" />
                </div>
            )}
            <div className="p-4">
                <h1 className={`font-bold mb-4 ${sizeTextUp[valButtonSize] || "text-base"}`}>List Dokumen</h1>
                <button
                    onClick={() => setIsOpenAdd(true)}
                    className={`px-3 py-1 w-30 mb-3 bg-blue-500 text-white rounded hover:bg-blue-600 ${sizeText[valButtonSize] || "text-base"}`}
                >
                    Add Dokumen
                </button>
                <DataTable
                    columns={columns}
                    data={dokumen}
                    pagination
                    highlightOnHover
                    // selectableRows
                    customStyles={customStyles}
                />
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
        </div>);
}

export default TableDokumen;