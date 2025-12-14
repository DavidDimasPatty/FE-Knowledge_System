import React, { useEffect, useState } from "react";
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
    FiSettings,
    FiArchive,
} from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const SideBarLeft =
    ({
        dark,
        login,
        setLogin,
        openDropDown,
        setOpenDropdown
    }) => {
        const [isSearch, setIsSearch] = useState(false)
        const [categories, setCategories] = useState([]);
        const [searchKeyword, setSearchKeyword] = useState("");
        const [page, setPage] = useState(1);
        const [hasMore, setHasMore] = useState(true);
        const [loading, setLoading] = useState(false);
        const [limit, setLimit] = useState(5);

        const username = localStorage.getItem("username");
        //const username = 'nando';

        useEffect(() => {
            fetchCategories(1, "");
        }, [username]);

        const fetchCategories = async (page = 1, search = "") => {
            if (loading) return;
            setLoading(true);
            const res = await axios.get(
                `http://localhost:8080/getAllCategoryUser`, {
                params: {
                    username,
                    page,
                    limit: limit,
                    search
                }
            }
            );
            setLoading(false);

            const newData = res.data.data;

            if (page === 1) {
                setCategories(newData);
            } else {
                setCategories(prev => [...prev, ...newData]);
            }

            setHasMore(newData.length === limit);
        };

        const handleScroll = (e) => {
            if (searchKeyword !== "") return;

            const isBottom =
                e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 5;

            if (isBottom && hasMore && !loading) {
                const nextPage = page + 1;
                setPage(nextPage);
                fetchCategories(nextPage, searchKeyword);
            }
        };

        useEffect(() => {
            const delay = setTimeout(() => {
                // reset pagination
                setPage(1);
                setHasMore(true);

                fetchCategories(1, searchKeyword);
            }, 400);

            return () => clearTimeout(delay);
        }, [searchKeyword]);

        const formatDate = (dateStr) => {
            return new Intl.DateTimeFormat("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
            }).format(new Date(dateStr));
        };

        const iconMap = {
            FiHome: <FiHome />,
            FiDownload: <FiDownload />,
            FiUser: <FiUser />,
            FiStar: <FiStar />,
            FiCode: <FiCode />,
            FiBook: <FiBook />,
            FiScissors: <FiScissors />,
            FiAlignCenter: <FiAlignCenter />,
            FiChevronLeft: <FiChevronLeft />,
            FiChevronRight: <FiChevronRight />,
            FiSettings: <FiSettings />,
            FiArchive: <FiArchive />,
        };

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

                        {/* {!isMinimized && (
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
                        )} */}

                        {!isMinimized && (
                            <div className="mt-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <FiAlignCenter /> <span className="font-semibold">Categories</span>
                                </div>
                                <div className="ml-1 space-y-2" style={{ maxHeight: "calc(100vh - 430px)", overflowY: "auto" }} onScroll={handleScroll}>
                                    {categories.map((item) => (
                                        <SidebarItem
                                            key={item.ID}
                                            dark={dark}
                                            icon={iconMap[item.NamaIcon] || <FiStar />}
                                            title={item.Category}
                                            time={formatDate(item.AddTime)} />
                                    ))}
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