"use client";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { PerspectiveCamera } from "@react-three/drei";
import StatueMain from "./StatueMain";

export default function HomeScene() {
  return (
    <div className="w-screen h-screen fixed z-[0] top-0 left-0">
      <Canvas
        shadows
        dpr={1.5}
        gl={{ antialias: false }}
        style={{ background: "#000000" }}
        
      >
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={35} near={0.1} far={100} />
        <Suspense fallback={null}>
          <StatueMain />
        </Suspense>
      </Canvas>
    </div>
  );
}