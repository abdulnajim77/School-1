import React from 'react';
import { BellRing, FileText, Download, Calendar, User, ChevronRight, AlertTriangle, Info } from 'lucide-react';
import { useSchoolData } from '../../context/SchoolDataContext';

export const ParentNoticesPage: React.FC = () => {
  const { school, notices } = useSchoolData();

  return (
    <div className="space-y-6 pb-16">
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
          <span>Communication</span>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="font-semibold text-blue-600">School Notices</span>
        </div>
        <h1 className="text-2xl font-black text-[#172033] tracking-tight">
          Official School Circulars & Notices
        </h1>
        <p className="text-xs text-slate-500">
          Published announcements from {school.name} administration
        </p>
      </div>

      {/* Notices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {notices.map((notice) => {
          const isImportant = notice.priority === 'IMPORTANT' || notice.priority === 'EMERGENCY';

          return (
            <div
              key={notice.id}
              className={`bg-white rounded-3xl p-6 border shadow-xs transition-all flex flex-col justify-between ${
                isImportant ? 'border-amber-200/90 shadow-amber-900/5' : 'border-slate-200/80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                    {notice.category}
                  </span>

                  <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {notice.date}
                  </span>
                </div>

                <div className="flex items-start gap-2 mb-2">
                  {isImportant && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-100 text-amber-900 uppercase tracking-wide flex-shrink-0 mt-0.5">
                      IMPORTANT
                    </span>
                  )}
                  <h3 className="text-base font-extrabold text-[#172033] leading-snug">
                    {notice.title}
                  </h3>
                </div>

                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {notice.content}
                </p>

                {notice.attachmentName && (
                  <div className="mt-4 p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span className="font-semibold text-slate-700 truncate">{notice.attachmentName}</span>
                    </div>
                    <button
                      onClick={() => alert(`Downloading circular ${notice.attachmentName}...`)}
                      className="p-1 text-slate-400 hover:text-blue-600 transition"
                      title="Download PDF Circular"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3 text-slate-400" />
                  Issued by: <strong className="text-slate-700">{notice.author}</strong>
                </span>
                <span className="text-blue-600 font-bold cursor-pointer hover:underline">
                  Verified Circular
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
