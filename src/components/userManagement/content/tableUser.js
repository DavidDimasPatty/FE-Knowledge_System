import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
const TableUser = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        setUsers(dataDummy);
    }, []);
    const dataDummy = [
        { id: 1, name: "User A", role: "Super Admin", createdAt: "2025-11-27" },
        { id: 2, name: "User B", role: "Admin", createdAt: "2025-11-26" },
        { id: 3, name: "User C", role: "Subordinate", createdAt: "2025-11-25" },
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
            name: "Role",
            selector: row => row.role,
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
        <h1 className="text-2xl font-bold mb-4">List Users</h1>
        <button
            onClick={() => { }}
            className="px-3 py-1 w-30 mb-3 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
            Add User
        </button>
        <DataTable
            columns={columns}
            data={users}
            pagination
            highlightOnHover
            selectableRows
        />
    </div></div>);
}

export default TableUser;