import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'

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

  return (
    <div className="app">
      <div className="noise-overlay" />
      <div className="scanlines" />
      <div className="vhs-tracking" />
      <div className="grid-background" />

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