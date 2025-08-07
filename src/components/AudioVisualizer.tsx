import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Howl } from 'howler'
import { useMouseHovered } from 'react-use'

interface AudioVisualizerProps {
  isActive: boolean
  intensity: number
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isActive, intensity }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null)
  const dataArrayRef = useRef<Uint8Array | null>(null)
  const animationIdRef = useRef<number | null>(null)
  const [isListening, setIsListening] = useState(false)
  
  // Sound effects
  const [soundEffects] = useState(() => ({
    glitch: new Howl({
      src: ['https://www.soundjay.com/misc/sounds/button-3.wav'],
      volume: 0.5,
    }),
    pulse: new Howl({
      src: ['https://www.soundjay.com/misc/sounds/button-10.wav'],
      volume: 0.3,
    }),
    error: new Howl({
      src: ['https://www.soundjay.com/misc/sounds/fail-buzzer-1.wav'],
      volume: 0.4,
    }),
  }))

  const visualizerRef = useRef<HTMLDivElement>(null)
  const isHovered = useMouseHovered(visualizerRef)

  useEffect(() => {
    if (!isActive) return

    const initAudio = async () => {
      try {
        // Create audio context
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
        analyserRef.current = audioContextRef.current.createAnalyser()
        analyserRef.current.fftSize = 512
        
        // Try to get microphone access
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        sourceRef.current = audioContextRef.current.createMediaStreamSource(stream)
        sourceRef.current.connect(analyserRef.current)
        
        const bufferLength = analyserRef.current.frequencyBinCount
        dataArrayRef.current = new Uint8Array(bufferLength)
        
        setIsListening(true)
        draw()
      } catch (err) {
        console.log('Microphone access denied, using generated data')
        // Fallback to generated visualization
        generateVisualization()
      }
    }

    const generateVisualization = () => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      canvas.width = 400
      canvas.height = 200

      const bufferLength = 128
      dataArrayRef.current = new Uint8Array(bufferLength)
      
      // Generate fake audio data
      const generateData = () => {
        for (let i = 0; i < bufferLength; i++) {
          dataArrayRef.current![i] = Math.random() * 255 * intensity + 
            Math.sin(Date.now() * 0.001 + i * 0.1) * 128
        }
      }

      const draw = () => {
        animationIdRef.current = requestAnimationFrame(draw)
        generateData()
        
        ctx.fillStyle = 'rgba(10, 10, 10, 0.2)'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        const barWidth = (canvas.width / bufferLength) * 2.5
        let barHeight
        let x = 0

        for (let i = 0; i < bufferLength; i++) {
          barHeight = (dataArrayRef.current![i] / 255) * canvas.height * 0.8

          // Create gradient bars
          const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height)
          gradient.addColorStop(0, `hsl(${i * 360 / bufferLength}, 100%, 50%)`)
          gradient.addColorStop(0.5, '#00ffff')
          gradient.addColorStop(1, '#ff00ff')
          
          ctx.fillStyle = gradient
          ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight)

          // Add glow effect
          ctx.shadowBlur = 20
          ctx.shadowColor = `hsl(${i * 360 / bufferLength}, 100%, 50%)`
          
          x += barWidth + 1
        }

        // Draw waveform on top
        ctx.beginPath()
        ctx.strokeStyle = '#00ffff'
        ctx.lineWidth = 2
        ctx.shadowBlur = 10
        ctx.shadowColor = '#00ffff'
        
        for (let i = 0; i < bufferLength; i++) {
          const v = dataArrayRef.current![i] / 255
          const y = v * canvas.height / 2
          
          if (i === 0) {
            ctx.moveTo(i * (canvas.width / bufferLength), y)
          } else {
            ctx.lineTo(i * (canvas.width / bufferLength), y)
          }
        }
        
        ctx.stroke()
      }

      draw()
    }

    const draw = () => {
      if (!analyserRef.current || !dataArrayRef.current) return
      
      animationIdRef.current = requestAnimationFrame(draw)
      analyserRef.current.getByteFrequencyData(dataArrayRef.current as Uint8Array<ArrayBuffer>)
      
      const canvas = canvasRef.current
      if (!canvas) return
      
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      
      ctx.fillStyle = 'rgba(10, 10, 10, 0.2)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      const barWidth = (canvas.width / dataArrayRef.current.length) * 2.5
      let barHeight
      let x = 0
      
      for (let i = 0; i < dataArrayRef.current.length; i++) {
        barHeight = (dataArrayRef.current[i] / 255) * canvas.height * 0.8
        
        const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height)
        gradient.addColorStop(0, `hsl(${i * 360 / dataArrayRef.current.length}, 100%, 50%)`)
        gradient.addColorStop(1, '#ff00ff')
        
        ctx.fillStyle = gradient
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight)
        
        x += barWidth + 1
      }
    }

    initAudio()

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [isActive, intensity])

  // Play sound on hover
  useEffect(() => {
    if (isHovered && Math.random() > 0.7) {
      soundEffects.pulse.play()
    }
  }, [isHovered, soundEffects])

  return (
    <motion.div
      ref={visualizerRef}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 50 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'fixed',
        bottom: '2rem',
        left: '2rem',
        background: 'rgba(0, 0, 0, 0.8)',
        border: '2px solid rgba(255, 0, 255, 0.5)',
        borderRadius: '10px',
        padding: '1rem',
        boxShadow: '0 0 30px rgba(255, 0, 255, 0.5)',
      }}
    >
      <div style={{
        color: '#00ffff',
        fontFamily: 'Orbitron, monospace',
        marginBottom: '10px',
        fontSize: '12px',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
      }}>
        {isListening ? 'Audio Input Active' : 'Synthetic Audio'}
      </div>
      <canvas
        ref={canvasRef}
        width={400}
        height={200}
        style={{
          display: 'block',
          filter: `hue-rotate(${intensity * 360}deg)`,
        }}
      />
      <div style={{
        marginTop: '10px',
        display: 'flex',
        gap: '10px',
      }}>
        <button
          onClick={() => soundEffects.glitch.play()}
          className="distress-button"
          style={{
            padding: '0.5rem 1rem',
            fontSize: '12px',
          }}
        >
          GLITCH
        </button>
        <button
          onClick={() => soundEffects.error.play()}
          className="distress-button"
          style={{
            padding: '0.5rem 1rem',
            fontSize: '12px',
          }}
        >
          ERROR
        </button>
      </div>
    </motion.div>
  )
}

export default AudioVisualizer