import React from 'react';
import { Award, Download, CheckCircle2, ChevronRight, BookOpen } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSchoolData } from '../../context/SchoolDataContext';

export const ParentReportCardPage: React.FC = () => {
  const { selectedStudentId } = useAuth();
  const { school, students, reportCards } = useSchoolData();

  const student = students.find((s) => s.id === selectedStudentId) || students[0];
  const report = reportCards[student.id] || reportCards['stu_001'];

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Academics</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="font-semibold text-blue-600">Student Assessment</span>
          </div>
          <h1 className="text-2xl font-black text-[#172033] tracking-tight">
            Academic Performance & Report Card
          </h1>
          <p className="text-xs text-slate-500">
            Official progress card for <strong className="text-slate-800">{student.fullName}</strong> ({student.class}-{student.section})
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#253B80] hover:bg-[#1C2C60] text-white font-bold text-xs rounded-xl shadow-xs transition self-start"
        >
          <Download className="w-4 h-4" />
          Download Report Card PDF
        </button>
      </div>

      {/* Hero Assessment Badge */}
      <div className="bg-gradient-to-r from-[#253B80] to-[#1E3A8A] text-white rounded-3xl p-6 sm:p-7 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-200">
            {report.term} &bull; Academic Year {report.academicYear}
          </span>
          <h2 className="text-2xl font-extrabold text-white">Overall Grade: {report.overallGrade}</h2>
          <p className="text-xs text-blue-200">
            Attendance: {report.attendanceDays} out of {report.totalWorkingDays} working days ({Math.round((report.attendanceDays / report.totalWorkingDays) * 100)}%)
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center flex-shrink-0">
          <span className="text-[10px] font-bold uppercase text-blue-200 block">Total Percentage</span>
          <span className="text-3xl font-black text-amber-300">{report.overallPercentage}%</span>
          <span className="text-[10px] text-green-300 block font-semibold">Passed with Distinction</span>
        </div>
      </div>

      {/* Marks Breakdown Table */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80">
        <h3 className="font-extrabold text-base text-[#172033] mb-4">Subject Marks & Remarks</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase border-b border-slate-200">
                <th className="p-3">Subject / Evaluation Area</th>
                <th className="p-3 text-center">Max Marks</th>
                <th className="p-3 text-center">Obtained Marks</th>
                <th className="p-3 text-center">Grade</th>
                <th className="p-3">Teacher Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {report.subjects.map((sub, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="p-3 font-bold text-slate-900">{sub.name}</td>
                  <td className="p-3 text-center font-mono text-slate-400">{sub.maxMarks}</td>
                  <td className="p-3 text-center font-mono font-bold text-blue-700">{sub.obtainedMarks}</td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 rounded-md font-bold text-xs bg-green-100 text-green-800">
                      {sub.grade}
                    </span>
                  </td>
                  <td className="p-3 text-slate-600 italic">{sub.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Remarks Section */}
        <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="font-bold text-slate-700 block">Class Teacher’s Remarks (Sunita Sen):</span>
            <p className="text-slate-600 italic leading-relaxed">"{report.teacherRemarks}"</p>
          </div>
          <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-1">
            <span className="font-bold text-blue-900 block">Head of School Remarks:</span>
            <p className="text-blue-800 italic leading-relaxed">"{report.principalRemarks}"</p>
          </div>
        </div>
      </div>
    </div>
  );
};
