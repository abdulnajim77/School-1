export type UserRole = 'admin' | 'parent' | 'driver' | 'teacher';

export type TripType = 'morning_pickup' | 'afternoon_drop';

export type TripStatus =
  | 'NOT_STARTED'
  | 'STARTED'
  | 'EN_ROUTE'
  | 'NEAR_STOP'
  | 'AT_STOP'
  | 'STUDENT_BOARDED'
  | 'NEAR_SCHOOL'
  | 'AT_SCHOOL'
  | 'RETURN_STARTED'
  | 'NEAR_DROP'
  | 'STUDENT_DROPPED'
  | 'COMPLETED';

export type TransportStatus =
  | 'NORMAL'
  | 'SCHOOL_LEAVE'
  | 'TRANSPORT_SKIP'
  | 'PICKUP_REQUIRED'
  | 'PICKUP_COMPLETED'
  | 'BOARDED'
  | 'REACHED_SCHOOL'
  | 'RETURN_STARTED'
  | 'DROP_REQUIRED'
  | 'DROPPED'
  | 'ABSENT_NO_NOTICE';

export type GeofenceZoneType = 'school' | 'pickup' | 'drop';

export type GeofenceState = 'outside' | 'approaching' | 'inside' | 'exited';

export type NotificationPriority = 'INFO' | 'IMPORTANT' | 'SAFETY' | 'EMERGENCY';

export type NotificationCategory = 'Transport' | 'Academic' | 'Fee' | 'Notice' | 'Safety' | 'Emergency';

export interface User {
  uid: string;
  schoolId: string;
  email: string;
  name: string;
  role: UserRole;
  phone: string;
  avatar?: string;
  assignedStudentIds?: string[];
  assignedBusId?: string;
  assignedRouteId?: string;
  assignedClass?: string;
  assignedSection?: string;
}

export interface School {
  id: string;
  name: string;
  tagline: string;
  logo: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  academicYear: string;
  latitude: number;
  longitude: number;
  geofenceRadius: number; // default 200m
  defaultPickupRadius: number; // default 100m
  defaultDropRadius: number; // default 100m
  approachingDistance: number; // default 500m
  transportSkipCutoffTime: string; // e.g. "06:30"
  brandColor: string;
  driverPhonePrivacy: boolean; // Hide personal number behind click-to-call or switchboard
}

export interface Student {
  id: string;
  schoolId: string;
  studentIdNumber: string; // STU-2026-0012
  firstName: string;
  lastName: string;
  fullName: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  class: string;
  section: string;
  rollNumber: number;
  photoUrl: string;
  parentId: string;
  parentName: string;
  parentPhone: string;
  address: string;
  busId: string;
  routeId: string;
  pickupStopId: string;
  pickupPointName: string;
  pickupLatitude: number;
  pickupLongitude: number;
  pickupRadius: number; // default 100m
  dropStopId: string;
  dropPointName: string;
  dropLatitude: number;
  dropLongitude: number;
  dropRadius: number; // default 100m
  emergencyContact: string;
  emergencyRelation: string;
  currentTransportStatus: TransportStatus;
  status: 'Active' | 'Inactive';
  boardingTime?: string;
  dropTime?: string;
}

export interface Bus {
  id: string;
  schoolId: string;
  busNumber: string; // Bus 03
  vehicleNumber: string; // WB-16A-1234
  vehicleType: 'Mini Bus' | 'Van' | 'Standard Bus' | 'Electric Bus';
  capacity: number;
  driverId: string;
  driverName: string;
  driverPhone: string;
  helperName: string;
  helperPhone: string;
  routeId: string;
  routeName: string;
  insuranceExpiry: string;
  fitnessExpiry: string;
  status: 'Active' | 'Maintenance' | 'Inactive';
}

export interface DriverProfile {
  id: string;
  schoolId: string;
  name: string;
  photoUrl: string;
  phone: string;
  email: string;
  licenseNumber: string;
  licenseExpiry: string;
  assignedBusId: string;
  assignedRouteId: string;
  emergencyContact: string;
  status: 'Active' | 'On Leave' | 'Inactive';
  rating: number;
  experienceYears: number;
}

export interface RouteStop {
  id: string;
  routeId: string;
  stopNumber: number;
  name: string;
  latitude: number;
  longitude: number;
  expectedPickupTime: string;
  expectedDropTime: string;
  assignedStudentIds: string[];
}

export interface Route {
  id: string;
  schoolId: string;
  name: string; // Route A
  busId: string;
  startLocationName: string;
  endLocationName: string;
  stops: RouteStop[];
  totalDistanceKm: number;
  estimatedDurationMin: number;
}

