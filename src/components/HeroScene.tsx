"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, Float, Stars } from "@react-three/drei";
import * as THREE from "three";

// 1. SHARP INFINITE GRID
// We use a custom shader on a plane to get perfectly sharp lines that don't aliasing badly
const GridFloor = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
      <planeGeometry args={[50, 50, 50, 50]} />
      <meshBasicMaterial
        color="#F4D03F"
        wireframe
        transparent
        opacity={0.15}
      />
    </mesh>
  );
};

// 2. INTERACTIVE DATA BLOCKS
// Sharp, rotating cubes/wireframes that react to mouse
const DataBlock = ({ position, color, speed, rotSpeed }: { position: [number, number, number], color: string, speed: number, rotSpeed: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;

    // Rotate
    meshRef.current.rotation.x = t * rotSpeed;
    meshRef.current.rotation.y = t * rotSpeed * 0.5;

    // Float
    meshRef.current.position.y = position[1] + Math.sin(t * speed) * 0.5;

    // Mouse interaction (subtle look-at or repel could be added here)
  });

  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position}>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.3} />
      </mesh>
      {/* Inner solid core for sharpness */}
      <mesh position={position} scale={[0.4, 0.4, 0.4]}>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshBasicMaterial color={color} transparent opacity={0.8} />
      </mesh>
    </Float>
  );
};

// 3. MOVING DATA STREAMS (PARTICLES)
// Sharp points moving fast in lines
const DataStream = () => {
  const count = 100;
  const meshRef = useRef<THREE.Points>(null);

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20; // x
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10; // y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10; // z
      spd[i] = 0.05 + Math.random() * 0.1;
    }
    return [pos, spd];
  }, []);

  useFrame(() => {
    if (!meshRef.current) return;
    const positionsAttr = meshRef.current.geometry.attributes.position as THREE.BufferAttribute;

    for (let i = 0; i < count; i++) {
      let y = positionsAttr.getY(i);
      y += speeds[i];

      if (y > 5) {
        y = -5;
      }

      positionsAttr.setY(i, y);
    }
    positionsAttr.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#059669" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
};

export default function HeroScene() {
  // Mouse movement interaction for camera
  const MouseTracker = () => {
    useFrame((state) => {
      const { x, y } = state.pointer;
      // Subtle parallax
      state.camera.position.x += (x * 0.5 - state.camera.position.x) * 0.05;
      state.camera.position.y += (y * 0.5 - state.camera.position.y) * 0.05;
      state.camera.lookAt(0, 0, 0);
    });
    return null;
  };

  return (
    <div className="absolute inset-0 z-0 h-full w-full opacity-80">
      <Canvas
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
        <MouseTracker />

        {/* Lights */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#F4D03F" />

        {/* Elements */}
        <GridFloor />

        {/* Floating Tech Objects */}
        <DataBlock position={[-3, 1, -2]} color="#F4D03F" speed={1.5} rotSpeed={0.4} />
        <DataBlock position={[3.5, -1, -1]} color="#059669" speed={1.2} rotSpeed={0.3} />
        <DataBlock position={[0, 2, -4]} color="#FF6B6B" speed={0.8} rotSpeed={0.2} />

        {/* Particles */}
        <DataStream />
        <Stars radius={50} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />

        {/* Fog to hide grid edges */}
        <fog attach="fog" args={['#000000', 5, 20]} />
      </Canvas>
    </div>
  );
}
