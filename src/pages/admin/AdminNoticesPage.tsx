import React, { useState } from 'react';
import { BellRing, Plus, Calendar, User, FileText, ChevronRight, X } from 'lucide-react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useTransport } from '../../context/TransportContext';

export const AdminNoticesPage: React.FC = () => {
  const { notices, addNotice } = useSchoolData();
  const { addCustomNotification } = useTransport();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'General' | 'Holiday' | 'Sports' | 'Academic' | 'Meeting'>('General');
  const [priority, setPriority] = useState<'INFO' | 'IMPORTANT' | 'EMERGENCY'>('INFO');
  const [content, setContent] = useState('');
  const [attachmentName, setAttachmentName] = useState('');

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    addNotice({
      title,
      category,
      priority,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      content,
      attachmentName: attachmentName || undefined,
      author: 'Principal Office',
    });

    addCustomNotification({
      targetRole: 'parent',
      title: `Notice: ${title}`,
      message: content.slice(0, 100) + '...',
      priority,
      category: 'Notice',
    });

    setIsModalOpen(false);
    setTitle('');
    setContent('');
    setAttachmentName('');
  };

  return (
    <div className="space-y-6 pb-20 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Communication</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="font-semibold text-blue-600">Official Notices</span>
          </div>
          <h1 className="text-2xl font-black text-[#172033] tracking-tight">
            Publish Notices & Parent Circulars
          </h1>
          <p className="text-xs text-slate-500">
            Broadcast emergency alerts, holiday circulars and event announcements
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#253B80] hover:bg-[#1C2C60] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-xs transition self-start"
        >
          <Plus className="w-4 h-4" />
          Publish Notice
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {notices.map((n) => (
          <div
            key={n.id}
            className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-800">
                  {n.category}
                </span>
                <span className="text-xs text-slate-400">{n.date}</span>
              </div>
              <h3 className="font-extrabold text-base text-slate-900 leading-snug">{n.title}</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">{n.content}</p>
              {n.attachmentName && (
                <div className="mt-3 flex items-center gap-2 text-xs text-blue-700 bg-blue-50/50 p-2 rounded-xl">
                  <FileText className="w-4 h-4" />
                  <span className="font-medium truncate">{n.attachmentName}</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Author: <strong>{n.author}</strong></span>
              <span className="text-green-700 font-bold">Published</span>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 p-6 space-y-4 text-xs">
            <h3 className="font-black text-base text-slate-900">Publish Circular</h3>

            <form onSubmit={handleCreateNotice} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Notice Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Diwali Vacation Notice"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  >
                    <option value="General">General</option>
                    <option value="Holiday">Holiday</option>
                    <option value="Sports">Sports</option>
                    <option value="Academic">Academic</option>
                    <option value="Meeting">Meeting</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  >
                    <option value="INFO">INFO (Standard)</option>
                    <option value="IMPORTANT">IMPORTANT</option>
                    <option value="EMERGENCY">EMERGENCY</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Circular Content</label>
                <textarea
                  rows={4}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Type official notification body..."
                  className="w-full p-3 rounded-xl border border-slate-200"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Attachment File Name (Optional)</label>
                <input
                  type="text"
                  value={attachmentName}
                  onChange={(e) => setAttachmentName(e.target.value)}
                  placeholder="Circular_Doc_2026.pdf"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#253B80] text-white rounded-xl font-extrabold uppercase"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
