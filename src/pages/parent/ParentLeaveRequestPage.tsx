import React, { useState } from 'react';
import {
  FileText,
  Bus,
  Calendar,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  ChevronRight,
  Info,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useTransport } from '../../context/TransportContext';

export const ParentLeaveRequestPage: React.FC = () => {
  const { selectedStudentId } = useAuth();
  const { school, students, leaveRequests, submitLeaveRequest, submitTransportSkipToday } = useSchoolData();
  const { addCustomNotification } = useTransport();

  const [activeTab, setActiveTab] = useState<'leave' | 'skip'>('skip');

  // Academic Leave form fields
  const [fromDate, setFromDate] = useState('2026-10-02');
  const [toDate, setToDate] = useState('2026-10-02');
  const [leaveReason, setLeaveReason] = useState('Puja family rituals at Serampore');
  const [leaveFile, setLeaveFile] = useState<string | null>(null);

  // Transport Skip form fields
  const [skipReason, setSkipReason] = useState('Parent personally dropping child today due to doctor checkup afterwards');
  const [skipFeedback, setSkipFeedback] = useState<string | null>(null);
  const [leaveSubmitted, setLeaveSubmitted] = useState(false);

  const student = students.find((s) => s.id === selectedStudentId) || students[0];
  const studentLeaves = leaveRequests.filter((l) => l.studentId === student.id);

  const handleAcademicLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitLeaveRequest({
      studentId: student.id,
      studentName: student.fullName,
      class: student.class,
      section: student.section,
      fromDate,
      toDate,
      reason: leaveReason,
      type: 'Academic_Leave',
      appliedBy: student.parentName,
      attachmentName: leaveFile || undefined,
    });
    setLeaveSubmitted(true);
    setTimeout(() => setLeaveSubmitted(false), 4000);
  };

  const handleTransportSkipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = submitTransportSkipToday(student.id, skipReason);
    setSkipFeedback(res.message);

    // Broadcast driver alert
    addCustomNotification({
      targetRole: 'driver',
      studentId: student.id,
      title: 'Pickup Skip: Riya Das',
      message: `${student.fullName} (${student.pickupPointName}) will not use Bus 03 today. Pickup is skipped.`,
      priority: 'IMPORTANT',
      category: 'Transport',
    });
  };

  return (
    <div className="space-y-6 pb-16">
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
          <span>Transport & Attendance</span>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="font-semibold text-blue-600">Leave & Transport Skip</span>
        </div>
        <h1 className="text-2xl font-black text-[#172033] tracking-tight">
          Leave & Daily Transport Skip
        </h1>
        <p className="text-xs text-slate-500">
          Automate transport coordination for <strong className="text-slate-800">{student.fullName}</strong> without calling the driver
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl max-w-md border border-slate-200">
        <button
          onClick={() => setActiveTab('skip')}
          className={`flex-1 py-2.5 px-4 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 ${
            activeTab === 'skip'
              ? 'bg-[#253B80] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Bus className="w-4 h-4" />
          Skip School Bus Today
        </button>

        <button
          onClick={() => setActiveTab('leave')}
          className={`flex-1 py-2.5 px-4 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 ${
            activeTab === 'leave'
              ? 'bg-[#253B80] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Apply Academic Leave
        </button>
      </div>

      {/* TAB 1: TRANSPORT SKIP TODAY (Instant Driver Automation) */}
      {activeTab === 'skip' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/80 space-y-5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                Single Day Transport Automation
              </span>
              <h3 className="text-lg font-black text-[#172033] mt-2">
                “Not Taking School Bus Today”
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Use this feature if your child <strong>will attend school</strong>, but you will personally drop/pick up. Submitting will immediately mark your child as <code className="bg-slate-100 px-1 py-0.5 rounded font-bold text-blue-700">TRANSPORT_SKIP</code> on the driver’s route list, eliminating unnecessary phone calls and route delays.
              </p>
            </div>

            {/* Cutoff Warning Banner */}
            <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 flex items-center gap-3 text-xs text-blue-900">
              <Clock className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <div>
                <span className="font-bold">Daily Cutoff Time: {school.transportSkipCutoffTime} AM</span>
                <p className="text-[11px] text-blue-700">
                  Submissions before {school.transportSkipCutoffTime} AM update the morning route manifest before departure.
                </p>
              </div>
            </div>

            {skipFeedback && (
              <div className="p-4 rounded-2xl bg-green-50 border border-green-200 text-green-900 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span>{skipFeedback}</span>
              </div>
            )}

            <form onSubmit={handleTransportSkipSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Reason for Skipping Bus Today
                </label>
                <textarea
                  rows={3}
                  required
                  value={skipReason}
                  onChange={(e) => setSkipReason(e.target.value)}
                  placeholder="e.g. Parent personally dropping child by car today."
                  className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition"
                ></textarea>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] text-slate-500 space-y-1">
                <div className="flex items-center justify-between">
                  <span>Assigned Transport:</span>
                  <strong className="text-slate-800">Bus 03 (Route A)</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Driver on Duty:</span>
                  <strong className="text-slate-800">Sanjay Das</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Designated Stop:</span>
                  <strong className="text-slate-800">{student.pickupPointName}</strong>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-xs transition flex items-center justify-center gap-2"
              >
                <Bus className="w-4 h-4" />
                CONFIRM SKIP BUS PICKUP TODAY
              </button>
            </form>
          </div>

          {/* Right Info Box */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              How Transport Skip Works
            </h4>
            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                  1
                </div>
                <p>Parent submits the skip notice from this app before cutoff.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                  2
                </div>
                <p>The driver’s route list updates automatically with <span className="font-bold text-amber-700">SKIP PICKUP</span>.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                  3
                </div>
                <p>Driver bypasses the stop without waiting or making disturbing phone calls.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ACADEMIC LEAVE APPLICATION */}
      {activeTab === 'leave' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/80 space-y-5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                Academic & Attendance Leave
              </span>
              <h3 className="text-lg font-black text-[#172033] mt-2">
                Apply for Student Leave
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Submitting an academic leave automatically marks both classroom attendance and transport status upon teacher/admin approval.
              </p>
            </div>

            {leaveSubmitted && (
              <div className="p-4 rounded-2xl bg-green-50 border border-green-200 text-green-900 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span>Leave request submitted! Once approved by class teacher, transport will be automatically synced.</span>
              </div>
            )}

            <form onSubmit={handleAcademicLeaveSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    From Date
                  </label>
                  <input
                    type="date"
                    required
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    To Date
                  </label>
                  <input
                    type="date"
                    required
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Reason for Absence
                </label>
                <textarea
                  rows={3}
                  required
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  placeholder="Detail the reason for leave (medical, family event, etc.)"
                  className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Attach Medical Certificate / Parent Note (Optional)
                </label>
                <input
                  type="file"
                  onChange={(e) => setLeaveFile(e.target.files?.[0]?.name || null)}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-[#253B80] hover:bg-[#1C2C60] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-xs transition flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                SUBMIT LEAVE APPLICATION
              </button>
            </form>
          </div>

          {/* Right Info Box */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Leave Automation Flow
            </h4>
            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <div className="flex items-start gap-2">
                <span className="font-bold text-[#253B80]">&bull;</span>
                <span>Parent submits application here.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-[#253B80]">&bull;</span>
                <span>Teacher / Admin reviews & approves in 1 click.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-[#253B80]">&bull;</span>
                <span>Student transport automatically changes to <strong>ON LEAVE</strong>.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-[#253B80]">&bull;</span>
                <span>Driver expected pickup count automatically drops.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leave Application History */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80">
        <h3 className="font-extrabold text-base text-[#172033] mb-4">
          Past Requests & Status History
        </h3>

        <div className="space-y-3">
          {studentLeaves.map((req) => (
            <div
              key={req.id}
              className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800">
                    {req.type === 'Transport_Skip_Today' ? 'Transport Skip Today' : 'Academic Leave'}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      req.status === 'Approved'
                        ? 'bg-green-100 text-green-800'
                        : req.status === 'Rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {req.status}
                  </span>
                </div>
                <p className="text-slate-500">Dates: {req.fromDate} to {req.toDate}</p>
                <p className="text-slate-600 italic font-medium">"{req.reason}"</p>
                {req.adminRemarks && (
                  <p className="text-[11px] text-blue-700 font-semibold">Note: {req.adminRemarks}</p>
                )}
              </div>

              <div className="text-right text-[11px] text-slate-400">
                Applied on {req.appliedDate}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
