import { useEffect, useState } from 'react';
import { useApp } from '@/contexts/AppContext';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  delay: number;
}

const COLORS = [
  'hsl(150, 25%, 45%)',
  'hsl(35, 60%, 60%)',
  'hsl(120, 30%, 65%)',
  'hsl(45, 80%, 70%)',
  'hsl(350, 50%, 70%)',
];

export default function CelebrationOverlay() {
  const { celebrationActive, dismissCelebration } = useApp();
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (celebrationActive) {
      const newParticles: Particle[] = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: 30 + Math.random() * 40,
        y: 40 + Math.random() * 20,
        color: COLORS[i % COLORS.length],
        delay: Math.random() * 0.3,
      }));
      setParticles(newParticles);
      const timer = setTimeout(dismissCelebration, 1500);
      return () => clearTimeout(timer);
    }
  }, [celebrationActive, dismissCelebration]);

  if (!celebrationActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute w-3 h-3 rounded-full animate-confetti"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 text-4xl animate-float-up">
        🐄
      </div>
    </div>
  );
}
