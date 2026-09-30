import React, { useState } from 'react';
import { Calendar, Download, BookOpen, Clock, MapPin, X, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSchoolData } from '../../context/SchoolDataContext';
import { ExamRoutineItem } from '../../types';

export const ParentExamRoutinePage: React.FC = () => {
  const { selectedStudentId } = useAuth();
  const { school, students, exams } = useSchoolData();

  const [selectedSyllabusExam, setSelectedSyllabusExam] = useState<ExamRoutineItem | null>(null);

  const student = students.find((s) => s.id === selectedStudentId) || students[0];

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Academics</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="font-semibold text-blue-600">Exam Routine</span>
          </div>
          <h1 className="text-2xl font-black text-[#172033] tracking-tight">
            Half Yearly Examination Schedule 2026
          </h1>
          <p className="text-xs text-slate-500">
            Official timetable and syllabus for <strong className="text-slate-800">{student.fullName}</strong> ({student.class}-{student.section})
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#253B80] hover:bg-[#1C2C60] text-white font-bold text-xs rounded-xl shadow-xs transition self-start"
        >
          <Download className="w-4 h-4" />
          Download Routine PDF
        </button>
      </div>

      {/* Routine Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {exams.map((ex, idx) => (
          <div
            key={ex.id}
            className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:border-blue-200 transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
                  Paper {idx + 1}
                </span>
                <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  {ex.date}
                </span>
              </div>

              <h3 className="text-lg font-extrabold text-slate-900">{ex.subject}</h3>

              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Timings</span>
                    <span className="font-bold text-slate-800">{ex.time}</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Examination Hall</span>
                    <span className="font-bold text-slate-800 truncate block">{ex.room}</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-500 mt-3 line-clamp-2">
                <strong className="text-slate-700">Syllabus Overview:</strong> {ex.syllabus}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Total Marks: 50</span>
              <button
                onClick={() => setSelectedSyllabusExam(ex)}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <BookOpen className="w-3.5 h-3.5" />
                View Full Syllabus
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Syllabus Modal */}
      {selectedSyllabusExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                  Detailed Syllabus
                </span>
                <h3 className="font-black text-lg text-slate-900">
                  {selectedSyllabusExam.subject}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSyllabusExam(null)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 text-blue-950">
                <span className="font-bold block mb-1">Topics & Learning Milestones Covered:</span>
                <p>{selectedSyllabusExam.syllabus}</p>
              </div>

              <div className="space-y-1.5 pt-1">
                <span className="font-bold text-slate-800 block">Required Exam Kit:</span>
                <ul className="list-disc pl-5 space-y-1 text-slate-500">
                  <li>Sharpened 2B Pencils, eraser, and child-safe ruler.</li>
                  <li>School Diary with Student ID card.</li>
                  <li>Color pencils / crayons for activity portion.</li>
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedSyllabusExam(null)}
                className="px-4 py-2 bg-[#253B80] text-white font-bold text-xs rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
