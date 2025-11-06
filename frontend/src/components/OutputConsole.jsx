export default function OutputConsole({ output, runCode }) {
  return (
    <>
      <div className="flex-col p-4">
        <button
          className="mb-4 rounded-lg border border-green-400/50 bg-green-400/30 px-4 py-2 font-bold text-white shadow-md transition-all duration-300 hover:bg-green-400/50 active:scale-95"
          onClick={runCode}
        >
          Execute
        </button>
        <textarea
          className="w-full h-full flex-grow resize-none rounded-lg border border-white/20 bg-white/5 p-4 font-mono text-base text-green-400 outline-none shadow-inner backdrop-blur-lg"
          value={output}
          placeholder="Output here..."
          readOnly
        ></textarea>
      </div>
    </>
  );
}
