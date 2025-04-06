// useSpeechRecognition.ts

import { useState, useEffect, useCallback } from "react"

export function useSpeechRecognition(
  onResult: (transcript: string) => void
) {
  const [isRecording, setIsRecording] = useState(false)
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return // SSR guard

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return

    // Create the recognition instance only once
    const rec = new SpeechRecognition()
    rec.continuous = false
    rec.interimResults = false
    rec.lang = "en-US"

    rec.onresult = event => {
      // This fires once per recognized phrase
      const transcript = event.results[0][0].transcript
      onResult(transcript)
    }

    rec.onerror = event => {
      console.error("Speech recognition error:", event.error)
      setIsRecording(false)
    }

    rec.onend = () => {
      // Called whenever recognition stops (normally or abnormally)
      setIsRecording(false)
    }

    setRecognition(rec)
  // IMPORTANT: empty array so we only create & configure once
  }, [onResult]) 

  // Wrap in a useCallback so the function isn’t re-created every render
  const toggleRecording = useCallback(() => {
    if (!recognition) return
    if (isRecording) {
      recognition.stop()
    } else {
      recognition.start()
      setIsRecording(true)
    }
  }, [isRecording, recognition])

  return { isRecording, toggleRecording }
}
