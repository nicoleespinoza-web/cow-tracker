import { useApp } from '@/contexts/AppContext';
import BottomNav from '@/components/BottomNav';
import { Droplets, Wind, Utensils } from 'lucide-react';

const STATS = [
  {
    icon: Wind,
    label: 'CO₂ saved',
    perDay: 3,
    unit: 'kg',
    color: 'text-primary',
    bgColor: 'bg-sage-light',
  },
  {
    icon: Droplets,
    label: 'Water saved',
    perDay: 1000,
    unit: 'L',
    color: 'text-sky-600',
    bgColor: 'bg-sky-light',
  },
  {
    icon: Utensils,
    label: 'Meals reimagined',
    perDay: 1,
    unit: '',
    color: 'text-warm',
    bgColor: 'bg-warm-light',
  },
];

export default function Stats() {
  const { totalDaysLogged } = useApp();

  const formatNumber = (n: number): string => {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
    return n.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="px-5 pt-5 pb-4">
        <h1 className="text-xl font-bold text-foreground">Your Impact</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Honest averages based on {totalDaysLogged} meat-free days
        </p>
      </div>

      <div className="px-5 space-y-4">
        {STATS.map((stat) => {
          const value = stat.perDay * totalDaysLogged;
          return (
            <div key={stat.label} className="p-5 bg-card rounded-2xl border border-border shadow-sm">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {formatNumber(value)}{stat.unit && <span className="text-base font-semibold text-muted-foreground ml-1">{stat.unit}</span>}
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                ~{stat.perDay.toLocaleString()}{stat.unit} per meat-free day
              </p>
            </div>
          );
        })}
      </div>

      <div className="px-5 mt-6">
        <div className="p-4 bg-sage-light rounded-2xl text-center">
          <p className="text-sm text-secondary-foreground">
            These are honest averages based on published environmental research. Every day counts. 🌱
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
