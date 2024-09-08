"use client";

import { useState } from "react";
import CodeEditor from "./components/CodeEditor";
import AstViewer from "./components/AstViewer";

export default function ASTViewerPage() {
  const [code, setCode] = useState<string>("");

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/2 p-4">
        <CodeEditor code={code} onCodeChange={handleCodeChange} />
      </div>
      <div className="w-1/2 p-4 overflow-y-auto bg-gray-50">
        <AstViewer code={code} />
      </div>
    </div>
  );
}
