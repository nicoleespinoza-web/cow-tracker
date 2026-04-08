import { useRef } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Flame } from 'lucide-react';

export default function Share() {
  const { streak, totalDaysLogged, cowCount, farmName } = useApp();
  const exportingRef = useRef(false);

  const displayName = farmName && farmName !== 'My' ? `${farmName}'s Farm` : 'My Farm';

  const handleShare = async () => {
    if (exportingRef.current) return;
    exportingRef.current = true;

    try {
      const W = 1080;
      const H = 1920;
      const canvas = document.createElement('canvas');
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw background image
      const bg = new Image();
      bg.src = '/onboarding-bg.jpg';
      await new Promise<void>((res, rej) => {
        bg.onload = () => res();
        bg.onerror = () => rej();
      });

      // Cover-fit the image into the canvas
      const scale = Math.max(W / bg.width, H / bg.height);
      const sw = bg.width * scale;
      const sh = bg.height * scale;
      ctx.drawImage(bg, (W - sw) / 2, (H - sh) / 2, sw, sh);

      // 60% dark overlay
      ctx.fillStyle = 'rgba(0,0,0,0.60)';
      ctx.fillRect(0, 0, W, H);

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Farm name — Caveat bold
      ctx.font = 'bold 128px Caveat, cursive';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(displayName, W / 2, 580);

      // Divider
      ctx.strokeStyle = 'rgba(255,255,255,0.25)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(W * 0.2, 700);
      ctx.lineTo(W * 0.8, 700);
      ctx.stroke();

      // Stats — larger, spaced out
      ctx.font = 'bold 80px system-ui, sans-serif';

      // Streak
      ctx.fillStyle = '#fb923c';
      ctx.fillText('🔥', W / 2 - 200, 860);
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.fillText(`${streak} day streak`, W / 2 - 130, 860);

      // Total days
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`📅  ${totalDaysLogged} days logged`, W / 2, 1020);

      // Cows saved
      ctx.fillText(`🐄  ${cowCount} cow${cowCount !== 1 ? 's' : ''} saved`, W / 2, 1180);

      // Tagline
      ctx.font = '48px system-ui, sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.55)';
      ctx.fillText('Cow Saver — every day counts 🌱', W / 2, 1420);

      // Export
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], 'cowsaver-card.png', { type: 'image/png' });
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({ files: [file], title: displayName }).catch(() => {});
        } else {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'cowsaver-card.png';
          a.click();
          URL.revokeObjectURL(url);
        }
      }, 'image/png');
    } finally {
      exportingRef.current = false;
    }
  };

  return (
    <div className="relative h-full overflow-hidden">
      <div
        className="absolute inset-0 bg-center bg-cover"
        style={{ backgroundImage: `url(/onboarding-bg.jpg)` }}
      />
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center text-white">
        <h1
          className="text-5xl font-extrabold leading-tight mb-6"
          style={{ fontFamily: "'Fredoka One', cursive" }}
        >
          {displayName}
        </h1>

        {/* Divider */}
        <div className="w-2/3 h-px bg-white/25 mb-8" />

        {/* Stats */}
        <div className="flex flex-col gap-5 mb-12 w-full max-w-xs">
          <div className="flex items-center justify-center gap-3">
            <Flame className="w-8 h-8 text-orange-400 fill-orange-400 flex-shrink-0" />
            <span className="text-3xl font-bold">{streak} day streak</span>
          </div>
          <div className="flex items-center justify-center gap-3">
            <span className="text-3xl">📅</span>
            <span className="text-3xl font-bold">{totalDaysLogged} days logged</span>
          </div>
          <div className="flex items-center justify-center gap-3">
            <span className="text-3xl">🐄</span>
            <span className="text-3xl font-bold">{cowCount} cow{cowCount !== 1 ? 's' : ''} saved</span>
          </div>
        </div>

        {/* Tagline */}
        <p className="text-sm text-white/50 mb-10">Cow Saver — every day counts </p>

        {/* Share button */}
        <button
          onClick={handleShare}
          className="px-10 py-4 rounded-full text-base font-semibold bg-[#9dbf8c] text-white hover:bg-[#8ca26d] active:scale-[0.97] transition-all shadow-lg"
        >
          Save &amp; Share Card
        </button>
      </div>

    </div>
  );
}
