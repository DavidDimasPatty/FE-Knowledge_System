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
        setLang,
        valButtonSize,
        setValButtonSize
    }) => {

    const getButtonClass = (size) => {
        const base =
            "box-border border font-medium leading-5 rounded-full text-sm px-4 py-2.5 focus:outline-none transition";

        const active =
            "bg-blue-600 text-white border-blue-600";

        const inactive =
            "bg-blue-100 text-blue-600 border-blue-300 hover:bg-blue-200";

        return `${base} ${valButtonSize === size ? active : inactive
            }`;
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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div
                className={`
                w-[480px] rounded-xl shadow-xl
                ${dark ? "bg-gray-900 text-white" : "bg-white text-gray-800"}
            `}
            >
                {/* HEADER */}
                <div className="px-8 py-6 pt-9 border-b border-gray-200 dark:border-gray-700">
                    <h2 className={`font-semibold ${sizeTextUp[valButtonSize]}`}>
                        Settings
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">
                        Customize your application preferences
                    </p>
                </div>

                {/* CONTENT */}
                <div className="px-8 py-6 space-y-6">

                    {/* DARK MODE */}
                    <div className="flex items-center justify-between">
                        <div>
                            <div className={`${sizeText[valButtonSize]} font-medium`}>
                                Dark Mode
                            </div>
                            <div className="text-sm text-gray-400">
                                Enable dark appearance
                            </div>
                        </div>

                        <button
                            onClick={() => setDark(!dark)}
                            className={`relative w-16 h-8 rounded-full transition-colors duration-300 shadow-lg
        ${dark
                                    ? "bg-gray-700"
                                    : "bg-gradient-to-r from-blue-500 to-sky-500"}
    `}
                        >
                            {/* Sun */}
                            <span
                                className={`
            absolute left-2 top-1/2 -translate-y-1/2
            transition-opacity duration-300
            ${dark ? "opacity-0" : "opacity-100"}
        `}
                            >
                                ☀️
                            </span>

                            {/* Moon */}
                            <span
                                className={`
            absolute right-2 top-1/2 -translate-y-1/2
            transition-opacity duration-300
            ${dark ? "opacity-100" : "opacity-0"}
        `}
                            >
                                🌙
                            </span>

                            {/* Toggle knob */}
                            <div
                                className={`
            absolute top-1/2 left-1 -translate-y-1/2
            w-6 h-6 bg-white rounded-full shadow-md
            transition-transform duration-300 ease-in-out
            ${dark ? "translate-x-0" : "translate-x-8"}
        `}
                            />
                        </button>

                    </div>

                    <hr className="border-gray-200 dark:border-gray-700" />

                    {/* LANGUAGE */}
                    <div className="flex items-center justify-between">
                        <div>
                            <div className={`${sizeText[valButtonSize]} font-medium`}>
                                Language
                            </div>
                            <div className="text-sm text-gray-400">
                                Interface language
                            </div>
                        </div>

                        <button
                            onClick={() => setLang(!lang)}
                            className={`
                                relative w-16 h-8 rounded-full p-1
                                overflow-hidden
                                transition-colors duration-300
                                bg-white shadow-lg
                            `}
                        >
                            {/* BACKGROUND IMAGE */}
                            <div
                                className="absolute inset-0 rounded-full transition-all duration-300"
                                style={{
                                    backgroundImage: lang ? "url('/us.png')" : "url('/id.png')",
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                }}
                            ></div>

                            {/* TOGGLE KNOB */}
                            <div
                                className={`
                                    absolute top-1 left-1
                                    w-6 h-6 rounded-full bg-white shadow-md
                                    transition-transform duration-300 ease-in-out
                                    ${lang ? "translate-x-8" : "translate-x-0"}
                                    `}
                            ></div>
                        </button>

                    </div>

                    <hr className="border-gray-200 dark:border-gray-700" />

                    {/* FONT SIZE */}
                    <div className="flex items-center justify-between">
                        {/* Label */}
                        <div className="flex flex-col">
                            <div className={`${sizeText[valButtonSize]} font-medium`}>
                                Font Size
                            </div>
                            <div className="text-sm text-gray-400">Adjust interface font</div>
                        </div>

                        {/* Buttons */}
                        <div className="inline-flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700 shadow-lg">
                            {["small", "medium", "large"].map(size => (
                                <button
                                    key={size}
                                    onClick={() => setValButtonSize(size)}
                                    className={`
                                            px-4 py-2 text-sm font-medium transition-all duration-300
                                            rounded-md
                                            ${valButtonSize === size
                                            ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg transform scale-105"
                                            : dark
                                                ? "bg-gray-800 hover:bg-gray-700 hover:shadow-md text-gray-200"
                                                : "bg-gray-100 hover:bg-gray-200 hover:shadow-md text-gray-800"
                                        }
                                    `}
                                >
                                    {size.charAt(0).toUpperCase() + size.slice(1)}
                                </button>
                            ))}
                        </div>

                    </div>

                </div>

                {/* FOOTER */}
                <div className="px-8 py-5 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                    <button
                        onClick={onClose}
                        className={`
                        px-6 py-2 rounded-lg text-sm font-medium
                        ${dark
                                ? "text-gray-300 hover:bg-gray-800"
                                : "text-gray-600 hover:bg-gray-100"}
                    `}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingModal;