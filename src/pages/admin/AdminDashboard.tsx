import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Bus,
  CreditCard,
  CalendarCheck,
  TrendingUp,
  MapPin,
  Clock,
  ShieldCheck,
  Navigation,
  FileText,
  AlertTriangle,
  ChevronRight,
  ArrowUpRight,
} from 'lucide-react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useTransport } from '../../context/TransportContext';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { school, students, buses, drivers, leaveRequests } = useSchoolData();
  const { trip, geofenceEvents } = useTransport();

  const totalStudents = students.length || 184;
  const activeBuses = buses.filter((b) => b.status === 'Active').length || 3;
  const pendingLeaves = leaveRequests.filter((l) => l.status === 'Pending').length;

  return (
    <div className="space-y-6 pb-20">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            SaaS Administration Console &bull; {school.name}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight mt-0.5">
            School Transport & Operations Overview
          </h1>
          <p className="text-xs text-slate-400">
            Real-time fleet telemetry, fee cashflow, student attendance and safety metrics
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/admin/live-tracking')}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-xs transition"
          >
            <Navigation className="w-4 h-4 text-emerald-300" />
            Live Fleet Monitor
          </button>
        </div>
      </div>

      {/* Primary KPI Grid (8 metrics as requested) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div
          onClick={() => navigate('/admin/students')}
          className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:border-emerald-300 transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider">Total Students</span>
            <Users className="w-4 h-4 text-emerald-700" />
          </div>
          <h3 className="text-2xl font-black text-slate-900">{totalStudents}</h3>
          <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-0.5 mt-0.5">
            <ArrowUpRight className="w-3 h-3" /> +12 this term
          </span>
        </div>

        <div
          onClick={() => navigate('/admin/buses')}
          className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:border-emerald-300 transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider">Active Buses</span>
            <Bus className="w-4 h-4 text-amber-600" />
          </div>
          <h3 className="text-2xl font-black text-slate-900">{activeBuses} / {buses.length}</h3>
          <span className="text-[11px] text-slate-500 font-medium mt-0.5">100% Fitness Cleared</span>
        </div>

        <div
          onClick={() => navigate('/admin/attendance')}
          className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:border-emerald-300 transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider">Today Attendance</span>
            <CalendarCheck className="w-4 h-4 text-emerald-700" />
          </div>
          <h3 className="text-2xl font-black text-slate-900">93.4%</h3>
          <span className="text-[11px] text-emerald-800 font-semibold mt-0.5">172 Present Today</span>
        </div>

        <div
          onClick={() => navigate('/admin/live-tracking')}
          className="bg-white p-5 rounded-3xl border border-emerald-200 shadow-xs bg-emerald-50/20 hover:border-emerald-300 transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider">Active Trips</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
          </div>
          <h3 className="text-2xl font-black text-emerald-300">1 Active</h3>
          <span className="text-[11px] text-emerald-400 font-semibold mt-0.5">Bus 03 on Route A</span>
        </div>

        <div
          onClick={() => navigate('/admin/fees')}
          className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:border-emerald-300 transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider">Fees Collected</span>
            <CreditCard className="w-4 h-4 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-black text-emerald-700">₹4,82,500</h3>
          <span className="text-[11px] text-slate-500 font-medium mt-0.5">September Term</span>
        </div>

        <div
          onClick={() => navigate('/admin/fees')}
          className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:border-emerald-300 transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider">Pending Fees</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <h3 className="text-2xl font-black text-amber-600">₹47,500</h3>
          <span className="text-[11px] text-amber-700 font-semibold mt-0.5">Due before 10 Oct</span>
        </div>

        <div
          onClick={() => navigate('/admin/drivers')}
          className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:border-emerald-300 transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider">Drivers on Duty</span>
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
          </div>
          <h3 className="text-2xl font-black text-slate-900">{drivers.length} Drivers</h3>
          <span className="text-[11px] text-slate-500 font-medium mt-0.5">3 Helpers Assigned</span>
        </div>

        <div
          onClick={() => navigate('/admin/leaves')}
          className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:border-emerald-300 transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider">Pending Leaves</span>
            <FileText className="w-4 h-4 text-amber-600" />
          </div>
          <h3 className="text-2xl font-black text-amber-700">{pendingLeaves} Requests</h3>
          <span className="text-[11px] text-amber-800 font-semibold mt-0.5">Awaiting Approval</span>
        </div>
      </div>

      {/* Visual Analytics Grid (Attendance Trend, Fee Collection, Transport Utilisation) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Trend Bar Chart */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-[#0F172A]">Weekly Attendance Trend</h3>
              <p className="text-[11px] text-slate-400">Classroom physical check-in rate</p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">93.4% Avg</span>
          </div>

          <div className="h-44 flex items-end justify-between gap-3 pt-6 px-2">
            {[
              { day: 'Mon', pct: 95 },
              { day: 'Tue', pct: 94 },
              { day: 'Wed', pct: 92 },
              { day: 'Thu', pct: 96 },
              { day: 'Fri', pct: 91 },
              { day: 'Sat', pct: 88 },
            ].map((bar) => (
              <div key={bar.day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <span className="text-[10px] font-bold text-slate-500">{bar.pct}%</span>
                <div
                  className="w-full bg-emerald-800 rounded-t-xl transition-all duration-500 hover:bg-emerald-700"
                  style={{ height: `${(bar.pct / 100) * 110}px` }}
                ></div>
                <span className="text-[11px] font-semibold text-slate-600">{bar.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Fee Collection Trend */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-[#0F172A]">Fee Inflow & Collection</h3>
              <p className="text-[11px] text-slate-400">Monthly cashflow (Tuition + Bus)</p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">91% Paid</span>
          </div>

          <div className="h-44 flex items-end justify-between gap-3 pt-6 px-2">
            {[
              { m: 'Jun', paid: 4.2 },
              { m: 'Jul', paid: 4.5 },
              { m: 'Aug', paid: 4.7 },
              { m: 'Sep', paid: 4.8 },
            ].map((bar) => (
              <div key={bar.m} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <span className="text-[10px] font-bold text-emerald-600">₹{bar.paid}L</span>
                <div
                  className="w-full bg-emerald-600 rounded-t-xl transition-all duration-500"
                  style={{ height: `${(bar.paid / 5) * 110}px` }}
                ></div>
                <span className="text-[11px] font-semibold text-slate-600">{bar.m}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Transport Utilisation Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-[#0F172A]">Transport Fleet Utilisation</h3>
              <p className="text-[11px] text-slate-400">Total capacity occupancy</p>
            </div>
            <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">88% Seat Occupancy</span>
          </div>

          <div className="space-y-3 pt-2 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-800">Bus 03 (Route A - Chandannagar)</span>
                <span className="text-slate-500 font-mono">28 / 32 Seats (87%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-emerald-700 rounded-full" style={{ width: '87%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-800">Bus 01 (Route B - Mankundu)</span>
                <span className="text-slate-500">27 / 30 Seats (90%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '90%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-800">Bus 02 (Route C - Chinsurah)</span>
                <span className="text-slate-500">19 / 22 Seats (86%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '86%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Timeline & Geofence Logs */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-700" />
            <h3 className="font-extrabold text-base text-[#0F172A]">
              Recent Fleet & School Activity Timeline
            </h3>
          </div>
          <span className="text-xs text-slate-400">Live Stream &bull; Last 24 Hours</span>
        </div>

        <div className="space-y-3">
          {geofenceEvents.slice(0, 4).map((evt) => (
            <div
              key={evt.id}
              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-600"></div>
                <div>
                  <h4 className="font-bold text-slate-900">{evt.message}</h4>
                  <span className="text-[11px] text-slate-400">
                    Bus: <strong>{evt.busNumber}</strong> &bull; Event: {evt.eventType}
                  </span>
                </div>
              </div>

              <span className="font-mono text-slate-400 text-[11px] whitespace-nowrap">
                {evt.timestamp}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
