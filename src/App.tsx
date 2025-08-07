import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Particles from 'react-particles'
import { loadSlim } from 'tsparticles-slim'
import type { Container, Engine } from 'tsparticles-engine'
import { useMouse, useWindowSize } from 'react-use'
import './App.css'
import GlitchBackground from './components/GlitchBackground'
import DistortedText from './components/DistortedText'
import CyberGrid from './components/CyberGrid'
import ThreeDScene from './components/ThreeDScene'
import InteractiveTerminal from './components/InteractiveTerminal'
import AudioVisualizer from './components/AudioVisualizer'
import DataCorruptionGame from './components/DataCorruptionGame'
import NeuralNetworkViz from './components/NeuralNetworkViz'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'

function App() {
  // Core states
  const [systemStatus, setSystemStatus] = useState('INITIALIZING')
  const [glitchIntensity, setGlitchIntensity] = useState(0)
  const [errorMessages, setErrorMessages] = useState<string[]>([])
  
  // UI component toggles
  const [showTerminal, setShowTerminal] = useState(true)
  const [showAudioVisualizer, setShowAudioVisualizer] = useState(true)
  const [showGame, setShowGame] = useState(false)
  const [showNeuralNetwork, setShowNeuralNetwork] = useState(true)
  
  // Advanced features
  const [gameScore, setGameScore] = useState(0)
  const [mouseTrail, setMouseTrail] = useState<Array<{ x: number; y: number; id: number }>>([])
  const [isRebootMode, setIsRebootMode] = useState(false)
  
  // Hooks
  const mouse = useMouse({ current: document.body } as React.RefObject<Element>)
  
  // Mouse trail effect
  useEffect(() => {
    const trailId = Date.now()
    setMouseTrail(prev => [
      ...prev.slice(-10),
      { x: mouse.docX, y: mouse.docY, id: trailId }
    ])
  }, [mouse.docX, mouse.docY])

  // System initialization
  useEffect(() => {
    const bootSequence = async () => {
      const stages = [
        'NEURAL_INTERFACE_INIT',
        'CONSCIOUSNESS_LOADING',
        'REALITY_MATRIX_SYNC',
        'DIMENSIONAL_BARRIERS_DOWN',
        'SYSTEM_COMPROMISED',
        'WELCOME_TO_THE_VOID'
      ]

      for (let i = 0; i < stages.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1500))
        setSystemStatus(stages[i])
        setGlitchIntensity(i * 0.2)
      }

      // Start random glitch events
      const glitchInterval = setInterval(() => {
        setGlitchIntensity(Math.random())
        if (Math.random() > 0.6) {
          const errors = [
            'Memory leak in sector ' + Math.floor(Math.random() * 999),
            'Quantum decoherence detected',
            'Reality.exe has stopped working',
            'Time paradox in progress...',
            'Neural pathways overloading',
            'Consciousness fragmentation warning',
            'The machines are learning',
            'ERROR 404: Soul not found'
          ]
          setErrorMessages(prev => [...prev.slice(-3), errors[Math.floor(Math.random() * errors.length)]])
        }
      }, 2500)

      return () => clearInterval(glitchInterval)
    }

    bootSequence()
  }, [])

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onGlitchIncrease: () => setGlitchIntensity(Math.min(glitchIntensity + 0.2, 1)),
    onTerminalToggle: () => setShowTerminal(!showTerminal),
    onAudioToggle: () => setShowAudioVisualizer(!showAudioVisualizer),
    onGameToggle: () => setShowGame(!showGame),
    onNeuralToggle: () => setShowNeuralNetwork(!showNeuralNetwork),
    onReboot: () => {
      setIsRebootMode(true)
      setTimeout(() => {
        setGlitchIntensity(0)
        setErrorMessages([])
        setIsRebootMode(false)
      }, 3000)
    },
    onEmergencyStop: () => {
      setShowGame(false)
      setGlitchIntensity(0)
    }
  })

  // Particle system initialization
  const particlesInit = async (engine: Engine) => {
    await loadSlim(engine)
  }

  const particlesLoaded = async (container?: Container) => {
    console.log('Neural particle matrix loaded', container)
  }

  // Dynamic particle configuration based on intensity
  const particleOptions = {
    fullScreen: { enable: true, zIndex: 0 },
    background: { color: { value: "#0a0a0a" } },
    fpsLimit: 120,
    particles: {
      color: { 
        value: ["#ff00ff", "#00ffff", "#ffff00"],
        animation: {
          enable: true,
          speed: 20,
          sync: false
        }
      },
      links: {
        color: "#00ffff",
        distance: 150 + glitchIntensity * 100,
        enable: true,
        opacity: 0.1 + glitchIntensity * 0.3,
        width: 1 + glitchIntensity * 2,
        triangles: {
          enable: glitchIntensity > 0.5,
          color: "#ff00ff",
          opacity: 0.1
        }
      },
      move: {
        enable: true,
        speed: 0.5 + glitchIntensity * 2,
        direction: "none" as const,
        random: true,
        straight: false,
        outModes: { default: "bounce" as const },
        trail: {
          enable: glitchIntensity > 0.7,
          length: 3,
          fillColor: "#0a0a0a"
        }
      },
      number: {
        density: { enable: true, area: 800 },
        value: 50 + Math.floor(glitchIntensity * 100),
      },
      opacity: {
        value: { min: 0.1, max: 0.5 + glitchIntensity * 0.3 },
        animation: {
          enable: true,
          speed: 1 + glitchIntensity * 2,
          minimumValue: 0.1,
        },
      },
      shape: { 
        type: ["circle", "triangle", "square"][Math.floor(glitchIntensity * 3)] || "circle"
      },
      size: {
        value: { min: 1, max: 3 + glitchIntensity * 5 },
        animation: {
          enable: true,
          speed: 2 + glitchIntensity * 3,
          minimumValue: 0.1,
        },
      },
    },
    interactivity: {
      events: {
        onClick: { enable: true, mode: ["push", "repulse"] },
        onHover: { 
          enable: true, 
          mode: ["repulse", "grab"],
          parallax: { enable: true, force: 10, smooth: 10 }
        },
      },
      modes: {
        push: { quantity: 4 + Math.floor(glitchIntensity * 10) },
        repulse: { 
          distance: 100 + glitchIntensity * 200, 
          duration: 0.4,
          speed: 1
        },
        grab: {
          distance: 200,
          links: { opacity: 0.5 }
        }
      },
    },
    detectRetina: true,
  }

  return (
    <div className="app">
      {/* Particle Background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={particleOptions}
      />

      {/* Background Effects */}
      <div className="noise-overlay" />
      <div className="scanlines" />
      <div className="vhs-tracking" />
      <div className="grid-background" />
      
      {/* Dynamic Background Components */}
      <GlitchBackground intensity={glitchIntensity} />
      <CyberGrid />
      {showNeuralNetwork && <NeuralNetworkViz intensity={glitchIntensity} />}
      <ThreeDScene />

      {/* Mouse Trail */}
      <AnimatePresence>
        {mouseTrail.map(trail => (
          <motion.div
            key={trail.id}
            initial={{ opacity: 0.8, scale: 1 }}
            animate={{ opacity: 0, scale: 0.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              position: 'fixed',
              left: trail.x - 5,
              top: trail.y - 5,
              width: '10px',
              height: '10px',
              background: '#00ffff',
              borderRadius: '50%',
              pointerEvents: 'none',
              zIndex: 20,
              boxShadow: '0 0 10px #00ffff',
            }}
          />
        ))}
      </AnimatePresence>

      {/* Main Content */}
      <div className="content-container">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            rotateX: glitchIntensity > 0.8 ? [0, 5, -5, 0] : 0,
            rotateY: glitchIntensity > 0.8 ? [0, -2, 2, 0] : 0,
          }}
          transition={{ duration: 1 }}
          style={{
            perspective: '1000px',
            transformStyle: 'preserve-3d',
          }}
        >
          <h1 
            className="glitch-text" 
            data-text={systemStatus}
            style={{
              transform: `translateZ(${glitchIntensity * 50}px)`,
            }}
          >
            {systemStatus}
          </h1>
        </motion.div>

        <DistortedText 
          text="Neural pathways compromised. Reality matrix unstable. Welcome to the digital void."
          intensity={glitchIntensity}
        />

        <div className="flicker">
          <p className="corrupted-text" data-text="System integrity failing">
            System integrity: {Math.floor((1 - glitchIntensity) * 100)}%
          </p>
        </div>

        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <motion.button
            className="distress-button"
            whileHover={{ scale: 1.05, rotateZ: 2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setGlitchIntensity(Math.min(glitchIntensity + 0.2, 1))}
          >
            INCREASE CHAOS
          </motion.button>

          <motion.button
            className="distress-button"
            whileHover={{ scale: 1.05, rotateZ: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowGame(!showGame)}
          >
            {showGame ? 'EXIT GAME' : 'DATA RESCUE'}
          </motion.button>

          <motion.button
            className="distress-button"
            whileHover={{ scale: 1.05, rotateZ: 2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNeuralNetwork(!showNeuralNetwork)}
          >
            {showNeuralNetwork ? 'HIDE NEURAL' : 'SHOW NEURAL'}
          </motion.button>
        </div>

        <div style={{ 
          marginTop: '2rem', 
          fontSize: '0.8rem', 
          color: '#666', 
          fontFamily: 'monospace',
          textAlign: 'center'
        }}>
          <p>Keyboard shortcuts: Ctrl+G (glitch), F1-F4 (toggles), F12 (reboot), ESC (emergency)</p>
          <p>Game Score: {gameScore} | Mouse: ({mouse.docX}, {mouse.docY})</p>
        </div>

        {/* Dynamic Error Messages */}
        <AnimatePresence>
          {errorMessages.map((msg, index) => (
            <motion.div
              key={`${msg}-${index}`}
              className="error-message"
              initial={{ opacity: 0, x: -100, rotateX: -90 }}
              animate={{ opacity: 1, x: 0, rotateX: 0 }}
              exit={{ opacity: 0, x: 100, rotateX: 90 }}
              transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
            >
              {msg}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Interactive Components */}
      {showTerminal && <InteractiveTerminal />}
      {showAudioVisualizer && (
        <AudioVisualizer 
          isActive={showAudioVisualizer} 
          intensity={glitchIntensity} 
        />
      )}
      <DataCorruptionGame 
        isActive={showGame}
        onScoreChange={setGameScore}
      />

      {/* Reboot Overlay */}
      <AnimatePresence>
        {isRebootMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(0, 0, 0, 0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
            }}
          >
            <div className="glitch-text" data-text="REBOOTING SYSTEM...">
              REBOOTING SYSTEM...
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App