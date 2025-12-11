import React, { useEffect, useState } from "react";
import { BsFillStarFill } from "react-icons/bs";
import { FiPlus, FiBook, FiHome, FiSettings, FiStar, FiAlignCenter, FiCode, FiScissors, FiArchive, FiSearch } from "react-icons/fi";
import axios from "axios";

const SideBarRight = ({ dark }) => {
    const [isSearch, setIsSearch] = useState(false)
    const [favoriteTopics, setFavoriteTopics] = useState([]);
    const [nonFavoriteTopics, setNonFavoriteTopics] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState("");

    const [pageFavorite, setPageFavorite] = useState(1);
    const [pageNonFavorite, setPageNonFavorite] = useState(1);
    const [hasMoreFavorite, setHasMoreFavorite] = useState(true);
    const [hasMoreNonFavorite, setHasMoreNonFavorite] = useState(true);

    const [loadingNonFavorite, setLoadingNonFavorite] = useState(false);
    const [loadingFavorite, setLoadingFavorite] = useState(false);




    // const username = localStorage.getItem("username");
    const username = 'nando';

    useEffect(() => {
        fetchFavorite(1, "");
        fetchNonFavorite(1, "");
    }, [username]);

    const fetchFavorite = async (page = 1, search = "") => {
        if (loadingFavorite) return;
        setLoadingFavorite(true);

        const res = await axios.get(`http://localhost:8080/getAllTopicUser`, {
            params: { username, isFavorite: true, page, limit: 5, search }
        });

        setLoadingFavorite(false);
        const newData = res.data.data;

        if (page === 1) setFavoriteTopics(newData);
        else setFavoriteTopics(prev => [...prev, ...newData]);

        setHasMoreFavorite(newData.length === 5);
    };


    const fetchNonFavorite = async (page = 1, search = "") => {
        if (loadingNonFavorite) return;
        setLoadingNonFavorite(true);
        const res = await axios.get(
            `http://localhost:8080/getAllTopicUser`, {
            params: {
                username,
                isFavorite: false,
                page,
                limit: 5,
                search
            }
        }
        );
        setLoadingNonFavorite(false);

        const newData = res.data.data;

        if (page === 1) {
            setNonFavoriteTopics(newData);
        } else {
            setNonFavoriteTopics(prev => [...prev, ...newData]);
        }

        setHasMoreNonFavorite(newData.length === 5);
    };

    const handleScroll = (e) => {
        if (searchKeyword !== "") return;

        const isBottom =
            e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 5;

        if (isBottom && hasMoreNonFavorite && !loadingNonFavorite) {
            const nextPage = pageNonFavorite + 1;
            setPageNonFavorite(nextPage);
            fetchNonFavorite(nextPage, searchKeyword);
        }
    };

    const handleScrollFavorite = (e) => {
        if (searchKeyword !== "") return;

        const isBottom =
            e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 5;

        if (isBottom && hasMoreFavorite && !loadingFavorite) {
            const nextPage = pageFavorite + 1;
            setPageFavorite(nextPage);
            fetchFavorite(nextPage, searchKeyword);
        }
    };


    useEffect(() => {
        const delay = setTimeout(() => {
            // reset pagination
            setPageFavorite(1);
            setPageNonFavorite(1);
            setHasMoreFavorite(true);
            setHasMoreNonFavorite(true);

            fetchFavorite(1, searchKeyword);
            fetchNonFavorite(1, searchKeyword);
        }, 400);

        return () => clearTimeout(delay);
    }, [searchKeyword]);


    return (
        <div className={dark ? "w-80 bg-gray-800 p-4" : "w-80 bg-white p-4 border-r"}>

            <div className="mt-3">

                <div className="flex items-center gap-2 mb-2 w-full relative">
                    <FiArchive />
                    <span className="font-semibold transition-all">Topics</span>

                    <div className="relative flex-1">
                        {/* <input
                            type="text"
                            placeholder="Cari Topik..."
                            className={`h-7 pl-2 pr-6 border rounded-md outline-none transition-all duration-500 ease-in-out
      ${isSearch ? 'w-full  opacity-100' : 'w-0 opacity-0 pointer-events-none'}`}
                            autoFocus={isSearch} style={{ float: 'right' }}
                        /> */}
                        <input
                            type="text"
                            placeholder="Cari Topik..."
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            className={`h-7 pl-2 pr-6 border rounded-md outline-none transition-all duration-500 ease-in-out
    ${isSearch ? 'w-full opacity-100' : 'w-0 opacity-0 pointer-events-none'}`}
                            autoFocus={isSearch}
                            style={{ float: 'right' }}

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
                <div className="ml-1 space-y-2" style={{ maxHeight: "200px", overflowY: "auto" }} onScroll={handleScrollFavorite}>

                    {favoriteTopics.map((item) => (
                        <SidebarItem
                            key={item.ID}
                            dark={dark}
                            icon={<BsFillStarFill style={{ color: "yellow", stroke: "black", strokeWidth: "0.6px" }} />}
                            title={item.Topic}
                            desc={item.Desctription}
                        />
                    ))}
                </div>

                <div className="flex items-center gap-2 mb-2  ml-2 p-1 border-b ">
                    <span className="font-semibold">Recents</span>
                </div>
                <div className="ml-1 space-y-2" style={{ maxHeight: "calc(100vh - 430px)", overflowY: "auto" }} onScroll={handleScroll}>
                    {nonFavoriteTopics.map((item) => (
                        <SidebarItem
                            key={item.ID}
                            dark={dark}
                            icon={<FiStar />}
                            title={item.Topic}
                            desc={item.Desctription}
                        />
                    ))}
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