"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, useAnimations } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

type ModelProps = {
  scale?: number;
  position?: [number, number, number];
  isDragging: boolean;
};

function Model({ scale = 1, position = [0, -1.2, 0], isDragging }: ModelProps) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF("/result.gltf");
  const { actions, mixer } = useAnimations(animations, group);

  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      const firstAction = Object.values(actions)[0];

      if (firstAction) {
        // ✅ Play only once
        firstAction.setLoop(THREE.LoopOnce, 1);
        firstAction.clampWhenFinished = true;
        firstAction.play();

        // ✅ Restart after finished
        const onFinished = () => {
          setTimeout(() => {
            firstAction.reset().play();
          }, 1500); // pause 1 seconds
        };

        mixer.addEventListener("finished", onFinished);

        return () => {
          mixer.removeEventListener("finished", onFinished);
        };
      }
    }
  }, [actions, mixer]);

  useFrame(({ clock }) => {
    if (!group.current) return;

    if (!isDragging) {
      // rotate only when not dragging
      const t = clock.getElapsedTime();
      group.current.rotation.y = t * 0.3;
    }

    group.current.scale.set(scale, scale, scale);
    group.current.position.set(...position);

    // ✅ Pause animations while dragging
    if (actions) {
      const firstAction = Object.values(actions)[0];
      if (firstAction) {
        firstAction.paused = isDragging;
      }
    }
  });

  return <primitive ref={group} object={scene} />;
}

export default function MyModel() {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div className="w-full flex justify-center mt-4">
      <div className="h-[300px] w-[300px]">
        <Canvas
          camera={{
            position: [0, 0.5, 6],
            fov: 40,
          }}
        >
          <ambientLight intensity={2} />
          <directionalLight position={[2, 2, 5]} intensity={3} />

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={1}
            onStart={() => setIsDragging(true)} // pause when drag starts
            onEnd={() => setIsDragging(false)} // resume when drag ends
          />

          <Model scale={0.6} position={[0, -1.2, 0]} isDragging={isDragging} />
        </Canvas>
      </div>
    </div>
  );
}
