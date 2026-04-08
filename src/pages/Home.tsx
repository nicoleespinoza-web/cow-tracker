import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import Pasture from '@/components/Pasture';
import CelebrationOverlay from '@/components/CelebrationOverlay';
import { Check, Flame } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import cowIcon from '@/assets/baby-cow.webp';

const BADGES = [
  { name: 'First Calf', days: 7 },
  { name: 'Growing Herd', days: 30 },
  { name: 'Full Pasture', days: 180 },
  { name: 'Guardian', days: 365 },
];

function getCurrentBadge(totalDays: number) {
  const earned = BADGES.filter(b => totalDays >= b.days);
  return earned.length > 0 ? earned[earned.length - 1] : null;
}

export default function Home() {
  const { streak, loggedToday, logDay, cowCount, totalDaysLogged, streakResetMessage, dismissStreakMessage, farmName } = useApp();
  const [logPopupOpen, setLogPopupOpen] = useState(false);
  const showSecondPasture = totalDaysLogged >= 90;
  const currentBadge = getCurrentBadge(totalDaysLogged);
  const daysTowardNextCow = totalDaysLogged % 7;
  const progressPercent = (daysTowardNextCow / 7) * 100;

  return (
    <div className="flex flex-col bg-background h-full">
      <CelebrationOverlay />

      {logPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4">
          <div className="relative w-full max-w-sm overflow-hidden rounded-[32px] bg-white p-6 shadow-2xl ring-1 ring-black/10">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-32 overflow-hidden">
              <div className="absolute left-6 top-6 h-3 w-3 rounded-full bg-rose-400 opacity-90 animate-pulse" />
              <div className="absolute left-20 top-12 h-2 w-2 rounded-full bg-amber-400 opacity-80" />
              <div className="absolute right-16 top-10 h-2 w-2 rounded-full bg-emerald-400 opacity-80" />
              <div className="absolute right-10 top-20 h-2 w-2 rounded-full bg-sky-400 opacity-90" />
              <div className="absolute left-28 top-20 h-2 w-2 rounded-full bg-fuchsia-400 opacity-90" />
            </div>
            <div className="flex justify-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-emerald-100 text-5xl">🐄</div>
            </div>
            <div className="mt-6 text-center">
              <h2 className="text-2xl font-bold text-foreground">Your herd is growing! 🐄</h2>
              <p className="mt-3 text-sm text-muted-foreground">Keep the momentum going and watch your pasture fill up.</p>
            </div>
            <div className="mt-6">
              <button
                type="button"
                className="w-full rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white"
                onClick={() => setLogPopupOpen(false)}
              >
                Amazing!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Title — 60px */}
      <div className="shrink-0 flex items-center justify-center px-5" style={{ height: 60 }}>
        <h1
          className="text-[40px] font-extrabold text-foreground text-center leading-none"
          style={{ fontFamily: "'Fredoka One', cursive" }}
        >
          {farmName && farmName !== 'My' ? `${farmName}'s Farm` : 'My Farm'}
        </h1>
      </div>

      {/* Progress / streak row — 40px */}
      <div className="shrink-0 flex items-center gap-3 px-5" style={{ height: 40 }}>
        <div className="flex-1 relative flex items-center">
          {/* Progress bar shifted right to leave room, cow overlaps its left edge */}
          <div className="flex-1 relative" style={{ paddingLeft: 20 }}>
            <Progress value={progressPercent} className="h-4 bg-muted w-full" />
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold tabular-nums" style={{ color: 'white', textShadow: '0 0 3px rgba(0,0,0,0.5)', paddingLeft: 20 }}>{daysTowardNextCow}/7</span>
          </div>
          {/* Cow sits at the left edge of the bar, z-index above it */}
          <img src={cowIcon} alt="cow" width={40} height={40} className="object-contain absolute z-10" style={{ left: 0 }} />
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Flame width={28} height={28} className="text-orange-500 fill-orange-400 shrink-0" />
          <span className="text-xl font-extrabold text-foreground leading-none">{streak}</span>
        </div>
      </div>

      {streakResetMessage && (
        <div className="mx-4 mt-1 p-3 bg-muted rounded-2xl shrink-0">
          <p className="text-sm text-foreground">{streakResetMessage}</p>
          <button onClick={dismissStreakMessage} className="text-xs text-muted-foreground mt-1 underline">Dismiss</button>
        </div>
      )}

      {/* Farm pasture — fills ALL remaining space */}
      <div className="flex-1 min-h-0 px-4">
        <Pasture cowCount={cowCount} showSecondPasture={showSecondPasture} />
      </div>

      {/* Bottom action bar — 70px */}
      <div className="shrink-0 px-4 flex items-center" style={{ height: 70 }}>
        <div className="w-full flex items-center justify-between bg-card rounded-2xl border border-border px-4 h-[54px] shadow-sm">
          {currentBadge ? (
            <div className="flex items-center gap-1.5">
              <span className="text-lg">🏅</span>
              <span className="text-sm font-bold text-foreground">{currentBadge.name}</span>
            </div>
          ) : (
            <div />
          )}
          <button
            onClick={() => { logDay(); setLogPopupOpen(true); }}
            disabled={loggedToday}
            className={`px-6 h-10 rounded-xl text-sm font-bold transition-all duration-200 flex items-center gap-1.5 ${
              loggedToday
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : 'bg-primary text-primary-foreground shadow-md active:scale-[0.97]'
            }`}
          >
            {loggedToday ? <><Check className="w-4 h-4" /> Logged</> : 'Log Today'}
          </button>
        </div>
      </div>
    </div>
  );
}
