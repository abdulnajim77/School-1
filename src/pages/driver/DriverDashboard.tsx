import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bus,
  Navigation,
  Play,
  Square,
  ShieldAlert,
  Users,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Radio,
  FileText,
  PhoneCall,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useTransport } from '../../context/TransportContext';
import { formatDistance } from '../../utils/geo';

export const DriverDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { school, students, buses } = useSchoolData();
  const {
    trip,
    startTrip,
    endTrip,
    reportEmergency,
    clearEmergency,
    geofenceEvents,
  } = useTransport();

  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [emergencyType, setEmergencyType] = useState('Vehicle Breakdown');
  const [emergencyDetails, setEmergencyDetails] = useState('Puncture on Grand Trunk Road near Serampore. Mechanic arriving in 10 mins.');

  const isTripActive = trip.status !== 'NOT_STARTED' && trip.status !== 'COMPLETED';

  // Driver metrics
  const routeStudents = students.filter((s) => s.busId === 'bus_003');
  const totalAssigned = 28; // Standard capacity
  const onLeaveCount = students.filter((s) => s.currentTransportStatus === 'SCHOOL_LEAVE').length || 2;
  const transportSkipCount = students.filter((s) => s.currentTransportStatus === 'TRANSPORT_SKIP').length || 1;
  const expectedPickup = totalAssigned - onLeaveCount - transportSkipCount;

  const handleEmergencySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reportEmergency(emergencyType, emergencyDetails);
    setIsEmergencyModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      {/* Top Greeting & Bus Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span className="font-semibold text-blue-600">Driver Console</span>
            <span>&bull;</span>
            <span>{school.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#172033] tracking-tight">
            Good Morning, {user?.name || 'Sanjay'}
          </h1>
          <p className="text-xs text-slate-500">
            Assigned: <strong className="text-slate-800">Bus 03</strong> &bull; Vehicle: <strong className="text-slate-800">WB-16A-1234</strong> &bull; Route A
          </p>
        </div>

        {/* GPS Live Status Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-800 border border-green-200 rounded-2xl text-xs font-bold self-start">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          GPS & GEOFENCING ACTIVE
        </div>
      </div>

      {/* Emergency Alert Active Banner */}
      {trip.emergencyReported && (
        <div className="p-4 rounded-3xl bg-red-600 text-white shadow-lg flex items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 flex-shrink-0" />
            <div>
              <h4 className="font-black text-sm uppercase">Active Emergency Broadcasted</h4>
              <p className="text-xs text-red-100">{trip.emergencyReported.type}: {trip.emergencyReported.details}</p>
            </div>
          </div>
          <button
            onClick={clearEmergency}
            className="px-3 py-1.5 bg-white text-red-700 font-extrabold text-xs rounded-xl shadow-xs hover:bg-red-50 flex-shrink-0"
          >
            Mark Resolved
          </button>
        </div>
      )}

      {/* TRIP CONTROLS HERO CARD */}
      <div className="bg-gradient-to-br from-[#253B80] to-[#1C2C60] text-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-blue-900/10 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md">
              <Bus className="w-6 h-6 text-blue-300" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200">
                Current Active Mission
              </span>
              <h2 className="text-xl sm:text-2xl font-black">
                {trip.tripType === 'morning_pickup' ? 'Morning Pickup Route A' : 'Afternoon Return Route A'}
              </h2>
            </div>
          </div>

          <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-extrabold text-blue-100">
            {trip.status.replace('_', ' ')}
          </span>
        </div>

        {/* Live Trip Telemetry */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-xs">
          <div>
            <span className="text-[10px] text-blue-200 block uppercase font-medium">Next Designated Stop</span>
            <span className="font-bold text-white text-sm block truncate mt-0.5">{trip.nextStopName}</span>
          </div>
          <div>
            <span className="text-[10px] text-blue-200 block uppercase font-medium">Distance</span>
            <span className="font-bold text-white text-sm block mt-0.5">{formatDistance(trip.distanceToNextStopMeters)}</span>
          </div>
          <div>
            <span className="text-[10px] text-blue-200 block uppercase font-medium">Current Speed</span>
            <span className="font-bold text-white text-sm block mt-0.5">{trip.speed} km/h</span>
          </div>
          <div>
            <span className="text-[10px] text-blue-200 block uppercase font-medium">ETA to Stop</span>
            <span className="font-black text-amber-300 text-sm block mt-0.5">{trip.etaNextStopMinutes} Mins</span>
          </div>
        </div>

        {/* Start / End Massive Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          {!isTripActive ? (
            <button
              onClick={() => startTrip('morning_pickup')}
              className="flex-1 py-4 px-6 bg-green-500 hover:bg-green-600 text-slate-950 font-black text-sm uppercase tracking-wider rounded-2xl shadow-lg shadow-green-500/30 transition flex items-center justify-center gap-2 transform active:scale-98"
            >
              <Play className="w-5 h-5 fill-slate-950" />
              START MORNING TRIP (ROUTE A)
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate('/driver/route')}
                className="flex-1 py-4 px-6 bg-blue-500 hover:bg-blue-400 text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-lg transition flex items-center justify-center gap-2"
              >
                <Navigation className="w-5 h-5" />
                OPEN STUDENT BOARDING LIST &bull; {trip.boardedStudentIds.length} BOARDED
              </button>
              <button
                onClick={endTrip}
                className="py-4 px-6 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider rounded-2xl border border-white/20 transition flex items-center justify-center gap-2"
              >
                <Square className="w-4 h-4 fill-white" />
                END TRIP
              </button>
            </>
          )}
        </div>
      </div>

      {/* PRE-TRIP ROUTE AUDIT: LEAVES & SKIPS (Crucial Selling Point) */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/80 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <Users className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="font-extrabold text-base text-[#172033]">
                Today’s Student Manifest & Stop Audit
              </h3>
              <p className="text-xs text-slate-400">Automated from approved leaves and parent bus skips</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/driver/leave-audit')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800"
          >
            Full Details &rarr;
          </button>
        </div>

        {/* 4 Summary Stat Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Assigned</span>
            <span className="text-2xl font-black text-slate-900 mt-0.5">{totalAssigned}</span>
            <span className="text-[10px] text-slate-500">Students</span>
          </div>

          <div className="p-3.5 bg-amber-50/60 rounded-2xl border border-amber-200">
            <span className="text-[10px] font-bold text-amber-800 uppercase block">On Leave</span>
            <span className="text-2xl font-black text-amber-600 mt-0.5">{onLeaveCount}</span>
            <span className="text-[10px] text-amber-700 font-semibold">Do Not Stop</span>
          </div>

          <div className="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-200">
            <span className="text-[10px] font-bold text-blue-800 uppercase block">Transport Skip</span>
            <span className="text-2xl font-black text-blue-600 mt-0.5">{transportSkipCount}</span>
            <span className="text-[10px] text-blue-700 font-semibold">Self Drop</span>
          </div>

          <div className="p-3.5 bg-green-50/70 rounded-2xl border border-green-200">
            <span className="text-[10px] font-bold text-green-800 uppercase block">Expected Pickup</span>
            <span className="text-2xl font-black text-green-700 mt-0.5">{expectedPickup}</span>
            <span className="text-[10px] text-green-800 font-semibold">Active Pickups</span>
          </div>
        </div>

        {/* Quick List Preview */}
        <div className="space-y-2 pt-2 text-xs">
          <div className="p-3 rounded-2xl bg-amber-50/40 border border-amber-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <div>
                <span className="font-bold text-slate-900">Riya Das</span>
                <span className="text-slate-500 text-[11px] block">Jyoti More Stop</span>
              </div>
            </div>
            <span className="px-2.5 py-1 text-[10px] font-extrabold rounded-lg bg-amber-100 text-amber-800">
              ON APPROVED LEAVE &bull; SKIP PICKUP
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
              <div>
                <span className="font-bold text-slate-900">Arjun Roy</span>
                <span className="text-slate-500 text-[11px] block">Station Road Stop</span>
              </div>
            </div>
            <span className="px-2.5 py-1 text-[10px] font-extrabold rounded-lg bg-green-100 text-green-800">
              PICKUP REQUIRED
            </span>
          </div>
        </div>
      </div>

      {/* REPORT EMERGENCY BUTTON */}
      <div className="p-6 bg-red-50/60 rounded-3xl border border-red-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-black text-sm text-red-950 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-600" />
            Driver Safety & Incident Dispatch
          </h4>
          <p className="text-xs text-red-700 mt-0.5">
            Instantly alert parents and school administration in case of mechanical issues, traffic delay or emergency.
          </p>
        </div>

        <button
          onClick={() => setIsEmergencyModalOpen(true)}
          className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-red-600/20 transition flex items-center justify-center gap-2 flex-shrink-0"
        >
          <ShieldAlert className="w-4 h-4" />
          REPORT EMERGENCY
        </button>
      </div>

      {/* Emergency Modal */}
      {isEmergencyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-red-200 overflow-hidden">
            <div className="bg-red-600 px-6 py-4 text-white">
              <h3 className="font-black text-base flex items-center gap-2">
                <ShieldAlert className="w-5 h-5" />
                Report Transport Emergency
              </h3>
              <p className="text-xs text-red-100">Broadcasts instant alerts to parents and administration</p>
            </div>

            <form onSubmit={handleEmergencySubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Emergency Category</label>
                <select
                  value={emergencyType}
                  onChange={(e) => setEmergencyType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold focus:outline-none focus:border-red-600"
                >
                  <option value="Vehicle Breakdown">Vehicle Breakdown</option>
                  <option value="Traffic Delay">Severe Traffic Delay</option>
                  <option value="Accident">Accident</option>
                  <option value="Medical Emergency">Medical Emergency</option>
                  <option value="Route Blocked">Route Blocked / Flooded</option>
                  <option value="Other">Other Emergency</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Incident Details & Status</label>
                <textarea
                  rows={3}
                  required
                  value={emergencyDetails}
                  onChange={(e) => setEmergencyDetails(e.target.value)}
                  placeholder="Provide precise location and reassurance to parents..."
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-red-600"
                ></textarea>
              </div>

              <div className="p-3 bg-red-50 rounded-xl text-red-800 text-[11px] leading-relaxed">
                Notice: All relevant parents and school security will immediately receive push notifications and SMS alert.
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEmergencyModalOpen(false)}
                  className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-extrabold uppercase rounded-xl transition"
                >
                  Confirm & Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
