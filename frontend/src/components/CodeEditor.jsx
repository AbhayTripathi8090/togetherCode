import Editor from "@monaco-editor/react";

export default function CodeEditor({ language, code, handleCodeChange }) {
  return (
    <div className="h-[60%] border-b border-gray-700 shadow-md">
      <Editor
        height="100%"
        language={language}
        value={code}
        onChange={handleCodeChange}
        theme="vs-dark"
        options={{ fontSize: 14, minimap: { enabled: false } }}
      />
    </div>
  );
}