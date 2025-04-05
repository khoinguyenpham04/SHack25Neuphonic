"use client"

import type React from "react"

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition
    webkitSpeechRecognition: typeof SpeechRecognition
  }
}

import { useState, useEffect, useCallback } from "react"
import { Mic, MicOff, Bot, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sidebar, SidebarContent, SidebarHeader, SidebarFooter } from "@/components/ui/sidebar"
import { AudioVisualizer } from "./AudioVisualizer"

type Message = {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

export default function ChatSidebar() {
  const [isRecording, setIsRecording] = useState(false)
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition()
        recognition.continuous = false
        recognition.interimResults = false
        recognition.lang = 'en-US'

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript
          setInputValue(transcript)
          handleSendMessage(transcript)
        }

        recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error)
          setIsRecording(false)
        }

        recognition.onend = () => {
          setIsRecording(false)
        }

        setRecognition(recognition)
      }
    }
  }, [])

  const toggleRecording = useCallback(() => {
    if (!recognition) return

    if (isRecording) {
      recognition.stop()
    } else {
      recognition.start()
      setIsRecording(true)
    }
  }, [isRecording, recognition])

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hi! I'm your coding assistant. How can I help with your problem?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: text,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "I can help with that! For the Two Sum problem, consider using a hash map to track the numbers you've seen. This allows you to check if the complement (target - current number) exists in O(1) time.",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
    }, 1000)
  }

  return (
    <Sidebar side="right" className="w-full h-screen border-l flex flex-col" collapsible="none">
      <SidebarHeader className="p-3 border-b flex-shrink-0">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Bot size={18} />
          <span>Code Assistant</span>
        </h2>
      </SidebarHeader>
    
      <SidebarContent className="p-3 flex-1 overflow-y-auto min-h-0">
        <div className="flex flex-col gap-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {message.sender === "bot" ? <Bot size={14} /> : <User size={14} />}
                  <span className="text-xs font-medium">{message.sender === "user" ? "You" : "Assistant"}</span>
                </div>
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))}
        </div>
      </SidebarContent>
    
      <SidebarFooter className="p-3 border-t flex-shrink-0">
        <div className="flex flex-col items-center gap-4">
          {isRecording && (
            <div className="w-full h-48">
              <AudioVisualizer />
            </div>
          )}
          <Button
            onClick={toggleRecording}
            size="icon"
            variant={isRecording ? "destructive" : "default"}
            className="w-12 h-12 rounded-full"
          >
            {isRecording ? <MicOff size={24} /> : <Mic size={24} />}
            <span className="sr-only">{isRecording ? "Stop recording" : "Start recording"}</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

