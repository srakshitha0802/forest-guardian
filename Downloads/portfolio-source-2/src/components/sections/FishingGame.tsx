import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { Fish, Trophy, RotateCcw } from 'lucide-react';

interface FishType {
  name: string;
  emoji: string;
  rarity: 'common' | 'rare' | 'legendary';
  color: string;
  speed: number;
  points: number;
  size: number;
}

const FISH_TYPES: FishType[] = [
  { name: 'Pink Guppy', emoji: '🐟', rarity: 'common', color: '#F5A0BC', speed: 1.2, points: 10, size: 18 },
  { name: 'Rose Koi', emoji: '🐠', rarity: 'common', color: '#E57399', speed: 0.9, points: 15, size: 22 },
  { name: 'Coral Tetra', emoji: '🐡', rarity: 'common', color: '#D484A8', speed: 1.5, points: 12, size: 16 },
  { name: 'Magenta Shark', emoji: '🦈', rarity: 'rare', color: '#C084D1', speed: 2.0, points: 40, size: 30 },
  { name: 'Pearl Angelfish', emoji: '🐟', rarity: 'rare', color: '#F8F4F6', speed: 0.7, points: 35, size: 24 },
  { name: 'Golden Lotus Fish', emoji: '✨', rarity: 'legendary', color: '#FFD700', speed: 2.5, points: 100, size: 28 },
];

interface GameFish {
  id: number;
  type: FishType;
  x: number;
  y: number;
  direction: number;
  wiggle: number;
}

interface Bubble {
  x: number;
  y: number;
  r: number;
  speed: number;
  opacity: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

type GameState = 'idle' | 'casting' | 'waiting' | 'biting' | 'reeling' | 'caught' | 'missed';

const FishingGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameStateRef = useRef<GameState>('idle');
  const fishesRef = useRef<GameFish[]>([]);
  const bubblesRef = useRef<Bubble[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const rodRef = useRef({ x: 0.5, y: 0, lineLen: 0, targetLen: 0, hookY: 0 });
  const biteTimerRef = useRef<number>(0);
  const reelProgressRef = useRef(0);
  const caughtFishRef = useRef<GameFish | null>(null);
  const animFrameRef = useRef<number>(0);
  const lastTimeRef = useRef(0);

  const [gameState, setGameState] = useState<GameState>('idle');
  const [score, setScore] = useState(0);
  const [caughtList, setCaughtList] = useState<{ fish: FishType; count: number }[]>([]);
  const [combo, setCombo] = useState(0);
  const [message, setMessage] = useState('');
  const [totalCasts, setTotalCasts] = useState(0);

  const headingRef = useRef(null);
  const isHeadingInView = useInView(headingRef, { once: true, margin: '-100px' });

  const initBubbles = useCallback((w: number, h: number) => {
    const bubbles: Bubble[] = [];
    for (let i = 0; i < 25; i++) {
      bubbles.push({
        x: Math.random() * w,
        y: h + Math.random() * 200,
        r: 2 + Math.random() * 5,
        speed: 0.3 + Math.random() * 0.8,
        opacity: 0.1 + Math.random() * 0.3,
      });
    }
    bubblesRef.current = bubbles;
  }, []);

  const initFishes = useCallback((w: number, h: number) => {
    const fishes: GameFish[] = [];
    for (let i = 0; i < 10; i++) {
      const type = FISH_TYPES[Math.floor(Math.random() * FISH_TYPES.length)];
      fishes.push({
        id: i,
        type,
        x: Math.random() * w,
        y: h * 0.3 + Math.random() * h * 0.55,
        direction: Math.random() > 0.5 ? 1 : -1,
        wiggle: Math.random() * Math.PI * 2,
      });
    }
    fishesRef.current = fishes;
  }, []);

  const spawnParticles = useCallback((x: number, y: number, color: string, count: number) => {
    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 3;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        life: 1,
        maxLife: 40 + Math.random() * 30,
        color,
        size: 2 + Math.random() * 3,
      });
    }
    particlesRef.current = [...particlesRef.current, ...particles];
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      initBubbles(rect.width, rect.height);
      initFishes(rect.width, rect.height);
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = (time: number) => {
      const dt = Math.min((time - lastTimeRef.current) / 16.67, 3);
      lastTimeRef.current = time;
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);

      // Clear
      ctx.clearRect(0, 0, w, h);

