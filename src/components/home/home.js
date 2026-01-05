import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
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
  const [idCategory, setIdCategory] = useState(0);
  const [idTopic, setIdTopic] = useState(0);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const urlTopic = searchParams.get("topic");
  const urlCategory = searchParams.get("category");
  const [isFirst, setIsFirst] = useState(!urlTopic);
  const [isInitLoaded, setIsInitLoaded] = useState(false);

  useEffect(() => {
    if (urlTopic && urlCategory) {
      setIdTopic(Number(urlTopic));
      setIdCategory(Number(urlCategory));
      setIsFirst(false);

      loadHistory(urlTopic, urlCategory);
    } else {
      setIsFirst(true);
      setIsInitLoaded(true);
      setMessages([]);
      console.log("masuk")
    }
  }, [urlTopic, urlCategory]);


  const loadHistory = async (topic, category) => {
    try {
      const username = localStorage.getItem("username");
      setIsLoading(true);
      const res = await fetch(
        `http://localhost:8080/?topic=${topic}&category=${category}&username=${username}`
      );
      const data = await res.json();
      console.log(data)
      console.log(data.data.user)
      console.log(data.data.bot)
      const formatted = [];

      const users = data.data.user || [];
      const bots = data.data.bot || [];

      const maxLen = Math.max(users.length, bots.length);

      for (let i = 0; i < maxLen; i++) {
        if (users[i]) {
          formatted.push({
            role: users[i].Role.toLowerCase(),
            text: users[i].Isi,
          });
        }

        if (bots[i]) {
          formatted.push({
            role: bots[i].Role.toLowerCase(),
            text: bots[i].Isi,
          });
        }
      }

      setMessages(formatted);
    } catch (err) {
      console.error("Load history error:", err);
    } finally {
      setIsLoading(false);
      setIsInitLoaded(true);
    }
  };


  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);


  useEffect(() => {
    if (!isInitLoaded) return;
    const username = localStorage.getItem("username");
    const query = new URLSearchParams({
      userId: username,
      username: username,
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
        if (isFirst && data.topic_id && data.category_id) {
          navigate(
            `?topic=${data.topic_id}&category=${data.category_id}`,
            { replace: true }
          );

          setIdTopic(data.topic_id);
          setIdCategory(data.category_id);
          setIsFirst(false);
          window.dispatchEvent(
            new CustomEvent("topic-updated", {
              detail: {
                topicId: data.topic_id,
                categoryId: data.category_id,
              },
            })
          );
          window.dispatchEvent(
            new CustomEvent("category-updated", {
              detail: {
                categoryId: data.category_id,
              },
            })
          );
        }
        setIsLoading(false);
      } catch (err) {
        console.error("Invalid JSON from server:", msg.data);
      }
    }


    ws.onerror = (err) => console.error("WS Error:", err);
    ws.onclose = () => console.log("WS closed");

    setSocket(ws);

    return () => ws.close();
  }, [isInitLoaded]);


  const sendMessage = () => {
    if (!input.trim() || !socket) return;
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.warn("WS not ready");
      return;
    }
    if (isFirst) setIsFirst(false);
    const username = localStorage.getItem("username");
    console.log("masukkk")
    setIsLoading(true);
    const userMsg = { role: "user", text: input, username: username };
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