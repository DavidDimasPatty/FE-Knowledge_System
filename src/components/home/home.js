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
  const isFirstRef = useRef(!urlTopic);
  const [isInitLoaded, setIsInitLoaded] = useState(false);

  useEffect(() => {
    if (urlTopic && urlCategory) {
      setIdTopic(Number(urlTopic));
      setIdCategory(Number(urlCategory));
      isFirstRef.current = false;

      loadHistory(urlTopic, urlCategory);
    } else {
      isFirstRef.current = true;
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
    const roleName = localStorage.getItem("roleName") ?? "guest";
    const query = new URLSearchParams({
      userId: username,
      username: username,
      role: roleName
      // idCategory: idCategory === 0 ? "" : idCategory,
      // topic: idTopic === 0 ? "" : idTopic,
      // isFirst:isFirstRef.current
    });

    const ws = new WebSocket("ws://localhost:8080/ws?" + query.toString());

    ws.onopen = () => console.log("WS Connected");

    // ws.onmessage = (msg) => {
    //   try {
    //     const data = JSON.parse(msg.data);
    //     console.log(data)
    //     const botMessage = {
    //       role: "bot",
    //       text: data.answer,
    //     };
    //     setMessages((prev) => [...prev, botMessage]);
    //     if (isFirstRef.current && data.topic_id && data.category_id) {
    //       navigate(
    //         `?topic=${data.topic_id}&category=${data.category_id}`,
    //         { replace: true }
    //       );

    //       setIdTopic(data.topic_id);
    //       setIdCategory(data.category_id);
    //       //setIsFirst(false);
    //       isFirstRef.current = false;
    //       window.dispatchEvent(
    //         new CustomEvent("topic-updated", {
    //           detail: {
    //             topicId: data.topic_id,
    //             categoryId: data.category_id,
    //           },
    //         })
    //       );
    //       window.dispatchEvent(
    //         new CustomEvent("category-updated", {
    //           detail: {
    //             categoryId: data.category_id,
    //           },
    //         })
    //       );
    //     }
    //     setIsLoading(false);
    //   } catch (err) {
    //     console.error("Invalid JSON from server:", msg.data);
    //   }
    // }
    ws.onmessage = (msg) => {
      try {
        const data = JSON.parse(msg.data);
        console.log("WS:", data);

        // === STREAM TOKEN ===
        if (data.type === "chunk") {
          setMessages((prev) => {
            const last = prev[prev.length - 1];

            // kalau belum ada bot message → buat
            if (!last || last.role !== "bot" || last.isStreaming !== true) {
              return [
                ...prev,
                {
                  role: "bot",
                  text: data.content,
                  isStreaming: true,
                },
              ];
            }

            // append ke message terakhir
            const updated = [...prev];
            updated[updated.length - 1] = {
              ...last,
              text: last.text + data.content,
            };

            return updated;
          });
          return;
        }

        // === STREAM SELESAI ===
        if (data.type === "done") {
          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];

            if (last?.role === "bot") {
              updated[updated.length - 1] = {
                ...last,
                isStreaming: false,
              };
            }
            return updated;
          });

          // topic & category hanya di first message
          if (
            isFirstRef.current &&
            data.topic_id &&
            data.category_id
          ) {
            navigate(
              `?topic=${data.topic_id}&category=${data.category_id}`,
              { replace: true }
            );

            setIdTopic(data.topic_id);
            setIdCategory(data.category_id);
            isFirstRef.current = false;

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
          return;
        }

        // === ERROR ===
        if (data.error) {
          setMessages((prev) => [
            ...prev,
            { role: "bot", text: "❌ " + data.error },
          ]);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Invalid JSON from server:", msg.data);
      }
    };


    ws.onerror = (err) => console.error("WS Error:", err);
    ws.onclose = () => console.log("WS closed");

    setSocket(ws);

    return () => ws.close();
  }, [isInitLoaded]);


  // const sendMessage = () => {
  //   if (!input.trim() || !socket) return;
  //   if (!socket || socket.readyState !== WebSocket.OPEN) {
  //     console.warn("WS not ready");
  //     return;
  //   }
  //   //isFirstRef.current = false;
  //   const username = localStorage.getItem("username");
  //   console.log("masukkk")
  //   setIsLoading(true);
  //   const userMsg = {
  //     role: "user", text: input, username: username, isFirst: isFirstRef.current, idCategory: idCategory === 0 ? null : idCategory,
  //     topic: idTopic === 0 ? null : idTopic,
  //   };
  //   setMessages((prev) => [...prev, userMsg]);
  //   socket.send(JSON.stringify(userMsg));
  //   setInput("");
  // };

  const sendMessage = () => {
    if (!input.trim()) return;
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.warn("WS not ready");
      return;
    }

    setIsLoading(true);

    setMessages((prev) => [
      ...prev,
      { role: "user", text: input },
    ]);

    socket.send(
      JSON.stringify({
        text: input,
        isFirst: isFirstRef.current,
        idCategory: idCategory || 0,
        topic: idTopic || 0,
      })
    );

    setInput("");
  };

  return (

    <div className="flex-auto flex flex-col wrapperChat">
      <ChatAreaHome
        messages={messages}
        isLoading={isLoading}
        bottomRef={bottomRef}
        dark={dark}
        isFirst={isFirstRef.current}
        input={input}
        setInput={setInput}
        sendMessage={sendMessage}
      />

      <InputAreaHome
        input={input}
        setInput={setInput}
        sendMessage={sendMessage}
        dark={dark}
        isFirst={isFirstRef.current}
      />
    </div>

  );
}

export default Home;