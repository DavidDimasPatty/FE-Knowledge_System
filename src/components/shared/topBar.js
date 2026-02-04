import React, { useState } from "react";
import LoginModal from "./loginModal";
import SettingModal from "./settingModal"; // nanti kita buat modal ini
import { useNavigate } from "react-router-dom";
import { FiSettings } from "react-icons/fi";

const TopBar = ({
    dark,
    setDark,
    login,
    setLogin,
    setIsLoginOpen,
    isLoginOpen,
    handleLogin,
    lang,
    setLang,
    valButtonSize,
    setValButtonSize
}) => {
    const navigate = useNavigate();
    const [isSettingOpen, setIsSettingOpen] = useState(false);

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
                dark
                    ? "w-full px-4 py-3 bg-gray-900 text-white flex items-center justify-between"
                    : "w-full px-4 py-3 bg-gray-100 text-black flex items-center justify-between"
            }
        >
            <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => navigate("/")}
            >
                <img
                    src={dark ? "/WHITE-LOGO.png" : "/BLACK-LOGO.png"}
                    alt="Ikodora Logo"
                    className="w-8 h-8 object-contain transition-transform duration-300 hover:scale-105"
                />
                <h2 className="text-lg font-semibold tracking-wide">iKodora</h2>
            </div>

            <div className="flex items-center space-x-3">
                {/* SETTING ICON */}
                <button
                    onClick={() => setIsSettingOpen(true)}
                    className={`p-2 rounded-lg transition ${sizeText[valButtonSize] || "text-base"}`}
                    style={{
                        backgroundColor: "transparent",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = dark ? "#374151" : "#e5e7eb"; // dark:bg-gray-700 : bg-gray-200
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                    }}
                >
                    <FiSettings
                        size={
                            valButtonSize === "small" ? 19 :
                                valButtonSize === "medium" ? 21 :
                                    23
                        }
                    />
                </button>

                {/* LOGIN BUTTON */}
                <button
                    onClick={() => setIsLoginOpen(true)}
                    className={`
                        flex items-center justify-center gap-2
                        px-4 py-2.5 rounded-xl
                        text-white font-semibold
                        shadow-md shadow-indigo-500/30
                        transform
                        transition duration-300 ease-in-out
                        hover:scale-105 hover:shadow-xl
                        active:scale-100
                        ${dark
                            ? "bg-gradient-to-r from-indigo-800 to-blue-800"
                            : "bg-gradient-to-r from-indigo-500 to-blue-500"}
                        ${sizeText[valButtonSize] || "text-base"}
                    `}
                    style={{
                        backfaceVisibility: "hidden",
                        transformStyle: "preserve-3d",
                    }}
                >
                    Log In
                </button>
            </div>

            {/* MODALS */}
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
        </div>
    );
};

export default TopBar;
