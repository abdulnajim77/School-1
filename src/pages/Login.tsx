import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bus,
  ShieldCheck,
  MapPin,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  School as SchoolIcon,
  CheckCircle2,
  Navigation,
  Clock,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSchoolData } from '../context/SchoolDataContext';
import { UserRole } from '../types';
import { ThemeToggle } from '../components/common/ThemeToggle';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, quickDemoLogin, isDemoMode } = useAuth();
  const { school } = useSchoolData();

  const [email, setEmail] = useState('parent@demo.com');
  const [password, setPassword] = useState('demo123');
  const [role, setRole] = useState<UserRole>('parent');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    // Autofill demo credential for convenience
    switch (selectedRole) {
      case 'parent':
        setEmail('parent@demo.com');
        setPassword('demo123');
        break;
      case 'admin':
        setEmail('admin@demo.com');
        setPassword('demo123');
        break;
      case 'driver':
        setEmail('driver@demo.com');
        setPassword('demo123');
        break;
      case 'teacher':
        setEmail('teacher@demo.com');
        setPassword('demo123');
        break;
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await login(email, password, role);
      if (res.success) {
        if (role === 'parent') navigate('/parent/dashboard');
        else if (role === 'driver') navigate('/driver/dashboard');
        else if (role === 'teacher') navigate('/teacher/dashboard');
        else navigate('/admin/dashboard');
      } else {
        setError(res.error || 'Invalid credentials');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoClick = (demoRole: UserRole) => {
    quickDemoLogin(demoRole);
    if (demoRole === 'parent') navigate('/parent/dashboard');
    else if (demoRole === 'driver') navigate('/driver/dashboard');
    else if (demoRole === 'teacher') navigate('/teacher/dashboard');
    else navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen w-full flex bg-[#F8FAFC] dark:bg-[#0B0F19] text-[#0F172A] dark:text-[#F1F5F9] relative transition-colors duration-200">
      {/* Floating Theme Toggle */}
      <div className="absolute top-4 right-4 z-30">
        <ThemeToggle />
      </div>

      {/* LEFT COLUMN (Desktop Branding & Visuals) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#06261C] text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Subtle background decorative gradient */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-600/10 blur-[120px] pointer-events-none"></div>

        {/* Top Branding */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-800 flex items-center justify-center text-white shadow-md font-bold text-xl font-mono">
              S
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight">SchoolSync</span>
              <span className="block text-xs text-emerald-200/70 font-medium">Smart Transport & Safety Platform</span>
            </div>
          </div>
        </div>

        {/* Center Graphic & Value Proposition */}
        <div className="relative z-10 max-w-lg my-auto space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Empowering 250+ Schools &middot; 35,000+ Students Daily</span>
          </div>

          <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight leading-tight text-white">
            Safer Journeys. Better School Communication.
          </h1>

          <p className="text-emerald-100/80 text-sm xl:text-base leading-relaxed font-normal">
            Track school transport, stay connected with your school and manage your child’s daily academic activities from one secure platform.
          </p>

          {/* Interactive Feature Highlights Card */}
          <div className="grid grid-cols-2 gap-3 pt-4">
            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
              <Navigation className="w-5 h-5 text-emerald-400 mb-1.5" />
              <h4 className="text-xs font-bold text-white">Live GPS & Geofencing</h4>
              <p className="text-[11px] text-emerald-200/70 mt-0.5">Instant arrival & proximity alerts</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 mb-1.5" />
              <h4 className="text-xs font-bold text-white">Boarding Confirmation</h4>
              <p className="text-[11px] text-emerald-200/70 mt-0.5">Verified pickup & school arrival</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
              <Clock className="w-5 h-5 text-amber-400 mb-1.5" />
              <h4 className="text-xs font-bold text-white">Leave & Skip Sync</h4>
              <p className="text-[11px] text-emerald-200/70 mt-0.5">Zero unnecessary driver phone calls</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
              <ShieldCheck className="w-5 h-5 text-teal-300 mb-1.5" />
              <h4 className="text-xs font-bold text-white">Academic & Fees</h4>
              <p className="text-[11px] text-emerald-200/70 mt-0.5">Attendance, homework & instant UPI</p>
            </div>
          </div>
        </div>

        {/* Bottom Partner School Callout */}
        <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-emerald-200/70">
          <div className="flex items-center gap-2">
            <SchoolIcon className="w-4 h-4 text-emerald-400" />
            <span>Currently previewing: <strong className="text-white">{school.name}</strong></span>
          </div>
          <span className="text-[11px] font-mono text-emerald-300">v2.4 Production SaaS</span>
        </div>
      </div>

      {/* RIGHT COLUMN (Login Card) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-200/80">
          {/* Mobile Header Branding */}
          <div className="lg:hidden flex items-center gap-2.5 mb-6">
            <div className="w-8 h-8 rounded-xl bg-emerald-800 flex items-center justify-center text-white font-bold text-sm font-mono">
              S
            </div>
            <div>
              <span className="font-bold text-base text-slate-900">SchoolSync</span>
              <p className="text-[11px] text-slate-400">{school.name}</p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Sign In to SchoolSync</h2>
            <p className="text-xs text-slate-500 mt-1">Select your role to access your personalized portal</p>
          </div>

          {/* Role Selector Tabs */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Select Role
            </label>
            <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200">
              {(
                [
                  { id: 'parent', label: 'Parent' },
                  { id: 'admin', label: 'Admin' },
                  { id: 'driver', label: 'Driver' },
                  { id: 'teacher', label: 'Teacher' },
                ] as const
              ).map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => handleRoleSelect(item.id)}
                  className={`py-2 text-xs font-semibold rounded-xl transition ${
                    role === item.id
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick 1-Click Demo Buttons for Fast Evaluation */}
          {isDemoMode && (
            <div className="mb-5 p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" /> 1-Click Demo Sign-in:
                </span>
                <span className="text-[10px] text-emerald-700 font-medium">Offline Demo Mode</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleQuickDemoClick('parent')}
                  className="px-2.5 py-1.5 text-xs font-medium bg-white hover:bg-emerald-50 text-slate-800 rounded-xl border border-emerald-100 transition text-left"
                >
                  &rarr; <strong>Parent</strong> (Mrs. Das)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoClick('admin')}
                  className="px-2.5 py-1.5 text-xs font-medium bg-white hover:bg-emerald-50 text-slate-800 rounded-xl border border-emerald-100 transition text-left"
                >
                  &rarr; <strong>Admin</strong> (Principal)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoClick('driver')}
                  className="px-2.5 py-1.5 text-xs font-medium bg-white hover:bg-emerald-50 text-slate-800 rounded-xl border border-emerald-100 transition text-left"
                >
                  &rarr; <strong>Driver</strong> (Sanjay / Bus 03)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoClick('teacher')}
                  className="px-2.5 py-1.5 text-xs font-medium bg-white hover:bg-emerald-50 text-slate-800 rounded-xl border border-emerald-100 transition text-left"
                >
                  &rarr; <strong>Teacher</strong> (Sunita Sen)
                </button>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address / Phone Number
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@demo.com"
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-100 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-100 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-slate-400 hover:text-slate-600 absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 font-medium">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-emerald-800 focus:ring-emerald-500"
                />
                Remember Me
              </label>
              <button
                type="button"
                onClick={() => alert('Demo Mode: Default password is "demo123" for all demo accounts.')}
                className="text-emerald-700 hover:text-emerald-900 font-semibold"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs uppercase tracking-wider shadow-xs transition flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In as {role.toUpperCase()}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-400 font-medium">
              Secure access powered by <span className="font-semibold text-slate-600">SchoolSync</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
