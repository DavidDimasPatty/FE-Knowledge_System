import React, { useRef, useEffect, useState } from "react";
import { FiSend, FiMic, FiHome, FiSettings, FiStar, FiAlignCenter, FiCode, FiScissors } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
const ChatAreaHome = ({ messages, isLoading, bottomRef,
  dark, isFirst, input,
  sendMessage, setInput, handleMic,
  listening, setIsGenerate, streamBufferRef,
  isStreamDoneRef, isStopRef, valButtonSize, lang }) => {
  // const {
  //   transcript,
  //   listening,
  //   browserSupportsSpeechRecognition,
  //   resetTranscript,
  // } = useSpeechRecognition();
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Tooltip,
    Legend
  );
  const sizeText = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg"
  };

  const sizeTextUp = {
    small: "text-xl",
    medium: "text-2xl",
    large: "text-3xl"
  };

  const sizeTextDown = {
    small: "text-xs",
    medium: "text-sm",
    large: "text-base"
  };

  const thinkingTexts = [
    "AI is thinking…",
    "Analyzing your question…",
    "Generating best answer…",
    "Almost there…",
    "Reasoning deeply…",
  ];
  const DATATABLE_START = "```datatable";
  const DATATABLE_END = "```";
  const [thinkingText, setThinkingText] = useState(thinkingTexts[0]);
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

  function parseMessageSegments(message) {
    const segments = [];

    const BLOCKS = [
      { type: "datatable", segment: "table", loading: "table-loading" },
      { type: "chartjs", segment: "chartjs", loading: "chart-loading" },
      { type: "latex", segment: "latex", loading: "latex-loading" },
    ];

    let cursor = 0;

    while (cursor < message.length) {
      let found = null;

      for (const b of BLOCKS) {
        const idx = message.indexOf("```" + b.type, cursor);
        if (idx !== -1 && (!found || idx < found.start)) {
          found = { ...b, start: idx };
        }
      }

      // tidak ada block lagi → sisa text
      if (!found) {
        const tail = message.slice(cursor);
        if (tail.trim()) {
          segments.push({ type: "text", content: tail });
        }
        break;
      }

      // text sebelum block
      if (found.start > cursor) {
        segments.push({
          type: "text",
          content: message.slice(cursor, found.start),
        });
      }

      const blockStart = found.start + ("```" + found.type).length;
      const blockEnd = message.indexOf("```", blockStart);

      // block belum selesai (streaming)
      if (blockEnd === -1) {
        segments.push({ type: found.loading });
        break;
      }

      const raw = message.slice(blockStart, blockEnd).trim();

      try {
        const content =
          found.type === "latex" ? raw : JSON.parse(raw);

        segments.push({
          type: found.segment,
          content,
        });
      } catch {
        segments.push({ type: found.loading });
      }

      cursor = blockEnd + 3;
    }

    return segments;
  }

  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setThinkingText(
        thinkingTexts[Math.floor(Math.random() * thinkingTexts.length)]
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [isLoading]);
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

  return (messages.length === 0 && isFirst
    ?
    <div className={(dark
      ? " text-white"
      : " text-gray-900") + " flex flex-col items-center justify-center h-full"}>

      <div className={`flex items-center justify-center text-3xl ${sizeTextUp[valButtonSize] || "text-base"} `}>
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
                "leading-relaxed text-xl" +
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
                  if (input == "" || input == null) return
                  isStopRef.current = false;
                  setIsGenerate(true);
                  streamBufferRef.current = "";
                  isStreamDoneRef.current = false;
                  sendMessage();
                  setInput("");
                  return;
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
              onClick={handleMic}
              className={`
                             absolute bottom-3 right-14
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
                if (input == "" || input == null) return
                isStopRef.current = false;
                setIsGenerate(true);
                streamBufferRef.current = "";
                isStreamDoneRef.current = false;
                sendMessage();
                setInput("");
                return;
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

    <div className="flex items-center flex-col overflow-y-auto  m-5 custom-scroll" style={{ maxHeight: "calc(100vh - 170px)", overflow: "auto" }}>
      {
        messages.map((msg, idx) => (
          <div key={idx} className={
            "w-9/12 flex flex-col " +
            (msg.role === "user" ? "items-end" : "items-start")
          } >



            <div className={`flex w-full ${msg.role === "user" ? "justify-start space-y-1" : "justify-start"} gap-2 mt-3`}>

              {/* {msg.role != "user" &&
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
              } */}

              {msg.role == "user" &&
                <div className="flex items-center justify-center mr-1">
                  <div
                    // onClick={() => setOpenDropdown(!openDropDown)}
                    className={
                      "mb-2  w-10 h-10 rounded-full flex items-center justify-center font-bold cursor-pointer bg-gradient-to-r from-indigo-500 to-blue-500 text-white"
                    }
                  >
                    {localStorage.getItem("nama")?.charAt(0).toUpperCase()}
                  </div>
                </div>
              }

              <div className="flex-col w-full">
                {msg.role === "user" ? (
                  // <div className="flex justify-start ml-2 mt-4 ">
                  //   <span className={`text-xs font-medium text-gray-500 dark:text-gray-400 ${sizeTextDown[valButtonSize] || "text-base"}`}>
                  //     {localStorage.getItem("nama") ?? "Guest"}
                  //   </span>
                  // </div>
                  <></>
                ) : (
                  <div className="flex justify-start ml-10">
                    <span className={`text-base italic text-blue-600 dark:text-gray-400 ml-4 ${sizeTextDown[valButtonSize] || "text-base"}`}>
                      AI Ikodora
                    </span>
                  </div>
                )}
                <div
                  className={
                    [
                      "break-words whitespace-pre-wrap  leading-relaxed text-justify",
                      " py-3  transition-transform transform",
                      sizeText[valButtonSize] || "text-base",
                      msg.role === "user"
                        ? " w-4/5  rounded-br-[8px] rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl hover:scale-[1.01]  mr-auto mb-4"
                        : (dark
                          ? "ml-14 w-4/5 bg-gray-900 text-white hover:scale-[1.01] transition-all duration-200 ease-out will-change-contents"
                          : "ml-14 w-4/5 hover:scale-[1.01] transition-all duration-200 ease-out will-change-contents")
                    ].join(" ")
                  }
                  style={{ wordBreak: "break-word" }}
                >
                  {/* <ReactMarkdown
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
                  </ReactMarkdown> */}
                  {/* {parseMessageSegments(msg.text).map((seg, i) => {
                    if (seg.type === "text") {
                      return (
                        <ReactMarkdown
                          key={i}
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
                          {seg.content}
                        </ReactMarkdown>
                      );
                    }

                    if (seg.type === "table") {
                      return <DataTable key={i} table={seg.content} />;
                    }

                    if (seg.type === "table-loading") {
                      return <TableSkeleton key={i} dark={dark} />;
                    }

                    return null;
                  })} */}
                  {parseMessageSegments(msg.text).map((seg, i) => {
                    if (seg.type === "text") {
                      return (
                        <ReactMarkdown
                          key={i}
                          remarkPlugins={[remarkGfm]}
                        >
                          {seg.content}
                        </ReactMarkdown>
                      );
                    }

                    if (seg.type === "table") {
                      return <DataTable key={i} table={seg.content} dark={dark} />;
                    }

                    if (seg.type === "table-loading") {
                      return <TableSkeleton key={i} dark={dark} />;
                    }

                    if (seg.type === "chartjs") {
                      return <ChartBlock key={i} chart={seg.content} dark={dark} />;
                    }

                    if (seg.type === "chart-loading") {
                      return <ChartSkeleton key={i} />;
                    }

                    if (seg.type === "latex") {
                      return <LatexBlock key={i} latex={seg.content} />;
                    }

                    if (seg.type === "latex-loading") {
                      return <LatexSkeleton key={i} />;
                    }

                    return null;
                  })}
                </div>
                {msg.role != "user" &&
                  <div className="w-full border-b border-gray-300 mt-5" ></div>
                }
              </div>

              {/* {msg.role == "user" &&
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
              } */}

            </div>
          </div>
        ))
      }

      {isLoading && (
        <div className="flex justify-start mt-3">
          <div
            className={`
        px-4 py-3 rounded-2xl flex items-center gap-3
        shadow-sm
        ${dark ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-700"}
      `}
          >
            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-gray-500 animate-pulse [animation-delay:0ms]" />
              <span className="w-2 h-2 rounded-full bg-gray-500 animate-pulse [animation-delay:200ms]" />
              <span className="w-2 h-2 rounded-full bg-gray-500 animate-pulse [animation-delay:400ms]" />
            </div>

            <span className="text-xs opacity-80 transition-opacity duration-300">
              {thinkingText}
            </span>
          </div>
        </div>
      )}

      <div ref={bottomRef}></div>
    </div>

  )
}

function DataTable({ table, dark }) {
  return (
    <div className="my-4 overflow-x-auto">
      {table.title && (
        <div className={`mb-2 font-semibold text-sm dark:text-gray-300 ${dark ? " bg-gray-900" : ""}`}>
          {table.title}
        </div>
      )}

      <table className="min-w-full border border-gray-300 dark:border-gray-600 text-sm">
        <thead className="bg-blue-500">
          <tr>
            {table.columns.map((col, i) => (
              <th
                key={i}
                className={`px-3 py-2 border text-white font-medium ${dark ? " border-gray-500" : ""}`}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {table.data.map((row, i) => (
            <tr
              key={i}
              className={`odd:bg-gray-50 even:bg-gray-50 border ${dark ? "odd:bg-gray-500 even:bg-gray-500 border-gray-500" : ""}`}>
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="px-3 py-2"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TableSkeleton({ dark }) {
  return (
    <div
      className={`mt-4 w-4/5 rounded-xl border p-4 animate-pulse
        ${dark ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-300"}
      `}
    >

      <div className="h-4 w-1/3 mb-4 rounded bg-gray-400/50"></div>


      <div className="flex gap-2 mb-3">
        <div className="h-3 w-1/4 rounded bg-gray-400/40"></div>
        <div className="h-3 w-1/4 rounded bg-gray-400/40"></div>
      </div>


      {[1, 2, 3].map((_, i) => (
        <div key={i} className="flex gap-2 mb-2">
          <div className="h-3 w-1/4 rounded bg-gray-400/30"></div>
          <div className="h-3 w-1/4 rounded bg-gray-400/30"></div>
        </div>
      ))}

      <div className="mt-3 text-xs italic text-gray-500">
        AI sedang menyusun tabel…
      </div>
    </div>
  );
}

function ChartBlock({ chart, dark }) {
  const bluePalette = [
    "#2563eb",
    "#1d4ed8",
    "#3b82f6",
    "#60a5fa",
    "#93c5fd",
  ];

  function pickBlue() {
    return bluePalette[Math.floor(Math.random() * bluePalette.length)];
  }

  const primaryBlue = pickBlue();

  const data = {
    labels: chart.labels,
    datasets: [
      {
        label: chart.title,
        data: chart.values,
        borderColor: primaryBlue,
        backgroundColor:
          chart.type_of_chart === "pie"
            ? chart.values.map(() => primaryBlue + "AA")
            : primaryBlue + "90",
        tension: 0.8,
        fill: chart.type_of_chart === "line",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: dark ? "white" : "#111827",
        },
      },
      title: {
        display: true,
        text: chart.title,
        color: dark ? "white" : "#111827",
      },
    },
    scales: {
      x: {
        ticks: {
          color: dark ? "white" : "#374151",
        },
      },
      y: {
        ticks: {
          color: dark ? "white" : "#374151",
        },
      },
    },
  };

  return (
    <div className="my-6">
      {chart.title && (
        <div className={`mb-3 text-center font-semibold text-sm
                        ${dark ? "text-white" : " text-gray-700"}`}>
          {chart.title}
        </div>
      )}

      <div
        className={`mx-auto w-full max-w-3xl h-72
                   rounded-2xl border ${dark ? "bg-gray-500  border-gray-500" : "border-gray-300 bg-white"}
                   shadow-sm p-4
                   flex items-center justify-center`}
      >
        <div className="w-full h-full">
          {chart.type_of_chart === "line" && (
            <Line data={data} options={options} />
          )}
          {chart.type_of_chart === "bar" && (
            <Bar data={data} options={options} />
          )}
          {chart.type_of_chart === "pie" && (
            <Pie data={data} options={options} />
          )}
        </div>
      </div>
    </div>
  );
}

function ChartSkeleton({ dark }) {
  return (
    <div
      className={`mt-4 w-4/5 rounded-xl border p-4 animate-pulse
        ${dark ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-300"}
      `}
    >

      <div className="h-4 w-1/3 mb-4 rounded bg-gray-400/50"></div>

      <div
        className={`w-full h-48 rounded-lg
          ${dark ? "bg-gray-600/50" : "bg-gray-300/50"}
        `}
      ></div>

      <div className="mt-3 text-xs italic text-gray-500">
        AI sedang menyusun chart…
      </div>
    </div>
  );
}

function LatexBlock({ latex }) {
  return (
    <div className="my-4 overflow-x-auto">
      <BlockMath math={latex} />
    </div>
  );
}

function LatexSkeleton({ dark }) {
  return (
    <div
      className={`mt-4 w-3/5 rounded-xl border p-4 animate-pulse
        ${dark ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-300"}
      `}
    >

      <div
        className={`h-6 w-full rounded
          ${dark ? "bg-gray-600/50" : "bg-gray-300/50"}
        `}
      ></div>

      <div className="mt-3 text-xs italic text-gray-500">
        AI sedang menyusun rumus…
      </div>
    </div>
  );
}
export default ChatAreaHome;