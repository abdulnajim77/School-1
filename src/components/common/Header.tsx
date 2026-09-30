import React, { useState } from 'react';
import {
  Bell,
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
  Shield,
  Bus,
  GraduationCap,
  Sparkles,
  School as SchoolIcon,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useTransport } from '../../context/TransportContext';
import { NotificationDropdown } from './NotificationDropdown';
import { ThemeToggle } from './ThemeToggle';
import { UserRole } from '../../types';

interface HeaderProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const { user, role, quickDemoLogin, logout, selectedStudentId, setSelectedStudentId } = useAuth();
  const { school, students } = useSchoolData();
  const { unreadCount } = useTransport();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Parent's children
  const parentStudents = students.filter(
    (s) => s.parentId === user?.uid || user?.assignedStudentIds?.includes(s.id)
  );
  const activeStudent = students.find((s) => s.id === selectedStudentId) || students[0];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-2.5">
      <div className="flex items-center justify-between gap-2">
        {/* Left: Mobile Menu Toggle & Brand / School */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
            aria-label="Toggle navigation"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-800 flex items-center justify-center text-white shadow-xs font-bold text-sm tracking-tight font-mono">
              S
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base tracking-tight text-slate-900">
                  SchoolSync
                </span>
                <span className="text-[10px] font-semibold text-slate-400">
                  {school.name}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Role Switcher Toolbar (Demo Mode Superpower) */}
        <div className="hidden xl:flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
          <span className="text-[11px] font-medium text-slate-500 px-2 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Switch Role:
          </span>
          {(['parent', 'driver', 'admin', 'teacher'] as UserRole[]).map((r) => {
            const isActive = role === r;
            const labels: Record<UserRole, string> = {
              parent: 'Parent',
              driver: 'Driver',
              admin: 'Admin',
              teacher: 'Teacher',
            };
            return (
              <button
                key={r}
                onClick={() => quickDemoLogin(r)}
                className={`px-3 py-1.5 rounded-lg font-semibold capitalize transition text-xs ${
                  isActive
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                }`}
              >
                {labels[r]}
              </button>
            );
          })}
        </div>

        {/* Right: Child Selector (if Parent), Notification Bell, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Child Switcher for Parents */}
          {role === 'parent' && parentStudents.length > 0 && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl">
              <GraduationCap className="w-4 h-4 text-emerald-700" />
              <div className="text-left">
                <span className="text-[10px] text-slate-400 block font-medium leading-none">
                  Student
                </span>
                <span className="text-xs font-semibold text-slate-800">
                  {activeStudent.firstName} ({activeStudent.class}-{activeStudent.section})
                </span>
              </div>
            </div>
          )}

          {/* Two-Toggle Dark Mode & Light Mode */}
          <ThemeToggle />

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-amber-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            <NotificationDropdown isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
          </div>

          {/* User Profile Pill & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl hover:bg-slate-100 transition border border-transparent hover:border-slate-200"
            >
              <img
                src={
                  user?.avatar ||
                  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200&q=80'
                }
                alt={user?.name || 'User'}
                className="w-8 h-8 rounded-full object-cover border border-slate-200"
              />
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[110px]">
                  {user?.name || 'Account'}
                </p>
                <span className="text-[10px] font-semibold uppercase text-emerald-700 tracking-wider">
                  {role || 'User'}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {isUserMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsUserMenuOpen(false)}
                ></div>
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 p-2 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <p className="text-xs font-bold text-slate-900">{user?.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-100">
                      {role}
                    </span>
                  </div>

                  {/* Mobile Role Switcher */}
                  <div className="xl:hidden px-3 py-2 border-b border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5">
                      Switch Role:
                    </span>
                    <div className="grid grid-cols-2 gap-1 text-[11px]">
                      {(['parent', 'driver', 'admin', 'teacher'] as UserRole[]).map((r) => (
                        <button
                          key={r}
                          onClick={() => {
                            quickDemoLogin(r);
                            setIsUserMenuOpen(false);
                          }}
                          className={`px-2 py-1 rounded text-left font-bold capitalize ${
                            role === r ? 'bg-[#253B80] text-white' : 'hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Theme Mode Switcher in Profile Menu */}
                  <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Theme
                    </span>
                    <ThemeToggle />
                  </div>

                  <button
                    onClick={() => {
                      logout();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition mt-1"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
