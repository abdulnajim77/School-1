import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  Clock,
  Download,
  Receipt,
  FileCheck,
  Smartphone,
  Building,
  ShieldCheck,
  X,
  ChevronRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { useSchoolData } from '../../context/SchoolDataContext';
import { FeeInvoice } from '../../types';

export const ParentFeesPage: React.FC = () => {
  const { selectedStudentId } = useAuth();
  const { school, students, fees, payFee } = useSchoolData();

  const [selectedInvoice, setSelectedInvoice] = useState<FeeInvoice | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'Net Banking'>('UPI');
  const [isProcessing, setIsProcessing] = useState(false);
  const [viewReceiptInvoice, setViewReceiptInvoice] = useState<FeeInvoice | null>(null);

  const student = students.find((s) => s.id === selectedStudentId) || students[0];
  const studentFees = fees.filter((f) => f.studentId === student.id);

  // Calculations
  const totalAmount = studentFees.reduce((acc, f) => acc + f.amount, 0) + 15000; // Total annual
  const paidAmount = studentFees.filter((f) => f.status === 'Paid').reduce((acc, f) => acc + f.amount, 0) + 15000;
  const pendingFees = studentFees.filter((f) => f.status === 'Pending');
  const pendingAmount = pendingFees.reduce((acc, f) => acc + f.amount, 0);

  const handlePaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;

    setIsProcessing(true);
    setTimeout(() => {
      payFee(selectedInvoice.id, paymentMethod);
      setIsProcessing(false);
      setSelectedInvoice(null);
      // Confetti celebration
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
          <span>Academics</span>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="font-semibold text-blue-600">Fee Dashboard</span>
        </div>
        <h1 className="text-2xl font-black text-[#172033] tracking-tight">
          School & Transport Fees
        </h1>
        <p className="text-xs text-slate-500">
          Fee records and online instant digital payment for <strong className="text-slate-800">{student.fullName}</strong>
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Annual Fee
          </span>
          <h3 className="text-xl font-black text-slate-900 mt-1">₹32,500</h3>
          <span className="text-[11px] text-slate-500">Academic Year 2026-27</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Paid
          </span>
          <h3 className="text-xl font-black text-green-600 mt-1">₹{paidAmount.toLocaleString('en-IN')}</h3>
          <span className="text-[11px] text-green-700 font-semibold">100% Verified</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Pending Due
          </span>
          <h3 className="text-xl font-black text-amber-600 mt-1">₹{pendingAmount.toLocaleString('en-IN')}</h3>
          <span className="text-[11px] text-amber-700 font-semibold">
            {pendingFees.length > 0 ? '1 Month Pending' : 'No dues'}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Next Due Date
          </span>
          <h3 className="text-xl font-black text-blue-600 mt-1">10 Oct 2026</h3>
          <span className="text-[11px] text-slate-500">Zero late fee before due</span>
        </div>
      </div>

      {/* Fee Invoices Table */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80">
        <h3 className="font-extrabold text-base text-[#172033] mb-4">Invoice Ledger & Receipts</h3>

        <div className="space-y-4">
          {studentFees.map((fee) => (
            <div
              key={fee.id}
              className="p-4 sm:p-5 rounded-2xl border border-slate-200 hover:border-blue-200 bg-slate-50/40 hover:bg-white transition flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-400">{fee.invoiceNumber}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      fee.status === 'Paid'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {fee.status}
                  </span>
                </div>
                <h4 className="text-sm font-extrabold text-slate-900">{fee.title}</h4>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span>Period: <strong>{fee.period}</strong></span>
                  <span>Due Date: <strong>{fee.dueDate}</strong></span>
                  {fee.paidDate && <span>Paid on: <strong>{fee.paidDate}</strong> via {fee.paymentMethod}</span>}
                </div>
                {/* Breakdown items */}
                <div className="pt-1 text-[11px] text-slate-400 flex flex-wrap gap-2">
                  {fee.breakdown.map((item, idx) => (
                    <span key={idx} className="bg-white px-2 py-0.5 rounded border border-slate-200">
                      {item.item}: ₹{item.amount}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="flex items-center gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Amount</span>
                  <span className="text-lg font-black text-slate-900">
                    ₹{fee.amount.toLocaleString('en-IN')}
                  </span>
                </div>

                {fee.status === 'Pending' ? (
                  <button
                    onClick={() => setSelectedInvoice(fee)}
                    className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-xs transition"
                  >
                    PAY NOW
                  </button>
                ) : (
                  <button
                    onClick={() => setViewReceiptInvoice(fee)}
                    className="py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Receipt
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pay Now Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden">
            <div className="bg-[#253B80] px-6 py-4 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Instant Online Fee Payment</h3>
                <p className="text-xs text-blue-200">{selectedInvoice.title}</p>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="p-1 rounded-full hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePaySubmit} className="p-6 space-y-4">
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Total Payable</span>
                  <h4 className="text-2xl font-black text-[#253B80]">
                    ₹{selectedInvoice.amount.toLocaleString('en-IN')}
                  </h4>
                </div>
                <div className="text-right text-[11px] text-slate-500">
                  <span className="font-mono">{selectedInvoice.invoiceNumber}</span>
                  <span className="block text-green-700 font-semibold">Zero Gateway Charges</span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI')}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 ${
                      paymentMethod === 'UPI'
                        ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-blue-600" />
                    <span className="text-xs">UPI / QR</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Card')}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 ${
                      paymentMethod === 'Card'
                        ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-indigo-600" />
                    <span className="text-xs">Debit/Credit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Net Banking')}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 ${
                      paymentMethod === 'Net Banking'
                        ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <Building className="w-5 h-5 text-emerald-600" />
                    <span className="text-xs">Net Banking</span>
                  </button>
                </div>
              </div>

              {paymentMethod === 'UPI' && (
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700">Supported Apps:</span>
                    <span className="text-[11px] font-bold text-blue-700">GPay, PhonePe, Paytm, BHIM</span>
                  </div>
                  <input
                    type="text"
                    defaultValue="parent@oksbi"
                    placeholder="Enter UPI ID (e.g. mobile@upi)"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:outline-none focus:border-blue-600"
                  />
                </div>
              )}

              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span>256-Bit SSL Encrypted. Powered by Razorpay / Bank Gateway.</span>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-900/10 transition flex items-center justify-center gap-2"
              >
                {isProcessing ? 'Processing Payment...' : `Confirm & Pay ₹${selectedInvoice.amount}`}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Printable Receipt Modal */}
      {viewReceiptInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Receipt className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-base text-slate-900">Official Payment Receipt</h3>
              </div>
              <button
                onClick={() => setViewReceiptInvoice(null)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="text-center pb-3 border-b border-slate-100">
                <h2 className="text-base font-black text-[#253B80]">{school.name}</h2>
                <p className="text-[11px] text-slate-500">{school.address}, {school.city}</p>
                <p className="text-[11px] text-slate-400">Affiliation / CBSE Recognized &bull; Phone: {school.phone}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-slate-600">
                <div>
                  <span className="text-slate-400 block text-[10px]">Receipt No:</span>
                  <span className="font-mono font-bold text-slate-900">{viewReceiptInvoice.receiptNumber || 'REC-2026-08219'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Date of Payment:</span>
                  <span className="font-bold text-slate-900">{viewReceiptInvoice.paidDate || '2026-08-08'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Student Name:</span>
                  <span className="font-bold text-slate-900">{student.fullName} ({student.class}-{student.section})</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Student ID:</span>
                  <span className="font-mono font-bold text-slate-900">{student.studentIdNumber}</span>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">Item Description</th>
                      <th className="p-2.5 text-right">Amount (INR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {viewReceiptInvoice.breakdown.map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-2.5">{item.item}</td>
                        <td className="p-2.5 text-right font-mono">₹{item.amount}</td>
                      </tr>
                    ))}
                    <tr className="bg-slate-50 font-bold text-slate-900">
                      <td className="p-2.5">Total Paid</td>
                      <td className="p-2.5 text-right font-mono text-sm text-[#253B80]">
                        ₹{viewReceiptInvoice.amount}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2">
                <span>Payment Mode: <strong>{viewReceiptInvoice.paymentMethod || 'UPI'}</strong></span>
                <span className="text-green-700 font-bold">Status: PAID (Authorized)</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 bg-[#253B80] hover:bg-[#1C2C60] text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
