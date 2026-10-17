import { ContactShadows, Float, OrbitControls } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

function SignalObject({ reducedMotion }) {
  const assembly = useRef()
  const outerRing = useRef()
  const innerRing = useRef()
  const { pointer } = useThree()

  useFrame((state, delta) => {
    if (!assembly.current || reducedMotion) return
    assembly.current.rotation.y = THREE.MathUtils.damp(
      assembly.current.rotation.y,
      pointer.x * 0.34,
      3.5,
      delta,
    )
    assembly.current.rotation.x = THREE.MathUtils.damp(
      assembly.current.rotation.x,
      -pointer.y * 0.18,
      3.5,
      delta,
    )
    outerRing.current.rotation.z += delta * 0.12
    innerRing.current.rotation.z -= delta * 0.22
    assembly.current.position.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.07
  })

  const nodes = Array.from({ length: 8 }, (_, index) => {
    const angle = (index / 8) * Math.PI * 2
    return [Math.cos(angle) * 1.73, Math.sin(angle) * 1.73, 0]
  })

  return (
    <group ref={assembly} rotation={[0.08, -0.12, -0.08]}>
      <Float speed={reducedMotion ? 0 : 1.3} floatIntensity={0.2} rotationIntensity={0.08}>
        <mesh castShadow>
          <icosahedronGeometry args={[0.88, 1]} />
          <meshStandardMaterial color="#ff6846" roughness={0.32} metalness={0.1} />
        </mesh>
        <mesh scale={0.69}>
          <icosahedronGeometry args={[0.88, 1]} />
          <meshStandardMaterial color="#10110e" roughness={0.68} />
        </mesh>

        <group ref={outerRing} rotation={[1.2, 0.2, 0]}>
          <mesh castShadow>
            <torusGeometry args={[1.72, 0.055, 12, 96]} />
            <meshStandardMaterial color="#d6ff3f" roughness={0.25} emissive="#7c9b16" emissiveIntensity={0.65} />
          </mesh>
          {nodes.map((position, index) => (
            <mesh key={index} position={position}>
              <sphereGeometry args={[index % 2 ? 0.075 : 0.12, 14, 14]} />
              <meshStandardMaterial color={index % 2 ? '#f0eadc' : '#d6ff3f'} roughness={0.35} />
            </mesh>
          ))}
        </group>

        <group ref={innerRing} rotation={[0.2, 0.9, 0.4]}>
          <mesh>
            <torusGeometry args={[1.25, 0.025, 10, 72]} />
            <meshStandardMaterial color="#f0eadc" roughness={0.3} metalness={0.7} />
          </mesh>
          <mesh position={[1.25, 0, 0]}>
            <boxGeometry args={[0.38, 0.18, 0.18]} />
            <meshStandardMaterial color="#f0eadc" roughness={0.25} />
          </mesh>
        </group>

        <mesh rotation={[0.4, 0.2, 0.2]}>
          <torusGeometry args={[2.12, 0.012, 8, 96]} />
          <meshBasicMaterial color="#67685f" transparent opacity={0.55} />
        </mesh>
      </Float>
    </group>
  )
}

function ReadySignal({ onReady }) {
  useEffect(() => onReady(), [onReady])
  return null
}

export default function HeroScene({ reducedMotion, onReady }) {
  return (
    <Canvas
      camera={{ position: [0, 0.2, 6.4], fov: 35 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      shadows
    >
      <color attach="background" args={['#191a16']} />
      <fog attach="fog" args={['#191a16', 7, 11]} />
      <ambientLight intensity={0.55} />
      <directionalLight castShadow position={[4, 5, 5]} intensity={3.8} color="#fff5df" shadow-mapSize={[1024, 1024]} />
      <pointLight position={[-3, -1, 2]} intensity={18} distance={8} decay={2} color="#d6ff3f" />
      <pointLight position={[2, -2, 1]} intensity={14} distance={6} decay={2} color="#ff6846" />
      <SignalObject reducedMotion={reducedMotion} />
      <ContactShadows position={[0, -2.35, 0]} opacity={0.42} scale={7} blur={2.7} far={4} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 2.5}
        maxPolarAngle={Math.PI / 1.65}
        rotateSpeed={0.45}
      />
      <ReadySignal onReady={onReady} />
    </Canvas>
  )
}
