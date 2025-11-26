import React from "react";
import { FiSend, FiMic, FiHome, FiSettings, FiStar, FiAlignCenter, FiCode, FiScissors } from "react-icons/fi";


const InputAreaHome = ({ dark, input, sendMessage, setInput, isFirst }) => {
  return (
    isFirst ? null :
      <div
        className={
          (dark
            ? "bg-gray-900 border-gray-700"
            : "bg-gray-100 border-gray-300") +
          " p-4 border-t flex items-center gap-3"
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
          style={{resize:"both",overflow:"auto"}}
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
          onClick={sendMessage}
          className="p-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-all shadow"
        >
          <FiSend size={20} />
        </button>
      </div>
  );
}

export default InputAreaHome;