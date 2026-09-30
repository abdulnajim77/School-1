import React, { useState } from 'react';
import {
  Bus,
  Phone,
  Navigation,
  RefreshCw,
  AlertTriangle,
  Clock,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useTransport } from '../../context/TransportContext';
import { InteractiveMap } from '../../components/common/InteractiveMap';
import { CallDriverModal } from '../../components/common/CallDriverModal';
import { formatDistance } from '../../utils/geo';

export const LiveBusTrackingPage: React.FC = () => {
  const { selectedStudentId } = useAuth();
  const { school, students, routes } = useSchoolData();
  const { trip, geofenceEvents, resetTrip } = useTransport();

  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const student = students.find((s) => s.id === selectedStudentId) || students[0];
  const route = routes.find((r) => r.id === trip.routeId) || routes[0];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <div className="space-y-5 pb-16">
      {/* Top Breadcrumb & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Transport</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="font-semibold text-blue-600">Live GPS Tracking</span>
          </div>
          <h1 className="text-2xl font-black text-[#172033] tracking-tight">
            Live School Transport Tracking
          </h1>
          <p className="text-xs text-slate-500">
            Real-time geofenced location of <strong className="text-slate-800">{trip.busNumber}</strong> for {student.fullName}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-xs transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => setIsCallModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#253B80] hover:bg-[#1C2C60] text-white rounded-xl text-xs font-bold shadow-sm transition"
          >
            <Phone className="w-3.5 h-3.5 text-green-400" />
            Call Driver
          </button>
        </div>
      </div>

      {/* Emergency Alert Banner if reported */}
      {trip.emergencyReported && (
        <div className="p-4 rounded-2xl bg-red-50 border-2 border-red-300 text-red-900 flex items-start gap-3 shadow-md animate-pulse">
          <ShieldAlert className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-extrabold text-sm uppercase tracking-wide text-red-800">
              Transport Alert: {trip.emergencyReported.type}
            </h4>
            <p className="text-xs text-red-700 font-medium mt-0.5">
              {trip.emergencyReported.details}
            </p>
            <p className="text-[11px] text-red-600 mt-1">
              All students are confirmed safe. School transport control room has responded.
            </p>
          </div>
        </div>
      )}

      {/* Main Map & Live Telemetry Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Map Canvas */}
        <div className="lg:col-span-2 space-y-4">
          <InteractiveMap
            busPosition={{
              latitude: trip.currentLatitude,
              longitude: trip.currentLongitude,
            }}
            busHeading={trip.heading}
            busSpeed={trip.speed}
            schoolPosition={{
              latitude: school.latitude,
              longitude: school.longitude,
            }}
            schoolRadiusMeters={school.geofenceRadius}
            studentPickupPosition={{
              latitude: student.pickupLatitude,
              longitude: student.pickupLongitude,
            }}
            studentPickupRadiusMeters={student.pickupRadius}
            stops={route.stops}
            highlightStudentStopName={student.pickupPointName}
            statusLabel={trip.status.replace('_', ' ')}
            className="h-[480px] w-full"
          />

          {/* Quick Route Leg Markers */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between text-xs overflow-x-auto">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <span className="font-bold text-slate-800">Route A:</span>
              <span className="text-slate-500">Chandannagar Station &rarr; Jyoti More &rarr; School</span>
            </div>
            <div className="flex items-center gap-4 text-slate-500 font-mono text-[11px]">
              <span>Trip Type: <strong className="text-slate-800">{trip.tripType === 'morning_pickup' ? 'Morning Pickup' : 'Afternoon Return'}</strong></span>
              <span>Speed: <strong className="text-slate-800">{trip.speed} km/h</strong></span>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Floating Information Card & Timeline */}
        <div className="space-y-4">
          {/* Floating Information Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Active Vehicle
                </span>
                <h3 className="text-xl font-black text-[#172033] leading-none">
                  {trip.busNumber}
                </h3>
                <span className="font-mono text-xs text-slate-500 font-semibold">{trip.vehicleNumber}</span>
              </div>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
                {trip.status.replace('_', ' ')}
              </span>
            </div>

            {/* Telemetry Metrics */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-blue-50/60 border border-blue-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">
                  Distance to Stop
                </span>
                <span className="text-base font-extrabold text-blue-900 block mt-0.5">
                  {formatDistance(trip.distanceToNextStopMeters)}
                </span>
                <span className="text-[10px] text-blue-700">{student.pickupPointName}</span>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">
                  Estimated Arrival
                </span>
                <span className="text-base font-extrabold text-amber-900 block mt-0.5">
                  {trip.etaNextStopMinutes} Mins ETA
                </span>
                <span className="text-[10px] text-amber-700">Expected: ~ 08:12 AM</span>
              </div>
            </div>

            {/* Crew Details */}
            <div className="space-y-2 text-xs pt-1">
              <div className="flex items-center justify-between text-slate-600">
                <span className="text-slate-400 font-medium">Assigned Driver:</span>
                <span className="font-bold text-slate-800">{trip.driverName}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="text-slate-400 font-medium">Helper / Attendant:</span>
                <span className="font-bold text-slate-800">{trip.helperName}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="text-slate-400 font-medium">Current Speed:</span>
                <span className="font-bold text-slate-800">{trip.speed} km/h</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="text-slate-400 font-medium">Last GPS Ping:</span>
                <span className="font-mono text-slate-500 font-semibold">{trip.lastUpdated}</span>
              </div>
            </div>

            {/* Call and Emergency CTAs */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setIsCallModalOpen(true)}
                className="w-full py-2.5 px-4 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                Call Driver ({trip.driverName})
              </button>
              <a
                href={`tel:${school.phone}`}
                className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                School Safety Helpdesk
              </a>
            </div>
          </div>

          {/* Trip Timeline Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-600" />
              Trip Progress Timeline
            </h4>

            <div className="space-y-4 text-xs relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              <div className="relative">
                <span className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-blue-600 ring-4 ring-blue-100"></span>
                <div className="font-bold text-slate-900">7:30 AM — Trip Started</div>
                <div className="text-[11px] text-slate-500">Bus departed Chandannagar Station</div>
              </div>

              <div className="relative">
                <span className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-blue-600 ring-4 ring-blue-100"></span>
                <div className="font-bold text-slate-900">7:41 AM — Stop 1 Completed</div>
                <div className="text-[11px] text-slate-500">Arjun Roy boarded safely at Station Road</div>
              </div>

              <div className="relative">
                <span
                  className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full ${
                    student.currentTransportStatus === 'BOARDED' || student.currentTransportStatus === 'REACHED_SCHOOL'
                      ? 'bg-green-600 ring-4 ring-green-100'
                      : 'bg-amber-400 ring-4 ring-amber-100 animate-pulse'
                  }`}
                ></span>
                <div className="font-bold text-slate-900">
                  {student.currentTransportStatus === 'BOARDED' || student.currentTransportStatus === 'REACHED_SCHOOL'
                    ? '7:48 AM — Riya Boarded'
                    : 'Approx 7:48 AM — Riya Pickup'}
                </div>
                <div className="text-[11px] text-slate-500">Jyoti More (Strand Road crossing)</div>
              </div>

              <div className="relative">
                <span
                  className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full ${
                    student.currentTransportStatus === 'REACHED_SCHOOL'
                      ? 'bg-purple-600 ring-4 ring-purple-100'
                      : 'bg-slate-300'
                  }`}
                ></span>
                <div className="font-bold text-slate-900">8:31 AM — Expected School Arrival</div>
                <div className="text-[11px] text-slate-500">Little Star Kids Academy Main Gate</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Geofence Event Log for this trip */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-sm text-[#172033]">Live Geofence Event Audit</h3>
          </div>
          <span className="text-[11px] font-semibold text-slate-400">Haversine Proximity Log</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[10px] uppercase font-bold text-slate-400 border-b border-slate-100">
                <th className="py-2.5">Time</th>
                <th className="py-2.5">Zone Type</th>
                <th className="py-2.5">Event</th>
                <th className="py-2.5">Message</th>
                <th className="py-2.5 text-right">Coordinates</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {geofenceEvents.slice(0, 5).map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/60">
                  <td className="py-2.5 font-mono text-[11px]">{log.timestamp}</td>
                  <td className="py-2.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        log.zoneType === 'school'
                          ? 'bg-blue-100 text-blue-800'
                          : log.zoneType === 'pickup'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {log.zoneType}
                    </span>
                  </td>
                  <td className="py-2.5 font-bold text-slate-900">{log.eventType}</td>
                  <td className="py-2.5 text-slate-600">{log.message}</td>
                  <td className="py-2.5 font-mono text-[10px] text-right text-slate-400">
                    {log.latitude.toFixed(4)}, {log.longitude.toFixed(4)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Call Driver Modal */}
      <CallDriverModal
        isOpen={isCallModalOpen}
        onClose={() => setIsCallModalOpen(false)}
        driverName={trip.driverName}
        helperName={trip.helperName}
        busNumber={trip.busNumber}
      />
    </div>
  );
};
