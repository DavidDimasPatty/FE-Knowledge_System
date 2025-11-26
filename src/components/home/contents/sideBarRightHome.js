import React from "react";
const SideBarRightHome = ({ dark, setDark }) => 
{
    return (<div className={dark ? "w-56 bg-gray-800 p-4" : "w-56 bg-white p-4 border-r"}>
        {/* <h2 className="font-bold text-lg">Ikodora</h2> */}
        {/* <button
            onClick={() => setDark(!dark)}
            className="mt-4 px-4 py-2 rounded bg-blue-600 text-white"
        >
            Toggle Dark Mode
        </button> */}
    </div>)
}

export default SideBarRightHome;