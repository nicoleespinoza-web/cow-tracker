import cowImage from '@/assets/baby-cow.webp';

interface BabyCowProps {
  x: number;
  y: number;
  delay?: number;
  flipped?: boolean;
  size?: number;
}

export default function BabyCow({ x, y, delay = 0, flipped = false, size = 50 }: BabyCowProps) {
  return (
    <image
      href={cowImage}
      x={x - size / 2}
      y={y - size / 2}
      width={size}
      height={size}
      transform={flipped ? `translate(${2 * x}, 0) scale(-1, 1)` : undefined}
      style={{ animationDelay: `${delay}s` }}
      className="animate-gentle-bounce"
    />
  );
}
