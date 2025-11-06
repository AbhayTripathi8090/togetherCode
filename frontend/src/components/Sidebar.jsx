// export default function Sidebar({
//   sidebarOpen, setSidebarOpen, roomId, copyRoomId, copySuccess,
//   users, typing, language, handleLanguageChange, leaveRoom
// }) {
//   return (
//     <div
//       className={`relative flex h-full flex-col justify-between overflow-hidden border-r border-blue-400/10 bg-blue-400/5 p-4 text-white shadow-lg backdrop-blur-lg transition-all duration-300 ease-in-out ${
//         sidebarOpen ? "w-64 min-w-64" : "w-0 min-w-0 p-0"
//       }`}
//     >
//       <div className="flex-1 space-y-4">
//         <button
//           className="rounded-md border border-blue-400/30 bg-blue-400/20 px-3 py-1 font-bold text-white shadow-md transition-colors duration-300 hover:bg-blue-400/40"
//           onClick={() => setSidebarOpen(false)}
//         >
//           ←
//         </button>
        
//         <div className="space-y-2">
//           <h2 className="text-xl font-bold">Code Room: {roomId}</h2>
//           <button
//             onClick={copyRoomId}
//             className="rounded-md border border-green-400/50 bg-green-400/20 px-3 py-1 text-sm font-semibold text-green-400 transition-all duration-300 hover:bg-green-400/30 active:scale-95"
//           >
//             Copy ID
//           </button>
//           {copySuccess && <span className="ml-2 text-xs text-green-400">{copySuccess}</span>}
//         </div>

//         <div>
//           <h3 className="mb-2 text-sm font-semibold">Users in Room:</h3>
//           <ul className="space-y-1">
//             {users.map((user, index) => (
//               <li key={index} className="rounded-md bg-blue-400/10 px-2 py-1 text-sm">
//                 {user.slice(0, 8)}...
//               </li>
//             ))}
//           </ul>
//           <p className="mt-2 text-xs text-white/60">{typing}</p>
//         </div>

//         <select
//           className="w-full rounded-lg border border-blue-400/30 bg-blue-400/10 p-2 text-sm text-white outline-none transition-all duration-300 focus:border-blue-400/60"
//           value={language}
//           onChange={handleLanguageChange}
//         >
//           <option value="javascript" className="bg-gray-800">JavaScript</option>
//           <option value="python" className="bg-gray-800">Python</option>
//           <option value="java" className="bg-gray-800">Java</option>
//           <option value="c++" className="bg-gray-800">C++</option>
//         </select>
        
//         <button
//           className="w-full rounded-md border border-red-500/50 bg-red-500/20 px-2 py-2 text-white shadow-md transition-all duration-300 hover:bg-red-500/40 active:scale-95"
//           onClick={leaveRoom}
//         >
//           Leave Room
//         </button>
//       </div>
      
//       <div className="text-center text-sm">
//         <h6 className="text-white/70">@togethercode</h6>
//         <h6 className="text-white/50 text-xs">Made with ❤️ by Abhay</h6>
//         <h6 className="text-white/50 text-xs">Version 1.0.0</h6>
//         <h6 className="text-white/50 text-xs">© 2025</h6>
//       </div>
//     </div>
//   );
// }

export default function Sidebar({
  sidebarOpen, setSidebarOpen, roomId, copyRoomId, copySuccess,
  users, typing, language, handleLanguageChange, leaveRoom
}) {
  return (
    <div
      // Use standard text-sm for better default readability and slightly adjust colors for contrast
      className={`relative flex h-full flex-col justify-between overflow-hidden border-r border-blue-400/20 bg-gray-900 text-sm text-white shadow-xl backdrop-blur-md transition-all duration-300 ease-in-out ${
        sidebarOpen ? "w-64 min-w-64 p-4" : "w-0 min-w-0 p-0" // Add p-4 back when open
      }`}
    >
      {/* Conditionally render content to ensure nothing is visible when collapsed */}
      {sidebarOpen && (
        <>
          <div className="flex-1 space-y-6"> {/* Increased vertical space */}
            <button
              className="rounded-full border border-blue-400/40 bg-blue-400/20 p-2 font-bold text-white shadow-md transition-colors duration-300 hover:bg-blue-400/30 active:scale-95"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="space-y-2">
              <h2 className="text-lg font-bold truncate">Code Room: {roomId}</h2> {/* Truncate long IDs */}
              <button
                onClick={copyRoomId}
                className="flex items-center space-x-1 rounded-md border border-green-400/50 bg-green-400/20 px-3 py-1 text-xs font-semibold text-green-400 transition-all duration-300 hover:bg-green-400/30 active:scale-95"
              >
                <span>Copy ID</span>
                {/* SVG for copy icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7v4a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1h3a1 1 0 011 1zm0 0l3 3m-3-3l3-3m5 5v4a1 1 0 01-1 1h-3a1 1 0 01-1-1v-4a1 1 0 011-1h3a1 1 0 011 1z" />
                </svg>
              </button>
              {copySuccess && <span className="ml-2 text-xs text-green-400 animate-pulse">{copySuccess}</span>}
            </div>

            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-blue-300">Users in Room:</h3>
              <ul className="space-y-1 max-h-40 overflow-y-auto pr-1"> {/* Added max height and scroll */}
                {/* Use 'user' as key if it's guaranteed unique (like a socket ID), otherwise use index as fallback (better than not using one) */}
                {users.map((user) => (
                  <li key={user} className="rounded-md bg-blue-400/10 px-2 py-1 text-xs truncate" title={user}>
                    {user} {/* Display the full ID, let truncate/title handle it */}
                  </li>
                ))}
              </ul>
              {/* Only show typing if there is a message */}
              {typing && <p className="mt-2 text-xs italic text-white/70">{typing}</p>} 
            </div>

            <div className="pt-2"> {/* Added padding top */}
              <label htmlFor="language-select" className="block mb-1 text-xs font-semibold uppercase tracking-wider text-blue-300">Language:</label>
              <select
                id="language-select"
                className="w-full appearance-none rounded-lg border border-blue-400/30 bg-gray-800 p-2 text-xs text-white outline-none transition-all duration-300 focus:border-blue-400/60 cursor-pointer"
                value={language}
                onChange={handleLanguageChange}
              >
                {/* The options are fine, but ensure they have unique values if not already */}
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="c++">C++</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="markdown">Markdown</option>
              </select>
            </div>
            
            <button
              className="w-full rounded-md border border-red-500/50 bg-red-500/20 px-2 py-2 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-red-500/40 active:scale-95 mt-4"
              onClick={leaveRoom}
            >
              Leave Room
            </button>
          </div>
          
          <div className="text-center text-xs space-y-1 border-t border-blue-400/10 pt-4"> {/* Footer with separator and spacing */}
            <h6 className="text-white/70">@togethercode</h6>
            <h6 className="text-white/50">Made with ❤️ by Abhay</h6>
            <h6 className="text-white/40">Version 1.0.0 | © 2025</h6>
          </div>
        </>
      )}
    </div>
  );
}