import React, { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Bus,
  Search,
  ChevronRight,
  Filter,
  AlertCircle,
  User,
} from 'lucide-react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useTransport } from '../../context/TransportContext';

export const AdminLeaveRequestsPage: React.FC = () => {
  const { leaveRequests, approveLeaveRequest, rejectLeaveRequest } = useSchoolData();
  const { addCustomNotification } = useTransport();

  const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
  const [remarksInput, setRemarksInput] = useState<Record<string, string>>({});

  const filtered = leaveRequests.filter((l) => {
    if (activeTab === 'All') return true;
    return l.status === activeTab;
  });

  const handleApprove = (id: string, studentName: string, type: string) => {
    const remark = remarksInput[id] || 'Leave approved. Transport manifest updated.';
    approveLeaveRequest(id, remark);

    // Broadcast confirmation notification to parent and driver
    addCustomNotification({
      targetRole: 'parent',
      title: 'Leave Approved',
      message: `${studentName}'s leave application has been approved. Bus pickup is automatically skipped.`,
      priority: 'INFO',
      category: 'Academic',
    });

    addCustomNotification({
      targetRole: 'driver',
      title: 'Transport Manifest Updated',
      message: `${studentName} is on approved leave today. Do not stop for pickup.`,
      priority: 'IMPORTANT',
      category: 'Transport',
    });
  };

  const handleReject = (id: string, studentName: string) => {
    const remark = remarksInput[id] || 'Leave request could not be approved due to upcoming assessments.';
    rejectLeaveRequest(id, remark);

    addCustomNotification({
      targetRole: 'parent',
      title: 'Leave Request Update',
      message: `The leave request for ${studentName} was declined: ${remark}`,
      priority: 'IMPORTANT',
      category: 'Academic',
    });
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Administration</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="font-semibold text-blue-600">Leave Approvals</span>
          </div>
          <h1 className="text-2xl font-black text-[#172033] tracking-tight">
            Leave Requests & Transport Sync
          </h1>
          <p className="text-xs text-slate-500">
            Review parent submissions & automatically sync driver boarding manifests
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-slate-200 shadow-xs self-start">
          {(['All', 'Pending', 'Approved', 'Rejected'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTab === tab
                  ? 'bg-[#253B80] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Leave Requests Cards */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200/80 text-center text-slate-400 text-xs">
            No leave requests in this category
          </div>
        ) : (
          filtered.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5"
            >
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      req.status === 'Approved'
                        ? 'bg-green-100 text-green-800'
                        : req.status === 'Rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {req.status}
                  </span>
                  <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    {req.type === 'Transport_Skip_Today' ? 'Transport Skip Today' : 'Academic Leave'}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Applied: {req.appliedDate}</span>
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {req.studentName} <span className="text-xs text-slate-500 font-semibold">({req.class}-{req.section})</span>
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Dates: <strong>{req.fromDate}</strong> to <strong>{req.toDate}</strong>
                  </p>
                  <p className="text-xs text-slate-700 italic mt-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    "{req.reason}"
                  </p>
                </div>

                <div className="text-[11px] text-slate-500 flex items-center gap-3">
                  <span>Parent: <strong>{req.appliedBy}</strong></span>
                  {req.attachmentName && (
                    <span className="text-blue-600 font-semibold flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5" /> {req.attachmentName}
                    </span>
                  )}
                </div>

                {req.adminRemarks && (
                  <div className="text-[11px] text-emerald-800 bg-emerald-50 p-2 rounded-xl border border-emerald-100 font-semibold">
                    Admin Note: {req.adminRemarks}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {req.status === 'Pending' ? (
                <div className="flex flex-col sm:flex-row md:flex-col gap-2 min-w-[200px] border-t md:border-t-0 pt-3 md:pt-0">
                  <input
                    type="text"
                    placeholder="Optional remarks..."
                    value={remarksInput[req.id] || ''}
                    onChange={(e) =>
                      setRemarksInput((prev) => ({ ...prev, [req.id]: e.target.value }))
                    }
                    className="px-3 py-1.5 text-xs rounded-xl border border-slate-200"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(req.id, req.studentName, req.type)}
                      className="flex-1 py-2 px-3 bg-green-600 hover:bg-green-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-xs transition"
                    >
                      Approve & Sync
                    </button>
                    <button
                      onClick={() => handleReject(req.id, req.studentName)}
                      className="py-2 px-3 bg-red-100 hover:bg-red-200 text-red-700 font-bold text-xs uppercase rounded-xl transition"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-right text-xs text-slate-400">
                  Processed on {req.approvedDate || '2026-09-29'}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
