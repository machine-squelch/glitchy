import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Float, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { motion } from 'framer-motion'

function ParticleField() {
  const points = useRef<THREE.Points>(null!)
  const { mouse } = useThree()
  
  const particlesCount = 5000
  const positions = useMemo(() => {
    const positions = new Float32Array(particlesCount * 3)
    for (let i = 0; i < particlesCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 10
      positions[i + 1] = (Math.random() - 0.5) * 10
      positions[i + 2] = (Math.random() - 0.5) * 10
    }
    return positions
  }, [])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    points.current.rotation.x = time * 0.1
    points.current.rotation.y = time * 0.15
    
    // React to mouse
    points.current.rotation.x += mouse.y * 0.1
    points.current.rotation.y += mouse.x * 0.1
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#00ffff"
        sizeAttenuation
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

function GlitchSphere() {
  const mesh = useRef<THREE.Mesh>(null!)
  const { mouse } = useThree()
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    mesh.current.rotation.x = time * 0.2
    mesh.current.rotation.y = time * 0.3
    mesh.current.position.x = Math.sin(time) * 0.5 + mouse.x * 0.5
    mesh.current.position.y = Math.cos(time) * 0.5 + mouse.y * 0.5
  })

  return (
    <Float speed={2} rotationIntensity={2} floatIntensity={2}>
      <mesh ref={mesh}>
        <sphereGeometry args={[1, 32, 32]} />
        <MeshDistortMaterial
          color="#ff00ff"
          attach="material"
          distort={0.5}
          speed={2}
          roughness={0.2}
          metalness={0.8}
          emissive="#ff00ff"
          emissiveIntensity={0.5}
        />
      </mesh>
    </Float>
  )
}

function DataStreams() {
  const mesh = useRef<THREE.InstancedMesh>(null!)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  
  const count = 100
  const positions = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      temp.push({
        x: (Math.random() - 0.5) * 10,
        y: (Math.random() - 0.5) * 10,
        z: (Math.random() - 0.5) * 10,
        speed: Math.random() * 0.5 + 0.5,
      })
    }
    return temp
  }, [])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    positions.forEach((pos, i) => {
      dummy.position.set(
        pos.x,
        pos.y + Math.sin(time * pos.speed + i) * 0.5,
        pos.z
      )
      dummy.scale.setScalar(Math.sin(time * 2 + i) * 0.5 + 1)
      dummy.rotation.set(time * pos.speed, time * pos.speed, 0)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <boxGeometry args={[0.1, 2, 0.1]} />
      <meshStandardMaterial
        color="#00ffff"
        emissive="#00ffff"
        emissiveIntensity={0.5}
        transparent
        opacity={0.6}
      />
    </instancedMesh>
  )
}

const ThreeDScene: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 5,
        pointerEvents: 'none',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#ff00ff" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#00ffff" />
        
        <ParticleField />
        <GlitchSphere />
        <DataStreams />
        
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
        />
        
        <fog attach="fog" args={['#0a0a0a', 5, 15]} />
      </Canvas>
    </motion.div>
  )
}

export default ThreeDScene