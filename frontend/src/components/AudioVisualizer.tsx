'use client'

import React, { useEffect, useRef } from 'react'

export function AudioVisualizer() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null)

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      if (!containerRef.current || !canvas) return
      const { width, height } = containerRef.current.getBoundingClientRect()
      canvas.width = width
      canvas.height = height
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const audioContext = (audioContextRef.current = new AudioContext())
    const analyser = (analyserRef.current = audioContext.createAnalyser())
    analyser.fftSize = 64
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        if (!audioContext || !analyser) return
        mediaStreamSourceRef.current = audioContext.createMediaStreamSource(stream)
        mediaStreamSourceRef.current.connect(analyser)
        draw()
      })
      .catch((err) => {
        console.error('Error getting user media:', err)
      })

    function draw() {
      if (!ctx || !canvas || !analyser) return
      requestAnimationFrame(draw)

      analyser.getByteFrequencyData(dataArray)

      ctx.fillStyle = '#171717'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const centerY = canvas.height / 2
      const barWidth = (canvas.width / bufferLength) * 1.4
      let x = 0

      const threshold = 10
      const hasSound = dataArray.some(value => value > threshold)

      if (!hasSound) return

      for (let i = 0; i < bufferLength; i++) {
        const barAmp = dataArray[i]
        
        if (barAmp > threshold) {
          const totalBarHeight = barAmp * 0.7
          const halfHeight = totalBarHeight / 2
          const top = centerY - halfHeight
          const bottom = centerY + halfHeight

          ctx.beginPath()
          ctx.moveTo(x + 10, top)
          ctx.lineTo(x + barWidth - 10, top)
          ctx.quadraticCurveTo(x + barWidth, top, x + barWidth, top + 10)
          ctx.lineTo(x + barWidth, bottom - 10)
          ctx.quadraticCurveTo(x + barWidth, bottom, x + barWidth - 10, bottom)
          ctx.lineTo(x + 10, bottom)
          ctx.quadraticCurveTo(x, bottom, x, bottom - 10)
          ctx.lineTo(x, top + 10)
          ctx.quadraticCurveTo(x, top, x + 10, top)
          ctx.closePath()

          ctx.fillStyle = '#3B82F6'
          ctx.fill()
        }

        x += barWidth + 4
      }
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  return (
    <div ref={containerRef} className="w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  )
}