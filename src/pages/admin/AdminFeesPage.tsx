import React, { useState } from 'react';
import { CreditCard, Download, Search, CheckCircle2, Clock, ChevronRight, DollarSign } from 'lucide-react';
import { useSchoolData } from '../../context/SchoolDataContext';

export const AdminFeesPage: React.FC = () => {
  const { fees, students } = useSchoolData();
  const [filterStatus, setFilterStatus] = useState<'All' | 'Paid' | 'Pending'>('All');

  const filtered = fees.filter((f) => filterStatus === 'All' || f.status === filterStatus);

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Administration</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="font-semibold text-blue-600">Finance & Fees</span>
          </div>
          <h1 className="text-2xl font-black text-[#172033] tracking-tight">
            Fee Invoicing & Real-Time Collections
          </h1>
          <p className="text-xs text-slate-500">
            Monitor digital fee payments, tuition collections and transport fees
          </p>
        </div>

        <div className="flex gap-1.5 p-1 bg-white rounded-2xl border border-slate-200 shadow-xs self-start">
          {(['All', 'Paid', 'Pending'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                filterStatus === s
                  ? 'bg-[#253B80] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase border-b border-slate-200">
              <tr>
                <th className="p-4">Invoice No</th>
                <th className="p-4">Student Ward</th>
                <th className="p-4">Period / Month</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Due Date</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Receipt / Method</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((f) => {
                const student = students.find((s) => s.id === f.studentId);

                return (
                  <tr key={f.id} className="hover:bg-slate-50/60">
                    <td className="p-4 font-mono font-bold text-slate-900">{f.invoiceNumber}</td>
                    <td className="p-4">
                      <span className="font-bold text-slate-900 block">{student?.fullName || 'Riya Das'}</span>
                      <span className="text-[11px] text-slate-400">Class {student?.class}-{student?.section}</span>
                    </td>
                    <td className="p-4 font-semibold text-slate-800">{f.period}</td>
                    <td className="p-4 font-bold text-slate-900">₹{f.amount.toLocaleString('en-IN')}</td>
                    <td className="p-4 text-slate-500">{f.dueDate}</td>
                    <td className="p-4 text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          f.status === 'Paid'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {f.status}
                      </span>
                    </td>
                    <td className="p-4 text-right font-mono text-[11px]">
                      {f.receiptNumber ? (
                        <span className="text-blue-700 font-bold">{f.receiptNumber} ({f.paymentMethod})</span>
                      ) : (
                        <span className="text-slate-400">Awaiting Online Payment</span>
                      )}
                    </td>
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
