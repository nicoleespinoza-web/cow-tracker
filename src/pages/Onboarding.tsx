import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const OPTIONS = [
  { id: 'just-starting', label: 'Just starting out' },
  { id: 'few-weeks', label: 'A few weeks in' },
  { id: 'few-months', label: 'A few months in' },
  { id: 'over-year', label: 'Over a year' },
];

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const { completeOnboarding } = useApp();
  const navigate = useNavigate();

  const handleSelect = (id: string) => {
    setSelected(id);
    setTimeout(() => {
      completeOnboarding(id, name.trim() || 'My');
      navigate('/', { replace: true });
    }, 300);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Full-screen background image */}
      <div
        className="absolute inset-0 bg-center bg-cover"
        style={{ backgroundImage: `url(/onboarding-bg.jpg)` }}
      />
      {/* 60% dark overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Centered content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 text-center text-white">
        {step === 1 && (
          <div className="max-w-2xl animate-fade-in-up">
            <div className="text-6xl mb-6">🐄</div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
              Welcome to Cow Saver
            </h1>
            <p className="text-base sm:text-lg leading-relaxed mb-10 text-white/80">
              Reducing meat — even a little — makes a real difference. No pressure. No judgment. Just you, your choices, and a farm full of very happy cows.
            </p>
            <Button
              size="lg"
              className="w-full max-w-xs rounded-full text-base font-semibold h-14 bg-[#9dbf8c] text-slate-950 hover:bg-[#8ca26d]"
              onClick={() => setStep(2)}
            >
              Let's go →
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="max-w-sm w-full text-center animate-fade-in-up">
            <h2 className="text-xl font-bold mb-2 text-white">
              What's your name?
            </h2>
            <p className="text-white/70 mb-4 text-sm">
              We'll name your farm after you!
            </p>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="text-center text-lg rounded-full h-14 mb-4 bg-white/10 border-white/30 text-white placeholder:text-white/50"
              autoFocus
            />
            <Button
              size="lg"
              className="w-full rounded-full text-base font-semibold h-14 bg-[#9dbf8c] text-slate-950 hover:bg-[#8ca26d]"
              onClick={() => setStep(3)}
              disabled={!name.trim()}
            >
              Next →
            </Button>
          </div>
        )}

        {step === 3 && (
          <div className="max-w-sm w-full text-center animate-fade-in-up">
            <h2 className="text-xl font-bold mb-2 text-white">
              How long have you been reducing meat?
            </h2>
            <p className="text-white/70 mb-8 text-sm">
              This helps us set up your farm.
            </p>
            <div className="flex flex-col gap-3">
              {OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleSelect(opt.id)}
                  className={`w-full py-4 px-6 rounded-full border-2 text-base font-semibold transition-all duration-200 ${
                    selected === opt.id
                      ? 'bg-[#9dbf8c] border-[#9dbf8c] text-slate-950 scale-[1.02]'
                      : 'bg-white/10 border-white/30 text-white hover:border-white/60'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
