import { Outlet } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import SideBarLeft from "./sideBarLeft";
import SideBarRight from "./sideBarRight";
import TopBar from "./topBar";

const SharedLayout = () => {
    const [dark, setDark] = useState(false);
    const [lang, setLang] = useState(false);
    const [login, setLogin] = useState(false);
    const [nama, setNama] = useState("");
    const [roleName, setRoleName] = useState("");
    const [roleId, setRoleId] = useState(0);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isEditPasswordOpen, setIsPasswordOpen] = useState(false);
    const [isSettingOpen, setIsSettingOpen] = useState(false);
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
    useEffect(() => {
        setLogin(localStorage.getItem("login"))
    })
    return (

        <div className="w-full h-screen flex flex-col">
            {!login &&
                <TopBar
                    setDark={setDark}
                    dark={dark}
                    login={login}
                    setLogin={setLogin}
                    handleLogin={handleLogin}
                    isLoginOpen={isLoginOpen}
                    setIsLoginOpen={setIsLoginOpen}
                />
            }
            <div
                className={` w-full h-screen flex gap-5 flex-row ${dark ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}
            >

                {login &&
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
                    />
                }
                <Outlet context={{ dark }} />

                {/* <SideBarRight dark={dark} />  */}
            </div>
        </div>
    );
}

export default SharedLayout;