import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  School,
  Student,
  Bus,
  DriverProfile,
  Route,
  FeeInvoice,
  HomeworkItem,
  ExamRoutineItem,
  SchoolNotice,
  LeaveRequest,
  SchoolActivity,
  ReportCard,
  AttendanceRecord,
  TransportStatus,
} from '../types';
import {
  INITIAL_SCHOOL,
  INITIAL_STUDENTS,
  INITIAL_BUSES,
  INITIAL_DRIVERS,
  INITIAL_ROUTES,
  INITIAL_FEES,
  INITIAL_HOMEWORK,
  INITIAL_EXAMS,
  INITIAL_NOTICES,
  INITIAL_LEAVE_REQUESTS,
  INITIAL_ACTIVITIES,
  INITIAL_REPORT_CARD,
  INITIAL_ATTENDANCE,
} from '../data/mockData';

interface SchoolDataContextType {
  school: School;
  students: Student[];
  buses: Bus[];
  drivers: DriverProfile[];
  routes: Route[];
  fees: FeeInvoice[];
  homework: HomeworkItem[];
  exams: ExamRoutineItem[];
  notices: SchoolNotice[];
  leaveRequests: LeaveRequest[];
  activities: SchoolActivity[];
  reportCards: Record<string, ReportCard>;
  attendanceRecords: AttendanceRecord[];

  // Update methods
  updateSchool: (updated: Partial<School>) => void;
  addStudent: (student: Omit<Student, 'id' | 'schoolId' | 'currentTransportStatus'>) => void;
  updateStudent: (id: string, data: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  updateStudentTransportStatus: (id: string, status: TransportStatus) => void;

  addBus: (bus: Omit<Bus, 'id' | 'schoolId'>) => void;
  updateBus: (id: string, data: Partial<Bus>) => void;
  deleteBus: (id: string) => void;

  addDriver: (driver: Omit<DriverProfile, 'id' | 'schoolId'>) => void;
  updateDriver: (id: string, data: Partial<DriverProfile>) => void;

  updateRoute: (id: string, data: Partial<Route>) => void;
  addRouteStop: (routeId: string, stop: any) => void;

  submitLeaveRequest: (req: Omit<LeaveRequest, 'id' | 'schoolId' | 'status' | 'appliedDate'>) => void;
  approveLeaveRequest: (id: string, remarks?: string) => void;
  rejectLeaveRequest: (id: string, remarks?: string) => void;
  submitTransportSkipToday: (studentId: string, reason?: string) => { success: boolean; message: string };

  markAttendance: (studentId: string, date: string, status: 'Present' | 'Absent' | 'Leave' | 'Holiday', remarks?: string) => void;
  payFee: (invoiceId: string, method: 'UPI' | 'Card' | 'Net Banking' | 'Cash') => void;
  addHomework: (hw: Omit<HomeworkItem, 'id' | 'schoolId'>) => void;
  addNotice: (notice: Omit<SchoolNotice, 'id' | 'schoolId'>) => void;
  resetAllDataToDemo: () => void;
}

const SchoolDataContext = createContext<SchoolDataContextType | undefined>(undefined);

const PREFIX = 'schoolsync_data_';

export const SchoolDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const loadState = <T,>(key: string, fallback: T): T => {
    try {
      const saved = localStorage.getItem(PREFIX + key);
      return saved ? JSON.parse(saved) : fallback;
    } catch (e) {
      return fallback;
    }
  };

