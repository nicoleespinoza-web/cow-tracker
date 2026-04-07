import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import Pasture from '@/components/Pasture';
import StreakBadge from '@/components/StreakBadge';
import CelebrationOverlay from '@/components/CelebrationOverlay';
import BottomNav from '@/components/BottomNav';
import { Check } from 'lucide-react';
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
  const { streak, loggedToday, logDay, resetStreak, addTestDays, cowCount, totalDaysLogged, streakResetMessage, dismissStreakMessage, farmName } = useApp();
  const [logPopupOpen, setLogPopupOpen] = useState(false);
  const [showMeatConfirm, setShowMeatConfirm] = useState(false);
  const showSecondPasture = totalDaysLogged >= 90;
  const currentBadge = getCurrentBadge(totalDaysLogged);

  const daysTowardNextCow = totalDaysLogged % 7;
  const progressPercent = (daysTowardNextCow / 7) * 100;

  const handleLogToday = () => {
    logDay();
    setShowMeatConfirm(false);
    setLogPopupOpen(true);
  };

  const handleClosePopup = () => {
    setShowMeatConfirm(false);
    setLogPopupOpen(false);
  };

  const handleIateMeat = () => {
    setShowMeatConfirm(true);
    setLogPopupOpen(true);
  };

  const handleConfirmYes = () => {
    resetStreak();
    handleClosePopup();
  };

  const handleConfirmNo = () => {
    handleClosePopup();
  };

  return (
    <div className="min-h-screen bg-background pb-20 flex flex-col">
      <CelebrationOverlay />
      {logPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 py-6">
          <div className="relative w-full max-w-md overflow-hidden rounded-[32px] bg-white p-6 shadow-2xl ring-1 ring-black/10">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-32 overflow-hidden">
              <div className="absolute left-6 top-6 h-3 w-3 rounded-full bg-rose-400 opacity-90 animate-pulse" />
              <div className="absolute left-20 top-12 h-2 w-2 rounded-full bg-amber-400 opacity-80" />
              <div className="absolute right-16 top-10 h-2 w-2 rounded-full bg-emerald-400 opacity-80" />
              <div className="absolute right-10 top-20 h-2 w-2 rounded-full bg-sky-400 opacity-90" />
              <div className="absolute left-28 top-20 h-2 w-2 rounded-full bg-fuchsia-400 opacity-90" />
            </div>
            <div className="flex justify-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-emerald-100 text-5xl">
                🐄
              </div>
            </div>
            <div className="mt-6 text-center">
              {showMeatConfirm ? (
                <>
                  <h2 className="text-xl font-semibold text-foreground">Did you eat meat today?</h2>
                  <p className="mt-3 text-sm text-muted-foreground">Choose an option below.</p>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-foreground">Your herd is growing! 🐄</h2>
                  <p className="mt-3 text-sm text-muted-foreground">Keep the momentum going and watch your pasture fill up.</p>
                </>
              )}
            </div>
            <div className="mt-6 flex flex-col gap-3">
              {showMeatConfirm ? (
                <>
                  <button
                    type="button"
                    className="w-full rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600"
                    onClick={handleConfirmYes}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    className="w-full rounded-2xl border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground hover:bg-muted"
                    onClick={handleConfirmNo}
                  >
                    No
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="w-full rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600"
                  onClick={handleClosePopup}
                >
                  Amazing!
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="px-5 pt-5 pb-1">
        <h1 className="text-[36px] leading-tight font-extrabold text-foreground text-center tracking-wide" style={{ fontFamily: "'Caveat', cursive" }}>
          {farmName && farmName !== 'My' ? `${farmName}'s Farm` : 'My Farm'}
        </h1>
      </div>

      {/* Progress bar + streak */}
      <div className="flex items-center gap-3 px-5 pb-3">
        <img src={cowIcon} alt="cow" className="w-9 h-9 object-contain flex-shrink-0" />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-foreground">{daysTowardNextCow}/7</span>
            <span className="text-[10px] text-muted-foreground">next cow</span>
          </div>
          <Progress value={progressPercent} className="h-3 bg-muted" />
        </div>
        <StreakBadge streak={streak} />
      </div>

      {/* Streak reset message */}
      {streakResetMessage && (
        <div className="mx-5 mb-2 p-3 bg-warm-light rounded-2xl border border-warm/30 animate-fade-in-up">
          <p className="text-sm text-foreground">{streakResetMessage}</p>
          <button onClick={dismissStreakMessage} className="text-xs text-muted-foreground mt-1 underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Farm view */}
      <div className="flex-1 px-2">
        <Pasture cowCount={cowCount} showSecondPasture={showSecondPasture} />
      </div>

      {/* Bottom action bar */}
      <div className="px-4 pb-2 mt-2">
        <div className="flex flex-col gap-3 bg-card rounded-2xl border border-border p-3 shadow-sm">
          <div className="flex items-center justify-between">
            {currentBadge ? (
              <div className="flex items-center gap-1.5">
                <span className="text-lg">🏅</span>
                <span className="text-sm font-bold text-foreground">{currentBadge.name}</span>
              </div>
            ) : (
              <div />
            )}
            <button
              onClick={handleLogToday}
              disabled={loggedToday}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center gap-1.5 shrink-0 ${
                loggedToday
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : 'bg-primary text-primary-foreground shadow-md hover:shadow-lg active:scale-[0.97]'
              }`}
            >
              {loggedToday ? (
                <>
                  <Check className="w-4 h-4" />
                  Logged
                </>
              ) : (
                'Log Today'
              )}
            </button>
          </div>
          {!loggedToday && (
            <button
              type="button"
              className="text-xs text-muted-foreground underline self-start"
              onClick={handleIateMeat}
            >
              I ate meat today
            </button>
          )}
        </div>
      </div>

      {/* Debug test button */}
      <div className="px-4 pb-2">
        <button
          onClick={() => addTestDays(7)}
          className="w-full py-2 rounded-xl text-xs font-bold bg-accent/20 text-accent-foreground border border-accent/30"
        >
          +7 days (test) — Total: {totalDaysLogged} days, {cowCount} cows
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
