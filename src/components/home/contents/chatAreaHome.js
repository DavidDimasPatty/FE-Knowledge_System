import React from "react";
const ChatAreaHome = ({messages,isLoading,bottomRef,dark}) => 
  {
    return (        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={msg.role === "user" ? "text-right" : "text-left"}
            >
              <div
                className={
                  msg.role === "user"
                    ? "inline-block px-4 py-2 bg-blue-600 text-white rounded-lg"
                    : dark
                    ? "inline-block px-4 py-2 bg-gray-700 text-white rounded-lg"
                    : "inline-block px-4 py-2 bg-gray-300 text-black rounded-lg"
                }
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="text-left">
              <div className={dark ? "px-4 py-2 bg-gray-700 rounded-lg inline-block" : "px-4 py-2 bg-gray-300 rounded-lg inline-block"}>
                <span className="animate-pulse">•••</span>
              </div>
            </div>
          )}

          <div ref={bottomRef}></div>
        </div>)
}


export default ChatAreaHome;