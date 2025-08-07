import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface GlitchBackgroundProps {
  intensity: number
}

const GlitchBackground: React.FC<GlitchBackgroundProps> = ({ intensity }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const glitchEffect = () => {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      if (Math.random() < intensity) {
        // Random glitch blocks
        for (let i = 0; i < 5; i++) {
          const x = Math.random() * canvas.width
          const y = Math.random() * canvas.height
          const w = Math.random() * 200
          const h = Math.random() * 20

          ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 0.5})`
          ctx.fillRect(x, y, w, h)
        }

        // Distortion lines
        ctx.strokeStyle = `rgba(0, 255, 255, ${intensity * 0.5})`
        ctx.lineWidth = 1
        ctx.beginPath()
        for (let i = 0; i < 10; i++) {
          const y = Math.random() * canvas.height
          ctx.moveTo(0, y)
          ctx.lineTo(canvas.width, y)
        }
        ctx.stroke()
      }
    }

    const animationId = setInterval(glitchEffect, 50)

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    return () => {
      clearInterval(animationId)
      window.removeEventListener('resize', handleResize)
    }
  }, [intensity])

  return (
    <motion.canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 4,
        mixBlendMode: 'screen',
      }}
      animate={{
        opacity: [0.5, 0.8, 0.5],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  )
}

export default GlitchBackground