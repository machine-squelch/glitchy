import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMouse, useInterval } from 'react-use'

interface DataNode {
  id: number
  x: number
  y: number
  corrupted: boolean
  value: string
  connections: number[]
}

interface DataCorruptionGameProps {
  onScoreChange: (score: number) => void
  isActive: boolean
}

const DataCorruptionGame: React.FC<DataCorruptionGameProps> = ({ onScoreChange, isActive }) => {
  const [nodes, setNodes] = useState<DataNode[]>([])
  const [score, setScore] = useState(0)
  const [corruptionLevel, setCorruptionLevel] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [selectedNode, setSelectedNode] = useState<number | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gameRef = useRef<HTMLDivElement>(null)
  const mouse = useMouse(gameRef)

  // Initialize game
  useEffect(() => {
    if (!isActive) return

    const initNodes: DataNode[] = []
    const gridSize = 6
    const spacing = 60

    for (let i = 0; i < gridSize * gridSize; i++) {
      const x = (i % gridSize) * spacing + 50
      const y = Math.floor(i / gridSize) * spacing + 50
      
      initNodes.push({
        id: i,
        x,
        y,
        corrupted: Math.random() < 0.1,
        value: Math.random().toString(16).substring(2, 6).toUpperCase(),
        connections: []
      })
    }

    // Create random connections
    initNodes.forEach((node, i) => {
      const possibleConnections = [i - 1, i + 1, i - gridSize, i + gridSize]
        .filter(j => j >= 0 && j < initNodes.length && Math.abs((j % gridSize) - (i % gridSize)) <= 1)
      
      node.connections = possibleConnections.filter(() => Math.random() < 0.3)
    })

    setNodes(initNodes)
    setScore(0)
    setCorruptionLevel(10)
    setGameOver(false)
  }, [isActive])

  // Spread corruption
  useInterval(() => {
    if (!isActive || gameOver) return

    setNodes(prevNodes => {
      const newNodes = [...prevNodes]
      const corruptedNodes = newNodes.filter(n => n.corrupted)
      
      // Spread corruption to connected nodes
      corruptedNodes.forEach(node => {
        node.connections.forEach(connId => {
          if (Math.random() < 0.3) {
            newNodes[connId].corrupted = true
          }
        })
      })

      // Random corruption
      const randomNode = Math.floor(Math.random() * newNodes.length)
      if (Math.random() < 0.1) {
        newNodes[randomNode].corrupted = true
      }

      const newCorruptionLevel = (newNodes.filter(n => n.corrupted).length / newNodes.length) * 100
      setCorruptionLevel(newCorruptionLevel)

      if (newCorruptionLevel > 80) {
        setGameOver(true)
      }

      return newNodes
    })
  }, 1000)

  // Draw connections
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = 400
    canvas.height = 400

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw connections
      nodes.forEach(node => {
        node.connections.forEach(connId => {
          const targetNode = nodes[connId]
          if (!targetNode) return

          ctx.beginPath()
          ctx.moveTo(node.x, node.y)
          ctx.lineTo(targetNode.x, targetNode.y)
          ctx.strokeStyle = node.corrupted || targetNode.corrupted ? '#ff00ff' : '#00ffff'
          ctx.lineWidth = node.corrupted && targetNode.corrupted ? 3 : 1
          ctx.globalAlpha = 0.5
          ctx.stroke()
          ctx.globalAlpha = 1
        })
      })

      // Draw selected node highlight
      if (selectedNode !== null) {
        const node = nodes[selectedNode]
        if (node) {
          ctx.beginPath()
          ctx.arc(node.x, node.y, 30, 0, Math.PI * 2)
          ctx.strokeStyle = '#ffff00'
          ctx.lineWidth = 2
          ctx.stroke()
        }
      }
    }

    draw()
  }, [nodes, selectedNode])

  const handleNodeClick = (nodeId: number) => {
    if (gameOver) return

    const node = nodes[nodeId]
    if (!node.corrupted) return

    // Clean the node
    setNodes(prevNodes => {
      const newNodes = [...prevNodes]
      newNodes[nodeId].corrupted = false
      newNodes[nodeId].value = Math.random().toString(16).substring(2, 6).toUpperCase()
      return newNodes
    })

    setScore(prev => {
      const newScore = prev + 10
      onScoreChange(newScore)
      return newScore
    })
  }

  const handleMouseMove = () => {
    // Find closest node to mouse
    const mouseX = mouse.elX
    const mouseY = mouse.elY
    
    let closestNode = -1
    let closestDistance = Infinity

    nodes.forEach((node, i) => {
      const distance = Math.sqrt(
        Math.pow(node.x - mouseX, 2) + Math.pow(node.y - mouseY, 2)
      )
      if (distance < closestDistance && distance < 30) {
        closestDistance = distance
        closestNode = i
      }
    })

    setSelectedNode(closestNode >= 0 ? closestNode : null)
  }

  return (
    <motion.div
      ref={gameRef}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.9 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'rgba(0, 0, 0, 0.95)',
        border: '2px solid rgba(0, 255, 255, 0.5)',
        borderRadius: '10px',
        padding: '2rem',
        boxShadow: '0 0 50px rgba(0, 255, 255, 0.5)',
        display: isActive ? 'block' : 'none',
      }}
      onMouseMove={handleMouseMove}
    >
      <div style={{
        textAlign: 'center',
        marginBottom: '1rem',
      }}>
        <h2 className="glitch-text" data-text="DATA CORRUPTION CONTAINMENT">
          DATA CORRUPTION CONTAINMENT
        </h2>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '1rem',
          fontFamily: 'Orbitron, monospace',
        }}>
          <div style={{ color: '#00ffff' }}>SCORE: {score}</div>
          <div style={{ color: corruptionLevel > 60 ? '#ff0000' : '#ff00ff' }}>
            CORRUPTION: {corruptionLevel.toFixed(1)}%
          </div>
        </div>
      </div>

      <div style={{ position: 'relative', width: '400px', height: '400px' }}>
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            pointerEvents: 'none',
          }}
        />
        
        <AnimatePresence>
          {nodes.map(node => (
            <motion.div
              key={node.id}
              initial={{ scale: 0 }}
              animate={{ 
                scale: selectedNode === node.id ? 1.2 : 1,
                rotate: node.corrupted ? [0, 5, -5, 0] : 0,
              }}
              exit={{ scale: 0 }}
              transition={{ 
                scale: { duration: 0.2 },
                rotate: { duration: 0.5, repeat: Infinity }
              }}
              style={{
                position: 'absolute',
                left: `${node.x - 20}px`,
                top: `${node.y - 20}px`,
                width: '40px',
                height: '40px',
                background: node.corrupted 
                  ? 'linear-gradient(45deg, #ff00ff, #ff0066)' 
                  : 'linear-gradient(45deg, #00ffff, #0066ff)',
                border: `2px solid ${node.corrupted ? '#ff00ff' : '#00ffff'}`,
                borderRadius: '5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: node.corrupted ? 'pointer' : 'default',
                fontFamily: 'monospace',
                fontSize: '10px',
                color: '#fff',
                boxShadow: node.corrupted 
                  ? '0 0 20px rgba(255, 0, 255, 0.8)' 
                  : '0 0 10px rgba(0, 255, 255, 0.5)',
              }}
              onClick={() => handleNodeClick(node.id)}
              whileHover={node.corrupted ? { scale: 1.1 } : {}}
              whileTap={node.corrupted ? { scale: 0.9 } : {}}
            >
              {node.value}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {gameOver && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(255, 0, 0, 0.9)',
            padding: '2rem',
            borderRadius: '10px',
            textAlign: 'center',
          }}
        >
          <h3 style={{ color: '#fff', marginBottom: '1rem' }}>SYSTEM CORRUPTED</h3>
          <p style={{ color: '#fff' }}>Final Score: {score}</p>
        </motion.div>
      )}
    </motion.div>
  )
}

export default DataCorruptionGame