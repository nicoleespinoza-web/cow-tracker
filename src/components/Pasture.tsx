import BabyCow from './BabyCow';

interface PastureProps {
  cowCount: number;
  showSecondPasture: boolean;
}

function getCowPositions(count: number, fieldW: number, fieldH: number, offset = 0): { x: number; y: number; flipped: boolean; size: number }[] {
  if (count === 0) return [];
  const padding = 40;
  const cowRadius = 25;
  const minX = padding + cowRadius;
  const maxX = fieldW - padding - cowRadius;
  const minY = padding + cowRadius + 30;
  const maxY = fieldH - padding - cowRadius;

  // Grid-based placement: divide field into cells, one cow per cell
  const cols = Math.ceil(Math.sqrt(count * (maxX - minX) / (maxY - minY)));
  const rows = Math.ceil(count / cols);
  const cellW = (maxX - minX) / cols;
  const cellH = (maxY - minY) / rows;

  const positions: { x: number; y: number; flipped: boolean; size: number }[] = [];
  for (let i = 0; i < count; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const hash = ((i + 42 + offset) * 2654435761) >>> 0;
    // Random jitter within cell (30% of cell size)
    const jitterX = ((hash % 100) / 100 - 0.5) * cellW * 0.6;
    const jitterY = (((hash >>> 8) % 100) / 100 - 0.5) * cellH * 0.6;
    const x = Math.max(minX, Math.min(maxX, minX + (col + 0.5) * cellW + jitterX));
    const y = Math.max(minY, Math.min(maxY, minY + (row + 0.5) * cellH + jitterY));
    const flipped = hash % 2 === 0;
    const size = 48 + (hash % 13);
    positions.push({ x, y, flipped, size });
  }
  return positions;
}

// Simple top-down tree
function Tree({ x, y, size = 1 }: { x: number; y: number; size?: number }) {
  return (
    <g transform={`translate(${x}, ${y}) scale(${size})`}>
      <circle cx="0" cy="-6" r="10" fill="hsl(130, 35%, 45%)" />
      <circle cx="-6" cy="-2" r="8" fill="hsl(130, 30%, 50%)" />
      <circle cx="6" cy="-2" r="8" fill="hsl(130, 40%, 42%)" />
      <circle cx="0" cy="2" r="7" fill="hsl(130, 35%, 48%)" />
    </g>
  );
}

