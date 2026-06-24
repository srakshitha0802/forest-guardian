import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import flowerGlbUrl from '/flower.glb?url';

gsap.registerPlugin(ScrollTrigger);

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

interface FlowerErrorBoundaryProps {
  children: React.ReactNode;
  onError: () => void;
}

interface FlowerErrorBoundaryState {
  hasError: boolean;
}

class FlowerErrorBoundary extends React.Component<
  FlowerErrorBoundaryProps,
  FlowerErrorBoundaryState
> {
  constructor(props: FlowerErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): FlowerErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('FloatingFlower ErrorBoundary caught:', error, errorInfo);
    this.props.onError();
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

function FlowerLoader() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function CSSFlowerFallback() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div
        className="w-32 h-32 rounded-full animate-pulse"
        style={{
          background: 'radial-gradient(circle, rgba(229, 115, 153, 0.6) 0%, rgba(245, 160, 188, 0.3) 40%, transparent 70%)',
          filter: 'blur(2px)',
          animation: 'flowerPulse 3s ease-in-out infinite',
        }}
      />
      <div
        className="absolute w-20 h-20 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(229, 115, 153, 0.8) 0%, rgba(212, 132, 168, 0.4) 50%, transparent 70%)',
          animation: 'flowerRotate 8s linear infinite',
        }}
      />
    </div>
  );
}

interface ColoredFlowerProps {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
}

function ColoredFlower({ position, rotation, scale }: ColoredFlowerProps) {
  const { scene } = useGLTF(flowerGlbUrl);
  const groupRef = useRef<THREE.Group>(null);
  const [clonedScene, setClonedScene] = useState<THREE.Group | null>(null);

  useEffect(() => {
    // Clone the scene BEFORE modifying so the shared cache stays intact
    const cloned = scene.clone();
    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;

        const pos = mesh.position;
        const distFromCenter = Math.sqrt(pos.x * pos.x + pos.y * pos.y + pos.z * pos.z);

        let color: THREE.Color;
        let emissiveIntensity = 0.1;
        let roughness = 0.35;
        let metalness = 0.15;
        let opacity = 0.92;

        if (distFromCenter < 1.2) {
          color = new THREE.Color('#E57399');
          emissiveIntensity = 0.18;
          roughness = 0.25;
          metalness = 0.2;
          opacity = 0.95;
        } else if (distFromCenter < 2.5) {
          color = new THREE.Color('#F5A0BC');
          emissiveIntensity = 0.12;
          roughness = 0.3;
          metalness = 0.18;
          opacity = 0.9;
        } else if (distFromCenter < 4) {
          color = new THREE.Color('#F8C8D8');
          emissiveIntensity = 0.08;
          roughness = 0.35;
          metalness = 0.12;
          opacity = 0.85;
        } else {
          color = new THREE.Color('#D484A8');
          emissiveIntensity = 0.06;
          roughness = 0.4;
          metalness = 0.1;
          opacity = 0.88;
        }

        const newMat = new THREE.MeshStandardMaterial({
          color,
          emissive: color,
          emissiveIntensity,
          roughness,
          metalness,
          transparent: true,
          opacity,
          side: THREE.DoubleSide,
        });

        mesh.material = newMat;
      }
    });
    setClonedScene(cloned);
  }, [scene]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5;
      groupRef.current.rotation.z = Math.sin(Date.now() * 0.001) * 0.1;
    }
  });

  if (!clonedScene) return null;

  return (
    // @ts-expect-error - R3F group element
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/* @ts-expect-error - R3F primitive element */}
      <primitive object={clonedScene} />
      {/* @ts-expect-error - R3F group element */}
    </group>
  );
}

const FloatingFlower: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const flowerWrapperRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [canvasError, setCanvasError] = useState(false);
  const webglSupported = useWebGLSupport();

  useEffect(() => {
    if (!flowerWrapperRef.current) return;

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => setIsReady(true), 500);

    const flower = flowerWrapperRef.current;

    // Create zig-zag path: center -> right -> left -> right -> center
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,
        invalidateOnRefresh: true,
      },
    });

    // Define zig-zag keyframes
    tl.fromTo(
      flower,
      { xPercent: -50, yPercent: -50, x: '50vw', y: '8vh' },
      {
        x: '70vw',
        y: '28vh',
        xPercent: -50,
        yPercent: -50,
        ease: 'power1.inOut',
        duration: 1,
      },
      0
    );

    tl.to(
      flower,
      {
        x: '30vw',
        y: '48vh',
        xPercent: -50,
        yPercent: -50,
        ease: 'power1.inOut',
        duration: 1,
      },
      1
    );

    tl.to(
      flower,
      {
        x: '70vw',
        y: '68vh',
        xPercent: -50,
        yPercent: -50,
        ease: 'power1.inOut',
        duration: 1,
      },
      2
    );

    tl.to(
      flower,
      {
        x: '50vw',
        y: '88vh',
        xPercent: -50,
        yPercent: -50,
        ease: 'power1.inOut',
        duration: 1,
      },
      3
    );

    // Also add a subtle scale animation synced with scroll
    const scaleTween = gsap.fromTo(
      flower,
      { scale: 0.6 },
      {
        scale: 1.2,
        ease: 'power1.out',
        scrollTrigger: {
          trigger: 'body',
          start: 'top top',
          end: '50% top',
          scrub: 1,
        },
      }
    );

    // Rotation synced with scroll
    const rotateTween = gsap.to(flower, {
      rotation: 360,
      ease: 'none',
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 2,
      },
    });

    return () => {
      clearTimeout(timer);
      tl.kill();
      scaleTween.kill();
      rotateTween.kill();
      // Only kill ScrollTriggers created by this component
      tl.scrollTrigger?.kill();
      scaleTween.scrollTrigger?.kill();
      rotateTween.scrollTrigger?.kill();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-[5] overflow-hidden"
    >
      <div
        ref={flowerWrapperRef}
        className="absolute will-change-transform"
        style={{
          width: '200px',
          height: '200px',
          left: 0,
          top: 0,
          transform: 'translate(-50%, -50%)',
          filter: 'drop-shadow(0 0 20px rgba(229, 115, 153, 0.4))',
        }}
      >
        {isReady && (
          <Suspense fallback={<FlowerLoader />}>
            {webglSupported === false || canvasError ? (
              <CSSFlowerFallback />
            ) : (
              <FlowerErrorBoundary onError={() => setCanvasError(true)}>
                <Canvas
                  camera={{ position: [0, 0, 5], fov: 40 }}
                  style={{ width: '100%', height: '100%', background: 'transparent' }}
                  gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
                >
                  {/* @ts-expect-error - R3F light element */}
                  <ambientLight intensity={0.6} />
                  {/* @ts-expect-error - R3F light element */}
                  <spotLight
                    position={[3, 3, 3]}
                    intensity={1.5}
                    color="#E57399"
                    penumbra={0.5}
                  />
                  {/* @ts-expect-error - R3F light element */}
                  <spotLight
                    position={[-3, 2, -3]}
                    intensity={0.8}
                    color="#F8F4F6"
                    penumbra={0.5}
                  />
                  {/* @ts-expect-error - R3F light element */}
                  <pointLight position={[0, -2, 2]} intensity={0.5} color="#F5A0BC" />
                  <ColoredFlower
                    position={[0, 0, 0]}
                    rotation={[0, 0, 0]}
                    scale={1.5}
                  />
                </Canvas>
              </FlowerErrorBoundary>
            )}
          </Suspense>
        )}
      </div>
    </div>
  );
};

export default FloatingFlower;
