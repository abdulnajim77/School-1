import React, { useState } from 'react';
import {
  Settings,
  Bell,
  Lock,
  User,
  ShieldCheck,
  Phone,
  Save,
  CheckCircle2,
  LogOut,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTransport } from '../../context/TransportContext';

export const ParentSettingsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { parentPreferences, updateParentPreferences } = useTransport();

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form states
  const [name, setName] = useState(user?.name || 'Mrs. Sanchita Das');
  const [phone, setPhone] = useState(user?.phone || '+91 98311 54321');
  const [email] = useState(user?.email || 'parent@demo.com');
  const [emergencyPhone, setEmergencyPhone] = useState('+91 98311 99999 (Father)');

  const handleToggle = (key: keyof typeof parentPreferences) => {
    if (key === 'emergencyAlert') return; // Cannot disable emergency alerts!
    updateParentPreferences({ [key]: !parentPreferences[key] });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-16 max-w-4xl">
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
          <span>Account</span>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="font-semibold text-blue-600">Preferences</span>
        </div>
        <h1 className="text-2xl font-black text-[#172033] tracking-tight">
          Parent Account & Notification Settings
        </h1>
        <p className="text-xs text-slate-500">
          Control your contact information, emergency phone, and real-time geofence alerts
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-green-50 border border-green-200 text-green-900 text-xs flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
          <span>Your notification preferences and profile details have been saved successfully!</span>
        </div>
      )}

      {/* NOTIFICATION PREFERENCES CARD */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/80 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <Bell className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="font-extrabold text-base text-[#172033]">
                Geofence & Transport Notification Controls
              </h3>
              <p className="text-xs text-slate-400">Choose which automated notifications you receive</p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
            Instant Push / In-App
          </span>
        </div>

        <div className="space-y-3">
          {[
            { key: 'busApproachingPickup', label: 'Bus Approaching Pickup Point', desc: 'Alert when bus is within 500m of student pickup stop' },
            { key: 'busArrivedPickup', label: 'Bus Arrived at Pickup', desc: 'Alert when bus crosses 100m pickup geofence circle' },
            { key: 'studentBoarded', label: 'Student Boarded Confirmation', desc: 'Instant safety alert when helper checks child boarded' },
            { key: 'reachedSchool', label: 'Reached School Safely', desc: 'Alert when bus enters 200m school geofence zone' },
            { key: 'returnTripStarted', label: 'Return Afternoon Trip Started', desc: 'Alert when afternoon departure begins from school' },
            { key: 'busApproachingDrop', label: 'Bus Approaching Drop Point', desc: 'Alert when return bus is within 500m of home stop' },
            { key: 'studentDropped', label: 'Student Dropped Safely', desc: 'Confirmation alert when helper marks child dropped' },
            { key: 'schoolNotice', label: 'School Notices & Circulars', desc: 'New holidays, events, and circular announcements' },
            { key: 'feeReminder', label: 'Fee Invoices & Reminders', desc: 'Monthly tuition and transport fee status alerts' },
            { key: 'homeworkUpdate', label: 'Homework & Exam Diary', desc: 'Daily teacher assignments and date sheets' },
            { key: 'emergencyAlert', label: 'Emergency & Safety Broadcasts', desc: 'Breakdown, route change or medical alerts (Mandatory for student safety)', locked: true },
          ].map((item) => {
            const isEnabled = (parentPreferences as any)[item.key];

            return (
              <div
                key={item.key}
                className="p-3.5 rounded-2xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 flex items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900">{item.label}</h4>
                    {item.locked && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                        <ShieldAlert className="w-3 h-3" /> REQUIRED
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={isEnabled}
                    disabled={item.locked}
                    onChange={() => handleToggle(item.key as any)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#253B80]"></div>
                </label>
              </div>
            );
          })}
        </div>
      </div>

      {/* PROFILE DETAILS & EMERGENCY CONTACTS */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/80 space-y-5">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
          <User className="w-5 h-5 text-blue-600" />
          <div>
            <h3 className="font-extrabold text-base text-[#172033]">
              Parent Profile & Emergency Numbers
            </h3>
            <p className="text-xs text-slate-400">Primary contact used by school and transport helpers</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Parent Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Registered Email</label>
            <input
              type="email"
              disabled
              value={email}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 font-mono"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Primary Mobile Number</label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 font-mono"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Emergency Secondary Contact</label>
            <input
              type="text"
              required
              value={emergencyPhone}
              onChange={(e) => setEmergencyPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 font-mono"
            />
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition"
          >
            <LogOut className="w-4 h-4" />
            Sign Out of Account
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 bg-[#253B80] hover:bg-[#1C2C60] text-white font-bold text-xs rounded-xl shadow-xs transition"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};
