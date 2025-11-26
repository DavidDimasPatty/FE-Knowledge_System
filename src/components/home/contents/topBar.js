import React from "react";

const TopBar = ({ dark, setDark, login, setLogin }) => {
    return (
        <div
            className={
                dark
                    ? "w-full px-4 py-3 border-b  text-white border-gray-700 bg-gray-900 flex items-center justify-between"
                    : "w-full px-4 py-3 border-b  text-black border-gray-300 bg-white flex items-center justify-between"
            }
        >
            <h2 className="text-lg font-semibold">
                Ikodora
            </h2>

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

                {login ?
                    <div className="flex items-end space-x-3">

                        <button
                            onClick={() => setLogin(!login)}
                            className={
                                "w-16 h-8  rounded-full p-1 transition-all duration-300 relative " +
                                (dark ? "bg-gray-700" : "bg-blue-400")
                            }
                        ><b>Log In</b></button>

                    </div> : null
                }
            </div>

        </div>
    );
};

export default TopBar;