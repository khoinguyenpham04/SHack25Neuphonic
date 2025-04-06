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
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition"
import { getAiAnalysis } from "@/services/aiAnalysisService"

type Message = {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
  type?: "feedback" | "chat"
}

interface ChatSidebarProps {
  code: string
  selectedProblem: {
    id: number
    title: string
    difficulty: string
    description: string
    examples: {
      input: string
      output: string
      explanation?: string
    }[]
    constraints: string[]
    starterCode: string
  }
}

export default function ChatSidebar({ code, selectedProblem }: ChatSidebarProps) {

  const [inputValue, setInputValue] = useState("")
  const [audioUrl, setAudioUrl] = useState<string | null>(null);


  const handleSendMessage = useCallback((text: string) => {
    if (!text.trim()) return;

    // 1) Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: text,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // 2) Fetch AI response
    getAiAnalysis({
      code,
      language: 'python',
      problemDescription: selectedProblem.description,
      userInput: text,
    })
      .then((data) => {
        // Process AI response inside an async IIFE
        (async () => {
          if (data.feedback) {
            console.log(data.feedback)
            try {
              
              const res = await fetch(`/api/tts?msg=${data.feedback}`);
              if (!res.ok) {
                throw new Error(`Failed to fetch TTS: ${res.statusText}`);
              }

              const arrayBuffer = await res.arrayBuffer();
              const blob = new Blob([arrayBuffer], { type: 'audio/wav' });
              const url = URL.createObjectURL(blob);
              setAudioUrl(url);

              const audio = new Audio(url);
              audio.play();
            } catch (error) {
              console.error("TTS fetch/playback error:", error);
            }
          }

          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: data.feedback || "No feedback returned",
            sender: "bot",
            timestamp: new Date(),
            type: "chat",
          };
          setMessages((prev) => [...prev, botMessage]);
        })();
      })
      .catch((error) => {
        console.error("Error getting AI response:", error);
        const fallbackMessage: Message = {
          id: (Date.now() + 2).toString(),
          content: "I’m sorry, but I couldn’t reach the AI service. Please try again later.",
          sender: "bot",
          timestamp: new Date(),
          type: "chat",
        };
        setMessages((prev) => [...prev, fallbackMessage]);
      });
  }, [code, selectedProblem]);


  // Listen for AI feedback event
  useEffect(() => {
    const handleAIAnalysis = (event: CustomEvent<{ feedback: string }>) => {
      const feedbackMessage: Message = {
        id: Date.now().toString(),
        content: event.detail.feedback,
        sender: "bot",
        timestamp: new Date(),
        type: "feedback"
      }
      setMessages(prev => [...prev, feedbackMessage])
    }

    window.addEventListener('aiAnalysis', handleAIAnalysis as EventListener)

    return () =>
      window.removeEventListener('aiAnalysis', handleAIAnalysis as EventListener)
  }, [])

  // Microphone To Text Hook useSpee
  const onSpeechResult = useCallback((transcript: string) => {
    setInputValue(transcript)
  }, [])

  const handleSpeechResult = useCallback((transcript: string) => {
    setInputValue(transcript)
    handleSendMessage(transcript)
  }, [handleSendMessage])

  // Use Hook

  const { isRecording, toggleRecording } = useSpeechRecognition(handleSpeechResult)

  // Initialise First Message
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hi! I'm your coding assistant. How can I help with your problem?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])


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
                className={`max-w-[80%] rounded-lg p-3 ${message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
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
            className={`w-12 h-12 rounded-full ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
              } text-white`}
          >
            {isRecording ? <MicOff size={24} /> : <Mic size={24} />}
            <span className="sr-only">{isRecording ? "Stop recording" : "Start recording"}</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

