export default function JoinRoom({ roomId, setRoomId, userName, setUserName, joinRoom }) {
  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-blue-900 to-indigo-900 text-white">
      <div className="w-80 rounded-2xl border border-blue-400/20 bg-white/5 p-8 text-center shadow-lg backdrop-blur-lg">
        <h1 className="mb-5 text-2xl font-bold">Join code room</h1>
        <input
          type="text"
          placeholder="Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="mb-4 w-full rounded-lg border border-blue-400/30 bg-blue-400/10 p-3 text-white placeholder-blue-200 outline-none transition-all duration-300 focus:border-blue-400/60"
        />
        <input
          type="text"
          placeholder="Your name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="mb-6 w-full rounded-lg border border-blue-400/30 bg-blue-400/10 p-3 text-white placeholder-blue-200 outline-none transition-all duration-300 focus:border-blue-400/60"
        />
        <button
          onClick={joinRoom}
          className="w-full rounded-lg border border-blue-500/50 bg-blue-500/20 p-3 text-sm text-white shadow-md transition-all duration-300 hover:bg-blue-500/40 active:scale-95"
        >
          Join Room
        </button>
      </div>
    </div>
  );
}