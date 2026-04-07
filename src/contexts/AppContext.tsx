import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface AppState {
  onboarded: boolean;
  startingPoint: string | null;
  farmName: string;
  daysLogged: string[];
  streak: number;
  longestStreak: number;
  loggedToday: boolean;
  cowCount: number;
  celebrationActive: boolean;
  streakResetMessage: string | null;
}

interface AppContextType extends AppState {
  completeOnboarding: (startingPoint: string, name: string) => void;
  logDay: () => void;
  addTestDays: (count: number) => void;
  dismissStreakMessage: () => void;
  dismissCelebration: () => void;
  resetStreak: () => void;
  totalDaysLogged: number;
  unlockedMilestones: number[];
}

const AppContext = createContext<AppContextType | null>(null);

const MILESTONES = [10, 30, 60, 100];

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

function calculateStreak(days: string[]): number {
  if (days.length === 0) return 0;
  const sorted = [...days].sort().reverse();
  const today = getToday();
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  if (sorted[0] !== today && sorted[0] !== yesterday) return 0;
  
  let streak = 1;
  for (let i = 0; i < sorted.length - 1; i++) {
    const curr = new Date(sorted[i]);
    const prev = new Date(sorted[i + 1]);
    const diff = (curr.getTime() - prev.getTime()) / 86400000;
    if (diff === 1) streak++;
    else break;
  }
  return streak;
}

function getInitialDays(startingPoint: string): string[] {
  const days: string[] = [];
  const today = new Date();
  let count = 0;
  
  switch (startingPoint) {
    case 'few-weeks': count = 14; break;
    case 'few-months': count = 60; break;
    case 'over-year': count = 365; break;
    default: count = 0;
  }
  
  for (let i = count; i > 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('cowsaver');
    if (saved) {
      const parsed = JSON.parse(saved);
      const streak = calculateStreak(parsed.daysLogged || []);
      const previousStreak = parsed.streak || 0;
      const loggedToday = (parsed.daysLogged || []).includes(getToday());
      
      let streakResetMessage: string | null = null;
      if (previousStreak > 0 && streak === 0 && !loggedToday) {
        streakResetMessage = "No worries — your cows missed you. Start fresh today. 🐄";
      }
      
      return {
        ...parsed,
        streak,
        loggedToday,
        celebrationActive: false,
        streakResetMessage,
      };
    }
    return {
      onboarded: false,
      startingPoint: null,
      farmName: '',
      daysLogged: [],
      streak: 0,
      longestStreak: 0,
      loggedToday: false,
      cowCount: 0,
      celebrationActive: false,
      streakResetMessage: null,
    };
  });

  useEffect(() => {
    const { celebrationActive, streakResetMessage, ...toSave } = state;
    localStorage.setItem('cowsaver', JSON.stringify(toSave));
  }, [state]);

  const completeOnboarding = useCallback((startingPoint: string, name: string) => {
    const initialDays = getInitialDays(startingPoint);
    const streak = calculateStreak(initialDays);
    const cowCount = Math.floor(initialDays.length / 7);
    setState(prev => ({
      ...prev,
      onboarded: true,
      startingPoint,
      farmName: name,
      daysLogged: initialDays,
      streak,
      longestStreak: streak,
      cowCount,
      loggedToday: initialDays.includes(getToday()),
    }));
  }, []);

  const logDay = useCallback(() => {
    const today = getToday();
    setState(prev => {
      if (prev.daysLogged.includes(today)) return prev;
      const newDays = [...prev.daysLogged, today];
      const newStreak = calculateStreak(newDays);
      const newCowCount = Math.floor(newDays.length / 7);
      return {
        ...prev,
        daysLogged: newDays,
        streak: newStreak,
        longestStreak: Math.max(prev.longestStreak, newStreak),
        loggedToday: true,
        cowCount: newCowCount,
        celebrationActive: true,
        streakResetMessage: null,
      };
    });
  }, []);

  const resetStreak = useCallback(() => {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    setState(prev => {
      const brokenDays = prev.daysLogged.filter(day => day !== getToday() && day !== yesterday);
      return {
        ...prev,
        daysLogged: brokenDays,
        streak: 0,
        loggedToday: false,
        celebrationActive: false,
        streakResetMessage: 'Every day is a new start 🌱',
      };
    });
  }, []);

  const addTestDays = useCallback((count: number) => {
    setState(prev => {
      const newDays = [...prev.daysLogged];
      const today = new Date();
      // Add days before the earliest existing day
      const earliest = newDays.length > 0 ? new Date(newDays.sort()[0]) : today;
      for (let i = 1; i <= count; i++) {
        const d = new Date(earliest);
        d.setDate(d.getDate() - i);
        const iso = d.toISOString().split('T')[0];
        if (!newDays.includes(iso)) newDays.push(iso);
      }
      const newStreak = calculateStreak(newDays);
      const newCowCount = Math.floor(newDays.length / 7);
      return {
        ...prev,
        daysLogged: newDays,
        streak: newStreak,
        longestStreak: Math.max(prev.longestStreak, newStreak),
        cowCount: newCowCount,
      };
    });
  }, []);

  const dismissStreakMessage = useCallback(() => {
    setState(prev => ({ ...prev, streakResetMessage: null }));
  }, []);

  const dismissCelebration = useCallback(() => {
    setState(prev => ({ ...prev, celebrationActive: false }));
  }, []);

  const totalDaysLogged = state.daysLogged.length;
  const unlockedMilestones = MILESTONES.filter(m => state.streak >= m);

  return (
    <AppContext.Provider value={{
      ...state,
      completeOnboarding,
      logDay,
      resetStreak,
      addTestDays,
      dismissStreakMessage,
      dismissCelebration,
      totalDaysLogged,
      unlockedMilestones,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
