import BabyCow from './BabyCow';

interface PastureProps {
  cowCount: number;
  showSecondPasture: boolean;
}

// grassX/grassY are the absolute SVG coords of the inner grass top-left corner.
// All returned positions are in absolute SVG coordinates.
function getCowPositions(
  count: number,
  grassX: number, grassY: number,
  grassW: number, grassH: number,
  offset = 0
): { x: number; y: number; flipped: boolean; size: number }[] {
  if (count === 0) return [];

  // 15px hard inset from every fence edge — cows never go near the fence
  const pad = 15;
  const areaX = grassX + pad;
  const areaY = grassY + pad;
  const areaW = grassW - pad * 2;
  const areaH = grassH - pad * 2;

  // Grid: choose cols so cells are roughly square, then fit rows into the area
  const cols = Math.max(1, Math.round(Math.sqrt(count * areaW / areaH)));
  const rows = Math.ceil(count / cols);

  // Cell dims derived entirely from the available area — grid ALWAYS fits
  const cellW = areaW / cols;
  const cellH = areaH / rows;

  // Cow fills 60% of the smaller cell dimension, max 40px
  const cowSize = Math.min(40, Math.min(cellW, cellH) * 0.6);

  // Jitter: at most 15% of leftover space per side so cow stays inside its cell
  const jBudgetX = (cellW - cowSize) / 2 * 0.3;
  const jBudgetY = (cellH - cowSize) / 2 * 0.3;

  const positions: { x: number; y: number; flipped: boolean; size: number }[] = [];
  for (let i = 0; i < count; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const hash = ((i + 42 + offset) * 2654435761) >>> 0;
    const jx = ((hash % 100) / 100 - 0.5) * 2 * jBudgetX;
    const jy = (((hash >>> 8) % 100) / 100 - 0.5) * 2 * jBudgetY;
    // Absolute SVG position of this cow's center
    const x = areaX + cellW * col + cellW / 2 + jx;
    const y = areaY + cellH * row + cellH / 2 + jy;
    const flipped = hash % 2 === 0;
    positions.push({ x, y, flipped, size: cowSize });
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

  // SVG canvas dimensions
  const W = 340;
  const H = 600;

  // Fence sits pad px from the SVG edge; grass is strictly inside the fence
  const fencePad = 28;
  const grassX = fencePad;
  const grassY = fencePad;
  const grassW = W - fencePad * 2;  // 284
  const grassH = H - fencePad * 2;  // 354

  // Second pasture SVG dimensions
  const SH = 160;
  const sGrassX = 20;
  const sGrassY = 20;
  const sGrassW = W - 40;
  const sGrassH = SH - 40;

  // Cow positions in absolute SVG coordinates — no translate needed
  const positions1 = getCowPositions(firstPastureCows, grassX, grassY, grassW, grassH);
  const positions2 = getCowPositions(secondPastureCows, sGrassX, sGrassY, sGrassW, sGrassH, 100);

  // Posts: spaced every 28px, derived from actual dimensions
  const hPostCount = Math.ceil(grassW / 28) + 1;
  const vPostCount = Math.ceil(grassH / 28) + 1;
  const topPosts = Array.from({ length: hPostCount }, (_, i) => fencePad + i * (grassW / (hPostCount - 1)));
  const sidePosts = Array.from({ length: vPostCount }, (_, i) => fencePad + i * (grassH / (vPostCount - 1)));

  // Trees: spaced every 28px fully lining all 4 sides
  const hTreeCount = Math.ceil(grassW / 28) + 1;
  const vTreeCount = Math.ceil(grassH / 28) + 1;
  const treesTop = Array.from({ length: hTreeCount }, (_, i) => ({ x: fencePad + i * (grassW / (hTreeCount - 1)), y: fencePad - 15, size: 0.7 + (i % 3) * 0.08 }));
  const treesBottom = Array.from({ length: hTreeCount }, (_, i) => ({ x: fencePad + i * (grassW / (hTreeCount - 1)), y: H - fencePad + 17, size: 0.68 + (i % 2) * 0.08 }));
  const treesLeft = Array.from({ length: vTreeCount }, (_, i) => ({ x: fencePad - 14, y: fencePad + i * (grassH / (vTreeCount - 1)), size: 0.65 + (i % 3) * 0.08 }));
  const treesRight = Array.from({ length: vTreeCount }, (_, i) => ({ x: W - fencePad + 15, y: fencePad + i * (grassH / (vTreeCount - 1)), size: 0.65 + (i % 2) * 0.08 }));

  return (
    <div className="w-full h-full overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          {/* Hard clip to inner grass — belt-and-suspenders guarantee */}
          <clipPath id="pastureClip">
            <rect x={grassX} y={grassY} width={grassW} height={grassH} />
          </clipPath>
        </defs>

        <rect width={W} height={H} fill="hsl(90, 40%, 75%)" rx="12" />
        <rect x={grassX} y={grassY} width={grassW} height={grassH} fill="hsl(80, 50%, 78%)" rx="4" />

        {[...treesTop, ...treesBottom, ...treesLeft, ...treesRight].map((t, i) => (
          <Tree key={i} x={t.x} y={t.y} size={t.size} />
        ))}

        <FenceSegment x1={fencePad} y1={fencePad} x2={fencePad + grassW} y2={fencePad} />
        {topPosts.map((x, i) => <FencePost key={`t${i}`} x={x} y={fencePad} />)}

        <FenceSegment x1={fencePad} y1={fencePad + grassH} x2={fencePad + grassW} y2={fencePad + grassH} />
        {topPosts.map((x, i) => <FencePost key={`b${i}`} x={x} y={fencePad + grassH} />)}

        <FenceSegment x1={fencePad} y1={fencePad} x2={fencePad} y2={fencePad + grassH} />
        {sidePosts.map((y, i) => <FencePost key={`l${i}`} x={fencePad} y={y} />)}

        <FenceSegment x1={fencePad + grassW} y1={fencePad} x2={fencePad + grassW} y2={fencePad + grassH} />
        {sidePosts.map((y, i) => <FencePost key={`r${i}`} x={fencePad + grassW} y={y} />)}

        {/* Cows use absolute SVG coords — no translate, clipped to grass */}
        <g clipPath="url(#pastureClip)">
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

      {showSecondPasture && (
        <div className="w-full mt-2 animate-fade-in-up">
          <svg viewBox={`0 0 ${W} ${SH}`} className="w-full" preserveAspectRatio="xMidYMid meet">
            <defs>
              <clipPath id="pasture2Clip">
                <rect x={sGrassX} y={sGrassY} width={sGrassW} height={sGrassH} />
              </clipPath>
            </defs>
            <rect width={W} height={SH} fill="hsl(90, 40%, 75%)" rx="12" />
            <rect x={sGrassX} y={sGrassY} width={sGrassW} height={sGrassH} fill="hsl(80, 50%, 78%)" rx="4" />
            <line x1={sGrassX} y1={sGrassY} x2={sGrassX + sGrassW} y2={sGrassY} stroke="hsl(30, 40%, 45%)" strokeWidth="3" />
            <line x1={sGrassX} y1={sGrassY + sGrassH} x2={sGrassX + sGrassW} y2={sGrassY + sGrassH} stroke="hsl(30, 40%, 45%)" strokeWidth="3" />
            <line x1={sGrassX} y1={sGrassY} x2={sGrassX} y2={sGrassY + sGrassH} stroke="hsl(30, 40%, 45%)" strokeWidth="3" />
            <line x1={sGrassX + sGrassW} y1={sGrassY} x2={sGrassX + sGrassW} y2={sGrassY + sGrassH} stroke="hsl(30, 40%, 45%)" strokeWidth="3" />
            <ellipse cx={W - 70} cy="70" rx="25" ry="15" fill="hsl(200, 50%, 72%)" opacity="0.6" />
            <g clipPath="url(#pasture2Clip)">
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
