import React from "react";
import { FiPlus, FiBook, FiHome, FiSettings, FiStar, FiAlignCenter, FiCode, FiScissors, FiArchive } from "react-icons/fi";

const SideBarRightHome = ({ dark }) => {
    return (<div className={dark ? "w-80 bg-gray-800 p-4" : "w-80 bg-white p-4 border-r"}>

        <div className="mt-3">
            <div className="flex items-center gap-2 mb-2">
                <FiArchive /> <span className="font-semibold">Topics</span>
            </div>

            <div className="ml-1 space-y-2">
                <SidebarItem dark={dark} icon={<FiCode />} title="Programming" desc="Test Description 123" />
                <SidebarItem dark={dark} icon={<FiBook />} title="Education" desc="Test Description 123" />
                <SidebarItem dark={dark} icon={<FiScissors />} title="Science" desc="Test Description 123" />
            </div>
        </div>
    </div>)
}

const SidebarItem = ({ dark, icon, title, desc }) => {
    return (
        <div
            className={
                "flex items-center justify-between p-2 rounded-lg cursor-pointer " +
                (dark ? "hover:bg-gray-700" : "hover:bg-gray-100")
            }
        >
            <div className="row-auto">
                <div className="flex items-center gap-2">
                    {icon}
                    <span>{title}</span>
                </div>
                <div className="ml-2 text-gray-400 text-sm">
                    {desc}
                </div>
            </div>
        </div>
    );
};

export default SideBarRightHome;