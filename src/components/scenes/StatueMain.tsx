"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function StatueMain() {
  const plane = useRef<THREE.Mesh>(null!);
  const sphere = useRef<THREE.Mesh>(null!);

  const uniforms = useRef({
    uTime: { value: 0 },
    uSpeed: { value : 0.05 }
  }).current;

  const vertexShader = `
varying vec2 vUv;
void main() {
    vUv = uv;
    vec4 position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_Position = position;
}
  `;
  
  const fragmentShader = `
uniform float uTime;
uniform float uSpeed; // Master speed control
varying vec2 vUv;

#define COL_BASE vec3(0.0,0.0,0.01)
#define COL_CONT vec3(0.11372549019607843,0.38823529411764707,0.4196078431372549)
#define COL_FREQ vec3(1.,1.,1.)
#define COL_PHAS vec3(1.,0.,1.)

#define ROT_SPEED 0.4
#define WARP_INIT 1.
#define WARP_ITER 6.
#define WARP_AMPL 1.3

vec3 palette(float t) {
    return COL_BASE + COL_CONT * cos(radians(360.0) * (t * COL_FREQ + COL_PHAS));
}

vec2 rotate(vec2 uv, float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat2(c, -s, s, c) * uv;
}

vec2 curl(vec2 p, float time) {
    float n1 = sin(p.y + time * 0.3) + cos(p.x - time * 0.5);
    float n2 = cos(p.x + time * 0.2) - sin(p.y - time * 0.4);
    return vec2(n1, n2) * 0.15;
}

vec2 warp(vec2 uv, float time) {
    for(float i = WARP_INIT; i < WARP_ITER; i++) {
        float freq = i * 0.8 + sin(time * 0.3) * 0.5;
        uv += WARP_AMPL / i * vec2(
            sin(freq * uv.y + time * 0.6),
            cos(freq * uv.x - time * 0.5)
        );
        uv += curl(uv * (0.5 + 0.1*i), time);
    }
    return uv;
}

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

void main() {
    // Apply speed scaling
    float time = uTime * uSpeed;

    vec2 uv = (2.0 * vUv - 1.0);
    float aspect = 10.0 / 6.0;
    uv.x *= aspect;

    uv = rotate(uv, time * ROT_SPEED);

    // Warped UV for fluid dynamics
    vec2 warpedUV = warp(uv, time);

    // Color from palette
    float t = abs(sin(time - warpedUV.y * 0.8 - warpedUV.x * 0.6));
    vec3 baseColor = palette(t);

    // Dynamic brightness variation
    float brightness = 1.0 + 0.25 * sin(warpedUV.x * 3.0 + time) * cos(warpedUV.y * 3.0 - time);
    vec3 color = baseColor * brightness;

    // Soft grainy effect (no halftone)
    float grainStrength = 0.09; // Softer grain
    float grain = (random(vUv * time * 2.0) - 0.5);
    grain = smoothstep(-0.5, 0.7, grain); // soften grain edges
    grain = (grain - 0.5) * 2.0; // remap to [-1,1]
    color += grain * grainStrength;

    gl_FragColor = vec4(color, 1.0);
}
  `;

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <>
      <mesh ref={plane}>
        <planeGeometry args={[10, 5, 32, 32]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent={true}
        />
      </mesh>
    </>
  );
}