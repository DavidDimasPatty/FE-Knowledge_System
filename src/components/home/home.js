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
  const [idCategory, setIdCategory] = useState(0);
  const [idTopic, setIdTopic] = useState(0);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);


  useEffect(() => {
    const username = localStorage.getItem("username");
    const query = new URLSearchParams({
      userId: username,
      idCategory: idCategory === 0 ? "" : idCategory,
      topic: idTopic === 0 ? "" : idTopic,
    });

    const ws = new WebSocket("ws://localhost:8080/ws?" + query.toString());

    ws.onopen = () => console.log("WS Connected");

    ws.onmessage = (msg) => {
      try {
        const data = JSON.parse(msg.data);
        const botMessage = {
          role: "bot",
          text: data.answer,
        };
        setMessages((prev) => [...prev, botMessage]);
        setIsLoading(false);
      } catch (err) {
        console.error("Invalid JSON from server:", msg.data);
      }
    }
    ws.onerror = (err) => console.error("WS Error:", err);
    ws.onclose = () => console.log("WS closed");

    setSocket(ws);

    return () => ws.close();
  }, []);


  const sendMessage = () => {
    if (!input.trim() || !socket) return;
    if (isFirst) setIsFirst(false);
    setIsLoading(true);
    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
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