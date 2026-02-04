import React, { useRef, useEffect } from "react";
import { FiSend, FiPause, FiMic, FiHome, FiSettings, FiStar, FiAlignCenter, FiCode, FiScissors, FiPlay } from "react-icons/fi";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const InputAreaHome = ({ dark, input,
  sendMessage, setInput, isFirst,
  handleMic, listening, loading,
  isStopRef, isGenerate,
  setIsGenerate, streamBufferRef, isStreamDoneRef, valButtonSize, lang
}) => {
  const textareaRef = useRef(null);
  const autoCapitalizeFirst = (text) => {
    if (!text) return text;

    if (text.length === 1) {
      return text.toUpperCase();
    }

    return text;
  };

  const handleSendButton = () => {

    if (!isGenerate) {
      if (!input) return;

      let value = input.trim();
      if (!value) return;
      value = value.charAt(0).toUpperCase() + value.slice(1);

      isStopRef.current = false;
      setIsGenerate(true);
      streamBufferRef.current = "";
      isStreamDoneRef.current = false;
      sendMessage(value);

      setInput("");
      return;
    }

    streamBufferRef.current = "";
    isStopRef.current = true;
  };

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


  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [input]);

  return (
    isFirst || loading ?
      (
        <div className={isFirst || loading ? "opacity-0 pointer-events-none" : ""}>
          ...
        </div>
      ) :
      <div
        className={
          "flex items-center gap-3 bg-transparent h-fit"
        }
      >
        <div className="flex items-center justify-center w-full mt-4">
          <div
            className={
              (dark
                ? "bg-gray-900 border-gray-700"
                : "bg-gray-100 border-gray-300") +
              " p-2 flex items-center rounded-xl w-full"
            }
            style={{ maxWidth: "50%" }}
          >

            <div className="relative flex-auto" >
              <textarea
                ref={textareaRef}
                rows={1}
                className={
                  "overflow-y-hidden custom-scroll w-full resize-none px-4 py-5 pr-24 " +
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
                  const value = e.target.value;
                  setInput(autoCapitalizeFirst(value));
                  //setInput(e.target.value);
                  autoResize(e);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    let value = input.trim();
                    if (!value) return;
                    value = value.charAt(0).toUpperCase() + value.slice(1);

                    isStopRef.current = false;
                    setIsGenerate(true);
                    streamBufferRef.current = "";
                    isStreamDoneRef.current = false;
                    sendMessage(value);

                    setInput("");
                  }
                }}
              />



              <button
                onClick={handleMic}
                className={`
                absolute bottom-5 right-14
                p-2 rounded-full text-white shadow
                transition-all active:scale-95
                ${listening
                    ? "bg-red-500 animate-pulse"
                    : "bg-blue-600 hover:bg-blue-700"}
              `}
                title={listening ? "Stop recording" : "Voice input"}
              >
                <FiMic size={20} />
              </button>

              <button
                onClick={handleSendButton}
                className={`
                  absolute bottom-5 right-2
                  p-2 rounded-full
                  shadow
                  transition-all duration-200
                  active:scale-95 text-white
                    bg-blue-600 hover:bg-blue-700
              `}
              >
                {!isGenerate ? <FiSend size={18} /> : <FiPause size={18} />}
              </button>


            </div>

          </div>
        </div>
      </div>
  );

}

export default InputAreaHome;