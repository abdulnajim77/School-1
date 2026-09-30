import React, { useState, useMemo } from 'react';
import {
  Users,
  Phone,
  MapPin,
  Bus,
  ChevronRight,
  GraduationCap,
  Search,
  Filter,
  Eye,
  ShieldCheck,
  CheckCircle2,
  X,
  RotateCcw,
} from 'lucide-react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { ALL_CLASSES, ALL_SECTIONS, AttendanceFilterType } from '../admin/StudentManagementPage';
import { Student } from '../../types';

export const TeacherStudentsPage: React.FC = () => {
  const { students, attendanceRecords, leaveRequests } = useSchoolData();

  // Class Category & Section Sub-category
  const [selectedClass, setSelectedClass] = useState<string>('LKG');
  const [selectedSection, setSelectedSection] = useState<string>('All');
  const [attendanceFilter, setAttendanceFilter] = useState<AttendanceFilterType>('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Helper: Resolve student attendance status
  const getStudentAttendance = (student: Student) => {
    const activeLeave = leaveRequests.find(
      (l) => l.studentId === student.id && (l.status === 'Approved' || l.status === 'Pending')
    );
    if (activeLeave) {
      if (activeLeave.type === 'Transport_Skip_Today') {
        return {
          status: 'Transport_Skip' as AttendanceFilterType,
          label: 'Bus Skipped',
          badgeClass: 'bg-sky-50 text-sky-800 border-sky-200',
          dotClass: 'bg-sky-500',
        };
      }
      return {
        status: 'Leave' as AttendanceFilterType,
        label: 'On Leave',
        badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
        dotClass: 'bg-amber-500',
      };
    }

    const todayRec = attendanceRecords.find(
      (r) => r.studentId === student.id && r.date === '2026-09-30'
    );
    if (todayRec) {
      if (todayRec.status === 'Present') {
        return {
          status: 'Present' as AttendanceFilterType,
          label: 'Present',
          badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          dotClass: 'bg-emerald-500',
        };
      }
      if (todayRec.status === 'Absent') {
        return {
          status: 'Absent' as AttendanceFilterType,
          label: 'Absent',
          badgeClass: 'bg-rose-50 text-rose-800 border-rose-200',
          dotClass: 'bg-rose-500',
        };
      }
      if (todayRec.status === 'Leave') {
        return {
          status: 'Leave' as AttendanceFilterType,
          label: 'On Leave',
          badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
          dotClass: 'bg-amber-500',
        };
      }
    }

    if (student.currentTransportStatus === 'SCHOOL_LEAVE') {
      return {
        status: 'Leave' as AttendanceFilterType,
        label: 'On Leave',
        badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
        dotClass: 'bg-amber-500',
      };
    }
    if (student.currentTransportStatus === 'TRANSPORT_SKIP') {
      return {
        status: 'Transport_Skip' as AttendanceFilterType,
        label: 'Bus Skipped',
        badgeClass: 'bg-sky-50 text-sky-800 border-sky-200',
        dotClass: 'bg-sky-500',
      };
    }
    if (student.currentTransportStatus === 'ABSENT_NO_NOTICE') {
      return {
        status: 'Absent' as AttendanceFilterType,
        label: 'Absent',
        badgeClass: 'bg-rose-50 text-rose-800 border-rose-200',
        dotClass: 'bg-rose-500',
      };
    }

    return {
      status: 'Present' as AttendanceFilterType,
      label: 'Present',
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      dotClass: 'bg-emerald-500',
    };
  };

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesClass = selectedClass === 'All' || s.class === selectedClass;
      const matchesSection = selectedSection === 'All' || s.section === selectedSection;
      const att = getStudentAttendance(s);
      const matchesAttendance = attendanceFilter === 'All' || att.status === attendanceFilter;

      const q = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !q ||
        s.fullName.toLowerCase().includes(q) ||
        s.studentIdNumber.toLowerCase().includes(q) ||
        String(s.rollNumber).includes(q) ||
        s.parentName.toLowerCase().includes(q) ||
        s.parentPhone.toLowerCase().includes(q);

      return matchesClass && matchesSection && matchesAttendance && matchesSearch;
    });
  }, [students, selectedClass, selectedSection, attendanceFilter, searchTerm, attendanceRecords, leaveRequests]);

  const isFiltered =
    Boolean(searchTerm) ||
    selectedClass !== 'All' ||
    selectedSection !== 'All' ||
    attendanceFilter !== 'All';

  const resetFilters = () => {
    setSelectedClass('All');
    setSelectedSection('All');
    setAttendanceFilter('All');
    setSearchTerm('');
  };

  return (
    <div className="space-y-6 pb-20 max-w-6xl mx-auto">
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
          <span>Teacher Console</span>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="font-semibold text-emerald-700">Student Roster</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Class & Section Student Directory
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          View assigned class rosters, guardian contacts, and filter by grade, section, or attendance status
        </p>
      </div>

      {/* Class Categories and Section Sub-categories Card */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-4">
        {/* Top search & dropdown filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by student name, roll number, ID, or parent..."
              className="w-full pl-10 pr-9 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-100 transition"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={attendanceFilter}
              onChange={(e) => setAttendanceFilter(e.target.value as AttendanceFilterType)}
              className={`px-3 py-2 text-xs rounded-xl border font-medium cursor-pointer transition ${
                attendanceFilter !== 'All'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold'
                  : 'border-slate-200 bg-white text-slate-800'
              }`}
            >
              <option value="All">All Attendance</option>
              <option value="Present">Present Today</option>
              <option value="Absent">Absent Today</option>
              <option value="Leave">On Leave</option>
              <option value="Transport_Skip">Bus Skipped</option>
            </select>

            {isFiltered && (
              <button
                onClick={resetFilters}
                className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 font-semibold p-2"
                title="Reset filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Class Categories */}
        <div className="pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-emerald-700" /> Class Category:
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {filteredStudents.length} Students Shown
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            <button
              onClick={() => setSelectedClass('All')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedClass === 'All'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Classes ({students.length})
            </button>

            {ALL_CLASSES.map((cls) => {
              const count = students.filter((s) => s.class === cls).length;
              return (
                <button
                  key={cls}
                  onClick={() => setSelectedClass(cls)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                    selectedClass === cls
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>{cls}</span>
                  <span
                    className={`text-[10px] font-mono px-1 rounded ${
                      selectedClass === cls ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section Sub-categories */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">
              Section Sub-category:
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setSelectedSection('All')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                  selectedSection === 'All'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Sections
              </button>
              {ALL_SECTIONS.map((sec) => (
                <button
                  key={sec}
                  onClick={() => setSelectedSection(sec)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                    selectedSection === sec
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Section {sec}
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs text-slate-500">
            Selected: <strong className="text-emerald-800">{selectedClass}</strong> &bull;{' '}
            <strong className="text-slate-800">{selectedSection === 'All' ? 'All Sections' : `Sec ${selectedSection}`}</strong>
          </div>
        </div>
      </div>

      {/* Roster Cards */}
      {filteredStudents.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200/80 text-center text-xs text-slate-400 space-y-2">
          <p>No students found for this search and filter criteria.</p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredStudents.map((st) => {
            const att = getStudentAttendance(st);
            return (
              <div
                key={st.id}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex items-center justify-between text-xs hover:border-emerald-200 transition"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={st.photoUrl}
                    alt={st.fullName}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-2xs"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900">{st.fullName}</h4>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                        {st.class} - {st.section}
                      </span>
                    </div>
                    <p className="text-slate-500 font-mono text-[11px] mt-0.5">
                      Roll #{st.rollNumber} &bull; {st.studentIdNumber}
                    </p>
                    <p className="text-slate-600 text-[11px] mt-0.5">
                      Parent: {st.parentName} (<span className="font-mono">{st.parentPhone}</span>)
                    </p>
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[10px] font-bold border ${att.badgeClass}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${att.dotClass}`}></span>
                    {att.label}
                  </span>
                  <span className="text-[11px] text-amber-700 font-semibold block">
                    {st.busId === 'bus_003' ? 'Bus 03' : st.busId === 'bus_001' ? 'Bus 01' : 'Bus 02'}
                  </span>
                  <span className="text-[10px] text-slate-400 block truncate max-w-[120px]">
                    {st.pickupPointName}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
