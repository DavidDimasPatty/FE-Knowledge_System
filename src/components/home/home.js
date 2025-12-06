import React, { useState, useEffect, useRef } from "react";
import './style/home.css';
import ChatAreaHome from "./contents/chatAreaHome";
import InputAreaHome from "./contents/inputAreaHome";
import { useOutletContext } from "react-router-dom";
const Home = () => {
  const { dark } = useOutletContext();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const bottomRef = useRef(null);
  const [isFirst, setIsFirst] = useState(true);
  // scroll ke bawah setiap ada message / loading
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  // Connect WebSocket sekali saat load
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080/ws?userId=123");

    ws.onopen = () => console.log("WS Connected");

    ws.onmessage = (msg) => {
      const botMessage = {
        role: "bot",
        text: msg.data,
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    };

    ws.onerror = (err) => console.error("WS Error:", err);
    ws.onclose = () => console.log("WS closed");

    setSocket(ws);

    return () => ws.close();
  }, []);


  // const sendMessage = () => {
  //   if (!input.trim()) return;

  //   if (isFirst) setIsFirst(false);
  //   const userMsg = { role: "user", text: input };
  //   setMessages((prev) => [...prev, userMsg]);
  //   setInput("");
  //   setIsLoading(true);

  //   setTimeout(() => {
  //     const botMsg = { role: "bot", text: "Ini adalah respon AI (dummy)." };
  //     setMessages((prev) => [...prev, botMsg]);
  //     setIsLoading(false);
  //   }, 1500);
  // };
  const sendMessage = () => {
    if (!input.trim() || !socket) return;
    if (isFirst) setIsFirst(false);
    setIsLoading(true);
    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    // kirim ke Go melalui WS
    socket.send(input);

    setInput("");
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