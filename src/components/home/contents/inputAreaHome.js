import React, { useRef, useEffect } from "react";
import { FiSend, FiMic, FiHome, FiSettings, FiStar, FiAlignCenter, FiCode, FiScissors } from "react-icons/fi";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const InputAreaHome = ({ dark, input, sendMessage, setInput, isFirst, handleMic, listening, loading }) => {
  // const {
  //   transcript,
  //   listening,
  //   browserSupportsSpeechRecognition,
  //   resetTranscript,
  // } = useSpeechRecognition();
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


  // const handleMic = () => {
  //   if (!browserSupportsSpeechRecognition) {
  //     alert("Browser tidak support voice input");
  //     return;
  //   }

  //   if (!listening) {
  //     resetTranscript();
  //     SpeechRecognition.startListening({
  //       language: "id-ID",
  //       continuous: false,
  //     });
  //   } else {
  //     SpeechRecognition.stopListening();
  //   }
  // };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [input]);

  return (
    isFirst || loading ? null :
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
                onClick={() => {
                  sendMessage();
                  setInput("");
                }}
                className="
                  absolute bottom-5 right-2
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
  );

}

export default InputAreaHome;