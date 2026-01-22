import React, { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
import { FiEye, FiEyeOff } from "react-icons/fi";
const SettingModal = (
    {
        isOpen,
        onClose,
        dark,
        setDark,
        lang,
        setLang
    }) => {


    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="relative bg-white rounded-xl shadow-xl w-[460px] pt-20 pb-10 px-10 flex flex-col gap-5">

                <h2 className="text-center text-2xl font-semibold text-gray-800 mb-6">
                    Settings
                </h2>

                <div className="flex flex-row gap-5 items-center justify-center">
                    <div>
                        <span>Dark Mode</span>
                    </div>
                    <div>
                        <button
                            onClick={() => setDark(!dark)}
                            className={
                                "w-16 h-8 flex items-center rounded-full p-1 transition-all duration-300 relative " +
                                (dark ? "bg-gray-700" : " bg-gradient-to-r from-indigo-500 to-blue-500")
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
                    </div>
                </div>

                <div className="flex flex-row gap-5 items-center justify-center">
                    <div>
                        <span>Language</span>
                    </div>
                    <div>
                        <button
                            onClick={() => setLang(!lang)}
                            className={
                                "w-16 h-8 overflow-hidden flex items-center rounded-full p-1 transition-all duration-300 relative " +
                                (lang === true
                                    ? "bg-gradient-to-r from-blue-500 to-sky-500"
                                    : "bg-gradient-to-r from-indigo-500 to-blue-500")
                            }
                        >
                            <span
                                className={
                                    "emoji absolute bottom-1 left-3 transition-opacity duration-300 text-lg text-white" +
                                    (lang === false ? "opacity-100" : "opacity-0")
                                }
                            >
                                <img src="idpng.png" width={40} style={{ zIndex: "10", height: "35px", right: "20px", top: "5px", position: "relative" }} />
                            </span>

                            <span
                                className={
                                    "emoji absolute right-2 bottom-1 transition-opacity duration-300 text-lg text-white" +
                                    (lang === true ? "opacity-100" : "opacity-0")
                                }
                            >
                                <img src="uspng.png" width={35} style={{ transform: "scaleX(-1)", height: "55px", right: "-7px", top: "15px", position: "relative" }} />
                            </span>
                            <div
                                className={
                                    "w-10  h-10 rounded-full bg-white shadow-md transform transition-all duration-300 " +
                                    (lang === false ? "translate-x-6" : "-translate-x-2")
                                }
                                style={{ zIndex: "20" }}
                            />
                        </button>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="mt-4 w-full text-sm text-gray-500 hover:text-gray-700"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default SettingModal;