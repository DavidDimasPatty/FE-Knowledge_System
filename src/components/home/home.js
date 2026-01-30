import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import './style/home.css';
import ChatAreaHome from "./contents/chatAreaHome";
import InputAreaHome from "./contents/inputAreaHome";
import { useOutletContext } from "react-router-dom";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
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
  const streamBufferRef = useRef("");
  const streamIntervalRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isGenerate, setIsGenerate] = useState(false);
  const {
    transcript,
    listening,
    browserSupportsSpeechRecognition,
    resetTranscript,
  } = useSpeechRecognition();

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
        setIsLoading(false);

        if (isFirstRef.current) {
          isFirstRef.current = false;
        }

        if (data.type === "chunk") {
          streamBufferRef.current += data.content;
          return;
        }

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

            setIsGenerate(false)
            return updated;
          });

          streamBufferRef.current = "";
          // topic & category hanya di first message
          if (
            isFirstRef.current &&
            data.topic_id &&
            data.category_id
          ) {
            // navigate(
            //   `?topic=${data.topic_id}&category=${data.category_id}`,
            //   { replace: true }
            // );

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

  useEffect(() => {
    streamIntervalRef.current = window.setInterval(() => {
      if (!isLoading && isPaused) return;
      if (!streamBufferRef.current.length) return;

      const nextChar = streamBufferRef.current[0];
      streamBufferRef.current = streamBufferRef.current.slice(1);

      setMessages((prev) => {
        const last = prev[prev.length - 1];

        if (!last || last.role !== "bot" || !last.isStreaming) {
          return [
            ...prev,
            {
              role: "bot",
              text: nextChar,
              isStreaming: true,
            },
          ];
        }

        const updated = [...prev];
        updated[updated.length - 1] = {
          ...last,
          text: last.text + nextChar,
        };

        return updated;
      });
    }, 8);

    return () => {
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
      }
    };
  }, [isPaused]);

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
    // if (!socket || socket.readyState !== WebSocket.OPEN) {
    //   console.warn("WS not ready");
    //   return;
    // }

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

  const handleMic = () => {
    if (!browserSupportsSpeechRecognition) {
      alert("Browser tidak support voice input");
      return;
    }

    if (!listening) {
      resetTranscript();
      SpeechRecognition.startListening({
        language: "id-ID",
        continuous: false,
      });
    } else {
      SpeechRecognition.stopListening();
    }
  };

  useEffect(() => {
    if (!listening && transcript.trim()) {
      setInput((prev) =>
        prev ? prev + " " + transcript : transcript
      );
    }
  }, [listening]);

  return (

    <div className="h-full flex-auto flex flex-col wrapperChat">
      <ChatAreaHome
        messages={messages}
        isLoading={isLoading}
        bottomRef={bottomRef}
        dark={dark}
        isFirst={isFirstRef.current}
        input={input}
        setInput={setInput}
        sendMessage={sendMessage}
        handleMic={handleMic}
        listening={listening}
        setIsGenerate={setIsGenerate}
      />

      <InputAreaHome
        input={input}
        setInput={setInput}
        sendMessage={sendMessage}
        dark={dark}
        isFirst={isFirstRef.current}
        handleMic={handleMic}
        listening={listening}
        loading={isLoading}
        isPaused={isPaused}
        setIsPaused={setIsPaused}
        isGenerate={isGenerate}
        setIsGenerate={setIsGenerate}
      />
    </div>

  );
}

export default Home;