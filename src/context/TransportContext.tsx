import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  LiveTrip,
  TripStatus,
  TripType,
  GeofenceEventLog,
  NotificationItem,
  NotificationPriority,
  NotificationCategory,
  ParentNotificationPreferences,
  UserRole,
} from '../types';
import {
  calculateHaversineDistanceMeters,
  calculateBearing,
  calculateEtaMinutes,
  formatTimeAmPm,
  interpolateLatLng,
  LatLng,
} from '../utils/geo';
import { useSchoolData } from './SchoolDataContext';
import { useAuth } from './AuthContext';

// Route Waypoints for realistic Bus 03 movement simulation
// Stops along Chandannagar: Station -> Jyoti More -> College More -> Barabazar -> School
export const ROUTE_A_WAYPOINTS: (LatLng & { name: string; isStop?: boolean; stopId?: string; studentId?: string })[] = [
  { latitude: 22.8550, longitude: 88.3510, name: 'Chandannagar Station Road', isStop: true, stopId: 'stop_01' },
  { latitude: 22.8568, longitude: 88.3528, name: 'Grand Trunk Road Junction' },
  { latitude: 22.8588, longitude: 88.3548, name: 'Strand Approach' },
  { latitude: 22.8605, longitude: 88.3565, name: 'Jyoti More (Riya Das Pickup)', isStop: true, stopId: 'stop_02', studentId: 'stu_001' },
  { latitude: 22.8622, longitude: 88.3580, name: 'French Institute Avenue' },
  { latitude: 22.8642, longitude: 88.3598, name: 'College More Junction', isStop: true, stopId: 'stop_03', studentId: 'stu_003' },
  { latitude: 22.8665, longitude: 88.3615, name: 'Barabazar Clock Tower', isStop: true, stopId: 'stop_04', studentId: 'stu_004' },
  { latitude: 22.8678, longitude: 88.3628, name: 'Academy Link Road' },
  { latitude: 22.8688, longitude: 88.3638, name: 'Little Star Kids Academy Main Gate', isStop: true, stopId: 'stop_05' },
];

interface TransportContextType {
  trip: LiveTrip;
  isSimulating: boolean;
  simulationSpeed: number; // 1x, 2x, 5x
  currentWaypointIndex: number;
  waypointFraction: number; // 0 to 1 between current and next waypoint
  notifications: NotificationItem[];
  geofenceEvents: GeofenceEventLog[];
  parentPreferences: ParentNotificationPreferences;
  unreadCount: number;

  // Driver Controls
  startTrip: (type?: TripType) => void;
  endTrip: () => void;
  boardStudent: (studentId: string) => void;
  dropStudent: (studentId: string) => void;
  reportEmergency: (type: string, details: string) => void;
  clearEmergency: () => void;

  // Simulation Helpers for Demonstration
  toggleSimulation: () => void;
  setSimulationSpeed: (speed: number) => void;
  jumpToStep: (step: 'start' | 'approaching_riya' | 'at_riya' | 'boarded_riya' | 'approaching_school' | 'at_school') => void;
  resetTrip: () => void;

  // Notification methods
  markAllNotificationsRead: () => void;
  markNotificationRead: (id: string) => void;
  addCustomNotification: (notif: Omit<NotificationItem, 'id' | 'schoolId' | 'timestamp' | 'read'>) => void;
  updateParentPreferences: (prefs: Partial<ParentNotificationPreferences>) => void;
}

const TransportContext = createContext<TransportContextType | undefined>(undefined);

const NOTIFS_STORAGE_KEY = 'schoolsync_notifications';
const GEOFENCE_LOGS_KEY = 'schoolsync_geofence_logs';
const PREFS_STORAGE_KEY = 'schoolsync_parent_prefs';

const DEFAULT_PREFERENCES: ParentNotificationPreferences = {
  busApproachingPickup: true,
  busArrivedPickup: true,
  studentBoarded: true,
  reachedSchool: true,
  returnTripStarted: true,
  busApproachingDrop: true,
  studentDropped: true,
  schoolNotice: true,
  feeReminder: true,
  homeworkUpdate: true,
  emergencyAlert: true,
};

