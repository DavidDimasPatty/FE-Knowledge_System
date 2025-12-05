import React, { useState } from "react";
import { BsFillStarFill } from "react-icons/bs";
import { FiPlus, FiBook, FiHome, FiSettings, FiStar, FiAlignCenter, FiCode, FiScissors, FiArchive, FiSearch } from "react-icons/fi";

const SideBarRight = ({ dark }) => {
    const [isSearch, setIsSearch] = useState(false)

    return (
    <div className={dark ? "w-80 bg-gray-800 p-4" : "w-80 bg-white p-4 border-r"}>

        <div className="mt-3">

            <div className="flex items-center gap-2 mb-2 w-full relative">
                <FiArchive />
                <span className="font-semibold transition-all">Topics</span>

                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Cari Topik..."
                        className={`h-7 pl-2 pr-6 border rounded-md outline-none transition-all duration-500 ease-in-out
      ${isSearch ? 'w-full  opacity-100' : 'w-0 opacity-0 pointer-events-none'}`}
                        autoFocus={isSearch} style={{ float: 'right' }}
                    />
                    <FiSearch
                        onClick={() => setIsSearch(!isSearch)}
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 cursor-pointer transition-all duration-300 hover:text-gray-700"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2 mb-2 ml-2 p-1 border-b">
                <span className="font-semibold">Saved Topics</span>
            </div>
            <div className="ml-1 space-y-2">
                <SidebarItem dark={dark} icon={<BsFillStarFill style={{ color: "yellow", stroke: "black", strokeWidth: "0.6px" }} />} title="Programming" desc="Test Description 123" />
                <SidebarItem dark={dark} icon={<BsFillStarFill style={{ color: "yellow", stroke: "black", strokeWidth: "0.6px" }} />} title="Education" desc="Test Description 123" />
                <SidebarItem dark={dark} icon={<BsFillStarFill style={{ color: "yellow", stroke: "black", strokeWidth: "0.6px" }} />} title="Science" desc="Test Description 123" />
            </div>

            <div className="flex items-center gap-2 mb-2  ml-2 p-1 border-b ">
                <span className="font-semibold">Recents</span>
            </div>
            <div className="ml-1 space-y-2" style={{ maxHeight: "calc(100vh - 430px)", overflowY: "auto" }}>
                <SidebarItem dark={dark} icon={<FiStar />} title="Programming" desc="Test Description 123" />
                <SidebarItem dark={dark} icon={<FiStar />} title="Education" desc="Test Description 123" />
                <SidebarItem dark={dark} icon={<FiStar />} title="Science" desc="Test Description 123" />
                <SidebarItem dark={dark} icon={<FiStar />} title="Programming" desc="Test Description 123" />
                <SidebarItem dark={dark} icon={<FiStar />} title="Education" desc="Test Description 123" />
                <SidebarItem dark={dark} icon={<FiStar />} title="Science" desc="Test Description 123" />
                <SidebarItem dark={dark} icon={<FiStar />} title="Programming" desc="Test Description 123" />
                <SidebarItem dark={dark} icon={<FiStar />} title="Education" desc="Test Description 123" />
                <SidebarItem dark={dark} icon={<FiStar />} title="Science" desc="Test Description 123" />
                <SidebarItem dark={dark} icon={<FiStar />} title="Programming" desc="Test Description 123" />
                <SidebarItem dark={dark} icon={<FiStar />} title="Education" desc="Test Description 123" />
                <SidebarItem dark={dark} icon={<FiStar />} title="Science" desc="Test Description 123" />
                <SidebarItem dark={dark} icon={<FiStar />} title="Programming" desc="Test Description 123" />
                <SidebarItem dark={dark} icon={<FiStar />} title="Education" desc="Test Description 123" />
                <SidebarItem dark={dark} icon={<FiStar />} title="Science" desc="Test Description 123" />
            </div>
        </div>
    </div >)
}

const SidebarItem = ({ dark, title, desc, icon }) => {
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

export default SideBarRight;