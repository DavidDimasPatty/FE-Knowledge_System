import React from "react";
import LoginModal from "./loginModal";
import { useNavigate } from "react-router-dom";

const TopBar = ({
    dark,
    setDark,
    login,
    setLogin,
    setIsLoginOpen,
    isLoginOpen,
    handleLogin }) => {

    const navigate = useNavigate();

    return (
        <div
            className={
                dark
                    ? "w-full px-4 py-3 border-b  text-white border-gray-700 bg-gray-900 flex items-center justify-between"
                    : "w-full px-4 py-3 border-b  text-black border-gray-300 bg-white flex items-center justify-between"
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
                <h2 className="text-lg font-semibold tracking-wide">
                    Ikodora
                </h2>
            </div>

            <div className="flex items-center space-x-3">
                <button
                    onClick={() => setDark(!dark)}
                    className={
                        "w-16 h-8 flex items-center rounded-full p-1 transition-all duration-300 relative " +
                        (dark ? "bg-gray-700" : "bg-blue-400")
                    }
                >
                    <span
                        className={
                            "absolute left-2 transition-opacity duration-300 text-black text-lg " +
                            (dark ? "opacity-0" : "opacity-100")
                        }
                    >
                        ☀️
                    </span>

                    <span
                        className={
                            "absolute right-2 transition-opacity duration-300 text-white text-lg " +
                            (dark ? "opacity-100" : "opacity-0")
                        }
                    >
                        🌙
                    </span>

                    <div
                        className={
                            "w-7 h-7 rounded-full bg-white shadow-md transform transition-all duration-300 " +
                            (!dark ? "translate-x-8" : "translate-x-0")
                        }
                    ></div>
                </button>

                {!localStorage.getItem("login") && (
                    <div className="flex items-end space-x-3">

                        <button
                            onClick={() => setIsLoginOpen(true)}
                            className={
                                "w-16 h-8  rounded-full p-1 transition-all duration-300 relative " +
                                (dark ? "bg-gray-700" : "bg-blue-400")
                            }
                        ><b>Log In</b></button>

                    </div>
                )}
            </div>
            <LoginModal
                isOpen={isLoginOpen}
                onClose={() => setIsLoginOpen(false)}
                onLogin={handleLogin}
                setLogin={setLogin}
                login={login}
            />
        </div>
    );
};

export default TopBar;