"use client";

import { useCallback } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript"; // Supports JS, TS, JSX, and TSX
import { EditorView } from "@codemirror/view"; // For editor theme and line wrapping

type CodeEditorProps = {
  code: string;
  onCodeChange: (value: string) => void;
};

export default function CodeEditor({ code, onCodeChange }: CodeEditorProps) {
  const handleEditorChange = useCallback(
    (value: string) => {
      onCodeChange(value);
    },
    [onCodeChange]
  );

  return (
    <div className="h-full">
      <CodeMirror
        value={code}
        className="h-full"
        height="100%"
        extensions={[
          javascript({ jsx: true, typescript: true }), // Enable JS, JSX, TS, and TSX support
          EditorView.lineWrapping, // Line wrapping support
        ]}
        onChange={handleEditorChange}
        theme="dark" // You can customize or switch this theme
        basicSetup={{ lineNumbers: true }}
      />
    </div>
  );
}
