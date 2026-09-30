import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bus,
  Phone,
  Navigation,
  CreditCard,
  CalendarCheck,
  BookOpen,
  Calendar,
  BellRing,
  FileText,
  Award,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Users,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useTransport } from '../../context/TransportContext';
import { formatDistance } from '../../utils/geo';
import { CallDriverModal } from '../../components/common/CallDriverModal';

export const ParentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, selectedStudentId, setSelectedStudentId } = useAuth();
  const { school, students, fees, homework, notices } = useSchoolData();
  const { trip } = useTransport();

  const [isCallModalOpen, setIsCallModalOpen] = useState(false);

  // Active student
  const parentStudents = students.filter(
    (s) => s.parentId === user?.uid || user?.assignedStudentIds?.includes(s.id)
  );
  const student = students.find((s) => s.id === selectedStudentId) || students[0];

  const pendingFee = fees.find((f) => f.studentId === student.id && f.status === 'Pending');
  const pendingHwCount = homework.filter((h) => h.status === 'Pending').length;

  // Stops progress calculation for Bus 03
  const stops = [
    { label: 'Bus Start', sub: 'Station' },
    { label: 'Stop 1', sub: 'Station Rd' },
    { label: "Riya's Stop", sub: 'Jyoti More', isStudent: true },
    { label: 'Stop 3', sub: 'College' },
    { label: 'School', sub: 'Main Gate' },
  ];

  // Route progress index
  const currentStep = trip.currentStopIndex < 2 ? 1 : trip.currentStopIndex === 2 ? 2 : trip.status === 'AT_SCHOOL' ? 4 : 3;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            {school.name} &bull; Academic Year {school.academicYear}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mt-0.5">
            Good Morning, {user?.name || 'Mrs. Das'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Student Transport, Attendance & Academic Portal
          </p>
        </div>

        {/* Multi-child Switcher if parent has more than 1 child */}
        {parentStudents.length > 1 && (
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 pl-2">Child:</span>
            {parentStudents.map((child) => (
              <button
                key={child.id}
                onClick={() => setSelectedStudentId(child.id)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
                  selectedStudentId === child.id
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {child.firstName}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid: Student Profile Card & Emergency Transport Notice */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Profile Card */}
        <div className="lg:col-span-1 bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                Student Profile
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Active Student
              </span>
            </div>

            <div className="flex items-center gap-4">
              <img
                src={student.photoUrl}
                alt={student.fullName}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md ring-2 ring-slate-100"
              />
              <div>
                <h3 className="text-lg font-extrabold text-[#0F172A] leading-tight">
                  {student.fullName}
                </h3>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Class: <span className="text-emerald-800 font-bold">{student.class}</span> &bull; Section: {student.section} &bull; Roll: {student.rollNumber}
                </p>
                <div className="mt-1.5 inline-block font-mono text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-bold">
                  {student.studentIdNumber}
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-medium block">Assigned Transport</span>
                <span className="font-bold text-slate-800">Bus 03 (Route A)</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-medium block">Pickup Point</span>
                <span className="font-bold text-slate-800 truncate block">{student.pickupPointName}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Class Teacher:</span>
            <span className="font-bold text-slate-800">Sunita Sen</span>
          </div>
        </div>

        {/* HERO: School Bus Summary Card (Visually Important Hero Element) */}
        <div className="lg:col-span-2 bg-gradient-to-br from-[#064E3B] to-[#032B20] text-white rounded-3xl p-6 sm:p-7 shadow-xl shadow-emerald-950/20 relative overflow-hidden flex flex-col justify-between">
          {/* Subtle radar circle behind */}
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-emerald-400/10 blur-2xl pointer-events-none"></div>

          <div>
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md">
                  <Bus className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-200">
                    Live School Transport
                  </span>
                  <h2 className="text-xl font-black text-white leading-tight">
                    {trip.busNumber} &bull; <span className="font-medium text-emerald-200">{trip.vehicleNumber}</span>
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  {trip.status.replace('_', ' ')}
                </span>
                <span className="text-xs bg-white/10 px-2.5 py-1 rounded-full text-emerald-100 font-medium">
                  {trip.tripType === 'morning_pickup' ? 'Morning Pickup' : 'Afternoon Drop'}
                </span>
              </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
              <div>
                <span className="text-[10px] text-emerald-200 block uppercase font-medium">Driver & Helper</span>
                <span className="text-xs font-bold text-white block truncate">{trip.driverName}</span>
                <span className="text-[10px] text-emerald-300 truncate block">Helper: {trip.helperName}</span>
              </div>
              <div>
                <span className="text-[10px] text-emerald-200 block uppercase font-medium">Your Pickup</span>
                <span className="text-xs font-bold text-white block truncate">{student.pickupPointName}</span>
                <span className="text-[10px] text-emerald-300">Stop 2 of 5</span>
              </div>
              <div>
                <span className="text-[10px] text-emerald-200 block uppercase font-medium">Distance Away</span>
                <span className="text-xs font-bold text-white block font-mono">
                  {formatDistance(trip.distanceToNextStopMeters)}
                </span>
                <span className="text-[10px] text-emerald-300">Speed: {trip.speed} km/h</span>
              </div>
              <div>
                <span className="text-[10px] text-emerald-200 block uppercase font-medium">Estimated Arrival</span>
                <span className="text-sm font-black text-amber-300 block font-mono">
                  {trip.etaNextStopMinutes} Mins ETA
                </span>
                <span className="text-[10px] text-emerald-200">~ 8:12 AM</span>
              </div>
            </div>

            {/* Visual Route Progress Track */}
            <div className="mt-5 mb-2">
              <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-200 mb-2">
                <span>Route Progress:</span>
                <span>Chandannagar Station &rarr; Academy Gate</span>
              </div>
              <div className="relative flex items-center justify-between">
                {/* Connecting Line */}
                <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-1 bg-white/20 -z-0"></div>
                <div
                  className="absolute top-1/2 left-4 -translate-y-1/2 h-1 bg-emerald-400 transition-all duration-500 -z-0"
                  style={{ width: `${(currentStep / 4) * 85}%` }}
                ></div>

                {stops.map((stp, idx) => {
                  const isPassed = idx < currentStep;
                  const isCurrent = idx === currentStep;
                  return (
                    <div key={stp.label} className="relative z-10 flex flex-col items-center">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                          isCurrent
                            ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-400/30 scale-125'
                            : isPassed
                            ? 'bg-emerald-400 text-slate-900'
                            : 'bg-white/20 text-emerald-200'
                        }`}
                      >
                        {isPassed ? '✓' : idx + 1}
                      </div>
                      <span
                        className={`text-[10px] mt-1.5 whitespace-nowrap font-medium ${
                          isCurrent
                            ? 'text-amber-300 font-bold'
                            : stp.isStudent
                            ? 'text-amber-200 font-bold'
                            : 'text-emerald-200'
                        }`}
                      >
                        {stp.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/parent/live-tracking')}
              className="flex-1 py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-emerald-950/20 transition flex items-center justify-center gap-2"
            >
              <Navigation className="w-4 h-4" />
              TRACK LIVE BUS
            </button>
            <button
              onClick={() => setIsCallModalOpen(true)}
              className="py-3 px-5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider border border-white/20 transition flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              CALL DRIVER
            </button>
          </div>
        </div>
      </div>

      {/* Safety & Boarding State Timeline */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-green-600" />
            <h3 className="font-extrabold text-base text-[#172033]">Child Safety & Journey Status</h3>
          </div>
          <span className="text-xs font-semibold text-slate-500">Today, 29 September 2026</span>
        </div>

        {/* Milestone Steps Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          <div className="p-3 rounded-2xl bg-blue-50 border border-blue-100 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">07:35 AM</span>
              <h4 className="text-xs font-bold text-slate-900">Trip Started</h4>
              <p className="text-[11px] text-slate-500">From Station</p>
            </div>
          </div>

          <div
            className={`p-3 rounded-2xl border flex items-start gap-2.5 ${
              trip.distanceToNextStopMeters <= 500
                ? 'bg-amber-50 border-amber-200'
                : 'bg-slate-50 border-slate-100'
            }`}
          >
            <Clock
              className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                trip.distanceToNextStopMeters <= 500 ? 'text-amber-600' : 'text-slate-400'
              }`}
            />
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                {trip.distanceToNextStopMeters <= 500 ? 'Active Now' : '~ 07:44 AM'}
              </span>
              <h4 className="text-xs font-bold text-slate-900">Approaching Stop</h4>
              <p className="text-[11px] text-slate-500">{student.pickupPointName}</p>
            </div>
          </div>

          <div
            className={`p-3 rounded-2xl border flex items-start gap-2.5 ${
              student.currentTransportStatus === 'BOARDED' || student.currentTransportStatus === 'REACHED_SCHOOL'
                ? 'bg-green-50 border-green-200'
                : 'bg-slate-50 border-slate-100'
            }`}
          >
            <CheckCircle2
              className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                student.currentTransportStatus === 'BOARDED' || student.currentTransportStatus === 'REACHED_SCHOOL'
                  ? 'text-green-600'
                  : 'text-slate-400'
              }`}
            />
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                {student.currentTransportStatus === 'BOARDED' ? '07:48 AM' : 'Pending'}
              </span>
              <h4 className="text-xs font-bold text-slate-900">Riya Boarded</h4>
              <p className="text-[11px] text-slate-500">Confirmed by Helper</p>
            </div>
          </div>

          <div
            className={`p-3 rounded-2xl border flex items-start gap-2.5 ${
              student.currentTransportStatus === 'REACHED_SCHOOL'
                ? 'bg-purple-50 border-purple-200'
                : 'bg-slate-50 border-slate-100'
            }`}
          >
            <CheckCircle2
              className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                student.currentTransportStatus === 'REACHED_SCHOOL' ? 'text-purple-600' : 'text-slate-400'
              }`}
            />
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                {student.currentTransportStatus === 'REACHED_SCHOOL' ? '08:28 AM' : 'Est 08:30 AM'}
              </span>
              <h4 className="text-xs font-bold text-slate-900">Reached School</h4>
              <p className="text-[11px] text-slate-500">Inside 200m zone</p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">02:30 PM</span>
              <h4 className="text-xs font-bold text-slate-900">Return Drop</h4>
              <p className="text-[11px] text-slate-500">Expected 02:42 PM</p>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS GRID */}
      <div>
        <h3 className="text-sm font-extrabold text-[#172033] uppercase tracking-wider mb-3">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {[
            { label: 'Track School Bus', icon: Navigation, to: '/parent/live-tracking', color: 'text-blue-600 bg-blue-50' },
            { label: 'Fees & Invoices', icon: CreditCard, to: '/parent/fees', color: 'text-emerald-600 bg-emerald-50', badge: pendingFee ? 'Pending' : undefined },
            { label: 'Attendance', icon: CalendarCheck, to: '/parent/attendance', color: 'text-indigo-600 bg-indigo-50', sub: '91% Monthly' },
            { label: 'Homework', icon: BookOpen, to: '/parent/homework', color: 'text-amber-600 bg-amber-50', badge: `${pendingHwCount} Pending` },
            { label: 'Exam Routine', icon: Calendar, to: '/parent/exam-routine', color: 'text-purple-600 bg-purple-50' },
            { label: 'School Notices', icon: BellRing, to: '/parent/notices', color: 'text-rose-600 bg-rose-50' },
            { label: 'Leave Request', icon: FileText, to: '/parent/leave', color: 'text-teal-600 bg-teal-50' },
            { label: 'Report Card', icon: Award, to: '/parent/report-card', color: 'text-sky-600 bg-sky-50', sub: 'Grade A+' },
            { label: 'School Activities', icon: Sparkles, to: '/parent/activities', color: 'text-pink-600 bg-pink-50' },
            { label: 'Contact School', icon: Phone, action: () => setIsCallModalOpen(true), color: 'text-slate-600 bg-slate-100' },
          ].map((act) => {
            const Icon = act.icon;
            return (
              <div
                key={act.label}
                onClick={() => (act.to ? navigate(act.to) : act.action?.())}
                className="bg-white hover:bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 shadow-xs cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2.5 rounded-xl ${act.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {act.badge && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 text-amber-800">
                      {act.badge}
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">{act.label}</h4>
                  {act.sub && <p className="text-[11px] text-slate-500 font-medium mt-0.5">{act.sub}</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Section: Recent Notices & Fee Reminder Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Notice Snippet */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BellRing className="w-4 h-4 text-blue-600" />
              <h3 className="font-extrabold text-sm text-[#172033]">Recent Notices</h3>
            </div>
            <button
              onClick={() => navigate('/parent/notices')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              View all <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {notices.slice(0, 2).map((notice) => (
              <div
                key={notice.id}
                onClick={() => navigate('/parent/notices')}
                className="p-3.5 rounded-2xl border border-slate-100 hover:border-blue-200 bg-slate-50/50 hover:bg-blue-50/30 transition cursor-pointer"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                  <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                    {notice.category}
                  </span>
                  <span>{notice.date}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900">{notice.title}</h4>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">{notice.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Fee Payment Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <h3 className="font-extrabold text-sm text-[#172033]">Fee Status</h3>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                September 2026
              </span>
            </div>

            {pendingFee ? (
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-800">
                      Pending School & Bus Fee
                    </span>
                    <h4 className="text-xl font-extrabold text-slate-900 mt-0.5">
                      ₹{pendingFee.amount.toLocaleString('en-IN')}
                    </h4>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-100 text-amber-900">
                    Due: 10 Oct 2026
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-2">
                  Includes Tuition, Air-Conditioned Transport (Route A) and Smart Class access.
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-green-50 border border-green-200 text-center">
                <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-1" />
                <h4 className="text-xs font-bold text-green-900">All Fees Paid Up to Date</h4>
                <p className="text-[11px] text-green-700">Thank you for timely fee payment!</p>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 flex items-center justify-between">
            <button
              onClick={() => navigate('/parent/fees')}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              Pay Online / View Receipts
            </button>
          </div>
        </div>
      </div>

      {/* Call Driver Modal */}
      <CallDriverModal
        isOpen={isCallModalOpen}
        onClose={() => setIsCallModalOpen(false)}
        driverName={trip.driverName}
        helperName={trip.helperName}
        busNumber={trip.busNumber}
      />
    </div>
  );
};
