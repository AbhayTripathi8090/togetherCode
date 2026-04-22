const fallbackSocketServerUrl = "http://localhost:5000";

export const socketServerUrl =
  import.meta.env.VITE_SOCKET_SERVER_URL?.trim() || fallbackSocketServerUrl;
