import React, { useState } from "react";
import {
    FiHome,
    FiDownload,
    FiUser,
    FiStar,
    FiCode,
    FiBook,
    FiScissors,
    FiAlignCenter,
    FiChevronLeft,
    FiChevronRight,
} from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
const SideBarLeft =
    ({
        dark,
        login,
        setLogin,
        openDropDown,
        setOpenDropdown
    }) => {
        const [isMinimized, setIsMinimized] = useState(false);
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
                    " flex flex-col justify-between transition-all duration-300"
                }
                style={{
                    width: isMinimized ? "60px" : "320px",
                    height: "calc(100vh - 60px)",
                }}
            >
                <div className="p-4 flex flex-col h-full">
                    <div className={"flex mb-4 " + (isMinimized ? "justify-end" : "justify-between")}>
                        {isMinimized ? null :
                            <div><b>Menus</b></div>}
                        <button
                            onClick={() => setIsMinimized(!isMinimized)}
                            className="p-1 rounded hover:bg-gray-300 dark:hover:bg-gray-700 transition"
                        >
                            {isMinimized ? <FiChevronRight /> :
                                <FiChevronLeft />
                            }
                        </button>
                    </div>

                    <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
                        <button
                            className={"flex items-center gap-2 p-2 rounded-lg " + bgColor("/")}
                            onClick={() => navigate("/")}
                        >
                            <FiHome />
                            {!isMinimized && <span>Start Chat</span>}
                        </button>

                        <button
                            className={"flex items-center gap-2 p-2 rounded-lg " + bgColor("/dokumen")}
                            onClick={() => navigate("/dokumen")}
                        >
                            <FiDownload />
                            {!isMinimized && <span>List Dokumen</span>}
                        </button>

                        <button
                            className={"flex items-center gap-2 p-2 rounded-lg " + bgColor("/userManagement")}
                            onClick={() => navigate("/userManagement")}
                        >
                            <FiUser />
                            {!isMinimized && <span>User Management</span>}
                        </button>

                        {!isMinimized && (
                            <div className="mt-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <FiStar /> <span className="font-semibold">Favorites</span>
                                </div>
                                <div className="ml-1 space-y-2">
                                    <SidebarItem dark={dark} icon={<FiCode />} title="Programming" time="29 Aug" />
                                    <SidebarItem dark={dark} icon={<FiBook />} title="Education" time="29 Aug" />
                                    <SidebarItem dark={dark} icon={<FiScissors />} title="Science" time="30 Aug" />
                                </div>
                            </div>
                        )}

                        {!isMinimized && (
                            <div className="mt-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <FiAlignCenter /> <span className="font-semibold">Categories</span>
                                </div>
                                <div className="ml-1 space-y-2">
                                    <SidebarItem dark={dark} icon={<FiCode />} title="Programming" time="1 Jun" />
                                    <SidebarItem dark={dark} icon={<FiBook />} title="Education" time="1 Jul" />
                                    <SidebarItem dark={dark} icon={<FiScissors />} title="Science" time="1 Aug" />
                                </div>
                            </div>
                        )}
                    </div>

                    {localStorage.getItem("login") && !isMinimized && (
                        <div className="relative mt-6 mb-2">
                            {openDropDown && (
                                <div
                                    className={
                                        "absolute left-0 w-48 rounded-lg shadow-lg z-50 bottom-14 " +
                                        (dark ? "bg-gray-800 text-white" : "bg-white")
                                    }
                                >
                                    <button
                                        onClick={() => {
                                            setOpenDropdown(false);
                                        }}
                                        className={
                                            "w-full text-left px-4 py-2 hover:bg-gray-100 " +
                                            (dark ? "hover:bg-gray-700" : "")
                                        }
                                    >
                                        🔑 Edit Password
                                    </button>

                                    <button
                                        onClick={() => {
                                            setLogin(!login)
                                            localStorage.clear();
                                            window.location.reload();
                                        }}
                                        className={
                                            "w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 " +
                                            (dark ? "hover:bg-gray-700" : "")
                                        }
                                    >
                                        🚪 Logout
                                    </button>
                                </div>
                            )}
                            <div className="flex items-center">
                                <div
                                    onClick={() => setOpenDropdown(!openDropDown)}
                                    className={
                                        "w-10 h-10 rounded-full flex items-center justify-center font-bold cursor-pointer " +
                                        (dark ? "bg-gray-700 text-white" : "bg-blue-500 text-white")
                                    }
                                >
                                    {localStorage.getItem("nama")?.charAt(0).toUpperCase()}
                                </div>

                                <div className="ml-3">
                                    <div>
                                        Halo, <b>{localStorage.getItem("nama")}</b>
                                    </div>
                                    <div>
                                        <b>{localStorage.getItem("roleName")}</b>
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}
                </div>
            </div >
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