import { Outlet } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import SideBarLeft from "./sideBarLeft";
import SideBarRight from "./sideBarRight";
import TopBar from "./topBar";

const SharedLayout = () => {
    const [dark, setDark] = useState(false);
    const [login, setLogin] = useState(false);

    return (

        <div className="w-full h-screen flex flex-col">
            <TopBar setDark={setDark} dark={dark} login={login} setLogin={setLogin} />
            <div
                className={
                    "wrapperHomeContent flex " +
                    (dark ? "bg-gray-900 text-white" : "bg-gray-100 text-black")
                }
                style={{ height: "calc(100vh - 60px)" }}
            >
                <SideBarLeft dark={dark} login={login} setLogin={setLogin} />

                <Outlet context={{ dark }} />

                <SideBarRight dark={dark} />
            </div>
        </div>
    );
}

export default SharedLayout;