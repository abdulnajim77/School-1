import React, { useState } from 'react';
import {
  Settings,
  Building,
  Shield,
  Save,
  CheckCircle2,
  ChevronRight,
  RotateCcw,
  Sparkles,
  Phone,
} from 'lucide-react';
import { useSchoolData } from '../../context/SchoolDataContext';

export const AdminSettingsPage: React.FC = () => {
  const { school, updateSchool, resetAllDataToDemo } = useSchoolData();

  const [name, setName] = useState(school.name);
  const [tagline, setTagline] = useState(school.tagline);
  const [address, setAddress] = useState(school.address);
  const [phone, setPhone] = useState(school.phone);
  const [email, setEmail] = useState(school.email);
  const [academicYear, setAcademicYear] = useState(school.academicYear);
  const [cutoffTime, setCutoffTime] = useState(school.transportSkipCutoffTime);
  const [brandColor, setBrandColor] = useState(school.brandColor);
  const [driverPrivacy, setDriverPrivacy] = useState(school.driverPhonePrivacy);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchool({
      name,
      tagline,
      address,
      phone,
      email,
      academicYear,
      transportSkipCutoffTime: cutoffTime,
      brandColor,
      driverPhonePrivacy: driverPrivacy,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleReset = () => {
    if (confirm('Reset all demo records (students, attendance, fees, notifications) to initial sample state?')) {
      resetAllDataToDemo();
      alert('Demo data restored successfully.');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 pb-20 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Administration</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="font-semibold text-blue-600">White-Label & SaaS Settings</span>
          </div>
          <h1 className="text-2xl font-black text-[#172033] tracking-tight">
            School Profile & Branding Configuration
          </h1>
          <p className="text-xs text-slate-500">
            Tenant customization, driver privacy masking, cutoff rules and institutional details
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition self-start"
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
          Reset Demo Data
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-green-50 border border-green-200 text-green-900 text-xs flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
          <span>School institutional settings and white-label branding updated!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6 text-xs">
        {/* School Profile Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Building className="w-4 h-4 text-blue-600" />
            <h3 className="font-extrabold text-sm text-slate-900">Institutional Identity</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">School Name (White-Label)</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Motto / Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Campus Address</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Academic Year</label>
              <input
                type="text"
                required
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Official Contact Phone</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Official Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Transport & Privacy Policies */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Shield className="w-4 h-4 text-blue-600" />
            <h3 className="font-extrabold text-sm text-slate-900">Transport & Privacy Policies</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Parent Transport Skip Daily Cutoff
              </label>
              <input
                type="time"
                value={cutoffTime}
                onChange={(e) => setCutoffTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono font-bold"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Submissions after this time flag as late notices.
              </span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Primary SaaS Brand Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={brandColor}
                  onChange={(e) => setBrandColor(e.target.value)}
                  className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={brandColor}
                  onChange={(e) => setBrandColor(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Driver Phone Privacy Feature */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-slate-900">Mask Driver's Personal Mobile Number</h4>
              <p className="text-[11px] text-slate-500">
                Hide personal phone numbers behind a masked click-to-call or virtual switchboard during active trips.
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
              <input
                type="checkbox"
                checked={driverPrivacy}
                onChange={(e) => setDriverPrivacy(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#253B80]"></div>
            </label>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 bg-[#253B80] hover:bg-[#1C2C60] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition"
          >
            <Save className="w-4 h-4" />
            Save Institutional Settings
          </button>
        </div>
      </form>
    </div>
  );
};
