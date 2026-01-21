import React, { useRef } from "react";
import { FiSend, FiMic, FiHome, FiSettings, FiStar, FiAlignCenter, FiCode, FiScissors } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
const ChatAreaHome = ({ messages, isLoading, bottomRef, dark, isFirst, input, sendMessage, setInput }) => {
  const textareaRef = useRef(null);

  const autoResize = (e) => {
    const el = e.target;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };

  const resetHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };
  return (messages.length === 0 && isFirst
    ?
    <div className={(dark
      ? " text-white"
      : " text-gray-900") + " flex flex-col items-center justify-center h-full"}>

      <div className="flex items-center justify-center text-3xl">
        Pertanyaan Apa Hari Ini?
      </div>

      <div className="flex items-center justify-center w-full mt-4">
        <div
          className={
            (dark
              ? "bg-gray-900 border-gray-700"
              : "bg-gray-100 border-gray-300") +
            " p-2 flex items-center rounded-xl w-full max-w-[600px]"
          }

        >

          <div className="relative flex-1" >
            <textarea
              ref={textareaRef}
              rows={1}
              className={
                "overflow-y-hidden custom-scroll w-full resize-none px-4 py-3 pr-24 " +
                "leading-relaxed text-sm " +
                "border rounded-2xl outline-none transition-all duration-200 " +
                "focus:shadow-md focus:scale-[1.01] " +
                (dark
                  ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                  : "bg-white border-gray-300 text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-400")
              }
              style={{
                boxShadow: "0 0px 20px rgba(0,0,0,0.2)",
                zIndex: 50,
              }}
              placeholder="Ketik pesan atau gunakan voice..."
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                autoResize(e);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (input.trim()) {
                    sendMessage();
                    setInput("");
                    resetHeight();
                  }
                }
              }}
            />

            {/* <button
              className={
                "p-3 rounded-full shadow flex items-center justify-center transition-all " +
                (dark
                  ? "bg-gray-800 hover:bg-gray-700 text-white"
                  : "bg-white hover:bg-gray-200 text-gray-700")
              }
            >
              <FiMic size={20} />
            </button> */}

            <button
              onClick={() => {
                sendMessage();
                setInput("");
              }}
              className="
          absolute bottom-3 right-14
          p-2 rounded-full
          bg-blue-600 hover:bg-blue-700
          text-white shadow
          transition-all
          active:scale-95
        "
            >
              <FiMic size={20} />
            </button>

            <button
              onClick={() => {
                sendMessage();
                setInput("");
              }}
              className="
          absolute bottom-3 right-2
          p-2 rounded-full
          bg-blue-600 hover:bg-blue-700
          text-white shadow
          transition-all
          active:scale-95
        "
            >
              <FiSend size={18} />
            </button>


          </div>

        </div>
      </div>
    </div>

    :

    <div className="flex-1 overflow-y-auto p-4 space-y-4 m-5" style={{ maxHeight: "calc(100vh - 170px)",overflow:"auto" }}>
      {
        messages.map((msg, idx) => (
          <div key={idx} className={
            "w-full flex flex-col " +
            (msg.role === "user" ? "items-end" : "items-start")
          } >



            <div className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"} gap-2`}>

              {msg.role != "user" &&
                <div className="flex items-center">
                  <div
                    // onClick={() => setOpenDropdown(!openDropDown)}
                    className={
                      "w-10 h-10 rounded-full flex items-center justify-center font-bold cursor-pointer bg-gradient-to-r from-indigo-500 to-blue-500 text-white"
                    }
                  >
                    AI
                  </div>
                </div>
              }

              <div className="flex-col w-full">
                {msg.role === "user" ? (
                  <div className="flex justify-end mr-3 mb-1">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      {localStorage.getItem("nama") ?? "Guest"}
                    </span>
                  </div>
                ) : (
                  <div className="flex justify-start ml-3 mb-1">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      AI Ikodora
                    </span>
                  </div>
                )}
                <div
                  className={
                    [
                      " w-fit max-w-[65%] break-words whitespace-pre-wrap text-sm leading-relaxed text-justify",
                      "px-4 py-3 rounded-2xl shadow-sm transition-transform transform",
                      msg.role === "user"
                        ? "bg-blue-600 text-white rounded-br-[8px] rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl hover:scale-[1.01]  ml-auto"
                        : (dark
                          ? "bg-gray-700 text-white hover:scale-[1.01]"
                          : "bg-indigo-100 text-indigo-900 rounded-bl-[8px] hover:scale-[1.01]  mr-auto")
                    ].join(" ")
                  }
                  style={{ wordBreak: "break-word" }}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      strong: ({ children }) => (
                        <strong className="font-semibold">{children}</strong>
                      ),
                      em: ({ children }) => (
                        <em className="italic">{children}</em>
                      ),
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                </div>
              </div>

              {msg.role == "user" &&
                <div className="flex items-center justify-center mt-5">
                  <div
                    // onClick={() => setOpenDropdown(!openDropDown)}
                    className={
                      "w-10 h-10 rounded-full flex items-center justify-center font-bold cursor-pointer bg-gradient-to-r from-indigo-500 to-blue-500 text-white"
                    }
                  >
                    {localStorage.getItem("nama")?.charAt(0).toUpperCase()}
                  </div>
                </div>
              }

            </div>
          </div>
        ))
      }

      {isLoading && (
        <div className="text-left">
          <div className={`px-4 py-2 rounded-2xl inline-flex items-center gap-2
    ${dark ? "bg-gray-700 text-gray-300" : "bg-gray-300 text-gray-700"}`}>

            <div className="flex space-x-1">
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></span>
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-300"></span>
            </div>

            <span className="text-xs">AI is thinking</span>
          </div>
        </div>
      )}

      <div ref={bottomRef}></div>
    </div>

  )
}


export default ChatAreaHome;