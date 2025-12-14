import { Outlet } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import SideBarLeft from "./sideBarLeft";
import SideBarRight from "./sideBarRight";
import TopBar from "./topBar";

const SharedLayout = () => {
    const [dark, setDark] = useState(false);
    const [login, setLogin] = useState(false);
    const [nama, setNama] = useState("");
    const [roleName, setRoleName] = useState("");
    const [roleId, setRoleId] = useState(0);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [openDropDown, setOpenDropdown] = useState(false);

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
    };
    return (

        <div className="w-full h-screen flex flex-col">
            <TopBar
                setDark={setDark}
                dark={dark}
                login={login}
                setLogin={setLogin}
                handleLogin={handleLogin}
                isLoginOpen={isLoginOpen}
                setIsLoginOpen={setIsLoginOpen}
            />
            <div
                className={`flex flex-1 ${dark ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}
            >
                <SideBarLeft
                    dark={dark}
                    login={login}
                    setLogin={setLogin}
                    openDropDown={openDropDown}
                    setOpenDropdown={setOpenDropdown}
                />

                <Outlet context={{ dark }} />

                <SideBarRight dark={dark} />
            </div>
        </div>
    );
}

export default SharedLayout;