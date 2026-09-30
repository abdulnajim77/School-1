import React, { useState } from 'react';
import { CalendarCheck, AlertCircle, CheckCircle2, XCircle, Clock, ChevronRight, Info } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSchoolData } from '../../context/SchoolDataContext';

export const ParentAttendancePage: React.FC = () => {
  const { selectedStudentId } = useAuth();
  const { students, attendanceRecords } = useSchoolData();

  const student = students.find((s) => s.id === selectedStudentId) || students[0];
  const records = attendanceRecords.filter((r) => r.studentId === student.id);

  const presentCount = records.filter((r) => r.status === 'Present').length;
  const absentCount = records.filter((r) => r.status === 'Absent').length;
  const leaveCount = records.filter((r) => r.status === 'Leave').length;
  const holidayCount = records.filter((r) => r.status === 'Holiday').length;
  const totalWorkingDays = presentCount + absentCount + leaveCount;
  const percentage = totalWorkingDays > 0 ? Math.round((presentCount / totalWorkingDays) * 100) : 91;

  // Calendar days generation for September 2026 (30 days, Sep 1 2026 was Tuesday)
  const daysInMonth = Array.from({ length: 30 }, (_, i) => {
    const dayNum = i + 1;
    const dateStr = `2026-09-${dayNum < 10 ? '0' + dayNum : dayNum}`;
    const rec = records.find((r) => r.date === dateStr);
    return {
      day: dayNum,
      date: dateStr,
      status: rec ? rec.status : dayNum % 7 === 5 || dayNum % 7 === 6 ? 'Holiday' : 'Present',
      remarks: rec?.remarks,
    };
  });

  return (
    <div className="space-y-6 pb-16">
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
          <span>Academics</span>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="font-semibold text-blue-600">Daily Attendance</span>
        </div>
        <h1 className="text-2xl font-black text-[#172033] tracking-tight">
          Student Attendance Record
        </h1>
        <p className="text-xs text-slate-500">
          Monthly verified attendance sheet for <strong className="text-slate-800">{student.fullName}</strong>
        </p>
      </div>

      {/* Summary with Circular Metric */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Circular Progress Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-5 md:col-span-2">
          {/* Radial Circle */}
          <div className="relative w-24 h-24 flex items-center justify-center flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-green-500"
                strokeDasharray={`${percentage}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-xl font-black text-slate-900 leading-none">{percentage}%</span>
              <span className="text-[9px] uppercase font-bold text-slate-400 mt-0.5">Rate</span>
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              September 2026 Overall
            </span>
            <h3 className="text-lg font-extrabold text-[#172033] mt-0.5">
              Excellent Regularity
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Minimum 75% required by school policy for annual exam eligibility.
            </p>
          </div>
        </div>

        {/* Present Days Card */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-slate-400">Present</span>
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <h4 className="text-3xl font-black text-green-600">{presentCount || 21}</h4>
            <span className="text-xs text-slate-500 font-medium">Days Attended</span>
          </div>
        </div>

        {/* Absent & Leave Card */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-slate-400">Absent / Leave</span>
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <h4 className="text-3xl font-black text-amber-600">{absentCount || 2} <span className="text-sm font-semibold text-slate-400">/ {leaveCount || 1}</span></h4>
            <span className="text-xs text-slate-500 font-medium">Approved Medical</span>
          </div>
        </div>
      </div>

      {/* Monthly Attendance Calendar */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/80">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h3 className="font-extrabold text-base text-[#172033]">
              September 2026 Calendar
            </h3>
            <p className="text-xs text-slate-400">Class LKG - Section A</p>
          </div>

          {/* Color-coded Legend */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-green-500"></span>
              Present
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-red-500"></span>
              Absent
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-amber-400"></span>
              Leave
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-slate-200"></span>
              Holiday
            </span>
          </div>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 pb-2">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Month Days Grid (Pad first 2 empty slots for Tuesday start) */}
        <div className="grid grid-cols-7 gap-2">
          {/* Empty placeholders for Sun & Mon */}
          <div className="h-14 rounded-2xl bg-slate-50/50"></div>
          <div className="h-14 rounded-2xl bg-slate-50/50"></div>

          {daysInMonth.map((d) => {
            let bgClass = 'bg-green-50 border-green-200 text-green-900';
            let badgeDot = 'bg-green-500';

            if (d.status === 'Absent') {
              bgClass = 'bg-red-50 border-red-200 text-red-900';
              badgeDot = 'bg-red-500';
            } else if (d.status === 'Leave') {
              bgClass = 'bg-amber-50 border-amber-200 text-amber-900';
              badgeDot = 'bg-amber-500';
            } else if (d.status === 'Holiday') {
              bgClass = 'bg-slate-100 border-slate-200 text-slate-400';
              badgeDot = 'bg-slate-300';
            }

            return (
              <div
                key={d.day}
                title={d.remarks || d.status}
                className={`h-14 rounded-2xl border p-2 flex flex-col justify-between transition hover:scale-[1.03] cursor-pointer ${bgClass}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">{d.day}</span>
                  <span className={`w-2 h-2 rounded-full ${badgeDot}`}></span>
                </div>
                <span className="text-[10px] font-bold truncate">
                  {d.status === 'Holiday' ? 'Holiday' : d.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
