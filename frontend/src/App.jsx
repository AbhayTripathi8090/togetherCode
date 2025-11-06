import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./App.css";

import useSocketEvents from "./hooks/useSocketEvents";
import JoinRoom from "./components/JoinRoom";
import Sidebar from "./components/Sidebar";
import CodeEditor from "./components/CodeEditor";
import OutputConsole from "./components/OutputConsole";

const socket = io("https://togethercode.onrender.com");

function App() {
  const [joined, setJoined] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [copySuccess, setCopySuccess] = useState("");
  const [users, setUsers] = useState([]);
  const [typing, setTyping] = useState("");
  const [output, setOutput] = useState("");
  const [Version] = useState("*");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useSocketEvents(socket, { setUsers, setCode, setTyping, setLanguage, setOutput });

  useEffect(() => {
    const handleBeforeUnload = () => socket.emit("leaveRoom");
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      socket.emit("leaveRoom");
    };
  }, []);

  const joinRoom = () => {
    if (roomId.trim() && userName.trim()) {
      socket.emit("join", { roomId, userName });
      setJoined(true);
    }
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setCopySuccess("Copied!");
    setTimeout(() => setCopySuccess(""), 2000);
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    socket.emit("codeChange", { roomId, code: newCode });
    socket.emit("typing", { roomId, userName });
  };

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    socket.emit("languageChange", { roomId, language: newLanguage });
  };

  const runCode = () => {
    socket.emit("compileCode", { code, roomId, language, version: Version });
  };

  const leaveRoom = () => {
    socket.emit("leaveRoom");
    setJoined(false);
    setUsers([]);
    setCode("");
  };

  if (!joined) {
    return <JoinRoom {...{ roomId, setRoomId, userName, setUserName, joinRoom }} />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-blue-900 to-indigo-900 text-white">
      <Sidebar
        {...{
          sidebarOpen, setSidebarOpen, roomId, copyRoomId, copySuccess,
          users, typing, language, handleLanguageChange, leaveRoom
        }}
      />

      <button
        onClick={() => setSidebarOpen(true)}
        className={`fixed left-4 top-4 z-50 rounded-lg border border-blue-400/50 bg-blue-400/20 px-3 py-2 text-lg text-white shadow-lg backdrop-blur-lg transition-all duration-300 hover:bg-blue-400/40 ${
          sidebarOpen ? "hidden" : "block"
        }`}
      >
        →
      </button>

      <div className={`flex flex-1 flex-col transition-all duration-300 ease-in-out`}>
        <CodeEditor {...{ language, code, handleCodeChange }} />
        <OutputConsole {...{ output, runCode }} />
      </div>
    </div>
  );
}

export default App;