// Fence post + rail segment
function FenceSegment({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return (
    <>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="hsl(30, 40%, 45%)" strokeWidth="4" />
      <line x1={x1} y1={y1 - 5} x2={x2} y2={y2 - 5} stroke="hsl(30, 35%, 55%)" strokeWidth="2.5" />
    </>
  );
}

function FencePost({ x, y }: { x: number; y: number }) {
  return (
    <rect x={x - 3} y={y - 10} width="6" height="14" rx="1" fill="hsl(30, 35%, 40%)" stroke="hsl(30, 30%, 30%)" strokeWidth="0.5" />
  );
}

export default function Pasture({ cowCount, showSecondPasture }: PastureProps) {
  const firstPastureCows = Math.min(cowCount, showSecondPasture ? Math.ceil(cowCount * 0.6) : cowCount);
  const secondPastureCows = cowCount - firstPastureCows;

  const W = 340;
  const H = 340;
  const pad = 28; // fence inset
  const fieldX = pad;
  const fieldY = pad;
  const fieldW = W - pad * 2;
  const fieldH = H - pad * 2;

  const positions1 = getCowPositions(firstPastureCows, fieldW, fieldH);
  const positions2 = getCowPositions(secondPastureCows, fieldW, 120, 100);

  // Fence posts along edges
  const topPosts = Array.from({ length: 9 }, (_, i) => pad + i * (fieldW / 8));
  const sidePosts = Array.from({ length: 10 }, (_, i) => pad + i * (fieldH / 9));

  // Trees along edges (outside fence)
  const treesTop = Array.from({ length: 10 }, (_, i) => ({ x: pad + 10 + i * 28, y: pad - 12, size: 0.7 + (i % 3) * 0.08 }));
  const treesBottom = Array.from({ length: 10 }, (_, i) => ({ x: pad + 10 + i * 28, y: H - pad + 10, size: 0.68 + (i % 2) * 0.08 }));
  const treesLeft = Array.from({ length: 9 }, (_, i) => ({ x: pad - 14, y: pad + 20 + i * 28, size: 0.65 + (i % 3) * 0.08 }));
  const treesRight = Array.from({ length: 9 }, (_, i) => ({ x: W - pad + 10, y: pad + 20 + i * 28, size: 0.65 + (i % 2) * 0.08 }));

  return (
    <div className="w-full overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="xMidYMid meet">
        {/* Background */}
        <rect width={W} height={H} fill="hsl(90, 40%, 75%)" rx="12" />

        {/* Field interior - lighter green */}
        <rect x={fieldX} y={fieldY} width={fieldW} height={fieldH} fill="hsl(80, 50%, 78%)" rx="4" />

        {/* Trees around edges */}
        {[...treesTop, ...treesBottom, ...treesLeft, ...treesRight].map((t, i) => (
          <Tree key={i} x={t.x} y={t.y} size={t.size} />
        ))}

        {/* Fence - top */}
        <FenceSegment x1={pad} y1={pad} x2={pad + fieldW} y2={pad} />
        {topPosts.map((x, i) => <FencePost key={`t${i}`} x={x} y={pad} />)}

        {/* Fence - bottom */}
        <FenceSegment x1={pad} y1={pad + fieldH} x2={pad + fieldW} y2={pad + fieldH} />
        {topPosts.map((x, i) => <FencePost key={`b${i}`} x={x} y={pad + fieldH} />)}

        {/* Fence - left */}
        <FenceSegment x1={pad} y1={pad} x2={pad} y2={pad + fieldH} />
        {sidePosts.map((y, i) => <FencePost key={`l${i}`} x={pad} y={y} />)}

        {/* Fence - right */}
        <FenceSegment x1={pad + fieldW} y1={pad} x2={pad + fieldW} y2={pad + fieldH} />
        {sidePosts.map((y, i) => <FencePost key={`r${i}`} x={pad + fieldW} y={y} />)}

        {/* Cows */}
        <g transform={`translate(${fieldX}, ${fieldY})`}>
          {positions1.map((pos, i) => (
            <BabyCow key={i} x={pos.x} y={pos.y} delay={i * 0.5} flipped={pos.flipped} size={pos.size} />
          ))}
        </g>

        {cowCount === 0 && (
          <text x={W / 2} y={H / 2} textAnchor="middle" fill="hsl(150, 20%, 45%)" fontSize="13" fontFamily="Nunito, sans-serif">
            Log days to grow your herd!
          </text>
        )}
      </svg>

      {/* Second pasture */}
      {showSecondPasture && (
        <div className="w-full mt-2 animate-fade-in-up">
          <svg viewBox={`0 0 ${W} 160`} className="w-full" preserveAspectRatio="xMidYMid meet">
            <rect width={W} height="160" fill="hsl(90, 40%, 75%)" rx="12" />
            <rect x="20" y="20" width={W - 40} height="120" fill="hsl(80, 50%, 78%)" rx="4" />

            {/* Simple fence */}
            <line x1="20" y1="20" x2={W - 20} y2="20" stroke="hsl(30, 40%, 45%)" strokeWidth="3" />
            <line x1="20" y1="140" x2={W - 20} y2="140" stroke="hsl(30, 40%, 45%)" strokeWidth="3" />
            <line x1="20" y1="20" x2="20" y2="140" stroke="hsl(30, 40%, 45%)" strokeWidth="3" />
            <line x1={W - 20} y1="20" x2={W - 20} y2="140" stroke="hsl(30, 40%, 45%)" strokeWidth="3" />

            {/* Pond */}
            <ellipse cx={W - 70} cy="70" rx="25" ry="15" fill="hsl(200, 50%, 72%)" opacity="0.6" />

            <g transform="translate(20, 20)">
              {positions2.map((pos, i) => (
                <BabyCow key={i} x={pos.x} y={pos.y} delay={i * 0.5} flipped={pos.flipped} size={pos.size} />
              ))}
            </g>
          </svg>
        </div>
      )}
    </div>
  );
}
