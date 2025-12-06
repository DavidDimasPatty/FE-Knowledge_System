import React from "react";
import { FiSend, FiMic, FiHome, FiSettings, FiStar, FiAlignCenter, FiCode, FiScissors } from "react-icons/fi";

const ChatAreaHome = ({ messages, isLoading, bottomRef, dark, isFirst, input, sendMessage, setInput }) => {
  return (isFirst ?
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
            " p-2  flex items-center gap-3 justify-center rounded-xl w-full max-w-[600px]"
          }
        >

          <button
            className={
              "p-3 rounded-full shadow flex items-center justify-center transition-all " +
              (dark
                ? "bg-gray-800 hover:bg-gray-700 text-white"
                : "bg-white hover:bg-gray-200 text-gray-700")
            }
          >
            <FiMic size={20} />
          </button>



          <textarea
            style={{ resize: "both", overflow: "auto" }}
            className={
              "custom-scroll flex-1 px-4 py-3 border rounded-lg outline-none transition-all overflow-auto resize-y " +
              (dark
                ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                : "bg-white border-gray-300 text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-400")
            }
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ketik pesan atau gunakan voice..."
          >{input}</textarea>

          <button
            onClick={() => {
              sendMessage();
              setInput("");
            }}
            className="p-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-all shadow"
          >
            <FiSend size={20} />
          </button>
        </div>

      </div>
    </div>

    :

    <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ maxHeight: "calc(100vh - 170px)" }}>
      {
        messages.map((msg, idx) => (
          <div key={idx} className={
            "w-full flex flex-col " +
            (msg.role === "user" ? "items-end" : "items-start")
          } >
            <div
              className={
                [
                  " max-w-[65%] break-words whitespace-pre-wrap text-sm leading-relaxed",
                  "px-4 py-3 rounded-2xl shadow-sm transition-transform transform",
                  msg.role === "user"
                    ? "bg-blue-600 text-white rounded-br-[8px] rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl hover:scale-[1.01]"
                    : (dark
                      ? "bg-gray-700 text-white hover:scale-[1.01]"
                      : "bg-gray-100 text-gray-900 hover:scale-[1.01]")
                ].join(" ")
              }
              style={{ wordBreak: "break-word" }}
            >
              {msg.text}
            </div>

          </div>
        ))
      }

      {isLoading && (
        <div className="text-left">
          <div className={dark ? "px-4 py-2 bg-gray-700 rounded-lg inline-block" : "px-4 py-2 bg-gray-300 rounded-lg inline-block"}>
            <span className="animate-pulse">•••</span>
          </div>
        </div>
      )}

      <div ref={bottomRef}></div>
    </div>

  )
}


export default ChatAreaHome;