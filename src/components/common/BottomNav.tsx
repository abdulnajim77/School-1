import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Navigation, CreditCard, BellRing, User, Bus, ClipboardList } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const BottomNav: React.FC = () => {
  const { role } = useAuth();

  if (role !== 'parent' && role !== 'driver') return null;

  const parentNavItems = [
    { to: '/parent/dashboard', label: 'Home', icon: LayoutDashboard },
    { to: '/parent/live-tracking', label: 'Live Bus', icon: Navigation, pulse: true },
    { to: '/parent/fees', label: 'Fees', icon: CreditCard },
    { to: '/parent/notices', label: 'Notices', icon: BellRing },
    { to: '/parent/settings', label: 'Profile', icon: User },
  ];

  const driverNavItems = [
    { to: '/driver/dashboard', label: 'Home', icon: LayoutDashboard },
    { to: '/driver/route', label: 'Route', icon: Navigation, pulse: true },
    { to: '/driver/leave-audit', label: 'Leaves', icon: ClipboardList },
    { to: '/driver/emergency', label: 'Emergency', icon: Bus },
  ];

  const items = role === 'parent' ? parentNavItems : driverNavItems;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-1.5 shadow-lg">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-2 rounded-xl transition ${
                  isActive ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="relative">
                    <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''}`} />
                    {item.pulse && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                    )}
                  </div>
                  <span className="text-[10px] mt-0.5">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