export const TransportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { school, students, updateStudentTransportStatus } = useSchoolData();
  const { user } = useAuth();

  // Active Trip State
  const [trip, setTrip] = useState<LiveTrip>(() => ({
    id: 'trip_003_today',
    schoolId: 'school_001',
    busId: 'bus_003',
    busNumber: 'Bus 03',
    vehicleNumber: 'WB-16A-1234',
    driverId: 'drv_001',
    driverName: 'Sanjay Das',
    helperName: 'Mita Ghosh',
    routeId: 'route_001',
    routeName: 'Route A',
    tripType: 'morning_pickup',
    status: 'EN_ROUTE',
    startedAt: '07:35 AM',
    currentLatitude: 22.8580,
    currentLongitude: 88.3540,
    speed: 32,
    heading: 45,
    lastUpdated: formatTimeAmPm(new Date(), true),
    currentStopIndex: 1,
    nextStopName: 'Jyoti More (Riya Das Pickup)',
    distanceToNextStopMeters: 550,
    etaNextStopMinutes: 4,
    boardedStudentIds: ['stu_002'], // Arjun already boarded at Stop 1
    droppedStudentIds: [],
    onLeaveStudentIds: [],
    transportSkipStudentIds: [],
  }));

  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1);
  const [currentWaypointIndex, setCurrentWaypointIndex] = useState<number>(2);
  const [waypointFraction, setWaypointFraction] = useState<number>(0.2);

  // Geofence trigger flags to prevent duplicate notifications
  const geofenceFlags = useRef<{
    approachingPickupNotified: boolean;
    arrivedPickupNotified: boolean;
    approachingSchoolNotified: boolean;
    reachedSchoolNotified: boolean;
    approachingDropNotified: boolean;
    arrivedDropNotified: boolean;
  }>({
    approachingPickupNotified: false,
    arrivedPickupNotified: false,
    approachingSchoolNotified: false,
    reachedSchoolNotified: false,
    approachingDropNotified: false,
    arrivedDropNotified: false,
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(NOTIFS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    // Initial realistic notification history
    return [
      {
        id: 'notif_init_01',
        schoolId: 'school_001',
        targetRole: 'parent',
        targetUserId: 'user_parent_01',
        studentId: 'stu_001',
        title: 'Morning Route Started',
        message: 'Bus 03 has commenced Morning Route A from Chandannagar Station.',
        priority: 'INFO',
        category: 'Transport',
        timestamp: '07:35 AM',
        read: false,
      },
      {
        id: 'notif_init_02',
        schoolId: 'school_001',
        targetRole: 'parent',
        targetUserId: 'user_parent_01',
        studentId: 'stu_001',
        title: 'Stop 1 Completed',
        message: 'Arjun Roy has boarded safely at Station Road.',
        priority: 'INFO',
        category: 'Transport',
        timestamp: '07:42 AM',
        read: true,
      },
    ];
  });

  const [geofenceEvents, setGeofenceEvents] = useState<GeofenceEventLog[]>(() => {
    try {
      const saved = localStorage.getItem(GEOFENCE_LOGS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: 'log_01',
        schoolId: 'school_001',
        tripId: 'trip_003_today',
        busId: 'bus_003',
        busNumber: 'Bus 03',
        zoneType: 'pickup',
        eventType: 'BUS_TRIP_STARTED',
        message: 'Bus 03 initiated Morning Pickup Route A.',
        timestamp: '07:35:10 AM',
        latitude: 22.8550,
        longitude: 88.3510,
      },
    ];
  });

  const [parentPreferences, setParentPreferences] = useState<ParentNotificationPreferences>(() => {
    try {
      const saved = localStorage.getItem(PREFS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_PREFERENCES;
  });

  // Save notifications & logs
  useEffect(() => {
    localStorage.setItem(NOTIFS_STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(GEOFENCE_LOGS_KEY, JSON.stringify(geofenceEvents));
  }, [geofenceEvents]);

  useEffect(() => {
    localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(parentPreferences));
  }, [parentPreferences]);

  const addNotification = (
    title: string,
    message: string,
    priority: NotificationPriority,
    category: NotificationCategory,
    studentId?: string,
    targetRole: UserRole | 'all' = 'parent'
  ) => {
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      schoolId: 'school_001',
      targetRole,
      targetUserId: targetRole === 'parent' ? 'user_parent_01' : undefined,
      studentId: studentId || 'stu_001',
      title,
      message,
      priority,
      category,
      timestamp: formatTimeAmPm(new Date()),
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const addGeofenceLog = (
    eventType: string,
    message: string,
    zoneType: 'school' | 'pickup' | 'drop',
    currentPos: LatLng,
    studentId?: string,
    studentName?: string
  ) => {
    const newLog: GeofenceEventLog = {
      id: `geo_${Date.now()}`,
      schoolId: 'school_001',
      tripId: trip.id,
      busId: trip.busId,
      busNumber: trip.busNumber,
      studentId,
      studentName,
      zoneType,
      eventType,
      message,
      timestamp: formatTimeAmPm(new Date(), true),
      latitude: currentPos.latitude,
      longitude: currentPos.longitude,
    };
    setGeofenceEvents((prev) => [newLog, ...prev.slice(0, 99)]);
  };

  // Main simulation timer loop
  useEffect(() => {
    if (!isSimulating || trip.status === 'COMPLETED' || trip.status === 'NOT_STARTED') {
      return;
    }

    const intervalTime = 3000 / simulationSpeed;
    const timer = setInterval(() => {
      setWaypointFraction((prevFraction) => {
        const step = 0.08 * simulationSpeed;
        const nextFraction = prevFraction + step;

        if (nextFraction >= 1) {
          // Move to next waypoint
          setCurrentWaypointIndex((prevIndex) => {
            const nextIdx = prevIndex + 1;
            if (nextIdx >= ROUTE_A_WAYPOINTS.length - 1) {
              // Reached school campus
              return ROUTE_A_WAYPOINTS.length - 1;
            }
            return nextIdx;
          });
          return 0;
        }
        return nextFraction;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isSimulating, simulationSpeed, trip.status]);

  // Update current bus coordinates and check geofences whenever waypoint / fraction changes
  useEffect(() => {
    if (trip.status === 'NOT_STARTED' || trip.status === 'COMPLETED') return;

    const p1 = ROUTE_A_WAYPOINTS[currentWaypointIndex];
    const nextIdx = Math.min(currentWaypointIndex + 1, ROUTE_A_WAYPOINTS.length - 1);
    const p2 = ROUTE_A_WAYPOINTS[nextIdx];

    const currentCoords = interpolateLatLng(p1, p2, waypointFraction);
    const heading = calculateBearing(p1, p2);

    // Target positions
    const riyaStopPos: LatLng = { latitude: 22.8605, longitude: 88.3565 };
    const schoolPos: LatLng = { latitude: school.latitude, longitude: school.longitude };

    // Calculate exact distances via Haversine
    const distToRiyaMeters = calculateHaversineDistanceMeters(currentCoords, riyaStopPos);
    const distToSchoolMeters = calculateHaversineDistanceMeters(currentCoords, schoolPos);

    const isMorning = trip.tripType === 'morning_pickup';

    // Speed calculation simulation
    const currentSpeed = distToRiyaMeters < 80 || distToSchoolMeters < 80 ? 0 : Math.round(28 + Math.random() * 8);

    // Update active trip state
    setTrip((prev) => {
      let targetNextStopName = 'Little Star Kids Academy';
      let targetDist = distToSchoolMeters;

      if (currentWaypointIndex <= 3) {
        targetNextStopName = 'Jyoti More (Riya Das Pickup)';
        targetDist = distToRiyaMeters;
      } else if (currentWaypointIndex <= 5) {
        targetNextStopName = 'College More Junction';
        targetDist = calculateHaversineDistanceMeters(currentCoords, { latitude: 22.8642, longitude: 88.3598 });
      }

      return {
        ...prev,
        currentLatitude: currentCoords.latitude,
        currentLongitude: currentCoords.longitude,
        heading,
        speed: currentSpeed,
        lastUpdated: formatTimeAmPm(new Date(), true),
        nextStopName: targetNextStopName,
        distanceToNextStopMeters: targetDist,
        etaNextStopMinutes: calculateEtaMinutes(targetDist, 25),
      };
    });

    // -------------------------------------------------------------
    // GEOFENCE EVALUATION ENGINE WITH SPAM PREVENTION
    // -------------------------------------------------------------
    const riyaStudent = students.find((s) => s.id === 'stu_001');
    const isRiyaOnLeave = riyaStudent?.currentTransportStatus === 'SCHOOL_LEAVE' || riyaStudent?.currentTransportStatus === 'TRANSPORT_SKIP';

    // 1. Approaching Pickup (500m threshold)
    if (
      isMorning &&
      !isRiyaOnLeave &&
      distToRiyaMeters <= school.approachingDistance &&
      distToRiyaMeters > school.defaultPickupRadius &&
      !geofenceFlags.current.approachingPickupNotified
    ) {
      geofenceFlags.current.approachingPickupNotified = true;
      if (parentPreferences.busApproachingPickup) {
        addNotification(
          'Bus Approaching',
          `Bus 03 is approaching Riya's pickup point (${distToRiyaMeters}m away, ~${calculateEtaMinutes(distToRiyaMeters)} min).`,
          'IMPORTANT',
          'Transport',
          'stu_001'
        );
      }
      addGeofenceLog('BUS_NEAR_PICKUP', `Bus 03 is within 500m of Jyoti More (${distToRiyaMeters}m).`, 'pickup', currentCoords, 'stu_001', 'Riya Das');
    }

    // 2. Bus Arrived Inside Pickup Geofence (100m threshold)
    if (
      isMorning &&
      !isRiyaOnLeave &&
      distToRiyaMeters <= school.defaultPickupRadius &&
      !geofenceFlags.current.arrivedPickupNotified
    ) {
      geofenceFlags.current.arrivedPickupNotified = true;
      setTrip((prev) => ({ ...prev, status: 'AT_STOP' }));
      if (parentPreferences.busArrivedPickup) {
        addNotification(
          'Bus Arrived at Pickup',
          "Riya's school bus has arrived near Jyoti More. Please board the student safely.",
          'SAFETY',
          'Safety',
          'stu_001'
        );
      }
      addGeofenceLog('ENTERED_PICKUP_ZONE', `Bus 03 entered Jyoti More 100m geofence.`, 'pickup', currentCoords, 'stu_001', 'Riya Das');
    }

    // 3. Approaching School (200m threshold)
    if (
      isMorning &&
      distToSchoolMeters <= school.geofenceRadius &&
      distToSchoolMeters > 50 &&
      !geofenceFlags.current.approachingSchoolNotified
    ) {
      geofenceFlags.current.approachingSchoolNotified = true;
      setTrip((prev) => ({ ...prev, status: 'NEAR_SCHOOL' }));
      if (parentPreferences.reachedSchool) {
        addNotification(
          'Approaching School',
          'Bus 03 is approaching the school campus gate.',
          'IMPORTANT',
          'Transport',
          'stu_001'
        );
      }
      addGeofenceLog('BUS_NEAR_SCHOOL', `Bus 03 reached within ${school.geofenceRadius}m of School.`, 'school', currentCoords);
    }

    // 4. Reached School (Main Gate / Inside School Radius < 50m)
    if (
      isMorning &&
      distToSchoolMeters <= 50 &&
      !geofenceFlags.current.reachedSchoolNotified
    ) {
      geofenceFlags.current.reachedSchoolNotified = true;
      setTrip((prev) => ({ ...prev, status: 'AT_SCHOOL' }));
      updateStudentTransportStatus('stu_001', 'REACHED_SCHOOL');
      if (parentPreferences.reachedSchool) {
        addNotification(
          'Reached School Safely',
          'Riya reached school safely at Little Star Kids Academy.',
          'SAFETY',
          'Safety',
          'stu_001'
        );
      }
      addGeofenceLog('REACHED_SCHOOL', 'Bus 03 reached school. All onboard students marked Reached School.', 'school', currentCoords);
    }
  }, [currentWaypointIndex, waypointFraction, school, trip.status, trip.tripType, students, parentPreferences]);

  // Driver actions
  const startTrip = (type: TripType = 'morning_pickup') => {
    geofenceFlags.current = {
      approachingPickupNotified: false,
      arrivedPickupNotified: false,
      approachingSchoolNotified: false,
      reachedSchoolNotified: false,
      approachingDropNotified: false,
      arrivedDropNotified: false,
    };
    setCurrentWaypointIndex(0);
    setWaypointFraction(0);
    setIsSimulating(true);

    const startPos = ROUTE_A_WAYPOINTS[0];
    setTrip((prev) => ({
      ...prev,
      tripType: type,
      status: 'EN_ROUTE',
      startedAt: formatTimeAmPm(new Date()),
      currentLatitude: startPos.latitude,
      currentLongitude: startPos.longitude,
      speed: 30,
      boardedStudentIds: [],
      droppedStudentIds: [],
      emergencyReported: undefined,
    }));

    addNotification(
      type === 'morning_pickup' ? 'Morning Trip Started' : 'Return Trip Started',
      `Bus 03 has departed for ${type === 'morning_pickup' ? 'morning pickup' : 'afternoon drop'}.`,
      'INFO',
      'Transport'
    );
    addGeofenceLog('TRIP_STARTED', `Driver started ${type}.`, 'pickup', startPos);
  };

  const endTrip = () => {
    setIsSimulating(false);
    setTrip((prev) => ({
      ...prev,
      status: 'COMPLETED',
      speed: 0,
      endedAt: formatTimeAmPm(new Date()),
    }));
    addNotification('Trip Completed', 'Bus 03 has completed today\'s journey.', 'INFO', 'Transport');
    addGeofenceLog('TRIP_COMPLETED', 'Trip completed successfully.', 'school', {
      latitude: trip.currentLatitude,
      longitude: trip.currentLongitude,
    });
  };

  const boardStudent = (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    setTrip((prev) => ({
      ...prev,
      status: 'STUDENT_BOARDED',
      boardedStudentIds: [...new Set([...prev.boardedStudentIds, studentId])],
    }));

    updateStudentTransportStatus(studentId, 'BOARDED');

    addNotification(
      'Student Boarded',
      `${student?.fullName || 'Your child'} boarded Bus 03 safely at ${formatTimeAmPm(new Date())}.`,
      'SAFETY',
      'Safety',
      studentId
    );

    addGeofenceLog(
      'STUDENT_BOARDED',
      `${student?.fullName || 'Student'} marked Boarded by helper Mita Ghosh.`,
      'pickup',
      { latitude: trip.currentLatitude, longitude: trip.currentLongitude },
      studentId,
      student?.fullName
    );
  };

  const dropStudent = (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    setTrip((prev) => ({
      ...prev,
      status: 'STUDENT_DROPPED',
      droppedStudentIds: [...new Set([...prev.droppedStudentIds, studentId])],
    }));

    updateStudentTransportStatus(studentId, 'DROPPED');

    addNotification(
      'Student Dropped Safely',
      `${student?.fullName || 'Your child'} was dropped safely at ${student?.dropPointName || 'designated stop'} at ${formatTimeAmPm(new Date())}.`,
      'SAFETY',
      'Safety',
      studentId
    );

    addGeofenceLog(
      'STUDENT_DROPPED',
      `${student?.fullName || 'Student'} dropped safely.`,
      'drop',
      { latitude: trip.currentLatitude, longitude: trip.currentLongitude },
      studentId,
      student?.fullName
    );
  };

  const reportEmergency = (type: string, details: string) => {
    const emergencyInfo = {
      type,
      details,
      timestamp: formatTimeAmPm(new Date(), true),
      latitude: trip.currentLatitude,
      longitude: trip.currentLongitude,
    };

    setTrip((prev) => ({
      ...prev,
      emergencyReported: emergencyInfo,
    }));

    // Broadcast EMERGENCY notification to all relevant parents and admins
    addNotification(
      `Emergency Alert: ${type}`,
      `Bus 03 reported: "${details}". All students are reported safe. School administration has been dispatched.`,
      'EMERGENCY',
      'Emergency',
      'stu_001',
      'all'
    );

    addGeofenceLog(
      'EMERGENCY_REPORTED',
      `Emergency: ${type} - ${details}`,
      'pickup',
      { latitude: trip.currentLatitude, longitude: trip.currentLongitude }
    );
  };

  const clearEmergency = () => {
    setTrip((prev) => ({
      ...prev,
      emergencyReported: undefined,
    }));
    addNotification(
      'Emergency Resolved',
      'The issue regarding Bus 03 has been resolved. Trip resumed normally.',
      'IMPORTANT',
      'Emergency'
    );
  };

  // Demo jump steps
  const jumpToStep = (
    step: 'start' | 'approaching_riya' | 'at_riya' | 'boarded_riya' | 'approaching_school' | 'at_school'
  ) => {
    if (step === 'start') {
      setCurrentWaypointIndex(0);
      setWaypointFraction(0);
      setTrip((prev) => ({ ...prev, status: 'EN_ROUTE', speed: 30 }));
    } else if (step === 'approaching_riya') {
      // 500m from Jyoti More
      setCurrentWaypointIndex(2);
      setWaypointFraction(0.1);
      geofenceFlags.current.approachingPickupNotified = false;
    } else if (step === 'at_riya') {
      // At Jyoti More stop (Stop 2)
      setCurrentWaypointIndex(3);
      setWaypointFraction(0.0);
      geofenceFlags.current.arrivedPickupNotified = false;
      setTrip((prev) => ({ ...prev, status: 'AT_STOP', speed: 0 }));
    } else if (step === 'boarded_riya') {
      boardStudent('stu_001');
      setCurrentWaypointIndex(3);
      setWaypointFraction(0.3);
      setTrip((prev) => ({ ...prev, status: 'EN_ROUTE', speed: 28 }));
    } else if (step === 'approaching_school') {
      // 200m from school
      setCurrentWaypointIndex(7);
      setWaypointFraction(0.4);
      geofenceFlags.current.approachingSchoolNotified = false;
    } else if (step === 'at_school') {
      setCurrentWaypointIndex(ROUTE_A_WAYPOINTS.length - 1);
      setWaypointFraction(0.95);
      geofenceFlags.current.reachedSchoolNotified = false;
    }
  };

  const resetTrip = () => {
    geofenceFlags.current = {
      approachingPickupNotified: false,
      arrivedPickupNotified: false,
      approachingSchoolNotified: false,
      reachedSchoolNotified: false,
      approachingDropNotified: false,
      arrivedDropNotified: false,
    };
    setCurrentWaypointIndex(2);
    setWaypointFraction(0.2);
    setIsSimulating(true);
    setTrip({
      id: 'trip_003_today',
      schoolId: 'school_001',
      busId: 'bus_003',
      busNumber: 'Bus 03',
      vehicleNumber: 'WB-16A-1234',
      driverId: 'drv_001',
      driverName: 'Sanjay Das',
      helperName: 'Mita Ghosh',
      routeId: 'route_001',
      routeName: 'Route A',
      tripType: 'morning_pickup',
      status: 'EN_ROUTE',
      startedAt: '07:35 AM',
      currentLatitude: 22.8580,
      currentLongitude: 88.3540,
      speed: 32,
      heading: 45,
      lastUpdated: formatTimeAmPm(new Date(), true),
      currentStopIndex: 1,
      nextStopName: 'Jyoti More (Riya Das Pickup)',
      distanceToNextStopMeters: 550,
      etaNextStopMinutes: 4,
      boardedStudentIds: ['stu_002'],
      droppedStudentIds: [],
      onLeaveStudentIds: [],
      transportSkipStudentIds: [],
    });
  };

  const toggleSimulation = () => setIsSimulating(!isSimulating);

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const addCustomNotification = (notif: Omit<NotificationItem, 'id' | 'schoolId' | 'timestamp' | 'read'>) => {
    addNotification(notif.title, notif.message, notif.priority, notif.category, notif.studentId, notif.targetRole);
  };

  const updateParentPreferences = (prefs: Partial<ParentNotificationPreferences>) => {
    setParentPreferences((prev) => ({ ...prev, ...prefs }));
  };

  const unreadCount = notifications.filter((n) => {
    if (user?.role === 'parent' && n.targetRole === 'driver') return false;
    if (user?.role === 'driver' && n.targetRole === 'parent') return false;
    return !n.read;
  }).length;

  return (
    <TransportContext.Provider
      value={{
        trip,
        isSimulating,
        simulationSpeed,
        currentWaypointIndex,
        waypointFraction,
        notifications,
        geofenceEvents,
        parentPreferences,
        unreadCount,
        startTrip,
        endTrip,
        boardStudent,
        dropStudent,
        reportEmergency,
        clearEmergency,
        toggleSimulation,
        setSimulationSpeed,
        jumpToStep,
        resetTrip,
        markAllNotificationsRead,
        markNotificationRead,
        addCustomNotification,
        updateParentPreferences,
      }}
    >
      {children}
    </TransportContext.Provider>
  );
};

export const useTransport = () => {
  const context = useContext(TransportContext);
  if (!context) {
    throw new Error('useTransport must be used within a TransportProvider');
  }
  return context;
};
