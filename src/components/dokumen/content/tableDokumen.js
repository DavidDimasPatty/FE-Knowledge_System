import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import AddDokumen from "./addDokumen";
import EditDokumen from "./editDokumen";
import Swal from "sweetalert2";
import axios from "axios";
import withReactContent from "sweetalert2-react-content";
import { useLocation, useNavigate } from "react-router-dom";
const TableDokumen = ({ dokumen, loading, fetchDokumen }) => {
    const [isOpenAdd, setIsOpenAdd] = useState(false);
    const [isOpenEdit, setIsOpenEdit] = useState(false);
    const [selectedDokumenId, setSelectedDokumenId] = useState(null);
    const MySwal = withReactContent(Swal);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

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
            title: `Are you sure to delete ${document.Judul}?`,
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
            name: "Nama Dokumen",
            selector: row => row.Judul,
            sortable: true
        },
        {
            name: "Tanggal Dibuat",
            selector: row => row.AddTime,
            sortable: true,
            maxWidth: "150px"
        },
        {
            name: "Aksi",
            cell: row => (
                <div className="flex gap-2">
                    <button
                        onClick={() => downloadDokumen(row.ID)}
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        Download
                    </button>
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
                <h1 className="text-2xl font-bold mb-4">List Dokumen</h1>
                <button
                    onClick={() => setIsOpenAdd(true)}
                    className="px-3 py-1 w-30 mb-3 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Add Dokumen
                </button>
                <DataTable
                    columns={columns}
                    data={dokumen}
                    pagination
                    highlightOnHover
                    selectableRows
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