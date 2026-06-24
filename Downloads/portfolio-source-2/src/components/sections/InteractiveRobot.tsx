import React, { Suspense, useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, ContactShadows, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { motion, useInView } from 'framer-motion';
import { Zap, Palette, RotateCcw, MousePointerClick } from 'lucide-react';
import robotGltfUrl from '/robot.gltf?url';

function useWebGLSupport() {
  const [supported, setSupported] = useState<boolean | null>(null);
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setSupported(!!gl);
    } catch {
      setSupported(false);
    }
  }, []);
  return supported;
}

interface RobotErrorBoundaryProps {
  children: React.ReactNode;
  onError: () => void;
}

interface RobotErrorBoundaryState {
  hasError: boolean;
}

class RobotErrorBoundary extends React.Component<RobotErrorBoundaryProps, RobotErrorBoundaryState> {
  constructor(props: RobotErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(): RobotErrorBoundaryState {
    return { hasError: true };
  }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Robot ErrorBoundary caught:', error, errorInfo);
    this.props.onError();
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

const THEMES = [
  { name: 'Neon Pink', primary: '#E57399', secondary: '#F5A0BC', accent: '#D484A8' },
  { name: 'Cyber Blue', primary: '#60A5FA', secondary: '#93C5FD', accent: '#3B82F6' },
  { name: 'Lime Green', primary: '#A3E635', secondary: '#D9F99D', accent: '#84CC16' },
  { name: 'Sunset Orange', primary: '#FB923C', secondary: '#FDBA74', accent: '#F97316' },
  { name: 'Violet', primary: '#C084FC', secondary: '#E9D5FF', accent: '#A855F7' },
];

function RobotModel({ theme, isDancing, onClick }: { theme: typeof THEMES[0]; isDancing: boolean; onClick: () => void }) {
  const { scene } = useGLTF(robotGltfUrl);
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const pos = mesh.position;
        const dist = Math.sqrt(pos.x * pos.x + pos.y * pos.y + pos.z * pos.z);

        let color: THREE.Color;
        if (dist < 0.5) color = new THREE.Color(theme.primary);
        else if (dist < 1.2) color = new THREE.Color(theme.secondary);
        else color = new THREE.Color(theme.accent);

        const newMat = new THREE.MeshStandardMaterial({
          color,
          emissive: color,
          emissiveIntensity: 0.15,
          roughness: 0.3,
          metalness: 0.7,
          transparent: true,
          opacity: 0.95,
        });
        mesh.material = newMat;
      }
    });
  }, [scene, theme]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    if (isDancing) {
      groupRef.current.rotation.y += delta * 3;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 4) * 0.3;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 6) * 0.2;
    } else {
      groupRef.current.rotation.y += delta * 0.5;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0, delta * 2);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 0, delta * 2);
    }
  });

  return (
    // @ts-expect-error - R3F group element
    <group
      ref={groupRef}
      onClick={(e: { stopPropagation: () => void }) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={() => {
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
      scale={hovered ? 1.15 : 1.1}
    >
      {/* @ts-expect-error - R3F primitive element */}
      <primitive object={scene.clone()} position={[0, -0.8, 0]} />
      {/* @ts-expect-error - R3F group element */}
    </group>
  );
}

function RobotFallback() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
      <div className="relative w-24 h-24 mb-4">
        <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse" />
        <div className="absolute inset-2 rounded-full bg-primary/30" style={{ animation: 'flowerPulse 2s ease-in-out infinite' }} />
        <Zap size={32} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary" />
      </div>
      <p className="text-lg font-medium">Robot Preview Unavailable</p>
      <p className="text-sm mt-2 max-w-xs text-center text-pretty">
        WebGL is not supported on this device or the model failed to load.
      </p>
    </div>
  );
}

