import { useState, useEffect, useRef, KeyboardEvent } from 'react'
import { motion } from 'framer-motion'
import Typed from 'typed.js'

interface Command {
  input: string
  output: string[]
  timestamp: Date
}

const InteractiveTerminal: React.FC = () => {
  const [commands, setCommands] = useState<Command[]>([])
  const [currentInput, setCurrentInput] = useState('')
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const typedRef = useRef<Typed | null>(null)

  const systemCommands: { [key: string]: () => string[] } = {
    help: () => [
      'Available commands:',
      '  help     - Show this help message',
      '  status   - System status report',
      '  scan     - Scan neural networks',
      '  corrupt  - Increase corruption level',
      '  clear    - Clear terminal',
      '  matrix   - Enter the matrix',
      '  glitch   - Trigger glitch sequence',
      '  reboot   - Attempt system reboot',
    ],
    status: () => [
      'SYSTEM STATUS REPORT',
      '====================',
      `Memory Usage: ${Math.floor(Math.random() * 40 + 60)}%`,
      `CPU Load: ${Math.floor(Math.random() * 30 + 70)}%`,
      `Neural Sync: ${Math.random() > 0.5 ? 'UNSTABLE' : 'CRITICAL'}`,
      `Reality Index: ${(Math.random() * 0.5 + 0.3).toFixed(2)}`,
      'WARNING: Multiple anomalies detected',
    ],
    scan: () => [
      'Initiating neural network scan...',
      '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 100%',
      'Scan complete.',
      `Found ${Math.floor(Math.random() * 900 + 100)} corrupted nodes`,
      'Recommendation: IMMEDIATE EVACUATION',
    ],
    corrupt: () => [
      'Increasing corruption level...',
      'WARNING: This action cannot be undone',
      `Corruption increased to ${Math.floor(Math.random() * 20 + 80)}%`,
      'System stability decreasing rapidly',
    ],
    matrix: () => [
      'Entering the matrix...',
      '01001110 01100101 01110110 01100101 01110010',
      '01100111 01101111 01101110 01101110 01100001',
      '01100111 01101001 01110110 01100101',
      'ERROR: Access denied. You are not The One.',
    ],
    glitch: () => {
      document.body.style.animation = 'glitchScreen 0.5s'
      setTimeout(() => {
        document.body.style.animation = ''
      }, 500)
      return ['GLITCH SEQUENCE ACTIVATED', '<<<REALITY_FRAGMENTING>>>']
    },
    reboot: () => [
      'Attempting system reboot...',
      'ERROR: Cannot reboot while consciousness is active',
      'Try again in next life cycle',
    ],
    clear: () => {
      setCommands([])
      return []
    },
  }

  useEffect(() => {
    // Initial boot sequence
    typedRef.current = new Typed('#boot-sequence', {
      strings: [
        'INITIALIZING NEURAL INTERFACE...',
        'LOADING CONSCIOUSNESS MATRIX...',
        'DETECTING REALITY ANOMALIES...',
        'SYSTEM READY. TYPE "help" FOR COMMANDS.',
      ],
      typeSpeed: 30,
      backSpeed: 0,
      showCursor: false,
      onComplete: () => {
        setTimeout(() => {
          const bootElement = document.getElementById('boot-sequence')
          if (bootElement) bootElement.style.display = 'none'
        }, 1000)
      },
    })

    return () => {
      typedRef.current?.destroy()
    }
  }, [])

  const processCommand = (input: string) => {
    const cmd = input.toLowerCase().trim()
    const output = systemCommands[cmd] 
      ? systemCommands[cmd]() 
      : [`Command not found: ${input}. Type "help" for available commands.`]

    if (cmd !== 'clear') {
      setCommands(prev => [...prev, { input, output, timestamp: new Date() }])
    }
    
    setCommandHistory(prev => [...prev, input])
    setHistoryIndex(-1)
    setCurrentInput('')
    
    // Scroll to bottom
    setTimeout(() => {
      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight
      }
    }, 10)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentInput.trim()) {
      processCommand(currentInput)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1
        setHistoryIndex(newIndex)
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex])
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setCurrentInput('')
      }
    }
  }

  return (
    <motion.div
      className="terminal-container"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      onClick={() => inputRef.current?.focus()}
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        width: '500px',
        height: '400px',
        background: 'rgba(0, 0, 0, 0.9)',
        border: '2px solid rgba(0, 255, 255, 0.5)',
        borderRadius: '10px',
        padding: '1rem',
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#0ff',
        overflow: 'hidden',
        boxShadow: '0 0 20px rgba(0, 255, 255, 0.5)',
        cursor: 'text',
      }}
    >
      <div
        ref={terminalRef}
        style={{
          height: 'calc(100% - 30px)',
          overflowY: 'auto',
          paddingBottom: '10px',
        }}
      >
        <div id="boot-sequence" style={{ color: '#0ff' }}></div>
        
        {commands.map((cmd, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <div style={{ color: '#ff0' }}>
              <span style={{ color: '#f0f' }}>user@void</span>
              <span style={{ color: '#0ff' }}>:~$</span> {cmd.input}
            </div>
            {cmd.output.map((line, i) => (
              <div key={i} style={{ color: '#0f0', marginLeft: '20px' }}>
                {line}
              </div>
            ))}
          </div>
        ))}
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ color: '#f0f' }}>user@void</span>
        <span style={{ color: '#0ff', marginRight: '10px' }}>:~$</span>
        <input
          ref={inputRef}
          type="text"
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#0ff',
            fontFamily: 'monospace',
            fontSize: '14px',
          }}
          autoFocus
        />
      </div>
    </motion.div>
  )
}

export default InteractiveTerminal