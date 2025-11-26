import React from "react";
const SideBarLeftHome = ({ dark }) => 
{
    return (<div className={dark ? "w-64 bg-gray-800 p-4" : "w-64 bg-white p-4 border-r"}>
        {/* <h2 className="font-bold text-lg">Ikodora</h2> */}
    </div>)
}

export default SideBarLeftHome;