const InteractiveRobot: React.FC = () => {
  const [themeIndex, setThemeIndex] = useState(0);
  const [isDancing, setIsDancing] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [canvasError, setCanvasError] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const webglSupported = useWebGLSupport();

  const headingRef = useRef(null);
  const isHeadingInView = useInView(headingRef, { once: true, margin: '-100px' });
  const viewerRef = useRef(null);
  const isViewerInView = useInView(viewerRef, { once: true, margin: '-80px' });

  const theme = THEMES[themeIndex];
  const showFallback = canvasError || webglSupported === false;

  const cycleTheme = () => {
    setThemeIndex((prev) => (prev + 1) % THEMES.length);
    setClickCount((c) => c + 1);
  };

  return (
    <section id="robot" className="relative z-10 py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={headingRef}
          className="text-center mb-10"
          initial={{ opacity: 0, y: 40 }}
          animate={isHeadingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap size={16} className="text-primary" />
            <span className="text-sm font-medium text-primary tracking-wider uppercase">
              Interactive Game
            </span>
            <Zap size={16} className="text-primary" />
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-balance">
            Meet Your <span className="text-primary">AI Companion</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
            Click the robot to change its theme, toggle dance mode, and explore. It is interactive — try it!
          </p>
        </motion.div>

        {/* Scoreboard */}
        <motion.div
          className="flex items-center justify-center gap-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={isHeadingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="glass-card px-4 py-2 flex items-center gap-2">
            <MousePointerClick size={14} className="text-primary" />
            <span className="text-sm font-medium">Clicks: {clickCount}</span>
          </div>
          <div className="glass-card px-4 py-2 flex items-center gap-2">
            <Palette size={14} className="text-primary" />
            <span className="text-sm font-medium">Theme: {theme.name}</span>
          </div>
          {isDancing && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="glass-card px-4 py-2 flex items-center gap-2 border-primary/30"
            >
              <Zap size={14} className="text-primary" />
              <span className="text-sm font-medium text-primary">Dance Mode!</span>
            </motion.div>
          )}
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
              <RobotFallback />
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
                      <p className="text-sm">Loading robot model...</p>
                    </div>
                  </div>
                }
              >
                <RobotErrorBoundary onError={() => setCanvasError(true)}>
                  <Canvas
                    shadows
                    camera={{ position: [0, 1, 3.5], fov: 45 }}
                    gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
                  >
                    {/* @ts-expect-error - R3F light element */}
                    <ambientLight intensity={0.4} />
                    {/* @ts-expect-error - R3F light element */}
                    <spotLight
                      position={[4, 4, 4]}
                      angle={0.4}
                      penumbra={1}
                      intensity={1.5}
                      castShadow
                      color={theme.primary}
                    />
                    {/* @ts-expect-error - R3F light element */}
                    <spotLight
                      position={[-4, 2, -4]}
                      angle={0.5}
                      penumbra={1}
                      intensity={0.6}
                      color={theme.secondary}
                    />
                    <RobotModel theme={theme} isDancing={isDancing} onClick={cycleTheme} />
                    <ContactShadows
                      position={[0, -1.2, 0]}
                      opacity={0.3}
                      scale={10}
                      blur={2}
                      far={4}
                    />
                    <Environment preset="city" />
                    <OrbitControls
                      autoRotate={autoRotate && !isDancing}
                      autoRotateSpeed={1.5}
                      enablePan={false}
                      minDistance={2}
                      maxDistance={7}
                      onStart={() => setAutoRotate(false)}
                    />
                  </Canvas>
                </RobotErrorBoundary>
              </Suspense>
            )}

            {/* Game Controls Overlay */}
            {!showFallback && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setAutoRotate(!autoRotate)}
                  className="glass-card px-4 py-2.5 flex items-center gap-2 text-xs font-medium hover:border-primary/30 transition-colors"
                >
                  <RotateCcw size={14} />
                  {autoRotate ? 'Stop Rotate' : 'Auto Rotate'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsDancing(!isDancing)}
                  className={`glass-card px-4 py-2.5 flex items-center gap-2 text-xs font-medium transition-colors ${
                    isDancing ? 'border-primary/40 bg-primary/10' : 'hover:border-primary/30'
                  }`}
                >
                  <Zap size={14} />
                  {isDancing ? 'Stop Dance' : 'Dance Mode'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={cycleTheme}
                  className="glass-card px-4 py-2.5 flex items-center gap-2 text-xs font-medium hover:border-primary/30 transition-colors"
                >
                  <Palette size={14} />
                  Change Theme
                </motion.button>
              </div>
            )}

            {/* Click hint */}
            {!showFallback && clickCount === 0 && (
              <motion.div
                className="absolute top-4 right-4 glass-card px-3 py-2 flex items-center gap-2 text-xs text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 1, 0] }}
                transition={{ duration: 4, repeat: Infinity, times: [0, 0.1, 0.8, 1] }}
              >
                <MousePointerClick size={14} className="text-primary" />
                Click the robot!
              </motion.div>
            )}

            {/* Decorative glow matching theme */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full pointer-events-none"
              style={{
                background: `radial-gradient(circle, ${theme.primary}20 0%, transparent 70%)`,
              }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default InteractiveRobot;