      // Water gradient (deeper = darker)
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#1e1520');
      grad.addColorStop(0.3, '#1a1220');
      grad.addColorStop(0.7, '#140e1a');
      grad.addColorStop(1, '#0e0914');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Surface shimmer
      const surfaceGrad = ctx.createLinearGradient(0, 0, w, 0);
      surfaceGrad.addColorStop(0, 'rgba(229,115,153,0.06)');
      surfaceGrad.addColorStop(0.5, 'rgba(229,115,153,0.12)');
      surfaceGrad.addColorStop(1, 'rgba(229,115,153,0.06)');
      ctx.fillStyle = surfaceGrad;
      ctx.fillRect(0, 0, w, 40);

      // Light rays
      for (let i = 0; i < 4; i++) {
        const rayX = w * (0.15 + i * 0.25) + Math.sin(time * 0.0003 + i) * 30;
        const rayGrad = ctx.createLinearGradient(rayX, 0, rayX + 20, h * 0.6);
        rayGrad.addColorStop(0, 'rgba(229,115,153,0.08)');
        rayGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = rayGrad;
        ctx.beginPath();
        ctx.moveTo(rayX - 10, 0);
        ctx.lineTo(rayX + 30, 0);
        ctx.lineTo(rayX + 50, h * 0.6);
        ctx.lineTo(rayX - 30, h * 0.6);
        ctx.closePath();
        ctx.fill();
      }

      // Update & draw bubbles
      bubblesRef.current.forEach((b) => {
        b.y -= b.speed * dt;
        b.x += Math.sin(time * 0.001 + b.y * 0.01) * 0.3;
        if (b.y < -20) {
          b.y = h + 20;
          b.x = Math.random() * w;
        }
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(229,115,153,${b.opacity})`;
        ctx.fill();
        // Bubble highlight
        ctx.beginPath();
        ctx.arc(b.x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${b.opacity * 0.5})`;
        ctx.fill();
      });

