import { useApp } from '@/contexts/AppContext';
import BottomNav from '@/components/BottomNav';
import { Share2 } from 'lucide-react';

export default function Share() {
  const { streak, totalDaysLogged, cowCount } = useApp();

  return (
    <div className="min-h-screen bg-background pb-20 flex flex-col">
      <div className="px-5 pt-5 pb-3">
        <h1 className="text-2xl font-extrabold text-foreground text-center" style={{ fontFamily: 'Nunito, sans-serif' }}>
          Share Your Impact
        </h1>
      </div>

      <div className="flex-1 px-5 flex flex-col items-center justify-center gap-6">
        {/* Share card */}
        <div className="w-full max-w-sm bg-card rounded-3xl border border-border p-6 shadow-md text-center space-y-4">
          <p className="text-4xl">🐄</p>
          <h2 className="text-xl font-extrabold text-foreground">
            I've saved {cowCount} cow{cowCount !== 1 ? 's' : ''}!
          </h2>
          <div className="flex justify-center gap-6 text-sm">
            <div>
              <p className="text-2xl font-bold text-primary">{streak}</p>
              <p className="text-muted-foreground">day streak</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">{totalDaysLogged}</p>
              <p className="text-muted-foreground">total days</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground italic">Cow Saver — every day counts 🌱</p>
        </div>

        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: 'Cow Saver',
                text: `I've saved ${cowCount} cow${cowCount !== 1 ? 's' : ''} with a ${streak}-day streak on Cow Saver! 🐄`,
              }).catch(() => {});
            }
          }}
          className="px-8 py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-sm shadow-md hover:shadow-lg active:scale-[0.97] transition-all flex items-center gap-2"
        >
          <Share2 className="w-4 h-4" />
          Share
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
