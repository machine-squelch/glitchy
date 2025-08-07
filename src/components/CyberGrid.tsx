import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const CyberGrid: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    let time = 0

    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Perspective grid
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const maxRadius = Math.max(canvas.width, canvas.height)
      
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.2)'
      ctx.lineWidth = 1

      // Radial lines
      for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 12) {
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        const x = centerX + Math.cos(angle) * maxRadius
        const y = centerY + Math.sin(angle) * maxRadius
        ctx.lineTo(x, y)
        ctx.stroke()
      }

      // Concentric circles with wave effect
      for (let radius = 50; radius < maxRadius; radius += 50) {
        ctx.beginPath()
        for (let angle = 0; angle <= Math.PI * 2; angle += 0.1) {
          const waveOffset = Math.sin(angle * 4 + time) * 10
          const x = centerX + Math.cos(angle) * (radius + waveOffset)
          const y = centerY + Math.sin(angle) * (radius + waveOffset)
          if (angle === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }
        ctx.closePath()
        ctx.stroke()
      }

      // Glitch effect on random lines
      if (Math.random() > 0.95) {
        ctx.strokeStyle = 'rgba(255, 0, 255, 0.8)'
        ctx.lineWidth = 2
        const randomAngle = Math.random() * Math.PI * 2
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.lineTo(
          centerX + Math.cos(randomAngle) * maxRadius,
          centerY + Math.sin(randomAngle) * maxRadius
        )
        ctx.stroke()
      }

      time += 0.02
    }

    const animationId = setInterval(drawGrid, 50)

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    return () => {
      clearInterval(animationId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

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
        zIndex: 3,
        opacity: 0.6,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.6 }}
      transition={{ duration: 2 }}
    />
  )
}

export default CyberGrid