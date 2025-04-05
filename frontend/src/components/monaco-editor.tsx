"use client"

import { useRef, useEffect } from "react"
import dynamic from "next/dynamic"
import * as monaco from "monaco-editor"

interface MonacoEditorProps {
  value: string
  onChange: (value: string) => void
  language?: string
  theme?: string
  options?: monaco.editor.IStandaloneEditorConstructionOptions
}

const MonacoEditor = ({
  value,
  onChange,
  language = "javascript",
  theme = "vs-light",
  options = {},
}: MonacoEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null)
  const monacoEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)

  useEffect(() => {
    if (editorRef.current && !monacoEditorRef.current) {
      monaco.editor.defineTheme("leetcode-dark", {
        base: "vs-dark",
        inherit: true,
        rules: [
          { token: "", foreground: "#d4d4d4" },
          { token: "keyword", foreground: "#569cd6" },
          { token: "string", foreground: "#ce9178" },
          { token: "comment", foreground: "#6a9955" }
        ],
        colors: {
          "editor.background": "#1a1a1a",
          "editor.foreground": "#d4d4d4",
          "editorLineNumber.foreground": "#858585",
          "editorCursor.foreground": "#ffffff"
        },
      })

      monaco.editor.setTheme("leetcode-dark")

      const editor = monaco.editor.create(editorRef.current, {
        value,
        language,
        theme,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        lineNumbers: "on",
        glyphMargin: false,
        folding: true,
        lineDecorationsWidth: 10,
        lineNumbersMinChars: 3,
        automaticLayout: true,
        tabSize: 2,
        wordWrap: "on",
        ...options,
      })

      editor.onDidChangeModelContent(() => {
        onChange(editor.getValue())
      })

      // Focus the editor after creation
      editor.focus()

      monacoEditorRef.current = editor

      return () => {
        editor.dispose()
        monacoEditorRef.current = null
      }
    }
  }, []) // Empty dependency array to initialize only once

  // Update editor value when prop changes
  useEffect(() => {
    if (monacoEditorRef.current && value !== monacoEditorRef.current.getValue()) {
      monacoEditorRef.current.setValue(value)
    }
  }, [value])

  return <div ref={editorRef} className="h-full w-full" />
}

export default dynamic(() => import("monaco-editor/esm/vs/editor/editor.api").then(() => MonacoEditor), { ssr: false })

