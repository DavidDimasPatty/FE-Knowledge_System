import React, { useEffect, useState } from "react";
import LoginModal from "./loginModal";
import { BsFillStarFill } from "react-icons/bs";
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
    FiKey,
    FiLogOut,
    FiPlus,
    FiSearch,
    FiLogIn,
} from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import EditPasswordModal from "./editPasswordModal";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
const SideBarLeft =
    ({
        dark,
        login,
        setLogin,
        openDropDown,
        setOpenDropdown,
        isEditPasswordOpen,
        setIsPasswordOpen,
        setIsLoginOpen,
        isLoginOpen,
        handleLogin
    }) => {
        const [isSearch, setIsSearch] = useState(false)
        const [categories, setCategories] = useState([]);
        const [searchKeyword, setSearchKeyword] = useState("");
        const [page, setPage] = useState(1);
        const [hasMore, setHasMore] = useState(true);
        const [loading, setLoading] = useState(false);
        const [limit, setLimit] = useState(20);
        const username = localStorage.getItem("username");
        const roleId = Number(localStorage.getItem("roleId"));
        const [isMinimized, setIsMinimized] = useState(false);
        const location = useLocation();
        const navigate = useNavigate();
        const [favoriteTopics, setFavoriteTopics] = useState([]);
        const [nonFavoriteTopics, setNonFavoriteTopics] = useState([]);
        const [pageFavorite, setPageFavorite] = useState(1);
        const [pageNonFavorite, setPageNonFavorite] = useState(1);
        const [hasMoreFavorite, setHasMoreFavorite] = useState(true);
        const [hasMoreNonFavorite, setHasMoreNonFavorite] = useState(true);
        const [loadingNonFavorite, setLoadingNonFavorite] = useState(false);
        const [loadingFavorite, setLoadingFavorite] = useState(false);
        const MySwal = withReactContent(Swal);
        const bgColor = (path) => {
            const isActive = location.pathname === path;

            if (isActive) {
                return dark
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-blue-200 text-black hover:bg-blue-300";
            }

            return dark
                ? "hover:bg-gray-700 text-gray-300"
                : "hover:bg-gray-300 text-gray-800";
        };

        useEffect(() => {
            fetchCategories(1, "");
            const handleCategoryUpdated = () => {
                fetchCategories(1, "");
            }

            window.addEventListener("category-updated", handleCategoryUpdated);

            return () => {
                window.removeEventListener("category-updated", handleCategoryUpdated);
            };

        }, [username]);

        useEffect(() => {
            fetchFavorite(1);
            fetchNonFavorite(1);
            const handleTopicUpdated = () => {
                fetchFavorite(1);
                fetchNonFavorite(1);
            };

            window.addEventListener("topic-updated", handleTopicUpdated);

            return () => {
                window.removeEventListener("topic-updated", handleTopicUpdated);
            };

        }, [username]);

        const fetchCategories = async (page = 1, search = "") => {
            if (username == null) return;

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

        const fetchFavorite = async (page = 1, search = "") => {
            if (username == null) return;

            if (loadingFavorite) return;
            setLoadingFavorite(true);

            const res = await axios.get(`http://localhost:8080/getAllTopicUser`, {
                params: { username, isFavorite: true, page, limit: limit, search }
            });

            setLoadingFavorite(false);
            const newData = res.data.data;

            if (page === 1) setFavoriteTopics(newData);
            else setFavoriteTopics(prev => [...prev, ...newData]);

            setHasMoreFavorite(newData.length === limit);
        };

        const handleFavoriteTopic = async (idTopic, like) => {
            // e.preventDefault();
            try {
                var res = await axios.post("http://localhost:8080/editFavTopic",
                    {
                        "idTopic": idTopic,
                        "username": username,
                        "like": like
                    }
                );
                console.log("Success:", res.data);
                fetchFavorite(1);
                fetchNonFavorite(1);
            } catch (err) {
                console.log("Backend error:", err.response.data);
                MySwal.fire({
                    title: "Error!",
                    text: `Error Add : ${err.response.data.error}.`,
                    icon: "error",
                    timer: 1500,
                    showConfirmButton: false,
                });
            }
        };


        const fetchNonFavorite = async (page = 1, search = "") => {
            if (username == null) return;
            if (loadingNonFavorite) return;
            setLoadingNonFavorite(true);
            const res = await axios.get(
                `http://localhost:8080/getAllTopicUser`, {
                params: {
                    username,
                    isFavorite: false,
                    page,
                    limit: limit,
                    search
                }
            }
            );
            setLoadingNonFavorite(false);

            const newData = res.data.data;
            console.log(newData);
            if (page === 1) {
                setNonFavoriteTopics(newData);
            } else {
                setNonFavoriteTopics(prev => [...prev, ...newData]);
            }

            setHasMoreNonFavorite(newData.length === limit);
        };

        // const handleScroll = (e) => {
        //     if (searchKeyword !== "") return;

        //     const isBottom =
        //         e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 5;

        //     if (isBottom && hasMoreNonFavorite && !loadingNonFavorite) {
        //         const nextPage = pageNonFavorite + 1;
        //         setPageNonFavorite(nextPage);
        //         fetchNonFavorite(nextPage, searchKeyword);
        //     }
        // };

        const handleScrollFavorite = (e) => {
            if (searchKeyword !== "") return;

            const isBottom =
                e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 5;

            if (isBottom && hasMoreFavorite && !loadingFavorite) {
                const nextPage = pageFavorite + 1;
                setPageFavorite(nextPage);
                fetchFavorite(nextPage, searchKeyword);
            }
        };


        useEffect(() => {
            const delay = setTimeout(() => {
                // reset pagination
                setPageFavorite(1);
                setPageNonFavorite(1);
                setHasMoreFavorite(true);
                setHasMoreNonFavorite(true);

                fetchFavorite(1, searchKeyword);
                fetchNonFavorite(1, searchKeyword);
            }, 400);

            return () => clearTimeout(delay);
        }, [searchKeyword]);

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



        return (
            <div
                className={
                    (dark
                        ? "bg-gray-800 text-white border-gray-700"
                        : "bg-white text-gray-900 border-gray-200") +
                    " flex flex-col justify-between transition-all duration-300"
                }
                style={{
                    width: isMinimized ? "70px" : "360px",
                    height: "calc(100vh - 40px)",
                    top: "20px",
                    left: "15px",
                    position: "relative",
                    borderRadius: "30px",
                    boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
                    zIndex: 50,
                    backgroundColor: "white"
                }}
            >
                <div style={{
                    position: "absolute",
                    width: "50px",
                    borderRadius: "100%",
                    height: "50px",
                    right: "-30px",
                    top: "45%",
                    zIndex: 40
                }} className={"flex items-center justify-center shadow-md cursor-pointer bg-gradient-to-r from-indigo-500 to-blue-500 text-white"}
                    onClick={() => setIsMinimized(!isMinimized)}
                >
                    {isMinimized ? <FiChevronRight size={25} /> :
                        <FiChevronLeft size={25} />
                    }
                </div>
                <div className="p-4 flex flex-col h-full">
                    <div className={"flex mb-4 " + (isMinimized ? "justify-end" : "justify-between")}>
                        {isMinimized ? <div className="flex flex-row gap-4">
                            <img
                                src={dark ? "/WHITE-LOGO.png" : "/BLACK-LOGO.png"}
                                alt="Ikodora Logo"
                                className="w-8 h-8 object-contain transition-transform duration-300 hover:scale-105"
                            />
                        </div> :
                            <div className="flex flex-row gap-4">
                                <img
                                    src={dark ? "/WHITE-LOGO.png" : "/BLACK-LOGO.png"}
                                    alt="Ikodora Logo"
                                    className="w-8 h-8 object-contain transition-transform duration-300 hover:scale-105"
                                />
                                <h2 className="text-lg font-semibold tracking-wide mt-1">
                                    Ikodora
                                </h2>
                            </div>}
                        {/* <button
                            onClick={() => setIsMinimized(!isMinimized)}
                            className="p-1 rounded hover:bg-gray-300 dark:hover:bg-gray-700 transition"
                        >
                            {isMinimized ? <FiChevronRight /> :
                                <FiChevronLeft />
                            }
                        </button> */}
                    </div>

                    <div className="flex items-center justify-center">
                        {localStorage.getItem("login") && !isMinimized && (
                            <button
                                onClick={() => window.location.replace("/")}
                                className="
                                m-3
                                w-full
                                group relative flex items-center gap-2
                                py-2
                                rounded-lg
                                font-medium
                                text-white
                                overflow-hidden
                                bg-gradient-to-r from-indigo-500 to-blue-500
                                shadow-md
                                transition-all duration-300
                                hover:shadow-lg
                                active:scale-95 justify-center
                            "
                            >
                                <span
                                    className="
                                absolute inset-0
                                bg-gradient-to-r from-blue-500 to-indigo-500
                                opacity-0
                                transition-opacity duration-300
                                group-hover:opacity-100
                                "
                                />
                                <span className="relative z-10 flex items-center gap-2">
                                    <FiPlus className="text-lg transition-transform duration-300 group-hover:rotate-90" />
                                    Start Chat
                                </span>
                            </button>
                        )}
                        {localStorage.getItem("login") && isMinimized && (
                            <button
                                onClick={() => navigate("/")}
                                className="
                                w-8
                                mb-3
                                mt-3
                                group relative flex items-center
                                py-2
                                rounded-lg
                                font-medium
                                text-white
                                overflow-hidden
                                bg-gradient-to-r from-indigo-500 to-blue-500
                                shadow-md
                                transition-all duration-300
                                hover:shadow-lg
                                active:scale-95 justify-center
                            "
                            >
                                <span
                                    className="
                                absolute inset-0
                                bg-gradient-to-r from-blue-500 to-indigo-500
                                opacity-0
                                transition-opacity duration-300
                                group-hover:opacity-100
                                "
                                />
                                <span className="relative z-10 flex items-center gap-2">
                                    <FiPlus className="text-lg transition-transform duration-300 group-hover:rotate-90" />
                                </span>
                            </button>
                        )}
                    </div>

                    <div className="flex flex-col gap-3 flex-auto overflow-y-hidden custom-scroll">
                        {[1, 2].includes(roleId) && (
                            <button
                                className={"flex items-center gap-2 p-2 rounded-lg " + bgColor("/dokumen")}
                                onClick={() => navigate("/dokumen")}
                            >
                                <FiDownload />
                                {!isMinimized && <span>List Dokumen</span>}
                            </button>
                        )}

                        {[1, 2].includes(roleId) && (
                            <button
                                className={"flex items-center gap-2 p-2 rounded-lg " + bgColor("/userManagement")}
                                onClick={() => navigate("/userManagement")}
                            >
                                <FiUser />
                                {!isMinimized && <span>User Management</span>}
                            </button>
                        )}

                        {localStorage.getItem("login") && !isMinimized && (
                            <div className="mt-2">
                                <div className="flex items-center gap-2 mb-2 w-full relative">
                                    <FiArchive />
                                    <span className="font-semibold transition-all">Topics</span>

                                    <div className="relative flex-1">
                                        {/* <input
                                                           type="text"
                                                           placeholder="Cari Topik..."
                                                           className={`h-7 pl-2 pr-6 border rounded-md outline-none transition-all duration-500 ease-in-out
                                     ${isSearch ? 'w-full  opacity-100' : 'w-0 opacity-0 pointer-events-none'}`}
                                                           autoFocus={isSearch} style={{ float: 'right' }}
                                                       /> */}
                                        <input
                                            type="text"
                                            placeholder="Cari Topik..."
                                            value={searchKeyword}
                                            onChange={(e) => setSearchKeyword(e.target.value)}
                                            className={`h-7 pl-2 pr-10 border rounded-md outline-none transition-all duration-500 ease-in-out text-black dark:text-black bg-white dark:bg-white
                                   ${isSearch ? 'w-full opacity-100' : 'w-0 opacity-0 pointer-events-none'}`}
                                            autoFocus={isSearch}
                                            style={{ float: 'right' }}

                                        />

                                        <FiSearch
                                            onClick={() => setIsSearch(!isSearch)}
                                            className="absolute right-5 top-1/2 transform -translate-y-1/2 cursor-pointer transition-all duration-300 hover:text-gray-700 text-black dark:text-black bg-white dark:bg-white"
                                        />
                                        {/* <FiPlus
                                            onClick={() => window.location.replace("/")}
                                            className="absolute right-0 top-1/2 transform -translate-y-1/2 cursor-pointer transition-all duration-300 hover:text-gray-700 text-black dark:text-black bg-white dark:bg-white"
                                        /> */}
                                    </div>
                                </div>
                                {/* <div className="ml-1 mr-2 space-y-2 custom-scroll" style={{ maxHeight: "calc(100vh - 430px)", overflowY: "auto", overflowX: "hidden" }} onScroll={handleScroll}>
                                    {categories.map((item) => (
                                        <SidebarItem
                                            key={item.ID}
                                            dark={dark}
                                            // icon={iconMap[item.NamaIcon] || <FiStar />}
                                            title={item.Category}
                                            time={formatDate(item.AddTime)} />
                                    ))}
                                </div> */}
                                <div className="flex items-center gap-2 mb-2 ml-2 p-1 border-b">
                                    <span className="font-semibold">Saved Topics</span>
                                </div>
                                <div className="m-2 space-y-2 custom-scroll" style={{ maxHeight: "200px", overflowY: "auto" }} onScroll={handleScrollFavorite}>

                                    {favoriteTopics.map((item) => (
                                        <SidebarItem
                                            key={item.ID}
                                            dark={dark}
                                            icon={<div onClick={() => handleFavoriteTopic(item.ID, 0)}><BsFillStarFill style={{ color: "yellow", stroke: "black", strokeWidth: "0.6px" }} /></div>}
                                            title={item.Topic}
                                            desc={item.Category}
                                            idCategory={item.IdCategories}
                                            idTopic={item.ID}
                                            location={location}
                                        />
                                    ))}
                                </div>

                                <div className="flex items-center gap-2 mb-2  ml-2 p-1 border-b ">
                                    <span className="font-semibold">Recents</span>
                                </div>
                                <div className="m-2 space-y-2 custom-scroll" style={{ maxHeight: "calc(100vh - 430px)", overflowY: "auto" }} onScroll={handleScroll}>
                                    {nonFavoriteTopics.map((item) => (
                                        <SidebarItem
                                            key={item.ID}
                                            dark={dark}
                                            icon={<div onClick={() => handleFavoriteTopic(item.ID, 1)}><FiStar /></div>}
                                            title={item.Topic}
                                            desc={item.Category}
                                            idCategory={item.IdCategories}
                                            idTopic={item.ID}
                                            location={location}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {!localStorage.getItem("login") && !isMinimized && (
                        <div className="relative mt-6 mb-2 px-3">
                            <button
                                className="
                                    w-full flex items-center justify-center gap-2
                                    px-4 py-2.5 rounded-xl
                                    bg-gradient-to-r from-indigo-500 to-blue-500
                                    text-white text-sm font-semibold
                                    shadow-md shadow-indigo-500/30
                                    transition-all duration-200
                                    hover:shadow-lg hover:scale-[1.02]
                                    active:scale-[0.98]
                                "  onClick={() => setIsLoginOpen(true)}
                            >
                                Login
                            </button>
                        </div>
                    )}
                    {!localStorage.getItem("login") && isMinimized && (
                        <div className="flex items-center">
                            <div
                                onClick={() => setIsLoginOpen(true)}
                                className={
                                    "w-10 h-10 rounded-full flex items-center justify-center font-bold cursor-pointer bg-gradient-to-r from-indigo-500 to-blue-500 text-white"
                                }
                            >
                                <FiLogIn />
                            </div>
                        </div>
                    )}

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
                                            setIsPasswordOpen(true)
                                        }}
                                        className={
                                            "w-full text-left flex items-center gap-3 px-4 py-2 hover:bg-gray-100 " +
                                            (dark ? "hover:bg-gray-700" : "")
                                        }
                                    >
                                        <FiKey /> Edit Password
                                    </button>

                                    <button
                                        onClick={() => {
                                            setIsPasswordOpen(true)
                                        }}
                                        className={
                                            "w-full flex items-center gap-3 text-left px-4 py-2 hover:bg-gray-100 " +
                                            (dark ? "hover:bg-gray-700" : "")
                                        }
                                    >
                                        <FiSettings /> Settings
                                    </button>

                                    <button
                                        onClick={() => {
                                            setLogin(!login)
                                            localStorage.clear();
                                            window.location.href = "/";
                                        }}
                                        className={
                                            "w-full text-left flex items-center gap-3 px-4 py-2 text-red-500 hover:bg-gray-100 " +
                                            (dark ? "hover:bg-gray-700" : "")
                                        }
                                    >
                                        <FiLogOut /> Logout
                                    </button>
                                </div>
                            )}



                            <div className="flex items-center">
                                <div
                                    onClick={() => setOpenDropdown(!openDropDown)}
                                    className={
                                        "w-10 h-10 rounded-full flex items-center justify-center font-bold cursor-pointer bg-gradient-to-r from-indigo-500 to-blue-500 text-white"
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

                    {localStorage.getItem("login") && isMinimized && (
                        <div className="flex items-center">
                            <div
                                onClick={() => setOpenDropdown(!openDropDown)}
                                className={
                                    "w-10 h-10 rounded-full flex items-center justify-center font-bold cursor-pointer bg-gradient-to-r from-indigo-500 to-blue-500 text-white"
                                }
                            >
                                {localStorage.getItem("nama")?.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    )}
                </div>
                <EditPasswordModal
                    isOpen={isEditPasswordOpen}
                    onClose={() => setIsPasswordOpen(false)}
                />
                <LoginModal
                    isOpen={isLoginOpen}
                    onClose={() => setIsLoginOpen(false)}
                    onLogin={handleLogin}
                    setLogin={setLogin}
                    login={login}
                />
            </div >
        );
    };

// const SidebarItem = ({ dark, icon, title, time }) => {
//     return (
//         <div
//             className={
//                 "flex items-center justify-between p-2 rounded-lg cursor-pointer " +
//                 (dark ? "hover:bg-gray-700" : "hover:bg-gray-100")
//             }
//         >
//             <div className="flex items-center gap-2">
//                 {icon}
//                 <span >{title}</span>
//             </div>
//             <span className="text-xs opacity-70 me-1">{time}</span>
//         </div>
//     );
// };

const SidebarItem = ({ dark, title, desc, icon, idCategory, idTopic, location }) => {
    const navigate = useNavigate();
    return (
        <div
            onClick={() => {
                if (location.pathname != "userManagement" || location.pathname != "dokumen") {
                    navigate(
                        `?topic=${idTopic}&category=${idCategory}`,
                        { replace: true }
                    )
                }
                else {
                    window.location.replace(`?topic=${idTopic}&category=${idCategory}`)
                }
            }
            }
            className={
                "flex items-center justify-between p-2 rounded-lg cursor-pointer " +
                (dark ? "hover:bg-gray-700" : "hover:bg-gray-100")
            }
        >
            <div className="row-auto">
                <div className="flex items-center gap-2">
                    {icon}
                    <span>{title}</span>
                </div>
                <div className="ml-2 text-gray-400 text-sm">
                    {desc}
                </div>
            </div>
        </div >
    );
};
export default SideBarLeft;