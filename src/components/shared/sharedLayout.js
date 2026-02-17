import { Outlet } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import SideBarLeft from "./sideBarLeft";
import SideBarRight from "./sideBarRight";
import TopBar from "./topBar";

const SharedLayout = () => {
    const [authCheck, setAuthCheck] = useState(null);
    const [login, setLogin] = useState(() => {
        return localStorage.getItem("username") == "" || localStorage.getItem("username") == null ? false : true;
    });
    const [dark, setDark] = useState(() => {
        const saved = localStorage.getItem("ui_dark_mode");
        return saved === "true";
    });
    const [lang, setLang] = useState(() => {
        const saved = localStorage.getItem("ui_lang");
        return saved === null ? true : saved === "true";
    });
    const [showWelcome, setShowWelcome] = useState(() => {
        return localStorage.getItem("welcome_shown") !== "true";
    });
    const [nama, setNama] = useState("");
    const [roleName, setRoleName] = useState("");
    const [roleId, setRoleId] = useState(0);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isEditPasswordOpen, setIsPasswordOpen] = useState(false);
    const [isSettingOpen, setIsSettingOpen] = useState(false);
    const [openDropDown, setOpenDropdown] = useState(false);
    const fullText = "Halo Selamat datang, di Web AI IKODORA";
    const [displayText, setDisplayText] = useState("");
    const [index, setIndex] = useState(0);
    const [valButtonSize, setValButtonSize] = useState(() => {
        return localStorage.getItem("ui_font_size") || "medium";
    });
    const [isLogin, setIsLogin] = useState(() => {
        return localStorage.getItem("login") || false;
    });
    const [valThink, setValThink] = useState(() => {
        return localStorage.getItem("ai_think") || "medium";
    });

    useEffect(() => {
        if (isLogin) {
            const interval = setInterval(async () => {
                try {
                    const res = await fetch(
                        `${process.env.REACT_APP_BE_BASE_URL}/authCheck`,
                        { credentials: "include" }
                    );

                    if (!res.ok) {
                        setAuthCheck(false);
                    } else {
                        setAuthCheck(true);
                    }
                } catch {
                    setAuthCheck(false);
                }
            }, 5 * 60 * 1000);

            return () => clearInterval(interval)
        }
    }, [isLogin]);

    useEffect(() => {
        if (authCheck === false) {
            const uiDarkMode = localStorage.getItem("ui_dark_mode");
            const uiLang = localStorage.getItem("ui_lang");
            const uiFontSize = localStorage.getItem("ui_font_size");

            localStorage.clear();

            if (uiDarkMode) localStorage.setItem("ui_dark_mode", uiDarkMode);
            if (uiLang) localStorage.setItem("ui_lang", uiLang);
            if (uiFontSize) localStorage.setItem("ui_font_size", uiFontSize);

            window.location.href = "/";
        }
    }, [authCheck]);

    const handleLogin = (data) => {
        setNama(data.user.nama);
        setRoleId(data.user.roleId);
        setRoleName(data.user.roleName);
        localStorage.setItem("nama", data.user.nama);
        localStorage.setItem("roleId", data.user.roleId);
        localStorage.setItem("roleName", data.user.roleName);
        localStorage.setItem("username", data.user.username);
        localStorage.setItem("login", true);
        setIsLoginOpen(false);
        window.location.replace("/");
    };
    useEffect(() => {
        setLogin(localStorage.getItem("login"))
    })
    useEffect(() => {
        localStorage.setItem("ui_font_size", valButtonSize);
    }, [valButtonSize]);
    useEffect(() => {
        localStorage.setItem("ai_think", valThink);
    }, [valThink]);
    useEffect(() => {
        localStorage.setItem("ui_dark_mode", dark.toString());
    }, [dark]);
    useEffect(() => {
        localStorage.setItem("ui_lang", lang.toString());
    }, [lang]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowWelcome(false);
            localStorage.setItem("welcome_shown", "true");
        }, 5000);

        return () => clearTimeout(timer);
    }, [showWelcome]);

    useEffect(() => {
        if (!showWelcome) return;

        if (index < fullText.length) {
            const timeout = setTimeout(() => {
                setDisplayText((prev) => prev + fullText[index]);
                setIndex((prev) => prev + 1);
            }, 70);
            return () => clearTimeout(timeout);
        }
    }, [index, showWelcome]);

    return (


        <div className="relative w-full h-screen overflow-y-auto"
            onScroll={() => { setOpenDropdown(false); console.log("masuk"); }}
        >

            <div
                className={`
        fixed inset-0 z-50 flex items-center justify-center
        transition-opacity duration-1000
        ${showWelcome ? "opacity-100" : "opacity-0 pointer-events-none"}
       bg-gray-200
      `}
            >
                <div className="text-center px-6">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">
                        {displayText}
                        <span className="animate-pulse">|</span>
                    </h1>

                    <p className="text-lg opacity-80 animate-fade-in">
                        Coba cara baru menggunakan AI ✨
                    </p>
                </div>
            </div>

            <div className="w-full h-screen flex flex-col">
                {!login && (
                    <TopBar
                        setDark={setDark}
                        dark={dark}
                        login={login}
                        setLogin={setLogin}
                        handleLogin={handleLogin}
                        isLoginOpen={isLoginOpen}
                        setIsLoginOpen={setIsLoginOpen}
                        lang={lang}
                        setLang={setLang}
                        openDropDown={openDropDown}
                        isEditPasswordOpen={isEditPasswordOpen}
                        isSettingOpen={isSettingOpen}
                        setIsSettingOpen={setIsSettingOpen}
                        valButtonSize={valButtonSize}
                        setValButtonSize={setValButtonSize}
                        valThink={valThink}
                        setValThink={setValThink}
                    />
                )}

                <div
                    className={`w-full flex-1 flex gap-5 
        ${dark ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}
                >
                    {login && (
                        <SideBarLeft
                            dark={dark}
                            setDark={setDark}
                            lang={lang}
                            setLang={setLang}
                            login={login}
                            setLogin={setLogin}
                            openDropDown={openDropDown}
                            isEditPasswordOpen={isEditPasswordOpen}
                            setIsPasswordOpen={setIsPasswordOpen}
                            setOpenDropdown={setOpenDropdown}
                            handleLogin={handleLogin}
                            isLoginOpen={isLoginOpen}
                            setIsLoginOpen={setIsLoginOpen}
                            isSettingOpen={isSettingOpen}
                            setIsSettingOpen={setIsSettingOpen}
                            valButtonSize={valButtonSize}
                            setValButtonSize={setValButtonSize}
                            valThink={valThink}
                            setValThink={setValThink}
                        />
                    )}

                    <div className="flex-1 min-w-0  h-full">
                        <Outlet context={{ dark, valButtonSize, lang, login }} />
                    </div>
                </div>
            </div>
        </div>

    );
}

export default SharedLayout;