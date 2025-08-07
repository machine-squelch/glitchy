import { useEffect } from 'react'

interface KeyboardShortcuts {
  onGlitchIncrease: () => void
  onTerminalToggle: () => void
  onAudioToggle: () => void
  onGameToggle: () => void
  onNeuralToggle: () => void
  onReboot: () => void
  onEmergencyStop: () => void
}

export const useKeyboardShortcuts = ({
  onGlitchIncrease,
  onTerminalToggle,
  onAudioToggle,
  onGameToggle,
  onNeuralToggle,
  onReboot,
  onEmergencyStop,
}: KeyboardShortcuts) => {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Prevent default browser shortcuts
      if (event.ctrlKey || event.metaKey) {
        switch (event.key.toLowerCase()) {
          case 'g':
            event.preventDefault()
            onGlitchIncrease()
            break
          case 't':
            event.preventDefault()
            onTerminalToggle()
            break
          case 'a':
            event.preventDefault()
            onAudioToggle()
            break
          case 'p':
            event.preventDefault()
            onGameToggle()
            break
          case 'n':
            event.preventDefault()
            onNeuralToggle()
            break
          case 'r':
            event.preventDefault()
            onReboot()
            break
          case 'e':
            event.preventDefault()
            onEmergencyStop()
            break
        }
      }

      // Function keys
      switch (event.key) {
        case 'F1':
          event.preventDefault()
          onTerminalToggle()
          break
        case 'F2':
          event.preventDefault()
          onAudioToggle()
          break
        case 'F3':
          event.preventDefault()
          onGameToggle()
          break
        case 'F4':
          event.preventDefault()
          onNeuralToggle()
          break
        case 'F9':
          event.preventDefault()
          onGlitchIncrease()
          break
        case 'F12':
          event.preventDefault()
          onReboot()
          break
        case 'Escape':
          event.preventDefault()
          onEmergencyStop()
          break
      }

      // Secret konami code: ↑ ↑ ↓ ↓ ← → ← → B A
      const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 
                         'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA']
      
      if (!window.konamiSequence) window.konamiSequence = []
      window.konamiSequence.push(event.code)
      
      if (window.konamiSequence.length > konamiCode.length) {
        window.konamiSequence = window.konamiSequence.slice(-konamiCode.length)
      }
      
      if (window.konamiSequence.join(',') === konamiCode.join(',')) {
        // Activate god mode
        document.body.style.animation = 'rainbow 1s infinite'
        setTimeout(() => {
          document.body.style.animation = ''
        }, 5000)
        window.konamiSequence = []
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [
    onGlitchIncrease,
    onTerminalToggle,
    onAudioToggle,
    onGameToggle,
    onNeuralToggle,
    onReboot,
    onEmergencyStop,
  ])
}

// Global types
declare global {
  interface Window {
    konamiSequence: string[]
  }
}

export default useKeyboardShortcuts