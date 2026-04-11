import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import { useRef, Suspense } from "react";
import * as THREE from "three";

const FootballModel = () => {
  const { scene } = useGLTF("/models/football.glb");
  const ref = useRef<THREE.Group>(null);

  // Tint the model with the brand teal color
  scene.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      if (mesh.material) {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        mat.color = new THREE.Color("#0d6a6a");
        mat.roughness = 0.4;
        mat.metalness = 0.3;
      }
    }
  });

  // Rotate around the long axis (spiral throw)
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.z += delta * 4;
    }
  });

  return (
    <group ref={ref} rotation={[0, 0, Math.PI * 0.2]}>
      <primitive object={scene} scale={1.8} />
    </group>
  );
};

const SpinningFootball = () => {
  return (
    <div className="w-16 h-16">
      <Canvas
        camera={{ position: [0, 2.5, 0], fov: 40 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 5, 2]} intensity={1.2} color="#95dcbc" />
        <directionalLight position={[-2, -3, 1]} intensity={0.4} color="#78cacc" />
        <Suspense fallback={null}>
          <FootballModel />
        </Suspense>
      </Canvas>
    </div>
  );
};

useGLTF.preload("/models/football.glb");

export default SpinningFootball;
