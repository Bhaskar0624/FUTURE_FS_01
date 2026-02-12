"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars } from "@react-three/drei";
import * as THREE from "three";

function ParticleField() {
  const meshRef = useRef<THREE.Points>(null);
  const count = 800;

  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const siz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
      siz[i] = Math.random() * 2 + 0.5;
    }
    return [pos, siz];
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1;
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
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#c9a96e"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function FloatingGeo() {
  const torusRef = useRef<THREE.Mesh>(null);
  const octaRef = useRef<THREE.Mesh>(null);
  const icoRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (torusRef.current) {
      torusRef.current.rotation.x = t * 0.2;
      torusRef.current.rotation.y = t * 0.15;
    }
    if (octaRef.current) {
      octaRef.current.rotation.x = t * 0.15;
      octaRef.current.rotation.z = t * 0.1;
      octaRef.current.position.y = Math.sin(t * 0.5) * 0.3 + 1;
    }
    if (icoRef.current) {
      icoRef.current.rotation.y = t * 0.25;
      icoRef.current.position.y = Math.cos(t * 0.4) * 0.2 - 1.5;
    }
  });

  return (
    <>
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
        <mesh ref={torusRef} position={[-3, 0, -2]}>
          <torusGeometry args={[1, 0.3, 16, 40]} />
          <meshStandardMaterial
            color="#c9a96e"
            wireframe
            transparent
            opacity={0.15}
          />
        </mesh>
      </Float>

      <Float speed={1} rotationIntensity={0.5} floatIntensity={0.3}>
        <mesh ref={octaRef} position={[3.5, 1, -3]}>
          <octahedronGeometry args={[0.8]} />
          <meshStandardMaterial
            color="#6b7c5e"
            wireframe
            transparent
            opacity={0.2}
          />
        </mesh>
      </Float>

      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.8}>
        <mesh ref={icoRef} position={[2, -1.5, -1]}>
          <icosahedronGeometry args={[0.5]} />
          <meshStandardMaterial
            color="#c9a96e"
            wireframe
            transparent
            opacity={0.12}
          />
        </mesh>
      </Float>
    </>
  );
}

function MouseLight() {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (!lightRef.current) return;
    const { x, y } = state.pointer;
    lightRef.current.position.x = x * 5;
    lightRef.current.position.y = y * 3;
    lightRef.current.position.z = 3;
  });

  return <pointLight ref={lightRef} intensity={0.8} color="#c9a96e" distance={15} />;
}

export default function HeroScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.15} />
        <directionalLight position={[5, 5, 5]} intensity={0.3} color="#e8e4de" />
        <MouseLight />
        <ParticleField />
        <FloatingGeo />
        <Stars
          radius={50}
          depth={50}
          count={1000}
          factor={2}
          fade
          speed={0.5}
        />
      </Canvas>
    </div>
  );
}
