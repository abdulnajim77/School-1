import React, { useState } from 'react';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Save,
  Send,
  ChevronRight,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useTransport } from '../../context/TransportContext';

export const TeacherAttendancePage: React.FC = () => {
  const { students, markAttendance } = useSchoolData();
  const { addCustomNotification } = useTransport();

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceState, setAttendanceState] = useState<Record<string, 'Present' | 'Absent' | 'Leave'>>({
    stu_001: 'Present',
    stu_002: 'Present',
    stu_003: 'Present',
    stu_004: 'Present',
    stu_005: 'Leave',
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleStatusChange = (studentId: string, status: 'Present' | 'Absent' | 'Leave') => {
    setAttendanceState((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleMarkAllPresent = () => {
    const updated: Record<string, 'Present' | 'Absent' | 'Leave'> = {};
    students.forEach((s) => {
      updated[s.id] = 'Present';
    });
    setAttendanceState(updated);
  };

  const handleSaveAttendance = (e: React.FormEvent) => {
    e.preventDefault();

    students.forEach((s) => {
      const status = attendanceState[s.id] || 'Present';
      markAttendance(s.id, date, status);

      // If marked Absent, notify parent immediately as specified in requirements
      if (status === 'Absent') {
        addCustomNotification({
          targetRole: 'parent',
          studentId: s.id,
          title: 'Student Marked Absent Today',
          message: `${s.fullName} has been marked absent today in classroom register for ${date}. If unexpected, please contact the school.`,
          priority: 'IMPORTANT',
          category: 'Academic',
        });
      }
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Teacher Console</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="font-semibold text-blue-600">Daily Attendance</span>
          </div>
          <h1 className="text-2xl font-black text-[#172033] tracking-tight">
            Bulk Classroom Attendance Register
          </h1>
          <p className="text-xs text-slate-500">
            Grade: <strong className="text-slate-800">LKG - Section A</strong> &bull; Class Teacher: Sunita Sen
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-white shadow-xs focus:outline-none focus:border-blue-600"
          />
          <button
            type="button"
            onClick={handleMarkAllPresent}
            className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl border border-blue-200 transition"
          >
            Mark All Present
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-green-50 border border-green-200 text-green-900 text-xs flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
          <span>Attendance registered successfully! Notifications dispatched to absent students' parents.</span>
        </div>
      )}

      {/* Attendance Form */}
      <form onSubmit={handleSaveAttendance} className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/80 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase">
          <span>Student Info</span>
          <span className="pr-12">Attendance Status</span>
        </div>

        <div className="divide-y divide-slate-100">
          {students.map((st) => {
            const currentStatus = attendanceState[st.id] || 'Present';

            return (
              <div
                key={st.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-slate-100 font-mono font-bold text-slate-600 flex items-center justify-center text-xs">
                    {st.rollNumber}
                  </span>
                  <img
                    src={st.photoUrl}
                    alt={st.fullName}
                    className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{st.fullName}</h4>
                    <p className="text-slate-400 text-[11px]">
                      Parent: {st.parentName} &bull; <span className="font-mono">{st.parentPhone}</span>
                    </p>
                  </div>
                </div>

                {/* 3 Status Buttons */}
                <div className="flex items-center gap-1.5 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => handleStatusChange(st.id, 'Present')}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold transition ${
                      currentStatus === 'Present'
                        ? 'bg-green-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Present
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStatusChange(st.id, 'Absent')}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold transition ${
                      currentStatus === 'Absent'
                        ? 'bg-red-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Absent
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStatusChange(st.id, 'Leave')}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold transition ${
                      currentStatus === 'Leave'
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Leave
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400">Class Teacher verification timestamp: 08:35 AM</span>
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 bg-[#253B80] hover:bg-[#1C2C60] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition"
          >
            <Save className="w-4 h-4" />
            SUBMIT ATTENDANCE REGISTER
          </button>
        </div>
      </form>
    </div>
  );
};
