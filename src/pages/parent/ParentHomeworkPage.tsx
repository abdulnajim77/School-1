import React, { useState } from 'react';
import { BookOpen, CheckCircle, Clock, FileText, Download, CheckCircle2, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSchoolData } from '../../context/SchoolDataContext';

export const ParentHomeworkPage: React.FC = () => {
  const { selectedStudentId } = useAuth();
  const { students, homework } = useSchoolData();

  const [activeFilter, setActiveFilter] = useState<'All' | 'Pending' | 'Completed'>('All');
  const [completedItems, setCompletedItems] = useState<string[]>(['hw_002']);

  const student = students.find((s) => s.id === selectedStudentId) || students[0];

  const filtered = homework.filter((item) => {
    const isCompleted = completedItems.includes(item.id);
    if (activeFilter === 'Pending') return !isCompleted;
    if (activeFilter === 'Completed') return isCompleted;
    return true;
  });

  const toggleComplete = (id: string) => {
    setCompletedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Academics</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="font-semibold text-blue-600">Daily Homework</span>
          </div>
          <h1 className="text-2xl font-black text-[#172033] tracking-tight">
            Homework & Class Assignments
          </h1>
          <p className="text-xs text-slate-500">
            Assigned tasks for <strong className="text-slate-800">{student.fullName}</strong> ({student.class}-{student.section})
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-slate-200 shadow-xs self-start">
          {(['All', 'Pending', 'Completed'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                activeFilter === filter
                  ? 'bg-[#253B80] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Homework Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((hw) => {
          const isDone = completedItems.includes(hw.id);

          const subjectColors: Record<string, string> = {
            English: 'bg-blue-50 text-blue-700 border-blue-200',
            Mathematics: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            EVS: 'bg-amber-50 text-amber-800 border-amber-200',
          };

          return (
            <div
              key={hw.id}
              className={`bg-white rounded-3xl p-6 border shadow-xs transition-all flex flex-col justify-between ${
                isDone ? 'border-slate-200 opacity-90' : 'border-blue-200/80 shadow-blue-900/5'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
                      subjectColors[hw.subject] || 'bg-slate-100 text-slate-800'
                    }`}
                  >
                    {hw.subject}
                  </span>

                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md ${
                      isDone ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    <Clock className="w-3 h-3" />
                    Due: {hw.dueDate}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-[#172033] leading-snug">
                  {hw.title}
                </h3>

                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {hw.description}
                </p>

                {hw.attachmentName && (
                  <div className="mt-4 p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span className="font-semibold text-slate-700 truncate">{hw.attachmentName}</span>
                    </div>
                    <button
                      onClick={() => alert(`Downloading ${hw.attachmentName}...`)}
                      className="p-1 text-slate-400 hover:text-blue-600 transition"
                      title="Download Worksheet"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">By: {hw.teacherName}</span>

                <button
                  onClick={() => toggleComplete(hw.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    isDone
                      ? 'bg-green-50 text-green-700 hover:bg-green-100'
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xs'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {isDone ? 'Completed' : 'Mark Done'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
