import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Particles from 'react-particles'
import { loadSlim } from 'tsparticles-slim'
import type { Container, Engine } from 'tsparticles-engine'
import './App.css'
import GlitchBackground from './components/GlitchBackground'
import DistortedText from './components/DistortedText'
import CyberGrid from './components/CyberGrid'

function App() {
  const [systemStatus, setSystemStatus] = useState('INITIALIZING')
  const [glitchIntensity, setGlitchIntensity] = useState(0)
  const [errorMessages, setErrorMessages] = useState<string[]>([])

  useEffect(() => {
    const timer = setTimeout(() => {
      setSystemStatus('SYSTEM_UNSTABLE')
      setGlitchIntensity(1)
    }, 2000)

    const glitchTimer = setInterval(() => {
      setGlitchIntensity(Math.random())
      if (Math.random() > 0.7) {
        const errors = [
          'Memory corruption detected at 0x' + Math.random().toString(16).substring(2, 8).toUpperCase(),
          'Reality matrix desynchronized',
          'Consciousness overflow in sector ' + Math.floor(Math.random() * 999),
          'Neural interface disconnected',
          'Time paradox detected',
          'Quantum entanglement unstable'
        ]
        setErrorMessages(prev => [...prev.slice(-2), errors[Math.floor(Math.random() * errors.length)]])
      }
    }, 3000)

    return () => {
      clearTimeout(timer)
      clearInterval(glitchTimer)
    }
  }, [])

  const particlesInit = async (engine: Engine) => {
    await loadSlim(engine)
  }

  const particlesLoaded = async (container?: Container) => {
    console.log('Particles loaded', container)
  }

  return (
    <div className="app">
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          fullScreen: { enable: true, zIndex: 0 },
          background: {
            color: { value: "#0a0a0a" },
          },
          fpsLimit: 120,
          particles: {
            color: { value: ["#ff00ff", "#00ffff", "#ffff00"] },
            links: {
              color: "#00ffff",
              distance: 150,
              enable: true,
              opacity: 0.2,
              width: 1,
            },
            move: {
              enable: true,
              speed: 1,
              direction: "none",
              random: true,
              straight: false,
              outModes: { default: "bounce" },
            },
            number: {
              density: { enable: true, area: 800 },
              value: 80,
            },
            opacity: {
              value: { min: 0.1, max: 0.5 },
              animation: {
                enable: true,
                speed: 1,
                minimumValue: 0.1,
              },
            },
            shape: { type: "circle" },
            size: {
              value: { min: 1, max: 3 },
              animation: {
                enable: true,
                speed: 2,
                minimumValue: 0.1,
              },
            },
          },
          interactivity: {
            events: {
              onClick: { enable: true, mode: "push" },
              onHover: { enable: true, mode: "repulse" },
            },
            modes: {
              push: { quantity: 4 },
              repulse: { distance: 100, duration: 0.4 },
            },
          },
          detectRetina: true,
        }}
      />

      <div className="noise-overlay" />
      <div className="scanlines" />
      <div className="vhs-tracking" />
      <div className="grid-background" />
      
      <GlitchBackground intensity={glitchIntensity} />
      <CyberGrid />

      <div className="content-container">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="glitch-text" data-text={systemStatus}>
            {systemStatus}
          </h1>
        </motion.div>

        <DistortedText 
          text="Reality is fragmenting. System integrity compromised."
          intensity={glitchIntensity}
        />

        <div className="flicker">
          <p className="corrupted-text" data-text="Neural pathways disconnected">
            Neural pathways disconnected
          </p>
        </div>

        <motion.button
          className="distress-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setGlitchIntensity(Math.min(glitchIntensity + 0.2, 1))
            setErrorMessages(prev => [...prev, 'Manual override attempted'])
          }}
        >
          INCREASE DISTORTION
        </motion.button>

        <AnimatePresence>
          {errorMessages.map((msg, index) => (
            <motion.div
              key={`${msg}-${index}`}
              className="error-message"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.3 }}
            >
              {msg}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default App