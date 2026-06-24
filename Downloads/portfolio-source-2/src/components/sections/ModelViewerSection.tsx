import React, { Suspense, useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { motion, useInView } from 'framer-motion';
import { RotateCcw, Info, Sparkles, Flower2 } from 'lucide-react';
import flowerGlbUrl from '/flower.glb?url';

function useWebGLSupport() {
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl =
        canvas.getContext('webgl2') ||
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl');
      setSupported(!!gl);
    } catch {
      setSupported(false);
    }
  }, []);

  return supported;
}

interface ViewerErrorBoundaryProps {
  children: React.ReactNode;
  onError: () => void;
}

interface ViewerErrorBoundaryState {
  hasError: boolean;
}

class ViewerErrorBoundary extends React.Component<
  ViewerErrorBoundaryProps,
  ViewerErrorBoundaryState
> {
  constructor(props: ViewerErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ViewerErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('3D Viewer ErrorBoundary caught:', error, errorInfo);
    this.props.onError();
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

function ColoredViewerFlower() {
  const { scene } = useGLTF(flowerGlbUrl);
  const groupRef = useRef<THREE.Group>(null);
  const [clonedScene, setClonedScene] = React.useState<THREE.Group | null>(null);

  React.useEffect(() => {
    // Clone before modifying to avoid mutating the shared cache
    const cloned = scene.clone();
    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const pos = mesh.position;
        const distFromCenter = Math.sqrt(pos.x * pos.x + pos.y * pos.y + pos.z * pos.z);

        let color: THREE.Color;
        let emissiveIntensity = 0.08;

        if (distFromCenter < 1.5) {
          color = new THREE.Color('#E57399');
          emissiveIntensity = 0.15;
        } else if (distFromCenter < 3) {
          color = new THREE.Color('#F5A0BC');
        } else {
          color = new THREE.Color('#D484A8');
        }

        const newMat = new THREE.MeshStandardMaterial({
          color,
          emissive: color,
          emissiveIntensity,
          roughness: 0.35,
          metalness: 0.15,
          transparent: true,
          opacity: 0.95,
          side: THREE.DoubleSide,
        });

        mesh.material = newMat;
      }
    });
    setClonedScene(cloned);
  }, [scene]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  if (!clonedScene) return null;

  return (
    // @ts-expect-error - R3F group element
    <group ref={groupRef}>
      {/* @ts-expect-error - R3F primitive element */}
      <primitive object={clonedScene} scale={1.2} position={[0, -0.3, 0]} />
      {/* @ts-expect-error - R3F group element */}
    </group>
  );
}

const ModelViewerSection: React.FC = () => {
  const [autoRotate, setAutoRotate] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const webglSupported = useWebGLSupport();
  const headingRef = useRef(null);
  const isHeadingInView = useInView(headingRef, { once: true, margin: '-100px' });
  const viewerRef = useRef(null);
  const isViewerInView = useInView(viewerRef, { once: true, margin: '-80px' });

  const showFallback = loadError || webglSupported === false;

  return (
    <section id="model" className="relative z-10 py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          ref={headingRef}
          className="text-center mb-10"
          initial={{ opacity: 0, y: 40 }}
          animate={isHeadingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles size={16} className="text-primary" />
            <span className="text-sm font-medium text-primary tracking-wider uppercase">
              Interactive 3D
            </span>
            <Sparkles size={16} className="text-primary" />
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-balance">
            3D <span className="text-primary">Model Viewer</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
            Explore the colored 3D flower model. Drag to rotate, scroll to zoom.
          </p>
        </motion.div>

        <motion.div
          ref={viewerRef}
          className="glass-card p-2 md:p-4 overflow-hidden"
          initial={{ opacity: 0, y: 50, scale: 0.97 }}
          animate={isViewerInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <div className="relative aspect-square md:aspect-[16/9] rounded-lg overflow-hidden bg-gradient-to-br from-[hsl(var(--card))] via-[hsl(var(--background))] to-[hsl(var(--card))]">
            {showFallback ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                {webglSupported === false ? (
                  <>
                    <Flower2 size={56} className="mb-4 text-primary/50" />
                    <p className="text-lg font-medium">3D Preview Unavailable</p>
                    <p className="text-sm mt-2 max-w-xs text-center text-pretty">
                      WebGL is not supported on this device or browser.
                    </p>
                  </>
                ) : (
                  <>
                    <Info size={48} className="mb-4 text-primary/50" />
                    <p className="text-lg font-medium">3D Model Unavailable</p>
                    <p className="text-sm mt-2">The 3D model could not be loaded.</p>
                  </>
                )}
              </div>
            ) : (
              <Suspense
                fallback={
                  <div className="flex items-center justify-center h-full">
                    <div className="text-muted-foreground text-center">
                      <motion.div
                        className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full mx-auto mb-3"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      />
                      <p className="text-sm">Loading 3D model...</p>
                    </div>
                  </div>
                }
              >
                <ViewerErrorBoundary onError={() => setLoadError(true)}>
                  <Canvas
                    shadows
                    camera={{ position: [0, 1.5, 4], fov: 45 }}
                    gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
                  >
                    {/* @ts-expect-error - R3F light element */}
                    <ambientLight intensity={0.5} />
                    {/* @ts-expect-error - R3F light element */}
                    <spotLight
                      position={[5, 5, 5]}
                      angle={0.3}
                      penumbra={1}
                      intensity={1.2}
                      castShadow
                      color="#E57399"
                    />
                    {/* @ts-expect-error - R3F light element */}
                    <spotLight
                      position={[-5, 3, -5]}
                      angle={0.4}
                      penumbra={1}
                      intensity={0.6}
                      color="#F8F4F6"
                    />
                    {/* @ts-expect-error - R3F light element */}
                    <pointLight position={[0, -2, 2]} intensity={0.4} color="#F5A0BC" />
                    <ColoredViewerFlower />
                    <ContactShadows
                      position={[0, -1.2, 0]}
                      opacity={0.4}
                      scale={10}
                      blur={2}
                      far={4}
                    />
                    <Environment preset="city" />
                    <OrbitControls
                      autoRotate={autoRotate}
                      autoRotateSpeed={2}
                      enablePan={false}
                      minDistance={2}
                      maxDistance={8}
                      minPolarAngle={Math.PI / 6}
                      maxPolarAngle={Math.PI / 2}
                      onStart={() => setAutoRotate(false)}
                    />
                  </Canvas>
                </ViewerErrorBoundary>
              </Suspense>
            )}

            {/* Controls overlay */}
            {!showFallback && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setAutoRotate(!autoRotate)}
                  className="glass-card px-4 py-2.5 flex items-center gap-2 text-xs font-medium hover:border-primary/30 transition-colors"
                >
                  <motion.div animate={{ rotate: autoRotate ? 0 : 180 }} transition={{ duration: 0.3 }}>
                    <RotateCcw size={14} />
                  </motion.div>
                  {autoRotate ? 'Stop Rotation' : 'Auto Rotate'}
                </motion.button>
              </div>
            )}

            {/* Decorative glow */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(229,115,153,0.12) 0%, transparent 70%)',
              }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ModelViewerSection;