export interface LiveTrip {
  id: string;
  schoolId: string;
  busId: string;
  busNumber: string;
  vehicleNumber: string;
  driverId: string;
  driverName: string;
  helperName: string;
  routeId: string;
  routeName: string;
  tripType: TripType;
  status: TripStatus;
  startedAt?: string;
  endedAt?: string;
  currentLatitude: number;
  currentLongitude: number;
  speed: number; // km/h
  heading: number; // degrees
  lastUpdated: string;
  currentStopIndex: number;
  nextStopName: string;
  distanceToNextStopMeters: number;
  etaNextStopMinutes: number;
  boardedStudentIds: string[];
  droppedStudentIds: string[];
  onLeaveStudentIds: string[];
  transportSkipStudentIds: string[];
  emergencyReported?: {
    type: string;
    details: string;
    timestamp: string;
    latitude: number;
    longitude: number;
  };
}

export interface GeofenceEventLog {
  id: string;
  schoolId: string;
  tripId: string;
  busId: string;
  busNumber: string;
  studentId?: string;
  studentName?: string;
  zoneType: GeofenceZoneType;
  eventType: string; // e.g. "BUS_NEAR_PICKUP", "ENTERED_PICKUP_ZONE", "STUDENT_BOARDED", "BUS_NEAR_SCHOOL", "REACHED_SCHOOL"
  message: string;
  timestamp: string;
  latitude: number;
  longitude: number;
}

export interface NotificationItem {
  id: string;
  schoolId: string;
  targetRole: UserRole | 'all';
  targetUserId?: string; // Specific parent or driver
  studentId?: string;
  title: string;
  message: string;
  priority: NotificationPriority;
  category: NotificationCategory;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface ParentNotificationPreferences {
  busApproachingPickup: boolean;
  busArrivedPickup: boolean;
  studentBoarded: boolean;
  reachedSchool: boolean;
  returnTripStarted: boolean;
  busApproachingDrop: boolean;
  studentDropped: boolean;
  schoolNotice: boolean;
  feeReminder: boolean;
  homeworkUpdate: boolean;
  emergencyAlert: boolean; // Always true & locked
}

export interface AttendanceRecord {
  id: string;
  schoolId: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  status: 'Present' | 'Absent' | 'Leave' | 'Holiday';
  markedBy: string;
  markedAt: string;
  remarks?: string;
}

export interface FeeInvoice {
  id: string;
  schoolId: string;
  studentId: string;
  invoiceNumber: string;
  title: string; // e.g. "September School Fee"
  period: string; // "September 2026"
  amount: number;
  lateFee: number;
  dueDate: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  paidDate?: string;
  paymentMethod?: 'UPI' | 'Card' | 'Net Banking' | 'Cash';
  receiptNumber?: string;
  breakdown: { item: string; amount: number }[];
}

export interface HomeworkItem {
  id: string;
  schoolId: string;
  class: string;
  section: string;
  subject: string;
  title: string;
  description: string;
  assignedDate: string;
  dueDate: string;
  attachmentName?: string;
  teacherName: string;
  status: 'Pending' | 'Completed';
}

export interface ExamRoutineItem {
  id: string;
  schoolId: string;
  examTitle: string; // "Half Yearly Examination"
  class: string;
  subject: string;
  date: string;
  time: string; // "10:00 AM - 12:00 PM"
  room: string;
  syllabus: string;
}

export interface SchoolNotice {
  id: string;
  schoolId: string;
  title: string;
  category: 'General' | 'Holiday' | 'Sports' | 'Academic' | 'Emergency' | 'Meeting';
  priority: NotificationPriority;
  date: string;
  content: string;
  attachmentUrl?: string;
  attachmentName?: string;
  author: string;
}

export interface LeaveRequest {
  id: string;
  schoolId: string;
  studentId: string;
  studentName: string;
  class: string;
  section: string;
  fromDate: string;
  toDate: string;
  reason: string;
  type: 'Academic_Leave' | 'Transport_Skip_Today';
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedDate: string;
  appliedBy: string; // Parent Name
  attachmentName?: string;
  adminRemarks?: string;
  approvedDate?: string;
}

export interface SchoolActivity {
  id: string;
  schoolId: string;
  title: string;
  category: 'Sports' | 'Art' | 'Events' | 'Celebrations' | 'Class Activities';
  date: string;
  imageUrl: string;
  description: string;
  likes: number;
}

export interface ReportCard {
  id: string;
  schoolId: string;
  studentId: string;
  term: string; // "Half Yearly 2026"
  academicYear: string;
  subjects: {
    name: string;
    maxMarks: number;
    obtainedMarks: number;
    grade: string;
    remarks: string;
  }[];
  overallPercentage: number;
  overallGrade: string;
  attendanceDays: number;
  totalWorkingDays: number;
  teacherRemarks: string;
  principalRemarks: string;
  issueDate: string;
}
