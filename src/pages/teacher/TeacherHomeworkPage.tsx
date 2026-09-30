import React, { useState } from 'react';
import { BookOpen, Plus, Save, Trash2, Calendar, FileText, CheckCircle2, ChevronRight } from 'lucide-react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useTransport } from '../../context/TransportContext';

export const TeacherHomeworkPage: React.FC = () => {
  const { homework, addHomework } = useSchoolData();
  const { addCustomNotification } = useTransport();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subject, setSubject] = useState('English');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('Tomorrow, 08:30 AM');
  const [attachmentName, setAttachmentName] = useState('');

  const handleCreateHomework = (e: React.FormEvent) => {
    e.preventDefault();
    addHomework({
      class: 'LKG',
      section: 'A',
      subject,
      title,
      description,
      assignedDate: new Date().toISOString().split('T')[0],
      dueDate,
      attachmentName: attachmentName || undefined,
      teacherName: 'Sunita Sen',
      status: 'Pending',
    });

    // Notify parents
    addCustomNotification({
      targetRole: 'parent',
      title: `New Homework: ${subject}`,
      message: `Teacher Sunita Sen assigned "${title}". Due: ${dueDate}.`,
      priority: 'INFO',
      category: 'Academic',
    });

    setIsModalOpen(false);
    setTitle('');
    setDescription('');
    setAttachmentName('');
  };

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Teacher Console</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="font-semibold text-blue-600">Assignments</span>
          </div>
          <h1 className="text-2xl font-black text-[#172033] tracking-tight">
            Homework Management
          </h1>
          <p className="text-xs text-slate-500">
            Post worksheets and daily lessons for LKG - Section A
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#253B80] hover:bg-[#1C2C60] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          Add Homework
        </button>
      </div>

      {/* Homework List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {homework.map((hw) => (
          <div
            key={hw.id}
            className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                  {hw.subject}
                </span>
                <span className="text-[11px] font-bold text-slate-500">Due: {hw.dueDate}</span>
              </div>
              <h3 className="font-extrabold text-base text-slate-900 mt-2">{hw.title}</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{hw.description}</p>
              {hw.attachmentName && (
                <div className="mt-3 flex items-center gap-2 text-xs text-blue-700 bg-blue-50/50 p-2 rounded-xl">
                  <FileText className="w-4 h-4" />
                  <span className="font-medium truncate">{hw.attachmentName}</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Assigned: {hw.assignedDate}</span>
              <span className="text-green-700 font-bold">Active in Parent Diary</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Homework Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 p-6 space-y-4">
            <h3 className="font-black text-base text-slate-900">Post New Homework</h3>

            <form onSubmit={handleCreateHomework} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600"
                >
                  <option value="English">English</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="EVS">EVS (Environmental Studies)</option>
                  <option value="Bengali / Hindi">2nd Language (Bengali / Hindi)</option>
                  <option value="Art & Craft">Art & Craft</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Homework Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Learn Pages 22-25 Phonics"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Instructions for Parents & Children</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detail what pages to read or worksheet to trace..."
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Due Date / Time</label>
                  <input
                    type="text"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    placeholder="e.g. Tomorrow 08:30 AM"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Attachment File Name</label>
                  <input
                    type="text"
                    value={attachmentName}
                    onChange={(e) => setAttachmentName(e.target.value)}
                    placeholder="Worksheet_05.pdf"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 bg-[#253B80] hover:bg-[#1C2C60] text-white font-extrabold uppercase rounded-xl shadow-xs"
                >
                  Publish Homework
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