      // Update & draw fish
      const state = gameStateRef.current;
      fishesRef.current.forEach((fish) => {
        fish.x += fish.direction * fish.type.speed * dt;
        fish.wiggle += 0.08 * dt;

        // Wrap around
        if (fish.x > w + 50) fish.x = -50;
        if (fish.x < -50) fish.x = w + 50;

        // Slight vertical bob
        const bobY = Math.sin(fish.wiggle) * 4;

        const fx = fish.x;
        const fy = fish.y + bobY;

        ctx.save();
        ctx.translate(fx, fy);
        if (fish.direction < 0) ctx.scale(-1, 1);

        // Fish glow
        ctx.shadowColor = fish.type.color;
        ctx.shadowBlur = 12;

        // Fish body
        ctx.fillStyle = fish.type.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, fish.type.size * 0.6, fish.type.size * 0.3, 0, 0, Math.PI * 2);
        ctx.fill();

        // Tail
        ctx.beginPath();
        ctx.moveTo(-fish.type.size * 0.5, 0);
        ctx.lineTo(-fish.type.size * 0.9, -fish.type.size * 0.25);
        ctx.lineTo(-fish.type.size * 0.9, fish.type.size * 0.25);
        ctx.closePath();
        ctx.fill();

        // Eye
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(fish.type.size * 0.25, -fish.type.size * 0.08, fish.type.size * 0.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(fish.type.size * 0.28, -fish.type.size * 0.08, fish.type.size * 0.05, 0, Math.PI * 2);
        ctx.fill();

        // Fin
        ctx.fillStyle = fish.type.color + 'aa';
        ctx.beginPath();
        ctx.moveTo(0, fish.type.size * 0.15);
        ctx.lineTo(-fish.type.size * 0.15, fish.type.size * 0.4);
        ctx.lineTo(fish.type.size * 0.1, fish.type.size * 0.2);
        ctx.closePath();
        ctx.fill();

        ctx.restore();

        // Legendary glow ring
        if (fish.type.rarity === 'legendary') {
          ctx.strokeStyle = `rgba(255,215,0,${0.3 + Math.sin(time * 0.003) * 0.15})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(fx, fy, fish.type.size * 0.9, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      // Fishing line & hook
      const rod = rodRef.current;
      const rodX = w * rod.x;
      const rodY = 0;

      // Cast animation
      if (state === 'casting') {
        rod.lineLen += (rod.targetLen - rod.lineLen) * 0.08 * dt;
        if (Math.abs(rod.lineLen - rod.targetLen) < 2) {
          gameStateRef.current = 'waiting';
          setGameState('waiting');
          setMessage('Waiting for a bite...');
          biteTimerRef.current = 2000 + Math.random() * 4000;
        }
      }

      // Bite
      if (state === 'waiting') {
        rod.hookY = rod.lineLen;
        biteTimerRef.current -= dt * 16.67;
        if (biteTimerRef.current <= 0) {
          // Find nearest fish
          const hookWorldX = rodX;
          const hookWorldY = rodY + rod.lineLen;
          let nearest: GameFish | null = null;
          let nearestDist = 80;
          fishesRef.current.forEach((fish) => {
            const d = Math.hypot(fish.x - hookWorldX, fish.y - hookWorldY);
            if (d < nearestDist) {
              nearestDist = d;
              nearest = fish;
            }
          });
          if (nearest) {
            caughtFishRef.current = nearest;
            gameStateRef.current = 'biting';
            setGameState('biting');
            setMessage(`${(nearest as GameFish).type.name} is biting! REEL IT IN!`);
            reelProgressRef.current = 0;
          } else {
            gameStateRef.current = 'missed';
            setGameState('missed');
            setMessage('The fish got away...');
            setTimeout(() => {
              gameStateRef.current = 'idle';
              setGameState('idle');
              setMessage('');
            }, 1500);
          }
        }
      }

      // Reeling
      if (state === 'biting') {
        const fish = caughtFishRef.current;
        if (fish) {
          fish.x += (rodX - fish.x) * 0.03 * dt;
          fish.y += (rodY + rod.lineLen * 0.5 - fish.y) * 0.03 * dt;
        }
      }

      // Draw line
      ctx.strokeStyle = 'rgba(255,255,255,0.4)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(rodX, rodY);
      if (state === 'biting' && caughtFishRef.current) {
        ctx.lineTo(caughtFishRef.current.x, caughtFishRef.current.y);
      } else {
        ctx.lineTo(rodX, rodY + rod.lineLen);
      }
      ctx.stroke();

      // Hook
      const hookX = state === 'biting' && caughtFishRef.current ? caughtFishRef.current.x : rodX;
      const hookY = state === 'biting' && caughtFishRef.current ? caughtFishRef.current.y : rodY + rod.lineLen;
      ctx.strokeStyle = 'rgba(200,200,200,0.7)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(hookX, hookY);
      ctx.lineTo(hookX, hookY + 8);
      ctx.arc(hookX - 4, hookY + 8, 4, 0, Math.PI, false);
      ctx.stroke();

      // Biting indicator
      if (state === 'biting') {
        const pulse = 0.6 + Math.sin(time * 0.008) * 0.4;
        ctx.fillStyle = `rgba(229,115,153,${pulse * 0.5})`;
        ctx.beginPath();
        ctx.arc(hookX, hookY - 15, 12 * pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('CLICK!', hookX, hookY - 20);
      }

      // Particles
      particlesRef.current = particlesRef.current.filter((p) => {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 0.08 * dt;
        p.life -= dt;
        if (p.life <= 0) return false;
        const alpha = Math.max(0, p.life / p.maxLife);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
        ctx.fill();
        return true;
      });
      ctx.globalAlpha = 1;

      // Caught animation
      if (state === 'caught' && caughtFishRef.current) {
        const fish = caughtFishRef.current;
        fish.y += (rodY - fish.y) * 0.1 * dt;
        if (fish.y < rodY + 20) {
          // Celebration
          spawnParticles(fish.x, fish.y, fish.type.color, 20);
          gameStateRef.current = 'idle';
          setGameState('idle');
          setMessage('');
          caughtFishRef.current = null;
          rod.lineLen = 0;
        }
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    animFrameRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [initBubbles, initFishes, spawnParticles]);

  const handleCanvasClick = useCallback(() => {
    const state = gameStateRef.current;
    if (state === 'idle') {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const w = canvas.getBoundingClientRect().width;
      rodRef.current.x = 0.3 + Math.random() * 0.4;
      rodRef.current.targetLen = w * 0.4 + Math.random() * w * 0.25;
      rodRef.current.lineLen = 0;
      gameStateRef.current = 'casting';
      setGameState('casting');
      setMessage('Casting...');
      setTotalCasts((c) => c + 1);
    } else if (state === 'biting') {
      reelProgressRef.current += 1;
      if (reelProgressRef.current >= 5) {
        const fish = caughtFishRef.current;
        if (fish) {
          gameStateRef.current = 'caught';
          setGameState('caught');
          setMessage(`Caught a ${fish.type.name}! +${fish.type.points} pts`);
          setScore((s) => s + fish.type.points + combo * 5);
          setCombo((c) => c + 1);
          setCaughtList((list) => {
            const existing = list.find((l) => l.fish.name === fish.type.name);
            if (existing) {
              return list.map((l) =>
                l.fish.name === fish.type.name ? { ...l, count: l.count + 1 } : l
              );
            }
            return [...list, { fish: fish.type, count: 1 }];
          });
          spawnParticles(fish.x, fish.y, fish.type.color, 30);
        }
      }
    } else if (state === 'missed') {
      setCombo(0);
    }
  }, [combo, spawnParticles]);

  const handleReset = useCallback(() => {
    gameStateRef.current = 'idle';
    setGameState('idle');
    setScore(0);
    setCombo(0);
    setCaughtList([]);
    setTotalCasts(0);
    setMessage('');
    rodRef.current.lineLen = 0;
    rodRef.current.targetLen = 0;
    caughtFishRef.current = null;
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      initFishes(rect.width, rect.height);
    }
  }, [initFishes]);

  return (
    <section id="fishing" className="relative z-10 py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          ref={headingRef}
          className="text-center mb-8"
          initial={{ opacity: 0, y: 40 }}
          animate={isHeadingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Fish size={16} className="text-primary" />
            <span className="text-sm font-medium text-primary tracking-wider uppercase">
              Relaxing Mini-Game
            </span>
            <Fish size={16} className="text-primary" />
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-balance">
            Serene <span className="text-primary">Fishing</span> Pond
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
            A calming fishing experience inspired by Stardew Valley. Click to cast, wait for a bite, then click repeatedly to reel in your catch. Discover rare and legendary fish!
          </p>
        </motion.div>

        {/* Scoreboard */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={isHeadingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="glass-card px-5 py-2.5 flex items-center gap-2">
            <Trophy size={14} className="text-primary" />
            <span className="text-sm font-medium">Score: {score}</span>
          </div>
          <div className="glass-card px-5 py-2.5 flex items-center gap-2">
            <Fish size={14} className="text-primary" />
            <span className="text-sm font-medium">Caught: {caughtList.reduce((a, b) => a + b.count, 0)}</span>
          </div>
          {combo > 1 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="glass-card px-5 py-2.5 flex items-center gap-2 border-primary/40 bg-primary/10"
            >
              <span className="text-sm font-medium text-primary">Combo x{combo}</span>
            </motion.div>
          )}
          <div className="glass-card px-5 py-2.5 flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Casts: {totalCasts}</span>
          </div>
        </motion.div>

        {/* Message */}
        {message && (
          <motion.div
            className="text-center mb-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            key={message}
          >
            <span className="text-sm font-medium text-primary">{message}</span>
          </motion.div>
        )}

        {/* Game Canvas */}
        <motion.div
          className="glass-card p-2 md:p-3 overflow-hidden"
          initial={{ opacity: 0, y: 50, scale: 0.97 }}
          animate={isHeadingInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <div className="relative aspect-[16/10] md:aspect-[16/9] rounded-lg overflow-hidden cursor-pointer select-none"
            onClick={handleCanvasClick}
          >
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full"
              style={{ touchAction: 'none' }}
            />

            {/* Idle hint */}
            {gameState === 'idle' && (
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                  <Fish size={24} className="text-primary" />
                </div>
                <p className="text-sm font-medium text-foreground">Click anywhere to cast your line</p>
                <p className="text-xs text-muted-foreground mt-1">Wait for a bite, then click to reel</p>
              </motion.div>
            )}

            {/* Controls overlay */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleReset();
                }}
                className="glass-card px-4 py-2 flex items-center gap-2 text-xs font-medium hover:border-primary/30 transition-colors"
              >
                <RotateCcw size={12} />
                Reset
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Fish Collection */}
        {caughtList.length > 0 && (
          <motion.div
            className="mt-8 glass-card p-5 md:p-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Trophy size={16} className="text-primary" />
              <h3 className="font-heading text-base font-semibold">Fish Collection</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {caughtList.map(({ fish, count }) => (
                <motion.div
                  key={fish.name}
                  className="glass-card p-3 text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="text-2xl">{fish.emoji}</span>
                  <p className="text-xs font-medium text-foreground mt-1">{fish.name}</p>
                  <p className="text-[10px] text-muted-foreground">{count} caught</p>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded mt-1 inline-block ${
                    fish.rarity === 'legendary' ? 'bg-warning/20 text-warning' :
                    fish.rarity === 'rare' ? 'bg-info/20 text-info' :
                    'bg-muted/50 text-muted-foreground'
                  }`}>
                    {fish.rarity}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default FishingGame;
