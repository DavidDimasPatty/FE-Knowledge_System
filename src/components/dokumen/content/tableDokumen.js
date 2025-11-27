import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
const TableDokumen = () => {
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        setDocuments(dataDummy);
    }, []);
    const dataDummy = [
        { id: 1, name: "Dokumen A", createdAt: "2025-11-27" },
        { id: 2, name: "Dokumen B", createdAt: "2025-11-26" },
        { id: 3, name: "Dokumen C", createdAt: "2025-11-25" },
    ];

    const columns = [
        {
            name: "ID",
            selector: row => row.id,
            sortable: true,
            maxWidth: "80px"
        },
        {
            name: "Nama Dokumen",
            selector: row => row.name,
            sortable: true
        },
        {
            name: "Tanggal Dibuat",
            selector: row => row.createdAt,
            sortable: true,
            maxWidth: "150px"
        },
        {
            name: "Aksi",
            cell: row => (
                <div className="flex gap-2">
                    <button
                        onClick={() => alert(`Download ${row.name}`)}
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        Download
                    </button>
                    <button
                        onClick={() => alert(`Edit ${row.name}`)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => alert(`Delete ${row.name}`)}
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
    return (<div> <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">List Dokumen</h1>
        <button
            onClick={() =>{}}
            className="px-3 py-1 w-30 mb-3 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
            Add Dokumen
        </button>
        <DataTable
            columns={columns}
            data={documents}
            pagination
            highlightOnHover
            selectableRows
        />
    </div></div>);
}

export default TableDokumen;