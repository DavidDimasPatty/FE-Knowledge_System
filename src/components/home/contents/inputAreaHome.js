import React from "react";
const InputAreaHome = ({ dark, input, sendMessage, setInput }) => {
  return (<div className={dark ? "p-4 border-t border-gray-700 flex" : "p-4 border-t border-gray-300 flex"}>
    <input
      className={
        dark
          ? "flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white"
          : "flex-1 px-3 py-2 bg-white border border-gray-400 rounded"
      }
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      placeholder="Ketik pesan..."
    />
    <button
      onClick={sendMessage}
      className={"ml-3 px-4 py-2  text-white rounded " +
        (dark ? "bg-gray-700" : "bg-blue-400")}
    >
      Kirim
    </button>
  </div>
  )
}

export default InputAreaHome;