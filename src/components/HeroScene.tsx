"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Vertex Shader: Handles the mesh deformation (waves)
const vertexShader = `
varying vec2 vUv;
varying float vElevation;
uniform float uTime;

void main() {
  vUv = uv;
  
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  
  // Create gentle waves
  float elevation = sin(modelPosition.x * 0.5 + uTime * 0.2) * 
                    sin(modelPosition.y * 0.3 + uTime * 0.1) * 0.5;
                    
  // Add some complexity
  elevation += sin(modelPosition.x * 2.0 + uTime * 0.5) * 0.1;
  elevation += sin(modelPosition.y * 1.5 + uTime * 0.4) * 0.1;

  modelPosition.z += elevation;
  
  vElevation = elevation;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;
}
`;

// Fragment Shader: Handles the color mixing (Gold, Emerald, Coral)
const fragmentShader = `
varying vec2 vUv;
varying float vElevation;
uniform float uTime;

void main() {
  // Premium Palette Colors
  vec3 colorGold = vec3(0.957, 0.816, 0.247);    // #F4D03F
  vec3 colorEmerald = vec3(0.02, 0.588, 0.412);  // #059669
  vec3 colorCoral = vec3(1.0, 0.42, 0.42);       // #FF6B6B
  vec3 colorBlack = vec3(0.02, 0.02, 0.02);      // #050505 (Deep background)

  // Mix factor based on UV and elevation
  float mixStrength = vElevation * 2.0 + 0.5;
  
  // Creating the Aurora
  vec3 color1 = mix(colorBlack, colorEmerald, smoothstep(0.0, 1.0, vUv.y + sin(uTime * 0.2) * 0.3));
  vec3 color2 = mix(color1, colorGold, smoothstep(0.0, 0.8, sin(vUv.x * 2.0 + uTime * 0.2) * mixStrength));
  vec3 finalColor = mix(color2, colorCoral, smoothstep(0.0, 1.0, vElevation * 1.5));

  // Add subtle glow/grain
  float grain = fract(sin(dot(vUv, vec2(12.9898, 78.233))) * 43758.5453);
  finalColor += grain * 0.03;

  gl_FragColor = vec4(finalColor, 0.7); // Slightly transparent
}
`;

function AuroraMesh() {
  const meshRef = useRef<THREE.Mesh>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
    }),
    []
  );

  useFrame((state) => {
    if (meshRef.current) {
      uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 4, 0, 0]} position={[0, -1, -2]}>
      {/* High segment count for smooth waves */}
      <planeGeometry args={[14, 8, 128, 128]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function HeroScene() {
  return (
    <div className="absolute inset-0 z-0 h-full w-full overflow-hidden opacity-60">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <AuroraMesh />
      </Canvas>
    </div>
  );
}
