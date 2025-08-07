import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface Neuron {
  x: number
  y: number
  layer: number
  activation: number
  bias: number
}

interface Connection {
  from: Neuron
  to: Neuron
  weight: number
}

interface NeuralNetworkVizProps {
  intensity: number
}

const NeuralNetworkViz: React.FC<NeuralNetworkVizProps> = ({ intensity }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const neuronsRef = useRef<Neuron[]>([])
  const connectionsRef = useRef<Connection[]>([])
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = 800
    canvas.height = 600

    // Initialize neural network structure
    const layers = [5, 8, 8, 6, 3]
    const neurons: Neuron[] = []
    const connections: Connection[] = []

    // Create neurons
    layers.forEach((count, layerIndex) => {
      const layerX = (layerIndex + 1) * (canvas.width / (layers.length + 1))
      const spacing = canvas.height / (count + 1)

      for (let i = 0; i < count; i++) {
        neurons.push({
          x: layerX,
          y: (i + 1) * spacing,
          layer: layerIndex,
          activation: Math.random(),
          bias: Math.random() * 2 - 1,
        })
      }
    })

    // Create connections
    for (let i = 0; i < neurons.length; i++) {
      for (let j = i + 1; j < neurons.length; j++) {
        if (neurons[j].layer === neurons[i].layer + 1) {
          connections.push({
            from: neurons[i],
            to: neurons[j],
            weight: Math.random() * 2 - 1,
          })
        }
      }
    }

    neuronsRef.current = neurons
    connectionsRef.current = connections

    // Animation loop
    const animate = () => {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update activations
      neuronsRef.current.forEach(neuron => {
        neuron.activation = Math.sin(Date.now() * 0.001 + neuron.x * 0.01 + neuron.y * 0.01) * 0.5 + 0.5
        neuron.activation *= intensity
      })

      // Draw connections
      connectionsRef.current.forEach(conn => {
        const gradient = ctx.createLinearGradient(
          conn.from.x, conn.from.y,
          conn.to.x, conn.to.y
        )
        
        const fromColor = `rgba(${255 * conn.from.activation}, ${255 * (1 - conn.from.activation)}, 255, ${0.3 + conn.weight * 0.3})`
        const toColor = `rgba(${255 * conn.to.activation}, ${255 * (1 - conn.to.activation)}, 255, ${0.3 + conn.weight * 0.3})`
        
        gradient.addColorStop(0, fromColor)
        gradient.addColorStop(1, toColor)

        ctx.strokeStyle = gradient
        ctx.lineWidth = Math.abs(conn.weight) * 2
        ctx.beginPath()
        ctx.moveTo(conn.from.x, conn.from.y)
        
        // Add curve to connections
        const midX = (conn.from.x + conn.to.x) / 2
        const midY = (conn.from.y + conn.to.y) / 2 + Math.sin(Date.now() * 0.001 + conn.weight) * 20
        
        ctx.quadraticCurveTo(midX, midY, conn.to.x, conn.to.y)
        ctx.stroke()

        // Draw signal pulses
        if (Math.random() < 0.02) {
          const t = (Date.now() % 1000) / 1000
          const pulseX = conn.from.x + (conn.to.x - conn.from.x) * t
          const pulseY = conn.from.y + (conn.to.y - conn.from.y) * t

          ctx.fillStyle = '#00ffff'
          ctx.shadowBlur = 20
          ctx.shadowColor = '#00ffff'
          ctx.beginPath()
          ctx.arc(pulseX, pulseY, 3, 0, Math.PI * 2)
          ctx.fill()
          ctx.shadowBlur = 0
        }
      })

      // Draw neurons
      neuronsRef.current.forEach(neuron => {
        const size = 10 + neuron.activation * 15
        
        // Outer glow
        ctx.fillStyle = `rgba(${255 * neuron.activation}, ${128}, ${255 * (1 - neuron.activation)}, 0.3)`
        ctx.beginPath()
        ctx.arc(neuron.x, neuron.y, size * 1.5, 0, Math.PI * 2)
        ctx.fill()

        // Inner core
        const gradient = ctx.createRadialGradient(
          neuron.x, neuron.y, 0,
          neuron.x, neuron.y, size
        )
        gradient.addColorStop(0, '#ffffff')
        gradient.addColorStop(0.5, `rgba(${255 * neuron.activation}, ${128}, ${255 * (1 - neuron.activation)}, 1)`)
        gradient.addColorStop(1, `rgba(${128 * neuron.activation}, ${64}, ${128 * (1 - neuron.activation)}, 0.8)`)

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(neuron.x, neuron.y, size, 0, Math.PI * 2)
        ctx.fill()

        // Add electric effect
        if (neuron.activation > 0.8) {
          ctx.strokeStyle = '#ffffff'
          ctx.lineWidth = 1
          ctx.globalAlpha = 0.5
          for (let i = 0; i < 3; i++) {
            ctx.beginPath()
            ctx.moveTo(neuron.x, neuron.y)
            const angle = Math.random() * Math.PI * 2
            const length = size + Math.random() * 20
            ctx.lineTo(
              neuron.x + Math.cos(angle) * length,
              neuron.y + Math.sin(angle) * length
            )
            ctx.stroke()
          }
          ctx.globalAlpha = 1
        }
      })

      // Add labels
      ctx.fillStyle = '#00ffff'
      ctx.font = '12px Orbitron'
      ctx.fillText('INPUT', 50, 30)
      ctx.fillText('HIDDEN LAYERS', canvas.width / 2 - 50, 30)
      ctx.fillText('OUTPUT', canvas.width - 100, 30)

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [intensity])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 6,
        filter: `contrast(${1 + intensity * 0.5}) brightness(${1 + intensity * 0.2})`,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          opacity: 0.7,
          mixBlendMode: 'screen',
        }}
      />
    </motion.div>
  )
}

export default NeuralNetworkViz