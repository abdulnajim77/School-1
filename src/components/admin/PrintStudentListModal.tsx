import React, { useState } from 'react';
import {
  Printer,
  X,
  Sliders,
  Users,
  Bus,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Student } from '../../types';

interface PrintStudentListModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  totalSchoolStudentsCount: number;
  schoolName: string;
  filters: {
    searchTerm: string;
    classCategory: string;
    sectionSubCategory: string;
    attendanceFilter: string;
    busFilter: string;
  };
  getStudentAttendance?: (student: Student) => {
    status: string;
    label: string;
  };
}

export const PrintStudentListModal: React.FC<PrintStudentListModalProps> = ({
  isOpen,
  onClose,
  students,
  totalSchoolStudentsCount,
  schoolName,
  filters,
  getStudentAttendance,
}) => {
  // Column visibility options
  const [showContact, setShowContact] = useState(true);
  const [showBusInfo, setShowBusInfo] = useState(true);
  const [showAttendance, setShowAttendance] = useState(true);
  const [showSignatureColumn, setShowSignatureColumn] = useState(true);
  const [density, setDensity] = useState<'compact' | 'comfortable'>('compact');

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  // Filter summary text
  const activeFilterDescriptions: string[] = [];
  if (filters.searchTerm) activeFilterDescriptions.push(`Search: "${filters.searchTerm}"`);
  if (filters.classCategory !== 'All') activeFilterDescriptions.push(`Class: ${filters.classCategory}`);
  if (filters.sectionSubCategory !== 'All') activeFilterDescriptions.push(`Section: ${filters.sectionSubCategory}`);
  if (filters.attendanceFilter !== 'All') activeFilterDescriptions.push(`Status: ${filters.attendanceFilter}`);
  if (filters.busFilter !== 'All') activeFilterDescriptions.push(`Route: ${filters.busFilter}`);

  const filterSummary = activeFilterDescriptions.length > 0
    ? activeFilterDescriptions.join(' • ')
    : 'All Grades & Sections (Complete Directory)';

  // Attendance & Bus summary
  const getAttendanceStatus = (student: Student) => {
    if (getStudentAttendance) {
      return getStudentAttendance(student).label;
    }
    if (student.currentTransportStatus === 'SCHOOL_LEAVE') return 'On Leave';
    if (student.currentTransportStatus === 'TRANSPORT_SKIP') return 'Bus Skipped';
    return 'Present';
  };

  const presentCount = students.filter((s) => getAttendanceStatus(s) === 'Present').length;
  const absentCount = students.filter((s) => getAttendanceStatus(s) !== 'Present').length;
  const busRidersCount = students.filter((s) => s.busId).length;

  const printDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const getBusLabel = (busId: string) => {
    if (busId === 'bus_001') return 'Bus 01 (Route B)';
    if (busId === 'bus_002') return 'Bus 02 (Route C)';
    if (busId === 'bus_003') return 'Bus 03 (Route A)';
    return busId || 'Assigned Bus';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white print:static print:inset-auto">
      {/* Container Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-5xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[92vh] print:max-h-none print:shadow-none print:border-none print:rounded-none">
        {/* Top Control Bar (Hidden during actual print) */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/80 dark:bg-slate-800/60 rounded-t-3xl print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-700 dark:bg-emerald-600 flex items-center justify-center text-white shadow-xs">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                Print Student List Preview
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold font-mono">
                  {students.length} Records
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Print-friendly view of the currently filtered table data
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Now</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
              aria-label="Close print preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Options Toolbar (Hidden during actual print) */}
        <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap items-center justify-between gap-3 text-xs print:hidden">
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" /> Columns to Include:
            </span>
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={showContact}
                onChange={(e) => setShowContact(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Guardian & Phone</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={showBusInfo}
                onChange={(e) => setShowBusInfo(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Bus Route & Stop</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={showAttendance}
                onChange={(e) => setShowAttendance(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Attendance Status</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={showSignatureColumn}
                onChange={(e) => setShowSignatureColumn(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Sign / Remarks Line</span>
            </label>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-500 dark:text-slate-400">Row Density:</span>
            <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 bg-slate-100 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => setDensity('compact')}
                className={`px-2 py-0.5 text-[11px] font-semibold rounded transition cursor-pointer ${
                  density === 'compact'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Compact (Fit more)
              </button>
              <button
                type="button"
                onClick={() => setDensity('comfortable')}
                className={`px-2 py-0.5 text-[11px] font-semibold rounded transition cursor-pointer ${
                  density === 'comfortable'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Comfortable
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Printable Document Paper View */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100 dark:bg-slate-950/50 print:p-0 print:bg-white print:overflow-visible">
          {/* Printable White Sheet Canvas */}
          <div
            id="printable-student-roster"
            className="bg-white text-slate-900 mx-auto max-w-4xl p-6 sm:p-10 rounded-2xl shadow-sm border border-slate-200 print:border-none print:shadow-none print:p-0 print:max-w-none print:rounded-none"
          >
            {/* School Official Letterhead */}
            <div className="border-b-2 border-slate-800 pb-4 mb-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 uppercase">
                    {schoolName}
                  </h1>
                  <p className="text-xs font-medium text-slate-600 mt-0.5">
                    Affiliated to Central Board of Secondary Education &bull; Transport & Student Management Directorate
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Official Student Directory &bull; Filtered Table Extract
                  </p>
                </div>
                <div className="text-right">
                  <div className="inline-block border border-slate-300 rounded px-2.5 py-1 text-[10px] font-mono font-bold text-slate-700 bg-slate-50">
                    FORM: STU-ROSTER-2026
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono mt-1">
                    Generated: {printDate}
                  </p>
                </div>
              </div>
            </div>

            {/* Filter Summary & Metric Cards */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-5 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Applied Filter Criteria
                  </span>
                  <span className="font-semibold text-slate-800">{filterSummary}</span>
                </div>
                <div className="text-right text-[11px] text-slate-600">
                  Total Students Filtered: <strong className="text-slate-900">{students.length}</strong> of {totalSchoolStudentsCount}
                </div>
              </div>

              {/* Metric Breakdown Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200 text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Users className="w-3.5 h-3.5 text-slate-500" />
                  <span>Total: <strong>{students.length}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Present: <strong>{presentCount}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-red-800">
                  <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                  <span>Absent / Leave: <strong>{absentCount}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-amber-800">
                  <Bus className="w-3.5 h-3.5 text-amber-600" />
                  <span>Bus Riders: <strong>{busRidersCount}</strong></span>
                </div>
              </div>
            </div>

            {/* Filtered Students Table */}
            {students.length === 0 ? (
              <div className="py-12 text-center text-slate-400 border border-dashed border-slate-200 rounded-xl">
                <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm font-semibold">No students matched the active filter criteria.</p>
                <p className="text-xs text-slate-400 mt-1">Adjust search or filters before printing.</p>
              </div>
            ) : (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-y-2 border-slate-800 bg-slate-100 font-bold text-slate-800 uppercase text-[10px] tracking-wider">
                    <th className="py-2 px-2 text-center w-8">#</th>
                    <th className="py-2 px-2.5">ID / Roll</th>
                    <th className="py-2 px-3">Student Name</th>
                    <th className="py-2 px-2.5">Class</th>
                    {showContact && <th className="py-2 px-3">Parent & Contact</th>}
                    {showBusInfo && <th className="py-2 px-3">Bus / Pickup Stop</th>}
                    {showAttendance && <th className="py-2 px-2.5 text-center">Attendance</th>}
                    {showSignatureColumn && <th className="py-2 px-3 w-28 text-center">Remarks / Sign</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-normal">
                  {students.map((student, idx) => {
                    const rowPad = density === 'compact' ? 'py-1.5 px-2.5' : 'py-2.5 px-2.5';
                    const attLabel = getAttendanceStatus(student);

                    return (
                      <tr
                        key={student.id}
                        className={idx % 2 === 1 ? 'bg-slate-50/60' : 'bg-white'}
                        style={{ pageBreakInside: 'avoid' }}
                      >
                        <td className={`${rowPad} text-center font-mono text-[10px] text-slate-500`}>
                          {idx + 1}
                        </td>
                        <td className={rowPad}>
                          <span className="font-mono text-[11px] font-semibold text-slate-800 block">
                            {student.studentIdNumber || `STU-${student.id.slice(0, 6)}`}
                          </span>
                          <span className="text-[10px] text-slate-500">Roll #{student.rollNumber}</span>
                        </td>
                        <td className={rowPad}>
                          <span className="font-bold text-slate-900 block leading-tight">
                            {student.fullName}
                          </span>
                          <span className="text-[10px] text-slate-500 capitalize">{student.gender || 'Student'}</span>
                        </td>
                        <td className={rowPad}>
                          <span className="font-semibold text-slate-800 block">
                            {student.class}
                          </span>
                          <span className="text-[10px] text-slate-500">Sec {student.section}</span>
                        </td>

                        {showContact && (
                          <td className={rowPad}>
                            <span className="font-medium text-slate-800 block truncate max-w-[130px]">
                              {student.parentName || 'Parent / Guardian'}
                            </span>
                            <span className="font-mono text-[10px] text-slate-500 block">
                              {student.parentPhone || '—'}
                            </span>
                          </td>
                        )}

                        {showBusInfo && (
                          <td className={rowPad}>
                            {student.busId ? (
                              <>
                                <span className="font-semibold text-slate-800 block">
                                  {getBusLabel(student.busId)}
                                </span>
                                <span className="text-[10px] text-slate-500 truncate block max-w-[130px]">
                                  {student.pickupPointName || 'Designated Stop'}
                                </span>
                              </>
                            ) : (
                              <span className="text-[10px] text-slate-400 italic">Self / Walker</span>
                            )}
                          </td>
                        )}

                        {showAttendance && (
                          <td className={`${rowPad} text-center`}>
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                                attLabel === 'Present'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : attLabel === 'Absent'
                                  ? 'bg-red-100 text-red-800'
                                  : attLabel === 'On Leave'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {attLabel}
                            </span>
                          </td>
                        )}

                        {showSignatureColumn && (
                          <td className={`${rowPad} text-center`}>
                            <div className="border-b border-dotted border-slate-400 h-5 w-full mt-2"></div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            {/* Official Signature Verification Footer */}
            <div className="mt-8 pt-6 border-t-2 border-slate-300 grid grid-cols-3 gap-6 text-center text-xs text-slate-600 print:mt-12">
              <div>
                <div className="border-b border-slate-400 h-10 w-36 mx-auto mb-1"></div>
                <p className="font-bold text-slate-800">Class Teacher In-charge</p>
                <p className="text-[10px] text-slate-400">Signature & Verification</p>
              </div>
              <div>
                <div className="border-b border-slate-400 h-10 w-36 mx-auto mb-1"></div>
                <p className="font-bold text-slate-800">Transport Supervisor</p>
                <p className="text-[10px] text-slate-400">Route & Vehicle Allocation</p>
              </div>
              <div>
                <div className="border-b border-slate-400 h-10 w-36 mx-auto mb-1"></div>
                <p className="font-bold text-slate-800">School Principal / Admin</p>
                <p className="text-[10px] text-slate-400">Official Seal & Approval</p>
              </div>
            </div>

            {/* Confidentiality Notice */}
            <div className="mt-6 pt-3 border-t border-slate-100 text-center text-[10px] text-slate-400 font-mono">
              CONFIDENTIAL &bull; FOR INTERNAL SCHOOL USE ONLY &bull; POWERED BY SCHOOLSYNC ROSTER
            </div>
          </div>
        </div>

        {/* Bottom Modal Actions (Hidden during print) */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-800/60 rounded-b-3xl flex items-center justify-between gap-3 print:hidden">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Tip: For landscape or multi-column printouts, select <strong>Landscape</strong> in your browser print dialog.
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Student List</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