  const [school, setSchool] = useState<School>(() => loadState('school', INITIAL_SCHOOL));
  const [students, setStudents] = useState<Student[]>(() => loadState('students', INITIAL_STUDENTS));
  const [buses, setBuses] = useState<Bus[]>(() => loadState('buses', INITIAL_BUSES));
  const [drivers, setDrivers] = useState<DriverProfile[]>(() => loadState('drivers', INITIAL_DRIVERS));
  const [routes, setRoutes] = useState<Route[]>(() => loadState('routes', INITIAL_ROUTES));
  const [fees, setFees] = useState<FeeInvoice[]>(() => loadState('fees', INITIAL_FEES));
  const [homework, setHomework] = useState<HomeworkItem[]>(() => loadState('homework', INITIAL_HOMEWORK));
  const [exams, setExams] = useState<ExamRoutineItem[]>(() => loadState('exams', INITIAL_EXAMS));
  const [notices, setNotices] = useState<SchoolNotice[]>(() => loadState('notices', INITIAL_NOTICES));
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => loadState('leaves', INITIAL_LEAVE_REQUESTS));
  const [activities] = useState<SchoolActivity[]>(() => loadState('activities', INITIAL_ACTIVITIES));
  const [reportCards] = useState<Record<string, ReportCard>>({
    stu_001: INITIAL_REPORT_CARD,
  });
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() =>
    loadState('attendance', INITIAL_ATTENDANCE)
  );

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(PREFIX + 'school', JSON.stringify(school));
  }, [school]);
  useEffect(() => {
    localStorage.setItem(PREFIX + 'students', JSON.stringify(students));
  }, [students]);
  useEffect(() => {
    localStorage.setItem(PREFIX + 'buses', JSON.stringify(buses));
  }, [buses]);
  useEffect(() => {
    localStorage.setItem(PREFIX + 'drivers', JSON.stringify(drivers));
  }, [drivers]);
  useEffect(() => {
    localStorage.setItem(PREFIX + 'routes', JSON.stringify(routes));
  }, [routes]);
  useEffect(() => {
    localStorage.setItem(PREFIX + 'fees', JSON.stringify(fees));
  }, [fees]);
  useEffect(() => {
    localStorage.setItem(PREFIX + 'homework', JSON.stringify(homework));
  }, [homework]);
  useEffect(() => {
    localStorage.setItem(PREFIX + 'notices', JSON.stringify(notices));
  }, [notices]);
  useEffect(() => {
    localStorage.setItem(PREFIX + 'leaves', JSON.stringify(leaveRequests));
  }, [leaveRequests]);
  useEffect(() => {
    localStorage.setItem(PREFIX + 'attendance', JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  const updateSchool = (updated: Partial<School>) => {
    setSchool((prev) => ({ ...prev, ...updated }));
  };

  const addStudent = (studentData: Omit<Student, 'id' | 'schoolId' | 'currentTransportStatus'>) => {
    const newStudent: Student = {
      ...studentData,
      id: `stu_${Date.now()}`,
      schoolId: school.id,
      currentTransportStatus: 'PICKUP_REQUIRED',
    };
    setStudents((prev) => [newStudent, ...prev]);
  };

  const updateStudent = (id: string, data: Partial<Student>) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)));
  };

  const deleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  const updateStudentTransportStatus = (id: string, status: TransportStatus) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, currentTransportStatus: status } : s))
    );
  };

  const addBus = (busData: Omit<Bus, 'id' | 'schoolId'>) => {
    const newBus: Bus = {
      ...busData,
      id: `bus_${Date.now()}`,
      schoolId: school.id,
    };
    setBuses((prev) => [...prev, newBus]);
  };

  const updateBus = (id: string, data: Partial<Bus>) => {
    setBuses((prev) => prev.map((b) => (b.id === id ? { ...b, ...data } : b)));
  };

  const deleteBus = (id: string) => {
    setBuses((prev) => prev.filter((b) => b.id !== id));
  };

  const addDriver = (driverData: Omit<DriverProfile, 'id' | 'schoolId'>) => {
    const newDriver: DriverProfile = {
      ...driverData,
      id: `drv_${Date.now()}`,
      schoolId: school.id,
    };
    setDrivers((prev) => [...prev, newDriver]);
  };

  const updateDriver = (id: string, data: Partial<DriverProfile>) => {
    setDrivers((prev) => prev.map((d) => (d.id === id ? { ...d, ...data } : d)));
  };

  const updateRoute = (id: string, data: Partial<Route>) => {
    setRoutes((prev) => prev.map((r) => (r.id === id ? { ...r, ...data } : r)));
  };

  const addRouteStop = (routeId: string, stop: any) => {
    setRoutes((prev) =>
      prev.map((r) => {
        if (r.id === routeId) {
          const newStopNumber = r.stops.length + 1;
          const newStop = { ...stop, id: `stop_${Date.now()}`, routeId, stopNumber: newStopNumber };
          return { ...r, stops: [...r.stops, newStop] };
        }
        return r;
      })
    );
  };

  const submitLeaveRequest = (
    req: Omit<LeaveRequest, 'id' | 'schoolId' | 'status' | 'appliedDate'>
  ) => {
    const newLeave: LeaveRequest = {
      ...req,
      id: `leave_${Date.now()}`,
      schoolId: school.id,
      status: 'Pending',
      appliedDate: new Date().toISOString().split('T')[0],
    };
    setLeaveRequests((prev) => [newLeave, ...prev]);
  };

  const approveLeaveRequest = (id: string, remarks?: string) => {
    setLeaveRequests((prev) =>
      prev.map((req) => {
        if (req.id === id) {
          const updated: LeaveRequest = {
            ...req,
            status: 'Approved',
            adminRemarks: remarks || 'Leave approved by Administration.',
            approvedDate: new Date().toISOString().split('T')[0],
          };

          // Automatically mark student as SCHOOL_LEAVE or TRANSPORT_SKIP
          updateStudentTransportStatus(
            req.studentId,
            req.type === 'Transport_Skip_Today' ? 'TRANSPORT_SKIP' : 'SCHOOL_LEAVE'
          );

          return updated;
        }
        return req;
      })
    );
  };

  const rejectLeaveRequest = (id: string, remarks?: string) => {
    setLeaveRequests((prev) =>
      prev.map((req) =>
        req.id === id
          ? {
              ...req,
              status: 'Rejected',
              adminRemarks: remarks || 'Leave request declined.',
            }
          : req
      )
    );
  };

  const submitTransportSkipToday = (studentId: string, reason?: string) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return { success: false, message: 'Student not found' };

    // Check cutoff time (default 06:30 AM)
    const now = new Date();
    const currentHours = now.getHours();
    const currentMins = now.getMinutes();
    const [cutoffHours, cutoffMins] = school.transportSkipCutoffTime.split(':').map(Number);

    const isPastCutoff =
      currentHours > cutoffHours || (currentHours === cutoffHours && currentMins > cutoffMins);

    // In demo mode we allow it with an informational note if past cutoff, or process it directly
    updateStudentTransportStatus(studentId, 'TRANSPORT_SKIP');

    const newSkipRecord: LeaveRequest = {
      id: `skip_${Date.now()}`,
      schoolId: school.id,
      studentId: student.id,
      studentName: student.fullName,
      class: student.class,
      section: student.section,
      fromDate: new Date().toISOString().split('T')[0],
      toDate: new Date().toISOString().split('T')[0],
      reason: reason || 'Parent will personally drop/pick up the child today.',
      type: 'Transport_Skip_Today',
      status: 'Approved',
      appliedDate: new Date().toISOString().split('T')[0],
      appliedBy: student.parentName,
      adminRemarks: 'Transport skip auto-confirmed before route departure.',
      approvedDate: new Date().toISOString().split('T')[0],
    };

    setLeaveRequests((prev) => [newSkipRecord, ...prev]);

    return {
      success: true,
      message: isPastCutoff
        ? 'Bus pickup skip recorded! Note: submitted after cutoff, driver has been notified directly.'
        : 'Bus pickup has been skipped for today. Driver notified.',
    };
  };

  const markAttendance = (
    studentId: string,
    date: string,
    status: 'Present' | 'Absent' | 'Leave' | 'Holiday',
    remarks?: string
  ) => {
    setAttendanceRecords((prev) => {
      const existing = prev.filter((r) => !(r.studentId === studentId && r.date === date));
      const newRec: AttendanceRecord = {
        id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        schoolId: school.id,
        studentId,
        date,
        status,
        markedBy: 'Sunita Sen (Class Teacher)',
        markedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        remarks,
      };
      return [newRec, ...existing];
    });
  };

  const payFee = (invoiceId: string, method: 'UPI' | 'Card' | 'Net Banking' | 'Cash') => {
    const receiptNum = `REC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    setFees((prev) =>
      prev.map((f) =>
        f.id === invoiceId
          ? {
              ...f,
              status: 'Paid',
              paidDate: new Date().toISOString().split('T')[0],
              paymentMethod: method,
              receiptNumber: receiptNum,
            }
          : f
      )
    );
  };

  const addHomework = (hw: Omit<HomeworkItem, 'id' | 'schoolId'>) => {
    const newHw: HomeworkItem = {
      ...hw,
      id: `hw_${Date.now()}`,
      schoolId: school.id,
    };
    setHomework((prev) => [newHw, ...prev]);
  };

  const addNotice = (notice: Omit<SchoolNotice, 'id' | 'schoolId'>) => {
    const newNotice: SchoolNotice = {
      ...notice,
      id: `not_${Date.now()}`,
      schoolId: school.id,
    };
    setNotices((prev) => [newNotice, ...prev]);
  };

  const resetAllDataToDemo = () => {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => localStorage.removeItem(k));
    setSchool(INITIAL_SCHOOL);
    setStudents(INITIAL_STUDENTS);
    setBuses(INITIAL_BUSES);
    setDrivers(INITIAL_DRIVERS);
    setRoutes(INITIAL_ROUTES);
    setFees(INITIAL_FEES);
    setHomework(INITIAL_HOMEWORK);
    setExams(INITIAL_EXAMS);
    setNotices(INITIAL_NOTICES);
    setLeaveRequests(INITIAL_LEAVE_REQUESTS);
    setAttendanceRecords(INITIAL_ATTENDANCE);
  };

  return (
    <SchoolDataContext.Provider
      value={{
        school,
        students,
        buses,
        drivers,
        routes,
        fees,
        homework,
        exams,
        notices,
        leaveRequests,
        activities,
        reportCards,
        attendanceRecords,
        updateSchool,
        addStudent,
        updateStudent,
        deleteStudent,
        updateStudentTransportStatus,
        addBus,
        updateBus,
        deleteBus,
        addDriver,
        updateDriver,
        updateRoute,
        addRouteStop,
        submitLeaveRequest,
        approveLeaveRequest,
        rejectLeaveRequest,
        submitTransportSkipToday,
        markAttendance,
        payFee,
        addHomework,
        addNotice,
        resetAllDataToDemo,
      }}
    >
      {children}
    </SchoolDataContext.Provider>
  );
};

export const useSchoolData = () => {
  const context = useContext(SchoolDataContext);
  if (!context) {
    throw new Error('useSchoolData must be used within a SchoolDataProvider');
  }
  return context;
};
