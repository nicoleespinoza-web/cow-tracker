import { useApp } from '@/contexts/AppContext';

const BADGES = [
  { name: 'First Calf', days: 7 },
  { name: 'Growing Herd', days: 30 },
  { name: 'Full Pasture', days: 180 },
  { name: 'Guardian', days: 365 },
];

export default function FarmBadges() {
  const { totalDaysLogged } = useApp();

  return (
    <div className="flex justify-center gap-3 px-4">
      {BADGES.map((badge) => {
        const unlocked = totalDaysLogged >= badge.days;
        return (
          <div key={badge.name} className="flex flex-col items-center gap-1">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold border-2 transition-colors ${
                unlocked
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-muted text-muted-foreground border-border'
              }`}
            >
              {badge.days}
            </div>
            <span
              className={`text-[10px] font-semibold text-center leading-tight ${
                unlocked ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {badge.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}
