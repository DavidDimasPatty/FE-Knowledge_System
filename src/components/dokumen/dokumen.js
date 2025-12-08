import TableDokumen from "./content/tableDokumen";
import React, { useState,useEffect } from "react";
import axios from "axios";
const Dokumen = () => {
    const [dokumen, setDokumen] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchUsers = async () => {
        try {
            const res = await axios.get("http://localhost:8080/getAllDokumen");
            console.log(res.data.dokumen.data)
            setDokumen(res.data.dokumen.data);
        } catch (err) {
            console.error("Fetch dokumen error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);
    return (
        <div className="flex-1 flex flex-col ">
            <TableDokumen dokumen={dokumen} loading={loading}/>
        </div>
    )
}

export default Dokumen;