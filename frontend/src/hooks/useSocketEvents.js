import { useEffect } from "react";

export default function useSocketEvents(socket, {
  setUsers, setCode, setTyping, setLanguage, setOutput
}) {
  useEffect(() => {
    socket.on("userJoined", (users) => setUsers(users));
    socket.on("codeUpdate", (newCode) => setCode(newCode));
    socket.on("userTyping", (user) => {
      setTyping(`${user.slice(0, 8)} is typing...`);
      setTimeout(() => setTyping(""), 2000);
    });
    socket.on("languageUpdate", (newLanguage) => setLanguage(newLanguage));
    socket.on("codeResponse", (response) => setOutput(response.run.output));
    socket.on("codeError", (err) => setOutput(`Error: ${err.message}`));

    return () => {
      socket.off("userJoined");
      socket.off("codeUpdate");
      socket.off("userTyping");
      socket.off("languageUpdate");
      socket.off("codeResponse");
      socket.off("codeError");
    };
  }, [socket, setUsers, setCode, setTyping, setLanguage, setOutput]);
}
