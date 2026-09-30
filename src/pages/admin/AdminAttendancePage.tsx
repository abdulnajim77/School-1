import React from 'react';
import { CalendarCheck, ChevronRight, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { useSchoolData } from '../../context/SchoolDataContext';

export const AdminAttendancePage: React.FC = () => {
  const { students, attendanceRecords } = useSchoolData();

  return (
    <div className="space-y-6 pb-20">
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
          <span>Administration</span>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="font-semibold text-blue-600">Daily Attendance Log</span>
        </div>
        <h1 className="text-2xl font-black text-[#172033] tracking-tight">
          School-Wide Attendance Registry
        </h1>
        <p className="text-xs text-slate-500">
          Cross-grade daily physical register & parent notification timestamps
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase border-b border-slate-200">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Student</th>
                <th className="p-4">Class</th>
                <th className="p-4">Marked By</th>
                <th className="p-4">Time</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {attendanceRecords.slice(0, 15).map((rec) => {
                const student = students.find((s) => s.id === rec.studentId) || students[0];

                return (
                  <tr key={rec.id} className="hover:bg-slate-50/60">
                    <td className="p-4 font-mono font-bold text-slate-900">{rec.date}</td>
                    <td className="p-4 font-bold text-slate-900">{student.fullName}</td>
                    <td className="p-4">{student.class}-{student.section}</td>
                    <td className="p-4 text-slate-500">{rec.markedBy}</td>
                    <td className="p-4 font-mono text-[11px] text-slate-400">{rec.markedAt}</td>
                    <td className="p-4 text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          rec.status === 'Present'
                            ? 'bg-green-100 text-green-800'
                            : rec.status === 'Absent'
                            ? 'bg-red-100 text-red-800'
                            : rec.status === 'Leave'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {rec.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500 italic">{rec.remarks || 'Regular daily check-in'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
