import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Bus,
  CreditCard,
  CalendarCheck,
  BookOpen,
  Calendar,
  BellRing,
  FileText,
  Award,
  Sparkles,
  Settings,
  Users,
  UserCheck,
  MapPin,
  Navigation,
  ShieldAlert,
  ClipboardList,
  Compass,
  Layers,
  HeartHandshake,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { role } = useAuth();

  const getLinks = (currentRole: UserRole | null) => {
    switch (currentRole) {
      case 'parent':
        return [
          { to: '/parent/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { to: '/parent/live-tracking', label: 'Track School Bus', icon: Navigation, highlight: true },
          { to: '/parent/fees', label: 'Fees & Payments', icon: CreditCard },
          { to: '/parent/attendance', label: 'Attendance', icon: CalendarCheck },
          { to: '/parent/homework', label: 'Homework', icon: BookOpen },
          { to: '/parent/exam-routine', label: 'Exam Routine', icon: Calendar },
          { to: '/parent/notices', label: 'School Notices', icon: BellRing },
          { to: '/parent/leave', label: 'Leave & Bus Skip', icon: FileText },
          { to: '/parent/report-card', label: 'Report Card', icon: Award },
          { to: '/parent/activities', label: 'School Activities', icon: Sparkles },
          { to: '/parent/settings', label: 'Settings', icon: Settings },
        ];
      case 'driver':
        return [
          { to: '/driver/dashboard', label: 'Driver Dashboard', icon: LayoutDashboard },
          { to: '/driver/route', label: 'Live Route & Boarding', icon: Navigation, highlight: true },
          { to: '/driver/leave-audit', label: "Today's Leave & Skips", icon: ClipboardList },
          { to: '/driver/emergency', label: 'Report Emergency', icon: ShieldAlert, danger: true },
        ];
      case 'teacher':
        return [
          { to: '/teacher/dashboard', label: 'Teacher Dashboard', icon: LayoutDashboard },
          { to: '/teacher/attendance', label: 'Mark Attendance', icon: CalendarCheck, highlight: true },
          { to: '/teacher/homework', label: 'Homework Manager', icon: BookOpen },
          { to: '/teacher/students', label: 'My Students', icon: Users },
          { to: '/teacher/notices', label: 'School Notices', icon: BellRing },
        ];
      case 'admin':
        return [
          { to: '/admin/dashboard', label: 'Overview Dashboard', icon: LayoutDashboard },
          { to: '/admin/live-tracking', label: 'Fleet Live Tracking', icon: Navigation, highlight: true },
          { to: '/admin/students', label: 'Students', icon: Users },
          { to: '/admin/parents', label: 'Parents', icon: UserCheck },
          { to: '/admin/buses', label: 'Buses', icon: Bus },
          { to: '/admin/drivers', label: 'Drivers', icon: HeartHandshake },
          { to: '/admin/routes', label: 'Routes & Stops', icon: Compass },
          { to: '/admin/geofence-editor', label: 'Geofence Map Editor', icon: MapPin },
          { to: '/admin/attendance', label: 'Attendance Records', icon: CalendarCheck },
          { to: '/admin/fees', label: 'Fees & Invoices', icon: CreditCard },
          { to: '/admin/leaves', label: 'Leave Requests', icon: FileText },
          { to: '/admin/notices', label: 'Publish Notices', icon: BellRing },
          { to: '/admin/settings', label: 'School & SaaS Settings', icon: Settings },
        ];
      default:
        return [];
    }
  };

  const links = getLinks(role);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-30 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-30 w-64 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } pt-16 lg:pt-0`}
      >
        {/* Top Desktop Brand Header */}
        <div className="hidden lg:flex items-center gap-3 px-6 py-5 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-emerald-800 flex items-center justify-center text-white font-bold text-sm tracking-tight shadow-xs font-mono">
            S
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight text-slate-900 leading-none">
              SchoolSync
            </h1>
            <p className="text-[11px] text-slate-400 font-medium mt-1">Smart Transport & Safety</p>
          </div>
        </div>

        {/* Navigation Link List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            {role ? `${role.toUpperCase()} PORTAL` : 'NAVIGATION'}
          </div>

          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => onClose()}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-900 text-white font-semibold shadow-xs'
                      : link.danger
                      ? 'text-red-600 hover:bg-red-50'
                      : link.highlight
                      ? 'text-emerald-800 bg-emerald-50 hover:bg-emerald-100 font-semibold'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{link.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Bottom Status Card */}
        <div className="p-3.5 border-t border-slate-100 bg-slate-50 m-3 rounded-2xl border border-slate-200/80 text-xs">
          <div className="flex items-center justify-between text-[11px] text-slate-600">
            <span className="font-semibold text-slate-800">Transport & Roster</span>
            <span className="font-mono text-emerald-700 font-bold">Active</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            Realtime GPS & Roster Categories
          </p>
        </div>
      </aside>
    </>
  );
};
