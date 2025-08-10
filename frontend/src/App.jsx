import { useState, useEffect } from "react";
import "./App.css";
import { io } from "socket.io-client";
import Editor from "@monaco-editor/react";

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

  // Socket event listeners
  useEffect(() => {
    socket.on("userJoined", (users) => setUsers(users));

    socket.on("codeUpdate", (newCode) => {
      setCode(newCode);
    });

    socket.on("userTyping", (user) => {
      setTyping(`${user.slice(0, 8)} is typing...`);
      setTimeout(() => setTyping(""), 2000);
    });

    socket.on("languageUpdate", (newLanguage) => {
      setLanguage(newLanguage);
    });

    return () => {
      socket.off("userJoined");
      socket.off("codeUpdate");
      socket.off("userTyping");
      socket.off("languageUpdate");
    };
  }, []);

  // Handle tab close / refresh
  useEffect(() => {
    const handleBeforeUnload = () => {
      socket.emit("leaveRoom");
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      socket.emit("leaveRoom");
    };
  }, []);

  // Join a room
  const joinRoom = () => {
    if (roomId.trim() && userName.trim()) {
      socket.emit("join", { roomId, userName });
      setJoined(true);
    }
  };

  // Copy room ID
  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setCopySuccess("Copied!");
    setTimeout(() => setCopySuccess(""), 2000);
  };

  // Code editor change
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

  // Leave room
  const leaveRoom = () => {
    socket.emit("leaveRoom");
    setJoined(false);
    setUsers([]);
    setCode("");
  };

  // Join screen
  if (!joined) {
    return (
      <>
        <h1 className="absolute top-4 left-6 text-2xl font-bold text-white backdrop-blur-md bg-white/10 px-4 py-2 rounded-lg shadow-lg border border-white/20">
          Together Code
        </h1>

        <div className="join-container">
          <div className="join-form">
            <h1>Join code room</h1>
            <input
              type="text"
              placeholder="Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />
            <input
              type="text"
              placeholder="Your name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <button onClick={joinRoom}>Join Room</button>
          </div>
        </div>
      </>
    );
  }

  // Editor screen
  
    return (
  <>
    <div className="editor-container">
      {/* Sidebar */}
      <div className="sidebar relative flex flex-col justify-between h-full p-4">
        {/* Top section - Room Info */}
        <div className="room-info">
          <h2>Code Room: {roomId}</h2>
          <button onClick={copyRoomId} className="copy-button">
            Copy ID
          </button>
          {copySuccess && <span className="copy-success">{copySuccess}</span>}

          <h3>Users in Room:</h3>
          <ul>
            {users.map((user, index) => (
              <li key={index}>{user.slice(0, 8)}...</li>
            ))}
          </ul>
          <p className="typing-indicator">{typing}</p>

          <select
            className="language-selector"
            value={language}
            onChange={handleLanguageChange}
          >
            <option className="language-selector-items" value="javascript">
              JavaScript
            </option>
            <option className="language-selector-items" value="python">
              Python
            </option>
            <option className="language-selector-items" value="java">
              Java
            </option>
            <option className="language-selector-items" value="c++">
              C++
            </option>
          </select>
          <br />
          <button className="leave-button" onClick={leaveRoom}>
            Leave Room
          </button>
        </div>

        {/* Bottom section - Footer */}
        <div className="space-y-1 text-center">
          <h6 className="text-white/70 text-sm backdrop-blur-md bg-white/5 px-3 py-1 rounded-md border border-white/10 shadow-md">
            @togethercode
          </h6>
          <h6 className="text-white/50 text-xs">Made with ❤️ by Abhay</h6>
          <h6 className="text-white/50 text-xs">Version 1.0.0</h6>
          <h6 className="text-white/50 text-xs">© 2025</h6>
        </div>
      </div>

      {/* Code Editor */}
      <div className="editor-wrapper">
        <Editor
          height="100vh"
          defaultLanguage={language}
          language={language}
          value={code}
          onChange={handleCodeChange}
          theme="vs-dark"
          options={{
            fontSize: 14,
            minimap: { enabled: false },
          }}
        />
      </div>
    </div>
  </>
);

}

export default App;
