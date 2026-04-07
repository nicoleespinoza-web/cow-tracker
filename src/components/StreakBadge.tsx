import { Flame } from 'lucide-react';

interface StreakBadgeProps {
  streak: number;
}

export default function StreakBadge({ streak }: StreakBadgeProps) {
  return (
    <div className="flex items-center gap-1.5 bg-card/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm border border-border flex-shrink-0">
      <Flame className="w-9 h-9 text-orange-500 fill-orange-400" />
      <span className="text-2xl font-extrabold text-foreground leading-none">{streak}</span>
    </div>
  );
}
