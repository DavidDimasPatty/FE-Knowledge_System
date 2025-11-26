import React from "react";
import { FiPlus, FiBook, FiHome, FiSettings, FiStar, FiAlignCenter, FiCode, FiScissors, FiDownload, FiUser } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
const SideBarLeft = ({ dark, login, setLogin }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const bgColor = (bg) => {
        return location.pathname === bg
            ? "bg-blue-200  hover:bg-blue-300 "
            : location.pathname === bg
                ? "bg-blue-200  hover:bg-blue-300 "
                : location.pathname === bg
                    ? "bg-blue-200  hover:bg-blue-300 "
                    : "hover:bg-gray-300 ";
    }

    return (
        <div
            className={
                (dark
                    ? "bg-gray-800 text-white border-gray-700"
                    : "bg-white text-gray-900 border-gray-200") +
                " w-80 border-r p-4 flex flex-col justify-between"
            }
            style={{ height: "calc(100vh - 60px)" }}
        >

            <div>

                <div className="flex flex-col gap-2">
                    <button
                        className={"flex items-center gap-2 p-2 rounded-lg " + bgColor("/")}
                        onClick={() => navigate("/")}
                    >
                        <FiHome /> <span>Start Chat</span>
                    </button>

                    <button
                        className={"flex items-center gap-2 p-2 rounded-lg " + bgColor("/dokumen")}
                        onClick={() => navigate("/dokumen")}
                    >
                        <FiDownload /> <span>List Dokumen</span>
                    </button>

                    <button
                        className={"flex items-center gap-2 p-2 rounded-lg " + bgColor("/userManagement")}
                        onClick={() => navigate("/userManagement")}
                    >
                        <FiUser /> <span>User Management</span>
                    </button>
                </div>

                <hr className={dark ? "border-gray-700" : "border-gray-300"} />

                <div className="mt-3">
                    <div className="flex items-center gap-2 mb-2">
                        <FiStar /> <span className="font-semibold">Favorites</span>
                    </div>

                    <div className="ml-1 space-y-2">
                        <SidebarItem dark={dark} icon={<FiCode />} title="Programming" time="01:30" />
                        <SidebarItem dark={dark} icon={<FiBook />} title="Education" time="12:45" />
                        <SidebarItem dark={dark} icon={<FiScissors />} title="Science" time="11:30" />
                    </div>
                </div>

                <div className="mt-3">
                    <div className="flex items-center gap-2 mb-2">
                        <FiAlignCenter /> <span className="font-semibold">Categories</span>
                    </div>

                    <div className="ml-1 space-y-2">
                        <SidebarItem dark={dark} icon={<FiCode />} title="Programming" time="01:30" />
                        <SidebarItem dark={dark} icon={<FiBook />} title="Education" time="12:45" />
                        <SidebarItem dark={dark} icon={<FiScissors />} title="Science" time="11:30" />
                    </div>
                </div>

            </div>
            {login ?
                null
                : (<div className="mt-6 mb-2 flex">
                    <div
                        onClick={() => setLogin(!login)}
                        className={
                            "w-10 h-10 rounded-full flex items-center justify-center font-bold " +
                            (dark ? "bg-gray-700" : "bg-blue-500 text-white")
                        }
                    >
                        D
                    </div>
                    <div className="items-center justify-center flex text-center ml-3">Halo, David Dimas</div>
                </div>
                )}
        </div>
    );
};

const SidebarItem = ({ dark, icon, title, time }) => {
    return (
        <div
            className={
                "flex items-center justify-between p-2 rounded-lg cursor-pointer " +
                (dark ? "hover:bg-gray-700" : "hover:bg-gray-100")
            }
        >
            <div className="flex items-center gap-2">
                {icon}
                <span>{title}</span>
            </div>
            <span className="text-xs opacity-70">{time}</span>
        </div>
    );
};

export default SideBarLeft;