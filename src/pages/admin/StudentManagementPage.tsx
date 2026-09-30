import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Users,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  MapPin,
  Bus,
  Phone,
  CheckCircle2,
  X,
  ChevronRight,
  Eye,
  GraduationCap,
  LayoutGrid,
  List,
  Sparkles,
  ArrowRightLeft,
  School as SchoolIcon,
  Table as TableIcon,
  ShieldCheck,
  UserCheck,
  CalendarCheck,
  UserX,
  Clock,
  RotateCcw,
  Printer,
} from 'lucide-react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { Student } from '../../types';
import { PrintStudentListModal } from '../../components/admin/PrintStudentListModal';

export const ALL_CLASSES = [
  'Playgroup',
  'Nursery',
  'LKG',
  'UKG',
  'Class 1',
  'Class 2',
  'Class 3',
  'Class 4',
  'Class 5',
  'Class 6',
  'Class 7',
  'Class 8',
  'Class 9',
  'Class 10',
] as const;

export const ALL_SECTIONS = ['A', 'B', 'C', 'D'] as const;

export type AttendanceFilterType = 'All' | 'Present' | 'Absent' | 'Leave' | 'Transport_Skip';

export const StudentManagementPage: React.FC = () => {
  const {
    students,
    addStudent,
    updateStudent,
    deleteStudent,
    buses,
    attendanceRecords,
    leaveRequests,
    markAttendance,
    school,
  } = useSchoolData();

  // Search & Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClassCategory, setSelectedClassCategory] = useState<string>('All');
  const [selectedSectionSubCategory, setSelectedSectionSubCategory] = useState<string>('All');
  const [attendanceFilter, setAttendanceFilter] = useState<AttendanceFilterType>('All');
  const [busFilter, setBusFilter] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'table' | 'grouped' | 'matrix'>('table');
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Input ref for keyboard quick focus (/ or Ctrl+K / Cmd+K)
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === '/' || (e.ctrlKey && e.key.toLowerCase() === 'k') || (e.metaKey && e.key.toLowerCase() === 'k')) &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA' &&
        document.activeElement?.tagName !== 'SELECT'
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [transferringStudent, setTransferringStudent] = useState<Student | null>(null);
  const [transferTargetSection, setTransferTargetSection] = useState('B');

  // Form states for Add / Edit
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [studentClass, setStudentClass] = useState('LKG');
  const [section, setSection] = useState('A');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [rollNumber, setRollNumber] = useState(1);
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('+91 98311 ');
  const [address, setAddress] = useState('Chandannagar');
  const [pickupPoint, setPickupPoint] = useState('Jyoti More');
  const [pickupLat, setPickupLat] = useState(22.8605);
  const [pickupLng, setPickupLng] = useState(88.3565);
  const [assignedBus, setAssignedBus] = useState('bus_003');

  // Helper: Resolve today's attendance status for a student
  const getStudentAttendance = (student: Student) => {
    // 1. Check leave requests
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
          remarks: activeLeave.reason,
        };
      }
      return {
        status: 'Leave' as AttendanceFilterType,
        label: 'On Leave',
        badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
        dotClass: 'bg-amber-500',
        remarks: activeLeave.reason,
      };
    }

    // 2. Check today's attendance record (date 2026-09-30)
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
          time: todayRec.markedAt,
        };
      }
      if (todayRec.status === 'Absent') {
        return {
          status: 'Absent' as AttendanceFilterType,
          label: 'Absent',
          badgeClass: 'bg-rose-50 text-rose-800 border-rose-200',
          dotClass: 'bg-rose-500',
          remarks: todayRec.remarks || 'Absent today',
        };
      }
      if (todayRec.status === 'Leave') {
        return {
          status: 'Leave' as AttendanceFilterType,
          label: 'On Leave',
          badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
          dotClass: 'bg-amber-500',
          remarks: todayRec.remarks,
        };
      }
    }

    // 3. Fallback based on transport status
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

    // Default to Present
    return {
      status: 'Present' as AttendanceFilterType,
      label: 'Present',
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      dotClass: 'bg-emerald-500',
      time: '08:40 AM',
    };
  };

  // Filter pipeline
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      // Search matching: name, student ID, roll number, parent, phone, stop
      const q = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !q ||
        s.fullName.toLowerCase().includes(q) ||
        s.studentIdNumber.toLowerCase().includes(q) ||
        String(s.rollNumber).includes(q) ||
        s.parentName.toLowerCase().includes(q) ||
        s.parentPhone.toLowerCase().includes(q) ||
        s.pickupPointName.toLowerCase().includes(q);

      // Grade / Class Filter
      const matchesClass =
        selectedClassCategory === 'All' || s.class === selectedClassCategory;

      // Section Filter
      const matchesSection =
        selectedSectionSubCategory === 'All' || s.section === selectedSectionSubCategory;

      // Bus Filter
      const matchesBus = busFilter === 'All' || s.busId === busFilter;

      // Attendance Filter
      const attInfo = getStudentAttendance(s);
      const matchesAttendance =
        attendanceFilter === 'All' || attInfo.status === attendanceFilter;

      return matchesSearch && matchesClass && matchesSection && matchesBus && matchesAttendance;
    });
  }, [
    students,
    searchTerm,
    selectedClassCategory,
    selectedSectionSubCategory,
    busFilter,
    attendanceFilter,
    attendanceRecords,
    leaveRequests,
  ]);

  // Aggregate stats for current visible selection
  const attendanceBreakdown = useMemo(() => {
    let present = 0;
    let absent = 0;
    let leave = 0;
    let transportSkip = 0;

    students.forEach((s) => {
      const att = getStudentAttendance(s);
      if (att.status === 'Present') present++;
      else if (att.status === 'Absent') absent++;
      else if (att.status === 'Leave') leave++;
      else if (att.status === 'Transport_Skip') transportSkip++;
    });

    return { present, absent, leave, transportSkip, total: students.length };
  }, [students, attendanceRecords, leaveRequests]);

  // Student counts per Class Category
  const classCountMap = useMemo(() => {
    const map: Record<string, number> = {};
    ALL_CLASSES.forEach((c) => {
      map[c] = students.filter((s) => s.class === c).length;
    });
    return map;
  }, [students]);

  // Student counts per Section Sub-category (context-aware of selected class)
  const sectionCountMap = useMemo(() => {
    const map: Record<string, number> = {};
    ALL_SECTIONS.forEach((sec) => {
      map[sec] = students.filter((s) => {
        const classMatch =
          selectedClassCategory === 'All' || s.class === selectedClassCategory;
        return classMatch && s.section === sec;
      }).length;
    });
    return map;
  }, [students, selectedClassCategory]);

  const handleOpenAddModal = () => {
    setEditingStudent(null);
    setFirstName('');
    setLastName('');
    setStudentClass(selectedClassCategory !== 'All' ? selectedClassCategory : 'LKG');
    setSection(selectedSectionSubCategory !== 'All' ? selectedSectionSubCategory : 'A');
    setGender('Male');
    setRollNumber(students.length + 1);
    setParentName('');
    setParentPhone('+91 98311 ');
    setAddress('Chandannagar');
    setPickupPoint('Jyoti More');
    setPickupLat(22.8605);
    setPickupLng(88.3565);
    setAssignedBus('bus_003');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (st: Student) => {
    setEditingStudent(st);
    setFirstName(st.firstName);
    setLastName(st.lastName);
    setStudentClass(st.class);
    setSection(st.section);
    setGender(st.gender || 'Male');
    setRollNumber(st.rollNumber);
    setParentName(st.parentName);
    setParentPhone(st.parentPhone);
    setAddress(st.address);
    setPickupPoint(st.pickupPointName);
    setPickupLat(st.pickupLatitude);
    setPickupLng(st.pickupLongitude);
    setAssignedBus(st.busId);
    setIsModalOpen(true);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingStudent) {
      updateStudent(editingStudent.id, {
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`,
        class: studentClass,
        section,
        gender,
        rollNumber: Number(rollNumber),
        parentName,
        parentPhone,
        address,
        pickupPointName: pickupPoint,
        pickupLatitude: Number(pickupLat),
        pickupLongitude: Number(pickupLng),
        dropPointName: pickupPoint,
        dropLatitude: Number(pickupLat),
        dropLongitude: Number(pickupLng),
        busId: assignedBus,
      });
    } else {
      const studentIdNum = `STU-2026-${String(students.length + 1).padStart(4, '0')}`;
      addStudent({
        studentIdNumber: studentIdNum,
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`,
        dob: '2020-05-10',
        gender,
        class: studentClass,
        section,
        rollNumber: Number(rollNumber),
        photoUrl:
          gender === 'Female'
            ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200&q=80'
            : 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80',
        parentId: `parent_${Date.now()}`,
        parentName,
        parentPhone,
        address,
        busId: assignedBus,
        routeId:
          assignedBus === 'bus_003'
            ? 'route_001'
            : assignedBus === 'bus_001'
            ? 'route_002'
            : 'route_003',
        pickupStopId: 'stop_02',
        pickupPointName: pickupPoint,
        pickupLatitude: Number(pickupLat),
        pickupLongitude: Number(pickupLng),
        pickupRadius: 100,
        dropStopId: 'stop_02',
        dropPointName: pickupPoint,
        dropLatitude: Number(pickupLat),
        dropLongitude: Number(pickupLng),
        dropRadius: 100,
        emergencyContact: parentPhone,
        emergencyRelation: 'Parent',
        status: 'Active',
      });
    }

    setIsModalOpen(false);
  };

  const handleExecuteTransfer = () => {
    if (transferringStudent) {
      updateStudent(transferringStudent.id, {
        section: transferTargetSection,
      });
      setTransferringStudent(null);
    }
  };

  const handleToggleAttendance = (student: Student) => {
    const currentAtt = getStudentAttendance(student);
    let nextStatus: 'Present' | 'Absent' | 'Leave' = 'Present';

    if (currentAtt.status === 'Present') nextStatus = 'Absent';
    else if (currentAtt.status === 'Absent') nextStatus = 'Leave';
    else nextStatus = 'Present';

    markAttendance(
      student.id,
      '2026-09-30',
      nextStatus,
      nextStatus === 'Absent' ? 'Marked absent by administrator' : undefined
    );
  };

  const resetAllFilters = () => {
    setSearchTerm('');
    setSelectedClassCategory('All');
    setSelectedSectionSubCategory('All');
    setAttendanceFilter('All');
    setBusFilter('All');
  };

  const isAnyFilterActive =
    Boolean(searchTerm) ||
    selectedClassCategory !== 'All' ||
    selectedSectionSubCategory !== 'All' ||
    attendanceFilter !== 'All' ||
    busFilter !== 'All';

  // Distinct classes present in filtered list
  const distinctClasses = Array.from(new Set(filteredStudents.map((s) => s.class)));

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Administration</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="font-semibold text-emerald-700">Student Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Student Management Roster
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse and filter students by grade, section, or attendance status for faster data lookup
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                viewMode === 'table'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Table</span>
            </button>
            <button
              onClick={() => setViewMode('grouped')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                viewMode === 'grouped'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Category Cards View"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Cards</span>
            </button>
            <button
              onClick={() => setViewMode('matrix')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                viewMode === 'matrix'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Class & Section Matrix"
            >
              <TableIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Matrix</span>
            </button>
          </div>

          {/* Print Student List Button */}
          <button
            onClick={() => setIsPrintModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-100 font-semibold text-xs rounded-xl shadow-xs transition border border-slate-700 cursor-pointer"
            title="Open print-friendly view of the currently filtered table data"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Print Student List</span>
            <span className="sm:hidden">Print List</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-700 text-slate-300 font-mono">
              {filteredStudents.length}
            </span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Student
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SEARCH BAR & FILTER DROPDOWNS TOOLBAR (FASTER DATA LOOKUP)      */}
      {/* ============================================================== */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-4">
        {/* Top Row: Search Input & Quick Status Counts */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Main Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by student name, ID (e.g. STU-2026-0012), roll number, parent, or pickup stop..."
              className="w-full pl-10 pr-24 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-100 transition placeholder:text-slate-400"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <kbd className="hidden sm:inline-flex items-center text-[10px] text-slate-400 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded font-mono font-medium" title="Press / to search">
                /
              </kbd>
            </div>
          </div>

          {/* Quick Attendance Stats Tickers (Clickable to filter instantly) */}
          <div className="flex items-center gap-1.5 flex-wrap text-xs">
            <button
              onClick={() => setAttendanceFilter('All')}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
                attendanceFilter === 'All'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              title="Show All Attendance"
            >
              <span>Total</span>
              <span className="font-mono text-[11px] font-bold">
                {attendanceBreakdown.total}
              </span>
            </button>

            <button
              onClick={() => setAttendanceFilter('Present')}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 border ${
                attendanceFilter === 'Present'
                  ? 'bg-emerald-800 text-white border-emerald-800'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
              }`}
              title="Filter Present Students"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>Present</span>
              <span className="font-mono text-[11px] font-bold">
                {attendanceBreakdown.present}
              </span>
            </button>

            <button
              onClick={() => setAttendanceFilter('Absent')}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 border ${
                attendanceFilter === 'Absent'
                  ? 'bg-rose-800 text-white border-rose-800'
                  : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
              }`}
              title="Filter Absent Students"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              <span>Absent</span>
              <span className="font-mono text-[11px] font-bold">
                {attendanceBreakdown.absent}
              </span>
            </button>

            <button
              onClick={() => setAttendanceFilter('Leave')}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 border ${
                attendanceFilter === 'Leave'
                  ? 'bg-amber-800 text-white border-amber-800'
                  : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
              }`}
              title="Filter On Leave"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              <span>Leave</span>
              <span className="font-mono text-[11px] font-bold">
                {attendanceBreakdown.leave}
              </span>
            </button>

            <button
              onClick={() => setAttendanceFilter('Transport_Skip')}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 border ${
                attendanceFilter === 'Transport_Skip'
                  ? 'bg-sky-800 text-white border-sky-800'
                  : 'bg-sky-50 text-sky-800 border-sky-200 hover:bg-sky-100'
              }`}
              title="Filter Bus Skipped"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
              <span>Bus Skip</span>
              <span className="font-mono text-[11px] font-bold">
                {attendanceBreakdown.transportSkip}
              </span>
            </button>
          </div>
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* 1. Grade / Class Dropdown */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-emerald-700" />
              <span>Grade / Class</span>
            </label>
            <div className="relative">
              <select
                value={selectedClassCategory}
                onChange={(e) => {
                  setSelectedClassCategory(e.target.value);
                  setSelectedSectionSubCategory('All');
                }}
                className={`w-full px-3 py-2 text-xs rounded-xl border font-medium focus:outline-none focus:ring-1 cursor-pointer transition ${
                  selectedClassCategory !== 'All'
                    ? 'border-emerald-600 bg-emerald-50/50 text-emerald-950 font-semibold focus:border-emerald-700 focus:ring-emerald-200'
                    : 'border-slate-200 bg-white text-slate-800 focus:border-emerald-600 focus:ring-emerald-100'
                }`}
              >
                <option value="All">All Grades & Classes ({students.length} students)</option>
                {ALL_CLASSES.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls} ({classCountMap[cls] || 0} students)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 2. Section Dropdown */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
              <LayoutGrid className="w-3.5 h-3.5 text-emerald-700" />
              <span>Section Sub-category</span>
            </label>
            <div className="relative">
              <select
                value={selectedSectionSubCategory}
                onChange={(e) => setSelectedSectionSubCategory(e.target.value)}
                className={`w-full px-3 py-2 text-xs rounded-xl border font-medium focus:outline-none focus:ring-1 cursor-pointer transition ${
                  selectedSectionSubCategory !== 'All'
                    ? 'border-emerald-600 bg-emerald-50/50 text-emerald-950 font-semibold focus:border-emerald-700 focus:ring-emerald-200'
                    : 'border-slate-200 bg-white text-slate-800 focus:border-emerald-600 focus:ring-emerald-100'
                }`}
              >
                <option value="All">All Sections (A, B, C, D)</option>
                {ALL_SECTIONS.map((sec) => (
                  <option key={sec} value={sec}>
                    Section {sec} ({sectionCountMap[sec] || 0} students)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 3. Attendance Status Dropdown */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>Attendance Status</span>
            </label>
            <div className="relative">
              <select
                value={attendanceFilter}
                onChange={(e) => setAttendanceFilter(e.target.value as AttendanceFilterType)}
                className={`w-full px-3 py-2 text-xs rounded-xl border font-medium focus:outline-none focus:ring-1 cursor-pointer transition ${
                  attendanceFilter !== 'All'
                    ? 'border-emerald-600 bg-emerald-50/50 text-emerald-950 font-semibold focus:border-emerald-700 focus:ring-emerald-200'
                    : 'border-slate-200 bg-white text-slate-800 focus:border-emerald-600 focus:ring-emerald-100'
                }`}
              >
                <option value="All">All Attendance ({attendanceBreakdown.total} students)</option>
                <option value="Present">Present Today ({attendanceBreakdown.present} students)</option>
                <option value="Absent">Absent Today ({attendanceBreakdown.absent} students)</option>
                <option value="Leave">On Leave ({attendanceBreakdown.leave} students)</option>
                <option value="Transport_Skip">Bus Transport Skipped ({attendanceBreakdown.transportSkip} students)</option>
              </select>
            </div>
          </div>

          {/* 4. Transport Bus Route Dropdown */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
              <Bus className="w-3.5 h-3.5 text-emerald-700" />
              <span>Transport Route</span>
            </label>
            <div className="relative">
              <select
                value={busFilter}
                onChange={(e) => setBusFilter(e.target.value)}
                className={`w-full px-3 py-2 text-xs rounded-xl border font-medium focus:outline-none focus:ring-1 cursor-pointer transition ${
                  busFilter !== 'All'
                    ? 'border-emerald-600 bg-emerald-50/50 text-emerald-950 font-semibold focus:border-emerald-700 focus:ring-emerald-200'
                    : 'border-slate-200 bg-white text-slate-800 focus:border-emerald-600 focus:ring-emerald-100'
                }`}
              >
                <option value="All">All Transport Routes</option>
                <option value="bus_003">Bus 03 (Route A - Station & Jyoti More)</option>
                <option value="bus_001">Bus 01 (Route B - Mankundu & Bhadreswar)</option>
                <option value="bus_002">Bus 02 (Route C - Chinsurah Court)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filter Summary & Active Filter Tags */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-2 text-slate-500">
            <span>Showing:</span>
            <strong className="text-slate-900 font-mono">{filteredStudents.length}</strong>
            <span>of</span>
            <span className="font-mono text-slate-600">{students.length} total students</span>

            {isAnyFilterActive && (
              <div className="flex flex-wrap items-center gap-1.5 ml-1">
                {searchTerm && (
                  <span className="inline-flex items-center gap-1 text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium border border-slate-200">
                    Query: "{searchTerm}"
                    <button onClick={() => setSearchTerm('')} className="hover:text-slate-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedClassCategory !== 'All' && (
                  <span className="inline-flex items-center gap-1 text-[11px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md font-medium border border-emerald-200">
                    Grade: {selectedClassCategory}
                    <button onClick={() => setSelectedClassCategory('All')} className="hover:text-emerald-950">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedSectionSubCategory !== 'All' && (
                  <span className="inline-flex items-center gap-1 text-[11px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md font-medium border border-emerald-200">
                    Section: {selectedSectionSubCategory}
                    <button onClick={() => setSelectedSectionSubCategory('All')} className="hover:text-emerald-950">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {attendanceFilter !== 'All' && (
                  <span className="inline-flex items-center gap-1 text-[11px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md font-medium border border-amber-200">
                    Attendance: {attendanceFilter.replace('_', ' ')}
                    <button onClick={() => setAttendanceFilter('All')} className="hover:text-amber-950">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {busFilter !== 'All' && (
                  <span className="inline-flex items-center gap-1 text-[11px] bg-sky-50 text-sky-800 px-2 py-0.5 rounded-md font-medium border border-sky-200">
                    Route: {busFilter}
                    <button onClick={() => setBusFilter('All')} className="hover:text-sky-950">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>

          {isAnyFilterActive && (
            <button
              onClick={resetAllFilters}
              className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 font-semibold hover:underline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset all search & filters
            </button>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. CLASS CATEGORIES & SECTION SUB-CATEGORIES BAR               */}
      {/* ============================================================== */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <GraduationCap className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-slate-800 tracking-wide uppercase">
              Class Grade Categories:
            </span>
            <span className="text-[11px] text-slate-400">
              (Quick segmented tabs)
            </span>
          </div>
        </div>

        {/* Scrollable Class Category Segmented Control */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          <button
            onClick={() => {
              setSelectedClassCategory('All');
              setSelectedSectionSubCategory('All');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 ${
              selectedClassCategory === 'All'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            <span>All Classes</span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                selectedClassCategory === 'All'
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {students.length}
            </span>
          </button>

          {ALL_CLASSES.map((cls) => {
            const count = classCountMap[cls] || 0;
            const isSelected = selectedClassCategory === cls;

            return (
              <button
                key={cls}
                onClick={() => {
                  setSelectedClassCategory(cls);
                  setSelectedSectionSubCategory('All');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <span>{cls}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Section Sub-categories Row */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">
              Section Sub-category:
            </span>

            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => setSelectedSectionSubCategory('All')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                  selectedSectionSubCategory === 'All'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Sections
              </button>

              {ALL_SECTIONS.map((sec) => {
                const count = sectionCountMap[sec] || 0;
                const isSelected = selectedSectionSubCategory === sec;

                return (
                  <button
                    key={sec}
                    onClick={() => setSelectedSectionSubCategory(sec)}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <span>Section {sec}</span>
                    <span
                      className={`text-[10px] font-mono px-1 rounded ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="text-xs text-slate-500">
            Active Filter: <strong className="text-emerald-800">{selectedClassCategory}</strong> &bull;{' '}
            <strong className="text-slate-800">
              {selectedSectionSubCategory === 'All' ? 'All Sections' : `Sec ${selectedSectionSubCategory}`}
            </strong>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. STUDENTS PRESENTATION (TABLE / GROUPED / MATRIX VIEW)       */}
      {/* ============================================================== */}
      {filteredStudents.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200/80 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-base">No matching students found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No students currently match your search and filter criteria. Try resetting filters or adding a student.
          </p>
          <div className="flex items-center justify-center gap-2 pt-1">
            <button
              onClick={resetAllFilters}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
            >
              Reset Filters
            </button>
            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold transition"
            >
              Add Student
            </button>
          </div>
        </div>
      ) : viewMode === 'table' ? (
        /* TABLE VIEW (TABULAR LEDGER) */
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          {/* Table Header Action Bar */}
          <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between gap-3 bg-slate-50/60">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800">
                Filtered Student Records
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-200 font-mono font-bold text-slate-700">
                {filteredStudents.length} of {students.length}
              </span>
            </div>
            <button
              onClick={() => setIsPrintModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 shadow-2xs transition cursor-pointer"
              title="Print filtered table data"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-600" />
              <span>Print Table Data</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase border-b border-slate-200">
                <tr>
                  <th className="p-4">Student</th>
                  <th className="p-4">Grade & Section</th>
                  <th className="p-4">Today's Attendance</th>
                  <th className="p-4">Parent Guardian</th>
                  <th className="p-4">Transport & Stop</th>
                  <th className="p-4 text-center">Safety Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredStudents.map((st) => {
                  const att = getStudentAttendance(st);

                  return (
                    <tr key={st.id} className="hover:bg-slate-50/70 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={st.photoUrl}
                            alt={st.fullName}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                          />
                          <div>
                            <h4 className="font-bold text-sm text-slate-900">{st.fullName}</h4>
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                              <span className="font-mono">{st.studentIdNumber}</span>
                              <span aria-hidden="true">&bull;</span>
                              <span>{st.gender}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Grade & Section */}
                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setSelectedClassCategory(st.class)}
                            className="font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-lg border border-emerald-100 transition"
                            title="Filter this grade"
                          >
                            {st.class}
                          </button>
                          <span className="font-semibold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                            Sec {st.section}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            #{st.rollNumber}
                          </span>
                        </div>
                      </td>

                      {/* Today's Attendance Status */}
                      <td className="p-4">
                        <button
                          onClick={() => handleToggleAttendance(st)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition ${att.badgeClass} hover:opacity-80`}
                          title="Click to toggle attendance status"
                        >
                          <span className={`w-2 h-2 rounded-full ${att.dotClass}`}></span>
                          <span>{att.label}</span>
                          {att.time && (
                            <span className="text-[10px] opacity-75 font-mono">({att.time})</span>
                          )}
                        </button>
                        {att.remarks && (
                          <span className="block text-[10px] text-slate-400 truncate max-w-[140px] mt-0.5">
                            {att.remarks}
                          </span>
                        )}
                      </td>

                      <td className="p-4">
                        <span className="font-semibold text-slate-900 block">{st.parentName}</span>
                        <span className="font-mono text-slate-500 text-[11px]">{st.parentPhone}</span>
                      </td>

                      <td className="p-4">
                        <span className="font-semibold text-slate-800 block truncate max-w-[150px]">
                          {st.pickupPointName}
                        </span>
                        <span className="text-[11px] text-amber-700 font-medium">
                          {st.busId === 'bus_003'
                            ? 'Bus 03 (Route A)'
                            : st.busId === 'bus_001'
                            ? 'Bus 01 (Route B)'
                            : 'Bus 02 (Route C)'}
                        </span>
                      </td>

                      <td className="p-4 text-center">
                        <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-100">
                          {st.status}
                        </span>
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setViewingStudent(st)}
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition"
                            title="View Dossier"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setTransferringStudent(st);
                              setTransferTargetSection(st.section === 'A' ? 'B' : 'A');
                            }}
                            className="p-1.5 hover:bg-amber-50 rounded-lg text-amber-700 hover:text-amber-800 transition"
                            title="Move / Transfer Section"
                          >
                            <ArrowRightLeft className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(st)}
                            className="p-1.5 hover:bg-emerald-50 rounded-lg text-emerald-700 hover:text-emerald-800 transition"
                            title="Edit Details"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Remove student record for ${st.fullName}?`)) {
                                deleteStudent(st.id);
                              }
                            }}
                            className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 hover:text-red-700 transition"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : viewMode === 'grouped' ? (
        /* HIERARCHICAL GROUPED VIEW (Class Category -> Section Sub-categories) */
        <div className="space-y-6">
          {distinctClasses.map((cls) => {
            const classStudents = filteredStudents.filter((s) => s.class === cls);
            const distinctSections = Array.from(new Set(classStudents.map((s) => s.section))).sort();

            return (
              <div
                key={cls}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5"
              >
                {/* Category Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-base border border-emerald-100">
                      {cls.slice(0, 2)}
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-slate-900">
                        Class Grade: {cls}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {classStudents.length} Students across {distinctSections.length} Sections
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedClassCategory(cls);
                        setSelectedSectionSubCategory('All');
                      }}
                      className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold px-3 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 transition"
                    >
                      Focus this Grade
                    </button>
                  </div>
                </div>

                {/* Sub-categories: Section Blocks */}
                <div className="space-y-4">
                  {distinctSections.map((sec) => {
                    const sectionStudents = classStudents.filter((s) => s.section === sec);

                    return (
                      <div
                        key={sec}
                        className="bg-slate-50/70 p-4 rounded-2xl border border-slate-100 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">
                              Section {sec} Sub-category
                            </span>
                            <span className="text-[11px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                              {sectionStudents.length} Students
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500">
                            Grade: <strong>{cls}</strong>
                          </span>
                        </div>

                        {/* Student Cards in Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {sectionStudents.map((st) => {
                            const att = getStudentAttendance(st);

                            return (
                              <div
                                key={st.id}
                                className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between text-xs hover:border-emerald-300 transition space-y-2"
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex items-center gap-2.5">
                                    <img
                                      src={st.photoUrl}
                                      alt={st.fullName}
                                      className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                                    />
                                    <div>
                                      <h4 className="font-bold text-slate-900 leading-tight">
                                        {st.fullName}
                                      </h4>
                                      <p className="text-[11px] text-slate-500 mt-0.5">
                                        Roll <span className="font-mono">{st.rollNumber}</span> &bull; {st.pickupPointName}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() => setViewingStudent(st)}
                                      className="p-1 hover:bg-slate-100 rounded text-slate-500"
                                      title="View"
                                    >
                                      <Eye className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleOpenEditModal(st)}
                                      className="p-1 hover:bg-emerald-50 rounded text-emerald-700"
                                      title="Edit"
                                    >
                                      <Edit className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>

                                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                                  <span
                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${att.badgeClass}`}
                                  >
                                    <span className={`w-1.5 h-1.5 rounded-full ${att.dotClass}`}></span>
                                    <span>{att.label}</span>
                                  </span>
                                  <span className="text-amber-700 font-semibold font-mono text-[10px]">
                                    {st.busId === 'bus_003' ? 'Bus 03' : st.busId === 'bus_001' ? 'Bus 01' : 'Bus 02'}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* MATRIX DISTRIBUTION VIEW (Quick Grid of Class vs Section) */
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-base text-slate-900">
                School-Wide Class & Section Matrix
              </h3>
              <p className="text-xs text-slate-500">
                Click any cell to immediately filter that specific Grade and Section
              </p>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              14 Classes &bull; 4 Sections
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-600 uppercase border-b border-slate-200">
                <tr>
                  <th className="p-3">Grade / Class</th>
                  {ALL_SECTIONS.map((sec) => (
                    <th key={sec} className="p-3 text-center">
                      Section {sec}
                    </th>
                  ))}
                  <th className="p-3 text-right">Class Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ALL_CLASSES.map((cls) => {
                  const classTotal = students.filter((s) => s.class === cls).length;

                  return (
                    <tr key={cls} className="hover:bg-slate-50/80 transition">
                      <td className="p-3 font-semibold text-slate-900">
                        <button
                          onClick={() => {
                            setSelectedClassCategory(cls);
                            setSelectedSectionSubCategory('All');
                            setViewMode('table');
                          }}
                          className="hover:text-emerald-700 transition"
                        >
                          {cls}
                        </button>
                      </td>

                      {ALL_SECTIONS.map((sec) => {
                        const secCount = students.filter(
                          (s) => s.class === cls && s.section === sec
                        ).length;

                        return (
                          <td key={sec} className="p-3 text-center">
                            <button
                              onClick={() => {
                                setSelectedClassCategory(cls);
                                setSelectedSectionSubCategory(sec);
                                setViewMode('table');
                              }}
                              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition ${
                                secCount > 0
                                  ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-100'
                                  : 'text-slate-300 hover:text-slate-500'
                              }`}
                            >
                              {secCount}
                            </button>
                          </td>
                        );
                      })}

                      <td className="p-3 text-right font-mono font-bold text-slate-800">
                        {classTotal}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. MODALS: ADD / EDIT / TRANSFER / DOSSIER                     */}
      {/* ============================================================== */}

      {/* Add / Edit Student Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden">
            <div className="bg-emerald-900 px-6 py-4 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">
                  {editingStudent ? 'Edit Student Profile' : 'Add New Student'}
                </h3>
                <p className="text-[11px] text-emerald-200">
                  Configure class category, section subcategory, and transport assignment
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleSaveStudent}
              className="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              {/* Class Category and Section Sub-category selectors */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Grade / Class
                  </label>
                  <select
                    value={studentClass}
                    onChange={(e) => setStudentClass(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-emerald-600 bg-white"
                  >
                    {ALL_CLASSES.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Section Sub-category
                  </label>
                  <select
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-emerald-600 bg-white"
                  >
                    {ALL_SECTIONS.map((sec) => (
                      <option key={sec} value={sec}>
                        Section {sec}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Roll Number</label>
                  <input
                    type="number"
                    required
                    value={rollNumber}
                    onChange={(e) => setRollNumber(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'Male' | 'Female' | 'Other')}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Parent Mobile</label>
                  <input
                    type="text"
                    required
                    value={parentPhone}
                    onChange={(e) => setParentPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Parent Guardian Name</label>
                <input
                  type="text"
                  required
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Residential Address</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              {/* Transport & Geofence stop */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-3">
                <span className="font-bold text-xs text-emerald-900 block">
                  Transport & Geofence Pickup Point
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Pickup Stop Name</label>
                    <input
                      type="text"
                      required
                      value={pickupPoint}
                      onChange={(e) => setPickupPoint(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Assigned Bus</label>
                    <select
                      value={assignedBus}
                      onChange={(e) => setAssignedBus(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                    >
                      <option value="bus_003">Bus 03 (Route A)</option>
                      <option value="bus_001">Bus 01 (Route B)</option>
                      <option value="bus_002">Bus 02 (Route C)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Pickup Latitude</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={pickupLat}
                      onChange={(e) => setPickupLat(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Pickup Longitude</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={pickupLng}
                      onChange={(e) => setPickupLng(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl shadow-xs transition"
                >
                  {editingStudent ? 'Save Updates' : 'Create Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Section Transfer Modal */}
      {transferringStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl border border-slate-100 p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Transfer Section</h3>
              <button
                onClick={() => setTransferringStudent(null)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-slate-600">
              Transfer student <strong>{transferringStudent.fullName}</strong> ({transferringStudent.class}) from{' '}
              <strong>Section {transferringStudent.section}</strong> to:
            </p>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Target Section Sub-category
              </label>
              <div className="grid grid-cols-4 gap-2">
                {ALL_SECTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setTransferTargetSection(s)}
                    className={`py-2 text-center rounded-xl font-bold transition ${
                      transferTargetSection === s
                        ? 'bg-emerald-800 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Section {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setTransferringStudent(null)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 font-semibold text-slate-700 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteTransfer}
                className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 font-semibold text-white rounded-xl shadow-xs"
              >
                Confirm Transfer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Student Dossier */}
      {viewingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Student Profile Dossier</h3>
              <button
                onClick={() => setViewingStudent(null)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <img
                src={viewingStudent.photoUrl}
                alt={viewingStudent.fullName}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-200 shadow-xs"
              />
              <div>
                <h4 className="font-bold text-base text-slate-900">{viewingStudent.fullName}</h4>
                <p className="text-slate-500 font-mono text-[11px]">{viewingStudent.studentIdNumber}</p>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-[11px] border border-emerald-100">
                    {viewingStudent.class}
                  </span>
                  <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                    Section {viewingStudent.section} &bull; Roll {viewingStudent.rollNumber}
                  </span>
                  {(() => {
                    const att = getStudentAttendance(viewingStudent);
                    return (
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${att.badgeClass}`}>
                        {att.label}
                      </span>
                    );
                  })()}
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 text-slate-600">
              <div className="flex justify-between">
                <span>Parent Name:</span>
                <strong className="text-slate-900">{viewingStudent.parentName}</strong>
              </div>
              <div className="flex justify-between">
                <span>Parent Phone:</span>
                <span className="font-mono text-slate-900">{viewingStudent.parentPhone}</span>
              </div>
              <div className="flex justify-between">
                <span>Residential Address:</span>
                <span className="text-right text-slate-900 max-w-[200px] truncate">{viewingStudent.address}</span>
              </div>
              <div className="flex justify-between">
                <span>Assigned Stop:</span>
                <strong className="text-slate-900">{viewingStudent.pickupPointName}</strong>
              </div>
              <div className="flex justify-between">
                <span>Transport Vehicle:</span>
                <span className="text-amber-700 font-semibold">
                  {viewingStudent.busId === 'bus_003' ? 'Bus 03 (Route A)' : viewingStudent.busId === 'bus_001' ? 'Bus 01 (Route B)' : 'Bus 02 (Route C)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>GPS Coordinates:</span>
                <span className="font-mono text-slate-500">
                  {viewingStudent.pickupLatitude.toFixed(4)}, {viewingStudent.pickupLongitude.toFixed(4)}
                </span>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => {
                  handleToggleAttendance(viewingStudent);
                }}
                className="flex-1 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold rounded-xl border border-emerald-200 transition"
              >
                Toggle Attendance Status
              </button>
              <button
                onClick={() => setViewingStudent(null)}
                className="py-2 px-4 bg-slate-100 hover:bg-slate-200 font-semibold text-slate-700 rounded-xl transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Print-Friendly Table View Modal */}
      <PrintStudentListModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        students={filteredStudents}
        totalSchoolStudentsCount={students.length}
        schoolName={school.name}
        filters={{
          searchTerm,
          classCategory: selectedClassCategory,
          sectionSubCategory: selectedSectionSubCategory,
          attendanceFilter,
          busFilter,
        }}
        getStudentAttendance={getStudentAttendance}
      />
    </div>
  );
};
