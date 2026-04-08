import { useLocation, useNavigate } from 'react-router-dom';
import { Home, BarChart3, Share2 } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', icon: Home, label: 'Farm' },
  { path: '/stats', icon: BarChart3, label: 'Impact' },
  { path: '/share', icon: Share2, label: 'Share' },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="shrink-0 bg-card/95 backdrop-blur-md border-t border-border z-40" style={{ height: 56 }}>
      <div className="flex justify-around items-center h-full">
        {NAV_ITEMS.map((item) => {
          const active = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-0.5 px-6 py-1 transition-colors ${
                active ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-semibold">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
