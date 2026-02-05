import React, { useEffect, useState, useRef } from "react";
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
import SettingModal from "./settingModal";
const SideBarLeft =
    ({
        dark,
        setDark,
        lang,
        setLang,
        login,
        setLogin,
        openDropDown,
        setOpenDropdown,
        isEditPasswordOpen,
        setIsPasswordOpen,
        setIsLoginOpen,
        isLoginOpen,
        handleLogin,
        isSettingOpen,
        setIsSettingOpen,
        valButtonSize,
        setValButtonSize,
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
        const params = new URLSearchParams(location.search);
        const activeCategory = params.get("category");
        const activeTopic = params.get("topic");
        const dropdownRef = useRef(false);
        const bgColor = (path) => {
            const isActive = location.pathname === path;

            if (isActive) {
                return dark
                    ? "bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-white"
                    : "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700";
            }

            return dark
                ? "text-gray-300 hover:bg-gray-700"
                : "text-gray-800 hover:bg-gray-100";
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

        useEffect(() => {
            if (!openDropDown) return;

            const handleClickOutside = (e) => {
                if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                    setOpenDropdown(false);
                }

            };

            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }, [openDropDown]);

        useEffect(() => {
            if (!openDropDown) return;

            const handleEsc = (e) => {
                if (e.key === "Escape") {
                    setOpenDropdown(false);
                }
            };

            window.addEventListener("keydown", handleEsc);
            return () => window.removeEventListener("keydown", handleEsc);
        }, [openDropDown]);

        useEffect(() => {
            const onScroll = () => {
                console.log("BODY SCROLL");
                setOpenDropdown(false);
            };

            window.addEventListener("scroll", onScroll, { passive: true });
            return () => window.removeEventListener("scroll", onScroll);
        }, []);

        useEffect(() => {
            if (!openDropDown) return;

            const closeDropdown = () => {
                console.log("SCROLL / WHEEL DETECTED");
                setOpenDropdown(false);
            };

            window.addEventListener("wheel", closeDropdown, { passive: true });
            window.addEventListener("touchmove", closeDropdown, { passive: true });

            return () => {
                window.removeEventListener("wheel", closeDropdown);
                window.removeEventListener("touchmove", closeDropdown);
            };
        }, [openDropDown]);



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
                    title: lang ? "Error!" : "Kesalahan!",
                    text: lang ? `Error Add : ${err.response.data.error}.` : `Gagal Menambahkan : ${err.response.data.error}.`,
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

        const sizeText = {
            small: "text-sm",
            medium: "text-base",
            large: "text-lg"
        };

        const sizeTextUp = {
            small: "text-xl",
            medium: "text-2xl",
            large: "text-3xl"
        };

        const sizeTextDown = {
            small: "text-xs",
            medium: "text-sm",
            large: "text-base"
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
                    zIndex: 50
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
                }} className={`flex items-center justify-center shadow-md cursor-pointer text-white
                    ${dark
                        ? "bg-gradient-to-r from-indigo-800 to-blue-800"
                        : "bg-gradient-to-r from-indigo-500 to-blue-500"}`}
                    onClick={() => setIsMinimized(!isMinimized)}
                >
                    {isMinimized ? <FiChevronRight size={25} /> :
                        <FiChevronLeft size={25} />
                    }
                </div>
                <div className="p-4 flex flex-col h-full">
                    <div className={"flex mb-4 " + (isMinimized ? "justify-center" : "justify-between")}>
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
                                <h2 className="text-xl font-semibold tracking-wide mt-1">
                                    iKodora
                                </h2>
                            </div>}
                    </div>

                    <div className="flex items-center justify-center">
                        {localStorage.getItem("login") && !isMinimized && (
                            <button
                                onClick={() => window.location.replace("/")}
                                className={`
                                my-3
                                w-full
                                group relative flex items-center gap-2
                                py-2
                                rounded-lg
                                font-medium
                                text-white
                                overflow-hidden
                                ${dark
                                        ? "bg-gradient-to-r from-indigo-800 to-blue-800"
                                        : "bg-gradient-to-r from-indigo-500 to-blue-500"}
                                shadow-md
                                transition-all duration-300
                                hover:shadow-lg
                                active:scale-95 justify-center
                            `}
                            >
                                <span
                                    className={`
                                        absolute inset-0
                                        ${dark
                                            ? "bg-gradient-to-r from-blue-700 to-indigo-700"
                                            : "bg-gradient-to-r from-blue-500 to-indigo-500"}
                                        opacity-0
                                        transition-opacity duration-300
                                        group-hover:opacity-100
                                    `}
                                />
                                <span className={`relative z-10 flex items-center gap-2 ${sizeText[valButtonSize] || "text-base"}`}>
                                    <FiPlus className={`transition-transform duration-300 group-hover:rotate-90 ${sizeText[valButtonSize] || "text-base"}`} />
                                    {lang ? "Start Chat" : "Mulai Obrolan"}
                                </span>
                            </button>
                        )}
                        {localStorage.getItem("login") && isMinimized && (
                            <button
                                onClick={() => navigate("/")}
                                className={`
                                    w-8
                                    mb-3
                                    mt-3
                                    group relative flex items-center
                                    py-2
                                    rounded-lg
                                    font-medium
                                    text-white
                                    overflow-hidden
                                    ${dark
                                        ? "bg-gradient-to-r from-indigo-800 to-blue-800"
                                        : "bg-gradient-to-r from-indigo-500 to-blue-500"}
                                    shadow-md
                                    transition-all duration-300
                                    hover:shadow-lg
                                    active:scale-95 justify-center
                                `}
                            >
                                <span
                                    className={`
                                        absolute inset-0
                                        ${dark
                                            ? "bg-gradient-to-r from-blue-700 to-indigo-700"
                                            : "bg-gradient-to-r from-blue-500 to-indigo-500"}
                                        opacity-0
                                        transition-opacity duration-300
                                        group-hover:opacity-100
                                    `}
                                />
                                <span className="relative z-10 flex items-center gap-2">
                                    <FiPlus className={`transition-transform duration-300 group-hover:rotate-90 ${sizeText[valButtonSize] || "text-base"}`} />
                                </span>
                            </button>
                        )}
                    </div>

                    <div className="flex flex-col gap-3 flex-auto overflow-y-hidden custom-scroll">
                        {[1, 2].includes(roleId) && (
                            <button
                                className={`flex items-center ${isMinimized ? "justify-center" : "justify-start"} gap-2 p-2 rounded-lg ${bgColor("/dokumen")} ${sizeText[valButtonSize] || "text-base"}`}
                                onClick={() => navigate("/dokumen", { state: { valButtonSize: valButtonSize } })}
                            >
                                <FiDownload />
                                {!isMinimized && <span>{lang ? "Document Management" : "Manajemen Dokumen"}</span>}
                            </button>
                        )}

                        {[1, 2].includes(roleId) && (
                            <button
                                className={`flex items-center ${isMinimized ? "justify-center" : "justify-start"} gap-2 p-2 rounded-lg ${bgColor("/userManagement")} ${sizeText[valButtonSize] || "text-base"}`}
                                onClick={() => navigate("/userManagement")}
                            >
                                <FiUser />
                                {!isMinimized && <span>{lang ? "User Management" : "Manajemen Pengguna"}</span>}
                            </button>
                        )}

                        {localStorage.getItem("login") && !isMinimized && (
                            <div className="mt-2">
                                <div className="flex items-center gap-2 mb-2 w-full relative">
                                    <FiArchive />
                                    <span className={`font-semibold transition-all ${sizeText[valButtonSize] || "text-base"}`}>{lang ? "Topics" : "Topik"}</span>

                                    <div className="relative flex-1">
                                        <input
                                            type="text"
                                            placeholder={lang ? "Search for topics..." : "Cari topik..."}
                                            value={searchKeyword}
                                            onChange={(e) => setSearchKeyword(e.target.value)}
                                            className={`
                                                h-7 pl-2 pr-10 border rounded-md outline-none
                                                transition-all duration-500 ease-in-out
                                            ${dark
                                                    ? "bg-gray-700 text-white border-gray-600"
                                                    : "bg-white text-black border-gray-300"}
                                                ${isSearch ? "w-full opacity-100" : "w-0 opacity-0 pointer-events-none"}
                                                ${sizeText[valButtonSize] || "text-base"}
                                            `}
                                            autoFocus={isSearch}
                                            style={{ float: "right" }}
                                        />

                                        <FiSearch
                                            onClick={() => setIsSearch(!isSearch)}
                                            className={`
                                                absolute right-5 top-1/2 -translate-y-1/2
                                                cursor-pointer transition-colors duration-300
                                                ${dark
                                                    ? "text-gray-300 hover:text-white"
                                                    : "text-gray-800 hover:text-gray-400"}
                                                `}
                                        />
                                    </div>

                                </div>
                                <div className="flex items-center gap-2 mb-2 ml-2 p-1 border-b">
                                    <span className={`font-semibold ${sizeText[valButtonSize] || "text-base"}`}>{lang ? "Favorite Topics" : "Topik Favorit"}</span>
                                </div>
                                <div className="m-2 space-y-2 custom-scroll" style={{ maxHeight: "150px", overflowY: "auto" }} onScroll={handleScrollFavorite}>

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
                                            activeCategory={activeCategory}
                                            activeTopic={activeTopic}
                                            valButtonSize={valButtonSize}
                                        />
                                    ))}
                                </div>

                                <div className="flex items-center gap-2 mb-2  ml-2 p-1 border-b ">
                                    <span className={`font-semibold ${sizeText[valButtonSize] || "text-base"}`}>{lang ? "Recents" : "Terbaru"}</span>
                                </div>
                                <div
                                    className="m-2 space-y-2 custom-scroll"
                                    style={{
                                        maxHeight: `calc(100vh - ${valButtonSize === "small" ? 630 :
                                            valButtonSize === "medium" ? 660 :
                                                valButtonSize === "large" ? 685 : 680
                                            }px)`,
                                        overflowY: "auto"
                                    }}
                                    onScroll={handleScroll}
                                >
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
                                            activeCategory={activeCategory}
                                            activeTopic={activeTopic}
                                            valButtonSize={valButtonSize}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {!localStorage.getItem("login") && !isMinimized && (
                        <div className="relative mt-6 mb-2 px-3">
                            <button
                                className={`
                                    w-full flex items-center justify-center gap-2
                                    px-4 py-2.5 rounded-xl
                                    bg-gradient-to-r from-indigo-500 to-blue-500
                                    text-white font-semibold
                                    shadow-md shadow-indigo-500/30
                                    transition-all duration-200
                                    hover:shadow-lg hover:scale-[1.02]
                                    active:scale-[0.98] ${sizeText[valButtonSize] || "text-base"}
                                `} onClick={() => setIsLoginOpen(true)}
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
                        <div className="relative mt-6 mb-2"
                            ref={dropdownRef}
                        >
                            {openDropDown && (
                                <div
                                    className={
                                        isMinimized
                                            ? "absolute left-[16px] bottom-[63px]"
                                            : "absolute left-0 bottom-14"
                                    }
                                >
                                    <UserDropdown
                                        dark={dark}
                                        valButtonSize={valButtonSize}
                                        onPassword={() => setIsPasswordOpen(true)}
                                        onSetting={() => setIsSettingOpen(true)}
                                        onLogout={() => {
                                            // Simpan item yang ingin dipertahankan
                                            const uiDarkMode = localStorage.getItem("ui_dark_mode");
                                            const uiLang = localStorage.getItem("ui_lang");
                                            const uiFontSize = localStorage.getItem("ui_font_size");

                                            // Hapus semua localStorage
                                            localStorage.clear();

                                            // Kembalikan item yang dipertahankan
                                            if (uiDarkMode) localStorage.setItem("ui_dark_mode", uiDarkMode);
                                            if (uiLang) localStorage.setItem("ui_lang", uiLang);
                                            if (uiFontSize) localStorage.setItem("ui_font_size", uiFontSize);

                                            // Logout state
                                            setLogin(false);
                                            window.location.href = "/";
                                        }}
                                        lang={lang}
                                    />
                                </div>
                            )}

                            <div className="flex items-center">
                                <div
                                    onClick={() => setOpenDropdown(!openDropDown)}
                                    className={
                                        `w-10 h-10 rounded-full flex items-center justify-center font-bold cursor-pointer text-white
                                        bg-gradient-to-r from-indigo-500 to-blue-500
                                        ${dark
                                            ? "bg-gradient-to-r from-indigo-800 to-blue-800"
                                            : "bg-gradient-to-r from-indigo-500 to-blue-500"}`
                                    }
                                >
                                    {localStorage.getItem("nama")?.charAt(0).toUpperCase()}
                                </div>

                                <div className="ml-3">
                                    <div className={`${sizeText[valButtonSize] || "text-base"}`}>
                                        {lang ? "Hallo" : "Halo"}, <b>{localStorage.getItem("nama")}</b>
                                    </div>
                                    <div className={`${sizeText[valButtonSize] || "text-base"}`}>
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
                                    `w-10 h-10 rounded-full flex items-center justify-center font-bold cursor-pointer text-white
                                    ${dark
                                        ? "bg-gradient-to-r from-indigo-800 to-blue-800"
                                        : "bg-gradient-to-r from-indigo-500 to-blue-500"}`
                                }
                            >
                                {localStorage.getItem("nama")?.charAt(0).toUpperCase()}
                            </div>

                            {openDropDown && (
                                <div

                                    className={
                                        isMinimized
                                            ? "absolute left-[16px] bottom-[63px]"
                                            : "absolute left-0 bottom-14"
                                    }
                                >
                                    <UserDropdown
                                        dark={dark}
                                        valButtonSize={valButtonSize}
                                        onPassword={() => setIsPasswordOpen(true)}
                                        onSetting={() => setIsSettingOpen(true)}
                                        onLogout={() => {
                                            // Simpan item yang ingin dipertahankan
                                            const uiDarkMode = localStorage.getItem("ui_dark_mode");
                                            const uiLang = localStorage.getItem("ui_lang");
                                            const uiFontSize = localStorage.getItem("ui_font_size");

                                            // Hapus semua localStorage
                                            localStorage.clear();

                                            // Kembalikan item yang dipertahankan
                                            if (uiDarkMode) localStorage.setItem("ui_dark_mode", uiDarkMode);
                                            if (uiLang) localStorage.setItem("ui_lang", uiLang);
                                            if (uiFontSize) localStorage.setItem("ui_font_size", uiFontSize);

                                            // Logout state
                                            setLogin(false);
                                            window.location.href = "/";
                                        }}
                                        lang={lang}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <EditPasswordModal
                    isOpen={isEditPasswordOpen}
                    onClose={() => setIsPasswordOpen(false)}
                    valButtonSize={valButtonSize}
                    dark={dark}
                />
                <LoginModal
                    isOpen={isLoginOpen}
                    onClose={() => setIsLoginOpen(false)}
                    onLogin={handleLogin}
                    setLogin={setLogin}
                    login={login}
                    dark={dark}
                    lang={lang}
                    valButtonSize={valButtonSize}
                />
                <SettingModal
                    isOpen={isSettingOpen}
                    onClose={() => setIsSettingOpen(false)}
                    dark={dark}
                    setDark={setDark}
                    lang={lang}
                    setLang={setLang}
                    valButtonSize={valButtonSize}
                    setValButtonSize={setValButtonSize}
                />
            </div >
        );
    };

const SidebarItem = ({ dark, title, desc, icon, idCategory, idTopic, location, activeCategory, activeTopic, valButtonSize }) => {
    const navigate = useNavigate();
    const sizeText = {
        small: "text-sm",
        medium: "text-base",
        large: "text-lg"
    };

    const sizeTextUp = {
        small: "text-xl",
        medium: "text-2xl",
        large: "text-3xl"
    };

    const sizeTextDown = {
        small: "text-xs",
        medium: "text-sm",
        large: "text-base"
    };
    return (
        <div
            onClick={() => {
                console.log(location.pathname)
                if (location.pathname == "/userManagement" || location.pathname == "/dokumen") {
                    navigate(
                        `/?topic=${idTopic}&category=${idCategory}`,
                        { replace: true }
                    )
                }
                else {
                    navigate(
                        `?topic=${idTopic}&category=${idCategory}`,
                        { replace: true }
                    )
                }
            }
            }
            className={
                "flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors " +
                (
                    String(idCategory) === activeCategory &&
                        String(idTopic) === activeTopic
                        ? dark
                            ? "bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-white"
                            : "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700"
                        : dark
                            ? "hover:bg-gray-700 text-gray-300"
                            : "hover:bg-gray-100 text-gray-800"
                )
            }
        >
            <div className="row-auto">
                <div className="flex items-center gap-2">
                    {icon}
                    <span className={`${sizeText[valButtonSize] || "text-base"}`}>{title}</span>
                </div>
                <div className={`ml-2 ${sizeTextDown[valButtonSize] || "text-base"} ml-6 mt-1`}>
                    {desc}
                </div>
            </div>
        </div >
    );
};

const UserDropdown = ({
    dark,
    valButtonSize,
    onPassword,
    onSetting,
    onLogout,
    lang
}) => {
    const sizeText = {
        small: "text-sm",
        medium: "text-base",
        large: "text-lg"
    };

    const sizeTextUp = {
        small: "text-xl",
        medium: "text-2xl",
        large: "text-3xl"
    };

    const sizeTextDown = {
        small: "text-xs",
        medium: "text-sm",
        large: "text-base"
    };

    return (
        <div
            className={`w-48 rounded-lg shadow-lg z-[9999] overflow-hidden
            ${dark ? "bg-gray-700 text-white" : "bg-white"}`}
            style={{
                borderRadius: "10px",
                boxShadow: "0 10px 20px rgba(0,0,0,0.2)"
            }}
        >
            <button
                onClick={onPassword}
                className={`w-full text-left flex items-center gap-3 px-4 py-2 hover:bg-gray-100 
                ${dark ? "hover:bg-gray-600" : ""}
                ${sizeText[valButtonSize] || "text-base"}`}
            >
                <FiKey /> {lang ? "Edit Password" : "Ubah Kata Sandi"}
            </button>

            <button
                onClick={onSetting}
                className={`w-full flex items-center gap-3 text-left px-4 py-2 hover:bg-gray-100 
                ${dark ? "hover:bg-gray-600" : ""}
                ${sizeText[valButtonSize] || "text-base"}`}
            >
                <FiSettings /> {lang ? "Settings" : "Pengaturan"}
            </button>

            <button
                onClick={onLogout}
                className={`w-full text-left flex items-center gap-3 px-4 py-2 text-red-500 hover:bg-gray-100 
                ${dark ? "hover:bg-gray-600" : ""}
                ${sizeText[valButtonSize] || "text-base"}`}
            >
                <FiLogOut /> Log Out
            </button>
        </div>
    );
};


export default SideBarLeft;