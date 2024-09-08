"use client";

import { useState, useEffect } from "react";
import * as babelParser from "@babel/parser"; // Babel parser
import type { File } from "@babel/types";
import * as esprima from "esprima"; // Esprima parser
import { ObjectInspector } from "react-inspector"; // react-inspector for AST tree view

type AstViewerProps = {
  code: string;
};

export default function AstViewer({ code }: AstViewerProps) {
  const [selectedParser, setSelectedParser] = useState<string>("babel");
  const [ast, setAst] = useState<
    babelParser.ParseResult<File> | esprima.Program | null
  >(null);

  // Improved error logging
  console.log("Code input:", code);
  console.log("Selected parser:", selectedParser);

  // Regenerate AST when parser or code changes
  useEffect(() => {
    // Generate AST based on selected parser
    const generateAST = () => {
      try {
        let parsedAst;
        switch (selectedParser) {
          case "babel":
            parsedAst = babelParser.parse(code, {
              sourceType: "module",
              plugins: ["jsx", "typescript"],
            });
            console.log("Babel AST:", parsedAst); // Add logging for debugging
            break;
          case "esprima":
            parsedAst = esprima.parseScript(code, {
              jsx: true,
              tolerant: true,
            });
            console.log("Esprima AST:", parsedAst); // Add logging for debugging
            break;
          default:
            parsedAst = null;
        }
        setAst(parsedAst);
      } catch (error) {
        console.error("Error parsing the code:", error);
        setAst(null);
      }
    };
    if (code.trim() !== "") {
      // Only attempt to generate AST if code is not empty
      generateAST();
    }
  }, [selectedParser, code]); // This ensures the AST is regenerated when parser or code changes

  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-4 flex justify-between">
        {/* Dropdown for parser selection */}
        <div className="flex items-center">
          <label htmlFor="parser-select" className="mr-2 text-black">
            Choose Parser:
          </label>
          <select
            id="parser-select"
            value={selectedParser}
            onChange={(e) => setSelectedParser(e.target.value)}
            className="bg-gray-200 border border-gray-400 rounded text-black"
          >
            <option value="babel">Babel</option>
            <option value="esprima">Esprima</option>
          </select>
        </div>

        {/* Download JSON button */}
        <button
          onClick={() => {
            const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
              JSON.stringify(ast, null, 2)
            )}`;
            const link = document.createElement("a");
            link.href = jsonString;
            link.download = "ast.json";
            link.click();
          }}
          className="ml-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Download AST as JSON
        </button>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-50 p-4 rounded">
        {ast ? (
          <div className="bg-white p-4 rounded shadow max-h-screen overflow-y-auto text-sm font-mono">
            <ObjectInspector data={ast} expandLevel={2} theme="chromeDark" />
          </div>
        ) : (
          <div className="text-gray-500">
            No AST to display. Please enter valid code or switch parser.
          </div>
        )}
      </div>
    </div>
  );
}
