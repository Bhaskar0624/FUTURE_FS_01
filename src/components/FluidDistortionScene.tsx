"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// --------------------------------------------------------
// SHADERS
// --------------------------------------------------------

const vertexShader = `
varying vec2 vUv;
varying float vElevation;
uniform float uTime;
uniform vec2 uMouse;
uniform float uHoverState;

void main() {
  vUv = uv;
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  // Distance from mouse for interactive ripple
  float dist = distance(uMouse, modelPosition.xy);
  float ripple = sin(dist * 10.0 - uTime * 2.0) * exp(-dist * 2.0) * uHoverState;

  // Base liquid movement
  float elevation = sin(modelPosition.x * 2.0 + uTime * 0.5) * 
                    sin(modelPosition.y * 2.0 + uTime * 0.3) * 0.2;

  // Combine
  modelPosition.z += elevation + ripple * 0.5;
  vElevation = elevation + ripple;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  gl_Position = projectedPosition;
}
`;

const fragmentShader = `
varying vec2 vUv;
varying float vElevation;
uniform float uTime;

  // MONOCHROME PALETTE (Shoya Style)
  vec3 black = vec3(0.0);
  vec3 white = vec3(1.0);
  vec3 gray = vec3(0.5);

  // Dynamic mixing based on elevation and time
  float mixStrength = smoothstep(-0.2, 0.5, vElevation);
  
  // Base flow (Dark, smooth liquid)
  vec3 colorA = mix(black, vec3(0.1), sin(vUv.x * 3.0 + uTime) * 0.2);
  vec3 colorB = mix(colorA, gray, mixStrength * 0.5);
  
  // Highlights (White reflections)
  vec3 finalColor = mix(colorB, white, smoothstep(0.4, 0.6, vElevation));
  
  // Metallic shimmer
  finalColor += vec3(0.05) * sin(vElevation * 20.0 + uTime * 5.0);

  gl_FragColor = vec4(finalColor, 1.0);
}
`;

// --------------------------------------------------------
// MESH COMPONENT
// --------------------------------------------------------

function LiquidPlane() {
    const meshRef = useRef<THREE.Mesh>(null);

    // Uniforms used in shaders
    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
            uMouse: { value: new THREE.Vector2(0, 0) },
            uHoverState: { value: 0 },
        }),
        []
    );

    useFrame((state) => {
        if (!meshRef.current) return;
        const { clock, pointer } = state;

        // Update uniform values
        uniforms.uTime.value = clock.getElapsedTime();

        // Smooth mouse movement for shader
        uniforms.uMouse.value.lerp(new THREE.Vector2(pointer.x * 5, pointer.y * 5), 0.1);

        // Smooth hover intensity (0 to 1)
        // Simply keeping it 1 for continuous effect here, controlled by distance in shader
        uniforms.uHoverState.value = THREE.MathUtils.lerp(uniforms.uHoverState.value, 1, 0.05);
    });

    return (
        <mesh ref={meshRef} position={[0, 0, 0]} scale={[1.5, 1.5, 1.5]}>
            <planeGeometry args={[10, 10, 128, 128]} />
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
            // transparent={true}
            // wireframe={true} // Uncomment for a "Cyber" liquid look
            />
        </mesh>
    );
}

// --------------------------------------------------------
// MAIN SCENE
// --------------------------------------------------------

export default function FluidDistortionScene() {
    return (
        <div className="fixed inset-0 z-0 h-full w-full pointer-events-none">
            <Canvas
                camera={{ position: [0, 0, 2], fov: 75 }}
                gl={{ antialias: true, alpha: true }}
                dpr={[1, 2]} // Support high-DPI screens
            >
                <LiquidPlane />
            </Canvas>
        </div>
    );
}
