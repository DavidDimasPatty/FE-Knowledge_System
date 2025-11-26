import React, { useState, useEffect, useRef } from "react";
import './style/home.css';
import SideBarLeftHome from "../shared/sideBarLeft";
import ChatAreaHome from "./contents/chatAreaHome";
import InputAreaHome from "./contents/inputAreaHome";
import SideBarRightHome from "../shared/sideBarRight";
import TopBar from "../shared/topBar";
const Home = ({dark}) => {
   const [messages, setMessages] = useState([]);
   const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef(null);
  const [isFirst, setIsFirst] = useState(true);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const sendMessage = () => {
    if (!input.trim()) return;
    
    !isFirst?setIsFirst(true):setIsFirst(false);
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

        <div className="flex-1 flex flex-col  wrapperChat">
          <ChatAreaHome
            messages={messages}
            isLoading={isLoading}
            bottomRef={bottomRef}
            dark={dark}
            isFirst={isFirst}
            input={input}
            setInput={setInput}
            sendMessage={sendMessage}
          />

          <InputAreaHome
            input={input}
            setInput={setInput}
            sendMessage={sendMessage}
            dark={dark}
            isFirst={isFirst}
          />
        </div>

  );
}

export default Home;