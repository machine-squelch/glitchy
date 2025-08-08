# Claude Project Context

## Project Overview
This is a cyberpunk-themed distressed UI React application featuring advanced visual effects and interactive components.

## Key Features
- **Particle Network Background**: Interactive particle system using react-particles/tsparticles
- **Glitch Effects**: Custom glitch text animations with RGB color splitting
- **CRT-style Effects**: Scanlines, VHS tracking, and noise overlays
- **Dynamic Components**:
  - `GlitchBackground`: Animated glitch canvas effects
  - `CyberGrid`: Perspective grid with wave animations
  - `DistortedText`: Text corruption effects based on intensity
- **Responsive Interactions**: Mouse-reactive particles and hover effects

## Tech Stack
- React 18 with TypeScript
- Vite for build tooling
- Framer Motion for animations
- TSParticles for particle effects
- DigitalOcean App Platform for deployment

## Development Commands
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## Deployment Configuration
- **Platform**: DigitalOcean App Platform (Static Site)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Important**: Vite and @vitejs/plugin-react must be in dependencies (not devDependencies) for DigitalOcean builds

## Project Structure
```
src/
├── App.tsx                         # Main app component with particle system
├── App.css                         # Glitch effects, buttons, animations
├── index.css                       # Global styles and initial animations
├── components/
│   ├── GlitchBackground.tsx      # Canvas-based glitch effects
│   ├── CyberGrid.tsx              # Animated perspective grid
│   └── DistortedText.tsx          # Text corruption component
```

## Design Philosophy
- Cyberpunk aesthetic with neon colors (#ff00ff, #00ffff, #ffff00)
- Distressed/corrupted visual theme
- Interactive but not overwhelming
- Performance-conscious animations

## Common Issues & Solutions
1. **DigitalOcean Build Failures**: Ensure build tools (vite, typescript) are in dependencies
2. **Type Errors**: TypeScript strict mode is disabled for easier deployment
3. **Static Site Deployment**: Must be configured as Static Site, not Web Service

## Future Enhancements
- Additional glitch shaders
- More interactive elements
- Sound effects integration
- Advanced particle behaviors

## Notes for Claude
- Keep the visual effects balanced - impressive but not overwhelming
- Maintain the cyberpunk aesthetic throughout any changes
- Prioritize smooth performance over complex effects
- The simpler deployment configuration is preferred over complex Node.js setups