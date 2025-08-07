import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface DistortedTextProps {
  text: string
  intensity: number
}

const DistortedText: React.FC<DistortedTextProps> = ({ text, intensity }) => {
  const [distortedText, setDistortedText] = useState(text)
  
  useEffect(() => {
    if (intensity === 0) {
      setDistortedText(text)
      return
    }

    const interval = setInterval(() => {
      const chars = text.split('')
      const distorted = chars.map((char, index) => {
        if (Math.random() < intensity * 0.1) {
          const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`'
          return glitchChars[Math.floor(Math.random() * glitchChars.length)]
        }
        return char
      }).join('')
      
      setDistortedText(distorted)
    }, 100)

    return () => clearInterval(interval)
  }, [text, intensity])

  return (
    <motion.div
      style={{
        fontSize: '1.5rem',
        color: '#f0f0f0',
        fontFamily: 'Orbitron, monospace',
        textAlign: 'center',
        position: 'relative',
        padding: '1rem',
      }}
      animate={{
        x: intensity > 0.5 ? [0, -2, 2, -1, 1, 0] : 0,
        filter: `hue-rotate(${intensity * 360}deg)`,
      }}
      transition={{
        x: {
          duration: 0.2,
          repeat: Infinity,
          repeatType: 'reverse',
        },
        filter: {
          duration: 2,
        },
      }}
    >
      <span
        style={{
          display: 'inline-block',
          textShadow: `
            ${intensity * 2}px 0 rgba(255, 0, 255, 0.5),
            ${-intensity * 2}px 0 rgba(0, 255, 255, 0.5)
          `,
        }}
      >
        {distortedText}
      </span>
      {intensity > 0.7 && (
        <>
          <span
            style={{
              position: 'absolute',
              top: '1rem',
              left: '1rem',
              right: '1rem',
              opacity: 0.3,
              color: '#ff00ff',
              transform: `translateX(${intensity * 5}px)`,
            }}
          >
            {text}
          </span>
          <span
            style={{
              position: 'absolute',
              top: '1rem',
              left: '1rem',
              right: '1rem',
              opacity: 0.3,
              color: '#00ffff',
              transform: `translateX(${-intensity * 5}px)`,
            }}
          >
            {text}
          </span>
        </>
      )}
    </motion.div>
  )
}

export default DistortedText