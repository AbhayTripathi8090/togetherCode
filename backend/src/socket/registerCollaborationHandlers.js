import { executeCode } from "../services/compilerService.js";
import {
  addUserToRoom,
  getRoomUsers,
  hasRoom,
  removeUserFromRoom,
} from "../store/roomStore.js";

function emitRoomUsers(io, roomId) {
  io.to(roomId).emit("userJoined", getRoomUsers(roomId));
}

export function registerCollaborationHandlers(io) {
  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    let currentRoomId = null;
    let currentUserName = null;

    const leaveCurrentRoom = () => {
      if (!currentRoomId || !currentUserName) {
        return;
      }

      removeUserFromRoom(currentRoomId, currentUserName);
      socket.leave(currentRoomId);
      emitRoomUsers(io, currentRoomId);

      currentRoomId = null;
      currentUserName = null;
    };

    socket.on("join", ({ roomId, userName }) => {
      if (!roomId?.trim() || !userName?.trim()) {
        return;
      }

      if (currentRoomId) {
        leaveCurrentRoom();
      }

      currentRoomId = roomId.trim();
      currentUserName = userName.trim();

      socket.join(currentRoomId);
      addUserToRoom(currentRoomId, currentUserName);
      emitRoomUsers(io, currentRoomId);

      console.log(`${currentUserName} joined room ${currentRoomId}`);
    });

    socket.on("codeChange", ({ roomId, code }) => {
      socket.to(roomId).emit("codeUpdate", code);
    });

    socket.on("typing", ({ roomId, userName }) => {
      socket.to(roomId).emit("userTyping", userName);
    });

    socket.on("languageChange", ({ roomId, language }) => {
      io.to(roomId).emit("languageUpdate", language);
    });

    socket.on("compileCode", async ({ code, roomId, language, version }) => {
      if (!hasRoom(roomId)) {
        return;
      }

      try {
        const executionResponse = await executeCode({
          code,
          language,
          version,
        });

        io.to(roomId).emit("codeResponse", executionResponse);
      } catch (error) {
        console.error(
          "Execution error:",
          error.response?.data || error.message,
        );

        io.to(roomId).emit("codeError", {
          message: error.response?.data?.message || "Execution failed",
        });
      }
    });

    socket.on("leaveRoom", () => {
      leaveCurrentRoom();
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
      leaveCurrentRoom();
    });
  });
}
