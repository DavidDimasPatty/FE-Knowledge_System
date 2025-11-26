import React, { useState, useEffect, useRef } from "react";
import './style/home.css';
import SideBarLeftHome from "./contents/sideBarLeftHome";
import ChatAreaHome from "./contents/chatAreaHome";
import InputAreaHome from "./contents/inputAreaHome";
import SideBarRightHome from "./contents/sideBarRightHome";
import TopBar from "./contents/topBar";
const Home = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dark, setDark] = useState(false);
  const [login, setLogin] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    setTimeout(() => {
      const botMsg = { role: "bot", text: "Ini adalah respon AI (dummy)." };
      setMessages((prev) => [...prev, botMsg]);
      setIsLoading(false);
    }, 1500);
  };

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
        <SideBarLeftHome dark={dark} />

        <div className="flex-1 flex flex-col">
          <ChatAreaHome
            messages={messages}
            isLoading={isLoading}
            bottomRef={bottomRef}
            dark={dark}
          />

          <InputAreaHome
            input={input}
            setInput={setInput}
            sendMessage={sendMessage}
            dark={dark}
          />
        </div>

        <SideBarRightHome dark={dark} />
      </div>
    </div>
  );
}

export default Home;