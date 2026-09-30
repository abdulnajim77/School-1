import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  CalendarCheck,
  BookOpen,
  BellRing,
  Award,
  CheckCircle2,
  Clock,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSchoolData } from '../../context/SchoolDataContext';

export const TeacherDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { school, students, homework, notices } = useSchoolData();

  const myClassStudents = students.filter((s) => s.class === 'LKG' && s.section === 'A');

  return (
    <div className="space-y-6 pb-16 max-w-5xl">
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
          <span className="font-semibold text-blue-600">Teacher Workspace</span>
          <span>&bull;</span>
          <span>{school.name}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#172033] tracking-tight">
          Welcome, {user?.name || 'Sunita Sen'}
        </h1>
        <p className="text-xs text-slate-500">
          Class Teacher: <strong className="text-slate-800">LKG - Section A</strong> &bull; Room 102 (Kindergarten Wing)
        </p>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Enrolled Students
          </span>
          <h3 className="text-2xl font-black text-slate-900 mt-1">{myClassStudents.length || 24}</h3>
          <span className="text-[11px] text-slate-500">LKG - Section A</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Today's Attendance
          </span>
          <h3 className="text-2xl font-black text-green-600 mt-1">94%</h3>
          <span className="text-[11px] text-green-700 font-semibold">22 / 24 Present</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Active Homework
          </span>
          <h3 className="text-2xl font-black text-blue-600 mt-1">3</h3>
          <span className="text-[11px] text-slate-500">Assignments Due</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Upcoming Exam
          </span>
          <h3 className="text-2xl font-black text-purple-600 mt-1">15 Oct</h3>
          <span className="text-[11px] text-slate-500">Half Yearly Term</span>
        </div>
      </div>

      {/* Hero CTA for Daily Morning Attendance */}
      <div className="bg-gradient-to-r from-[#253B80] to-[#1E3A8A] text-white rounded-3xl p-6 sm:p-7 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200">
            Daily Academic Action
          </span>
          <h2 className="text-xl font-black mt-1">Mark Morning Classroom Attendance</h2>
          <p className="text-xs text-blue-200 mt-0.5">
            Quick bulk marking (Present, Absent, Leave). Parents of absent students are notified instantly.
          </p>
        </div>

        <button
          onClick={() => navigate('/teacher/attendance')}
          className="px-6 py-3 bg-white text-[#253B80] hover:bg-blue-50 font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition flex items-center justify-center gap-2 flex-shrink-0"
        >
          <CalendarCheck className="w-4 h-4 text-blue-600" />
          TAKE ATTENDANCE NOW
        </button>
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Class Roster Preview */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-base text-[#172033]">LKG-A Student Roster</h3>
            <span className="text-xs font-semibold text-slate-400">{myClassStudents.length} Students</span>
          </div>

          <div className="space-y-3">
            {myClassStudents.slice(0, 4).map((st) => (
              <div
                key={st.id}
                className="p-3 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={st.photoUrl}
                    alt={st.fullName}
                    className="w-9 h-9 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900">{st.fullName}</h4>
                    <p className="text-slate-400 text-[11px]">Roll: {st.rollNumber} &bull; {st.studentIdNumber}</p>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-800">
                  {st.currentTransportStatus.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Assigned Homework Preview */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-base text-[#172033]">Active Class Homework</h3>
              <button
                onClick={() => navigate('/teacher/homework')}
                className="text-xs font-bold text-blue-600 hover:text-blue-800"
              >
                + Post Homework
              </button>
            </div>

            <div className="space-y-3">
              {homework.slice(0, 3).map((hw) => (
                <div
                  key={hw.id}
                  className="p-3 rounded-2xl border border-slate-100 bg-slate-50/50 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      {hw.subject}
                    </span>
                    <span className="text-[10px] text-slate-400">Due: {hw.dueDate}</span>
                  </div>
                  <h4 className="font-bold text-slate-900">{hw.title}</h4>
                  <p className="text-slate-500 text-[11px] truncate">{hw.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
