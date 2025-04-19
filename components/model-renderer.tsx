"use client"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, ContactShadows, Cloud, Sky } from "@react-three/drei"

// This would be replaced with actual model data from the AI
const SAMPLE_SCENES = {
  deepseek: {
    complexity: "basic",
    color: "#5D8AA8", // Ghibli blue
    geometry: "box",
  },
  deepseekPostTraining: {
    complexity: "medium",
    color: "#7BA05B", // Ghibli green
    geometry: "sphere",
  },
  claude: {
    complexity: "advanced",
    color: "#E6A0C4", // Ghibli pink
    geometry: "torus",
  },
}

type ModelRendererProps = {
  sceneData: string
  fullscreen?: boolean
}

export default function ModelRenderer({ sceneData, fullscreen = false }: ModelRendererProps) {
  // In a real implementation, sceneData would contain the actual 3D model data
  // Here we're just using it to determine which sample scene to show
  let modelType = "basic"
  if (sceneData.includes("deepseek-post")) {
    modelType = "deepseekPostTraining"
  } else if (sceneData.includes("deepseek")) {
    modelType = "deepseek"
  } else if (sceneData.includes("claude")) {
    modelType = "claude"
  }

  return (
    <div className={`w-full ${fullscreen ? "h-full" : "h-[280px]"}`}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <color attach="background" args={["#e6f7ff"]} />
        <ambientLight intensity={0.7} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />

        <Sky distance={450000} sunPosition={[0, 1, 0]} inclination={0} azimuth={0.25} turbidity={10} rayleigh={0.5} />

        {modelType === "deepseek" && (
          <mesh rotation={[0, Math.PI / 4, 0]}>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial color={SAMPLE_SCENES.deepseek.color} />
          </mesh>
        )}

        {modelType === "deepseekPostTraining" && (
          <mesh>
            <sphereGeometry args={[1.5, 64, 64]} />
            <meshStandardMaterial color={SAMPLE_SCENES.deepseekPostTraining.color} roughness={0.4} metalness={0.2} />
          </mesh>
        )}

        {modelType === "claude" && (
          <mesh rotation={[Math.PI / 6, 0, 0]}>
            <torusGeometry args={[1.5, 0.5, 32, 100]} />
            <meshPhysicalMaterial
              color={SAMPLE_SCENES.claude.color}
              roughness={0.3}
              metalness={0.4}
              clearcoat={0.8}
              clearcoatRoughness={0.2}
            />
          </mesh>
        )}

        <Cloud opacity={0.5} speed={0.4} width={10} depth={1.5} segments={20} position={[0, 2, -5]} />

        <Cloud opacity={0.3} speed={0.2} width={8} depth={1} segments={15} position={[-4, -2, -10]} />

        <ContactShadows position={[0, -1.5, 0]} opacity={0.2} scale={10} blur={2} far={4} />
        <OrbitControls autoRotate autoRotateSpeed={1} enableZoom={fullscreen} enablePan={fullscreen} />
        <Environment preset="sunset" />
      </Canvas>
    </div>
  )
}
